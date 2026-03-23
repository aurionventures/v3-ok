/**
 * Hook para invocar Edge Functions de agentes.
 * Usa supabase.functions.invoke quando configurado.
 */

import { useState, useCallback } from "react";
import { invokeEdgeFunction } from "@/lib/supabase";

export interface InvokeAgentState<T = unknown> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useInvokeAgent<T = unknown>(functionName: string) {
  const [state, setState] = useState<InvokeAgentState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const invoke = useCallback(
    async (body: Record<string, unknown>) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      const { data, error } = await invokeEdgeFunction<T>(functionName, body);
      setState({
        data: data ?? null,
        error: error ? "Habilite a API da Open AI" : null,
        isLoading: false,
      });
      return { data, error };
    },
    [functionName]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, invoke, reset };
}
