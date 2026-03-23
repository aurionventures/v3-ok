/**
 * Cliente Supabase – conexão com banco, auth e Edge Functions.
 * Requer VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. Configure em .env para usar Supabase."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Invoca uma Edge Function do Supabase.
 * @param functionName Nome da função (ex: agente-ata, pipeline-agentes)
 * @param body Payload JSON
 */
export async function invokeEdgeFunction<T = unknown>(
  functionName: string,
  body: Record<string, unknown>
): Promise<{ data?: T; error?: { message: string } }> {
  if (!supabase) {
    return {
      error: {
        message:
          "Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
      },
    };
  }

  const { data, error } = await supabase.functions.invoke<T & { error?: string }>(functionName, {
    body,
  });

  if (error) {
    let message = error.message;
    const err = error as { context?: { json?: () => Promise<{ error?: string }> } };
    if (err?.context && typeof err.context.json === "function") {
      try {
        const parsed = await err.context.json();
        if (parsed?.error) message = parsed.error;
      } catch {
        /* usar message padrão */
      }
    }
    return { error: { message } };
  }
  return { data };
}
