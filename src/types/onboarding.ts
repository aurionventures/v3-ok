// =====================================================
// LEGACY OS - ONBOARDING & KNOWLEDGE BASE TYPES
// Sistema de Carga Inicial de Contexto para MOAT Engine
// =====================================================

// =====================================================
// FASE 1: COMPANY PROFILE (Setup Basico)
// =====================================================

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export type RevenueRange = 
  | 'under_1m' 
  | '1m_10m' 
  | '10m_50m' 
  | '50m_200m' 
  | '200m_1b' 
  | 'over_1b';

export type OwnershipStructure = 
  | 'family_owned' 
  | 'private_equity' 
  | 'publicly_traded' 
  | 'cooperative' 
  | 'state_owned' 
  | 'mixed';

export interface ProductService {
  name: string;
  category: string;
  description?: string;
}

export interface CompanyProfile {
  id: string;
  company_id: string;
  
  // Dados Basicos
  legal_name: string;
  trade_name?: string;
  tax_id: string;
  founded_date?: string;
  company_size?: CompanySize;
  
  // Setor e Industria
  primary_sector: string;
  secondary_sectors?: string[];
  industry_vertical?: string;
  naics_code?: string;
  
  // Geografia
  headquarters_country: string;
  headquarters_state?: string;
  headquarters_city?: string;
  operating_countries?: string[];
  operating_states?: string[];
  
  // Financeiro
  annual_revenue_range?: RevenueRange;
  is_publicly_traded: boolean;
  stock_ticker?: string;
  
  // Estrutura
  ownership_structure?: OwnershipStructure;
  number_of_shareholders?: number;
  
  // Produtos e Servicos
  products_services?: ProductService[];
  target_markets?: string[];
  customer_segments?: string[];
  
  // Sistemas e Tecnologia
  erp_system?: string;
  crm_system?: string;
  bi_tools?: string[];
  other_systems?: Record<string, string>;
  
  // Dados Disponiveis
  has_financial_data: boolean;
  has_operational_data: boolean;
  has_hr_data: boolean;
  has_sales_data: boolean;
  has_compliance_data: boolean;
  data_systems_integrated?: string[];
  
  // Compliance e Certificacoes
  certifications?: string[];
  regulatory_bodies?: string[];
  compliance_frameworks?: string[];
  
  // Status
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  knowledge_base_score: number;
  
  created_at: string;
  updated_at: string;
}

// Form data para Fase 1
export interface Phase1FormData {
  legalName: string;
  tradeName?: string;
  taxId: string;
  foundedDate?: string;
  companySize?: CompanySize;
  
  primarySector: string;
  secondarySectors?: string[];
  industryVertical?: string;
  
  headquarters: {
    country: string;
    state: string;
    city: string;
  };
  operatingCountries?: string[];
  operatingStates?: string[];
  
  annualRevenueRange?: RevenueRange;
  isPubliclyTraded: boolean;
  stockTicker?: string;
  
  ownershipStructure?: OwnershipStructure;
  numberOfShareholders?: number;
  
  productsServices: ProductService[];
  targetMarkets: string[];
  
  erpSystem?: string;
  crmSystem?: string;
  biTools?: string[];
  
  availableData: {
    financial: boolean;
    operational: boolean;
    hr: boolean;
    sales: boolean;
    compliance: boolean;
  };
  
  certifications?: string[];
  regulatoryBodies?: string[];
  complianceFrameworks?: string[];
}

// =====================================================
// FASE 2: DOCUMENT LIBRARY (Upload de Documentos)
// =====================================================

