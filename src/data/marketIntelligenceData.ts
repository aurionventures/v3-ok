import { MarketThreat, MarketOpportunity, AgendaSuggestion, CompetitorInsight, SectorTrend } from '@/types/riskIntelligence';

export const mockThreats: MarketThreat[] = [
  {
    id: 'threat-1',
    title: 'Nova Regulamentação LGPD 2.0',
    description: 'Projeto de lei em tramitação que amplia significativamente as obrigações de proteção de dados, incluindo requisitos de governança de dados e responsabilização de conselheiros.',
    source: 'regulatory',
    impact: 5,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Criar Comitê de Proteção de Dados',
      'Revisar políticas de privacidade',
      'Implementar programa de treinamento para conselheiros',
      'Contratar Data Protection Officer (DPO)'
    ]
  },
  {
    id: 'threat-2',
    title: 'Entrada da Atlas Governance no Mercado',
    description: 'Concorrente direto lançou plataforma com preços 30% menores e está conquistando clientes de médio porte rapidamente.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Análise competitiva detalhada',
      'Revisar estratégia de precificação',
      'Destacar diferenciais tecnológicos',
      'Acelerar desenvolvimento de funcionalidades únicas'
    ],
    relatedCompetitors: ['Atlas Governance']
  },
  {
    id: 'threat-3',
    title: 'Disrupção por Plataformas de IA Generativa',
    description: 'Soluções de IA generativa (ChatGPT, Claude) estão sendo usadas diretamente por empresas para análise de ATAs e geração de insights de governança, sem intermediários.',
    source: 'technological',
    impact: 4,
    probability: 4,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Integrar IA nativa na plataforma',
      'Desenvolver funcionalidades exclusivas de IA',
      'Posicionar como solução especializada vs. genérica',
      'Criar API de IA para governança'
    ]
  },
  {
    id: 'threat-4',
    title: 'Pressão ESG de Investidores Institucionais',
    description: 'Fundos de investimento estão exigindo transparência total em práticas ESG e ameaçando desinvestir de empresas sem governança robusta.',
    source: 'esg',
    impact: 5,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Implementar módulo ESG completo',
      'Criar relatórios ESG automáticos',
      'Integrar métricas de sustentabilidade',
      'Desenvolver dashboards para investidores'
    ]
  },
  {
    id: 'threat-5',
    title: 'Instabilidade Econômica e Alta de Juros',
    description: 'Cenário macroeconômico adverso está reduzindo orçamentos de empresas para software de governança, priorizando soluções essenciais.',
    source: 'economic',
    impact: 3,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Criar planos de pagamento flexíveis',
      'Desenvolver versão essencial mais acessível',
      'Demonstrar ROI claro da plataforma',
      'Oferecer garantia de resultados'
    ]
  },
  {
    id: 'threat-6',
    title: 'Fusão entre Diligent e Nasdaq Governance',
    description: 'Dois grandes players do mercado anunciaram fusão, criando gigante com recursos massivos para inovação e marketing.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Reforçar posicionamento de nicho',
      'Focar em agilidade vs. burocracia de grandes empresas',
      'Criar parcerias estratégicas',
      'Desenvolver recursos exclusivos para mercado brasileiro'
    ],
    relatedCompetitors: ['Diligent', 'Nasdaq Governance Solutions']
  },
  {
    id: 'threat-7',
    title: 'Mudanças na Lei das Sociedades Anônimas',
    description: 'Proposta de reforma da Lei 6.404/76 inclui novos requisitos para composição de conselhos e comitês, com potencial impacto em sistemas de governança.',
    source: 'regulatory',
    impact: 4,
    probability: 3,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Monitorar tramitação do projeto',
      'Preparar módulo de compliance automático',
      'Criar alertas de adequação regulatória',
      'Desenvolver checklist de conformidade'
    ]
  },
  {
    id: 'threat-8',
    title: 'Escassez de Talentos em Governança Corporativa',
    description: 'Dificuldade crescente em encontrar profissionais qualificados em governança está limitando expansão e qualidade do suporte ao cliente.',
    source: 'market',
    impact: 3,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Automatizar processos com IA',
      'Criar programa de formação interna',
      'Desenvolver recursos de auto-atendimento',
      'Parcerias com instituições de ensino'
    ]
  }
];

