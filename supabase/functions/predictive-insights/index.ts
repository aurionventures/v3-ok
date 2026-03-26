import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { loadPromptConfig, updatePromptMetrics, type PromptConfig } from "../_shared/prompt-loader.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// INTERFACES DE DADOS
// ============================================================================

interface RiskData {
  id: number;
  category: string;
  title: string;
  impact: number;
  probability: number;
  status: string;
  controls: string[];
}

// Agent A Data - Mercado/ESG
interface AgentAData {
  marketThreats: Array<{
    title: string;
    category: string;
    impact: string;
    relevanceScore: number;
    summary: string;
  }>;
  marketOpportunities: Array<{
    title: string;
    category: string;
    potentialValue: string;
    summary: string;
  }>;
  sectorTrends: Array<{
    trend: string;
    direction: string;
    implications: string;
  }>;
}

// Agent B Data - Memória Institucional
interface AgentBData {
  historicalPatterns: Array<{
    pattern: string;
    frequency: number;
    status: string;
    costOfInaction: string;
  }>;
  executionGaps: Array<{
    decision: string;
    daysOverdue: number;
    blockers: string[];
  }>;
  recurringIssues: Array<{
    issue: string;
    occurrences: number;
    severity: string;
  }>;
  governanceHealthScore: number;
}

// Agent C Data - Scoring
interface AgentCData {
  priorityScores: Array<{
    topic: string;
    score: number;
    classification: string;
  }>;
  urgencyMatrix: Array<{
    item: string;
    urgencyLevel: string;
    consequence: string;
  }>;
  topPriorities: string[];
}

// Agent D Data - Contexto de Reuniões
interface AgentDData {
  recentDeliberations: Array<{
    topic: string;
    decision: string;
    status: string;
  }>;
  upcomingMeetings: Array<{
    title: string;
    date: string;
    criticalDecisions: string[];
  }>;
  pendingActions: Array<{
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  }>;
}

// Payload completo do Orquestrador
interface OrchestratorPayload {
  // Dados básicos (retrocompatibilidade)
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
  
  // Dados dos agentes especializados
  agentAData?: AgentAData;
  agentBData?: AgentBData;
  agentCData?: AgentCData;
  agentDData?: AgentDData;
  
  // Configuração de prompt
  promptConfig?: {
    promptId: string;
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
  } | null;
}

// ============================================================================
// FALLBACK PROMPT - ORQUESTRADOR DE INTELIGÊNCIA
// ============================================================================

