import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const systemData: SystemData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um especialista em governança corporativa, análise de riscos e estratégia empresarial.
Sua função é analisar dados de governança de uma empresa e gerar insights preditivos acionáveis.

Diretrizes:
- Seja objetivo e direto
- Foque em riscos emergentes e oportunidades
- Priorize ações de alto impacto
- Use linguagem profissional mas acessível
- Cada insight deve ter uma ação clara associada`;

    const userPrompt = `Analise os seguintes dados de governança da empresa:

RISCOS MAPEADOS:
${systemData.risks.map(r => `- ${r.title} (${r.category}): Impacto ${r.impact}/5, Probabilidade ${r.probability}/5, Status: ${r.status}, Controles: ${r.controls.length}`).join('\n')}

MÉTRICAS:
- Score de Maturidade de Governança: ${systemData.maturityScore}/5
- Score ESG: ${systemData.esgScore}/100
- Tarefas Pendentes: ${systemData.pendingTasks}
- Tarefas Atrasadas: ${systemData.overduesTasks}
- Riscos Críticos: ${systemData.criticalRisks}

Com base nestes dados, gere insights preditivos estratégicos para o conselho.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_predictive_insights",
              description: "Gera insights preditivos estruturados para governança corporativa",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { 
                          type: "string", 
                          enum: ["risk_alert", "opportunity", "recommendation"],
                          description: "Tipo do insight: alerta de risco, oportunidade ou recomendação"
                        },
                        title: { 
                          type: "string",
                          description: "Título curto e impactante do insight (máx 60 caracteres)"
                        },
                        description: { 
                          type: "string",
                          description: "Descrição detalhada do insight com contexto (máx 150 caracteres)"
                        },
                        priority: { 
                          type: "string", 
                          enum: ["critical", "high", "medium", "low"],
                          description: "Prioridade do insight baseado em urgência e impacto"
                        },
                        category: { 
                          type: "string",
                          description: "Categoria: Estratégico, Operacional, Financeiro, Compliance, ESG, Governança"
                        },
                        suggestedAction: { 
                          type: "string",
                          description: "Ação específica recomendada (máx 100 caracteres)"
                        },
                        timeframe: { 
                          type: "string",
                          description: "Prazo sugerido: Imediato, 7 dias, 30 dias, 90 dias"
                        }
                      },
                      required: ["type", "title", "description", "priority", "category", "suggestedAction", "timeframe"]
                    }
                  }
                },
                required: ["insights"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_predictive_insights" } }
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
    
    // Extract the function call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const insights = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unexpected response format from AI");
    
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
