import React, { useEffect } from "react";
import { Brain, RefreshCw, Shield, AlertTriangle, Lightbulb, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  usePredictiveInsights, 
  StrategicRisk, 
  OperationalThreat, 
  StrategicOpportunity,
  GovernanceInsights 
} from "@/hooks/usePredictiveInsights";
import { cn } from "@/lib/utils";

interface RiskData {
  id: number;
  category: string;
  title: string;
  impact: number;
  probability: number;
  status: string;
  controls: string[];
}

interface DashboardAICopilotProps {
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
}

// Configuration for risk priorities
const priorityConfig = {
  critical: { label: "Crítico", bgColor: "bg-red-600", textColor: "text-white" },
  high: { label: "Alto", bgColor: "bg-orange-500", textColor: "text-white" },
  medium: { label: "Médio", bgColor: "bg-yellow-500", textColor: "text-white" },
};

// Configuration for threat timeframes
const timeframeConfig = {
  immediate: { label: "Imediato", bgColor: "bg-red-600", textColor: "text-white" },
  "30_days": { label: "30 dias", bgColor: "bg-amber-500", textColor: "text-white" },
  "90_days": { label: "90 dias", bgColor: "bg-blue-500", textColor: "text-white" },
};

// Strategic Risk Item Component
function StrategicRiskItem({ risk }: { risk: StrategicRisk }) {
  const priority = priorityConfig[risk.priority] || priorityConfig.medium;
  const isCritical = risk.priority === 'critical';

  return (
    <div className={cn(
      "relative p-3 rounded-lg bg-red-50/80 dark:bg-red-950/30 border-l-3 border-l-red-500",
      isCritical && "ring-1 ring-red-300 dark:ring-red-800"
    )}>
      {isCritical && (
        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse" />
      )}
      <div className="flex items-start gap-2 mb-2">
        <Badge className={cn("text-[9px] px-1.5 py-0 font-semibold", priority.bgColor, priority.textColor)}>
          {priority.label}
        </Badge>
      </div>
      <h4 className="font-semibold text-xs text-foreground leading-tight mb-1">
        {risk.title}
      </h4>
      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
        {risk.context}
      </p>
      <div className="space-y-1.5 pt-2 border-t border-red-200/50 dark:border-red-800/50">
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-red-600 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-foreground font-medium">{risk.actions.primary}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-red-400 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">{risk.actions.secondary}</span>
        </div>
      </div>
    </div>
  );
}

// Operational Threat Item Component
function OperationalThreatItem({ threat }: { threat: OperationalThreat }) {
  const timeframe = timeframeConfig[threat.timeframe] || timeframeConfig["30_days"];

  return (
    <div className="relative p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border-l-3 border-l-amber-500">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <Badge className={cn("text-[9px] px-1.5 py-0 font-semibold", timeframe.bgColor, timeframe.textColor)}>
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          {timeframe.label}
        </Badge>
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
          {threat.category}
        </Badge>
      </div>
      <h4 className="font-semibold text-xs text-foreground leading-tight mb-1">
        {threat.title}
      </h4>
      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
        {threat.context}
      </p>
      <div className="space-y-1.5 pt-2 border-t border-amber-200/50 dark:border-amber-800/50">
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-amber-600 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-foreground font-medium">{threat.actions.primary}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-amber-400 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">{threat.actions.secondary}</span>
        </div>
      </div>
    </div>
  );
}

