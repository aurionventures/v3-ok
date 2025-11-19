import { useState, useEffect } from "react";
import { AgendaAnual, MeetingSchedule } from "@/types/annualSchedule";

const STORAGE_KEY = "annual_council_schedule";

// Default settings for annual schedule
const defaultSettings = {
  ordinaryMeetingsPerYear: 4,
  defaultDuration: 120, // 2 hours
  reminderDays: 30,
};

// Helper function to generate mock participants for meetings
const generateMockParticipants = (organType: string, councilName: string) => {
  const membersByOrgan: Record<string, Array<{name: string, role: string, email: string}>> = {
    'Conselho de Administração': [
      { name: 'Carlos Alberto Silva', role: 'Presidente', email: 'carlos.silva@empresa.com' },
      { name: 'Maria Santos Costa', role: 'Vice-Presidente', email: 'maria.costa@empresa.com' },
      { name: 'Roberto Oliveira', role: 'Conselheiro Independente', email: 'roberto.oliveira@empresa.com' },
      { name: 'Ana Paula Ferreira', role: 'Conselheira', email: 'ana.ferreira@empresa.com' }
    ],
    'Conselho Fiscal': [
      { name: 'Fernando Rodrigues', role: 'Presidente', email: 'fernando.rodrigues@empresa.com' },
      { name: 'Juliana Almeida', role: 'Conselheira Fiscal', email: 'juliana.almeida@empresa.com' },
      { name: 'Pedro Henrique Santos', role: 'Conselheiro Fiscal', email: 'pedro.santos@empresa.com' }
    ],
    'Comitê de Auditoria': [
      { name: 'Dr. Ricardo Mendes', role: 'Coordenador', email: 'ricardo.mendes@empresa.com' },
      { name: 'Dra. Patrícia Lima', role: 'Membro', email: 'patricia.lima@empresa.com' },
      { name: 'João Carlos Neves', role: 'Membro Independente', email: 'joao.neves@empresa.com' }
    ]
  };

  const membersData = membersByOrgan[councilName] || membersByOrgan['Conselho de Administração'];
  
  return membersData.map((member, index) => ({
    id: `mock-member-${councilName.replace(/\s/g, '-').toLowerCase()}-${index + 1}`,
    name: member.name,
    email: member.email,
    phone: member.email.includes('carlos') ? '(11) 98765-4321' : undefined,
    role: 'MEMBRO' as const,
    confirmed: false,
    can_upload: true,
    can_view_materials: true,
    can_comment: true,
  }));
};

// Helper functions for date calculations
const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, nth: number): Date => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = offset + (nth - 1) * 7 + 1;
  return new Date(year, month, day);
};

const getLastWeekdayOfMonth = (year: number, month: number, weekday: number): Date => {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const offset = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - offset);
};

