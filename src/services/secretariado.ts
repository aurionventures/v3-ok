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

export interface AtaListItem {
  id: string;
  reuniao_id: string;
  titulo: string;
  data_reuniao: string | null;
  status: string;
  conteudo: string | null;
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
 * Conta atas por status (aguardando aprovação, aguardando assinatura, finalizadas).
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

  const { data: atasRows, error } = await supabase
    .from("atas")
    .select("id, status")
    .in("reuniao_id", reuniaoIds);

  if (error) {
    console.error("[secretariado] fetchAtasPendentesResumo:", error);
    return empty;
  }

  const rows = (atasRows ?? []) as Array<{ id: string; status: string | null }>;
  const aguardandoAprovacao = rows.filter((a) => a.status === "aguardando_aprovacao").length;
  const aguardandoAssinatura = rows.filter((a) => a.status === "aguardando_assinatura").length;
  const finalizadas = rows.filter(
    (a) => a.status === "finalizada" || !a.status
  ).length;

  return {
    aguardandoAprovacao,
    aguardandoAssinatura,
    finalizadas,
  };
}

/**
 * Lista ATAs por status para a empresa.
 */
export async function fetchAtasPorStatus(
  empresaId: string | null,
  status: "aguardando_aprovacao" | "aguardando_assinatura"
): Promise<AtaListItem[]> {
  if (!supabase || !empresaId) return [];

  const reunioes = await fetchReunioes(empresaId);
  const reuniaoIds = reunioes.map((r) => r.id);
  if (reuniaoIds.length === 0) return [];

  const { data, error } = await supabase
    .from("atas")
    .select("id, reuniao_id, conteudo, status, reunioes(titulo, data_reuniao)")
    .eq("status", status)
    .in("reuniao_id", reuniaoIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[secretariado] fetchAtasPorStatus:", error);
    return [];
  }

  return (data ?? []).map((a: { id: string; reuniao_id: string; conteudo: string | null; status: string; reunioes?: { titulo: string; data_reuniao: string | null } | null }) => ({
    id: a.id,
    reuniao_id: a.reuniao_id,
    titulo: a.reunioes?.titulo ?? "ATA",
    data_reuniao: a.reunioes?.data_reuniao ?? null,
    status: a.status,
    conteudo: a.conteudo,
  }));
}
