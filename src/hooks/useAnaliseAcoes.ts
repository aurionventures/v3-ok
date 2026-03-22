import { useMutation } from "@tanstack/react-query";
import { executarAnaliseAcoes } from "@/services/analiseAcoes";
import type { Documento } from "@/types/documentos";
import type { Entrevista } from "@/types/entrevistas";
import type { AnaliseAcoesResult } from "@/types/analiseAcoes";

export function useAnaliseAcoes() {
  const mutation = useMutation({
    mutationFn: ({
      documentos,
      entrevistas,
    }: {
      documentos: Documento[];
      entrevistas: Entrevista[];
    }) => executarAnaliseAcoes(documentos, entrevistas),
  });

  return {
    executar: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
