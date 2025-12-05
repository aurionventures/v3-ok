import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Check, 
  X, 
  Edit3, 
  Clock, 
  User,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { ATARevisionSuggestion, RevisionSuggestionStatus } from '@/types/ataRevision';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ATARevisionCardProps {
  suggestion: ATARevisionSuggestion;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onModify?: (id: string) => void;
  showActions?: boolean;
}

const statusConfig: Record<RevisionSuggestionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  pending: { label: 'Pendente', variant: 'outline', className: 'border-amber-500 text-amber-600' },
  accepted: { label: 'Aceita', variant: 'default', className: 'bg-emerald-500' },
  rejected: { label: 'Recusada', variant: 'destructive' },
  modified: { label: 'Aceita com Modificação', variant: 'secondary', className: 'bg-blue-500 text-white' },
};

export const ATARevisionCard: React.FC<ATARevisionCardProps> = ({
  suggestion,
  selected,
  onSelect,
  onAccept,
  onReject,
  onModify,
  showActions = true,
}) => {
  const status = statusConfig[suggestion.status];
  const isPending = suggestion.status === 'pending';

  return (
    <Card className={`transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {onSelect && isPending && (
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) => onSelect(suggestion.id, !!checked)}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{suggestion.participantName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Clock className="h-3 w-3" />
                {format(new Date(suggestion.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {suggestion.sectionLabel}
            </Badge>
            <Badge variant={status.variant} className={status.className}>
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Texto Original vs Sugerido */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Texto Original:</span>
            <div className="p-2 bg-destructive/10 rounded text-sm border border-destructive/20">
              {suggestion.originalText}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Sugestão:</span>
            <div className="p-2 bg-emerald-500/10 rounded text-sm border border-emerald-500/20">
              {suggestion.suggestedText}
            </div>
          </div>
        </div>

        {/* Justificativa */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            Justificativa:
          </div>
          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
            {suggestion.reason}
          </p>
        </div>

        {/* Resposta do Admin (se processada) */}
        {suggestion.adminResponse && (
          <div className="space-y-1 border-t pt-3">
            <span className="text-xs font-medium text-muted-foreground">Resposta do Administrador:</span>
            <p className="text-sm">{suggestion.adminResponse}</p>
            {suggestion.finalText && suggestion.status === 'modified' && (
              <div className="mt-2 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Texto Final Aplicado:</span>
                <div className="p-2 bg-blue-500/10 rounded text-sm border border-blue-500/20">
                  {suggestion.finalText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        {showActions && isPending && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-emerald-600 border-emerald-500 hover:bg-emerald-50"
              onClick={() => onAccept?.(suggestion.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Aceitar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-blue-600 border-blue-500 hover:bg-blue-50"
              onClick={() => onModify?.(suggestion.id)}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modificar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onReject?.(suggestion.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Recusar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
