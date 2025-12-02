import { MarketThreat, MarketOpportunity, AgendaSuggestion, CompetitorInsight, SectorTrend } from '@/types/riskIntelligence';

// Lista de Setores IBGE
export const ibgeSectors = [
  'Comércio - Varejo',
  'Comércio - Atacado',
  'Indústria de Transformação',
  'Serviços de Informação e Comunicação',
  'Agricultura, Pecuária e Pesca',
  'Construção Civil',
  'Serviços Financeiros',
  'Saúde e Assistência Social',
  'Educação',
  'Transporte e Logística',
  'Alojamento e Alimentação',
  'Energia e Utilities',
  'Atividades Imobiliárias',
];

// Regiões do Brasil
export const brazilRegions = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
  'Nacional',
];

// CASE: VAREJO DE MODA - Ameaças de Mercado
export const mockThreats: MarketThreat[] = [
  {
    id: 'threat-1',
    title: 'Invasão do Shein no Mercado Brasileiro',
    description: 'O Shein intensificou operações no Brasil com preços até 70% menores, frete grátis e marketing massivo em redes sociais, capturando rapidamente participação de mercado do varejo tradicional.',
    source: 'competitive',
    impact: 5,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Desenvolver estratégia de resposta rápida à moda',
      'Criar coleções-cápsula com lançamentos semanais',
      'Investir em marketing de influenciadores',
      'Reforçar atributos de qualidade e sustentabilidade',
      'Implementar programa de fidelidade diferenciado'
    ],
    relatedCompetitors: ['Shein', 'AliExpress']
  },
  {
    id: 'threat-2',
    title: 'Nova Lei de Tributação do E-commerce (PL 2337/2021)',
    description: 'Projeto de lei em tramitação pode elevar tributação de produtos importados via e-commerce, mas também afetará operações digitais de varejistas nacionais com novas obrigações fiscais.',
    source: 'regulatory',
    impact: 4,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Avaliar impacto fiscal nas operações online',
      'Revisar estrutura de precificação digital',
      'Adequar sistemas de e-commerce à nova legislação',
      'Consultar especialistas tributários',
      'Preparar comunicação ao mercado'
    ]
  },
  {
    id: 'threat-3',
    title: 'Aumento de 35% nos Custos Logísticos',
    description: 'Alta nos preços de combustível e insumos logísticos está pressionando margens, especialmente no modelo omnichannel que exige integração entre lojas físicas e e-commerce.',
    source: 'economic',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Renegociar contratos com transportadoras',
      'Otimizar centros de distribuição',
      'Implementar tecnologia de roteirização inteligente',
      'Avaliar modelo de ship from store',
      'Considerar repasse seletivo de custos'
    ]
  },
  {
    id: 'threat-4',
    title: 'Exigências ESG na Cadeia de Fornecedores Têxteis',
    description: 'Consumidores e investidores exigem transparência total da cadeia produtiva têxtil, incluindo certificações de trabalho digno, uso responsável de água e materiais sustentáveis.',
    source: 'esg',
    impact: 5,
    probability: 5,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Auditar fornecedores quanto a práticas ESG',
      'Certificar cadeia produtiva (GOTS, Fair Trade)',
      'Desenvolver coleção com materiais sustentáveis',
      'Comunicar iniciativas de sustentabilidade',
      'Criar conselho consultivo de sustentabilidade'
    ]
  },
  {
    id: 'threat-5',
    title: 'Crise de Crédito ao Consumidor',
    description: 'Alta inadimplência e restrição de crédito estão reduzindo poder de compra do consumidor, especialmente em itens não essenciais como moda.',
    source: 'economic',
    impact: 4,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Desenvolver coleções de entrada (preço acessível)',
      'Ampliar parcerias com fintechs de crédito',
      'Criar programas de cashback e vale-compras',
      'Implementar análise de crédito própria',
      'Reforçar categoria de básicos e essenciais'
    ]
  },
  {
    id: 'threat-6',
    title: 'Concorrência de Marketplaces (Mercado Livre, Amazon)',
    description: 'Marketplaces estão investindo pesado em moda, oferecendo variedade infinita, preços competitivos e logística rápida, competindo diretamente com varejistas tradicionais.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Avaliar venda em marketplaces como canal complementar',
      'Reforçar experiência de marca própria',
      'Criar produtos exclusivos não disponíveis em marketplaces',
      'Investir em atendimento personalizado',
      'Desenvolver comunidade de marca'
    ],
    relatedCompetitors: ['Mercado Livre', 'Amazon', 'Magalu']
  },
  {
    id: 'threat-7',
    title: 'Mudanças no Comportamento do Consumidor Pós-Pandemia',
    description: 'Consumidor valoriza cada vez mais conforto, versatilidade e experiência phygital, reduzindo frequência de visitas a lojas físicas e exigindo integração total entre canais.',
    source: 'market',
    impact: 3,
    probability: 5,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Redesenhar experiência omnichannel',
      'Implementar provador virtual com IA',
      'Criar serviços de personal styling online',
      'Desenvolver aplicativo com recursos de AR',
      'Integrar programa de fidelidade cross-channel'
    ]
  },
  {
    id: 'threat-8',
    title: 'Pressão por Moda Sustentável e Movimento Slow Fashion',
    description: 'Crescente rejeição ao modelo fast fashion por gerações mais jovens, com preferência por marcas sustentáveis, brechós e moda circular.',
    source: 'esg',
    impact: 4,
    probability: 4,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Lançar linha de moda sustentável certificada',
      'Implementar programa de revenda/brechó da marca',
      'Criar serviço de conserto e customização',
      'Desenvolver coleções atemporais e duráveis',
      'Comunicar pegada ambiental dos produtos'
    ]
  }
];

