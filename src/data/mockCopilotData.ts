// ============================================================================
// DADOS MOCKADOS PARA DEMONSTRAÇÃO DO COPILOTO IA-FIRST
// ============================================================================

import type {
  GeneratedAgenda,
  MemberBriefing,
  DynamicSWOT,
  UpcomingMeeting,
  AIInteraction,
} from "@/types/copilot";

// --------------------------------------------------------------------------
// REUNIÕES PRÓXIMAS
// --------------------------------------------------------------------------

export const mockUpcomingMeetings: UpcomingMeeting[] = [
  {
    id: "meeting-1",
    title: "Reunião Ordinária do Conselho de Administração",
    date: "2026-01-20",
    time: "14:00",
    councilName: "Conselho de Administração",
    councilId: "council-1",
    type: "ordinary",
    location: "Sala de Reuniões - Sede",
    modalidade: "hibrido",
    hasGeneratedAgenda: true,
    agendaId: "agenda-1",
  },
  {
    id: "meeting-2",
    title: "Reunião Extraordinária - Análise M&A",
    date: "2026-01-28",
    time: "10:00",
    councilName: "Conselho de Administração",
    councilId: "council-1",
    type: "extraordinary",
    location: "Virtual",
    modalidade: "virtual",
    hasGeneratedAgenda: false,
  },
  {
    id: "meeting-3",
    title: "Reunião do Conselho Fiscal",
    date: "2026-02-05",
    time: "09:00",
    councilName: "Conselho Fiscal",
    councilId: "council-2",
    type: "ordinary",
    modalidade: "presencial",
    hasGeneratedAgenda: false,
  },
];

// --------------------------------------------------------------------------
// AGENDAS GERADAS POR IA
// --------------------------------------------------------------------------

