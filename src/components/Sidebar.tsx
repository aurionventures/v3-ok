
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
BarChart3, Calendar, ClipboardList, FileText, ChevronRight,
  ChevronLeft, ChevronUp, ChevronDown, LayoutDashboard, Settings, Shield,
  Users, Building, Bot, DollarSign, PieChart,
  Target, LogOut, Mic, Gift, Send, Award, Lock, Leaf, TrendingUp, Calculator,
  Layers
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AddonModuleModal } from "@/components/AddonModuleModal";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [addonModuleName, setAddonModuleName] = useState<string | null>(null);
  const [addonsSectionCollapsed, setAddonsSectionCollapsed] = useState(false);
  
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

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/");
  };

  const handleEditProfile = () => {
    toast({
      title: "Editar Perfil",
      description: "Edição de perfil ativada",
    });
    navigate(isAdminRoute ? "/admin/settings" : "/settings?tab=profile");
  };

  // Admin menu items (podem ser seção { type: 'section', name } ou link { type: 'item', icon, href, name })
  const adminMenuItems: Array<
    | { type: "section"; name: string }
    | { type: "item"; icon: React.ReactNode; href: string; name: string }
  > = [
    { type: "item", icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin", name: "Dashboard" },
    { type: "item", icon: <Shield className="h-5 w-5" />, href: "/admin/master", name: "Funil e Vendas" },
    { type: "item", icon: <Users className="h-5 w-5" />, href: "/admin/partners", name: "Parceiros e links de afiliados" },
    { type: "item", icon: <ClipboardList className="h-5 w-5" />, href: "/admin/contracts", name: "Gestão de Contratos" },
    { type: "item", icon: <Building className="h-5 w-5" />, href: "/admin/companies", name: "Empresas" },
    { type: "item", icon: <DollarSign className="h-5 w-5" />, href: "/admin/finances", name: "Finanças" },
    { type: "item", icon: <FileText className="h-5 w-5" />, href: "/admin/finances/invoices", name: "Gestão de Faturas" },
    { type: "item", icon: <Layers className="h-5 w-5" />, href: "/admin/configurador-planos", name: "Configurador de Planos" },
    { type: "section", name: "Tecnologia" },
    { type: "item", icon: <Bot className="h-5 w-5" />, href: "/admin/agent-config", name: "Gestão de IA" },
    { type: "item", icon: <Settings className="h-5 w-5" />, href: "/admin/settings", name: "Configurações" }
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
          icon: <Bot className="h-5 w-5" />,
          href: "/copiloto-governanca",
          name: "Copiloto de IA",
          moduleId: null
        }
      ]
    },
    {
      phase: "Parametrização",
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <Users className="h-5 w-5" />,
          href: "/family-structure",
          name: "Estrutura Societária",
          moduleId: "family-structure",
          priority: true
        },
        {
          icon: <FileText className="h-5 w-5" />,
          href: "/documents",
          name: "Checklist",
          moduleId: "documents"
        },
        {
          icon: <PieChart className="h-5 w-5" />,
          href: "/cap-table",
          name: "Cap Table",
          moduleId: "cap-table"
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/maturidade-governanca",
          name: "Maturidade de Governança",
          moduleId: "maturidade-governanca"
        },
        {
          icon: <Mic className="h-5 w-5" />,
          href: "/entrevistas",
          name: "Entrevistas",
          moduleId: "entrevistas"
        }
      ]
    },
    {
      phase: "Estruturação",
      icon: <Shield className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <Shield className="h-5 w-5" />,
          href: "/councils",
          name: "Config. de Governança",
          moduleId: "councils",
          priority: true
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/analise-acoes",
          name: "Análise e Ações",
          moduleId: null
        },
        {
          icon: <Calendar className="h-5 w-5" />,
          href: "/agenda",
          name: "Agenda",
          moduleId: null
        },
        {
          icon: <ClipboardList className="h-5 w-5" />,
          href: "/secretariado",
          name: "Secretariado",
          moduleId: null
        }
      ]
    },
    {
      phase: "Add-ons",
      icon: <Gift className="h-4 w-4" />,
      color: "text-legacy-gold",
      badgeCount: 3,
      items: [
        {
          icon: <Send className="h-5 w-5" />,
          href: "/planos",
          name: "Submeter Projetos",
          moduleId: null,
          locked: true
        },
        {
          icon: <Award className="h-5 w-5" />,
          href: "/planos",
          name: "Desempenho do Conselho",
          moduleId: null,
          locked: true
        },
        {
          icon: <Shield className="h-5 w-5" />,
          href: "/planos",
          name: "Riscos",
          moduleId: null,
          locked: true
        },
        {
          icon: <Users className="h-5 w-5" />,
          href: "/planos",
          name: "Desenvolvimento e PDI",
          moduleId: null,
          locked: true
        },
        {
          icon: <Leaf className="h-5 w-5" />,
          href: "/planos",
          name: "Maturidade ESG",
          moduleId: null,
          locked: true
        },
        {
          icon: <TrendingUp className="h-5 w-5" />,
          href: "/planos",
          name: "Inteligência de Mercado",
          moduleId: null,
          locked: true
        },
        {
          icon: <Target className="h-5 w-5" />,
          href: "/planos",
          name: "Benchmarking Global",
          moduleId: null,
          locked: true
        },
        {
          icon: <Bot className="h-5 w-5" />,
          href: "/planos",
          name: "Agentes de IA",
          moduleId: null,
          locked: true
        },
        {
          icon: <Calculator className="h-5 w-5" />,
          href: "/planos",
          name: "Simulador de Cenários",
          moduleId: null,
          locked: true
        }
      ]
    }
  ];

  // Choose which menu items to display based on the route
  const menuData = isAdminRoute ? adminMenuItems : menuPhases;

  return (
    <>
    <aside className={cn("bg-legacy-500 h-screen border-r border-legacy-600 transition-all duration-300 ease-in-out z-10 relative", 
      open ? "flex flex-col w-64 sm:w-64 md:w-72 max-w-full" : "w-16 flex flex-col"
    )}>
      <div className="overflow-hidden p-4 border-b border-legacy-600 bg-legacy-500 text-white">
        <div className="flex items-center justify-between gap-2">
          <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png"
              alt="Legacy OS"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 shrink-0 border-0 bg-transparent text-white hover:bg-legacy-600 hover:text-white"
              title={open ? "Recolher menu" : "Expandir menu"}
            >
              {open ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-2 scrollbar-thin">
        <div className="px-3 py-2">
          {isAdminRoute ? (
            // Admin menu (seções e links)
            <div className="space-y-1">
              {adminMenuItems.map((item, index) =>
                item.type === "section" ? (
                  open ? (
                    <div
                      key={`section-${item.name}-${index}`}
                      className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-white/70"
                    >
                      {item.name}
                    </div>
                  ) : null
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                        ? "bg-legacy-600 text-white"
                        : "text-white hover:bg-legacy-600"
                    )}
                    title={!open ? item.name : undefined}
                  >
                    {item.icon}
                    {open && <span className="ml-2">{item.name}</span>}
                  </Link>
                )
              )}
            </div>
          ) : (
            // Company menu (organized by phases)
            <div className="space-y-4">
              {menuPhases.map((phase, phaseIndex) => (
                <div key={phase.phase}>
                  {open && (
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      <span className={cn("flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider", phase.color)}>
                        {phase.icon}
                        {phase.phase}
                      </span>
                      {"badgeCount" in phase && phase.badgeCount != null && (
                        <>
                          <span className={cn(
                            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                            phase.phase === "Add-ons" ? "bg-legacy-gold text-white" : "bg-white/20 text-white"
                          )}>
                            {phase.badgeCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddonsSectionCollapsed((prev) => !prev)}
                            className="shrink-0 rounded p-0.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                            title={addonsSectionCollapsed ? "Expandir seção Add-ons" : "Recolher seção Add-ons"}
                            aria-expanded={!addonsSectionCollapsed}
                          >
                            {addonsSectionCollapsed ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronUp className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </>
                      )}
                      <div className="flex-1 h-px bg-white/20" />
                    </div>
                  )}
                  
                  <div className={cn("space-y-1", phase.phase === "Add-ons" && addonsSectionCollapsed && "hidden")}>
                    {phase.items.map((item, itemIndex) => {
                      const isActive = pathname === item.href && !("locked" in item && item.locked);
                      const isLocked = "locked" in item && item.locked;
                      const showDivider = phase.phase === "Add-ons" && isLocked && phase.items[itemIndex - 1] && !("locked" in phase.items[itemIndex - 1] && phase.items[itemIndex - 1].locked);

                      return (
                        <span key={`${item.href}-${itemIndex}`}>
                          {showDivider && <div className="my-2 h-px bg-white/20 mx-3" />}
                          {isLocked ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAddonModuleName(item.name);
                                setAddonModalOpen(true);
                              }}
                              className={cn(
                                "flex items-center w-full py-2 px-3 rounded-md text-sm font-medium transition-colors group relative text-left",
                                "text-white/70 hover:bg-legacy-600 hover:text-white"
                              )}
                              title={!open ? item.name : undefined}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {item.icon}
                                {open && <span className="flex-1 truncate">{item.name}</span>}
                                {open && <Lock className="h-3.5 w-3.5 shrink-0 text-white/70" />}
                              </div>
                            </button>
                          ) : (
                            <Link 
                              to={item.href} 
                              className={cn(
                                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors group relative", 
                                isActive
                                  ? "bg-legacy-600 text-white" 
                                  : "text-white hover:bg-legacy-600"
                              )} 
                              title={!open ? item.name : undefined}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {item.icon}
                                {open && <span className="flex-1 truncate">{item.name}</span>}
                              </div>
                            </Link>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-legacy-600 px-3 py-3 mt-auto shrink-0">
        <div className={cn("flex items-center gap-2", !open && "justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-legacy-500"
                title="Perfil"
              >
                <Avatar className="h-9 w-9 shrink-0 border-2 border-white/20">
                  <AvatarFallback className="bg-legacy-600 text-white text-sm">U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={open ? "start" : "center"} side="right" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">Usuário Admin</span>
                  <span className="text-xs text-muted-foreground">admin@legacygov.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditProfile}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {open && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-white truncate">Usuário Admin</span>
            </div>
          )}
          <Link
            to={isAdminRoute ? "/admin/settings" : "/settings"}
            className="shrink-0 rounded-md p-2 text-white hover:bg-legacy-600 transition-colors"
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-md p-2 text-white hover:bg-legacy-600 transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
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

export default Sidebar;
