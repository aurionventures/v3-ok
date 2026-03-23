import { useQuery } from "@tanstack/react-query";
import { useEmpresas } from "@/hooks/useEmpresas";
import {
  fetchInsightsEstrategicos,
  type InsightsEstrategicosResult,
} from "@/services/insightsEstrategicos";

const INSIGHTS_ESTRATEGICOS_KEY = ["insights", "estrategicos"] as const;

export function useInsightsEstrategicos() {
  const { firstEmpresaId } = useEmpresas();

  const query = useQuery({
    queryKey: [...INSIGHTS_ESTRATEGICOS_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchInsightsEstrategicos(firstEmpresaId),
    enabled: !!firstEmpresaId,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const data = (query.data ?? {
    riscos: [],
    ameacas: [],
    oportunidades: [],
    resumo: "",
  }) as InsightsEstrategicosResult;

  return {
    ...data,
    isLoading: query.isLoading,
    error: query.error ?? data.error,
    hasEmpresa: !!firstEmpresaId,
    refetch: query.refetch,
  };
}
