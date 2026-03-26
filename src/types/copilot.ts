// ============================================================================
// TIPOS PARA O COPILOTO IA-FIRST DE GOVERNANÇA ESTRATÉGICA
// ============================================================================

// --------------------------------------------------------------------------
// AGENDA GERADA POR IA
// --------------------------------------------------------------------------

export type AgendaStatus = 'pending' | 'approved' | 'rejected' | 'archived';
export type TopicCategory = 'strategic' | 'risk' | 'opportunity' | 'governance' | 'operational';
export type TopicPriority = 'critical' | 'high' | 'medium' | 'low';
export type TopicStatus = 'suggested' | 'approved' | 'in_preparation' | 'discussed' | 'rejected';

export interface AgendaTopic {
  id: string;
  title: string;
  category: TopicCategory;
  priority: TopicPriority;
  estimatedDuration: number; // minutos
  rationale: string;
  relatedData: {
    risks: string[];
    opportunities: string[];
    externalFactors: string[];
    internalTriggers: string[];
  };
  suggestedActions: string[];
  preparationMaterials: string[];
  assignedTo?: string;
  status: TopicStatus;
  displayOrder: number;
}

export interface PriorityMatrix {
  mustDiscuss: string[]; // topicIds
  shouldDiscuss: string[];
  couldDiscuss: string[];
  futureTopics: string[];
}

export interface GeneratedAgenda {
  id: string;
  companyId: string;
  meetingDate: string;
  meetingId?: string;
  status: AgendaStatus;
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  topics: AgendaTopic[];
  priorityMatrix: PriorityMatrix;
  marketContext: string;
  riskAlerts: string[];
  opportunityHighlights: string[];
  generationMetadata?: {
    model: string;
    tokensUsed: number;
    generationTimeMs: number;
  };
}

// --------------------------------------------------------------------------
// BRIEFING DO MEMBRO
// --------------------------------------------------------------------------

export interface TopicBriefing {
  topicId: string;
  title: string;
  relevanceToMember: string;
  keyPoints: string[];
  yourPerspectiveMatters: string;
  potentialConcerns: string[];
  suggestedStance: string;
}

export interface MemberBriefingContent {
  executiveSummary: string;
  topicBreakdown: TopicBriefing[];
  criticalQuestions: string[];
  preparationChecklist: string[];
  estimatedReadingTime: number; // minutos
  relatedDocuments: string[];
}

export interface MemberBriefing {
  id: string;
  memberId: string;
  meetingId: string;
  agendaId?: string;
  content: MemberBriefingContent;
  readAt?: string;
  readingTimeSeconds?: number;
  preparationProgress: number; // 0-100
  generatedAt: string;
}

// --------------------------------------------------------------------------
// SWOT DINÂMICA
// --------------------------------------------------------------------------

export type SWOTImpact = 'high' | 'medium' | 'low';
export type SWOTTrend = 'improving' | 'worsening' | 'stable';
export type SWOTDataSource = 'internal' | 'external' | 'mixed';
export type SWOTTriggerSource = 'weekly' | 'pre_meeting' | 'manual' | 'risk_update' | 'esg_update';
export type SWOTChangeType = 'new' | 'improved' | 'worsened' | 'resolved';
export type SWOTCategory = 'strength' | 'weakness' | 'opportunity' | 'threat';

export interface SWOTItem {
  id: string;
  title: string;
  description: string;
  impact: SWOTImpact;
  trend: SWOTTrend;
  dataSource: SWOTDataSource;
  relatedMetrics: string[];
  lastUpdated: string;
}

export interface SWOTChange {
  type: SWOTChangeType;
  category: SWOTCategory;
  item: string;
  explanation: string;
}

export interface DynamicSWOT {
  id: string;
  companyId: string;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  strategicRecommendations: string[];
  changesSinceLastWeek: SWOTChange[];
  triggerSource: SWOTTriggerSource;
  generatedAt: string;
}

// --------------------------------------------------------------------------
// INTERAÇÕES COM IA
// --------------------------------------------------------------------------

export type InteractionType = 'question' | 'deep_dive' | 'scenario_comparison' | 'topic_study';

export interface AIInteraction {
  id: string;
  memberId: string;
  companyId: string;
  interactionType: InteractionType;
  context: {
    question?: string;
    topicId?: string;
    meetingId?: string;
  };
  aiResponse: {
    content: string;
    sources?: string[];
    confidence?: number;
  };
  meetingId?: string;
  agendaTopicId?: string;
  helpful?: boolean;
  feedbackText?: string;
  responseTimeMs?: number;
  tokensUsed?: number;
  modelUsed?: string;
  createdAt: string;
}

// --------------------------------------------------------------------------
// REUNIÃO SIMPLIFICADA (para contexto)
// --------------------------------------------------------------------------

export interface UpcomingMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  councilName: string;
  councilId: string;
  type: 'ordinary' | 'extraordinary';
  location?: string;
  modalidade: 'presencial' | 'virtual' | 'hibrido';
  hasGeneratedAgenda: boolean;
  agendaId?: string;
  aiGenerated?: boolean; // Pauta sugerida pela IA
}

// --------------------------------------------------------------------------
// REQUEST/RESPONSE TYPES
// --------------------------------------------------------------------------

export interface GenerateAgendaRequest {
  companyId: string;
  meetingDate: string;
  meetingType: 'ordinary' | 'extraordinary';
  previousTopicsIds?: string[];
  forceRegenerate?: boolean;
}

export interface GenerateBriefingRequest {
  memberId: string;
  meetingId: string;
  agendaId: string;
  forceRegenerate?: boolean;
}

export interface GenerateSWOTRequest {
  companyId: string;
  triggerSource: SWOTTriggerSource;
}