// CASE: VAREJO DE MODA - Oportunidades de Mercado
export const mockOpportunities: MarketOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Explosão do Social Commerce (Instagram, TikTok)',
    description: 'Vendas via redes sociais crescem 45% ao ano no Brasil. Consumidores, especialmente Gen Z, preferem descobrir e comprar produtos diretamente em plataformas sociais.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Criar contas comerciais otimizadas em Instagram e TikTok',
      'Desenvolver estratégia de conteúdo para social selling',
      'Integrar checkout nativo das plataformas',
      'Treinar equipe em social commerce',
      'Investir em anúncios segmentados por comportamento'
    ],
    estimatedImpact: 'Potencial de 30% do faturamento via social commerce em 18 meses'
  },
  {
    id: 'opp-2',
    title: 'Live Commerce como Novo Canal de Vendas',
    description: 'Lives de vendas com influenciadores geram conversão 10x superior ao e-commerce tradicional, combinando entretenimento, urgência e prova social.',
    source: 'technology',
    potentialValue: 'high',
    timeWindow: '3-6 meses',
    requirements: [
      'Estabelecer parceria com plataforma de live commerce',
      'Recrutar influenciadores alinhados à marca',
      'Criar ofertas e promoções exclusivas para lives',
      'Treinar equipe de atendimento para lives',
      'Desenvolver logística para entrega rápida pós-live'
    ],
    estimatedImpact: 'Incremento de R$ 2-5M em vendas anuais'
  },
  {
    id: 'opp-3',
    title: 'Programa de Fidelidade Omnichannel Avançado',
    description: 'Clientes com programa de fidelidade gastam 67% mais. Oportunidade de criar programa integrado entre lojas físicas, e-commerce e redes sociais.',
    source: 'market_gap',
    potentialValue: 'high',
    timeWindow: '6-9 meses',
    requirements: [
      'Desenvolver app de fidelidade com gamificação',
      'Integrar pontos em todos os canais (físico + digital)',
      'Criar benefícios exclusivos (early access, eventos VIP)',
      'Implementar sistema de cashback progressivo',
      'Desenvolver clube de assinatura premium'
    ],
    estimatedImpact: 'Aumento de 25% no ticket médio e 40% na recompra'
  },
  {
    id: 'opp-4',
    title: 'Parceria com Influenciadores Digitais de Moda',
    description: 'Influenciadores de médio porte (50k-500k seguidores) geram ROI superior a celebridades, com custo acessível e audiência engajada.',
    source: 'partnership',
    potentialValue: 'medium',
    timeWindow: 'Imediato',
    requirements: [
      'Mapear influenciadores alinhados ao posicionamento da marca',
      'Criar programa de embaixadores com benefícios mútuos',
      'Desenvolver coleções-cápsula co-criadas',
      'Estabelecer modelo de comissionamento por vendas',
      'Mensurar conversão por influenciador'
    ],
    estimatedImpact: 'Alcance de 2-5M de pessoas e conversão de 3-8% em vendas'
  },
  {
    id: 'opp-5',
    title: 'Certificação de Moda Sustentável (Sistema B, GOTS)',
    description: '68% dos consumidores pagariam mais por produtos sustentáveis certificados. Certificações geram diferenciação e acesso a novos públicos.',
    source: 'regulation',
    potentialValue: 'high',
    timeWindow: '9-12 meses',
    requirements: [
      'Auditar cadeia produtiva para certificação',
      'Ajustar processos para atender requisitos',
      'Investir em materiais e fornecedores certificados',
      'Obter selos GOTS, Sistema B ou equivalentes',
      'Comunicar certificações no marketing'
    ],
    estimatedImpact: 'Acesso a mercado premium e aumento de 15-20% no preço médio'
  },
  {
    id: 'opp-6',
    title: 'Expansão para Cidades do Interior (Tier 2 e 3)',
    description: 'Cidades médias do interior apresentam crescimento de renda per capita acima da média nacional e carência de opções de moda de qualidade.',
    source: 'market_gap',
    potentialValue: 'medium',
    timeWindow: '12-18 meses',
    requirements: [
      'Mapear cidades com maior potencial (renda + demanda)',
      'Desenvolver modelo de franquia ou loja própria',
      'Adaptar mix de produtos ao perfil regional',
      'Criar estratégia de marketing local',
      'Estabelecer logística para regiões remotas'
    ],
    estimatedImpact: 'Abertura de 10-15 lojas em 2 anos, gerando R$ 15-20M adicionais'
  }
];

