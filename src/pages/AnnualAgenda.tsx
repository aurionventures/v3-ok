import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Calendar, TrendingUp, Clock, CheckCircle2, CalendarDays, Settings, Filter,
  Building2, Users, UserCog, CalendarCheck, FileText, Send, CheckCheck, 
  FileCheck, Scale, Zap, BarChart3, AlertCircle
} from "lucide-react";
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
import { QuickActionsCard } from "@/components/councils/QuickActionsCard";
import { QuickAddGuestModal } from "@/components/councils/QuickAddGuestModal";
import { useCalendarFilters } from "@/hooks/useCalendarFilters";
import { useGovernanceOrgans } from "@/hooks/useGovernanceOrgans";
import MeetingQuickConfigModal from "@/components/councils/MeetingQuickConfigModal";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticipantsManager from "@/components/councils/ParticipantsManager";
import { MeetingParticipant } from "@/types/annualSchedule";
import { useMeetingNotifications } from "@/hooks/useMeetingNotifications";
import { useAuth } from "@/contexts/AuthContext";

const AnnualAgenda = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.orgRole === 'org_admin' || !user?.orgRole;
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
  const [meetingParticipants, setMeetingParticipants] = useState<MeetingParticipant[]>([]);

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
  const { sendMeetingInvites, sendGuestInviteWithMagicLink } = useMeetingNotifications();
  
  // Filters - use URL status parameter if provided
  const { filters, setFilters, filteredMeetings } = useCalendarFilters(schedule?.meetings || [], initialStatus);
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

  const resetMeetingForm = () => {
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
    setMeetingParticipants([]);
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

      // Gerar ID mockado para modo demo
      const meetingId = crypto.randomUUID();

      // Buscar nome do órgão
      const councilName = councils.find(c => c.id === meetingForm.council_id)?.name || 
                          organs.find(o => o.id === meetingForm.council_id)?.name || 
                          "Órgão";
      
      // Criar objeto de reunião para localStorage
      const newMeetingData = {
        id: meetingId,
        council: councilName,
        council_id: meetingForm.council_id,
        organ_type: (meetingForm.organ_type || 'conselho') as 'conselho' | 'comite' | 'comissao',
        title: meetingForm.title,
        date: meetingForm.date,
        time: meetingForm.time,
        type: meetingForm.type as 'Ordinária' | 'Extraordinária',
        status: "Agendada" as const,
        modalidade: meetingForm.modalidade as 'Presencial' | 'Online' | 'Híbrida',
        location: meetingForm.location,
        agenda: [],
        nextMeetingTopics: [],
        participants: meetingParticipants
      };
      
      // Adicionar ao localStorage
      addMeeting(newMeetingData);

      toast({
        title: "✅ Reunião criada!",
        description: "A nova reunião foi agendada com sucesso.",
      });

      // Enviar convites para membros internos
      const members = meetingParticipants.filter(p => p.role === 'MEMBRO');
      if (members.length > 0) {
        await sendMeetingInvites(
          meetingId,
          meetingForm.title,
          meetingForm.date,
          meetingForm.time,
          members
        );
      }
      
      // Enviar Magic Links para convidados
      const guests = meetingParticipants.filter(p => p.role === 'CONVIDADO');
      for (const guest of guests) {
        if (guest.guest_link) {
          await sendGuestInviteWithMagicLink(
            guest.external_name!,
            guest.external_email!,
            guest.guest_link,
            meetingForm.title,
            meetingForm.date,
            meetingForm.time,
            {
              can_upload: guest.can_upload || false,
              can_view_materials: guest.can_view_materials || true
            }
          );
        }
      }
      
      if (meetingParticipants.length > 0) {
        toast({
          title: `📧 ${meetingParticipants.length} participante(s) notificado(s)`,
        });
      }

      // Salvar título antes de limpar
      const meetingTitle = meetingForm.title;

      // Fechar modal e limpar
      setIsNewMeetingModalOpen(false);
      resetMeetingForm();
      
      // Mostrar Quick Actions
      setCreatedMeetingId(meetingId);
      setCreatedMeetingTitle(meetingTitle);
      setShowQuickActions(true);

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
        <div className="flex-1 overflow-y-auto p-4">

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Próxima Reunião */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Próxima Reunião
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {nextMeeting ? (
                  <>
                    <div className="text-lg font-semibold mb-1">
                      {nextMeeting.council}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {format(new Date(nextMeeting.date), 'dd/MM/yyyy')} às {nextMeeting.time}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {nextMeeting.status}
                    </Badge>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma reunião agendada
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pautas Definidas */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pautas Definidas
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {agendaProgress.percentage}%
                </div>
                <Progress value={agendaProgress.percentage} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  {agendaProgress.defined} de {agendaProgress.total} reuniões
                </div>
              </CardContent>
            </Card>

            {/* ATAs Geradas */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ATAs Geradas
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {ataProgress.percentage}%
                </div>
                <Progress value={ataProgress.percentage} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  {ataProgress.generated} de {ataProgress.total} reuniões
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {isAdmin && (
            <div className="flex flex-wrap gap-3 mb-4">
              <Button 
                onClick={() => setIsWizardOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurar Calendário Anual
              </Button>
              <Button 
                onClick={() => setIsNewMeetingModalOpen(true)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Nova Reunião
              </Button>
            </div>
          )}

          {/* Barra de Filtros */}
          <Card className="mb-4">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4" />
                <h3 className="font-semibold">Filtrar Reuniões</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Filtro: Tipo de Órgão */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Tipo de Órgão</Label>
                  <Select 
                    value={filters.organType} 
                    onValueChange={(value) => setFilters({...filters, organType: value, organId: 'all'})}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3" /> Todos os Tipos
              </span>
            </SelectItem>
                      <SelectItem value="conselho">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" /> Conselhos
                        </span>
                      </SelectItem>
                      <SelectItem value="comite">
                        <span className="flex items-center gap-2">
                          <Users className="h-3 w-3" /> Comitês
                        </span>
                      </SelectItem>
                      <SelectItem value="comissao">
                        <span className="flex items-center gap-2">
                          <UserCog className="h-3 w-3" /> Comissões
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro: Órgão Específico */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Órgão Específico</Label>
                  <Select 
                    value={filters.organId}
                    onValueChange={(value) => setFilters({...filters, organId: value})}
                    disabled={filters.organType === 'all'}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {organs.map(organ => (
                        <SelectItem key={organ.id} value={organ.id}>
                          {organ.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro: Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select 
                    value={filters.status}
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Agendada">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-3 w-3" /> Agendada
              </span>
            </SelectItem>
            <SelectItem value="Pauta Definida">
              <span className="flex items-center gap-2">
                <FileText className="h-3 w-3" /> Pauta Definida
              </span>
            </SelectItem>
            <SelectItem value="Docs Enviados">
              <span className="flex items-center gap-2">
                <Send className="h-3 w-3" /> Docs Enviados
              </span>
            </SelectItem>
            <SelectItem value="Realizada">
              <span className="flex items-center gap-2">
                <CheckCheck className="h-3 w-3" /> Realizada
              </span>
            </SelectItem>
            <SelectItem value="ATA Gerada">
              <span className="flex items-center gap-2">
                <FileCheck className="h-3 w-3" /> ATA Gerada
              </span>
            </SelectItem>
            <SelectItem value="Aguardando Aprovação">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-amber-500" /> Aguardando Aprovação
              </span>
            </SelectItem>
            <SelectItem value="Aguardando Assinatura">
              <span className="flex items-center gap-2">
                <Scale className="h-3 w-3 text-blue-500" /> Aguardando Assinatura
              </span>
            </SelectItem>
            <SelectItem value="ATA Finalizada">
              <span className="flex items-center gap-2">
                <CheckCheck className="h-3 w-3 text-emerald-500" /> ATA Finalizada
              </span>
            </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro: Tipo de Reunião */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Tipo de Reunião</Label>
                  <Select 
                    value={filters.meetingType}
                    onValueChange={(value) => setFilters({...filters, meetingType: value})}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="Ordinária">
              <span className="flex items-center gap-2">
                <Scale className="h-3 w-3" /> Ordinária
              </span>
            </SelectItem>
            <SelectItem value="Extraordinária">
              <span className="flex items-center gap-2">
                <Zap className="h-3 w-3" /> Extraordinária
              </span>
            </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Badge de Resultados */}
              <div className="mt-3 flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-[10px] cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => setFilters({
                  organType: 'all',
                  organId: 'all',
                  status: 'all',
                  meetingType: 'all'
                })}
                title="Clique para limpar filtros"
              >
                {filteredMeetings.length} de {schedule?.meetings.length || 0} reuniões
              </Badge>
                {(filters.organType !== 'all' || filters.status !== 'all' || filters.meetingType !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilters({
                      organType: 'all',
                      organId: 'all',
                      status: 'all',
                      meetingType: 'all'
                    })}
                    className="h-6 text-[10px]"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mensagem quando nenhuma reunião é encontrada */}
          {filteredMeetings.length === 0 && schedule?.meetings.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 text-blue-900">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Nenhuma reunião encontrada com os filtros aplicados</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Existem {schedule.meetings.length} reuniões no total. 
                      <button 
                        onClick={() => setFilters({
                          organType: 'all',
                          organId: 'all',
                          status: 'all',
                          meetingType: 'all'
                        })}
                        className="ml-1 underline hover:text-blue-900 font-medium"
                      >
                        Clique aqui para limpar filtros
                      </button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  meetings={filteredMeetings}
                  onMeetingClick={handleMeetingClick}
                  onUpdateMeeting={updateMeeting}
                  onDateClick={handleDateClick}
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
          <Dialog 
            open={isNewMeetingModalOpen} 
            onOpenChange={(open) => {
              setIsNewMeetingModalOpen(open);
              if (!open) resetMeetingForm();
            }}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
                <DialogDescription>
                  Preencha os dados para agendar uma nova reunião
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="informacoes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="informacoes">
                    Informações
                  </TabsTrigger>
                  <TabsTrigger value="participantes">
                    <div className="flex items-center gap-2">
                      Participantes
                      {meetingParticipants.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {meetingParticipants.length}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                </TabsList>

                {/* ABA 1: INFORMAÇÕES */}
                <TabsContent value="informacoes" className="space-y-4 mt-4">
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
                </TabsContent>

                {/* ABA 2: PARTICIPANTES */}
                <TabsContent value="participantes" className="mt-4">
                  {!meetingForm.council_id ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Selecione um órgão primeiro</p>
                      <p className="text-sm mt-1">
                        Vá para a aba "Informações" e selecione o tipo de órgão e o órgão específico
                      </p>
                    </div>
                  ) : (
                    <ParticipantsManager
                      meetingId="new-meeting"
                      councilId={meetingForm.council_id}
                      organType={meetingForm.organ_type}
                      participants={meetingParticipants}
                      onUpdate={setMeetingParticipants}
                    />
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
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