export type DocumentCategory = 
  | 'governance' 
  | 'financial' 
  | 'strategic' 
  | 'operational' 
  | 'legal' 
  | 'minutes' 
  | 'compliance' 
  | 'other';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DocumentLibrary {
  id: string;
  company_id: string;
  
  title: string;
  category: DocumentCategory;
  file_path: string;
  file_size?: number;
  file_type?: string;
  
  document_date?: string;
  uploaded_at: string;
  uploaded_by?: string;
  
  processing_status: ProcessingStatus;
  processed_at?: string;
  
  extracted_text?: string;
  entities_detected?: Record<string, unknown>;
  topics?: string[];
  sentiment_score?: number;
  
  relevant_for_agent_a: boolean;
  relevant_for_agent_b: boolean;
  relevant_for_agent_c: boolean;
  relevant_for_agent_d: boolean;
  
  is_indexed: boolean;
  index_last_updated?: string;
  
  created_at: string;
}

export interface DocumentUploadZone {
  category: DocumentCategory;
  title: string;
  description: string;
  examples: string[];
  required: boolean;
  maxFiles?: number;
}

// =====================================================
// FASE 3: STRATEGIC CONTEXT (Contexto Estrategico)
// =====================================================

export type PlanningHorizon = '1_year' | '3_years' | '5_years' | '10_years';
export type ConcentrationLevel = 'low' | 'medium' | 'high';
export type MarketPosition = 'market_leader' | 'challenger' | 'follower' | 'niche_player';
export type CompetitiveIntensity = 'low' | 'moderate' | 'high' | 'very_high';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskAppetite = 'conservative' | 'moderate' | 'aggressive';

export interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  timeline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OKR {
  objective: string;
  keyResults: string[];
  owner?: string;
}

export interface Stakeholder {
  name: string;
  type: 'customer' | 'supplier' | 'investor' | 'regulator' | 'community' | 'other';
  importance: 'critical' | 'high' | 'medium';
}

export interface KnownRisk {
  id: string;
  title: string;
  category: string;
  severity: RiskSeverity;
  description: string;
  status?: 'open' | 'mitigated' | 'accepted' | 'closed';
}

export interface SustainabilityGoal {
  goal: string;
  target: string;
  deadline: string;
}

export interface CompanyStrategicContext {
  id: string;
  company_id: string;
  
  mission?: string;
  vision?: string;
  values?: string[];
  
  business_model?: string;
  competitive_advantages?: string[];
  key_success_factors?: string[];
  
  strategic_objectives?: StrategicObjective[];
  okrs?: OKR[];
  planning_horizon?: PlanningHorizon;
  
  key_stakeholders?: Stakeholder[];
  customer_concentration?: ConcentrationLevel;
  top_customers_percentage?: number;
  supplier_concentration?: ConcentrationLevel;
  
  market_position?: MarketPosition;
  main_competitors?: string[];
  competitive_intensity?: CompetitiveIntensity;
  
  known_risks?: KnownRisk[];
  risk_appetite?: RiskAppetite;
  
  recent_acquisitions?: { company: string; date: string; value?: string }[];
  expansion_plans?: string;
  investment_priorities?: string[];
  
  esg_commitments?: string[];
  sustainability_goals?: SustainabilityGoal[];
  social_programs?: string[];
  
  created_at: string;
  updated_at: string;
}

// Form data para Fase 3
export interface Phase3FormData {
  mission: string;
  vision: string;
  values: string[];
  
  businessModel: string;
  competitiveAdvantages: string[];
  keySuccessFactors: string[];
  
  strategicObjectives: StrategicObjective[];
  okrs?: OKR[];
  
  keyStakeholders: Stakeholder[];
  
  marketPosition?: MarketPosition;
  mainCompetitors: string[];
  competitiveIntensity?: CompetitiveIntensity;
  
  knownRisks: KnownRisk[];
  riskAppetite?: RiskAppetite;
  
  recentAcquisitions?: string[];
  expansionPlans?: string;
  investmentPriorities?: string[];
  
  esgCommitments?: string[];
  sustainabilityGoals?: SustainabilityGoal[];
}

// =====================================================
// GOVERNANCE HISTORY SEED
// =====================================================

export type GovernanceRecordType = 
  | 'decision' 
  | 'risk' 
  | 'task' 
  | 'meeting' 
  | 'policy' 
  | 'incident';

