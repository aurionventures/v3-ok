import { supabase } from "@/lib/supabase";
import type {
  Entrevista,
  EntrevistaInsert,
  EntrevistaRow,
} from "@/types/entrevistas";

function rowToEntrevista(row: EntrevistaRow): Entrevista {
  return {
    id: row.id,
    nome: row.nome_entrevistado ?? "",
    papel: row.papel ?? "",
    prioridade: (row.prioridade as Entrevista["prioridade"]) ?? "Média",
    status: (row.status as Entrevista["status"]) ?? "pendente",
    transcricao: row.transcricao ?? null,
    dataEntrevista: row.data_entrevista ?? null,
    createdAt: row.created_at,
  };
}

export async function fetchEntrevistas(empresaId: string): Promise<Entrevista[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entrevistas")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[entrevistas] fetchEntrevistas:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToEntrevista(r as EntrevistaRow));
}

export async function insertEntrevista(
  payload: EntrevistaInsert
): Promise<{ data: Entrevista | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase não configurado" };
  }

  const { data, error } = await supabase
    .from("entrevistas")
    .insert({
      empresa_id: payload.empresa_id,
      nome_entrevistado: payload.nome_entrevistado,
      papel: payload.papel ?? null,
      prioridade: payload.prioridade ?? "Média",
      status: payload.status ?? "pendente",
    })
    .select()
    .single();

  if (error) {
    console.error("[entrevistas] insert:", error);
    return { data: null, error: error.message };
  }

  return {
    data: data ? rowToEntrevista(data as EntrevistaRow) : null,
    error: null,
  };
}

export async function updateEntrevistaStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("entrevistas")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[entrevistas] updateStatus:", error);
    return { error: error.message };
  }
  return { error: null };
}

export async function updateEntrevistaTranscricao(
  id: string,
  transcricao: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("entrevistas")
    .update({
      transcricao,
      status: "realizada",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[entrevistas] updateTranscricao:", error);
    return { error: error.message };
  }
  return { error: null };
}
