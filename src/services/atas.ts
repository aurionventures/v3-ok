import { supabase } from "@/lib/supabase";
import { initAtaAprovacoes } from "./ataAprovacoes";

export interface AtaRow {
  id: string;
  reuniao_id: string;
  conteudo: string | null;
  resumo: string | null;
  status?: string;
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
  resumo?: string,
  membroIds?: string[]
): Promise<{ data: AtaRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };

  const { data: existing } = await supabase
    .from("atas")
    .select("id, status")
    .eq("reuniao_id", reuniaoId)
    .maybeSingle();

  const basePayload = {
    reuniao_id: reuniaoId,
    conteudo,
    resumo: resumo ?? conteudo.slice(0, 300),
  };
  const isNew = !existing;
  const payload = isNew
    ? { ...basePayload, status: "aguardando_aprovacao" as const }
    : basePayload;

  let ataId: string;

  if (existing) {
    ataId = (existing as { id: string }).id;
    const { data, error } = await supabase
      .from("atas")
      .update(payload)
      .eq("id", ataId)
      .select()
      .single();
    if (error) {
      console.error("[atas] update:", error);
      return { data: null, error: error.message };
    }
  } else {
    const { data, error } = await supabase.from("atas").insert(payload).select().single();
    if (error) {
      console.error("[atas] insert:", error);
      return { data: null, error: error.message };
    }
    ataId = (data as AtaRow).id;
  }

  if (membroIds && membroIds.length > 0) {
    const { data: ataRow } = await supabase.from("atas").select("status").eq("id", ataId).single();
    const status = (ataRow as { status?: string } | null)?.status;
    if (status === "aguardando_aprovacao" || isNew) {
      const { error: errInit } = await initAtaAprovacoes(ataId, membroIds);
      if (errInit) {
        console.error("[atas] initAtaAprovacoes:", errInit);
      }
    }
  }

  const { data: final } = await supabase.from("atas").select("*").eq("id", ataId).single();
  return { data: final as AtaRow, error: null };
}
