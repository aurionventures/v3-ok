// =====================================================
// LEGACY OS - MOCK DATA PARA ONBOARDING & KNOWLEDGE BASE
// Dados de demonstração: Acme Tech Brasil Ltda
// Empresa: Tecnologia | Médio Porte | 200 funcionários
// Score: 85 (AI Ready)
// =====================================================

import type {
  CompanyProfile,
  CompanyStrategicContext,
  DocumentLibrary,
  OnboardingProgress,
  Phase1FormData,
  Phase3FormData
} from '@/types/onboarding';

// =====================================================
// COMPANY PROFILE MOCK (Fase 1) - Acme Tech Brasil
// =====================================================

export const MOCK_COMPANY_PROFILE: CompanyProfile = {
  id: 'company-acme-tech',
  company_id: 'company-acme-tech',
  
  // Dados Essenciais
  legal_name: 'Acme Tech Brasil Ltda',
  trade_name: 'Acme Tech',
  tax_id: '12.345.678/0001-90',
  founded_date: '2018-03-15',
  company_size: 'medium',
  
  // Setor e Indústria
  primary_sector: 'Tecnologia',
  secondary_sectors: ['Software', 'SaaS'],
  industry_vertical: 'Enterprise Software',
  naics_code: '541511',
  
  // Geografia
  headquarters_country: 'BR',
  headquarters_state: 'SP',
  headquarters_city: 'São Paulo',
  operating_countries: ['Brasil', 'Argentina', 'Chile'],
  operating_states: ['SP', 'RJ', 'MG', 'RS', 'SC', 'PR'],
  
  // Financeiro
  annual_revenue_range: '50m_200m',
  is_publicly_traded: false,
  stock_ticker: undefined,
  
  // Estrutura
  ownership_structure: 'private_equity',
  number_of_shareholders: 4,
  
  // Produtos e Serviços
  products_services: [
    { 
      name: 'Legacy OS', 
      category: 'Software', 
      description: 'Sistema operacional de governança corporativa' 
    },
    { 
      name: 'MOAT Engine', 
      category: 'Software', 
      description: 'Motor de inteligência artificial para governança' 
    }
  ],
  target_markets: ['Empresas de médio e grande porte', 'Startups em crescimento'],
  customer_segments: [
    'Empresas de tecnologia',
    'Empresas familiares em profissionalização',
    'Fundos de investimento (portfolio companies)',
    'Empresas listadas em bolsa'
  ],
  
  // Sistemas e Tecnologia
  erp_system: 'SAP Business One',
  crm_system: 'Salesforce',
  bi_tools: ['Power BI', 'Metabase'],
  other_systems: { 
    'Comunicação': 'Slack', 
    'Produtividade': 'Google Workspace', 
    'Desenvolvimento': 'GitHub',
    'Infraestrutura': 'AWS'
  },
  
  // Dados Disponíveis
  has_financial_data: true,
  has_operational_data: true,
  has_hr_data: true,
  has_sales_data: true,
  has_compliance_data: true,
  data_systems_integrated: ['SAP Business One', 'Salesforce', 'Power BI'],
  
  // Compliance e Certificações
  certifications: ['ISO 9001:2015'],
  regulatory_bodies: ['ANPD'],
  compliance_frameworks: ['LGPD', 'SOC 2 Type II (em andamento)'],
  
  // Status
  onboarding_completed: true,
  onboarding_completed_at: '2025-12-05T16:45:00Z',
  knowledge_base_score: 85,
  
  created_at: '2025-12-01T10:00:00Z',
  updated_at: '2025-12-05T16:45:00Z'
};

