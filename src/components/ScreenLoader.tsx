import React from 'react';
import { PageSkeleton } from './ui/page-skeleton';

interface ScreenLoaderProps {
  variant?: 'dashboard' | 'form' | 'list' | 'default';
  message?: string;
}

/**
 * ScreenLoader - Loader de tela cheia
 * Sempre renderiza algo, nunca retorna null
 * Usado como fallback de Suspense e estados de loading
 */
export function ScreenLoader({ variant = 'default', message }: ScreenLoaderProps) {
  return (
    <div className="min-h-screen bg-background w-full">
      <PageSkeleton variant={variant} />
      {message && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}
    </div>
  );
}
