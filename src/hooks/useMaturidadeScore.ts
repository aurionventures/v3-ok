import { useQuery } from "@tanstack/react-query";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchMaturidadeScore, type MaturidadeScore } from "@/services/maturidade";

const MATURIDADE_SCORE_KEY = ["maturidade", "score"] as const;

export function useMaturidadeScore() {
  const { data: membro } = useCurrentMembro();
  const empresaId = membro?.empresa_id ?? null;

  const query = useQuery({
    queryKey: [...MATURIDADE_SCORE_KEY, empresaId ?? "none"],
    queryFn: () => fetchMaturidadeScore(empresaId),
    enabled: !!empresaId,
  });

  const scoreData = query.data as MaturidadeScore | null | undefined;

  return {
    score: scoreData?.score ?? null,
    fullMark: scoreData?.fullMark ?? 5,
    estagio: scoreData?.estagio,
    isLoading: query.isLoading,
    error: query.error,
  };
}
