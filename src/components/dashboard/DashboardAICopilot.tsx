import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, RefreshCw, Shield, AlertTriangle, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePredictiveInsights, GovernanceInsights } from "@/hooks/usePredictiveInsights";
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

// Demo data for initial display
const demoInsights: GovernanceInsights = {
  strategicRisks: [
    {
      title: "Vulnerabilidade na Sucessão Executiva",
      priority: "critical",
      context: "Concentração de conhecimento crítico em poucos profissionais",
      actions: {
        primary: "Revisar plano de sucessão",
        secondary: "Mapear candidatos internos"
      }
    },
    {
      title: "Concentração de Decisões Estratégicas",
      priority: "high",
      context: "Dependência excessiva de poucos tomadores de decisão",
      actions: {
        primary: "Descentralizar decisões",
        secondary: "Criar comitês delegados"
      }
    }
  ],
  operationalThreats: [
    {
      title: "Pressão Regulatória ESG",
      timeframe: "30_days",
      category: "Regulatório",
      context: "Novas exigências de compliance ambiental",
      actions: {
        primary: "Atualizar políticas ESG",
        secondary: "Treinar equipe de compliance"
      }
    },
    {
      title: "Pendências Acumuladas",
      timeframe: "immediate",
      category: "Operacional",
      context: "Backlog crescente de tarefas críticas",
      actions: {
        primary: "Priorizar pendências críticas",
        secondary: "Delegar tarefas pendentes"
      }
    }
  ],
  strategicOpportunities: [
    {
      title: "Fortalecimento da Cultura de Compliance",
      context: "Oportunidade de consolidar práticas de governança",
      actions: {
        primary: "Implementar programa",
        secondary: "Medir resultados trimestrais"
      }
    },
    {
      title: "Certificação B Corp",
      context: "Diferencial competitivo no mercado",
      actions: {
        primary: "Avaliar requisitos",
        secondary: "Iniciar processo de certificação"
      }
    }
  ]
};

// Summary Column Component
function SummaryColumn({
  icon: Icon,
  iconColor,
  bgColor,
  count,
  label,
  sublabel,
  highlight,
  actions,
  onClick,
}: {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  count: number;
  label: string;
  sublabel: string;
  highlight?: string;
  actions?: { primary: string; secondary: string };
  onClick?: () => void;
}) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-start p-4 rounded-xl cursor-pointer transition-all hover:ring-2 hover:ring-primary/30 hover:shadow-md",
        bgColor
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-6 w-6", iconColor)} />
        <span className={cn("text-3xl font-bold", iconColor)}>{count}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-center">{label}</span>
      <p className="text-xs text-muted-foreground mt-0.5 text-center">{sublabel}</p>
      {highlight && (
        <div className="mt-3 pt-2 border-t border-current/10 w-full flex-1">
          <p className="text-xs text-foreground font-medium text-center line-clamp-2 mb-2">
            {highlight}
          </p>
          {actions && (
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="line-clamp-1">{actions.primary}</span>
              </p>
              <p className="text-[10px] text-muted-foreground/70 flex items-center justify-center gap-1">
                <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="line-clamp-1">{actions.secondary}</span>
              </p>
            </div>
          )}
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
          <div className="mt-3 pt-2 border-t border-muted/30 w-full space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-3/4 mx-auto" />
            <Skeleton className="h-2 w-3/4 mx-auto" />
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
  
  // Track if user has manually refreshed
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const handleRefresh = () => {
    setHasRefreshed(true);
    fetchInsights({
      risks,
      maturityScore,
      esgScore,
      pendingTasks,
      overduesTasks,
      criticalRisks,
    });
  };

  // Use demo data initially, switch to real data after refresh
  const displayInsights = useMemo(() => {
    if (hasRefreshed && governanceInsights) {
      return governanceInsights;
    }
    return demoInsights;
  }, [hasRefreshed, governanceInsights]);

  // Calculate summary data
  const summary = useMemo(() => {
    const risksList = displayInsights.strategicRisks;
    const threatsList = displayInsights.operationalThreats;
    const opportunitiesList = displayInsights.strategicOpportunities;

    const criticalCount = risksList.filter(r => r.priority === 'critical').length;
    const highCount = risksList.filter(r => r.priority === 'high').length;
    const immediateCount = threatsList.filter(t => t.timeframe === 'immediate').length;
    const shortTermCount = threatsList.filter(t => t.timeframe === '30_days').length;

    const topRisk = risksList[0];
    const topThreat = threatsList[0];
    const topOpportunity = opportunitiesList[0];

    return {
      risks: {
        total: risksList.length,
        sublabel: criticalCount > 0 || highCount > 0 
          ? `${criticalCount > 0 ? `${criticalCount} crítico` : ''}${criticalCount > 0 && highCount > 0 ? ' • ' : ''}${highCount > 0 ? `${highCount} alto` : ''}`
          : 'Nenhum identificado',
        topItem: topRisk?.title,
        actions: topRisk?.actions,
      },
      threats: {
        total: threatsList.length,
        sublabel: immediateCount > 0 || shortTermCount > 0
          ? `${immediateCount > 0 ? `${immediateCount} imediato` : ''}${immediateCount > 0 && shortTermCount > 0 ? ' • ' : ''}${shortTermCount > 0 ? `${shortTermCount} em 30d` : ''}`
          : 'Nenhuma identificada',
        topItem: topThreat?.title,
        actions: topThreat?.actions,
      },
      opportunities: {
        total: opportunitiesList.length,
        sublabel: 'Identificadas pela IA',
        topItem: topOpportunity?.title,
        actions: topOpportunity?.actions,
      },
    };
  }, [displayInsights]);

  // Navigation handlers for each section
  const handleNavigateToRisks = () => navigate('/copiloto-governanca?tab=analysis&section=risks');
  const handleNavigateToThreats = () => navigate('/copiloto-governanca?tab=analysis&section=threats');
  const handleNavigateToOpportunities = () => navigate('/copiloto-governanca?tab=analysis&section=opportunities');

  // Determine the display time
  const displayTime = hasRefreshed && lastUpdated 
    ? lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

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
          
          {/* Timestamp + Refresh button together */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
              {hasRefreshed ? 'Atualizado às' : 'Dados demo •'} {displayTime}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1.5 h-7 text-xs px-2"
            >
              <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              Atualizar
            </Button>
          </div>
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
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <SummaryColumn
              icon={Shield}
              iconColor="text-red-600"
              bgColor="bg-red-50 dark:bg-red-950/30"
              count={summary.risks.total}
              label="Riscos Estratégicos"
              sublabel={summary.risks.sublabel}
              highlight={summary.risks.topItem}
              actions={summary.risks.actions}
              onClick={handleNavigateToRisks}
            />
            <SummaryColumn
              icon={AlertTriangle}
              iconColor="text-amber-600"
              bgColor="bg-amber-50 dark:bg-amber-950/30"
              count={summary.threats.total}
              label="Ameaças Operacionais"
              sublabel={summary.threats.sublabel}
              highlight={summary.threats.topItem}
              actions={summary.threats.actions}
              onClick={handleNavigateToThreats}
            />
            <SummaryColumn
              icon={Lightbulb}
              iconColor="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-950/30"
              count={summary.opportunities.total}
              label="Oportunidades"
              sublabel={summary.opportunities.sublabel}
              highlight={summary.opportunities.topItem}
              actions={summary.opportunities.actions}
              onClick={handleNavigateToOpportunities}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
