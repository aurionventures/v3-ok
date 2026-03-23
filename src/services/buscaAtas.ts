import { invokeEdgeFunction } from "@/lib/supabase";
import { fetchAtas } from "./atas";
import { fetchReunioes } from "./agenda";
import type { AtaComReuniao } from "./atas";

export interface BuscaAtasResult {
  resultado: string;
  error?: string;
}

/**
 * Busca semântica em atas com base na pergunta do usuário.
 * Usa o agente-busca-atas que aplica o prompt de análise.
 * Retorna as atas utilizadas na busca para exibição como arquivos clicáveis.
 */
export async function buscarNasAtas(
  pergunta: string,
  empresaId: string | null
): Promise<{
  resultado: string;
  atas: AtaComReuniao[];
  error: string | null;
}> {
  const trimmed = pergunta.trim();
  if (!trimmed) {
    return { resultado: "", atas: [], error: "Pergunta é obrigatória" };
  }

  let atas: AtaComReuniao[] = [];
  if (empresaId) {
    const reunioes = await fetchReunioes(empresaId);
    const reuniaoIds = new Set(reunioes.map((r) => r.id));
    const { data } = await fetchAtas();
    atas = (data ?? []).filter((a) => reuniaoIds.has(a.reuniao_id));
  } else {
    const { data } = await fetchAtas();
    atas = data ?? [];
  }

  const atasPayload = atas.map((a) => ({
    titulo: a.reunioes?.titulo ?? "ATA",
    data_reuniao: a.reunioes?.data_reuniao ?? null,
    conteudo: a.conteudo ?? "",
  }));

  const { data, error } = await invokeEdgeFunction<BuscaAtasResult>(
    "agente-busca-atas",
    { pergunta: trimmed, atas: atasPayload }
  );

  if (error) {
    return { resultado: "", atas: [], error: error.message };
  }

  const resultado = data?.resultado ?? data?.raw ?? "";
  return {
    resultado: resultado || "Nenhum resultado encontrado.",
    atas,
    error: null,
  };
}
