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

import { GovernanceAlerts } from "@/components/gamification/GovernanceAlerts";
import { GovernanceDetailedProgress } from "@/components/gamification/GovernanceDetailedProgress";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
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
import { ibgcRisks } from "@/data/riskData";
import { calculateRiskStats, calculateRiskCategoryStats, generateRiskTrends } from "@/utils/riskCalculator";

// Calculate real-time risk statistics
const riskSummary = calculateRiskStats(ibgcRisks);
const riskCategories = calculateRiskCategoryStats(ibgcRisks);
const riskTrends = generateRiskTrends();

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const governanceProgress = useGovernanceProgress();
  
  // Load latest assessments
  const [latestIGBCAssessment, setLatestIGBCAssessment] = React.useState<any>(null);
  const [latestESGAssessment, setLatestESGAssessment] = React.useState<any>(null);

  React.useEffect(() => {
    // Load latest IGBC assessment
    const igbcAssessment = getCurrentMaturityAssessment();
    if (igbcAssessment) {
      setLatestIGBCAssessment(igbcAssessment);
    } else {
      // Use latest mock data as fallback
      const latestMock = mockHistoricalAssessments[mockHistoricalAssessments.length - 1];
      if (latestMock) {
        setLatestIGBCAssessment({
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="h-[calc(100vh-4rem)] overflow-hidden p-4 grid grid-rows-[auto_3fr_1fr] gap-4">
          {/* Row 1: MetricCards (4 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-20">
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

          {/* Row 2: Risk Management (3 columns) */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-lg">Gestão de Riscos</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => navigateTo("/ibgc-risk-management")}
                >
                  Ver Matriz Completa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-5rem)]">
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* Column 1: Risk Matrix Visual */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Matriz de Riscos</h3>
                  <div className="bg-gray-50 rounded-lg p-3 h-[calc(100%-2rem)]">
                    <div className="grid grid-cols-5 gap-1 h-full">
                      {[5, 4, 3, 2, 1].map((impact) => (
                        <div key={impact} className="grid grid-rows-3 gap-1">
                          {[3, 2, 1].map((probability) => {
                            const score = impact * probability;
                            let bgColor = "bg-green-200";
                            if (score >= 12) bgColor = "bg-red-300";
                            else if (score >= 6) bgColor = "bg-yellow-200";
                            return (
                              <div
                                key={`${impact}-${probability}`}
                                className={`${bgColor} rounded text-xs flex items-center justify-center font-medium`}
                              >
                                {score}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Baixo Impacto</span>
                      <span>Alto Impacto</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Risk Categories */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Categorias de Risco</h3>
                  <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto">
                    {riskCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div key={category.category} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4" style={{ color: category.color }} />
                            <span className="text-sm font-medium">{category.category}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Críticos: {category.criticalCount}</span>
                            <span className="text-xs text-gray-500">Total: {category.count}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                backgroundColor: category.color,
                                width: `${(category.criticalCount / Math.max(category.count, 1)) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: Executive Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Resumo Executivo</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{riskSummary.totalRisks}</div>
                        <div className="text-xs text-blue-600 font-medium">Total de Riscos</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{riskSummary.criticalRisks}</div>
                        <div className="text-xs text-red-600 font-medium">Críticos</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{riskSummary.mitigationPlans}</div>
                        <div className="text-xs text-green-600 font-medium">Com Mitigação</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                        <div className="text-xs text-yellow-600 font-medium">Sem Mitigação</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700">Indicadores de Performance</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Redução de Riscos</span>
                            <span className="text-green-600 font-medium text-sm">↓ 15%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Eficácia da Mitigação</span>
                            <span className="text-green-600 font-medium text-sm">↑ 60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Cobertura de Controles</span>
                            <span className="text-blue-600 font-medium text-sm">82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Row 3: Maturity Assessments (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            {/* IGBC Maturity Assessment */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Maturidade IGBC</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={() => navigateTo("/maturity")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                {latestIGBCAssessment ? (
                  <div className="space-y-3 h-full">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {latestIGBCAssessment.result.pontuacao_total.toFixed(1)}/5.0
                      </div>
                      <p className="text-sm text-blue-700 font-medium">
                        {latestIGBCAssessment.result.estagio || 'Avaliação IGBC'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Última avaliação: {new Date(latestIGBCAssessment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1 h-[calc(100%-5rem)]">
                      <MaturityRadarChart data={convertStoredDataToRadarData(latestIGBCAssessment)} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Nenhuma avaliação IGBC realizada</p>
                    <Button
                      onClick={() => navigateTo("/maturity")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Iniciar Avaliação IGBC
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ESG Maturity Assessment */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Maturidade ESG</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => navigateTo("/dados-esg")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;