// ============================================================================
// HOOKS PARA O COPILOTO IA-FIRST
// Integrado com geração de briefings via OpenAI
// ============================================================================

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import type {
  GeneratedAgenda,
  MemberBriefing,
  DynamicSWOT,
  UpcomingMeeting,
  AgendaStatus,
  SWOTTriggerSource,
} from "@/types/copilot";
import {
  mockGeneratedAgendas,
  mockUpcomingMeetings,
  mockDynamicSWOT,
  mockMemberBriefing,
} from "@/data/mockCopilotData";
import { useBriefingGenerator, type CouncilMember } from "@/hooks/useBriefingGenerator";
import { sendBriefingNotifications, type MemberData } from "@/services/notificationService";

// --------------------------------------------------------------------------
// DADOS MOCK DOS MEMBROS DO CONSELHO
// --------------------------------------------------------------------------

const MOCK_COUNCIL_MEMBERS: CouncilMember[] = [
  {
    id: "member-1",
    name: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    expertise: ["Finanças Corporativas", "M&A", "Estrutura de Capital"],
    role: "Conselheiro Independente",
    history: "Ex-CFO de multinacional, 20+ anos em finanças corporativas",
    contributions: ["Análise de valuation M&A", "Estruturação de funding"],
  },
  {
    id: "member-2",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@empresa.com",
    expertise: ["Governança Corporativa", "Compliance", "Riscos"],
    role: "Presidente do Conselho",
    history: "Especialista em governança, conselheira em 5 empresas listadas",
    contributions: ["Implementação de políticas de compliance", "Framework de riscos"],
  },
  {
    id: "member-3",
    name: "Roberto Mendes",
    email: "roberto.mendes@empresa.com",
    expertise: ["Tecnologia", "Transformação Digital", "Inovação"],
    role: "Conselheiro",
    history: "Ex-CTO de tech company, especialista em transformação digital",
    contributions: ["Roadmap de digitalização", "Avaliação de startups"],
  },
  {
    id: "member-4",
    name: "Marina Costa",
    email: "marina.costa@empresa.com",
    expertise: ["ESG", "Sustentabilidade", "Relações com Investidores"],
    role: "Conselheira Independente",
    history: "Especialista em ESG, ex-diretora de sustentabilidade",
    contributions: ["Estratégia ESG 2025", "Relatório de sustentabilidade GRI"],
  },
  {
    id: "member-5",
    name: "Paulo Ferreira",
    email: "paulo.ferreira@empresa.com",
    expertise: ["Jurídico", "Regulatório", "Contratos"],
    role: "Conselheiro",
    history: "Sócio de escritório de advocacia, especialista em direito empresarial",
    contributions: ["Due diligence jurídica", "Análise regulatória"],
  },
];

// --------------------------------------------------------------------------
// ARMAZENAMENTO LOCAL DE BRIEFINGS GERADOS
// --------------------------------------------------------------------------

const BRIEFINGS_STORAGE_KEY = 'legacy_generated_briefings';

