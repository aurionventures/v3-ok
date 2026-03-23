/**
 * Proxy OpenAI – encaminha requisições para a API OpenAI.
 * Usado pelo Copiloto IA (membros) com briefing como base de conhecimento.
 * Rota: POST /functions/v1/openai-proxy
 *
 * Body: { "messages": [{ "role": "system"|"user"|"assistant", "content": "..." }], "model": "gpt-4o-mini" }
 */

import { corsHeaders } from "../_shared/cors.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

function jsonResponse(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido. Use POST." }, 405);
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "OPENAI_API_KEY não configurada. Configure o secret no Supabase." }, 500);
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Body JSON inválido." }, 400);
    }

    const { messages, model = "gpt-4o-mini" } = body;

    if (!messages || !Array.isArray(messages)) {
      return jsonResponse({ error: "Campo 'messages' (array) é obrigatório." }, 400);
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: String(model),
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      stream: false,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    return jsonResponse({ content }, 200);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[openai-proxy]", msg);
    return jsonResponse(
      { error: msg || "Erro ao chamar OpenAI. Verifique OPENAI_API_KEY e logs." },
      500
    );
  }
});