export const mockGeneratedAgendas: GeneratedAgenda[] = [
  {
    id: "agenda-1",
    companyId: "company-1",
    meetingDate: "2026-01-20",
    meetingId: "meeting-1",
    status: "pending",
    generatedAt: "2026-01-09T14:30:00Z",
    topics: [
      {
        id: "topic-1",
        title: "Revisão do Plano Estratégico 2026-2028",
        category: "strategic",
        priority: "critical",
        estimatedDuration: 45,
        rationale: "Janela de planejamento fecha em 30 dias. Concorrentes já divulgaram estratégias agressivas.",
        relatedData: {
          risks: ["Perda de market share", "Desalinhamento com mercado"],
          opportunities: ["Expansão para novos mercados", "Aquisição estratégica"],
          externalFactors: ["Alta do dólar", "Mudança regulatória setor"],
          internalTriggers: ["Meta de crescimento 25%", "Novo produto Q2"],
        },
        suggestedActions: [
          "Aprovar revisão do plano estratégico trienal",
          "Definir KPIs de acompanhamento trimestral",
          "Autorizar contratação de consultoria estratégica",
        ],
        preparationMaterials: [
          "Análise de cenários macroeconômicos",
          "Benchmark concorrência 2025",
          "Projeções financeiras 2026-2028",
        ],
        status: "suggested",
        displayOrder: 1,
      },
      {
        id: "topic-2",
        title: "Plano de Sucessão do CEO",
        category: "governance",
        priority: "critical",
        estimatedDuration: 30,
        rationale: "CEO atual com mandato expirando em 18 meses. Nenhum sucessor formalmente identificado.",
        relatedData: {
          risks: ["Vácuo de liderança", "Perda de conhecimento crítico"],
          opportunities: ["Renovação da gestão", "Atração de talentos"],
          externalFactors: ["Mercado de executivos aquecido"],
          internalTriggers: ["Avaliação de desempenho Q4", "Pipeline de liderança"],
        },
        suggestedActions: [
          "Aprovar cronograma do processo sucessório",
          "Definir perfil desejado para novo CEO",
          "Autorizar hunting externo paralelo",
        ],
        preparationMaterials: [
          "Mapeamento de candidatos internos",
          "Análise de gaps de competências",
          "Benchmark de mercado de executivos",
        ],
        status: "suggested",
        displayOrder: 2,
      },
      {
        id: "topic-3",
        title: "Gestão de Riscos Cibernéticos",
        category: "risk",
        priority: "high",
        estimatedDuration: 25,
        rationale: "3 incidentes de segurança no último trimestre. Novo regulamento LGPD entra em vigor.",
        relatedData: {
          risks: ["Vazamento de dados", "Multas regulatórias", "Dano reputacional"],
          opportunities: ["Certificação ISO 27001"],
          externalFactors: ["Aumento de ataques ransomware", "Nova lei de dados"],
          internalTriggers: ["Auditoria interna identificou gaps"],
        },
        suggestedActions: [
          "Aprovar investimento em segurança cibernética",
          "Criar comitê de resposta a incidentes",
        ],
        preparationMaterials: [
          "Relatório de incidentes Q4",
          "Proposta de investimento TI",
          "Gap analysis LGPD",
        ],
        status: "suggested",
        displayOrder: 3,
      },
      {
        id: "topic-4",
        title: "Oportunidade de Aquisição - Empresa XYZ",
        category: "opportunity",
        priority: "high",
        estimatedDuration: 35,
        rationale: "Janela de negociação exclusiva expira em 45 dias. Sinergias estimadas em R$ 50M/ano.",
        relatedData: {
          risks: ["Integração cultural", "Endividamento"],
          opportunities: ["Expansão geográfica", "Ganho de escala", "Tecnologia proprietária"],
          externalFactors: ["Concorrente também interessado", "Taxas de juros elevadas"],
          internalTriggers: ["Caixa disponível de R$ 200M"],
        },
        suggestedActions: [
          "Autorizar due diligence completa",
          "Definir preço máximo de aquisição",
          "Aprovar assessoria financeira",
        ],
        preparationMaterials: [
          "Teaser da empresa alvo",
          "Análise preliminar de sinergias",
          "Estrutura de financiamento",
        ],
        status: "suggested",
        displayOrder: 4,
      },
      {
        id: "topic-5",
        title: "Atualização do Programa ESG",
        category: "governance",
        priority: "medium",
        estimatedDuration: 20,
        rationale: "Score ESG caiu 5 pontos no último rating. Investidores institucionais exigindo melhorias.",
        relatedData: {
          risks: ["Desinvestimento de fundos ESG", "Reputação"],
          opportunities: ["Green bonds", "Atração de capital ESG"],
          externalFactors: ["COP30 gerando pressão", "Regulação EU"],
          internalTriggers: ["Meta net-zero 2040"],
        },
        suggestedActions: [
          "Aprovar metas ESG 2026",
          "Autorizar relatório de sustentabilidade GRI",
        ],
        preparationMaterials: [
          "Diagnóstico ESG atual",
          "Benchmark setorial",
          "Roadmap de iniciativas",
        ],
        status: "suggested",
        displayOrder: 5,
      },
      {
        id: "topic-6",
        title: "Performance Operacional Q4 2025",
        category: "operational",
        priority: "medium",
        estimatedDuration: 20,
        rationale: "Desvio de 8% no EBITDA vs orçamento. Margem operacional pressionada.",
        relatedData: {
          risks: ["Não atingimento de metas anuais"],
          opportunities: ["Otimização de custos", "Automação"],
          externalFactors: ["Inflação de custos", "Câmbio"],
          internalTriggers: ["Revisão orçamentária necessária"],
        },
        suggestedActions: [
          "Tomar conhecimento dos resultados",
          "Aprovar plano de recuperação de margem",
        ],
        preparationMaterials: [
          "DRE Q4 2025",
          "Análise de variações",
          "Plano de ação operacional",
        ],
        status: "suggested",
        displayOrder: 6,
      },
    ],
    priorityMatrix: {
      mustDiscuss: ["topic-1", "topic-2", "topic-3"],
      shouldDiscuss: ["topic-4", "topic-5"],
      couldDiscuss: ["topic-6"],
      futureTopics: ["Revisão da política de dividendos", "Expansão internacional"],
    },
    marketContext: "O cenário macroeconômico apresenta volatilidade moderada com taxa Selic em 12,25% e projeção de crescimento do PIB de 2,3% para 2026. O setor enfrenta consolidação acelerada com 3 M&As relevantes nos últimos 6 meses. Pressão regulatória ESG intensifica-se com novas exigências da CVM para empresas listadas. Concorrentes principais anunciaram investimentos significativos em transformação digital, sinalizando corrida por eficiência operacional.",
    riskAlerts: [
      "Exposição cambial acima do limite de política (USD 15M)",
      "Vencimento de debêntures em 90 dias requer refinanciamento",
      "3 processos trabalhistas com risco de perda provável",
    ],
    opportunityHighlights: [
      "Empresa XYZ disponível para aquisição com valuation atrativo",
      "Parceria tecnológica com startup de IA em negociação",
      "Incentivos fiscais para projetos de sustentabilidade",
    ],
    generationMetadata: {
      model: "gpt-4-turbo",
      tokensUsed: 4250,
      generationTimeMs: 8500,
    },
  },
];

