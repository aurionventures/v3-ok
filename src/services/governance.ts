import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";
import type {
  ConselhoRow,
  ComiteRow,
  ComissaoRow,
  MembroGovernancaRow,
  AlocacaoRow,
  OrgaoGovernanca,
  MembroComAlocacao,
  ConselhoInsert,
  ComiteInsert,
  ComissaoInsert,
  MembroInsert,
  MembroInsertComAcesso,
  AlocacaoInsert,
} from "@/types/governance";

async function countAlocacoesPorOrgao(
  campo: "conselho_id" | "comite_id" | "comissao_id",
  ids: string[]
): Promise<Map<string, number>> {
  if (!supabase || ids.length === 0) return new Map();
  const { data } = await supabase
    .from("alocacoes_membros")
    .select(campo)
    .eq("ativo", true)
    .in(campo, ids);
  const map = new Map<string, number>();
  for (const id of ids) map.set(id, 0);
  for (const row of data ?? []) {
    const id = (row as Record<string, string>)[campo];
    if (id) map.set(id, (map.get(id) ?? 0) + 1);
  }
  return map;
}

// --- Conselhos ---
export async function fetchConselhos(empresaId: string): Promise<OrgaoGovernanca[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("conselhos")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .order("nome");
  if (error) {
    console.error("[governance] fetchConselhos:", error);
    return [];
  }
  const rows = data ?? [];
  const ids = rows.map((r: ConselhoRow) => r.id);
  const counts = await countAlocacoesPorOrgao("conselho_id", ids);
  return rows.map((r: ConselhoRow) => ({
    id: r.id,
    nome: r.nome,
    descricao: r.descricao ?? "",
    tipo: r.tipo ?? "",
    quorum: r.quorum ?? 3,
    nivel: r.nivel ?? "",
    membros: counts.get(r.id) ?? 0,
  }));
}

export async function insertConselho(p: ConselhoInsert): Promise<{ data: OrgaoGovernanca | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const { data, error } = await supabase
    .from("conselhos")
    .insert({
      empresa_id: p.empresa_id,
      nome: p.nome,
      tipo: p.tipo ?? null,
      descricao: p.descricao ?? null,
      quorum: p.quorum ?? 3,
      nivel: p.nivel ?? null,
    })
    .select()
    .single();
  if (error) {
    console.error("[governance] insertConselho:", error);
    return { data: null, error: error.message };
  }
  return {
    data: data
      ? {
          id: data.id,
          nome: data.nome,
          descricao: data.descricao ?? "",
          tipo: data.tipo ?? "",
          quorum: data.quorum ?? 3,
          nivel: data.nivel ?? "",
          membros: 0,
        }
      : null,
    error: null,
  };
}

export async function deleteConselho(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("conselhos").delete().eq("id", id);
  if (error) {
    console.error("[governance] deleteConselho:", error);
    return { error: error.message };
  }
  return { error: null };
}

// --- Comitês ---
export async function fetchComites(empresaId: string): Promise<OrgaoGovernanca[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("comites")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .order("nome");
  if (error) {
    console.error("[governance] fetchComites:", error);
    return [];
  }
  const rows = data ?? [];
  const ids = rows.map((r: ComiteRow) => r.id);
  const counts = await countAlocacoesPorOrgao("comite_id", ids);
  return rows.map((r: ComiteRow) => ({
    id: r.id,
    nome: r.nome,
    descricao: r.descricao ?? "",
    tipo: r.tipo ?? "",
    quorum: r.quorum ?? 3,
    nivel: r.nivel ?? "",
    membros: counts.get(r.id) ?? 0,
  }));
}

export async function insertComite(p: ComiteInsert): Promise<{ data: OrgaoGovernanca | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const { data, error } = await supabase
    .from("comites")
    .insert({
      empresa_id: p.empresa_id,
      nome: p.nome,
      conselho_id: p.conselho_id ?? null,
      descricao: p.descricao ?? null,
      tipo: p.tipo ?? null,
      quorum: p.quorum ?? 3,
      nivel: p.nivel ?? null,
    })
    .select()
    .single();
  if (error) {
    console.error("[governance] insertComite:", error);
    return { data: null, error: error.message };
  }
  return {
    data: data
      ? {
          id: data.id,
          nome: data.nome,
          descricao: data.descricao ?? "",
          tipo: data.tipo ?? "",
          quorum: data.quorum ?? 3,
          nivel: data.nivel ?? "",
          membros: 0,
        }
      : null,
    error: null,
  };
}

