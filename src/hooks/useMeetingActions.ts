import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MeetingAction {
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
}

export interface MeetingActionFormData {
  meeting_item_id?: string;
  responsible_id?: string;
  responsible_external_name?: string;
  responsible_external_email?: string;
  description: string;
  due_date: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA';
  priority?: 'BAIXA' | 'MEDIA' | 'ALTA';
  category?: string;
  notes?: string;
}

export const useMeetingActions = (meetingId: string | undefined) => {
  const [actions, setActions] = useState<MeetingAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActions = async () => {
    if (!meetingId) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('meeting_actions')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;

      const typedData = (data || []).map(action => ({
        ...action,
        status: action.status as 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA',
        priority: action.priority as 'BAIXA' | 'MEDIA' | 'ALTA',
      }));

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

  const createAction = async (actionData: MeetingActionFormData) => {
    if (!meetingId) return { error: 'Meeting ID is required' };

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error: createError } = await supabase
        .from('meeting_actions')
        .insert({
          meeting_id: meetingId,
          ...actionData,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchActions();
      
      // Gerar token demo e link de acesso se houver responsável
      if (data && actionData.responsible_external_email) {
        const token = crypto.randomUUID();
        const demoLink = `${window.location.origin}/task-access/${token}`;
        
        // Salvar token no localStorage para validação
        localStorage.setItem(`task_token_${token}`, JSON.stringify({
          actionId: data.id,
          responsibleName: actionData.responsible_external_name,
          responsibleEmail: actionData.responsible_external_email,
          createdAt: new Date().toISOString(),
        }));
        
        // Copiar automaticamente para área de transferência
        navigator.clipboard.writeText(demoLink);
        
        toast({
          title: '✅ Pendência criada e link copiado!',
          description: `Link de acesso copiado. Envie para ${actionData.responsible_external_name}`,
        });
      } else {
        toast({
          title: 'Pendência criada',
          description: 'A pendência foi adicionada com sucesso.',
        });
      }

      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar pendência';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { data: null, error: errorMessage };
    }
  };

  const updateAction = async (actionId: string, updates: Partial<MeetingActionFormData>) => {
    try {
      const { error: updateError } = await supabase
        .from('meeting_actions')
        .update(updates)
        .eq('id', actionId);

      if (updateError) throw updateError;

      await fetchActions();
      
      toast({
        title: 'Pendência atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar pendência';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  const deleteAction = async (actionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('meeting_actions')
        .delete()
        .eq('id', actionId);

      if (deleteError) throw deleteError;

      await fetchActions();
      
      toast({
        title: 'Pendência excluída',
        description: 'A pendência foi removida com sucesso.',
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir pendência';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  const getActionsByStatus = (status: MeetingAction['status']) => {
    return actions.filter(action => action.status === status);
  };

  const getOverdueActions = () => {
    return actions.filter(action => action.status === 'ATRASADA');
  };

  const getPendingActions = () => {
    return actions.filter(action => 
      action.status === 'PENDENTE' || action.status === 'EM_ANDAMENTO'
    );
  };

  const getCompletedActions = () => {
    return actions.filter(action => action.status === 'CONCLUIDA');
  };

  useEffect(() => {
    fetchActions();
  }, [meetingId]);

  return {
    actions,
    loading,
    error,
    fetchActions,
    createAction,
    updateAction,
    deleteAction,
    getActionsByStatus,
    getOverdueActions,
    getPendingActions,
    getCompletedActions,
  };
};