export interface GovernanceHistorySeed {
  id: string;
  company_id: string;
  
  record_type: GovernanceRecordType;
  title: string;
  description?: string;
  date: string;
  
  decision_outcome?: string;
  decision_rationale?: string;
  
  risk_category?: string;
  risk_severity?: RiskSeverity;
  risk_status?: 'open' | 'mitigated' | 'accepted' | 'closed';
  
  impact_financial?: number;
  impact_operational?: string;
  impact_reputational?: string;
  
  related_to?: string[];
  status: string;
  
  source?: string;
  source_document_id?: string;
  
  created_at: string;
}

// =====================================================
// ONBOARDING PROGRESS
// =====================================================

export type OnboardingStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'needs_review';

export interface NextStep {
  title: string;
  description: string;
  href: string;
  priority: number;
}

export interface OnboardingProgress {
  id: string;
  company_id: string;
  
  phase_1_basic_setup: boolean;
  phase_1_completed_at?: string;
  
  phase_2_document_upload: boolean;
  phase_2_completed_at?: string;
  
  phase_3_strategic_context: boolean;
  phase_3_completed_at?: string;
  
  basic_setup_score: number;
  document_upload_score: number;
  strategic_context_score: number;
  overall_score: number;
  
  documents_uploaded: number;
  documents_processed: number;
  
  fields_completed: number;
  fields_total: number;
  
  status: OnboardingStatus;
  
  next_steps?: NextStep[];
  missing_critical_data?: string[];
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// WIZARD CONFIGURATION
// =====================================================

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  estimatedTime: number;
  sections?: string[];
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Legacy OS',
    subtitle: 'Vamos configurar sua empresa em 3 etapas simples',
    estimatedTime: 2
  },
  {
    id: 'phase-1-basic',
    title: 'Fase 1: Setup Basico',
    subtitle: 'Informacoes essenciais da empresa',
    estimatedTime: 15,
    sections: [
      'company_info',
      'sector_industry',
      'geography',
      'financial_structure',
      'products_services',
      'systems_data'
    ]
  },
  {
    id: 'phase-2-documents',
    title: 'Fase 2: Upload de Documentos',
    subtitle: 'Documentos historicos de governanca',
    estimatedTime: 30,
    sections: [
      'governance_docs',
      'financial_docs',
      'strategic_docs',
      'minutes_docs'
    ]
  },
  {
    id: 'phase-3-strategic',
    title: 'Fase 3: Contexto Estrategico',
    subtitle: 'Missao, visao e objetivos estrategicos',
    estimatedTime: 20,
    sections: [
      'mission_vision',
      'strategic_objectives',
      'stakeholders',
      'market_competition',
      'risks_opportunities'
    ]
  },
  {
    id: 'processing',
    title: 'Processando Dados',
    subtitle: 'Estamos preparando sua base de conhecimento',
    estimatedTime: 5
  },
  {
    id: 'complete',
    title: 'Onboarding Completo!',
    subtitle: 'Seu MOAT Engine esta pronto para uso',
    estimatedTime: 0
  }
];

// =====================================================
// CONSTANTS
// =====================================================

export const SECTORS = [
  'Tecnologia',
  'Industria',
  'Comercio',
  'Servicos',
  'Agronegocio',
  'Saude',
  'Educacao',
  'Financeiro',
  'Construcao',
  'Energia',
  'Mineracao',
  'Logistica',
  'Varejo',
  'Telecomunicacoes',
  'Imobiliario',
  'Outro'
];

export const COMPANY_SIZES_LABELS: Record<CompanySize, string> = {
  startup: 'Startup (< 50 funcionarios)',
  small: 'Pequena (50-200)',
  medium: 'Media (200-1000)',
  large: 'Grande (1000-5000)',
  enterprise: 'Enterprise (> 5000)'
};

