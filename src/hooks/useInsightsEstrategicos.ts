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

export interface UseInsightsEstrategicosOptions {
  /** Empresa ID (ex: de useCurrentMembro). Quando informado, usa em vez de firstEmpresaId. Permite members verem os mesmos insights do Copiloto. */
  empresaId?: string | null;
  /** Se true, busca automaticamente ao montar. Útil para members. ADM usa false e refetch manual. */
  autoFetch?: boolean;
}

export function useInsightsEstrategicos(options?: UseInsightsEstrategicosOptions) {
  const { firstEmpresaId } = useEmpresas();
  const empresaIdOverride = options?.empresaId;
  const autoFetch = options?.autoFetch ?? false;

  const effectiveEmpresaId = empresaIdOverride ?? firstEmpresaId ?? null;

  const storedInitial = getStoredInsights(effectiveEmpresaId);

  const query = useQuery({
    queryKey: [...INSIGHTS_ESTRATEGICOS_KEY, effectiveEmpresaId ?? "none"],
    queryFn: () => fetchInsightsEstrategicos(effectiveEmpresaId),
    enabled: !!effectiveEmpresaId && autoFetch,
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
      setStoredInsights(effectiveEmpresaId, query.data);
    }
  }, [query.isSuccess, query.data, effectiveEmpresaId]);

  const data = (query.data ?? storedInitial ?? emptyResult) as InsightsEstrategicosResult;

  return {
    ...data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error ?? data.error,
    hasEmpresa: !!effectiveEmpresaId,
    refetch: query.refetch,
  };
}
