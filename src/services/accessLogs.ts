/**
 * Serviço de logs de acesso da plataforma.
 * Usa Edge Functions get-access-logs e log-access.
 */

import { invokeEdgeFunction } from "@/lib/supabase";

export interface AccessLogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  source: string;
  message: string;
  meta?: { ip?: string; user_agent?: string };
}

/** Busca logs de acesso (requer usuário admin autenticado) */
export async function fetchAccessLogs(options?: {
  limite?: number;
  offset?: number;
}): Promise<{ logs: AccessLogEntry[]; error?: string }> {
  const { data, error } = await invokeEdgeFunction<{ logs: AccessLogEntry[]; total: number }>(
    "get-access-logs",
    { limite: options?.limite ?? 200, offset: options?.offset ?? 0 }
  );
  if (error) return { logs: [], error: error.message };
  return { logs: data?.logs ?? [] };
}

/** Registra um evento de acesso (chamado após login ou em falha) */
export async function logAccess(params: {
  user_id?: string;
  email?: string;
  tipo: "super_admin" | "empresa_adm" | "membro" | "convidado";
  empresa_id?: string;
  empresa_nome?: string;
  acao?: "login" | "logout" | "falha_login";
}): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return;
  const fnUrl = `${url.replace(/\/$/, "")}/functions/v1/log-access`;
  try {
    await fetch(fnUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
      body: JSON.stringify({
        user_id: params.user_id,
        email: params.email,
        tipo: params.tipo,
        empresa_id: params.empresa_id,
        empresa_nome: params.empresa_nome,
        acao: params.acao ?? "login",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });
  } catch {
    /* silencioso - não quebrar o fluxo de login */
  }
}
