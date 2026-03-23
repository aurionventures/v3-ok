import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { fetchEmpresas, fetchEmpresasAll } from "@/services/empresas";
import { useCurrentAdminProfile } from "@/hooks/useCurrentAdminProfile";

export const EMPRESAS_QUERY_KEY = ["empresas"] as const;
export const EMPRESAS_ALL_QUERY_KEY = ["empresas", "all"] as const;

/**
 * Para empresa_adm no painel da empresa (/dashboard, /councils, etc): usa empresaId do perfil.
 * Assim, cada empresa nova criada no Super ADM não herda dados de outra – o ADM vê somente sua empresa.
 * Para super_admin: usa a primeira empresa da lista (quando em rotas /admin pode usar useEmpresasAll).
 */
export function useEmpresas() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const { empresaId: perfilEmpresaId, loading: perfilLoading } = useCurrentAdminProfile();

  const query = useQuery({
    queryKey: EMPRESAS_QUERY_KEY,
    queryFn: fetchEmpresas,
  });

  const empresas = query.data ?? [];
  const defaultFirstId = empresas[0]?.id ?? null;

  // empresa_adm fora de /admin: usa empresa do perfil – garante isolamento total (sem herdar dados)
  const firstEmpresaId =
    !isAdminRoute
      ? perfilLoading
        ? null
        : (perfilEmpresaId ?? defaultFirstId)
      : defaultFirstId;

  return {
    empresas,
    isLoading: query.isLoading || (!isAdminRoute && perfilLoading),
    error: query.error,
    refetch: query.refetch,
    firstEmpresaId,
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
