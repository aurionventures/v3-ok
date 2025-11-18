import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  description: string;
  metadata: any;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export const useSecurityEvents = (filters?: {
  resolved?: boolean;
  severity?: string;
  limit?: number;
}) => {
  const queryClient = useQueryClient();
  const { resolved, severity, limit = 50 } = filters || {};

  const query = useQuery({
    queryKey: ['security-events', resolved, severity, limit],
    queryFn: async () => {
      let query = supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (resolved !== undefined) {
        query = query.eq('resolved', resolved);
      }
      if (severity) {
        query = query.eq('severity', severity);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as SecurityEvent[];
    }
  });

  // Realtime subscription para novos eventos
  useEffect(() => {
    const channel = supabase
      .channel('security-events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['security-events'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    events: query.data || [],
    loading: query.isLoading,
    error: query.error
  };
};

export const useResolveSecurityEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, notes }: { eventId: string; notes?: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('security_events')
        .update({
          resolved: true,
          resolved_by: userData.user.id,
          resolved_at: new Date().toISOString(),
          metadata: { resolution_notes: notes }
        })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-events'] });
    }
  });
};

export const useSecurityStats = () => {
  return useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('severity, resolved, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const total = data.length;
      const resolved = data.filter(e => e.resolved).length;
      const bySeverity = data.reduce((acc: any, e: any) => {
        acc[e.severity] = (acc[e.severity] || 0) + 1;
        return acc;
      }, {});

      return {
        total,
        resolved,
        unresolved: total - resolved,
        critical: bySeverity.CRITICAL || 0,
        high: bySeverity.HIGH || 0,
        medium: bySeverity.MEDIUM || 0,
        low: bySeverity.LOW || 0
      };
    }
  });
};