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
  empresas_controle_concentrado: Record<string, { tema: string; peso: number }>;
}

export interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

export interface MaturityResult {
  pontuacao_total: number; // Pontos totais (0-5) para exibição
  pontuacao_total_percentual?: number; // Percentual total (0-100%) conforme manual IBGC
  estagio: string; // Calculado baseado em percentual conforme Tabela 2 do manual IBGC
  pontuacao_dimensoes: Record<string, number>; // Pontos por dimensão (0-5) para exibição
  pontuacao_dimensoes_percentual?: Record<string, number>; // Percentual por dimensão (0-100%)
  pontuacao_indicadores: Record<string, number>; // Pontos por indicador (0-5) para exibição
  pontuacao_indicadores_percentual?: Record<string, number>; // Percentual por indicador (0-100%)
  pontuacao_indicadores_detalhada?: Record<string, { 
    pontos: number; 
    max_pontos: number; 
    pontuacao: number; // Pontos (0-5)
    percentual: number; // Percentual (0-100%)
  }>; // Detalhes dos indicadores
  pontuacao_empresas_controle_concentrado?: { 
    percentual: number; // Percentual (0-100%)
    pontos: number; // Pontos (0-5) para exibição
  };
}

export interface UserAnswers {
  companyData: Record<string, string | string[] | number | object>;
  questions: Record<string, string | string[] | number | object>;
}