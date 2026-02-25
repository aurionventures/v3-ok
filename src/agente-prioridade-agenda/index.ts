/**
 * Agente que calcula priority scores e prioriza temas para agenda do conselho.
 */

export const AGENTE_PRIORIDADE_AGENDA_ID = "agente-prioridade-agenda";

export interface TemaAgenda {
  id: string;
  titulo: string;
  descricao?: string;
  fonte?: string;
  urgencia?: "alta" | "media" | "baixa";
  impacto?: "alto" | "medio" | "baixo";
}

export interface TemaPriorizado extends TemaAgenda {
  priorityScore: number;
  justificativa: string;
  ordemSugerida: number;
}

export interface EntradaPriorizacao {
  temas: TemaAgenda[];
  contexto?: { reuniaoAnterior?: string; diretrizes?: string[] };
}

/**
 * Calcula scores de prioridade e ordena temas para a agenda.
 */
export function priorizarTemasAgenda(_entrada: EntradaPriorizacao): Promise<TemaPriorizado[]> {
  return Promise.resolve([]);
}
