// =====================================================
// MOCK DATA - ONBOARDING & KNOWLEDGE BASE
// Dados ficticios para demonstracao interativa
// =====================================================

import type {
  CompanyProfile,
  CompanyStrategicContext,
  DocumentLibrary,
  OnboardingProgress,
  GovernanceHistorySeed
} from '@/types/onboarding';

// =====================================================
// EMPRESA EXEMPLO: GRUPO SILVA PARTICIPACOES
// =====================================================

export const MOCK_COMPANY_ID = 'demo-company-001';

export const mockCompanyProfile: CompanyProfile = {
  id: 'profile-001',
  company_id: MOCK_COMPANY_ID,
  
  // Dados Basicos
  legal_name: 'Grupo Silva Participacoes S.A.',
  trade_name: 'Grupo Silva',
  tax_id: '12.345.678/0001-90',
  founded_date: '1985-03-15',
  company_size: 'large',
  
  // Setor e Industria
  primary_sector: 'Industria',
  secondary_sectors: ['Comercio', 'Logistica'],
  industry_vertical: 'Manufatura de Bens de Consumo',
  naics_code: '311999',
  
  // Geografia
  headquarters_country: 'BR',
  headquarters_state: 'SP',
  headquarters_city: 'Sao Paulo',
  operating_countries: ['BR', 'AR', 'CL', 'MX'],
  operating_states: ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA'],
  
  // Financeiro
  annual_revenue_range: '200m_1b',
  is_publicly_traded: false,
  stock_ticker: undefined,
  
  // Estrutura
  ownership_structure: 'family_owned',
  number_of_shareholders: 12,
  
  // Produtos e Servicos
  products_services: [
    { name: 'Alimentos Processados', category: 'Industria', description: 'Linha completa de alimentos' },
    { name: 'Bebidas', category: 'Industria', description: 'Sucos e refrigerantes' },
    { name: 'Distribuicao', category: 'Logistica', description: 'Rede propria de distribuicao' },
    { name: 'Varejo', category: 'Comercio', description: '45 lojas proprias' }
  ],
  target_markets: ['B2B', 'B2C'],
  customer_segments: ['Supermercados', 'Restaurantes', 'Consumidor Final'],
  
  // Sistemas e Tecnologia
  erp_system: 'SAP',
  crm_system: 'Salesforce',
  bi_tools: ['Power BI', 'Tableau'],
  other_systems: { 'WMS': 'Manhattan', 'TMS': 'Oracle' },
  
  // Dados Disponiveis
  has_financial_data: true,
  has_operational_data: true,
  has_hr_data: true,
  has_sales_data: true,
  has_compliance_data: true,
  data_systems_integrated: ['SAP', 'Salesforce', 'Power BI'],
  
  // Compliance e Certificacoes
  certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'FSSC 22000'],
  regulatory_bodies: ['ANVISA', 'MAPA'],
  compliance_frameworks: ['LGPD', 'SOX'],
  
  // Status
  onboarding_completed: true,
  onboarding_completed_at: '2025-12-15T10:30:00Z',
  knowledge_base_score: 78,
  
  created_at: '2025-11-01T08:00:00Z',
  updated_at: '2025-12-15T10:30:00Z'
};

