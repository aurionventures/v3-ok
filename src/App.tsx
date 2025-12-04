
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginAdmin from "./components/auth/LoginAdmin"; 
import Dashboard from "./pages/Dashboard";
import ShareholderStructure from "./pages/ShareholderStructure";
import Councils from "./pages/Councils";
import GovernanceConfig from "./pages/GovernanceConfig";
import SubmitProjects from "./pages/SubmitProjects";
import Rituals from "./pages/Rituals";
import Succession from "./pages/Succession";
import Documents from "./pages/Documents";
import Maturity from "./pages/Maturity";
import ESG from "./pages/ESG";
import Settings from "./pages/Settings";
import Activities from "./pages/Activities";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import Benchmarking from "./pages/Benchmarking";
import Insights from "./pages/Insights";
import Monitoring from "./pages/Monitoring";
import DadosESG from "./pages/DadosESG";
import GovernanceAssistant from "./components/GovernanceAssistant";
import PeopleDevelopment from "./pages/PeopleDevelopment";
import Subsystems from "./pages/Subsystems";
import Legacy from "./pages/Legacy";
import GovernanceRiskManagement from "./pages/GovernanceRiskManagement";
import MarketIntelligence from "./pages/MarketIntelligence";
import Admin from "./pages/Admin";
import AdminFinances from "./pages/AdminFinances";
import AdminAgentConfig from "./pages/AdminAgentConfig";
import AIConfig from "./pages/AIConfig";
import AIAgents from "./pages/AIAgents";
import Companies from "./pages/Companies";
import CapTable from "./pages/CapTable";
import MaturityQuiz from "./pages/MaturityQuiz";
import StandaloneQuiz from "./pages/StandaloneQuiz";
import PlanDiscoveryQuiz from "./pages/PlanDiscoveryQuiz";
import PlanActivation from "./pages/PlanActivation";
import Investors from "./pages/Investors";
import Onboarding from "./pages/Onboarding";
import GovernanceHistory from "./pages/GovernanceHistory";
import ESGHistory from "./pages/ESGHistory";
import DocumentChecklist from "./pages/DocumentChecklist";
import Interviews from "./pages/Interviews";
import InitialReport from "./pages/InitialReport";
import PeopleGovernance from "./pages/PeopleGovernance";
import Heirs from "./pages/Heirs";
import KeyPositions from "./pages/KeyPositions";
import BoardMembers from "./pages/BoardMembers";
import PeopleManagement from "./pages/PeopleManagement";
import AnnualAgenda from "./pages/AnnualAgenda";
import Reunioes from "./pages/Reunioes";
import ReuniaoDetalhes from "./pages/ReuniaoDetalhes";
import GuestAccess from "./pages/GuestAccess";
import TaskAccess from "./pages/TaskAccess";
import ATAApproval from "./pages/ATAApproval";
import ATAPendingManagement from "./pages/ATAPendingManagement";
import NotificationSettings from "./pages/NotificationSettings";
import NotificationsCenter from "./pages/NotificationsCenter";
import AuditLogs from "./pages/AuditLogs";
import SecurityDashboard from "./pages/SecurityDashboard";
import SecretariatPanel from "./pages/SecretariatPanel";

// Parceiro Components
import BancaDashboard from "./pages/BancaDashboard";
import { ParceiroClientes } from "./pages/ParceiroClientes";
import { ParceiroRelatorios } from "./pages/ParceiroRelatorios";
import { ParceiroAssessments } from "./pages/ParceiroAssessments";

import { ParceiroPerformance } from "./pages/ParceiroPerformance";
import ClientDetails from "./pages/ClientDetails";
import { BancaSidebar } from "./components/BancaSidebar";
import GenerateCompanyToken from "./pages/GenerateCompanyToken";
import GenerateAdminToken from "./pages/GenerateAdminToken";
import GeneratePartnerToken from "./pages/GeneratePartnerToken";
import EmpresasLanding from "./pages/EmpresasLanding";
import ParceirosLanding from "./pages/ParceirosLanding";


