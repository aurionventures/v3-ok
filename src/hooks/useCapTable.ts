import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCapTable,
  insertCapTableEntry,
  deleteCapTableEntry,
} from "@/services/capTable";
import type { CapTableInsert } from "@/types/capTable";

export const CAP_TABLE_QUERY_KEY = ["cap-table"] as const;

export function useCapTable(empresaId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...CAP_TABLE_QUERY_KEY, empresaId ?? "none"],
    queryFn: () => fetchCapTable(empresaId!),
    enabled: !!empresaId,
  });

  const insertMutation = useMutation({
    mutationFn: (payload: CapTableInsert) => insertCapTableEntry(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CAP_TABLE_QUERY_KEY, variables.empresa_id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCapTableEntry(id),
    onSuccess: () => {
      if (empresaId) {
        queryClient.invalidateQueries({
          queryKey: [...CAP_TABLE_QUERY_KEY, empresaId],
        });
      }
    },
  });

  return {
    shareholders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    insertEntry: insertMutation.mutateAsync,
    insertLoading: insertMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
  };
}