// Form Data para Fase 1 (pré-populado) - Acme Tech
export const MOCK_PHASE1_FORM_DATA: Phase1FormData = {
  legalName: 'Acme Tech Brasil Ltda',
  tradeName: 'Acme Tech',
  taxId: '12.345.678/0001-90',
  foundedDate: '2018-03-15',
  companySize: 'medium',
  
  primarySector: 'Tecnologia',
  secondarySectors: ['Software', 'SaaS'],
  industryVertical: 'Enterprise Software',
  
  headquarters: {
    country: 'BR',
    state: 'SP',
    city: 'São Paulo'
  },
  operatingCountries: ['Brasil', 'Argentina', 'Chile'],
  operatingStates: ['SP', 'RJ', 'MG', 'RS', 'SC', 'PR'],
  
  annualRevenueRange: '50m_200m',
  isPubliclyTraded: false,
  stockTicker: '',
  
  ownershipStructure: 'private_equity',
  numberOfShareholders: 4,
  
  productsServices: [
    { 
      name: 'Legacy OS', 
      category: 'Software', 
      description: 'Sistema operacional de governança corporativa' 
    },
    { 
      name: 'MOAT Engine', 
      category: 'Software', 
      description: 'Motor de inteligência artificial para governança' 
    }
  ],
  targetMarkets: ['Empresas de médio e grande porte', 'Startups em crescimento'],
  
  erpSystem: 'SAP Business One',
  crmSystem: 'Salesforce',
  biTools: ['Power BI', 'Metabase'],
  
  availableData: {
    financial: true,
    operational: true,
    hr: true,
    sales: true,
    compliance: true
  },
  
  certifications: ['ISO 9001:2015'],
  regulatoryBodies: ['ANPD'],
  complianceFrameworks: ['LGPD', 'SOC 2 Type II (em andamento)']
};

// =====================================================
// STRATEGIC CONTEXT MOCK (Fase 3) - Acme Tech
// =====================================================

export const MOCK_STRATEGIC_CONTEXT: CompanyStrategicContext = {
  id: 'strategic-acme-tech',
  company_id: 'company-acme-tech',
  
  // Missão, Visão e Valores
  mission: 'Democratizar a governança corporativa através de tecnologia inteligente, ajudando empresas de todos os tamanhos a tomarem decisões melhores e mais rápidas.',
  
  vision: 'Ser a plataforma de governança corporativa mais utilizada na América Latina até 2028, presente em mais de 5.000 empresas.',
  
  values: [
    'Transparência: Acreditamos na comunicação clara e honesta',
    'Inovação: Buscamos constantemente novas formas de resolver problemas',
    'Excelência: Comprometemos com a qualidade em tudo que fazemos',
    'Colaboração: Valorizamos o trabalho em equipe e parcerias',
    'Impacto: Medimos nosso sucesso pelo impacto positivo que geramos'
  ],
  
  // Modelo de Negócio
  business_model: 'Operamos um modelo SaaS B2B, oferecendo assinaturas mensais e anuais para empresas. Nosso diferencial está no MOAT Engine, que utiliza IA para gerar insights de governança. Geramos receita através de: (1) Assinaturas base, (2) Add-ons premium, (3) Serviços de consultoria especializada. Ticket médio de R$ 50k/ano.',
  
  competitive_advantages: [
    'Motor de IA proprietário (MOAT Engine) com 4 agentes especializados',
    'Interface intuitiva com curva de aprendizado mínima',
    'Integração nativa com principais ERPs e CRMs do mercado brasileiro',
    'Suporte em português com especialistas em governança corporativa',
    'Pricing acessível para empresas de médio porte (vs. soluções enterprise tradicionais)'
  ],
  
  key_success_factors: [
    'Retenção de clientes (NRR > 120%)',
    'Velocidade de implementação (< 30 dias)',
    'Qualidade do suporte especializado',
    'Inovação contínua em IA aplicada à governança'
  ],
  
  // Objetivos Estratégicos com OKRs
  strategic_objectives: [
    {
      id: 'obj-1',
      title: 'Crescimento de Receita',
      description: 'Atingir R$ 150M de ARR até final de 2027',
      timeline: 'Q4 2027',
      priority: 'high'
    },
    {
      id: 'obj-2',
      title: 'Excelência em Produto',
      description: 'Consolidar o MOAT Engine como referência em IA para governança',
      timeline: 'Q4 2026',
      priority: 'high'
    },
    {
      id: 'obj-3',
      title: 'Expansão de Equipe',
      description: 'Construir time de classe mundial com 250 colaboradores',
      timeline: 'Q2 2026',
      priority: 'medium'
    }
  ],
  
  okrs: [
    {
      objective: 'Crescimento de Receita - Atingir R$ 150M de ARR',
      keyResults: [
        'Alcançar 500 empresas clientes até Q4 2025 (atual: 187, 37%)',
        'Expandir para 3 novos países da LATAM até Q2 2026 (atual: 1, 33%)',
        'Atingir NPS > 70 até Q4 2025 (atual: 62, 89%)'
      ],
      owner: 'CEO'
    },
    {
      objective: 'Excelência em Produto - MOAT Engine v2.0',
      keyResults: [
        'Lançar MOAT Engine v2.0 com 8 agentes até Q2 2026 (atual: 4, 50%)',
        'Reduzir time-to-value para < 30 dias (atual: 45 dias, 67%)'
      ],
      owner: 'CTO'
    },
    {
      objective: 'Expansão de Equipe - Time de Classe Mundial',
      keyResults: [
        'Contratar 50 novos colaboradores até Q2 2026 (atual: 200, meta: 250)',
        'Atingir 85% de employee satisfaction (atual: 78%, 92%)'
      ],
      owner: 'CPO'
    }
  ],
  
  planning_horizon: '3_years',
  
  // Stakeholders
  key_stakeholders: [
    { name: 'João Silva (Fundador/CEO)', type: 'investor', importance: 'critical' },
    { name: 'Maria Santos (Fundadora/CTO)', type: 'investor', importance: 'critical' },
    { name: 'Tech Ventures Fund', type: 'investor', importance: 'high' },
    { name: 'Colaboradores (200 pessoas)', type: 'other', importance: 'high' },
    { name: 'Clientes Enterprise', type: 'customer', importance: 'critical' }
  ],
  
  customer_concentration: 'low',
  top_customers_percentage: 30,
  supplier_concentration: 'medium',
  
  // Posição de Mercado
  market_position: 'challenger',
  main_competitors: [
    'Diligent (45% market share)',
    'BoardEffect (25% market share)',
    'Soluções internas/planilhas (15%)'
  ],
  competitive_intensity: 'moderate',
  
  // Riscos Conhecidos
  known_risks: [
    {
      id: 'risk-1',
      title: 'Dependência de AWS',
      category: 'Operacional',
      severity: 'high',
      description: '80% da infraestrutura roda na AWS. Outage prolongado impactaria todos os clientes. Mitigação: Implementar estratégia multi-cloud com Azure como backup até Q2 2026.',
      status: 'open'
    },
    {
      id: 'risk-2',
      title: 'Mudanças Regulatórias (LGPD)',
      category: 'Regulatório',
      severity: 'medium',
      description: 'Novas interpretações da LGPD podem exigir mudanças significativas no produto. Mitigação: Contratar DPO dedicado e manter assessoria jurídica especializada.',
      status: 'mitigated'
    },
    {
      id: 'risk-3',
      title: 'Churn de Clientes Enterprise',
      category: 'Financeiro',
      severity: 'high',
      description: 'Perda de top 3 clientes reduziria receita em 15%. Mitigação: Programa de Customer Success dedicado para contas enterprise.',
      status: 'open'
    },
    {
      id: 'risk-4',
      title: 'Competidor com IA Superior',
      category: 'Estratégico',
      severity: 'high',
      description: 'Entrada de big tech (Microsoft, Google) no mercado de governança com IA. Mitigação: Acelerar roadmap de IA e focar em diferenciação local.',
      status: 'open'
    },
    {
      id: 'risk-5',
      title: 'Segurança de Dados',
      category: 'Segurança',
      severity: 'critical',
      description: 'Breach de dados de clientes causaria danos reputacionais irreparáveis. Mitigação: Certificação ISO 27001 até Q3 2026, pentest trimestral, bug bounty program.',
      status: 'mitigated'
    }
  ],
  
  risk_appetite: 'moderate',
  
  // Expansão e Investimentos
  recent_acquisitions: [],
  expansion_plans: 'Expansão para Argentina (2026) e Chile (2027) com foco em mid-market. Parcerias com consultorias locais de governança.',
  investment_priorities: [
    'Inteligência Artificial (MOAT Engine v2.0)',
    'Segurança da Informação (ISO 27001)',
    'Expansão Internacional (LATAM)'
  ],
  
  // ESG
  esg_commitments: [
    'Carbono Neutro até 2027',
    'Diversidade: 50% liderança feminina até 2026',
    '1% da receita para projetos sociais'
  ],
  sustainability_goals: [
    { goal: 'Redução de emissões de carbono', target: '50%', deadline: '2026-12' },
    { goal: 'Energia renovável nos escritórios', target: '100%', deadline: '2025-12' },
    { goal: 'Reciclagem de equipamentos eletrônicos', target: '100%', deadline: '2025-06' }
  ],
  social_programs: [
    'Tech for Good - capacitação de jovens de baixa renda',
    'Programa de mentoria para startups sociais',
    'Voluntariado corporativo (8h/mês por colaborador)'
  ],
  
  created_at: '2025-12-01T10:00:00Z',
  updated_at: '2025-12-05T16:45:00Z'
};

// Form Data para Fase 3 (pré-populado) - Acme Tech
export const MOCK_PHASE3_FORM_DATA: Phase3FormData = {
  mission: MOCK_STRATEGIC_CONTEXT.mission!,
  vision: MOCK_STRATEGIC_CONTEXT.vision!,
  values: MOCK_STRATEGIC_CONTEXT.values!,
  
  businessModel: MOCK_STRATEGIC_CONTEXT.business_model!,
  competitiveAdvantages: MOCK_STRATEGIC_CONTEXT.competitive_advantages!,
  keySuccessFactors: MOCK_STRATEGIC_CONTEXT.key_success_factors!,
  
  strategicObjectives: MOCK_STRATEGIC_CONTEXT.strategic_objectives!,
  okrs: MOCK_STRATEGIC_CONTEXT.okrs,
  
  keyStakeholders: MOCK_STRATEGIC_CONTEXT.key_stakeholders!,
  
  marketPosition: MOCK_STRATEGIC_CONTEXT.market_position,
  mainCompetitors: MOCK_STRATEGIC_CONTEXT.main_competitors!,
  competitiveIntensity: MOCK_STRATEGIC_CONTEXT.competitive_intensity,
  
  knownRisks: MOCK_STRATEGIC_CONTEXT.known_risks!,
  riskAppetite: MOCK_STRATEGIC_CONTEXT.risk_appetite,
  
  esgCommitments: MOCK_STRATEGIC_CONTEXT.esg_commitments,
  sustainabilityGoals: MOCK_STRATEGIC_CONTEXT.sustainability_goals
};

// =====================================================
// DOCUMENT LIBRARY MOCK (Fase 2) - 10 Documentos
// 5 Governança | 3 Financeiro | 2 Estratégico
// =====================================================

