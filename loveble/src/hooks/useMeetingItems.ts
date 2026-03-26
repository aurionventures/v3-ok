import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MeetingItem {
  id: string;
  meeting_id: string;
  order_position: number;
  title: string;
  description: string | null;
  presenter: string | null;
  duration_minutes: number | null;
  type: 'Deliberação' | 'Informativo' | 'Discussão';
  is_sensitive: boolean;
  key_points: string[];
  detailed_script: string | null;
  expected_outcome: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetingItemFormData {
  title: string;
  description?: string;
  presenter?: string;
  duration_minutes?: number;
  type: 'Deliberação' | 'Informativo' | 'Discussão';
  is_sensitive?: boolean;
  key_points?: string[];
  detailed_script?: string;
  expected_outcome?: string;
  order_position?: number;
}

export const useMeetingItems = (meetingId: string | undefined) => {
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!meetingId) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('meeting_items')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('order_position', { ascending: true });

      if (fetchError) throw fetchError;

      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as 'Deliberação' | 'Informativo' | 'Discussão',
        key_points: (item.key_points as any) || [],
      }));

      setItems(typedData);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar pautas';
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

  const createItem = async (itemData: MeetingItemFormData) => {
    if (!meetingId) return { error: 'Meeting ID is required' };

    try {
      // Get the highest order_position
      const maxOrder = items.length > 0 
        ? Math.max(...items.map(i => i.order_position))
        : -1;

      const { data, error: createError } = await supabase
        .from('meeting_items')
        .insert({
          meeting_id: meetingId,
          ...itemData,
          order_position: itemData.order_position ?? maxOrder + 1,
          key_points: itemData.key_points || [],
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchItems();
      
      toast({
        title: 'Pauta criada',
        description: 'A pauta foi adicionada com sucesso.',
      });

      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar pauta';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { data: null, error: errorMessage };
    }
  };

  const updateItem = async (itemId: string, updates: Partial<MeetingItemFormData>) => {
    try {
      const { error: updateError } = await supabase
        .from('meeting_items')
        .update(updates)
        .eq('id', itemId);

      if (updateError) throw updateError;

      await fetchItems();
      
      toast({
        title: 'Pauta atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar pauta';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('meeting_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      await fetchItems();
      
      toast({
        title: 'Pauta excluída',
        description: 'A pauta foi removida com sucesso.',
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir pauta';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  const reorderItems = async (newOrder: { id: string; order_position: number }[]) => {
    try {
      const updates = newOrder.map(({ id, order_position }) =>
        supabase
          .from('meeting_items')
          .update({ order_position })
          .eq('id', id)
      );

      await Promise.all(updates);
      await fetchItems();

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao reordenar pautas';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchItems();
  }, [meetingId]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
  };
};