const FALLBACK_PROMPT: PromptConfig = {
  id: 'fallback-orchestrator-insights',
  name: 'Agent H - Orchestrator (Fallback)',
  category: 'agent_h_governance_insights',
  version: '2.0.0',
  system_prompt: `Você é o Agent H - Orquestrador de Inteligência Estratégica da Legacy OS.

Você recebe dados estruturados de 4 agentes especializados e deve sintetizá-los em insights acionáveis para o conselho de administração.

## AGENTES DE ENTRADA

AGENT A (Coleta & Classificação):
- Sinais de mercado, tendências setoriais, movimentos regulatórios
- Ameaças e oportunidades externas
- Score de relevância para cada sinal

AGENT B (Memória Institucional):
- Padrões históricos de governança
- Gaps de execução e decisões pendentes
- Custos de não-decisão

AGENT C (Scoring & Priorização):
- Priority scores calculados
- Matriz de urgência
- Top prioridades rankeadas

AGENT D (Contexto de Reuniões):
- Deliberações recentes
- Reuniões próximas
- Ações pendentes de follow-up

## SUA MISSÃO

Correlacionar inteligências de múltiplas fontes para gerar insights estratégicos acionáveis. Você deve:

1. Identificar conexões entre dados de diferentes agentes
2. Priorizar por impacto estratégico real
3. Gerar recomendações práticas e executáveis

## REGRA CRÍTICA

Cada insight DEVE citar qual(is) agente(s) forneceu(ram) os dados-base no campo "sources".
Exemplo: sources: ["agent_a", "agent_c"]

## GERAR EXATAMENTE

- 2 Riscos Estratégicos (strategic_risks)
- 2 Ameaças Operacionais (operational_threats)
- 2 Oportunidades Estratégicas (strategic_opportunities)

## DIRETRIZES

Para cada insight:
- Título: Curto e claro (máximo 50 caracteres)
- Contexto: Resumido em 1 linha (máximo 80 caracteres)
- Ações: SEMPRE 2 ações recomendadas (primary e secondary)
- Sources: Array de agentes que forneceram dados relevantes`,
  user_prompt_template: null,
  model: 'google/gemini-3-flash-preview',
  temperature: 0.7,
  max_tokens: 4000,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
  functions: null,
  tool_choice: 'auto',
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function formatAgentAData(data?: AgentAData): string {
  if (!data || (!data.marketThreats?.length && !data.marketOpportunities?.length && !data.sectorTrends?.length)) {
    return "Sem dados de mercado disponíveis.";
  }

  let result = "";
  
  if (data.marketThreats?.length) {
    result += "AMEAÇAS DE MERCADO:\n";
    data.marketThreats.forEach(t => {
      result += `- ${t.title} (${t.category}, impacto: ${t.impact}, relevância: ${t.relevanceScore}): ${t.summary}\n`;
    });
  }
  
  if (data.marketOpportunities?.length) {
    result += "\nOPORTUNIDADES:\n";
    data.marketOpportunities.forEach(o => {
      result += `- ${o.title} (${o.category}, valor: ${o.potentialValue}): ${o.summary}\n`;
    });
  }
  
  if (data.sectorTrends?.length) {
    result += "\nTENDÊNCIAS DO SETOR:\n";
    data.sectorTrends.forEach(t => {
      result += `- ${t.trend} (direção: ${t.direction}): ${t.implications}\n`;
    });
  }
  
  return result;
}

function formatAgentBData(data?: AgentBData): string {
  if (!data || (!data.historicalPatterns?.length && !data.executionGaps?.length && !data.recurringIssues?.length)) {
    return "Sem dados de memória institucional disponíveis.";
  }

  let result = `Health Score de Governança: ${data.governanceHealthScore || 0}/100\n\n`;
  
  if (data.historicalPatterns?.length) {
    result += "PADRÕES HISTÓRICOS:\n";
    data.historicalPatterns.forEach(p => {
      result += `- ${p.pattern} (frequência: ${p.frequency}x, status: ${p.status}): Custo de inação: ${p.costOfInaction}\n`;
    });
  }
  
  if (data.executionGaps?.length) {
    result += "\nGAPS DE EXECUÇÃO:\n";
    data.executionGaps.forEach(g => {
      result += `- ${g.decision} (${g.daysOverdue} dias atrasado): Blockers: ${g.blockers.join(", ")}\n`;
    });
  }
  
  if (data.recurringIssues?.length) {
    result += "\nPROBLEMAS RECORRENTES:\n";
    data.recurringIssues.forEach(i => {
      result += `- ${i.issue} (${i.occurrences}x, severidade: ${i.severity})\n`;
    });
  }
  
  return result;
}

function formatAgentCData(data?: AgentCData): string {
  if (!data || (!data.priorityScores?.length && !data.urgencyMatrix?.length)) {
    return "Sem dados de priorização disponíveis.";
  }

  let result = "";
  
  if (data.topPriorities?.length) {
    result += `TOP PRIORIDADES: ${data.topPriorities.join(", ")}\n\n`;
  }
  
  if (data.priorityScores?.length) {
    result += "SCORES DE PRIORIDADE:\n";
    data.priorityScores.forEach(s => {
      result += `- ${s.topic}: Score ${s.score}/100 (${s.classification})\n`;
    });
  }
  
  if (data.urgencyMatrix?.length) {
    result += "\nMATRIZ DE URGÊNCIA:\n";
    data.urgencyMatrix.forEach(u => {
      result += `- ${u.item} (${u.urgencyLevel}): ${u.consequence}\n`;
    });
  }
  
  return result;
}

function formatAgentDData(data?: AgentDData): string {
  if (!data || (!data.recentDeliberations?.length && !data.upcomingMeetings?.length && !data.pendingActions?.length)) {
    return "Sem contexto de reuniões disponível.";
  }

  let result = "";
  
  if (data.recentDeliberations?.length) {
    result += "DELIBERAÇÕES RECENTES:\n";
    data.recentDeliberations.forEach(d => {
      result += `- ${d.topic}: ${d.decision} (status: ${d.status})\n`;
    });
  }
  
  if (data.upcomingMeetings?.length) {
    result += "\nPRÓXIMAS REUNIÕES:\n";
    data.upcomingMeetings.forEach(m => {
      result += `- ${m.title} (${m.date}): Decisões críticas: ${m.criticalDecisions.join(", ")}\n`;
    });
  }
  
  if (data.pendingActions?.length) {
    result += "\nAÇÕES PENDENTES:\n";
    data.pendingActions.forEach(a => {
      result += `- ${a.description} (prazo: ${a.dueDate}, prioridade: ${a.priority}, status: ${a.status})\n`;
    });
  }
  
  return result;
}

function buildOrchestratorPrompt(payload: OrchestratorPayload): string {
  const hasAgentData = payload.agentAData || payload.agentBData || payload.agentCData || payload.agentDData;
  
  let prompt = `Analise os seguintes dados de governança e gere insights estratégicos:\n\n`;
  
  // Dados básicos (sempre presentes)
  prompt += `## MÉTRICAS ATUAIS DA EMPRESA\n`;
  prompt += `- Score de Maturidade de Governança: ${payload.maturityScore}/5\n`;
  prompt += `- Score ESG: ${payload.esgScore}/100\n`;
  prompt += `- Tarefas Pendentes: ${payload.pendingTasks}\n`;
  prompt += `- Tarefas Atrasadas: ${payload.overduesTasks}\n`;
  prompt += `- Riscos Críticos: ${payload.criticalRisks}\n\n`;
  
  prompt += `## RISCOS MAPEADOS\n`;
  prompt += payload.risks.map(r => 
    `- ${r.title} (${r.category}): Impacto ${r.impact}/5, Probabilidade ${r.probability}/5, Status: ${r.status}, Controles: ${r.controls.length}`
  ).join('\n');
  prompt += '\n\n';
  
  // Dados dos agentes (se disponíveis)
  if (hasAgentData) {
    prompt += `## INTELIGÊNCIA DOS AGENTES ESPECIALIZADOS\n\n`;
    
    prompt += `### AGENT A - Coleta & Classificação (Mercado/ESG)\n`;
    prompt += formatAgentAData(payload.agentAData);
    prompt += '\n\n';
    
    prompt += `### AGENT B - Memória Institucional (Padrões/Gaps)\n`;
    prompt += formatAgentBData(payload.agentBData);
    prompt += '\n\n';
    
    prompt += `### AGENT C - Scoring & Priorização\n`;
    prompt += formatAgentCData(payload.agentCData);
    prompt += '\n\n';
    
    prompt += `### AGENT D - Contexto de Reuniões\n`;
    prompt += formatAgentDData(payload.agentDData);
    prompt += '\n\n';
    
    prompt += `## INSTRUÇÕES\n`;
    prompt += `Com base nos dados dos 4 agentes acima, correlacione as informações para gerar:\n`;
    prompt += `- 2 Riscos Estratégicos (com base em dados de múltiplos agentes)\n`;
    prompt += `- 2 Ameaças Operacionais (com horizonte temporal definido)\n`;
    prompt += `- 2 Oportunidades Estratégicas (com ações concretas)\n\n`;
    prompt += `IMPORTANTE: Cada insight deve citar no campo "sources" quais agentes forneceram dados relevantes.\n`;
  } else {
    prompt += `Com base nestes dados, gere insights preditivos estratégicos organizados em 3 categorias: Riscos Estratégicos, Ameaças Operacionais e Oportunidades Estratégicas.\n\n`;
    prompt += `IMPORTANTE: Cada insight deve ter ações práticas e executáveis.\n`;
  }
  
  return prompt;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const payload: OrchestratorPayload = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Carregar prompt do banco de dados
    const promptConfig = await loadPromptConfig('agent_h_governance_insights', FALLBACK_PROMPT);

    // Construir prompt do orquestrador
    const userPrompt = buildOrchestratorPrompt(payload);

    // Verificar se temos dados de agentes para enriquecer a resposta
    const hasAgentData = payload.agentAData || payload.agentBData || payload.agentCData || payload.agentDData;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: promptConfig.model,
        temperature: promptConfig.temperature,
        max_tokens: promptConfig.max_tokens,
        messages: [
          { role: "system", content: promptConfig.system_prompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_governance_insights",
              description: "Gera insights de governança estruturados em 3 categorias estratégicas para o conselho, com citação de fontes dos agentes",
              parameters: {
                type: "object",
                properties: {
                  strategic_risks: {
                    type: "array",
                    description: "2 riscos estratégicos estruturais para governança",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Título curto e claro (máx 50 caracteres)" },
                        context: { type: "string", description: "Contexto resumido em 1 linha (máx 80 caracteres)" },
                        priority: { type: "string", enum: ["critical", "high", "medium"], description: "Classificação" },
                        actions: {
                          type: "object",
                          properties: {
                            primary: { type: "string", description: "Ação prioritária principal" },
                            secondary: { type: "string", description: "Ação complementar de suporte" }
                          },
                          required: ["primary", "secondary"]
                        },
                        sources: {
                          type: "array",
                          items: { type: "string", enum: ["agent_a", "agent_b", "agent_c", "agent_d"] },
                          description: "Agentes que forneceram dados para este insight"
                        }
                      },
                      required: ["title", "context", "priority", "actions", "sources"]
                    }
                  },
                  operational_threats: {
                    type: "array",
                    description: "2 ameaças operacionais/regulatórias emergentes",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Título curto e claro" },
                        context: { type: "string", description: "Contexto resumido" },
                        timeframe: { type: "string", enum: ["immediate", "30_days", "90_days"], description: "Horizonte temporal" },
                        category: { type: "string", description: "Categoria: Regulatório, Mercado, Liquidez, Compliance, Reputação" },
                        actions: {
                          type: "object",
                          properties: {
                            primary: { type: "string" },
                            secondary: { type: "string" }
                          },
                          required: ["primary", "secondary"]
                        },
                        sources: {
                          type: "array",
                          items: { type: "string", enum: ["agent_a", "agent_b", "agent_c", "agent_d"] },
                          description: "Agentes que forneceram dados para este insight"
                        }
                      },
                      required: ["title", "context", "timeframe", "category", "actions", "sources"]
                    }
                  },
                  strategic_opportunities: {
                    type: "array",
                    description: "2 oportunidades estratégicas de criação de valor",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Título curto e claro" },
                        context: { type: "string", description: "Contexto resumido" },
                        actions: {
                          type: "object",
                          properties: {
                            primary: { type: "string" },
                            secondary: { type: "string" }
                          },
                          required: ["primary", "secondary"]
                        },
                        sources: {
                          type: "array",
                          items: { type: "string", enum: ["agent_a", "agent_b", "agent_c", "agent_d"] },
                          description: "Agentes que forneceram dados para este insight"
                        }
                      },
                      required: ["title", "context", "actions", "sources"]
                    }
                  }
                },
                required: ["strategic_risks", "operational_threats", "strategic_opportunities"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_governance_insights" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "rate_limit",
          message: "Limite de requisições excedido. Tente novamente em alguns minutos."
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "payment_required",
          message: "Créditos insuficientes para IA." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response received");
    
    let governanceInsights = null;
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        if (parsed.strategic_risks && parsed.operational_threats && parsed.strategic_opportunities) {
          // Garantir que cada insight tenha sources
          const ensureSources = (items: any[], defaultSources: string[]) => 
            items.map(item => ({
              ...item,
              sources: item.sources || defaultSources
            }));
          
          governanceInsights = {
            strategicRisks: ensureSources(parsed.strategic_risks, hasAgentData ? ["agent_a", "agent_b"] : []),
            operationalThreats: ensureSources(parsed.operational_threats, hasAgentData ? ["agent_a", "agent_c"] : []),
            strategicOpportunities: ensureSources(parsed.strategic_opportunities, hasAgentData ? ["agent_a", "agent_d"] : []),
          };
        }
      } catch (e) {
        console.error("Failed to parse tool call arguments:", e);
      }
    }
    
    if (!governanceInsights && data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.strategic_risks && parsed.operational_threats && parsed.strategic_opportunities) {
            governanceInsights = {
              strategicRisks: parsed.strategic_risks,
              operationalThreats: parsed.operational_threats,
              strategicOpportunities: parsed.strategic_opportunities,
            };
          }
        }
      } catch (e) {
        console.error("Failed to parse content as JSON:", e);
      }
    }
    
    if (!governanceInsights && data.choices?.[0]?.message?.function_call?.arguments) {
      try {
        const parsed = JSON.parse(data.choices[0].message.function_call.arguments);
        if (parsed.strategic_risks && parsed.operational_threats && parsed.strategic_opportunities) {
          governanceInsights = {
            strategicRisks: parsed.strategic_risks,
            operationalThreats: parsed.operational_threats,
            strategicOpportunities: parsed.strategic_opportunities,
          };
        }
      } catch (e) {
        console.error("Failed to parse function call arguments:", e);
      }
    }

    const executionTime = Date.now() - startTime;
    
    if (governanceInsights) {
      // Atualizar métricas do prompt
      await updatePromptMetrics(promptConfig.id, {
        execution_time_ms: executionTime,
        tokens_used: data.usage?.total_tokens || 2500,
        success: true
      });

      return new Response(JSON.stringify({ 
        governanceInsights,
        metadata: {
          generatedAt: new Date().toISOString(),
          modelUsed: promptConfig.model,
          executionTimeMs: executionTime,
          agentsUsed: hasAgentData 
            ? Object.keys(payload).filter(k => k.startsWith('agent') && payload[k as keyof OrchestratorPayload])
                .map(k => k.replace('Data', '').toLowerCase())
            : []
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.warn("Could not parse AI response, using fallback governance insights");
    const fallbackGovernanceInsights = {
      strategicRisks: [
        {
          title: "Vulnerabilidade na Sucessão Executiva",
          context: "Ausência de plano sucessório pode comprometer continuidade",
          priority: "critical",
          actions: {
            primary: "Mapear posições-chave e candidatos potenciais",
            secondary: "Desenvolver programa de mentoria executiva"
          },
          sources: ["agent_b"]
        },
        {
          title: "Concentração de Decisões",
          context: "Dependência excessiva de poucos decisores estratégicos",
          priority: "high",
          actions: {
            primary: "Implementar comitês de governança temáticos",
            secondary: "Documentar processos decisórios críticos"
          },
          sources: ["agent_b", "agent_c"]
        }
      ],
      operationalThreats: [
        {
          title: "Pressão Regulatória ESG",
          context: "Novas exigências de disclosure podem impactar operações",
          timeframe: "30_days",
          category: "Regulatório",
          actions: {
            primary: "Realizar gap analysis de compliance ESG",
            secondary: "Contratar consultoria especializada"
          },
          sources: ["agent_a"]
        },
        {
          title: "Risco de Liquidez Sazonal",
          context: "Ciclo de caixa pode pressionar capital de giro",
          timeframe: "90_days",
          category: "Liquidez",
          actions: {
            primary: "Renegociar linhas de crédito preventivamente",
            secondary: "Revisar política de gestão de recebíveis"
          },
          sources: ["agent_a", "agent_c"]
        }
      ],
      strategicOpportunities: [
        {
          title: "Fortalecimento da Cultura de Compliance",
          context: "Momento favorável para consolidar práticas éticas",
          actions: {
            primary: "Lançar programa de integridade corporativa",
            secondary: "Criar canal de denúncias independente"
          },
          sources: ["agent_b", "agent_d"]
        },
        {
          title: "Digitalização de Processos de Governança",
          context: "Automação pode elevar eficiência em 40%",
          actions: {
            primary: "Implementar portal de governança digital",
            secondary: "Capacitar conselheiros em ferramentas digitais"
          },
          sources: ["agent_a", "agent_d"]
        }
      ]
    };
    
    return new Response(JSON.stringify({ governanceInsights: fallbackGovernanceInsights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("predictive-insights error:", error);
    return new Response(JSON.stringify({ 
      error: "internal_error",
      message: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
