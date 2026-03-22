export type Prioridade = "Baixa" | "Média" | "Alta";
export type StatusEntrevista = "pendente" | "agendada" | "realizada";

export interface EntrevistaRow {
  id: string;
  empresa_id: string;
  titulo: string | null;
  data_entrevista: string | null;
  nome_entrevistado: string | null;
  papel: string | null;
  prioridade: string | null;
  status: string | null;
  transcricao: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entrevista {
  id: string;
  nome: string;
  papel: string;
  prioridade: Prioridade;
  status: StatusEntrevista;
  transcricao: string | null;
  dataEntrevista: string | null;
  createdAt: string;
}

export interface EntrevistaInsert {
  empresa_id: string;
  nome_entrevistado: string;
  papel?: string | null;
  prioridade?: string | null;
  status?: string | null;
}
