export type RevisionSuggestionStatus = 'pending' | 'accepted' | 'rejected' | 'modified';

export type ATASectionType = 
  | 'header'
  | 'participants'
  | 'agenda'
  | 'deliberations'
  | 'actions'
  | 'closing'
  | 'other';

export interface ATARevisionSuggestion {
  id: string;
  meetingId: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  section: ATASectionType;
  sectionLabel: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  status: RevisionSuggestionStatus;
  adminResponse?: string;
  finalText?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface ATAVersion {
  id: string;
  meetingId: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
  suggestionsApplied: string[];
}

export const ATA_SECTIONS: { value: ATASectionType; label: string }[] = [
  { value: 'header', label: 'Cabeçalho / Identificação' },
  { value: 'participants', label: 'Lista de Participantes' },
  { value: 'agenda', label: 'Pauta / Ordem do Dia' },
  { value: 'deliberations', label: 'Deliberações / Discussões' },
  { value: 'actions', label: 'Encaminhamentos / Ações' },
  { value: 'closing', label: 'Encerramento' },
  { value: 'other', label: 'Outro' },
];
