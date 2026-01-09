import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface InsightAction {
  primary: string;
  secondary: string;
}

export interface StrategicRisk {
  title: string;
  context: string;
  priority: "critical" | "high" | "medium";
  actions: InsightAction;
}

export interface OperationalThreat {
  title: string;
  context: string;
  timeframe: "immediate" | "30_days" | "90_days";
  category: string;
  actions: InsightAction;
}

export interface StrategicOpportunity {
  title: string;
  context: string;
  actions: InsightAction;
}

export interface GovernanceInsights {
  strategicRisks: StrategicRisk[];
  operationalThreats: OperationalThreat[];
  strategicOpportunities: StrategicOpportunity[];
}

// Legacy interface for backward compatibility
export interface PredictiveInsight {
  type: "risk_alert" | "opportunity" | "recommendation";
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  suggestedAction: string;
  timeframe: string;
}

interface RiskData {
  id: number;
  category: string;
  title: string;
  impact: number;
  probability: number;
  status: string;
  controls: string[];
}

interface SystemData {
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
}

interface UsePredictiveInsightsResult {
  insights: PredictiveInsight[];
  governanceInsights: GovernanceInsights | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchInsights: (data: SystemData) => Promise<void>;
  clearInsights: () => void;
}

const emptyGovernanceInsights: GovernanceInsights = {
  strategicRisks: [],
  operationalThreats: [],
  strategicOpportunities: [],
};

export function usePredictiveInsights(): UsePredictiveInsightsResult {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [governanceInsights, setGovernanceInsights] = useState<GovernanceInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchInsights = useCallback(async (data: SystemData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        "predictive-insights",
        { body: data }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (responseData?.error) {
        if (responseData.error === "rate_limit") {
          setError("Limite de requisições excedido. Aguarde alguns minutos.");
          toast({
            title: "Limite excedido",
            description: "A IA está temporariamente indisponível. Tente novamente em breve.",
            variant: "destructive",
          });
          return;
        }
        if (responseData.error === "payment_required") {
          setError("Créditos de IA insuficientes.");
          return;
        }
        throw new Error(responseData.message || "Erro ao gerar insights");
      }

      // Handle new governance insights format
      if (responseData?.governanceInsights) {
        setGovernanceInsights(responseData.governanceInsights);
        setLastUpdated(new Date());
      }
      
      // Handle legacy insights format
      if (responseData?.insights && Array.isArray(responseData.insights)) {
        setInsights(responseData.insights);
        if (!responseData.governanceInsights) {
          setLastUpdated(new Date());
        }
      }

      // If we have no data at all, throw error
      if (!responseData?.governanceInsights && !responseData?.insights) {
        throw new Error("Formato de resposta inválido");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar insights";
      setError(message);
      console.error("usePredictiveInsights error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearInsights = useCallback(() => {
    setInsights([]);
    setGovernanceInsights(null);
    setLastUpdated(null);
    setError(null);
  }, []);

  return {
    insights,
    governanceInsights,
    isLoading,
    error,
    lastUpdated,
    fetchInsights,
    clearInsights,
  };
}
