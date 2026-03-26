import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Star, 
  User, 
  Users, 
  MoreVertical, 
  Edit, 
  ExternalLink, 
  Trash2,
  Mail
} from "lucide-react";
import { mockOrganizationUsers } from "@/utils/mockUsers";
import { ORG_ROLE_LABELS, OrganizationUserRole } from "@/types/organization";
import { UserManagementModal } from "./UserManagementModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const getRoleBadgeVariant = (role: OrganizationUserRole) => {
  switch (role) {
    case 'org_admin':
      return 'default';
    case 'org_member':
      return 'secondary';
    case 'org_user':
      return 'outline';
    default:
      return 'outline';
  }
};

const getRoleIcon = (role: OrganizationUserRole) => {
  switch (role) {
    case 'org_admin':
      return <Star className="h-4 w-4" />;
    case 'org_member':
      return <Users className="h-4 w-4" />;
    case 'org_user':
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

export const UserManagementTab = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.orgRole === 'org_admin';
  const [users, setUsers] = useState(mockOrganizationUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof mockOrganizationUsers[0] | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: typeof mockOrganizationUsers[0]) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Ação não permitida",
        description: "Você não pode remover seu próprio usuário",
        variant: "destructive"
      });
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido da organização"
    });
  };

  const handleOpenPortal = (email: string) => {
    toast({
      title: "Abrindo Portal",
      description: `Simulando acesso ao portal como ${email}`
    });
    window.open('/member-portal', '_blank');
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas"
      });
    } else {
      const newUser = {
        id: `new-${Date.now()}`,
        ...userData,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      toast({
        title: "Usuário adicionado",
        description: "Um convite foi enviado para o e-mail informado"
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Usuários da Organização</h3>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Gerencie os usuários que têm acesso à plataforma' : 'Visualize os usuários da organização'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUser?.id;
          
          return (
            <Card key={user.id} className={isCurrentUser ? "border-primary/50 bg-primary/5" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {getRoleIcon(user.orgRole)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">você</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={getRoleBadgeVariant(user.orgRole)}>
                        {ORG_ROLE_LABELS[user.orgRole]}
                      </Badge>
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      {user.lastLogin ? (
                        <>
                          <p>Último acesso:</p>
                          <p>{format(new Date(user.lastLogin), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                        </>
                      ) : (
                        <p>Nunca acessou</p>
                      )}
                    </div>

                    {!isCurrentUser && isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {user.orgRole === 'org_member' && (
                            <DropdownMenuItem onClick={() => handleOpenPortal(user.email)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Abrir Portal
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <UserManagementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};
