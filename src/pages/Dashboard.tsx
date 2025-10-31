import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Calendar, FileText, Users, Award, ChevronRight, Shield, AlertTriangle, TrendingUp, PieChart, Leaf, Building2, BookOpen, Target, Settings, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/metrics/MetricCard";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import ESGPillarChart from "@/components/ESGPillarChart";
import ActivityList from "@/components/ActivityList";
import { useAuth } from "@/contexts/AuthContext";

import { toast } from "@/hooks/use-toast";
import { getCurrentMaturityAssessment, convertStoredDataToRadarData } from "@/utils/maturityStorage";
import { loadLatestESGAssessment } from "@/utils/esgMaturityCalculator";
import { getLatestESGAssessment } from "@/data/mockESGHistoricalData";
import { mockHistoricalAssessments } from "@/data/mockHistoricalData";

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

// Risk data imported from shared source
import { governanceRisks } from "@/data/riskData";
import { calculateRiskStats, calculateRiskCategoryStats, generateRiskTrends } from "@/utils/riskCalculator";

// Calculate real-time risk statistics
const riskSummary = calculateRiskStats(governanceRisks);
const riskCategories = calculateRiskCategoryStats(governanceRisks);
const riskTrends = generateRiskTrends();

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Load latest assessments
  const [latestGovernanceAssessment, setLatestGovernanceAssessment] = React.useState<any>(null);
  const [latestESGAssessment, setLatestESGAssessment] = React.useState<any>(null);

  React.useEffect(() => {
    // Load latest Governance assessment
    const governanceAssessment = getCurrentMaturityAssessment();
    if (governanceAssessment) {
      setLatestGovernanceAssessment(governanceAssessment);
    } else {
      // Use latest mock data as fallback
      const latestMock = mockHistoricalAssessments[mockHistoricalAssessments.length - 1];
      if (latestMock) {
        setLatestGovernanceAssessment({
          result: latestMock.result,
          timestamp: latestMock.date
        });
      }
    }

    // Load latest ESG assessment with fallback to mock data
    const esgAssessment = loadLatestESGAssessment();
    if (esgAssessment && esgAssessment.pillarScores) {
      setLatestESGAssessment(esgAssessment);
    } else {
      // Always use mock data as fallback to ensure ESG section shows data
      const mockESG = getLatestESGAssessment();
      if (mockESG && mockESG.result) {
        setLatestESGAssessment({
          overallScore: mockESG.result.overallScore,
          maturityLevel: mockESG.result.maturityLevel,
          pillarScores: mockESG.result.pillarScores,
          completedAt: mockESG.timestamp
        });
      }
    }
  }, []);

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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              title="Membros Cadastrados"
              value="12"
              description="3 gerações mapeadas"
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Módulos Ativos"
              value="18"
              description="Módulos de governança configurados"
              icon={<Award className="h-5 w-5" />}
            />
          </div>

          {/* Avaliações de Maturidade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Governance Maturity Assessment */}
            <Card className="h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Maturidade de Governança</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo("/maturity")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100%-4rem)]">
                {latestGovernanceAssessment ? (
                  <div className="space-y-3 h-full">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {latestGovernanceAssessment.result.pontuacao_total.toFixed(1)}/5.0
                      </div>
                      <p className="text-sm text-blue-700 font-medium">
                        {latestGovernanceAssessment.result.estagio || 'Avaliação de Governança'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Última avaliação: {new Date(latestGovernanceAssessment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1 h-[calc(100%-5rem)]">
                      <MaturityRadarChart data={convertStoredDataToRadarData(latestGovernanceAssessment)} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Nenhuma avaliação de governança realizada</p>
                    <Button
                      onClick={() => navigateTo("/maturity")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Iniciar Avaliação de Governança
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ESG Maturity Assessment */}
            <Card className="h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Maturidade ESG</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo("/dados-esg")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100%-4rem)]">
                {latestESGAssessment && latestESGAssessment.overallScore !== undefined ? (
                  <div className="space-y-3 h-full">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {latestESGAssessment.overallScore.toFixed(1)}/5.0
                      </div>
                      <p className="text-sm text-green-700 font-medium">
                        {latestESGAssessment.maturityLevel?.name || 'ESG Assessment'}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Última avaliação: {latestESGAssessment.completedAt ? new Date(latestESGAssessment.completedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex-1 h-[calc(100%-5rem)]">
                      {latestESGAssessment.pillarScores ? (
                        <ESGPillarChart pillarScores={latestESGAssessment.pillarScores} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <p className="text-sm">Dados do gráfico não disponíveis</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Nenhuma avaliação ESG realizada</p>
                    <Button
                      onClick={() => navigateTo("/dados-esg")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Iniciar Avaliação ESG
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gestão de Riscos - Seção Compacta */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-lg">Gestão de Riscos</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTo("/governance-risk-management")}
                >
                  Ver Matriz Completa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resumo Executivo */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Resumo Executivo</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{riskSummary.totalRisks}</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">Total de Riscos</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">{riskSummary.criticalRisks}</div>
                      <div className="text-xs text-red-600 font-medium mt-1">Críticos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{riskSummary.mitigationPlans}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">Com Mitigação</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                      <div className="text-xs text-yellow-600 font-medium mt-1">Sem Mitigação</div>
                    </div>
                  </div>
                </div>

                {/* Matriz Visual Compacta */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Matriz de Riscos</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="grid grid-cols-5 gap-1 mb-3">
                      {[5, 4, 3, 2, 1].map((impact) => (
                        <div key={impact} className="grid grid-rows-3 gap-1">
                          {[3, 2, 1].map((probability) => {
                            const score = impact * probability;
                            let bgColor = "bg-green-200 dark:bg-green-900";
                            if (score >= 12) bgColor = "bg-red-300 dark:bg-red-900";
                            else if (score >= 6) bgColor = "bg-yellow-200 dark:bg-yellow-900";
                            return (
                              <div
                                key={`${impact}-${probability}`}
                                className={`${bgColor} rounded h-10 flex items-center justify-center font-medium text-sm`}
                              >
                                {score}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Baixo Impacto</span>
                      <span>Alto Impacto</span>
                    </div>
                  </div>
                </div>

                {/* Categorias de Risco */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
                  <div className="space-y-3">
                    {riskCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div key={category.category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" style={{ color: category.color }} />
                            <span className="text-sm font-medium">{category.category}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Críticos: <strong className="text-foreground">{category.criticalCount}</strong></span>
                            <span>Total: <strong className="text-foreground">{category.count}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;