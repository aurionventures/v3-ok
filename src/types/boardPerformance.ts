// Tipos para o Módulo de Desempenho do Conselho - Board Performance 2.0

export type PeriodType = 'quarterly' | 'semiannual' | 'annual';
export type PeriodStatus = 'draft' | 'active' | 'closed' | 'archived';
export type EvaluationType = 'self' | 'peer' | 'president' | 'secretariat';
export type EvaluationStatus = 'draft' | 'pending' | 'in_progress' | 'submitted' | 'reviewed';
export type PerformanceLevel = 'exceptional' | 'above_expectations' | 'meets_expectations' | 'below_expectations' | 'critical';
export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'improving' | 'declining' | 'stable';
export type AlertType = 
  | 'low_attendance' 
  | 'low_engagement' 
  | 'pending_actions'
  | 'delayed_responses' 
  | 'critical_performance' 
  | 'declining_trend'
  | 'missing_evaluation' 
  | 'briefing_not_read' 
  | 'low_preparation';
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
export type PDIStatus = 'draft' | 'active' | 'in_progress' | 'completed' | 'archived';
export type PDIActionType = 'course' | 'mentoring' | 'practice' | 'reading' | 'project';
export type GapPriority = 'high' | 'medium' | 'low';

// ================== PERÍODO DE AVALIAÇÃO ==================

export interface BoardEvaluationPeriod {
  id: string;
  company_id: string;
  name: string;
  period_type: PeriodType;
  start_date: string;
  end_date: string;
  status: PeriodStatus;
  self_evaluation_deadline?: string;
  peer_evaluation_deadline?: string;
  president_evaluation_deadline?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ================== MÉTRICAS DE ENGAJAMENTO ==================

export interface MemberEngagementMetrics {
  id: string;
  member_id: string;
  company_id: string;
  council_id?: string;
  period_id?: string;
  
  // Portal do Membro
  briefings_received: number;
  briefings_read: number;
  briefings_read_complete: number;
  avg_briefing_reading_time_seconds?: number;
  preparation_checklist_completion_rate?: number;
  
  // Copiloto IA
  copilot_questions_asked: number;
  copilot_deep_dives: number;
  copilot_scenario_comparisons: number;
  copilot_helpful_ratings: number;
  copilot_avg_session_duration_seconds?: number;
  
  // Materiais de Preparação
  documents_downloaded: number;
  documents_viewed: number;
  materials_reviewed_before_meeting: number;
  
  // Reuniões
  meetings_scheduled: number;
  meetings_attended: number;
  meetings_arrived_on_time: number;
  avg_meeting_duration_minutes?: number;
  
  // Pautas e Deliberações
  agenda_items_reviewed: number;
  agenda_items_contributed: number;
  deliberations_participated: number;
  deliberations_abstained: number;
  
  // Tarefas e Ações
  actions_assigned: number;
  actions_completed: number;
  actions_completed_on_time: number;
  actions_overdue: number;
  avg_action_completion_days?: number;
  
  // Votações e Aprovações
  votes_requested: number;
  votes_responded: number;
  avg_vote_response_time_hours?: number;
  
  // Documentos e Contribuições
  documents_uploaded: number;
  documents_approved: number;
  comments_made: number;
  suggestions_submitted: number;
  
  // Atividade no Sistema
  logins_count: number;
  total_time_active_minutes: number;
  features_used_count: number;
  last_active_at?: string;
  
  // Período de Referência
  measurement_start_date: string;
  measurement_end_date: string;
  
  created_at: string;
  updated_at: string;
}

// ================== AVALIAÇÕES 360° ==================

export interface BoardEvaluation {
  id: string;
  period_id: string;
  evaluator_id: string;
  evaluated_id: string;
  evaluation_type: EvaluationType;
  status: EvaluationStatus;
  submitted_at?: string;
  reviewed_at?: string;
  
  // Scores Qualitativos (0-100)
  strategic_thinking_score?: number;
  decision_quality_score?: number;
  leadership_score?: number;
  collaboration_score?: number;
  ethics_integrity_score?: number;
  communication_score?: number;
  
  // Feedback Qualitativo
  strengths: string[];
  areas_for_improvement: string[];
  specific_examples?: string;
  development_suggestions: string[];
  
  // Perguntas Abertas
  most_valuable_contribution?: string;
  biggest_challenge?: string;
  support_needed?: string;
  
  // Confidencialidade
  is_anonymous: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface EvaluationScores {
  strategic_thinking: number;
  decision_quality: number;
  leadership: number;
  collaboration: number;
  ethics_integrity: number;
  communication: number;
}

export interface EvaluationFeedback {
  strengths: string[];
  areas_for_improvement: string[];
  specific_examples: string;
  development_suggestions: string[];
  most_valuable_contribution: string;
  biggest_challenge: string;
  support_needed: string;
}

// ================== PDI - PLANO DE DESENVOLVIMENTO INDIVIDUAL ==================

export interface CompetencyGap {
  competency: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: GapPriority;
  evidenceFrom: string[];
}

export interface DevelopmentGoal {
  id: string;
  goal: string;
  competency: string;
  metrics: string[];
  targetDate: string;
  priority: number;
  progress?: number;
}

export interface PDIAction {
  id: string;
  action: string;
  type: PDIActionType;
  estimatedHours: number;
  deadline: string;
  relatedGoals: string[];
  completed?: boolean;
  completedAt?: string;
}

export interface RecommendedCourse {
  title: string;
  provider: string;
  duration: string;
  url?: string;
  relevantFor: string[];
}

export interface RecommendedReading {
  title: string;
  author: string;
  type: 'book' | 'article' | 'whitepaper';
  relevantFor: string;
}

export interface MemberPDIPlan {
  id: string;
  member_id: string;
  company_id: string;
  period_id?: string;
  
