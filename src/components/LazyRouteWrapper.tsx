import { Suspense, ReactNode } from 'react';
import { ScreenLoader } from '@/components/ScreenLoader';
import ErrorBoundary from '@/components/ErrorBoundary';

interface LazyRouteWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper simplificado para rotas lazy
 * Apenas Suspense + ErrorBoundary + background consistente
 */
export function LazyRouteWrapper({ children }: LazyRouteWrapperProps) {
  // Fallback sempre renderiza algo, nunca null
  const fallback = <ScreenLoader variant="default" />;

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: 'hsl(210, 50%, 98%)', width: '100%' }}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
