
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ActivitySquare, 
  BarChart3, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Leaf, 
  Network, 
  Settings, 
  Shield, 
  Users, 
  Database, 
  BookOpen, 
  BookText, 
  Layers, 
  Activity, 
  Building, 
  Bot, 
  DollarSign, 
  PieChart,
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap, 
  Target, 
  Map, 
  Play, 
  Award, 
  Building2, 
  User, 
  Send, 
  FolderOpen,
  TrendingUp
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import GuidedNavigation from "@/components/GuidedNavigation";

const Sidebar = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);
  const [showGuidedNav, setShowGuidedNav] = useState(false);
  
  const isAdminRoute = pathname.startsWith("/admin");
  
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setOpen(!open);
  };
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile]);
  
  // Admin menu items
  const adminMenuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      name: "Dashboard"
    },
    {
      icon: <Building className="h-5 w-5" />,
      href: "/admin/companies",
      name: "Empresas"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      href: "/admin/finances",
      name: "Finanças"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      name: "Configurações"
    }
  ];
  
  const { modules } = useGovernanceProgress();
  
  // Get module progress by ID
  const getModuleProgress = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };

  // Get status badge for menu item
  const getStatusBadge = (moduleId: string) => {
    const module = getModuleProgress(moduleId);
    if (!module) return null;

    if (module.isCompleted) {
      return <CheckCircle className="h-3 w-3 text-green-400" />;
    } else if (module.completionPercentage >= 70) {
      return <Clock className="h-3 w-3 text-yellow-400" />;
    } else if (module.urgency === 'high') {
      return <AlertCircle className="h-3 w-3 text-red-400" />;
    }
    return null;
  };

  // Company menu items organized by phases
  const menuPhases = [
    {
      phase: "Início",
      icon: <Target className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <Play className="h-5 w-5" />,
          href: "/start",
          name: "Comece Aqui",
          moduleId: null,
          priority: true
        },
        {
          icon: <LayoutDashboard className="h-5 w-5" />,
          href: "/dashboard",
          name: "Dashboard",
          moduleId: null
        },
        {
          icon: <Bot className="h-5 w-5" />,
          href: "/ai-agents",
          name: "Agentes de IA",
          moduleId: "ai-config"
        },
      ]
    },
    {
      phase: "PARAMETRIZAÇÃO",
      icon: <Zap className="h-4 w-4" />,
      color: "text-green-400",
      items: [
        {
          icon: <Users className="h-5 w-5" />,
          href: "/shareholder-structure",
          name: "Estrutura Societária",
          moduleId: "shareholder-structure",
          priority: true
        },
        {
          icon: <PieChart className="h-5 w-5" />,
          href: "/cap-table",
          name: "Cap Table",
          moduleId: "cap-table"
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/data-input",
          name: "Maturidade IBGC",
          moduleId: "maturity",
          priority: true
        },
        {
          icon: <Leaf className="h-5 w-5" />,
          href: "/dados-esg",
          name: "Maturidade ESG",
          moduleId: "esg"
        },
        {
          icon: <BookText className="h-5 w-5" />,
          href: "/legacy",
          name: "Legado",
          moduleId: null
        }
      ]
    },
    {
      phase: "Preparação",
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <FileText className="h-5 w-5" />,
          href: "/document-checklist",
          name: "Checklist",
          moduleId: "document-checklist",
          priority: true
        },
        {
          icon: <FolderOpen className="h-5 w-5" />,
          href: "/documents",
          name: "Biblioteca",
          moduleId: "documents"
        },
        {
          icon: <ActivitySquare className="h-5 w-5" />,
          href: "/interviews",
          name: "Entrevistas",
          moduleId: "interviews"
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/initial-report",
          name: "Relatório Inicial",
          moduleId: "initial-report"
        }
      ]
    },
    {
      phase: "Estruturação",
      icon: <Shield className="h-4 w-4" />,
      color: "text-purple-400",
      items: [
        {
          icon: <Calendar className="h-5 w-5" />,
          href: "/annual-agenda",
          name: "Agenda Anual",
          moduleId: "annual-agenda",
          priority: true
        },
        {
          icon: <Shield className="h-5 w-5" />,
          href: "/councils",
          name: "Conselhos",
          moduleId: "councils"
        },
        {
          icon: <Send className="h-5 w-5" />,
          href: "/submit-projects",
          name: "Submeter Projetos",
          moduleId: "submit-projects"
        },
        {
          icon: <Calendar className="h-5 w-5" />,
          href: "/rituals",
          name: "Rituais",
          moduleId: "rituals"
        }
      ]
    },
    {
      phase: "GESTÃO DE PESSOAS",
      icon: <Users className="h-4 w-4" />,
      color: "text-orange-400",
      items: [
        {
          icon: <Users className="h-5 w-5" />,
          href: "/people-management",
          name: "Desenvolvimento e PDI",
          moduleId: "people-management",
          priority: true
        }
      ]
    },
    {
      phase: "Monitoramento",
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-400",
      items: [
        {
          icon: <Shield className="h-5 w-5" />,
          href: "/ibgc-risk-management",
          name: "Riscos",
          moduleId: "ibgc-risks"
        },
        {
          icon: <Leaf className="h-5 w-5" />,
          href: "/esg",
          name: "ESG",
          moduleId: "esg"
        },
        {
          icon: <ActivitySquare className="h-5 w-5" />,
          href: "/activities",
          name: "Atividades",
          moduleId: null
        }
      ]
    },
  ];

  // Choose which menu items to display based on the route
  const menuData = isAdminRoute ? adminMenuItems : menuPhases;

  return (
    <aside className={cn("bg-legacy-500 h-screen border-r border-legacy-600 transition-all duration-300 ease-in-out z-10 relative", 
      open ? "flex flex-col w-64 sm:w-64 md:w-72 max-w-full" : "w-16 flex flex-col"
    )}>
      <div className="overflow-hidden p-4 border-b border-legacy-600 bg-legacy-500 text-white">
        <div className="flex items-center justify-between">
          <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          {!isAdminRoute && open && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuidedNav(true)}
              className="text-white hover:bg-legacy-600 p-1"
              title="Navegação Guiada"
            >
              <Map className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-1 scrollbar-thin max-h-[calc(100vh-8rem)]">
        <div className="px-3 py-1">
          {isAdminRoute ? (
            // Admin menu (simple list)
            <div className="space-y-1">
              {adminMenuItems.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={cn(
                    "flex items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors", 
                    pathname === item.href || (item.href === "/admin/companies" && pathname.startsWith("/admin/companies"))
                      ? "bg-legacy-600 text-white" 
                      : "text-white hover:bg-legacy-600"
                  )} 
                  title={!open ? item.name : undefined}
                >
                  {item.icon}
                  {open && <span className="ml-2">{item.name}</span>}
                </Link>
              ))}
            </div>
          ) : (
            // Company menu (organized by phases)
            <div className="space-y-2">
              {menuPhases.map((phase, phaseIndex) => (
                <div key={phase.phase}>
                  {open && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 mb-1">
                      <span className={cn("flex items-center gap-1 text-xs font-medium uppercase tracking-wider", phase.color)}>
                        <div className="h-3 w-3 flex items-center justify-center">
                          {phase.icon}
                        </div>
                        {phase.phase}
                      </span>
                      <div className="flex-1 h-px bg-white/20" />
                    </div>
                  )}
                  
                  <div className="space-y-0.5">
                    {phase.items.map(item => {
                      const isActive = pathname === item.href;
                      const statusBadge = getStatusBadge(item.moduleId);
                      const module = getModuleProgress(item.moduleId);
                      
                      return (
                        <Link 
                          key={item.href} 
                          to={item.href} 
                          className={cn(
                            "flex items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors group relative", 
                            isActive
                              ? "bg-legacy-600 text-white" 
                              : "text-white hover:bg-legacy-600"
                          )} 
                          title={!open ? item.name : undefined}
                        >
                          <div className="flex items-center gap-1.5 flex-1">
                            <div className="h-4 w-4 flex items-center justify-center">
                              {item.icon}
                            </div>
                            {open && (
                              <>
                                <span className="flex-1 text-xs">{item.name}</span>
                                <div className="flex items-center gap-1">
                                  {item.priority && !isActive && (
                                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 text-xs px-1 py-0">
                                      !
                                    </Badge>
                                  )}
                                  {statusBadge}
                                  {module && module.completionPercentage > 0 && module.completionPercentage < 100 && (
                                    <span className="text-xs text-white/60">
                                      {module.completionPercentage}%
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Configurações no rodapé */}
      <div className="border-t border-legacy-600 p-3">
        <Link 
          to="/settings" 
          className={cn(
            "flex items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors", 
            pathname === "/settings"
              ? "bg-legacy-600 text-white" 
              : "text-white hover:bg-legacy-600"
          )} 
          title={!open ? "Configurações" : undefined}
        >
          <div className="h-4 w-4 flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          {open && <span className="ml-2">Configurações</span>}
        </Link>
      </div>
      
      <Button variant="outline" size="icon" onClick={toggleSidebar} className="m-2">
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      
      <GuidedNavigation 
        isOpen={showGuidedNav} 
        onClose={() => setShowGuidedNav(false)} 
      />
    </aside>
  );
};

export default Sidebar;
