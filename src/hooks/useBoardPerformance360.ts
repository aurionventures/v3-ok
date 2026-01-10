// Hooks para Board Performance 2.0 - Avaliações 360°, PDI e Alertas Preditivos

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  mockSelfEvaluation,
  mockPeerEvaluations,
  mockEvaluationProgress,
  mockPendingPeerEvaluations,
  mockMemberPDI,
  mockPerformanceAlerts,
  mockRiskPredictions,
  mockHistoricalData,
  getMockActiveAlerts,
  getMockHighRiskMembers,
} from '@/data/mockBoardPerformanceData';
import type {
  BoardEvaluation,
  EvaluationProgress,
  MyEvaluations,
  MemberPDIPlan,
  PerformanceAlert,
  MemberRiskPrediction,
  HistoricalDataPoint,
  EvaluationScores,
  EvaluationFeedback,
  TrendDirection,
} from '@/types/boardPerformance';

// ================== HOOK: AVALIAÇÕES 360° ==================

export function useEvaluations360(periodId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Obter progresso das avaliações
  const getEvaluationProgress = useCallback((): EvaluationProgress => {
    return mockEvaluationProgress;
  }, []);

  // Obter minhas avaliações (pendentes e completadas)
  const getMyEvaluations = useCallback((): MyEvaluations => {
    const selfPending = mockSelfEvaluation.status === 'draft' ? mockSelfEvaluation : undefined;
    const selfCompleted = mockSelfEvaluation.status === 'submitted' ? mockSelfEvaluation : undefined;

    return {
      pending: {
        self: selfPending,
        peers: mockPendingPeerEvaluations
      },
      completed: {
        self: selfCompleted,
        peers: mockPeerEvaluations
      }
    };
  }, []);

  // Submeter auto-avaliação
  const submitSelfEvaluation = useCallback(async (
    scores: EvaluationScores,
    feedback: EvaluationFeedback
  ) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Auto-avaliação enviada',
      description: 'Sua auto-avaliação foi registrada com sucesso.'
    });
    
    setIsLoading(false);
    return true;
  }, [toast]);

  // Submeter avaliação de par
  const submitPeerEvaluation = useCallback(async (
    evaluatedId: string,
    scores: EvaluationScores,
    feedback: Partial<EvaluationFeedback>
  ) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Avaliação enviada',
      description: 'Sua avaliação foi registrada com sucesso.'
    });
    
    setIsLoading(false);
    return true;
  }, [toast]);

  // Salvar rascunho
  const saveDraft = useCallback(async (
    evaluationType: 'self' | 'peer',
    evaluatedId: string | null,
    scores: Partial<EvaluationScores>,
    feedback: Partial<EvaluationFeedback>
  ) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: 'Rascunho salvo',
      description: 'Seu progresso foi salvo automaticamente.'
    });
    
    return true;
  }, [toast]);

  // Obter avaliações recebidas (após período fechado)
  const getReceivedEvaluations = useCallback((evaluatedId: string): BoardEvaluation[] => {
    return mockPeerEvaluations.filter(e => 
      e.evaluated_id === evaluatedId && 
      e.status === 'submitted' && 
      !e.is_anonymous
    );
  }, []);

  // Obter resumo consolidado de avaliações
  const getConsolidatedFeedback = useCallback((evaluatedId: string) => {
    const evaluations = mockPeerEvaluations.filter(e => e.evaluated_id === evaluatedId);
    
    if (evaluations.length === 0) return null;

    const avgScores = {
      strategic_thinking: 0,
      decision_quality: 0,
      leadership: 0,
      collaboration: 0,
      ethics_integrity: 0,
      communication: 0
    };

    evaluations.forEach(e => {
      avgScores.strategic_thinking += e.strategic_thinking_score || 0;
      avgScores.decision_quality += e.decision_quality_score || 0;
      avgScores.leadership += e.leadership_score || 0;
      avgScores.collaboration += e.collaboration_score || 0;
      avgScores.ethics_integrity += e.ethics_integrity_score || 0;
      avgScores.communication += e.communication_score || 0;
    });

    const count = evaluations.length;
    Object.keys(avgScores).forEach(key => {
      avgScores[key as keyof typeof avgScores] = Math.round(avgScores[key as keyof typeof avgScores] / count);
    });

    const allStrengths = evaluations.flatMap(e => e.strengths);
    const allImprovements = evaluations.flatMap(e => e.areas_for_improvement);

    return {
      avgScores,
      topStrengths: [...new Set(allStrengths)].slice(0, 5),
      topAreasForImprovement: [...new Set(allImprovements)].slice(0, 5),
      evaluationCount: count
    };
  }, []);

  return {
    isLoading,
    getEvaluationProgress,
    getMyEvaluations,
    submitSelfEvaluation,
    submitPeerEvaluation,
    saveDraft,
    getReceivedEvaluations,
    getConsolidatedFeedback
  };
}

// ================== HOOK: PDI ==================

