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
export { default as MaturityQuiz } from '../pages/MaturityQuiz';
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

// Alerts & Notifications
export { default as Alerts } from '../pages/Alerts';
export { default as NotificationSettings } from '../pages/NotificationSettings';
export { default as NotificationsCenter } from '../pages/NotificationsCenter';

// Projects & Subsystems
export { default as Subsystems } from '../pages/Subsystems';
export { default as Onboarding } from '../pages/Onboarding';

// Meetings & Boards
export { default as Councils } from '../pages/Councils';
export { default as ReuniaoDetalhes } from '../pages/ReuniaoDetalhes';
export { default as ATAPendingManagement } from '../pages/ATAPendingManagement';
export { default as BoardMembers } from '../pages/BoardMembers';
export { default as BoardPerformance } from '../pages/BoardPerformance';
export { default as KeyPositions } from '../pages/KeyPositions';
export { default as Insights } from '../pages/Insights';
export { default as SimuladorCenarios } from '../pages/SimuladorCenarios';

// AI Engine
export { default as AIAgents } from '../pages/AIAgents';
export { default as AIConfig } from '../pages/AIConfig';

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

// Admin (rotas adicionais)
export { default as AdminPlansComparison } from '../pages/AdminPlansComparison';
export { default as AdminPricingConfig } from '../pages/AdminPricingConfig';
export { default as AdminPlanConfigurator } from '../pages/AdminPlanConfigurator';
export { default as AdminPartnerCommissions } from '../pages/AdminPartnerCommissions';
export { default as AdminPartnerContent } from '../pages/AdminPartnerContent';
export { default as AdminAddons } from '../pages/AdminAddons';
export { default as AdminContractTemplates } from '../pages/AdminContractTemplates';
export { default as AdminContractManagement } from '../pages/AdminContractManagement';
export { default as AdminTierConfig } from '../pages/AdminTierConfig';
export { default as AdminInvoices } from '../pages/AdminInvoices';
export { default as AdminPLGFunnel } from '../pages/AdminPLGFunnel';
export { default as AdminSLGPipeline } from '../pages/AdminSLGPipeline';
export { default as AdminLLMManagement } from '../pages/AdminLLMManagement';
export { default as Companies } from '../pages/Companies';

// Security & Audit
export { default as AuditLogs } from '../pages/AuditLogs';
export { default as SecurityDashboard } from '../pages/SecurityDashboard';

// Projects & Legacy
export { default as SubmitProjects } from '../pages/SubmitProjects';
export { default as Legacy } from '../pages/Legacy';
export { default as Rituals } from '../pages/Rituals';
export { default as PlanActivation } from '../pages/PlanActivation';

// Member Portal
export { default as MemberDashboard } from '../pages/member/MemberDashboard';
export { default as MemberMaturidade } from '../pages/member/MemberMaturidade';
export { default as MemberRiscos } from '../pages/member/MemberRiscos';
export { default as MemberReunioes } from '../pages/member/MemberReunioes';
export { default as MemberVirtualAgendas } from '../pages/member/MemberVirtualAgendas';
export { default as MemberATAs } from '../pages/member/MemberATAs';
export { default as MemberPendencias } from '../pages/member/MemberPendencias';
export { default as MemberOrgaos } from '../pages/member/MemberOrgaos';
export { default as MemberDesempenho } from '../pages/member/MemberDesempenho';
export { default as MemberPerfil } from '../pages/member/MemberPerfil';

// Partner Portal
export { default as PartnerDashboard } from '../pages/PartnerDashboard';
export { default as AffiliateDashboard } from '../pages/AffiliateDashboard';
export { default as AffiliateLink } from '../pages/partner/AffiliateLink';
export { default as AffiliateFunnel } from '../pages/partner/AffiliateFunnel';
export { default as AffiliateCommissions } from '../pages/partner/AffiliateCommissions';
export { default as AffiliateAcademy } from '../pages/partner/AffiliateAcademy';
export { default as AffiliateChat } from '../pages/partner/AffiliateChat';
export { default as AffiliateSettings } from '../pages/partner/AffiliateSettings';
export { default as BancaDashboard } from '../pages/BancaDashboard';
export { ParceiroClientes } from '../pages/ParceiroClientes';
export { ParceiroRelatorios } from '../pages/ParceiroRelatorios';
export { ParceiroAssessments } from '../pages/ParceiroAssessments';
export { ParceiroPerformance } from '../pages/ParceiroPerformance';
export { default as ClientDetails } from '../pages/ClientDetails';
