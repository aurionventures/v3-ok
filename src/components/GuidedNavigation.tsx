import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  X,
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  Shield,
  Activity,
  AlertCircle,
  ChevronRight,
  Map,
  FileText,
  Calendar,
  TrendingUp,
  PieChart,
  GraduationCap,
  Settings,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";

interface GuidedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  BarChart3: <Activity className="h-4 w-4" />,
  Leaf: <Leaf className="h-4 w-4" />,
  AlertTriangle: <AlertCircle className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  PieChart: <PieChart className="h-4 w-4" />,
};

const GuidedNavigation = ({ isOpen, onClose }: GuidedNavigationProps) => {
  const { modules, overallPercentage } = useGovernanceProgress();
  const location = useLocation();

  const getNextPriorityModule = () => {
    const urgentIncomplete = modules
      .filter((m) => !m.isCompleted && m.urgency === "high")
      .sort((a, b) => a.completionPercentage - b.completionPercentage)[0];
    if (urgentIncomplete) return urgentIncomplete;
    const incompleteModules = modules
      .filter((m) => !m.isCompleted)
      .sort((a, b) => a.completionPercentage - b.completionPercentage);
    return incompleteModules[0];
  };

  const nextModule = getNextPriorityModule();

  const phases = [
    {
      id: "foundation",
      name: "Fundação",
      modules: ["family-structure", "documents", "cap-table"],
    },
    {
      id: "structure",
      name: "Estruturação",
      modules: ["councils", "rituals", "succession"],
    },
    {
      id: "development",
      name: "Desenvolvimento",
      modules: ["people-development", "subsystems"],
    },
    {
      id: "monitoring",
      name: "Monitoramento",
      modules: ["systemic-risks", "esg"],
    },
  ];

  const getModuleHref = (moduleId: string) => {
    const moduleRoutes: Record<string, string> = {
      "family-structure": "/family-structure",
      documents: "/documents",
      "cap-table": "/cap-table",
      councils: "/councils",
      rituals: "/rituals",
      succession: "/succession",
      "people-development": "/people-development",
      subsystems: "/subsystems",
      "systemic-risks": "/systemic-risks",
      esg: "/esg",
    };
    return moduleRoutes[moduleId] || "/dashboard";
  };

  const handleNavClick = (href: string) => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - click to close */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-[320px] sm:w-[360px] bg-card border-l shadow-xl z-50",
          "flex flex-col animate-in slide-in-from-right duration-300"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Guia da Plataforma</h2>
              <p className="text-xs text-muted-foreground">
                {overallPercentage}% completo
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={overallPercentage} className="h-2" />
          </div>

          {/* Next step CTA */}
          {nextModule && (
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Próximo passo
                </span>
              </div>
              <p className="font-medium text-sm">{nextModule.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {nextModule.nextActions[0]}
              </p>
              <Link to={getModuleHref(nextModule.id)}>
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => handleNavClick(getModuleHref(nextModule!.id))}
                >
                  Ir para módulo
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Navigation menu by phase */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jornada por módulos
            </h3>
            <ul className="space-y-1">
              {phases.map((phase) => (
                <li key={phase.id}>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    {phase.name}
                  </div>
                  <ul className="space-y-0.5">
                    {modules
                      .filter((m) => phase.modules.includes(m.id))
                      .map((module) => {
                        const href = getModuleHref(module.id);
                        const isActive = location.pathname === href;
                        const Icon = ICON_MAP[module.icon] ?? <Activity className="h-4 w-4" />;
                        return (
                          <li key={module.id}>
                            <Link
                              to={href}
                              onClick={() => handleNavClick(href)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                "hover:bg-muted/70",
                                isActive && "bg-primary/10 text-primary font-medium"
                              )}
                            >
                              {module.isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                              ) : (
                                <span className="text-muted-foreground shrink-0">
                                  {Icon}
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-sm block truncate">
                                  {module.name}
                                </span>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links - outros módulos úteis */}
          <div className="pt-2 border-t">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Outros
            </h3>
            <div className="space-y-0.5">
              {["maturity", "ai-config", "settings"]
                .map((id) => modules.find((m) => m.id === id))
                .filter(Boolean)
                .map((module) => {
                  const href = module!.id === "maturity"
                    ? "/maturidade-governanca"
                    : module!.id === "ai-config"
                      ? "/ai-config"
                      : "/settings";
                  const isActive = location.pathname === href;
                  const Icon = ICON_MAP[module!.icon] ?? <Settings className="h-4 w-4" />;
                  return (
                    <Link
                      key={module!.id}
                      to={href}
                      onClick={() => handleNavClick(href)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        "hover:bg-muted/70",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      {module!.isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <span className="text-muted-foreground shrink-0">{Icon}</span>
                      )}
                      <span className="text-sm flex-1">{module!.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default GuidedNavigation;
