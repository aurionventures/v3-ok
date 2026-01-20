import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLoader } from './ScreenLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute - Guard de autenticação otimizado
 * Mostra spinner APENAS no primeiro carregamento da aplicação
 * Não mostra spinner em navegações subsequentes entre páginas protegidas
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Marcar verificação inicial como completa após primeiro load
  useEffect(() => {
    if (!loading) {
      setInitialCheckDone(true);
    }
  }, [loading]);

  // Mostrar spinner APENAS no primeiro carregamento da aplicação
  // Se já passou pela verificação inicial, não mostrar mais em navegações
  if (loading && !initialCheckDone) {
    return <ScreenLoader variant="default" />;
  }

  // Allow access to plan-activation if user came from quiz (has quiz_result)
  const hasQuizResult = localStorage.getItem('quiz_result');
  const isActivationRoute = location.pathname === '/plan-activation';
  
  if (!user && hasQuizResult && isActivationRoute) {
    // User came from quiz - allow access to activation page
    return <>{children}</>;
  }

  // Se não há usuário logado, redireciona para a página de login
  // Só redireciona após loading=false e user=null confirmado
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se há usuário logado, renderiza o componente filho
  return <>{children}</>;
};

export default ProtectedRoute;
