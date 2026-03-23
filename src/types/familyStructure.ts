/** Empresa vinculada a um membro da família */
export interface FamilyMemberCompany {
  name: string;
  role: string;
  shareholding: string;
}

/** Contato do membro da família */
export interface FamilyMemberContact {
  email: string;
  phone: string;
}

/** Registro do banco estrutura_familiar */
export interface FamilyMemberRow {
  id: string;
  empresa_id: string;
  nome: string | null;
  parentesco: string | null;
  idade: number | null;
  geracao: string | null;
  papel: string | null;
  envolvimento: string | null;
  status: string | null;
  imagem_url: string | null;
  participacao_societaria: string | null;
  formacao: string | null;
  experiencia: string | null;
  email: string | null;
  telefone: string | null;
  empresas: FamilyMemberCompany[] | null;
  created_at: string;
  updated_at: string;
}

/** Formato usado na UI (mapeado do banco) */
export interface FamilyMember {
  id: string;
  name: string;
  age: number | null;
  generation: string | null;
  role: string | null;
  involvement: string | null;
  status: string;
  imageSrc: string | null;
  shareholding: string | null;
  education: string | null;
  experience: string | null;
  contact: FamilyMemberContact;
  companies: FamilyMemberCompany[];
}

/** Dados para inserir no banco */
export interface FamilyMemberInsert {
  empresa_id: string;
  nome: string;
  parentesco?: string | null;
  idade?: number | null;
  geracao?: string | null;
  papel?: string | null;
  envolvimento?: string | null;
  status?: string | null;
  imagem_url?: string | null;
  participacao_societaria?: string | null;
  formacao?: string | null;
  experiencia?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresas?: FamilyMemberCompany[] | null;
}

/** Dados para atualizar no banco */
export interface FamilyMemberUpdate {
  nome?: string;
  parentesco?: string | null;
  idade?: number | null;
  geracao?: string | null;
  papel?: string | null;
  envolvimento?: string | null;
  status?: string | null;
  imagem_url?: string | null;
  participacao_societaria?: string | null;
  formacao?: string | null;
  experiencia?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresas?: FamilyMemberCompany[] | null;
}
