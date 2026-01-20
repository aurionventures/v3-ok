/**
 * MainRoutes - Importações diretas (sem lazy) para rotas principais
 * Elimina Suspense e flash branco ao navegar
 */

// Dashboard & Core
export { default as Dashboard } from '../pages/Dashboard';
export { default as Settings } from '../pages/Settings';

// Governance Structure
export { default as ShareholderStructure } from '../pages/ShareholderStructure';
export { default as GovernanceConfig } from '../pages/GovernanceConfig';
export { default as CapTable } from '../pages/CapTable';

// Meetings & Secretariat
export { default as AnnualAgenda } from '../pages/AnnualAgenda';
export { default as Reunioes } from '../pages/Reunioes';
export { default as SecretariatPanel } from '../pages/SecretariatPanel';

// People & Development
export { default as PeopleDevelopment } from '../pages/PeopleDevelopment';
export { default as PeopleManagement } from '../pages/PeopleManagement';
export { default as PeopleGovernance } from '../pages/PeopleGovernance';
export { default as Succession } from '../pages/Succession';
export { default as Heirs } from '../pages/Heirs';

// Documents & Compliance
export { default as DocumentChecklist } from '../pages/DocumentChecklist';
export { default as KnowledgeBase } from '../pages/KnowledgeBase';
export { default as Interviews } from '../pages/Interviews';
export { default as InitialReport } from '../pages/InitialReport';

// Analytics & Intelligence
export { default as Maturity } from '../pages/Maturity';
export { default as ESG } from '../pages/ESG';
export { default as ESGHistory } from '../pages/ESGHistory';
export { default as DadosESG } from '../pages/DadosESG';
export { default as GovernanceRiskManagement } from '../pages/GovernanceRiskManagement';
export { default as GovernanceHistory } from '../pages/GovernanceHistory';
export { default as Benchmarking } from '../pages/Benchmarking';
export { default as MarketIntelligence } from '../pages/MarketIntelligence';

// AI & Copilot
export { default as GovernanceCopilot } from '../pages/GovernanceCopilot';

// Monitoring & Notifications
export { default as Monitoring } from '../pages/Monitoring';
export { default as Activities } from '../pages/Activities';

// Projects & Subsystems
export { default as Subsystems } from '../pages/Subsystems';
export { default as Onboarding } from '../pages/Onboarding';

// Admin (rotas principais)
export { default as Admin } from '../pages/Admin';
export { default as AdminDiscountCoupons } from '../pages/AdminDiscountCoupons';
export { default as AdminPartners } from '../pages/AdminPartners';
export { default as AdminClientManagement } from '../pages/AdminClientManagement';
export { default as AdminContracts } from '../pages/AdminContracts';
export { default as AdminFinances } from '../pages/AdminFinances';
export { default as AdminSales } from '../pages/AdminSales';
export { default as AdminPromptLibrary } from '../pages/AdminPromptLibrary';
export { default as AdminAgentConfig } from '../pages/AdminAgentConfig';
export { default as AdminGovMetrixCRM } from '../pages/AdminGovMetrixCRM';
