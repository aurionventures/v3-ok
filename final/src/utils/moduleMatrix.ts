import { CompanySize, GovernancePlan, ModuleKey } from "@/types/organization";

// ==========================================
// PREÇOS DOS PLANOS BASE POR PORTE
// ==========================================
export const PLAN_PRICES: Record<CompanySize, number> = {
  startup: 3990,
  small: 5990,
  medium: 12900,
  large: 29900,
  listed: 69990
};

// ==========================================
// PREÇOS INDIVIDUAIS DOS ADD-ONS
// ==========================================
export const ADDON_PRICES: Record<string, number> & { esg: number; market_intel: number } = {
  ai_agents: 2990,
  project_submission: 1990,
  leadership_performance: 2490,
  risks: 1990,
  esg_maturity: 3990,
  esg: 3990, // Alias para compatibilidade
  market_intel: 4990, // Inclui benchmarking
  benchmarking: 0 // Incluído com market_intel
};

// Detalhes dos Add-ons para exibição
export const ADDON_DETAILS: Record<string, { 
  label: string; 
  description: string; 
  section: string;
  targetSection?: string;
  includesModules?: ModuleKey[];
}> = {
  ai_agents: {
    label: 'Agentes de IA',
    description: 'Automação de processos com IA',
    section: 'INÍCIO',
    targetSection: 'inicio'
  },
  project_submission: {
    label: 'Submeter Projetos',
    description: 'Fluxo de aprovação de projetos',
    section: 'ESTRUTURAÇÃO',
    targetSection: 'estruturacao'
  },
  leadership_performance: {
    label: 'Gestão de Pessoas',
    description: 'Desenvolvimento e PDI de lideranças',
    section: 'GESTÃO DE PESSOAS'
  },
  risks: {
    label: 'Monitoramento de Riscos',
    description: 'Gestão de riscos de governança',
    section: 'MONITORAMENTO'
  },
  esg_maturity: {
    label: 'ESG',
    description: 'Avaliação de maturidade ESG',
    section: 'ESG'
  },
  market_intel: {
    label: 'Inteligência de Mercado',
    description: 'Análise de mercado e benchmarking',
    section: 'INTELIGÊNCIA DE MERCADO',
    includesModules: ['benchmarking']
  }
};

// Pacote Full com desconto
export const FULL_PACKAGE = {
  originalPrice: 78970,
  discountedPrice: 75970
};

// ==========================================
// MÓDULOS BASE (incluídos em todos os planos)
// ==========================================
export const CORE_BASE_MODULES: ModuleKey[] = [
  // INÍCIO
  'dashboard', 'settings',
  // PARAMETRIZAÇÃO
  'structure', 'cap_table', 'gov_maturity',
  // PREPARAÇÃO
  'checklist', 'interviews', 'analysis_actions',
  // ESTRUTURAÇÃO
  'gov_config', 'annual_agenda', 'secretariat', 'councils',
  // FIXOS
  'activities'
];

// ==========================================
// MÓDULOS ADD-ON (contratados separadamente)
// ==========================================
export const ALL_ADDON_MODULES: ModuleKey[] = [
  'ai_agents', 'project_submission',
  'leadership_performance', 'risks',
  'esg_maturity', 'market_intel', 'benchmarking'
];

// ==========================================
// MÓDULOS POR PORTE (para compatibilidade)
// ==========================================
const STARTUP_SMALL_MODULES: ModuleKey[] = [...CORE_BASE_MODULES];

const MEDIUM_MODULES: ModuleKey[] = [
  ...STARTUP_SMALL_MODULES,
  'leadership_performance'
];

const LARGE_MODULES: ModuleKey[] = [
  ...MEDIUM_MODULES,
  'risks', 'ai_agents', 'project_submission'
];

const LISTED_MODULES: ModuleKey[] = [
  ...LARGE_MODULES,
  'esg_maturity', 'market_intel', 'benchmarking'
];

export const BASE_MODULES: Record<CompanySize, ModuleKey[]> = {
  startup: STARTUP_SMALL_MODULES,
  small: STARTUP_SMALL_MODULES,
  medium: MEDIUM_MODULES,
  large: LARGE_MODULES,
  listed: LISTED_MODULES
};