export const mockStrategicContext: CompanyStrategicContext = {
  id: 'strategic-001',
  company_id: MOCK_COMPANY_ID,
  
  mission: 'Alimentar o Brasil com produtos de qualidade, gerando valor para acionistas, colaboradores e comunidades onde atuamos.',
  vision: 'Ser a empresa de alimentos mais admirada do Brasil ate 2030, reconhecida pela excelencia em governanca e sustentabilidade.',
  values: [
    'Integridade',
    'Excelencia',
    'Respeito as Pessoas',
    'Sustentabilidade',
    'Inovacao',
    'Foco no Cliente'
  ],
  
  business_model: 'Modelo integrado verticalmente, desde a producao ate a distribuicao, com foco em marcas proprias e parcerias estrategicas com varejistas.',
  competitive_advantages: [
    'Rede de distribuicao propria com cobertura nacional',
    'Marcas consolidadas com mais de 30 anos de mercado',
    'Capacidade produtiva instalada ociosa de 25%',
    'Relacionamento de longo prazo com fornecedores',
    'Equipe de P&D com 45 profissionais'
  ],
  key_success_factors: [
    'Qualidade consistente dos produtos',
    'Eficiencia operacional',
    'Capilaridade de distribuicao',
    'Inovacao em produtos',
    'Gestao de custos'
  ],
  
  strategic_objectives: [
    {
      id: 'obj-1',
      title: 'Expansao Regional Nordeste',
      description: 'Aumentar participacao de mercado na regiao Nordeste de 8% para 15%',
      timeline: 'Q4 2026',
      priority: 'high'
    },
    {
      id: 'obj-2',
      title: 'Transformacao Digital',
      description: 'Implementar plataforma de vendas B2B digital e otimizar supply chain com IA',
      timeline: 'Q2 2027',
      priority: 'high'
    },
    {
      id: 'obj-3',
      title: 'Certificacao B Corp',
      description: 'Obter certificacao B Corp para fortalecer posicionamento ESG',
      timeline: 'Q4 2026',
      priority: 'medium'
    },
    {
      id: 'obj-4',
      title: 'Sucessao Familiar',
      description: 'Estruturar processo de sucessao para 3a geracao da familia',
      timeline: 'Q4 2028',
      priority: 'high'
    },
    {
      id: 'obj-5',
      title: 'Reducao de Custos Operacionais',
      description: 'Reduzir custos operacionais em 12% atraves de automacao e otimizacao',
      timeline: 'Q2 2026',
      priority: 'medium'
    }
  ],
  
  okrs: [
    {
      objective: 'Crescer receita em 18% em 2026',
      keyResults: [
        'Lancar 5 novos produtos',
        'Abrir 10 novas lojas',
        'Aumentar ticket medio em 8%'
      ],
      owner: 'CEO'
    },
    {
      objective: 'Melhorar NPS para 75',
      keyResults: [
        'Reduzir tempo de entrega em 20%',
        'Implementar programa de fidelidade',
        'Atingir 95% de OTIF'
      ],
      owner: 'Diretor Comercial'
    }
  ],
  planning_horizon: '5_years',
  
  key_stakeholders: [
    { name: 'Familia Silva (Fundadores)', type: 'investor', importance: 'critical' },
    { name: 'Carrefour Brasil', type: 'customer', importance: 'critical' },
    { name: 'GPA', type: 'customer', importance: 'high' },
    { name: 'ANVISA', type: 'regulator', importance: 'critical' },
    { name: 'Sindicato dos Trabalhadores', type: 'community', importance: 'high' },
    { name: 'Fornecedores Agricolas', type: 'supplier', importance: 'high' },
    { name: 'Banco Itau (Credito)', type: 'investor', importance: 'medium' }
  ],
  customer_concentration: 'medium',
  top_customers_percentage: 35,
  supplier_concentration: 'low',
  
  market_position: 'challenger',
  main_competitors: [
    'BRF',
    'JBS',
    'Nestle',
    'Unilever',
    'M. Dias Branco'
  ],
  competitive_intensity: 'high',
  
  known_risks: [
    {
      id: 'risk-1',
      title: 'Volatilidade de Commodities',
      category: 'Financeiro',
      severity: 'high',
      description: 'Exposicao a variacao de precos de materias-primas agricolas'
    },
    {
      id: 'risk-2',
      title: 'Sucessao Familiar',
      category: 'Estrategico',
      severity: 'high',
      description: 'Transicao para 3a geracao ainda nao estruturada'
    },
    {
      id: 'risk-3',
      title: 'Regulamentacao ANVISA',
      category: 'Regulatorio',
      severity: 'medium',
      description: 'Novas normas de rotulagem nutricional'
    },
    {
      id: 'risk-4',
      title: 'Ciberataques',
      category: 'Tecnologico',
      severity: 'high',
      description: 'Sistemas criticos vulneraveis a ransomware'
    },
    {
      id: 'risk-5',
      title: 'Escassez Hidrica',
      category: 'Ambiental',
      severity: 'medium',
      description: 'Plantas industriais em regioes com stress hidrico'
    },
    {
      id: 'risk-6',
      title: 'Conflito entre Acionistas',
      category: 'Pessoas',
      severity: 'medium',
      description: 'Divergencias sobre estrategia entre ramos familiares'
    },
    {
      id: 'risk-7',
      title: 'Dependencia de Key-Man',
      category: 'Pessoas',
      severity: 'high',
      description: 'CEO fundador ainda centraliza decisoes estrategicas'
    }
  ],
  risk_appetite: 'moderate',
  
  recent_acquisitions: [
    { company: 'Bebidas Nordeste Ltda', date: '2024-03', value: 'R$ 45M' },
    { company: 'Distribuidora Centro-Oeste', date: '2023-08', value: 'R$ 28M' }
  ],
  expansion_plans: 'Avaliando aquisicao de player regional no Sul do Brasil e potencial JV para exportacao para America Latina.',
  investment_priorities: [
    'Automacao industrial',
    'Plataforma digital B2B',
    'Energia renovavel',
    'Capacidade produtiva Nordeste'
  ],
  
  esg_commitments: [
    'Net Zero ate 2040',
    '100% embalagens reciclaveis ate 2028',
    '50% mulheres em cargos de lideranca ate 2030',
    'Programa de inclusao de jovens aprendizes'
  ],
  sustainability_goals: [
    { goal: 'Reducao de emissoes CO2', target: '-30%', deadline: '2028' },
    { goal: 'Agua reciclada na producao', target: '80%', deadline: '2027' },
    { goal: 'Fornecedores certificados', target: '100%', deadline: '2026' }
  ],
  social_programs: [
    'Instituto Silva - Educacao',
    'Banco de Alimentos',
    'Programa de Voluntariado Corporativo'
  ],
  
  created_at: '2025-11-01T08:00:00Z',
  updated_at: '2025-12-15T10:30:00Z'
};

