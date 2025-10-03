import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
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
    } else {
      localStorage.removeItem('authUser');
    }
  };

  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      
      // Usar autenticação real do Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError || !authData.user) {
        toast({
          title: 'Erro no login',
          description: signInError?.message || 'Credenciais inválidas',
          variant: 'destructive',
        });
        return false;
      }

      // Buscar role do usuário na tabela user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .single();

      if (roleError || !roleData) {
        console.error('Erro ao buscar role:', roleError);
        toast({
          title: 'Erro',
          description: 'Não foi possível verificar permissões do usuário',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
        return false;
      }

      const authUser: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.name || authData.user.email!.split('@')[0],
        role: roleData.role,
        company: authData.user.user_metadata?.company,
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
      await supabase.auth.signOut();
      setUserWithPersistence(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Inicializar usuário do localStorage e configurar listener do Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar sessão ativa no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar role do usuário
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleData) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
              role: roleData.role,
              company: session.user.user_metadata?.company,
            };
            setUserWithPersistence(authUser);
          }
        } else {
          // Tentar restaurar do localStorage se não houver sessão
          const storedUser = localStorage.getItem('authUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as AuthUser;
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserWithPersistence(null);
      } else if (session?.user) {
        // Usar setTimeout para evitar deadlock ao chamar Supabase dentro do callback
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleData) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
              role: roleData.role,
              company: session.user.user_metadata?.company,
            };
            setUserWithPersistence(authUser);
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
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
