import { CompanySize, GovernancePlan, ModuleKey } from "@/types/organization";

// Módulos base por porte (herança cumulativa)
const BASE_MODULES: Record<CompanySize, ModuleKey[]> = {
  startup: [
    'dashboard', 'settings', 'start',
    'gov_config', 'annual_agenda', 'secretariat', 'councils',
    'gov_maturity', 'risks', 'activities'
  ],
  small: [
    'dashboard', 'settings', 'start',
    'gov_config', 'annual_agenda', 'secretariat', 'councils',
    'gov_maturity', 'risks', 'activities',
    'structure', 'legacy_rituals',
    'checklist', 'interviews', 'analysis_actions'
  ],
  medium: [
    'dashboard', 'settings', 'start',
    'gov_config', 'annual_agenda', 'secretariat', 'councils',
    'gov_maturity', 'risks', 'activities',
    'structure', 'legacy_rituals',
    'checklist', 'interviews', 'analysis_actions',
    'cap_table', 'leadership_performance'
  ],
  large: [
    'dashboard', 'settings', 'start',
    'gov_config', 'annual_agenda', 'secretariat', 'councils',
    'gov_maturity', 'risks', 'activities',
    'structure', 'legacy_rituals',
    'checklist', 'interviews', 'analysis_actions',
    'cap_table', 'leadership_performance',
    'project_submission'
  ],
  listed: [
    'dashboard', 'settings', 'start',
    'gov_config', 'annual_agenda', 'secretariat', 'councils',
    'gov_maturity', 'risks', 'activities',
    'structure', 'legacy_rituals',
    'checklist', 'interviews', 'analysis_actions',
    'cap_table', 'leadership_performance',
    'project_submission',
    'esg_maturity', 'market_intel', 'benchmarking', 'ai_agents'
  ]
};

// Módulos premium por plano
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
    medium: 'Empresas médias com cap table e gestão de pessoas',
    large: 'Grandes empresas com submissão de projetos e gestão avançada',
    listed: 'Empresas listadas com todos os módulos e compliance completo'
  };
  return descriptions[size];
}
