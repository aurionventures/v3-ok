/** Reunião conforme tabela reunioes no Supabase */
export interface ReuniaoRow {
  id: string;
  empresa_id: string | null;
  conselho_id: string | null;
  comite_id: string | null;
  comissao_id: string | null;
  titulo: string;
  data_reuniao: string | null;
  horario: string | null;
  tipo: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

/** Reunião enriquecida com nomes dos órgãos (para exibição) */
export interface ReuniaoEnriquecida extends ReuniaoRow {
  conselho_nome?: string | null;
  comite_nome?: string | null;
  comissao_nome?: string | null;
}

export interface ReuniaoInsert {
  empresa_id: string;
  conselho_id?: string | null;
  comite_id?: string | null;
  comissao_id?: string | null;
  titulo: string;
  data_reuniao: string;
  horario?: string | null;
  tipo: string;
  status?: string;
}
