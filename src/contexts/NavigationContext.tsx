import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageSkeleton } from '@/components/ui/page-skeleton';

interface NavigationContextType {
  isNavigating: boolean;
  setNavigating: (value: boolean) => void;
  targetPath: string | null;
  setTargetPath: (path: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const location = useLocation();

  // Limpar estado de navegação quando a rota mudar
  useEffect(() => {
    if (targetPath && location.pathname === targetPath) {
      // Pequeno delay para garantir que o componente carregou
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setTargetPath(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, targetPath]);

  const setNavigating = useCallback((value: boolean) => {
    setIsNavigating(value);
  }, []);

  // Determinar tipo de skeleton baseado no caminho
  const getSkeletonVariant = (path: string): "dashboard" | "form" | "list" | "default" => {
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
    
    if (
      path.startsWith('/checkout') ||
      path.startsWith('/plan-discovery') ||
      path.startsWith('/onboarding') ||
      path.startsWith('/settings')
    ) {
      return 'form';
    }
    
    if (
      path.startsWith('/admin') ||
      path.startsWith('/reunioes') ||
      path.startsWith('/activities') ||
      path.startsWith('/monitoring')
    ) {
      return 'list';
    }
    
    return 'dashboard';
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, setNavigating, targetPath, setTargetPath }}>
      {children}
      {isNavigating && targetPath && (
        <div 
          className="fixed inset-0 z-[9999] bg-background overflow-auto"
          style={{ 
            pointerEvents: 'auto',
            opacity: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'fixed',
            width: '100%',
            height: '100%'
          }}
        >
          <PageSkeleton variant={getSkeletonVariant(targetPath)} />
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}
