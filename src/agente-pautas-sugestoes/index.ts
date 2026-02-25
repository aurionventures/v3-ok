/**
 * Agente para geração de sugestões de pautas de reuniões.
 */

export const AGENTE_PAUTAS_SUGESTOES_ID = "agente-pautas-sugestoes";

export interface ContextoReuniao {
  tipoReuniao: string;
  conselho: string;
  periodicidade?: string;
  ultimasPautas?: string[];
}

export interface SugestaoPauta {
  titulo: string;
  descricao: string;
  fundamento: string;
  tempoEstimadoMinutos?: number;
  ordemSugerida?: number;
}

/**
 * Gera sugestões de pautas com base no contexto da reunião.
 */
export function gerarSugestoesPautas(_contexto: ContextoReuniao): Promise<SugestaoPauta[]> {
  return Promise.resolve([]);
}
