import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  Building2, 
  LogOut,
  BarChart3
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

interface MemberSidebarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/member-portal' },
  { id: 'maturidade', icon: BarChart3, label: 'Maturidade', path: '/member-portal/maturidade' },
  { id: 'reunioes', icon: CalendarDays, label: 'Próximas Reuniões', path: '/member-portal/reunioes' },
  { id: 'atas', icon: FileText, label: 'ATAs Pendentes', path: '/member-portal/atas' },
  { id: 'pendencias', icon: AlertTriangle, label: 'Minhas Pendências', path: '/member-portal/pendencias' },
  { id: 'orgaos', icon: Building2, label: 'Meus Órgãos', path: '/member-portal/orgaos' },
];

export function MemberSidebar({ activeSection, onSectionClick, onLogout }: MemberSidebarProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const memberCouncils = user?.councilMemberships?.length 
    ? ['Conselho de Administração', 'Comitê de Auditoria'] 
    : ['Conselho de Administração'];

  const isActive = (path: string) => {
    if (path === '/member-portal') {
      return location.pathname === '/member-portal';
    }
    return location.pathname.startsWith(path);
  };

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
            <p className="text-base text-sidebar-foreground/70">Portal do Membro</p>
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
                    asChild
                    isActive={isActive(item.path)}
                    className="py-4 min-h-[52px]"
                  >
                    <Link to={item.path} onClick={() => onSectionClick(item.id)}>
                      <item.icon className="h-6 w-6" />
                      {!collapsed && <span className="text-lg">{item.label}</span>}
                    </Link>
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLogout}
              className="h-12 w-12 bg-[#C9A54E] hover:bg-[#B8944D] text-white"
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info */}
            <div className="space-y-1">
              <p className="text-lg font-semibold text-sidebar-foreground">{user?.name}</p>
              <p className="text-base text-sidebar-foreground/70">
                {memberCouncils[0]}
                {memberCouncils.length > 1 && ` +${memberCouncils.length - 1}`}
              </p>
            </div>
            
            {/* Logout */}
            <Button 
              variant="outline" 
              size="lg"
              onClick={onLogout}
              className="w-full text-base h-12 px-5 bg-[#C9A54E] hover:bg-[#B8944D] text-white border-[#C9A54E] hover:border-[#B8944D]"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
