// ============================================================================
// HOOKS MOCKADOS PARA O COPILOTO IA-FIRST
// ============================================================================

import { useState, useCallback, useMemo } from "react";
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
  mockAIInteractions,
} from "@/data/mockCopilotData";

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
// HOOK: useGeneratedAgendas
// --------------------------------------------------------------------------

export function useGeneratedAgendas() {
  const [agendas, setAgendas] = useState<GeneratedAgenda[]>(mockGeneratedAgendas);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const approveAgenda = useCallback((agendaId: string) => {
    setAgendas((prev) =>
      prev.map((a) =>
        a.id === agendaId
          ? { ...a, status: "approved" as AgendaStatus, approvedAt: new Date().toISOString() }
          : a
      )
    );
    toast({
      title: "Agenda aprovada",
      description: "A pauta foi aprovada e está disponível para os membros",
    });
  }, []);

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
// HOOK: useMemberBriefing
// --------------------------------------------------------------------------

export function useMemberBriefing(memberId?: string, meetingId?: string) {
  const [briefing, setBriefing] = useState<MemberBriefing | null>(
    memberId && meetingId ? mockMemberBriefing : null
  );
  const [isLoading] = useState(false);

  const markAsRead = useCallback(() => {
    setBriefing((prev) =>
      prev
        ? {
            ...prev,
            readAt: new Date().toISOString(),
            preparationProgress: Math.min(prev.preparationProgress + 25, 100),
          }
        : null
    );
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setBriefing((prev) =>
      prev ? { ...prev, preparationProgress: Math.min(progress, 100) } : null
    );
  }, []);

  return {
    briefing,
    isLoading,
    markAsRead,
    updateProgress,
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
    }),
    []
  );

  return { stats };
}




