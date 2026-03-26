import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, RefreshCw, Shield, AlertTriangle, Lightbulb, Sparkles, Clock, ArrowRight, TrendingUp, TrendingDown, ExternalLink, FileText } from "lucide-react";
import { AgendaSuggestionsTab } from "@/components/copilot/AgendaSuggestionsTab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePredictiveInsights, StrategicRisk, OperationalThreat, StrategicOpportunity } from "@/hooks/usePredictiveInsights";
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
  atas: "/secretariat"
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
  critical: {
    label: "Crítico",
    bgColor: "bg-destructive",
    textColor: "text-destructive-foreground"
  },
  high: {
    label: "Alto",
    bgColor: "bg-warning",
    textColor: "text-warning-foreground"
  },
  medium: {
    label: "Médio",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground"
  }
};
const timeframeConfig = {
  immediate: {
    label: "Imediato",
    bgColor: "bg-destructive",
    textColor: "text-destructive-foreground"
  },
  "30_days": {
    label: "30 dias",
    bgColor: "bg-warning",
    textColor: "text-warning-foreground"
  },
  "90_days": {
    label: "90 dias",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground"
  }
};

// Trend Badge Component
function TrendBadge({
  trend
}: {
  trend?: TrendInfo;
}) {
  if (!trend) return null;
  if (trend.type === 'improving') {
    return <Badge className="text-[9px] px-1.5 py-0 bg-success/10 text-success dark:bg-success/20 dark:text-success">
        <TrendingDown className="h-2.5 w-2.5 mr-0.5" /> Melhorou
      </Badge>;
  }
  if (trend.type === 'worsening') {
    return <Badge className="text-[9px] px-1.5 py-0 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
        <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> Piorou
      </Badge>;
  }
  if (trend.type === 'new') {
    return <Badge className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
        <Sparkles className="h-2.5 w-2.5 mr-0.5" /> Novo
      </Badge>;
  }
  return null;
}

// Action Button Component
function ActionButton({
  action,
  variant = "primary"
}: {
  action: string;
  variant?: "primary" | "secondary";
}) {
  const navigate = useNavigate();
  const route = detectRoute(action);
  if (!route) {
    return <div className="flex items-start gap-1.5">
        <ArrowRight className={cn("h-2.5 w-2.5 mt-0.5 flex-shrink-0", variant === "primary" ? "text-foreground" : "text-muted-foreground")} />
        <span className={cn("text-[10px]", variant === "primary" ? "text-foreground font-medium" : "text-muted-foreground")}>
          {action}
        </span>
      </div>;
  }
  return <div className="flex items-start gap-1.5 group">
      <ArrowRight className={cn("h-2.5 w-2.5 mt-0.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5", variant === "primary" ? "text-foreground" : "text-muted-foreground")} />
      <button onClick={() => navigate(route)} className={cn("text-[10px] text-left hover:underline cursor-pointer transition-colors", variant === "primary" ? "text-foreground font-medium hover:text-primary" : "text-muted-foreground hover:text-foreground")}>
        {action}
        <ExternalLink className="h-2 w-2 inline ml-0.5 opacity-50" />
      </button>
    </div>;
}

// Strategic Risk Item
function StrategicRiskItem({
  risk,
  trend
}: {
  risk: StrategicRisk;
  trend?: TrendInfo;
}) {
  const priority = priorityConfig[risk.priority] || priorityConfig.medium;
  const isCritical = risk.priority === 'critical';
  return <div className={cn("relative p-4 rounded-lg bg-destructive/5 dark:bg-destructive/10 border-l-4 border-l-destructive", isCritical && "ring-1 ring-destructive/30 dark:ring-destructive/30")}>
      {isCritical && <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />}
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
      <div className="space-y-2 pt-3 border-t border-destructive/20 dark:border-destructive/20">
        <p className="text-[10px] font-semibold text-destructive dark:text-destructive uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={risk.actions.primary} variant="primary" />
        <ActionButton action={risk.actions.secondary} variant="secondary" />
      </div>
    </div>;
}

// Operational Threat Item
function OperationalThreatItem({
  threat,
  trend
}: {
  threat: OperationalThreat;
  trend?: TrendInfo;
}) {
  const timeframe = timeframeConfig[threat.timeframe] || timeframeConfig["30_days"];
  return <div className="relative p-4 rounded-lg bg-warning/5 dark:bg-warning/10 border-l-4 border-l-warning">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold", timeframe.bgColor, timeframe.textColor)}>
          <Clock className="h-3 w-3 mr-1" />
          {timeframe.label}
        </Badge>
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium border-warning/30 text-warning dark:border-warning/30 dark:text-warning">
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
      <div className="space-y-2 pt-3 border-t border-warning/20 dark:border-warning/20">
        <p className="text-[10px] font-semibold text-warning dark:text-warning uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={threat.actions.primary} variant="primary" />
        <ActionButton action={threat.actions.secondary} variant="secondary" />
      </div>
    </div>;
}

// Strategic Opportunity Item
function StrategicOpportunityItem({
  opportunity,
  trend
}: {
  opportunity: StrategicOpportunity;
  trend?: TrendInfo;
}) {
  return <div className="relative p-4 rounded-lg bg-success/5 dark:bg-success/10 border-l-4 border-l-success">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className="text-[10px] px-2 py-0.5 font-semibold bg-success text-success-foreground">
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
      <div className="space-y-2 pt-3 border-t border-success/20 dark:border-success/20">
        <p className="text-[10px] font-semibold text-success dark:text-success uppercase tracking-wide">
          Ações Recomendadas
        </p>
        <ActionButton action={opportunity.actions.primary} variant="primary" />
        <ActionButton action={opportunity.actions.secondary} variant="secondary" />
      </div>
    </div>;
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
  return <div className="flex flex-col h-full min-h-0 overflow-hidden rounded-xl border border-border/50 bg-background/50 shadow-sm">
      <div className={cn("flex items-center justify-between px-4 py-3 border-b border-border/50", headerBg)}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", iconColor)} />
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        {count !== undefined && <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>}
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {children}
        </div>
      </ScrollArea>
    </div>;
}

