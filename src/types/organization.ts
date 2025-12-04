// Tipos de porte da empresa
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'listed';

// Planos de governança
export type GovernancePlan = 'core' | 'governance_plus' | 'people_esg' | 'legacy_360';

// Chaves de todos os módulos
export type ModuleKey =
  | 'dashboard' | 'settings' | 'start'
  | 'structure' | 'cap_table' | 'gov_maturity' | 'legacy_rituals'
  | 'checklist' | 'interviews' | 'analysis_actions'
  | 'gov_config' | 'annual_agenda' | 'secretariat' | 'councils'
  | 'project_submission' | 'leadership_performance'
  | 'risks' | 'activities'
  | 'esg_maturity' | 'market_intel' | 'benchmarking'
  | 'ai_agents';

// Interface da Organização
export interface Organization {
  id: string;
  name: string;
  companySize: CompanySize;
  plan: GovernancePlan;
  enabledModules: ModuleKey[];
  onboardingCompleted: boolean;
}

// Labels para exibição
export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  startup: 'Startup',
  small: 'Pequena Empresa',
  medium: 'Média Empresa',
  large: 'Grande Empresa',
  listed: 'Empresa Listada'
};

export const PLAN_LABELS: Record<GovernancePlan, string> = {
  core: 'Core',
  governance_plus: 'Governance Plus',
  people_esg: 'People & ESG',
  legacy_360: 'Legacy 360'
};
