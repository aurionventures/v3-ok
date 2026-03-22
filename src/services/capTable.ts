import { supabase } from "@/lib/supabase";
import type {
  CapTableShareholder,
  CapTableInsert,
  CapTableRow,
} from "@/types/capTable";

function rowToShareholder(row: CapTableRow): CapTableShareholder {
  return {
    id: row.id,
    name: row.participante,
    type: row.tipo ?? "Pessoa Física",
    percentage: Number(row.participacao_pct ?? 0),
    shares: Number(row.quotas ?? 0),
    entryDate: row.data_entrada ?? new Date().toISOString().slice(0, 10),
    acquisitionType: row.tipo_aquisicao ?? "—",
    value: Number(row.valor ?? 0),
    family: row.familia ?? true,
  };
}

export async function fetchCapTable(empresaId: string): Promise<CapTableShareholder[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("cap_table")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("participacao_pct", { ascending: false });

  if (error) {
    console.error("[capTable] fetchCapTable:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToShareholder(r as CapTableRow));
}

export async function insertCapTableEntry(
  payload: CapTableInsert
): Promise<{ data: CapTableShareholder | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase não configurado" };
  }

  const { data, error } = await supabase
    .from("cap_table")
    .insert({
      empresa_id: payload.empresa_id,
      participante: payload.participante,
      participacao_pct: payload.participacao_pct ?? null,
      tipo: payload.tipo ?? null,
      quotas: payload.quotas ?? null,
      data_entrada: payload.data_entrada ?? null,
      tipo_aquisicao: payload.tipo_aquisicao ?? null,
      valor: payload.valor ?? null,
      familia: payload.familia ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("[capTable] insert:", error);
    return { data: null, error: error.message };
  }

  return {
    data: data ? rowToShareholder(data as CapTableRow) : null,
    error: null,
  };
}

export async function deleteCapTableEntry(
  id: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error } = await supabase.from("cap_table").delete().eq("id", id);

  if (error) {
    console.error("[capTable] delete:", error);
    return { error: error.message };
  }
  return { error: null };
}
