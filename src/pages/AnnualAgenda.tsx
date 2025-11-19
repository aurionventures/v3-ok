import React, { useState } from "react";
import { Calendar, TrendingUp, Clock, CheckCircle2, CalendarDays, Settings, Filter } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAnnualSchedule } from "@/hooks/useAnnualSchedule";
import { AnnualCalendar } from "@/components/councils/AnnualCalendar";
import { MeetingFlowManager } from "@/components/councils/MeetingFlowManager";
import AnnualCalendarWizard from "@/components/councils/AnnualCalendarWizard";
import { MeetingSchedule } from "@/types/annualSchedule";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMeetings } from "@/hooks/useMeetings";
import { useCouncils } from "@/hooks/useCouncils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OrganSelector } from "@/components/governance/OrganSelector";
import { Building2, Users, UserCog } from "lucide-react";
import { QuickActionsCard } from "@/components/councils/QuickActionsCard";
import { QuickAddGuestModal } from "@/components/councils/QuickAddGuestModal";
import { useCalendarFilters } from "@/hooks/useCalendarFilters";
import { useGovernanceOrgans } from "@/hooks/useGovernanceOrgans";
import MeetingQuickConfigModal from "@/components/councils/MeetingQuickConfigModal";
import { format } from "date-fns";

const AnnualAgenda = () => {
  const { toast } = useToast();
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingSchedule | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [createdMeetingTitle, setCreatedMeetingTitle] = useState<string>("");
  const [isQuickAddGuestModalOpen, setIsQuickAddGuestModalOpen] = useState(false);
  const [isQuickConfigModalOpen, setIsQuickConfigModalOpen] = useState(false);
  const [selectedMeetingForConfig, setSelectedMeetingForConfig] = useState<MeetingSchedule | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    organ_type: "" as 'conselho' | 'comite' | 'comissao' | "",
    council_id: "",
    title: "",
    date: "",
    time: "",
    type: "",
    location: "",
    modalidade: "Presencial"
  });

  const {
    schedule,
    loading: scheduleLoading,
    updateMeeting,
    addMeeting,
    addMultipleMeetings,
    deleteMeeting,
    getNextMeeting,
    getAgendaProgress,
    getATAProgress,
    getPendingTasks,
  } = useAnnualSchedule();

  const { councils, loading: councilsLoading } = useCouncils();
  const { createMeeting, loading: creatingMeeting } = useMeetings();
  
  // Filters
  const { filters, setFilters, filteredMeetings } = useCalendarFilters(schedule?.meetings || []);
  const { organs } = useGovernanceOrgans(filters.organType !== 'all' ? (filters.organType as any) : undefined);

  // Debug log
  console.log("📅 AnnualAgenda component - schedule:", schedule);
  console.log("📅 AnnualAgenda component - loading:", scheduleLoading);
  console.log("🔍 Filtered meetings:", filteredMeetings.length);

  const handleMeetingClick = (meeting: MeetingSchedule) => {
    setSelectedMeeting(meeting);
    setIsMeetingModalOpen(true);
  };

  const handleDateClick = (date: Date, meeting?: MeetingSchedule) => {
    if (meeting) {
      // Abrir modal de configuração rápida
      setSelectedMeetingForConfig(meeting);
      setIsQuickConfigModalOpen(true);
    } else {
      // Abrir modal de nova reunião com data pré-preenchida
      setMeetingForm({
        ...meetingForm,
        date: format(date, 'yyyy-MM-dd')
      });
      setIsNewMeetingModalOpen(true);
    }
  };

  const handleSaveQuickConfig = async (updates: Partial<MeetingSchedule>) => {
    if (selectedMeetingForConfig) {
      await updateMeeting(selectedMeetingForConfig.id, updates);
      toast({
        title: "Reunião Atualizada",
        description: "Configurações salvas com sucesso!"
      });
      setIsQuickConfigModalOpen(false);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      // Validação
      if (!meetingForm.council_id || !meetingForm.title || !meetingForm.date || !meetingForm.time || !meetingForm.type) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios (Conselho, Título, Data, Hora e Tipo).",
          variant: "destructive"
        });
        return;
      }

      // Criar reunião no banco de dados
      const newMeeting = await createMeeting({
        council_id: meetingForm.council_id,
        title: meetingForm.title,
        date: meetingForm.date,
        time: meetingForm.time,
        type: meetingForm.type as 'Ordinária' | 'Extraordinária',
        location: meetingForm.location || undefined
      });

      // Adicionar também ao localStorage (para sincronizar com a agenda anual)
      const councilName = councils.find(c => c.id === meetingForm.council_id)?.name || "Conselho";
      
      addMeeting({
        council: councilName,
        date: meetingForm.date,
        time: meetingForm.time,
        type: meetingForm.type as 'Ordinária' | 'Extraordinária',
        status: "Agendada",
        modalidade: meetingForm.modalidade as 'Presencial' | 'Online' | 'Híbrida',
        location: meetingForm.location,
        agenda: [],
        nextMeetingTopics: []
      });

      toast({
        title: "Reunião criada",
        description: "A nova reunião foi agendada com sucesso na Agenda Anual.",
      });

      // Salvar título antes de limpar o formulário
      const meetingTitle = meetingForm.title;

      // Fechar modal e limpar formulário
      setIsNewMeetingModalOpen(false);
      
      // Mostrar Quick Actions se a reunião foi criada com sucesso
      if (newMeeting?.id) {
        setCreatedMeetingId(newMeeting.id);
        setCreatedMeetingTitle(meetingTitle);
        setShowQuickActions(true);
      }
      
      setMeetingForm({
        organ_type: "",
        council_id: "",
        title: "",
        date: "",
        time: "",
        type: "",
        location: "",
        modalidade: "Presencial"
      });

    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar reunião. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const nextMeeting = getNextMeeting();
  const agendaProgress = getAgendaProgress();
  const ataProgress = getATAProgress();
  const pendingTasks = getPendingTasks();

  if (scheduleLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Agenda Anual 2025" />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Carregando agenda anual...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Agenda Anual 2025" />
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Próxima Reunião
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {nextMeeting ? (
                  <div>
                    <div className="text-2xl font-bold">{nextMeeting.council}</div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(nextMeeting.date).toLocaleDateString('pt-BR')} às {nextMeeting.time}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {nextMeeting.status}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma reunião agendada
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pautas Definidas
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agendaProgress.percentage}%</div>
                <Progress value={agendaProgress.percentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Progresso de definição das pautas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  ATAs Geradas
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ataProgress.percentage}%</div>
                <Progress value={ataProgress.percentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Reuniões com ATA finalizada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tarefas Pendentes
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tarefas aguardando conclusão
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={() => setIsWizardOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar Calendário Anual
            </Button>
            <Button 
              onClick={() => setIsNewMeetingModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Nova Reunião
            </Button>
          </div>

          {/* Annual Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendário Anual de Reuniões
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule && schedule.meetings ? (
                <AnnualCalendar 
                  meetings={schedule.meetings}
                  onMeetingClick={handleMeetingClick}
                  onUpdateMeeting={updateMeeting}
                />
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma reunião encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Flow Manager Modal */}
          {selectedMeeting && (
            <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Gestão da Reunião - {selectedMeeting?.council}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedMeeting?.date ? new Date(selectedMeeting.date).toLocaleDateString('pt-BR') : ''} às {selectedMeeting?.time}
                  </DialogDescription>
                </DialogHeader>
                <MeetingFlowManager
                  meeting={selectedMeeting}
                  onUpdateMeeting={(updates) => {
                    updateMeeting(selectedMeeting.id, updates);
                    setSelectedMeeting(prev => prev ? { ...prev, ...updates } : null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Calendar Wizard Modal */}
          <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurador de Calendário Anual</DialogTitle>
                <DialogDescription>
                  Crie automaticamente o calendário de reuniões para o ano todo
                </DialogDescription>
              </DialogHeader>
              <AnnualCalendarWizard
                onClose={() => setIsWizardOpen(false)}
                onComplete={(meetings) => {
                  addMultipleMeetings(meetings);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Quick Actions Card */}
          {showQuickActions && createdMeetingId && (
            <QuickActionsCard
              meetingId={createdMeetingId}
              meetingTitle={createdMeetingTitle}
              onAddGuest={() => setIsQuickAddGuestModalOpen(true)}
              onClose={() => {
                setShowQuickActions(false);
                setCreatedMeetingId(null);
                setCreatedMeetingTitle("");
              }}
            />
          )}

          {/* Quick Add Guest Modal */}
          <QuickAddGuestModal
            open={isQuickAddGuestModalOpen}
            onOpenChange={setIsQuickAddGuestModalOpen}
            meetingId={createdMeetingId || ""}
            meetingTitle={createdMeetingTitle}
          />

          {/* New Meeting Modal */}
          <Dialog open={isNewMeetingModalOpen} onOpenChange={setIsNewMeetingModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
                <DialogDescription>
                  Preencha os dados para agendar uma nova reunião
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Tipo de Órgão */}
                <div className="grid gap-2">
                  <Label htmlFor="organ_type">Tipo de Órgão *</Label>
                  <Select
                    value={meetingForm.organ_type}
                    onValueChange={(value: 'conselho' | 'comite' | 'comissao' | '') => {
                      setMeetingForm(prev => ({ ...prev, organ_type: value, council_id: "" }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de órgão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conselho">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          Conselho
                        </div>
                      </SelectItem>
                      <SelectItem value="comite">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          Comitê
                        </div>
                      </SelectItem>
                      <SelectItem value="comissao">
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-amber-500" />
                          Comissão
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Órgão Específico */}
                {meetingForm.organ_type && (
                  <div className="grid gap-2">
                    <Label htmlFor="council_id">Órgão *</Label>
                    <OrganSelector
                      value={meetingForm.council_id}
                      onValueChange={(id) => setMeetingForm(prev => ({ ...prev, council_id: id }))}
                      organType={meetingForm.organ_type}
                      placeholder={`Selecione o ${meetingForm.organ_type}`}
                    />
                  </div>
                )}

                {/* Título */}
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da Reunião *</Label>
                  <Input
                    id="title"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Reunião Ordinária de Janeiro"
                  />
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Hora *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Tipo e Modalidade */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={meetingForm.type}
                      onValueChange={(value) => setMeetingForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ordinária">Ordinária</SelectItem>
                        <SelectItem value="Extraordinária">Extraordinária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="modalidade">Modalidade</Label>
                    <Select
                      value={meetingForm.modalidade}
                      onValueChange={(value) => setMeetingForm(prev => ({ ...prev, modalidade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Híbrida">Híbrida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Local */}
                <div className="grid gap-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ex: Sala de Reuniões - 3º Andar"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewMeetingModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateMeeting} disabled={creatingMeeting}>
                  {creatingMeeting ? "Criando..." : "Criar Reunião"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AnnualAgenda;