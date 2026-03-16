/**
 * Helper para chamadas OpenAI nas Edge Functions.
 * Usa OPENAI_API_KEY das variáveis de ambiente do projeto.
 */

import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

export interface AgentRunOptions {
  systemPrompt: string;
  userContent: string;
  model?: string;
}

export async function runAgent(options: AgentRunOptions): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada. Configure em Supabase Secrets.");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: options.model ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: options.systemPrompt },
      { role: "user", content: options.userContent },
    ],
    stream: false,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Resposta vazia do modelo.");
  }
  return content;
}
