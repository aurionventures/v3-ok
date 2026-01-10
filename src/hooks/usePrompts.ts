import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIPrompt {
  id: string;
  name: string;
  category: string;
  version: string;
  system_prompt: string;
  user_prompt_template: string | null;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  functions: any;
  tool_choice: string;
  examples: any;
  status: string;
  is_default: boolean;
  ab_test_enabled: boolean;
  ab_test_traffic_percentage: number;
  ab_test_competing_version: string | null;
  total_executions: number;
  avg_latency_ms: number | null;
  avg_tokens_used: number | null;
  avg_cost_usd: number | null;
  success_rate: number | null;
  avg_quality_score: number | null;
  description: string | null;
  changelog: string | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  activated_at: string | null;
  deprecated_at: string | null;
}

export interface CreatePromptInput {
  name: string;
  category: string;
  version: string;
  system_prompt: string;
  user_prompt_template?: string | null;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  functions?: any;
  tool_choice?: string;
  examples?: any;
  status?: string;
  description?: string | null;
  changelog?: string | null;
  tags?: string[] | null;
}

export function usePrompts() {
  const queryClient = useQueryClient();

  // Fetch all prompts
  const { data: prompts, isLoading, error, refetch } = useQuery({
    queryKey: ['ai_prompts'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .select('*')
        .order('category', { ascending: true })
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data as AIPrompt[];
    }
  });

  // Fetch single prompt
  const getPrompt = async (promptId: string) => {
    const { data, error } = await (supabase as any)
      .from('ai_prompt_library')
      .select('*')
      .eq('id', promptId)
      .single();
    
    if (error) throw error;
    return data as AIPrompt;
  };

  // Create prompt mutation
  const createPrompt = useMutation({
    mutationFn: async (input: CreatePromptInput) => {
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Prompt criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao criar prompt: ' + error.message);
    }
  });

  // Update prompt mutation
  const updatePrompt = useMutation({
    mutationFn: async ({ id, ...input }: Partial<AIPrompt> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Prompt atualizado!');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar prompt: ' + error.message);
    }
  });

  // Activate prompt mutation
  const activatePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const prompt = await getPrompt(promptId);
      
      await (supabase as any)
        .from('ai_prompt_library')
        .update({ is_default: false })
        .eq('category', prompt.category)
        .eq('is_default', true);
      
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .update({ 
          status: 'active',
          is_default: true,
          activated_at: new Date().toISOString()
        })
        .eq('id', promptId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Prompt ativado como padrão!');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao ativar prompt: ' + error.message);
    }
  });

  // Deprecate prompt mutation
  const deprecatePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .update({ 
          status: 'deprecated',
          is_default: false,
          deprecated_at: new Date().toISOString()
        })
        .eq('id', promptId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Prompt depreciado');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao depreciar prompt: ' + error.message);
    }
  });

  // Duplicate prompt mutation
  const duplicatePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const prompt = await getPrompt(promptId);
      const [major, minor] = prompt.version.split('.').map(Number);
      const newVersion = `${major}.${minor + 1}.0`;
      
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .insert({
          name: `${prompt.name} (Cópia)`,
          category: prompt.category,
          version: newVersion,
          system_prompt: prompt.system_prompt,
          user_prompt_template: prompt.user_prompt_template,
          model: prompt.model,
          temperature: prompt.temperature,
          max_tokens: prompt.max_tokens,
          top_p: prompt.top_p,
          frequency_penalty: prompt.frequency_penalty,
          presence_penalty: prompt.presence_penalty,
          functions: prompt.functions,
          tool_choice: prompt.tool_choice,
          examples: prompt.examples,
          status: 'draft',
          is_default: false,
          description: prompt.description,
          tags: prompt.tags,
          changelog: `Duplicado de v${prompt.version}`
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Prompt duplicado!');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao duplicar prompt: ' + error.message);
    }
  });

  // Delete prompt mutation
  const deletePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await (supabase as any)
        .from('ai_prompt_library')
        .delete()
        .eq('id', promptId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Prompt removido');
      queryClient.invalidateQueries({ queryKey: ['ai_prompts'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao remover prompt: ' + error.message);
    }
  });

  const getPromptsByCategory = (category: string) => prompts?.filter(p => p.category === category) || [];
  const getActivePromptForCategory = (category: string) => prompts?.find(p => p.category === category && p.is_default);

  return {
    prompts,
    isLoading,
    error,
    refetch,
    getPrompt,
    getPromptsByCategory,
    getActivePromptForCategory,
    createPrompt,
    updatePrompt,
    activatePrompt,
    deprecatePrompt,
    duplicatePrompt,
    deletePrompt
  };
}
