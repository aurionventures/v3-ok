import { supabase } from "@/lib/supabase";
import { fetchReunioes } from "@/services/agenda";
import type { TarefaRow } from "@/services/gestaoReuniao";
import type { ReuniaoEnriquecida } from "@/types/agenda";

export interface IndicadoresTarefas {
  total: number;
  resolvidas: number;
  pendentes: number;
  taxaResolucao: number;
  statusPieData: { name: string; value: number; color: string }[];
  tarefasPorOrgao: { orgao: string; quantidade: number; fill: string }[];
}

export interface AtasPendentesResumo {
  aguardandoAprovacao: number;
  aguardandoAssinatura: number;
  finalizadas: number;
}

const CORES = {
  resolvidas: "#22c55e",
  pendentes: "#f97316",
  atrasadas: "#ef4444",
  orgao: ["#22c55e", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"],
};

/**
 * Busca todas as tarefas das reuniões da empresa e agrega indicadores.
 */
export async function fetchIndicadoresTarefas(
  empresaId: string | null
): Promise<IndicadoresTarefas> {
  const empty: IndicadoresTarefas = {
    total: 0,
    resolvidas: 0,
    pendentes: 0,
    taxaResolucao: 0,
    statusPieData: [],
    tarefasPorOrgao: [],
  };

  if (!supabase || !empresaId) return empty;

  const reunioes = await fetchReunioes(empresaId);
  const reuniaoIds = reunioes.map((r) => r.id);
  if (reuniaoIds.length === 0) return empty;

  const { data: tarefas, error } = await supabase
    .from("reuniao_tarefas")
    .select("*")
    .in("reuniao_id", reuniaoIds);

  if (error) {
    console.error("[secretariado] fetchIndicadoresTarefas:", error);
    return empty;
  }

  const rows = (tarefas ?? []) as TarefaRow[];
  const reuniaoMap = new Map<string, ReuniaoEnriquecida>();
  for (const r of reunioes) reuniaoMap.set(r.id, r);

  const resolvidas = rows.filter((t) => !!t.data_conclusao).length;
  const pendentes = rows.filter((t) => !t.data_conclusao).length;
  const total = rows.length;
  const taxaResolucao = total > 0 ? Math.round((resolvidas / total) * 100) : 0;

  const statusPieData: { name: string; value: number; color: string }[] = [];
  if (resolvidas > 0) statusPieData.push({ name: "Resolvidas", value: resolvidas, color: CORES.resolvidas });
  if (pendentes > 0) statusPieData.push({ name: "Pendentes", value: pendentes, color: CORES.pendentes });

  const orgaoCount = new Map<string, number>();
  for (const t of rows) {
    const reuniao = reuniaoMap.get(t.reuniao_id);
    const orgao =
      reuniao?.comissao_nome ?? reuniao?.comite_nome ?? reuniao?.conselho_nome ?? reuniao?.titulo ?? "Outros";
    orgaoCount.set(orgao, (orgaoCount.get(orgao) ?? 0) + 1);
  }
  const tarefasPorOrgao = Array.from(orgaoCount.entries()).map(([orgao, quantidade], i) => ({
    orgao,
    quantidade,
    fill: CORES.orgao[i % CORES.orgao.length],
  }));

  return {
    total,
    resolvidas,
    pendentes,
    taxaResolucao,
    statusPieData,
    tarefasPorOrgao,
  };
}

/**
 * Conta atas por status. Como não existem tabelas de aprovação/assinatura,
 * consideramos todas as atas existentes como finalizadas.
 */
export async function fetchAtasPendentesResumo(
  empresaId: string | null
): Promise<AtasPendentesResumo> {
  const empty: AtasPendentesResumo = {
    aguardandoAprovacao: 0,
    aguardandoAssinatura: 0,
    finalizadas: 0,
  };

  if (!supabase || !empresaId) return empty;

  const reunioes = await fetchReunioes(empresaId);
  const reuniaoIds = reunioes.map((r) => r.id);
  if (reuniaoIds.length === 0) return empty;

  const { count, error } = await supabase
    .from("atas")
    .select("id", { count: "exact", head: true })
    .in("reuniao_id", reuniaoIds);

  if (error) {
    console.error("[secretariado] fetchAtasPendentesResumo:", error);
    return empty;
  }

  return {
    aguardandoAprovacao: 0,
    aguardandoAssinatura: 0,
    finalizadas: count ?? 0,
  };
}