export const mockOpportunities: MarketOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Gap no Mercado de Governança Familiar',
    description: 'Empresas familiares de médio porte (faturamento R$ 50-500M) estão buscando profissionalizar governança mas não encontram soluções adequadas ao seu perfil.',
    source: 'market_gap',
    potentialValue: 'high',
    timeWindow: '6-12 meses',
    requirements: [
      'Desenvolver módulo específico para empresas familiares',
      'Criar funcionalidades de sucessão familiar',
      'Adaptar linguagem e interface para este público',
      'Parcerias com consultorias de empresas familiares'
    ],
    estimatedImpact: 'Potencial de 200+ novos clientes no primeiro ano'
  },
  {
    id: 'opp-2',
    title: 'Tendência de Digitalização de Conselhos',
    description: 'Aceleração pós-pandemia da digitalização de reuniões de conselhos criou demanda por soluções integradas que vão além de videoconferência.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Integração com Zoom/Teams/Meet',
      'Transcrição automática de reuniões',
      'Votação eletrônica segura',
      'Assinatura digital de ATAs'
    ],
    estimatedImpact: 'Aumento de 40% na conversão de leads'
  },
  {
    id: 'opp-3',
    title: 'Nova Lei de Incentivos Fiscais para ESG',
    description: 'Governo federal está lançando programa de incentivos fiscais para empresas que comprovarem práticas ESG robustas com governança certificada.',
    source: 'regulation',
    potentialValue: 'high',
    timeWindow: '3-6 meses',
    requirements: [
      'Desenvolver módulo de certificação ESG',
      'Criar relatórios para órgãos fiscalizadores',
      'Integrar com sistema da Receita Federal',
      'Parceria com auditorias certificadoras'
    ],
    estimatedImpact: 'Potencial de triplicar base de clientes em 18 meses'
  },
  {
    id: 'opp-4',
    title: 'Parceria Estratégica com Big Four',
    description: 'Grandes auditorias (PwC, Deloitte, KPMG, EY) estão buscando soluções tecnológicas para complementar serviços de consultoria em governança.',
    source: 'partnership',
    potentialValue: 'high',
    timeWindow: '6-12 meses',
    requirements: [
      'Desenvolver API para integração',
      'Criar programa de whitelabel',
      'Estabelecer modelo de revenue share',
      'Adaptar plataforma para requisitos de auditoria'
    ],
    estimatedImpact: 'Acesso a carteira de 1000+ empresas de grande porte'
  },
  {
    id: 'opp-5',
    title: 'Adoção de IA para Análise de ATAs',
    description: 'Demanda crescente por análise automática de ATAs para identificar padrões, riscos e oportunidades não percebidos manualmente.',
    source: 'technology',
    potentialValue: 'medium',
    timeWindow: 'Imediato',
    requirements: [
      'Implementar processamento de linguagem natural',
      'Criar modelos de IA treinados em governança',
      'Desenvolver dashboards de insights',
      'Garantir segurança e privacidade dos dados'
    ],
    estimatedImpact: 'Diferenciação competitiva significativa'
  },
  {
    id: 'opp-6',
    title: 'Expansão para Mercado LATAM',
    description: 'Países da América Latina (Chile, Colômbia, Peru) estão implementando novas regulamentações de governança, criando demanda por soluções especializadas.',
    source: 'market_gap',
    potentialValue: 'medium',
    timeWindow: '12-18 meses',
    requirements: [
      'Adaptar plataforma para regulamentações locais',
      'Tradução e localização para espanhol',
      'Estabelecer parcerias locais',
      'Criar estrutura de suporte regional'
    ],
    estimatedImpact: 'Mercado potencial de 500+ empresas de médio/grande porte'
  }
];

