import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ActivitySquare, BarChart3, Calendar, FileText, LayoutDashboard, 
  Leaf, Settings, Shield, Users, Database, BookOpen, BookText, 
  Activity, Building, Bot, DollarSign, PieChart, CheckCircle, 
  Clock, AlertCircle, Zap, Target, Map, Play, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
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
          icon: Play,
          href: "/start",
          name: "Comece Aqui",
          moduleId: null,
          priority: true
        },
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
      phase: "PARAMETRIZAÇÃO",
      icon: Zap,
      color: "text-green-400",
      items: [
        {
          icon: Users,
          href: "/shareholder-structure",
          name: "Estrutura Societária",
          moduleId: "shareholder-structure"
        },
        {
          icon: BarChart3,
          href: "/data-input",
          name: "Avaliação de Governança",
          moduleId: "maturity"
        },
        {
          icon: CheckCircle,
          href: "/maturity",
          name: "Maturidade de Governança",
          moduleId: "maturity-results"
        },
        {
          icon: Leaf,
          href: "/dados-esg",
          name: "Maturidade ESG",
          moduleId: "esg"
        },
        {
          icon: BookText,
          href: "/legacy",
          name: "Legado",
          moduleId: null
        }
      ]
    },
    {
      phase: "Fundação",
      icon: Users,
      color: "text-green-400",
      items: [
        {
          icon: FileText,
          href: "/document-management",
          name: "Gestão de Documentos",
          moduleId: "document-management",
          priority: true
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
        }
      ]
    },
    {
      phase: "Monitoramento",
      icon: AlertCircle,
      color: "text-red-400",
      items: [
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
          icon: Bot,
          href: "/ai-agents",
          name: "Agentes de IA",
          moduleId: "ai-config"
        }
      ]
    }
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-2">
            <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
                alt="Legacy" 
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {isAdminRoute ? (
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href === "/admin/companies" && pathname.startsWith("/admin/companies"))}
                      >
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          {!collapsed && <span>{item.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            menuPhases.map((phase, phaseIndex) => (
              <SidebarGroup key={phase.phase}>
                <SidebarGroupLabel className={cn("flex items-center gap-2 text-sm font-semibold", phase.color)}>
                  <phase.icon className="h-4 w-4" />
                  {!collapsed && phase.phase}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {phase.items.map(item => {
                      const isActive = pathname === item.href;
                      
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link to={item.href} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-sidebar-foreground/90" />
                    {!collapsed && <span className="flex-1">{item.name}</span>}
                  </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
}