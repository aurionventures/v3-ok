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
