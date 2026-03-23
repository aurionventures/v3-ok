/**
 * Usage OpenAI – retorna consumo de tokens agregado por dia.
 * Rota: POST /functions/v1/usage-openai
 * Body: { periodo?: "ultimos_30" | "mes"; mes?: "YYYY-MM" }
 *   - periodo "ultimos_30" (padrão): últimos 30 dias
 *   - periodo "mes": mês específico (mes obrigatório ou atual)
 * Requer autenticação (admin).
 */

import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { periodo?: string; mes?: string };
    const periodo = body.periodo === "mes" ? "mes" : "ultimos_30";
    const mesParam = typeof body.mes === "string" && /^\d{4}-\d{2}$/.test(body.mes) ? body.mes : null;

    const hoje = new Date();
    let inicioStr: string;
    let fimStr: string;

    if (periodo === "ultimos_30") {
      const fim = new Date(hoje);
      const inicio = new Date(hoje);
      inicio.setDate(inicio.getDate() - 29);
      inicioStr = inicio.toISOString().slice(0, 10);
      fimStr = fim.toISOString().slice(0, 10);
    } else {
      const ano = mesParam ? parseInt(mesParam.slice(0, 4), 10) : hoje.getFullYear();
      const mes = mesParam ? parseInt(mesParam.slice(5, 7), 10) - 1 : hoje.getMonth();
      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes + 1, 0);
      inicioStr = inicioMes.toISOString().slice(0, 10);
      fimStr = fimMes.toISOString().slice(0, 10);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Configuração incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: rows, error } = await supabase
      .from("token_usage")
      .select("data, total_tokens, prompt_tokens, completion_tokens")
      .gte("data", inicioStr)
      .lte("data", fimStr);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Agregar por dia
    const inicioDate = new Date(inicioStr + "T12:00:00");
    const fimDate = new Date(fimStr + "T12:00:00");
    const porDia = new Map<string, { total_tokens: number; prompt_tokens: number; completion_tokens: number }>();
    for (let d = new Date(inicioDate); d <= fimDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      porDia.set(key, { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 });
    }
    for (const r of rows ?? []) {
      const key = (r as { data: string }).data;
      const v = porDia.get(key) ?? { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 };
      v.total_tokens += (r as { total_tokens?: number }).total_tokens ?? 0;
      v.prompt_tokens += (r as { prompt_tokens?: number }).prompt_tokens ?? 0;
      v.completion_tokens += (r as { completion_tokens?: number }).completion_tokens ?? 0;
      porDia.set(key, v);
    }

    const daily = Array.from(porDia.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, v]) => ({
        data,
        total_tokens: v.total_tokens,
        prompt_tokens: v.prompt_tokens,
        completion_tokens: v.completion_tokens,
      }));

    const totalPeriodo = daily.reduce((s, d) => s + d.total_tokens, 0);

    return new Response(
      JSON.stringify({
        periodo: periodo === "ultimos_30" ? "ultimos_30" : "mes",
        periodo_range: { inicio: inicioStr, fim: fimStr },
        daily,
        total: totalPeriodo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao obter uso" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
