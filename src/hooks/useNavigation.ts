import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

/**
 * Hook personalizado para navegação não-bloqueante
 * Usa startTransition para evitar suspensão durante input síncrono
 */
export function useNavigation() {
  const navigate = useNavigate();

  const navigateTo = (to: string | number, options?: { replace?: boolean; state?: any }) => {
    startTransition(() => {
      if (typeof to === 'string') {
        navigate(to, options);
      } else {
        navigate(to);
      }
    });
  };

  return { navigate: navigateTo, navigateTo };
}
