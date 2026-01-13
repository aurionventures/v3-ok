// ============================================================================
// EDGE FUNCTION: generate-briefing
// Gera briefings personalizados usando Lovable AI (consolidado do Agent D)
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateBriefingRequest {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY não configurada");
      return new Response(
        JSON.stringify({ 
          error: "API key não configurada",
          content: null 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const body: GenerateBriefingRequest = await req.json();
    
    const {
      systemPrompt,
      userPrompt,
      model = "gpt-4o-mini",
      temperature = 0.7,
      max_tokens = 4000,
    } = body;

    if (!systemPrompt || !userPrompt) {
      return new Response(
        JSON.stringify({ error: "systemPrompt e userPrompt são obrigatórios" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Gerando briefing com modelo ${model}...`);

    // Chamar OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("Erro OpenAI:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Erro ao chamar OpenAI API",
          details: errorText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data: OpenAIResponse = await openaiResponse.json();
    
    if (!data.choices || data.choices.length === 0) {
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const responseContent = data.choices[0].message.content;
    
    // Tentar parsear como JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Erro ao parsear JSON da resposta:", parseError);
      // Retornar conteúdo bruto se não for JSON válido
      parsedContent = { rawContent: responseContent };
    }

    console.log(`Briefing gerado com sucesso. Tokens usados: ${data.usage?.total_tokens || 'N/A'}`);

    return new Response(
      JSON.stringify({
        content: parsedContent,
        usage: data.usage,
        model,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erro na função generate-briefing:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erro interno do servidor",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