export async function deleteComite(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("comites").delete().eq("id", id);
  if (error) {
    console.error("[governance] deleteComite:", error);
    return { error: error.message };
  }
  return { error: null };
}

// --- Comissões ---
export async function fetchComissoes(empresaId: string): Promise<OrgaoGovernanca[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("comissoes")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("ativo", true)
    .order("nome");
  if (error) {
    console.error("[governance] fetchComissoes:", error);
    return [];
  }
  const rows = data ?? [];
  const ids = rows.map((r: ComissaoRow) => r.id);
  const counts = await countAlocacoesPorOrgao("comissao_id", ids);
  return rows.map((r: ComissaoRow) => ({
    id: r.id,
    nome: r.nome,
    descricao: r.descricao ?? "",
    tipo: r.tipo ?? "",
    quorum: r.quorum ?? 3,
    nivel: r.nivel ?? "",
    membros: counts.get(r.id) ?? 0,
  }));
}

export async function insertComissao(p: ComissaoInsert): Promise<{ data: OrgaoGovernanca | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const { data, error } = await supabase
    .from("comissoes")
    .insert({
      empresa_id: p.empresa_id,
      nome: p.nome,
      descricao: p.descricao ?? null,
      tipo: p.tipo ?? null,
      quorum: p.quorum ?? 3,
      nivel: p.nivel ?? null,
    })
    .select()
    .single();
  if (error) {
    console.error("[governance] insertComissao:", error);
    return { data: null, error: error.message };
  }
  return {
    data: data
      ? {
          id: data.id,
          nome: data.nome,
          descricao: data.descricao ?? "",
          tipo: data.tipo ?? "",
          quorum: data.quorum ?? 3,
          nivel: data.nivel ?? "",
          membros: 0,
        }
      : null,
    error: null,
  };
}

export async function deleteComissao(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("comissoes").delete().eq("id", id);
  if (error) {
    console.error("[governance] deleteComissao:", error);
    return { error: error.message };
  }
  return { error: null };
}

// --- Membros ---
export async function fetchMembros(empresaId: string): Promise<MembroComAlocacao[]> {
  if (!supabase) return [];
  const { data: membros, error: errM } = await supabase
    .from("membros_governanca")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome");
  if (errM || !membros) return [];

  const { data: alocacoes } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, conselho_id, comite_id, comissao_id")
    .eq("ativo", true);

  const conselhoIds = [...new Set((alocacoes ?? []).map((a: AlocacaoRow) => a.conselho_id).filter(Boolean) as string[])];
  const comiteIds = [...new Set((alocacoes ?? []).map((a: AlocacaoRow) => a.comite_id).filter(Boolean) as string[])];
  const comissaoIds = [...new Set((alocacoes ?? []).map((a: AlocacaoRow) => a.comissao_id).filter(Boolean) as string[])];

  const nomesConselhos = new Map<string, string>();
  const nomesComites = new Map<string, string>();
  const nomesComissoes = new Map<string, string>();
  if (conselhoIds.length) {
    const { data: d } = await supabase.from("conselhos").select("id, nome").in("id", conselhoIds);
    for (const r of d ?? []) nomesConselhos.set(r.id, r.nome);
  }
  if (comiteIds.length) {
    const { data: d } = await supabase.from("comites").select("id, nome").in("id", comiteIds);
    for (const r of d ?? []) nomesComites.set(r.id, r.nome);
  }
  if (comissaoIds.length) {
    const { data: d } = await supabase.from("comissoes").select("id, nome").in("id", comissaoIds);
    for (const r of d ?? []) nomesComissoes.set(r.id, r.nome);
  }

  const orgaosMap = new Map<string, string[]>();
  const conselhosMap = new Map<string, string[]>();
  const comitesMap = new Map<string, string[]>();
  const comissoesMap = new Map<string, string[]>();

  for (const a of alocacoes ?? []) {
    const arr = orgaosMap.get(a.membro_id) ?? [];
    const conselhos = conselhosMap.get(a.membro_id) ?? [];
    const comites = comitesMap.get(a.membro_id) ?? [];
    const comissoes = comissoesMap.get(a.membro_id) ?? [];

    if (a.conselho_id) {
      const nome = nomesConselhos.get(a.conselho_id);
      if (nome && !conselhos.includes(nome)) {
        conselhos.push(nome);
        arr.push(nome);
      }
    }
    if (a.comite_id) {
      const nome = nomesComites.get(a.comite_id);
      if (nome && !comites.includes(nome)) {
        comites.push(nome);
        arr.push(nome);
      }
    }
    if (a.comissao_id) {
      const nome = nomesComissoes.get(a.comissao_id);
      if (nome && !comissoes.includes(nome)) {
        comissoes.push(nome);
        arr.push(nome);
      }
    }

    orgaosMap.set(a.membro_id, arr);
    conselhosMap.set(a.membro_id, conselhos);
    comitesMap.set(a.membro_id, comites);
    comissoesMap.set(a.membro_id, comissoes);
  }

  return membros.map((m: MembroGovernancaRow) => ({
    id: m.id,
    nome: m.nome,
    cargoPrincipal: m.cargo_principal ?? null,
    orgaosAlocados: orgaosMap.get(m.id) ?? [],
    conselhos: conselhosMap.get(m.id) ?? [],
    comites: comitesMap.get(m.id) ?? [],
    comissoes: comissoesMap.get(m.id) ?? [],
    email: m.email ?? null,
    user_id: m.user_id ?? null,
  }));
}

