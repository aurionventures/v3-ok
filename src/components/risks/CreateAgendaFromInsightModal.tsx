import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgendaSuggestion } from '@/types/riskIntelligence';
import { useGovernanceOrgans } from '@/hooks/useGovernanceOrgans';
import { useMeetings } from '@/hooks/useMeetings';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreateAgendaFromInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: AgendaSuggestion;
  onConfirm: (suggestion: AgendaSuggestion, councilId: string, meetingId?: string) => Promise<any>;
}

export const CreateAgendaFromInsightModal = ({
  isOpen,
  onClose,
  suggestion,
  onConfirm,
}: CreateAgendaFromInsightModalProps) => {
  const { organs } = useGovernanceOrgans();
  const { meetings } = useMeetings();
  
  const [selectedOrgan, setSelectedOrgan] = useState<string>('');
  const [selectedMeeting, setSelectedMeeting] = useState<string>('new');
  const [isCreating, setIsCreating] = useState(false);

  const filteredOrgans = organs.filter(organ => {
    if (suggestion.suggestedOrgan === 'conselho') return organ.organ_type === 'conselho';
    if (suggestion.suggestedOrgan === 'comite') return organ.organ_type === 'comite';
    if (suggestion.suggestedOrgan === 'comissao') return organ.organ_type === 'comissao';
    return true;
  });

  const upcomingMeetings = selectedOrgan ? meetings.filter(
    m => m.council_id === selectedOrgan && new Date(m.date) >= new Date()
  ) : [];

  const handleConfirm = async () => {
    if (!selectedOrgan) return;
    
    setIsCreating(true);
    try {
      await onConfirm(
        suggestion,
        selectedOrgan, 
        selectedMeeting === 'new' ? undefined : selectedMeeting
      );
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  const priorityColors = {
    urgent: 'bg-destructive',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  const priorityLabels = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Criar Pauta a partir de Insight
          </DialogTitle>
          <DialogDescription>
            Configure a reunião onde esta pauta será incluída
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview da Sugestão */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
              <Badge className={`${priorityColors[suggestion.priority]} text-white`}>
                {priorityLabels[suggestion.priority]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Pontos de Discussão:</p>
              <ul className="space-y-1">
                {suggestion.discussionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Seleção de Órgão */}
          <div className="space-y-2">
            <Label htmlFor="organ">Órgão de Governança</Label>
            <Select value={selectedOrgan} onValueChange={setSelectedOrgan}>
              <SelectTrigger id="organ">
                <SelectValue placeholder="Selecione o órgão" />
              </SelectTrigger>
              <SelectContent>
                {filteredOrgans.map((organ) => (
                  <SelectItem key={organ.id} value={organ.id}>
                    {organ.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {suggestion.suggestedOrgan && (
              <p className="text-xs text-muted-foreground">
                Sugestão da IA: {suggestion.organName}
              </p>
            )}
          </div>

          {/* Seleção de Reunião */}
          {selectedOrgan && (
            <div className="space-y-2">
              <Label htmlFor="meeting">Reunião</Label>
              <Select value={selectedMeeting} onValueChange={setSelectedMeeting}>
                <SelectTrigger id="meeting">
                  <SelectValue placeholder="Selecione a reunião" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Criar Nova Reunião</SelectItem>
                  {upcomingMeetings.map((meeting) => (
                    <SelectItem key={meeting.id} value={meeting.id}>
                      {meeting.title} - {new Date(meeting.date).toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedOrgan || isCreating}
            >
              {isCreating ? 'Criando...' : 'Criar Pauta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
