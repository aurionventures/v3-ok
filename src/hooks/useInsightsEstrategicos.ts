import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmpresas } from "@/hooks/useEmpresas";
import {
  fetchInsightsEstrategicos,
  type InsightsEstrategicosResult,
} from "@/services/insightsEstrategicos";

const INSIGHTS_ESTRATEGICOS_KEY = ["insights", "estrategicos"] as const;
const STORAGE_KEY_PREFIX = "legacy_insights_estrategicos_";

function getStoredInsights(empresaId: string | null): InsightsEstrategicosResult | undefined {
  if (!empresaId || typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + empresaId);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as InsightsEstrategicosResult;
    if (
      parsed &&
      !parsed.error &&
      Array.isArray(parsed.riscos) &&
      Array.isArray(parsed.ameacas) &&
      Array.isArray(parsed.oportunidades)
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function setStoredInsights(empresaId: string | null, data: InsightsEstrategicosResult): void {
  if (!empresaId || typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + empresaId, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

const emptyResult: InsightsEstrategicosResult = {
  riscos: [],
  ameacas: [],
  oportunidades: [],
  resumo: "",
};

export function useInsightsEstrategicos() {
  const { firstEmpresaId } = useEmpresas();

  const storedInitial = getStoredInsights(firstEmpresaId ?? null);

  const query = useQuery({
    queryKey: [...INSIGHTS_ESTRATEGICOS_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchInsightsEstrategicos(firstEmpresaId),
    enabled: false,
    staleTime: 1000 * 60 * 5,
    initialData: storedInitial ?? undefined,
  });

  useEffect(() => {
    if (
      query.isSuccess &&
      query.data &&
      !query.data.error &&
      (query.data.riscos?.length > 0 ||
        query.data.ameacas?.length > 0 ||
        query.data.oportunidades?.length > 0 ||
        (query.data.resumo ?? "").trim() !== "")
    ) {
      setStoredInsights(firstEmpresaId ?? null, query.data);
    }
  }, [query.isSuccess, query.data, firstEmpresaId]);

  const data = (query.data ?? storedInitial ?? emptyResult) as InsightsEstrategicosResult;

  return {
    ...data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error ?? data.error,
    hasEmpresa: !!firstEmpresaId,
    refetch: query.refetch,
  };
}