export function useMemberPDI(memberId: string, periodId?: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdi, setPdi] = useState<MemberPDIPlan | null>(mockMemberPDI);

  // Gerar PDI com IA
  const generatePDI = useCallback(async () => {
    setIsGenerating(true);
    
    // Simular geração de IA (3-5 segundos)
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Atualizar com dados "gerados"
    const newPdi: MemberPDIPlan = {
      ...mockMemberPDI,
      id: `pdi-${Date.now()}`,
      ai_generation_date: new Date().toISOString(),
      status: 'active',
      progress_percentage: 0
    };
    
    setPdi(newPdi);
    setIsGenerating(false);
    
    toast({
      title: 'PDI gerado com sucesso',
      description: 'Seu Plano de Desenvolvimento Individual foi criado pela IA.'
    });
    
    return newPdi;
  }, [toast]);

  // Atualizar notas do membro
  const updateMemberNotes = useCallback(async (notes: string) => {
    if (!pdi) return;
    
    setPdi(prev => prev ? { ...prev, member_notes: notes } : null);
    
    toast({
      title: 'Notas salvas',
      description: 'Suas anotações foram atualizadas.'
    });
  }, [pdi, toast]);

  // Marcar ação como concluída
  const completeAction = useCallback(async (actionId: string) => {
    if (!pdi) return;
    
    const updatedActions = pdi.recommended_actions.map(action =>
      action.id === actionId
        ? { ...action, completed: true, completedAt: new Date().toISOString() }
        : action
    );
    
    const completedCount = updatedActions.filter(a => a.completed).length;
    const progress = Math.round((completedCount / updatedActions.length) * 100);
    
    setPdi(prev => prev ? {
      ...prev,
      recommended_actions: updatedActions,
      progress_percentage: progress
    } : null);
    
    toast({
      title: 'Ação concluída',
      description: 'Sua progressão foi atualizada.'
    });
  }, [pdi, toast]);

  // Atualizar progresso do objetivo
  const updateGoalProgress = useCallback(async (goalId: string, progress: number) => {
    if (!pdi) return;
    
    const updatedGoals = pdi.development_goals.map(goal =>
      goal.id === goalId ? { ...goal, progress } : goal
    );
    
    setPdi(prev => prev ? { ...prev, development_goals: updatedGoals } : null);
  }, [pdi]);

  return {
    isLoading,
    isGenerating,
    pdi,
    generatePDI,
    updateMemberNotes,
    completeAction,
    updateGoalProgress
  };
}

// ================== HOOK: ALERTAS PREDITIVOS ==================

export function usePerformanceAlerts(companyId?: string) {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PerformanceAlert[]>(mockPerformanceAlerts);

  // Obter alertas ativos
  const getActiveAlerts = useCallback((): PerformanceAlert[] => {
    return alerts.filter(a => a.status === 'active');
  }, [alerts]);

  // Obter alertas críticos
  const getCriticalAlerts = useCallback((): PerformanceAlert[] => {
    return alerts.filter(a => 
      a.status === 'active' && 
      (a.severity === 'error' || a.severity === 'critical')
    );
  }, [alerts]);

  // Obter alertas por membro
  const getAlertsByMember = useCallback((memberId: string): PerformanceAlert[] => {
    return alerts.filter(a => a.member_id === memberId);
  }, [alerts]);

  // Reconhecer alerta
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { 
            ...alert, 
            status: 'acknowledged' as const,
            acknowledged_at: new Date().toISOString()
          }
        : alert
    ));
    
    toast({
      title: 'Alerta reconhecido',
      description: 'O alerta foi marcado como visto.'
    });
  }, [toast]);

  // Resolver alerta
  const resolveAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { 
            ...alert, 
            status: 'resolved' as const,
            resolved_at: new Date().toISOString()
          }
        : alert
    ));
    
    toast({
      title: 'Alerta resolvido',
      description: 'O alerta foi marcado como resolvido.'
    });
  }, [toast]);

  // Dispensar alerta
  const dismissAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'dismissed' as const }
        : alert
    ));
  }, []);

  return {
    alerts,
    getActiveAlerts,
    getCriticalAlerts,
    getAlertsByMember,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert
  };
}

// ================== HOOK: PREDIÇÕES DE RISCO ==================

export function useRiskPredictions(companyId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<MemberRiskPrediction[]>(mockRiskPredictions);

  // Obter todas as predições
  const getAllPredictions = useCallback((): MemberRiskPrediction[] => {
    return predictions;
  }, [predictions]);

  // Obter membros de alto risco
  const getHighRiskMembers = useCallback((): MemberRiskPrediction[] => {
    return predictions.filter(p => 
      p.riskLevel === 'high' || p.riskLevel === 'critical'
    );
  }, [predictions]);

  // Obter predição de um membro
  const getMemberPrediction = useCallback((memberId: string): MemberRiskPrediction | undefined => {
    return predictions.find(p => p.memberId === memberId);
  }, [predictions]);

  // Atualizar predições (simular refresh)
  const refreshPredictions = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Em produção, chamaria a Edge Function predict-performance-risk
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    predictions,
    getAllPredictions,
    getHighRiskMembers,
    getMemberPrediction,
    refreshPredictions
  };
}

// ================== HOOK: DADOS HISTÓRICOS ==================

export function useHistoricalPerformance(companyId?: string, months: number = 12) {
  const [historicalData] = useState<HistoricalDataPoint[]>(mockHistoricalData);

  // Obter dados históricos
  const getHistoricalData = useCallback((): HistoricalDataPoint[] => {
    return historicalData;
  }, [historicalData]);

  // Calcular tendência
  const calculateTrend = useCallback((): TrendDirection => {
    if (historicalData.length < 2) return 'stable';
    
    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.avgScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.avgScore, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 2) return 'improving';
    if (diff < -2) return 'declining';
    return 'stable';
  }, [historicalData]);

  // Obter estatísticas
  const getStatistics = useCallback(() => {
    const scores = historicalData.map(d => d.avgScore);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const latest = scores[scores.length - 1];
    
    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      avg: Math.round(avg * 10) / 10,
      latest: Math.round(latest * 10) / 10,
      trend: calculateTrend()
    };
  }, [historicalData, calculateTrend]);

  return {
    historicalData,
    getHistoricalData,
    calculateTrend,
    getStatistics
  };
}




