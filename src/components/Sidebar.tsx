
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, Calendar, ClipboardList, FileText, ChevronRight, 
  ChevronLeft, LayoutDashboard, Settings, Shield, 
  Users, Building, Bot, DollarSign, PieChart,
  Target, LogOut
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

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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
    navigate("/settings?tab=profile");
  };

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
      phase: "Fundação",
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-400",
      items: [
        {
          icon: <Users className="h-5 w-5" />,
          href: "/family-structure",
          name: "Estrutura Familiar",
          moduleId: "family-structure",
          priority: true
        },
        {
          icon: <FileText className="h-5 w-5" />,
          href: "/documents",
          name: "Documentos",
          moduleId: "documents"
        },
        {
          icon: <PieChart className="h-5 w-5" />,
          href: "/cap-table",
          name: "Cap Table",
          moduleId: "cap-table"
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
          icon: <Calendar className="h-5 w-5" />,
          href: "/rituals",
          name: "Rituais",
          moduleId: "rituals"
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
    }
  ];

  // Choose which menu items to display based on the route
  const menuData = isAdminRoute ? adminMenuItems : menuPhases;

  return (
    <aside className={cn("bg-legacy-500 h-screen border-r border-legacy-600 transition-all duration-300 ease-in-out z-10 relative", 
      open ? "flex flex-col w-64 sm:w-64 md:w-72 max-w-full" : "w-16 flex flex-col"
    )}>
      <div className="overflow-hidden p-4 border-b border-legacy-600 bg-legacy-500 text-white">
        <div className="flex items-center justify-between gap-2">
          <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2 min-w-0 flex-1">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
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
            // Admin menu (simple list)
            <div className="space-y-1">
              {adminMenuItems.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors", 
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
            <div className="space-y-4">
              {menuPhases.map((phase, phaseIndex) => (
                <div key={phase.phase}>
                  {open && (
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      <span className={cn("flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider", phase.color)}>
                        {phase.icon}
                        {phase.phase}
                      </span>
                      <div className="flex-1 h-px bg-white/20" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {phase.items.map(item => {
                      const isActive = pathname === item.href;

                      return (
                        <Link 
                          key={item.href} 
                          to={item.href} 
                          className={cn(
                            "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors group relative", 
                            isActive
                              ? "bg-legacy-600 text-white" 
                              : "text-white hover:bg-legacy-600"
                          )} 
                          title={!open ? item.name : undefined}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {item.icon}
                            {open && <span className="flex-1">{item.name}</span>}
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

      {!isAdminRoute && (
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
              to="/settings"
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
      )}
    </aside>
  );
};

export default Sidebar;