  // Análise de Gaps
  identified_gaps: CompetencyGap[];
  gap_analysis_summary?: string;
  
  // Objetivos de Desenvolvimento
  development_goals: DevelopmentGoal[];
  priority_areas: string[];
  
  // Ações Recomendadas
  recommended_actions: PDIAction[];
  
  // Timeline
  start_date: string;
  target_completion_date: string;
  review_frequency: 'monthly' | 'quarterly' | 'semiannual';
  
  // Recursos
  recommended_courses: RecommendedCourse[];
  recommended_mentors: string[];
  recommended_readings: RecommendedReading[];
  
  // Status e Progresso
  status: PDIStatus;
  progress_percentage: number;
  
  // IA Metadata
  generated_by_ai: boolean;
  ai_confidence_score?: number;
  ai_model_used?: string;
  ai_generation_date?: string;
  
  // Aprovação
  approved_by?: string;
  approved_at?: string;
  
  // Notas
  member_notes?: string;
  manager_notes?: string;
  
  created_at: string;
  updated_at: string;
}

// ================== ALERTAS PREDITIVOS ==================

export interface PerformanceAlert {
  id: string;
  member_id: string;
  member_name: string;
  company_id: string;
  period_id?: string;
  
  alert_type: AlertType;
  severity: AlertSeverity;
  
  title: string;
  description: string;
  metric_value?: number;
  threshold_value?: number;
  
  related_metrics?: Record<string, number>;
  trend_direction?: TrendDirection;
  days_in_trend?: number;
  
  recommended_actions: string[];
  auto_generated: boolean;
  
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  
  notification_sent: boolean;
  notification_sent_at?: string;
  
  created_at: string;
  updated_at: string;
}

// ================== PREDIÇÃO DE RISCO ==================

export interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  metric: string;
  currentValue: number;
  thresholdValue: number;
}

export interface MemberRiskPrediction {
  memberId: string;
  memberName: string;
  memberRole: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  riskLevel: RiskLevel;
  
  riskFactors: RiskFactor[];
  
  trends: {
    attendance: TrendDirection;
    engagement: TrendDirection;
    delivery: TrendDirection;
    preparation: TrendDirection;
  };
  
  recommendedAlerts: {
    type: AlertType;
    severity: AlertSeverity;
    message: string;
  }[];
  
  preventiveActions: string[];
}

// ================== PERFORMANCE CONSOLIDADA ==================

export interface BoardMemberMetrics {
  id: string;
  period_id: string;
  member_id: string;
  council_id: string;
  
  // Presença
  meetings_scheduled: number;
  meetings_attended: number;
  attendance_rate: number;
  
  // Contribuição
  items_presented: number;
  suggestions_made: number;
  contribution_score: number;
  
  // Entrega
  actions_assigned: number;
  actions_completed: number;
  actions_on_time: number;
  delivery_rate: number;
  
  // Engajamento
  approvals_requested: number;
  approvals_responded: number;
  avg_response_time_hours: number;
  engagement_score: number;
  
  // Novos: Preparação e Copiloto
  briefing_read_rate?: number;
  preparation_score?: number;
  copilot_engagement_score?: number;
  