export const mockDocuments: DocumentLibrary[] = [
  {
    id: 'doc-001',
    company_id: MOCK_COMPANY_ID,
    title: 'Estatuto Social Consolidado 2024',
    category: 'governance',
    file_path: 'demo/governance/estatuto-social-2024.pdf',
    file_size: 245000,
    file_type: 'pdf',
    document_date: '2024-04-15',
    uploaded_at: '2025-11-05T14:30:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-05T14:35:00Z',
    extracted_text: 'Estatuto Social da Grupo Silva Participacoes S.A...',
    entities_detected: { people: ['Ricardo Silva', 'Maria Silva'], organizations: ['Grupo Silva'] },
    topics: ['Governanca', 'Estrutura Societaria', 'Assembleia'],
    sentiment_score: 0.1,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-05T14:35:00Z',
    created_at: '2025-11-05T14:30:00Z'
  },
  {
    id: 'doc-002',
    company_id: MOCK_COMPANY_ID,
    title: 'Regimento Interno do Conselho de Administracao',
    category: 'governance',
    file_path: 'demo/governance/regimento-conselho-2024.pdf',
    file_size: 180000,
    file_type: 'pdf',
    document_date: '2024-03-20',
    uploaded_at: '2025-11-05T14:32:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-05T14:38:00Z',
    extracted_text: 'Regimento Interno do Conselho de Administracao...',
    entities_detected: { people: ['Conselheiros'], organizations: ['Conselho de Administracao'] },
    topics: ['Conselho', 'Deliberacoes', 'Quorum'],
    sentiment_score: 0.05,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-05T14:38:00Z',
    created_at: '2025-11-05T14:32:00Z'
  },
  {
    id: 'doc-003',
    company_id: MOCK_COMPANY_ID,
    title: 'Demonstracoes Financeiras 2024',
    category: 'financial',
    file_path: 'demo/financial/df-2024.pdf',
    file_size: 520000,
    file_type: 'pdf',
    document_date: '2025-02-28',
    uploaded_at: '2025-11-06T09:00:00Z',
    uploaded_by: 'user-002',
    processing_status: 'completed',
    processed_at: '2025-11-06T09:10:00Z',
    extracted_text: 'Demonstracoes Financeiras do exercicio de 2024...',
    entities_detected: { monetary_values: ['R$ 850M', 'R$ 95M EBITDA'] },
    topics: ['Balanco', 'DRE', 'Auditoria'],
    sentiment_score: 0.3,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: false,
    is_indexed: true,
    index_last_updated: '2025-11-06T09:10:00Z',
    created_at: '2025-11-06T09:00:00Z'
  },
  {
    id: 'doc-004',
    company_id: MOCK_COMPANY_ID,
    title: 'Planejamento Estrategico 2025-2028',
    category: 'strategic',
    file_path: 'demo/strategic/pe-2025-2028.pdf',
    file_size: 890000,
    file_type: 'pdf',
    document_date: '2024-11-15',
    uploaded_at: '2025-11-06T10:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-06T10:15:00Z',
    extracted_text: 'Planejamento Estrategico para o periodo 2025-2028...',
    entities_detected: { organizations: ['BRF', 'JBS', 'Nestle'] },
    topics: ['Estrategia', 'Expansao', 'Investimentos'],
    sentiment_score: 0.6,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-06T10:15:00Z',
    created_at: '2025-11-06T10:00:00Z'
  },
  {
    id: 'doc-005',
    company_id: MOCK_COMPANY_ID,
    title: 'ATA 45a Reuniao Ordinaria do Conselho',
    category: 'minutes',
    file_path: 'demo/minutes/ata-45-2025-10.pdf',
    file_size: 145000,
    file_type: 'pdf',
    document_date: '2025-10-15',
    uploaded_at: '2025-11-07T08:00:00Z',
    uploaded_by: 'user-003',
    processing_status: 'completed',
    processed_at: '2025-11-07T08:08:00Z',
    extracted_text: 'Ata da 45a Reuniao Ordinaria do Conselho de Administracao...',
    entities_detected: { people: ['Ricardo Silva', 'Ana Mendes', 'Carlos Oliveira'], dates: ['2025-10-15'] },
    topics: ['Resultados Q3', 'Orcamento 2026', 'Comite de Auditoria'],
    sentiment_score: 0.2,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-07T08:08:00Z',
    created_at: '2025-11-07T08:00:00Z'
  },
  {
    id: 'doc-006',
    company_id: MOCK_COMPANY_ID,
    title: 'ATA 44a Reuniao Ordinaria do Conselho',
    category: 'minutes',
    file_path: 'demo/minutes/ata-44-2025-08.pdf',
    file_size: 132000,
    file_type: 'pdf',
    document_date: '2025-08-20',
    uploaded_at: '2025-11-07T08:05:00Z',
    uploaded_by: 'user-003',
    processing_status: 'completed',
    processed_at: '2025-11-07T08:12:00Z',
    extracted_text: 'Ata da 44a Reuniao Ordinaria do Conselho de Administracao...',
    entities_detected: { people: ['Ricardo Silva', 'Paulo Fernandes'], dates: ['2025-08-20'] },
    topics: ['Aquisicao Nordeste', 'ESG', 'Dividendos'],
    sentiment_score: 0.35,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: true,
    is_indexed: true,
    index_last_updated: '2025-11-07T08:12:00Z',
    created_at: '2025-11-07T08:05:00Z'
  },
  {
    id: 'doc-007',
    company_id: MOCK_COMPANY_ID,
    title: 'Politica de Gestao de Riscos',
    category: 'governance',
    file_path: 'demo/governance/politica-riscos-2024.pdf',
    file_size: 210000,
    file_type: 'pdf',
    document_date: '2024-06-01',
    uploaded_at: '2025-11-07T09:00:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-07T09:08:00Z',
    extracted_text: 'Politica de Gestao de Riscos Corporativos...',
    entities_detected: { organizations: ['Comite de Riscos', 'Auditoria Interna'] },
    topics: ['Riscos', 'Controles Internos', 'Matriz de Riscos'],
    sentiment_score: 0.1,
    relevant_for_agent_a: true,
    relevant_for_agent_b: true,
    relevant_for_agent_c: true,
    relevant_for_agent_d: false,
    is_indexed: true,
    index_last_updated: '2025-11-07T09:08:00Z',
    created_at: '2025-11-07T09:00:00Z'
  },
  {
    id: 'doc-008',
    company_id: MOCK_COMPANY_ID,
    title: 'Codigo de Conduta e Etica',
    category: 'governance',
    file_path: 'demo/governance/codigo-conduta-2024.pdf',
    file_size: 165000,
    file_type: 'pdf',
    document_date: '2024-01-15',
    uploaded_at: '2025-11-07T09:30:00Z',
    uploaded_by: 'user-001',
    processing_status: 'completed',
    processed_at: '2025-11-07T09:35:00Z',
    extracted_text: 'Codigo de Conduta e Etica do Grupo Silva...',
    entities_detected: { organizations: ['Canal de Etica', 'Comite de Etica'] },
    topics: ['Etica', 'Compliance', 'Anticorrupcao'],
    sentiment_score: 0.15,
    relevant_for_agent_a: false,
    relevant_for_agent_b: true,
    relevant_for_agent_c: false,
    relevant_for_agent_d: false,
    is_indexed: true,
    index_last_updated: '2025-11-07T09:35:00Z',
    created_at: '2025-11-07T09:30:00Z'
  }
];

