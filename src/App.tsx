
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { isMember } from "@/lib/auth";
import MemberLayout from "./layouts/MemberLayout";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberMaturidade from "./pages/member/MemberMaturidade";
import MemberRiscos from "./pages/member/MemberRiscos";
import MemberReunioes from "./pages/member/MemberReunioes";
import MemberPautas from "./pages/member/MemberPautas";
import MemberAtasPendentes from "./pages/member/MemberAtasPendentes";
import MemberPendencias from "./pages/member/MemberPendencias";
import MemberDesempenho from "./pages/member/MemberDesempenho";
import MemberSettings from "./pages/member/MemberSettings";
import MemberAlterarSenha from "./pages/member/MemberAlterarSenha";
import Index from "./pages/Index";
import Login from "./pages/Login"; 
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import FamilyStructure from "./pages/FamilyStructure";
import Councils from "./pages/Councils";
import Agenda from "./pages/Agenda";
import AnaliseAcoes from "./pages/AnaliseAcoes";
import Rituals from "./pages/Rituals";
import Succession from "./pages/Succession";
import Documents from "./pages/Documents";
import Maturity from "./pages/Maturity";
import ESG from "./pages/ESG";
import Settings from "./pages/Settings";
import Activities from "./pages/Activities";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import DataInput from "./pages/DataInput";
import GovernanceAssistant from "./components/GovernanceAssistant";
import PeopleDevelopment from "./pages/PeopleDevelopment";
import Subsystems from "./pages/Subsystems";
import Legacy from "./pages/Legacy";
import SystemicRisks from "./pages/SystemicRisks";
import Admin from "./pages/Admin";
import AdminFinances from "./pages/AdminFinances";
import GestaoFaturas from "./pages/GestaoFaturas";
import ConfiguradorPlanos from "./pages/ConfiguradorPlanos";
import AdminAgentConfig from "./pages/AdminAgentConfig";
import AIConfig from "./pages/AIConfig";
import AIAgents from "./pages/AIAgents";
import AgentConciliacaoSocios from "./pages/AgentConciliacaoSocios";
import AgentEstrategiaConselho from "./pages/AgentEstrategiaConselho";
import AgentAnaliseTarefas from "./pages/AgentAnaliseTarefas";
import GovernanceCopilot from "./pages/GovernanceCopilot";
import Secretariado from "./pages/Secretariado";
import Companies from "./pages/Companies";
import CapTable from "./pages/CapTable";
import MaturidadeGovernanca from "./pages/MaturidadeGovernanca";
import Entrevistas from "./pages/Entrevistas";
import MaturityQuiz from "./pages/MaturityQuiz";
import Investors from "./pages/Investors";
import Onboarding from "./pages/Onboarding";
import CouncilPerformance from "./pages/CouncilPerformance";
import Planos from "./pages/Planos";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import AdminMaster from "./pages/AdminMaster";
import AdminPartners from "./pages/AdminPartners";
import AdminPartnersTiers from "./pages/AdminPartnersTiers";
import AdminContracts from "./pages/AdminContracts";
import CompanyAlterarSenha from "./pages/company/CompanyAlterarSenha";
import AdminAlterarSenha from "./pages/admin/AdminAlterarSenha";


const queryClient = new QueryClient();

function CompanyOrPublicGuard() {
  const location = useLocation();
  if (isMember() && !location.pathname.startsWith("/member") && location.pathname !== "/login") {
    return <Navigate to="/member/dashboard" replace />;
  }
  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="maturidade" element={<MemberMaturidade />} />
          <Route path="riscos" element={<MemberRiscos />} />
          <Route path="reunioes" element={<MemberReunioes />} />
          <Route path="pautas" element={<MemberPautas />} />
          <Route path="atas-pendentes" element={<MemberAtasPendentes />} />
          <Route path="pendencias" element={<MemberPendencias />} />
          <Route path="desempenho" element={<MemberDesempenho />} />
          <Route path="settings" element={<MemberSettings />} />
          <Route path="alterar-senha" element={<MemberAlterarSenha />} />
        </Route>
        <Route path="/company/alterar-senha" element={<CompanyAlterarSenha />} />
        <Route path="/admin/alterar-senha" element={<AdminAlterarSenha />} />
        <Route element={<CompanyOrPublicGuard />}>
          <Route path="/" element={<Index />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/start" element={<Start />} />
          <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/family-structure" element={<FamilyStructure />} />
        <Route path="/people-development" element={<PeopleDevelopment />} />
        <Route path="/subsystems" element={<Subsystems />} />
        <Route path="/legacy" element={<Legacy />} />
        <Route path="/councils" element={<Councils />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/rituals" element={<Rituals />} />
        <Route path="/analise-acoes" element={<AnaliseAcoes />} />
        <Route path="/succession" element={<Succession />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/maturity" element={<Maturity />} />
        <Route path="/home" element={<Index />} />
        <Route path="/maturity-quiz" element={<MaturityQuiz />} />
        <Route path="/esg" element={<ESG />} />
        <Route path="/systemic-risks" element={<SystemicRisks />} />
        <Route path="/cap-table" element={<CapTable />} />
        <Route path="/maturidade-governanca" element={<MaturidadeGovernanca />} />
        <Route path="/entrevistas" element={<Entrevistas />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/data-input" element={<DataInput />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/master" element={<AdminMaster />} />
        <Route path="/admin/partners" element={<AdminPartners />} />
        <Route path="/admin/partners/tiers" element={<AdminPartnersTiers />} />
        <Route path="/admin/contracts" element={<AdminContracts />} />
        <Route path="/admin/dashboard-gestao" element={<Admin />} />
        <Route path="/admin/finances" element={<AdminFinances />} />
        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/marketing" element={<Admin />} />
        <Route path="/admin/activities" element={<Activities />} />
        <Route path="/admin/insights" element={<Admin />} />
        <Route path="/admin/reports" element={<Admin />} />
        <Route path="/admin/finances/invoices" element={<GestaoFaturas />} />
        <Route path="/admin/finances/payments" element={<AdminFinances />} />
        <Route path="/admin/configurador-planos" element={<ConfiguradorPlanos />} />
        <Route path="/admin/agent-config" element={<AdminAgentConfig />} />
        <Route path="/ai-config" element={<AIConfig />} />
        <Route path="/ai-agents" element={<AIAgents />} />
        <Route path="/ai-agents/conciliacao-socios" element={<AgentConciliacaoSocios />} />
        <Route path="/ai-agents/estrategia-conselho" element={<AgentEstrategiaConselho />} />
        <Route path="/ai-agents/analise-tarefas" element={<AgentAnaliseTarefas />} />
        <Route path="/copiloto-governanca" element={<GovernanceCopilot />} />
        <Route path="/secretariado" element={<Secretariado />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/desempenho-conselho" element={<CouncilPerformance />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        </Route>
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GovernanceAssistant />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
