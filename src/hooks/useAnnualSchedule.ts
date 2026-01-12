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
    ],
    'Comissão de Ética': [
      { name: 'Roberto Alves', role: 'Coordenador', email: 'roberto.alves@empresa.com' },
      { name: 'Beatriz Lima', role: 'Membro', email: 'beatriz.lima@empresa.com' },
      { name: 'Daniela Ferreira', role: 'Membro', email: 'daniela.ferreira@empresa.com' }
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

// Generate default annual schedule for 2026
const generateDefaultSchedule = (year: number): AgendaAnual => {
  const meetings: MeetingSchedule[] = [];

  // Generate 12 COUNCIL meetings (2nd Tuesday of each month at 14:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 2, 2); // Tuesday=2, 2nd occurrence
    // Reuniões dos meses 1, 4, 7, 10 têm pauta sugerida pela IA
    const hasAIPauta = [0, 3, 6, 9].includes(month); // janeiro, abril, julho, outubro (0-indexed)
    meetings.push({
      id: `conselho-${month + 1}`,
      council: "Conselho de Administração",
      council_id: "mock-council-admin-001",
      organ_type: "conselho",
      date: date.toISOString().split('T')[0],
      time: "14:00",
      type: "Ordinária",
      status: month < 3 ? "ATA Gerada" : month < 5 ? "Pauta Definida" : "Agendada",
      modalidade: "Presencial",
      location: "Sala Executiva - Matriz",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("conselho", "Conselho de Administração"),
      confirmed_participants: 0,
      notifications_sent: false,
      ai_generated_agenda: hasAIPauta,
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
      
      meeting.confirmed_participants = meeting.participants?.length || 0;
      console.log(`✅ Reunião ${meeting.id}: ${meeting.participants?.length || 0} participantes`);
      
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
          name: `Balanço_Q${Math.floor(month / 3) + 1}_2026.pdf`,
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
          ? "Reunião Ordinária do Conselho realizada em 14/jan/2026. Presentes todos os conselheiros. Aprovados resultados 2024: +18% receita, +12% EBITDA. Expansão LATAM aprovada (R$ 8M). Criado Comitê Especial Internacional."
          : month === 1
          ? "Reunião de 11/fev/2026. Aprovadas atualizações de governança: novo Código de Ética, Política Compliance, treinamento obrigatório março/2026."
          : "Reunião de 11/mar/2026. Aprovado Plano Sucessão C-Level: 12 sucessores identificados, programa 18 meses, mentoria conselheiros.",
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
      
      // Adicionar recording e minutes para reuniões realizadas
      meeting.recording = {
        type: "video",
        url: `#gravacao-conselho-${month + 1}-2026.mp4`,
        uploadedAt: new Date(year, month, date.getDate() + 1, 16, 30).toISOString()
      };
      
      meeting.minutes = {
        full: `ATA INTEGRAL DA ${month + 1}ª REUNIÃO ORDINÁRIA DO CONSELHO DE ADMINISTRAÇÃO\n\n` +
              `Data: ${date.toLocaleDateString('pt-BR')}\n` +
              `Horário: 14:00 às 16:30\n` +
              `Local: Sala Executiva - Matriz\n\n` +
              `PRESENTES:\n` +
              `- Carlos Alberto Silva (Presidente)\n` +
              `- Maria Santos Costa (Vice-Presidente)\n` +
              `- Roberto Oliveira (Conselheiro Independente)\n` +
              `- Ana Paula Ferreira (Conselheira)\n\n` +
              `ORDEM DO DIA:\n` +
              `1. Aprovação da Ata Anterior\n` +
              `2. Análise de Resultados Financeiros\n` +
              `3. ${meeting.agenda?.[2]?.title || 'Assuntos Gerais'}\n\n` +
              `DELIBERAÇÕES:\n` +
              (meeting.ata?.decisions || []).map((d: string, i: number) => `${i + 1}. ${d}`).join('\n') + '\n\n' +
              `OBSERVAÇÕES: Reunião conduzida sem ressalvas. Todos os itens foram deliberados conforme pauta.\n\n` +
              `São Paulo, ${date.toLocaleDateString('pt-BR')}\n` +
              `Carlos Alberto Silva - Presidente do Conselho`,
        summary: meeting.ata?.summary || '',
        generatedAt: meeting.ata?.generatedAt || new Date().toISOString()
      };
      
      meeting.notifications_sent = true;
    }

    // Enrich April meeting (month 3) with AI-suggested agenda - demonstration model
    if (month === 3) {
      const meeting = meetings[meetings.length - 1];
      
      // Pauta sugerida pela IA para demonstração
      meeting.agenda = [
        {
          id: `agenda-conselho-4-1`,
          title: "Aprovação da Ata da Reunião Anterior",
          description: "Revisão e aprovação da ata da reunião de março, com análise das deliberações e encaminhamentos realizados.",
          presenter: "Secretário Executivo",
          duration: 15,
          order: 1,
          type: "Deliberação",
          keyPoints: ["Leitura da ata", "Verificação de deliberações", "Votação para aprovação"],
          detailedScript: "O Secretário Executivo apresentará a ata da reunião anterior para revisão e votação.",
          expectedOutcome: "Ata aprovada por unanimidade"
        },
        {
          id: `agenda-conselho-4-2`,
          title: "Análise de Performance ESG do 1º Trimestre",
          description: "Apresentação dos indicadores ESG do primeiro trimestre, com destaque para ações de sustentabilidade e impacto social.",
          presenter: "Diretora de Sustentabilidade - Ana Costa",
          duration: 40,
          order: 2,
          type: "Informativo",
          keyPoints: ["Indicadores ambientais", "Impacto social", "Governança corporativa", "Metas ODS"],
          detailedScript: "A Diretora de Sustentabilidade apresentará o dashboard ESG com métricas comparativas e benchmarking setorial.",
          expectedOutcome: "Compreensão do status ESG e aprovação de novas iniciativas"
        },
        {
          id: `agenda-conselho-4-3`,
          title: "Estratégia de Transformação Digital 2026-2028",
          description: "Discussão do plano estratégico de transformação digital, incluindo investimentos em IA, automação e modernização de sistemas.",
          presenter: "CTO - Ricardo Mendes",
          duration: 50,
          order: 3,
          type: "Deliberação",
          keyPoints: ["Roadmap tecnológico", "Investimentos previstos", "Impacto operacional", "Riscos de implementação"],
          detailedScript: "O CTO apresentará o plano de transformação digital com cronograma de implementação e análise de ROI.",
          expectedOutcome: "Aprovação do plano e liberação de budget inicial"
        },
        {
          id: `agenda-conselho-4-4`,
          title: "Revisão de Riscos Corporativos e Matriz de Materialidade",
          description: "Análise da matriz de riscos atualizada com foco em riscos emergentes, cibersegurança e riscos climáticos.",
          presenter: "Chief Risk Officer - Paulo Ferreira",
          duration: 35,
          order: 4,
          type: "Deliberação",
          keyPoints: ["Riscos críticos", "Plano de mitigação", "Indicadores de risco", "Cenários adversos"],
          detailedScript: "O CRO apresentará a matriz de riscos atualizada com recomendações de tratamento para os riscos prioritários.",
          expectedOutcome: "Aprovação dos planos de mitigação propostos"
        },
        {
          id: `agenda-conselho-4-5`,
          title: "Aprovação de Novos Conselheiros Independentes",
          description: "Deliberação sobre a indicação de dois novos conselheiros independentes para composição do Conselho de Administração.",
          presenter: "Presidente do Conselho - Carlos Alberto",
          duration: 25,
          order: 5,
          type: "Deliberação",
          keyPoints: ["Perfil dos candidatos", "Due diligence", "Diversidade do board", "Aprovação formal"],
          detailedScript: "O Presidente apresentará os perfis dos candidatos e o parecer do Comitê de Nomeação.",
          expectedOutcome: "Eleição dos novos conselheiros"
        }
      ];
      
      meeting.confirmed_participants = meeting.participants?.length || 0;
      
      meeting.meeting_tasks = [
        {
          id: `task-conselho-4-1`,
          title: "Elaborar relatório de performance ESG detalhado",
          responsible: "Diretora de Sustentabilidade - Ana Costa",
          deadline: new Date(year, 4, 5).toISOString().split('T')[0],
          status: "Concluída"
        },
        {
          id: `task-conselho-4-2`,
          title: "Preparar apresentação do plano de transformação digital",
          responsible: "CTO - Ricardo Mendes",
          deadline: new Date(year, 4, 8).toISOString().split('T')[0],
          status: "Concluída"
        },
        {
          id: `task-conselho-4-3`,
          title: "Atualizar matriz de riscos corporativos",
          responsible: "Chief Risk Officer - Paulo Ferreira",
          deadline: new Date(year, 4, 10).toISOString().split('T')[0],
          status: "Concluída"
        }
      ];
      
      meeting.nextMeetingTopics = [
        "Status da implementação do plano de transformação digital",
        "Relatório de progresso das iniciativas ESG",
        "Avaliação de performance dos novos conselheiros",
        "Revisão do orçamento do segundo semestre"
      ];
      
      meeting.meeting_documents = [
        {
          id: `doc-conselho-4-1`,
          name: "Relatorio_ESG_Q1_2026.pdf",
          type: "application/pdf",
          uploadDate: new Date(year, 3, 5).toISOString(),
          url: "#"
        },
        {
          id: `doc-conselho-4-2`,
          name: "Plano_Transformacao_Digital_2026-2028.pptx",
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          uploadDate: new Date(year, 3, 6).toISOString(),
          url: "#"
        },
        {
          id: `doc-conselho-4-3`,
          name: "Matriz_Riscos_Abril_2026.xlsx",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          uploadDate: new Date(year, 3, 7).toISOString(),
          url: "#"
        },
        {
          id: `doc-conselho-4-4`,
          name: "Perfil_Candidatos_Conselheiros.pdf",
          type: "application/pdf",
          uploadDate: new Date(year, 3, 8).toISOString(),
          url: "#"
        }
      ];
      
      meeting.notifications_sent = true;
    }
  }

  // Generate 12 COMMITTEE meetings (3rd Thursday of each month at 10:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 4, 3); // Thursday=4, 3rd occurrence
    // Reuniões dos meses 2, 5, 8, 11 têm pauta sugerida pela IA
    const hasAIPauta = [1, 4, 7, 10].includes(month); // fevereiro, maio, agosto, novembro (0-indexed)
    meetings.push({
      id: `comite-${month + 1}`,
      council: "Comitê de Auditoria",
      council_id: "mock-committee-audit-004",
      organ_type: "comite",
      date: date.toISOString().split('T')[0],
      time: "10:00",
      type: "Ordinária",
      status: month < 3 ? "ATA Gerada" : month < 4 ? "Realizada" : "Agendada",
      modalidade: "Online",
      location: "Microsoft Teams",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("comite", "Comitê de Auditoria"),
      confirmed_participants: 0,
      notifications_sent: false,
      ai_generated_agenda: hasAIPauta,
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
      
      meeting.confirmed_participants = meeting.participants?.length || 0;
      console.log(`✅ Reunião ${meeting.id}: ${meeting.participants?.length || 0} participantes`);
      
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
          name: `Relatorio_Riscos_${month + 1}_2026.pdf`,
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 4).toISOString(),
          url: "#"
        }
      ];
      
      if (month < 3) {
        meeting.ata = {
          id: `ata-comite-${month + 1}`,
          summary: `Reunião Comitê Auditoria ${month + 1}/2026. Mapa riscos: ${8 + month} alta criticidade. Aprovado R$ ${300 + month * 50}k em controles.`,
          decisions: [
            "Aprovação mapa de riscos",
            `${3 + month} novos controles`,
            `Investimento R$ ${300 + month * 50}k`
          ],
          generatedAt: new Date(year, month, date.getDate() + 1).toISOString(),
          generatedBy: "Coordenadora"
        };
        
        // Adicionar recording e minutes para reuniões realizadas
        meeting.recording = {
          type: "audio",
          url: `#gravacao-comite-${month + 1}-2026.mp3`,
          uploadedAt: new Date(year, month, date.getDate() + 1, 12, 15).toISOString()
        };
        
        meeting.minutes = {
          full: `ATA DA ${month + 1}ª REUNIÃO DO COMITÊ DE AUDITORIA\n\n` +
                `Data: ${date.toLocaleDateString('pt-BR')}\n` +
                `Horário: 10:00 às 12:00\n` +
                `Local: Microsoft Teams (Online)\n\n` +
                `PRESENTES:\n` +
                `- Dr. Ricardo Mendes (Coordenador)\n` +
                `- Dra. Patrícia Lima (Membro)\n` +
                `- João Carlos Neves (Membro Independente)\n\n` +
                `PAUTA:\n` +
                `1. Análise de Controles Internos\n` +
                `2. Revisão de Riscos Identificados\n` +
                `3. Conformidade Regulatória\n\n` +
                `DECISÕES:\n` +
                meeting.ata.decisions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n') + '\n\n' +
                `OBSERVAÇÕES: Identificados ${8 + month} riscos de alta criticidade com plano de mitigação aprovado.\n\n` +
                `São Paulo, ${date.toLocaleDateString('pt-BR')}\n` +
                `Dr. Ricardo Mendes - Coordenador`,
          summary: meeting.ata.summary,
          generatedAt: meeting.ata.generatedAt
        };
      }
      
      meeting.notifications_sent = true;
    }
  }

  // Generate 12 COMMISSION meetings (last Friday of each month at 15:00)
  for (let month = 0; month < 12; month++) {
    const date = getLastWeekdayOfMonth(year, month, 5); // Friday=5
    // Reuniões dos meses 3, 6, 9, 12 têm pauta sugerida pela IA
    const hasAIPauta = [2, 5, 8, 11].includes(month); // março, junho, setembro, dezembro (0-indexed)
    meetings.push({
      id: `comissao-${month + 1}`,
      council: "Comissão de Ética",
      council_id: "mock-commission-ethics-007",
      organ_type: "comissao",
      date: date.toISOString().split('T')[0],
      time: "15:00",
      type: month % 3 === 0 ? "Extraordinária" : "Ordinária",
      status: month < 3 ? "ATA Gerada" : "Agendada",
      modalidade: "Híbrida",
      location: "Sala 201 / Zoom",
      agenda: [],
      nextMeetingTopics: [],
      participants: generateMockParticipants("comissao", "Comissão de Ética"),
      confirmed_participants: 0,
      notifications_sent: false,
      ai_generated_agenda: hasAIPauta,
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
      
      meeting.confirmed_participants = meeting.participants?.length || 0;
      console.log(`✅ Reunião ${meeting.id}: ${meeting.participants?.length || 0} participantes`);
      
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
          name: `Casos_${month + 1}_2026_CONFIDENCIAL.pdf`,
          type: "application/pdf",
          uploadDate: new Date(year, month, date.getDate() - 5).toISOString(),
          url: "#"
        }
      ];
      
      // Adicionar ata, recording e minutes para reuniões realizadas
      meeting.ata = {
        id: `ata-comissao-${month + 1}`,
        summary: `Reunião Comissão de Ética ${month + 1}/2026. Analisados ${4 + month} casos de conduta. ${Math.floor(Math.random() * 3)} casos arquivados, ${1 + Math.floor(Math.random() * 2)} em investigação. Recomendações de treinamento aprovadas.`,
        decisions: [
          `${4 + month} casos analisados`,
          "Arquivamento de casos resolvidos",
          "Recomendações de treinamento em ética"
        ],
        generatedAt: new Date(year, month, date.getDate() + 2).toISOString(),
        generatedBy: "Coordenador da Comissão"
      };
      
      meeting.recording = {
        type: "transcript",
        url: `#transcricao-comissao-${month + 1}-2026.txt`,
        uploadedAt: new Date(year, month, date.getDate() + 1, 17, 0).toISOString()
      };
      
      meeting.minutes = {
        full: `ATA CONFIDENCIAL DA ${month + 1}ª REUNIÃO DA COMISSÃO DE ÉTICA\n\n` +
              `Data: ${date.toLocaleDateString('pt-BR')}\n` +
              `Horário: 15:00 às 17:00\n` +
              `Local: Sala 201 / Zoom (Híbrido)\n\n` +
              `PRESENTES:\n` +
              `- Roberto Alves (Coordenador)\n` +
              `- Beatriz Lima (Membro)\n` +
              `- Daniela Ferreira (Membro)\n\n` +
              `CASOS ANALISADOS: ${4 + month}\n\n` +
              `DECISÕES:\n` +
              meeting.ata.decisions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n') + '\n\n' +
              `OBSERVAÇÕES: Casos tratados sob sigilo conforme política de privacidade. Campanhas de conscientização serão realizadas.\n\n` +
              `São Paulo, ${date.toLocaleDateString('pt-BR')}\n` +
              `Roberto Alves - Coordenador da Comissão de Ética`,
        summary: meeting.ata.summary,
        generatedAt: meeting.ata.generatedAt
      };
      
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

  const initializeDemoATAApprovals = () => {
    // Check if SPECIFIC demo data exists (not just any data)
    const existingApprovals = localStorage.getItem('ata_approvals');
    const existingStatusMap = localStorage.getItem('meeting_ata_status');
    
    let needsReinit = false;
    
    if (existingApprovals) {
      try {
        const parsed = JSON.parse(existingApprovals);
        // Check for a specific demo token to confirm demo data exists
        const hasDemoData = parsed.some((a: any) => a.magic_link_token === 'demo-ata-token-roberto');
        if (!hasDemoData) {
          console.log("⚠️ Existing approvals found but no demo tokens - will reinitialize...");
          needsReinit = true;
        }
      } catch (e) {
        console.log("⚠️ Invalid approvals data - will reinitialize...");
        needsReinit = true;
      }
    } else {
      needsReinit = true;
    }
    
    // Also check status map
    if (existingStatusMap) {
      try {
        const statusMap = JSON.parse(existingStatusMap);
        if (!statusMap['conselho-1'] || !statusMap['comite-1'] || !statusMap['comissao-1']) {
          console.log("⚠️ Incomplete status map - will reinitialize...");
          needsReinit = true;
        }
      } catch (e) {
        needsReinit = true;
      }
    } else {
      needsReinit = true;
    }
    
    if (!needsReinit) {
      console.log("✅ Demo ATA approvals data already exists");
      return;
    }
    
    console.log("🔄 Initializing demo ATA approvals data...");
    
    // Demo approval data for 3 meetings with ATA
    const demoApprovals = [
      // Conselho 1 - Em Aprovação (2/4 approved)
      {
        id: 'demo-approval-conselho-1-1',
        meeting_id: 'conselho-1',
        participant_id: 'mock-member-conselho-de-administração-1',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-16T10:30:00Z',
        signature_status: 'ASSINADO',
        signature_hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
        signature_ip: '192.168.1.100',
        signature_user_agent: 'Mozilla/5.0',
        signed_at: '2026-01-16T11:00:00Z',
        notification_sent_at: '2026-01-15T09:00:00Z',
        magic_link_token: 'demo-ata-token-carlos',
        created_at: '2026-01-15T09:00:00Z',
        updated_at: '2026-01-16T11:00:00Z',
        participant: {
          id: 'mock-member-conselho-de-administração-1',
          external_name: 'Carlos Alberto Silva',
          external_email: 'carlos.silva@empresa.com',
          role: 'Presidente'
        }
      },
      {
        id: 'demo-approval-conselho-1-2',
        meeting_id: 'conselho-1',
        participant_id: 'mock-member-conselho-de-administração-2',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-16T14:00:00Z',
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: '2026-01-15T09:00:00Z',
        magic_link_token: 'demo-ata-token-maria',
        created_at: '2026-01-15T09:00:00Z',
        updated_at: '2026-01-16T14:00:00Z',
        participant: {
          id: 'mock-member-conselho-de-administração-2',
          external_name: 'Maria Santos Costa',
          external_email: 'maria.costa@empresa.com',
          role: 'Vice-Presidente'
        }
      },
      {
        id: 'demo-approval-conselho-1-3',
        meeting_id: 'conselho-1',
        participant_id: 'mock-member-conselho-de-administração-3',
        approval_status: 'PENDENTE',
        approval_comment: null,
        approved_at: null,
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: '2026-01-15T09:00:00Z',
        magic_link_token: 'demo-ata-token-roberto',
        created_at: '2026-01-15T09:00:00Z',
        updated_at: '2026-01-15T09:00:00Z',
        participant: {
          id: 'mock-member-conselho-de-administração-3',
          external_name: 'Roberto Oliveira',
          external_email: 'roberto.oliveira@empresa.com',
          role: 'Conselheiro Independente'
        }
      },
      {
        id: 'demo-approval-conselho-1-4',
        meeting_id: 'conselho-1',
        participant_id: 'mock-member-conselho-de-administração-4',
        approval_status: 'PENDENTE',
        approval_comment: null,
        approved_at: null,
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: '2026-01-15T09:00:00Z',
        magic_link_token: 'demo-ata-token-ana',
        created_at: '2026-01-15T09:00:00Z',
        updated_at: '2026-01-15T09:00:00Z',
        participant: {
          id: 'mock-member-conselho-de-administração-4',
          external_name: 'Ana Paula Ferreira',
          external_email: 'ana.ferreira@empresa.com',
          role: 'Conselheira'
        }
      },
      
      // Comitê 1 - Aprovado, aguardando assinaturas (3/3 approved, 1/3 signed)
      {
        id: 'demo-approval-comite-1-1',
        meeting_id: 'comite-1',
        participant_id: 'mock-member-comitê-de-auditoria-1',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-18T10:00:00Z',
        signature_status: 'ASSINADO',
        signature_hash: 'b2c3d4e5f6a789012345678901234567890bcde',
        signature_ip: '192.168.1.101',
        signature_user_agent: 'Mozilla/5.0',
        signed_at: '2026-01-18T10:30:00Z',
        notification_sent_at: '2026-01-17T09:00:00Z',
        magic_link_token: 'demo-ata-token-ricardo',
        created_at: '2026-01-17T09:00:00Z',
        updated_at: '2026-01-18T10:30:00Z',
        participant: {
          id: 'mock-member-comitê-de-auditoria-1',
          external_name: 'Dr. Ricardo Mendes',
          external_email: 'ricardo.mendes@empresa.com',
          role: 'Coordenador'
        }
      },
      {
        id: 'demo-approval-comite-1-2',
        meeting_id: 'comite-1',
        participant_id: 'mock-member-comitê-de-auditoria-2',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-18T11:00:00Z',
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: '2026-01-17T09:00:00Z',
        magic_link_token: 'demo-ata-token-patricia',
        created_at: '2026-01-17T09:00:00Z',
        updated_at: '2026-01-18T11:00:00Z',
        participant: {
          id: 'mock-member-comitê-de-auditoria-2',
          external_name: 'Dra. Patrícia Lima',
          external_email: 'patricia.lima@empresa.com',
          role: 'Membro'
        }
      },
      {
        id: 'demo-approval-comite-1-3',
        meeting_id: 'comite-1',
        participant_id: 'mock-member-comitê-de-auditoria-3',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-18T14:00:00Z',
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: '2026-01-17T09:00:00Z',
        magic_link_token: 'demo-ata-token-joao',
        created_at: '2026-01-17T09:00:00Z',
        updated_at: '2026-01-18T14:00:00Z',
        participant: {
          id: 'mock-member-comitê-de-auditoria-3',
          external_name: 'João Carlos Neves',
          external_email: 'joao.neves@empresa.com',
          role: 'Membro Independente'
        }
      },
      
      // Comissão 1 - Finalizado (todos aprovaram e assinaram)
      {
        id: 'demo-approval-comissao-1-1',
        meeting_id: 'comissao-1',
        participant_id: 'mock-member-comissão-de-ética-1',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-25T16:00:00Z',
        signature_status: 'ASSINADO',
        signature_hash: 'c3d4e5f6a7b89012345678901234567890cdef',
        signature_ip: '192.168.1.102',
        signature_user_agent: 'Mozilla/5.0',
        signed_at: '2026-01-25T16:30:00Z',
        notification_sent_at: '2026-01-24T09:00:00Z',
        magic_link_token: 'demo-ata-token-roberto-alves',
        created_at: '2026-01-24T09:00:00Z',
        updated_at: '2026-01-25T16:30:00Z',
        participant: {
          id: 'mock-member-comissão-de-ética-1',
          external_name: 'Roberto Alves',
          external_email: 'roberto.alves@empresa.com',
          role: 'Coordenador'
        }
      },
      {
        id: 'demo-approval-comissao-1-2',
        meeting_id: 'comissao-1',
        participant_id: 'mock-member-comissão-de-ética-2',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-25T17:00:00Z',
        signature_status: 'ASSINADO',
        signature_hash: 'd4e5f6a7b8c9012345678901234567890defg',
        signature_ip: '192.168.1.103',
        signature_user_agent: 'Mozilla/5.0',
        signed_at: '2026-01-25T17:30:00Z',
        notification_sent_at: '2026-01-24T09:00:00Z',
        magic_link_token: 'demo-ata-token-beatriz',
        created_at: '2026-01-24T09:00:00Z',
        updated_at: '2026-01-25T17:30:00Z',
        participant: {
          id: 'mock-member-comissão-de-ética-2',
          external_name: 'Beatriz Lima',
          external_email: 'beatriz.lima@empresa.com',
          role: 'Membro'
        }
      },
      {
        id: 'demo-approval-comissao-1-3',
        meeting_id: 'comissao-1',
        participant_id: 'mock-member-comissão-de-ética-3',
        approval_status: 'APROVADO',
        approval_comment: null,
        approved_at: '2026-01-25T18:00:00Z',
        signature_status: 'ASSINADO',
        signature_hash: 'e5f6a7b8c9d0123456789012345678901efgh',
        signature_ip: '192.168.1.104',
        signature_user_agent: 'Mozilla/5.0',
        signed_at: '2026-01-25T18:30:00Z',
        notification_sent_at: '2026-01-24T09:00:00Z',
        magic_link_token: 'demo-ata-token-daniela',
        created_at: '2026-01-24T09:00:00Z',
        updated_at: '2026-01-25T18:30:00Z',
        participant: {
          id: 'mock-member-comissão-de-ética-3',
          external_name: 'Daniela Ferreira',
          external_email: 'daniela.ferreira@empresa.com',
          role: 'Membro'
        }
      }
    ];
    
    // Save demo approvals to localStorage
    localStorage.setItem('ata_approvals', JSON.stringify(demoApprovals));
    
    // Save ATA status map
    const ataStatusMap = {
      'conselho-1': 'EM_APROVACAO',
      'comite-1': 'APROVADO',
      'comissao-1': 'ASSINADO'
    };
    localStorage.setItem('meeting_ata_status', JSON.stringify(ataStatusMap));
    
    console.log("✅ Demo ATA approvals initialized");
  };

  const loadSchedule = () => {
    console.log("🔄 Loading annual schedule...");
    
    // Initialize demo ATA approvals
    initializeDemoATAApprovals();
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("📁 Stored data:", stored ? "Found" : "Not found");
      
      // Force regeneration if stored data is outdated or incomplete
      if (stored) {
        const parsedSchedule = JSON.parse(stored);
        
        // Check if we have the full 36 meetings with enriched data and valid participants
        const hasInvalidMeetings = parsedSchedule.meetings?.some(
          (m: MeetingSchedule) => !m.participants || m.participants.length === 0
        );
        
        if (parsedSchedule.meetings?.length !== 36 || 
            parsedSchedule.year !== 2026 ||
            !parsedSchedule.meetings[0]?.agenda?.length ||
            hasInvalidMeetings) {
          console.log("⚠️ Outdated schedule detected (missing participants or incomplete data), regenerating...");
          localStorage.removeItem(STORAGE_KEY);
          const defaultSchedule = generateDefaultSchedule(2026);
          setSchedule(defaultSchedule);
          saveSchedule(defaultSchedule);
          return;
        }
        
        console.log("✅ Loaded schedule:", parsedSchedule);
        setSchedule(parsedSchedule);
      } else {
        // Create default schedule for 2026
        const defaultSchedule = generateDefaultSchedule(2026);
        console.log("🆕 Created default schedule with", defaultSchedule.meetings.length, "meetings");
        setSchedule(defaultSchedule);
        saveSchedule(defaultSchedule);
      }
    } catch (error) {
      console.error("❌ Error loading annual schedule:", error);
      const defaultSchedule = generateDefaultSchedule(2026);
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