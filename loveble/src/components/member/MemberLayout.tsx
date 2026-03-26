import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MemberSidebar } from "./MemberSidebar";
import MemberNotificationBell from "./MemberNotificationBell";

interface MemberLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MemberLayout({ children, title, subtitle }: MemberLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine active section from current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/member-portal') return 'dashboard';
    if (path.includes('/reunioes')) return 'reunioes';
    if (path.includes('/atas')) return 'atas';
    if (path.includes('/pendencias')) return 'pendencias';
    if (path.includes('/orgaos')) return 'orgaos';
    return 'dashboard';
  };

  const handleSectionClick = (section: string) => {
    const routes: Record<string, string> = {
      dashboard: '/member-portal',
      reunioes: '/member-portal/reunioes',
      atas: '/member-portal/atas',
      pendencias: '/member-portal/pendencias',
      orgaos: '/member-portal/orgaos'
    };
    navigate(routes[section] || '/member-portal');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MemberSidebar 
          activeSection={getActiveSection()}
          onSectionClick={handleSectionClick}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-10 w-10" />
                <div>
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {subtitle && <p className="text-base text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
              <MemberNotificationBell />
            </div>
          </header>

          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
