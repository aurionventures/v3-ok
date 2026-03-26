import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Building, DollarSign, Rocket, Building2, Globe, 
  TrendingUp, Crown, Sparkles, Leaf, Check, Lock, Handshake, 
  FileText, Shield, ScrollText, Layers, Gift 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { BASE_SECTIONS, ADDON_ITEMS, DYNAMIC_ADDONS, SidebarSection, SidebarItem } from "@/data/sidebarCatalog";
import { CompanySize, GovernancePlan, COMPANY_SIZE_LABELS, PLAN_LABELS, ModuleKey } from "@/types/organization";
import { UpgradeModal } from "./UpgradeModal";

const SIZE_ICONS: Record<CompanySize, typeof Rocket> = {
  startup: Rocket,
  small: Building,
  medium: Building2,
  large: Globe,
  listed: TrendingUp,
};

const PLAN_CONFIG: Record<GovernancePlan, { icon: typeof Crown; color: string }> = {
  core: { icon: Check, color: "bg-slate-500" },
  governance_plus: { icon: Sparkles, color: "bg-blue-500" },
  people_esg: { icon: Leaf, color: "bg-emerald-500" },
  legacy_360: { icon: Crown, color: "bg-amber-500" },
};

export function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { hasAccess, organization } = useModuleAccess();
  
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleKey: string; moduleName: string }>({
    open: false,
    moduleKey: '',
    moduleName: ''
  });
  
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Admin menu items
  const adminMenuItems = [
    { icon: LayoutDashboard, href: "/admin", name: "Dashboard" },
    { icon: Building2, href: "/admin/clientes", name: "Gestão de Empresas" },
    { icon: Handshake, href: "/admin/parceiros", name: "Parceiros" },
    { icon: FileText, href: "/admin/plans-comparison", name: "Configuração de Planos" },
    { icon: Shield, href: "/admin/seguranca", name: "Segurança" },
    { icon: ScrollText, href: "/admin/auditoria", name: "Auditoria" },
    { icon: DollarSign, href: "/admin/finances", name: "Finanças" }
  ];
  
  const SizeIcon = organization ? SIZE_ICONS[organization.companySize] : Building2;
  const planConfig = organization ? PLAN_CONFIG[organization.plan] : PLAN_CONFIG.core;
  const PlanIcon = planConfig.icon;

  const handleLockedClick = (moduleKey: string, moduleName: string) => {
    setUpgradeModal({ open: true, moduleKey, moduleName });
  };

  // Função para injetar add-ons dinâmicos nas seções corretas
  const getSectionsWithDynamicAddons = (): SidebarSection[] => {
    return BASE_SECTIONS.map(section => {
      const dynamicItems: SidebarItem[] = Object.entries(DYNAMIC_ADDONS)
        .filter(([key, config]) => 
          config.targetSection === section.key && hasAccess(key as ModuleKey)
        )
        .map(([_, config]) => config.item);
      
      return {
        ...section,
        items: [...section.items, ...dynamicItems]
      };
    });
  };

  // Renderiza um item do menu BASE
  const renderBaseMenuItem = (item: SidebarItem) => {
    const isActive = pathname === item.path;
    const isLocked = !hasAccess(item.key);
    
    if (isLocked) {
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            onClick={() => handleLockedClick(item.key, item.label)}
            className="cursor-pointer opacity-50 hover:opacity-70 py-2.5 min-h-[40px]"
          >
            <item.icon className="h-5 w-5 text-sidebar-foreground/50" />
            {!collapsed && <span className="text-base text-sidebar-foreground/60">{item.label}</span>}
            {!collapsed && <Lock className="h-3.5 w-3.5 ml-auto text-sidebar-foreground/40" />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild isActive={isActive} className="py-2.5 min-h-[40px]">
          <Link to={item.path}>
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="text-base">{item.label}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  // Renderiza um item do menu ADD-ON
  const renderAddonMenuItem = (item: SidebarItem) => {
    const isActive = pathname === item.path;
    const isLocked = !hasAccess(item.key);
    
    if (isLocked) {
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            onClick={() => handleLockedClick(item.key, item.label)}
            className="cursor-pointer opacity-50 hover:opacity-70 py-2.5 min-h-[40px]"
          >
            <item.icon className="h-5 w-5 text-sidebar-foreground/50" />
            {!collapsed && <span className="text-base text-sidebar-foreground/60 flex-1">{item.label}</span>}
            {!collapsed && <Lock className="h-3.5 w-3.5 text-amber-500/70" />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild isActive={isActive} className="py-2.5 min-h-[40px]">
          <Link to={item.path}>
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="text-base">{item.label}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  // Renderiza uma seção BASE do sidebar
  const renderBaseSection = (section: SidebarSection) => {
    const sectionItems = section.items;
    if (sectionItems.length === 0) return null;
    
    return (
      <SidebarGroup key={section.key} className="py-1">
        <SidebarGroupLabel className="text-[11px] font-semibold tracking-widest uppercase text-sidebar-foreground/50 px-3 py-2">
          {!collapsed && section.label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sectionItems.map(item => renderBaseMenuItem(item))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  const baseSectionsWithAddons = getSectionsWithDynamicAddons();

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-3">
            <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
                alt="Legacy" 
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <SidebarTrigger className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md" />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          {isAdminRoute ? (
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold tracking-widest uppercase text-sidebar-foreground/50 px-3 py-2">
                Administração
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href === "/admin/clientes" && pathname.startsWith("/admin/clientes"))}
                        className="py-2.5 min-h-[40px]"
                      >
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          {!collapsed && <span className="text-base">{item.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <>
              {/* ===== SISTEMA BASE ===== */}
              <div className="mb-2">
                <div className="flex items-center gap-2 px-3 py-3">
                  <Layers className="h-4 w-4 text-blue-400" />
                  {!collapsed && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                      Sistema Base
                    </span>
                  )}
                </div>
                
                {/* Seções BASE */}
                {baseSectionsWithAddons.map(section => renderBaseSection(section))}
              </div>
              
              {/* ===== SEPARADOR ===== */}
              <div className="relative py-3 px-3">
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              </div>
              
              {/* ===== ADD-ONS ===== */}
              <div>
                <div className="flex items-center gap-2 px-3 py-3">
                  <Gift className="h-4 w-4 text-amber-500" />
                  {!collapsed && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500">
                      Add-ons
                    </span>
                  )}
                </div>
                
                <SidebarMenu>
                  {ADDON_ITEMS.map(item => renderAddonMenuItem(item))}
                </SidebarMenu>
              </div>
            </>
          )}
        </SidebarContent>
        
        {!isAdminRoute && organization && (
          <SidebarFooter className="border-t border-sidebar-border p-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <div className={cn("p-1.5 rounded-md", planConfig.color)}>
                  <PlanIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : (
              <Link to="/settings?tab=plan" className="block hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <SizeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {COMPANY_SIZE_LABELS[organization.companySize]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", planConfig.color, "text-white border-0")}>
                    <PlanIcon className="h-3 w-3 mr-1" />
                    {PLAN_LABELS[organization.plan]}
                  </Badge>
                </div>
              </Link>
            )}
          </SidebarFooter>
        )}
      </Sidebar>

      <UpgradeModal 
        open={upgradeModal.open}
        onOpenChange={(open) => setUpgradeModal(prev => ({ ...prev, open }))}
        moduleKey={upgradeModal.moduleKey}
        moduleName={upgradeModal.moduleName}
      />
    </>
  );
}