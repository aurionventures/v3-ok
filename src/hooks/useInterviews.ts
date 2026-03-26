import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Interview {
  id: string;
  user_id: string;
  company_id: string;
  name: string;
  role: string;
  email?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'interviewed' | 'scheduled' | 'pending';
  scheduled_date?: string;
  interview_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterviews((data || []) as Interview[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar entrevistas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const createInterview = async (interview: Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('interviews')
        .insert([{ ...interview, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setInterviews(prev => [data as Interview, ...prev]);
      toast({
        title: 'Entrevista criada',
        description: 'A entrevista foi adicionada com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar entrevista',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInterviews(prev => prev.map(i => i.id === id ? (data as Interview) : i));
      toast({
        title: 'Entrevista atualizada',
        description: 'As informações foram atualizadas com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar entrevista',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInterviews(prev => prev.filter(i => i.id !== id));
      toast({
        title: 'Entrevista removida',
        description: 'A entrevista foi excluída com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover entrevista',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markAsInterviewed = async (id: string) => {
    return updateInterview(id, {
      status: 'interviewed',
      interview_date: new Date().toISOString(),
    });
  };

  const scheduleInterview = async (id: string, date: Date) => {
    return updateInterview(id, {
      status: 'scheduled',
      scheduled_date: date.toISOString(),
    });
  };

  const getStatusCounts = () => {
    return {
      interviewed: interviews.filter(i => i.status === 'interviewed').length,
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      pending: interviews.filter(i => i.status === 'pending').length,
      total: interviews.length,
    };
  };

  const getPriorityInterviewees = () => {
    return interviews
      .filter(i => i.status === 'pending' && i.priority === 'high')
      .slice(0, 3);
  };

  const getProgressPercentage = () => {
    if (interviews.length === 0) return 0;
    const interviewed = interviews.filter(i => i.status === 'interviewed').length;
    return Math.round((interviewed / interviews.length) * 100);
  };

  return {
    interviews,
    loading,
    createInterview,
    updateInterview,
    deleteInterview,
    markAsInterviewed,
    scheduleInterview,
    getStatusCounts,
    getPriorityInterviewees,
    getProgressPercentage,
    refetch: fetchInterviews,
  };
};
