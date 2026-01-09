import React, { useEffect } from "react";
import { Brain, RefreshCw, AlertTriangle, Lightbulb, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePredictiveInsights, PredictiveInsight } from "@/hooks/usePredictiveInsights";
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

const typeConfig = {
  risk_alert: {
    icon: AlertTriangle,
    label: "Alerta",
    bgColor: "bg-red-50 dark:bg-red-950/40",
    borderColor: "border-l-4 border-l-red-500",
    iconColor: "text-red-600",
    badgeVariant: "destructive" as const,
  },
  opportunity: {
    icon: Lightbulb,
    label: "Oportunidade",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-l-4 border-l-emerald-500",
    iconColor: "text-emerald-600",
    badgeVariant: "default" as const,
  },
  recommendation: {
    icon: Target,
    label: "Recomendação",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-l-4 border-l-blue-500",
    iconColor: "text-blue-600",
    badgeVariant: "secondary" as const,
  },
};

const priorityConfig = {
  critical: { label: "Crítico", color: "bg-red-600 text-white", order: 0 },
  high: { label: "Alto", color: "bg-orange-500 text-white", order: 1 },
  medium: { label: "Médio", color: "bg-yellow-500 text-white", order: 2 },
  low: { label: "Baixo", color: "bg-green-500 text-white", order: 3 },
};

function InsightCard({ insight, index }: { insight: PredictiveInsight; index: number }) {
  const config = typeConfig[insight.type];
  const priority = priorityConfig[insight.priority];
  const Icon = config.icon;
  const isCritical = insight.priority === 'critical';

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all hover:shadow-md h-full flex flex-col",
        config.bgColor,
        config.borderColor,
        isCritical && "ring-1 ring-red-300 dark:ring-red-800"
      )}
    >
      {/* Indicador de urgência para críticos */}
      {isCritical && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
      )}
      
      <div className="flex items-start gap-2 h-full">
        <div className={cn("p-1.5 rounded-md bg-background/80 shadow-sm flex-shrink-0", config.iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <Badge variant={config.badgeVariant} className="text-[9px] px-1.5 py-0 font-medium">
              {config.label}
            </Badge>
            <Badge className={cn("text-[9px] px-1.5 py-0 font-medium", priority.color)}>
              {priority.label}
            </Badge>
          </div>
          <h4 className="font-semibold text-xs text-foreground leading-tight mb-2">
            {insight.title}
          </h4>
          <p className="text-[11px] text-muted-foreground flex-1">
            <span className="font-medium">Ação:</span> {insight.suggestedAction}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 rounded-lg border-l-4 border-l-muted bg-muted/20">
          <div className="flex items-start gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
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
  const { insights, isLoading, error, lastUpdated, fetchInsights } = usePredictiveInsights();

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
    if (insights.length === 0 && !isLoading && !error) {
      const timer = setTimeout(() => {
        handleRefresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sort insights by priority
  const sortedInsights = [...insights].sort((a, b) => {
    return priorityConfig[a.priority].order - priorityConfig[b.priority].order;
  });

  return (
    <Card className="flex flex-col min-h-0 overflow-hidden border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/30 via-purple-50/20 to-indigo-50/30 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-indigo-950/20">
      <CardHeader className="py-2.5 px-4 flex-shrink-0 border-b border-indigo-100/50 dark:border-indigo-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Copiloto de Decisão
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
      <CardContent className="px-4 py-3 flex-1 min-h-0">
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
        ) : sortedInsights.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 h-full">
            {sortedInsights.slice(0, 3).map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center py-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 mb-3">
              <Brain className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Análise Preditiva</p>
            <p className="text-xs text-muted-foreground mb-3">
              Clique para gerar insights baseados nos dados atuais
            </p>
            <Button onClick={handleRefresh} size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <Sparkles className="h-3 w-3" />
              Gerar Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
