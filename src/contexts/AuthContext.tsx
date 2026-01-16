import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockUsers, MockUser } from "@/utils/mockUsers";
import { Organization, OrganizationUserRole } from "@/types/organization";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  orgRole?: OrganizationUserRole; // Papel dentro da organização
  company?: string;
  councilMemberships?: string[]; // Órgãos que participa (para membros)
  organization?: Organization;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  login: (credentials: { email: string; password: string; role: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const setUserWithPersistence = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('authUser', JSON.stringify(newUser));
      // Também persistir organization se existir
      if (newUser.organization) {
        localStorage.setItem('organization', JSON.stringify(newUser.organization));
      }
    } else {
      localStorage.removeItem('authUser');
      localStorage.removeItem('organization');
    }
  };

  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      
      // Buscar usuário primeiro nos mockUsers estáticos
      let mockUser = mockUsers.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password &&
        u.role === credentials.role
      );

      // Se não encontrou, buscar no localStorage (usuários criados dinamicamente)
      if (!mockUser) {
        try {
          const storedMockUsers = JSON.parse(localStorage.getItem('storedMockUsers') || '[]');
          const storedUser = storedMockUsers.find((u: any) => 
            u.email === credentials.email && 
            u.password === credentials.password &&
            u.role === credentials.role
          );

          if (storedUser) {
            mockUser = {
              id: storedUser.id,
              email: storedUser.email,
              password: storedUser.password,
              name: storedUser.name,
              role: storedUser.role,
              company: storedUser.company,
            };
          }
        } catch (error) {
          console.warn('Erro ao buscar usuários do localStorage:', error);
        }
      }

      if (!mockUser) {
        toast({
          title: 'Erro no login',
          description: 'Credenciais inválidas',
          variant: 'destructive',
        });
        return false;
      }

      const authUser: AuthUser = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        orgRole: mockUser.orgRole,
        company: mockUser.company,
        councilMemberships: mockUser.councilMemberships,
        organization: mockUser.organization,
      };
      
      setUserWithPersistence(authUser);
      toast({
        title: 'Login realizado',
        description: `Bem-vindo, ${authUser.name}!`,
      });
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao fazer login',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUserWithPersistence(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Inicializar usuário do localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: setUserWithPersistence, 
      login,
      logout, 
      isAuthenticated: !!user, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
