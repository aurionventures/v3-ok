import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, RefreshCw, Shield, AlertTriangle, Lightbulb, Sparkles, 
  Clock, ArrowRight, TrendingUp, TrendingDown, History, Settings as SettingsIcon,
  ExternalLink, Calendar, Target, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  usePredictiveInsights, 
  StrategicRisk, 
  OperationalThreat, 
  StrategicOpportunity 
} from "@/hooks/usePredictiveInsights";
import { useInsightsHistory, TrendInfo } from "@/hooks/useInsightsHistory";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// Route mapping for navigable actions
const ACTION_ROUTE_MAP: Record<string, string> = {
  risco: "/governance-risk-management",
  riscos: "/governance-risk-management",
  reunião: "/annual-agenda",
  reuniao: "/annual-agenda",
  conselho: "/governance-config",
  conselhos: "/governance-config",
  tarefa: "/secretariat",
  tarefas: "/secretariat",
  pendência: "/secretariat",
  pendencias: "/secretariat",
  documento: "/document-checklist",
  documentos: "/document-checklist",
  checklist: "/document-checklist",
  esg: "/esg",
  ambiental: "/esg",
  sustentabilidade: "/esg",
  maturidade: "/maturity",
  governança: "/maturity",
  sucessão: "/succession",
  sucessao: "/succession",
  herdeiro: "/heirs",
  compliance: "/governance-risk-management",
  ata: "/secretariat",
  atas: "/secretariat",
};

function detectRoute(actionText: string): string | null {
  const lowerText = actionText.toLowerCase();
  for (const [keyword, route] of Object.entries(ACTION_ROUTE_MAP)) {
    if (lowerText.includes(keyword)) {
      return route;
    }
  }
  return null;
}

// Priority and timeframe configs
const priorityConfig = {
  critical: { label: "Crítico", bgColor: "bg-red-600", textColor: "text-white" },
  high: { label: "Alto", bgColor: "bg-orange-500", textColor: "text-white" },
  medium: { label: "Médio", bgColor: "bg-yellow-500", textColor: "text-white" },
};

const timeframeConfig = {
  immediate: { label: "Imediato", bgColor: "bg-red-600", textColor: "text-white" },
  "30_days": { label: "30 dias", bgColor: "bg-amber-500", textColor: "text-white" },
  "90_days": { label: "90 dias", bgColor: "bg-blue-500", textColor: "text-white" },
};

// Trend Badge Component
function TrendBadge({ trend }: { trend?: TrendInfo }) {
  if (!trend) return null;
  
  if (trend.type === 'improving') {
    return (
      <Badge className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <TrendingDown className="h-2.5 w-2.5 mr-0.5" /> Melhorou
      </Badge>
    );
  }
  if (trend.type === 'worsening') {
    return (
      <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> Piorou
      </Badge>
    );
  }
  if (trend.type === 'new') {
    return (
      <Badge className="text-[9px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <Sparkles className="h-2.5 w-2.5 mr-0.5" /> Novo
      </Badge>
    );
  }
  return null;
}

