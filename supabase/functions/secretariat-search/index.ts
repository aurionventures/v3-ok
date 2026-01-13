import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { loadPromptConfig, updatePromptMetrics, type PromptConfig } from "../_shared/prompt-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchQuery {
  question: string;
  meetings: any[];
  documents: any[];
  searchScope?: 'all' | 'atas_only' | 'documents_only';
}

interface SearchResult {
  type: 'ata' | 'decision' | 'document' | 'meeting';
  title: string;
  content: string;
  date: string;
  organ: string;
  relevance: number;
  metadata: Record<string, any>;
}

// Fallback prompts caso não encontre no banco
const FALLBACK_PROMPTS: Record<string, PromptConfig> = {
  agent_f_search_intent: {
    id: 'fallback-search-intent',
    name: 'Search Intent Extractor (Fallback)',
    category: 'agent_f_search_intent',
    version: '1.0.0',
    system_prompt: `Você é um assistente especializado em busca de documentos de governança corporativa.
Analise a pergunta do usuário e extraia as seguintes informações:
1. Palavras-chave principais (keywords) - array de strings
2. Tipo de busca (searchType): "ata", "decision", "participant", "document", "meeting" ou "general"
3. Período temporal (timeframe) - se mencionado, ex: "fevereiro", "último mês", "2025"
4. Órgão específico (organ) - se mencionado: "Conselho de Administração", "Conselho Fiscal", "Comitê", "Comissão"
5. Prioridade (priority): "high", "medium" ou "low"

Retorne APENAS as informações estruturadas em formato JSON para facilitar a busca.`,
    user_prompt_template: null,
    model: 'google/gemini-3-flash-preview',
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
    functions: null,
    tool_choice: 'auto',
  },
  agent_f_search_response: {
    id: 'fallback-search-response',
    name: 'Search Response Generator (Fallback)',
    category: 'agent_f_search_response',
    version: '1.0.0',
    system_prompt: `Você é um assistente de secretariado corporativo experiente.
Gere uma resposta conversacional e profissional que:
1. Responda diretamente à pergunta
2. Cite os documentos/ATAs mais relevantes encontrados
3. Destaque informações importantes (decisões, datas, participantes)
4. Se não encontrou resultados, sugira termos alternativos de busca
5. Mantenha tom profissional mas amigável
6. IMPORTANTE: NÃO use emojis na resposta. Use apenas texto profissional.`,
    user_prompt_template: null,
    model: 'google/gemini-3-flash-preview',
    temperature: 0.6,
    max_tokens: 2000,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
    functions: null,
    tool_choice: 'auto',
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { question, meetings = [], documents = [], searchScope = 'all' } = await req.json() as SearchQuery;
    
    if (!question || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "Pergunta não fornecida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    console.log(`[secretariat-search] Processando pergunta: "${question}"`);

    // Carregar prompts do banco de dados
    const intentPrompt = await loadPromptConfig('agent_f_search_intent', FALLBACK_PROMPTS.agent_f_search_intent);
    const responsePrompt = await loadPromptConfig('agent_f_search_response', FALLBACK_PROMPTS.agent_f_search_response);

    // 1. Usar Lovable AI para entender a intenção
    const intentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: intentPrompt.model,
        temperature: intentPrompt.temperature,
        max_tokens: intentPrompt.max_tokens,
        messages: [
          { role: "system", content: intentPrompt.system_prompt },
          { role: "user", content: question }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_search_intent",
            description: "Extrai a intenção de busca do usuário",
            parameters: {
              type: "object",
              properties: {
                keywords: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Palavras-chave principais para busca"
                },
                searchType: { 
                  type: "string", 
                  enum: ["ata", "decision", "participant", "document", "meeting", "general"],
                  description: "Tipo de busca a ser realizada"
                },
                timeframe: { 
                  type: "string",
                  description: "Período temporal mencionado"
                },
                organ: { 
                  type: "string",
                  description: "Órgão específico mencionado"
                },
                priority: { 
                  type: "string", 
                  enum: ["high", "medium", "low"],
                  description: "Prioridade dos resultados"
                }
              },
              required: ["keywords", "searchType"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_search_intent" } }
      }),
    });

    if (!intentResponse.ok) {
      if (intentResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (intentResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error(`[secretariat-search] Erro ao processar intenção: ${intentResponse.status}`);
      throw new Error(`Erro ao processar intenção: ${intentResponse.status}`);
    }

    const intentData = await intentResponse.json();
    const searchIntent = JSON.parse(
      intentData.choices[0].message.tool_calls[0].function.arguments
    );

    console.log(`[secretariat-search] Intenção extraída:`, searchIntent);

    // 2. Realizar busca nos dados
    const results: SearchResult[] = [];

    if (searchScope === 'atas_only') {
      meetings.forEach((meeting: any) => {
        if (meeting.minutes) {
          const ataContent = `${meeting.minutes.full || ''}\n${meeting.minutes.summary || ''}`;
          const matchScore = calculateRelevance(ataContent, searchIntent.keywords);
          
          if (matchScore > 0.3) {
            results.push({
              type: 'ata',
              title: `ATA ${meeting.council} - ${meeting.date}`,
              content: meeting.minutes.summary || meeting.minutes.full?.substring(0, 200) || '',
              date: meeting.date,
              organ: meeting.council,
              relevance: matchScore,
              metadata: {
                fullContent: meeting.minutes.full,
                decisions: meeting.ata?.decisions || [],
                participants: meeting.participants?.map((p: any) => p.name) || []
              }
            });
          }
        }
      });
    } else if (searchScope === 'documents_only') {
      documents.forEach((doc: any) => {
        const docContent = `${doc.name || ''} ${doc.type || ''}`;
        const matchScore = calculateRelevance(docContent, searchIntent.keywords);
        
        if (matchScore > 0.2) {
          results.push({
            type: 'document',
            title: doc.name || 'Documento',
            content: `Documento: ${doc.type || 'Geral'}`,
            date: doc.uploadDate || doc.created_at || new Date().toISOString(),
            organ: doc.organ || 'Geral',
            relevance: matchScore,
            metadata: { url: doc.url, type: doc.type }
          });
        }
      });
    } else {
      // Busca completa (all)
      meetings.forEach((meeting: any) => {
        if (meeting.minutes) {
          const ataContent = `${meeting.minutes.full || ''}\n${meeting.minutes.summary || ''}`;
          const matchScore = calculateRelevance(ataContent, searchIntent.keywords);
          
          if (matchScore > 0.3) {
            results.push({
              type: 'ata',
              title: `ATA ${meeting.council} - ${meeting.date}`,
              content: meeting.minutes.summary || meeting.minutes.full?.substring(0, 200) || '',
              date: meeting.date,
              organ: meeting.council,
              relevance: matchScore,
              metadata: {
                fullContent: meeting.minutes.full,
                decisions: meeting.ata?.decisions || [],
                participants: meeting.participants?.map((p: any) => p.name) || []
              }
            });
          }
        }
      });

      meetings.forEach((meeting: any) => {
        if (meeting.ata?.decisions) {
          meeting.ata.decisions.forEach((decision: string) => {
            const matchScore = calculateRelevance(decision, searchIntent.keywords);
            
            if (matchScore > 0.3) {
              results.push({
                type: 'decision',
                title: `Decisão - ${meeting.council}`,
                content: decision,
                date: meeting.date,
                organ: meeting.council,
                relevance: matchScore,
                metadata: { meetingId: meeting.id, meetingTitle: meeting.title }
              });
            }
          });
        }
      });

      documents.forEach((doc: any) => {
        const docContent = `${doc.name || ''} ${doc.type || ''}`;
        const matchScore = calculateRelevance(docContent, searchIntent.keywords);
        
        if (matchScore > 0.2) {
          results.push({
            type: 'document',
            title: doc.name || 'Documento',
            content: `Documento: ${doc.type || 'Geral'}`,
            date: doc.uploadDate || doc.created_at || new Date().toISOString(),
            organ: doc.organ || 'Geral',
            relevance: matchScore,
            metadata: { url: doc.url, type: doc.type }
          });
        }
      });

      meetings.forEach((meeting: any) => {
        const meetingContent = `${meeting.title || ''} ${meeting.council || ''} ${meeting.status || ''}`;
        const matchScore = calculateRelevance(meetingContent, searchIntent.keywords);
        
        if (matchScore > 0.25 && !meeting.minutes) {
          results.push({
            type: 'meeting',
            title: meeting.title || `Reunião ${meeting.council}`,
            content: `Reunião agendada para ${meeting.date} - Status: ${meeting.status}`,
            date: meeting.date,
            organ: meeting.council,
            relevance: matchScore,
            metadata: {
              location: meeting.location,
              time: meeting.time,
              modalidade: meeting.modalidade,
              participants: meeting.participants?.map((p: any) => p.name) || []
            }
          });
        }
      });
    }

    results.sort((a, b) => b.relevance - a.relevance);

    console.log(`[secretariat-search] Encontrados ${results.length} resultados`);

    // 3. Gerar resposta em linguagem natural com Lovable AI
    const summaryPrompt = `${responsePrompt.system_prompt}

O usuário perguntou: "${question}"

Encontrei os seguintes resultados (${results.length} total):
${JSON.stringify(results.slice(0, 5), null, 2)}`;

    const summaryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: responsePrompt.model,
        temperature: responsePrompt.temperature,
        max_tokens: responsePrompt.max_tokens,
        messages: [
          { role: "user", content: summaryPrompt }
        ],
      }),
    });

    if (!summaryResponse.ok) {
      if (summaryResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (summaryResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error(`[secretariat-search] Erro ao gerar resumo: ${summaryResponse.status}`);
      throw new Error(`Erro ao gerar resumo: ${summaryResponse.status}`);
    }

    const summaryData = await summaryResponse.json();
    const aiSummary = summaryData.choices[0].message.content;

    const executionTime = Date.now() - startTime;
    console.log(`[secretariat-search] Resposta gerada com sucesso em ${executionTime}ms`);

    // Atualizar métricas dos prompts
    await Promise.all([
      updatePromptMetrics(intentPrompt.id, { execution_time_ms: executionTime / 2, tokens_used: 500, success: true }),
      updatePromptMetrics(responsePrompt.id, { execution_time_ms: executionTime / 2, tokens_used: 1000, success: true })
    ]);

    return new Response(
      JSON.stringify({ 
        answer: aiSummary,
        results: results.slice(0, 10),
        searchIntent,
        totalResults: results.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("[secretariat-search] Erro:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar busca",
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function calculateRelevance(text: string, keywords: string[]): number {
  if (!text || !keywords || keywords.length === 0) return 0;
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    const occurrences = (lowerText.match(new RegExp(lowerKeyword, 'g')) || []).length;
    score += occurrences * 0.15;
  });
  
  return Math.min(score, 1);
}
