/**
 * Agente Busca em ATAs – busca semântica em atas conforme pergunta do usuário.
 * Rota: POST /functions/v1/agente-busca-atas
 * Body: { "pergunta": string, "atas": Array<{ titulo, data_reuniao, conteudo }> }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_BUSCA_ATAS } from "./prompt.ts";

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
    const pergunta = (body.pergunta ?? body.input ?? body.query ?? "").trim();
    const atas = Array.isArray(body.atas) ? body.atas : [];

    if (!pergunta) {
      return new Response(
        JSON.stringify({ error: "Campo 'pergunta' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const atasTexto =
      atas.length > 0
        ? atas
            .map(
              (a: { titulo?: string; data_reuniao?: string; conteudo?: string }, i: number) =>
                `--- ATA ${i + 1} ---\nTítulo: ${a.titulo ?? "—"}\nData: ${a.data_reuniao ?? "—"}\n\nConteúdo:\n${a.conteudo ?? ""}`
            )
            .join("\n\n")
        : "Nenhuma ata disponível para busca.";

    const userContent = `## Pergunta do usuário\n\n${pergunta}\n\n## Atas disponíveis\n\n${atasTexto}`;

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_BUSCA_ATAS,
      userContent,
      agentKey: "BUSCA_CONVERSACIONAL_ATAS",
    });

    return new Response(
      JSON.stringify({ resultado: result, raw: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Erro ao processar busca" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
