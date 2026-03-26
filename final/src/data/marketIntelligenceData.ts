import { MarketThreat, MarketOpportunity, AgendaSuggestion, CompetitorInsight, SectorTrend, CompanyContext } from '@/types/riskIntelligence';

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

// ======================================
// SETOR: COMÉRCIO - VAREJO (Varejo de Moda)
// ======================================

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

export const mockSectorTrends: SectorTrend[] = [
  {
    id: 'trend-1',
    title: 'Social Commerce em Alta',
    description: 'Vendas via Instagram e TikTok crescem 45% ao ano, transformando redes sociais em principais canais de descoberta e compra.',
    impact: 'positive',
    relevance: 95,
    source: 'McKinsey Digital Commerce Report 2024',
    timeframe: '2024-2025'
  },
  {
    id: 'trend-2',
    title: 'Exigência de Transparência na Cadeia Têxtil',
    description: 'Consumidores demandam rastreabilidade completa desde a matéria-prima até o produto final, impulsionando certificações ESG.',
    impact: 'positive',
    relevance: 88,
    source: 'Fashion Revolution Index',
    timeframe: '2024-2026'
  },
  {
    id: 'trend-3',
    title: 'Crescimento do Mercado de Revenda (Resale)',
    description: 'Mercado de moda de segunda mão cresce 15x mais rápido que o varejo tradicional, com Gen Z liderando o movimento.',
    impact: 'negative',
    relevance: 82,
    source: 'ThredUp Resale Report',
    timeframe: '2024-2027'
  },
  {
    id: 'trend-4',
    title: 'Personalização via Inteligência Artificial',
    description: 'IA generativa permite personalização em massa de produtos e experiências, aumentando conversão em até 40%.',
    impact: 'positive',
    relevance: 90,
    source: 'Gartner Retail Tech Trends',
    timeframe: '2024-2025'
  },
  {
    id: 'trend-5',
    title: 'Live Commerce como Novo Padrão',
    description: 'Lives de vendas com influenciadores se tornam canal estratégico, gerando conversão 10x superior ao e-commerce tradicional.',
    impact: 'positive',
    relevance: 85,
    source: 'Mercado Livre Trends Report',
    timeframe: '2024-2025'
  },
  {
    id: 'trend-6',
    title: 'Declínio do Fast Fashion Tradicional',
    description: 'Modelo fast fashion enfrenta rejeição crescente por questões ambientais, com 58% dos consumidores reduzindo compras impulsivas.',
    impact: 'negative',
    relevance: 78,
    source: 'Instituto Modefica',
    timeframe: '2024-2028'
  }
];

// ======================================
// SETOR: SERVIÇOS (Consultoria Empresarial)
// ======================================

export const servicosThreats: MarketThreat[] = [
  {
    id: 'servicos-threat-1',
    title: 'Automação via IA Substituindo Consultores Juniores',
    description: 'Ferramentas de IA generativa como ChatGPT e Claude estão automatizando análises e relatórios que antes demandavam consultores juniores, reduzindo demanda por horas de trabalho.',
    source: 'technological',
    impact: 5,
    probability: 5,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Reposicionar consultores juniores para tarefas de alto valor',
      'Treinar equipe em prompt engineering e uso de IA',
      'Desenvolver metodologias híbridas humano-IA',
      'Criar serviços de implementação de IA para clientes',
      'Diferenciar por insights estratégicos não automatizáveis'
    ]
  },
  {
    id: 'servicos-threat-2',
    title: 'Concorrência de Consultorias Boutique Especializadas',
    description: 'Consultorias pequenas e especializadas estão capturando projetos de nicho com expertise profunda, fees competitivos e agilidade operacional.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Desenvolver verticais de especialização próprias',
      'Criar equipes dedicadas por indústria',
      'Investir em thought leadership setorial',
      'Estabelecer parcerias com boutiques para projetos específicos',
      'Reduzir burocracia para aumentar agilidade'
    ]
  },
  {
    id: 'servicos-threat-3',
    title: 'Pressão de Clientes por Redução de Fees',
    description: 'CFOs exigem justificativa clara de ROI e pressionam por redução de honorários, questionando modelo tradicional de time & materials.',
    source: 'economic',
    impact: 4,
    probability: 4,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Migrar para modelo de fee baseado em resultado',
      'Desenvolver pacotes de valor pré-definidos',
      'Demonstrar ROI quantitativo de projetos anteriores',
      'Criar modelos de precificação baseados em valor',
      'Oferecer opções de retainer com desconto'
    ]
  },
  {
    id: 'servicos-threat-4',
    title: 'Fuga de Talentos para Big Techs e Startups',
    description: 'Profissionais seniores estão deixando consultoria para trabalhar em Big Techs (Google, Amazon) ou startups, atraídos por melhor equilíbrio vida-trabalho e equity.',
    source: 'market',
    impact: 5,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Revisar política de work-life balance',
      'Criar opções de trabalho remoto flexível',
      'Implementar programa de equity/long-term incentives',
      'Desenvolver carreira técnica alternativa ao modelo up-or-out',
      'Investir em well-being e saúde mental'
    ]
  },
  {
    id: 'servicos-threat-5',
    title: 'Ferramentas SaaS Self-Service',
    description: 'Plataformas SaaS (Tableau, Power BI, monday.com) permitem empresas executarem projetos de análise e gestão sem consultoria externa.',
    source: 'technological',
    impact: 3,
    probability: 5,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Tornar-se parceiro de implementação dessas plataformas',
      'Criar serviços de consultoria + tecnologia',
      'Desenvolver IPs e ferramentas proprietárias',
      'Focar em transformações complexas não automatizáveis',
      'Oferecer managed services e suporte contínuo'
    ]
  },
  {
    id: 'servicos-threat-6',
    title: 'Recessão Econômica Reduzindo Orçamentos de Consultoria',
    description: 'Ciclos econômicos negativos levam empresas a cortarem projetos de consultoria como primeira medida de contenção de custos.',
    source: 'economic',
    impact: 4,
    probability: 3,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Diversificar portfólio para projetos de redução de custos',
      'Criar ofertas acessíveis para médias empresas',
      'Desenvolver contratos de longo prazo (retainer)',
      'Posicionar consultoria como investimento essencial',
      'Expandir para setores anticíclicos (saúde, governo)'
    ]
  },
  {
    id: 'servicos-threat-7',
    title: 'Regulação de Conflitos de Interesse',
    description: 'Novas regulamentações exigem maior transparência sobre conflitos de interesse, especialmente em auditoria e consultoria simultâneas.',
    source: 'regulatory',
    impact: 3,
    probability: 3,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Revisar políticas de conflito de interesse',
      'Implementar chinese walls entre áreas',
      'Desenvolver compliance rigoroso',
      'Comunicar transparência ao mercado',
      'Criar estruturas jurídicas separadas se necessário'
    ]
  },
  {
    id: 'servicos-threat-8',
    title: 'Commoditização de Serviços Básicos',
    description: 'Serviços tradicionais como diagnósticos organizacionais e pesquisas de mercado estão se tornando commodities de baixo valor agregado.',
    source: 'market',
    impact: 4,
    probability: 4,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Migrar para consultoria de implementação',
      'Desenvolver ofertas premium com IA e analytics avançado',
      'Criar serviços de transformação end-to-end',
      'Investir em inovação metodológica',
      'Posicionar como parceiro estratégico, não fornecedor'
    ]
  }
];

export const servicosOpportunities: MarketOpportunity[] = [
  {
    id: 'servicos-opp-1',
    title: 'Demanda Crescente por Transformação Digital',
    description: 'Empresas de todos os setores precisam se digitalizar. Mercado de consultoria em transformação digital deve crescer 18% ao ano até 2027.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Desenvolver expertise em cloud, dados e IA',
      'Recrutar profissionais com experiência em tech',
      'Criar parcerias com AWS, Azure, Google Cloud',
      'Desenvolver metodologia proprietária de transformação',
      'Investir em cases de sucesso e marketing digital'
    ],
    estimatedImpact: 'Potencial de 40% de crescimento em receita em 24 meses'
  },
  {
    id: 'servicos-opp-2',
    title: 'Consultoria em ESG e Sustentabilidade',
    description: 'Regulamentações ESG e pressão de investidores criam demanda massiva por consultoria em sustentabilidade, relatórios ESG e estratégia climática.',
    source: 'regulation',
    potentialValue: 'high',
    timeWindow: '6-12 meses',
    requirements: [
      'Criar practice de ESG dedicada',
      'Contratar especialistas em sustentabilidade',
      'Desenvolver metodologia de avaliação ESG',
      'Estabelecer parceria com empresas de certificação',
      'Criar ofertas para todos os portes de empresa'
    ],
    estimatedImpact: 'Nova linha de receita de R$ 15-25M em 18 meses'
  },
  {
    id: 'servicos-opp-3',
    title: 'Expansão para Mercado de Médias Empresas',
    description: 'Médias empresas (R$ 50-500M faturamento) historicamente mal atendidas pelas big consultancies representam mercado de R$ 12B no Brasil.',
    source: 'market_gap',
    potentialValue: 'high',
    timeWindow: '6-9 meses',
    requirements: [
      'Desenvolver ofertas simplificadas e acessíveis',
      'Criar modelo de precificação adequado ao porte',
      'Estabelecer canais de aquisição escaláveis',
      'Treinar time em vendas consultivas',
      'Desenvolver cases de sucesso neste segmento'
    ],
    estimatedImpact: '30-50 novos clientes médios por ano, incremento de R$ 20M'
  },
  {
    id: 'servicos-opp-4',
    title: 'Serviços de Inteligência Artificial e GenAI',
    description: 'Empresas precisam implementar IA mas não têm expertise interna. Mercado de consultoria em IA deve atingir US$ 52B até 2027.',
    source: 'technology',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Treinar consultores em IA e machine learning',
      'Desenvolver parcerias com OpenAI, Anthropic',
      'Criar aceleradores de implementação de IA',
      'Desenvolver casos de uso por indústria',
      'Investir em talent acquisition de cientistas de dados'
    ],
    estimatedImpact: 'Potencial de 25% da receita via projetos de IA em 12 meses'
  },
  {
    id: 'servicos-opp-5',
    title: 'Consultoria de Implementação (não apenas diagnóstico)',
    description: 'Clientes valorizam consultores que "colocam a mão na massa" e implementam soluções, não apenas entregam PowerPoints.',
    source: 'market_gap',
    potentialValue: 'medium',
    timeWindow: '3-6 meses',
    requirements: [
      'Criar squads multidisciplinares de implementação',
      'Desenvolver modelo de cobrança por entrega',
      'Treinar consultores em ferramentas práticas',
      'Estabelecer métricas de sucesso baseadas em resultado',
      'Criar garantias de performance'
    ],
    estimatedImpact: 'Aumento de 30% em taxa de recontratação'
  },
  {
    id: 'servicos-opp-6',
    title: 'Expansão Internacional (América Latina)',
    description: 'Mercados como México, Colômbia e Chile apresentam baixa penetração de consultoria de qualidade e economias em crescimento.',
    source: 'market_gap',
    potentialValue: 'medium',
    timeWindow: '12-18 meses',
    requirements: [
      'Estabelecer escritórios em 2-3 países-chave',
      'Recrutar lideranças locais',
      'Adaptar ofertas para contexto local',
      'Criar parcerias com consultorias locais',
      'Investir em marketing e posicionamento regional'
    ],
    estimatedImpact: 'Receita internacional representando 20% do total em 3 anos'
  }
];

export const servicosAgendaSuggestions: AgendaSuggestion[] = [
  {
    id: 'servicos-agenda-1',
    title: 'Estratégia de Resposta à Automação por IA',
    description: 'Aprovação de plano de reposicionamento da consultoria diante da automação crescente de tarefas por IA generativa.',
    relatedInsightId: 'servicos-threat-1',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Análise de impacto da IA em serviços atuais',
      'Reposicionamento de consultores juniores',
      'Investimento em treinamento de IA para equipe',
      'Desenvolvimento de ofertas híbridas humano-IA',
      'Meta de integração de IA em 80% dos projetos em 12 meses'
    ]
  },
  {
    id: 'servicos-agenda-2',
    title: 'Criação de Practice de Transformação Digital',
    description: 'Aprovação de investimento para criar área dedicada a transformação digital e cloud computing.',
    relatedInsightId: 'servicos-opp-1',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Dimensionamento do mercado de transformação digital',
      'Investimento necessário (pessoas + parcerias tech)',
      'Contratação de líder de practice',
      'Parcerias estratégicas com AWS/Azure/GCP',
      'Meta de 40% de crescimento em 24 meses'
    ]
  },
  {
    id: 'servicos-agenda-3',
    title: 'Lançamento de Practice ESG',
    description: 'Estruturação de área de consultoria em ESG e sustentabilidade para atender demanda regulatória crescente.',
    relatedInsightId: 'servicos-opp-2',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Mercado de ESG no Brasil e regulamentações',
      'Contratação de especialistas em sustentabilidade',
      'Desenvolvimento de metodologia proprietária',
      'Parcerias com certificadoras',
      'Orçamento de R$ 3M para estruturação'
    ]
  },
  {
    id: 'servicos-agenda-4',
    title: 'Programa de Retenção de Talentos',
    description: 'Aprovação de política de work-life balance e equity para reduzir saída de talentos para Big Techs.',
    relatedInsightId: 'servicos-threat-4',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de RH',
    priority: 'urgent',
    discussionPoints: [
      'Análise de turnover e benchmark de mercado',
      'Proposta de trabalho híbrido/remoto',
      'Criação de programa de equity para seniores',
      'Carreira técnica como alternativa ao up-or-out',
      'Investimento em bem-estar e saúde mental'
    ]
  },
  {
    id: 'servicos-agenda-5',
    title: 'Migração para Modelo de Fee Baseado em Valor',
    description: 'Avaliação de mudança do modelo time & materials para precificação baseada em resultados e valor entregue.',
    relatedInsightId: 'servicos-threat-3',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Financeiro',
    priority: 'medium',
    discussionPoints: [
      'Limitações do modelo atual de precificação',
      'Benchmarking de modelos baseados em valor',
      'Riscos e oportunidades da mudança',
      'Projetos piloto para testar novo modelo',
      'Treinamento de equipe comercial'
    ]
  },
  {
    id: 'servicos-agenda-6',
    title: 'Expansão para Médias Empresas',
    description: 'Aprovação de estratégia para atender mercado de médias empresas com ofertas simplificadas.',
    relatedInsightId: 'servicos-opp-3',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Análise do mercado de médias empresas (R$ 12B)',
      'Desenvolvimento de ofertas adaptadas',
      'Modelo de precificação acessível',
      'Canais de aquisição escaláveis',
      'Meta de 30-50 novos clientes médios por ano'
    ]
  },
  {
    id: 'servicos-agenda-7',
    title: 'Criação de Área de Consultoria em IA',
    description: 'Estruturação de practice dedicada a implementação de soluções de IA e GenAI para clientes.',
    relatedInsightId: 'servicos-opp-4',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Mercado de consultoria em IA (US$ 52B até 2027)',
      'Contratação de cientistas de dados',
      'Parcerias com OpenAI, Anthropic',
      'Desenvolvimento de casos de uso por indústria',
      'Meta de 25% da receita via IA em 12 meses'
    ]
  },
  {
    id: 'servicos-agenda-8',
    title: 'Migração para Consultoria de Implementação',
    description: 'Transformação do modelo de consultoria de diagnóstico para implementação hands-on de soluções.',
    relatedInsightId: 'servicos-opp-5',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Operações',
    priority: 'medium',
    discussionPoints: [
      'Limitações do modelo atual focado em diagnóstico',
      'Criação de squads de implementação',
      'Treinamento em ferramentas práticas',
      'Modelo de garantia de performance',
      'Projeção de aumento de 30% em recontratação'
    ]
  },
  {
    id: 'servicos-agenda-9',
    title: 'Parcerias com Plataformas SaaS',
    description: 'Estabelecimento de parcerias estratégicas com plataformas SaaS para oferecer serviços de implementação.',
    relatedInsightId: 'servicos-threat-5',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Estratégico',
    priority: 'medium',
    discussionPoints: [
      'Ameaça de ferramentas self-service',
      'Oportunidade de parceria com Tableau, Power BI, monday.com',
      'Desenvolvimento de serviços complementares',
      'Modelo de revenue share',
      'Posicionamento como parceiro oficial'
    ]
  },
  {
    id: 'servicos-agenda-10',
    title: 'Expansão Internacional para América Latina',
    description: 'Estudo de viabilidade para abertura de operações no México, Colômbia e Chile.',
    relatedInsightId: 'servicos-opp-6',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Análise de mercado: México, Colômbia, Chile',
      'Modelo de entrada: escritório próprio ou parceria',
      'Investimento necessário por país',
      'Recrutamento de lideranças locais',
      'Meta de 20% da receita internacional em 3 anos'
    ]
  }
];

export const servicosCompetitors: CompetitorInsight[] = [
  {
    id: 'servicos-comp-1',
    name: 'McKinsey & Company',
    recentMove: 'Investiu US$ 1B em IA e analytics, adquirindo QuantumBlack e criando practice de GenAI com 2.000 consultores dedicados.',
    threatLevel: 'high',
    opportunityFromWeakness: 'McKinsey tem fees muito altos. Oportunidade de capturar médias empresas com ofertas acessíveis.',
    marketShare: '~15% do mercado brasileiro de consultoria estratégica'
  },
  {
    id: 'servicos-comp-2',
    name: 'BCG (Boston Consulting Group)',
    recentMove: 'Lançou BCG X (tech build unit) focada em implementação, competindo diretamente com integradoras.',
    threatLevel: 'high',
    opportunityFromWeakness: 'BCG X ainda em fase inicial. Podemos oferecer implementação mais ágil com menos burocracia.',
    marketShare: '~12% do mercado brasileiro'
  },
  {
    id: 'servicos-comp-3',
    name: 'Accenture',
    recentMove: 'Adquiriu 5 consultorias especializadas em 2024 (criativo, ESG, cloud) para expandir ofertas.',
    threatLevel: 'high',
    opportunityFromWeakness: 'Accenture muito grande e burocrática. Podemos ser mais ágeis em projetos de médio porte.',
    marketShare: '~20% do mercado (maior player)'
  },
  {
    id: 'servicos-comp-4',
    name: 'Deloitte',
    recentMove: 'Separou consultoria de auditoria por pressão regulatória, criando Deloitte Consulting como entidade independente.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Separação causou confusão no mercado. Momento de capturar clientes em transição.',
    marketShare: '~10% do mercado de consultoria'
  },
  {
    id: 'servicos-comp-5',
    name: 'Consultorias Boutique (Falconi, Bain, etc)',
    recentMove: 'Crescimento de 30% em 2024 focando em nichos específicos e relacionamento próximo com C-level.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Boutiques limitadas em escala e capacidade de entrega. Podemos fazer M&A seletivo.',
    marketShare: '~25% do mercado (fragmentado)'
  }
];

export const servicosSectorTrends: SectorTrend[] = [
  {
    id: 'servicos-trend-1',
    title: 'IA Generativa Transformando Consultoria',
    description: 'ChatGPT e Claude automatizam 40% das tarefas de consultores juniores, forçando reposicionamento para insights estratégicos.',
    impact: 'negative',
    relevance: 95,
    source: 'Gartner Future of Work 2024',
    timeframe: '2024-2026'
  },
  {
    id: 'servicos-trend-2',
    title: 'Crescimento de Consultoria ESG',
    description: 'Mercado de consultoria em sustentabilidade deve crescer 22% ao ano até 2027 por pressão regulatória.',
    impact: 'positive',
    relevance: 92,
    source: 'McKinsey ESG Report',
    timeframe: '2024-2027'
  },
  {
    id: 'servicos-trend-3',
    title: 'Demanda por Implementação (não apenas estratégia)',
    description: 'Clientes exigem consultores que implementem soluções, não apenas diagnósticos e PowerPoints.',
    impact: 'positive',
    relevance: 88,
    source: 'Forrester Consulting Trends',
    timeframe: '2024-2025'
  },
  {
    id: 'servicos-trend-4',
    title: 'Migração para Modelo de Valor',
    description: 'Empresas rejeitam modelo time & materials, exigindo precificação baseada em resultados.',
    impact: 'positive',
    relevance: 85,
    source: 'Harvard Business Review',
    timeframe: '2024-2026'
  },
  {
    id: 'servicos-trend-5',
    title: 'Fuga de Talentos para Tech',
    description: 'Consultores seniores deixando para Big Techs e startups por melhor work-life balance.',
    impact: 'negative',
    relevance: 82,
    source: 'LinkedIn Workforce Report',
    timeframe: '2024-2025'
  },
  {
    id: 'servicos-trend-6',
    title: 'Digitalização de Médias Empresas',
    description: 'Médias empresas (R$ 50-500M) investindo agressivamente em transformação digital.',
    impact: 'positive',
    relevance: 90,
    source: 'IDC Brazil Digital Transformation',
    timeframe: '2024-2026'
  }
];

// ======================================
// SETOR: SAÚDE E ASSISTÊNCIA SOCIAL (Beleza Estética)
// ======================================

