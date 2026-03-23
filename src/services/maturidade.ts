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
  estagio?: string;
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
  if (!stored?.result) return null;

  const dimensions = convertStoredDataToRadarData(stored);
  const valid = dimensions.filter((d) => d.score > 0);
  if (valid.length === 0) return null;

  const score = stored.result.pontuacao_total != null
    ? Math.round(stored.result.pontuacao_total * 5 * 10) / 10
    : Math.round(valid.reduce((s, d) => s + d.score, 0) / valid.length * 10) / 10;

  return {
    score,
    fullMark: 5,
    estagio: stored.result.estagio,
  };
}

/**
 * Busca o histórico de diagnósticos da empresa (últimos 10, mais recente primeiro).
 */
export async function fetchDiagnosticosHistory(
  empresaId: string | null
): Promise<StoredMaturityAssessment[]> {
  if (!supabase || !empresaId) return [];

  const { data, error } = await supabase
    .from("diagnosticos")
    .select("conteudo")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data?.length) return [];

  return data
    .map((row) => {
      const conteudo = row.conteudo as Record<string, unknown> | null;
      if (!conteudo || typeof conteudo !== "object") return null;
      const stored = conteudo as unknown as StoredMaturityAssessment;
      if (!stored?.result) return null;
      return {
        ...stored,
        timestamp: stored.timestamp ? new Date(stored.timestamp as string) : new Date(),
      };
    })
    .filter((s): s is StoredMaturityAssessment => s != null);
}

/**
 * Busca o último diagnóstico de maturidade da empresa (conteúdo completo).
 */
export async function fetchDiagnosticoMaturidade(
  empresaId: string | null
): Promise<StoredMaturityAssessment | null> {
  if (!supabase || !empresaId) return null;

  const { data, error } = await supabase
    .from("diagnosticos")
    .select("conteudo")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.conteudo) return null;

  const conteudo = data.conteudo as Record<string, unknown>;
  if (!conteudo || typeof conteudo !== "object") return null;

  const stored = conteudo as unknown as StoredMaturityAssessment;
  if (!stored?.result) return null;

  return {
    ...stored,
    timestamp: stored.timestamp ? new Date(stored.timestamp as string) : new Date(),
  };
}

/**
 * Remove todos os diagnósticos de maturidade da empresa.
 */
export async function deleteDiagnosticosMaturidade(
  empresaId: string | null
): Promise<{ error: string | null }> {
  if (!supabase || !empresaId) return { error: "Empresa não selecionada" };

  const { error } = await supabase
    .from("diagnosticos")
    .delete()
    .eq("empresa_id", empresaId);

  if (error) {
    console.error("[maturidade] deleteDiagnosticosMaturidade:", error);
    return { error: error.message };
  }
  return { error: null };
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
