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
        "p-4 rounded-lg border transition-all hover:shadow-md",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-background/80", config.iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={config.badgeVariant} className="text-xs">
              {config.label}
            </Badge>
            <Badge className={cn("text-xs", priority.color)}>
              {priority.label}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {insight.timeframe}
            </span>
          </div>
          <h4 className="font-semibold text-sm text-foreground mb-1">
            {insight.title}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {insight.description}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">{insight.suggestedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
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
      // Small delay to avoid immediate fetch on first render
      const timer = setTimeout(() => {
        handleRefresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []); // Only on mount

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                IA Preditiva
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Copilot de Inteligência Estratégica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Atualizado: {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              {isLoading ? "Analisando..." : "Atualizar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </div>
        ) : insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.slice(0, 6).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-medium text-muted-foreground mb-2">
              Nenhuma análise disponível
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em "Atualizar" para gerar insights preditivos
            </p>
            <Button onClick={handleRefresh} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar Análise com IA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