export const mockOnboardingProgress: OnboardingProgress = {
  id: 'progress-001',
  company_id: MOCK_COMPANY_ID,
  
  phase_1_basic_setup: true,
  phase_1_completed_at: '2025-11-05T10:00:00Z',
  
  phase_2_document_upload: true,
  phase_2_completed_at: '2025-11-07T11:00:00Z',
  
  phase_3_strategic_context: true,
  phase_3_completed_at: '2025-11-08T14:00:00Z',
  
  basic_setup_score: 85,
  document_upload_score: 80,
  strategic_context_score: 70,
  overall_score: 78,
  
  documents_uploaded: 8,
  documents_processed: 8,
  
  fields_completed: 42,
  fields_total: 50,
  
  status: 'completed',
  
  next_steps: [
    {
      title: 'Adicionar mais ATAs historicas',
      description: 'Upload de ATAs dos ultimos 24 meses para melhorar contexto',
      href: '/knowledge-base?tab=phase-2',
      priority: 1
    },
    {
      title: 'Completar perfis dos conselheiros',
      description: 'Adicionar biografias e competencias dos membros do conselho',
      href: '/governance-config',
      priority: 2
    }
  ],
  missing_critical_data: [],
  
  created_at: '2025-11-01T08:00:00Z',
  updated_at: '2025-11-08T14:00:00Z'
};

