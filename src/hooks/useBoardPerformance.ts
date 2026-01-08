import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type {
  BoardEvaluationPeriod,
  BoardMemberMetrics,
  BoardMemberEvaluation,
  BoardMemberPerformance,
  BoardEvaluationConfig,
  MemberPerformanceWithDetails,
  CouncilPerformanceSummary,
  PerformanceLevel
} from '@/types/boardPerformance';

// Mock data para demonstração (será substituído por dados reais do Supabase)
const generateMockPerformanceData = (councilMembers: any[]): MemberPerformanceWithDetails[] => {
  return councilMembers.map((member, index) => {
    const presenceScore = 70 + Math.random() * 30;
    const contributionScore = 60 + Math.random() * 40;
    const deliveryScore = 65 + Math.random() * 35;
    const engagementScore = 55 + Math.random() * 45;
    const leadershipScore = 60 + Math.random() * 40;
    
    const automaticScore = (presenceScore * 0.25 + contributionScore * 0.20 + deliveryScore * 0.30 + engagementScore * 0.25);
    const qualitativeScore = 70 + Math.random() * 25;
    const finalScore = automaticScore * 0.6 + qualitativeScore * 0.4;
    
    let performanceLevel: PerformanceLevel;
    if (finalScore >= 90) performanceLevel = 'exceptional';
    else if (finalScore >= 75) performanceLevel = 'above_expectations';
    else if (finalScore >= 60) performanceLevel = 'meets_expectations';
    else if (finalScore >= 40) performanceLevel = 'below_expectations';
    else performanceLevel = 'critical';
    
    return {
      id: `perf-${member.id}`,
      period_id: 'current-period',
      member_id: member.id,
      council_id: member.council_id,
      member_name: member.name,
      member_role: member.role,
      council_name: 'Conselho de Administração',
      presence_score: Math.round(presenceScore * 10) / 10,
      contribution_score: Math.round(contributionScore * 10) / 10,
      delivery_score: Math.round(deliveryScore * 10) / 10,
      engagement_score: Math.round(engagementScore * 10) / 10,
      leadership_score: Math.round(leadershipScore * 10) / 10,
      automatic_score: Math.round(automaticScore * 10) / 10,
      qualitative_score: Math.round(qualitativeScore * 10) / 10,
      final_score: Math.round(finalScore * 10) / 10,
      performance_level: performanceLevel,
      rank_in_council: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metrics: {
        id: `metrics-${member.id}`,
        period_id: 'current-period',
        member_id: member.id,
        council_id: member.council_id,
        meetings_scheduled: 12,
        meetings_attended: Math.floor(9 + Math.random() * 4),
        attendance_rate: presenceScore,
        items_presented: Math.floor(Math.random() * 8),
        suggestions_made: Math.floor(Math.random() * 15),
        contribution_score: contributionScore,
        actions_assigned: Math.floor(5 + Math.random() * 10),
        actions_completed: Math.floor(4 + Math.random() * 8),
        actions_on_time: Math.floor(3 + Math.random() * 6),
        delivery_rate: deliveryScore,
        approvals_requested: Math.floor(10 + Math.random() * 20),
        approvals_responded: Math.floor(8 + Math.random() * 18),
        avg_response_time_hours: Math.round((12 + Math.random() * 36) * 10) / 10,
        engagement_score: engagementScore,
        automatic_score: automaticScore,
        calculated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };
  });
};

export function useBoardPerformance(companyId?: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [periods, setPeriods] = useState<BoardEvaluationPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<BoardEvaluationPeriod | null>(null);
  const [performances, setPerformances] = useState<MemberPerformanceWithDetails[]>([]);
  const [councilSummaries, setCouncilSummaries] = useState<CouncilPerformanceSummary[]>([]);
  const [config, setConfig] = useState<BoardEvaluationConfig | null>(null);

  // Carregar membros do conselho e gerar dados de performance
  const loadPerformanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Buscar membros do conselho
      const { data: members, error } = await supabase
        .from('council_members')
        .select(`
          id,
          name,
          role,
          council_id,
          status,
          councils!inner(id, name, company_id)
        `)
        .eq('status', 'active');

      if (error) throw error;

      if (members && members.length > 0) {
        // Gerar dados mock de performance
        const performanceData = generateMockPerformanceData(members);
        
        // Ordenar por score final
        performanceData.sort((a, b) => b.final_score - a.final_score);
        
        // Atualizar ranks
        performanceData.forEach((p, i) => {
          p.rank_in_council = i + 1;
        });
        
        setPerformances(performanceData);

        // Gerar resumos por conselho
        const councilMap = new Map<string, MemberPerformanceWithDetails[]>();
        performanceData.forEach(p => {
          const list = councilMap.get(p.council_id) || [];
          list.push(p);
          councilMap.set(p.council_id, list);
        });

        const summaries: CouncilPerformanceSummary[] = [];
        councilMap.forEach((memberPerfs, councilId) => {
          const avgScore = memberPerfs.reduce((sum, p) => sum + p.final_score, 0) / memberPerfs.length;
          const topPerformer = memberPerfs[0];
          
          summaries.push({
            council_id: councilId,
            council_name: memberPerfs[0]?.council_name || 'Conselho',
            total_members: memberPerfs.length,
            avg_score: Math.round(avgScore * 10) / 10,
            top_performer: topPerformer ? {
              member_id: topPerformer.member_id,
              member_name: topPerformer.member_name,
              score: topPerformer.final_score
            } : undefined,
            alerts: {
              low_attendance: memberPerfs.filter(p => p.presence_score < 70).length,
              pending_actions: memberPerfs.filter(p => p.delivery_score < 60).length,
              critical_performance: memberPerfs.filter(p => p.performance_level === 'critical' || p.performance_level === 'below_expectations').length
            }
          });
        });

        setCouncilSummaries(summaries);

        // Criar período mock atual
        const mockPeriod: BoardEvaluationPeriod = {
          id: 'current-period',
          company_id: companyId || 'demo',
          name: '1º Semestre 2026',
          period_type: 'semiannual',
          start_date: '2026-01-01',
          end_date: '2026-06-30',
          status: 'active',
          self_evaluation_deadline: '2026-06-15',
          peer_evaluation_deadline: '2026-06-20',
          president_evaluation_deadline: '2026-06-25',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setPeriods([mockPeriod]);
        setCurrentPeriod(mockPeriod);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de performance:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados de performance.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [companyId, toast]);

  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  // Obter performance de um membro específico
  const getMemberPerformance = useCallback((memberId: string) => {
    return performances.find(p => p.member_id === memberId);
  }, [performances]);

  // Obter ranking do conselho
  const getCouncilRanking = useCallback((councilId?: string) => {
    if (councilId) {
      return performances.filter(p => p.council_id === councilId);
    }
    return performances;
  }, [performances]);

  // Obter alertas
  const getAlerts = useCallback(() => {
    const alerts: { type: string; message: string; severity: 'warning' | 'error' | 'info'; memberId?: string }[] = [];
    
    performances.forEach(p => {
      if (p.presence_score < 70) {
        alerts.push({
          type: 'low_attendance',
          message: `${p.member_name} tem presença abaixo de 70% (${p.presence_score}%)`,
          severity: 'warning',
          memberId: p.member_id
        });
      }
      if (p.delivery_score < 60) {
        alerts.push({
          type: 'pending_actions',
          message: `${p.member_name} tem taxa de entrega crítica (${p.delivery_score}%)`,
          severity: 'error',
          memberId: p.member_id
        });
      }
      if (p.performance_level === 'critical') {
        alerts.push({
          type: 'critical_performance',
          message: `${p.member_name} está em nível crítico de performance`,
          severity: 'error',
          memberId: p.member_id
        });
      }
    });
    
    return alerts;
  }, [performances]);

  return {
    isLoading,
    periods,
    currentPeriod,
    performances,
    councilSummaries,
    config,
    getMemberPerformance,
    getCouncilRanking,
    getAlerts,
    refresh: loadPerformanceData
  };
}
