import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InterviewTranscript {
  id: string;
  interview_id: string;
  transcript_text: string;
  uploaded_at: string;
  created_by: string | null;
}

export const useInterviewTranscripts = (interviewId?: string) => {
  const [transcripts, setTranscripts] = useState<InterviewTranscript[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTranscripts = async (id?: string) => {
    if (!id && !interviewId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interview_transcripts')
        .select('*')
        .eq('interview_id', id || interviewId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setTranscripts(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar transcrições',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      fetchTranscripts(interviewId);
    }
  }, [interviewId]);

  const createTranscript = async (interview_id: string, transcript_text: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('interview_transcripts')
        .insert([{ interview_id, transcript_text, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTranscripts(prev => [data, ...prev]);
      toast({
        title: 'Transcrição salva',
        description: 'A transcrição foi adicionada com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar transcrição',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTranscript = async (id: string, transcript_text: string) => {
    try {
      const { data, error } = await supabase
        .from('interview_transcripts')
        .update({ transcript_text })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTranscripts(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: 'Transcrição atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar transcrição',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getAllTranscripts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interview_transcripts')
        .select(`
          *,
          interviews:interview_id (
            name,
            role,
            interview_date
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar transcrições',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    transcripts,
    loading,
    createTranscript,
    updateTranscript,
    fetchTranscripts,
    getAllTranscripts,
  };
};
