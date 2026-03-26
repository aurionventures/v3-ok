import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { promptId, testInput, testContext } = await req.json();

    if (!promptId) {
      return new Response(
        JSON.stringify({ error: "promptId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the prompt from database
    const { data: prompt, error: promptError } = await supabase
      .from("ai_prompt_library")
      .select("*")
      .eq("id", promptId)
      .single();

    if (promptError || !prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the user prompt by replacing variables
    let userPrompt = prompt.user_prompt_template || "";
    if (testInput && typeof testInput === "object") {
      Object.entries(testInput).forEach(([key, value]) => {
        userPrompt = userPrompt.replace(new RegExp(`{{${key}}}`, "g"), String(value));
      });
    }

    // If no user template, use the test input as context
    if (!userPrompt && testInput) {
      userPrompt = `Contexto: ${JSON.stringify(testInput, null, 2)}`;
    }

    // Build messages
    const messages = [
      { role: "system", content: prompt.system_prompt },
      { role: "user", content: userPrompt }
    ];

    // Add examples if available
    if (prompt.examples && Array.isArray(prompt.examples)) {
      const exampleMessages = prompt.examples.flatMap((ex: any) => [
        { role: "user", content: JSON.stringify(ex.input) },
        { role: "assistant", content: JSON.stringify(ex.output) }
      ]);
      messages.splice(1, 0, ...exampleMessages);
    }

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startTime = Date.now();

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: prompt.model || "google/gemini-3-flash-preview",
        messages,
        temperature: prompt.temperature || 0.7,
        max_tokens: prompt.max_tokens || 4000,
        top_p: prompt.top_p || 1.0,
        frequency_penalty: prompt.frequency_penalty || 0,
        presence_penalty: prompt.presence_penalty || 0,
        ...(prompt.functions ? { tools: prompt.functions, tool_choice: prompt.tool_choice || "auto" } : {})
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI Gateway error", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    
    // Extract response content
    const output = aiData.choices?.[0]?.message?.content || aiData.choices?.[0]?.message?.tool_calls;
    const tokensUsed = aiData.usage?.total_tokens || 0;
    
    // Estimate cost (rough estimation based on model)
    const costPerToken = prompt.model?.includes("gpt-4") ? 0.00003 : 0.000001;
    const costUsd = tokensUsed * costPerToken;

    // Update prompt execution count
    await supabase
      .from("ai_prompt_library")
      .update({
        total_executions: (prompt.total_executions || 0) + 1,
        avg_latency_ms: prompt.avg_latency_ms 
          ? Math.round((prompt.avg_latency_ms + latencyMs) / 2)
          : latencyMs,
        avg_tokens_used: prompt.avg_tokens_used
          ? Math.round((prompt.avg_tokens_used + tokensUsed) / 2)
          : tokensUsed,
        updated_at: new Date().toISOString()
      })
      .eq("id", promptId);

    return new Response(
      JSON.stringify({
        output,
        latency_ms: latencyMs,
        tokens_used: tokensUsed,
        cost_usd: costUsd,
        success: true,
        model: prompt.model
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in test-prompt function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
