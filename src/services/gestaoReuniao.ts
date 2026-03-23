import { supabase } from "@/lib/supabase";

export interface PautaRow {
  id: string;
  reuniao_id: string;
  titulo: string;
  ordem: number;
  tempo_estimado_min: number | null;
  descricao: string | null;
  apresentador: string | null;
  tipo: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PautaInsert {
  reuniao_id: string;
  titulo: string;
  ordem: number;
  tempo_estimado_min?: number;
  descricao?: string;
  apresentador?: string;
  tipo?: string;
}

export async function fetchPautas(
  reuniaoId: string
): Promise<{ data: PautaRow[]; error: string | null }> {
  if (!supabase)
    return { data: [], error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("pautas")
    .select("*")
    .eq("reuniao_id", reuniaoId)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("[gestaoReuniao] fetchPautas:", error);
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as PautaRow[], error: null };
}

export async function insertPauta(
  p: PautaInsert
): Promise<{ data: PautaRow | null; error: string | null }> {
  if (!supabase)
    return { data: null, error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("pautas")
    .insert({
      reuniao_id: p.reuniao_id,
      titulo: p.titulo,
      ordem: p.ordem,
      tempo_estimado_min: p.tempo_estimado_min ?? null,
      descricao: p.descricao ?? null,
      apresentador: p.apresentador ?? null,
      tipo: p.tipo ?? "informativo",
    })
    .select()
    .single();

  if (error) {
    console.error("[gestaoReuniao] insertPauta:", error);
    return { data: null, error: error.message };
  }
  return { data: data as PautaRow, error: null };
}

export async function deletePauta(
  pautaId: string
): Promise<{ error: string | null }> {
  if (!supabase)
    return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("pautas")
    .delete()
    .eq("id", pautaId);

  if (error) {
    console.error("[gestaoReuniao] deletePauta:", error);
    return { error: error.message };
  }
  return { error: null };
}

// --- reuniao_gestao ---
export interface ReuniaoGestaoRow {
  reuniao_id: string;
  documentos_count: number;
  transcricao_texto: string | null;
  gravacao_arquivo_nome: string | null;
  ata_enviada: boolean;
  assuntos_proxima: string | null;
  participantes_confirmados: string[];
  created_at?: string;
  updated_at?: string;
}

export async function fetchGestao(
  reuniaoId: string
): Promise<{ data: ReuniaoGestaoRow | null; error: string | null }> {
  if (!supabase)
    return { data: null, error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("reuniao_gestao")
    .select("*")
    .eq("reuniao_id", reuniaoId)
    .maybeSingle();

  if (error) {
    console.error("[gestaoReuniao] fetchGestao:", error);
    return { data: null, error: error.message };
  }
  const row = data as ReuniaoGestaoRow | null;
  if (row && !Array.isArray(row.participantes_confirmados)) {
    row.participantes_confirmados = [];
  }
  return { data: row ?? null, error: null };
}

export async function upsertGestao(
  reuniaoId: string,
  partial: Partial<{
    documentos_count: number;
    transcricao_texto: string | null;
    gravacao_arquivo_nome: string | null;
    ata_enviada: boolean;
    assuntos_proxima: string | null;
    participantes_confirmados: string[];
  }>
): Promise<{ error: string | null }> {
  if (!supabase)
    return { error: "Supabase não configurado" };

  const { data: existing } = await supabase
    .from("reuniao_gestao")
    .select("*")
    .eq("reuniao_id", reuniaoId)
    .maybeSingle();

  const prev = (existing as ReuniaoGestaoRow | null) ?? {
    reuniao_id: reuniaoId,
    documentos_count: 0,
    transcricao_texto: null,
    gravacao_arquivo_nome: null,
    ata_enviada: false,
    assuntos_proxima: null,
    participantes_confirmados: [],
  };

  const payload = {
    reuniao_id: reuniaoId,
    documentos_count: partial.documentos_count ?? prev.documentos_count ?? 0,
    transcricao_texto: partial.transcricao_texto !== undefined ? partial.transcricao_texto : prev.transcricao_texto,
    gravacao_arquivo_nome: partial.gravacao_arquivo_nome !== undefined ? partial.gravacao_arquivo_nome : prev.gravacao_arquivo_nome,
    ata_enviada: partial.ata_enviada ?? prev.ata_enviada ?? false,
    assuntos_proxima: partial.assuntos_proxima !== undefined ? partial.assuntos_proxima : prev.assuntos_proxima,
    participantes_confirmados: partial.participantes_confirmados ?? prev.participantes_confirmados ?? [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("reuniao_gestao")
    .upsert(payload, { onConflict: "reuniao_id" });

  if (error) {
    console.error("[gestaoReuniao] upsertGestao:", error);
    return { error: error.message };
  }
  return { error: null };
}

// --- reuniao_tarefas ---
export interface TarefaRow {
  id: string;
  reuniao_id: string;
  nome: string;
  responsavel: string;
  data_conclusao: string | null;
  created_at?: string;
}

export async function fetchTarefas(
  reuniaoId: string
): Promise<{ data: TarefaRow[]; error: string | null }> {
  if (!supabase)
    return { data: [], error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("reuniao_tarefas")
    .select("*")
    .eq("reuniao_id", reuniaoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[gestaoReuniao] fetchTarefas:", error);
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as TarefaRow[], error: null };
}

export async function insertTarefa(p: {
  reuniao_id: string;
  nome: string;
  responsavel: string;
  data_conclusao?: string | null;
}): Promise<{ data: TarefaRow | null; error: string | null }> {
  if (!supabase)
    return { data: null, error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("reuniao_tarefas")
    .insert({
      reuniao_id: p.reuniao_id,
      nome: p.nome,
      responsavel: p.responsavel,
      data_conclusao: p.data_conclusao || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[gestaoReuniao] insertTarefa:", error);
    return { data: null, error: error.message };
  }
  return { data: data as TarefaRow, error: null };
}

export async function deleteTarefa(
  tarefaId: string
): Promise<{ error: string | null }> {
  if (!supabase)
    return { error: "Supabase não configurado" };

  const { error } = await supabase
    .from("reuniao_tarefas")
    .delete()
    .eq("id", tarefaId);

  if (error) {
    console.error("[gestaoReuniao] deleteTarefa:", error);
    return { error: error.message };
  }
  return { error: null };
}
