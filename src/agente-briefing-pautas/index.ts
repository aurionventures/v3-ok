/**
 * Agente para geração de briefing de pautas.
 * Produz material de apoio para cada pauta (contexto, dados, recomendações).
 */

export const AGENTE_BRIEFING_PAUTAS_ID = "agente-briefing-pautas";

export interface PautaEntrada {
  titulo: string;
  descricao: string;
  documentosRelacionados?: string[];
}

export interface BriefingPauta {
  titulo: string;
  contexto: string;
  pontosChave: string[];
  dadosRelevantes: string[];
  recomendacoes: string[];
  perguntasSugeridas: string[];
  referencias: string[];
}

/**
 * Gera briefing completo para uma ou mais pautas.
 */
export function gerarBriefingPautas(_pautas: PautaEntrada[]): Promise<BriefingPauta[]> {
  return Promise.resolve([]);
}
