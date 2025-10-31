import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  X, ArrowRight, Target, Users, Shield, Activity, 
  AlertCircle, ChevronDown, ChevronUp, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GuidedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedNavigation = ({ isOpen, onClose }: GuidedNavigationProps) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("foundation");

  const phases = [
    {
      id: "preparation",
      name: "Preparação",
      description: "Configure a base para sua jornada de governança",
      icon: <Target className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      modules: [
        { id: "onboarding", name: "Onboarding", href: "/onboarding" },
        { id: "document-checklist", name: "Checklist de Documentos", href: "/document-checklist" },
        { id: "interviews", name: "Entrevistas", href: "/interviews" },
        { id: "initial-report", name: "Relatório Inicial", href: "/initial-report" },
      ],
      aiAgent: "Onboarding Guide"
    },
    {
      id: "foundation",
      name: "Fundação",
      description: "Configure os elementos básicos da sua governança",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      modules: [
        { id: "shareholder-structure", name: "Estrutura Acionária", href: "/shareholder-structure" },
        { id: "documents", name: "Documentos", href: "/documents" },
        { id: "cap-table", name: "Cap Table", href: "/cap-table" },
        { id: "maturity", name: "Maturidade", href: "/maturity" },
      ],
      aiAgent: "Document Analyst"
    },
    {
      id: "structure",
      name: "Estruturação",
      description: "Estabeleça conselhos e processos sucessórios",
      icon: <Shield className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      modules: [
        { id: "councils", name: "Conselhos", href: "/councils" },
        { id: "rituals", name: "Rituais", href: "/rituals" },
        { id: "succession", name: "Sucessão", href: "/succession" },
        { id: "submit-projects", name: "Submeter Projetos", href: "/submit-projects" },
      ],
      aiAgent: "Governance Architect"
    },
    {
      id: "development",
      name: "Desenvolvimento",
      description: "Desenvolva pessoas e preserve o legado",
      icon: <Activity className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      modules: [
        { id: "people-development", name: "Desenvolvimento de Pessoas", href: "/people-development" },
        { id: "subsystems", name: "Subsistemas", href: "/subsystems" },
        { id: "legacy", name: "Legado", href: "/legacy" },
      ],
      aiAgent: "People & Legacy Mentor"
    },
    {
      id: "monitoring",
      name: "Monitoramento",
      description: "Gerencie riscos, sustentabilidade e atividades",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      modules: [
        { id: "governance-risks", name: "Gestão de Riscos", href: "/governance-risk-management" },
        { id: "esg", name: "ESG", href: "/esg" },
        { id: "activities", name: "Atividades", href: "/monitoring" },
      ],
      aiAgent: "Strategic Intelligence"
    }
  ];

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
                  Explore os módulos organizados por fase
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Phases */}
          <div className="space-y-3">            
            {phases.map((phase) => {
              const isExpanded = expandedPhase === phase.id;
              
              return (
                <Card key={phase.id} className="transition-all duration-200">
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
                          <h4 className="font-medium">{phase.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {phase.description}
                          </p>
                          <p className="text-xs text-muted-foreground/80 mt-1">
                            Agente recomendado: {phase.aiAgent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                        {phase.modules.map((module) => (
                          <Link
                            key={module.id}
                            to={module.href}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{module.name}</span>
                            </div>
                            <ArrowRight className="h-4 w-4" />
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
