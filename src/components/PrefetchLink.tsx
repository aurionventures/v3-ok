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
      // CRÍTICO: Atualizar DOM diretamente ANTES de qualquer coisa
      // Isso garante que o overlay aparece antes do React Router processar
      const overlay = document.getElementById('navigation-overlay');
      if (overlay) {
        // Criar skeleton HTML diretamente no DOM para máxima velocidade
        if (!overlay.innerHTML) {
          overlay.innerHTML = '<div style="min-height: 100vh; background-color: hsl(210, 50%, 98%); padding: 1.5rem;"><div style="max-width: 1200px; margin: 0 auto;"><div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;"><div style="height: 2rem; width: 12rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div><div style="height: 2.5rem; width: 8rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div></div><div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;"><div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white;"><div style="height: 1rem; width: 6rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem; margin-bottom: 0.75rem;"></div><div style="height: 2rem; width: 4rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem; margin-bottom: 0.5rem;"></div><div style="height: 0.75rem; width: 100%; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div></div></div></div><style>@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }</style>';
        }
        overlay.style.display = 'block';
        // Forçar reflow para garantir que o navegador renderize
        overlay.offsetHeight;
      }
      
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
