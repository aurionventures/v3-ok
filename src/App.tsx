import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageSkeleton } from "@/components/ui/page-skeleton";

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

// Quiz & Discovery
const StandaloneQuiz = lazy(() => import("./pages/StandaloneQuiz"));
const PlanDiscoveryQuiz = lazy(() => import("./pages/PlanDiscoveryQuiz"));
const PlanResult = lazy(() => import("./pages/PlanResult"));
const MaturityQuiz = lazy(() => import("./pages/MaturityQuiz"));

// Checkout & Payment
const Checkout = lazy(() => import("./pages/Checkout"));
const ContractCheckout = lazy(() => import("./pages/ContractCheckout"));
const StripeCheckout = lazy(() => import("./pages/StripeCheckout"));
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
const AdminAddons = lazy(() => import("./pages/AdminAddons"));
const AdminContracts = lazy(() => import("./pages/AdminContracts"));
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"));
const AdminSales = lazy(() => import("./pages/AdminSales"));
const AdminPromptLibrary = lazy(() => import("./pages/AdminPromptLibrary"));
const AdminLLMManagement = lazy(() => import("./pages/AdminLLMManagement"));
const Companies = lazy(() => import("./pages/Companies"));

// Member Portal
const MemberDashboard = lazy(() => import("./pages/member/MemberDashboard"));
const MemberMaturidade = lazy(() => import("./pages/member/MemberMaturidade"));
const MemberRiscos = lazy(() => import("./pages/member/MemberRiscos"));
const MemberReunioes = lazy(() => import("./pages/member/MemberReunioes"));
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
              <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos" element={<TermosUso />} />
          <Route path="/lgpd" element={<LGPD />} />
          <Route path="/sobre" element={<SobreNos />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/plataforma" element={<Plataforma />} />
          <Route path="/governanca" element={<Governanca />} />
          <Route path="/ai-engine" element={<AIEngine />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
          <Route path="/invite/accept" element={<AcceptInvite />} />
          <Route path="/empresas" element={<EmpresasLanding />} />
          <Route path="/parceiros" element={<ParceirosLanding />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diagnostic-quiz" element={<StandaloneQuiz />} />
          <Route path="/standalone-quiz" element={<StandaloneQuiz />} />
          <Route path="/plan-discovery" element={<PlanDiscoveryQuiz />} />
          <Route path="/plan-result" element={<PlanResult />} />
          <Route path="/checkout" element={<StripeCheckout />} />
          <Route path="/checkout-legacy" element={<Checkout />} />
          <Route path="/checkout-contrato" element={<ContractCheckout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-confirmed" element={<PaymentConfirmed />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
          <Route path="/guest-access/:token" element={<GuestAccess />} />
          <Route path="/task-access/:token" element={<TaskAccess />} />
          <Route path="/ata-approval/:token" element={<ATAApproval />} />
          <Route 
            path="/member-portal" 
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-portal/maturidade" 
            element={
              <ProtectedRoute>
                <MemberMaturidade />
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
          <Route path="/generate-company-token" element={<GenerateCompanyToken />} />
          <Route path="/generate-admin-token" element={<GenerateAdminToken />} />
          <Route path="/generate-partner-token" element={<GeneratePartnerToken />} />
          
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
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shareholder-structure" 
            element={
              <ProtectedRoute >
                <ShareholderStructure />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-development" 
            element={
              <ProtectedRoute >
                <PeopleDevelopment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-management" 
            element={
              <ProtectedRoute >
                <PeopleManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subsystems" 
            element={
              <ProtectedRoute >
                <Subsystems />
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
                <AnnualAgenda />
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
                <SecretariatPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ata-pending" 
            element={
              <ProtectedRoute >
                <ATAPendingManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-projects" 
            element={
              <ProtectedRoute >
                <SubmitProjects />
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
                <Succession />
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
                <Maturity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute >
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maturity-quiz" 
            element={
              <ProtectedRoute >
                <MaturityQuiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/esg" 
            element={
              <ProtectedRoute >
                <ESG />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/governance-risk-management" 
            element={
              <ProtectedRoute >
                <GovernanceRiskManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/market-intelligence" 
            element={
              <ProtectedRoute >
                <MarketIntelligence />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cap-table"
            element={
              <ProtectedRoute >
                <CapTable />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute >
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracoes/notificacoes" 
            element={
              <ProtectedRoute >
                <NotificationSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications-center" 
            element={
              <ProtectedRoute >
                <NotificationsCenter />
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
                <Monitoring />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute >
                <Alerts />
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
                <Benchmarking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute >
                <Insights />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simulador-cenarios" 
            element={
              <ProtectedRoute >
                <SimuladorCenarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reunioes" 
            element={
              <ProtectedRoute >
                <Reunioes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reuniao/:id" 
            element={
              <ProtectedRoute >
                <ReuniaoDetalhes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute >
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document-checklist" 
            element={
              <ProtectedRoute >
                <DocumentChecklist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interviews" 
            element={
              <ProtectedRoute >
                <Interviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/initial-report" 
            element={
              <ProtectedRoute >
                <InitialReport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/governance-history" 
            element={
              <ProtectedRoute >
                <GovernanceHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/esg-history" 
            element={
              <ProtectedRoute >
                <ESGHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dados-esg" 
            element={
              <ProtectedRoute >
                <DadosESG />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-governance" 
            element={
              <ProtectedRoute >
                <PeopleGovernance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/heirs" 
            element={
              <ProtectedRoute >
                <Heirs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/key-positions" 
            element={
              <ProtectedRoute >
                <KeyPositions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/board-members" 
            element={
              <ProtectedRoute >
                <BoardMembers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/board-performance" 
            element={
              <ProtectedRoute >
                <BoardPerformance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge-base" 
            element={
              <ProtectedRoute >
                <KnowledgeBase />
              </ProtectedRoute>
            } 
          />
          
          {/* AI Copilot Routes */}
          <Route 
            path="/copilot" 
            element={
              <ProtectedRoute >
                <GovernanceCopilot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/copiloto-governanca" 
            element={
              <ProtectedRoute >
                <GovernanceCopilot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-agents" 
            element={
              <ProtectedRoute >
                <AIAgents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-config" 
            element={
              <ProtectedRoute >
                <AIConfig />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/finances" element={<AdminFinances />} />
          <Route path="/admin/agent-config" element={<AdminAgentConfig />} />
          <Route path="/admin/plans-comparison" element={<AdminPlansComparison />} />
          <Route path="/admin/pricing-config" element={<AdminPricingConfig />} />
          <Route path="/admin/plan-configurator" element={<AdminPlanConfigurator />} />
          <Route path="/admin/client-management" element={<AdminClientManagement />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/addons" element={<AdminAddons />} />
          <Route path="/admin/contracts" element={<AdminContracts />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/sales" element={<AdminSales />} />
          <Route path="/admin/prompt-library" element={<AdminPromptLibrary />} />
          <Route path="/admin/llm-management" element={<AdminLLMManagement />} />
          <Route path="/admin/companies" element={<Companies />} />
          {/* Portuguese route aliases for admin sidebar */}
          <Route path="/admin/empresas" element={<Companies />} />
          <Route path="/admin/vendas" element={<AdminSales />} />
          <Route path="/admin/planos" element={<AdminPricingConfig />} />
          <Route path="/admin/contratos" element={<AdminContracts />} />
          <Route path="/admin/faturas" element={<AdminInvoices />} />
          <Route path="/admin/prompts" element={<AdminPromptLibrary />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          
          {/* Audit & Security */}
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute >
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security-dashboard" 
            element={
              <ProtectedRoute >
                <SecurityDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Parceiro Routes */}
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
          <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </OrganizationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
