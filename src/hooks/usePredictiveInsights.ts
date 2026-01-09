import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchInsights: (data: SystemData) => Promise<void>;
  clearInsights: () => void;
}

export function usePredictiveInsights(): UsePredictiveInsightsResult {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
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

      if (responseData?.insights && Array.isArray(responseData.insights)) {
        setInsights(responseData.insights);
        setLastUpdated(new Date());
      } else {
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
    setLastUpdated(null);
    setError(null);
  }, []);

  return {
    insights,
    isLoading,
    error,
    lastUpdated,
    fetchInsights,
    clearInsights,
  };
}