export const belezaThreats: MarketThreat[] = [
  {
    id: 'beleza-threat-1',
    title: 'Entrada de Redes Populares (Dr. Consulta, Emagrecentro)',
    description: 'Redes de clínicas populares oferecem procedimentos básicos a preços 50-70% menores, democratizando acesso e aumentando concorrência.',
    source: 'competitive',
    impact: 5,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Reforçar posicionamento premium com tecnologia avançada',
      'Criar linha de entrada acessível',
      'Investir em relacionamento e fidelização',
      'Desenvolver protocolos exclusivos e diferenciados',
      'Comunicar expertise médica e segurança'
    ]
  },
  {
    id: 'beleza-threat-2',
    title: 'Regulamentação Rigorosa da Anvisa',
    description: 'Anvisa intensifica fiscalização de procedimentos estéticos, exigindo médicos responsáveis técnicos e certificações de equipamentos.',
    source: 'regulatory',
    impact: 4,
    probability: 5,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Auditar compliance total com normas Anvisa',
      'Certificar todos os equipamentos',
      'Contratar médicos responsáveis técnicos',
      'Implementar protocolos de segurança rigorosos',
      'Criar comitê de ética médica'
    ]
  },
  {
    id: 'beleza-threat-3',
    title: 'Procedimentos Invasivos por Não-Médicos',
    description: 'Profissionais não-médicos realizam procedimentos como preenchimento e toxina botulínica ilegalmente, gerando concorrência desleal e riscos.',
    source: 'regulatory',
    impact: 4,
    probability: 4,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Educar mercado sobre riscos de procedimentos ilegais',
      'Denunciar práticas irregulares aos conselhos',
      'Reforçar comunicação de segurança médica',
      'Apoiar iniciativas de regulamentação',
      'Criar campanha de conscientização'
    ]
  },
  {
    id: 'beleza-threat-4',
    title: 'Redes Sociais Criando Expectativas Irreais',
    description: 'Filtros de Instagram e TikTok criam expectativas irreais sobre resultados estéticos, gerando frustração de pacientes e potencial insatisfação.',
    source: 'market',
    impact: 3,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Implementar consulta prévia obrigatória com expectativas realistas',
      'Usar simulações 3D para mostrar resultados esperados',
      'Criar conteúdo educativo sobre limitações dos procedimentos',
      'Desenvolver termo de consentimento informado robusto',
      'Treinar equipe em gestão de expectativas'
    ]
  },
  {
    id: 'beleza-threat-5',
    title: 'Crise Econômica Reduzindo Gastos com Estética',
    description: 'Recessão e inflação fazem consumidores cortarem gastos supérfluos, incluindo procedimentos estéticos eletivos.',
    source: 'economic',
    impact: 4,
    probability: 4,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Criar pacotes de entrada com preço acessível',
      'Implementar parcelamento facilitado',
      'Desenvolver programa de fidelidade com benefícios',
      'Oferecer procedimentos de manutenção mais baratos',
      'Comunicar estética como investimento em autoestima'
    ]
  },
  {
    id: 'beleza-threat-6',
    title: 'Escassez de Profissionais Médicos Especializados',
    description: 'Demanda por dermatologistas e cirurgiões plásticos supera oferta, gerando guerra por talentos e aumento de custos.',
    source: 'market',
    impact: 4,
    probability: 4,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Criar programa de residência e especialização próprio',
      'Oferecer equity ou participação nos resultados',
      'Investir em tecnologias que aumentem produtividade',
      'Desenvolver carreira atrativa com benefícios',
      'Estabelecer parcerias com universidades médicas'
    ]
  },
  {
    id: 'beleza-threat-7',
    title: 'Mudança de Padrões Estéticos (Body Positivity)',
    description: 'Movimento de aceitação corporal e body positivity pode reduzir demanda por procedimentos estéticos invasivos.',
    source: 'esg',
    impact: 3,
    probability: 3,
    timeHorizon: 'long_term',
    suggestedActions: [
      'Reposicionar estética como bem-estar, não padrão de beleza',
      'Focar em saúde da pele e prevenção',
      'Comunicar procedimentos como escolha pessoal, não imposição',
      'Desenvolver linha de tratamentos wellness',
      'Apoiar campanhas de autoestima saudável'
    ]
  },
  {
    id: 'beleza-threat-8',
    title: 'Riscos de Complicações e Processos Judiciais',
    description: 'Aumento de litígios relacionados a procedimentos estéticos, com condenações milionárias por complicações e insatisfação.',
    source: 'regulatory',
    impact: 5,
    probability: 3,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Contratar seguro de responsabilidade civil robusto',
      'Implementar protocolos de segurança rigorosos',
      'Criar processo de consentimento informado detalhado',
      'Treinar equipe em comunicação de riscos',
      'Desenvolver política de resolução de conflitos',
      'Manter registro fotográfico completo'
    ]
  }
];

export const belezaOpportunities: MarketOpportunity[] = [
  {
    id: 'beleza-opp-1',
    title: 'Crescimento de Procedimentos Não-Invasivos',
    description: 'Mercado de procedimentos não-invasivos (laser, ultrassom, LED) cresce 25% ao ano, com recuperação rápida e menor risco.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Investir em tecnologias não-invasivas (HIFU, laser fracionado)',
      'Treinar equipe em novos protocolos',
      'Criar pacotes de tratamentos combinados',
      'Comunicar benefícios de procedimentos sem cirurgia',
      'Desenvolver linha de manutenção facial'
    ],
    estimatedImpact: 'Incremento de 30-40% em faturamento em 12 meses'
  },
  {
    id: 'beleza-opp-2',
    title: 'Estética Masculina em Alta',
    description: 'Homens representam 15% do mercado de estética e segmento cresce 35% ao ano. Masculinização facial e rejuvenescimento em alta.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: '6-9 meses',
    requirements: [
      'Criar linha de tratamentos específicos para homens',
      'Desenvolver marketing voltado ao público masculino',
      'Treinar equipe para atendimento masculino',
      'Criar espaço/horário dedicado a homens',
      'Estabelecer parcerias com barbeiros e personal trainers'
    ],
    estimatedImpact: 'Novo segmento representando 20% do faturamento em 18 meses'
  },
  {
    id: 'beleza-opp-3',
    title: 'Turismo Médico/Estético',
    description: 'Brasil é destino de turismo estético, recebendo pacientes de EUA, Europa e América Latina por qualidade e preço competitivo.',
    source: 'market_gap',
    potentialValue: 'medium',
    timeWindow: '12-18 meses',
    requirements: [
      'Criar pacotes all-inclusive (cirurgia + hospedagem + turismo)',
      'Contratar equipe bilíngue',
      'Estabelecer parcerias com hotéis e agências',
      'Obter certificações internacionais',
      'Desenvolver marketing internacional'
    ],
    estimatedImpact: 'Receita de turismo médico de R$ 3-5M em 24 meses'
  },
  {
    id: 'beleza-opp-4',
    title: 'Harmonização Facial em Demanda',
    description: 'Harmonização facial (preenchimento + toxina + fios) é procedimento mais buscado, com mercado crescendo 40% ao ano.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Treinar equipe médica em técnicas avançadas',
      'Investir em produtos premium (Juvederm, Radiesse)',
      'Criar protocolos personalizados por tipo facial',
      'Desenvolver pacotes de harmonização completa',
      'Comunicar resultados naturais e harmoniosos'
    ],
    estimatedImpact: 'Harmonização representando 40% do faturamento em 12 meses'
  },
  {
    id: 'beleza-opp-5',
    title: 'Tecnologias de Rejuvenescimento (Skinbooster, PRP)',
    description: 'Tratamentos de bioestimulação e rejuvenescimento com crescimento de 30% ao ano, especialmente para manutenção preventiva.',
    source: 'technology',
    potentialValue: 'medium',
    timeWindow: '3-6 meses',
    requirements: [
      'Adquirir equipamentos de bioestimulação',
      'Implementar protocolos de PRP e skinbooster',
      'Treinar equipe em técnicas de aplicação',
      'Criar programas de manutenção mensal',
      'Comunicar benefícios de prevenção vs correção'
    ],
    estimatedImpact: 'Receita recorrente de R$ 200-300k/mês'
  },
  {
    id: 'beleza-opp-6',
    title: 'Franquia ou Expansão em Rede',
    description: 'Modelo de franquia permite crescimento rápido e escalável, aproveitando demanda crescente em cidades médias.',
    source: 'market_gap',
    potentialValue: 'high',
    timeWindow: '12-24 meses',
    requirements: [
      'Desenvolver modelo de franquia replicável',
      'Criar manual de operações e protocolos',
      'Estabelecer central de compras e negociação',
      'Implementar sistema de gestão integrado',
      'Desenvolver programa de treinamento para franqueados'
    ],
    estimatedImpact: '10-15 unidades franqueadas em 3 anos, gerando royalties de R$ 2-3M'
  }
];

