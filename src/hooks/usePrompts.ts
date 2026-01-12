import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { mockPromptsData } from '@/data/mockPromptsData';

// Tipos estratégicos para governança de prompts
export type StrategicType = 'strategic' | 'governance' | 'operational';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';
export type PromptScope = 'council' | 'committee' | 'operation' | 'system';
export type AgentType = 'moat_engine' | 'copilot' | 'service';

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
  // Campos estratégicos de governança
  strategic_type: StrategicType;
  impact_level: ImpactLevel;
  scope: PromptScope;
  agent_type: AgentType;
  owner: string | null;
  executive_description: string | null;
  connected_copilots: string[] | null;
  connected_services: string[] | null;
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
  // Campos estratégicos
  strategic_type?: StrategicType;
  impact_level?: ImpactLevel;
  scope?: PromptScope;
  agent_type?: AgentType;
  owner?: string | null;
  executive_description?: string | null;
  connected_copilots?: string[] | null;
  connected_services?: string[] | null;
}

// Create a store for mock prompts that persists across hook instances
let mockPromptsStore: AIPrompt[] = [...mockPromptsData];

export function usePrompts() {
  const [prompts, setPromptsState] = useState<AIPrompt[]>(mockPromptsStore);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  // Update both local state and store
  const setPrompts = useCallback((newPrompts: AIPrompt[] | ((prev: AIPrompt[]) => AIPrompt[])) => {
    if (typeof newPrompts === 'function') {
      mockPromptsStore = newPrompts(mockPromptsStore);
    } else {
      mockPromptsStore = newPrompts;
    }
    setPromptsState(mockPromptsStore);
  }, []);

  // Refetch just updates state from store
  const refetch = useCallback(() => {
    setPromptsState([...mockPromptsStore]);
  }, []);

  // Get single prompt
  const getPrompt = useCallback(async (promptId: string) => {
    const prompt = mockPromptsStore.find(p => p.id === promptId);
    if (!prompt) throw new Error('Prompt não encontrado');
    return prompt;
  }, []);

  // Create prompt mutation
  const createPrompt = {
    mutateAsync: async (input: CreatePromptInput) => {
      const newPrompt: AIPrompt = {
        id: `prompt-${Date.now()}`,
        name: input.name,
        category: input.category,
        version: input.version,
        system_prompt: input.system_prompt,
        user_prompt_template: input.user_prompt_template || null,
        model: input.model || 'google/gemini-3-flash-preview',
        temperature: input.temperature ?? 0.7,
        max_tokens: input.max_tokens ?? 4000,
        top_p: input.top_p ?? 1.0,
        frequency_penalty: input.frequency_penalty ?? 0,
        presence_penalty: input.presence_penalty ?? 0,
        functions: input.functions || null,
        tool_choice: input.tool_choice || 'auto',
        examples: input.examples || null,
        status: input.status || 'draft',
        is_default: false,
        ab_test_enabled: false,
        ab_test_traffic_percentage: 0,
        ab_test_competing_version: null,
        total_executions: 0,
        avg_latency_ms: null,
        avg_tokens_used: null,
        avg_cost_usd: null,
        success_rate: null,
        avg_quality_score: null,
        description: input.description || null,
        changelog: input.changelog || null,
        tags: input.tags || null,
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        activated_at: null,
        deprecated_at: null,
        // Strategic governance fields
        strategic_type: input.strategic_type || 'operational',
        impact_level: input.impact_level || 'medium',
        scope: input.scope || 'system',
        agent_type: input.agent_type || 'service',
        owner: input.owner || null,
        executive_description: input.executive_description || null,
        connected_copilots: input.connected_copilots || null,
        connected_services: input.connected_services || null,
      };

      setPrompts(prev => [...prev, newPrompt]);
      toast.success('Prompt criado com sucesso!');
      return newPrompt;
    },
    isPending: false
  };

  // Update prompt mutation
  const updatePrompt = {
    mutateAsync: async ({ id, ...input }: Partial<AIPrompt> & { id: string }) => {
      setPrompts(prev => prev.map(p => 
        p.id === id 
          ? { ...p, ...input, updated_at: new Date().toISOString() }
          : p
      ));
      toast.success('Prompt atualizado!');
      return mockPromptsStore.find(p => p.id === id);
    },
    isPending: false
  };

  // Activate prompt mutation
  const activatePrompt = {
    mutateAsync: async (promptId: string) => {
      const prompt = mockPromptsStore.find(p => p.id === promptId);
      if (!prompt) throw new Error('Prompt não encontrado');

      // Deactivate other prompts in same category
      setPrompts(prev => prev.map(p => {
        if (p.category === prompt.category && p.is_default) {
          return { ...p, is_default: false };
        }
        if (p.id === promptId) {
          return { 
            ...p, 
            status: 'active', 
            is_default: true, 
            activated_at: new Date().toISOString() 
          };
        }
        return p;
      }));

      toast.success('Prompt ativado como padrão!');
      return mockPromptsStore.find(p => p.id === promptId);
    },
    isPending: false
  };

  // Deprecate prompt mutation
  const deprecatePrompt = {
    mutateAsync: async (promptId: string) => {
      setPrompts(prev => prev.map(p => 
        p.id === promptId 
          ? { 
              ...p, 
              status: 'deprecated', 
              is_default: false, 
              deprecated_at: new Date().toISOString() 
            }
          : p
      ));
      toast.success('Prompt depreciado');
      return mockPromptsStore.find(p => p.id === promptId);
    },
    isPending: false
  };

  // Duplicate prompt mutation
  const duplicatePrompt = {
    mutateAsync: async (promptId: string) => {
      const prompt = mockPromptsStore.find(p => p.id === promptId);
      if (!prompt) throw new Error('Prompt não encontrado');

      const [major, minor] = prompt.version.split('.').map(Number);
      const newVersion = `${major}.${minor + 1}.0`;

      const duplicated: AIPrompt = {
        ...prompt,
        id: `prompt-${Date.now()}`,
        name: `${prompt.name} (Cópia)`,
        version: newVersion,
        status: 'draft',
        is_default: false,
        total_executions: 0,
        avg_latency_ms: null,
        avg_tokens_used: null,
        avg_cost_usd: null,
        success_rate: null,
        avg_quality_score: null,
        changelog: `Duplicado de v${prompt.version}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        activated_at: null,
        deprecated_at: null
      };

      setPrompts(prev => [...prev, duplicated]);
      toast.success('Prompt duplicado!');
      return duplicated;
    },
    isPending: false
  };

  // Delete prompt mutation
  const deletePrompt = {
    mutateAsync: async (promptId: string) => {
      setPrompts(prev => prev.filter(p => p.id !== promptId));
      toast.success('Prompt removido');
    },
    isPending: false
  };

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