// Strategic Opportunity Item Component
function StrategicOpportunityItem({ opportunity }: { opportunity: StrategicOpportunity }) {
  return (
    <div className="relative p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border-l-3 border-l-blue-500">
      <div className="flex items-start gap-2 mb-2">
        <Badge className="text-[9px] px-1.5 py-0 font-semibold bg-blue-600 text-white">
          Estratégica
        </Badge>
      </div>
      <h4 className="font-semibold text-xs text-foreground leading-tight mb-1">
        {opportunity.title}
      </h4>
      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
        {opportunity.context}
      </p>
      <div className="space-y-1.5 pt-2 border-t border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-blue-600 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-foreground font-medium">{opportunity.actions.primary}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <ArrowRight className="h-2.5 w-2.5 text-blue-400 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">{opportunity.actions.secondary}</span>
        </div>
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
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  iconColor: string;
  headerBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden rounded-lg border border-border/50 bg-background/50">
      <div className={cn("flex items-center gap-2 px-3 py-2 border-b border-border/50", headerBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
        <span className="text-xs font-bold text-foreground">{title}</span>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-2">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col h-full rounded-lg border border-border/50 bg-background/50">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="p-2 space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="p-3 rounded-lg bg-muted/20 border-l-3 border-l-muted">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="pt-2 border-t border-muted/30 space-y-1">
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

export function DashboardAICopilot({
  risks,
  maturityScore,
  esgScore,
  pendingTasks,
  overduesTasks,
  criticalRisks,
}: DashboardAICopilotProps) {
  const { governanceInsights, isLoading, error, lastUpdated, fetchInsights } = usePredictiveInsights();

  const handleRefresh = () => {
    fetchInsights({
      risks,
      maturityScore,
      esgScore,
      pendingTasks,
      overduesTasks,
      criticalRisks,
    });
  };

  // Auto-fetch on mount if no insights
  useEffect(() => {
    if (!governanceInsights && !isLoading && !error) {
      const timer = setTimeout(() => {
        handleRefresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const hasInsights = governanceInsights && (
    governanceInsights.strategicRisks.length > 0 ||
    governanceInsights.operationalThreats.length > 0 ||
    governanceInsights.strategicOpportunities.length > 0
  );

  return (
    <Card className="flex flex-col min-h-0 overflow-hidden border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/30 via-purple-50/20 to-indigo-50/30 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-indigo-950/20">
      <CardHeader className="py-2 px-4 flex-shrink-0 border-b border-indigo-100/50 dark:border-indigo-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Copiloto de Governança
              </CardTitle>
              <span className="text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                IA Preditiva
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
                {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1.5 h-7 text-xs px-3 bg-background/50 hover:bg-background"
            >
              <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              {isLoading ? "Analisando..." : "Atualizar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2 flex-1 min-h-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-4 h-full flex flex-col items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
            <p className="text-xs text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-7 text-xs">
              Tentar novamente
            </Button>
          </div>
        ) : hasInsights ? (
          <div className="grid grid-cols-3 gap-3 h-full">
            {/* Column 1: Strategic Risks */}
            <InsightColumn 
              title="Riscos Estratégicos" 
              icon={Shield} 
              iconColor="text-red-600"
              headerBg="bg-red-50/80 dark:bg-red-950/30"
            >
              {governanceInsights.strategicRisks.map((risk, index) => (
                <StrategicRiskItem key={index} risk={risk} />
              ))}
            </InsightColumn>

            {/* Column 2: Operational Threats */}
            <InsightColumn 
              title="Ameaças Operacionais" 
              icon={AlertTriangle} 
              iconColor="text-amber-600"
              headerBg="bg-amber-50/80 dark:bg-amber-950/30"
            >
              {governanceInsights.operationalThreats.map((threat, index) => (
                <OperationalThreatItem key={index} threat={threat} />
              ))}
            </InsightColumn>

            {/* Column 3: Strategic Opportunities */}
            <InsightColumn 
              title="Oportunidades" 
              icon={Lightbulb} 
              iconColor="text-blue-600"
              headerBg="bg-blue-50/80 dark:bg-blue-950/30"
            >
              {governanceInsights.strategicOpportunities.map((opportunity, index) => (
                <StrategicOpportunityItem key={index} opportunity={opportunity} />
              ))}
            </InsightColumn>
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center py-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 mb-3">
              <Brain className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Copiloto de Governança</p>
            <p className="text-xs text-muted-foreground mb-3">
              Clique para gerar análise estratégica baseada nos dados atuais
            </p>
            <Button onClick={handleRefresh} size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <Sparkles className="h-3 w-3" />
              Gerar Análise Estratégica
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
