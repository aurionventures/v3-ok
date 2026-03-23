/**
 * Pipeline de Agentes – orquestra chamadas a múltiplos agentes.
 * Rota: POST /functions/v1/pipeline-agentes
 * Body: { "agenteId": string, "input": string | object }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE } from "../agente/prompt.ts";
import { PROMPT_AGENTE_ATA } from "../agente-ata/prompt.ts";
import { PROMPT_AGENTE_ATAS_REUNIOES } from "../agente-atas-reunioes/prompt.ts";
import { PROMPT_AGENTE_DIAGNOSTICO_GOVERNANCA } from "../agente-diagnostico-governanca/prompt.ts";
import { PROMPT_AGENTE_SINAIS_MERCADO } from "../agente-sinais-mercado/prompt.ts";
import { PROMPT_AGENTE_INSIGHTS_ESTRATEGICOS } from "../agente-insights-estrategicos/prompt.ts";
import { PROMPT_AGENTE_PROCESSAMENTO_DOCUMENTOS } from "../agente-processamento-documentos/prompt.ts";
import { PROMPT_AGENTE_PDI_CONSELHO } from "../agente-pdi-conselho/prompt.ts";
import { PROMPT_AGENTE_HISTORICO_PADROES } from "../agente-historico-padroes/prompt.ts";
import { PROMPT_AGENTE_PRIORIDADE_AGENDA } from "../agente-prioridade-agenda/prompt.ts";
import { PROMPT_AGENTE_PAUTAS_SUGESTOES } from "../agente-pautas-sugestoes/prompt.ts";
import { PROMPT_AGENTE_BRIEFING_PAUTAS } from "../agente-briefing-pautas/prompt.ts";

const PROMPTS: Record<string, string> = {
  agente: PROMPT_AGENTE,
  "agente-ata": PROMPT_AGENTE_ATA,
  "agente-atas-reunioes": PROMPT_AGENTE_ATAS_REUNIOES,
  "agente-diagnostico-governanca": PROMPT_AGENTE_DIAGNOSTICO_GOVERNANCA,
  "agente-sinais-mercado": PROMPT_AGENTE_SINAIS_MERCADO,
  "agente-insights-estrategicos": PROMPT_AGENTE_INSIGHTS_ESTRATEGICOS,
  "agente-processamento-documentos": PROMPT_AGENTE_PROCESSAMENTO_DOCUMENTOS,
  "agente-pdi-conselho": PROMPT_AGENTE_PDI_CONSELHO,
  "agente-historico-padroes": PROMPT_AGENTE_HISTORICO_PADROES,
  "agente-prioridade-agenda": PROMPT_AGENTE_PRIORIDADE_AGENDA,
  "agente-pautas-sugestoes": PROMPT_AGENTE_PAUTAS_SUGESTOES,
  "agente-briefing-pautas": PROMPT_AGENTE_BRIEFING_PAUTAS,
};

const AGENT_KEYS: Record<string, string> = {
  agente: "AGENTE",
  "agente-ata": "ATA_REUNIAO",
  "agente-atas-reunioes": "ATA_REUNIAO",
  "agente-diagnostico-governanca": "DIAGNOSTICO_GOVERNANCA",
  "agente-sinais-mercado": "SINAIS_MERCADO",
  "agente-insights-estrategicos": "INSIGHTS_ESTRATEGICOS",
  "agente-processamento-documentos": "PROCESSAMENTO_DOCUMENTOS",
  "agente-pdi-conselho": "PDI_CONSELHO",
  "agente-historico-padroes": "HISTORICO_PADROES",
  "agente-prioridade-agenda": "PRIORIDADE_AGENDA",
  "agente-pautas-sugestoes": "SUGESTOES_PAUTAS",
  "agente-briefing-pautas": "BRIEFING_PAUTAS",
};

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
    const agenteId = body.agenteId ?? body.agente_id ?? "";
    const input = body.input ?? body.entrada ?? "";

    if (!agenteId) {
      return new Response(
        JSON.stringify({ error: "Campo 'agenteId' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = PROMPTS[agenteId];
    if (!prompt) {
      return new Response(
        JSON.stringify({
          error: `Agente desconhecido: ${agenteId}`,
          agentesDisponiveis: Object.keys(PROMPTS),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userContent =
      typeof input === "string" ? input : JSON.stringify(input, null, 2);

    const result = await runAgent({
      systemPrompt: prompt,
      userContent: userContent || "Execute a tarefa solicitada.",
      agentKey: AGENT_KEYS[agenteId],
    });

    return new Response(
      JSON.stringify({ agenteId, resultado: result, raw: result }),
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