// --------------------------------------------------------------------------
// SWOT DINÂMICA
// --------------------------------------------------------------------------

export const mockDynamicSWOT: DynamicSWOT = {
  id: "swot-1",
  companyId: "company-1",
  strengths: [
    {
      id: "s1",
      title: "Liderança de mercado consolidada",
      description: "Market share de 28% no segmento principal, 5pp acima do segundo colocado",
      impact: "high",
      trend: "stable",
      dataSource: "internal",
      relatedMetrics: ["Market Share", "NPS"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "s2",
      title: "Governança estruturada e madura",
      description: "Score de maturidade 4.2/5, acima da média do setor (3.5)",
      impact: "high",
      trend: "improving",
      dataSource: "internal",
      relatedMetrics: ["Maturity Score", "Compliance Rate"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "s3",
      title: "Balanço sólido e baixo endividamento",
      description: "Dívida líquida/EBITDA de 1.2x, permitindo aquisições estratégicas",
      impact: "high",
      trend: "stable",
      dataSource: "internal",
      relatedMetrics: ["Dívida/EBITDA", "Liquidez Corrente"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "s4",
      title: "Equipe de liderança experiente",
      description: "Média de 12 anos de experiência no setor entre C-level",
      impact: "medium",
      trend: "stable",
      dataSource: "internal",
      relatedMetrics: ["Turnover Executivo", "Bench Strength"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
  ],
  weaknesses: [
    {
      id: "w1",
      title: "Dependência de poucos clientes",
      description: "Top 5 clientes representam 45% da receita, risco de concentração",
      impact: "high",
      trend: "worsening",
      dataSource: "internal",
      relatedMetrics: ["Concentração Receita", "Churn Rate"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "w2",
      title: "Gap em transformação digital",
      description: "Sistemas legados em 40% dos processos críticos, atraso vs concorrência",
      impact: "high",
      trend: "stable",
      dataSource: "mixed",
      relatedMetrics: ["Digital Maturity Index", "Tech Debt"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "w3",
      title: "Ausência de plano de sucessão formal",
      description: "Apenas 2 de 8 posições C-level têm sucessores identificados",
      impact: "high",
      trend: "stable",
      dataSource: "internal",
      relatedMetrics: ["Succession Readiness", "Leadership Pipeline"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "w4",
      title: "Score ESG abaixo do benchmark",
      description: "Rating B- vs média setorial de B+, pressão de investidores",
      impact: "medium",
      trend: "worsening",
      dataSource: "external",
      relatedMetrics: ["ESG Score", "Carbon Footprint"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
  ],
  opportunities: [
    {
      id: "o1",
      title: "Aquisição estratégica disponível",
      description: "Empresa XYZ com tecnologia proprietária e valuation atrativo (5x EBITDA)",
      impact: "high",
      trend: "stable",
      dataSource: "external",
      relatedMetrics: ["M&A Pipeline", "Synergy Potential"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "o2",
      title: "Expansão para mercado latino-americano",
      description: "Demanda crescente no Chile e Colômbia, barreira de entrada baixa",
      impact: "high",
      trend: "improving",
      dataSource: "external",
      relatedMetrics: ["Market Size", "Growth Rate"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "o3",
      title: "Parcerias com fintechs",
      description: "3 startups interessadas em white-label, receita incremental estimada em R$ 20M",
      impact: "medium",
      trend: "improving",
      dataSource: "mixed",
      relatedMetrics: ["Partnership Pipeline", "Revenue Potential"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "o4",
      title: "Green bonds para projetos ESG",
      description: "Mercado aquecido, taxas 50bps abaixo de dívida tradicional",
      impact: "medium",
      trend: "improving",
      dataSource: "external",
      relatedMetrics: ["Funding Cost", "ESG Investment"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
  ],
  threats: [
    {
      id: "t1",
      title: "Entrada de player global no mercado",
      description: "Amazon anunciou interesse no segmento, pode pressionar margens em 30%",
      impact: "high",
      trend: "worsening",
      dataSource: "external",
      relatedMetrics: ["Competitive Intensity", "Margin Pressure"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "t2",
      title: "Mudança regulatória iminente",
      description: "Nova regulamentação BACEN em 60 dias pode exigir investimentos de R$ 15M",
      impact: "high",
      trend: "worsening",
      dataSource: "external",
      relatedMetrics: ["Compliance Cost", "Regulatory Risk"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "t3",
      title: "Pressão inflacionária em custos",
      description: "IPCA acumulado de 6.2%, contratos de fornecedores em renegociação",
      impact: "medium",
      trend: "stable",
      dataSource: "external",
      relatedMetrics: ["COGS", "Supplier Inflation"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
    {
      id: "t4",
      title: "Escassez de talentos tech",
      description: "Turnover de desenvolvedores em 25%, acima da meta de 15%",
      impact: "medium",
      trend: "worsening",
      dataSource: "mixed",
      relatedMetrics: ["Tech Turnover", "Hiring Time"],
      lastUpdated: "2026-01-08T10:00:00Z",
    },
  ],
  strategicRecommendations: [
    "Acelerar processo de M&A para capturar sinergias antes da entrada do player global",
    "Priorizar investimentos em transformação digital para reduzir gap competitivo",
    "Implementar plano de sucessão formal para todas as posições C-level em 6 meses",
    "Desenvolver estratégia de diversificação de clientes para reduzir concentração",
    "Estruturar programa ESG robusto para melhorar rating e atrair capital verde",
  ],
  changesSinceLastWeek: [
    {
      type: "new",
      category: "threat",
      item: "Entrada de player global no mercado",
      explanation: "Amazon anunciou interesse no setor em comunicado ao mercado ontem",
    },
    {
      type: "worsened",
      category: "weakness",
      item: "Dependência de poucos clientes",
      explanation: "Maior cliente aumentou participação de 12% para 15% da receita",
    },
    {
      type: "improved",
      category: "opportunity",
      item: "Parcerias com fintechs",
      explanation: "Terceira startup manifestou interesse formal na parceria",
    },
  ],
  triggerSource: "weekly",
  generatedAt: "2026-01-09T06:00:00Z",
};

// --------------------------------------------------------------------------
// BRIEFING DO MEMBRO
// --------------------------------------------------------------------------

export const mockMemberBriefing: MemberBriefing = {
  id: "briefing-1",
  memberId: "member-1",
  meetingId: "meeting-1",
  agendaId: "agenda-1",
  content: {
    executiveSummary: `A reunião de 20/01 terá foco estratégico com decisões críticas sobre o futuro da empresa. Os três temas prioritários são: revisão do plano estratégico trienal, sucessão do CEO e gestão de riscos cibernéticos.

O contexto de mercado é desafiador, com entrada iminente de player global e pressão regulatória ESG. Há, porém, oportunidade única de aquisição que pode fortalecer nossa posição competitiva.

Sua expertise em finanças corporativas será especialmente relevante nas discussões sobre M&A e estrutura de capital. Recomendo atenção especial ao tópico de aquisição da Empresa XYZ, onde sua análise de valuation será determinante.`,
    topicBreakdown: [
      {
        topicId: "topic-1",
        title: "Revisão do Plano Estratégico 2026-2028",
        relevanceToMember: "Como especialista em finanças, sua validação das projeções financeiras é essencial para aprovação do plano",
        keyPoints: [
          "Meta de crescimento de 25% vs média histórica de 15%",
          "Investimentos de R$ 100M em 3 anos",
          "ROI projetado de 18% no cenário base",
          "Cenários pessimista e otimista com variação de +/- 30%",
        ],
        yourPerspectiveMatters: "Sua análise sobre a viabilidade financeira e estrutura de capital adequada será decisiva",
        potentialConcerns: [
          "Agressividade das metas pode pressionar execução",
          "Necessidade de captação adicional não está clara",
          "Sensibilidade ao câmbio não foi testada",
        ],
        suggestedStance: "Apoiar com ressalvas - solicitar análise de sensibilidade mais robusta antes da aprovação final",
      },
      {
        topicId: "topic-4",
        title: "Oportunidade de Aquisição - Empresa XYZ",
        relevanceToMember: "Tema central para sua expertise - avaliação de valuation e estrutura de financiamento",
        keyPoints: [
          "Valuation pedido: R$ 250M (5x EBITDA)",
          "Sinergias estimadas: R$ 50M/ano em 3 anos",
          "Tecnologia proprietária com 12 patentes",
          "Exclusividade de negociação expira em 45 dias",
        ],
        yourPerspectiveMatters: "O conselho espera sua recomendação sobre preço justo e estrutura ótima de financiamento",
        potentialConcerns: [
          "Due diligence ainda não concluída",
          "Integração cultural pode ser desafiadora",
          "Alavancagem pós-deal atingiria 2.5x EBITDA",
        ],
        suggestedStance: "Apoiar autorização de due diligence, mas reservar aprovação final para próxima reunião",
      },
    ],
    criticalQuestions: [
      "Qual o impacto no covenant de dívida se concretizarmos a aquisição?",
      "O plano estratégico considera cenário de entrada do player global?",
      "Há cláusula de earn-out na estrutura de aquisição proposta?",
      "Qual o custo estimado de compliance com nova regulação BACEN?",
      "O plano de sucessão considera desenvolvimento interno ou busca externa?",
      "Temos capacidade de funding para M&A sem diluir acionistas?",
    ],
    preparationChecklist: [
      "Revisar projeções financeiras 2026-2028 (anexo 1)",
      "Analisar teaser da Empresa XYZ (anexo 2)",
      "Consultar área de M&A sobre termos preliminares",
      "Verificar covenants atuais com área jurídica",
      "Ler relatório de incidentes de segurança Q4",
    ],
    estimatedReadingTime: 25,
    relatedDocuments: [
      "Plano Estratégico 2026-2028 - Draft v3",
      "Teaser Empresa XYZ - Confidencial",
      "Análise de Sinergias - Preliminar",
      "Relatório de Segurança Cibernética Q4",
      "Mapeamento de Candidatos Sucessão CEO",
    ],
  },
  preparationProgress: 35,
  generatedAt: "2026-01-09T14:30:00Z",
};

// --------------------------------------------------------------------------
// HISTÓRICO DE INTERAÇÕES COM IA
// --------------------------------------------------------------------------

export const mockAIInteractions: AIInteraction[] = [
  {
    id: "interaction-1",
    memberId: "member-1",
    companyId: "company-1",
    interactionType: "question",
    context: {
      question: "Qual o risco principal da aquisição da Empresa XYZ?",
      topicId: "topic-4",
    },
    aiResponse: {
      content: "O principal risco identificado é a integração cultural. A Empresa XYZ tem cultura de startup com gestão horizontal, enquanto nossa estrutura é mais hierárquica. Recomendo incluir cláusula de retenção de talentos-chave por 24 meses e plano de integração cultural com acompanhamento trimestral pelo Conselho.",
      sources: ["Due Diligence Report", "HR Assessment"],
      confidence: 0.85,
    },
    helpful: true,
    responseTimeMs: 2300,
    tokensUsed: 450,
    modelUsed: "gpt-4-turbo",
    createdAt: "2026-01-09T15:00:00Z",
  },
  {
    id: "interaction-2",
    memberId: "member-1",
    companyId: "company-1",
    interactionType: "deep_dive",
    context: {
      question: "Me explique os riscos cibernéticos mencionados",
      topicId: "topic-3",
    },
    aiResponse: {
      content: "No Q4/2025 registramos 3 incidentes: 1) Tentativa de phishing que comprometeu 5 credenciais (contido em 2h), 2) Ataque DDoS que causou 4h de indisponibilidade, 3) Vulnerabilidade em API expôs dados de 200 clientes. O gap principal é ausência de SOC 24/7 e defasagem em treinamento de colaboradores. Investimento proposto de R$ 5M resolve 80% das vulnerabilidades identificadas.",
      sources: ["Relatório Incidentes Q4", "Auditoria TI"],
      confidence: 0.92,
    },
    helpful: true,
    responseTimeMs: 3100,
    tokensUsed: 520,
    modelUsed: "gpt-4-turbo",
    createdAt: "2026-01-09T15:15:00Z",
  },
];

// --------------------------------------------------------------------------
// FUNÇÕES AUXILIARES
// --------------------------------------------------------------------------

export function getAgendaById(id: string): GeneratedAgenda | undefined {
  return mockGeneratedAgendas.find((a) => a.id === id);
}

export function getMeetingById(id: string): UpcomingMeeting | undefined {
  return mockUpcomingMeetings.find((m) => m.id === id);
}

export function getTopicsByAgendaId(agendaId: string): GeneratedAgenda["topics"] {
  const agenda = getAgendaById(agendaId);
  return agenda?.topics || [];
}

export function getPendingAgendas(): GeneratedAgenda[] {
  return mockGeneratedAgendas.filter((a) => a.status === "pending");
}

export function getApprovedAgendas(): GeneratedAgenda[] {
  return mockGeneratedAgendas.filter((a) => a.status === "approved");
}




