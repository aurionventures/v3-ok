import { useState } from "react";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, FileText, CalendarDays } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MemberAgendaModal } from "@/components/member/MemberAgendaModal";
import { MemberMaterialsModal } from "@/components/member/MemberMaterialsModal";

const mockMemberMeetings = [
  {
    id: 'meeting-1',
    title: 'Reunião Ordinária',
    council: 'Conselho de Administração',
    date: addDays(new Date(), 6),
    time: '14:00',
    location: 'Sala de Reuniões 3º Andar',
    status: 'PAUTA_DEFINIDA',
    hasAgenda: true,
    hasMaterials: true
  },
  {
    id: 'meeting-2',
    title: 'Reunião Extraordinária',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), 14),
    time: '09:00',
    location: 'Virtual (Teams)',
    status: 'EM_PREPARACAO',
    hasAgenda: true,
    hasMaterials: false
  },
  {
    id: 'meeting-3',
    title: 'Reunião de Fechamento',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), 28),
    time: '10:00',
    location: 'Sala de Reuniões 2º Andar',
    status: 'AGENDADA',
    hasAgenda: false,
    hasMaterials: false
  }
];

const MemberReunioes = () => {
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<typeof mockMemberMeetings[0] | null>(null);

  const handleViewAgenda = (meeting: typeof mockMemberMeetings[0]) => {
    setSelectedMeeting(meeting);
    setAgendaModalOpen(true);
  };

  const handleViewMaterials = (meeting: typeof mockMemberMeetings[0]) => {
    setSelectedMeeting(meeting);
    setMaterialsModalOpen(true);
  };

  return (
    <MemberLayout 
      title="Próximas Reuniões"
      subtitle="Suas reuniões agendadas"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <CalendarDays className="h-7 w-7 text-primary" />
            Reuniões Agendadas
            <Badge variant="secondary" className="text-base px-3 py-1 ml-2">
              {mockMemberMeetings.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {mockMemberMeetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-xl border-2 bg-card hover:bg-accent/50 transition-colors gap-5"
            >
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{meeting.council}</p>
                  <p className="text-lg font-medium text-foreground/80">{meeting.title}</p>
                  <p className="text-base text-muted-foreground mt-1">
                    {format(meeting.date, "dd/MM/yyyy", { locale: ptBR })} às {meeting.time} • {meeting.location}
                  </p>
                  <Badge variant="secondary" className="mt-3 text-sm px-4 py-1.5">
                    {meeting.status === 'PAUTA_DEFINIDA' ? 'Pauta Definida' : 
                     meeting.status === 'EM_PREPARACAO' ? 'Em Preparação' : 'Agendada'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                {meeting.hasAgenda && (
                  <Button variant="outline" size="lg" onClick={() => handleViewAgenda(meeting)} className="text-base h-12 px-6">
                    <Eye className="h-5 w-5 mr-2" />
                    Ver Pauta
                  </Button>
                )}
                {meeting.hasMaterials && (
                  <Button variant="outline" size="lg" onClick={() => handleViewMaterials(meeting)} className="text-base h-12 px-6">
                    <FileText className="h-5 w-5 mr-2" />
                    Materiais
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <MemberAgendaModal
        open={agendaModalOpen}
        onClose={() => setAgendaModalOpen(false)}
        meeting={selectedMeeting ? {
          title: selectedMeeting.title,
          council: selectedMeeting.council,
          date: format(selectedMeeting.date, "dd/MM/yyyy"),
          time: selectedMeeting.time
        } : null}
      />
      <MemberMaterialsModal
        open={materialsModalOpen}
        onClose={() => setMaterialsModalOpen(false)}
        meeting={selectedMeeting ? {
          title: selectedMeeting.title,
          council: selectedMeeting.council,
          date: format(selectedMeeting.date, "dd/MM/yyyy")
        } : null}
      />
    </MemberLayout>
  );
};

export default MemberReunioes;
