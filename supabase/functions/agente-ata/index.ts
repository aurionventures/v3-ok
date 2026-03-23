/**
 * Agente ATA – gera ata formal a partir de transcrição ou notas.
 * Rota: POST /functions/v1/agente-ata
 * Body: { "input": "transcrição ou notas da reunião", "tituloReuniao"?: string, "data"?: string, "participantes"?: string[] }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_ATA } from "./prompt.ts";

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
    const tituloReuniao = body.tituloReuniao ?? "";
    const data = body.data ?? "";
    const participantes = body.participantes ?? [];

    const userContent = [
      tituloReuniao && `Título da reunião: ${tituloReuniao}`,
      data && `Data: ${data}`,
      participantes?.length && `Participantes: ${participantes.join(", ")}`,
      "",
      "Transcrição ou notas:",
      input,
    ]
      .filter(Boolean)
      .join("\n");

    if (!userContent.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' ou 'transcricaoOuNotas' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_ATA,
      userContent,
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
