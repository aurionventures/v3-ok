/**
 * Agente genérico – orquestração e extensão.
 * Rota: POST /functions/v1/agente
 * Body: { "input": "tarefa ou contexto", "instrucoes"?: string }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE } from "./prompt.ts";

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
    const body = await req.json();
    const input = body.input ?? body.tarefa ?? "";
    const instrucoes = body.instrucoes ?? "";

    const userContent = [
      input,
      instrucoes && `\nInstruções adicionais:\n${instrucoes}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (!userContent.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' ou 'tarefa' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE,
      userContent,
    });

    return new Response(
      JSON.stringify({ resultado: result, raw: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
