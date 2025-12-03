import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Calendar, FileText, Users, Award, ChevronRight, Shield, AlertTriangle, TrendingUp, PieChart, Leaf, Building2, BookOpen, Target, Settings, DollarSign, Clock, FileSignature, ListTodo, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/metrics/MetricCard";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import ESGPillarChart from "@/components/ESGPillarChart";
import { useAuth } from "@/contexts/AuthContext";
import { useAllMeetingActions } from "@/hooks/useAllMeetingActions";
import { toast } from "@/hooks/use-toast";
import { getCurrentMaturityAssessment, convertStoredDataToRadarData } from "@/utils/maturityStorage";
import { loadLatestESGAssessment } from "@/utils/esgMaturityCalculator";
import { getLatestESGAssessment } from "@/data/mockESGHistoricalData";
import { mockHistoricalAssessments } from "@/data/mockHistoricalData";

// Risk data imported from shared source
import { governanceRisks } from "@/data/riskData";
import { calculateRiskStats, calculateRiskCategoryStats } from "@/utils/riskCalculator";

// Calculate real-time risk statistics
const riskSummary = calculateRiskStats(governanceRisks);
const riskCategories = calculateRiskCategoryStats(governanceRisks);
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    actions,
    loading: loadingActions
  } = useAllMeetingActions();

  // Load latest assessments
  const [latestGovernanceAssessment, setLatestGovernanceAssessment] = React.useState<any>(null);
  const [latestESGAssessment, setLatestESGAssessment] = React.useState<any>(null);

  // Calculate task metrics
  const taskMetrics = React.useMemo(() => {
    const total = actions.length;
    const overdue = actions.filter(a => a.status === 'ATRASADA').length;
    const inProgress = actions.filter(a => a.status === 'EM_ANDAMENTO').length;
    const pending = actions.filter(a => a.status === 'PENDENTE').length;
    const completed = actions.filter(a => a.status === 'CONCLUIDA').length;
    const resolutionRate = total > 0 ? Math.round(completed / total * 100) : 0;
    const pendingRate = total > 0 ? Math.round((pending + overdue) / total * 100) : 0;
    return {
      total,
      overdue,
      inProgress,
      pending,
      completed,
      resolutionRate,
      pendingRate
    };
  }, [actions]);

  // Metrics for meetings and ATAs (demo data)
  const meetingMetrics = React.useMemo(() => {
    const totalMeetings = 36;
    const meetingsWithAgenda = 12;
    const totalConcluidas = 10;
    const meetingsWithATA = 9;
    const pautasPercentual = Math.round(meetingsWithAgenda / totalMeetings * 100);
    const atasPercentual = totalConcluidas > 0 ? Math.round(meetingsWithATA / totalConcluidas * 100) : 0;
    return {
      totalMeetings,
      meetingsWithAgenda,
      totalConcluidas,
      meetingsWithATA,
      pautasPercentual,
      atasPercentual
    };
  }, []);

  // ATA approval metrics (demo data)
  const ataApprovalMetrics = React.useMemo(() => ({
    aguardandoAprovacao: 1,
    aguardandoAssinatura: 1,
    finalizadas: 1
  }), []);
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
  return <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Score Geral de Maturidade" value="3.6/5.0" description="Melhoria de 0.3 em 3 meses" trend={{
            value: 9,
            isPositive: true
          }} icon={<BarChart3 className="h-5 w-5" />} />
            <MetricCard title="Riscos Críticos" value={riskSummary.criticalRisks.toString()} description={`${riskSummary.totalRisks} riscos totais`} icon={<AlertTriangle className="h-5 w-5" />} />
            {/* Pautas Definidas com Progress */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Pautas Definidas</p>
                  <p className="text-2xl font-bold text-primary mt-1">{meetingMetrics.pautasPercentual}%</p>
                  <Progress value={meetingMetrics.pautasPercentual} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {meetingMetrics.meetingsWithAgenda} de {meetingMetrics.totalMeetings} reuniões
                  </p>
                </div>
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </Card>
            {/* ATAs Geradas */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">ATAs Geradas</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{meetingMetrics.atasPercentual}%</p>
                  <Progress value={meetingMetrics.atasPercentual} className="h-2 mt-2 [&>div]:bg-green-600" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {meetingMetrics.meetingsWithATA} de {meetingMetrics.totalConcluidas} reuniões realizadas
                  </p>
                </div>
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </Card>
          </div>

          {/* Gestão de Riscos - Layout 2 Colunas */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-lg">Gestão de Riscos</CardTitle>
                </div>
                
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUNA ESQUERDA: Resumo Executivo */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Resumo Executivo</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
                      <div className="text-3xl font-bold text-blue-600">{riskSummary.totalRisks}</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">Total de Riscos</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-100 dark:border-red-900">
                      <div className="text-3xl font-bold text-red-600">{riskSummary.criticalRisks}</div>
                      <div className="text-xs text-red-600 font-medium mt-1">Críticos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-100 dark:border-green-900">
                      <div className="text-3xl font-bold text-green-600">{riskSummary.mitigationPlans}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">Com Mitigação</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-100 dark:border-yellow-900">
                      <div className="text-3xl font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                      <div className="text-xs text-yellow-600 font-medium mt-1">Sem Mitigação</div>
                    </div>
                  </div>
                </div>

                {/* COLUNA DIREITA: Visão Gerencial */}
                <div className="space-y-4 lg:border-l lg:pl-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Visão Gerencial - Indicadores Executivos</h3>
                  </div>
                  
                  {/* KPIs de Tarefas - 4 cards horizontais */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-foreground">{taskMetrics.total}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">Total Criadas</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{taskMetrics.completed}</div>
                      <div className="text-[10px] text-green-600 font-medium">Resolvidas</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">{taskMetrics.pending + taskMetrics.overdue}</div>
                      <div className="text-[10px] text-orange-600 font-medium">Pendentes</div>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-xl font-bold text-primary">{taskMetrics.resolutionRate}%</div>
                      <div className="text-[10px] text-primary font-medium">Taxa Resolução</div>
                    </div>
                  </div>

                  {/* ATAs Pendentes de Aprovação/Assinatura */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileSignature className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-xs font-medium text-muted-foreground">ATAs Pendentes de Aprovação/Assinatura</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="text-2xl font-bold text-yellow-600">{ataApprovalMetrics.aguardandoAprovacao}</div>
                        <div className="text-[10px] text-yellow-600 font-medium">Aguardando Aprovação</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900">
                        <div className="text-2xl font-bold text-blue-600">{ataApprovalMetrics.aguardandoAssinatura}</div>
                        <div className="text-[10px] text-blue-600 font-medium">Aguardando Assinatura</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="text-2xl font-bold text-green-600">{ataApprovalMetrics.finalizadas}</div>
                        <div className="text-[10px] text-green-600 font-medium">Finalizadas</div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Ver Painel */}
                  <Button variant="outline" size="sm" className="w-full gap-2 mt-2" onClick={() => navigateTo("/secretariat-panel")}>
                    <ListTodo className="h-4 w-4" />
                    Ver Painel de Secretariado
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliações de Maturidade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Governance Maturity Assessment */}
            <Card className="h-[500px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Maturidade de Governança</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigateTo("/maturity")}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100%-5rem)]">
                {latestGovernanceAssessment ? <div className="space-y-3 h-full">
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
                    <div className="flex-1 h-[calc(100%-6rem)]">
                      <MaturityRadarChart data={convertStoredDataToRadarData(latestGovernanceAssessment)} />
                    </div>
                  </div> : <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Nenhuma avaliação de governança realizada</p>
                    <Button onClick={() => navigateTo("/maturity")} className="bg-blue-600 hover:bg-blue-700">
                      Iniciar Avaliação de Governança
                    </Button>
                  </div>}
              </CardContent>
            </Card>

            {/* ESG Maturity Assessment */}
            <Card className="h-[500px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Maturidade ESG</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigateTo("/dados-esg")}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100%-5rem)]">
                {latestESGAssessment && latestESGAssessment.overallScore !== undefined ? <div className="space-y-3 h-full">
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
                    <div className="flex-1 h-[calc(100%-6rem)]">
                      {latestESGAssessment.pillarScores ? <ESGPillarChart pillarScores={latestESGAssessment.pillarScores} /> : <div className="flex items-center justify-center h-full text-gray-500">
                          <p className="text-sm">Dados do gráfico não disponíveis</p>
                        </div>}
                    </div>
                  </div> : <div className="text-center py-8 h-full flex flex-col justify-center">
                    <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Nenhuma avaliação ESG realizada</p>
                    <Button onClick={() => navigateTo("/dados-esg")} className="bg-green-600 hover:bg-green-700">
                      Iniciar Avaliação ESG
                    </Button>
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;