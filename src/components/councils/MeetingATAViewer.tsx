import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Sparkles, Calendar, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { MeetingSchedule, MeetingATA } from '@/types/annualSchedule';
import { Skeleton } from '@/components/ui/skeleton';
import { useMeetingNotifications } from '@/hooks/useMeetingNotifications';

interface MeetingATAViewerProps {
  meeting: MeetingSchedule;
  isOpen: boolean;
  onClose: () => void;
  onGenerateATA: () => Promise<void>;
  isGenerating: boolean;
}

export default function MeetingATAViewer({ 
  meeting, 
  isOpen,
  onClose,
  onGenerateATA,
  isGenerating
}: MeetingATAViewerProps) {
  const hasATA = !!meeting.ata;
  const { sendATAGeneratedNotification } = useMeetingNotifications();

  const handleGenerate = async () => {
    await onGenerateATA();
    
    // Notificar sobre ATA gerada
    await sendATAGeneratedNotification(
      meeting.id,
      meeting.title || `${meeting.council} - ${meeting.type}`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ata da Reunião - {meeting.council}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {meeting.date} às {meeting.time}
            </Badge>
            <Badge variant="secondary">{meeting.type}</Badge>
            <Badge>{meeting.status}</Badge>
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
              <div className="text-center">
                <p className="font-medium text-lg">Gerando ATA com IA...</p>
                <p className="text-sm text-muted-foreground">
                  Isso pode levar alguns segundos. Estamos processando todos os dados da reunião.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : !hasATA ? (
          <div className="py-8">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">ATA ainda não gerada</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Utilize nossa IA para gerar automaticamente uma ATA formal e profissional 
                    baseada em todos os dados da reunião: pauta, participantes, decisões e tarefas.
                  </p>
                </div>
                <Button onClick={handleGenerate} size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Gerar ATA Automaticamente
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Cabeçalho da ATA */}
            <div className="text-center space-y-2 pb-4 border-b">
              <h2 className="text-2xl font-bold">ATA DE REUNIÃO</h2>
              <p className="text-lg font-semibold">{meeting.council}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Data: {new Date(meeting.date).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
                <span>•</span>
                <span>Horário: {meeting.time}</span>
                <span>•</span>
                <span>Modalidade: {meeting.modalidade}</span>
              </div>
            </div>

            {/* Participantes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h3 className="font-semibold">Participantes Presentes</h3>
              </div>
              <div className="pl-6">
                <ul className="space-y-1">
                  {meeting.participants?.filter(p => p.confirmed).map(p => (
                    <li key={p.id} className="text-sm">
                      • {p.external_name || 'Membro'} - {p.role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator />

            {/* Resumo Executivo */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Resumo Executivo</h3>
              <p className="text-sm leading-relaxed text-justify">
                {meeting.ata.summary}
              </p>
            </div>

            <Separator />

            {/* Decisões Tomadas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <h3 className="font-semibold text-lg">Decisões e Deliberações</h3>
              </div>
              <ol className="space-y-2 pl-6">
                {meeting.ata.decisions.map((decision, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{idx + 1}.</span> {decision}
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            {/* Tarefas Atribuídas */}
            {meeting.meeting_tasks && meeting.meeting_tasks.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Tarefas Atribuídas</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Tarefa</th>
                          <th className="text-left p-3 font-medium">Responsável</th>
                          <th className="text-left p-3 font-medium">Prazo</th>
                          <th className="text-left p-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meeting.meeting_tasks.map(task => (
                          <tr key={task.id} className="border-t">
                            <td className="p-3">{task.title}</td>
                            <td className="p-3">{task.responsible}</td>
                            <td className="p-3">{new Date(task.deadline).toLocaleDateString('pt-BR')}</td>
                            <td className="p-3">
                              <Badge variant={
                                task.status === 'Concluída' ? 'default' : 
                                task.status === 'Em Andamento' ? 'secondary' : 
                                'outline'
                              }>
                                {task.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Próximos Assuntos */}
            {meeting.nextMeetingTopics && meeting.nextMeetingTopics.length > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <h3 className="font-semibold text-lg">Assuntos para Próxima Reunião</h3>
                  </div>
                  <ul className="space-y-1 pl-6">
                    {meeting.nextMeetingTopics.map((topic, idx) => (
                      <li key={idx} className="text-sm">• {topic}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
              </>
            )}

            {/* Metadados */}
            <div className="pt-4 border-t text-xs text-muted-foreground text-center space-y-1">
              <p>
                ATA gerada em {new Date(meeting.ata.generatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p>Por: {meeting.ata.generatedBy}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {hasATA && !isGenerating && (
            <Button variant="outline" onClick={onGenerateATA} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Regenerar ATA
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
