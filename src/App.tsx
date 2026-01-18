import { lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LazyRouteWrapper } from "@/components/LazyRouteWrapper";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ========== Lazy Loading - Pages agrupadas por feature ==========

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Signup = lazy(() => import("./pages/Signup"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosUso = lazy(() => import("./pages/TermosUso"));
const LGPD = lazy(() => import("./pages/LGPD"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const Plataforma = lazy(() => import("./pages/Plataforma"));
const Governanca = lazy(() => import("./pages/Governanca"));
const AIEngine = lazy(() => import("./pages/AIEngine"));
const Contato = lazy(() => import("./pages/Contato"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const EmpresasLanding = lazy(() => import("./pages/EmpresasLanding"));
const ParceirosLanding = lazy(() => import("./pages/ParceirosLanding"));
const Investors = lazy(() => import("./pages/Investors"));

// Auth & Onboarding
const LoginAdmin = lazy(() => import("./components/auth/LoginAdmin"));
const DemoLogin = lazy(() => import("./pages/DemoLogin"));
const InitialSetup = lazy(() => import("./pages/InitialSetup"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const WelcomeNewUser = lazy(() => import("./pages/WelcomeNewUser"));

// Quiz & Discovery
const StandaloneQuiz = lazy(() => import("./pages/StandaloneQuiz"));
const PlanDiscoveryQuiz = lazy(() => import("./pages/PlanDiscoveryQuiz"));
const PlanResult = lazy(() => import("./pages/PlanResult"));
const MaturityQuiz = lazy(() => import("./pages/MaturityQuiz"));

// Checkout & Payment
const Checkout = lazy(() => import("./pages/Checkout"));
const ContractCheckout = lazy(() => import("./pages/ContractCheckout"));
const StripeCheckout = lazy(() => import("./pages/StripeCheckout"));
const PlanCheckout = lazy(() => import("./pages/PlanCheckout"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentConfirmed = lazy(() => import("./pages/PaymentConfirmed"));

// Guest & Token Access
const GuestAccess = lazy(() => import("./pages/GuestAccess"));
const TaskAccess = lazy(() => import("./pages/TaskAccess"));
const ATAApproval = lazy(() => import("./pages/ATAApproval"));
const GenerateCompanyToken = lazy(() => import("./pages/GenerateCompanyToken"));
const GenerateAdminToken = lazy(() => import("./pages/GenerateAdminToken"));
const GeneratePartnerToken = lazy(() => import("./pages/GeneratePartnerToken"));

// Dashboard & Core
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const AffiliateLink = lazy(() => import("./pages/partner/AffiliateLink"));
const AffiliateFunnel = lazy(() => import("./pages/partner/AffiliateFunnel"));
const AffiliateCommissions = lazy(() => import("./pages/partner/AffiliateCommissions"));
const AffiliateAcademy = lazy(() => import("./pages/partner/AffiliateAcademy"));
const AffiliateChat = lazy(() => import("./pages/partner/AffiliateChat"));
const AffiliateSettings = lazy(() => import("./pages/partner/AffiliateSettings"));

// Governance Structure
const ShareholderStructure = lazy(() => import("./pages/ShareholderStructure"));
const GovernanceConfig = lazy(() => import("./pages/GovernanceConfig"));
const Councils = lazy(() => import("./pages/Councils"));
const CapTable = lazy(() => import("./pages/CapTable"));

// Meetings & Secretariat
const AnnualAgenda = lazy(() => import("./pages/AnnualAgenda"));
const Reunioes = lazy(() => import("./pages/Reunioes"));
const ReuniaoDetalhes = lazy(() => import("./pages/ReuniaoDetalhes"));
const SecretariatPanel = lazy(() => import("./pages/SecretariatPanel"));
const ATAPendingManagement = lazy(() => import("./pages/ATAPendingManagement"));

// People & Development
const PeopleDevelopment = lazy(() => import("./pages/PeopleDevelopment"));
const PeopleManagement = lazy(() => import("./pages/PeopleManagement"));
const PeopleGovernance = lazy(() => import("./pages/PeopleGovernance"));
const BoardMembers = lazy(() => import("./pages/BoardMembers"));
const BoardPerformance = lazy(() => import("./pages/BoardPerformance"));
const Heirs = lazy(() => import("./pages/Heirs"));
const KeyPositions = lazy(() => import("./pages/KeyPositions"));
const Succession = lazy(() => import("./pages/Succession"));

// Documents & Compliance
const Documents = lazy(() => import("./pages/Documents"));
const DocumentChecklist = lazy(() => import("./pages/DocumentChecklist"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const Interviews = lazy(() => import("./pages/Interviews"));
const InitialReport = lazy(() => import("./pages/InitialReport"));

// Analytics & Intelligence
const Maturity = lazy(() => import("./pages/Maturity"));
const ESG = lazy(() => import("./pages/ESG"));
const ESGHistory = lazy(() => import("./pages/ESGHistory"));
const DadosESG = lazy(() => import("./pages/DadosESG"));
const GovernanceRiskManagement = lazy(() => import("./pages/GovernanceRiskManagement"));
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"));
const GovernanceHistory = lazy(() => import("./pages/GovernanceHistory"));
const Benchmarking = lazy(() => import("./pages/Benchmarking"));
const Insights = lazy(() => import("./pages/Insights"));
const SimuladorCenarios = lazy(() => import("./pages/SimuladorCenarios"));

// AI & Copilot
const GovernanceCopilot = lazy(() => import("./pages/GovernanceCopilot"));
const AIAgents = lazy(() => import("./pages/AIAgents"));
const AIConfig = lazy(() => import("./pages/AIConfig"));

// Monitoring & Notifications
const Monitoring = lazy(() => import("./pages/Monitoring"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Activities = lazy(() => import("./pages/Activities"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const NotificationsCenter = lazy(() => import("./pages/NotificationsCenter"));

// Security & Audit
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));

// Projects & Subsystems
const SubmitProjects = lazy(() => import("./pages/SubmitProjects"));
const Subsystems = lazy(() => import("./pages/Subsystems"));
const Legacy = lazy(() => import("./pages/Legacy"));
const Rituals = lazy(() => import("./pages/Rituals"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const PlanActivation = lazy(() => import("./pages/PlanActivation"));

// Admin
const Admin = lazy(() => import("./pages/Admin"));
const AdminFinances = lazy(() => import("./pages/AdminFinances"));
const AdminAgentConfig = lazy(() => import("./pages/AdminAgentConfig"));
const AdminPlansComparison = lazy(() => import("./pages/AdminPlansComparison"));
const AdminPricingConfig = lazy(() => import("./pages/AdminPricingConfig"));
const AdminPlanConfigurator = lazy(() => import("./pages/AdminPlanConfigurator"));
const AdminClientManagement = lazy(() => import("./pages/AdminClientManagement"));
const AdminPartners = lazy(() => import("./pages/AdminPartners"));
const AdminPartnerCommissions = lazy(() => import("./pages/AdminPartnerCommissions"));
const AdminPartnerContent = lazy(() => import("./pages/AdminPartnerContent"));
const AdminAddons = lazy(() => import("./pages/AdminAddons"));
const AdminContracts = lazy(() => import("./pages/AdminContracts"));
const AdminContractTemplates = lazy(() => import("./pages/AdminContractTemplates"));
const AdminContractManagement = lazy(() => import("./pages/AdminContractManagement"));
const ContractSign = lazy(() => import("./pages/ContractSign"));
const PartnerSignup = lazy(() => import("./pages/PartnerSignup"));
const PartnerCreatePassword = lazy(() => import("./pages/PartnerCreatePassword"));
const PartnerContractSign = lazy(() => import("./pages/PartnerContractSign"));
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"));
const AdminSales = lazy(() => import("./pages/AdminSales"));
const AdminPLGFunnel = lazy(() => import("./pages/AdminPLGFunnel"));
const AdminSLGPipeline = lazy(() => import("./pages/AdminSLGPipeline"));
const AdminPromptLibrary = lazy(() => import("./pages/AdminPromptLibrary"));
const AdminLLMManagement = lazy(() => import("./pages/AdminLLMManagement"));
const Companies = lazy(() => import("./pages/Companies"));

// Member Portal
const MemberDashboard = lazy(() => import("./pages/member/MemberDashboard"));
const MemberMaturidade = lazy(() => import("./pages/member/MemberMaturidade"));
const MemberRiscos = lazy(() => import("./pages/member/MemberRiscos"));
const MemberReunioes = lazy(() => import("./pages/member/MemberReunioes"));
const MemberVirtualAgendas = lazy(() => import("./pages/member/MemberVirtualAgendas"));
const MemberATAs = lazy(() => import("./pages/member/MemberATAs"));
const MemberPendencias = lazy(() => import("./pages/member/MemberPendencias"));
const MemberOrgaos = lazy(() => import("./pages/member/MemberOrgaos"));
const MemberDesempenho = lazy(() => import("./pages/member/MemberDesempenho"));
const MemberPerfil = lazy(() => import("./pages/member/MemberPerfil"));

// Partner Portal
const BancaDashboard = lazy(() => import("./pages/BancaDashboard"));
const ParceiroClientes = lazy(() => import("./pages/ParceiroClientes").then(m => ({ default: m.ParceiroClientes })));
const ParceiroRelatorios = lazy(() => import("./pages/ParceiroRelatorios").then(m => ({ default: m.ParceiroRelatorios })));
const ParceiroAssessments = lazy(() => import("./pages/ParceiroAssessments").then(m => ({ default: m.ParceiroAssessments })));
const ParceiroPerformance = lazy(() => import("./pages/ParceiroPerformance").then(m => ({ default: m.ParceiroPerformance })));
const ClientDetails = lazy(() => import("./pages/ClientDetails"));

// Layouts
import { BancaSidebar } from "./components/BancaSidebar";

const queryClient = new QueryClient();

const BancaLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen">
    <BancaSidebar />
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <OrganizationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <main>
              <ErrorBoundary>
                <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LazyRouteWrapper><Index /></LazyRouteWrapper>} />
          <Route path="/pricing" element={<LazyRouteWrapper><Pricing /></LazyRouteWrapper>} />
          <Route path="/privacidade" element={<LazyRouteWrapper><PoliticaPrivacidade /></LazyRouteWrapper>} />
          <Route path="/termos" element={<LazyRouteWrapper><TermosUso /></LazyRouteWrapper>} />
          <Route path="/lgpd" element={<LazyRouteWrapper><LGPD /></LazyRouteWrapper>} />
          <Route path="/sobre" element={<LazyRouteWrapper><SobreNos /></LazyRouteWrapper>} />
          <Route path="/como-funciona" element={<LazyRouteWrapper><ComoFunciona /></LazyRouteWrapper>} />
          <Route path="/plataforma" element={<LazyRouteWrapper><Plataforma /></LazyRouteWrapper>} />
          <Route path="/governanca" element={<LazyRouteWrapper><Governanca /></LazyRouteWrapper>} />
          <Route path="/ai-engine" element={<LazyRouteWrapper><AIEngine /></LazyRouteWrapper>} />
          <Route path="/contato" element={<LazyRouteWrapper><Contato /></LazyRouteWrapper>} />
          <Route path="/blog" element={<LazyRouteWrapper><Blog /></LazyRouteWrapper>} />
          <Route path="/blog/:slug" element={<LazyRouteWrapper><BlogArticle /></LazyRouteWrapper>} />
          <Route path="/signup" element={<LazyRouteWrapper><Signup /></LazyRouteWrapper>} />
          <Route path="/contract/sign/:token" element={<LazyRouteWrapper><ContractSign /></LazyRouteWrapper>} />
          <Route path="/parceiros/cadastro" element={<LazyRouteWrapper><PartnerSignup /></LazyRouteWrapper>} />
          <Route path="/parceiros/criar-senha" element={<LazyRouteWrapper><PartnerCreatePassword /></LazyRouteWrapper>} />
          <Route path="/parceiros/contrato" element={<LazyRouteWrapper><PartnerContractSign /></LazyRouteWrapper>} />
          <Route path="/parceiros/contrato/assinatura/:token" element={<LazyRouteWrapper><ContractSign /></LazyRouteWrapper>} />
          <Route path="/welcome" element={<LazyRouteWrapper><WelcomeNewUser /></LazyRouteWrapper>} />
          <Route path="/onboarding-wizard" element={<LazyRouteWrapper><OnboardingWizard /></LazyRouteWrapper>} />
          <Route path="/invite/accept" element={<LazyRouteWrapper><AcceptInvite /></LazyRouteWrapper>} />
          <Route path="/empresas" element={<LazyRouteWrapper><EmpresasLanding /></LazyRouteWrapper>} />
          <Route path="/parceiros" element={<LazyRouteWrapper><ParceirosLanding /></LazyRouteWrapper>} />
          <Route path="/investors" element={<LazyRouteWrapper><Investors /></LazyRouteWrapper>} />
          <Route path="/login" element={<LazyRouteWrapper><Login /></LazyRouteWrapper>} />
          <Route path="/diagnostic-quiz" element={<LazyRouteWrapper><StandaloneQuiz /></LazyRouteWrapper>} />
          <Route path="/standalone-quiz" element={<LazyRouteWrapper><StandaloneQuiz /></LazyRouteWrapper>} />
          <Route path="/plan-discovery" element={<LazyRouteWrapper><PlanDiscoveryQuiz /></LazyRouteWrapper>} />
          <Route path="/plan-result" element={<LazyRouteWrapper><PlanResult /></LazyRouteWrapper>} />
          <Route path="/checkout" element={<LazyRouteWrapper><StripeCheckout /></LazyRouteWrapper>} />
          <Route path="/checkout-legacy" element={<LazyRouteWrapper><Checkout /></LazyRouteWrapper>} />
          <Route path="/checkout-contrato" element={<LazyRouteWrapper><ContractCheckout /></LazyRouteWrapper>} />
          <Route path="/plan-checkout" element={<LazyRouteWrapper><PlanCheckout /></LazyRouteWrapper>} />
          <Route path="/payment" element={<LazyRouteWrapper><Payment /></LazyRouteWrapper>} />
          <Route path="/payment-confirmed" element={<LazyRouteWrapper><PaymentConfirmed /></LazyRouteWrapper>} />
          <Route path="/email-confirmation" element={<LazyRouteWrapper><EmailConfirmation /></LazyRouteWrapper>} />
          <Route path="/demo-login" element={<LazyRouteWrapper><DemoLogin /></LazyRouteWrapper>} />
          <Route path="/initial-setup" element={<LazyRouteWrapper><InitialSetup /></LazyRouteWrapper>} />
          <Route path="/guest-access/:token" element={<LazyRouteWrapper><GuestAccess /></LazyRouteWrapper>} />
          <Route path="/task-access/:token" element={<LazyRouteWrapper><TaskAccess /></LazyRouteWrapper>} />
          <Route path="/ata-approval/:token" element={<LazyRouteWrapper><ATAApproval /></LazyRouteWrapper>} />
          <Route 
            path="/member-portal" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><MemberDashboard /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/maturidade" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><MemberMaturidade /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/riscos" 
            element={
              <ProtectedRoute>
                <MemberRiscos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/reunioes"
            element={
              <ProtectedRoute>
                <MemberReunioes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/pautas-virtuais" 
            element={
              <ProtectedRoute>
                <MemberVirtualAgendas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/atas" 
            element={
              <ProtectedRoute>
                <MemberATAs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/pendencias" 
            element={
              <ProtectedRoute>
                <MemberPendencias />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/orgaos" 
            element={
              <ProtectedRoute>
                <MemberOrgaos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/desempenho" 
            element={
              <ProtectedRoute>
                <MemberDesempenho />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/perfil" 
            element={
              <ProtectedRoute>
                <MemberPerfil />
              </ProtectedRoute>
            } 
          />
          <Route path="/generate-company-token" element={<LazyRouteWrapper><GenerateCompanyToken /></LazyRouteWrapper>} />
          <Route path="/generate-admin-token" element={<LazyRouteWrapper><GenerateAdminToken /></LazyRouteWrapper>} />
          <Route path="/generate-partner-token" element={<LazyRouteWrapper><GeneratePartnerToken /></LazyRouteWrapper>} />
          
          {/* Plan Activation (semi-protected - after quiz, before full access) */}
          <Route 
            path="/plan-activation" 
            element={
              <ProtectedRoute>
                <PlanActivation />
              </ProtectedRoute>
            } 
          />
          
          {/* Cliente Routes */}
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><Dashboard /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shareholder-structure" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><ShareholderStructure /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-development" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><PeopleDevelopment /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-management" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><PeopleManagement /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subsystems" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Subsystems /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/legacy" 
            element={<Navigate to="/governance-config?tab=legado" replace />}
          />
          <Route 
            path="/annual-agenda" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><AnnualAgenda /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
      <Route 
        path="/governance-config" 
        element={
          <ProtectedRoute >
            <GovernanceConfig />
          </ProtectedRoute>
        } 
      />
      <Route path="/councils" element={<Navigate to="/governance-config" replace />} />
          <Route 
            path="/secretariat" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><SecretariatPanel /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ata-pending" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><ATAPendingManagement /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-projects" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><SubmitProjects /></LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/rituals" 
            element={<Navigate to="/governance-config?tab=rituais" replace />}
          />
          <Route 
            path="/succession" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Succession /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={<Navigate to="/document-checklist?tab=biblioteca" replace />}
          />
          <Route 
            path="/maturity" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Maturity /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Index /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maturity-quiz" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><MaturityQuiz /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/esg" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><ESG /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/governance-risk-management" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><GovernanceRiskManagement /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/market-intelligence" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><MarketIntelligence /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cap-table"
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><CapTable /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Settings /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracoes/notificacoes" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><NotificationSettings /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications-center" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><NotificationsCenter /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities" 
            element={<Navigate to="/settings?tab=activities" replace />}
          />
          <Route 
            path="/monitoring" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Monitoring /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Alerts /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-input" 
            element={<Navigate to="/maturity?tab=new-assessment" replace />}
          />
          <Route 
            path="/benchmarking" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Benchmarking /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Insights /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simulador-cenarios" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><SimuladorCenarios /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reunioes" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Reunioes /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reuniao/:id" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><ReuniaoDetalhes /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Onboarding /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document-checklist" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><DocumentChecklist /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interviews" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Interviews /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/initial-report" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><InitialReport /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/governance-history" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><GovernanceHistory /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/esg-history" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><ESGHistory /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dados-esg" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><DadosESG /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-governance" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><PeopleGovernance /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/heirs" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><Heirs /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/key-positions" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><KeyPositions /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/board-members" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><BoardMembers /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/board-performance" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><BoardPerformance /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge-base" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><KnowledgeBase /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          
          {/* AI Copilot Routes */}
          <Route 
            path="/copilot" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><GovernanceCopilot /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/copiloto-governanca" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><GovernanceCopilot /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-agents" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><AIAgents /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-config" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><AIConfig /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<LazyRouteWrapper><Admin /></LazyRouteWrapper>} />
          <Route path="/admin/finances" element={<LazyRouteWrapper><AdminFinances /></LazyRouteWrapper>} />
          <Route path="/admin/agent-config" element={<LazyRouteWrapper><AdminAgentConfig /></LazyRouteWrapper>} />
          <Route path="/admin/plans-comparison" element={<LazyRouteWrapper><AdminPlansComparison /></LazyRouteWrapper>} />
          <Route path="/admin/pricing-config" element={<LazyRouteWrapper><AdminPricingConfig /></LazyRouteWrapper>} />
          <Route path="/admin/plan-configurator" element={<LazyRouteWrapper><AdminPlanConfigurator /></LazyRouteWrapper>} />
          <Route path="/admin/client-management" element={<LazyRouteWrapper><AdminClientManagement /></LazyRouteWrapper>} />
          <Route path="/admin/partners" element={<LazyRouteWrapper><AdminPartners /></LazyRouteWrapper>} />
          <Route path="/admin/addons" element={<LazyRouteWrapper><AdminAddons /></LazyRouteWrapper>} />
          <Route path="/admin/contracts" element={<LazyRouteWrapper><AdminContracts /></LazyRouteWrapper>} />
          <Route path="/admin/contract-templates" element={<LazyRouteWrapper><AdminContractTemplates /></LazyRouteWrapper>} />
          <Route path="/admin/contract-management" element={<LazyRouteWrapper><AdminContractManagement /></LazyRouteWrapper>} />
          <Route path="/admin/invoices" element={<LazyRouteWrapper><AdminInvoices /></LazyRouteWrapper>} />
          <Route path="/admin/sales" element={<LazyRouteWrapper><AdminSales /></LazyRouteWrapper>} />
          <Route path="/admin/plg-funnel" element={<LazyRouteWrapper><AdminPLGFunnel /></LazyRouteWrapper>} />
          <Route path="/admin/slg-pipeline" element={<LazyRouteWrapper><AdminSLGPipeline /></LazyRouteWrapper>} />
          <Route path="/admin/prompt-library" element={<LazyRouteWrapper><AdminPromptLibrary /></LazyRouteWrapper>} />
          <Route path="/admin/llm-management" element={<LazyRouteWrapper><AdminLLMManagement /></LazyRouteWrapper>} />
          <Route path="/admin/companies" element={<LazyRouteWrapper><Companies /></LazyRouteWrapper>} />
          {/* Portuguese route aliases for admin sidebar */}
          <Route path="/admin/empresas" element={<LazyRouteWrapper><Companies /></LazyRouteWrapper>} />
          <Route path="/admin/vendas" element={<LazyRouteWrapper><AdminSales /></LazyRouteWrapper>} />
          <Route path="/admin/planos" element={<LazyRouteWrapper><AdminPricingConfig /></LazyRouteWrapper>} />
          <Route path="/admin/contratos" element={<LazyRouteWrapper><AdminContracts /></LazyRouteWrapper>} />
          <Route path="/admin/faturas" element={<LazyRouteWrapper><AdminInvoices /></LazyRouteWrapper>} />
          <Route path="/admin/prompts" element={<LazyRouteWrapper><AdminPromptLibrary /></LazyRouteWrapper>} />
          <Route path="/admin/settings" element={<LazyRouteWrapper><Settings /></LazyRouteWrapper>} />
          <Route path="/admin/parceiros" element={<LazyRouteWrapper><AdminPartners /></LazyRouteWrapper>} />
          <Route path="/admin/parceiros/comissoes" element={<LazyRouteWrapper><AdminPartnerCommissions /></LazyRouteWrapper>} />
          <Route path="/admin/parceiros/conteudo" element={<LazyRouteWrapper><AdminPartnerContent /></LazyRouteWrapper>} />
          <Route path="/login-admin" element={<LazyRouteWrapper><LoginAdmin /></LazyRouteWrapper>} />
          
          {/* Audit & Security */}
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><AuditLogs /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security-dashboard" 
            element={
              <ProtectedRoute >
                <LazyRouteWrapper><SecurityDashboard /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          
          {/* Parceiro Routes */}
          <Route 
            path="/afiliado" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateDashboard /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/link" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateLink /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/funil" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateFunnel /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/comissoes" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateCommissions /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/academy" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateAcademy /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/chat" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateChat /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/afiliado/configuracoes" 
            element={
              <ProtectedRoute>
                <LazyRouteWrapper><AffiliateSettings /></LazyRouteWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <BancaDashboard />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca/clientes" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <ParceiroClientes />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca/relatorios" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <ParceiroRelatorios />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca/assessments" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <ParceiroAssessments />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca/performance" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <ParceiroPerformance />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banca/cliente/:id" 
            element={
              <ProtectedRoute>
                <BancaLayout>
                  <ClientDetails />
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<LazyRouteWrapper><NotFound /></LazyRouteWrapper>} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </BrowserRouter>
      </OrganizationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
