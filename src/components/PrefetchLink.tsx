import { Link, LinkProps } from 'react-router-dom';
import { prefetchRoute } from '@/hooks/useRoutePrefetch';
import { useMemo } from 'react';
import { useNavigationContext } from '@/contexts/NavigationContext';

/**
 * Componente Link que pré-carrega a rota ao passar o mouse
 * Reduz o delay na primeira navegação
 * Mostra skeleton imediatamente no clique
 */
export function PrefetchLink({ to, children, onClick, ...props }: LinkProps) {
  const { setNavigating, setTargetPath } = useNavigationContext();
  
  // Mapear rotas para suas funções de import
  const routePrefetchMap = useMemo(() => {
    const map: Record<string, () => Promise<any>> = {};
    
    // Rotas principais do menu
    if (typeof to === 'string') {
      switch (to) {
        case '/governance-config':
          map[to] = () => import('../pages/GovernanceConfig');
          break;
        case '/document-checklist':
          map[to] = () => import('../pages/DocumentChecklist');
          break;
        case '/maturity':
          map[to] = () => import('../pages/Maturity');
          break;
        case '/esg':
          map[to] = () => import('../pages/ESG');
          break;
        case '/annual-agenda':
          map[to] = () => import('../pages/AnnualAgenda');
          break;
        case '/reunioes':
          map[to] = () => import('../pages/Reunioes');
          break;
        case '/secretariat':
          map[to] = () => import('../pages/SecretariatPanel');
          break;
        case '/shareholder-structure':
          map[to] = () => import('../pages/ShareholderStructure');
          break;
        case '/cap-table':
          map[to] = () => import('../pages/CapTable');
          break;
        case '/interviews':
          map[to] = () => import('../pages/Interviews');
          break;
        case '/initial-report':
          map[to] = () => import('../pages/InitialReport');
          break;
        case '/governance-risk-management':
          map[to] = () => import('../pages/GovernanceRiskManagement');
          break;
        case '/copiloto-governanca':
          map[to] = () => import('../pages/GovernanceCopilot');
          break;
      }
    }
    
    return map;
  }, [to]);

  const handleMouseEnter = () => {
    if (typeof to === 'string' && routePrefetchMap[to]) {
      prefetchRoute(routePrefetchMap[to]);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Mostrar skeleton IMEDIATAMENTE no clique (síncrono, antes do React Router)
    if (typeof to === 'string') {
      // Set síncrono para aparecer antes do React Router processar
      setTargetPath(to);
      setNavigating(true);
    }
    
    // Chamar onClick original se existir
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link 
      to={to} 
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
