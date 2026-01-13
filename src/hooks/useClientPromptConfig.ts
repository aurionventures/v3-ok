import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface ClientPromptConfig {
  id?: string;
  organization_id: string;
  agent_category: string;
  custom_prompt: string | null;
  uses_default: boolean;
  tone: 'formal' | 'semi-formal' | 'executivo' | 'tecnico';
  verbal_person: 'terceira' | 'primeira_plural';
  summary_length: number;
  custom_instructions: string | null;
  advanced_mode: boolean;
  auto_approval_days: number | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface ClientPromptConfigWithOrg extends ClientPromptConfig {
  organization_name?: string;
  organization_logo?: string;
}

export const DEFAULT_CLIENT_CONFIG: Omit<ClientPromptConfig, 'id' | 'organization_id' | 'agent_category'> = {
  custom_prompt: null,
  uses_default: true,
  tone: 'executivo',
  verbal_person: 'terceira',
  summary_length: 200,
  custom_instructions: null,
  advanced_mode: false,
  auto_approval_days: null,
};

// ============================================================================
// Hook: useClientPromptConfig
// Para uso no painel do cliente - gerencia configuração específica de um agente
// ============================================================================

export function useClientPromptConfig(organizationId: string | null, agentCategory: string) {
  const [config, setConfig] = useState<ClientPromptConfig | null>(null);
  const [defaultPrompt, setDefaultPrompt] = useState<string | null>(null);
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configuração do cliente e prompt padrão do Super Admin
  const loadConfig = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar configuração do cliente
      const { data: clientConfig, error: clientError } = await supabase
        .from('client_prompt_configs')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('agent_category', agentCategory)
        .maybeSingle();

      if (clientError) {
        console.error('Erro ao carregar config do cliente:', clientError);
      }

      // Buscar prompt padrão e sugerido do ai_prompt_library
      const { data: promptLibrary, error: promptError } = await supabase
        .from('ai_prompt_library')
        .select('system_prompt, suggested_client_prompt')
        .eq('category', agentCategory)
        .eq('status', 'active')
        .eq('is_default', true)
        .maybeSingle();

      if (promptError) {
        console.error('Erro ao carregar prompt padrão:', promptError);
      }

      // Definir prompt padrão do Super Admin
      if (promptLibrary) {
        setDefaultPrompt(promptLibrary.system_prompt);
        setSuggestedPrompt(promptLibrary.suggested_client_prompt);
      }

      // Definir configuração do cliente ou criar uma padrão
      if (clientConfig) {
        setConfig(clientConfig);
      } else {
        // Configuração padrão para novo cliente
        setConfig({
          organization_id: organizationId,
          agent_category: agentCategory,
          ...DEFAULT_CLIENT_CONFIG
        });
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Falha ao carregar configurações');
    } finally {
      setLoading(false);
    }
  }, [organizationId, agentCategory]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Salvar configuração do cliente
  const saveConfig = useCallback(async (newConfig: Partial<ClientPromptConfig>) => {
    if (!organizationId) return;

    setSaving(true);
    setError(null);

    try {
      const configToSave = {
        organization_id: organizationId,
        agent_category: agentCategory,
        ...DEFAULT_CLIENT_CONFIG,
        ...config,
        ...newConfig,
        updated_at: new Date().toISOString(),
      };

      const { data, error: saveError } = await supabase
        .from('client_prompt_configs')
        .upsert(configToSave, {
          onConflict: 'organization_id,agent_category',
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setConfig(data);
      toast.success('Configurações salvas com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Falha ao salvar configurações');
      toast.error('Erro ao salvar configurações');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [organizationId, agentCategory, config]);

  // Resetar para o prompt padrão do Super Admin
  const resetToDefault = useCallback(async () => {
    if (!organizationId) return;

    setSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('client_prompt_configs')
        .delete()
        .eq('organization_id', organizationId)
        .eq('agent_category', agentCategory);

      if (deleteError) throw deleteError;

      setConfig({
        organization_id: organizationId,
        agent_category: agentCategory,
        ...DEFAULT_CLIENT_CONFIG
      });

      toast.success('Configurações restauradas para o padrão');
    } catch (err) {
      console.error('Erro ao resetar configurações:', err);
      toast.error('Erro ao resetar configurações');
    } finally {
      setSaving(false);
    }
  }, [organizationId, agentCategory]);

  // Aplicar prompt sugerido pelo Super Admin
  const applySuggestedPrompt = useCallback(() => {
    if (suggestedPrompt && config) {
      setConfig({
        ...config,
        custom_prompt: suggestedPrompt,
        uses_default: false,
        advanced_mode: true,
      });
    }
  }, [suggestedPrompt, config]);

  return {
    config,
    defaultPrompt,
    suggestedPrompt,
    loading,
    saving,
    error,
    saveConfig,
    resetToDefault,
    applySuggestedPrompt,
    reload: loadConfig,
  };
}

// ============================================================================
// Hook: useAllClientPromptConfigs
// Para uso no Super Admin - lista todas as configurações de todos os clientes
// ============================================================================

export function useAllClientPromptConfigs(agentCategory?: string) {
  const [configs, setConfigs] = useState<ClientPromptConfigWithOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('client_prompt_configs')
        .select(`
          *,
          organizations:organization_id (
            name,
            logo_url
          )
        `)
        .order('updated_at', { ascending: false });

      if (agentCategory) {
        query = query.eq('agent_category', agentCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Mapear para incluir nome da organização
      const mappedConfigs = (data || []).map((item: any) => ({
        ...item,
        organization_name: item.organizations?.name || 'Organização Desconhecida',
        organization_logo: item.organizations?.logo_url,
      }));

      setConfigs(mappedConfigs);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Falha ao carregar configurações de clientes');
    } finally {
      setLoading(false);
    }
  }, [agentCategory]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  // Estatísticas
  const stats = {
    total: configs.length,
    usingDefault: configs.filter(c => c.uses_default).length,
    customized: configs.filter(c => !c.uses_default).length,
    advancedMode: configs.filter(c => c.advanced_mode).length,
  };

  return {
    configs,
    loading,
    error,
    stats,
    reload: loadConfigs,
  };
}

// ============================================================================
// Hook: useClientPromptConfigForOrg
// Para uso no Super Admin - visualizar/editar configuração de um cliente específico
// ============================================================================

export function useClientPromptConfigForOrg(organizationId: string | null, agentCategory: string) {
  const [config, setConfig] = useState<ClientPromptConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_prompt_configs')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('agent_category', agentCategory)
        .maybeSingle();

      if (error) throw error;
      setConfig(data);
    } catch (err) {
      console.error('Erro ao carregar config:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, agentCategory]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Super Admin pode atualizar configuração do cliente
  const updateConfig = useCallback(async (updates: Partial<ClientPromptConfig>) => {
    if (!organizationId || !config) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('client_prompt_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id)
        .select()
        .single();

      if (error) throw error;

      setConfig(data);
      toast.success('Configuração do cliente atualizada');
      return data;
    } catch (err) {
      console.error('Erro ao atualizar config:', err);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  }, [organizationId, config]);

  return {
    config,
    loading,
    saving,
    updateConfig,
    reload: loadConfig,
  };
}

// ============================================================================
// Utility: Build effective prompt
// Combina prompt base com configurações do cliente
// ============================================================================

export function buildEffectivePrompt(
  basePrompt: string,
  clientConfig: ClientPromptConfig | null
): string {
  // Se não tem configuração do cliente ou usa padrão, retorna prompt base
  if (!clientConfig || clientConfig.uses_default) {
    return basePrompt;
  }

  // Se modo avançado e tem prompt customizado, usa ele
  if (clientConfig.advanced_mode && clientConfig.custom_prompt) {
    return clientConfig.custom_prompt;
  }

  // Modo simplificado: construir prompt baseado nas configurações
  const toneInstructions: Record<string, string> = {
    'formal': 'Use linguagem jurídica formal e cerimonial. Utilize vocabulário jurídico-corporativo.',
    'semi-formal': 'Use linguagem profissional mas acessível. Mantenha o tom corporativo sem excesso de formalidades.',
    'executivo': 'Seja direto e focado em decisões e ações. Priorize clareza e objetividade.',
    'tecnico': 'Use linguagem técnica com bullet points e listas. Inclua métricas e dados quando disponíveis.',
  };

  const personInstructions: Record<string, string> = {
    'terceira': 'Use terceira pessoa do singular (Ex: "O Conselho deliberou...", "Foi aprovado...")',
    'primeira_plural': 'Use primeira pessoa do plural (Ex: "Deliberamos...", "Aprovamos...")',
  };

  let customizedPrompt = basePrompt;

  // Adicionar instruções de estilo
  const styleInstructions = `

CONFIGURAÇÕES DO CLIENTE:
- Tom: ${toneInstructions[clientConfig.tone]}
- Pessoa Verbal: ${personInstructions[clientConfig.verbal_person]}
- Tamanho do Resumo: ${clientConfig.summary_length} palavras`;

  customizedPrompt += styleInstructions;

  // Adicionar instruções customizadas se existirem
  if (clientConfig.custom_instructions) {
    customizedPrompt += `

INSTRUÇÕES ESPECÍFICAS DO CLIENTE:
${clientConfig.custom_instructions}`;
  }

  return customizedPrompt;
}