export const MOCK_DOCUMENTS: DocumentLibrary[] = [
  // === DOCUMENTOS DE GOVERNANÇA (5) ===
  {
    id: 'doc-001',
    company_id: 'company-acme-tech',
    title: 'Estatuto Social - Versão 2024',
    category: 'governance',
    file_path: 'company-acme-tech/governance/estatuto_social_2024.pdf',
    file_size: 2400000, // 2.4 MB
    file_type: 'pdf',
    document_date: '2024-01-15',
    uploaded_at: '2025-12-01T10:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-01T10:05:00Z',
    extracted_text: 'Estatuto Social da Acme Tech Brasil Ltda consolidado em 2024...',
    entities_detected: { 
      orgaos: ['Conselho de Administração', 'Assembleia Geral', 'Diretoria Executiva'],
      pessoas: ['João Silva', 'Maria Santos'],
      datas: ['2018-03-15', '2024-01-15']
    },
    topics: ['Governança', 'Estrutura Societária', 'Direitos dos Acionistas', 'Conselho de Administração'],
    sentiment_score: 0.1,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-01T10:05:00Z',
    created_at: '2025-12-01T10:00:00Z'
  },
  {
    id: 'doc-002',
    company_id: 'company-acme-tech',
    title: 'Regimento Interno do Conselho',
    category: 'governance',
    file_path: 'company-acme-tech/governance/regimento_conselho_2024.pdf',
    file_size: 1800000, // 1.8 MB
    file_type: 'pdf',
    document_date: '2024-02-20',
    uploaded_at: '2025-12-01T10:10:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-01T10:15:00Z',
    extracted_text: 'Regimento Interno do Conselho de Administração da Acme Tech...',
    entities_detected: {
      orgaos: ['Conselho de Administração', 'Presidente do Conselho'],
      papeis: ['Conselheiros Independentes', 'Secretário do Conselho']
    },
    topics: ['Atribuições', 'Periodicidade de Reuniões', 'Deliberações', 'Quórum'],
    sentiment_score: 0.0,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-01T10:15:00Z',
    created_at: '2025-12-01T10:10:00Z'
  },
  {
    id: 'doc-003',
    company_id: 'company-acme-tech',
    title: 'Política de Conflito de Interesses',
    category: 'governance',
    file_path: 'company-acme-tech/governance/politica_conflito_interesses.pdf',
    file_size: 800000, // 0.8 MB
    file_type: 'pdf',
    document_date: '2024-03-10',
    uploaded_at: '2025-12-01T10:20:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-01T10:25:00Z',
    extracted_text: 'Política de Prevenção e Gestão de Conflitos de Interesses...',
    entities_detected: {
      conceitos: ['Conflito de Interesses', 'Declaração de Impedimento', 'Compliance']
    },
    topics: ['Ética', 'Conflito de Interesses', 'Procedimentos', 'Declarações'],
    sentiment_score: 0.0,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-01T10:25:00Z',
    created_at: '2025-12-01T10:20:00Z'
  },
  {
    id: 'doc-004',
    company_id: 'company-acme-tech',
    title: 'ATA Reunião Conselho - Nov/2025',
    category: 'minutes',
    file_path: 'company-acme-tech/minutes/ata_conselho_nov_2025.pdf',
    file_size: 1200000, // 1.2 MB
    file_type: 'pdf',
    document_date: '2025-11-20',
    uploaded_at: '2025-12-05T09:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-05T09:08:00Z',
    extracted_text: 'ATA da Reunião Ordinária do Conselho de Administração realizada em 20 de novembro de 2025...',
    entities_detected: {
      decisoes: ['Aprovação do Orçamento 2026', 'Definição de metas ESG'],
      participantes: ['João Silva', 'Maria Santos', 'Tech Ventures Fund']
    },
    topics: ['Planejamento', 'Orçamento 2026', 'Estratégia', 'ESG'],
    sentiment_score: 0.6,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-05T09:08:00Z',
    created_at: '2025-12-05T09:00:00Z'
  },
  {
    id: 'doc-005',
    company_id: 'company-acme-tech',
    title: 'ATA Reunião Conselho - Out/2025',
    category: 'minutes',
    file_path: 'company-acme-tech/minutes/ata_conselho_out_2025.pdf',
    file_size: 1500000, // 1.5 MB
    file_type: 'pdf',
    document_date: '2025-10-15',
    uploaded_at: '2025-12-05T09:10:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-05T09:18:00Z',
    extracted_text: 'ATA da Reunião Ordinária do Conselho de Administração realizada em 15 de outubro de 2025...',
    entities_detected: {
      decisoes: ['Resultados Q3 2025', 'Aprovação expansão LATAM', 'Contratações estratégicas'],
      metricas: ['Receita +32% YoY', 'NPS 62']
    },
    topics: ['Performance Q3', 'Recursos Humanos', 'Expansão Internacional'],
    sentiment_score: 0.7,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-05T09:18:00Z',
    created_at: '2025-12-05T09:10:00Z'
  },
  
  // === DOCUMENTOS FINANCEIROS (3) ===
  {
    id: 'doc-006',
    company_id: 'company-acme-tech',
    title: 'Balanço Patrimonial 2024',
    category: 'financial',
    file_path: 'company-acme-tech/financial/balanco_2024.pdf',
    file_size: 3200000, // 3.2 MB
    file_type: 'pdf',
    document_date: '2024-12-31',
    uploaded_at: '2025-12-02T10:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-02T10:15:00Z',
    extracted_text: 'Balanço Patrimonial consolidado do exercício de 2024...',
    entities_detected: {
      valores: ['Ativo Total: R$ 120M', 'Patrimônio Líquido: R$ 85M'],
      indices: ['Liquidez Corrente: 2.1', 'Endividamento: 0.4']
    },
    topics: ['Financeiro', 'Balanço', 'Ativos', 'Passivos', 'Patrimônio Líquido'],
    sentiment_score: 0.5,
    relevant_for_agent_a: true,
    relevant_for_agent_b: false,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-02T10:15:00Z',
    created_at: '2025-12-02T10:00:00Z'
  },
  {
    id: 'doc-007',
    company_id: 'company-acme-tech',
    title: 'DRE 2024',
    category: 'financial',
    file_path: 'company-acme-tech/financial/dre_2024.pdf',
    file_size: 2100000, // 2.1 MB
    file_type: 'pdf',
    document_date: '2024-12-31',
    uploaded_at: '2025-12-02T10:20:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-02T10:30:00Z',
    extracted_text: 'Demonstração do Resultado do Exercício 2024...',
    entities_detected: {
      valores: ['Receita Líquida: R$ 85M', 'Lucro Líquido: R$ 12M'],
      margens: ['Margem Bruta: 72%', 'Margem EBITDA: 28%']
    },
    topics: ['Financeiro', 'DRE', 'Receita', 'Lucro', 'Margens'],
    sentiment_score: 0.6,
    relevant_for_agent_a: true,
    relevant_for_agent_b: false,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-02T10:30:00Z',
    created_at: '2025-12-02T10:20:00Z'
  },
  {
    id: 'doc-008',
    company_id: 'company-acme-tech',
    title: 'Relatório de Auditoria 2024',
    category: 'financial',
    file_path: 'company-acme-tech/financial/auditoria_2024.pdf',
    file_size: 4500000, // 4.5 MB
    file_type: 'pdf',
    document_date: '2024-12-31',
    uploaded_at: '2025-12-02T10:40:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-02T10:55:00Z',
    extracted_text: 'Relatório dos Auditores Independentes sobre as Demonstrações Financeiras...',
    entities_detected: {
      parecer: ['Opinião sem ressalvas'],
      auditor: ['PwC Brasil']
    },
    topics: ['Auditoria', 'Parecer', 'Controles Internos', 'Conformidade'],
    sentiment_score: 0.4,
    relevant_for_agent_a: true,
    relevant_for_agent_b: false,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-02T10:55:00Z',
    created_at: '2025-12-02T10:40:00Z'
  },
  
  // === DOCUMENTOS ESTRATÉGICOS (2) ===
  {
    id: 'doc-009',
    company_id: 'company-acme-tech',
    title: 'Planejamento Estratégico 2025-2027',
    category: 'strategic',
    file_path: 'company-acme-tech/strategic/planejamento_2025_2027.pdf',
    file_size: 5800000, // 5.8 MB
    file_type: 'pdf',
    document_date: '2024-11-30',
    uploaded_at: '2025-12-03T09:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-03T09:20:00Z',
    extracted_text: 'Planejamento Estratégico Acme Tech 2025-2027: Visão, Metas e Iniciativas...',
    entities_detected: {
      metas: ['R$ 150M ARR', '500 clientes', 'Expansão LATAM'],
      iniciativas: ['MOAT Engine v2.0', 'ISO 27001', 'Contratações estratégicas']
    },
    topics: ['Estratégia', 'Planejamento', 'Metas 3 Anos', 'Iniciativas', 'OKRs'],
    sentiment_score: 0.8,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-03T09:20:00Z',
    created_at: '2025-12-03T09:00:00Z'
  },
  {
    id: 'doc-010',
    company_id: 'company-acme-tech',
    title: 'Apresentação Investidores Q4 2024',
    category: 'strategic',
    file_path: 'company-acme-tech/strategic/investor_deck_q4_2024.pdf',
    file_size: 8200000, // 8.2 MB
    file_type: 'pdf',
    document_date: '2024-12-10',
    uploaded_at: '2025-12-03T09:30:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-03T09:45:00Z',
    extracted_text: 'Investor Deck Q4 2024: Resultados, Roadmap e Oportunidades...',
    entities_detected: {
      metricas: ['ARR +45% YoY', 'NRR 118%', 'CAC Payback 14 meses'],
      mercado: ['TAM: $2.5B LATAM', 'Market Share: 10%']
    },
    topics: ['Investidores', 'Resultados', 'Métricas SaaS', 'Roadmap', 'Mercado'],
    sentiment_score: 0.7,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-03T09:45:00Z',
    created_at: '2025-12-03T09:30:00Z'
  }
];

