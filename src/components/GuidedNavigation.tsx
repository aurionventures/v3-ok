import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  X, ArrowRight, CheckCircle, Target, Users, Shield, Activity, 
  AlertCircle, Zap, ChevronDown, ChevronUp, Map, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";

interface GuidedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedNavigation = ({ isOpen, onClose }: GuidedNavigationProps) => {
  const { modules, overallPercentage, nextRecommendations } = useGovernanceProgress();
  const [expandedPhase, setExpandedPhase] = useState<string | null>("foundation");

  // Get next priority module
  const getNextPriorityModule = () => {
    const urgentIncomplete = modules
      .filter(m => !m.isCompleted && m.urgency === 'high')
      .sort((a, b) => a.completionPercentage - b.completionPercentage)[0];
    
    if (urgentIncomplete) return urgentIncomplete;
    
    const incompleteModules = modules
      .filter(m => !m.isCompleted)
      .sort((a, b) => a.completionPercentage - b.completionPercentage);
    
    return incompleteModules[0];
  };

  const nextModule = getNextPriorityModule();

  const phases = [
    {
      id: "preparation",
      name: "Preparação",
      description: "Configure a base para sua jornada de governança",
      icon: <Target className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      modules: ["onboarding", "document-checklist", "document-upload", "interviews", "initial-report"],
      priority: overallPercentage < 20,
      aiAgent: "Onboarding Guide"
    },
    {
      id: "foundation",
      name: "Fundação",
      description: "Configure os elementos básicos da sua governança",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      modules: ["shareholder-structure", "documents", "cap-table", "maturity"],
      priority: overallPercentage >= 20 && overallPercentage < 40,
      aiAgent: "Document Analyst"
    },
    {
      id: "structure",
      name: "Estruturação",
      description: "Estabeleça conselhos e processos sucessórios",
      icon: <Shield className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      modules: ["councils", "rituals", "succession", "submit-projects"],
      priority: overallPercentage >= 40 && overallPercentage < 60,
      aiAgent: "Governance Architect"
    },
    {
      id: "development",
      name: "Desenvolvimento",
      description: "Desenvolva pessoas e preserve o legado",
      icon: <Activity className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      modules: ["people-development", "subsystems", "legacy"],
      priority: overallPercentage >= 60 && overallPercentage < 80,
      aiAgent: "People & Legacy Mentor"
    },
    {
      id: "monitoring",
      name: "Monitoramento",
      description: "Gerencie riscos, sustentabilidade e atividades",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      modules: ["ibgc-risk-management", "esg", "activities"],
      priority: overallPercentage >= 80,
      aiAgent: "Strategic Intelligence"
    }
  ];

  const getPhaseProgress = (phaseModules: string[]) => {
    const phaseModuleData = modules.filter(m => phaseModules.includes(m.id));
    const totalWeight = phaseModuleData.reduce((sum, m) => sum + m.weight, 0);
    const weightedProgress = phaseModuleData.reduce(
      (sum, m) => sum + (m.completionPercentage * m.weight) / 100,
      0
    );
    return totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0;
  };

  const getModuleHref = (moduleId: string) => {
    const moduleRoutes: Record<string, string> = {
      // PREPARAÇÃO
      "onboarding": "/onboarding",
      "document-checklist": "/document-checklist",
      "document-upload": "/document-upload",
      "interviews": "/interviews",
      "initial-report": "/initial-report",
      // FUNDAÇÃO
      "shareholder-structure": "/shareholder-structure",
      "documents": "/documents",
      "cap-table": "/cap-table",
      "maturity": "/maturity",
      // ESTRUTURAÇÃO
      "councils": "/councils",
      "rituals": "/rituals",
      "succession": "/succession",
      "submit-projects": "/submit-projects",
      // DESENVOLVIMENTO
      "people-development": "/people-development",
      "subsystems": "/subsystems",
      "legacy": "/legacy",
      // MONITORAMENTO
      "ibgc-risk-management": "/ibgc-risk-management",
      "esg": "/esg",
      "activities": "/monitoring",
      // CONFIGURAÇÃO
      "ai-config": "/ai-config",
      "settings": "/settings"
    };
    return moduleRoutes[moduleId] || "/dashboard";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Navegação Guiada</CardTitle>
                <CardDescription>
                  Sua governança está {overallPercentage}% completa
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Next Step Card */}
          {nextModule && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Próximo Passo Recomendado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{nextModule.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {nextModule.nextActions[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={nextModule.urgency === 'high' ? 'destructive' : 'secondary'}>
                        {nextModule.urgency === 'high' ? 'Urgente' : 'Recomendado'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {nextModule.completionPercentage}% completo
                      </span>
                    </div>
                  </div>
                  <Link to={getModuleHref(nextModule.id)}>
                    <Button onClick={onClose}>
                      Ir para módulo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phases */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Jornada por Fases
            </h3>
            
            {phases.map((phase) => {
              const phaseProgress = getPhaseProgress(phase.modules);
              const phaseModuleData = modules.filter(m => phase.modules.includes(m.id));
              const isExpanded = expandedPhase === phase.id;
              
              return (
                <Card key={phase.id} className={cn(
                  "transition-all duration-200",
                  phase.priority && "ring-2 ring-primary/20"
                )}>
                  <CardHeader 
                    className="pb-3 cursor-pointer"
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", phase.bgColor)}>
                          <span className={phase.color}>{phase.icon}</span>
                        </div>
                           <div>
                             <div className="flex items-center gap-2">
                               <h4 className="font-medium">{phase.name}</h4>
                               {phase.priority && (
                                 <Badge variant="outline" className="text-xs">
                                   Foco atual
                                 </Badge>
                               )}
                             </div>
                             <p className="text-sm text-muted-foreground">
                               {phase.description}
                             </p>
                             <p className="text-xs text-muted-foreground/80 mt-1">
                               Agente recomendado: {phase.aiAgent}
                             </p>
                           </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{phaseProgress}%</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {phaseModuleData.map((module) => (
                          <Link
                            key={module.id}
                            to={getModuleHref(module.id)}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {module.isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
                              )}
                              <div>
                                <span className="font-medium text-sm">{module.name}</span>
                                <p className="text-xs text-muted-foreground">
                                  {module.nextActions[0] || 'Módulo completo'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {module.completionPercentage}%
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedNavigation;