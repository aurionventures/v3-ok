import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Building, DollarSign, Rocket, Building2, Globe, TrendingUp, Crown, Sparkles, Leaf, Check } from "lucide-react";
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
  useSidebar
} from "@/components/ui/sidebar";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { CompanySize, GovernancePlan, COMPANY_SIZE_LABELS, PLAN_LABELS } from "@/types/organization";

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
  const { getVisibleSections, organization } = useModuleAccess();
  
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Admin menu items
  const adminMenuItems = [
    { icon: LayoutDashboard, href: "/admin", name: "Dashboard" },
    { icon: Building, href: "/admin/companies", name: "Empresas" },
    { icon: DollarSign, href: "/admin/finances", name: "Finanças" },
    { icon: Settings, href: "/admin/settings", name: "Configurações" }
  ];

  const visibleSections = getVisibleSections();
  
  const SizeIcon = organization ? SIZE_ICONS[organization.companySize] : Building2;
  const planConfig = organization ? PLAN_CONFIG[organization.plan] : PLAN_CONFIG.core;
  const PlanIcon = planConfig.icon;

  return (
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
          visibleSections.map((section) => (
            <SidebarGroup key={section.key}>
              <SidebarGroupLabel className={cn("flex items-center gap-2 text-sm font-semibold", section.color)}>
                <section.icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    {section.label}
                    {section.premium && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4 border-current">
                        Premium
                      </Badge>
                    )}
                  </>
                )}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map(item => {
                    const isActive = pathname === item.path;
                    
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.path} className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <item.icon className="h-5 w-5 text-sidebar-foreground/90" />
                              {!collapsed && <span className="flex-1">{item.label}</span>}
                            </div>
                            {!collapsed && item.premium && (
                              <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3">
                                Add-on
                              </Badge>
                            )}
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
      
      {!isAdminRoute && organization && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className={cn("p-1.5 rounded-md", planConfig.color)}>
                <PlanIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          ) : (
            <Link to="/settings" className="block hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
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
  );
}