export const belezaAgendaSuggestions: AgendaSuggestion[] = [
  {
    id: 'beleza-agenda-1',
    title: 'Estratégia de Defesa contra Redes Populares',
    description: 'Aprovação de plano de posicionamento premium e criação de linha acessível para competir com clínicas populares.',
    relatedInsightId: 'beleza-threat-1',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Análise da concorrência de redes populares',
      'Reforço do posicionamento premium',
      'Criação de linha de entrada acessível',
      'Investimento em tecnologias diferenciadas',
      'Estratégia de comunicação de expertise médica'
    ]
  },
  {
    id: 'beleza-agenda-2',
    title: 'Adequação à Regulamentação Anvisa',
    description: 'Implementação de compliance total com normas Anvisa e certificação de equipamentos.',
    relatedInsightId: 'beleza-threat-2',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Compliance',
    priority: 'urgent',
    discussionPoints: [
      'Mapeamento de requisitos regulatórios',
      'Auditoria de conformidade atual',
      'Certificação de equipamentos',
      'Contratação de responsável técnico médico',
      'Implementação de protocolos de segurança'
    ]
  },
  {
    id: 'beleza-agenda-3',
    title: 'Investimento em Tecnologias Não-Invasivas',
    description: 'Aprovação de orçamento para aquisição de equipamentos de última geração em procedimentos não-invasivos.',
    relatedInsightId: 'beleza-opp-1',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Crescimento de 25% ao ano em não-invasivos',
      'Equipamentos recomendados (HIFU, laser fracionado)',
      'Investimento necessário de R$ 800k-1.2M',
      'Treinamento de equipe médica',
      'Projeção de incremento de 30-40% em 12 meses'
    ]
  },
  {
    id: 'beleza-agenda-4',
    title: 'Lançamento de Linha de Estética Masculina',
    description: 'Estruturação de linha de tratamentos e marketing específicos para público masculino.',
    relatedInsightId: 'beleza-opp-2',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Marketing',
    priority: 'high',
    discussionPoints: [
      'Crescimento de 35% ao ano em estética masculina',
      'Desenvolvimento de protocolos masculinos',
      'Estratégia de comunicação para homens',
      'Criação de espaço dedicado',
      'Meta de 20% do faturamento em 18 meses'
    ]
  },
  {
    id: 'beleza-agenda-5',
    title: 'Programa de Turismo Médico/Estético',
    description: 'Avaliação de viabilidade para atender pacientes internacionais com pacotes all-inclusive.',
    relatedInsightId: 'beleza-opp-3',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Potencial do mercado de turismo estético',
      'Parcerias com hotéis e agências de viagem',
      'Contratação de equipe bilíngue',
      'Certificações internacionais necessárias',
      'Projeção de receita de R$ 3-5M em 24 meses'
    ]
  },
  {
    id: 'beleza-agenda-6',
    title: 'Especialização em Harmonização Facial',
    description: 'Investimento em treinamento avançado e produtos premium para harmonização facial.',
    relatedInsightId: 'beleza-opp-4',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê Médico',
    priority: 'high',
    discussionPoints: [
      'Harmonização como procedimento mais buscado',
      'Treinamento em técnicas avançadas',
      'Investimento em produtos premium',
      'Desenvolvimento de protocolos personalizados',
      'Meta de 40% do faturamento via harmonização'
    ]
  },
  {
    id: 'beleza-agenda-7',
    title: 'Programa de Gestão de Expectativas',
    description: 'Implementação de processo rigoroso de consulta prévia e simulação 3D para alinhar expectativas.',
    relatedInsightId: 'beleza-threat-4',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Qualidade',
    priority: 'medium',
    discussionPoints: [
      'Riscos de expectativas irreais por redes sociais',
      'Implementação de consulta prévia obrigatória',
      'Aquisição de software de simulação 3D',
      'Treinamento de equipe em gestão de expectativas',
      'Desenvolvimento de termo de consentimento robusto'
    ]
  },
  {
    id: 'beleza-agenda-8',
    title: 'Política de Mitigação de Riscos Jurídicos',
    description: 'Aprovação de seguro de responsabilidade civil e protocolos de segurança para reduzir litígios.',
    relatedInsightId: 'beleza-threat-8',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Jurídico',
    priority: 'high',
    discussionPoints: [
      'Aumento de processos judiciais no setor',
      'Contratação de seguro de responsabilidade civil',
      'Implementação de protocolos de segurança',
      'Processo de consentimento informado detalhado',
      'Política de resolução de conflitos'
    ]
  },
  {
    id: 'beleza-agenda-9',
    title: 'Implementação de Linha de Bioestimulação',
    description: 'Estruturação de protocolos de rejuvenescimento e manutenção preventiva com skinbooster e PRP.',
    relatedInsightId: 'beleza-opp-5',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê Médico',
    priority: 'medium',
    discussionPoints: [
      'Crescimento de tratamentos de bioestimulação',
      'Aquisição de equipamentos necessários',
      'Treinamento em técnicas de PRP e skinbooster',
      'Criação de programas de manutenção mensal',
      'Projeção de receita recorrente de R$ 200-300k/mês'
    ]
  },
  {
    id: 'beleza-agenda-10',
    title: 'Estudo de Viabilidade: Modelo de Franquia',
    description: 'Avaliação de expansão via franquia para crescimento rápido em cidades médias.',
    relatedInsightId: 'beleza-opp-6',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Potencial de crescimento via franquia',
      'Desenvolvimento de modelo replicável',
      'Criação de manual de operações',
      'Sistema de gestão integrado',
      'Meta de 10-15 unidades em 3 anos'
    ]
  }
];

export const belezaCompetitors: CompetitorInsight[] = [
  {
    id: 'beleza-comp-1',
    name: 'Dr. Consulta (Estética)',
    recentMove: 'Expandiu para 50 clínicas de estética em 2024, oferecendo procedimentos básicos a preços populares (R$ 99-399).',
    threatLevel: 'high',
    opportunityFromWeakness: 'Dr. Consulta foca em volume e baixo custo. Oportunidade de capturar clientes que buscam qualidade premium.',
    marketShare: '~8% do mercado de clínicas populares'
  },
  {
    id: 'beleza-comp-2',
    name: 'Emagrecentro',
    recentMove: 'Lançou programa de franquia acelerado, abrindo 30 novas unidades em 12 meses focadas em emagrecimento e estética corporal.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Emagrecentro foca apenas em corpo. Podemos dominar facial e harmonização.',
    marketShare: '~5% do mercado'
  },
  {
    id: 'beleza-comp-3',
    name: 'Onodera Estética',
    recentMove: 'Investiu R$ 20M em equipamentos de última geração e treinou equipe em técnicas avançadas de harmonização.',
    threatLevel: 'high',
    opportunityFromWeakness: 'Onodera tem preços muito elevados. Oportunidade de posicionar como premium acessível.',
    marketShare: '~12% do mercado premium'
  },
  {
    id: 'beleza-comp-4',
    name: 'Beleza Natural',
    recentMove: 'Expandiu de cabelo para estética facial, abrindo 15 clínicas integradas com salões de beleza.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Beleza Natural tem foco em público popular. Podemos manter posicionamento premium.',
    marketShare: '~6% do mercado'
  },
  {
    id: 'beleza-comp-5',
    name: 'Espaço Laser',
    recentMove: 'Líder em depilação a laser, agora diversificando para tratamentos faciais e corporais com laser fracionado.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Espaço Laser conhecido apenas por depilação. Podemos ter expertise médica mais forte.',
    marketShare: '~10% do mercado de laser'
  }
];

export const belezaSectorTrends: SectorTrend[] = [
  {
    id: 'beleza-trend-1',
    title: 'Crescimento de Procedimentos Não-Invasivos',
    description: 'Mercado de tratamentos sem cirurgia cresce 25% ao ano, com recuperação rápida e menor risco.',
    impact: 'positive',
    relevance: 95,
    source: 'SBME (Sociedade Brasileira de Medicina Estética)',
    timeframe: '2024-2027'
  },
  {
    id: 'beleza-trend-2',
    title: 'Estética Masculina em Alta',
    description: 'Homens representam 15% do mercado e segmento cresce 35% ao ano, especialmente em harmonização e rejuvenescimento.',
    impact: 'positive',
    relevance: 90,
    source: 'SBCP (Sociedade Brasileira de Cirurgia Plástica)',
    timeframe: '2024-2026'
  },
  {
    id: 'beleza-trend-3',
    title: 'Harmonização Facial Como Padrão',
    description: 'Harmonização facial (preenchimento + toxina + fios) é procedimento mais buscado, crescendo 40% ao ano.',
    impact: 'positive',
    relevance: 92,
    source: 'Google Trends + SBME',
    timeframe: '2024-2025'
  },
  {
    id: 'beleza-trend-4',
    title: 'Regulamentação Rigorosa',
    description: 'Anvisa intensifica fiscalização, exigindo médicos responsáveis técnicos e certificações de equipamentos.',
    impact: 'negative',
    relevance: 88,
    source: 'Anvisa RDC 2023',
    timeframe: '2024-2025'
  },
  {
    id: 'beleza-trend-5',
    title: 'Turismo Médico Crescente',
    description: 'Brasil recebe pacientes de EUA e Europa para cirurgias plásticas, gerando mercado de US$ 1.5B.',
    impact: 'positive',
    relevance: 75,
    source: 'Medical Tourism Association',
    timeframe: '2024-2027'
  },
  {
    id: 'beleza-trend-6',
    title: 'Redes Sociais Influenciando Demanda',
    description: 'Instagram e TikTok impulsionam demanda por procedimentos, mas também criam expectativas irreais.',
    impact: 'neutral',
    relevance: 85,
    source: 'Meta Business Insights',
    timeframe: '2024-2025'
  }
];

