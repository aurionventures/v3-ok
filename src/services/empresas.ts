import { supabase } from "@/lib/supabase";

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
