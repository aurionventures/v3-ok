import { supabase } from "@/lib/supabase";
import type { FamilyMember, FamilyMemberInsert, FamilyMemberRow } from "@/types/familyStructure";

function rowToMember(row: FamilyMemberRow): FamilyMember {
  return {
    id: row.id,
    name: row.nome ?? "",
    age: row.idade ?? null,
    generation: row.geracao ?? null,
    role: row.papel ?? null,
    involvement: row.envolvimento ?? null,
    status: row.status ?? "Ativo",
    imageSrc: row.imagem_url ?? null,
    shareholding: row.participacao_societaria ?? null,
    education: row.formacao ?? null,
    experience: row.experiencia ?? null,
    contact: {
      email: row.email ?? "",
      phone: row.telefone ?? "",
    },
    companies: Array.isArray(row.empresas) ? row.empresas : [],
  };
}

export async function fetchFamilyMembers(empresaId: string): Promise<FamilyMember[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("estrutura_familiar")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[familyStructure] fetchFamilyMembers:", error);
    return [];
  }

  return (data ?? []).map(rowToMember);
}

export async function insertFamilyMember(
  payload: FamilyMemberInsert
): Promise<{ data: FamilyMember | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase não configurado" };
  }

  const { data, error } = await supabase
    .from("estrutura_familiar")
    .insert({
      empresa_id: payload.empresa_id,
      nome: payload.nome,
      parentesco: payload.parentesco ?? null,
      idade: payload.idade ?? null,
      geracao: payload.geracao ?? null,
      papel: payload.papel ?? null,
      envolvimento: payload.envolvimento ?? null,
      status: payload.status ?? "Ativo",
      imagem_url: payload.imagem_url ?? null,
      participacao_societaria: payload.participacao_societaria ?? null,
      formacao: payload.formacao ?? null,
      experiencia: payload.experiencia ?? null,
      email: payload.email ?? null,
      telefone: payload.telefone ?? null,
      empresas: payload.empresas ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error("[familyStructure] insertFamilyMember:", error);
    return { data: null, error: error.message };
  }

  return { data: data ? rowToMember(data as FamilyMemberRow) : null, error: null };
}

export async function deleteFamilyMember(id: string): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase não configurado" };
  }

  const { error } = await supabase.from("estrutura_familiar").delete().eq("id", id);

  if (error) {
    console.error("[familyStructure] deleteFamilyMember:", error);
    return { error: error.message };
  }

  return { error: null };
}
