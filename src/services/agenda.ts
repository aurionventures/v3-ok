import { addDays, setDate, endOfMonth, getDay, format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";
import type { ReuniaoRow, ReuniaoEnriquecida, ReuniaoInsert } from "@/types/agenda";

export interface ConvidadoInsert {
  reuniao_id: string;
  email: string;
  senha_provisoria?: string;
  senha_valida_ate: string;
  use_magic_link?: boolean;
  redirect_to?: string;
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

/** Gera magic link para teste (apenas email + redirect) – não cria reuniao_convidados */
export async function gerarMagicLinkTeste(
  email: string,
  redirect_to?: string
): Promise<{ data: { magic_link: string; email: string } | null; error: string | null }> {
  const body: Record<string, unknown> = {
    email: email.trim().toLowerCase(),
    use_magic_link: true,
    gerar_link_teste: true,
  };
  if (redirect_to) body.redirect_to = redirect_to;

  const { data, error } = await invokeEdgeFunction<{
    email?: string;
    magic_link?: string;
    error?: string;
  }>("criar-convidado-reuniao", body, { useAnonKey: true });

  if (error) return { data: null, error: error.message };
  if (data?.error) return { data: null, error: data.error };
  if (!data?.magic_link || !data?.email) return { data: null, error: "Resposta inválida da Edge Function" };

  return {
    data: { magic_link: data.magic_link, email: data.email },
    error: null,
  };
}

/** Cria convidado de reunião (auth + reuniao_convidados) via Edge Function */
export async function criarConvidadoReuniao(
  p: ConvidadoInsert
): Promise<{ data: { convidado_id: string; email: string; magic_link?: string } | null; error: string | null }> {
  const body: Record<string, unknown> = {
    reuniao_id: p.reuniao_id,
    email: p.email.trim().toLowerCase(),
    senha_valida_ate: p.senha_valida_ate,
  };
  if (p.use_magic_link) {
    body.use_magic_link = true;
    if (p.redirect_to) body.redirect_to = p.redirect_to;
  } else if (p.senha_provisoria) {
    body.senha_provisoria = p.senha_provisoria;
  }

  const { data, error } = await invokeEdgeFunction<{
    convidado_id?: string;
    email?: string;
    magic_link?: string;
    error?: string;
  }>("criar-convidado-reuniao", body);

  if (error) return { data: null, error: error.message };
  if (data?.error) return { data: null, error: data.error };
  if (!data?.convidado_id || !data?.email) return { data: null, error: "Resposta inválida da Edge Function" };

  return {
    data: {
      convidado_id: data.convidado_id,
      email: data.email,
      ...(data.magic_link && { magic_link: data.magic_link }),
    },
    error: null,
  };
}

/** Busca convidado ativo pelo user_id (auth) - para landing do convidado */
export async function fetchConvidadoByUserId(
  userId: string
): Promise<{ data: { id: string; reuniao_id: string; email: string } | null; error: string | null }> {
  if (!supabase || !userId) return { data: null, error: null };
  const { data, error } = await supabase
    .from("reuniao_convidados")
    .select("id, reuniao_id, email")
    .eq("user_id", userId)
    .eq("ativo", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[agenda] fetchConvidadoByUserId:", error);
    return { data: null, error: error.message };
  }
  return { data: data as { id: string; reuniao_id: string; email: string } | null, error: null };
}

/** Busca reunião por ID (convidados precisam para o cabeçalho) */
export async function fetchReuniaoById(
  reuniaoId: string
): Promise<{ data: ReuniaoEnriquecida | null; error: string | null }> {
  if (!supabase || !reuniaoId) return { data: null, error: null };
  const { data, error } = await supabase
    .from("reunioes")
    .select("*")
    .eq("id", reuniaoId)
    .single();
  if (error) {
    console.error("[agenda] fetchReuniaoById:", error);
    return { data: null, error: error.message };
  }
  const row = data as ReuniaoRow;
  let result: ReuniaoEnriquecida = { ...row };
  if (row.conselho_id) {
    const { data: c } = await supabase.from("conselhos").select("nome").eq("id", row.conselho_id).single();
    result.conselho_nome = c?.nome ?? null;
  }
  if (row.comite_id) {
    const { data: c } = await supabase.from("comites").select("nome").eq("id", row.comite_id).single();
    result.comite_nome = c?.nome ?? null;
  }
  if (row.comissao_id) {
    const { data: c } = await supabase.from("comissoes").select("nome").eq("id", row.comissao_id).single();
    result.comissao_nome = c?.nome ?? null;
  }
  return { data: result, error: null };
}

/** Lista convidados ativos da reunião */
export async function fetchConvidadosPorReuniao(
  reuniaoId: string
): Promise<{ data: { id: string; email: string }[]; error: string | null }> {
  if (!supabase || !reuniaoId) return { data: [], error: null };
  const { data, error } = await supabase
    .from("reuniao_convidados")
    .select("id, email")
    .eq("reuniao_id", reuniaoId)
    .eq("ativo", true);
  if (error) {
    console.error("[agenda] fetchConvidadosPorReuniao:", error);
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as { id: string; email: string }[], error: null };
}

const BUCKET_DOCUMENTOS = "documentos";

/** Upload de documento por convidado (Doc, PDF, PPTX) - max 10MB */
export async function uploadDocumentoConvidado(
  reuniaoId: string,
  convidadoId: string,
  file: File
): Promise<{ data: { id: string } | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const allowed = ["doc", "docx", "pdf", "ppt", "pptx"];
  if (!allowed.includes(ext)) {
    return { data: null, error: "Apenas DOC, DOCX, PDF, PPT ou PPTX são permitidos." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { data: null, error: "Tamanho máximo: 10MB." };
  }

  const path = `reuniao_convidados/${reuniaoId}/${convidadoId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET_DOCUMENTOS).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    console.error("[agenda] uploadDocumentoConvidado storage:", uploadError);
    return { data: null, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_DOCUMENTOS).getPublicUrl(path);

  const { data: inserted, error: insertError } = await supabase
    .from("reuniao_documentos_convidados")
    .insert({
      reuniao_id: reuniaoId,
      convidado_id: convidadoId,
      nome_arquivo: file.name,
      storage_path: path,
      arquivo_url: publicUrl,
      tamanho: file.size,
      mime_type: file.type || null,
      status: "pendente",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[agenda] uploadDocumentoConvidado insert:", insertError);
    return { data: null, error: insertError.message };
  }

  return { data: inserted ? { id: (inserted as { id: string }).id } : null, error: null };
}

/** Confirma participação do convidado */
export async function confirmarParticipacaoConvidado(
  convidadoId: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("reuniao_convidados")
    .update({ confirmado_em: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", convidadoId);
  if (error) {
    console.error("[agenda] confirmarParticipacaoConvidado:", error);
    return { error: error.message };
  }
  return { error: null };
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

/** Deleta todas as reuniões da empresa no ano selecionado (CASCADE remove pautas, atas, convidados) */
export async function deleteReunioesPorEmpresaAno(
  empresaId: string,
  ano: number
): Promise<{ count: number; error: string | null }> {
  if (!supabase) return { count: 0, error: "Supabase não configurado" };
  const reunioes = await fetchReunioes(empresaId, ano);
  if (reunioes.length === 0) return { count: 0, error: null };

  const ids = reunioes.map((r) => r.id);
  const { error } = await supabase.from("reunioes").delete().in("id", ids);

  if (error) {
    console.error("[agenda] deleteReunioesPorEmpresaAno:", error);
    return { count: 0, error: error.message };
  }
  return { count: ids.length, error: null };
}
