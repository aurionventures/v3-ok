
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
  Brain, 
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
  TrendingUp,
  Briefcase,
  Lightbulb,
  UserPlus,
  Handshake,
  ScrollText
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const Sidebar = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);
  
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
  
  // Admin menu items - Nova estrutura reorganizada conforme PRD
  const adminMenuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      name: "Dashboard"
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/empresas",
      name: "Empresas"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/planos",
      name: "Planos & Produtos"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      href: "/admin/addons",
      name: "Add-ons"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/admin/vendas",
      name: "Vendas & Ativações"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      href: "/admin/finances",
      name: "Financeiro"
    },
    {
      icon: <ScrollText className="h-5 w-5" />,
      href: "/admin/auditoria",
      name: "Auditoria"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      href: "/admin/seguranca",
      name: "Segurança"
    },
    {
      icon: <Handshake className="h-5 w-5" />,
      href: "/admin/parceiros",
      name: "Parceiros"
    }
  ];

  // Company menu items organized by phases
  const menuPhases = [
    {
      phase: "Início",
      icon: <Target className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <LayoutDashboard className="h-5 w-5" />,
          href: "/dashboard",
          name: "Dashboard",
          moduleId: null
        },
        {
          icon: <Brain className="h-5 w-5" />,
          href: "/copiloto-governanca",
          name: "Copiloto de IA",
          moduleId: "ai_copilot"
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
          moduleId: "shareholder-structure"
        },
        {
          icon: <PieChart className="h-5 w-5" />,
          href: "/cap-table",
          name: "Cap Table",
          moduleId: "cap-table"
        },
        {
          icon: <CheckCircle className="h-5 w-5" />,
          href: "/maturity",
          name: "Maturidade de Governança",
          moduleId: "maturity-results"
        },
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
          icon: <ActivitySquare className="h-5 w-5" />,
          href: "/interviews",
          name: "Entrevistas",
          moduleId: "interviews"
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/initial-report",
          name: "Análise e Ações",
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
          icon: <Settings className="h-5 w-5" />,
          href: "/governance-config",
          name: "Config. Governança",
          moduleId: "governance-config"
        },
        {
          icon: <Calendar className="h-5 w-5" />,
          href: "/annual-agenda",
          name: "Agenda Anual",
          moduleId: "annual-agenda",
          priority: true
        },
        {
          icon: <Briefcase className="h-5 w-5" />,
          href: "/secretariat",
          name: "Secretariado",
          moduleId: "secretariat",
          priority: true
        },
        {
          icon: <Send className="h-5 w-5" />,
          href: "/submit-projects",
          name: "Submeter Projetos",
          moduleId: "submit-projects"
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
        },
        {
          icon: <Award className="h-5 w-5" />,
          href: "/board-performance",
          name: "Desempenho do Conselho",
          moduleId: "board_performance"
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
          href: "/governance-risk-management",
          name: "Riscos",
          moduleId: "governance-risks"
        }
      ]
    },
    {
      phase: "ESG",
      icon: <Leaf className="h-4 w-4" />,
      color: "text-emerald-400",
      items: [
        {
          icon: <Leaf className="h-5 w-5" />,
          href: "/esg",
          name: "Maturidade ESG",
          moduleId: "esg"
        }
      ]
    },
    {
      phase: "Inteligência de Mercado",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-cyan-400",
      items: [
        {
          icon: <TrendingUp className="h-5 w-5" />,
          href: "/market-intelligence",
          name: "Inteligência de Mercado",
          moduleId: "market-intelligence"
        },
        {
          icon: <Target className="h-5 w-5" />,
          href: "/benchmarking",
          name: "Benchmarking Global",
          moduleId: "benchmarking"
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-legacy-600"
                >
                  {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{open ? "Recolher menu" : "Expandir menu"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-1 scrollbar-thin">
        <div className="px-3 py-1">
          {isAdminRoute ? (
            // Admin menu (simple list)
            <div className="space-y-2">
              {adminMenuItems.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors", 
                    pathname === item.href || (item.href === "/admin/companies" && pathname.startsWith("/admin/companies"))
                      ? "bg-accent text-accent-foreground" 
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
                      
                      return (
                        <Link 
                          key={item.href} 
                          to={item.href} 
                          className={cn(
                            "flex items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors group relative", 
                            isActive
                              ? "bg-accent text-accent-foreground" 
                              : "text-white hover:bg-legacy-600"
                          )}
                          title={!open ? item.name : undefined}
                        >
                          <div className="flex items-center gap-1.5 flex-1">
                            <div className="h-4 w-4 flex items-center justify-center">
                              {item.icon}
                            </div>
                            {open && <span className="flex-1 text-xs">{item.name}</span>}
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
      
    </aside>
  );
};

export default Sidebar;
