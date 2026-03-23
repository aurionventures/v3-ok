import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReunioes, insertReuniao } from "@/services/agenda";
import type { ReuniaoInsert } from "@/types/agenda";

export const AGENDA_QUERY_KEY = ["agenda"] as const;

export function useAgenda(empresaId: string | null, ano?: number) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: [...AGENDA_QUERY_KEY, empresaId ?? "none", ano ?? "all"],
    queryFn: () => fetchReunioes(empresaId!, ano),
    enabled: !!empresaId,
  });
  const insertMt = useMutation({
    mutationFn: insertReuniao,
    onSuccess: () => {
      if (empresaId) {
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, empresaId, ano ?? "all"] });
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, empresaId, "all"] });
      }
    },
  });
  return {
    reunioes: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    insertReuniao: insertMt.mutateAsync,
    insertReuniaoLoading: insertMt.isPending,
  };
}
