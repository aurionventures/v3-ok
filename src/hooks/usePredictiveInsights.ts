import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePrompts } from "@/hooks/usePrompts";
import type {
  AgentAData,
  AgentBData,
  AgentCData,
  AgentDData,
  AgentSource,
  OrchestratorPayload,
  createEmptyAgentAData,
  createEmptyAgentBData,
  createEmptyAgentCData,
  createEmptyAgentDData,
} from "@/types/agentIntelligence";

export interface InsightAction {
  primary: string;
  secondary: string;
}

export interface StrategicRisk {
  title: string;
  context: string;
  priority: "critical" | "high" | "medium";
  actions: InsightAction;
  sources?: AgentSource[];
}

export interface OperationalThreat {
  title: string;
  context: string;
  timeframe: "immediate" | "30_days" | "90_days";
  category: string;
  actions: InsightAction;
  sources?: AgentSource[];
}

export interface StrategicOpportunity {
  title: string;
  context: string;
  actions: InsightAction;
  sources?: AgentSource[];
}

export interface GovernanceInsights {
  strategicRisks: StrategicRisk[];
  operationalThreats: OperationalThreat[];
  strategicOpportunities: StrategicOpportunity[];
  metadata?: {
    generatedAt: string;
    modelUsed: string;
    executionTimeMs: number;
    agentsUsed: string[];
  };
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

// Extended system data with agent inputs
interface ExtendedSystemData extends SystemData {
  agentAData?: AgentAData;
  agentBData?: AgentBData;
  agentCData?: AgentCData;
  agentDData?: AgentDData;
}

interface UsePredictiveInsightsResult {
  insights: PredictiveInsight[];
  governanceInsights: GovernanceInsights | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  activePrompt: any | null;
  fetchInsights: (data: SystemData | ExtendedSystemData) => Promise<void>;
  fetchInsightsWithAgents: (
    baseData: SystemData,
    agentData?: {
      agentA?: AgentAData;
      agentB?: AgentBData;
      agentC?: AgentCData;
      agentD?: AgentDData;
    }
  ) => Promise<void>;
  clearInsights: () => void;
}

const emptyGovernanceInsights: GovernanceInsights = {
  strategicRisks: [],
  operationalThreats: [],
  strategicOpportunities: [],
};

// Categoria do prompt para insights do Copiloto
const COPILOT_INSIGHTS_CATEGORY = 'agent_copilot_insights';

export function usePredictiveInsights(): UsePredictiveInsightsResult {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [governanceInsights, setGovernanceInsights] = useState<GovernanceInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Buscar prompt ativo via usePrompts
  const { getActivePromptForCategory, getPromptsByCategory } = usePrompts();
  
  // Obter o prompt ativo para copilot insights
  const activePrompt = useMemo(() => {
    const active = getActivePromptForCategory(COPILOT_INSIGHTS_CATEGORY);
    if (active) return active;
    
    // Fallback: pegar o primeiro prompt da categoria
    const categoryPrompts = getPromptsByCategory(COPILOT_INSIGHTS_CATEGORY);
    return categoryPrompts.length > 0 ? categoryPrompts[0] : null;
  }, [getActivePromptForCategory, getPromptsByCategory]);

  const fetchInsights = useCallback(async (data: SystemData | ExtendedSystemData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar payload para o orquestrador
      const requestBody: OrchestratorPayload = {
        risks: data.risks,
        maturityScore: data.maturityScore,
        esgScore: data.esgScore,
        pendingTasks: data.pendingTasks,
        overduesTasks: data.overduesTasks,
        criticalRisks: data.criticalRisks,
        // Incluir dados dos agentes se disponíveis
        agentAData: (data as ExtendedSystemData).agentAData,
        agentBData: (data as ExtendedSystemData).agentBData,
        agentCData: (data as ExtendedSystemData).agentCData,
        agentDData: (data as ExtendedSystemData).agentDData,
        // Incluir configurações do prompt ativo
        promptConfig: activePrompt ? {
          promptId: activePrompt.id,
          systemPrompt: activePrompt.system_prompt,
          userPromptTemplate: activePrompt.user_prompt_template,
          model: activePrompt.model,
          temperature: activePrompt.temperature,
          maxTokens: activePrompt.max_tokens,
          topP: activePrompt.top_p,
        } : null
      };

      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        "predictive-insights",
        { body: requestBody }
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
        setGovernanceInsights({
          ...responseData.governanceInsights,
          metadata: responseData.metadata
        });
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
  }, [activePrompt]);

  // Nova função para buscar insights com dados de agentes separados
  const fetchInsightsWithAgents = useCallback(async (
    baseData: SystemData,
    agentData?: {
      agentA?: AgentAData;
      agentB?: AgentBData;
      agentC?: AgentCData;
      agentD?: AgentDData;
    }
  ) => {
    const extendedData: ExtendedSystemData = {
      ...baseData,
      agentAData: agentData?.agentA,
      agentBData: agentData?.agentB,
      agentCData: agentData?.agentC,
      agentDData: agentData?.agentD,
    };
    
    return fetchInsights(extendedData);
  }, [fetchInsights]);

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
    activePrompt,
    fetchInsights,
    fetchInsightsWithAgents,
    clearInsights,
  };
}
