import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";

export interface Empresa {
  id: string;
  nome: string;
  razao_social: string | null;
  cnpj: string | null;
  ativo: boolean;
}

export async function fetchEmpresas(): Promise<Empresa[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("empresas")
    .select("id, nome, razao_social, cnpj, ativo")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    console.error("[empresas] fetchEmpresas:", error);
    return [];
  }

  return (data ?? []) as Empresa[];
}

/** Lista todas as empresas (ativas e inativas) - para Super ADM */
export async function fetchEmpresasAll(): Promise<Empresa[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("empresas")
    .select("id, nome, razao_social, cnpj, ativo")
    .order("nome");

  if (error) {
    console.error("[empresas] fetchEmpresasAll:", error);
    return [];
  }

  return (data ?? []) as Empresa[];
}

export interface PerfilEmpresaAdm {
  id: string;
  user_id: string;
  empresa_id: string;
  nome: string | null;
  role: string | null;
  senha_alterada: boolean;
}

/** Busca perfil ADM de empresa por user_id - para login Cliente */
export async function fetchPerfilEmpresaAdmByUserId(
  userId: string
): Promise<PerfilEmpresaAdm | null> {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from("perfis")
    .select("id, user_id, empresa_id, nome, role, senha_alterada")
    .eq("user_id", userId)
    .eq("role", "empresa_adm")
    .maybeSingle();

  if (error) {
    console.error("[empresas] fetchPerfilEmpresaAdmByUserId:", error);
    return null;
  }

  if (!data) return null;
  return {
    id: data.id,
    user_id: data.user_id,
    empresa_id: data.empresa_id,
    nome: data.nome,
    role: data.role,
    senha_alterada: data.senha_alterada ?? true,
  } as PerfilEmpresaAdm;
}

export interface EmpresaAdmDetalhes {
  user_id: string;
  nome: string | null;
  email: string | null;
  senha_alterada: boolean;
}

export interface EmpresaDetalhes {
  empresa: Empresa;
  adm: EmpresaAdmDetalhes | null;
}

/** Busca dados completos da empresa + ADM (via Edge Function, para Super ADM) */
export async function fetchEmpresaDetalhes(
  empresaId: string
): Promise<{ data: EmpresaDetalhes | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{
    empresa?: Empresa;
    adm?: EmpresaAdmDetalhes | null;
    error?: string;
  }>("get-empresa-detalhes", { empresa_id: empresaId });

  if (error) return { data: null, error: error.message };
  const err = data?.error;
  if (err) return { data: null, error: err };
  if (!data?.empresa) return { data: null, error: "Dados inválidos" };

  return {
    data: {
      empresa: data.empresa,
      adm: data.adm ?? null,
    },
    error: null,
  };
}

/** Busca empresa por ID - para validação no login do membro */
export async function fetchEmpresaById(id: string): Promise<Empresa | null> {
  if (!supabase || !id) return null;

  const { data, error } = await supabase
    .from("empresas")
    .select("id, nome, razao_social, cnpj, ativo")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[empresas] fetchEmpresaById:", error);
    return null;
  }

  return data as Empresa | null;
}

export interface EmpresaInsert {
  nome: string;
  razao_social?: string | null;
  cnpj?: string | null;
}

export async function insertEmpresa(p: EmpresaInsert): Promise<{ data: Empresa | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  const nome = (p.nome ?? "").trim();
  if (!nome) return { data: null, error: "Nome é obrigatório" };

  const { data, error } = await supabase
    .from("empresas")
    .insert({
      nome,
      razao_social: p.razao_social?.trim() || null,
      cnpj: p.cnpj?.trim() || null,
      ativo: true,
    })
    .select()
    .single();

  if (error) {
    console.error("[empresas] insertEmpresa:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Empresa, error: null };
}

export interface EmpresaAdmInsert {
  empresa_id: string;
  email: string;
  senha_provisoria: string;
  nome?: string;
}

/** Cria usuário ADM da empresa (auth + perfil) – no primeiro acesso deve alterar a senha */
export async function insertEmpresaAdm(
  p: EmpresaAdmInsert
): Promise<{ data: { perfil_id: string; email: string } | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{
    perfil_id?: string;
    email?: string;
    error?: string;
  }>("criar-empresa-adm-acesso", {
    empresa_id: p.empresa_id,
    email: p.email.trim().toLowerCase(),
    senha_provisoria: p.senha_provisoria,
    nome: (p.nome ?? "Administrador").trim(),
  });
  if (error) return { data: null, error: error.message };
  const err = data?.error;
  if (err) return { data: null, error: err };
  if (!data?.perfil_id || !data?.email) return { data: null, error: "Resposta inválida da Edge Function" };
  return {
    data: { perfil_id: data.perfil_id, email: data.email },
    error: null,
  };
}

export interface EmpresaUpdate {
  nome?: string;
  razao_social?: string | null;
  cnpj?: string | null;
  ativo?: boolean;
}

export async function updateEmpresa(id: string, p: EmpresaUpdate): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (p.nome !== undefined) payload.nome = p.nome.trim();
  if (p.razao_social !== undefined) payload.razao_social = p.razao_social?.trim() || null;
  if (p.cnpj !== undefined) payload.cnpj = p.cnpj?.trim() || null;
  if (p.ativo !== undefined) payload.ativo = p.ativo;

  const { error } = await supabase.from("empresas").update(payload).eq("id", id);

  if (error) {
    console.error("[empresas] updateEmpresa:", error);
    return { error: error.message };
  }

  return { error: null };
}

/** Exclui empresa permanentemente. Cuidado: pode cascatear em dados relacionados. */
export async function deleteEmpresa(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase.from("empresas").delete().eq("id", id);

  if (error) {
    console.error("[empresas] deleteEmpresa:", error);
    return { error: error.message };
  }

  return { error: null };
}

/** Redefine senha provisória do ADM da empresa (via Edge Function) */
export async function redefinirSenhaEmpresaAdm(
  userId: string
): Promise<{ data: { senha_provisoria: string } | null; error: string | null }> {
  const { data, error } = await invokeEdgeFunction<{
    senha_provisoria?: string;
    error?: string;
  }>("redefinir-senha-empresa-adm", { user_id: userId });
  if (error) return { data: null, error: error.message };
  const err = data?.error;
  if (err) return { data: null, error: err };
  if (!data?.senha_provisoria)
    return { data: null, error: "Resposta inválida da Edge Function" };
  return { data: { senha_provisoria: data.senha_provisoria }, error: null };
}
