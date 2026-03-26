import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AppShellProps {
  children: ReactNode;
  showSidebar?: boolean;
}

/**
 * AppShell - Componente base que sempre renderiza algo
 * Nunca retorna null, não depende de dados assíncronos
 * Garante que o layout sempre esteja visível
 * Não usa keys dinâmicas para evitar remount
 */
export function AppShell({ children, showSidebar = true }: AppShellProps) {
  const { user } = useAuth();
  
  // Sempre renderizar o shell, mesmo sem usuário (para páginas públicas)
  // O sidebar só aparece se houver usuário e showSidebar for true
  const shouldShowSidebar = showSidebar && !!user;

  return (
    <div className="min-h-screen bg-background flex w-full">
      {shouldShowSidebar && (
        <Sidebar />
      )}
      <main className={`flex-1 ${shouldShowSidebar ? 'ml-64' : ''} transition-all duration-200 w-full`}>
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
