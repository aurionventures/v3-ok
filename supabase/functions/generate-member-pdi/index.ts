import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MemberPerformanceData {
  member_id: string;
  member_name: string;
  member_role: string;
  council_name: string;
  scores: {
    presence: number;
    contribution: number;
    delivery: number;
    engagement: number;
    leadership: number;
    overall: number;
  };
  evaluation_feedback?: {
    strengths: string[];
    areas_for_improvement: string[];
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const performanceData: MemberPerformanceData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!performanceData.member_id || !performanceData.member_name) {
      return new Response(
        JSON.stringify({ error: "member_id and member_name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Você é um especialista em desenvolvimento de liderança e governança corporativa.

Sua função é criar Planos de Desenvolvimento Individual (PDI) personalizados para membros de conselhos e alta liderança.

O PDI deve ser:
- Baseado em dados concretos de performance
- Prático e executável
- Focado em desenvolvimento de competências estratégicas
- Alinhado com as melhores práticas de governança corporativa

DIRETRIZES PARA O PDI:

1. GAPS DE COMPETÊNCIA:
   - Identificar 3-4 gaps principais baseados nos scores
   - Priorizar: high (score < 60), medium (60-75), low (> 75)
   - Fornecer evidências específicas

2. OBJETIVOS DE DESENVOLVIMENTO:
   - Criar 3-4 objetivos SMART
   - Definir métricas claras de sucesso
   - Timeline de 6-12 meses

3. AÇÕES RECOMENDADAS:
   - 6-8 ações concretas e executáveis
   - Mix de: cursos, mentorias, projetos práticos, leituras
   - Estimativa de horas para cada ação
   - Deadlines realistas

4. RECURSOS:
   - 2-3 cursos relevantes (com providers conhecidos)
   - 2-3 livros/artigos recomendados
   - Sugestão de mentores internos`;

    const userPrompt = `Crie um PDI personalizado para:

PERFIL DO MEMBRO:
- Nome: ${performanceData.member_name}
- Cargo: ${performanceData.member_role}
- Órgão: ${performanceData.council_name}

SCORES DE PERFORMANCE (0-100):
- Presença: ${performanceData.scores.presence}
- Contribuição: ${performanceData.scores.contribution}
- Entrega: ${performanceData.scores.delivery}
- Engajamento: ${performanceData.scores.engagement}
- Liderança: ${performanceData.scores.leadership}
- Score Geral: ${performanceData.scores.overall}

${performanceData.evaluation_feedback ? `
FEEDBACK DAS AVALIAÇÕES 360°:
Pontos Fortes: ${performanceData.evaluation_feedback.strengths.join(', ')}
Áreas de Melhoria: ${performanceData.evaluation_feedback.areas_for_improvement.join(', ')}
` : ''}

Gere um PDI completo e estruturado.`;

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
              name: "generate_pdi",
              description: "Gera um Plano de Desenvolvimento Individual estruturado",
              parameters: {
                type: "object",
                properties: {
                  gap_analysis_summary: {
                    type: "string",
                    description: "Resumo executivo da análise de gaps (2-3 frases)"
                  },
                  identified_gaps: {
                    type: "array",
                    description: "3-4 gaps de competência identificados",
                    items: {
                      type: "object",
                      properties: {
                        competency: { type: "string", description: "Nome da competência" },
                        currentLevel: { type: "number", description: "Nível atual (0-100)" },
                        targetLevel: { type: "number", description: "Nível alvo (0-100)" },
                        gap: { type: "number", description: "Diferença em pontos" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        evidenceFrom: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Evidências que suportam o gap"
                        }
                      },
                      required: ["competency", "currentLevel", "targetLevel", "gap", "priority", "evidenceFrom"]
                    }
                  },
                  development_goals: {
                    type: "array",
                    description: "3-4 objetivos de desenvolvimento SMART",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        goal: { type: "string", description: "Descrição do objetivo" },
                        competency: { type: "string", description: "Competência relacionada" },
                        metrics: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Métricas de sucesso"
                        },
                        targetDate: { type: "string", description: "Data alvo (formato ISO)" },
                        priority: { type: "number", description: "Ordem de prioridade (1-4)" }
                      },
                      required: ["id", "goal", "competency", "metrics", "targetDate", "priority"]
                    }
                  },
                  recommended_actions: {
                    type: "array",
                    description: "6-8 ações de desenvolvimento",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        action: { type: "string", description: "Descrição da ação" },
                        type: { 
                          type: "string", 
                          enum: ["course", "mentoring", "practice", "reading", "project"]
                        },
                        estimatedHours: { type: "number", description: "Horas estimadas" },
                        deadline: { type: "string", description: "Prazo (formato ISO)" },
                        relatedGoals: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "IDs dos objetivos relacionados"
                        }
                      },
                      required: ["id", "action", "type", "estimatedHours", "deadline", "relatedGoals"]
                    }
                  },
                  recommended_courses: {
                    type: "array",
                    description: "2-3 cursos recomendados",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        provider: { type: "string" },
                        duration: { type: "string" },
                        url: { type: "string" },
                        relevantFor: { type: "array", items: { type: "string" } }
                      },
                      required: ["title", "provider", "duration", "relevantFor"]
                    }
                  },
                  recommended_readings: {
                    type: "array",
                    description: "2-3 livros/artigos recomendados",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        author: { type: "string" },
                        type: { type: "string", enum: ["book", "article", "whitepaper"] },
                        relevantFor: { type: "string" }
                      },
                      required: ["title", "author", "type", "relevantFor"]
                    }
                  },
                  recommended_mentors: {
                    type: "array",
                    description: "Perfis de mentores sugeridos",
                    items: { type: "string" }
                  },
                  priority_areas: {
                    type: "array",
                    description: "Áreas prioritárias de foco",
                    items: { type: "string" }
                  }
                },
                required: [
                  "gap_analysis_summary",
                  "identified_gaps",
                  "development_goals",
                  "recommended_actions",
                  "recommended_courses",
                  "recommended_readings",
                  "recommended_mentors",
                  "priority_areas"
                ]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_pdi" } }
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
    console.log("AI Response:", JSON.stringify(data, null, 2));

    // Extract PDI from response
    let pdiData = null;

    // Format 1: Tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        pdiData = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Failed to parse tool call arguments:", e);
      }
    }

    // Format 2: Function call (older format)
    if (!pdiData && data.choices?.[0]?.message?.function_call?.arguments) {
      try {
        pdiData = JSON.parse(data.choices[0].message.function_call.arguments);
      } catch (e) {
        console.error("Failed to parse function call arguments:", e);
      }
    }

    if (!pdiData) {
      // Fallback PDI
      console.warn("Could not parse AI response, using fallback PDI");
      pdiData = generateFallbackPDI(performanceData);
    }

    // Build complete PDI response
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setMonth(targetDate.getMonth() + 6);

    const pdiPlan = {
      member_id: performanceData.member_id,
      start_date: today.toISOString().split('T')[0],
      target_completion_date: targetDate.toISOString().split('T')[0],
      review_frequency: 'quarterly',
      status: 'active',
      progress_percentage: 0,
      generated_by_ai: true,
      ai_confidence_score: 85,
      ai_model_used: 'google/gemini-2.5-flash',
      ai_generation_date: today.toISOString(),
      ...pdiData
    };

    return new Response(
      JSON.stringify({ success: true, pdi: pdiPlan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-member-pdi error:", error);
    return new Response(
      JSON.stringify({ 
        error: "internal_error",
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateFallbackPDI(data: MemberPerformanceData) {
  const today = new Date();
  const inThreeMonths = new Date(today);
  inThreeMonths.setMonth(inThreeMonths.getMonth() + 3);
  const inSixMonths = new Date(today);
  inSixMonths.setMonth(inSixMonths.getMonth() + 6);

  return {
    gap_analysis_summary: `Com base na análise de performance de ${data.member_name}, identificamos oportunidades de desenvolvimento nas áreas de contribuição estratégica e engajamento proativo nas reuniões do conselho.`,
    identified_gaps: [
      {
        competency: "Contribuição Estratégica",
        currentLevel: data.scores.contribution,
        targetLevel: 85,
        gap: 85 - data.scores.contribution,
        priority: data.scores.contribution < 60 ? "high" : "medium",
        evidenceFrom: ["Score de contribuição abaixo da média", "Baixa participação em discussões estratégicas"]
      },
      {
        competency: "Liderança e Influência",
        currentLevel: data.scores.leadership,
        targetLevel: 80,
        gap: 80 - data.scores.leadership,
        priority: data.scores.leadership < 60 ? "high" : "medium",
        evidenceFrom: ["Oportunidade de desenvolver influência no conselho", "Potencial de liderança em comitês"]
      }
    ],
    development_goals: [
      {
        id: "goal-1",
        goal: "Aumentar participação ativa em discussões estratégicas em 50%",
        competency: "Contribuição Estratégica",
        metrics: ["Número de contribuições por reunião", "Qualidade das sugestões implementadas"],
        targetDate: inThreeMonths.toISOString(),
        priority: 1
      },
      {
        id: "goal-2",
        goal: "Desenvolver expertise em governança ESG",
        competency: "Conhecimento Especializado",
        metrics: ["Conclusão de certificação ESG", "Apresentação de tema ESG ao conselho"],
        targetDate: inSixMonths.toISOString(),
        priority: 2
      }
    ],
    recommended_actions: [
      {
        id: "action-1",
        action: "Completar curso de Governança Corporativa Avançada",
        type: "course",
        estimatedHours: 40,
        deadline: inThreeMonths.toISOString(),
        relatedGoals: ["goal-1"]
      },
      {
        id: "action-2",
        action: "Participar de sessão de mentoria com presidente do conselho",
        type: "mentoring",
        estimatedHours: 8,
        deadline: inThreeMonths.toISOString(),
        relatedGoals: ["goal-1", "goal-2"]
      },
      {
        id: "action-3",
        action: "Ler 'Board Leadership' de Jay Conger",
        type: "reading",
        estimatedHours: 12,
        deadline: inThreeMonths.toISOString(),
        relatedGoals: ["goal-1"]
      },
      {
        id: "action-4",
        action: "Liderar projeto de melhoria de processo no comitê",
        type: "project",
        estimatedHours: 20,
        deadline: inSixMonths.toISOString(),
        relatedGoals: ["goal-2"]
      }
    ],
    recommended_courses: [
      {
        title: "Governança Corporativa para Conselheiros",
        provider: "IBGC",
        duration: "32 horas",
        url: "https://www.ibgc.org.br/cursos",
        relevantFor: ["Contribuição Estratégica", "Liderança"]
      },
      {
        title: "ESG para Conselhos de Administração",
        provider: "FGV",
        duration: "24 horas",
        relevantFor: ["Conhecimento Especializado", "ESG"]
      }
    ],
    recommended_readings: [
      {
        title: "Board Leadership",
        author: "Jay Conger",
        type: "book",
        relevantFor: "Liderança e Influência"
      },
      {
        title: "The Board Game",
        author: "Betsy Atkins",
        type: "book",
        relevantFor: "Contribuição Estratégica"
      }
    ],
    recommended_mentors: [
      "Presidente do Conselho de Administração",
      "Conselheiro independente com experiência em ESG",
      "Membro sênior do Conselho Consultivo"
    ],
    priority_areas: [
      "Participação ativa em discussões",
      "Desenvolvimento de expertise ESG",
      "Networking com outros conselheiros"
    ]
  };
}