export async function insertMembro(p: MembroInsert): Promise<{ data: MembroComAlocacao | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const { data, error } = await supabase
    .from("membros_governanca")
    .insert({
      empresa_id: p.empresa_id,
      nome: p.nome,
      cargo_principal: p.cargo_principal ?? null,
    })
    .select()
    .single();
  if (error) {
    console.error("[governance] insertMembro:", error);
    return { data: null, error: error.message };
  }
  return {
    data: data
      ? {
          id: data.id,
          nome: data.nome,
          cargoPrincipal: data.cargo_principal ?? null,
          orgaosAlocados: [],
          conselhos: [],
          comites: [],
          comissoes: [],
        }
      : null,
    error: null,
  };
}

/** Cria membro com e-mail e senha provisória para acesso ao Dashboard de Membros (via Edge Function) */
export async function insertMembroComAcesso(
  p: MembroInsertComAcesso
): Promise<{ data: { membro_id: string; email: string } | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ membro_id?: string; email?: string; error?: string }>(
    "criar-membro-acesso",
    {
      email: p.email.trim().toLowerCase(),
      senha_provisoria: p.senha_provisoria,
      nome: p.nome.trim(),
      cargo_principal: p.cargo_principal?.trim() || null,
      empresa_id: p.empresa_id,
    }
  );
  if (error) return { data: null, error: error.message };
  const err = data?.error;
  if (err) return { data: null, error: err };
  if (!data?.membro_id || !data?.email) return { data: null, error: "Resposta inválida da Edge Function" };
  return {
    data: { membro_id: data.membro_id, email: data.email },
    error: null,
  };
}

/** Gera nova senha provisória para membro com acesso (via Edge Function) */
export async function redefinirSenhaMembro(
  user_id: string
): Promise<{ data: { senha_provisoria: string } | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ senha_provisoria?: string; error?: string }>(
    "redefinir-senha-membro",
    { user_id }
  );
  if (error) return { data: null, error: error.message };
  const err = data?.error;
  if (err) return { data: null, error: err };
  if (!data?.senha_provisoria) return { data: null, error: "Resposta inválida da Edge Function" };
  return {
    data: { senha_provisoria: data.senha_provisoria },
    error: null,
  };
}

export async function updateMembro(
  id: string,
  p: { nome?: string; cargo_principal?: string | null }
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("membros_governanca")
    .update({
      nome: p.nome,
      cargo_principal: p.cargo_principal ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.error("[governance] updateMembro:", error);
    return { error: error.message };
  }
  return { error: null };
}

/** Exclusão direta no banco (pode falhar por RLS se não houver policy) */
export async function deleteMembro(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("membros_governanca").delete().eq("id", id);
  if (error) {
    console.error("[governance] deleteMembro:", error);
    return { error: error.message };
  }
  return { error: null };
}

/** Exclusão definitiva via Edge Function: remove membro, alocações (CASCADE) e usuário Auth */
export async function excluirMembroDefinitivo(membroId: string): Promise<{ error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{ ok?: boolean; error?: string }>(
    "excluir-membro-definitivo",
    { membro_id: membroId }
  );
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  if (!data?.ok) return { error: "Resposta inválida da Edge Function" };
  return { error: null };
}

// --- Alocações ---
export async function insertAlocacao(p: AlocacaoInsert): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("alocacoes_membros").insert({
    membro_id: p.membro_id,
    conselho_id: p.conselho_id ?? null,
    comite_id: p.comite_id ?? null,
    comissao_id: p.comissao_id ?? null,
    cargo: p.cargo ?? null,
    data_inicio: p.data_inicio ?? null,
    data_fim: p.data_fim ?? null,
  });
  if (error) {
    console.error("[governance] insertAlocacao:", error);
    return { error: error.message };
  }
  return { error: null };
}

