import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GuestToken {
  id: string;
  meeting_participant_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  last_accessed_at: string | null;
  access_count: number;
  can_upload: boolean;
  can_view_materials: boolean;
  created_by: string | null;
  created_at: string;
}

export const useGuestTokens = (participantId?: string) => {
  const queryClient = useQueryClient();

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['guest-tokens', participantId],
    queryFn: async () => {
      let query = supabase
        .from('guest_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (participantId) {
        query = query.eq('meeting_participant_id', participantId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GuestToken[];
    },
    enabled: !!participantId,
  });

  const generateToken = useMutation({
    mutationFn: async (params: {
      participantId: string;
      expiresInDays: number;
      canUpload: boolean;
      canViewMaterials: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + params.expiresInDays);

      const { data, error } = await supabase
        .from('guest_tokens')
        .insert({
          meeting_participant_id: params.participantId,
          expires_at: expiresAt.toISOString(),
          can_upload: params.canUpload,
          can_view_materials: params.canViewMaterials,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-tokens'] });
      toast.success('Link de acesso gerado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao gerar link: ' + error.message);
    },
  });

  const revokeToken = useMutation({
    mutationFn: async (tokenId: string) => {
      const { error } = await supabase
        .from('guest_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-tokens'] });
      toast.success('Link revogado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao revogar link: ' + error.message);
    },
  });

  return {
    tokens,
    isLoading,
    generateToken: generateToken.mutateAsync,
    revokeToken: revokeToken.mutate,
  };
};
