import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchMembroByUserId } from "@/services/governance";

export interface CurrentMembro {
  id: string;
  nome: string;
  email: string | null;
  empresa_id: string;
}

export function useCurrentMembro() {
  return useQuery({
    queryKey: ["member", "current"],
    queryFn: async (): Promise<CurrentMembro | null> => {
      if (!supabase) return null;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      const membro = await fetchMembroByUserId(session.user.id);
      if (!membro) return null;
      return {
        id: membro.id,
        nome: membro.nome,
        email: membro.email,
        empresa_id: membro.empresa_id,
      };
    },
  });
}
