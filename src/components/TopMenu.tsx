import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ActivitySquare, BarChart3, Calendar, FileText, LayoutDashboard, 
  Leaf, Settings, Shield, Users, Database, BookOpen, BookText, 
  Activity, Building, Bot, DollarSign, PieChart, CheckCircle, 
  Clock, AlertCircle, Zap, Target, Map, Play, Send, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function TopMenu() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Admin menu items
  const adminMenuItems = [
    {
      icon: LayoutDashboard,
      href: "/admin",
      name: "Dashboard"
    },
    {
      icon: Building,
      href: "/admin/companies",
      name: "Empresas"
    },
    {
      icon: DollarSign,
      href: "/admin/finances",
      name: "Finanças"
    },
    {
      icon: Settings,
      href: "/admin/settings",
      name: "Configurações"
    }
  ];

  // Company menu items organized by phases
  const menuPhases = [
    {
      phase: "Início",
      icon: Target,
      color: "text-blue-400",
      items: [
        {
          icon: LayoutDashboard,
          href: "/dashboard",
          name: "Dashboard",
          moduleId: null
        },
        {
          icon: Settings,
          href: "/settings",
          name: "Configurações",
          moduleId: "settings"
        },
      ]
    },
    {
      phase: "Fundação",
      icon: Users,
      color: "text-green-400",
      items: [
        {
          icon: Users,
          href: "/shareholder-structure",
          name: "Estrutura Societária",
          moduleId: "shareholder-structure",
          priority: true
        },
        {
          icon: FileText,
          href: "/document-management",
          name: "Gestão de Documentos",
          moduleId: "document-management",
          priority: true
        },
        {
          icon: PieChart,
          href: "/cap-table",
          name: "Cap Table",
          moduleId: "cap-table"
        }
      ]
    },
    {
      phase: "Preparação",
      icon: BookOpen,
      color: "text-blue-400",
      items: [
        {
          icon: FileText,
          href: "/document-checklist",
          name: "Checklist de Documentos",
          moduleId: "document-checklist",
          priority: true
        },
        {
          icon: Database,
          href: "/document-upload",
          name: "Upload de Documentos",
          moduleId: "document-upload",
          priority: true
        },
        {
          icon: ActivitySquare,
          href: "/interviews",
          name: "Entrevistas",
          moduleId: "interviews"
        },
        {
          icon: BarChart3,
          href: "/initial-report",
          name: "Relatório Inicial",
          moduleId: "initial-report"
        }
      ]
    },
    {
      phase: "Estruturação",
      icon: Shield,
      color: "text-purple-400",
      items: [
        {
          icon: Calendar,
          href: "/annual-agenda",
          name: "Agenda Anual",
          moduleId: "annual-agenda",
          priority: true
        },
        {
          icon: Shield,
          href: "/councils",
          name: "Conselhos",
          moduleId: "councils"
        },
        {
          icon: Send,
          href: "/submit-projects",
          name: "Submeter Projetos",
          moduleId: "submit-projects"
        },
        {
          icon: Calendar,
          href: "/rituals",
          name: "Rituais",
          moduleId: "rituals"
        }
      ]
    },
    {
      phase: "Desenvolvimento",
      icon: Activity,
      color: "text-orange-400",
      items: [
        {
          icon: Users,
          href: "/people-management",
          name: "Gestão de Pessoas & Governança",
          moduleId: "people-management",
          priority: true
        },
        {
          icon: BookText,
          href: "/legacy",
          name: "Legado",
          moduleId: null
        },
      ]
    },
    {
      phase: "Monitoramento",
      icon: AlertCircle,
      color: "text-red-400",
      items: [
        {
          icon: Send,
          href: "/notifications-center",
          name: "Central de Notificações",
          moduleId: "notifications-center",
          priority: true
        },
        {
          icon: Shield,
          href: "/governance-risk-management",
          name: "Gestão de Riscos de Governança",
          moduleId: "governance-risks"
        },
        {
          icon: Leaf,
          href: "/esg",
          name: "ESG",
          moduleId: "esg"
        },
        {
          icon: ActivitySquare,
          href: "/activities",
          name: "Atividades",
          moduleId: null
        }
      ]
    },
    {
      phase: "Otimização",
      icon: Zap,
      color: "text-yellow-400",
    items: [
        {
          icon: BarChart3,
          href: "/data-input",
          name: "Maturidade de Governança",
          moduleId: "maturity",
          priority: true
        },
        {
          icon: Bot,
          href: "/ai-agents",
          name: "Agentes de IA",
          moduleId: "ai-config"
        }
      ]
    }
  ];

  const MobileMenu = () => (
    <div className="space-y-4 p-4">
      {isAdminRoute ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Administração</h3>
          {adminMenuItems.map(item => (
            <Link 
              key={item.href} 
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                pathname === item.href || (item.href === "/admin/companies" && pathname.startsWith("/admin/companies"))
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      ) : (
        menuPhases.map((phase, phaseIndex) => (
          <div key={phase.phase} className="space-y-2">
            <h3 className={cn("text-sm font-medium flex items-center gap-2", phase.color)}>
              <phase.icon className="h-4 w-4" />
              {phase.phase}
            </h3>
            {phase.items.map(item => {
              const isActive = pathname === item.href;
              
              return (
                <Link 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {isAdminRoute ? (
                adminMenuItems.map(item => (
                  <NavigationMenuItem key={item.href}>
                    <Link 
                      to={item.href}
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        pathname === item.href || (item.href === "/admin/companies" && pathname.startsWith("/admin/companies"))
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                ))
              ) : (
                menuPhases.map((phase, phaseIndex) => (
                  <NavigationMenuItem key={phase.phase}>
                    <NavigationMenuTrigger className={cn("flex items-center gap-2", phase.color)}>
                      <phase.icon className="h-4 w-4" />
                      {phase.phase}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-64 gap-2 p-4">
                        {phase.items.map(item => {
                          const isActive = pathname === item.href;
                          
                          return (
                            <Link 
                              key={item.href} 
                              to={item.href}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-md text-sm transition-colors hover:bg-accent",
                                isActive ? "bg-accent text-accent-foreground" : ""
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                {item.name}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex items-center justify-between mb-4">
                  <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
                      alt="Legacy" 
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}