// Loading Skeleton
function LoadingSkeleton() {
  return <div className="grid grid-cols-3 gap-4 h-full">
      {[1, 2, 3].map(i => <div key={i} className="flex flex-col h-full rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="p-3 space-y-3">
            {[1, 2].map(j => <div key={j} className="p-4 rounded-lg bg-muted/20 border-l-4 border-l-muted">
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
              </div>)}
          </div>
        </div>)}
    </div>;
}

// Mock data for demonstration
const mockData = {
  risks: [{
    id: 1,
    category: "Estratégico",
    title: "Risco 1",
    impact: 4,
    probability: 3,
    status: "active",
    controls: []
  }],
  maturityScore: 3.8,
  esgScore: 65,
  pendingTasks: 12,
  overduesTasks: 3,
  criticalRisks: 2
};

// Demo insights for initial display (shown before first refresh)
const demoInsights = {
  strategicRisks: [{
    title: "Vulnerabilidade na Sucessão Executiva",
    priority: "critical" as const,
    context: "Concentração de conhecimento crítico em poucos profissionais chave sem plano de backup estruturado",
    actions: {
      primary: "Revisar plano de sucessão",
      secondary: "Mapear candidatos internos"
    }
  }, {
    title: "Concentração de Decisões Estratégicas",
    priority: "high" as const,
    context: "Dependência excessiva de poucos tomadores de decisão para assuntos críticos da governança",
    actions: {
      primary: "Descentralizar decisões",
      secondary: "Criar comitês delegados"
    }
  }],
  operationalThreats: [{
    title: "Pressão Regulatória ESG",
    timeframe: "30_days" as const,
    category: "Regulatório",
    context: "Novas exigências de compliance ambiental entrando em vigor no próximo trimestre",
    actions: {
      primary: "Atualizar políticas ESG",
      secondary: "Treinar equipe de compliance"
    }
  }, {
    title: "Pendências Acumuladas",
    timeframe: "immediate" as const,
    category: "Operacional",
    context: "Backlog crescente de tarefas críticas impactando prazos de governança",
    actions: {
      primary: "Priorizar pendências críticas",
      secondary: "Delegar tarefas pendentes"
    }
  }],
  strategicOpportunities: [{
    title: "Fortalecimento da Cultura de Compliance",
    context: "Momento oportuno para consolidar práticas de governança e fortalecer a cultura organizacional",
    actions: {
      primary: "Implementar programa de compliance",
      secondary: "Medir resultados trimestrais"
    }
  }, {
    title: "Certificação B Corp",
    context: "Diferencial competitivo no mercado e alinhamento com valores ESG da organização",
    actions: {
      primary: "Avaliar requisitos da certificação",
      secondary: "Iniciar processo de certificação"
    }
  }]
};
export default function GovernanceCopilot() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analysis");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const {
    governanceInsights,
    isLoading,
    error,
    lastUpdated,
    fetchInsights
  } = usePredictiveInsights();
  const {
    history,
    isLoading: historyLoading,
    fetchHistory,
    getLatestEntry,
    compareTrends
  } = useInsightsHistory();
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
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Copiloto de Governança" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-2rem)]">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis" className="gap-2">
                <Shield className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="agendas" className="gap-2">
                <FileText className="h-4 w-4" />
                Pautas Sugeridas
              </TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="h-[calc(100%-3rem)] m-0">
              {isLoading ? <LoadingSkeleton /> : error ? <Card className="h-full flex items-center justify-center">
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" onClick={handleRefresh}>
                      Tentar novamente
                    </Button>
                  </div>
                </Card> : <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Column 1: Strategic Risks */}
                  <InsightColumn title="Riscos Estratégicos" icon={Shield} iconColor="text-destructive" headerBg="bg-destructive/5 dark:bg-destructive/10" count={displayInsights.strategicRisks.length}>
                    {displayInsights.strategicRisks.map((risk, index) => <StrategicRiskItem key={index} risk={risk} trend={hasRefreshed ? trends.get(`risk_${index}`) : undefined} />)}
                  </InsightColumn>

                  {/* Column 2: Operational Threats */}
                  <InsightColumn title="Ameaças Operacionais" icon={AlertTriangle} iconColor="text-warning" headerBg="bg-warning/5 dark:bg-warning/10" count={displayInsights.operationalThreats.length}>
                    {displayInsights.operationalThreats.map((threat, index) => <OperationalThreatItem key={index} threat={threat} trend={hasRefreshed ? trends.get(`threat_${index}`) : undefined} />)}
                  </InsightColumn>

                  {/* Column 3: Strategic Opportunities */}
                  <InsightColumn title="Oportunidades Estratégicas" icon={Lightbulb} iconColor="text-success" headerBg="bg-success/5 dark:bg-success/10" count={displayInsights.strategicOpportunities.length}>
                    {displayInsights.strategicOpportunities.map((opportunity, index) => <StrategicOpportunityItem key={index} opportunity={opportunity} trend={hasRefreshed ? trends.get(`opportunity_${index}`) : undefined} />)}
                  </InsightColumn>
                </div>}
            </TabsContent>

            {/* Agendas Tab */}
            <TabsContent value="agendas" className="h-[calc(100%-3rem)] m-0 overflow-auto">
              <AgendaSuggestionsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>;
}