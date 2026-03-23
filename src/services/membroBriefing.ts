import { supabase } from "@/lib/supabase";

export interface MembroBriefingRow {
  id: string;
  membro_id: string;
  empresa_id: string;
  reuniao_id: string | null;
  titulo: string | null;
  resumo_executivo: string | null;
  perguntas_criticas: string[];
  seu_foco?: string | null;
  preparacao_recomendada?: string | null;
  alertas_contextuais?: string | null;
  dados_completos?: unknown;
  created_at?: string;
  updated_at?: string;
}

export async function fetchBriefingMembro(
  membroId: string,
  reuniaoIdPrioritaria?: string
): Promise<{ data: MembroBriefingRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  // Se há reuniaoId prioritaria (ex: próxima reunião do membro), tenta buscar briefing dessa reunião primeiro
  if (reuniaoIdPrioritaria) {
    const { data: porReuniao, error: errReuniao } = await supabase
      .from("membro_briefing")
      .select("*")
      .eq("membro_id", membroId)
      .eq("reuniao_id", reuniaoIdPrioritaria)
      .maybeSingle();

    if (!errReuniao && porReuniao) {
      const row = porReuniao as MembroBriefingRow;
      normRow(row);
      return { data: row, error: null };
    }
  }

  const { data, error } = await supabase
    .from("membro_briefing")
    .select("*")
    .eq("membro_id", membroId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[membroBriefing] fetch:", error);
    return { data: null, error: error.message };
  }

  const row = data as MembroBriefingRow | null;
  if (row) normRow(row);
  return { data: row, error: null };
}

function normRow(row: { perguntas_criticas?: unknown }): void {
  if (Array.isArray(row.perguntas_criticas) === false && typeof row.perguntas_criticas === "string") {
    try {
      (row as MembroBriefingRow).perguntas_criticas = JSON.parse(row.perguntas_criticas as string) ?? [];
    } catch {
      (row as MembroBriefingRow).perguntas_criticas = [];
    }
  }
  if (!Array.isArray((row as MembroBriefingRow).perguntas_criticas)) {
    (row as MembroBriefingRow).perguntas_criticas = [];
  }
}

/** Lista todos os briefings do membro (para exibir múltiplas reuniões). */
export async function fetchBriefingsMembro(
  membroId: string
): Promise<{ data: MembroBriefingRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("membro_briefing")
    .select("*, reunioes(titulo, data_reuniao)")
    .eq("membro_id", membroId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[membroBriefing] fetchBriefings:", error);
    return { data: [], error: error.message };
  }

  const rows = (data ?? []) as (MembroBriefingRow & { reunioes?: { titulo?: string; data_reuniao?: string } | null })[];
  for (const row of rows) {
    normRow(row);
  }

  return { data: rows, error: null };
}

export interface MembroBriefingInsert {
  membro_id: string;
  empresa_id: string;
  reuniao_id?: string | null;
  titulo?: string | null;
  resumo_executivo?: string | null;
  perguntas_criticas?: string[];
  seu_foco?: string | null;
  preparacao_recomendada?: string | null;
  alertas_contextuais?: string | null;
  /** Ex: { meeting_agenda: [...] } para o membro estudar os temas da pauta */
  dados_completos?: Record<string, unknown> | null;
}

/**
 * Cria ou atualiza briefing do membro (uso pelo ADM/Secretariado).
 */
export async function upsertBriefingMembro(
  p: MembroBriefingInsert
): Promise<{ data: MembroBriefingRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  let existing: { id: string } | null = null;
  if (p.reuniao_id) {
    const { data } = await supabase
      .from("membro_briefing")
      .select("id")
      .eq("membro_id", p.membro_id)
      .eq("reuniao_id", p.reuniao_id)
      .maybeSingle();
    existing = data as { id: string } | null;
  } else {
    const { data } = await supabase
      .from("membro_briefing")
      .select("id")
      .eq("membro_id", p.membro_id)
      .is("reuniao_id", null)
      .maybeSingle();
    existing = data as { id: string } | null;
  }

  const payload = {
    membro_id: p.membro_id,
    empresa_id: p.empresa_id,
    reuniao_id: p.reuniao_id ?? null,
    titulo: p.titulo ?? null,
    resumo_executivo: p.resumo_executivo ?? null,
    perguntas_criticas: p.perguntas_criticas ?? [],
    seu_foco: p.seu_foco ?? null,
    preparacao_recomendada: p.preparacao_recomendada ?? null,
    alertas_contextuais: p.alertas_contextuais ?? null,
    dados_completos: p.dados_completos ?? null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from("membro_briefing")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: data as MembroBriefingRow, error: null };
  }

  const { data, error } = await supabase
    .from("membro_briefing")
    .insert({ ...payload, created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as MembroBriefingRow, error: null };
}
