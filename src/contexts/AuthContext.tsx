import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Extend Supabase User to include 'name' and 'company'
import type { User as SupabaseUser } from "@supabase/supabase-js";
export type AuthUser = SupabaseUser & { name?: string; company?: string };
import { supabase } from "@/lib/supabase";
import { 
  saveUserToStorage, 
  getUserFromStorage, 
  removeUserFromStorage, 
  type StoredUser 
} from "@/utils/userStorage";

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

  // Função para converter StoredUser para AuthUser
  const storedUserToAuthUser = (storedUser: StoredUser): AuthUser => {
    return {
      id: storedUser.id,
      email: storedUser.email,
      role: storedUser.role,
      name: storedUser.name,
      company: storedUser.company,
      // Campos obrigatórios do SupabaseUser (com valores padrão)
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
    } as AuthUser;
  };

  // Função para converter AuthUser para StoredUser (sem JWT)
  const authUserToStoredUser = (authUser: AuthUser): StoredUser => {
    return {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
      name: authUser.name,
      company: authUser.company,
    };
  };

  // Função customizada para setUser que também salva no localStorage
  const setUserWithPersistence = (newUser: AuthUser | null) => {
    setUser(newUser);
    
    if (newUser) {
      // Salva dados do usuário no localStorage (sem JWT)
      const storedUser = authUserToStoredUser(newUser);
      saveUserToStorage(storedUser);
    } else {
      // Remove dados do usuário do localStorage
      removeUserFromStorage();
    }
  };

  const login = async (credentials: { email: string; password: string; role: string }): Promise<boolean> => {
    // TODO: Implementar lógica de login real com Supabase
    // Por enquanto, apenas retorna sucesso
    console.log('Login attempt:', credentials);
    return true;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserWithPersistence(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Inicializar usuário do localStorage na montagem do componente
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          const authUser = storedUserToAuthUser(storedUser);
          setUser(authUser);
          console.log('Usuário restaurado do localStorage:', authUser);
        }
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    // Escutar mudanças de sessão do Supabase (opcional)
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      // Não sobrescrever o usuário se já estiver definido
      // Isso evita que o usuário seja perdido ao atualizar a página
      console.log('Auth state change:', session?.user ? 'User logged in' : 'User logged out');
    });
    return () => listener.subscription.unsubscribe();
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
