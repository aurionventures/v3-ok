import { supabase } from "@/lib/supabase";
import type { ReuniaoRow, ReuniaoEnriquecida, ReuniaoInsert } from "@/types/agenda";

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