// ======================================
// SETOR: ALOJAMENTO E ALIMENTAÇÃO (Food Service)
// ======================================

export const alimentacaoThreats: MarketThreat[] = [
  {
    id: 'alimentacao-threat-1',
    title: 'Dominância de Apps de Delivery (iFood, Rappi)',
    description: 'Apps cobram comissões de 20-35% e controlam relacionamento com cliente, reduzindo margens e criando dependência.',
    source: 'competitive',
    impact: 5,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Desenvolver canal de delivery próprio',
      'Criar programa de fidelidade para pedidos diretos',
      'Negociar taxas menores com apps',
      'Investir em CRM para relacionamento direto',
      'Diversificar canais (WhatsApp, telefone, site próprio)'
    ]
  },
  {
    id: 'alimentacao-threat-2',
    title: 'Aumento de Custos de Insumos',
    description: 'Inflação de alimentos básicos (carne, óleo, trigo) aumentou 40% em 18 meses, pressionando margens de restaurantes.',
    source: 'economic',
    impact: 5,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Renegociar contratos com fornecedores',
      'Criar menu engineering para melhorar margens',
      'Reduzir desperdício com gestão de estoque',
      'Aumentar preços de forma estratégica',
      'Desenvolver pratos com ingredientes alternativos'
    ]
  },
  {
    id: 'alimentacao-threat-3',
    title: 'Escassez de Mão de Obra Qualificada',
    description: 'Dificuldade em encontrar cozinheiros e garçons qualificados, com alta rotatividade e aumento de custos trabalhistas.',
    source: 'market',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Criar programa de treinamento interno',
      'Oferecer plano de carreira e benefícios atrativos',
      'Implementar tecnologia para reduzir dependência de mão de obra',
      'Estabelecer parceria com escolas de gastronomia',
      'Desenvolver cultura organizacional forte'
    ]
  },
  {
    id: 'alimentacao-threat-4',
    title: 'Dark Kitchens Aumentando Concorrência',
    description: 'Cozinhas fantasma sem espaço físico operam com custo 70% menor, competindo agressivamente via delivery.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Avaliar criação de dark kitchen própria',
      'Reforçar experiência presencial como diferencial',
      'Criar marcas virtuais para delivery',
      'Otimizar operação para reduzir custos',
      'Focar em categorias onde experiência presencial importa'
    ]
  },
  {
    id: 'alimentacao-threat-5',
    title: 'Novas Exigências Sanitárias Pós-Pandemia',
    description: 'Vigilância sanitária mais rigorosa e consumidores exigem protocolos de higiene visíveis, aumentando custos operacionais.',
    source: 'regulatory',
    impact: 3,
    probability: 5,
    timeHorizon: 'short_term',
    suggestedActions: [
      'Implementar protocolos de higiene rigorosos',
      'Treinar equipe em boas práticas',
      'Comunicar medidas de segurança aos clientes',
      'Obter certificações sanitárias avançadas',
      'Investir em equipamentos de higienização'
    ]
  },
  {
    id: 'alimentacao-threat-6',
    title: 'Mudança de Hábitos: Cozinhar em Casa',
    description: 'Pandemia acelerou hábito de cozinhar em casa, com crescimento de meal kits e compras de ingredientes online.',
    source: 'market',
    impact: 3,
    probability: 4,
    timeHorizon: 'medium_term',
    suggestedActions: [
      'Criar linha de produtos para levar para casa',
      'Desenvolver meal kits do restaurante',
      'Oferecer aulas de culinária e experiências',
      'Criar clube de assinatura de pratos prontos',
      'Posicionar restaurante como economia de tempo'
    ]
  },
  {
    id: 'alimentacao-threat-7',
    title: 'Concorrência de Redes de Fast Food',
    description: 'Grandes redes (McDonald\'s, Burger King) investem pesado em delivery e digitalização, competindo por share of wallet.',
    source: 'competitive',
    impact: 4,
    probability: 5,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Reforçar diferenciação (qualidade, localidade, experiência)',
      'Criar itens exclusivos não replicáveis',
      'Investir em relacionamento e comunidade local',
      'Desenvolver marca forte com propósito',
      'Focar em nichos específicos'
    ]
  },
  {
    id: 'alimentacao-threat-8',
    title: 'Reputação Online e Reviews Negativos',
    description: 'Google, TripAdvisor e iFood permitem reviews públicos que afetam diretamente faturamento. Uma nota baixa pode reduzir vendas em 30%.',
    source: 'market',
    impact: 4,
    probability: 4,
    timeHorizon: 'immediate',
    suggestedActions: [
      'Implementar gestão ativa de reputação online',
      'Responder todos os reviews (positivos e negativos)',
      'Criar programa de feedback interno antes de reviews públicos',
      'Incentivar clientes satisfeitos a deixarem reviews',
      'Treinar equipe em excelência no atendimento'
    ]
  }
];

