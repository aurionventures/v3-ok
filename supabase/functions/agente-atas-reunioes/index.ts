/**
 * Agente ATAs Reuniões – documento formal de ata.
 * Rota: POST /functions/v1/agente-atas-reunioes
 * Body: { "input": "transcrição ou notas" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_ATAS_REUNIOES } from "./prompt.ts";

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
    const input = body.input ?? body.transcricaoOuNotas ?? "";
    const systemPrompt = body.systemPrompt?.trim() || PROMPT_AGENTE_ATAS_REUNIOES;

    if (!input.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt,
      userContent: input,
      agentKey: "ATA_REUNIAO",
    });

    return new Response(
      JSON.stringify({ textoCompleto: result, raw: result }),
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
