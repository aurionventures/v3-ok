import { useQuery } from "@tanstack/react-query";
import { fetchEmpresas, fetchEmpresasAll } from "@/services/empresas";

export const EMPRESAS_QUERY_KEY = ["empresas"] as const;
export const EMPRESAS_ALL_QUERY_KEY = ["empresas", "all"] as const;

export function useEmpresas() {
  const query = useQuery({
    queryKey: EMPRESAS_QUERY_KEY,
    queryFn: fetchEmpresas,
  });

  return {
    empresas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    firstEmpresaId: query.data?.[0]?.id ?? null,
  };
}

/** Lista todas as empresas (ativas e inativas) - para Super ADM */
export function useEmpresasAll() {
  const query = useQuery({
    queryKey: EMPRESAS_ALL_QUERY_KEY,
    queryFn: fetchEmpresasAll,
  });

  return {
    empresas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
