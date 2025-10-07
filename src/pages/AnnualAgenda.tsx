import React, { useState } from "react";
import { Calendar, TrendingUp, Clock, CheckCircle2, Users, CalendarDays, Settings } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AnnualAgenda = () => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingSchedule | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

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

  // Debug log
  console.log("📅 AnnualAgenda component - schedule:", schedule);
  console.log("📅 AnnualAgenda component - loading:", scheduleLoading);

  const handleMeetingClick = (meeting: MeetingSchedule) => {
    setSelectedMeeting(meeting);
    setIsMeetingModalOpen(true);
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
              onClick={() => navigate('/councils')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Ir para Conselhos
            </Button>
            <Button 
              onClick={() => setIsWizardOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar Calendário Anual
            </Button>
            <Button 
              onClick={() => {
                setSelectedMeeting(null);
                setIsMeetingModalOpen(true);
              }}
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
        </div>
      </div>
    </div>
  );
};

export default AnnualAgenda;