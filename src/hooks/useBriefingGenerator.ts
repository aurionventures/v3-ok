// ============================================================================
// HOOK: useBriefingGenerator
// Gera briefings personalizados para membros do conselho usando OpenAI
// ============================================================================

import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import type { 
  GeneratedAgenda, 
  MemberBriefing, 
  MemberBriefingContent,
  TopicBriefing,
  AgendaTopic
} from "@/types/copilot";

// --------------------------------------------------------------------------
// TIPOS
// --------------------------------------------------------------------------

export interface CouncilMember {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  role: string;
  history?: string;
  contributions?: string[];
}

interface BriefingGeneratorState {
  isGenerating: boolean;
  progress: number;
  currentMember: string | null;
  generatedBriefings: MemberBriefing[];
  error: string | null;
}

interface BriefingGeneratorResult extends BriefingGeneratorState {
  generateBriefingsForMeeting: (
    agenda: GeneratedAgenda,
    members: CouncilMember[]
  ) => Promise<MemberBriefing[]>;
  generateSingleBriefing: (
    agenda: GeneratedAgenda,
    member: CouncilMember
  ) => Promise<MemberBriefing | null>;
  reset: () => void;
}

// --------------------------------------------------------------------------
// PROMPTS DO AGENT D - BRIEFING GENERATOR
// --------------------------------------------------------------------------

const BRIEFING_SYSTEM_PROMPT = `Você é o Agent D do MOAT Engine da Legacy OS, especializado em criar briefings personalizados para membros de conselho de administração.

SUA MISSÃO:
Gerar um briefing individualizado que maximize a preparação e contribuição do membro na reunião.

ESTRUTURA DO BRIEFING:

A) RESUMO EXECUTIVO (200-300 palavras):
   - Contexto da reunião
   - Temas críticos
   - Por que esta reunião é importante
   - Principais decisões esperadas
   - PERSONALIZE para o membro: cite sua expertise e onde ele pode contribuir mais

B) ANÁLISE POR PAUTA (para cada tópico relevante):
   - Por que é relevante para ESTE membro específico
   - Pontos-chave que ele precisa entender
   - Por que a perspectiva dele é importante
   - Preocupações potenciais (baseado em sua expertise)
   - Posição sugerida

C) PERGUNTAS CRÍTICAS (5-7):
   Perguntas que ESTE membro especificamente deve fazer, baseado em:
   - Sua expertise técnica
   - Seu background
   - Sua perspectiva única
   - Gaps que outros podem não ver

D) CHECKLIST DE PREPARAÇÃO (5-7 itens):
   - Documentos para revisar (priorizados)
   - Dados para estudar
   - Pessoas para consultar antes
   - Itens práticos e acionáveis

E) TEMPO DE LEITURA:
   - Estime o tempo em minutos baseado no conteúdo gerado

F) DOCUMENTOS RELACIONADOS:
   - Liste documentos mencionados nas pautas
   - Priorize por relevância para este membro

PRINCÍPIOS:
1. PERSONALIZAÇÃO REAL: Use o nome do membro 3-5 vezes, cite expertise específica
2. ACIONÁVEL: Perguntas práticas, não genéricas. Preparação realista.
3. RESPEITOSO: Tom consultivo, não prescritivo. Reconheça expertise, sugira não ordene.

FORMATO DE SAÍDA:
Retorne APENAS JSON válido (sem markdown, sem \`\`\`), seguindo exatamente esta estrutura:
{
  "executiveSummary": "string (resumo executivo personalizado)",
  "topicBreakdown": [
    {
      "topicId": "string",
      "title": "string",
      "relevanceToMember": "string",
      "keyPoints": ["string", "string", "string"],
      "yourPerspectiveMatters": "string",
      "potentialConcerns": ["string", "string"],
      "suggestedStance": "string"
    }
  ],
  "criticalQuestions": ["string", "string", "string", "string", "string"],
  "preparationChecklist": ["string", "string", "string", "string", "string"],
  "estimatedReadingTime": number,
  "relatedDocuments": ["string", "string", "string"]
}`;

// --------------------------------------------------------------------------
// FUNÇÃO PARA CONSTRUIR O USER PROMPT
// --------------------------------------------------------------------------

