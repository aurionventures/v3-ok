import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchMembroPerfil, updateMembroPerfil, type MembroPerfilCompleto } from "@/services/governance";

export function useMembroPerfil() {
  const qc = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["member", "perfil"],
    queryFn: async (): Promise<MembroPerfilCompleto | null> => {
      if (!supabase) return null;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      return fetchMembroPerfil(session.user.id);
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Pick<MembroPerfilCompleto, "nome" | "cargo_principal" | "formacao" | "linkedin" | "certificados" | "bio">>) => {
      if (!profileQuery.data?.id || !supabase) throw new Error("Perfil não carregado");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Não autenticado");
      const { error } = await updateMembroPerfil(profileQuery.data.id, session.user.id, updates);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["member", "perfil"] });
      qc.invalidateQueries({ queryKey: ["member", "current"] });
    },
  });
  return {
    perfil: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
