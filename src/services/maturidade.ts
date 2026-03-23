/**
 * Serviço de maturidade de governança.
 * Persiste e consulta diagnósticos no banco (tabela diagnosticos).
 */

import { supabase } from "@/lib/supabase";
import type { StoredMaturityAssessment } from "@/utils/maturityStorage";
import { convertStoredDataToRadarData } from "@/utils/maturityStorage";

export interface MaturidadeScore {
  score: number;
  fullMark: number;
}

/**
 * Busca o score de maturidade atual da empresa (último diagnóstico salvo pelo ADM).
 */
export async function fetchMaturidadeScore(
  empresaId: string | null
): Promise<MaturidadeScore | null> {
  if (!supabase || !empresaId) return null;

  const { data, error } = await supabase
    .from("diagnosticos")
    .select("conteudo")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const conteudo = data.conteudo as Record<string, unknown> | null;
  if (!conteudo || typeof conteudo !== "object") return null;

  const stored = conteudo as unknown as StoredMaturityAssessment;
  const dimensions = convertStoredDataToRadarData(stored);
  const valid = dimensions.filter((d) => d.score > 0);

  if (valid.length === 0) return null;

  const score =
    valid.reduce((s, d) => s + d.score, 0) / valid.length;
  return { score: Math.round(score * 10) / 10, fullMark: 5 };
}

/**
 * Salva o diagnóstico de maturidade no banco (chamado pelo ADM ao completar/salvar).
 */
export async function upsertDiagnosticoMaturidade(
  empresaId: string | null,
  stored: StoredMaturityAssessment | null
): Promise<{ error: string | null }> {
  if (!supabase || !empresaId) return { error: "Empresa não selecionada" };
  if (!stored) return { error: null };

  const { error } = await supabase.from("diagnosticos").insert({
    empresa_id: empresaId,
    conteudo: stored as unknown as Record<string, unknown>,
  });

  if (error) {
    console.error("[maturidade] upsertDiagnosticoMaturidade:", error);
    return { error: error.message };
  }

  return { error: null };
}
