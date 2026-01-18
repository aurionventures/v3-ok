import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, FileText, AlertTriangle, Shield, ListTodo, Clock, FileSignature, Building2, Leaf, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { DashboardAICopilot } from "@/components/dashboard/DashboardAICopilot";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
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
  const location = useLocation();
  const { user } = useAuth();
  const { actions, loading: loadingActions } = useAllMeetingActions();
  const [showTour, setShowTour] = useState(false);

  // Verificar se deve mostrar o tour guiado
  useEffect(() => {
    // Verificar parâmetro de teste na URL
    const urlParams = new URLSearchParams(window.location.search);
    const testTour = urlParams.get('testTour') === 'true';
    
    const shouldShowTour = location.state?.showTour || testTour;
    const hasCompletedTour = localStorage.getItem('guided_tour_completed');
    const hasSkippedTour = localStorage.getItem('guided_tour_skipped');
    
    // Mostrar tour se veio do login, teste ou nunca foi completado/pulado
    if (shouldShowTour && !hasCompletedTour && !hasSkippedTour) {
      setShowTour(true);
      // Limpar o state da navegação e parâmetro da URL
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [location]);

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

  // Verificar se é um novo usuário (sem dados salvos)
  const isNewUser = React.useMemo(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
    const hasOnboardingData = localStorage.getItem('onboarding_data');
    const hasEmpresas = localStorage.getItem('empresas');
    const hasConselhos = localStorage.getItem('conselhos');
    
    // Se não completou onboarding e não tem dados salvos, é novo usuário
    return !onboardingCompleted && !hasOnboardingData && !hasEmpresas && !hasConselhos;
  }, []);

  // Metrics for meetings and ATAs (só mostrar dados mockados se não for novo usuário)
  const meetingMetrics = React.useMemo(() => {
    if (isNewUser) {
      return { totalMeetings: 0, meetingsWithAgenda: 0, totalConcluidas: 0, meetingsWithATA: 0, pautasPercentual: 0, atasPercentual: 0 };
    }
    const totalMeetings = 36;
    const meetingsWithAgenda = 12;
    const totalConcluidas = 10;
    const meetingsWithATA = 9;
    const pautasPercentual = Math.round(meetingsWithAgenda / totalMeetings * 100);
    const atasPercentual = totalConcluidas > 0 ? Math.round(meetingsWithATA / totalConcluidas * 100) : 0;
    return { totalMeetings, meetingsWithAgenda, totalConcluidas, meetingsWithATA, pautasPercentual, atasPercentual };
  }, [isNewUser]);

  // ATA approval metrics (só mostrar dados mockados se não for novo usuário)
  const ataApprovalMetrics = React.useMemo(() => {
    if (isNewUser) {
      return { aguardandoAprovacao: 0, aguardandoAssinatura: 0, finalizadas: 0 };
    }
    return { aguardandoAprovacao: 1, aguardandoAssinatura: 1, finalizadas: 1 };
  }, [isNewUser]);

  React.useEffect(() => {
    // Se for novo usuário, não carregar dados mockados
    if (isNewUser) {
      setLatestGovernanceAssessment(null);
      setLatestESGAssessment(null);
      return;
    }

    // Load latest Governance assessment
    const governanceAssessment = getCurrentMaturityAssessment();
    if (governanceAssessment) {
      setLatestGovernanceAssessment(governanceAssessment);
    } else {
      // Só usar mock se não for novo usuário
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
      // Só usar mock se não for novo usuário
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
  }, [isNewUser]);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Se for novo usuário, mostrar tela vazia (sem redirecionamento para onboarding-wizard)
  if (isNewUser) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Bem-vindo à Legacy OS!</h2>
                <p className="text-muted-foreground mb-6">
                  Use o menu lateral para acessar as funcionalidades da plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showTour && (
        <GuidedTour
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
      
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Desempenho do Conselho" />
        <div 
          className="h-[calc(100vh-3.5rem)] p-3 grid gap-3" 
          style={{ 
            gridTemplateRows: 'auto auto 1fr auto',
            overflow: 'hidden'
          }}
        >
          {/* Row 1: KPIs Executivos */}
          <div className="grid grid-cols-5 gap-2">
            {/* Score Geral */}
            <Card className="p-2.5 border-border/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Score Maturidade</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-bold text-primary">
                        {latestGovernanceAssessment?.result?.pontuacao_total?.toFixed(2) || '3.60'}
                      </p>
                      <span className="text-[10px] text-muted-foreground">/ 5.0</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-semibold">+0.5</span>
                  </div>
                  <Progress value={((latestGovernanceAssessment?.result?.pontuacao_total || 3.6) / 5) * 100} className="h-1.5 mt-1.5" />
                </div>
                <div className="p-1.5 rounded-md bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Card>
            
            {/* Riscos Críticos */}
            <Card className="p-2.5 border-red-200/50 dark:border-red-900/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Riscos Críticos</p>
                  <p className="text-xl font-bold text-red-600 mt-1">{riskSummary.criticalRisks}</p>
                  <Progress value={(riskSummary.criticalRisks / riskSummary.totalRisks) * 100} className="h-1.5 mt-1.5 [&>div]:bg-red-500" />
                </div>
                <div className="p-1.5 rounded-md bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </Card>
            
            {/* Tarefas Atrasadas */}
            <Card className="p-2.5 border-orange-200/50 dark:border-orange-900/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Tarefas Atrasadas</p>
                  <p className="text-xl font-bold text-orange-600 mt-1">{taskMetrics.overdue}</p>
                  <Progress value={taskMetrics.total > 0 ? (taskMetrics.overdue / taskMetrics.total) * 100 : 0} className="h-1.5 mt-1.5 [&>div]:bg-orange-500" />
                </div>
                <div className="p-1.5 rounded-md bg-orange-500/10">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </Card>
            
            
            {/* Pautas Definidas */}
            <Card className="p-2.5 border-border/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Pautas Definidas</p>
                  <p className="text-xl font-bold text-primary mt-1">{meetingMetrics.pautasPercentual}%</p>
                  <Progress value={meetingMetrics.pautasPercentual} className="h-1.5 mt-1.5" />
                </div>
                <div className="p-1.5 rounded-md bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Card>
            
            {/* ATAs Geradas */}
            <Card className="p-2.5 border-green-200/50 dark:border-green-900/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium">ATAs Geradas</p>
                  <p className="text-xl font-bold text-green-600 mt-1">{meetingMetrics.atasPercentual}%</p>
                  <Progress value={meetingMetrics.atasPercentual} className="h-1.5 mt-1.5 [&>div]:bg-green-600" />
                </div>
                <div className="p-1.5 rounded-md bg-green-500/10">
                  <FileSignature className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Row 2: Blocos Operacionais (3 colunas) */}
          <div className="grid grid-cols-3 gap-2">
            {/* Gestão de Riscos */}
            <Card className="flex flex-col">
              <CardHeader className="py-2 px-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-blue-500/10">
                    <Shield className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xs font-semibold">Gestão de Riscos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2.5 pt-0 flex-1">
                <div className="grid grid-cols-2 gap-1.5 h-full">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-blue-600">{riskSummary.totalRisks}</div>
                    <div className="text-[9px] text-blue-600/80 font-medium">Total</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-red-600">{riskSummary.criticalRisks}</div>
                    <div className="text-[9px] text-red-600/80 font-medium">Críticos</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-green-600">{riskSummary.mitigationPlans}</div>
                    <div className="text-[9px] text-green-600/80 font-medium">Mitigados</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-yellow-600">{riskSummary.withoutMitigation}</div>
                    <div className="text-[9px] text-yellow-600/80 font-medium">S/ Mitig.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestão de Tarefas */}
            <Card className="flex flex-col">
              <CardHeader className="py-2 px-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-primary/10">
                    <ListTodo className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <CardTitle className="text-xs font-semibold">Gestão de Tarefas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2.5 pt-0 flex-1">
                <div className="grid grid-cols-2 gap-1.5 h-full">
                  <div className="text-center p-2 bg-muted/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold">{taskMetrics.total}</div>
                    <div className="text-[9px] text-muted-foreground font-medium">Total</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-green-600">{taskMetrics.completed}</div>
                    <div className="text-[9px] text-green-600/80 font-medium">Concluídas</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/50 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-orange-600">{taskMetrics.pending + taskMetrics.overdue}</div>
                    <div className="text-[9px] text-orange-600/80 font-medium">Pendentes</div>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded-md flex flex-col justify-center">
                    <div className="text-xl font-bold text-primary">{taskMetrics.resolutionRate}%</div>
                    <div className="text-[9px] text-primary/80 font-medium">Resolução</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicadores */}
            <Card className="flex flex-col">
              <CardHeader className="py-2 px-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-purple-500/10">
                    <Calendar className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <CardTitle className="text-xs font-semibold">Indicadores</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2.5 pt-0 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-medium">Reuniões este mês</span>
                    </div>
                    <span className="text-sm font-bold">{meetingMetrics.totalMeetings}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-medium">Órgãos ativos</span>
                    </div>
                    <span className="text-sm font-bold">5</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileSignature className="h-3.5 w-3.5 text-yellow-600" />
                      <span className="text-[10px] font-medium text-yellow-700 dark:text-yellow-400">ATAs pendentes</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">{ataApprovalMetrics.aguardandoAprovacao + ataApprovalMetrics.aguardandoAssinatura}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: IA Preditiva - Copiloto de Decisão (Destaque) */}
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
            maturityScore={latestGovernanceAssessment?.result?.pontuacao_total || 3.6}
            esgScore={latestESGAssessment?.overallScore || 65}
            pendingTasks={taskMetrics.pending}
            overduesTasks={taskMetrics.overdue}
            criticalRisks={riskSummary.criticalRisks}
          />

          {/* Row 4: Maturidade GOV + ESG - Compacto */}
          <div className="grid grid-cols-2 gap-2 min-h-0">
            {/* Maturidade Governança */}
            <Card className="flex flex-col min-h-0 overflow-hidden max-h-[130px]">
              <CardHeader className="py-1.5 px-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-blue-500/10">
                      <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xs font-semibold">Maturidade Governança</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => navigateTo("/maturity")}>
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2 pt-0 flex-1 flex flex-col justify-center gap-1 min-h-0">
                {latestGovernanceAssessment ? (
                  <>
                    {convertStoredDataToRadarData(latestGovernanceAssessment).map(dim => (
                      <div key={dim.name} className="flex items-center gap-2">
                        <span className="text-[10px] w-16 truncate text-muted-foreground font-medium" title={dim.name}>{dim.name}</span>
                        <Progress value={dim.score * 20} className="flex-1 h-2.5 [&>div]:bg-blue-500" />
                        <span className="text-[10px] font-bold w-6 text-right text-blue-600">{dim.score.toFixed(1)}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground mb-2">Nenhuma avaliação realizada</p>
                    <Button onClick={() => navigateTo("/maturity-quiz")} size="sm" className="h-7 text-xs">
                      Iniciar Avaliação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Maturidade ESG */}
            <Card className="flex flex-col min-h-0 overflow-hidden max-h-[130px]">
              <CardHeader className="py-1.5 px-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-green-500/10">
                      <Leaf className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <CardTitle className="text-xs font-semibold">Maturidade ESG</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => navigateTo("/esg")}>
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-2 pt-0 flex-1 flex flex-col justify-center gap-1 min-h-0">
                {latestESGAssessment && latestESGAssessment.overallScore !== undefined ? (
                  <>
                    {latestESGAssessment.pillarScores && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-16 text-muted-foreground font-medium">Ambiental</span>
                          <Progress value={latestESGAssessment.pillarScores.environmental?.percentage || 63} className="flex-1 h-2 [&>div]:bg-green-500" />
                          <span className="text-[10px] font-bold w-8 text-right text-green-600">{latestESGAssessment.pillarScores.environmental?.percentage || 63}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-16 text-muted-foreground font-medium">Social</span>
                          <Progress value={latestESGAssessment.pillarScores.social?.percentage || 72} className="flex-1 h-2 [&>div]:bg-blue-500" />
                          <span className="text-[10px] font-bold w-8 text-right text-blue-600">{latestESGAssessment.pillarScores.social?.percentage || 72}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-16 text-muted-foreground font-medium">Governança</span>
                          <Progress value={latestESGAssessment.pillarScores.governance?.percentage || 67} className="flex-1 h-2 [&>div]:bg-purple-500" />
                          <span className="text-[10px] font-bold w-8 text-right text-purple-600">{latestESGAssessment.pillarScores.governance?.percentage || 67}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-16 text-muted-foreground font-medium">Estratégia</span>
                          <Progress value={70} className="flex-1 h-2 [&>div]:bg-amber-500" />
                          <span className="text-[10px] font-bold w-8 text-right text-amber-600">70%</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground mb-2">Nenhuma avaliação realizada</p>
                    <Button onClick={() => navigateTo("/esg")} size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                      Iniciar Avaliação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
