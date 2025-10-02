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
  nextMeetingTopics?: string[];
  attendees?: string[];
  location?: string;
  modalidade: "Presencial" | "Online" | "Híbrida";
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