export const mockGovernanceHistory: GovernanceHistorySeed[] = [
  {
    id: 'history-001',
    company_id: MOCK_COMPANY_ID,
    record_type: 'decision',
    title: 'Aprovacao do Orcamento 2026',
    description: 'Conselho aprovou orcamento de R$ 120M para 2026 com foco em expansao Nordeste',
    date: '2025-10-15',
    decision_outcome: 'Aprovado',
    decision_rationale: 'Alinhado com planejamento estrategico e projecoes financeiras',
    status: 'completed',
    source: 'ATA 45a Reuniao',
    source_document_id: 'doc-005',
    created_at: '2025-11-07T08:08:00Z'
  },
  {
    id: 'history-002',
    company_id: MOCK_COMPANY_ID,
    record_type: 'decision',
    title: 'Aquisicao Bebidas Nordeste',
    description: 'Aprovada aquisicao da Bebidas Nordeste Ltda por R$ 45M',
    date: '2025-08-20',
    decision_outcome: 'Aprovado',
    decision_rationale: 'Sinergias operacionais e expansao geografica estrategica',
    status: 'completed',
    source: 'ATA 44a Reuniao',
    source_document_id: 'doc-006',
    created_at: '2025-11-07T08:12:00Z'
  },
  {
    id: 'history-003',
    company_id: MOCK_COMPANY_ID,
    record_type: 'risk',
    title: 'Identificado risco de ciberataque',
    description: 'Auditoria identificou vulnerabilidades criticas em sistemas de producao',
    date: '2025-08-20',
    risk_category: 'Tecnologico',
    risk_severity: 'high',
    status: 'open',
    source: 'ATA 44a Reuniao',
    source_document_id: 'doc-006',
    created_at: '2025-11-07T08:12:00Z'
  },
  {
    id: 'history-004',
    company_id: MOCK_COMPANY_ID,
    record_type: 'task',
    title: 'Contratar consultoria de ciberseguranca',
    description: 'Diretor de TI deve apresentar proposta de consultoria especializada',
    date: '2025-09-15',
    status: 'completed',
    source: 'ATA 44a Reuniao',
    source_document_id: 'doc-006',
    created_at: '2025-11-07T08:12:00Z'
  },
  {
    id: 'history-005',
    company_id: MOCK_COMPANY_ID,
    record_type: 'policy',
    title: 'Nova Politica de Transacoes com Partes Relacionadas',
    description: 'Aprovada nova politica mais restritiva para TPRs acima de R$ 1M',
    date: '2025-06-18',
    decision_outcome: 'Aprovado',
    status: 'completed',
    source: 'ATA 42a Reuniao',
    created_at: '2025-11-07T08:15:00Z'
  }
];

