/**
 * Copiloto IA para membros – usa o briefing como base de conhecimento.
 * Chama openai-proxy com contexto do briefing para responder perguntas e sugerir abordagens.
 */

import { invokeEdgeFunction } from "@/lib/supabase";
import type { MembroBriefingRow } from "./membroBriefing";

function buildBriefingContext(b: MembroBriefingRow): string {
  const parts: string[] = [];

  if (b.titulo) parts.push(`# Título\n${b.titulo}`);

  if (b.resumo_executivo) {
    parts.push(`# Resumo Executivo\n${b.resumo_executivo}`);
  }

  if (b.seu_foco) {
    parts.push(`# Seu Foco\n${b.seu_foco}`);
  }

  const perguntas = Array.isArray(b.perguntas_criticas) ? b.perguntas_criticas : [];
  if (perguntas.length > 0) {
    parts.push(`# Perguntas Críticas para Você\n${perguntas.map((q) => `- ${q}`).join("\n")}`);
  }

  if (b.preparacao_recomendada) {
    parts.push(`# Preparação Recomendada\n${b.preparacao_recomendada}`);
  }

  if (b.alertas_contextuais) {
    parts.push(`# Alertas Contextuais\n${b.alertas_contextuais}`);
  }

  const meetingAgenda = (b.dados_completos as { meeting_agenda?: Array<Record<string, unknown>> })?.meeting_agenda ?? [];
  if (meetingAgenda.length > 0) {
    const temas = meetingAgenda
      .map(
        (item) =>
          `- ${item.titulo ?? "Item"}${item.tipo ? ` (${item.tipo})` : ""}${item.horario ? ` - ${item.horario}` : ""}${
            item.decisao_esperada ? ` | Decisão esperada: ${item.decisao_esperada}` : ""
          }`
      )
      .join("\n");
    parts.push(`# Temas da Pauta\n${temas}`);
  }

  return parts.length > 0 ? parts.join("\n\n") : "";
}

const SYSTEM_PROMPT_ASSESSOR = `Você é um assessor que prepara perguntas para reuniões de governança.
Para cada pauta ou documento fornecido, sugira:
1. Perguntas de esclarecimento (dados, fatos).
2. Perguntas de aprofundamento (riscos, alternativas).
3. Perguntas de decisão (critérios, opções).
4. Ordem sugerida e momento adequado (abertura, deliberação, encerramento).
Seja objetivo e acionável.`;

export async function perguntarComBriefing(
  briefing: MembroBriefingRow | null,
  pergunta: string,
  historico?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<{ content: string | null; error: string | null }> {
  const context = briefing ? buildBriefingContext(briefing) : "";

  const systemContent = context
    ? `${SYSTEM_PROMPT_ASSESSOR}

═══════════════════════════════════════════════
BRIEFING DO MEMBRO (base de conhecimento)
═══════════════════════════════════════════════

${context}`
    : `${SYSTEM_PROMPT_ASSESSOR}

O membro ainda não tem um briefing disponível. Sugira que ele aguarde o briefing ser gerado pelo administrador ao aprovar pautas no Copiloto de Governança. Use boas práticas de governança para orientar.`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemContent },
    ...(historico ?? []).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: pergunta.trim() },
  ];

  const { data, error } = await invokeEdgeFunction<{ content?: string }>("openai-proxy", {
    messages,
    model: "gpt-4o-mini",
  }, { useAnonKey: true });

  if (error) return { content: null, error: error.message };
  const err = (data as { error?: string })?.error;
  if (err) return { content: null, error: err };
  return { content: data?.content ?? null, error: null };
}
