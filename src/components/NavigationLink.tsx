import { Link, LinkProps } from 'react-router-dom';
import { startTransition, MouseEvent } from 'react';

/**
 * Componente Link otimizado que usa startTransition para navegações não-bloqueantes
 * Evita o erro "component suspended while responding to synchronous input"
 */
export function NavigationLink({ to, onClick, children, ...props }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Usar startTransition para tornar a navegação não-bloqueante
    startTransition(() => {
      // A navegação do Link já é assíncrona, mas startTransition garante que não bloqueie
      onClick?.(e);
    });
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