export const mockAgendaSuggestions: AgendaSuggestion[] = [
  {
    id: 'agenda-1',
    title: 'Adequação à LGPD 2.0: Responsabilidades do Conselho',
    description: 'Discussão sobre as novas obrigações do Conselho de Administração na proteção de dados e potenciais responsabilizações.',
    relatedInsightId: 'threat-1',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Apresentação da proposta de lei LGPD 2.0',
      'Impactos na governança corporativa',
      'Definição de responsável pela proteção de dados',
      'Orçamento para adequação e treinamento',
      'Criação de Comitê de Proteção de Dados'
    ]
  },
  {
    id: 'agenda-2',
    title: 'Análise Competitiva: Resposta à Entrada da Atlas Governance',
    description: 'Avaliação da estratégia competitiva frente ao novo player no mercado de governança.',
    relatedInsightId: 'threat-2',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Análise do posicionamento da Atlas Governance',
      'Comparativo de funcionalidades e precificação',
      'Estratégia de retenção de clientes',
      'Investimentos em inovação e marketing',
      'Plano de ação para próximos 90 dias'
    ]
  },
  {
    id: 'agenda-3',
    title: 'Estratégia de IA: Integração de Inteligência Artificial',
    description: 'Definição da estratégia de IA para evitar disrupção por plataformas genéricas.',
    relatedInsightId: 'threat-3',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Tecnologia',
    priority: 'high',
    discussionPoints: [
      'Benchmark de soluções de IA em governança',
      'Funcionalidades prioritárias para desenvolvimento',
      'Roadmap de integração de IA',
      'Orçamento e timeline',
      'Riscos de segurança e privacidade'
    ]
  },
  {
    id: 'agenda-4',
    title: 'Implementação de Módulo ESG',
    description: 'Aprovação do projeto de desenvolvimento do módulo ESG para atender pressão de investidores.',
    relatedInsightId: 'threat-4',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Requisitos mínimos exigidos por investidores',
      'Escopo do módulo ESG',
      'Integrações necessárias',
      'Prazo e orçamento',
      'Estratégia de lançamento'
    ]
  },
  {
    id: 'agenda-5',
    title: 'Revisão de Pricing e Modelos de Pagamento',
    description: 'Adequação da estratégia comercial ao cenário econômico adverso.',
    relatedInsightId: 'threat-5',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Financeiro',
    priority: 'medium',
    discussionPoints: [
      'Análise de sensibilidade de preços',
      'Modelos alternativos de pagamento',
      'Versão essencial da plataforma',
      'Demonstração de ROI para clientes',
      'Impacto no faturamento'
    ]
  },
  {
    id: 'agenda-6',
    title: 'Oportunidade: Mercado de Empresas Familiares',
    description: 'Avaliação do potencial de entrada no segmento de governança familiar.',
    relatedInsightId: 'opp-1',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Análise de mercado e tamanho da oportunidade',
      'Adaptações necessárias na plataforma',
      'Estratégia de go-to-market',
      'Parcerias com consultorias especializadas',
      'Projeção de receita e investimento'
    ]
  },
  {
    id: 'agenda-7',
    title: 'Digitalização de Conselhos: Roadmap de Funcionalidades',
    description: 'Definição de prioridades para atender tendência de digitalização completa.',
    relatedInsightId: 'opp-2',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Produto',
    priority: 'high',
    discussionPoints: [
      'Funcionalidades mais demandadas pelo mercado',
      'Integrações com ferramentas de videoconferência',
      'Recursos de votação eletrônica',
      'Timeline de desenvolvimento',
      'Estratégia de comunicação e lançamento'
    ]
  },
  {
    id: 'agenda-8',
    title: 'Certificação ESG: Parceria com Governo Federal',
    description: 'Exploração da oportunidade de incentivos fiscais para empresas com governança ESG.',
    relatedInsightId: 'opp-3',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Detalhes do programa de incentivos fiscais',
      'Requisitos técnicos para certificação',
      'Desenvolvimento do módulo de certificação',
      'Parcerias com auditorias',
      'Potencial de crescimento'
    ]
  },
  {
    id: 'agenda-9',
    title: 'Parceria Estratégica com Big Four',
    description: 'Avaliação de proposta de parceria com grandes empresas de auditoria.',
    relatedInsightId: 'opp-4',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Modelo de parceria proposto',
      'Vantagens e riscos da parceria',
      'Adaptações tecnológicas necessárias',
      'Modelo de revenue share',
      'Decisão de avançar com negociações'
    ]
  },
  {
    id: 'agenda-10',
    title: 'Expansão Internacional: Mercado LATAM',
    description: 'Estudo de viabilidade para expansão para países da América Latina.',
    relatedInsightId: 'opp-6',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Análise de mercado LATAM',
      'Barreiras regulatórias e culturais',
      'Investimento necessário',
      'Estratégia de entrada',
      'Timeline e milestones'
    ]
  }
];

