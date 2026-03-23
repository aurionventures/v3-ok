/**
 * Leads do diagnóstico de maturidade (landing).
 * Salva dados no CRM para o Super ADM.
 */

import { supabase } from "@/lib/supabase";

export interface LeadDiagnosticoInsert {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  respostas: Record<number, number>;
  scores: Array<{ name: string; score: number; sectorAverage: number; fullMark: number }>;
  nivel_geral: string;
  overall_score: number;
}

export interface LeadDiagnosticoRow {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  respostas: Record<number, number>;
  scores: unknown[];
  nivel_geral: string | null;
  overall_score: number | null;
  created_at: string;
}

export async function insertLeadDiagnostico(
  p: LeadDiagnosticoInsert
): Promise<{ data: { id: string } | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const nome = (p.nome ?? "").trim();
  const email = (p.email ?? "").trim().toLowerCase();
  if (!nome || !email) return { data: null, error: "Nome e e-mail são obrigatórios" };

  const { error } = await supabase
    .from("leads_diagnostico")
    .insert({
      nome,
      email,
      telefone: (p.telefone ?? "").trim() || null,
      empresa: (p.empresa ?? "").trim() || null,
      respostas: p.respostas ?? {},
      scores: p.scores ?? [],
      nivel_geral: p.nivel_geral ?? null,
      overall_score: p.overall_score ?? null,
    });

  if (error) {
    console.error("[leadsDiagnostico] insert:", error);
    return { data: null, error: error.message };
  }
  return { data: { id: "" }, error: null };
}

export interface LeadContatoInsert {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

/** Salva lead do formulário "Ou entre em contato" (landing) no CRM */
export async function insertLeadContato(
  p: LeadContatoInsert
): Promise<{ data: { id: string } | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase não configurado" };
  const nome = (p.nome ?? "").trim();
  const email = (p.email ?? "").trim().toLowerCase();
  if (!nome || !email) return { data: null, error: "Nome e e-mail são obrigatórios" };

  const { error } = await supabase
    .from("leads_diagnostico")
    .insert({
      nome,
      email,
      telefone: (p.telefone ?? "").trim() || null,
      empresa: (p.empresa ?? "").trim() || null,
      respostas: {},
      scores: [],
      nivel_geral: null,
      overall_score: null,
    });

  if (error) {
    console.error("[leadsDiagnostico] insertLeadContato:", error);
    return { data: null, error: error.message };
  }
  return { data: { id: "" }, error: null };
}

/** Lista leads do diagnóstico (Super ADM) */
export async function fetchLeadsDiagnostico(): Promise<{
  data: LeadDiagnosticoRow[];
  error: string | null;
}> {
  if (!supabase) return { data: [], error: "Supabase não configurado" };

  const { data, error } = await supabase
    .from("leads_diagnostico")
    .select("id, nome, email, telefone, empresa, respostas, scores, nivel_geral, overall_score, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[leadsDiagnostico] fetch:", error);
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as LeadDiagnosticoRow[], error: null };
}
