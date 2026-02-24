
import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

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

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
          alt="Legacy" 
          className="h-6 w-auto dark:brightness-0 dark:invert"
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-legacy-500 text-white">U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Usuário Admin</span>
                <span className="text-xs text-muted-foreground">admin@legacygov.com</span>
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
  );
};

export default Header;
