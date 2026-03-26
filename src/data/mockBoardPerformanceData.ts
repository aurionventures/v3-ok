// Dados mockados para Board Performance 2.0

import type {
  BoardEvaluation,
  MemberPDIPlan,
  PerformanceAlert,
  MemberRiskPrediction,
  HistoricalDataPoint,
  EvaluationProgress,
  CompetencyGap,
  DevelopmentGoal,
  PDIAction,
  RecommendedCourse,
  RecommendedReading,
} from '@/types/boardPerformance';

// ================== AVALIAÇÕES 360° MOCK ==================

export const mockSelfEvaluation: BoardEvaluation = {
  id: 'eval-self-001',
  period_id: 'current-period',
  evaluator_id: 'current-user',
  evaluated_id: 'current-user',
  evaluation_type: 'self',
  status: 'draft',
  
  strategic_thinking_score: 75,
  decision_quality_score: 80,
  leadership_score: 70,
  collaboration_score: 85,
  ethics_integrity_score: 90,
  communication_score: 78,
  
  strengths: [
    'Forte capacidade analítica',
    'Comunicação clara e objetiva',
    'Comprometimento com ética'
  ],
  areas_for_improvement: [
    'Delegar mais responsabilidades',
    'Participar mais ativamente das discussões estratégicas'
  ],
  development_suggestions: [
    'Curso de liderança executiva',
    'Mentoria com conselheiro sênior'
  ],
  
  is_anonymous: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const mockPeerEvaluations: BoardEvaluation[] = [
  {
    id: 'eval-peer-001',
    period_id: 'current-period',
    evaluator_id: 'member-002',
    evaluated_id: 'current-user',
    evaluation_type: 'peer',
    status: 'submitted',
    submitted_at: '2026-01-05T14:30:00Z',
    
    strategic_thinking_score: 82,
    decision_quality_score: 78,
    leadership_score: 75,
    collaboration_score: 88,
    ethics_integrity_score: 95,
    communication_score: 80,
    
    strengths: [
      'Excelente conhecimento técnico',
      'Sempre preparado para as reuniões',
      'Contribuições valiosas nas discussões'
    ],
    areas_for_improvement: [
      'Poderia ser mais assertivo nas votações',
      'Maior participação em comitês'
    ],
    development_suggestions: [
      'Participar de mais fóruns de governança'
    ],
    
    most_valuable_contribution: 'Análise detalhada do novo projeto de expansão',
    biggest_challenge: 'Adaptação ao formato híbrido das reuniões',
    
    is_anonymous: true,
    created_at: '2026-01-03T10:00:00Z',
    updated_at: '2026-01-05T14:30:00Z'
  }
];

export const mockEvaluationProgress: EvaluationProgress = {
  selfCompleted: 8,
  selfTotal: 12,
  peerCompleted: 45,
  peerTotal: 72,
  presidentCompleted: false,
  overallCompletion: 62
};

export const mockPendingPeerEvaluations = [
  { id: 'member-003', name: 'Maria Santos', role: 'Conselheira Independente' },
  { id: 'member-004', name: 'José Oliveira', role: 'Conselheiro' },
  { id: 'member-005', name: 'Ana Costa', role: 'Conselheira' }
];

// ================== PDI MOCK ==================

export const mockCompetencyGaps: CompetencyGap[] = [
  {
    competency: 'Pensamento Estratégico',
    currentLevel: 72,
    targetLevel: 85,
    gap: 13,
    priority: 'high',
    evidenceFrom: [
      'Score de contribuição 15% abaixo da média',
      'Baixa participação em discussões estratégicas (avaliação 360°)',
      'Poucas pautas propostas no último semestre'
    ]
  },
  {
    competency: 'Preparação e Estudo',
    currentLevel: 65,
    targetLevel: 90,
    gap: 25,
    priority: 'high',
    evidenceFrom: [
      'Taxa de leitura de briefings: 60% (meta: 90%)',
      'Tempo médio de preparação abaixo da média',
      'Feedback de pares sobre falta de aprofundamento'
    ]
  },
  {
    competency: 'Liderança e Influência',
    currentLevel: 70,
    targetLevel: 80,
    gap: 10,
    priority: 'medium',
    evidenceFrom: [
      'Score de liderança em 70/100',
      'Poucas iniciativas de condução de debates',
      'Avaliação do presidente indica potencial não explorado'
    ]
  },
  {
    competency: 'Comunicação',
    currentLevel: 78,
    targetLevel: 85,
    gap: 7,
    priority: 'low',
    evidenceFrom: [
      'Avaliação geral positiva',
      'Pequena melhoria necessária em apresentações formais'
    ]
  }
];

export const mockDevelopmentGoals: DevelopmentGoal[] = [
  {
    id: 'goal-001',
    goal: 'Aumentar taxa de leitura completa de briefings de 60% para 90% nos próximos 3 meses',
    competency: 'Preparação e Estudo',
    metrics: [
      'Taxa de briefings lidos completamente',
      'Perguntas feitas ao Copiloto IA',
      'Tempo médio de preparação por reunião'
    ],
    targetDate: '2026-04-09',
    priority: 1,
    progress: 35
  },
  {
    id: 'goal-002',
    goal: 'Propor pelo menos 2 pautas estratégicas por trimestre para discussão no conselho',
    competency: 'Pensamento Estratégico',
    metrics: [
      'Número de pautas propostas',
      'Pautas aprovadas para discussão',
      'Impacto das decisões resultantes'
    ],
    targetDate: '2026-06-30',
    priority: 2,
    progress: 50
  },
  {
    id: 'goal-003',
    goal: 'Conduzir pelo menos 3 discussões em reunião nos próximos 6 meses',
    competency: 'Liderança e Influência',
    metrics: [
      'Discussões lideradas',
      'Feedback qualitativo dos pares',
      'Score de liderança na próxima avaliação'
    ],
    targetDate: '2026-07-09',
    priority: 3,
    progress: 0
  },
  {
    id: 'goal-004',
    goal: 'Melhorar qualidade das apresentações formais com técnicas de storytelling executivo',
    competency: 'Comunicação',
    metrics: [
      'Avaliação de apresentações',
      'Engajamento da audiência',
      'Clareza das recomendações'
    ],
    targetDate: '2026-05-31',
    priority: 4,
    progress: 20
  }
];

export const mockPDIActions: PDIAction[] = [
  {
    id: 'action-001',
    action: 'Reservar 30 minutos diários antes de cada reunião para leitura de materiais',
    type: 'practice',
    estimatedHours: 10,
    deadline: '2026-01-31',
    relatedGoals: ['goal-001'],
    completed: true,
    completedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'action-002',
    action: 'Fazer pelo menos 3 perguntas ao Copiloto IA por pauta',
    type: 'practice',
    estimatedHours: 5,
    deadline: '2026-02-15',
    relatedGoals: ['goal-001'],
    completed: false
  },
  {
    id: 'action-003',
    action: 'Curso: Strategic Thinking for Board Members (IBGC)',
    type: 'course',
    estimatedHours: 16,
    deadline: '2026-03-31',
    relatedGoals: ['goal-002'],
    completed: false
  },
  {
    id: 'action-004',
    action: 'Mentoria mensal com Carlos Mendes (Presidente do Conselho da XYZ)',
    type: 'mentoring',
    estimatedHours: 12,
    deadline: '2026-06-30',
    relatedGoals: ['goal-002', 'goal-003'],
    completed: false
  },
  {
    id: 'action-005',
    action: 'Leitura: "The Board Book" de Susan Shultz',
    type: 'reading',
    estimatedHours: 8,
    deadline: '2026-02-28',
    relatedGoals: ['goal-002'],
    completed: false
  },
  {
    id: 'action-006',
    action: 'Curso: Executive Presentation Skills (Harvard Online)',
    type: 'course',
    estimatedHours: 8,
    deadline: '2026-04-15',
    relatedGoals: ['goal-004'],
    completed: false
  },
  {
    id: 'action-007',
    action: 'Praticar apresentação com feedback de mentor antes de cada reunião',
    type: 'practice',
    estimatedHours: 10,
    deadline: '2026-05-31',
    relatedGoals: ['goal-004'],
    completed: false
  },
  {
    id: 'action-008',
    action: 'Projeto: Liderar grupo de trabalho sobre ESG',
    type: 'project',
    estimatedHours: 30,
    deadline: '2026-06-30',
    relatedGoals: ['goal-003'],
    completed: false
  }
];

export const mockRecommendedCourses: RecommendedCourse[] = [
  {
    title: 'Strategic Thinking for Board Members',
    provider: 'IBGC',
    duration: '16 horas',
    url: 'https://ibgc.org.br/cursos',
    relevantFor: ['Pensamento Estratégico', 'Liderança']
  },
  {
    title: 'Executive Presentation Skills',
    provider: 'Harvard Business School Online',
    duration: '8 horas',
    url: 'https://online.hbs.edu',
    relevantFor: ['Comunicação']
  },
  {
    title: 'Financial Analysis for Non-Financial Executives',
    provider: 'Coursera / Wharton',
    duration: '20 horas',
    url: 'https://coursera.org/wharton',
    relevantFor: ['Qualidade de Decisão', 'Pensamento Estratégico']
  },
  {
    title: 'Governance Risk & Compliance',
    provider: 'LinkedIn Learning',
    duration: '6 horas',
    url: 'https://linkedin.com/learning',
    relevantFor: ['Ética e Integridade', 'Gestão de Risco']
  }
];

export const mockRecommendedReadings: RecommendedReading[] = [
  {
    title: 'The Board Book',
    author: 'Susan Shultz',
    type: 'book',
    relevantFor: 'Governança e Liderança de Conselho'
  },
  {
    title: 'Good to Great',
    author: 'Jim Collins',
    type: 'book',
    relevantFor: 'Pensamento Estratégico'
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    type: 'book',
    relevantFor: 'Qualidade de Decisão'
  },
  {
    title: 'ESG: The Report',
    author: 'IBGC',
    type: 'whitepaper',
    relevantFor: 'Sustentabilidade e ESG'
  }
];

export const mockMemberPDI: MemberPDIPlan = {
  id: 'pdi-001',
  member_id: 'current-user',
  company_id: 'demo-company',
  period_id: 'current-period',
  
  identified_gaps: mockCompetencyGaps,
  gap_analysis_summary: `A análise identificou que as principais áreas de desenvolvimento estão relacionadas à 
preparação para reuniões e pensamento estratégico. O membro demonstra forte compromisso ético e 
boa colaboração, mas precisa aumentar sua proatividade em propor pautas e liderar discussões.`,
  
  development_goals: mockDevelopmentGoals,
  priority_areas: ['Preparação e Estudo', 'Pensamento Estratégico', 'Liderança e Influência'],
  
  recommended_actions: mockPDIActions,
  
  start_date: '2026-01-09',
  target_completion_date: '2026-07-09',
  review_frequency: 'monthly',
  
  recommended_courses: mockRecommendedCourses,
  recommended_mentors: [
    'Carlos Mendes - Presidente do Conselho XYZ Corp',
    'Ana Paula Ribeiro - Conselheira Sênior IBGC',
    'Roberto Silva - Ex-CEO TechBrasil'
  ],
  recommended_readings: mockRecommendedReadings,
  
  status: 'active',
  progress_percentage: 18,
  
  generated_by_ai: true,
  ai_confidence_score: 87,
  ai_model_used: 'gemini-2.5-flash',
  ai_generation_date: '2026-01-09T10:00:00Z',
  
  member_notes: 'Focando inicialmente na melhoria da preparação para reuniões.',
  
  created_at: '2026-01-09T10:00:00Z',
  updated_at: new Date().toISOString()
};

// ================== ALERTAS PREDITIVOS MOCK ==================

export const mockPerformanceAlerts: PerformanceAlert[] = [
  {
    id: 'alert-001',
    member_id: 'member-007',
    member_name: 'Ricardo Ferreira',
    company_id: 'demo-company',
    period_id: 'current-period',
    
    alert_type: 'declining_trend',
    severity: 'warning',
    
    title: 'Tendência de Declínio na Performance',
    description: 'Score de engajamento caiu 15% nas últimas 8 semanas. Requer atenção.',
    metric_value: 62,
    threshold_value: 70,
    
    trend_direction: 'declining',
    days_in_trend: 56,
    
    recommended_actions: [
      'Agendar reunião 1:1 com o presidente do conselho',
      'Verificar disponibilidade e compromissos externos',
      'Oferecer suporte adicional para preparação'
    ],
    auto_generated: true,
    
    status: 'active',
    notification_sent: true,
    notification_sent_at: '2026-01-08T09:00:00Z',
    
    created_at: '2026-01-08T09:00:00Z',
    updated_at: '2026-01-08T09:00:00Z'
  },
  {
    id: 'alert-002',
    member_id: 'member-009',
    member_name: 'Patrícia Lima',
    company_id: 'demo-company',
    period_id: 'current-period',
    
    alert_type: 'low_preparation',
    severity: 'warning',
    
    title: 'Baixa Taxa de Preparação',
    description: 'Apenas 40% dos briefings foram lidos completamente nos últimos 30 dias.',
    metric_value: 40,
    threshold_value: 75,
    
    recommended_actions: [
      'Enviar lembrete sobre materiais da próxima reunião',
      'Verificar se há dificuldades de acesso ao portal',
      'Considerar formato alternativo de briefings'
    ],
    auto_generated: true,
    
    status: 'active',
    notification_sent: false,
    
    created_at: '2026-01-09T08:00:00Z',
    updated_at: '2026-01-09T08:00:00Z'
  },
  {
    id: 'alert-003',
    member_id: 'member-011',
    member_name: 'Fernando Gomes',
    company_id: 'demo-company',
    period_id: 'current-period',
    
    alert_type: 'pending_actions',
    severity: 'error',
    
    title: 'Ações em Atraso',
    description: '4 ações atribuídas estão vencidas, comprometendo entregas do conselho.',
    metric_value: 4,
    threshold_value: 0,
    
    related_metrics: {
      actions_overdue: 4,
      actions_assigned: 7,
      avg_delay_days: 12
    },
    
    recommended_actions: [
      'Contato urgente para repactuação de prazos',
      'Redistribuir ações críticas se necessário',
      'Avaliar carga de trabalho do membro'
    ],
    auto_generated: true,
    
    status: 'active',
    notification_sent: true,
    notification_sent_at: '2026-01-07T14:00:00Z',
    
    created_at: '2026-01-07T14:00:00Z',
    updated_at: '2026-01-07T14:00:00Z'
  },
  {
    id: 'alert-004',
    member_id: 'member-005',
    member_name: 'Ana Costa',
    company_id: 'demo-company',
    period_id: 'current-period',
    
    alert_type: 'missing_evaluation',
    severity: 'info',
    
    title: 'Avaliação Pendente',
    description: 'Auto-avaliação do período ainda não foi iniciada. Prazo: 15/01/2026.',
    metric_value: 0,
    threshold_value: 1,
    
    recommended_actions: [
      'Enviar lembrete sobre prazo de avaliação',
      'Disponibilizar guia de preenchimento'
    ],
    auto_generated: true,
    
    status: 'active',
    notification_sent: true,
    notification_sent_at: '2026-01-05T10:00:00Z',
    
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z'
  }
];

// ================== PREDIÇÕES DE RISCO MOCK ==================

export const mockRiskPredictions: MemberRiskPrediction[] = [
  {
    memberId: 'member-007',
    memberName: 'Ricardo Ferreira',
    memberRole: 'Conselheiro',
    currentScore: 68,
    predictedScore: 58,
    confidence: 78,
    riskLevel: 'high',
    
    riskFactors: [
      {
        factor: 'Engajamento Declinante',
        impact: 'high',
        description: 'Score de engajamento caiu 15% nas últimas 8 semanas',
        metric: 'engagement_score',
        currentValue: 62,
        thresholdValue: 70
      },
      {
        factor: 'Presença Irregular',
        impact: 'medium',
        description: 'Faltou a 2 das últimas 4 reuniões',
        metric: 'attendance_rate',
        currentValue: 50,
        thresholdValue: 80
      }
    ],
    
    trends: {
      attendance: 'declining',
      engagement: 'declining',
      delivery: 'stable',
      preparation: 'declining'
    },
    
    recommendedAlerts: [
      {
        type: 'declining_trend',
        severity: 'warning',
        message: 'Tendência de declínio identificada. Intervenção recomendada.'
      }
    ],
    
    preventiveActions: [
      'Agendar conversa individual com presidente',
      'Verificar compromissos externos conflitantes',
      'Avaliar necessidade de suporte adicional'
    ]
  },
  {
    memberId: 'member-011',
    memberName: 'Fernando Gomes',
    memberRole: 'Conselheiro',
    currentScore: 55,
    predictedScore: 48,
    confidence: 82,
    riskLevel: 'critical',
    
    riskFactors: [
      {
        factor: 'Entregas Atrasadas',
        impact: 'high',
        description: '4 ações em atraso com média de 12 dias',
        metric: 'actions_overdue',
        currentValue: 4,
        thresholdValue: 0
      },
      {
        factor: 'Baixa Preparação',
        impact: 'high',
        description: 'Taxa de leitura de briefings em 35%',
        metric: 'briefing_read_rate',
        currentValue: 35,
        thresholdValue: 75
      },
      {
        factor: 'Tempo de Resposta Alto',
        impact: 'medium',
        description: 'Média de 72h para responder votações',
        metric: 'avg_response_time_hours',
        currentValue: 72,
        thresholdValue: 24
      }
    ],
    
    trends: {
      attendance: 'stable',
      engagement: 'declining',
      delivery: 'declining',
      preparation: 'declining'
    },
    
    recommendedAlerts: [
      {
        type: 'critical_performance',
        severity: 'critical',
        message: 'Performance em nível crítico. Ação imediata necessária.'
      }
    ],
    
    preventiveActions: [
      'Reunião urgente com secretaria do conselho',
      'Redistribuir ações críticas',
      'Plano de recuperação de 30 dias',
      'Considerar mentoria intensiva'
    ]
  },
  {
    memberId: 'member-002',
    memberName: 'Maria Santos',
    memberRole: 'Conselheira Independente',
    currentScore: 88,
    predictedScore: 90,
    confidence: 85,
    riskLevel: 'none',
    
    riskFactors: [],
    
    trends: {
      attendance: 'stable',
      engagement: 'improving',
      delivery: 'stable',
      preparation: 'improving'
    },
    
    recommendedAlerts: [],
    
    preventiveActions: []
  }
];

// ================== DADOS HISTÓRICOS MOCK ==================

export const mockHistoricalData: HistoricalDataPoint[] = [
  { month: 'Jul/25', avgScore: 72, attendance: 85, engagement: 70, delivery: 68, preparation: 65 },
  { month: 'Ago/25', avgScore: 74, attendance: 87, engagement: 72, delivery: 70, preparation: 68 },
  { month: 'Set/25', avgScore: 73, attendance: 84, engagement: 71, delivery: 72, preparation: 66 },
  { month: 'Out/25', avgScore: 76, attendance: 88, engagement: 74, delivery: 75, preparation: 70 },
  { month: 'Nov/25', avgScore: 78, attendance: 90, engagement: 76, delivery: 77, preparation: 72 },
  { month: 'Dez/25', avgScore: 75, attendance: 82, engagement: 73, delivery: 74, preparation: 69 },
  { month: 'Jan/26', avgScore: 77, attendance: 89, engagement: 75, delivery: 76, preparation: 73 }
];

// ================== FUNÇÕES AUXILIARES ==================

export function getMockAlertsByMember(memberId: string): PerformanceAlert[] {
  return mockPerformanceAlerts.filter(a => a.member_id === memberId);
}

export function getMockRiskPrediction(memberId: string): MemberRiskPrediction | undefined {
  return mockRiskPredictions.find(p => p.memberId === memberId);
}

export function getMockActiveAlerts(): PerformanceAlert[] {
  return mockPerformanceAlerts.filter(a => a.status === 'active');
}

export function getMockCriticalAlerts(): PerformanceAlert[] {
  return mockPerformanceAlerts.filter(a => a.severity === 'error' || a.severity === 'critical');
}

export function getMockHighRiskMembers(): MemberRiskPrediction[] {
  return mockRiskPredictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical');
}