  // Score
  automatic_score: number;
  calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface BoardMemberPerformance {
  id: string;
  period_id: string;
  member_id: string;
  council_id: string;
  
  // Scores por Dimensão (0-100)
  presence_score: number;
  contribution_score: number;
  delivery_score: number;
  engagement_score: number;
  leadership_score: number;
  
  // Novos Scores
  preparation_score?: number;
  copilot_engagement_score?: number;
  quality_of_contribution_score?: number;
  strategic_alignment_score?: number;
  
  // Consolidados
  automatic_score: number;
  qualitative_score: number;
  final_score: number;
  
  performance_level?: PerformanceLevel;
  rank_in_council?: number;
  
  // Tendências
  trend_direction?: TrendDirection;
  trend_change_percentage?: number;
  
  // Risco Preditivo
  risk_level?: RiskLevel;
  predicted_next_score?: number;
  prediction_confidence?: number;
  
  // Recomendações
  ai_recommendations?: string;
  pdi_suggestions?: string[];
  
  finalized_at?: string;
  finalized_by?: string;
  created_at: string;
  updated_at: string;
}

// ================== TIPOS COMPOSTOS ==================

export interface MemberPerformanceWithDetails extends BoardMemberPerformance {
  member_name: string;
  member_role: string;
  council_name: string;
  metrics?: BoardMemberMetrics;
  engagementMetrics?: MemberEngagementMetrics;
  evaluations?: BoardEvaluation[];
  pdi?: MemberPDIPlan;
  alerts?: PerformanceAlert[];
  prediction?: MemberRiskPrediction;
  // Self-assessment score from member quiz
  self_assessment_score?: number;
  self_assessment_date?: string;
}

export interface CouncilPerformanceSummary {
  council_id: string;
  council_name: string;
  total_members: number;
  avg_score: number;
  top_performer?: {
    member_id: string;
    member_name: string;
    score: number;
  };
  alerts: {
    low_attendance: number;
    pending_actions: number;
    critical_performance: number;
  };
}

export interface EvaluationProgress {
  selfCompleted: number;
  selfTotal: number;
  peerCompleted: number;
  peerTotal: number;
  presidentCompleted: boolean;
  overallCompletion: number;
}

export interface MyEvaluations {
  pending: {
    self?: BoardEvaluation;
    peers: { id: string; name: string; role: string }[];
  };
  completed: {
    self?: BoardEvaluation;
    peers: BoardEvaluation[];
  };
}

export interface HistoricalDataPoint {
  month: string;
  avgScore: number;
  attendance: number;
  engagement: number;
  delivery: number;
  preparation: number;
}

// ================== CONFIGURAÇÃO ==================

export interface BoardEvaluationConfig {
  id: string;
  company_id: string;
  
  // Pesos métricas automáticas
  weight_presence: number;
  weight_contribution: number;
  weight_delivery: number;
  weight_engagement: number;
  weight_preparation: number;
  weight_copilot_engagement: number;
  
  // Peso auto vs quali
  weight_automatic: number;
  weight_qualitative: number;
  
  // Thresholds
  threshold_exceptional: number;
  threshold_above: number;
  threshold_meets: number;
  threshold_below: number;
  
  // Configurações
  enable_self_evaluation: boolean;
  enable_peer_evaluation: boolean;
  enable_president_evaluation: boolean;
  min_peer_evaluations: number;
  
  // Novas Configurações
  enable_ai_pdi: boolean;
  enable_predictive_alerts: boolean;
  alert_threshold_days: number;
  
  created_at: string;
  updated_at: string;
}

// ================== LABELS E HELPERS ==================

export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual'
};

export const PERIOD_STATUS_LABELS: Record<PeriodStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  closed: 'Encerrado',
  archived: 'Arquivado'
};

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, string> = {
  self: 'Autoavaliação',
  peer: 'Avaliação por Pares',
  president: 'Avaliação do Presidente',
  secretariat: 'Avaliação do Secretariado'
};

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  submitted: 'Enviada',
  reviewed: 'Revisada'
};

export const PERFORMANCE_LEVEL_LABELS: Record<PerformanceLevel, string> = {
  exceptional: 'Excepcional',
  above_expectations: 'Acima das Expectativas',
  meets_expectations: 'Atende Expectativas',
  below_expectations: 'Abaixo das Expectativas',
  critical: 'Crítico'
};

export const PERFORMANCE_LEVEL_COLORS: Record<PerformanceLevel, string> = {
  exceptional: 'text-emerald-600 bg-emerald-100',
  above_expectations: 'text-blue-600 bg-blue-100',
  meets_expectations: 'text-amber-600 bg-amber-100',
  below_expectations: 'text-orange-600 bg-orange-100',
  critical: 'text-red-600 bg-red-100'
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  none: 'Sem Risco',
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
  critical: 'Crítico'
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  none: 'text-emerald-600 bg-emerald-100 border-emerald-300',
  low: 'text-blue-600 bg-blue-100 border-blue-300',
  medium: 'text-amber-600 bg-amber-100 border-amber-300',
  high: 'text-orange-600 bg-orange-100 border-orange-300',
  critical: 'text-red-600 bg-red-100 border-red-300'
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  low_attendance: 'Baixa Presença',
  low_engagement: 'Baixo Engajamento',
  pending_actions: 'Ações Pendentes',
  delayed_responses: 'Respostas Atrasadas',
  critical_performance: 'Performance Crítica',
  declining_trend: 'Tendência de Declínio',
  missing_evaluation: 'Avaliação Pendente',
  briefing_not_read: 'Briefing Não Lido',
  low_preparation: 'Baixa Preparação'
};

export const COMPETENCY_LABELS: Record<string, string> = {
  strategic_thinking: 'Pensamento Estratégico',
  decision_quality: 'Qualidade de Decisão',
  leadership: 'Liderança e Influência',
  collaboration: 'Colaboração',
  ethics_integrity: 'Ética e Integridade',
  communication: 'Comunicação',
  time_management: 'Gestão de Tempo',
  preparation: 'Preparação e Estudo',
  execution: 'Execução e Entrega'
};

export const PDI_ACTION_TYPE_LABELS: Record<PDIActionType, string> = {
  course: 'Curso',
  mentoring: 'Mentoria',
  practice: 'Prática',
  reading: 'Leitura',
  project: 'Projeto'
};

export const PDI_STATUS_LABELS: Record<PDIStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  archived: 'Arquivado'
};
