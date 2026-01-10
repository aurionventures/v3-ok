import { useState } from "react";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw,
  ChevronRight
} from "lucide-react";

// Mock data for governance insights
const mockGovernanceInsights = {
  strategicRisks: [
    {
      title: "Vulnerabilidade na Sucessão",
      context: "Plano de sucessão não atualizado há 18 meses. CEO completará 65 anos em 2027.",
      priority: "critical" as const,
      actions: {
        primary: "Revisar e atualizar plano de sucessão",
        secondary: "Mapear potenciais sucessores internos e externos"
      }
    },
    {
      title: "Exposição a Riscos ESG",
      context: "Índice de conformidade ESG abaixo da média do setor em 15 pontos percentuais.",
      priority: "high" as const,
      actions: {
        primary: "Implementar programa ESG estruturado",
        secondary: "Contratar consultoria especializada"
      }
    }
  ],
  operationalThreats: [
    {
      title: "Pressão Regulatória ESG",
      context: "Novas regulamentações de divulgação ESG entram em vigor em 6 meses.",
      timeframe: "30_days" as const,
      category: "Regulatório",
      actions: {
        primary: "Atualizar políticas de compliance",
        secondary: "Treinar equipe jurídica"
      }
    },
    {
      title: "Concentração de Fornecedores",
      context: "70% do suprimento crítico vem de 2 fornecedores.",
      timeframe: "immediate" as const,
      category: "Operacional",
      actions: {
        primary: "Diversificar base de fornecedores",
        secondary: "Negociar contratos de longo prazo"
      }
    }
  ],
  strategicOpportunities: [
    {
      title: "Cultura de Compliance Fortalecida",
      context: "Implementação de programa de integridade aumentou engajamento em 40%.",
      actions: {
        primary: "Expandir programa para subsidiárias",
        secondary: "Certificar ISO 37001"
      }
    },
    {
      title: "Transformação Digital",
      context: "Oportunidade de digitalização de processos de governança.",
      actions: {
        primary: "Implementar plataforma digital de governança",
        secondary: "Automatizar relatórios de compliance"
      }
    }
  ]
};

interface RiskCardProps {
  title: string;
  context: string;
  priority?: "critical" | "high" | "medium";
  timeframe?: "immediate" | "30_days" | "90_days";
  category?: string;
  actions: { primary: string; secondary: string };
  variant: "risk" | "threat" | "opportunity";
}

function RiskCard({ title, context, priority, timeframe, category, actions, variant }: RiskCardProps) {
  const priorityLabels = {
    critical: "Crítico",
    high: "Alto",
    medium: "Médio"
  };

  const timeframeLabels = {
    immediate: "Imediato",
    "30_days": "30 dias",
    "90_days": "90 dias"
  };

  const variantStyles = {
    risk: {
      border: "border-l-red-500",
      badge: priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
    },
    threat: {
      border: "border-l-yellow-500",
      badge: timeframe === "immediate" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
    },
    opportunity: {
      border: "border-l-blue-500",
      badge: "bg-blue-100 text-blue-700"
    }
  };

  return (
    <Card className={`border-l-4 ${variantStyles[variant].border}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight">{title}</h4>
          <Badge className={`text-xs flex-shrink-0 ${variantStyles[variant].badge}`}>
            {variant === "risk" && priority && priorityLabels[priority]}
            {variant === "threat" && timeframe && timeframeLabels[timeframe]}
            {variant === "opportunity" && "Estratégica"}
          </Badge>
        </div>
        
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
        
        <p className="text-xs text-muted-foreground">{context}</p>
        
        <div className="space-y-1.5 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground">Ações Recomendadas:</p>
          <div className="flex items-start gap-1.5">
            <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-xs">{actions.primary}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{actions.secondary}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const MemberRiscos = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <MemberLayout 
      title="Gestão de Riscos"
      subtitle="Visão geral dos riscos, ameaças e oportunidades da governança"
    >
      <div className="space-y-6">
        {/* Header with refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Painel de Inteligência</h3>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategic Risks Column */}
          <div className="space-y-4">
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <span>Riscos Estratégicos</span>
                  <Badge variant="destructive" className="ml-auto">
                    {mockGovernanceInsights.strategicRisks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-3 pr-4">
                {mockGovernanceInsights.strategicRisks.map((risk, i) => (
                  <RiskCard
                    key={i}
                    variant="risk"
                    title={risk.title}
                    context={risk.context}
                    priority={risk.priority}
                    actions={risk.actions}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Operational Threats Column */}
          <div className="space-y-4">
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span>Ameaças Operacionais</span>
                  <Badge className="ml-auto bg-yellow-500">
                    {mockGovernanceInsights.operationalThreats.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-3 pr-4">
                {mockGovernanceInsights.operationalThreats.map((threat, i) => (
                  <RiskCard
                    key={i}
                    variant="threat"
                    title={threat.title}
                    context={threat.context}
                    timeframe={threat.timeframe}
                    category={threat.category}
                    actions={threat.actions}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Strategic Opportunities Column */}
          <div className="space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Oportunidades Estratégicas</span>
                  <Badge className="ml-auto bg-blue-500">
                    {mockGovernanceInsights.strategicOpportunities.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-3 pr-4">
                {mockGovernanceInsights.strategicOpportunities.map((opp, i) => (
                  <RiskCard
                    key={i}
                    variant="opportunity"
                    title={opp.title}
                    context={opp.context}
                    actions={opp.actions}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberRiscos;
