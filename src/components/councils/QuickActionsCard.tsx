import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, Eye, X } from 'lucide-react';

interface QuickActionsCardProps {
  meetingId: string;
  meetingTitle: string;
  onAddGuest: () => void;
  onClose: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  meetingId,
  meetingTitle,
  onAddGuest,
  onClose
}) => {
  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl border-2 border-primary/20 z-50 animate-in slide-in-from-bottom-5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">Reunião Criada!</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{meetingTitle}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <p className="text-sm text-muted-foreground mb-3">
          Próximos passos:
        </p>
        
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onAddGuest}
        >
          <UserPlus className="h-4 w-4" />
          Adicionar Convidados
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => window.location.href = `/reunioes/${meetingId}`}
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes Completos
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => window.location.href = `/reunioes/${meetingId}?tab=pauta`}
        >
          <FileText className="h-4 w-4" />
          Definir Pauta
        </Button>
      </CardContent>
    </Card>
  );
};