export const REVENUE_RANGES_LABELS: Record<RevenueRange, string> = {
  under_1m: 'Ate R$ 1 milhao',
  '1m_10m': 'R$ 1-10 milhoes',
  '10m_50m': 'R$ 10-50 milhoes',
  '50m_200m': 'R$ 50-200 milhoes',
  '200m_1b': 'R$ 200 milhoes - 1 bilhao',
  over_1b: 'Acima de R$ 1 bilhao'
};

export const OWNERSHIP_LABELS: Record<OwnershipStructure, string> = {
  family_owned: 'Familiar',
  private_equity: 'Private Equity',
  publicly_traded: 'Capital Aberto',
  cooperative: 'Cooperativa',
  state_owned: 'Estatal',
  mixed: 'Mista'
};

export const TARGET_MARKETS = ['B2B', 'B2C', 'B2G', 'D2C'];

export const ERP_SYSTEMS = [
  'SAP',
  'Oracle',
  'TOTVS',
  'Sankhya',
  'Omie',
  'Conta Azul',
  'Senior',
  'Outro',
  'Nenhum'
];

export const CRM_SYSTEMS = [
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'RD Station',
  'Zoho',
  'Outro',
  'Nenhum'
];

export const BI_TOOLS = [
  'Power BI',
  'Tableau',
  'Looker',
  'Metabase',
  'Google Data Studio',
  'Qlik',
  'Outro'
];

export const CERTIFICATIONS = [
  'ISO 9001',
  'ISO 14001',
  'ISO 27001',
  'ISO 45001',
  'SOC 2',
  'PCI DSS',
  'B Corp',
  'Great Place to Work',
  'Outro'
];

export const REGULATORY_BODIES = [
  'CVM',
  'BACEN',
  'ANPD',
  'ANVISA',
  'ANATEL',
  'ANS',
  'SUSEP',
  'Outro'
];

export const COMPLIANCE_FRAMEWORKS = [
  'LGPD',
  'SOX',
  'GDPR',
  'CCPA',
  'HIPAA',
  'PCI-DSS',
  'Outro'
];

export const DOCUMENT_ZONES: DocumentUploadZone[] = [
  {
    category: 'governance',
    title: 'Documentos de Governanca',
    description: 'Estatuto Social, Regimento Interno, Politicas Corporativas',
    examples: [
      'Estatuto Social (versao mais recente)',
      'Regimento Interno do Conselho',
      'Politica de Conflito de Interesses',
      'Codigo de Conduta',
      'Politica de Transacoes com Partes Relacionadas'
    ],
    required: true
  },
  {
    category: 'financial',
    title: 'Documentos Financeiros',
    description: 'Balancos, DREs, Relatorios de Auditoria (ultimos 2-3 anos)',
    examples: [
      'Demonstracoes Financeiras 2024',
      'Demonstracoes Financeiras 2025',
      'Relatorio de Auditoria Externa',
      'Orcamento Anual'
    ],
    required: false
  },
  {
    category: 'strategic',
    title: 'Documentos Estrategicos',
    description: 'Planejamento Estrategico, Apresentacoes Institucionais',
    examples: [
      'Planejamento Estrategico 2024-2026',
      'Apresentacao Institucional',
      'Plano de Negocios',
      'Analise SWOT'
    ],
    required: false
  },
  {
    category: 'minutes',
    title: 'ATAs Antigas',
    description: 'ATAs de reunioes dos ultimos 12 meses (se disponivel)',
    examples: [
      'ATAs de Conselho 2025',
      'ATAs de Assembleia 2025',
      'ATAs de Comites'
    ],
    required: false,
    maxFiles: 50
  }
];

// =====================================================
// MINIMUM VIABLE CRITERIA
// =====================================================

export const MINIMUM_VIABLE_CRITERIA = {
  minScore: 50,
  requiredPhase1Fields: [
    'legal_name',
    'tax_id',
    'primary_sector',
    'company_size',
    'headquarters_country',
    'annual_revenue_range',
    'ownership_structure'
  ],
  minProductsServices: 3,
  minDocuments: 1,
  minATAs: 1,
  minStrategicObjectives: 3,
  minKnownRisks: 5
};

