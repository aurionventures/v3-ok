import { Suspense, ReactNode, useMemo, startTransition } from 'react';
import { useLocation } from 'react-router-dom';
import { PageSkeleton } from '@/components/ui/page-skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

interface LazyRouteWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper que envolve rotas lazy com Suspense e ErrorBoundary
 * Determina o tipo de skeleton baseado na rota
 * Otimizado para evitar delays e telas brancas
 */
export function LazyRouteWrapper({ children }: LazyRouteWrapperProps) {
  const location = useLocation();
  
  // Determina o tipo de skeleton baseado na rota (memoizado)
  const skeletonVariant = useMemo(() => {
    const path = location.pathname;
    
    // Rotas públicas - skeleton mais simples
    if (
      path === '/' ||
      path.startsWith('/pricing') ||
      path.startsWith('/blog') ||
      path.startsWith('/sobre') ||
      path.startsWith('/contato') ||
      path.startsWith('/como-funciona') ||
      path.startsWith('/plataforma') ||
      path.startsWith('/governanca') ||
      path.startsWith('/ai-engine') ||
      path.startsWith('/login') ||
      path.startsWith('/signup')
    ) {
      return 'default';
    }
    
    // Rotas de formulário
    if (
      path.startsWith('/checkout') ||
      path.startsWith('/plan-discovery') ||
      path.startsWith('/onboarding') ||
      path.startsWith('/settings')
    ) {
      return 'form';
    }
    
    // Rotas de lista/tabela
    if (
      path.startsWith('/admin') ||
      path.startsWith('/reunioes') ||
      path.startsWith('/activities') ||
      path.startsWith('/monitoring')
    ) {
      return 'list';
    }
    
    // Dashboard por padrão
    return 'dashboard';
  }, [location.pathname]);

  // Fallback otimizado - mostra imediatamente sem delay
  const fallback = useMemo(() => (
    <div className="min-h-screen bg-background">
      <PageSkeleton variant={skeletonVariant} />
    </div>
  ), [skeletonVariant]);

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={fallback}
        // Usar startTransition para evitar suspensão durante input síncrono
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
