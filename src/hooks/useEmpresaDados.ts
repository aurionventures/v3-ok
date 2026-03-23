import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmpresas } from "@/hooks/useEmpresas";
import {
  fetchEmpresaDados,
  updateEmpresaDados,
  type EmpresaDados,
  type EmpresaDadosUpdate,
} from "@/services/empresas";

const EMPRESA_DADOS_KEY = ["empresa", "dados"] as const;

export function useEmpresaDados() {
  const { firstEmpresaId } = useEmpresas();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...EMPRESA_DADOS_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchEmpresaDados(firstEmpresaId!),
    enabled: !!firstEmpresaId,
  });

  const mutation = useMutation({
    mutationFn: (dados: EmpresaDadosUpdate) => {
      if (!firstEmpresaId) throw new Error("Nenhuma empresa selecionada");
      return updateEmpresaDados(firstEmpresaId, dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...EMPRESA_DADOS_KEY, firstEmpresaId] });
    },
  });

  const defaultDados: EmpresaDados = {
    setor: null,
    segmento: null,
    porte: null,
    areas_atuacao: null,
    descricao: null,
    missao: null,
  };

  return {
    dados: query.data ?? defaultDados,
    isLoading: query.isLoading,
    error: query.error,
    hasEmpresa: !!firstEmpresaId,
    saveDados: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
