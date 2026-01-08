// Tipos para o Módulo de Desempenho do Conselho

export type PeriodType = 'quarterly' | 'semiannual' | 'annual';
export type PeriodStatus = 'draft' | 'active' | 'closed' | 'archived';
export type EvaluationType = 'self' | 'peer' | 'president' | 'secretariat';
export type EvaluationStatus = 'pending' | 'in_progress' | 'completed';
export type PerformanceLevel = 'exceptional' | 'above_expectations' | 'meets_expectations' | 'below_expectations' | 'critical';

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
  // Score
  automatic_score: number;
  calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface BoardMemberEvaluation {
  id: string;
  period_id: string;
  member_id: string;
  evaluator_id?: string;
  evaluation_type: EvaluationType;
  // Scores (1-5)
  strategic_vision_score?: number;
  technical_knowledge_score?: number;
  communication_score?: number;
  collaboration_score?: number;
  leadership_score?: number;
  ethics_score?: number;
  // Qualitativo
  strengths?: string;
  areas_for_improvement?: string;
  recommendations?: string;
  general_comments?: string;
  qualitative_score?: number;
  status: EvaluationStatus;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BoardMemberPerformance {
  id: string;
  period_id: string;
  member_id: string;
  council_id: string;
  // Scores por Dimensão
  presence_score: number;
  contribution_score: number;
  delivery_score: number;
  engagement_score: number;
  leadership_score: number;
  // Consolidados
  automatic_score: number;
  qualitative_score: number;
  final_score: number;
  performance_level?: PerformanceLevel;
  rank_in_council?: number;
  ai_recommendations?: string;
  pdi_suggestions?: string[];
  finalized_at?: string;
  finalized_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BoardEvaluationConfig {
  id: string;
  company_id: string;
  // Pesos métricas automáticas
  weight_presence: number;
  weight_contribution: number;
  weight_delivery: number;
  weight_engagement: number;
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
  created_at: string;
  updated_at: string;
}

// Labels e helpers
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

// Tipo para dados combinados com membro
export interface MemberPerformanceWithDetails extends BoardMemberPerformance {
  member_name: string;
  member_role: string;
  council_name: string;
  metrics?: BoardMemberMetrics;
}

// Tipo para dashboard geral
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
