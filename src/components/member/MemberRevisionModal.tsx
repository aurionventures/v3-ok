import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Send, FileText, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { ATA_SECTIONS, ATASectionType } from '@/types/ataRevision';
import { useATARevisions } from '@/hooks/useATARevisions';

interface RevisionItem {
  id: string;
  section: ATASectionType;
  sectionLabel: string;
  originalText: string;
  suggestedText: string;
  reason: string;
}

interface MemberRevisionModalProps {
  open: boolean;
  onClose: () => void;
  meetingId: string;
  meetingTitle: string;
  ataContent: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  onSubmitComplete: () => void;
}

export const MemberRevisionModal: React.FC<MemberRevisionModalProps> = ({
  open,
  onClose,
  meetingId,
  meetingTitle,
  ataContent,
  participantId,
  participantName,
  participantEmail,
  onSubmitComplete,
}) => {
  const [suggestions, setSuggestions] = useState<RevisionItem[]>([]);
  const [currentSection, setCurrentSection] = useState<ATASectionType>('deliberations');
  const [originalText, setOriginalText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addMultipleSuggestions } = useATARevisions();

  const handleAddSuggestion = () => {
    if (!originalText.trim() || !suggestedText.trim() || !reason.trim()) {
      toast.error('Preencha todos os campos da sugestão');
      return;
    }

    const sectionLabel = ATA_SECTIONS.find(s => s.value === currentSection)?.label || '';
    
    setSuggestions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        section: currentSection,
        sectionLabel,
        originalText: originalText.trim(),
        suggestedText: suggestedText.trim(),
        reason: reason.trim(),
      },
    ]);

    setOriginalText('');
    setSuggestedText('');
    setReason('');
    toast.success('Sugestão adicionada');
  };

  const handleRemoveSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = async () => {
    if (suggestions.length === 0) {
      toast.error('Adicione ao menos uma sugestão de revisão');
      return;
    }

    setSubmitting(true);
    try {
      await addMultipleSuggestions(
        suggestions.map(s => ({
          meetingId,
          participantId,
          participantName,
          participantEmail,
          section: s.section,
          sectionLabel: s.sectionLabel,
          originalText: s.originalText,
          suggestedText: s.suggestedText,
          reason: s.reason,
        }))
      );

      toast.success(`${suggestions.length} sugestão(ões) enviada(s) com sucesso`);
      setSuggestions([]);
      onSubmitComplete();
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar sugestões');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (suggestions.length > 0) {
      if (!confirm('Você tem sugestões não enviadas. Deseja sair mesmo assim?')) {
        return;
      }
    }
    setSuggestions([]);
    setOriginalText('');
    setSuggestedText('');
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit3 className="h-5 w-5" />
            Solicitar Revisão da ATA
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{meetingTitle}</p>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
          {/* Lado Esquerdo: Conteúdo da ATA */}
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-sm">Conteúdo da ATA</span>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
                {ataContent || 'Conteúdo da ATA não disponível'}
              </div>
            </ScrollArea>
          </div>

          {/* Lado Direito: Formulário de Sugestões */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Lista de sugestões adicionadas */}
            {suggestions.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="font-medium text-sm">
                    Sugestões Adicionadas ({suggestions.length})
                  </span>
                </div>
                <ScrollArea className="max-h-[200px]">
                  <div className="p-2 space-y-2">
                    {suggestions.map((s, idx) => (
                      <Card key={s.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {idx + 1}. {s.sectionLabel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {s.suggestedText}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveSuggestion(s.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Formulário Nova Sugestão */}
            <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
              <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium text-sm">Nova Sugestão</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Seção da ATA</Label>
                    <Select value={currentSection} onValueChange={(v) => setCurrentSection(v as ATASectionType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ATA_SECTIONS.map(section => (
                          <SelectItem key={section.value} value={section.value}>
                            {section.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Texto Original (copie da ATA)</Label>
                    <Textarea
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      placeholder="Cole aqui o trecho que deseja alterar..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Sua Sugestão de Alteração</Label>
                    <Textarea
                      value={suggestedText}
                      onChange={(e) => setSuggestedText(e.target.value)}
                      placeholder="Escreva como ficaria o texto corrigido..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Justificativa</Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explique o motivo da alteração..."
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleAddSuggestion}
                    className="w-full"
                    variant="outline"
                    disabled={!originalText.trim() || !suggestedText.trim() || !reason.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Sugestão
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {suggestions.length === 0
              ? 'Adicione ao menos uma sugestão para enviar'
              : `${suggestions.length} sugestão(ões) pronta(s) para envio`}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={suggestions.length === 0 || submitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Enviando...' : 'Enviar Sugestões'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