const queryClient = new QueryClient();

// Wrapper condicional para mostrar o Guia apenas em páginas logadas
const ConditionalAssistant = () => {
  const location = useLocation();
  
  const publicRoutes = [
    '/',
    '/login',
    '/empresas',
    '/parceiros',
    '/investors',
    '/diagnostic-quiz',
    '/standalone-quiz',
    '/plan-discovery',
    '/generate-company-token',
    '/generate-admin-token',
    '/generate-partner-token'
  ];
  
  const publicPatterns = [
    '/guest-access/',
    '/task-access/',
    '/ata-approval/'
  ];
  
  const isPublicRoute = publicRoutes.includes(location.pathname) ||
    publicPatterns.some(pattern => location.pathname.startsWith(pattern));
  
  if (isPublicRoute) return null;
  
  return <GovernanceAssistant />;
};

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
              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/empresas" element={<EmpresasLanding />} />
          <Route path="/parceiros" element={<ParceirosLanding />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diagnostic-quiz" element={<StandaloneQuiz />} />
          <Route path="/standalone-quiz" element={<StandaloneQuiz />} />
          <Route path="/plan-discovery" element={<PlanDiscoveryQuiz />} />
          <Route path="/guest-access/:token" element={<GuestAccess />} />
          <Route path="/task-access/:token" element={<TaskAccess />} />
          <Route path="/ata-approval/:token" element={<ATAApproval />} />
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
            element={
              <ProtectedRoute >
                <Legacy />
              </ProtectedRoute>
            } 
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
            element={
              <ProtectedRoute >
                <Rituals />
              </ProtectedRoute>
            } 
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
            element={
              <ProtectedRoute >
                <Activities />
              </ProtectedRoute>
            } 
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
            path="/dados-esg" 
            element={<Navigate to="/esg?tab=new-assessment" replace />}
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
            path="/people-governance" 
            element={
              <ProtectedRoute >
                <PeopleGovernance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-governance/heirs" 
            element={
              <ProtectedRoute >
                <Heirs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-governance/key-positions" 
            element={
              <ProtectedRoute >
                <KeyPositions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/people-governance/board-members" 
            element={
              <ProtectedRoute >
                <BoardMembers />
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
          
          {/* Parceiro Routes */}
          <Route 
            path="/parceiro" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <BancaDashboard />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/clientes" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <ParceiroClientes />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/cliente/:id" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <ClientDetails />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/relatorios" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <ParceiroRelatorios />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/assessments" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <ParceiroAssessments />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/performance" 
            element={
          <ProtectedRoute >
            <BancaLayout>
              <ParceiroPerformance />
            </BancaLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/parceiro/suporte" 
            element={
          <ProtectedRoute >
            <BancaLayout>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Suporte</h1>
                    <p>Entre em contato com nossa equipe de suporte.</p>
                  </div>
                </BancaLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/login" 
            element={<LoginAdmin />}
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute >
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/finances" 
            element={
              <ProtectedRoute >
                <AdminFinances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/companies" 
            element={
              <ProtectedRoute >
                <Companies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute >
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/marketing" 
            element={
              <ProtectedRoute >
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/activities" 
            element={
              <ProtectedRoute >
                <Activities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/insights" 
            element={
              <ProtectedRoute >
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute >
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/finances/invoices" 
            element={
              <ProtectedRoute >
                <AdminFinances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/finances/payments" 
            element={
              <ProtectedRoute >
                <AdminFinances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/agent-config" 
            element={
              <ProtectedRoute >
                <AdminAgentConfig />
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
          <Route 
            path="/ai-agents" 
            element={
              <ProtectedRoute >
                <AIAgents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/auditoria" 
            element={
              <ProtectedRoute >
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seguranca" 
            element={
              <ProtectedRoute >
                <SecurityDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <ConditionalAssistant />
      </BrowserRouter>
      </OrganizationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
