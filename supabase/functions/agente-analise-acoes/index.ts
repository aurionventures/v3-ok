/**
 * Agente Análise e Ações – documentos vs entrevistas, incongruências e plano de ação.
 * Rota: POST /functions/v1/agente-analise-acoes
 * Body: { "documentos": string, "entrevistas": string }
 * Requer OPENAI_API_KEY em Supabase Secrets para análise com IA.
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_ANALISE_ACOES } from "./prompt.ts";

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
    if (!Deno.env.get("OPENAI_API_KEY")) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY não configurada",
          message: "Configure OPENAI_API_KEY em Supabase: Project Settings > Edge Functions > Secrets. Use: supabase secrets set OPENAI_API_KEY=sk-...",
          raw: null,
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const documentos = body.documentos ?? body.input ?? "";
    const entrevistas = body.entrevistas ?? "";

    const userContent = [
      documentos && "### DOCUMENTOS (Checklist - contratos e afins)\n\n" + documentos,
      entrevistas && "\n### TRANSCRIÇÕES DAS ENTREVISTAS\n\n" + entrevistas,
    ]
      .filter(Boolean)
      .join("\n");

    if (!userContent.trim()) {
      return new Response(
        JSON.stringify({ error: "Informe 'documentos' e/ou 'entrevistas'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_ANALISE_ACOES,
      userContent,
      model: "gpt-4o-mini",
    });

    let parsed: unknown = null;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      parsed = { raw: result };
    }

    return new Response(
      JSON.stringify(parsed ?? { raw: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