// Generate default annual schedule for 2025
const generateDefaultSchedule = (year: number): AgendaAnual => {
  const meetings: MeetingSchedule[] = [];

  // Generate 12 COUNCIL meetings (2nd Tuesday of each month at 14:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 2, 2); // Tuesday=2, 2nd occurrence
    meetings.push({
      id: `conselho-${month + 1}`,
      council: "Conselho de Administração",
      council_id: "mock-council-admin-001",
      organ_type: "conselho",
      date: date.toISOString().split('T')[0],
      time: "14:00",
      type: "Ordinária",
      status: month < 3 ? "Realizada" : month < 5 ? "Pauta Definida" : "Agendada",
      modalidade: "Presencial",
      location: "Sala Executiva - Matriz",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("conselho", "Conselho de Administração"),
      confirmed_participants: 0,
      notifications_sent: false,
    });

    // Enrich first 3 council meetings with complete data
    if (month < 3) {
      const meeting = meetings[meetings.length - 1];
      
      meeting.agenda = [
        {
          id: `agenda-conselho-${month + 1}-1`,
          title: "Aprovação da Ata Anterior",
          description: "Revisão e aprovação da ata da reunião do mês anterior com ajustes sugeridos",
          presenter: "Secretário Executivo",
          duration: 15,
          order: 1,
          type: "Deliberação",
          keyPoints: ["Leitura da ata", "Discussão de ajustes", "Votação"],
          detailedScript: "O Secretário Executivo fará a leitura da ata anterior, seguida de discussão sobre possíveis ajustes e votação para aprovação final.",
          expectedOutcome: "Ata aprovada por unanimidade"
        },
        {
          id: `agenda-conselho-${month + 1}-2`,
          title: `Análise de Resultados Financeiros Q${Math.floor(month / 3) + 1}`,
          description: "Apresentação detalhada do balanço trimestral, análise de variações e projeções",
          presenter: "CFO - Maria Santos",
          duration: 45,
          order: 2,
          type: "Informativo",
          keyPoints: ["Receita e despesas", "EBITDA", "Fluxo de caixa", "Investimentos"],
          detailedScript: "A CFO apresentará os resultados financeiros do trimestre com análise comparativa, destacando principais variações e tendências.",
          expectedOutcome: "Compreensão dos resultados e direcionamento estratégico"
        },
        {
          id: `agenda-conselho-${month + 1}-3`,
          title: month === 0 ? "Estratégia de Expansão Internacional" : month === 1 ? "Revisão de Políticas de Governança" : "Planejamento de Sucessão Executiva",
          description: month === 0 ? "Discussão sobre entrada em novos mercados da América Latina" : month === 1 ? "Atualização das políticas de compliance e ética corporativa" : "Definição do plano de sucessão para posições-chave da alta gestão",
          presenter: "CEO - João Silva",
          duration: 60,
          order: 3,
          type: "Deliberação",
          keyPoints: month === 0 ? ["Análise de mercados", "Investimento necessário", "Cronograma", "Riscos"] : month === 1 ? ["Compliance regulatório", "Código de ética", "Estrutura de governança"] : ["Mapeamento de talentos", "Plano de desenvolvimento", "Cronograma de transição"],
          detailedScript: month === 0 ? "O CEO apresentará estudo de viabilidade para expansão internacional." : month === 1 ? "Revisão completa das políticas de governança." : "Apresentação do plano de sucessão para CEO, CFO e COO.",
          expectedOutcome: month === 0 ? "Aprovação do plano de expansão" : month === 1 ? "Aprovação das novas políticas" : "Aprovação do plano de sucessão"
        }
      ];
      
      meeting.participants = [
        {
          id: `p-conselho-${month + 1}-1`,
          user_id: "user-001",
          external_name: "João Silva",
          external_email: "joao.silva@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        },
        {
          id: `p-conselho-${month + 1}-2`,
          user_id: "user-002",
          external_name: "Maria Santos",
          external_email: "maria.santos@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        },
        {
          id: `p-conselho-${month + 1}-3`,
          user_id: "user-003",
          external_name: "Pedro Costa",
          external_email: "pedro.costa@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        }
      ];
      
      meeting.confirmed_participants = 3;
      
      meeting.meeting_tasks = [
        {
          id: `task-conselho-${month + 1}-1`,
          title: month === 0 ? "Preparar relatório de viabilidade mercado chileno" : month === 1 ? "Revisar Código de Ética" : "Mapear sucessores C-Level",
          responsible: month === 0 ? "Diretor de Estratégia" : month === 1 ? "Compliance Officer" : "CHRO",
          deadline: new Date(year, month + 1, 15).toISOString().split('T')[0],
          status: "Concluída"
        },
        {
          id: `task-conselho-${month + 1}-2`,
          title: "Consolidar análise de riscos do projeto",
          responsible: "CFO - Maria Santos",
          deadline: new Date(year, month + 1, 20).toISOString().split('T')[0],
          status: month < 2 ? "Concluída" : "Em Andamento"
        }
      ];
      
      meeting.nextMeetingTopics = month === 0 ? [
        "Aprovação do budget de expansão",
        "Nomeação de diretor LATAM",
        "Estrutura societária subsidiária"
      ] : month === 1 ? [
        "Implementação novas políticas",
        "Treinamento compliance",
        "Planejamento auditoria externa"
      ] : [
        "Aprovação planos de desenvolvimento",
        "Definição de KPIs sucessores",
        "Revisão remuneração variável"
      ];
      
      meeting.meeting_documents = [
        {
          id: `doc-conselho-${month + 1}-1`,
          name: `Balanço_Q${Math.floor(month / 3) + 1}_2025.pdf`,
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 5).toISOString(),
          url: "#"
        },
        {
          id: `doc-conselho-${month + 1}-2`,
          name: month === 0 ? "Estudo_Expansao_LATAM.pptx" : month === 1 ? "Politicas_Governanca.docx" : "Plano_Sucessao.pdf",
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 3).toISOString(),
          url: "#"
        }
      ];
      
      meeting.ata = {
        id: `ata-conselho-${month + 1}`,
        summary: month === 0 
          ? "Reunião Ordinária do Conselho realizada em 14/jan/2025. Presentes todos os conselheiros. Aprovados resultados 2024: +18% receita, +12% EBITDA. Expansão LATAM aprovada (R$ 8M). Criado Comitê Especial Internacional."
          : month === 1
          ? "Reunião de 11/fev/2025. Aprovadas atualizações de governança: novo Código de Ética, Política Compliance, treinamento obrigatório março/2025."
          : "Reunião de 11/mar/2025. Aprovado Plano Sucessão C-Level: 12 sucessores identificados, programa 18 meses, mentoria conselheiros.",
        decisions: month === 0 ? [
          "Aprovação balanço 2024",
          "Investimento R$ 8M expansão LATAM",
          "Criação Comitê Especial Internacional"
        ] : month === 1 ? [
          "Aprovação novo Código de Ética",
          "Atualização Política Compliance",
          "Treinamento obrigatório"
        ] : [
          "Aprovação Plano Sucessão",
          "12 sucessores identificados",
          "Programa mentoria"
        ],
        generatedAt: new Date(year, month, date.getDate() + 2).toISOString(),
        generatedBy: "Secretário Executivo"
      };
      
      meeting.notifications_sent = true;
    }
  }

  // Generate 12 COMMITTEE meetings (3rd Thursday of each month at 10:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 4, 3); // Thursday=4, 3rd occurrence
    meetings.push({
      id: `comite-${month + 1}`,
      council: "Comitê de Auditoria",
      council_id: "mock-committee-audit-004",
      organ_type: "comite",
      date: date.toISOString().split('T')[0],
      time: "10:00",
      type: "Ordinária",
      status: month < 2 ? "ATA Gerada" : month < 4 ? "Realizada" : "Agendada",
      modalidade: "Online",
      location: "Microsoft Teams",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("comite", "Comitê de Auditoria"),
      confirmed_participants: 0,
      notifications_sent: false,
    });

    // Enrich first 4 committee meetings
    if (month < 4) {
      const meeting = meetings[meetings.length - 1];
      
      meeting.agenda = [
        {
          id: `agenda-comite-${month + 1}-1`,
          title: "Análise de Riscos Operacionais",
          description: "Revisão do mapa de riscos corporativos e controles internos",
          presenter: "Auditor Interno - Carlos Ferreira",
          duration: 40,
          order: 1,
          type: "Informativo",
          keyPoints: ["Riscos identificados", "Controles", "Gaps", "Plano ação"],
          detailedScript: "Apresentação da matriz de riscos atualizada.",
          expectedOutcome: "Identificação de gaps e plano de mitigação"
        },
        {
          id: `agenda-comite-${month + 1}-2`,
          title: month % 2 === 0 ? "Conformidade Regulatória" : "Auditoria de Processos",
          description: month % 2 === 0 ? "Status SOX, LGPD e regulações setoriais" : "Resultados auditoria processos internos",
          presenter: "Compliance - Beatriz Lima",
          duration: 50,
          order: 2,
          type: "Deliberação",
          keyPoints: ["Aderência", "Não conformidades", "Ações corretivas"],
          detailedScript: "Análise detalhada de conformidade.",
          expectedOutcome: "Plano de adequação aprovado"
        }
      ];
      
      meeting.participants = [
        {
          id: `p-comite-${month + 1}-1`,
          user_id: "user-004",
          external_name: "Ana Paula Oliveira",
          external_email: "ana.oliveira@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        },
        {
          id: `p-comite-${month + 1}-2`,
          user_id: "user-005",
          external_name: "Carlos Ferreira",
          external_email: "carlos.ferreira@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        }
      ];
      
      meeting.confirmed_participants = 2;
      
      meeting.meeting_tasks = [
        {
          id: `task-comite-${month + 1}-1`,
          title: "Atualizar matriz de riscos",
          responsible: "Carlos Ferreira",
          deadline: new Date(year, month + 1, 10).toISOString().split('T')[0],
          status: month < 2 ? "Concluída" : "Em Andamento"
        }
      ];
      
      meeting.nextMeetingTopics = [
        "Investimentos em controles",
        "Revisão segurança da informação"
      ];
      
      meeting.meeting_documents = [
        {
          id: `doc-comite-${month + 1}-1`,
          name: `Relatorio_Riscos_${month + 1}_2025.pdf`,
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 4).toISOString(),
          url: "#"
        }
      ];
      
      if (month < 2) {
        meeting.ata = {
          id: `ata-comite-${month + 1}`,
          summary: `Reunião Comitê Auditoria ${month + 1}/2025. Mapa riscos: 8 alta criticidade. Aprovado R$ 300k em controles.`,
          decisions: [
            "Aprovação mapa de riscos",
            "3 novos controles",
            "Investimento R$ 300k"
          ],
          generatedAt: new Date(year, month, date.getDate() + 1).toISOString(),
          generatedBy: "Coordenadora"
        };
      }
      
      meeting.notifications_sent = true;
    }
  }

  // Generate 12 COMMISSION meetings (last Friday of each month at 15:00)
  for (let month = 0; month < 12; month++) {
    const date = getLastWeekdayOfMonth(year, month, 5); // Friday=5
    meetings.push({
      id: `comissao-${month + 1}`,
      council: "Comissão de Ética",
      council_id: "mock-commission-ethics-007",
      organ_type: "comissao",
      date: date.toISOString().split('T')[0],
      time: "15:00",
      type: month % 3 === 0 ? "Extraordinária" : "Ordinária",
      status: month < 3 ? "Docs Enviados" : "Agendada",
      modalidade: "Híbrida",
      location: "Sala 201 / Zoom",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("comissao", "Comissão de Ética"),
      confirmed_participants: 0,
      notifications_sent: false,
    });

    // Enrich first 3 commission meetings
    if (month < 3) {
      const meeting = meetings[meetings.length - 1];
      
      meeting.agenda = [
        {
          id: `agenda-comissao-${month + 1}-1`,
          title: "Análise de Casos de Conduta",
          description: `Revisão de ${3 + month} casos reportados`,
          presenter: "Roberto Alves",
          duration: 45,
          order: 1,
          type: "Deliberação",
          keyPoints: ["Casos reportados", "Análise gravidade", "Decisões"],
          detailedScript: "Apresentação casos com recomendações.",
          expectedOutcome: "Deliberação ações disciplinares"
        }
      ];
      
      meeting.participants = [
        {
          id: `p-comissao-${month + 1}-1`,
          user_id: "user-007",
          external_name: "Beatriz Lima",
          external_email: "beatriz.lima@empresa.com",
          role: "MEMBRO",
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: true
        }
      ];
      
      meeting.confirmed_participants = 1;
      
      meeting.meeting_tasks = [
        {
          id: `task-comissao-${month + 1}-1`,
          title: `Investigar ${2 + month} casos pendentes`,
          responsible: "Roberto Alves",
          deadline: new Date(year, month + 1, 15).toISOString().split('T')[0],
          status: "Em Andamento"
        }
      ];
      
      meeting.nextMeetingTopics = [
        "Resultados investigações",
        "Campanhas conscientização"
      ];
      
      meeting.meeting_documents = [
        {
          id: `doc-comissao-${month + 1}-1`,
          name: `Casos_${month + 1}_2025_CONFIDENCIAL.pdf`,
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 5).toISOString(),
          url: "#"
        }
      ];
      
      meeting.notifications_sent = true;
    }
  }

  return {
    year,
    meetings: meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    settings: defaultSettings,
  };
};

