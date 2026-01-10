// =====================================================
// LEGACY OS - MOCK DATA PARA ONBOARDING & KNOWLEDGE BASE
// Dados de demonstração para o sistema de onboarding
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
// COMPANY PROFILE MOCK (Fase 1)
// =====================================================

export const MOCK_COMPANY_PROFILE: CompanyProfile = {
  id: 'mock-profile-001',
  company_id: 'demo-company-001',
  
  // Dados Básicos
  legal_name: 'TechCorp Soluções Digitais S.A.',
  trade_name: 'TechCorp',
  tax_id: '12.345.678/0001-90',
  founded_date: '2015-03-15',
  company_size: 'medium',
  
  // Setor e Indústria
  primary_sector: 'Tecnologia',
  secondary_sectors: ['Serviços', 'Financeiro'],
  industry_vertical: 'SaaS B2B',
  naics_code: '541512',
  
  // Geografia
  headquarters_country: 'BR',
  headquarters_state: 'SP',
  headquarters_city: 'São Paulo',
  operating_countries: ['BR', 'PT', 'MX'],
  operating_states: ['SP', 'RJ', 'MG', 'RS', 'PR'],
  
  // Financeiro
  annual_revenue_range: '50m_200m',
  is_publicly_traded: false,
  stock_ticker: undefined,
  
  // Estrutura
  ownership_structure: 'family_owned',
  number_of_shareholders: 8,
  
  // Produtos e Serviços
  products_services: [
    { name: 'Legacy OS', category: 'Software', description: 'Plataforma de governança corporativa' },
    { name: 'GovTech Suite', category: 'Software', description: 'Ferramentas de compliance' },
    { name: 'Consultoria Digital', category: 'Serviço', description: 'Transformação digital' }
  ],
  target_markets: ['B2B', 'Enterprise'],
  customer_segments: ['Médias Empresas', 'Grandes Corporações', 'Family Offices'],
  
  // Sistemas e Tecnologia
  erp_system: 'SAP Business One',
  crm_system: 'Salesforce',
  bi_tools: ['Power BI', 'Tableau'],
  other_systems: { 'RH': 'Gupy', 'Financeiro': 'Nibo' },
  
  // Dados Disponíveis
  has_financial_data: true,
  has_operational_data: true,
  has_hr_data: true,
  has_sales_data: true,
  has_compliance_data: false,
  data_systems_integrated: ['SAP', 'Salesforce'],
  
  // Compliance e Certificações
  certifications: ['ISO 9001:2015', 'ISO 27001'],
  regulatory_bodies: ['CVM', 'ANPD'],
  compliance_frameworks: ['LGPD', 'SOC 2 Type II'],
  
  // Status
  onboarding_completed: false,
  onboarding_completed_at: undefined,
  knowledge_base_score: 65,
  
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Form Data para Fase 1 (pré-populado)
export const MOCK_PHASE1_FORM_DATA: Phase1FormData = {
  legalName: 'TechCorp Soluções Digitais S.A.',
  tradeName: 'TechCorp',
  taxId: '12.345.678/0001-90',
  foundedDate: '2015-03-15',
  companySize: 'medium',
  
  primarySector: 'Tecnologia',
  secondarySectors: ['Serviços', 'Financeiro'],
  industryVertical: 'SaaS B2B',
  
  headquarters: {
    country: 'BR',
    state: 'SP',
    city: 'São Paulo'
  },
  operatingCountries: ['BR', 'PT', 'MX'],
  operatingStates: ['SP', 'RJ', 'MG', 'RS', 'PR'],
  
  annualRevenueRange: '50m_200m',
  isPubliclyTraded: false,
  stockTicker: '',
  
  ownershipStructure: 'family_owned',
  numberOfShareholders: 8,
  
  productsServices: [
    { name: 'Legacy OS', category: 'Software', description: 'Plataforma de governança corporativa' },
    { name: 'GovTech Suite', category: 'Software', description: 'Ferramentas de compliance' },
    { name: 'Consultoria Digital', category: 'Serviço', description: 'Transformação digital' }
  ],
  targetMarkets: ['B2B', 'Enterprise'],
  
  erpSystem: 'SAP Business One',
  crmSystem: 'Salesforce',
  biTools: ['Power BI', 'Tableau'],
  
  availableData: {
    financial: true,
    operational: true,
    hr: true,
    sales: true,
    compliance: false
  },
  
  certifications: ['ISO 9001:2015', 'ISO 27001'],
  regulatoryBodies: ['CVM', 'ANPD'],
  complianceFrameworks: ['LGPD', 'SOC 2 Type II']
};

// =====================================================
// STRATEGIC CONTEXT MOCK (Fase 3)
// =====================================================

export const MOCK_STRATEGIC_CONTEXT: CompanyStrategicContext = {
  id: 'mock-strategic-001',
  company_id: 'demo-company-001',
  
  mission: 'Democratizar o acesso à governança corporativa de excelência, capacitando empresas de todos os portes a tomar decisões mais inteligentes e sustentáveis.',
  vision: 'Ser a plataforma líder em governança corporativa na América Latina até 2028, impactando positivamente mais de 10.000 organizações.',
  values: [
    'Transparência',
    'Inovação',
    'Excelência',
    'Integridade',
    'Colaboração'
  ],
  
  business_model: 'Modelo SaaS B2B com assinatura recorrente. Oferecemos planos escalonados por funcionalidades e número de usuários, com serviços de consultoria complementares.',
  competitive_advantages: [
    'IA proprietária para análise preditiva',
    'Integração nativa com principais ERPs',
    'Time de especialistas em governança',
    'Metodologia própria certificada IBGC'
  ],
  key_success_factors: [
    'Retenção de clientes (NRR > 120%)',
    'Velocidade de implementação',
    'Qualidade do suporte',
    'Inovação contínua em IA'
  ],
  
  strategic_objectives: [
    {
      id: 'obj-1',
      title: 'Expansão Internacional',
      description: 'Estabelecer operações em Portugal e México até Q4 2026',
      timeline: 'Q4 2026',
      priority: 'high'
    },
    {
      id: 'obj-2',
      title: 'Lançamento MOAT Engine',
      description: 'Implementar motor de IA para governança preditiva',
      timeline: 'Q2 2026',
      priority: 'high'
    },
    {
      id: 'obj-3',
      title: 'Certificação SOC 2 Type II',
      description: 'Obter certificação completa de segurança',
      timeline: 'Q3 2026',
      priority: 'medium'
    },
    {
      id: 'obj-4',
      title: 'Meta ESG Carbono Neutro',
      description: 'Atingir neutralidade de carbono nas operações',
      timeline: 'Q4 2027',
      priority: 'medium'
    }
  ],
  
  okrs: [
    {
      objective: 'Aumentar receita recorrente em 40%',
      keyResults: [
        'Conquistar 50 novos clientes enterprise',
        'Aumentar ticket médio em 25%',
        'Reduzir churn para menos de 3%'
      ],
      owner: 'CEO'
    },
    {
      objective: 'Lançar 3 novos módulos de IA',
      keyResults: [
        'Módulo de pautas inteligentes (Q1)',
        'Módulo de análise de riscos (Q2)',
        'Módulo de compliance preditivo (Q3)'
      ],
      owner: 'CPO'
    }
  ],
  
  planning_horizon: '3_years',
  
  key_stakeholders: [
    { name: 'Família Fundadora', type: 'investor', importance: 'critical' },
    { name: 'Clientes Enterprise', type: 'customer', importance: 'critical' },
    { name: 'Investidor Anjo', type: 'investor', importance: 'high' },
    { name: 'ANPD', type: 'regulator', importance: 'high' },
    { name: 'Fornecedores de Cloud', type: 'supplier', importance: 'medium' }
  ],
  
  customer_concentration: 'medium',
  top_customers_percentage: 35,
  supplier_concentration: 'low',
  
  market_position: 'challenger',
  main_competitors: [
    'Atlas Governance',
    'Diligent Boards',
    'BoardEffect'
  ],
  competitive_intensity: 'high',
  
  known_risks: [
    {
      id: 'risk-1',
      title: 'Concentração de Receita em Poucos Clientes',
      category: 'Financeiro',
      severity: 'medium',
      description: 'Top 5 clientes representam 35% da receita. Mitigação: diversificação ativa do portfólio.',
      status: 'open'
    },
    {
      id: 'risk-2',
      title: 'Retenção de Talentos em Tecnologia',
      category: 'Pessoas',
      severity: 'high',
      description: 'Mercado aquecido para desenvolvedores. Alto custo de turnover.',
      status: 'open'
    },
    {
      id: 'risk-3',
      title: 'Mudanças Regulatórias LGPD',
      category: 'Regulatório',
      severity: 'medium',
      description: 'Novas regulamentações podem impactar funcionalidades do produto.',
      status: 'mitigated'
    },
    {
      id: 'risk-4',
      title: 'Dependência de Cloud Providers',
      category: 'Tecnológico',
      severity: 'low',
      description: 'Concentração em AWS. Plano de multi-cloud em andamento.',
      status: 'open'
    },
    {
      id: 'risk-5',
      title: 'Risco Cambial Expansão',
      category: 'Financeiro',
      severity: 'medium',
      description: 'Exposição a flutuações EUR/BRL e MXN/BRL na expansão internacional.',
      status: 'open'
    },
    {
      id: 'risk-6',
      title: 'Ataques Cibernéticos',
      category: 'Tecnológico',
      severity: 'critical',
      description: 'Alvo potencial por armazenar dados sensíveis de governança.',
      status: 'mitigated'
    }
  ],
  
  risk_appetite: 'moderate',
  
  recent_acquisitions: [
    { company: 'ComplianceBot', date: '2024-06', value: 'R$ 2.5M' }
  ],
  expansion_plans: 'Expansão para Portugal (2026) e México (2027) com foco em mid-market',
  investment_priorities: [
    'Inteligência Artificial',
    'Segurança da Informação',
    'Expansão Internacional'
  ],
  
  esg_commitments: [
    'Carbono Neutro até 2027',
    'Diversidade: 50% liderança feminina até 2026',
    '1% da receita para projetos sociais'
  ],
  sustainability_goals: [
    { goal: 'Redução de emissões', target: '50%', deadline: '2026-12' },
    { goal: 'Energia renovável', target: '100%', deadline: '2025-12' }
  ],
  social_programs: [
    'Tech for Good - capacitação de jovens',
    'Programa de mentoria para startups sociais'
  ],
  
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Form Data para Fase 3 (pré-populado)
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
// DOCUMENT LIBRARY MOCK (Fase 2)
// =====================================================

export const MOCK_DOCUMENTS: DocumentLibrary[] = [
  {
    id: 'doc-001',
    company_id: 'demo-company-001',
    title: 'Estatuto Social Consolidado',
    category: 'governance',
    file_path: 'demo-company-001/governance/estatuto-social.pdf',
    file_size: 2456789,
    file_type: 'pdf',
    document_date: '2024-01-15',
    uploaded_at: '2025-12-01T10:30:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-01T10:35:00Z',
    extracted_text: 'Estatuto Social da TechCorp Soluções Digitais S.A...',
    entities_detected: { pessoas: ['João Silva', 'Maria Santos'], datas: ['2015-03-15'] },
    topics: ['Governança', 'Estrutura Societária', 'Conselho'],
    sentiment_score: 0.1,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-01T10:35:00Z',
    created_at: '2025-12-01T10:30:00Z'
  },
  {
    id: 'doc-002',
    company_id: 'demo-company-001',
    title: 'Regimento Interno do Conselho',
    category: 'governance',
    file_path: 'demo-company-001/governance/regimento-conselho.pdf',
    file_size: 1234567,
    file_type: 'pdf',
    document_date: '2024-03-20',
    uploaded_at: '2025-12-01T10:32:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-01T10:38:00Z',
    extracted_text: 'Regimento Interno do Conselho de Administração...',
    entities_detected: { pessoas: ['Presidente do Conselho'], datas: ['2024-03-20'] },
    topics: ['Conselho de Administração', 'Reuniões', 'Deliberações'],
    sentiment_score: 0.0,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-01T10:38:00Z',
    created_at: '2025-12-01T10:32:00Z'
  },
  {
    id: 'doc-003',
    company_id: 'demo-company-001',
    title: 'ATA Reunião Conselho - Dezembro 2025',
    category: 'minutes',
    file_path: 'demo-company-001/minutes/ata-dez-2025.pdf',
    file_size: 567890,
    file_type: 'pdf',
    document_date: '2025-12-05',
    uploaded_at: '2025-12-10T14:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-12-10T14:10:00Z',
    extracted_text: 'ATA da Reunião Ordinária do Conselho de Administração...',
    entities_detected: { decisoes: ['Aprovação orçamento 2026', 'Expansão internacional'] },
    topics: ['Estratégia', 'Orçamento', 'Expansão'],
    sentiment_score: 0.6,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-12-10T14:10:00Z',
    created_at: '2025-12-10T14:00:00Z'
  },
  {
    id: 'doc-004',
    company_id: 'demo-company-001',
    title: 'ATA Reunião Conselho - Novembro 2025',
    category: 'minutes',
    file_path: 'demo-company-001/minutes/ata-nov-2025.pdf',
    file_size: 489000,
    file_type: 'pdf',
    document_date: '2025-11-08',
    uploaded_at: '2025-11-15T09:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-15T09:08:00Z',
    extracted_text: 'ATA da Reunião Ordinária do Conselho de Administração...',
    entities_detected: { decisoes: ['Revisão metas Q4', 'Contratação CTO'] },
    topics: ['Metas', 'Pessoas', 'Tecnologia'],
    sentiment_score: 0.4,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-15T09:08:00Z',
    created_at: '2025-11-15T09:00:00Z'
  },
  {
    id: 'doc-005',
    company_id: 'demo-company-001',
    title: 'ATA Reunião Conselho - Outubro 2025',
    category: 'minutes',
    file_path: 'demo-company-001/minutes/ata-out-2025.pdf',
    file_size: 512000,
    file_type: 'pdf',
    document_date: '2025-10-10',
    uploaded_at: '2025-10-18T11:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-10-18T11:07:00Z',
    extracted_text: 'ATA da Reunião Ordinária do Conselho de Administração...',
    entities_detected: { decisoes: ['Aprovação aquisição ComplianceBot'] },
    topics: ['M&A', 'Estratégia', 'Compliance'],
    sentiment_score: 0.7,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-10-18T11:07:00Z',
    created_at: '2025-10-18T11:00:00Z'
  },
  {
    id: 'doc-006',
    company_id: 'demo-company-001',
    title: 'Demonstrações Financeiras 2024',
    category: 'financial',
    file_path: 'demo-company-001/financial/df-2024.pdf',
    file_size: 3456789,
    file_type: 'pdf',
    document_date: '2025-03-31',
    uploaded_at: '2025-04-15T16:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-04-15T16:20:00Z',
    extracted_text: 'Demonstrações Financeiras do exercício de 2024...',
    entities_detected: { valores: ['R$ 85M receita', 'R$ 12M lucro'] },
    topics: ['Financeiro', 'Balanço', 'DRE'],
    sentiment_score: 0.5,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: false,
    is_indexed: true,
    index_last_updated: '2025-04-15T16:20:00Z',
    created_at: '2025-04-15T16:00:00Z'
  },
  {
    id: 'doc-007',
    company_id: 'demo-company-001',
    title: 'Planejamento Estratégico 2025-2028',
    category: 'strategic',
    file_path: 'demo-company-001/strategic/pe-2025-2028.pdf',
    file_size: 4567890,
    file_type: 'pdf',
    document_date: '2024-12-20',
    uploaded_at: '2025-01-10T10:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'pending',
    processed_at: undefined,
    extracted_text: undefined,
    entities_detected: undefined,
    topics: undefined,
    sentiment_score: undefined,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: false,
    index_last_updated: undefined,
    created_at: '2025-01-10T10:00:00Z'
  },
  {
    id: 'doc-008',
    company_id: 'demo-company-001',
    title: 'Código de Conduta e Ética',
    category: 'governance',
    file_path: 'demo-company-001/governance/codigo-conduta.pdf',
    file_size: 890123,
    file_type: 'pdf',
    document_date: '2023-06-01',
    uploaded_at: '2025-12-02T08:30:00Z',
    uploaded_by: 'user-001',
    processing_status: 'processing',
    processed_at: undefined,
    extracted_text: undefined,
    entities_detected: undefined,
    topics: undefined,
    sentiment_score: undefined,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: false,
    is_indexed: false,
    index_last_updated: undefined,
    created_at: '2025-12-02T08:30:00Z'
  }
];

// =====================================================
// ONBOARDING PROGRESS MOCK
// =====================================================

export const MOCK_ONBOARDING_PROGRESS: OnboardingProgress = {
  id: 'progress-001',
  company_id: 'demo-company-001',
  
  phase_1_basic_setup: true,
  phase_1_completed_at: '2025-12-01T12:00:00Z',
  
  phase_2_document_upload: true,
  phase_2_completed_at: '2025-12-10T15:00:00Z',
  
  phase_3_strategic_context: false,
  phase_3_completed_at: undefined,
  
  basic_setup_score: 85,
  document_upload_score: 60,
  strategic_context_score: 40,
  overall_score: 65,
  
  documents_uploaded: 8,
  documents_processed: 6,
  
  fields_completed: 35,
  fields_total: 50,
  
  status: 'in_progress',
  
  next_steps: [
    {
      title: 'Completar Contexto Estratégico',
      description: 'Adicione informações sobre riscos conhecidos e stakeholders principais',
      href: '/knowledge-base?phase=3',
      priority: 1
    },
    {
      title: 'Processar Documentos Pendentes',
      description: '2 documentos aguardando processamento',
      href: '/knowledge-base?phase=2',
      priority: 2
    },
    {
      title: 'Adicionar mais ATAs',
      description: 'Recomendamos pelo menos 6 meses de histórico',
      href: '/knowledge-base?phase=2',
      priority: 3
    }
  ],
  
  missing_critical_data: [
    'Apetite a risco não definido',
    'Stakeholders principais incompletos'
  ],
  
  created_at: '2025-12-01T10:00:00Z',
  updated_at: new Date().toISOString()
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