export const mockCompetitors: CompetitorInsight[] = [
  {
    id: 'comp-1',
    name: 'Atlas Governance',
    recentMove: 'Lançou plataforma com precificação agressiva 30% abaixo do mercado e está capturando empresas de médio porte rapidamente',
    threatLevel: 'high',
    opportunityFromWeakness: 'Plataforma ainda carece de funcionalidades avançadas de IA e integração com outros sistemas',
    marketShare: '15% do mercado brasileiro'
  },
  {
    id: 'comp-2',
    name: 'Diligent',
    recentMove: 'Anunciou fusão com Nasdaq Governance Solutions, criando maior player global do setor',
    threatLevel: 'high',
    opportunityFromWeakness: 'Plataforma complexa e cara, inadequada para empresas de médio porte. Foco em grandes corporações.',
    marketShare: '25% do mercado global'
  },
  {
    id: 'comp-3',
    name: 'Nasdaq Governance Solutions',
    recentMove: 'Em processo de fusão com Diligent. Manteve foco em empresas listadas em bolsa.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Interface desatualizada e pouco intuitiva. Dificuldade de customização.',
    marketShare: '18% do mercado global'
  },
  {
    id: 'comp-4',
    name: 'Board Intelligence',
    recentMove: 'Expandiu operações na Europa, mas ainda sem presença significativa na América Latina',
    threatLevel: 'low',
    opportunityFromWeakness: 'Foco exclusivo em mercado europeu. Não adaptado para regulamentação brasileira.',
    marketShare: '8% do mercado europeu'
  },
  {
    id: 'comp-5',
    name: 'Convene',
    recentMove: 'Lançou recursos de IA para análise de documentos, competindo diretamente em funcionalidades avançadas',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Focado apenas em reuniões virtuais, sem visão completa de governança corporativa.',
    marketShare: '12% do mercado norte-americano'
  }
];

export const mockSectorTrends: SectorTrend[] = [
  {
    id: 'trend-1',
    title: 'Governança ESG como Vantagem Competitiva',
    description: 'Empresas com governança ESG robusta estão obtendo avaliações 20-30% superiores e acesso facilitado a crédito',
    impact: 'positive',
    relevance: 95,
    source: 'McKinsey Global Institute',
    timeframe: '2024-2026'
  },
  {
    id: 'trend-2',
    title: 'Digitalização Acelerada de Conselhos',
    description: 'Adoção de ferramentas digitais para gestão de conselhos cresceu 250% desde 2020, com 78% das empresas planejando investir mais',
    impact: 'positive',
    relevance: 90,
    source: 'Deloitte Board Practices Report',
    timeframe: '2023-2025'
  },
  {
    id: 'trend-3',
    title: 'Complexidade Regulatória Crescente',
    description: 'Número de regulamentações relacionadas à governança corporativa cresceu 180% nos últimos 5 anos, aumentando custos de compliance',
    impact: 'negative',
    relevance: 85,
    source: 'Thomson Reuters Regulatory Intelligence',
    timeframe: '2020-2025'
  },
  {
    id: 'trend-4',
    title: 'Acionistas Ativistas em Ascensão',
    description: 'Fundos ativistas estão cada vez mais pressionando conselhos por mudanças estratégicas e melhor governança',
    impact: 'neutral',
    relevance: 75,
    source: 'Harvard Law School Forum',
    timeframe: '2023-2026'
  },
  {
    id: 'trend-5',
    title: 'Diversidade Obrigatória em Conselhos',
    description: 'Regulamentações exigindo diversidade de gênero, raça e experiência em conselhos estão se expandindo globalmente',
    impact: 'positive',
    relevance: 88,
    source: 'World Economic Forum',
    timeframe: '2024-2028'
  },
  {
    id: 'trend-6',
    title: 'Cybersecurity como Pauta Prioritária',
    description: 'Conselhos estão dedicando 40% mais tempo a discussões sobre segurança cibernética, exigindo expertise técnica',
    impact: 'neutral',
    relevance: 82,
    source: 'PwC Annual Corporate Directors Survey',
    timeframe: '2023-2025'
  }
];
