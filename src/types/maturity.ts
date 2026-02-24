export interface CompanyData {
  numero: string;
  texto: string;
  tipo: 'multipla_escolha_unica' | 'numerico' | 'texto';
  opcoes: string[];
}

export interface Question {
  numero: string;
  dimensao: string;
  indicador: string | null;
  texto: string;
  tipo: 'multipla_escolha_unica' | 'multipla_escolha_multipla' | 'numerico' | 'numerico_multiplo' | 'texto' | 'matriz';
  opcoes: string[];
  referencia?: string;
}

export interface MaturityStructure {
  dimensoes: Record<string, { nome: string; peso: number }>;
  indicadores: Record<string, { dimensao: string; nome: string; peso: number; questoes: string[] }>;
  empresas_familiares: Record<string, { tema: string; peso: number }>;
}

export interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

export interface MaturityResult {
  pontuacao_total: number;
  estagio: string;
  pontuacao_dimensoes: Record<string, number>;
  pontuacao_indicadores: Record<string, number>;
  pontuacao_empresas_familiares?: { percentual: number };
}

export interface UserAnswers {
  companyData: Record<string, string | string[] | number>;
  questions: Record<string, string | string[] | number>;
}