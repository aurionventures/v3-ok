import { useState, useCallback } from "react";
import { GovernanceInsights } from "./usePredictiveInsights";

export interface InsightHistoryEntry {
  id: string;
  company_id: string;
  created_at: string;
  maturity_score: number;
  esg_score: number;
  pending_tasks: number;
  overdue_tasks: number;
  critical_risks: number;
  strategic_risks: Array<{ title: string; priority: string; context: string }>;
  operational_threats: Array<{ title: string; timeframe: string; context: string }>;
  strategic_opportunities: Array<{ title: string; context: string }>;
  model_used: string;
  generation_time_ms: number;
}

export interface TrendInfo {
  type: 'improving' | 'worsening' | 'stable' | 'new';
  previousTitle?: string;
}

// Dados mock para demonstração
const mockHistory: InsightHistoryEntry[] = [
  {
    id: "demo-1",
    company_id: "demo-company",
    created_at: new Date().toISOString(),
    maturity_score: 4.2,
    esg_score: 68,
    pending_tasks: 12,
    overdue_tasks: 3,
    critical_risks: 2,
    strategic_risks: [
      { title: "Ausência de plano de sucessão", priority: "critical", context: "CEO sem substituto definido há 2 anos" },
      { title: "Concentração de decisões", priority: "high", context: "85% das decisões dependem de 2 pessoas" }
    ],
    operational_threats: [
      { title: "Nova regulamentação ESG", timeframe: "30_days", context: "Resolução CVM exige adaptação até março" },
      { title: "Pendências acumuladas", timeframe: "immediate", context: "23 tarefas atrasadas no conselho fiscal" }
    ],
    strategic_opportunities: [
      { title: "Certificação B Corp", context: "Score ESG atual compatível com requisitos" },
      { title: "Automação de compliance", context: "Potencial redução de 40% no tempo de auditorias" }
    ],
    model_used: "google/gemini-2.5-flash",
    generation_time_ms: 2340
  },
  {
    id: "demo-2",
    company_id: "demo-company",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    maturity_score: 4.0,
    esg_score: 65,
    pending_tasks: 18,
    overdue_tasks: 5,
    critical_risks: 3,
    strategic_risks: [
      { title: "Ausência de plano de sucessão", priority: "critical", context: "Identificado como risco principal" },
      { title: "Documentação desatualizada", priority: "high", context: "Estatuto não revisado desde 2021" },
      { title: "Falta de comitê de auditoria", priority: "medium", context: "Recomendação do IBGC não implementada" }
    ],
    operational_threats: [
      { title: "Prazo fiscal iminente", timeframe: "immediate", context: "Obrigações fiscais vencem em 15 dias" },
      { title: "Vencimento de mandatos", timeframe: "30_days", context: "3 conselheiros com mandato expirando" }
    ],
    strategic_opportunities: [
      { title: "Parceria estratégica", context: "Proposta de investidor institucional em análise" },
      { title: "Expansão de mercado", context: "Oportunidade identificada no setor de energia limpa" }
    ],
    model_used: "google/gemini-2.5-flash",
    generation_time_ms: 2180
  },
  {
    id: "demo-3",
    company_id: "demo-company",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    maturity_score: 3.8,
    esg_score: 62,
    pending_tasks: 22,
    overdue_tasks: 8,
    critical_risks: 4,
    strategic_risks: [
      { title: "Governança fragmentada", priority: "critical", context: "Órgãos não se comunicam adequadamente" },
      { title: "Risco de compliance", priority: "high", context: "Políticas internas desatualizadas" }
    ],
    operational_threats: [
      { title: "Auditoria externa", timeframe: "30_days", context: "Auditores identificaram 5 não-conformidades" },
      { title: "Rotatividade alta", timeframe: "90_days", context: "Turnover de 25% no último semestre" }
    ],
    strategic_opportunities: [
      { title: "Digitalização de processos", context: "Redução estimada de 30% nos custos operacionais" }
    ],
    model_used: "google/gemini-2.5-flash",
    generation_time_ms: 1950
  },
  {
    id: "demo-4",
    company_id: "demo-company",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    maturity_score: 3.6,
    esg_score: 58,
    pending_tasks: 28,
    overdue_tasks: 12,
    critical_risks: 5,
    strategic_risks: [
      { title: "Conflito de interesses", priority: "critical", context: "Conselheiros com participação em concorrentes" },
      { title: "Falta de independência", priority: "high", context: "Nenhum conselheiro independente no board" }
    ],
    operational_threats: [
      { title: "Mudança regulatória", timeframe: "60_days", context: "Nova lei de proteção de dados entra em vigor" }
    ],
    strategic_opportunities: [
      { title: "Captação de recursos", context: "Janela favorável para emissão de debêntures" },
      { title: "Aliança setorial", context: "Consórcio de empresas do setor em formação" }
    ],
    model_used: "google/gemini-2.5-flash",
    generation_time_ms: 2100
  }
];

