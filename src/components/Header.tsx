
import { useState } from "react";
import { LogOut, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import GovernanceAssistant from "./GovernanceAssistant";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  title?: string;
}

const getOrgRoleLabel = (orgRole?: string) => {
  switch (orgRole) {
    case 'org_admin': return 'Admin';
    case 'org_user': return 'Usuário';
    case 'org_member': return 'Membro';
    default: return 'Usuário';
  }
};

const getOrgRoleBadgeClass = (orgRole?: string) => {
  switch (orgRole) {
    case 'org_admin': return 'bg-blue-500 text-white hover:bg-blue-500';
    case 'org_user': return 'bg-gray-500 text-white hover:bg-gray-500';
    case 'org_member': return 'bg-purple-500 text-white hover:bg-purple-500';
    default: return 'bg-gray-500 text-white hover:bg-gray-500';
  }
};

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showGuide, setShowGuide] = useState(false);

  const handleLogout = async () => {
    await logout();
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

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Botão Guia Legacy */}
          <Button 
            onClick={() => setShowGuide(true)}
            className="bg-legacy-500 hover:bg-legacy-600 text-white rounded-full px-4 py-2"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Guia Legacy
          </Button>

          <NotificationBell />

          {/* Nome e Tipo do Usuário */}
          <div className="hidden md:flex items-center gap-2 text-right border-l pl-3 ml-1">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
              <Badge className={`${getOrgRoleBadgeClass(user?.orgRole)} text-xs px-2 py-0`}>
                {getOrgRoleLabel(user?.orgRole)}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarFallback className="bg-legacy-500 text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span>{user?.name || 'Usuário'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'Email não disponível'}</span>
                  <Badge className={`${getOrgRoleBadgeClass(user?.orgRole)} mt-1 text-xs`}>
                    Logado como: {getOrgRoleLabel(user?.orgRole)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditProfile}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Governance Assistant controlado pelo Header */}
      <GovernanceAssistant 
        isOpen={showGuide} 
        onOpenChange={setShowGuide} 
      />
    </>
  );
};

export default Header;
