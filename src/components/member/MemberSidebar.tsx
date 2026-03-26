import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  LogOut,
  BarChart3,
  Shield,
  Award,
  Settings,
  Vote
} from "lucide-react";
import memberLogo from "@/assets/member-logo-white.png";
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
  { id: 'riscos', icon: Shield, label: 'Riscos', path: '/member-portal/riscos' },
  { id: 'reunioes', icon: CalendarDays, label: 'Próximas Reuniões', path: '/member-portal/reunioes' },
  { id: 'pautas-virtuais', icon: Vote, label: 'Pautas Virtuais', path: '/member-portal/pautas-virtuais' },
  { id: 'atas', icon: FileText, label: 'ATAs Pendentes', path: '/member-portal/atas' },
  { id: 'pendencias', icon: AlertTriangle, label: 'Tarefas Pendentes', path: '/member-portal/pendencias' },
  { id: 'desempenho', icon: Award, label: 'Meu Desempenho', path: '/member-portal/desempenho' },
];

export function MemberSidebar({ activeSection, onSectionClick, onLogout }: MemberSidebarProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === '/member-portal') {
      return location.pathname === '/member-portal';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="bg-[#1a2942] border-r-0">
      <SidebarHeader className="border-b border-white/10">
        <div className="flex items-center justify-between p-3">
          <Link to="/member-portal" className="flex items-center gap-2">
            <img 
              src={memberLogo}
              alt="Legacy" 
              className="h-9 w-auto"
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
          <div className="flex flex-col items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/member-portal/perfil')}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLogout}
              className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">{user?.name}</p>
              <p className="text-base text-white/70">Membro</p>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/member-portal/perfil')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onLogout}
                className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
