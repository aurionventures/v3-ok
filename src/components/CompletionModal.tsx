import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';

interface CompletionModalProps {
  isVisible: boolean;
  isProcessing: boolean;
  email: string;
  onViewResult: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isVisible,
  isProcessing,
  email,
  onViewResult
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="max-w-md mx-4 animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
          </div>
          <CardTitle className="text-xl">
            {isProcessing ? 'Processando Diagnóstico...' : 'Diagnóstico Concluído!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isProcessing ? (
            <p className="text-muted-foreground">
              Estamos calculando seus resultados e preparando o relatório personalizado.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">
                  <Mail className="h-3 w-3 mr-1" />
                  Relatório Enviado
                </Badge>
                <p className="text-muted-foreground">
                  Seu diagnóstico completo foi enviado para:
                </p>
                <p className="font-semibold text-primary">{email}</p>
              </div>
              
              <div className="pt-4">
                <Button onClick={onViewResult} size="lg" className="w-full">
                  Mostrar Resultado
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};