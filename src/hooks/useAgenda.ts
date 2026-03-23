import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReunioes, insertReuniao, insertReunioesEmLote, deleteReunioesPorEmpresaAno } from "@/services/agenda";
import type { ReuniaoInsert } from "@/types/agenda";

export const AGENDA_QUERY_KEY = ["agenda"] as const;

type InsertEmLoteParams = {
  empresaId: string;
  itens: Omit<ReuniaoInsert, "empresa_id">[];
};

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
  const insertEmLoteMt = useMutation({
    mutationFn: ({ empresaId, itens }: InsertEmLoteParams) =>
      insertReunioesEmLote(itens, empresaId),
    onSuccess: (_data, variables) => {
      if (variables.empresaId) {
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, variables.empresaId] });
      }
    },
  });
  const deleteMt = useMutation({
    mutationFn: ({ empresaId, ano }: { empresaId: string; ano: number }) =>
      deleteReunioesPorEmpresaAno(empresaId, ano),
    onSuccess: (_data, variables) => {
      if (variables.empresaId) {
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, variables.empresaId] });
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, variables.empresaId, variables.ano] });
        qc.invalidateQueries({ queryKey: [...AGENDA_QUERY_KEY, variables.empresaId, "all"] });
      }
    },
  });
  return {
    reunioes: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    insertReuniao: insertMt.mutateAsync,
    insertReuniaoLoading: insertMt.isPending,
    insertReunioesEmLote: insertEmLoteMt.mutateAsync,
    insertReunioesEmLoteLoading: insertEmLoteMt.isPending,
    limparAgendas: deleteMt.mutateAsync,
    limparAgendasLoading: deleteMt.isPending,
  };
}
