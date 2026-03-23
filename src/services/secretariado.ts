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

export interface AtaFluxoParticipante {
  membro_id: string;
  nome: string;
  email: string | null;
  cargo: string | null;
  aprovado_em: string | null;
  assinado_em: string | null;
}

export interface AtaFluxoDetalhe {
  ata_id: string;
  titulo: string;
  data_reuniao: string | null;
  status: string;
  participantes: AtaFluxoParticipante[];
  aprovados: number;
  assinados: number;
}

export interface TarefaPendenteHistorico {
  id: string;
  nome: string;
  reuniao_id: string;
  reuniao_titulo: string;
  orgao: string;
  responsavel: string;
  prazo: string | null;
  etapa: "aprovacao" | "assinatura" | "tarefa";
}

export interface DashboardIndicadores {
  riscosCriticos: number;
  riscosTotal: number;
  tarefasPendentes: number;
  tarefasTotal: number;
  tarefasResolvidas: number;
  taxaResolucao: number;
  pautasDefinidasPct: number;
  atasGeradasPct: number;
  atasPendentes: number;
  reunioesEsteMes: number;
  orgaosAtivos: number;
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
 * Busca indicadores agregados para o Dashboard.
 */
export async function fetchDashboardIndicadores(
  empresaId: string | null
): Promise<DashboardIndicadores> {
  const empty: DashboardIndicadores = {
    riscosCriticos: 0,
    riscosTotal: 0,
    tarefasPendentes: 0,
    tarefasTotal: 0,
    tarefasResolvidas: 0,
    taxaResolucao: 0,
    pautasDefinidasPct: 0,
    atasGeradasPct: 0,
    atasPendentes: 0,
    reunioesEsteMes: 0,
    orgaosAtivos: 0,
  };

  if (!supabase || !empresaId) return empty;

  const [tarefas, atasResumo, reunioes] = await Promise.all([
    fetchIndicadoresTarefas(empresaId),
    fetchAtasPendentesResumo(empresaId),
    fetchReunioes(empresaId),
  ]);

  const reuniaoIds = reunioes.map((r) => r.id);
  const totalReunioes = reuniaoIds.length;

  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const reunioesEsteMes = reunioes.filter(
    (r) => (r.data_reuniao ?? "").slice(0, 10) >= inicioMes
  ).length;

  const orgaosSet = new Set<string>();
  for (const r of reunioes) {
    if (r.conselho_nome) orgaosSet.add(r.conselho_nome);
    if (r.comite_nome) orgaosSet.add(r.comite_nome);
    if (r.comissao_nome) orgaosSet.add(r.comissao_nome);
  }
  const orgaosAtivos = orgaosSet.size;

  const { count: riscosTotal } = await supabase
    .from("riscos")
    .select("id", { count: "exact", head: true })
    .eq("empresa_id", empresaId);
  const { count: riscosCriticosCount } = await supabase
    .from("riscos")
    .select("id", { count: "exact", head: true })
    .eq("empresa_id", empresaId)
    .or("severidade.eq.critico,severidade.eq.crítico,severidade.eq.alto");

  let reunioesComPautas = 0;
  if (reuniaoIds.length > 0) {
    const { data: pautas } = await supabase
      .from("pautas")
      .select("reuniao_id")
      .in("reuniao_id", reuniaoIds);
    reunioesComPautas = new Set((pautas ?? []).map((p: { reuniao_id: string }) => p.reuniao_id)).size;
  }

  const totalAtas = atasResumo.aguardandoAprovacao + atasResumo.aguardandoAssinatura + atasResumo.finalizadas;
  const pautasDefinidasPct = totalReunioes > 0 ? Math.round((reunioesComPautas / totalReunioes) * 100) : 0;
  const atasGeradasPct = totalReunioes > 0 ? Math.round((totalAtas / totalReunioes) * 100) : 0;
  const atasPendentes = atasResumo.aguardandoAprovacao + atasResumo.aguardandoAssinatura;

  return {
    riscosCriticos: riscosCriticosCount ?? 0,
    riscosTotal: riscosTotal ?? 0,
    tarefasPendentes: tarefas.pendentes,
    tarefasTotal: tarefas.total,
    tarefasResolvidas: tarefas.resolvidas,
    taxaResolucao: tarefas.taxaResolucao,
    pautasDefinidasPct,
    atasGeradasPct,
    atasPendentes,
    reunioesEsteMes,
    orgaosAtivos,
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

  return (data ?? []).map((a: { id: string; reuniao_id: string; conteudo: string | null; status: string; reunioes?: { titulo: string; data_reuniao: string | null }[] | { titulo: string; data_reuniao: string | null } | null }) => {
    const reuniao = Array.isArray(a.reunioes) ? a.reunioes[0] : a.reunioes;
    return {
      id: a.id,
      reuniao_id: a.reuniao_id,
      titulo: reuniao?.titulo ?? "ATA",
      data_reuniao: reuniao?.data_reuniao ?? null,
      status: a.status,
      conteudo: a.conteudo,
    };
  });
}

/**
 * Detalha o fluxo de aprovação/assinatura de uma ATA para exibição no popup do Secretariado.
 */
export async function fetchAtaFluxoDetalhe(
  ataId: string
): Promise<{ data: AtaFluxoDetalhe | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  const { data: ata, error: errAta } = await supabase
    .from("atas")
    .select("id, status, reunioes(titulo, data_reuniao)")
    .eq("id", ataId)
    .maybeSingle();
  if (errAta || !ata) {
    return { data: null, error: errAta?.message ?? "ATA não encontrada" };
  }

  const { data: aprovs, error: errAprovs } = await supabase
    .from("ata_aprovacoes")
    .select("membro_id, aprovado_em, membros_governanca(nome, email, cargo_principal)")
    .eq("ata_id", ataId);
  if (errAprovs) {
    return { data: null, error: errAprovs.message };
  }

  const { data: assins, error: errAssins } = await supabase
    .from("ata_assinaturas")
    .select("membro_id, assinado_em")
    .eq("ata_id", ataId);
  if (errAssins) {
    return { data: null, error: errAssins.message };
  }

  const assinadoPorMembro = new Map<string, string | null>();
  for (const row of assins ?? []) {
    assinadoPorMembro.set(row.membro_id, row.assinado_em ?? null);
  }

  const participantes: AtaFluxoParticipante[] = (aprovs ?? []).map((row) => {
    const membro = Array.isArray(row.membros_governanca) ? row.membros_governanca[0] : row.membros_governanca;
    return {
      membro_id: row.membro_id,
      nome: membro?.nome ?? "Membro",
      email: membro?.email ?? null,
      cargo: membro?.cargo_principal ?? null,
      aprovado_em: row.aprovado_em ?? null,
      assinado_em: assinadoPorMembro.get(row.membro_id) ?? null,
    };
  });

  return {
    data: {
      ata_id: ata.id,
      titulo: (Array.isArray(ata.reunioes) ? ata.reunioes[0] : ata.reunioes)?.titulo ?? "ATA",
      data_reuniao: (Array.isArray(ata.reunioes) ? ata.reunioes[0] : ata.reunioes)?.data_reuniao ?? null,
      status: ata.status ?? "aguardando_aprovacao",
      participantes,
      aprovados: participantes.filter((p) => !!p.aprovado_em).length,
      assinados: participantes.filter((p) => !!p.assinado_em).length,
    },
    error: null,
  };
}

/**
 * Lista histórica de tarefas pendentes para visualização no painel de Secretariado.
 */
export async function fetchHistoricoTarefasPendentes(
  empresaId: string | null
): Promise<TarefaPendenteHistorico[]> {
  if (!supabase || !empresaId) return [];

  const reunioes = await fetchReunioes(empresaId);
  const reuniaoIds = reunioes.map((r) => r.id);
  if (reuniaoIds.length === 0) return [];

  const reuniaoMap = new Map<string, ReuniaoEnriquecida>();
  for (const r of reunioes) reuniaoMap.set(r.id, r);

  const { data: aprovs, error: errAprovs } = await supabase
    .from("ata_aprovacoes")
    .select("ata_id, membro_id, aprovado_em, atas!inner(reuniao_id), membros_governanca(nome)")
    .is("aprovado_em", null);
  if (errAprovs) {
    console.error("[secretariado] fetchHistoricoTarefasPendentes/aprov:", errAprovs);
    return [];
  }

  const { data: assins, error: errAssins } = await supabase
    .from("ata_assinaturas")
    .select("ata_id, membro_id, assinado_em, atas!inner(reuniao_id), membros_governanca(nome)")
    .is("assinado_em", null);
  if (errAssins) {
    console.error("[secretariado] fetchHistoricoTarefasPendentes/assin:", errAssins);
    return [];
  }

  const itensAprovacao = (aprovs ?? []).map((row: {
    ata_id: string;
    membro_id: string;
    atas: { reuniao_id: string }[] | { reuniao_id: string };
    membros_governanca: { nome: string }[] | { nome: string } | null;
  }) => {
    const ata = Array.isArray(row.atas) ? row.atas[0] : row.atas;
    const reuniao = reuniaoMap.get(ata?.reuniao_id ?? "");
    const membro = Array.isArray(row.membros_governanca) ? row.membros_governanca[0] : row.membros_governanca;
    const orgao = reuniao?.comissao_nome ?? reuniao?.comite_nome ?? reuniao?.conselho_nome ?? reuniao?.titulo ?? "Órgão";
    return {
      id: `aprov-${row.ata_id}-${row.membro_id}`,
      nome: "Aprovar ATA",
      reuniao_id: ata?.reuniao_id ?? "",
      reuniao_titulo: reuniao?.titulo ?? orgao,
      orgao,
      responsavel: membro?.nome ?? "Membro",
      prazo: reuniao?.data_reuniao ?? null,
      etapa: "aprovacao" as const,
    };
  }).filter((i) => reuniaoIds.includes(i.reuniao_id));

  const itensAssinatura = (assins ?? []).map((row: {
    ata_id: string;
    membro_id: string;
    atas: { reuniao_id: string }[] | { reuniao_id: string };
    membros_governanca: { nome: string }[] | { nome: string } | null;
  }) => {
    const ata = Array.isArray(row.atas) ? row.atas[0] : row.atas;
    const reuniao = reuniaoMap.get(ata?.reuniao_id ?? "");
    const membro = Array.isArray(row.membros_governanca) ? row.membros_governanca[0] : row.membros_governanca;
    const orgao = reuniao?.comissao_nome ?? reuniao?.comite_nome ?? reuniao?.conselho_nome ?? reuniao?.titulo ?? "Órgão";
    return {
      id: `assin-${row.ata_id}-${row.membro_id}`,
      nome: "Assinar ATA",
      reuniao_id: ata?.reuniao_id ?? "",
      reuniao_titulo: reuniao?.titulo ?? orgao,
      orgao,
      responsavel: membro?.nome ?? "Membro",
      prazo: reuniao?.data_reuniao ?? null,
      etapa: "assinatura" as const,
    };
  }).filter((i) => reuniaoIds.includes(i.reuniao_id));

  const { data: membrosGov } = await supabase
    .from("membros_governanca")
    .select("nome")
    .eq("empresa_id", empresaId);
  const nomesMembros = new Set(
    (membrosGov ?? [])
      .map((m: { nome: string | null }) => (m.nome ?? "").trim().toLowerCase())
      .filter(Boolean)
  );

  const { data: tarefasPendentes } = await supabase
    .from("reuniao_tarefas")
    .select("id, reuniao_id, nome, responsavel, data_conclusao")
    .in("reuniao_id", reuniaoIds)
    .is("data_conclusao", null)
    .order("created_at", { ascending: false });

  const itensTarefasCombinados = (tarefasPendentes ?? [])
    .map((t: {
      id: string;
      reuniao_id: string;
      nome: string;
      responsavel: string;
      data_conclusao: string | null;
    }) => {
      const reuniao = reuniaoMap.get(t.reuniao_id);
      const orgao =
        reuniao?.comissao_nome ??
        reuniao?.comite_nome ??
        reuniao?.conselho_nome ??
        reuniao?.titulo ??
        "Órgão";
      return {
        id: `tarefa-${t.id}`,
        nome: t.nome,
        reuniao_id: t.reuniao_id,
        reuniao_titulo: reuniao?.titulo ?? orgao,
        orgao,
        responsavel: t.responsavel || "Não definido",
        prazo: t.data_conclusao,
        etapa: "tarefa" as const,
      };
    })
    .filter((t) => nomesMembros.has((t.responsavel ?? "").trim().toLowerCase()));

  return [...itensAprovacao, ...itensAssinatura, ...itensTarefasCombinados];
}
