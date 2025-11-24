import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MeetingActionWithContext {
  id: string;
  meeting_id: string;
  meeting_item_id: string | null;
  responsible_id: string | null;
  responsible_external_name: string | null;
  responsible_external_email: string | null;
  description: string;
  due_date: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA';
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  category: string | null;
  notes: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  meeting?: {
    id: string;
    title: string;
    date: string;
    council_id: string;
    councils?: {
      id: string;
      name: string;
      organ_type: string;
    };
  };
}

export const useAllMeetingActions = () => {
  const [actions, setActions] = useState<MeetingActionWithContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllActions = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('meeting_actions')
        .select(`
          *,
          meetings (
            id,
            title,
            date,
            council_id,
            councils (
              id,
              name,
              organ_type
            )
          )
        `)
        .in('status', ['PENDENTE', 'EM_ANDAMENTO', 'ATRASADA'])
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;

      const typedData = (data || []).map(action => ({
        ...action,
        status: action.status as 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA',
        priority: action.priority as 'BAIXA' | 'MEDIA' | 'ALTA',
      })) as MeetingActionWithContext[];

      setActions(typedData);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar pendências';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const completeAction = async (actionId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('meeting_actions')
        .update({ 
          status: 'CONCLUIDA',
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (updateError) throw updateError;

      await fetchAllActions();
      
      toast({
        title: 'Pendência concluída',
        description: 'A tarefa foi marcada como concluída.',
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao concluir pendência';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  const getActionsByOrganType = (organType: string) => {
    return actions.filter(action => 
      action.meeting?.councils?.organ_type === organType
    );
  };

  const getActionsByOrgan = (councilId: string) => {
    return actions.filter(action => 
      action.meeting?.council_id === councilId
    );
  };

  const getOverdueActions = () => {
    return actions.filter(action => action.status === 'ATRASADA');
  };

  const getDueTodayActions = () => {
    const today = new Date().toISOString().split('T')[0];
    return actions.filter(action => 
      action.due_date === today && action.status !== 'ATRASADA'
    );
  };

  const getDueInDaysActions = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const target = targetDate.toISOString().split('T')[0];
    
    const today = new Date().toISOString().split('T')[0];
    
    return actions.filter(action => {
      return action.due_date > today && action.due_date <= target;
    });
  };

  const getUrgencyCounts = () => {
    return {
      overdue: getOverdueActions().length,
      today: getDueTodayActions().length,
      next3Days: getDueInDaysActions(3).length,
    };
  };

  useEffect(() => {
    fetchAllActions();
  }, []);

  return {
    actions,
    loading,
    error,
    fetchAllActions,
    completeAction,
    getActionsByOrganType,
    getActionsByOrgan,
    getOverdueActions,
    getDueTodayActions,
    getDueInDaysActions,
    getUrgencyCounts,
  };
};