function buildUserPrompt(agenda: GeneratedAgenda, member: CouncilMember): string {
  const topicsText = agenda.topics.map((t, i) => `
${i + 1}. ${t.title}
   - Prioridade: ${t.priority.toUpperCase()}
   - Categoria: ${t.category}
   - Duração Estimada: ${t.estimatedDuration} minutos
   - Racional: ${t.rationale}
   - Dados Relacionados:
     * Riscos: ${t.relatedData.risks.join(", ") || "N/A"}
     * Oportunidades: ${t.relatedData.opportunities.join(", ") || "N/A"}
     * Fatores Externos: ${t.relatedData.externalFactors.join(", ") || "N/A"}
   - Ações Sugeridas: ${t.suggestedActions.join("; ")}
   - Materiais de Preparação: ${t.preparationMaterials.join(", ")}`).join("\n");

  return `Gere um briefing PERSONALIZADO para ${member.name}.

=== PERFIL DO MEMBRO ===
Nome: ${member.name}
Cargo: ${member.role}
Expertise: ${member.expertise.join(", ")}
Histórico: ${member.history || "Membro experiente do conselho"}
Contribuições Anteriores: ${member.contributions?.join("; ") || "Participação ativa em decisões estratégicas"}

=== CONTEXTO DA REUNIÃO ===
Data: ${agenda.meetingDate}
Status: ${agenda.status}
Gerada em: ${agenda.generatedAt}

=== CONTEXTO DE MERCADO ===
${agenda.marketContext}

=== ALERTAS DE RISCO ===
${agenda.riskAlerts.map(r => `- ${r}`).join("\n")}

=== OPORTUNIDADES EM DESTAQUE ===
${agenda.opportunityHighlights.map(o => `- ${o}`).join("\n")}

=== TÓPICOS DA PAUTA (${agenda.topics.length} itens) ===
${topicsText}

=== MATRIZ DE PRIORIDADE ===
- DEVE DISCUTIR: ${agenda.priorityMatrix.mustDiscuss.length} temas
- DEVERIA DISCUTIR: ${agenda.priorityMatrix.shouldDiscuss.length} temas
- PODERIA DISCUTIR: ${agenda.priorityMatrix.couldDiscuss.length} temas
- FUTUROS: ${agenda.priorityMatrix.futureTopics.join(", ") || "Nenhum"}

=== INSTRUÇÕES ===
1. Personalize TODO o conteúdo para ${member.name} e sua expertise em ${member.expertise[0]}
2. Foque nos tópicos mais relevantes para a expertise dele
3. Crie perguntas que SOMENTE alguém com a experiência dele faria
4. O checklist deve ser realista e específico
5. Retorne APENAS JSON válido, sem formatação markdown`;
}

// --------------------------------------------------------------------------
// FUNÇÃO PARA CHAMAR A API OPENAI
// --------------------------------------------------------------------------

async function callOpenAI(
  systemPrompt: string, 
  userPrompt: string
): Promise<MemberBriefingContent> {
  // Tenta usar a Edge Function do Supabase primeiro
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-briefing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          model: 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (error) {
      console.warn('Edge Function não disponível, usando fallback mock:', error);
    }
  }

  // Fallback: Geração mock para desenvolvimento
  console.log('Usando geração mock (configure OPENAI_API_KEY na Edge Function para produção)');
  return generateMockBriefing(userPrompt);
}

// --------------------------------------------------------------------------
// FUNÇÃO DE FALLBACK: GERAÇÃO MOCK
// --------------------------------------------------------------------------

function generateMockBriefing(userPrompt: string): MemberBriefingContent {
  // Extrai nome do membro do prompt
  const nameMatch = userPrompt.match(/Nome: ([^\n]+)/);
  const memberName = nameMatch ? nameMatch[1].trim() : "Membro";
  
  const expertiseMatch = userPrompt.match(/Expertise: ([^\n]+)/);
  const expertise = expertiseMatch ? expertiseMatch[1].split(",")[0].trim() : "Governança";

  const dateMatch = userPrompt.match(/Data: ([^\n]+)/);
  const meetingDate = dateMatch ? dateMatch[1].trim() : "próxima reunião";

  return {
    executiveSummary: `${memberName}, a reunião de ${meetingDate} apresenta temas estratégicos fundamentais para o futuro da empresa. Sua expertise em ${expertise} será especialmente valiosa nas discussões sobre riscos e oportunidades identificados.

O contexto de mercado atual exige atenção redobrada aos movimentos competitivos e mudanças regulatórias. Há decisões críticas pendentes que podem impactar significativamente nossa posição no mercado.

Como membro do conselho, sua perspectiva técnica e experiência serão fundamentais para avaliar as propostas apresentadas e garantir que as decisões tomadas estejam alinhadas com os melhores interesses de longo prazo da organização.`,

    topicBreakdown: [
      {
        topicId: "topic-1",
        title: "Revisão Estratégica",
        relevanceToMember: `${memberName}, sua experiência em ${expertise} é essencial para avaliar a viabilidade das propostas apresentadas`,
        keyPoints: [
          "Análise de cenários macroeconômicos",
          "Benchmark com concorrentes",
          "Projeções financeiras trienais",
          "Riscos e oportunidades mapeados"
        ],
        yourPerspectiveMatters: `Sua visão sobre ${expertise} pode identificar gaps que outros membros não perceberiam`,
        potentialConcerns: [
          "Agressividade das metas propostas",
          "Capacidade de execução da equipe"
        ],
        suggestedStance: "Apoiar com ressalvas - solicitar análise de sensibilidade adicional"
      },
      {
        topicId: "topic-2",
        title: "Gestão de Riscos",
        relevanceToMember: `Tema alinhado com sua expertise em ${expertise} - sua contribuição será decisiva`,
        keyPoints: [
          "Riscos críticos identificados",
          "Planos de mitigação propostos",
          "Investimentos necessários"
        ],
        yourPerspectiveMatters: "Sua experiência pode antecipar riscos não mapeados pela gestão",
        potentialConcerns: [
          "Tempo de implementação das mitigações",
          "Recursos alocados podem ser insuficientes"
        ],
        suggestedStance: "Questionar profundamente antes de aprovar"
      }
    ],

    criticalQuestions: [
      `Qual o impacto nas áreas de ${expertise} se aprovarmos as propostas?`,
      "Os cenários pessimistas foram adequadamente considerados?",
      "Há precedentes no mercado que devemos considerar?",
      "Qual o custo de não-decisão neste tema?",
      "Como isso afeta nosso posicionamento estratégico de longo prazo?",
      "Os KPIs propostos são adequados para monitorar a execução?"
    ],

    preparationChecklist: [
      "Revisar material de apoio enviado pela secretaria",
      `Consultar especialistas internos em ${expertise}`,
      "Analisar benchmark setorial",
      "Revisar decisões anteriores relacionadas",
      "Preparar 2-3 perguntas estratégicas",
      "Verificar dados financeiros do último trimestre"
    ],

    estimatedReadingTime: 25,

    relatedDocuments: [
      "Plano Estratégico 2026-2028 - Draft",
      "Relatório de Riscos Q4",
      "Análise de Mercado - Confidencial",
      "Benchmark Setorial 2025",
      "Atas das últimas 3 reuniões"
    ]
  };
}

