import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Send } from 'lucide-react';
import { MeetingSchedule, AgendaItem, MeetingParticipant } from '@/types/annualSchedule';
import AgendaBuilder from './AgendaBuilder';
import ParticipantsManager from './ParticipantsManager';
import { DocumentUploadWithTags } from './DocumentUploadWithTags';
import { useMeetingNotifications } from '@/hooks/useMeetingNotifications';
import { toast } from 'sonner';

interface MeetingQuickConfigModalProps {
  meeting: MeetingSchedule;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MeetingSchedule>) => void;
}

export default function MeetingQuickConfigModal({ 
  meeting, 
  isOpen, 
  onClose, 
  onSave 
}: MeetingQuickConfigModalProps) {
  const [agenda, setAgenda] = useState<AgendaItem[]>(meeting.agenda || []);
  const [participants, setParticipants] = useState<MeetingParticipant[]>(meeting.participants || []);
  const { sendMeetingInvites } = useMeetingNotifications();

  const handleSave = async () => {
    const updates: Partial<MeetingSchedule> = {
      agenda,
      participants,
      confirmed_participants: participants.filter(p => p.confirmed).length,
      status: agenda.length > 0 ? 'Pauta Definida' : meeting.status,
    };

    // Salvar configurações
    onSave(updates);

    // Enviar notificações
    if (participants.length > 0) {
      await sendMeetingInvites(
        meeting.id,
        meeting.council,
        meeting.date,
        meeting.time,
        participants
      );
      
      updates.notifications_sent = true;
    }

    toast.success('Reunião configurada com sucesso');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Reunião - {meeting.council}</DialogTitle>
          <DialogDescription className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {meeting.date} às {meeting.time}
              </Badge>
              <Badge variant="secondary">{meeting.modalidade}</Badge>
              <Badge>{meeting.type}</Badge>
              {meeting.organ_type && (
                <Badge variant="outline">
                  {meeting.organ_type === 'conselho' ? 'Conselho' :
                   meeting.organ_type === 'comite' ? 'Comitê' : 'Comissão'}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pauta" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pauta" className="gap-2">
              <FileText className="h-4 w-4" />
              Pauta
              {agenda.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {agenda.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="participantes" className="gap-2">
              <Users className="h-4 w-4" />
              Participantes
              {participants.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {participants.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documentos" className="gap-2">
              <FileText className="h-4 w-4" />
              Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pauta" className="mt-4">
            <AgendaBuilder 
              agenda={agenda}
              onUpdate={setAgenda}
            />
          </TabsContent>

          <TabsContent value="participantes" className="mt-4">
            <ParticipantsManager
              meetingId={meeting.id}
              councilId={meeting.council_id}
              organType={meeting.organ_type}
              participants={participants}
              onUpdate={setParticipants}
            />
          </TabsContent>

          <TabsContent value="documentos" className="mt-4">
            <DocumentUploadWithTags
              documents={meeting.preMeetingDocs || []}
              onDocumentAdd={(doc) => {
                toast.success('Documento enviado com sucesso');
              }}
              onDocumentRemove={(docId) => {
                toast.success('Documento removido');
              }}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Send className="h-4 w-4" />
            Salvar e Enviar Convites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
