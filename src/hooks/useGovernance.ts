import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchConselhos,
  fetchComites,
  fetchComissoes,
  fetchMembros,
  insertConselho,
  insertComite,
  insertComissao,
  insertMembro,
  insertMembroComAcesso,
  insertAlocacao,
  updateMembro,
  deleteConselho,
  deleteComite,
  deleteComissao,
  deleteMembro,
} from "@/services/governance";
import type {
  ConselhoInsert,
  ComiteInsert,
  ComissaoInsert,
  MembroInsert,
  MembroInsertComAcesso,
  AlocacaoInsert,
} from "@/types/governance";

export const GOVERNANCE_QUERY_KEY = ["governance"] as const;

export function useGovernance(empresaId: string | null) {
  const qc = useQueryClient();

  const inval = () => {
    if (empresaId) {
      qc.invalidateQueries({ queryKey: [...GOVERNANCE_QUERY_KEY, empresaId] });
    }
  };

  const conselhosQ = useQuery({
    queryKey: [...GOVERNANCE_QUERY_KEY, empresaId ?? "none", "conselhos"],
    queryFn: () => fetchConselhos(empresaId!),
    enabled: !!empresaId,
  });

  const comitesQ = useQuery({
    queryKey: [...GOVERNANCE_QUERY_KEY, empresaId ?? "none", "comites"],
    queryFn: () => fetchComites(empresaId!),
    enabled: !!empresaId,
  });

  const comissoesQ = useQuery({
    queryKey: [...GOVERNANCE_QUERY_KEY, empresaId ?? "none", "comissoes"],
    queryFn: () => fetchComissoes(empresaId!),
    enabled: !!empresaId,
  });

  const membrosQ = useQuery({
    queryKey: [...GOVERNANCE_QUERY_KEY, empresaId ?? "none", "membros"],
    queryFn: () => fetchMembros(empresaId!),
    enabled: !!empresaId,
  });

  const insertConselhoMt = useMutation({
    mutationFn: insertConselho,
    onSuccess: inval,
  });

  const insertComiteMt = useMutation({
    mutationFn: insertComite,
    onSuccess: inval,
  });

  const insertComissaoMt = useMutation({
    mutationFn: insertComissao,
    onSuccess: inval,
  });

  const insertMembroMt = useMutation({
    mutationFn: insertMembro,
    onSuccess: inval,
  });

  const insertMembroComAcessoMt = useMutation({
    mutationFn: insertMembroComAcesso,
    onSuccess: inval,
  });

  const insertAlocacaoMt = useMutation({
    mutationFn: insertAlocacao,
    onSuccess: inval,
  });

  const updateMembroMt = useMutation({
    mutationFn: ({ id, p }: { id: string; p: { nome?: string; cargo_principal?: string | null } }) => updateMembro(id, p),
    onSuccess: inval,
  });

  const deleteConselhoMt = useMutation({
    mutationFn: deleteConselho,
    onSuccess: inval,
  });

  const deleteComiteMt = useMutation({
    mutationFn: deleteComite,
    onSuccess: inval,
  });

  const deleteComissaoMt = useMutation({
    mutationFn: deleteComissao,
    onSuccess: inval,
  });

  const deleteMembroMt = useMutation({
    mutationFn: deleteMembro,
    onSuccess: inval,
  });

  const totalMembrosAlocados =
    (conselhosQ.data?.reduce((s, c) => s + c.membros, 0) ?? 0) +
    (comitesQ.data?.reduce((s, c) => s + c.membros, 0) ?? 0) +
    (comissoesQ.data?.reduce((s, c) => s + c.membros, 0) ?? 0);

  return {
    conselhos: conselhosQ.data ?? [],
    comites: comitesQ.data ?? [],
    comissoes: comissoesQ.data ?? [],
    membros: membrosQ.data ?? [],
    isLoading: conselhosQ.isLoading || comitesQ.isLoading || comissoesQ.isLoading || membrosQ.isLoading,
    totalMembrosAlocados,
    insertConselho: insertConselhoMt.mutateAsync,
    insertComite: insertComiteMt.mutateAsync,
    insertComissao: insertComissaoMt.mutateAsync,
    insertMembro: insertMembroMt.mutateAsync,
    insertMembroComAcesso: insertMembroComAcessoMt.mutateAsync,
    insertAlocacao: insertAlocacaoMt.mutateAsync,
    updateMembro: updateMembroMt.mutateAsync,
    deleteConselho: deleteConselhoMt.mutateAsync,
    deleteComite: deleteComiteMt.mutateAsync,
    deleteComissao: deleteComissaoMt.mutateAsync,
    deleteMembro: deleteMembroMt.mutateAsync,
    insertConselhoLoading: insertConselhoMt.isPending,
    insertComiteLoading: insertComiteMt.isPending,
    insertComissaoLoading: insertComissaoMt.isPending,
    insertMembroLoading: insertMembroMt.isPending,
    insertMembroComAcessoLoading: insertMembroComAcessoMt.isPending,
    insertAlocacaoLoading: insertAlocacaoMt.isPending,
    updateMembroLoading: updateMembroMt.isPending,
  };
}
