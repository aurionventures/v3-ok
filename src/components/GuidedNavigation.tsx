import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  X,
  CheckCircle,
  Users,
  Shield,
  Activity,
  ChevronRight,
  Map,
  FileText,
  Calendar,
  PieChart,
  Bot,
  ClipboardList,
  Mic,
  Gift,
  Target,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import { companyMenuPhases } from "@/config/companyMenu";
import { AddonModuleModal } from "@/components/AddonModuleModal";
import { useState } from "react";

interface GuidedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEM_ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <Activity className="h-4 w-4" />,
  copiloto: <Bot className="h-4 w-4" />,
  "family-structure": <Users className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  "cap-table": <PieChart className="h-4 w-4" />,
  maturity: <Activity className="h-4 w-4" />,
  entrevistas: <Mic className="h-4 w-4" />,
  councils: <Shield className="h-4 w-4" />,
  "analise-acoes": <Activity className="h-4 w-4" />,
  agenda: <Calendar className="h-4 w-4" />,
  secretariado: <ClipboardList className="h-4 w-4" />,
  planos: <Gift className="h-4 w-4" />,
};

const PHASE_ICON_MAP: Record<string, React.ReactNode> = {
  "Início": <Target className="h-4 w-4" />,
  "Parametrização": <Users className="h-4 w-4" />,
  "Estruturação": <Shield className="h-4 w-4" />,
  "Add-ons": <Gift className="h-4 w-4" />,
};

const GuidedNavigation = ({ isOpen, onClose }: GuidedNavigationProps) => {
  const { modules, overallPercentage } = useGovernanceProgress();
  const location = useLocation();
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [addonModuleName, setAddonModuleName] = useState<string | null>(null);

  const getItemIcon = (item: { href: string; moduleId: string | null }) => {
    if (item.href === "/dashboard") return ITEM_ICON_MAP.dashboard;
    if (item.href === "/copiloto-governanca") return ITEM_ICON_MAP.copiloto;
    if (item.moduleId) return ITEM_ICON_MAP[item.moduleId] ?? <Activity className="h-4 w-4" />;
    if (item.href === "/analise-acoes") return ITEM_ICON_MAP["analise-acoes"];
    if (item.href === "/agenda") return ITEM_ICON_MAP.agenda;
    if (item.href === "/secretariado") return ITEM_ICON_MAP.secretariado;
    return ITEM_ICON_MAP.planos;
  };

  const isModuleCompleted = (moduleId: string | null) =>
    moduleId ? modules.some((m) => m.id === moduleId && m.isCompleted) : false;

  const handleNavClick = () => {
    onClose();
  };

  const handleLockedClick = (name: string) => {
    setAddonModuleName(name);
    setAddonModalOpen(true);
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

          {/* Navigation menu - mesma estrutura do Sidebar */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jornada por módulos
            </h3>
            <ul className="space-y-3">
              {companyMenuPhases.map((menuPhase) => (
                <li key={menuPhase.phase}>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-2 py-1.5">
                    {PHASE_ICON_MAP[menuPhase.phase]}
                    {menuPhase.phase}
                  </div>
                  <ul className="space-y-0.5">
                    {menuPhase.items.map((item) => {
                      const isActive = location.pathname === item.href && !item.locked;
                      const Icon = getItemIcon(item);
                      const completed = isModuleCompleted(item.moduleId);

                      if (item.locked) {
                        return (
                          <li key={`${item.href}-${item.name}`}>
                            <button
                              type="button"
                              onClick={() => handleLockedClick(item.name)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors",
                                "hover:bg-muted/70 text-muted-foreground"
                              )}
                            >
                              <span className="shrink-0">{Icon}</span>
                              <span className="text-sm flex-1 truncate">{item.name}</span>
                              <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </button>
                          </li>
                        );
                      }

                      return (
                        <li key={`${item.href}-${item.name}`}>
                          <Link
                            to={item.href}
                            onClick={handleNavClick}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                              "hover:bg-muted/70",
                              isActive && "bg-primary/10 text-primary font-medium"
                            )}
                          >
                            {completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <span className="text-muted-foreground shrink-0">{Icon}</span>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm block truncate">{item.name}</span>
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
        </div>
      </aside>
      <AddonModuleModal
        open={addonModalOpen}
        onOpenChange={setAddonModalOpen}
        moduleName={addonModuleName}
      />
    </>
  );
};

export default GuidedNavigation;