// --------------------------------------------------------------------------
// HOOK PRINCIPAL
// --------------------------------------------------------------------------

export function useBriefingGenerator(): BriefingGeneratorResult {
  const [state, setState] = useState<BriefingGeneratorState>({
    isGenerating: false,
    progress: 0,
    currentMember: null,
    generatedBriefings: [],
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      currentMember: null,
      generatedBriefings: [],
      error: null,
    });
  }, []);

  const generateSingleBriefing = useCallback(async (
    agenda: GeneratedAgenda,
    member: CouncilMember
  ): Promise<MemberBriefing | null> => {
    try {
      setState(prev => ({
        ...prev,
        currentMember: member.name,
      }));

      const userPrompt = buildUserPrompt(agenda, member);
      const content = await callOpenAI(BRIEFING_SYSTEM_PROMPT, userPrompt);

      const briefing: MemberBriefing = {
        id: `briefing-${agenda.id}-${member.id}-${Date.now()}`,
        memberId: member.id,
        meetingId: agenda.meetingId || agenda.id,
        agendaId: agenda.id,
        content,
        preparationProgress: 0,
        generatedAt: new Date().toISOString(),
      };

      return briefing;
    } catch (error) {
      console.error(`Erro ao gerar briefing para ${member.name}:`, error);
      return null;
    }
  }, []);

  const generateBriefingsForMeeting = useCallback(async (
    agenda: GeneratedAgenda,
    members: CouncilMember[]
  ): Promise<MemberBriefing[]> => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      generatedBriefings: [],
      error: null,
    }));

    const briefings: MemberBriefing[] = [];
    const totalMembers = members.length;

    toast({
      title: "Iniciando geração de briefings",
      description: `Gerando briefings personalizados para ${totalMembers} membros...`,
    });

    for (let i = 0; i < totalMembers; i++) {
      const member = members[i];
      
      setState(prev => ({
        ...prev,
        currentMember: member.name,
        progress: Math.round((i / totalMembers) * 100),
      }));

      try {
        const briefing = await generateSingleBriefing(agenda, member);
        
        if (briefing) {
          briefings.push(briefing);
          
          setState(prev => ({
            ...prev,
            generatedBriefings: [...prev.generatedBriefings, briefing],
          }));

          toast({
            title: `Briefing gerado`,
            description: `${member.name} - ${briefing.content.topicBreakdown.length} tópicos analisados`,
          });
        }
      } catch (error) {
        console.error(`Erro ao gerar briefing para ${member.name}:`, error);
        toast({
          title: "Erro na geração",
          description: `Falha ao gerar briefing para ${member.name}`,
          variant: "destructive",
        });
      }

      // Pequeno delay entre chamadas para não sobrecarregar a API
      if (i < totalMembers - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setState(prev => ({
      ...prev,
      isGenerating: false,
      progress: 100,
      currentMember: null,
    }));

    if (briefings.length > 0) {
      toast({
        title: "Briefings gerados com sucesso!",
        description: `${briefings.length} briefings personalizados foram criados`,
      });
    }

    return briefings;
  }, [generateSingleBriefing]);

  return {
    ...state,
    generateBriefingsForMeeting,
    generateSingleBriefing,
    reset,
  };
}

export default useBriefingGenerator;
