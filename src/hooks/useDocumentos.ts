import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocumentos, uploadAndSaveDocumento } from "@/services/documentos";

export const DOCUMENTOS_QUERY_KEY = ["documentos"] as const;

export function useDocumentos(empresaId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...DOCUMENTOS_QUERY_KEY, empresaId ?? "none"],
    queryFn: () => fetchDocumentos(empresaId!),
    enabled: !!empresaId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      categoria,
    }: {
      file: File;
      categoria?: string;
    }) => uploadAndSaveDocumento(empresaId!, file, categoria),
    onSuccess: () => {
      if (empresaId) {
        queryClient.invalidateQueries({
          queryKey: [...DOCUMENTOS_QUERY_KEY, empresaId],
        });
      }
    },
  });

  const uploadFiles = async (files: File[], categoria?: string) => {
    for (const file of files) {
      const { error } = await uploadMutation.mutateAsync({ file, categoria });
      if (error) throw new Error(error);
    }
  };

  return {
    documentos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    uploadFiles,
    uploadLoading: uploadMutation.isPending,
  };
}