export const useAnnualSchedule = () => {
  const [schedule, setSchedule] = useState<AgendaAnual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    console.log("🔄 Loading annual schedule...");
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("📁 Stored data:", stored ? "Found" : "Not found");
      
      // Force regeneration if stored data is outdated or incomplete
      if (stored) {
        const parsedSchedule = JSON.parse(stored);
        
        // Check if we have the full 36 meetings with enriched data
        if (parsedSchedule.meetings?.length !== 36 || 
            parsedSchedule.year !== 2025 ||
            !parsedSchedule.meetings[0]?.agenda?.length) {
          console.log("⚠️ Outdated schedule detected, regenerating...");
          localStorage.removeItem(STORAGE_KEY);
          const defaultSchedule = generateDefaultSchedule(2025);
          setSchedule(defaultSchedule);
          saveSchedule(defaultSchedule);
          return;
        }
        
        console.log("✅ Loaded schedule:", parsedSchedule);
        setSchedule(parsedSchedule);
      } else {
        // Create default schedule for 2025
        const defaultSchedule = generateDefaultSchedule(2025);
        console.log("🆕 Created default schedule with", defaultSchedule.meetings.length, "meetings");
        setSchedule(defaultSchedule);
        saveSchedule(defaultSchedule);
      }
    } catch (error) {
      console.error("❌ Error loading annual schedule:", error);
      const defaultSchedule = generateDefaultSchedule(2025);
      setSchedule(defaultSchedule);
    } finally {
      setLoading(false);
      console.log("✅ Annual schedule loading completed");
    }
  };

  const saveSchedule = (newSchedule: AgendaAnual) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
      setSchedule(newSchedule);
    } catch (error) {
      console.error("Error saving annual schedule:", error);
    }
  };

  const updateMeeting = (meetingId: string, updates: Partial<MeetingSchedule>) => {
    if (!schedule) return;

    const updatedMeetings = schedule.meetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, ...updates } : meeting
    );

    const updatedSchedule = {
      ...schedule,
      meetings: updatedMeetings,
    };

    saveSchedule(updatedSchedule);
  };

  const addMeeting = (meeting: Omit<MeetingSchedule, 'id'>) => {
    if (!schedule) return;

    const newMeeting: MeetingSchedule = {
      ...meeting,
      id: Date.now().toString(),
    };

    const updatedSchedule = {
      ...schedule,
      meetings: [...schedule.meetings, newMeeting],
    };

    saveSchedule(updatedSchedule);
  };

  const deleteMeeting = (meetingId: string) => {
    if (!schedule) return;

    const updatedMeetings = schedule.meetings.filter(meeting => meeting.id !== meetingId);
    const updatedSchedule = {
      ...schedule,
      meetings: updatedMeetings,
    };

    saveSchedule(updatedSchedule);
  };

  const getNextMeeting = () => {
    if (!schedule) return null;

    const now = new Date();
    const upcomingMeetings = schedule.meetings
      .filter(meeting => new Date(meeting.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;
  };

  const getMeetingsByStatus = (status: MeetingSchedule['status']) => {
    if (!schedule) return [];
    return schedule.meetings.filter(meeting => meeting.status === status);
  };

  const getAgendaProgress = () => {
    if (!schedule) return { defined: 0, total: 0, percentage: 0 };

    const total = schedule.meetings.length;
    const defined = schedule.meetings.filter(meeting => 
      meeting.status !== "Agendada" || (meeting.agenda && meeting.agenda.length > 0)
    ).length;

    return {
      defined,
      total,
      percentage: total > 0 ? Math.round((defined / total) * 100) : 0,
    };
  };

  const getATAProgress = () => {
    if (!schedule) return { generated: 0, total: 0, percentage: 0 };

    const total = schedule.meetings.filter(meeting => meeting.status === "Realizada" || meeting.status === "ATA Gerada").length;
    const generated = schedule.meetings.filter(meeting => meeting.status === "ATA Gerada").length;

    return {
      generated,
      total,
      percentage: total > 0 ? Math.round((generated / total) * 100) : 0,
    };
  };

  const getPendingTasks = () => {
    if (!schedule) return [];

    const allTasks = schedule.meetings.flatMap(meeting => meeting.tasks || []);
    return allTasks.filter(task => task.status !== "Concluída");
  };

  const addMultipleMeetings = (meetings: Omit<MeetingSchedule, 'id' | 'status' | 'agenda' | 'nextMeetingTopics'>[]) => {
    if (!schedule) return;
    
    const newMeetings: MeetingSchedule[] = meetings.map((meeting, index) => ({
      id: `${Date.now()}-${index}`,
      ...meeting,
      status: "Agendada",
      agenda: [],
      nextMeetingTopics: []
    }));
    
    const updatedSchedule = {
      ...schedule,
      meetings: [...schedule.meetings, ...newMeetings].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    };
    
    saveSchedule(updatedSchedule);
  };

  return {
    schedule,
    loading,
    updateMeeting,
    addMeeting,
    addMultipleMeetings,
    deleteMeeting,
    getNextMeeting,
    getMeetingsByStatus,
    getAgendaProgress,
    getATAProgress,
    getPendingTasks,
    saveSchedule,
  };
};