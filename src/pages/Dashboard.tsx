import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, FileText, AlertTriangle, Shield, ListTodo, Clock, FileSignature, Building2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { DashboardAICopilot } from "@/components/dashboard/DashboardAICopilot";
import { useAuth } from "@/contexts/AuthContext";
import { useAllMeetingActions } from "@/hooks/useAllMeetingActions";
import { getCurrentMaturityAssessment, convertStoredDataToRadarData } from "@/utils/maturityStorage";
import { loadLatestESGAssessment } from "@/utils/esgMaturityCalculator";
import { getLatestESGAssessment } from "@/data/mockESGHistoricalData";
import { mockHistoricalAssessments } from "@/data/mockHistoricalData";

// Risk data imported from shared source
import { governanceRisks } from "@/data/riskData";
import { calculateRiskStats } from "@/utils/riskCalculator";

// Calculate real-time risk statistics
const riskSummary = calculateRiskStats(governanceRisks);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actions, loading: loadingActions } = useAllMeetingActions();

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
    return { total, overdue, inProgress, pending, completed, resolutionRate };
  }, [actions]);

  // Metrics for meetings and ATAs (demo data)
  const meetingMetrics = React.useMemo(() => {
    const totalMeetings = 36;
    const meetingsWithAgenda = 12;
    const totalConcluidas = 10;
    const meetingsWithATA = 9;
    const pautasPercentual = Math.round(meetingsWithAgenda / totalMeetings * 100);
    const atasPercentual = totalConcluidas > 0 ? Math.round(meetingsWithATA / totalConcluidas * 100) : 0;
    return { totalMeetings, meetingsWithAgenda, totalConcluidas, meetingsWithATA, pautasPercentual, atasPercentual };
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

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="h-[calc(100vh-4rem)] overflow-hidden p-3 flex flex-col gap-3">
          {/* Row 1: 4 Métricas Principais */}
          <div className="grid grid-cols-4 gap-3">
            {/* Score Geral */}
            <Card className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Score Maturidade</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <p className="text-lg font-bold text-primary">3.6</p>
                    <span className="text-xs text-green-600 font-medium">+9%</span>
                  </div>
                  <Progress value={72} className="h-1.5 mt-1" />
                </div>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </Card>
            {/* Riscos Críticos */}
            <Card className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Riscos Críticos</p>
                  <p className="text-lg font-bold text-red-600 mt-0.5">{riskSummary.criticalRisks}</p>
                  <Progress value={(riskSummary.criticalRisks / riskSummary.totalRisks) * 100} className="h-1.5 mt-1 [&>div]:bg-red-500" />
                </div>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </Card>
            {/* Pautas */}
            <Card className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Pautas Definidas</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{meetingMetrics.pautasPercentual}%</p>
                  <Progress value={meetingMetrics.pautasPercentual} className="h-1.5 mt-1" />
                </div>
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </Card>
            {/* ATAs */}
            <Card className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">ATAs Geradas</p>
                  <p className="text-lg font-bold text-green-600 mt-0.5">{meetingMetrics.atasPercentual}%</p>
                  <Progress value={meetingMetrics.atasPercentual} className="h-1.5 mt-1 [&>div]:bg-green-600" />
                </div>
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </Card>
          </div>

          {/* Row 2: Riscos + Tarefas */}
          <div className="grid grid-cols-2 gap-3">
            {/* Gestão de Riscos */}
            <Card>
              <CardHeader className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm">Gestão de Riscos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/50 rounded-md">
                    <div className="text-lg font-bold text-blue-600">{riskSummary.totalRisks}</div>
                    <div className="text-[10px] text-blue-600 font-medium">Total</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-950/50 rounded-md">
                    <div className="text-lg font-bold text-red-600">{riskSummary.criticalRisks}</div>
                    <div className="text-[10px] text-red-600 font-medium">Críticos</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/50 rounded-md">
                    <div className="text-lg font-bold text-green-600">{riskSummary.mitigationPlans}</div>
                    <div className="text-[10px] text-green-600 font-medium">Mitigados</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/50 rounded-md">
                    <div className="text-lg font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                    <div className="text-[10px] text-yellow-600 font-medium">Sem Mitigação</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestão de Tarefas */}
            <Card>
              <CardHeader className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Gestão de Tarefas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0 space-y-2">
                {/* KPIs */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-lg font-bold">{taskMetrics.total}</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Total</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/50 rounded-md">
                    <div className="text-lg font-bold text-green-600">{taskMetrics.completed}</div>
                    <div className="text-[10px] text-green-600 font-medium">Resolvidas</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/50 rounded-md">
                    <div className="text-lg font-bold text-orange-600">{taskMetrics.pending + taskMetrics.overdue}</div>
                    <div className="text-[10px] text-orange-600 font-medium">Pendentes</div>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded-md">
                    <div className="text-lg font-bold text-primary">{taskMetrics.resolutionRate}%</div>
                    <div className="text-[10px] text-primary font-medium">Resolução</div>
                  </div>
                </div>
                {/* ATAs Pendentes */}
                <div className="flex items-center gap-2">
                  <FileSignature className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">ATAs:</span>
                  <div className="flex gap-2 flex-1">
                    <div className="flex-1 text-center p-1 bg-yellow-50 dark:bg-yellow-950/50 rounded text-[10px]">
                      <span className="font-bold text-yellow-600">{ataApprovalMetrics.aguardandoAprovacao}</span> aprovação
                    </div>
                    <div className="flex-1 text-center p-1 bg-blue-50 dark:bg-blue-950/50 rounded text-[10px]">
                      <span className="font-bold text-blue-600">{ataApprovalMetrics.aguardandoAssinatura}</span> assinatura
                    </div>
                    <div className="flex-1 text-center p-1 bg-green-50 dark:bg-green-950/50 rounded text-[10px]">
                      <span className="font-bold text-green-600">{ataApprovalMetrics.finalizadas}</span> finalizadas
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: IA Preditiva */}
          <DashboardAICopilot
            risks={governanceRisks.map(r => ({
              id: r.id,
              category: r.category,
              title: r.title,
              impact: r.impact,
              probability: r.probability,
              status: r.status,
              controls: r.controls,
            }))}
            maturityScore={latestGovernanceAssessment?.result?.overallScore || 3.6}
            esgScore={latestESGAssessment?.overallScore || 65}
            pendingTasks={taskMetrics.pending}
            overduesTasks={taskMetrics.overdue}
            criticalRisks={riskSummary.criticalRisks}
          />

          {/* Row 4: Maturidade GOV + ESG compactas */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Maturidade Governança */}
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="py-2 px-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm">Maturidade Governança</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => navigateTo("/maturity")}>
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2 pt-0 flex-1 flex flex-col justify-center min-h-0">
                {latestGovernanceAssessment ? (
                  <div className="space-y-1.5">
                    {convertStoredDataToRadarData(latestGovernanceAssessment).slice(0, 3).map(dim => (
                      <div key={dim.name} className="flex items-center gap-2">
                        <span className="text-[11px] w-24 truncate text-muted-foreground">{dim.name}</span>
                        <Progress value={dim.score * 20} className="flex-1 h-2 [&>div]:bg-blue-500" />
                        <span className="text-xs font-bold w-8 text-blue-600">{dim.score.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">Nenhuma avaliação</p>
                    <Button onClick={() => navigateTo("/maturity-quiz")} size="sm" className="mt-1 h-6 text-xs">
                      Iniciar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Maturidade ESG */}
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="py-2 px-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm">Maturidade ESG</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => navigateTo("/esg")}>
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2 pt-0 flex-1 flex flex-col justify-center min-h-0">
                {latestESGAssessment && latestESGAssessment.overallScore !== undefined ? (
                  <div className="space-y-1.5">
                    {latestESGAssessment.pillarScores && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] w-24 text-muted-foreground">Ambiental</span>
                          <Progress value={latestESGAssessment.pillarScores.environmental?.percentage || 0} className="flex-1 h-2 [&>div]:bg-green-500" />
                          <span className="text-xs font-bold w-8 text-green-600">{latestESGAssessment.pillarScores.environmental?.percentage || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] w-24 text-muted-foreground">Social</span>
                          <Progress value={latestESGAssessment.pillarScores.social?.percentage || 0} className="flex-1 h-2 [&>div]:bg-blue-500" />
                          <span className="text-xs font-bold w-8 text-blue-600">{latestESGAssessment.pillarScores.social?.percentage || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] w-24 text-muted-foreground">Governança</span>
                          <Progress value={latestESGAssessment.pillarScores.governance?.percentage || 0} className="flex-1 h-2 [&>div]:bg-purple-500" />
                          <span className="text-xs font-bold w-8 text-purple-600">{latestESGAssessment.pillarScores.governance?.percentage || 0}%</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">Nenhuma avaliação</p>
                    <Button onClick={() => navigateTo("/esg")} size="sm" className="mt-1 h-6 text-xs bg-green-600 hover:bg-green-700">
                      Iniciar
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
