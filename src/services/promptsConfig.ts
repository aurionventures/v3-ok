import { supabase } from "@/lib/supabase";

const AGENTE_PAUTA_ATA = "gerar-pauta-ata";

const PROMPT_PADRAO = `Você é um secretário executivo experiente em governança corporativa brasileira.

INSTRUÇÕES DE ESTILO:
- Seja direto e focado em decisões e ações
- Use terceira pessoa do singular
- Gere resumos executivos de 1000 palavras`;

export async function fetchPromptPautaAta(
  empresaId: string | null
): Promise<{ prompt: string; error: string | null }> {
  if (!supabase) return { prompt: PROMPT_PADRAO, error: null };
  if (!empresaId) return { prompt: PROMPT_PADRAO, error: null };

  const { data, error } = await supabase
    .from("prompts_config")
    .select("prompt_override")
    .eq("agente_id", AGENTE_PAUTA_ATA)
    .eq("empresa_id", empresaId)
    .maybeSingle();

  if (error) {
    console.error("[promptsConfig] fetch:", error);
    return { prompt: PROMPT_PADRAO, error: error.message };
  }
  const override = (data as { prompt_override?: string } | null)?.prompt_override;
  return { prompt: (override?.trim() || PROMPT_PADRAO), error: null };
}

export async function upsertPromptPautaAta(
  empresaId: string | null,
  prompt: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };
  if (!empresaId) return { error: "Selecione uma empresa" };

  const { data: existing } = await supabase
    .from("prompts_config")
    .select("id")
    .eq("empresa_id", empresaId)
    .eq("agente_id", AGENTE_PAUTA_ATA)
    .maybeSingle();

  const payload = {
    empresa_id: empresaId,
    agente_id: AGENTE_PAUTA_ATA,
    prompt_override: prompt.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from("prompts_config")
      .update(payload)
      .eq("id", (existing as { id: string }).id);
    if (error) {
      console.error("[promptsConfig] update:", error);
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("prompts_config").insert(payload);
    if (error) {
      console.error("[promptsConfig] insert:", error);
      return { error: error.message };
    }
  }
  return { error: null };
}

export { PROMPT_PADRAO };
