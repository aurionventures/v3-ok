
import { useNavigate } from "react-router-dom";
import { BarChart3, Calendar, FileText, Users, Award, ChevronRight, Shield, AlertTriangle, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/metrics/MetricCard";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import ActivityList from "@/components/ActivityList";

import { GovernanceAlerts } from "@/components/gamification/GovernanceAlerts";
import { GovernanceDetailedProgress } from "@/components/gamification/GovernanceDetailedProgress";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import { toast } from "@/hooks/use-toast";

// Sample data for radar chart
const maturityData = [
  { name: "Estrutura Formal", score: 4.2, sectorAverage: 3.8, fullMark: 5 },
  { name: "Processos Decisórios", score: 3.1, sectorAverage: 3.6, fullMark: 5 },
  { name: "Participação Familiar", score: 4.5, sectorAverage: 3.9, fullMark: 5 },
  { name: "Sucessão", score: 2.8, sectorAverage: 3.6, fullMark: 5 },
  { name: "Prestação de Contas", score: 3.7, sectorAverage: 3.5, fullMark: 5 },
  { name: "Cultura de Governança", score: 3.4, sectorAverage: 3.7, fullMark: 5 },
];

// Sample data for activities
const recentActivities = [
  {
    id: 1,
    type: "meeting" as const,
    title: "Reunião do Conselho Consultivo",
    date: "24 de maio, 2025",
    status: "scheduled" as const,
  },
  {
    id: 2,
    type: "document" as const,
    title: "Atualização do Protocolo Familiar",
    date: "20 de maio, 2025",
    status: "completed" as const,
  },
];

// Sample alerts
const alerts = [
  {
    id: 1,
    message: "Reunião do Conselho de Administração em 5 dias",
    priority: "high",
  },
  {
    id: 2,
    message: "3 documentos pendentes de aprovação",
    priority: "medium",
  }
];

// Sample risk data for dashboard
const riskSummary = {
  totalRisks: 17,
  criticalRisks: 6,
  mitigationPlans: 12,
  withoutMitigation: 5
};

const riskCategories = [
  { category: "Poder", count: 3, criticalCount: 1, color: "bg-red-500" },
  { category: "Cultura", count: 4, criticalCount: 2, color: "bg-orange-500" },
  { category: "Pessoas", count: 5, criticalCount: 2, color: "bg-yellow-500" },
  { category: "Sociedade", count: 2, criticalCount: 0, color: "bg-blue-500" },
  { category: "Tecnologia", count: 3, criticalCount: 1, color: "bg-purple-500" },
];

const riskTrends = [
  { period: "6 meses atrás", total: 20, mitigated: 8 },
  { period: "3 meses atrás", total: 18, mitigated: 10 },
  { period: "Atual", total: 17, mitigated: 12 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const governanceProgress = useGovernanceProgress();

  // Handle navigation to different sections
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-family":
        navigateTo("/family-structure");
        break;
      case "documents":
        navigateTo("/documents");
        break;
      case "schedule-meeting":
        navigateTo("/rituals");
        break;
      case "update-assessment":
        navigateTo("/maturity");
        break;
      default:
        break;
    }
  };

  // Handle activity click
  const handleActivityClick = (activity: any) => {
    toast({
      title: `${activity.title}`,
      description: `Detalhes da atividade serão exibidos em breve`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="flex-1 overflow-y-auto p-4">
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <MetricCard
              title="Score Geral de Maturidade"
              value="3.6/5.0"
              description="Melhoria de 0.3 em 3 meses"
              trend={{ value: 9, isPositive: true }}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <MetricCard
              title="Riscos Críticos"
              value={riskSummary.criticalRisks.toString()}
              description={`${riskSummary.totalRisks} riscos totais`}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
            <MetricCard
              title="Familiares Cadastrados"
              value="12"
              description="3 gerações mapeadas"
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Governança Configurada"
              value={`${governanceProgress.overallPercentage}%`}
              description={`${governanceProgress.completedModules}/${governanceProgress.totalModules} módulos completos`}
              trend={{ value: governanceProgress.overallPercentage >= 50 ? 15 : -5, isPositive: governanceProgress.overallPercentage >= 50 }}
              icon={<Award className="h-5 w-5" />}
            />
          </div>

          {/* Risk Analysis & Governance Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Risk Categories */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-legacy-500">
                    Distribuição por Categoria
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-legacy-purple-500 border-legacy-purple-500"
                    onClick={() => navigateTo("/systemic-risks")}
                  >
                    Ver Todos
                  </Button>
                </div>
                <div className="space-y-3">
                  {riskCategories.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-xs text-gray-500">
                          {category.count} riscos ({category.criticalCount} críticos)
                        </span>
                      </div>
                      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-full"
                          style={{ width: `${(category.criticalCount / category.count) * 100}%` }}
                        />
                        <div 
                          className="bg-gray-600 h-full"
                          style={{ width: `${((category.count - category.criticalCount) / category.count) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Summary */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-legacy-500 mb-3">
                  Sumário de Riscos
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{riskSummary.totalRisks}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{riskSummary.criticalRisks}</div>
                    <div className="text-xs text-red-500">Críticos</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{riskSummary.mitigationPlans}</div>
                    <div className="text-xs text-blue-500">Mitigados</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                    <div className="text-xs text-yellow-500">Sem Mitig.</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-900">Tendências</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Riscos Totais</span>
                      <span className="text-green-600">↓ -15%</span>
                    </div>
                    <Progress value={71} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Mitigação</span>
                      <span className="text-green-600">↑ +50%</span>
                    </div>
                    <Progress value={71} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governance Alerts & Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-legacy-500">
                    Alertas de Governança
                  </h2>
                </div>
                <GovernanceAlerts />
              </CardContent>
            </Card>
          </div>

          {/* Maturity Assessment Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-legacy-500">
                  Avaliação de Maturidade
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-legacy-purple-500 border-legacy-purple-500"
                  onClick={() => navigateTo("/maturity")}
                >
                  Ver Detalhes
                </Button>
              </div>
              <div className="h-64">
                <MaturityRadarChart data={maturityData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
