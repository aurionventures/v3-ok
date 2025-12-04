import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Building, DollarSign } from "lucide-react";
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
import { useModuleAccess } from "@/hooks/useModuleAccess";

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
    </Sidebar>
  );
}
