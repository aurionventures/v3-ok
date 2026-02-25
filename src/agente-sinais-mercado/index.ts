/**
 * Agente para coleta de sinais externos de mercado.
 * Monitora fontes externas (regulatório, setorial, concorrência) para governança.
 */

export const AGENTE_SINAIS_MERCADO_ID = "agente-sinais-mercado";

export interface FonteSinal {
  tipo: "regulatorio" | "setorial" | "concorrencia" | "economico" | "esg";
  nome: string;
  url?: string;
}

export interface SinalMercado {
  id: string;
  fonte: FonteSinal;
  titulo: string;
  resumo: string;
  dataColeta: string;
  impactoGovernanca?: "alto" | "medio" | "baixo";
  tags: string[];
}

export interface ConfiguracaoColeta {
  fontes: FonteSinal[];
  periodicidadeHoras: number;
  filtros?: string[];
}

/**
 * Coleta sinais externos conforme configuração (implementação futura com APIs/fonte real).
 */
export function coletarSinaisExternos(_config: ConfiguracaoColeta): Promise<SinalMercado[]> {
  return Promise.resolve([]);
}