// CASE: VAREJO DE MODA - Sugestões de Pauta para Reuniões
export const mockAgendaSuggestions: AgendaSuggestion[] = [
  {
    id: 'agenda-1',
    title: 'Estratégia de Defesa contra Shein: Plano de Ação Urgente',
    description: 'Aprovação de plano de resposta à entrada agressiva do Shein no mercado brasileiro, incluindo investimentos em fast fashion e marketing digital.',
    relatedInsightId: 'threat-1',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Análise detalhada do modelo de negócio do Shein',
      'Identificação de diferenciais competitivos da marca',
      'Plano de investimento em coleções rápidas',
      'Orçamento para marketing de influenciadores',
      'Estratégia de comunicação de qualidade e sustentabilidade',
      'Meta de participação de mercado para próximos 12 meses'
    ]
  },
  {
    id: 'agenda-2',
    title: 'Adequação à Nova Lei de Tributação do E-commerce',
    description: 'Avaliação do impacto do PL 2337/2021 nas operações digitais e aprovação de plano de adequação fiscal.',
    relatedInsightId: 'threat-2',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Financeiro',
    priority: 'high',
    discussionPoints: [
      'Apresentação do projeto de lei e implicações fiscais',
      'Análise de impacto nas margens do e-commerce',
      'Necessidade de ajustes em sistemas e processos',
      'Estratégia de repasse ou absorção de custos',
      'Cronograma de adequação'
    ]
  },
  {
    id: 'agenda-3',
    title: 'Otimização de Custos Logísticos: Ship from Store',
    description: 'Aprovação de projeto piloto de envio de pedidos online diretamente das lojas físicas para reduzir custos de distribuição.',
    relatedInsightId: 'threat-3',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Operações',
    priority: 'high',
    discussionPoints: [
      'Cenário de aumento de custos logísticos',
      'Modelo de ship from store e benefícios esperados',
      'Investimento em tecnologia de gestão de estoque',
      'Lojas piloto para implementação',
      'Projeção de economia em 12 meses'
    ]
  },
  {
    id: 'agenda-4',
    title: 'Certificação ESG na Cadeia Têxtil',
    description: 'Aprovação de programa de certificação ESG dos fornecedores e desenvolvimento de coleção sustentável certificada.',
    relatedInsightId: 'threat-4',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Pressão de consumidores e investidores por transparência',
      'Mapeamento da cadeia de fornecedores atual',
      'Certificações necessárias (GOTS, Fair Trade)',
      'Investimento em auditoria e adequação',
      'Lançamento de linha sustentável premium',
      'Comunicação de sustentabilidade ao mercado'
    ]
  },
  {
    id: 'agenda-5',
    title: 'Ampliação de Crédito: Parceria com Fintechs',
    description: 'Avaliação de parcerias com fintechs de crédito para ampliar acesso ao consumo em cenário de crise.',
    relatedInsightId: 'threat-5',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Financeiro',
    priority: 'medium',
    discussionPoints: [
      'Análise do cenário de crédito ao consumidor',
      'Benchmarking de parcerias com fintechs no varejo',
      'Propostas comerciais recebidas',
      'Riscos de inadimplência',
      'Aprovação de parceria piloto'
    ]
  },
  {
    id: 'agenda-6',
    title: 'Social Commerce: Investimento em Instagram e TikTok',
    description: 'Aprovação de orçamento para estruturação de estratégia de social commerce como novo canal de vendas.',
    relatedInsightId: 'opp-1',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Crescimento exponencial do social commerce no Brasil',
      'Benchmarking de cases de sucesso no varejo',
      'Investimento necessário (plataforma + conteúdo + ads)',
      'Meta de faturamento via social commerce',
      'Integração com e-commerce e ERP',
      'Aprovação de orçamento de R$ 800k para 12 meses'
    ]
  },
  {
    id: 'agenda-7',
    title: 'Implementação de Live Commerce',
    description: 'Avaliação de parceria com plataforma de live commerce e aprovação de calendário de lives com influenciadores.',
    relatedInsightId: 'opp-2',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Marketing',
    priority: 'high',
    discussionPoints: [
      'Apresentação do modelo de live commerce',
      'Benchmarking de conversão e ROI',
      'Proposta de parceria com plataforma',
      'Seleção de influenciadores para lives',
      'Ofertas exclusivas e estratégia de conteúdo',
      'Aprovação de projeto piloto com 6 lives'
    ]
  },
  {
    id: 'agenda-8',
    title: 'Programa de Fidelidade Omnichannel',
    description: 'Aprovação do desenvolvimento de aplicativo de fidelidade integrado com todos os canais de venda.',
    relatedInsightId: 'opp-3',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Benchmarking de programas de fidelidade no varejo',
      'Escopo do app: funcionalidades e gamificação',
      'Integração com loja física, e-commerce e redes sociais',
      'Modelo de pontuação e recompensas',
      'Investimento e timeline de desenvolvimento',
      'Projeção de aumento em ticket médio e recompra'
    ]
  },
  {
    id: 'agenda-9',
    title: 'Parceria com Influenciadores: Programa de Embaixadores',
    description: 'Estruturação de programa de parceria com micro e médio influenciadores de moda.',
    relatedInsightId: 'opp-4',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Marketing',
    priority: 'medium',
    discussionPoints: [
      'Mapeamento de influenciadores alinhados à marca',
      'Modelo de parceria e comissionamento',
      'Coleções-cápsula co-criadas',
      'Métricas de performance por influenciador',
      'Aprovação de orçamento e início de negociações'
    ]
  },
  {
    id: 'agenda-10',
    title: 'Expansão Geográfica: Cidades do Interior',
    description: 'Estudo de viabilidade para abertura de lojas em cidades médias com alto potencial de consumo.',
    relatedInsightId: 'opp-6',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Análise de mercado: cidades tier 2 e 3',
      'Potencial de faturamento por região',
      'Modelo de expansão: franquia ou loja própria',
      'Investimento necessário por loja',
      'Cronograma de expansão para 24 meses',
      'Aprovação de estudo de viabilidade detalhado'
    ]
  }
];

