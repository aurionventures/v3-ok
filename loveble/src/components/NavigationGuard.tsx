import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * NavigationGuard - Intercepta cliques em links ANTES do React Router processar
 * Mostra overlay instantaneamente para evitar tela branca
 */
export function NavigationGuard() {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previousPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    // Criar overlay uma vez - CRÍTICO: deve estar sempre pronto
    if (!overlayRef.current) {
      overlayRef.current = document.createElement('div');
      overlayRef.current.id = 'nav-overlay-instant';
      overlayRef.current.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background-color: hsl(210, 50%, 98%);
        pointer-events: auto;
        opacity: 0;
        display: none;
        overflow: auto;
      `;
      // Adicionar skeleton HTML diretamente
      overlayRef.current.innerHTML = `
        <div style="min-height: 100vh; padding: 1.5rem; background-color: hsl(210, 50%, 98%);">
          <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
              <div style="height: 2rem; width: 12rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div>
              <div style="height: 2.5rem; width: 8rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
              ${Array.from({ length: 4 }).map(() => `
                <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white;">
                  <div style="height: 1rem; width: 6rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem; margin-bottom: 0.75rem;"></div>
                  <div style="height: 2rem; width: 4rem; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem; margin-bottom: 0.5rem;"></div>
                  <div style="height: 0.75rem; width: 100%; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem;"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <style>
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        </style>
      `;
      document.body.appendChild(overlayRef.current);
    }

    // Interceptar TODOS os cliques em links ANTES do React Router
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const pathname = url.pathname;
          
          // Só interceptar se for uma rota interna
          if (url.origin === window.location.origin && pathname !== location.pathname) {
            // CRÍTICO: Mostrar overlay IMEDIATAMENTE (síncrono, antes de qualquer coisa)
            // Usar manipulação direta do DOM para máxima velocidade
            if (overlayRef.current) {
              const overlay = overlayRef.current;
              
              // CRÍTICO: Mostrar ANTES de qualquer processamento
              // Usar style direto para máxima velocidade
              overlay.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 99999;
                background-color: hsl(210, 50%, 98%);
                pointer-events: auto;
                opacity: 1;
                width: 100%;
                height: 100%;
                display: block;
                overflow: auto;
                visibility: visible;
              `;
              
              // Forçar reflow síncrono para garantir renderização IMEDIATA
              // Isso força o navegador a renderizar o overlay antes de processar o clique
              overlay.offsetHeight;
            }
          }
        } catch (err) {
          // Ignorar erros de URL parsing
        }
      }
    };

    // Usar capture phase para interceptar ANTES do React Router
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [location.pathname]);

  // Esconder overlay quando a rota mudar
  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      previousPathRef.current = location.pathname;
      
      // Delay maior para garantir que o componente renderizou completamente
      // Aguardar até que o RouteCache tenha terminado a transição
      const timer = setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.style.opacity = '0';
          overlayRef.current.style.pointerEvents = 'none';
          setTimeout(() => {
            if (overlayRef.current) {
              overlayRef.current.style.display = 'none';
            }
          }, 200);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return null;
}