// Add-ons disponíveis para contratação separada
export const ADDON_MODULES: { key: ModuleKey; label: string; section: string }[] = [
  { key: 'ai_agents', label: 'Agentes de IA', section: 'Otimização' },
  { key: 'project_submission', label: 'Submeter Projetos', section: 'Estruturação' },
  { key: 'leadership_performance', label: 'Gestão de Pessoas', section: 'Desenvolvimento' },
  { key: 'risks', label: 'Riscos', section: 'Monitoramento' },
  { key: 'esg_maturity', label: 'Maturidade ESG', section: 'ESG' },
  { key: 'market_intel', label: 'Inteligência de Mercado', section: 'Inteligência de Mercado' },
  { key: 'benchmarking', label: 'Benchmarking Global', section: 'Inteligência de Mercado' },
];

// Módulos premium por plano (add-ons extras que o plano pode incluir)
const PREMIUM_MODULES: Record<GovernancePlan, ModuleKey[]> = {
  core: [],
  governance_plus: ['ai_agents'],
  people_esg: ['esg_maturity'],
  legacy_360: ['esg_maturity', 'market_intel', 'benchmarking', 'ai_agents']
};

/**
 * Retorna os módulos habilitados para um porte e plano específicos
 */
export function getDefaultModules(companySize: CompanySize, plan: GovernancePlan): ModuleKey[] {
  const baseModules = BASE_MODULES[companySize];
  const premiumModules = PREMIUM_MODULES[plan];
  
  // Combinar módulos base + premium sem duplicatas
  const allModules = new Set([...baseModules, ...premiumModules]);
  return Array.from(allModules);
}

/**
 * Retorna módulos habilitados baseado em porte + addons selecionados
 */
export function getModulesWithAddons(companySize: CompanySize, enabledAddons: ModuleKey[]): ModuleKey[] {
  const baseModules = CORE_BASE_MODULES;
  
  // Adicionar add-ons selecionados
  const allModules = new Set([...baseModules, ...enabledAddons]);
  
  // Se market_intel está ativo, incluir benchmarking
  if (enabledAddons.includes('market_intel')) {
    allModules.add('benchmarking');
  }
  
  return Array.from(allModules);
}

/**
 * Calcula o preço total baseado no porte + add-ons selecionados
 */
export function calculateTotalPrice(companySize: CompanySize, enabledAddons: ModuleKey[]): number {
  const basePrice = PLAN_PRICES[companySize];
  
  const addonsPrice = enabledAddons.reduce((total, addon) => {
    return total + (ADDON_PRICES[addon] || 0);
  }, 0);
  
  return basePrice + addonsPrice;
}

/**
 * Verifica se um módulo é premium (add-on)
 */
export function isPremiumModule(moduleKey: ModuleKey): boolean {
  return ALL_ADDON_MODULES.includes(moduleKey);
}

/**
 * Retorna a descrição do porte da empresa
 */
export function getCompanySizeDescription(size: CompanySize): string {
  const descriptions: Record<CompanySize, string> = {
    startup: 'Empresas em estágio inicial com estrutura de governança básica',
    small: 'Pequenas empresas com necessidades de documentação e preparação',
    medium: 'Empresas médias com gestão de pessoas e desenvolvimento',
    large: 'Grandes empresas com monitoramento e IA',
    listed: 'Empresas listadas com todos os módulos e compliance completo'
  };
  return descriptions[size];
}

/**
 * Retorna todos os módulos possíveis no sistema
 */
export function getAllModules(): ModuleKey[] {
  return LISTED_MODULES;
}

/**
 * Verifica se um módulo está incluído em um determinado porte
 */
export function isModuleIncludedInSize(moduleKey: ModuleKey, size: CompanySize): boolean {
  return BASE_MODULES[size].includes(moduleKey);
}

/**
 * Verifica se um módulo é add-on
 */
export function isAddonModule(moduleKey: ModuleKey): boolean {
  return ALL_ADDON_MODULES.includes(moduleKey);
}
