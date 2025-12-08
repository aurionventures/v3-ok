import { CompanySize, GovernancePlan, ModuleKey } from "@/types/organization";

// Módulos base por porte (herança cumulativa conforme o plano)
// Startup/Pequena: INÍCIO + PARAMETRIZAÇÃO + PREPARAÇÃO + ESTRUTURAÇÃO
// Média: + GESTÃO DE PESSOAS
// Grande: + MONITORAMENTO + Agentes IA + Submeter Projetos
// Listada: + Add-ons (ESG, Inteligência de Mercado)

const STARTUP_SMALL_MODULES: ModuleKey[] = [
  // INÍCIO
  'dashboard', 'settings', 'start',
  // PARAMETRIZAÇÃO
  'structure', 'cap_table', 'gov_maturity', 'legacy_rituals',
  // PREPARAÇÃO
  'checklist', 'interviews', 'analysis_actions',
  // ESTRUTURAÇÃO
  'gov_config', 'annual_agenda', 'secretariat', 'councils'
];

const MEDIUM_MODULES: ModuleKey[] = [
  ...STARTUP_SMALL_MODULES,
  // GESTÃO DE PESSOAS
  'leadership_performance'
];

const LARGE_MODULES: ModuleKey[] = [
  ...MEDIUM_MODULES,
  // MONITORAMENTO
  'risks', 'activities',
  // OTIMIZAÇÃO
  'ai_agents', 'project_submission'
];

const LISTED_MODULES: ModuleKey[] = [
  ...LARGE_MODULES,
  // ADD-ONS incluídos
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
 * Verifica se um módulo é premium (add-on)
 */
export function isPremiumModule(moduleKey: ModuleKey): boolean {
  const premiumList: ModuleKey[] = ['esg_maturity', 'market_intel', 'benchmarking', 'ai_agents'];
  return premiumList.includes(moduleKey);
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
  return ADDON_MODULES.some(addon => addon.key === moduleKey);
}
