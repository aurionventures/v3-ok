import { addDays, setDate, endOfMonth, getDay, format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";
import type { ReuniaoRow, ReuniaoEnriquecida, ReuniaoInsert } from "@/types/agenda";

export interface ConvidadoInsert {
  reuniao_id: string;
  email: string;
  senha_provisoria: string;
  senha_valida_ate: string;
}

/** Gera datas de reunião para um ano com base em frequência e regra do dia */
export function gerarDatasReunioes(
  ano: number,
  frequencia: string,
  diaReuniao: string
): string[] {
  const mesesPorFrequencia: Record<string, number[]> = {
    mensal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bimestral: [1, 3, 5, 7, 9, 11],
    trimestral: [1, 4, 7, 10],
    semestral: [1, 7],
    anual: [1],
    avulsa: [1], // uma única reunião no ano (primeira ocorrência conforme regra do dia)
  };
  const meses = mesesPorFrequencia[frequencia] ?? mesesPorFrequencia.mensal;

  const obterDataNoMes = (ano: number, mes: number): Date | null => {
    const primeiro = new Date(ano, mes - 1, 1);
    const ultimo = endOfMonth(primeiro);

    const regras: Record<string, () => Date | null> = {
      primeiro_segunda: () => {
        let d = new Date(ano, mes - 1, 1);
        while (getDay(d) !== 1) d = addDays(d, 1);
        return d;
      },
      segundo_terca: () => {
        let d = new Date(ano, mes - 1, 1);
        while (getDay(d) !== 2) d = addDays(d, 1);
        return addDays(d, 7);
      },
      terceira_quarta: () => {
        let d = new Date(ano, mes - 1, 1);
        while (getDay(d) !== 3) d = addDays(d, 1);
        return addDays(d, 14);
      },
      ultima_sexta: () => {
        let d = new Date(ultimo);
        while (getDay(d) !== 5) d = addDays(d, -1);
        return d;
      },
      dia_10: () => (ultimo.getDate() >= 10 ? setDate(primeiro, 10) : null),
      dia_15: () => (ultimo.getDate() >= 15 ? setDate(primeiro, 15) : null),
      dia_20: () => (ultimo.getDate() >= 20 ? setDate(primeiro, 20) : null),
    };
    const fn = regras[diaReuniao];
    return fn ? fn() : null;
  };

  const datas: string[] = [];
  for (const mes of meses) {
    const d = obterDataNoMes(ano, mes);
    if (d) datas.push(format(d, "yyyy-MM-dd"));
  }
  return datas;
}

export async function fetchReunioes(
  empresaId: string,
  ano?: number
): Promise<ReuniaoEnriquecida[]> {
  if (!supabase) return [];
  const { data: conselhos } = await supabase.from("conselhos").select("id").eq("empresa_id", empresaId);
  const { data: comites } = await supabase.from("comites").select("id").eq("empresa_id", empresaId);
  const { data: comissoes } = await supabase.from("comissoes").select("id").eq("empresa_id", empresaId);
  const conselhoIds = (conselhos ?? []).map((c: { id: string }) => c.id);
  const comiteIds = (comites ?? []).map((c: { id: string }) => c.id);
  const comissaoIds = (comissoes ?? []).map((c: { id: string }) => c.id);

  const orClauses: string[] = [`empresa_id.eq.${empresaId}`];
  if (conselhoIds.length) orClauses.push(`conselho_id.in.(${conselhoIds.join(",")})`);
  if (comiteIds.length) orClauses.push(`comite_id.in.(${comiteIds.join(",")})`);
  if (comissaoIds.length) orClauses.push(`comissao_id.in.(${comissaoIds.join(",")})`);

  const { data, error } = await supabase
    .from("reunioes")
    .select("*")
    .or(orClauses.join(","));

  if (error) {
    console.error("[agenda] fetchReunioes:", error);
    return [];
  }
  const rows = (data ?? []) as ReuniaoRow[];
  const allConselhoIds = [...new Set(rows.map((r) => r.conselho_id).filter(Boolean) as string[])];
  const allComiteIds = [...new Set(rows.map((r) => r.comite_id).filter(Boolean) as string[])];
  const allComissaoIds = [...new Set(rows.map((r) => r.comissao_id).filter(Boolean) as string[])];

  const conselhosMap = new Map<string, string>();
  const comitesMap = new Map<string, string>();
  const comissoesMap = new Map<string, string>();
  if (allConselhoIds.length) {
    const { data: d } = await supabase.from("conselhos").select("id, nome").in("id", allConselhoIds);
    for (const r of d ?? []) conselhosMap.set(r.id, r.nome);
  }
  if (allComiteIds.length) {
    const { data: d } = await supabase.from("comites").select("id, nome").in("id", allComiteIds);
    for (const r of d ?? []) comitesMap.set(r.id, r.nome);
  }
  if (allComissaoIds.length) {
    const { data: d } = await supabase.from("comissoes").select("id, nome").in("id", allComissaoIds);
    for (const r of d ?? []) comissoesMap.set(r.id, r.nome);
  }

  let result: ReuniaoEnriquecida[] = rows.map((r) => ({
    ...r,
    conselho_nome: r.conselho_id ? conselhosMap.get(r.conselho_id) ?? null : null,
    comite_nome: r.comite_id ? comitesMap.get(r.comite_id) ?? null : null,
    comissao_nome: r.comissao_id ? comissoesMap.get(r.comissao_id) ?? null : null,
  }));

  if (ano != null) {
    result = result.filter((r) => {
      if (!r.data_reuniao) return false;
      return new Date(r.data_reuniao).getFullYear() === ano;
    });
  }
  result.sort((a, b) => {
    const da = a.data_reuniao ? new Date(a.data_reuniao).getTime() : 0;
    const db = b.data_reuniao ? new Date(b.data_reuniao).getTime() : 0;
    return da - db;
  });
  return result;
}

export async function insertReuniao(p: ReuniaoInsert): Promise<{ data: ReuniaoRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const { data, error } = await supabase
    .from("reunioes")
    .insert({
      empresa_id: p.empresa_id,
      conselho_id: p.conselho_id ?? null,
      comite_id: p.comite_id ?? null,
      comissao_id: p.comissao_id ?? null,
      virtual_tipo: p.virtual_tipo ?? null,
      titulo: p.titulo,
      data_reuniao: p.data_reuniao,
      horario: p.horario ?? null,
      tipo: p.tipo,
      status: p.status ?? "agendada",
    })
    .select()
    .single();
  if (error) {
    console.error("[agenda] insertReuniao:", error);
    return { data: null, error: error.message };
  }
  return { data: data as ReuniaoRow, error: null };
}

export async function insertReunioesEmLote(
  itens: Omit<ReuniaoInsert, "empresa_id">[],
  empresaId: string
): Promise<{ count: number; error: string | null }> {
  if (!supabase) return { count: 0, error: "Supabase não configurado" };
  const rows = itens.map((p) => ({
    empresa_id: empresaId,
    conselho_id: p.conselho_id ?? null,
    comite_id: p.comite_id ?? null,
    comissao_id: p.comissao_id ?? null,
    virtual_tipo: p.virtual_tipo ?? null,
    titulo: p.titulo,
    data_reuniao: p.data_reuniao,
    horario: p.horario ?? null,
    tipo: p.tipo,
    status: p.status ?? "agendada",
  }));
  const { error } = await supabase.from("reunioes").insert(rows);
  if (error) {
    console.error("[agenda] insertReunioesEmLote:", error);
    return { count: 0, error: error.message };
  }
  return { count: rows.length, error: null };
}

/** Cria convidado de reunião (auth + reuniao_convidados) via Edge Function */
export async function criarConvidadoReuniao(
  p: ConvidadoInsert
): Promise<{ data: { convidado_id: string; email: string } | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ convidado_id?: string; email?: string; error?: string }>(
    "criar-convidado-reuniao",
    {
      reuniao_id: p.reuniao_id,
      email: p.email.trim().toLowerCase(),
      senha_provisoria: p.senha_provisoria,
      senha_valida_ate: p.senha_valida_ate,
    }
  );
  if (error) return { data: null, error: error.message };
  if (data?.error) return { data: null, error: data.error };
  if (!data?.convidado_id || !data?.email) return { data: null, error: "Resposta inválida da Edge Function" };
  return {
    data: { convidado_id: data.convidado_id, email: data.email },
    error: null,
  };
}

/** Inativa um convidado de reunião */
export async function inativarConvidadoReuniao(convidadoId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("reuniao_convidados")
    .update({ ativo: false, updated_at: new Date().toISOString() })
    .eq("id", convidadoId);
  if (error) {
    console.error("[agenda] inativarConvidadoReuniao:", error);
    return { error: error.message };
  }
  return { error: null };
}

export async function updateReuniaoStatus(
  reuniaoId: string,
  status: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("reunioes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", reuniaoId);
  if (error) {
    console.error("[agenda] updateReuniaoStatus:", error);
    return { error: error.message };
  }
  return { error: null };
}
