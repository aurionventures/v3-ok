import { useQuery } from "@tanstack/react-query";
import { useEmpresas } from "@/hooks/useEmpresas";
import {
  fetchIndicadoresTarefas,
  fetchAtasPendentesResumo,
  fetchAtasPorStatus,
  type IndicadoresTarefas,
  type AtasPendentesResumo,
  type AtaListItem,
} from "@/services/secretariado";

const SECRETARIADO_INDICADORES_KEY = ["secretariado", "indicadores"] as const;
const SECRETARIADO_ATAS_KEY = ["secretariado", "atas"] as const;
const SECRETARIADO_ATAS_APROVACAO_KEY = ["secretariado", "atas", "aprovacao"] as const;
const SECRETARIADO_ATAS_ASSINATURA_KEY = ["secretariado", "atas", "assinatura"] as const;

export function useSecretariadoIndicadores() {
  const { firstEmpresaId } = useEmpresas();

  const tarefasQuery = useQuery({
    queryKey: [...SECRETARIADO_INDICADORES_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchIndicadoresTarefas(firstEmpresaId),
    enabled: !!firstEmpresaId,
  });

  const atasQuery = useQuery({
    queryKey: [...SECRETARIADO_ATAS_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchAtasPendentesResumo(firstEmpresaId),
    enabled: !!firstEmpresaId,
  });

  const atasAprovacaoQuery = useQuery({
    queryKey: [...SECRETARIADO_ATAS_APROVACAO_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchAtasPorStatus(firstEmpresaId, "aguardando_aprovacao"),
    enabled: !!firstEmpresaId,
  });

  const atasAssinaturaQuery = useQuery({
    queryKey: [...SECRETARIADO_ATAS_ASSINATURA_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchAtasPorStatus(firstEmpresaId, "aguardando_assinatura"),
    enabled: !!firstEmpresaId,
  });

  return {
    indicadoresTarefas: (tarefasQuery.data ?? {
      total: 0,
      resolvidas: 0,
      pendentes: 0,
      taxaResolucao: 0,
      statusPieData: [],
      tarefasPorOrgao: [],
    }) as IndicadoresTarefas,
    atasPendentes: (atasQuery.data ?? {
      aguardandoAprovacao: 0,
      aguardandoAssinatura: 0,
      finalizadas: 0,
    }) as AtasPendentesResumo,
    atasAguardandoAprovacao: (atasAprovacaoQuery.data ?? []) as AtaListItem[],
    atasAguardandoAssinatura: (atasAssinaturaQuery.data ?? []) as AtaListItem[],
    isLoading: tarefasQuery.isLoading || atasQuery.isLoading,
    error: tarefasQuery.error ?? atasQuery.error,
  };
}
