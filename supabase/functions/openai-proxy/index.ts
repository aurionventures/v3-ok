/**
 * Proxy OpenAI – encaminha requisições para a API OpenAI.
 * Útil quando o frontend não deve expor a chave diretamente.
 * Rota: POST /functions/v1/openai-proxy
 *
 * Body: { "messages": [{ "role": "user", "content": "..." }], "model": "gpt-4o-mini" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages, model = "gpt-4o-mini" } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Campo 'messages' (array) é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model,
      messages,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Erro ao chamar OpenAI" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
