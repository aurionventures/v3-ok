/**
 * Agente Processamento de Documentos – extração de texto e metadados.
 * Rota: POST /functions/v1/agente-processamento-documentos
 * Body: { "input": "texto do documento" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_PROCESSAMENTO_DOCUMENTOS } from "./prompt.ts";

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
    const input = body.input ?? body.documento ?? "";

    if (!input.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' ou 'documento' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_PROCESSAMENTO_DOCUMENTOS,
      userContent: input,
      agentKey: "PROCESSAMENTO_DOCUMENTOS",
    });

    return new Response(
      JSON.stringify({ extraido: result, raw: result }),
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
