import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MeetingItemVisibility {
  id: string;
  meeting_item_id: string;
  meeting_participant_id: string;
  can_view: boolean;
  can_comment: boolean;
  created_at: string;
}

export const useMeetingItemVisibility = (participantId?: string) => {
  const queryClient = useQueryClient();

  const { data: visibilities = [], isLoading } = useQuery({
    queryKey: ['meeting-item-visibility', participantId],
    queryFn: async () => {
      if (!participantId) return [];

      const { data, error } = await supabase
        .from('meeting_item_visibility')
        .select('*')
        .eq('meeting_participant_id', participantId);

      if (error) throw error;
      return data as MeetingItemVisibility[];
    },
    enabled: !!participantId,
  });

  const setItemVisibility = useMutation({
    mutationFn: async (params: {
      participantId: string;
      itemId: string;
      canView: boolean;
      canComment?: boolean;
    }) => {
      // Check if visibility already exists
      const { data: existing } = await supabase
        .from('meeting_item_visibility')
        .select('id')
        .eq('meeting_participant_id', params.participantId)
        .eq('meeting_item_id', params.itemId)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('meeting_item_visibility')
          .update({
            can_view: params.canView,
            can_comment: params.canComment ?? false,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('meeting_item_visibility')
          .insert({
            meeting_participant_id: params.participantId,
            meeting_item_id: params.itemId,
            can_view: params.canView,
            can_comment: params.canComment ?? false,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-item-visibility'] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao configurar visibilidade: ' + error.message);
    },
  });

  const setMultipleVisibilities = useMutation({
    mutationFn: async (params: {
      participantId: string;
      itemIds: string[];
      canView: boolean;
    }) => {
      // Delete existing visibilities for this participant
      await supabase
        .from('meeting_item_visibility')
        .delete()
        .eq('meeting_participant_id', params.participantId);

      // Insert new visibilities
      const inserts = params.itemIds.map(itemId => ({
        meeting_participant_id: params.participantId,
        meeting_item_id: itemId,
        can_view: params.canView,
        can_comment: false,
      }));

      const { error } = await supabase
        .from('meeting_item_visibility')
        .insert(inserts);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-item-visibility'] });
      toast.success('Pautas configuradas com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao configurar pautas: ' + error.message);
    },
  });

  return {
    visibilities,
    isLoading,
    setItemVisibility: setItemVisibility.mutate,
    setMultipleVisibilities: setMultipleVisibilities.mutate,
  };
};
