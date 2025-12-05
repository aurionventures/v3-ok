import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  Building2,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import MemberNotificationBell from "./MemberNotificationBell";

interface MemberSidebarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'reunioes', icon: CalendarDays, label: 'Próximas Reuniões' },
  { id: 'atas', icon: FileText, label: 'ATAs Pendentes' },
  { id: 'pendencias', icon: AlertTriangle, label: 'Minhas Pendências' },
  { id: 'orgaos', icon: Building2, label: 'Meus Órgãos' },
];

export function MemberSidebar({ activeSection, onSectionClick, onLogout }: MemberSidebarProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const memberCouncils = user?.councilMemberships?.length 
    ? ['Conselho de Administração', 'Comitê de Auditoria'] 
    : ['Conselho de Administração'];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-3">
          <Link to="/member-portal" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
        </div>
        {!collapsed && (
          <div className="px-3 pb-3">
            <p className="text-sm text-sidebar-foreground/70">Portal do Membro</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionClick(item.id)}
                    isActive={activeSection === item.id}
                    className="py-3"
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="text-base">{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <MemberNotificationBell />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLogout}
              className="h-10 w-10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info */}
            <div className="space-y-1">
              <p className="text-base font-semibold text-sidebar-foreground">{user?.name}</p>
              <p className="text-sm text-sidebar-foreground/70">
                {memberCouncils[0]}
                {memberCouncils.length > 1 && ` +${memberCouncils.length - 1}`}
              </p>
            </div>
            
            {/* Notifications & Logout */}
            <div className="flex items-center justify-between">
              <MemberNotificationBell />
              <Button 
                variant="outline" 
                size="default"
                onClick={onLogout}
                className="text-base"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
