import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  strategic_risks: any[];
  operational_threats: any[];
  strategic_opportunities: any[];
  model_used: string;
  generation_time_ms: number;
}

export interface TrendInfo {
  type: 'improving' | 'worsening' | 'stable' | 'new';
  previousTitle?: string;
}

// Mock history for now until table is created
const mockHistory: InsightHistoryEntry[] = [];

export function useInsightsHistory() {
  const [history, setHistory] = useState<InsightHistoryEntry[]>(mockHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (companyId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, use mock data since table doesn't exist yet
      // Once table is created, uncomment the Supabase query
      /*
      let query = supabase
        .from('ai_insights_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setHistory(data || []);
      */
      
      // Mock implementation - returns empty array
      setHistory([]);
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
      // All items are new
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
      const matchingPrev = prevRisks.find((p: any) => 
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
      const matchingPrev = prevThreats.find((p: any) => 
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

    // Opportunities - check if similar exists
    currentInsights.strategicOpportunities.forEach((opp, i) => {
      const prevOpps = previousEntry.strategic_opportunities || [];
      const matchingPrev = prevOpps.find((p: any) => 
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