export const alimentacaoOpportunities: MarketOpportunity[] = [
  {
    id: 'alimentacao-opp-1',
    title: 'Alimentação Saudável e Funcional',
    description: 'Mercado de alimentação saudável cresce 20% ao ano. Consumidores buscam opções nutritivas, low carb, veganas e funcionais.',
    source: 'trend',
    potentialValue: 'high',
    timeWindow: 'Imediato',
    requirements: [
      'Desenvolver linha de pratos saudáveis certificados',
      'Criar menu funcional (proteico, low carb, vegano)',
      'Estabelecer parceria com nutricionistas',
      'Comunicar informações nutricionais claras',
      'Investir em ingredientes orgânicos e naturais'
    ],
    estimatedImpact: 'Incremento de 25-35% em faturamento com público health-conscious'
  },
  {
    id: 'alimentacao-opp-2',
    title: 'Dark Kitchen Como Modelo Escalável',
    description: 'Cozinhas fantasma permitem expansão rápida com investimento 70% menor que restaurante tradicional.',
    source: 'technology',
    potentialValue: 'high',
    timeWindow: '6-12 meses',
    requirements: [
      'Identificar localização estratégica para dark kitchen',
      'Desenvolver menu otimizado para delivery',
      'Implementar sistema de gestão de pedidos',
      'Criar marcas virtuais complementares',
      'Investir em marketing digital para apps'
    ],
    estimatedImpact: 'Abertura de 3-5 dark kitchens em 18 meses, gerando R$ 5-8M adicionais'
  },
  {
    id: 'alimentacao-opp-3',
    title: 'Franquias e Expansão Regional',
    description: 'Modelo de franquia permite crescimento rápido aproveitando demanda reprimida em cidades médias.',
    source: 'market_gap',
    potentialValue: 'high',
    timeWindow: '12-18 meses',
    requirements: [
      'Desenvolver modelo de franquia replicável',
      'Criar manual de operações padronizado',
      'Estabelecer central de compras',
      'Implementar sistema de gestão integrado',
      'Desenvolver programa de treinamento'
    ],
    estimatedImpact: '10-15 franquias em 3 anos, gerando royalties de R$ 3-5M'
  },
  {
    id: 'alimentacao-opp-4',
    title: 'Delivery Próprio com Margem Maior',
    description: 'Desenvolver canal próprio de delivery evita comissões de 25-35% dos apps, aumentando margens significativamente.',
    source: 'technology',
    potentialValue: 'high',
    timeWindow: '3-6 meses',
    requirements: [
      'Desenvolver site/app próprio de delivery',
      'Criar programa de fidelidade com benefícios',
      'Contratar frota própria ou terceirizar logística',
      'Investir em marketing para gerar tráfego direto',
      'Implementar CRM para relacionamento'
    ],
    estimatedImpact: '30-40% dos pedidos via canal próprio, aumentando margem em 15-20%'
  },
  {
    id: 'alimentacao-opp-5',
    title: 'Plant-Based e Sustentabilidade',
    description: '45% dos brasileiros buscam reduzir consumo de carne. Mercado plant-based cresce 30% ao ano.',
    source: 'trend',
    potentialValue: 'medium',
    timeWindow: '6-9 meses',
    requirements: [
      'Desenvolver linha de pratos plant-based',
      'Criar parcerias com fornecedores de proteínas vegetais',
      'Comunicar compromisso com sustentabilidade',
      'Obter certificações ambientais',
      'Investir em embalagens biodegradáveis'
    ],
    estimatedImpact: 'Captura de 15-20% de público vegetariano/flexitariano'
  },
  {
    id: 'alimentacao-opp-6',
    title: 'Experiências Gastronômicas e Eventos',
    description: 'Consumidores valorizam experiências únicas. Jantares temáticos, chef\'s table e aulas de culinária geram ticket alto.',
    source: 'trend',
    potentialValue: 'medium',
    timeWindow: '3-6 meses',
    requirements: [
      'Criar calendário de eventos gastronômicos',
      'Desenvolver experiência de chef\'s table',
      'Oferecer aulas de culinária e workshops',
      'Estabelecer parcerias com produtores locais',
      'Investir em marketing de experiências'
    ],
    estimatedImpact: 'Receita adicional de R$ 100-200k/mês com eventos'
  }
];

export const alimentacaoAgendaSuggestions: AgendaSuggestion[] = [
  {
    id: 'alimentacao-agenda-1',
    title: 'Estratégia de Redução de Dependência de Apps de Delivery',
    description: 'Aprovação de investimento em canal próprio de delivery para reduzir comissões e controlar relacionamento com cliente.',
    relatedInsightId: 'alimentacao-threat-1',
    relatedInsightType: 'threat',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'urgent',
    discussionPoints: [
      'Impacto das comissões de 25-35% nas margens',
      'Desenvolvimento de site/app próprio',
      'Programa de fidelidade para canal direto',
      'Investimento em marketing digital',
      'Meta de 30-40% dos pedidos via canal próprio'
    ]
  },
  {
    id: 'alimentacao-agenda-2',
    title: 'Gestão de Aumento de Custos de Insumos',
    description: 'Aprovação de plano de menu engineering e renegociação com fornecedores para proteger margens.',
    relatedInsightId: 'alimentacao-threat-2',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê Financeiro',
    priority: 'urgent',
    discussionPoints: [
      'Análise de inflação de insumos (+40% em 18 meses)',
      'Renegociação com fornecedores',
      'Menu engineering para otimizar margens',
      'Estratégia de aumento de preços',
      'Redução de desperdício'
    ]
  },
  {
    id: 'alimentacao-agenda-3',
    title: 'Lançamento de Linha Saudável e Funcional',
    description: 'Estruturação de menu dedicado a alimentação saudável (low carb, vegano, funcional) para capturar mercado crescente.',
    relatedInsightId: 'alimentacao-opp-1',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Crescimento de 20% ao ano em alimentação saudável',
      'Desenvolvimento de menu funcional',
      'Parceria com nutricionistas',
      'Certificações de qualidade',
      'Projeção de incremento de 25-35% em público health-conscious'
    ]
  },
  {
    id: 'alimentacao-agenda-4',
    title: 'Abertura de Dark Kitchen para Expansão',
    description: 'Avaliação de viabilidade para abertura de cozinha fantasma focada em delivery com investimento reduzido.',
    relatedInsightId: 'alimentacao-opp-2',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'high',
    discussionPoints: [
      'Dark kitchen como modelo de expansão rápida',
      'Investimento 70% menor que restaurante tradicional',
      'Localização estratégica',
      'Criação de marcas virtuais',
      'Meta de 3-5 unidades em 18 meses'
    ]
  },
  {
    id: 'alimentacao-agenda-5',
    title: 'Programa de Retenção de Talentos na Cozinha',
    description: 'Implementação de plano de carreira e benefícios para reduzir turnover de cozinheiros e garçons.',
    relatedInsightId: 'alimentacao-threat-3',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de RH',
    priority: 'high',
    discussionPoints: [
      'Escassez de mão de obra qualificada',
      'Criação de programa de treinamento interno',
      'Plano de carreira estruturado',
      'Benefícios diferenciados',
      'Parceria com escolas de gastronomia'
    ]
  },
  {
    id: 'alimentacao-agenda-6',
    title: 'Estratégia de Posicionamento frente a Dark Kitchens',
    description: 'Aprovação de plano para competir com cozinhas fantasma reforçando experiência presencial.',
    relatedInsightId: 'alimentacao-threat-4',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Marketing',
    priority: 'medium',
    discussionPoints: [
      'Ameaça de dark kitchens operando com custo 70% menor',
      'Reforço da experiência presencial como diferencial',
      'Criação de marcas virtuais próprias',
      'Avaliação de dark kitchen própria',
      'Otimização de custos operacionais'
    ]
  },
  {
    id: 'alimentacao-agenda-7',
    title: 'Estudo de Viabilidade: Modelo de Franquia',
    description: 'Avaliação de expansão via franquia para crescimento rápido em cidades médias.',
    relatedInsightId: 'alimentacao-opp-3',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'conselho',
    organName: 'Conselho de Administração',
    priority: 'medium',
    discussionPoints: [
      'Potencial de crescimento via franquia',
      'Desenvolvimento de modelo replicável',
      'Manual de operações padronizado',
      'Central de compras',
      'Meta de 10-15 franquias em 3 anos'
    ]
  },
  {
    id: 'alimentacao-agenda-8',
    title: 'Lançamento de Linha Plant-Based',
    description: 'Estruturação de menu plant-based para capturar público vegetariano e flexitariano em crescimento.',
    relatedInsightId: 'alimentacao-opp-5',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Inovação',
    priority: 'medium',
    discussionPoints: [
      'Crescimento de 30% ao ano em plant-based',
      '45% dos brasileiros reduzindo consumo de carne',
      'Desenvolvimento de pratos vegetais',
      'Parcerias com fornecedores',
      'Comunicação de sustentabilidade'
    ]
  },
  {
    id: 'alimentacao-agenda-9',
    title: 'Programa de Gestão de Reputação Online',
    description: 'Implementação de sistema de monitoramento e resposta a reviews em Google, TripAdvisor e iFood.',
    relatedInsightId: 'alimentacao-threat-8',
    relatedInsightType: 'threat',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Qualidade',
    priority: 'high',
    discussionPoints: [
      'Impacto de reviews negativos (redução de 30% em vendas)',
      'Implementação de gestão ativa de reputação',
      'Protocolo de resposta a reviews',
      'Programa de feedback interno',
      'Treinamento de equipe em excelência'
    ]
  },
  {
    id: 'alimentacao-agenda-10',
    title: 'Criação de Experiências Gastronômicas Premium',
    description: 'Estruturação de calendário de eventos, chef\'s table e aulas de culinária para gerar receita adicional.',
    relatedInsightId: 'alimentacao-opp-6',
    relatedInsightType: 'opportunity',
    suggestedOrgan: 'comite',
    organName: 'Comitê de Marketing',
    priority: 'medium',
    discussionPoints: [
      'Demanda por experiências gastronômicas únicas',
      'Criação de calendário de eventos temáticos',
      'Desenvolvimento de chef\'s table',
      'Aulas de culinária e workshops',
      'Projeção de R$ 100-200k/mês em eventos'
    ]
  }
];

