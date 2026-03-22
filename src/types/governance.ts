export type OrgaoTipo = "conselho" | "comite" | "comissao";

export interface ConselhoRow {
  id: string;
  empresa_id: string;
  nome: string;
  tipo: string | null;
  descricao: string | null;
  quorum: number | null;
  nivel: string | null;
  ativo: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ComiteRow {
  id: string;
  empresa_id: string;
  conselho_id: string | null;
  nome: string;
  descricao: string | null;
  tipo: string | null;
  quorum: number | null;
  nivel: string | null;
  ativo: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ComissaoRow {
  id: string;
  empresa_id: string;
  nome: string;
  descricao: string | null;
  tipo: string | null;
  quorum: number | null;
  nivel: string | null;
  ativo: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface MembroGovernancaRow {
  id: string;
  empresa_id: string;
  nome: string;
  cargo_principal: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlocacaoRow {
  id: string;
  membro_id: string;
  conselho_id: string | null;
  comite_id: string | null;
  comissao_id: string | null;
  cargo: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  ativo: boolean | null;
  created_at: string;
}

export interface OrgaoGovernanca {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  quorum: number;
  nivel: string;
  membros: number;
}

export interface MembroComAlocacao {
  id: string;
  nome: string;
  cargoPrincipal: string | null;
  orgaosAlocados: string[];
}

export interface ConselhoInsert {
  empresa_id: string;
  nome: string;
  tipo?: string | null;
  descricao?: string | null;
  quorum?: number | null;
  nivel?: string | null;
}

export interface ComiteInsert {
  empresa_id: string;
  nome: string;
  conselho_id?: string | null;
  descricao?: string | null;
  tipo?: string | null;
  quorum?: number | null;
  nivel?: string | null;
}

export interface ComissaoInsert {
  empresa_id: string;
  nome: string;
  descricao?: string | null;
  tipo?: string | null;
  quorum?: number | null;
  nivel?: string | null;
}

export interface MembroInsert {
  empresa_id: string;
  nome: string;
  cargo_principal?: string | null;
}

export interface AlocacaoInsert {
  membro_id: string;
  conselho_id?: string | null;
  comite_id?: string | null;
  comissao_id?: string | null;
  cargo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
}
