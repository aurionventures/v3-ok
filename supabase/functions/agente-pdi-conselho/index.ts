/**
 * Agente PDI Conselho – plano de desenvolvimento individual.
 * Rota: POST /functions/v1/agente-pdi-conselho
 * Body: { "input": "perfil do membro (cargo, áreas, lacunas, avaliações)" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_PDI_CONSELHO } from "./prompt.ts";

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
    const input = body.input ?? body.perfil ?? "";

    if (!input.trim()) {
      return new Response(
        JSON.stringify({ error: "Campo 'input' ou 'perfil' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_PDI_CONSELHO,
      userContent: input,
      agentKey: "PDI_CONSELHO",
    });

    return new Response(
      JSON.stringify({ pdi: result, raw: result }),
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