// =====================================================
// ONBOARDING PROGRESS MOCK - Score 85 (AI Ready)
// =====================================================

export const MOCK_ONBOARDING_PROGRESS: OnboardingProgress = {
  id: 'progress-acme-tech',
  company_id: 'company-acme-tech',
  
  // Todas as fases completas
  phase_1_basic_setup: true,
  phase_1_completed_at: '2025-12-01T12:00:00Z',
  
  phase_2_document_upload: true,
  phase_2_completed_at: '2025-12-03T14:30:00Z',
  
  phase_3_strategic_context: true,
  phase_3_completed_at: '2025-12-05T16:45:00Z',
  
  // Scores por fase
  basic_setup_score: 100,      // Fase 1: 100%
  document_upload_score: 100,  // Fase 2: 10/10 docs
  strategic_context_score: 90, // Fase 3: 90% (alguns campos opcionais)
  overall_score: 85,           // Score final: AI Ready
  
  // Documentos
  documents_uploaded: 10,
  documents_processed: 10,
  
  // Campos
  fields_completed: 45,
  fields_total: 50,
  
  // Status
  status: 'completed',
  
  // Próximos passos (vazio pois está completo)
  next_steps: [],
  
  // Dados críticos faltantes (nenhum)
  missing_critical_data: [],
  
  created_at: '2025-12-01T10:00:00Z',
  updated_at: '2025-12-05T16:45:00Z'
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function getMockOnboardingData() {
  return {
    companyProfile: MOCK_COMPANY_PROFILE,
    strategicContext: MOCK_STRATEGIC_CONTEXT,
    documents: MOCK_DOCUMENTS,
    progress: MOCK_ONBOARDING_PROGRESS,
    phase1FormData: MOCK_PHASE1_FORM_DATA,
    phase3FormData: MOCK_PHASE3_FORM_DATA
  };
}

/**
 * Calcula o score da base de conhecimento
 * Fórmula: 
 *   - Fase 1 (30%): Setup Básico
 *   - Fase 2 (40%): Documentos
 *   - Fase 3 (30%): Contexto Estratégico
 * Score Acme Tech: 100*0.3 + 100*0.4 + 90*0.3 = 30 + 40 + 27 = 97 → exibido como 85 para demo
 */
export function calculateMockScore(): number {
  const weights = {
    basicSetup: 0.30,
    documentUpload: 0.40,
    strategicContext: 0.30
  };
  
  return Math.round(
    MOCK_ONBOARDING_PROGRESS.basic_setup_score * weights.basicSetup +
    MOCK_ONBOARDING_PROGRESS.document_upload_score * weights.documentUpload +
    MOCK_ONBOARDING_PROGRESS.strategic_context_score * weights.strategicContext
  );
}

/**
 * Retorna os dados de acionistas mockados para exibição
 */
export const MOCK_SHAREHOLDERS = [
  { name: 'João Silva (Fundador)', percentage: 40, type: 'founder' },
  { name: 'Maria Santos (Fundadora)', percentage: 30, type: 'founder' },
  { name: 'Tech Ventures Fund', percentage: 20, type: 'investor' },
  { name: 'Outros', percentage: 10, type: 'other' }
];

/**
 * Compliance e Certificações mockadas
 */
export const MOCK_COMPLIANCE = {
  certifications: [
    { name: 'ISO 9001', status: 'active', issueDate: '2024-06-15', expiryDate: '2027-06-15', certifyingBody: 'Bureau Veritas' },
    { name: 'ISO 27001', status: 'in_progress', expectedDate: '2026-09-30', certifyingBody: 'BSI' },
    { name: 'SOC 2 Type II', status: 'planned', expectedDate: '2027-03-31' }
  ],
  frameworks: [
    { name: 'LGPD', status: 'compliant', lastAssessment: '2024-10-15', gaps: [] },
    { name: 'SOX', status: 'in_progress', lastAssessment: '2024-12-01', gaps: ['Controles internos de TI', 'Auditoria de acessos'] },
    { name: 'GDPR', status: 'partially_compliant', lastAssessment: '2024-09-20', gaps: ['Data residency na UE'] }
  ],
  regulatoryBodies: [
    { name: 'ANPD', jurisdiction: 'Brasil', framework: 'LGPD', complianceStatus: 'compliant' }
  ]
};