// CASE: VAREJO DE MODA - Análise de Concorrentes
export const mockCompetitors: CompetitorInsight[] = [
  {
    id: 'comp-1',
    name: 'Shein',
    recentMove: 'Investiu R$ 500M em marketing no Brasil, abriu centro de distribuição local e reduziu tempo de entrega de 45 para 7 dias',
    threatLevel: 'high',
    opportunityFromWeakness: 'Qualidade inferior e questões ESG geram rejeição de consumidores conscientes. Falta de experiência de marca.',
    marketShare: '12% do e-commerce de moda brasileiro'
  },
  {
    id: 'comp-2',
    name: 'Renner',
    recentMove: 'Lançou marketplace de moda com marcas parceiras e ampliou serviços financeiros via Realize',
    threatLevel: 'high',
    opportunityFromWeakness: 'Percepção de marca muito massificada. Dificuldade em se comunicar com público jovem e digitalmente nativo.',
    marketShare: '19% do varejo de moda físico + digital'
  },
  {
    id: 'comp-3',
    name: 'C&A',
    recentMove: 'Reposicionamento para básicos de qualidade e sustentabilidade, com linha circular e programa de coleta de roupas usadas',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Lojas físicas com experiência datada. E-commerce com menor investimento em UX comparado aos líderes.',
    marketShare: '11% do varejo de moda'
  },
  {
    id: 'comp-4',
    name: 'Riachuelo',
    recentMove: 'Investiu pesado em e-commerce, lives de vendas e parceria com influenciadores. App com 15M de downloads.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Marca posicionada em classe C/D limita acesso a público premium. Qualidade ainda abaixo de líderes.',
    marketShare: '14% do varejo de moda'
  },
  {
    id: 'comp-5',
    name: 'Zara',
    recentMove: 'Acelerou modelo de fast fashion com coleções semanais e app de AR para provador virtual',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Preços premium restringem público. Críticas ao modelo fast fashion insustentável crescem entre jovens.',
    marketShare: '8% do segmento premium de moda'
  }
];

