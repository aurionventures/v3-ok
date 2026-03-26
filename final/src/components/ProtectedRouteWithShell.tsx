import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import { AppShell } from './AppShell';

interface ProtectedRouteWithShellProps {
  children: React.ReactNode;
  redirectTo?: string;
  showSidebar?: boolean;
}

/**
 * ProtectedRouteWithShell - Combina ProtectedRoute + AppShell
 * Garante que rotas protegidas sempre tenham o layout correto
 * Nunca retorna null durante loading
 */
export function ProtectedRouteWithShell({ 
  children, 
  redirectTo = '/login',
  showSidebar = true 
}: ProtectedRouteWithShellProps) {
  return (
    <ProtectedRoute redirectTo={redirectTo}>
      <AppShell showSidebar={showSidebar}>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}
