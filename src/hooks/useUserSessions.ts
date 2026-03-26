import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

export const useUserSessions = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-sessions', userId],
    queryFn: async () => {
      let query = supabase
        .from('user_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as UserSession[];
    }
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return {
    sessions: query.data || [],
    loading: query.isLoading,
    error: query.error
  };
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
    }
  });
};