// =====================================================
// EMPRESA VAZIA (para novo onboarding)
// =====================================================

export const emptyCompanyProfile: Partial<CompanyProfile> = {
  company_id: MOCK_COMPANY_ID,
  legal_name: '',
  tax_id: '',
  primary_sector: '',
  headquarters_country: 'BR',
  is_publicly_traded: false,
  has_financial_data: false,
  has_operational_data: false,
  has_hr_data: false,
  has_sales_data: false,
  has_compliance_data: false,
  onboarding_completed: false,
  knowledge_base_score: 0
};

export const emptyStrategicContext: Partial<CompanyStrategicContext> = {
  company_id: MOCK_COMPANY_ID,
  mission: '',
  vision: '',
  values: [],
  strategic_objectives: [],
  key_stakeholders: [],
  known_risks: []
};

export const emptyOnboardingProgress: OnboardingProgress = {
  id: 'progress-new',
  company_id: MOCK_COMPANY_ID,
  phase_1_basic_setup: false,
  phase_2_document_upload: false,
  phase_3_strategic_context: false,
  basic_setup_score: 0,
  document_upload_score: 0,
  strategic_context_score: 0,
  overall_score: 0,
  documents_uploaded: 0,
  documents_processed: 0,
  fields_completed: 0,
  fields_total: 50,
  status: 'not_started',
  next_steps: [
    {
      title: 'Iniciar Setup Basico',
      description: 'Preencha as informacoes essenciais da empresa',
      href: '/knowledge-base?tab=phase-1',
      priority: 1
    }
  ],
  missing_critical_data: ['Razao Social', 'CNPJ', 'Setor', 'Porte'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// =====================================================
// HELPER: Escolher dados baseado em modo demo
// =====================================================

export type DemoMode = 'empty' | 'partial' | 'complete';

export function getMockData(mode: DemoMode = 'complete') {
  switch (mode) {
    case 'empty':
      return {
        profile: emptyCompanyProfile as CompanyProfile,
        context: emptyStrategicContext as CompanyStrategicContext,
        documents: [],
        progress: emptyOnboardingProgress,
        history: []
      };
    case 'partial':
      return {
        profile: mockCompanyProfile,
        context: emptyStrategicContext as CompanyStrategicContext,
        documents: mockDocuments.slice(0, 3),
        progress: {
          ...emptyOnboardingProgress,
          phase_1_basic_setup: true,
          phase_1_completed_at: new Date().toISOString(),
          basic_setup_score: 85,
          overall_score: 28,
          status: 'in_progress' as const
        },
        history: []
      };
    case 'complete':
    default:
      return {
        profile: mockCompanyProfile,
        context: mockStrategicContext,
        documents: mockDocuments,
        progress: mockOnboardingProgress,
        history: mockGovernanceHistory
      };
  }
}

