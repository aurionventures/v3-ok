import { supabase } from "@/lib/supabase";

export interface AtaRow {
  id: string;
  reuniao_id: string;
  conteudo: string | null;
  resumo: string | null;
  created_at?: string;
}

export interface AtaComReuniao extends AtaRow {
  reunioes?: { titulo: string; data_reuniao: string | null } | null;
}

export async function fetchAtas(reuniaoId?: string): Promise<{ data: AtaComReuniao[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase não configurado" };

  let q = supabase
    .from("atas")
    .select("*, reunioes(titulo, data_reuniao)")
    .order("created_at", { ascending: false });
  if (reuniaoId) q = q.eq("reuniao_id", reuniaoId);

  const { data, error } = await q;

  if (error) {
    console.error("[atas] fetchAtas:", error);
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as AtaComReuniao[], error: null };
}

export async function upsertAta(
  reuniaoId: string,
  conteudo: string,
  resumo?: string
): Promise<{ data: AtaRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  const { data: existing } = await supabase
    .from("atas")
    .select("id")
    .eq("reuniao_id", reuniaoId)
    .maybeSingle();

  const payload = { reuniao_id: reuniaoId, conteudo, resumo: resumo ?? conteudo.slice(0, 300) };

  if (existing) {
    const { data, error } = await supabase
      .from("atas")
      .update(payload)
      .eq("id", (existing as { id: string }).id)
      .select()
      .single();
    if (error) {
      console.error("[atas] update:", error);
      return { data: null, error: error.message };
    }
    return { data: data as AtaRow, error: null };
  }

  const { data, error } = await supabase.from("atas").insert(payload).select().single();
  if (error) {
    console.error("[atas] insert:", error);
    return { data: null, error: error.message };
  }
  return { data: data as AtaRow, error: null };
}
