import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para pré-carregar rotas mais usadas
 * Carrega as rotas principais quando o usuário está no dashboard
 */
export function useRoutePrefetch() {
  const location = useLocation();

  useEffect(() => {
    // Só pré-carregar se estiver no dashboard ou em rotas principais
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      // Pré-carregar rotas mais usadas em background
      const routesToPrefetch = [
        () => import('../pages/GovernanceConfig'),
        () => import('../pages/DocumentChecklist'),
        () => import('../pages/Maturity'),
        () => import('../pages/ESG'),
        () => import('../pages/AnnualAgenda'),
        () => import('../pages/Reunioes'),
        () => import('../pages/SecretariatPanel'),
        () => import('../pages/ShareholderStructure'),
        () => import('../pages/CapTable'),
        () => import('../pages/Interviews'),
        () => import('../pages/InitialReport'),
      ];

      // Pré-carregar após um pequeno delay para não bloquear o carregamento inicial
      const timeoutId = setTimeout(() => {
        routesToPrefetch.forEach((prefetch) => {
          // Usar requestIdleCallback se disponível, senão usar setTimeout
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              prefetch().catch(() => {
                // Ignorar erros de prefetch
              });
            });
          } else {
            setTimeout(() => {
              prefetch().catch(() => {
                // Ignorar erros de prefetch
              });
            }, 100);
          }
        });
      }, 2000); // Aguardar 2 segundos após carregar o dashboard

      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);
}

/**
 * Função para pré-carregar uma rota específica
 */
export function prefetchRoute(importFn: () => Promise<any>) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(() => {
        // Ignorar erros de prefetch
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(() => {
        // Ignorar erros de prefetch
      });
    }, 0);
  }
}
