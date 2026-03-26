// ============================================================================
// SHARED: Prompt Loader
// Carrega configurações de prompts do banco de dados ai_prompt_library
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface PromptConfig {
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
  functions: any | null;
  tool_choice: string;
}

export interface PromptMetrics {
  execution_time_ms: number;
  tokens_used: number;
  success: boolean;
}

/**
 * Carrega configuração de prompt do banco de dados
 * @param category - Categoria do prompt (ex: 'agent_f_search_intent')
 * @param fallback - Configuração fallback caso não encontre no banco
 * @returns PromptConfig
 */
export async function loadPromptConfig(
  category: string,
  fallback: PromptConfig
): Promise<PromptConfig> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log(`[prompt-loader] Supabase não configurado, usando fallback para ${category}`);
      return fallback;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("ai_prompt_library")
      .select("*")
      .eq("category", category)
      .eq("is_default", true)
      .eq("status", "active")
      .single();

    if (error || !data) {
      console.log(`[prompt-loader] Prompt não encontrado para ${category}, usando fallback`);
      return fallback;
    }

    console.log(`[prompt-loader] Prompt carregado do banco: ${data.name} v${data.version}`);

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      version: data.version,
      system_prompt: data.system_prompt,
      user_prompt_template: data.user_prompt_template,
      model: data.model || fallback.model,
      temperature: data.temperature ?? fallback.temperature,
      max_tokens: data.max_tokens ?? fallback.max_tokens,
      top_p: data.top_p ?? fallback.top_p,
      frequency_penalty: data.frequency_penalty ?? fallback.frequency_penalty,
      presence_penalty: data.presence_penalty ?? fallback.presence_penalty,
      functions: data.functions,
      tool_choice: data.tool_choice || fallback.tool_choice,
    };
  } catch (error) {
    console.error(`[prompt-loader] Erro ao carregar prompt ${category}:`, error);
    return fallback;
  }
}

/**
 * Atualiza métricas de execução do prompt
 * @param promptId - ID do prompt
 * @param metrics - Métricas de execução
 */
export async function updatePromptMetrics(
  promptId: string,
  metrics: PromptMetrics
): Promise<void> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar métricas atuais
    const { data: current } = await supabase
      .from("ai_prompt_library")
      .select("total_executions, avg_latency_ms, avg_tokens_used, success_rate")
      .eq("id", promptId)
      .single();

    if (!current) return;

    const totalExecutions = (current.total_executions || 0) + 1;
    const avgLatency = current.avg_latency_ms
      ? (current.avg_latency_ms * current.total_executions + metrics.execution_time_ms) / totalExecutions
      : metrics.execution_time_ms;
    const avgTokens = current.avg_tokens_used
      ? (current.avg_tokens_used * current.total_executions + metrics.tokens_used) / totalExecutions
      : metrics.tokens_used;
    const successCount = current.success_rate
      ? Math.round((current.success_rate / 100) * current.total_executions) + (metrics.success ? 1 : 0)
      : metrics.success ? 1 : 0;
    const successRate = (successCount / totalExecutions) * 100;

    await supabase
      .from("ai_prompt_library")
      .update({
        total_executions: totalExecutions,
        avg_latency_ms: avgLatency,
        avg_tokens_used: avgTokens,
        success_rate: successRate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", promptId);

    console.log(`[prompt-loader] Métricas atualizadas para prompt ${promptId}`);
  } catch (error) {
    console.error(`[prompt-loader] Erro ao atualizar métricas:`, error);
  }
}
