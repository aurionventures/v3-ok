import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// ============================================================================
// Types
// NOTE: These tables (client_prompt_configs, ai_prompt_library) do not exist
// in the database yet. Using localStorage as fallback until tables are created.
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
  // NOTE: Using localStorage until database tables are created
  const loadConfig = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to load from localStorage (fallback until DB tables exist)
      const storageKey = `client_prompt_config_${organizationId}_${agentCategory}`;
      const storedConfig = localStorage.getItem(storageKey);
      
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
      } else {
        // Configuração padrão para novo cliente
        setConfig({
          organization_id: organizationId,
          agent_category: agentCategory,
          ...DEFAULT_CLIENT_CONFIG
        });
      }

      // For now, no default/suggested prompts from DB
      setDefaultPrompt(null);
      setSuggestedPrompt(null);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Falha ao carregar configurações');
      // Set default config on error
      setConfig({
        organization_id: organizationId,
        agent_category: agentCategory,
        ...DEFAULT_CLIENT_CONFIG
      });
    } finally {
      setLoading(false);
    }
  }, [organizationId, agentCategory]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Salvar configuração do cliente
  // NOTE: Using localStorage until database tables are created
  const saveConfig = useCallback(async (newConfig: Partial<ClientPromptConfig>) => {
    if (!organizationId) return;

    setSaving(true);
    setError(null);

    try {
      const configToSave: ClientPromptConfig = {
        id: config?.id || crypto.randomUUID(),
        organization_id: organizationId,
        agent_category: agentCategory,
        ...DEFAULT_CLIENT_CONFIG,
        ...config,
        ...newConfig,
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage (fallback until DB tables exist)
      const storageKey = `client_prompt_config_${organizationId}_${agentCategory}`;
      localStorage.setItem(storageKey, JSON.stringify(configToSave));

      setConfig(configToSave);
      toast.success('Configurações salvas com sucesso');
      return configToSave;
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
  // NOTE: Using localStorage until database tables are created
  const resetToDefault = useCallback(async () => {
    if (!organizationId) return;

    setSaving(true);
    try {
      // Remove from localStorage
      const storageKey = `client_prompt_config_${organizationId}_${agentCategory}`;
      localStorage.removeItem(storageKey);

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

  // NOTE: Using localStorage until database tables are created
  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load all configs from localStorage that match the pattern
      const allConfigs: ClientPromptConfigWithOrg[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('client_prompt_config_')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const config = JSON.parse(stored);
              if (!agentCategory || config.agent_category === agentCategory) {
                allConfigs.push({
                  ...config,
                  organization_name: 'Organização Local',
                });
              }
            }
          } catch (e) {
            console.error('Error parsing config:', e);
          }
        }
      }

      setConfigs(allConfigs);
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
// NOTE: Using localStorage until database tables are created
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
      const storageKey = `client_prompt_config_${organizationId}_${agentCategory}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        setConfig(JSON.parse(stored));
      } else {
        setConfig(null);
      }
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
      const updatedConfig = {
        ...config,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const storageKey = `client_prompt_config_${organizationId}_${agentCategory}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedConfig));

      setConfig(updatedConfig);
      toast.success('Configuração do cliente atualizada');
      return updatedConfig;
    } catch (err) {
      console.error('Erro ao atualizar config:', err);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  }, [organizationId, agentCategory, config]);

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
