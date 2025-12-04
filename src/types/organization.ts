// Tipos de porte da empresa
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'listed';

// Papéis dentro da organização cliente
export type OrganizationUserRole = 'org_admin' | 'org_user' | 'org_member';

// Interface de usuário dentro da organização
export interface OrganizationUser {
  id: string;
  email: string;
  name: string;
  orgRole: OrganizationUserRole;
  company_id: string;
  councilMemberships?: string[]; // IDs dos conselhos que participa
  status: 'active' | 'pending' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

// Labels para papéis organizacionais
export const ORG_ROLE_LABELS: Record<OrganizationUserRole, string> = {
  org_admin: 'Administrador',
  org_user: 'Usuário',
  org_member: 'Membro/Conselheiro'
};

export const ORG_ROLE_DESCRIPTIONS: Record<OrganizationUserRole, string> = {
  org_admin: 'Acesso total: Dashboard, Configurações, Secretariado, Gestão de Usuários',
  org_user: 'Acesso limitado: Dashboard e visualização de dados',
  org_member: 'Portal do Membro: Calendário, Reuniões, ATAs, Aprovações, Assinaturas, Pendências'
};

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
