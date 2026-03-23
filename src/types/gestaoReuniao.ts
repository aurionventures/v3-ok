/** Reunião para gestão: dados mínimos para checklist e geração de pauta/ATA */
export interface ReuniaoGestao {
  id: string;
  titulo: string;
  data_reuniao?: string;
  tipo?: string;
  status?: string;
  /** IDs ou dados de pautas vinculadas */
  pautas?: { id: string; titulo: string }[];
  /** Quantidade de documentos prévios enviados */
  documentos_previos_count?: number;
  /** URL ou indicação de gravação disponível */
  gravacao_url?: string | null;
  /** Participantes confirmados */
  participantes_confirmados?: string[];
}

/** Checklist para habilitar "Gerar pauta com IA" / ATA */
export interface ChecklistReuniao {
  statusConcluido: boolean;
  temPauta: boolean;
  temDocumentosPrevios: boolean;
  temGravacao: boolean;
  participantesConfirmados: boolean;
}

export function deriveChecklist(r: ReuniaoGestao): ChecklistReuniao {
  const statusConcluido =
    (r.status ?? "").toLowerCase() === "concluída" ||
    (r.status ?? "").toLowerCase() === "realizada";
  return {
    statusConcluido,
    temPauta: (r.pautas?.length ?? 0) > 0,
    temDocumentosPrevios: (r.documentos_previos_count ?? 0) > 0,
    temGravacao: !!r.gravacao_url,
    participantesConfirmados: (r.participantes_confirmados?.length ?? 0) > 0,
  };
}

export function allChecksDone(c: ChecklistReuniao): boolean {
  return (
    c.statusConcluido &&
    c.temPauta &&
    c.temDocumentosPrevios &&
    c.temGravacao &&
    c.participantesConfirmados
  );
}
