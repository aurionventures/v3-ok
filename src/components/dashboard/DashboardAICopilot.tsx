import React, { useEffect } from "react";
import { Brain, RefreshCw, AlertTriangle, Lightbulb, Target, Clock, Sparkles } from "lucide-react";
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
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-900",
    iconColor: "text-red-600",
    badgeVariant: "destructive" as const,
  },
  opportunity: {
    icon: Lightbulb,
    label: "Oportunidade",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-900",
    iconColor: "text-green-600",
    badgeVariant: "default" as const,
  },
  recommendation: {
    icon: Target,
    label: "Recomendação",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-900",
    iconColor: "text-blue-600",
    badgeVariant: "secondary" as const,
  },
};

const priorityConfig = {
  critical: { label: "Crítico", color: "bg-red-600 text-white" },
  high: { label: "Alto", color: "bg-orange-500 text-white" },
  medium: { label: "Médio", color: "bg-yellow-500 text-white" },
  low: { label: "Baixo", color: "bg-green-500 text-white" },
};

function InsightCard({ insight }: { insight: PredictiveInsight }) {
  const config = typeConfig[insight.type];
  const priority = priorityConfig[insight.priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "p-2.5 rounded-md border transition-all hover:shadow-sm",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn("p-1.5 rounded bg-background/80", config.iconColor)}>
          <Icon className="h-3 w-3" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <Badge variant={config.badgeVariant} className="text-[10px] px-1.5 py-0">
              {config.label}
            </Badge>
            <Badge className={cn("text-[10px] px-1.5 py-0", priority.color)}>
              {priority.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {insight.timeframe}
            </span>
          </div>
          <h4 className="font-semibold text-xs text-foreground leading-tight">
            {insight.title}
          </h4>
          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
            {insight.suggestedAction}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-2.5 rounded-md border bg-muted/30">
          <div className="flex items-start gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="flex-1 space-y-1">
              <div className="flex gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-3/4" />
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

  return (
    <Card className="flex flex-col min-h-0 overflow-hidden">
      <CardHeader className="py-1.5 px-2.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-gradient-to-br from-purple-500 to-indigo-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            <CardTitle className="text-xs flex items-center gap-1">
              IA Preditiva
              <Sparkles className="h-2.5 w-2.5 text-yellow-500" />
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            {lastUpdated && (
              <span className="text-[9px] text-muted-foreground">
                {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1 h-5 text-[10px] px-1.5"
            >
              <RefreshCw className={cn("h-2.5 w-2.5", isLoading && "animate-spin")} />
              {isLoading ? "..." : "Atualizar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2.5 pb-2 pt-0 flex-1 min-h-0">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-1.5 h-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-2 rounded border bg-muted/30 flex flex-col">
                <div className="flex items-start gap-1.5">
                  <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-1">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-2 h-full flex flex-col items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mb-1" />
            <p className="text-[10px] text-muted-foreground mb-1">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-5 text-[10px]">
              Tentar novamente
            </Button>
          </div>
        ) : insights.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5 h-full">
            {insights.slice(0, 3).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <Brain className="h-5 w-5 text-muted-foreground/50 mb-1" />
            <p className="text-[10px] text-muted-foreground mb-1">Clique para gerar insights</p>
            <Button onClick={handleRefresh} size="sm" className="gap-1 h-5 text-[10px]">
              <Sparkles className="h-2.5 w-2.5" />
              Gerar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
