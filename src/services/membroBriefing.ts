import { supabase } from "@/lib/supabase";

export interface MembroBriefingRow {
  id: string;
  membro_id: string;
  empresa_id: string;
  reuniao_id: string | null;
  titulo: string | null;
  resumo_executivo: string | null;
  perguntas_criticas: string[];
  created_at?: string;
  updated_at?: string;
}

export async function fetchBriefingMembro(
  membroId: string
): Promise<{ data: MembroBriefingRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

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
  if (row && Array.isArray(row.perguntas_criticas) === false && typeof row.perguntas_criticas === "string") {
    try {
      row.perguntas_criticas = JSON.parse(row.perguntas_criticas as unknown as string) ?? [];
    } catch {
      row.perguntas_criticas = [];
    }
  }
  if (row && !Array.isArray(row.perguntas_criticas)) {
    row.perguntas_criticas = [];
  }

  return { data: row, error: null };
}

export interface MembroBriefingInsert {
  membro_id: string;
  empresa_id: string;
  reuniao_id?: string | null;
  titulo?: string | null;
  resumo_executivo?: string | null;
  perguntas_criticas?: string[];
}

/**
 * Cria ou atualiza briefing do membro (uso pelo ADM/Secretariado).
 */
export async function upsertBriefingMembro(
  p: MembroBriefingInsert
): Promise<{ data: MembroBriefingRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  const { data: existing } = await supabase
    .from("membro_briefing")
    .select("id")
    .eq("membro_id", p.membro_id)
    .eq("reuniao_id", p.reuniao_id ?? null)
    .is("reuniao_id", p.reuniao_id ? null : null)
    .maybeSingle();

  const payload = {
    membro_id: p.membro_id,
    empresa_id: p.empresa_id,
    reuniao_id: p.reuniao_id ?? null,
    titulo: p.titulo ?? null,
    resumo_executivo: p.resumo_executivo ?? null,
    perguntas_criticas: p.perguntas_criticas ?? [],
    updated_at: new Date().toISOString(),
  };

  if ((existing as { id?: string } | null)?.id) {
    const { data, error } = await supabase
      .from("membro_briefing")
      .update(payload)
      .eq("id", (existing as { id: string }).id)
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