export function useInsightsHistory() {
  const [history, setHistory] = useState<InsightHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (companyId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de rede para demo
      await new Promise(resolve => setTimeout(resolve, 500));
      setHistory(mockHistory);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar histórico";
      setError(message);
      console.error("useInsightsHistory error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLatestEntry = useCallback(() => {
    return history.length > 0 ? history[0] : null;
  }, [history]);

  const compareTrends = useCallback((
    currentInsights: GovernanceInsights,
    previousEntry: InsightHistoryEntry | null
  ): Map<string, TrendInfo> => {
    const trends = new Map<string, TrendInfo>();

    if (!previousEntry) {
      currentInsights.strategicRisks.forEach((risk, i) => {
        trends.set(`risk_${i}`, { type: 'new' });
      });
      currentInsights.operationalThreats.forEach((threat, i) => {
        trends.set(`threat_${i}`, { type: 'new' });
      });
      currentInsights.strategicOpportunities.forEach((opp, i) => {
        trends.set(`opportunity_${i}`, { type: 'new' });
      });
      return trends;
    }

    // Compare risks
    currentInsights.strategicRisks.forEach((risk, i) => {
      const prevRisks = previousEntry.strategic_risks || [];
      const matchingPrev = prevRisks.find((p) => 
        p.title?.toLowerCase().includes(risk.title.toLowerCase().split(' ')[0]) ||
        risk.title.toLowerCase().includes(p.title?.toLowerCase().split(' ')[0] || '')
      );
      
      if (matchingPrev) {
        const prevPriorityScore = { critical: 3, high: 2, medium: 1 }[matchingPrev.priority as string] || 1;
        const currPriorityScore = { critical: 3, high: 2, medium: 1 }[risk.priority] || 1;
        
        if (currPriorityScore < prevPriorityScore) {
          trends.set(`risk_${i}`, { type: 'improving', previousTitle: matchingPrev.title });
        } else if (currPriorityScore > prevPriorityScore) {
          trends.set(`risk_${i}`, { type: 'worsening', previousTitle: matchingPrev.title });
        } else {
          trends.set(`risk_${i}`, { type: 'stable', previousTitle: matchingPrev.title });
        }
      } else {
        trends.set(`risk_${i}`, { type: 'new' });
      }
    });

    // Compare threats
    currentInsights.operationalThreats.forEach((threat, i) => {
      const prevThreats = previousEntry.operational_threats || [];
      const matchingPrev = prevThreats.find((p) => 
        p.title?.toLowerCase().includes(threat.title.toLowerCase().split(' ')[0]) ||
        threat.title.toLowerCase().includes(p.title?.toLowerCase().split(' ')[0] || '')
      );
      
      if (matchingPrev) {
        const timeframeScore = { immediate: 3, '30_days': 2, '90_days': 1 };
        const prevScore = timeframeScore[matchingPrev.timeframe as keyof typeof timeframeScore] || 2;
        const currScore = timeframeScore[threat.timeframe as keyof typeof timeframeScore] || 2;
        
        if (currScore < prevScore) {
          trends.set(`threat_${i}`, { type: 'improving', previousTitle: matchingPrev.title });
        } else if (currScore > prevScore) {
          trends.set(`threat_${i}`, { type: 'worsening', previousTitle: matchingPrev.title });
        } else {
          trends.set(`threat_${i}`, { type: 'stable', previousTitle: matchingPrev.title });
        }
      } else {
        trends.set(`threat_${i}`, { type: 'new' });
      }
    });

    // Opportunities
    currentInsights.strategicOpportunities.forEach((opp, i) => {
      const prevOpps = previousEntry.strategic_opportunities || [];
      const matchingPrev = prevOpps.find((p) => 
        p.title?.toLowerCase().includes(opp.title.toLowerCase().split(' ')[0]) ||
        opp.title.toLowerCase().includes(p.title?.toLowerCase().split(' ')[0] || '')
      );
      
      if (matchingPrev) {
        trends.set(`opportunity_${i}`, { type: 'stable', previousTitle: matchingPrev.title });
      } else {
        trends.set(`opportunity_${i}`, { type: 'new' });
      }
    });

    return trends;
  }, []);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    getLatestEntry,
    compareTrends,
  };
}
