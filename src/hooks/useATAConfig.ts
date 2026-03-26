import { useState, useEffect, useCallback } from 'react';

export interface ATAConfig {
  tone: 'formal' | 'semi-formal' | 'executivo' | 'tecnico';
  verbalPerson: 'terceira' | 'primeira_plural';
  summaryLength: number;
  customInstructions: string;
  templateName?: string;
  autoApprovalDays: number | null; // null = disabled, number = days after generation to auto-approve
  // Modo avançado: prompt completo editável
  advancedMode: boolean;
  fullPrompt: string;
}

// Prompt padrão para geração de ATA
export const DEFAULT_ATA_PROMPT = `Você é um secretário executivo experiente em governança corporativa brasileira.
Gere uma ATA formal e profissional em português brasileiro baseada nos dados fornecidos.

INSTRUÇÕES DE ESTILO:
- Use linguagem formal e profissional
- Use terceira pessoa do singular
- Gere um resumo executivo narrativo de 200 palavras

ESTRUTURA DA ATA:
1. Gere um resumo executivo que:
   - Contextualize a reunião e seu objetivo
   - Destaque os principais pontos discutidos na pauta
   - Mencione as tarefas atribuídas
   - Tenha tom formal e profissional

2. Liste de 4 a 6 decisões principais tomadas durante a reunião

3. Use linguagem formal típica de ATAs corporativas brasileiras

4. Seja objetivo e preciso

FORMATO DE RESPOSTA (JSON):
{
  "summary": "texto do resumo executivo aqui",
  "decisions": ["decisão 1", "decisão 2", "decisão 3", ...]
}`;

export const DEFAULT_CONFIG: ATAConfig = {
  tone: 'executivo',
  verbalPerson: 'terceira',
  summaryLength: 200,
  customInstructions: '',
  templateName: undefined,
  autoApprovalDays: null,
  advancedMode: false,
  fullPrompt: DEFAULT_ATA_PROMPT
};

const STORAGE_KEY = 'ata_generation_config';
const ORGAN_STORAGE_PREFIX = 'ata_generation_config_organ_';

export const useATAConfig = (organId?: string) => {
  const [config, setConfig] = useState<ATAConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, [organId]);

  const loadConfig = useCallback(() => {
    try {
      // If organId provided, try to load organ-specific config first
      if (organId) {
        const organConfig = localStorage.getItem(`${ORGAN_STORAGE_PREFIX}${organId}`);
        if (organConfig) {
          setConfig(JSON.parse(organConfig));
          return;
        }
      }
      
      // Fall back to global config
      const globalConfig = localStorage.getItem(STORAGE_KEY);
      if (globalConfig) {
        setConfig(JSON.parse(globalConfig));
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Error loading ATA config:', error);
      setConfig(DEFAULT_CONFIG);
    }
  }, [organId]);

  const saveConfig = useCallback(async (newConfig: ATAConfig) => {
    setLoading(true);
    try {
      // Save to localStorage (global config)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Error saving ATA config:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveOrganConfig = useCallback(async (targetOrganId: string, newConfig: ATAConfig | null) => {
    setLoading(true);
    try {
      if (newConfig === null) {
        // Remove organ-specific config (use global)
        localStorage.removeItem(`${ORGAN_STORAGE_PREFIX}${targetOrganId}`);
      } else {
        localStorage.setItem(`${ORGAN_STORAGE_PREFIX}${targetOrganId}`, JSON.stringify(newConfig));
      }
      
      if (targetOrganId === organId) {
        loadConfig();
      }
    } catch (error) {
      console.error('Error saving organ ATA config:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [organId, loadConfig]);

  const getConfigForOrgan = useCallback((targetOrganId: string): ATAConfig => {
    try {
      const organConfig = localStorage.getItem(`${ORGAN_STORAGE_PREFIX}${targetOrganId}`);
      if (organConfig) {
        return JSON.parse(organConfig);
      }
      
      const globalConfig = localStorage.getItem(STORAGE_KEY);
      if (globalConfig) {
        return JSON.parse(globalConfig);
      }
      
      return DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error getting config for organ:', error);
      return DEFAULT_CONFIG;
    }
  }, []);

  const hasOrganOverride = useCallback((targetOrganId: string): boolean => {
    return localStorage.getItem(`${ORGAN_STORAGE_PREFIX}${targetOrganId}`) !== null;
  }, []);

  return {
    config,
    loading,
    saveConfig,
    saveOrganConfig,
    getConfigForOrgan,
    hasOrganOverride,
    loadConfig
  };
};

// Build prompt from config for edge function
export const buildPromptFromConfig = (config: ATAConfig): string => {
  // Se modo avançado, usar o prompt completo editado pelo cliente
  if (config.advancedMode && config.fullPrompt) {
    return config.fullPrompt;
  }

  // Modo simplificado: construir prompt a partir das configurações
  const toneInstructions: Record<string, string> = {
    'formal': 'Use linguagem jurídica formal e cerimonial. Utilize vocabulário jurídico-corporativo com referências a deliberações formais.',
    'semi-formal': 'Use linguagem profissional mas acessível. Mantenha o tom corporativo sem excesso de formalidades.',
    'executivo': 'Seja direto e focado em decisões e ações. Priorize clareza e objetividade.',
    'tecnico': 'Use linguagem técnica com bullet points e listas. Inclua métricas e dados quando disponíveis.'
  };

  const personInstructions: Record<string, string> = {
    'terceira': 'Use terceira pessoa do singular (Ex: "O Conselho deliberou...", "Foi aprovado...")',
    'primeira_plural': 'Use primeira pessoa do plural (Ex: "Deliberamos...", "Aprovamos...")'
  };

  let prompt = `Você é um secretário executivo experiente em governança corporativa brasileira.

INSTRUÇÕES DE ESTILO:
- ${toneInstructions[config.tone]}
- ${personInstructions[config.verbalPerson]}
- Gere um resumo executivo narrativo de ${config.summaryLength} palavras`;

  if (config.customInstructions && config.customInstructions.trim()) {
    prompt += `

INSTRUÇÕES ESPECÍFICAS DO CLIENTE:
${config.customInstructions}`;
  }

  return prompt;
};