// CASE: VAREJO DE MODA - Tendências Setoriais
export const mockSectorTrends: SectorTrend[] = [
  {
    id: 'trend-1',
    title: 'Social Commerce cresce 45% ao ano no Brasil',
    description: 'Vendas via Instagram, TikTok e WhatsApp explodem, com Gen Z comprando majoritariamente via redes sociais',
    impact: 'positive',
    relevance: 95,
    source: 'NielsenIQ E-commerce Report 2024',
    timeframe: '2024-2026'
  },
  {
    id: 'trend-2',
    title: 'Consumidor exige transparência na cadeia produtiva',
    description: '68% dos consumidores verificam origem e condições de produção antes de comprar moda. Certificações ESG se tornam obrigatórias.',
    impact: 'positive',
    relevance: 90,
    source: 'McKinsey Fashion Report',
    timeframe: '2024-2027'
  },
  {
    id: 'trend-3',
    title: 'Inflação reduz ticket médio e frequência de compra',
    description: 'Consumidor prioriza básicos e produtos essenciais. Moda perde participação no orçamento familiar.',
    impact: 'negative',
    relevance: 85,
    source: 'FGV - Índice de Confiança do Consumidor',
    timeframe: '2024-2025'
  },
  {
    id: 'trend-4',
    title: 'Omnichannel deixa de ser diferencial e vira obrigatório',
    description: 'Consumidor espera comprar online e retirar na loja, trocar no físico o que comprou no digital, e integração perfeita entre canais.',
    impact: 'positive',
    relevance: 88,
    source: 'Google Retail Trends',
    timeframe: '2024-2025'
  },
  {
    id: 'trend-5',
    title: 'Revenda e brechós ganham espaço entre jovens',
    description: 'Consumo de segunda mão cresce 30% ao ano. Jovens preferem brechós e plataformas de revenda por questões econômicas e ambientais.',
    impact: 'neutral',
    relevance: 75,
    source: 'ThredUp Resale Report',
    timeframe: '2024-2028'
  },
  {
    id: 'trend-6',
    title: 'Moda circular e sustentável em alta demanda',
    description: 'Marcas que oferecem programa de coleta, conserto e revenda de peças usadas crescem 3x mais que fast fashion tradicional.',
    impact: 'positive',
    relevance: 82,
    source: 'Ellen MacArthur Foundation',
    timeframe: '2024-2030'
  }
];