function getStoredBriefings(): MemberBriefing[] {
  try {
    const stored = localStorage.getItem(BRIEFINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBriefings(briefings: MemberBriefing[]): void {
  localStorage.setItem(BRIEFINGS_STORAGE_KEY, JSON.stringify(briefings));
}

function addBriefings(newBriefings: MemberBriefing[]): void {
  const existing = getStoredBriefings();
  const updated = [...existing, ...newBriefings];
  saveBriefings(updated);
}

// --------------------------------------------------------------------------
// HOOK: useUpcomingMeetings
// --------------------------------------------------------------------------

export function useUpcomingMeetings() {
  const [meetings] = useState<UpcomingMeeting[]>(mockUpcomingMeetings);
  const [isLoading] = useState(false);

  return {
    meetings,
    isLoading,
    nextMeeting: meetings[0] || null,
  };
}

// --------------------------------------------------------------------------
// HOOK: useCouncilMembers
// --------------------------------------------------------------------------

export function useCouncilMembers() {
  const [members] = useState<CouncilMember[]>(MOCK_COUNCIL_MEMBERS);
  
  const getMemberById = useCallback((id: string) => {
    return members.find(m => m.id === id);
  }, [members]);

  const getMemberDataMap = useCallback((): Map<string, MemberData> => {
    const map = new Map<string, MemberData>();
    members.forEach(m => {
      map.set(m.id, { id: m.id, email: m.email, name: m.name });
    });
    return map;
  }, [members]);

  return {
    members,
    getMemberById,
    getMemberDataMap,
  };
}

// --------------------------------------------------------------------------
// HOOK: useGeneratedAgendas (com integração de briefings)
// --------------------------------------------------------------------------

export function useGeneratedAgendas() {
  const [agendas, setAgendas] = useState<GeneratedAgenda[]>(mockGeneratedAgendas);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Integração com gerador de briefings
  const briefingGenerator = useBriefingGenerator();
  const { members, getMemberDataMap } = useCouncilMembers();

  const pendingAgendas = useMemo(
    () => agendas.filter((a) => a.status === "pending"),
    [agendas]
  );

  const approvedAgendas = useMemo(
    () => agendas.filter((a) => a.status === "approved"),
    [agendas]
  );

  const generateAgenda = useCallback(async (meetingId: string) => {
    setIsGenerating(true);
    
    // Simula delay de geração por IA
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const meeting = mockUpcomingMeetings.find((m) => m.id === meetingId);
    if (!meeting) {
      toast({
        title: "Erro",
        description: "Reunião não encontrada",
        variant: "destructive",
      });
      setIsGenerating(false);
      return null;
    }

    // Cria nova agenda baseada no template mockado
    const newAgenda: GeneratedAgenda = {
      ...mockGeneratedAgendas[0],
      id: `agenda-${Date.now()}`,
      meetingId,
      meetingDate: meeting.date,
      generatedAt: new Date().toISOString(),
      status: "pending",
    };

    setAgendas((prev) => [...prev, newAgenda]);
    setIsGenerating(false);

    toast({
      title: "Agenda gerada com sucesso",
      description: `${newAgenda.topics.length} pautas sugeridas pela IA`,
    });

    return newAgenda;
  }, []);

  // FUNÇÃO PRINCIPAL: Aprovar agenda e gerar briefings
  const approveAgenda = useCallback(async (agendaId: string) => {
    // 1. Atualiza status da agenda
    setAgendas((prev) =>
      prev.map((a) =>
        a.id === agendaId
          ? { ...a, status: "approved" as AgendaStatus, approvedAt: new Date().toISOString() }
          : a
      )
    );

    const approvedAgenda = agendas.find(a => a.id === agendaId);
    
    if (!approvedAgenda) {
      toast({
        title: "Erro",
        description: "Agenda não encontrada",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Agenda aprovada!",
      description: "Iniciando geração de briefings personalizados...",
    });

    // 2. Gerar briefings para todos os membros
    try {
      const generatedBriefings = await briefingGenerator.generateBriefingsForMeeting(
        approvedAgenda,
        members
      );

      if (generatedBriefings.length > 0) {
        // 3. Salvar briefings gerados
        addBriefings(generatedBriefings);

        // 4. Enviar notificações
        const memberDataMap = getMemberDataMap();
        const notificationResults = await sendBriefingNotifications(
          generatedBriefings,
          memberDataMap,
          approvedAgenda.meetingDate,
          `Reunião do Conselho - ${approvedAgenda.meetingDate}`
        );

        toast({
          title: "Processo concluído!",
          description: `${generatedBriefings.length} briefings gerados e ${notificationResults.inAppSuccess} notificações enviadas`,
        });
      }
    } catch (error) {
      console.error("Erro ao gerar briefings:", error);
      toast({
        title: "Aviso",
        description: "Agenda aprovada, mas houve um erro ao gerar alguns briefings",
        variant: "destructive",
      });
    }
  }, [agendas, briefingGenerator, members, getMemberDataMap]);

  const rejectAgenda = useCallback((agendaId: string) => {
    setAgendas((prev) =>
      prev.map((a) =>
        a.id === agendaId ? { ...a, status: "rejected" as AgendaStatus } : a
      )
    );
    toast({
      title: "Agenda rejeitada",
      description: "A pauta foi rejeitada. Você pode gerar uma nova.",
    });
  }, []);

  const getAgendaById = useCallback(
    (id: string) => agendas.find((a) => a.id === id),
    [agendas]
  );

  return {
    agendas,
    pendingAgendas,
    approvedAgendas,
    isLoading,
    isGenerating,
    generateAgenda,
    approveAgenda,
    rejectAgenda,
    getAgendaById,
    // Expõe estado do gerador de briefings
    briefingGeneratorState: {
      isGenerating: briefingGenerator.isGenerating,
      progress: briefingGenerator.progress,
      currentMember: briefingGenerator.currentMember,
      generatedBriefings: briefingGenerator.generatedBriefings,
      totalMembers: members.length,
    },
  };
}

// --------------------------------------------------------------------------
// HOOK: useDynamicSWOT
// --------------------------------------------------------------------------

export function useDynamicSWOT() {
  const [swot, setSWOT] = useState<DynamicSWOT>(mockDynamicSWOT);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSWOT = useCallback(async (triggerSource: SWOTTriggerSource = "manual") => {
    setIsUpdating(true);
    
    // Simula delay de atualização
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSWOT((prev) => ({
      ...prev,
      generatedAt: new Date().toISOString(),
      triggerSource,
    }));
    
    setIsUpdating(false);
    
    toast({
      title: "SWOT atualizada",
      description: "Análise SWOT atualizada com dados mais recentes",
    });
  }, []);

  return {
    swot,
    isLoading,
    isUpdating,
    updateSWOT,
  };
}

// --------------------------------------------------------------------------
// HOOK: useMemberBriefing (agora busca briefings gerados)
// --------------------------------------------------------------------------

export function useMemberBriefing(memberId?: string, meetingId?: string) {
  const [briefing, setBriefing] = useState<MemberBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca briefing gerado ou usa mock
  useEffect(() => {
    if (!memberId || !meetingId) {
      setBriefing(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Busca briefings salvos localmente
    const storedBriefings = getStoredBriefings();
    const foundBriefing = storedBriefings.find(
      b => b.memberId === memberId && b.meetingId === meetingId
    );

    if (foundBriefing) {
      setBriefing(foundBriefing);
    } else {
      // Fallback para mock (desenvolvimento)
      setBriefing({
        ...mockMemberBriefing,
        memberId,
        meetingId,
      });
    }

    setIsLoading(false);
  }, [memberId, meetingId]);

  const markAsRead = useCallback(() => {
    setBriefing((prev) => {
      if (!prev) return null;
      
      const updated = {
        ...prev,
        readAt: new Date().toISOString(),
        preparationProgress: Math.min(prev.preparationProgress + 25, 100),
      };

      // Atualiza no localStorage
      const storedBriefings = getStoredBriefings();
      const index = storedBriefings.findIndex(b => b.id === prev.id);
      if (index !== -1) {
        storedBriefings[index] = updated;
        saveBriefings(storedBriefings);
      }

      return updated;
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setBriefing((prev) => {
      if (!prev) return null;
      
      const updated = { ...prev, preparationProgress: Math.min(progress, 100) };

      // Atualiza no localStorage
      const storedBriefings = getStoredBriefings();
      const index = storedBriefings.findIndex(b => b.id === prev.id);
      if (index !== -1) {
        storedBriefings[index] = updated;
        saveBriefings(storedBriefings);
      }

      return updated;
    });
  }, []);

  return {
    briefing,
    isLoading,
    markAsRead,
    updateProgress,
  };
}

// --------------------------------------------------------------------------
// HOOK: useAllMemberBriefings (para admin ver todos os briefings)
// --------------------------------------------------------------------------

export function useAllMemberBriefings(meetingId?: string) {
  const [briefings, setBriefings] = useState<MemberBriefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const storedBriefings = getStoredBriefings();
    
    if (meetingId) {
      setBriefings(storedBriefings.filter(b => b.meetingId === meetingId));
    } else {
      setBriefings(storedBriefings);
    }
    
    setIsLoading(false);
  }, [meetingId]);

  const refreshBriefings = useCallback(() => {
    const storedBriefings = getStoredBriefings();
    if (meetingId) {
      setBriefings(storedBriefings.filter(b => b.meetingId === meetingId));
    } else {
      setBriefings(storedBriefings);
    }
  }, [meetingId]);

  return {
    briefings,
    isLoading,
    refreshBriefings,
  };
}

// --------------------------------------------------------------------------
// HOOK: useAICopilotChat
// --------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function useAICopilotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simula delay de resposta da IA
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Respostas mockadas baseadas em palavras-chave
    let responseContent = "";
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes("risco") || lowerContent.includes("riscos")) {
      responseContent =
        "Com base na análise atual, os principais riscos identificados são: 1) Entrada de player global no mercado com potencial impacto de 30% nas margens, 2) Mudança regulatória BACEN com prazo de 60 dias, 3) Gap em transformação digital que pode afetar competitividade. Recomendo priorizar a discussão sobre posicionamento estratégico na próxima reunião.";
    } else if (lowerContent.includes("aquisição") || lowerContent.includes("xyz")) {
      responseContent =
        "A aquisição da Empresa XYZ apresenta valuation de R$ 250M (5x EBITDA), com sinergias estimadas de R$ 50M/ano. Os principais pontos de atenção são: 1) Integração cultural - empresa tem cultura de startup, 2) Alavancagem pós-deal de 2.5x EBITDA, 3) Due diligence ainda em andamento. Sugiro aprovar a continuidade da due diligence, reservando decisão final para próxima reunião.";
    } else if (lowerContent.includes("esg") || lowerContent.includes("sustentabilidade")) {
      responseContent =
        "O score ESG atual é B-, abaixo da média setorial de B+. Os principais gaps são: 1) Emissões de carbono 15% acima da meta, 2) Diversidade em cargos de liderança abaixo do benchmark, 3) Ausência de relatório GRI integrado. Recomendo aprovar o roadmap ESG 2026 com investimento de R$ 8M e meta de atingir rating A- em 24 meses.";
    } else if (lowerContent.includes("sucessão") || lowerContent.includes("ceo")) {
      responseContent =
        "O plano de sucessão do CEO está atrasado. Mandato atual expira em 18 meses e apenas 2 candidatos internos foram mapeados. Recomendo: 1) Aprovar cronograma formal do processo, 2) Contratar headhunter para mapeamento externo paralelo, 3) Definir perfil desejado com input do Conselho. O tema deve ser prioridade alta na próxima reunião.";
    } else {
      responseContent =
        "Entendi sua pergunta. Com base nos dados disponíveis da governança e contexto de mercado atual, posso fornecer análises detalhadas sobre riscos, oportunidades, ESG, sucessão e temas estratégicos. Qual aspecto específico você gostaria de explorar em maior profundidade?";
    }

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}

// --------------------------------------------------------------------------
// HOOK: useCopilotStats
// --------------------------------------------------------------------------

export function useCopilotStats() {
  const storedBriefings = getStoredBriefings();
  
  const stats = useMemo(
    () => ({
      totalAgendasGenerated: 12,
      agendasApproved: 10,
      approvalRate: 83,
      averageTopicsPerAgenda: 6.2,
      averagePreparationTime: 45, // minutos
      memberReadRate: 92, // %
      questionsAsked: 156,
      satisfactionScore: 4.6, // de 5
      totalBriefingsGenerated: storedBriefings.length,
      briefingsReadCount: storedBriefings.filter(b => b.readAt).length,
    }),
    [storedBriefings]
  );

  return { stats };
}
