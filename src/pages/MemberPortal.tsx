import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MemberSidebar } from "@/components/member/MemberSidebar";
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  FileSignature,
  CalendarDays,
  Building2
} from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

// Import modals
import { MemberAgendaModal } from "@/components/member/MemberAgendaModal";
import { MemberMaterialsModal } from "@/components/member/MemberMaterialsModal";
import { MemberATAViewerModal } from "@/components/member/MemberATAViewerModal";
import { MemberApprovalModal } from "@/components/member/MemberApprovalModal";
import { MemberTaskDetailModal } from "@/components/member/MemberTaskDetailModal";
import { ElectronicSignatureModal } from "@/components/councils/ElectronicSignatureModal";

// Mock data para o portal do membro
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

interface PendingATA {
  id: string;
  meetingTitle: string;
  council: string;
  date: Date;
  status: string;
  approvedCount: number;
  signedCount: number;
  totalCount: number;
}

const mockPendingATAs: PendingATA[] = [
  {
    id: 'ata-1',
    meetingTitle: 'Reunião Ordinária',
    council: 'Conselho de Administração',
    date: addDays(new Date(), -10),
    status: 'AGUARDANDO_APROVACAO',
    approvedCount: 2,
    signedCount: 0,
    totalCount: 4
  },
  {
    id: 'ata-2',
    meetingTitle: 'Reunião Extraordinária',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), -5),
    status: 'AGUARDANDO_ASSINATURA',
    approvedCount: 3,
    signedCount: 1,
    totalCount: 3
  }
];

const initialMemberTasks = [
  {
    id: 'task-1',
    title: 'Elaborar parecer sobre proposta de M&A',
    description: 'Analisar a proposta de aquisição da Empresa XYZ e elaborar parecer técnico com recomendações para o Conselho.',
    dueDate: addDays(new Date(), 2),
    deadline: format(addDays(new Date(), 2), "dd/MM/yyyy"),
    origin: 'Conselho Admin 25/11',
    council: 'Conselho de Administração',
    createdAt: format(addDays(new Date(), -5), "dd/MM/yyyy"),
    priority: 'Alta' as const,
    status: 'PENDENTE'
  },
  {
    id: 'task-2',
    title: 'Revisar código de ética atualizado',
    description: 'Realizar revisão completa do novo código de ética da empresa, verificando conformidade com melhores práticas de mercado.',
    dueDate: addDays(new Date(), 9),
    deadline: format(addDays(new Date(), 9), "dd/MM/yyyy"),
    origin: 'Comissão de Ética 20/11',
    council: 'Comissão de Ética',
    createdAt: format(addDays(new Date(), -10), "dd/MM/yyyy"),
    priority: 'Média' as const,
    status: 'PENDENTE'
  },
  {
    id: 'task-3',
    title: 'Avaliar relatório de riscos Q3',
    description: 'Avaliar o relatório trimestral de riscos e preparar comentários para discussão na próxima reunião do comitê.',
    dueDate: addDays(new Date(), 15),
    deadline: format(addDays(new Date(), 15), "dd/MM/yyyy"),
    origin: 'Comitê de Auditoria 18/11',
    council: 'Comitê de Auditoria',
    createdAt: format(addDays(new Date(), -12), "dd/MM/yyyy"),
    priority: 'Média' as const,
    status: 'PENDENTE'
  }
];

const MemberPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialMemberTasks);
  const [atas, setAtas] = useState(mockPendingATAs);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Refs for scroll navigation
  const reunioesRef = useRef<HTMLDivElement>(null);
  const atasRef = useRef<HTMLDivElement>(null);
  const pendenciasRef = useRef<HTMLDivElement>(null);
  const orgaosRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
  const [ataViewerOpen, setAtaViewerOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  // Selected items
  const [selectedMeeting, setSelectedMeeting] = useState<typeof mockMemberMeetings[0] | null>(null);
  const [selectedATA, setSelectedATA] = useState<typeof mockPendingATAs[0] | null>(null);
  const [selectedTask, setSelectedTask] = useState<typeof initialMemberTasks[0] | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      reunioes: reunioesRef,
      atas: atasRef,
      pendencias: pendenciasRef,
      orgaos: orgaosRef
    };
    
    if (section === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (refs[section]?.current) {
      refs[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Meeting handlers
  const handleViewAgenda = (meeting: typeof mockMemberMeetings[0]) => {
    setSelectedMeeting(meeting);
    setAgendaModalOpen(true);
  };

  const handleViewMaterials = (meeting: typeof mockMemberMeetings[0]) => {
    setSelectedMeeting(meeting);
    setMaterialsModalOpen(true);
  };

  // ATA handlers
  const handleViewATA = (ata: typeof mockPendingATAs[0]) => {
    setSelectedATA(ata);
    setAtaViewerOpen(true);
  };

  const handleApproveATA = (ata: typeof mockPendingATAs[0]) => {
    setSelectedATA(ata);
    setApprovalModalOpen(true);
  };

  const handleSignATA = (ata: typeof mockPendingATAs[0]) => {
    setSelectedATA(ata);
    setSignatureModalOpen(true);
  };

  const handleApprovalComplete = (ataId: string, action: "approve" | "revision" | "reject") => {
    if (action === "approve") {
      setAtas(prev => prev.map(a => 
        a.id === ataId 
          ? { ...a, approvedCount: (a.approvedCount || 0) + 1 }
          : a
      ));
    }
  };

  const handleSignatureSuccess = () => {
    if (selectedATA) {
      setAtas(prev => prev.map(a => 
        a.id === selectedATA.id 
          ? { ...a, signedCount: (a.signedCount || 0) + 1 }
          : a
      ));
    }
    setSignatureModalOpen(false);
    toast({
      title: "ATA Assinada",
      description: "Sua assinatura eletrônica foi registrada com sucesso"
    });
  };

  // Task handlers
  const handleOpenTaskDetail = (task: typeof initialMemberTasks[0]) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleMarkTaskResolved = (taskId: string, comment: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'RESOLVIDA' } : t));
  };

  const getDaysRemaining = (date: Date) => {
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining < 0) return 'text-red-500';
    if (daysRemaining <= 3) return 'text-red-500';
    if (daysRemaining <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const memberCouncils = user?.councilMemberships?.length 
    ? ['Conselho de Administração', 'Comitê de Auditoria'] 
    : ['Conselho de Administração'];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MemberSidebar 
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          onLogout={handleLogout}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header with trigger */}
          <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold">Bem-vindo, {user?.name?.split(' ')[0]}</h1>
                <p className="text-base text-muted-foreground">Portal do Membro de Governança</p>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8 space-y-8">
            {/* Próximas Reuniões */}
            <Card ref={reunioesRef}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  Próximas Reuniões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMemberMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{meeting.council} - {meeting.title}</p>
                        <p className="text-base text-muted-foreground">
                          {format(meeting.date, "dd/MM/yyyy", { locale: ptBR })} às {meeting.time} • {meeting.location}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-sm px-3 py-1">
                          {meeting.status === 'PAUTA_DEFINIDA' ? 'Pauta Definida' : 
                           meeting.status === 'EM_PREPARACAO' ? 'Em Preparação' : 'Agendada'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto lg:ml-0">
                      {meeting.hasAgenda && (
                        <Button variant="outline" size="lg" onClick={() => handleViewAgenda(meeting)} className="text-base">
                          <Eye className="h-5 w-5 mr-2" />
                          Ver Pauta
                        </Button>
                      )}
                      {meeting.hasMaterials && (
                        <Button variant="outline" size="lg" onClick={() => handleViewMaterials(meeting)} className="text-base">
                          <FileText className="h-5 w-5 mr-2" />
                          Materiais
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ATAs Pendentes de Ação */}
            <Card ref={atasRef}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="h-6 w-6 text-orange-500" />
                  ATAs Pendentes de Ação
                  <Badge variant="destructive" className="ml-2 text-sm px-3 py-1">{atas.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {atas.map((ata) => (
                  <div 
                    key={ata.id} 
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-lg border bg-card gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-lg flex items-center justify-center ${
                        ata.status === 'AGUARDANDO_APROVACAO' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                      }`}>
                        {ata.status === 'AGUARDANDO_APROVACAO' ? (
                          <CheckCircle className="h-7 w-7 text-yellow-500" />
                        ) : (
                          <FileSignature className="h-7 w-7 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">ATA - {ata.council} {format(ata.date, "dd/MM/yyyy")}</p>
                        <p className="text-base text-muted-foreground">{ata.meetingTitle}</p>
                        <Badge 
                          variant={ata.status === 'AGUARDANDO_APROVACAO' ? 'secondary' : 'outline'}
                          className="mt-2 text-sm px-3 py-1"
                        >
                          {ata.status === 'AGUARDANDO_APROVACAO' 
                            ? `Aguardando sua aprovação (${ata.approvedCount}/${ata.totalCount} aprovaram)`
                            : `Aguardando sua assinatura (${ata.signedCount}/${ata.totalCount} assinaram)`
                          }
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto lg:ml-0">
                      <Button variant="outline" size="lg" onClick={() => handleViewATA(ata)} className="text-base">
                        <Eye className="h-5 w-5 mr-2" />
                        Ver ATA
                      </Button>
                      {ata.status === 'AGUARDANDO_APROVACAO' ? (
                        <Button size="lg" onClick={() => handleApproveATA(ata)} className="text-base">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Aprovar
                        </Button>
                      ) : (
                        <Button size="lg" onClick={() => handleSignATA(ata)} className="text-base">
                          <FileSignature className="h-5 w-5 mr-2" />
                          Assinar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Minhas Pendências */}
            <Card ref={pendenciasRef}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  Minhas Pendências
                  <Badge variant="secondary" className="ml-2 text-sm px-3 py-1">
                    {tasks.filter(t => t.status === 'PENDENTE').length} pendentes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.filter(t => t.status === 'PENDENTE').map((task) => {
                  const daysRemaining = getDaysRemaining(task.dueDate);
                  const urgencyColor = getUrgencyColor(daysRemaining);
                  
                  return (
                    <div 
                      key={task.id} 
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-lg border bg-card gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          daysRemaining <= 3 ? 'bg-red-500/10' : 
                          daysRemaining <= 7 ? 'bg-yellow-500/10' : 'bg-green-500/10'
                        }`}>
                          <Clock className={`h-6 w-6 ${urgencyColor}`} />
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{task.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                            <span>Prazo: {format(task.dueDate, "dd/MM/yyyy")}</span>
                            <span className={urgencyColor}>
                              ({daysRemaining < 0 
                                ? `${Math.abs(daysRemaining)} dias atrasado` 
                                : `${daysRemaining} dias restantes`})
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Origem: {task.origin}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-auto lg:ml-0">
                        <Badge 
                          variant={task.priority === 'Alta' ? 'destructive' : 'secondary'}
                          className="text-sm px-3 py-1"
                        >
                          {task.priority}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => handleOpenTaskDetail(task)}
                          className="text-base"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Marcar Resolvida
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {tasks.filter(t => t.status === 'PENDENTE').length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <p className="text-xl">Nenhuma pendência! Você está em dia.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Meus Órgãos */}
            <Card ref={orgaosRef}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Building2 className="h-6 w-6 text-primary" />
                  Meus Órgãos de Governança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-5">
                  {memberCouncils.map((council, index) => (
                    <div 
                      key={index}
                      className="p-5 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">{council}</p>
                          <p className="text-base text-muted-foreground">
                            {index === 0 ? '6 reuniões/ano' : '12 reuniões/ano'}
                          </p>
                        </div>
                        <div className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

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

      <MemberATAViewerModal
        open={ataViewerOpen}
        onClose={() => setAtaViewerOpen(false)}
        ata={selectedATA ? {
          id: selectedATA.id,
          title: `ATA - ${selectedATA.meetingTitle}`,
          council: selectedATA.council,
          date: format(selectedATA.date, "dd/MM/yyyy"),
          time: "09:00"
        } : null}
      />

      <MemberApprovalModal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        ata={selectedATA ? {
          id: selectedATA.id,
          title: `ATA - ${selectedATA.meetingTitle}`,
          council: selectedATA.council,
          date: format(selectedATA.date, "dd/MM/yyyy"),
          approvedCount: selectedATA.approvedCount || 0,
          totalMembers: selectedATA.totalCount
        } : null}
        onApprovalComplete={handleApprovalComplete}
      />

      <ElectronicSignatureModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        approvalId={selectedATA?.id || ""}
        participantName={user?.name || "Membro"}
        onSuccess={handleSignatureSuccess}
      />

      <MemberTaskDetailModal
        open={taskDetailOpen}
        onClose={() => setTaskDetailOpen(false)}
        task={selectedTask}
        onMarkResolved={handleMarkTaskResolved}
      />
    </SidebarProvider>
  );
};

export default MemberPortal;
