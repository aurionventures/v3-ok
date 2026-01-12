export interface AgendaAnual {
  year: number;
  meetings: MeetingSchedule[];
  settings: {
    ordinaryMeetingsPerYear: number;
    defaultDuration: number;
    reminderDays: number;
  };
}

export interface MeetingSchedule {
  id: string;
  council: string;
  council_id?: string;  // ID do órgão
  organ_type?: 'conselho' | 'comite' | 'comissao';  // Tipo de órgão
  date: string;
  time: string;
  type: "Ordinária" | "Extraordinária";
  status: "Agendada" | "Pauta Definida" | "Docs Enviados" | "Realizada" | "ATA Gerada";
  agenda?: AgendaItem[];
  preMeetingDocs?: CouncilDocument[];
  recording?: {
    type: "audio" | "video" | "transcript";
    url: string;
    uploadedAt: string;
  };
  minutes?: {
    full: string; // ATA integral
    summary: string; // ATA otimizada
    generatedAt: string;
  };
  tasks?: Task[];
  meeting_tasks?: MeetingTask[];
  meeting_documents?: MeetingDocument[];
  ata?: MeetingATA;
  nextMeetingTopics?: string[];
  attendees?: string[];
  location?: string;
  modalidade: "Presencial" | "Online" | "Híbrida" | "Virtual";
  participants?: MeetingParticipant[];
  confirmed_participants?: number;
  notifications_sent?: boolean;
  ai_generated_agenda?: boolean; // Pauta sugerida pela IA
}

export interface MeetingParticipant {
  id: string;
  user_id?: string;
  external_name?: string;
  external_email?: string;
  external_phone?: string;
  role: 'MEMBRO' | 'CONVIDADO' | 'OBSERVADOR';
  can_upload: boolean;
  can_view_materials: boolean;
  can_comment: boolean;
  guest_token?: string;
  guest_link?: string;
  confirmed: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  presenter: string;
  duration: number; // em minutos
  order: number;
  type: "Deliberação" | "Informativo" | "Discussão";
  keyPoints: string[];
  detailedScript: string;
  expectedOutcome: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: "Pendente" | "Em Andamento" | "Concluída";
  priority: "Baixa" | "Média" | "Alta";
  category: string;
  createdAt: string;
}

export interface MeetingTask {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: "Pendente" | "Em Andamento" | "Concluída";
}

export interface MeetingDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface MeetingATA {
  id: string;
  summary: string;
  decisions: string[];
  generatedAt: string;
  generatedBy: string;
  uploadedFile?: {
    name: string;
    url: string;
    uploadedAt: string;
  };
}

export interface CouncilDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  tags: DocumentTag[];
  category: DocumentCategory;
}

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

export type DocumentCategory = 
  | "Relatório"
  | "Proposta" 
  | "Análise"
  | "Apresentação"
  | "Ata"
  | "Regulamento"
  | "Outros";

export interface MeetingAnalysis {
  agendaCoverage: AgendaCoverageReport;
  suggestedNextTopics: string[];
  missedTopics: string[];
  generatedAt: string;
}

export interface AgendaCoverageReport {
  totalItems: number;
  discussedItems: number;
  coveragePercentage: number;
  itemDetails: AgendaItemCoverage[];
}

export interface AgendaItemCoverage {
  itemId: string;
  title: string;
  wasDiscussed: boolean;
  discussionQuality: "Completa" | "Parcial" | "Superficial" | "Não Discutida";
  timeSpent: number;
}
