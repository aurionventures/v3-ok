import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string | null;
  external_name: string | null;
  external_email: string | null;
  external_phone: string | null;
  role: 'MEMBRO' | 'CONVIDADO' | 'OBSERVADOR';
  can_upload: boolean;
  can_view_materials: boolean;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useMeetingParticipants = (meetingId: string) => {
  const queryClient = useQueryClient();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['meeting-participants', meetingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MeetingParticipant[];
    },
    enabled: !!meetingId,
  });

  const addParticipant = useMutation({
    mutationFn: async (participant: Omit<MeetingParticipant, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('meeting_participants')
        .insert({
          ...participant,
          invited_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-participants', meetingId] });
      toast.success('Participante adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao adicionar participante: ' + error.message);
    },
  });

  const updateParticipant = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MeetingParticipant> }) => {
      const { data, error } = await supabase
        .from('meeting_participants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-participants', meetingId] });
      toast.success('Participante atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar participante: ' + error.message);
    },
  });

  const removeParticipant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meeting_participants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-participants', meetingId] });
      toast.success('Participante removido com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover participante: ' + error.message);
    },
  });

  return {
    participants,
    isLoading,
    addParticipant: addParticipant.mutate,
    updateParticipant: updateParticipant.mutate,
    removeParticipant: removeParticipant.mutate,
  };
};