/** Retorna membro por user_id (auth) - para login do Dashboard de Membros */
export async function fetchMembroByUserId(userId: string): Promise<{
  id: string;
  nome: string;
  email: string | null;
  senha_alterada: boolean;
  empresa_id: string;
} | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("membros_governanca")
    .select("id, nome, email, senha_alterada, empresa_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    nome: data.nome,
    email: data.email ?? null,
    senha_alterada: data.senha_alterada ?? false,
    empresa_id: data.empresa_id,
  };
}

/** Retorna membros alocados em qualquer órgão da reunião (conselho, comitê, comissão) ou, se virtual, membros do tipo indicado em virtual_tipo */
export async function fetchMembrosPorReuniao(
  empresaId: string,
  reuniao: {
    conselho_id?: string | null;
    comite_id?: string | null;
    comissao_id?: string | null;
    virtual_tipo?: string | null;
  }
): Promise<{ id: string; nome: string; email: string | null; cargo: string | null }[]> {
  const seen = new Set<string>();
  const result: { id: string; nome: string; email: string | null; cargo: string | null }[] = [];
  const vt = reuniao.virtual_tipo;

  if (reuniao.conselho_id) {
    const membros = await fetchMembrosPorOrgao(empresaId, "conselho", reuniao.conselho_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }
  if (reuniao.comite_id) {
    const membros = await fetchMembrosPorOrgao(empresaId, "comite", reuniao.comite_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }
  if (reuniao.comissao_id) {
    const membros = await fetchMembrosPorOrgao(empresaId, "comissao", reuniao.comissao_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }

  if (result.length > 0) return result;

  if (vt === "conselho" || vt === "comite" || vt === "comissao") {
    const membros = await fetchMembrosPorVirtualTipo(empresaId, vt);
    return membros;
  }

  return result;
}

/** Retorna membros alocados em qualquer órgão do tipo indicado (Pauta Virtual) */
async function fetchMembrosPorVirtualTipo(
  empresaId: string,
  virtualTipo: "conselho" | "comite" | "comissao"
): Promise<{ id: string; nome: string; email: string | null; cargo: string | null }[]> {
  if (!supabase) return [];
  const campo = virtualTipo === "conselho" ? "conselho_id" : virtualTipo === "comite" ? "comite_id" : "comissao_id";
  const tabela = virtualTipo === "conselho" ? "conselhos" : virtualTipo === "comite" ? "comites" : "comissoes";
  const { data: orgaos } = await supabase.from(tabela).select("id").eq("empresa_id", empresaId).eq("ativo", true);
  const orgaoIds = (orgaos ?? []).map((o: { id: string }) => o.id);
  if (orgaoIds.length === 0) return [];
  const { data: alocacoes, error: errA } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .in(campo, orgaoIds)
    .eq("ativo", true);
  if (errA || !alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros, error: errM } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (errM || !membros) return [];
  return membros.map((m: { id: string; nome: string; email?: string | null }) => ({
    id: m.id,
    nome: m.nome,
    email: m.email ?? null,
    cargo: cargoByMembro.get(m.id) ?? null,
  }));
}

/** Retorna membros alocados em um órgão específico (conselho, comitê, comissão ou virtual) */
export async function fetchMembrosPorOrgao(
  empresaId: string,
  tipo: "conselho" | "comite" | "comissao" | "virtual",
  orgaoId: string
): Promise<{ id: string; nome: string; email: string | null; cargo: string | null }[]> {
  if (!supabase || !orgaoId || tipo === "virtual") return [];
  const campo = tipo === "conselho" ? "conselho_id" : tipo === "comite" ? "comite_id" : "comissao_id";
  const { data: alocacoes, error: errA } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .eq(campo, orgaoId)
    .eq("ativo", true);
  if (errA || !alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros, error: errM } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (errM || !membros) return [];
  return membros.map((m: { id: string; nome: string; email?: string | null }) => ({
    id: m.id,
    nome: m.nome,
    email: m.email ?? null,
    cargo: cargoByMembro.get(m.id) ?? null,
  }));
}

export async function removeAlocacao(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase.from("alocacoes_membros").delete().eq("id", id);
  if (error) {
    console.error("[governance] removeAlocacao:", error);
    return { error: error.message };
  }
  return { error: null };
}
