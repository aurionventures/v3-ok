import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { executarAnaliseAcoes, fetchAnaliseAcoes, salvarAnaliseAcoes } from "@/services/analiseAcoes";
import type { Documento } from "@/types/documentos";
import type { Entrevista } from "@/types/entrevistas";
import type { AnaliseAcoesResult } from "@/types/analiseAcoes";

const ANALISE_ACOES_KEY = ["analise-acoes"] as const;

export function useAnaliseAcoes(empresaId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...ANALISE_ACOES_KEY, empresaId ?? "none"],
    queryFn: () => fetchAnaliseAcoes(empresaId!),
    enabled: !!empresaId,
  });

  const mutation = useMutation({
    mutationFn: async ({
      documentos,
      entrevistas,
      empresaId: eid,
    }: {
      documentos: Documento[];
      entrevistas: Entrevista[];
      empresaId: string;
    }) => {
      const { data, error } = await executarAnaliseAcoes(documentos, entrevistas);
      if (error) return { data: null, error };
      if (data && eid) {
        await salvarAnaliseAcoes(eid, data);
      }
      return { data, error: null };
    },
    onSuccess: (res, { empresaId: eid }) => {
      if (res.data && eid) {
        queryClient.setQueryData([...ANALISE_ACOES_KEY, eid], { data: res.data, error: null });
      }
    },
  });

  return {
    resultado: query.data?.data ?? null,
    executar: async ({
      documentos,
      entrevistas,
    }: {
      documentos: Documento[];
      entrevistas: Entrevista[];
    }) => {
      if (!empresaId) return { data: null, error: "Selecione uma empresa" };
      return mutation.mutateAsync({ documentos, entrevistas, empresaId });
    },
    isLoading: mutation.isPending,
    isLoadingResultado: query.isLoading,
    error: mutation.error ?? query.error,
    refetch: query.refetch,
  };
}