export const alimentacaoCompetitors: CompetitorInsight[] = [
  {
    id: 'alimentacao-comp-1',
    name: 'iFood',
    recentMove: 'Lançou programa de fidelidade iFood Card com cashback e benefícios, capturando ainda mais o relacionamento com consumidores.',
    threatLevel: 'high',
    opportunityFromWeakness: 'iFood cobra comissões altas. Desenvolver canal próprio para reduzir dependência.',
    marketShare: '~80% do mercado de delivery via apps'
  },
  {
    id: 'alimentacao-comp-2',
    name: 'Outback Steakhouse',
    recentMove: 'Investiu R$ 50M em digitalização e delivery próprio, reduzindo dependência de apps e aumentando margens.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Outback é rede grande e burocrática. Podemos ser mais ágeis em inovação de menu.',
    marketShare: '~5% do mercado de casual dining'
  },
  {
    id: 'alimentacao-comp-3',
    name: 'Madero',
    recentMove: 'Lançou modelo de franquia acelerado, abrindo 50 unidades em 18 meses com investimento de R$ 1.5M por loja.',
    threatLevel: 'high',
    opportunityFromWeakness: 'Madero tem posicionamento premium mas qualidade inconsistente. Foco em excelência operacional.',
    marketShare: '~3% do mercado de hamburgueria premium'
  },
  {
    id: 'alimentacao-comp-4',
    name: 'Habib\'s',
    recentMove: 'Criou dark kitchens dedicadas e marcas virtuais (pizzas, lanches), operando com custo 60% menor.',
    threatLevel: 'high',
    opportunityFromWeakness: 'Habib\'s tem posicionamento popular. Podemos focar em qualidade e ingredientes premium.',
    marketShare: '~7% do mercado de fast food'
  },
  {
    id: 'alimentacao-comp-5',
    name: 'Spoleto',
    recentMove: 'Expandiu para alimentação saudável e funcional, lançando linha low carb e vegana com sucesso.',
    threatLevel: 'medium',
    opportunityFromWeakness: 'Spoleto limitado a massa. Podemos ter menu mais variado e sofisticado.',
    marketShare: '~4% do mercado de fast casual'
  }
];

export const alimentacaoSectorTrends: SectorTrend[] = [
  {
    id: 'alimentacao-trend-1',
    title: 'Crescimento de Alimentação Saudável',
    description: 'Mercado de comida saudável cresce 20% ao ano com demanda por low carb, vegano e funcional.',
    impact: 'positive',
    relevance: 95,
    source: 'Food Trends Brasil 2024',
    timeframe: '2024-2027'
  },
  {
    id: 'alimentacao-trend-2',
    title: 'Domínio dos Apps de Delivery',
    description: 'iFood controla 80% do mercado de delivery, cobrando comissões de 25-35% e reduzindo margens.',
    impact: 'negative',
    relevance: 92,
    source: 'ABF (Associação Brasileira de Franchising)',
    timeframe: '2024-2025'
  },
  {
    id: 'alimentacao-trend-3',
    title: 'Expansão de Dark Kitchens',
    description: 'Cozinhas fantasma crescem 40% ao ano, operando apenas para delivery com custos 70% menores.',
    impact: 'negative',
    relevance: 88,
    source: 'Euromonitor Food Service',
    timeframe: '2024-2026'
  },
  {
    id: 'alimentacao-trend-4',
    title: 'Inflação de Insumos',
    description: 'Custos de alimentos básicos aumentaram 40% em 18 meses, pressionando margens de restaurantes.',
    impact: 'negative',
    relevance: 90,
    source: 'IPCA Alimentos (IBGE)',
    timeframe: '2024-2025'
  },
  {
    id: 'alimentacao-trend-5',
    title: 'Demanda por Experiências Gastronômicas',
    description: 'Consumidores valorizam experiências únicas: chef\'s table, jantares temáticos, aulas de culinária.',
    impact: 'positive',
    relevance: 82,
    source: 'McKinsey Consumer Trends',
    timeframe: '2024-2026'
  },
  {
    id: 'alimentacao-trend-6',
    title: 'Plant-Based em Alta',
    description: '45% dos brasileiros reduzindo consumo de carne. Mercado plant-based cresce 30% ao ano.',
    impact: 'positive',
    relevance: 85,
    source: 'Good Food Institute Brazil',
    timeframe: '2024-2027'
  }
];

// ======================================
// MAPEAMENTO DE DADOS POR SETOR
// ======================================

export const sectorDataMap: Record<string, {
  threats: MarketThreat[];
  opportunities: MarketOpportunity[];
  agendaSuggestions: AgendaSuggestion[];
  competitors: CompetitorInsight[];
  sectorTrends: SectorTrend[];
  defaultContext: Partial<CompanyContext>;
}> = {
  'Comércio - Varejo': {
    threats: mockThreats,
    opportunities: mockOpportunities,
    agendaSuggestions: mockAgendaSuggestions,
    competitors: mockCompetitors,
    sectorTrends: mockSectorTrends,
    defaultContext: {
      sector: 'Comércio - Varejo',
      segment: 'Varejo de Moda Feminina',
      mainCompetitors: ['Renner', 'C&A', 'Riachuelo', 'Zara', 'Shein'],
      strategicKeywords: ['omnichannel', 'fast fashion', 'sustentabilidade', 'marketplace', 'social commerce']
    }
  },
  'Serviços de Informação e Comunicação': {
    threats: servicosThreats,
    opportunities: servicosOpportunities,
    agendaSuggestions: servicosAgendaSuggestions,
    competitors: servicosCompetitors,
    sectorTrends: servicosSectorTrends,
    defaultContext: {
      sector: 'Serviços de Informação e Comunicação',
      segment: 'Consultoria Empresarial',
      mainCompetitors: ['McKinsey', 'BCG', 'Bain', 'Accenture', 'Deloitte'],
      strategicKeywords: ['transformação digital', 'IA', 'ESG', 'consultoria estratégica', 'implementação']
    }
  },
  'Saúde e Assistência Social': {
    threats: belezaThreats,
    opportunities: belezaOpportunities,
    agendaSuggestions: belezaAgendaSuggestions,
    competitors: belezaCompetitors,
    sectorTrends: belezaSectorTrends,
    defaultContext: {
      sector: 'Saúde e Assistência Social',
      segment: 'Clínicas de Estética',
      mainCompetitors: ['Dr. Consulta', 'Emagrecentro', 'Onodera', 'Beleza Natural', 'Espaço Laser'],
      strategicKeywords: ['harmonização facial', 'não-invasivo', 'estética masculina', 'turismo médico', 'bioestimulação']
    }
  },
  'Alojamento e Alimentação': {
    threats: alimentacaoThreats,
    opportunities: alimentacaoOpportunities,
    agendaSuggestions: alimentacaoAgendaSuggestions,
    competitors: alimentacaoCompetitors,
    sectorTrends: alimentacaoSectorTrends,
    defaultContext: {
      sector: 'Alojamento e Alimentação',
      segment: 'Food Service / Restaurantes',
      mainCompetitors: ['iFood', 'Outback', 'Madero', 'Habib\'s', 'Spoleto'],
      strategicKeywords: ['delivery próprio', 'dark kitchen', 'alimentação saudável', 'plant-based', 'experiências gastronômicas']
    }
  }
};
