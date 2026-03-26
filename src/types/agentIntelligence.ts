// ============================================================================
// TIPOS PARA ORQUESTRAÇÃO DE INTELIGÊNCIA DO AGENT H
// ============================================================================
// Define interfaces para dados de entrada dos Agentes A, B, C, D
// e payload consolidado para o Orquestrador de Inteligência (Agent H)
// ============================================================================

import { InsightAction } from "@/hooks/usePredictiveInsights";

// ============================================================================
// TIPOS DE FONTE DE AGENTE
// ============================================================================

export type AgentSource = "agent_a" | "agent_b" | "agent_c" | "agent_d";

// ============================================================================
// AGENT A: Coleta & Classificação (Mercado/ESG)
// ============================================================================

export interface MarketThreat {
  id: string;
  title: string;
  category: "macroeconomic" | "sector" | "regulatory" | "geopolitical" | "esg";
  impact: "critical" | "high" | "medium" | "low";
  relevanceScore: number; // 0-100
  source: string;
  date: string;
  summary: string;
  implications: string[];
}

export interface MarketOpportunity {
  id: string;
  title: string;
  category: string;
  potentialValue: "high" | "medium" | "low";
  timeframe: string;
  summary: string;
  requirements: string[];
}

export interface SectorTrend {
  id: string;
  trend: string;
  direction: "positive" | "negative" | "neutral";
  confidence: number; // 0-100
  timeHorizon: "short" | "medium" | "long";
  implications: string;
}

export interface AgentAData {
  marketThreats: MarketThreat[];
  marketOpportunities: MarketOpportunity[];
  sectorTrends: SectorTrend[];
  collectedAt: string;
}

// ============================================================================
// AGENT B: Análise & Padrões (Memória Institucional)
// ============================================================================

export interface HistoricalPattern {
  id: string;
  pattern: string;
  frequency: number; // Número de ocorrências
  firstOccurrence: string;
  lastOccurrence: string;
  status: "resolved" | "ongoing" | "worsening";
  rootCause: string;
  costOfInaction: string;
}

export interface ExecutionGap {
  id: string;
  decision: string;
  decidedAt: string;
  expectedDeadline: string;
  currentStatus: "pending" | "delayed" | "stalled" | "at_risk";
  daysOverdue: number;
  responsible: string;
  blockers: string[];
}

export interface RecurringIssue {
  id: string;
  issue: string;
  occurrences: number;
  averageIntervalDays: number;
  lastSeen: string;
  severity: "critical" | "high" | "medium" | "low";
  suggestedResolution: string;
}

export interface AgentBData {
  historicalPatterns: HistoricalPattern[];
  executionGaps: ExecutionGap[];
  recurringIssues: RecurringIssue[];
  governanceHealthScore: number; // 0-100
  analyzedAt: string;
}

// ============================================================================
// AGENT C: Scoring & Priorização
// ============================================================================

export interface PriorityScore {
  id: string;
  topic: string;
  score: number; // 0-100
  components: {
    urgency: number;
    impact: number;
    exposure: number;
    governance: number;
    strategy: number;
  };
  classification: "critical" | "high" | "medium" | "low";
  suggestedTimeAllocation: number; // minutos
  stakeholders: string[];
}

export interface UrgencyItem {
  id: string;
  item: string;
  urgencyLevel: "immediate" | "30_days" | "60_days" | "90_days";
  deadline: string;
  consequence: string;
  actionRequired: string;
}

export interface AgentCData {
  priorityScores: PriorityScore[];
  urgencyMatrix: UrgencyItem[];
  topPriorities: string[];
  scoredAt: string;
}

// ============================================================================
// AGENT D: Geração de Conteúdo (Contexto de Reuniões)
// ============================================================================

export interface Deliberation {
  id: string;
  topic: string;
  decision: string;
  date: string;
  councilId: string;
  councilName: string;
  status: "approved" | "rejected" | "deferred" | "under_review";
  followUpRequired: boolean;
  relatedRisks: string[];
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  councilName: string;
  date: string;
  agendaTopics: string[];
  criticalDecisions: string[];
}

export interface PendingAction {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "in_progress" | "delayed" | "at_risk";
  meetingOrigin: string;
}

export interface AgentDData {
  recentDeliberations: Deliberation[];
  upcomingMeetings: UpcomingMeeting[];
  pendingActions: PendingAction[];
  contextGeneratedAt: string;
}

// ============================================================================
// PAYLOAD CONSOLIDADO PARA AGENT H (ORQUESTRADOR)
// ============================================================================

export interface RiskData {
  id: number;
  category: string;
  title: string;
  impact: number;
  probability: number;
  status: string;
  controls: string[];
}

export interface OrchestratorPayload {
  // Dados existentes (retrocompatibilidade)
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
  
  // NOVOS: Dados dos agentes especializados
  agentAData?: AgentAData;
  agentBData?: AgentBData;
  agentCData?: AgentCData;
  agentDData?: AgentDData;
  
  // Configuração de prompt (opcional)
  promptConfig?: {
    promptId: string;
    systemPrompt: string;
    userPromptTemplate: string | null;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  } | null;
}

// ============================================================================
// INSIGHTS ENRIQUECIDOS COM FONTES
// ============================================================================

export interface EnhancedStrategicRisk {
  title: string;
  context: string;
  priority: "critical" | "high" | "medium";
  actions: InsightAction;
  sources: AgentSource[];
}

export interface EnhancedOperationalThreat {
  title: string;
  context: string;
  timeframe: "immediate" | "30_days" | "90_days";
  category: string;
  actions: InsightAction;
  sources: AgentSource[];
}

export interface EnhancedStrategicOpportunity {
  title: string;
  context: string;
  actions: InsightAction;
  sources: AgentSource[];
}

export interface EnhancedGovernanceInsights {
  strategicRisks: EnhancedStrategicRisk[];
  operationalThreats: EnhancedOperationalThreat[];
  strategicOpportunities: EnhancedStrategicOpportunity[];
  metadata: {
    generatedAt: string;
    modelUsed: string;
    executionTimeMs: number;
    agentsUsed: AgentSource[];
  };
}

// ============================================================================
// FUNÇÕES AUXILIARES PARA COLETA DE DADOS
// ============================================================================

export function createEmptyAgentAData(): AgentAData {
  return {
    marketThreats: [],
    marketOpportunities: [],
    sectorTrends: [],
    collectedAt: new Date().toISOString(),
  };
}

export function createEmptyAgentBData(): AgentBData {
  return {
    historicalPatterns: [],
    executionGaps: [],
    recurringIssues: [],
    governanceHealthScore: 0,
    analyzedAt: new Date().toISOString(),
  };
}

export function createEmptyAgentCData(): AgentCData {
  return {
    priorityScores: [],
    urgencyMatrix: [],
    topPriorities: [],
    scoredAt: new Date().toISOString(),
  };
}

export function createEmptyAgentDData(): AgentDData {
  return {
    recentDeliberations: [],
    upcomingMeetings: [],
    pendingActions: [],
    contextGeneratedAt: new Date().toISOString(),
  };
}
