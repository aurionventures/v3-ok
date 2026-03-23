import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";

export interface PautaSugeridaIA {
  id: string;
  reuniao_id: string;
  empresa_id: string;
  output_1: {
    strategic_risks?: Array<{ titulo?: string; descricao?: string; fonte?: string; acao?: string }>;
    operational_threats?: Array<{ titulo?: string; descricao?: string; fonte?: string; acao?: string }>;
    strategic_opportunities?: Array<{ titulo?: string; descricao?: string; fonte?: string; acao?: string }>;
  } | null;
  output_2a: {
    meeting_agenda?: Array<{
      horario?: string;
      titulo?: string;
      tipo?: string;
      apresentador?: string;
      materiais?: string;
      perguntas?: string[];
      decisao_esperada?: string;
      conexao?: string;
    }>;
  } | null;
  output_2b: {
    member_briefings?: Array<{
      membro_id?: string;
      membro_nome?: string;
      resumo_executivo?: string;
      seu_foco?: string;
      perguntas_criticas?: string[];
      preparacao_recomendada?: string;
      alertas_contextuais?: string;
    }>;
  } | null;
  metadata: Record<string, unknown> | null;
  status: "pendente" | "aprovada" | "rejeitada";
  created_at: string;
  updated_at: string;
}

export interface CopilotoPautaResult {
  output_1: PautaSugeridaIA["output_1"];
  output_2a: PautaSugeridaIA["output_2a"];
  output_2b: PautaSugeridaIA["output_2b"];
  metadata: PautaSugeridaIA["metadata"];
  raw?: string;
  error?: string;
}

/** Gera pauta com IA e persiste em pauta_sugerida_ia */
export async function gerarPautaComIA(
  empresaId: string,
  reuniaoId: string
): Promise<{ data: PautaSugeridaIA | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<CopilotoPautaResult>(
    "agente-copiloto-governanca",
    { empresa_id: empresaId, reuniao_id: reuniaoId },
    { useAnonKey: true }
  );

  if (error) {
    return { data: null, error: error.message };
  }
  if (data?.error) {
    return { data: null, error: data.error };
  }
  if (!data?.output_1 || !data?.output_2a || !data?.output_2b) {
    return {
      data: null,
      error:
        "Resposta da IA inválida. Verifique OPENAI_API_KEY no Supabase e se há dados suficientes (membros, reuniões, atas).",
    };
  }

  if (!supabase) {
    return { data: null, error: "Supabase não configurado" };
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("pauta_sugerida_ia")
    .insert({
      reuniao_id: reuniaoId,
      empresa_id: empresaId,
      output_1: data.output_1,
      output_2a: data.output_2a,
      output_2b: data.output_2b,
      metadata: data.metadata ?? null,
      status: "pendente",
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertErr) {
    console.error("[copilotoPautas] insert:", insertErr);
    return { data: null, error: insertErr.message };
  }

  return { data: inserted as PautaSugeridaIA, error: null };
}

/** Lista pautas sugeridas por empresa */
export async function fetchPautasSugeridas(empresaId: string): Promise<PautaSugeridaIA[]> {
  if (!supabase || !empresaId) return [];

  const { data, error } = await supabase
    .from("pauta_sugerida_ia")
    .select("*, reunioes(titulo, data_reuniao)")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[copilotoPautas] fetch:", error);
    return [];
  }

  return (data ?? []) as PautaSugeridaIA[];
}

/** Aprova pauta via Edge Function (usa service role para garantir que briefings sejam gravados) */
export async function aprovarPautaSugerida(
  pautaId: string,
  empresaId: string,
  reuniaoId: string
): Promise<{ error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ ok?: boolean; error?: string }>(
    "aprovar-pauta-briefings",
    { pauta_id: pautaId, empresa_id: empresaId, reuniao_id: reuniaoId }
  );

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  if (!data?.ok) return { error: "Resposta inválida da Edge Function" };
  return { error: null };
}

/** Sincroniza briefings para pautas já aprovadas (cria/atualiza para membros alocados). */
export async function syncBriefingsPautasAprovadas(
  empresaId: string,
  pautaId?: string
): Promise<{ error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ ok?: boolean; error?: string }>(
    "sync-briefings-pautas-aprovadas",
    pautaId ? { empresa_id: empresaId, pauta_id: pautaId } : { empresa_id: empresaId }
  );

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  if (!data?.ok) return { error: "Resposta inválida da Edge Function" };
  return { error: null };
}

/** Rejeita pauta sugerida */
export async function rejeitarPautaSugerida(pautaId: string, empresaId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("pauta_sugerida_ia")
    .update({ status: "rejeitada", updated_at: new Date().toISOString() })
    .eq("id", pautaId)
    .eq("empresa_id", empresaId);

  return { error: error?.message ?? null };
}
