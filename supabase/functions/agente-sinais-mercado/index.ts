/**
 * Agente Sinais de Mercado – ambiente externo, ESG, impacto.
 * Rota: POST /functions/v1/agente-sinais-mercado
 * Body: { "input": "sinais ou contexto de mercado" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_SINAIS_MERCADO } from "./prompt.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const input = body.input ?? body.sinais ?? "";

    if (!input.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' ou 'sinais' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_SINAIS_MERCADO,
      userContent: input,
    });

    return new Response(
      JSON.stringify({ analise: result, raw: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
