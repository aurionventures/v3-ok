import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  metadata: any;
  created_at: string;
}

interface UseAuditLogsOptions {
  userId?: string;
  entityType?: string;
  action?: string;
  limit?: number;
}

export const useAuditLogs = (options: UseAuditLogsOptions = {}) => {
  const { userId, entityType, action, limit = 100 } = options;

  const query = useQuery({
    queryKey: ['audit-logs', userId, entityType, action, limit],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (entityType) {
        query = query.eq('entity_type', entityType);
      }
      if (action) {
        query = query.eq('action', action);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AuditLog[];
    }
  });

  return {
    logs: query.data || [],
    loading: query.isLoading,
    error: query.error
  };
};

export const useUserActivitySummary = (userId: string) => {
  return useQuery({
    queryKey: ['user-activity-summary', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agregar por ação
      const summary = data.reduce((acc: any, log: any) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {});

      return {
        totalActions: data.length,
        actionBreakdown: summary,
        recentActivity: data.slice(0, 10)
      };
    }
  });
};

interface CreateAuditLogParams {
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
}

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateAuditLogParams) => {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          action: params.action,
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          old_values: params.old_values,
          new_values: params.new_values,
          metadata: params.metadata,
          success: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    }
  });
};