// Action Button Component
function ActionButton({ action, variant = "primary" }: { action: string; variant?: "primary" | "secondary" }) {
  const navigate = useNavigate();
  const route = detectRoute(action);
  
  if (!route) {
    return (
      <div className="flex items-start gap-1.5">
        <ArrowRight className={cn(
          "h-2.5 w-2.5 mt-0.5 flex-shrink-0",
          variant === "primary" ? "text-foreground" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-[10px]",
          variant === "primary" ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {action}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-1.5 group">
      <ArrowRight className={cn(
        "h-2.5 w-2.5 mt-0.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5",
        variant === "primary" ? "text-foreground" : "text-muted-foreground"
      )} />
      <button
        onClick={() => navigate(route)}
        className={cn(
          "text-[10px] text-left hover:underline cursor-pointer transition-colors",
          variant === "primary" ? "text-foreground font-medium hover:text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {action}
        <ExternalLink className="h-2 w-2 inline ml-0.5 opacity-50" />
      </button>
    </div>
  );
}

// Strategic Risk Item
function StrategicRiskItem({ risk, trend }: { risk: StrategicRisk; trend?: TrendInfo }) {
  const priority = priorityConfig[risk.priority] || priorityConfig.medium;
  const isCritical = risk.priority === 'critical';

  return (
    <div className={cn(
      "relative p-4 rounded-lg bg-red-50/80 dark:bg-red-950/30 border-l-4 border-l-red-500",
      isCritical && "ring-1 ring-red-300 dark:ring-red-800"
    )}>
      {isCritical && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
      )}
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold", priority.bgColor, priority.textColor)}>
          {priority.label}
        </Badge>
        <TrendBadge trend={trend} />
      </div>
      <h4 className="font-semibold text-sm text-foreground leading-tight mb-1.5">
        {risk.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        {risk.context}
      </p>
      <div className="space-y-2 pt-3 border-t border-red-200/50 dark:border-red-800/50">
        <p className="text-[10px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={risk.actions.primary} variant="primary" />
        <ActionButton action={risk.actions.secondary} variant="secondary" />
      </div>
    </div>
  );
}

// Operational Threat Item
function OperationalThreatItem({ threat, trend }: { threat: OperationalThreat; trend?: TrendInfo }) {
  const timeframe = timeframeConfig[threat.timeframe] || timeframeConfig["30_days"];

  return (
    <div className="relative p-4 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-l-amber-500">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold", timeframe.bgColor, timeframe.textColor)}>
          <Clock className="h-3 w-3 mr-1" />
          {timeframe.label}
        </Badge>
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
          {threat.category}
        </Badge>
        <TrendBadge trend={trend} />
      </div>
      <h4 className="font-semibold text-sm text-foreground leading-tight mb-1.5">
        {threat.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        {threat.context}
      </p>
      <div className="space-y-2 pt-3 border-t border-amber-200/50 dark:border-amber-800/50">
        <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={threat.actions.primary} variant="primary" />
        <ActionButton action={threat.actions.secondary} variant="secondary" />
      </div>
    </div>
  );
}

// Strategic Opportunity Item
function StrategicOpportunityItem({ opportunity, trend }: { opportunity: StrategicOpportunity; trend?: TrendInfo }) {
  return (
    <div className="relative p-4 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-l-blue-500">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className="text-[10px] px-2 py-0.5 font-semibold bg-blue-600 text-white">
          Estratégica
        </Badge>
        <TrendBadge trend={trend} />
      </div>
      <h4 className="font-semibold text-sm text-foreground leading-tight mb-1.5">
        {opportunity.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        {opportunity.context}
      </p>
      <div className="space-y-2 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
        <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={opportunity.actions.primary} variant="primary" />
        <ActionButton action={opportunity.actions.secondary} variant="secondary" />
      </div>
    </div>
  );
}

// Column Component
function InsightColumn({ 
  title, 
  icon: Icon, 
  iconColor,
  headerBg,
  children,
  count
}: { 
  title: string; 
  icon: React.ElementType; 
  iconColor: string;
  headerBg: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden rounded-xl border border-border/50 bg-background/50 shadow-sm">
      <div className={cn("flex items-center justify-between px-4 py-3 border-b border-border/50", headerBg)}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", iconColor)} />
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        {count !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        )}
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

// History Timeline Item
function HistoryTimelineItem({ entry, isFirst }: { entry: any; isFirst: boolean }) {
  const date = new Date(entry.created_at);
  const risksCount = entry.strategic_risks?.length || 0;
  const threatsCount = entry.operational_threats?.length || 0;
  const oppsCount = entry.strategic_opportunities?.length || 0;

  return (
    <div className="relative pl-8 pb-6">
      {!isFirst && (
        <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />
      )}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
        <Brain className="h-3 w-3 text-white" />
      </div>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </CardTitle>
              <CardDescription className="text-xs">
                {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1">
                <Shield className="h-3 w-3 text-red-500" />
                {risksCount}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                {threatsCount}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Lightbulb className="h-3 w-3 text-blue-500" />
                {oppsCount}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2 px-4 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Maturidade: <span className="font-medium text-foreground">{entry.maturity_score?.toFixed(1) || "N/A"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              ESG: <span className="font-medium text-foreground">{entry.esg_score ? `${entry.esg_score}%` : "N/A"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Pendências: <span className="font-medium text-foreground">{entry.pending_tasks || 0}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col h-full rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="p-3 space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="p-4 rounded-lg bg-muted/20 border-l-4 border-l-muted">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="pt-3 border-t border-muted/30 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Mock data for demonstration
const mockData = {
  risks: [
    { id: 1, category: "Estratégico", title: "Risco 1", impact: 4, probability: 3, status: "active", controls: [] },
  ],
  maturityScore: 3.8,
  esgScore: 65,
  pendingTasks: 12,
  overduesTasks: 3,
  criticalRisks: 2,
};

// Demo insights for initial display (shown before first refresh)
const demoInsights = {
  strategicRisks: [
    {
      title: "Vulnerabilidade na Sucessão Executiva",
      priority: "critical" as const,
      context: "Concentração de conhecimento crítico em poucos profissionais chave sem plano de backup estruturado",
      actions: { primary: "Revisar plano de sucessão", secondary: "Mapear candidatos internos" }
    },
    {
      title: "Concentração de Decisões Estratégicas",
      priority: "high" as const,
      context: "Dependência excessiva de poucos tomadores de decisão para assuntos críticos da governança",
      actions: { primary: "Descentralizar decisões", secondary: "Criar comitês delegados" }
    }
  ],
  operationalThreats: [
    {
      title: "Pressão Regulatória ESG",
      timeframe: "30_days" as const,
      category: "Regulatório",
      context: "Novas exigências de compliance ambiental entrando em vigor no próximo trimestre",
      actions: { primary: "Atualizar políticas ESG", secondary: "Treinar equipe de compliance" }
    },
    {
      title: "Pendências Acumuladas",
      timeframe: "immediate" as const,
      category: "Operacional",
      context: "Backlog crescente de tarefas críticas impactando prazos de governança",
      actions: { primary: "Priorizar pendências críticas", secondary: "Delegar tarefas pendentes" }
    }
  ],
  strategicOpportunities: [
    {
      title: "Fortalecimento da Cultura de Compliance",
      context: "Momento oportuno para consolidar práticas de governança e fortalecer a cultura organizacional",
      actions: { primary: "Implementar programa de compliance", secondary: "Medir resultados trimestrais" }
    },
    {
      title: "Certificação B Corp",
      context: "Diferencial competitivo no mercado e alinhamento com valores ESG da organização",
      actions: { primary: "Avaliar requisitos da certificação", secondary: "Iniciar processo de certificação" }
    }
  ]
};

export default function GovernanceCopilot() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analysis");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  
  const { governanceInsights, isLoading, error, lastUpdated, fetchInsights } = usePredictiveInsights();
  const { history, isLoading: historyLoading, fetchHistory, getLatestEntry, compareTrends } = useInsightsHistory();
  
  const [trends, setTrends] = useState<Map<string, TrendInfo>>(new Map());

  // Use demo insights until user refreshes, then show real data
  const displayInsights = useMemo(() => {
    if (hasRefreshed && governanceInsights) {
      return governanceInsights;
    }
    return demoInsights;
  }, [hasRefreshed, governanceInsights]);

  const handleRefresh = async () => {
    setHasRefreshed(true);
    await fetchInsights(mockData);
    await fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (governanceInsights) {
      const latestEntry = getLatestEntry();
      const newTrends = compareTrends(governanceInsights, latestEntry);
      setTrends(newTrends);
    }
  }, [governanceInsights, history]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Copiloto de Governança" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Hero Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Copiloto de Governança
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    IA Preditiva para Decisões Estratégicas
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    Última atualização: {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  {isLoading ? "Analisando..." : "Atualizar Análise"}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Antecipação • Clareza • Inteligência Aplicada — Apoio direto à decisão da alta liderança
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-8rem)]">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis" className="gap-2">
                <Brain className="h-4 w-4" />
                Análise Atual
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="h-[calc(100%-3rem)] m-0">
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" onClick={handleRefresh}>
                      Tentar novamente
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Column 1: Strategic Risks */}
                  <InsightColumn 
                    title="Riscos Estratégicos" 
                    icon={Shield} 
                    iconColor="text-red-600"
                    headerBg="bg-red-50/80 dark:bg-red-950/30"
                    count={displayInsights.strategicRisks.length}
                  >
                    {displayInsights.strategicRisks.map((risk, index) => (
                      <StrategicRiskItem 
                        key={index} 
                        risk={risk} 
                        trend={hasRefreshed ? trends.get(`risk_${index}`) : undefined}
                      />
                    ))}
                  </InsightColumn>

                  {/* Column 2: Operational Threats */}
                  <InsightColumn 
                    title="Ameaças Operacionais" 
                    icon={AlertTriangle} 
                    iconColor="text-amber-600"
                    headerBg="bg-amber-50/80 dark:bg-amber-950/30"
                    count={displayInsights.operationalThreats.length}
                  >
                    {displayInsights.operationalThreats.map((threat, index) => (
                      <OperationalThreatItem 
                        key={index} 
                        threat={threat}
                        trend={hasRefreshed ? trends.get(`threat_${index}`) : undefined}
                      />
                    ))}
                  </InsightColumn>

                  {/* Column 3: Strategic Opportunities */}
                  <InsightColumn 
                    title="Oportunidades Estratégicas" 
                    icon={Lightbulb} 
                    iconColor="text-blue-600"
                    headerBg="bg-blue-50/80 dark:bg-blue-950/30"
                    count={displayInsights.strategicOpportunities.length}
                  >
                    {displayInsights.strategicOpportunities.map((opportunity, index) => (
                      <StrategicOpportunityItem 
                        key={index} 
                        opportunity={opportunity}
                        trend={hasRefreshed ? trends.get(`opportunity_${index}`) : undefined}
                      />
                    ))}
                  </InsightColumn>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="h-[calc(100%-3rem)] m-0">
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Histórico de Análises</CardTitle>
                      <CardDescription>
                        Acompanhe a evolução das recomendações ao longo do tempo
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchHistory()}>
                      <RefreshCw className={cn("h-4 w-4 mr-2", historyLoading && "animate-spin")} />
                      Atualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    {historyLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="pl-8 pb-6">
                            <Skeleton className="h-24 w-full rounded-lg" />
                          </div>
                        ))}
                      </div>
                    ) : history.length > 0 ? (
                      <div className="space-y-0">
                        {history.map((entry, index) => (
                          <HistoryTimelineItem 
                            key={entry.id} 
                            entry={entry} 
                            isFirst={index === history.length - 1}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhum histórico de análises disponível.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Gere sua primeira análise na aba "Análise Atual".
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="h-[calc(100%-3rem)] m-0">
              <Card className="h-full">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Configurações do Copiloto</CardTitle>
                  <CardDescription>
                    Personalize o comportamento e as preferências da IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6 max-w-2xl">
                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="font-medium mb-2">Modelo de IA</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Modelo utilizado para gerar análises estratégicas
                      </p>
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        google/gemini-2.5-flash
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="font-medium mb-2">Frequência de Análise</h4>
                      <p className="text-sm text-muted-foreground">
                        As análises são geradas sob demanda quando você clica em "Atualizar Análise".
                        O histórico é salvo automaticamente para comparação de tendências.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="font-medium mb-2">Dados de Entrada</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        A IA considera os seguintes dados do sistema:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Riscos cadastrados e seus controles</li>
                        <li>• Score de maturidade de governança</li>
                        <li>• Score ESG</li>
                        <li>• Tarefas pendentes e atrasadas</li>
                        <li>• Riscos críticos identificados</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
