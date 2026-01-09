import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, RefreshCw, Shield, AlertTriangle, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePredictiveInsights } from "@/hooks/usePredictiveInsights";
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

// Summary Column Component
function SummaryColumn({
  icon: Icon,
  iconColor,
  bgColor,
  count,
  label,
  sublabel,
  highlight,
}: {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  count: number;
  label: string;
  sublabel: string;
  highlight?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-4 rounded-xl", bgColor)}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-6 w-6", iconColor)} />
        <span className={cn("text-3xl font-bold", iconColor)}>{count}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-center">{label}</span>
      <p className="text-xs text-muted-foreground mt-0.5 text-center">{sublabel}</p>
      {highlight && (
        <div className="mt-3 pt-2 border-t border-current/10 w-full">
          <p className="text-xs text-foreground font-medium text-center line-clamp-2">
            {highlight}
          </p>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-10" />
          </div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 pt-2 border-t border-muted/30 w-full">
            <Skeleton className="h-3 w-full" />
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
  const navigate = useNavigate();
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

  // Calculate summary data
  const summary = useMemo(() => {
    if (!governanceInsights) {
      return null;
    }

    const risks = governanceInsights.strategicRisks;
    const threats = governanceInsights.operationalThreats;
    const opportunities = governanceInsights.strategicOpportunities;

    const criticalCount = risks.filter(r => r.priority === 'critical').length;
    const highCount = risks.filter(r => r.priority === 'high').length;
    const immediateCount = threats.filter(t => t.timeframe === 'immediate').length;
    const shortTermCount = threats.filter(t => t.timeframe === '30_days').length;

    return {
      risks: {
        total: risks.length,
        sublabel: criticalCount > 0 || highCount > 0 
          ? `${criticalCount > 0 ? `${criticalCount} crítico` : ''}${criticalCount > 0 && highCount > 0 ? ' • ' : ''}${highCount > 0 ? `${highCount} alto` : ''}`
          : 'Nenhum identificado',
        topItem: risks[0]?.title,
      },
      threats: {
        total: threats.length,
        sublabel: immediateCount > 0 || shortTermCount > 0
          ? `${immediateCount > 0 ? `${immediateCount} imediato` : ''}${immediateCount > 0 && shortTermCount > 0 ? ' • ' : ''}${shortTermCount > 0 ? `${shortTermCount} em 30d` : ''}`
          : 'Nenhuma identificada',
        topItem: threats[0]?.title,
      },
      opportunities: {
        total: opportunities.length,
        sublabel: 'Identificadas pela IA',
        topItem: opportunities[0]?.title,
      },
    };
  }, [governanceInsights]);

  const hasInsights = governanceInsights && (
    governanceInsights.strategicRisks.length > 0 ||
    governanceInsights.operationalThreats.length > 0 ||
    governanceInsights.strategicOpportunities.length > 0
  );

  return (
    <Card className="flex flex-col min-h-0 overflow-hidden border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/30 via-purple-50/20 to-indigo-50/30 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-indigo-950/20">
      <CardHeader className="py-3 px-4 flex-shrink-0 border-b border-indigo-100/50 dark:border-indigo-900/50">
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
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
              Atualizado às {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4 flex-1 min-h-0 flex flex-col">
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
        ) : hasInsights && summary ? (
          <>
            {/* 3 Summary Columns */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <SummaryColumn
                icon={Shield}
                iconColor="text-red-600"
                bgColor="bg-red-50 dark:bg-red-950/30"
                count={summary.risks.total}
                label="Riscos Estratégicos"
                sublabel={summary.risks.sublabel}
                highlight={summary.risks.topItem}
              />
              <SummaryColumn
                icon={AlertTriangle}
                iconColor="text-amber-600"
                bgColor="bg-amber-50 dark:bg-amber-950/30"
                count={summary.threats.total}
                label="Ameaças Operacionais"
                sublabel={summary.threats.sublabel}
                highlight={summary.threats.topItem}
              />
              <SummaryColumn
                icon={Lightbulb}
                iconColor="text-blue-600"
                bgColor="bg-blue-50 dark:bg-blue-950/30"
                count={summary.opportunities.total}
                label="Oportunidades"
                sublabel={summary.opportunities.sublabel}
                highlight={summary.opportunities.topItem}
              />
            </div>

            {/* Footer with CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-1.5 h-8 text-xs px-3"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                Atualizar
              </Button>
              <Button
                onClick={() => navigate('/copiloto-governanca')}
                className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Ver Análise Completa
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
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
