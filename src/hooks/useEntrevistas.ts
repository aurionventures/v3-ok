import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEntrevistas,
  insertEntrevista,
  updateEntrevistaStatus,
  updateEntrevistaTranscricao,
} from "@/services/entrevistas";
import type { EntrevistaInsert } from "@/types/entrevistas";

export const ENTREVISTAS_QUERY_KEY = ["entrevistas"] as const;

export function useEntrevistas(empresaId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...ENTREVISTAS_QUERY_KEY, empresaId ?? "none"],
    queryFn: () => fetchEntrevistas(empresaId!),
    enabled: !!empresaId,
  });

  const insertMutation = useMutation({
    mutationFn: (payload: EntrevistaInsert) => insertEntrevista(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ENTREVISTAS_QUERY_KEY, variables.empresa_id],
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateEntrevistaStatus(id, status),
    onSuccess: () => {
      if (empresaId) {
        queryClient.invalidateQueries({
          queryKey: [...ENTREVISTAS_QUERY_KEY, empresaId],
        });
      }
    },
  });

  const updateTranscricaoMutation = useMutation({
    mutationFn: ({ id, transcricao }: { id: string; transcricao: string }) =>
      updateEntrevistaTranscricao(id, transcricao),
    onSuccess: () => {
      if (empresaId) {
        queryClient.invalidateQueries({
          queryKey: [...ENTREVISTAS_QUERY_KEY, empresaId],
        });
      }
    },
  });

  return {
    entrevistas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    insertEntrevista: insertMutation.mutateAsync,
    insertLoading: insertMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    updateTranscricao: updateTranscricaoMutation.mutateAsync,
    updateTranscricaoLoading: updateTranscricaoMutation.isPending,
  };
}
