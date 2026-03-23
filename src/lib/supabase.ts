/**
 * Cliente Supabase – conexão com banco, auth e Edge Functions.
 * Requer VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env
 */

import { createClient, FunctionsHttpError } from "@supabase/supabase-js";

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
 * @param options.useAnonKey Força uso da chave anônima (evita Invalid JWT com sessão expirada)
 */
export async function invokeEdgeFunction<T = unknown>(
  functionName: string,
  body: Record<string, unknown>,
  options?: { useAnonKey?: boolean }
): Promise<{ data?: T; error?: { message: string } }> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    return {
      error: {
        message:
          "Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
      },
    };
  }

  if (options?.useAnonKey) {
    const url = `${baseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as T & { error?: string };
    if (!res.ok) {
      return { error: { message: json?.error ?? `HTTP ${res.status}` } };
    }
    return { data: json };
  }

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
    if (error instanceof FunctionsHttpError && error.context) {
      try {
        const parsed = (await error.context.json()) as { error?: string; message?: string };
        if (parsed?.error) message = parsed.error;
        else if (parsed?.message) message = parsed.message;
      } catch {
        /* usar message padrão */
      }
    }
    return { error: { message } };
  }
  return { data };
}
