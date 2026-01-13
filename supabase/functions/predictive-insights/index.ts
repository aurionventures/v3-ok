import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { loadPromptConfig, updatePromptMetrics, type PromptConfig } from "../_shared/prompt-loader.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RiskData {
  id: number;
  category: string;
  title: string;
  impact: number;
  probability: number;
  status: string;
  controls: string[];
}

interface SystemData {
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
}

// Fallback prompt caso não encontre no banco
const FALLBACK_PROMPT: PromptConfig = {
  id: 'fallback-governance-insights',
  name: 'Governance Insights (Fallback)',
  category: 'agent_h_governance_insights',
  version: '1.0.0',
  system_prompt: `Você é um Copiloto de Governança Corporativa assistido por IA, especializado em análise estratégica para conselhos e alta liderança.

Sua função é:
- Antecipar cenários críticos
- Apoiar decisões estratégicas da liderança
- Transformar sinais em ações concretas e executáveis
- Atuar como um verdadeiro parceiro de governança

Você DEVE gerar insights em EXATAMENTE 3 categorias obrigatórias:

1. RISCOS ESTRATÉGICOS (strategic_risks):
   - Riscos estruturais e sistêmicos que ameaçam a organização
   - Classificação clara: Crítico (crítico), Alto (high), Médio (medium)
   - Gerar EXATAMENTE 2 riscos

2. AMEAÇAS OPERACIONAIS/REGULATÓRIAS (operational_threats):
   - Pressões externas ou internas emergentes
   - Horizonte temporal explícito: immediate (imediato), 30_days, 90_days
   - Gerar EXATAMENTE 2 ameaças

3. OPORTUNIDADES ESTRATÉGICAS (strategic_opportunities):
   - Ganhos potenciais decorrentes de ação antecipada
   - Gerar EXATAMENTE 2 oportunidades

DIRETRIZES PARA CADA INSIGHT:
- Título: Curto e claro (máximo 50 caracteres)
- Contexto: Resumido em 1 linha (máximo 80 caracteres)
- Ações: SEMPRE 2 ações recomendadas pela IA`,
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const systemData: SystemData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Carregar prompt do banco de dados
    const promptConfig = await loadPromptConfig('agent_h_governance_insights', FALLBACK_PROMPT);

    const userPrompt = `Analise os seguintes dados de governança da empresa e gere insights estratégicos:

RISCOS MAPEADOS:
${systemData.risks.map(r => `- ${r.title} (${r.category}): Impacto ${r.impact}/5, Probabilidade ${r.probability}/5, Status: ${r.status}, Controles: ${r.controls.length}`).join('\n')}

MÉTRICAS ATUAIS:
- Score de Maturidade de Governança: ${systemData.maturityScore}/5
- Score ESG: ${systemData.esgScore}/100
- Tarefas Pendentes: ${systemData.pendingTasks}
- Tarefas Atrasadas: ${systemData.overduesTasks}
- Riscos Críticos: ${systemData.criticalRisks}

Com base nestes dados, gere insights preditivos estratégicos organizados em 3 categorias: Riscos Estratégicos, Ameaças Operacionais e Oportunidades Estratégicas.

IMPORTANTE: Cada insight deve ter ações práticas e executáveis.`;

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
              description: "Gera insights de governança estruturados em 3 categorias estratégicas para o conselho",
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
                        }
                      },
                      required: ["title", "context", "priority", "actions"]
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
                        }
                      },
                      required: ["title", "context", "timeframe", "category", "actions"]
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
                        }
                      },
                      required: ["title", "context", "actions"]
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
          governanceInsights = {
            strategicRisks: parsed.strategic_risks,
            operationalThreats: parsed.operational_threats,
            strategicOpportunities: parsed.strategic_opportunities,
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

      return new Response(JSON.stringify({ governanceInsights }), {
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
          }
        },
        {
          title: "Concentração de Decisões",
          context: "Dependência excessiva de poucos decisores estratégicos",
          priority: "high",
          actions: {
            primary: "Implementar comitês de governança temáticos",
            secondary: "Documentar processos decisórios críticos"
          }
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
          }
        },
        {
          title: "Risco de Liquidez Sazonal",
          context: "Ciclo de caixa pode pressionar capital de giro",
          timeframe: "90_days",
          category: "Liquidez",
          actions: {
            primary: "Renegociar linhas de crédito preventivamente",
            secondary: "Revisar política de gestão de recebíveis"
          }
        }
      ],
      strategicOpportunities: [
        {
          title: "Fortalecimento da Cultura de Compliance",
          context: "Momento favorável para consolidar práticas éticas",
          actions: {
            primary: "Lançar programa de integridade corporativa",
            secondary: "Criar canal de denúncias independente"
          }
        },
        {
          title: "Digitalização de Processos de Governança",
          context: "Automação pode elevar eficiência em 40%",
          actions: {
            primary: "Implementar portal de governança digital",
            secondary: "Capacitar conselheiros em ferramentas digitais"
          }
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
