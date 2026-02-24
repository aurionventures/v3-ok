
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login"; 
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import FamilyStructure from "./pages/FamilyStructure";
import Councils from "./pages/Councils";
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
import AdminAgentConfig from "./pages/AdminAgentConfig";
import AIConfig from "./pages/AIConfig";
import AIAgents from "./pages/AIAgents";
import Companies from "./pages/Companies";
import CapTable from "./pages/CapTable";
import MaturityQuiz from "./pages/MaturityQuiz";
import Investors from "./pages/Investors";
import Onboarding from "./pages/Onboarding";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/start" element={<Start />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/family-structure" element={<FamilyStructure />} />
        <Route path="/people-development" element={<PeopleDevelopment />} />
        <Route path="/subsystems" element={<Subsystems />} />
        <Route path="/legacy" element={<Legacy />} />
        <Route path="/councils" element={<Councils />} />
        <Route path="/rituals" element={<Rituals />} />
        <Route path="/succession" element={<Succession />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/maturity" element={<Maturity />} />
        <Route path="/home" element={<Index />} />
        <Route path="/maturity-quiz" element={<MaturityQuiz />} />
        <Route path="/esg" element={<ESG />} />
        <Route path="/systemic-risks" element={<SystemicRisks />} />
        <Route path="/cap-table" element={<CapTable />} />
        
        <Route path="/settings" element={<Settings />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/data-input" element={<DataInput />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/finances" element={<AdminFinances />} />
        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/marketing" element={<Admin />} />
        <Route path="/admin/activities" element={<Activities />} />
        <Route path="/admin/insights" element={<Admin />} />
        <Route path="/admin/reports" element={<Admin />} />
        <Route path="/admin/finances/invoices" element={<AdminFinances />} />
        <Route path="/admin/finances/payments" element={<AdminFinances />} />
        <Route path="/admin/agent-config" element={<AdminAgentConfig />} />
        <Route path="/ai-config" element={<AIConfig />} />
        <Route path="/ai-agents" element={<AIAgents />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GovernanceAssistant />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
