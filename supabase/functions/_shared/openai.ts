/**
 * Helper para chamadas OpenAI nas Edge Functions.
 * Usa OPENAI_API_KEY das variáveis de ambiente do projeto.
 * Quando a chave não estiver configurada, retorna texto placeholder até a API ser ativada.
 */

import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

export interface AgentRunOptions {
  systemPrompt: string;
  userContent: string;
  model?: string;
}

/** Indica se a API OpenAI está disponível (chave configurada). */
export function isOpenAIAvailable(): boolean {
  return !!Deno.env.get("OPENAI_API_KEY");
}

export async function runAgent(options: AgentRunOptions): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    return generatePlaceholderResponse(options.userContent);
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

/**
 * Resposta placeholder quando OPENAI_API_KEY não está configurada.
 * Permite testar o fluxo e ver o prompt sendo executado.
 * Ao adicionar a chave em Supabase Secrets, a API real será usada.
 */
function generatePlaceholderResponse(userContent: string): string {
  const lines = userContent.split("\n").filter((l) => l.trim());
  const hasPerguntaUsuario = lines.some((l) => l.includes("Pergunta do usuário"));
  const hasPauta = lines.some((l) => l.includes("PAUTA:") || /^\d+\./.test(l));
  const hasTranscricao = lines.some((l) => l.includes("TRANSCRIÇÃO"));
  const hasTarefas = lines.some((l) => l.includes("TAREFAS"));

  if (hasPerguntaUsuario) {
    return [
      "## Temas encontrados\n\n*Configure OPENAI_API_KEY nas variáveis de ambiente do Supabase para habilitar a busca semântica nas atas.*\n\n",
      "## Trechos relevantes\n\nPor enquanto, utilize a aba **ATAs** na Biblioteca para visualizar os documentos completos.\n\n",
      "## Resumo executivo\n\nA busca em atas por IA estará disponível após configurar a chave da OpenAI.",
    ].join("");
  }

  let body = "";
  if (hasPauta) {
    body += "## Resumo da pauta\n\nOs itens de pauta foram registrados conforme documentação encaminhada.\n\n";
  }
  if (hasTranscricao) {
    body += "## Notas da reunião\n\n[A transcrição ou notas fornecidas serão processadas pela IA quando a OPENAI_API_KEY estiver configurada em Supabase > Project Settings > Edge Functions.]\n\n";
  }
  if (hasTarefas) {
    body += "## Tarefas e encaminhamentos\n\nConforme listagem dos combinados da reunião.\n\n";
  }
  if (!body) {
    body = "## Conteúdo\n\nDados da reunião recebidos. A geração completa será feita pela IA quando OPENAI_API_KEY estiver configurada em Supabase > Project Settings > Edge Functions.\n\n";
  }

  return [
    "# ATA – Ata da reunião (rascunho – aguardando IA)",
    "",
    "*[Configure OPENAI_API_KEY nas variáveis de ambiente do Supabase para gerar o conteúdo completo com IA.]*",
    "",
    body,
    "---",
    "",
    "*Documento gerado automaticamente. Edite conforme necessário após ativar a API da OpenAI.*",
  ].join("\n");
}
