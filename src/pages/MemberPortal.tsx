import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  LogOut,
  Eye,
  FileSignature,
  ChevronRight,
  CalendarDays,
  Building2
} from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import logoLegacy from "@/assets/legacy-logo-new.png";

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

const mockPendingATAs = [
  {
    id: 'ata-1',
    meetingTitle: 'Reunião Ordinária',
    council: 'Conselho de Administração',
    date: addDays(new Date(), -10),
    status: 'AGUARDANDO_APROVACAO',
    approvedCount: 2,
    totalCount: 4
  },
  {
    id: 'ata-2',
    meetingTitle: 'Reunião Extraordinária',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), -5),
    status: 'AGUARDANDO_ASSINATURA',
    signedCount: 1,
    totalCount: 3
  }
];

const mockMemberTasks = [
  {
    id: 'task-1',
    description: 'Elaborar parecer sobre proposta de M&A',
    dueDate: addDays(new Date(), 2),
    origin: 'Conselho Admin 25/11',
    priority: 'ALTA',
    status: 'PENDENTE'
  },
  {
    id: 'task-2',
    description: 'Revisar código de ética atualizado',
    dueDate: addDays(new Date(), 9),
    origin: 'Comissão de Ética 20/11',
    priority: 'MEDIA',
    status: 'PENDENTE'
  },
  {
    id: 'task-3',
    description: 'Avaliar relatório de riscos Q3',
    dueDate: addDays(new Date(), 15),
    origin: 'Comitê de Auditoria 18/11',
    priority: 'MEDIA',
    status: 'PENDENTE'
  }
];

const MemberPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(mockMemberTasks);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewAgenda = (meetingId: string) => {
    toast({
      title: "Abrindo Pauta",
      description: "Visualizando pauta da reunião"
    });
  };

  const handleViewMaterials = (meetingId: string) => {
    toast({
      title: "Abrindo Materiais",
      description: "Visualizando materiais de apoio"
    });
  };

  const handleViewATA = (ataId: string) => {
    toast({
      title: "Abrindo ATA",
      description: "Visualizando conteúdo da ATA"
    });
  };

  const handleApproveATA = (ataId: string) => {
    toast({
      title: "ATA Aprovada",
      description: "Sua aprovação foi registrada com sucesso"
    });
  };

  const handleSignATA = (ataId: string) => {
    toast({
      title: "ATA Assinada",
      description: "Sua assinatura eletrônica foi registrada"
    });
  };

  const handleMarkTaskResolved = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'RESOLVIDA' } : t));
    toast({
      title: "Tarefa Resolvida",
      description: "A pendência foi marcada como resolvida"
    });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoLegacy} alt="Legacy" className="h-8" />
              <div className="border-l pl-4">
                <p className="text-sm text-muted-foreground">Portal do Membro</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Participante de:</p>
                <p className="font-medium">{memberCouncils.join(', ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Próximas Reuniões */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Próximas Reuniões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMemberMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{meeting.council} - {meeting.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(meeting.date, "dd/MM/yyyy", { locale: ptBR })} às {meeting.time} • {meeting.location}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {meeting.status === 'PAUTA_DEFINIDA' ? 'Pauta Definida' : 
                       meeting.status === 'EM_PREPARACAO' ? 'Em Preparação' : 'Agendada'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.hasAgenda && (
                    <Button variant="outline" size="sm" onClick={() => handleViewAgenda(meeting.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Pauta
                    </Button>
                  )}
                  {meeting.hasMaterials && (
                    <Button variant="outline" size="sm" onClick={() => handleViewMaterials(meeting.id)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Materiais
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ATAs Pendentes de Ação */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-orange-500" />
              ATAs Pendentes de Ação
              <Badge variant="destructive" className="ml-2">{mockPendingATAs.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPendingATAs.map((ata) => (
              <div 
                key={ata.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    ata.status === 'AGUARDANDO_APROVACAO' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                  }`}>
                    {ata.status === 'AGUARDANDO_APROVACAO' ? (
                      <CheckCircle className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <FileSignature className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">ATA - {ata.council} {format(ata.date, "dd/MM/yyyy")}</p>
                    <p className="text-sm text-muted-foreground">{ata.meetingTitle}</p>
                    <Badge 
                      variant={ata.status === 'AGUARDANDO_APROVACAO' ? 'secondary' : 'outline'}
                      className="mt-1"
                    >
                      {ata.status === 'AGUARDANDO_APROVACAO' 
                        ? `Aguardando sua aprovação (${ata.approvedCount}/${ata.totalCount} aprovaram)`
                        : `Aguardando sua assinatura (${ata.signedCount}/${ata.totalCount} assinaram)`
                      }
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewATA(ata.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver ATA
                  </Button>
                  {ata.status === 'AGUARDANDO_APROVACAO' ? (
                    <Button size="sm" onClick={() => handleApproveATA(ata.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleSignATA(ata.id)}>
                      <FileSignature className="h-4 w-4 mr-1" />
                      Assinar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Minhas Pendências */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Minhas Pendências
              <Badge variant="secondary" className="ml-2">
                {tasks.filter(t => t.status === 'PENDENTE').length} pendentes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter(t => t.status === 'PENDENTE').map((task) => {
              const daysRemaining = getDaysRemaining(task.dueDate);
              const urgencyColor = getUrgencyColor(daysRemaining);
              
              return (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      daysRemaining <= 3 ? 'bg-red-500/10' : 
                      daysRemaining <= 7 ? 'bg-yellow-500/10' : 'bg-green-500/10'
                    }`}>
                      <Clock className={`h-5 w-5 ${urgencyColor}`} />
                    </div>
                    <div>
                      <p className="font-medium">{task.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Prazo: {format(task.dueDate, "dd/MM/yyyy")}</span>
                        <span className={urgencyColor}>
                          ({daysRemaining < 0 
                            ? `${Math.abs(daysRemaining)} dias atrasado` 
                            : `${daysRemaining} dias restantes`})
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Origem: {task.origin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === 'ALTA' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMarkTaskResolved(task.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Resolvida
                    </Button>
                  </div>
                </div>
              );
            })}

            {tasks.filter(t => t.status === 'PENDENTE').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>Nenhuma pendência! Você está em dia.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mini Calendário */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Meus Órgãos de Governança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {memberCouncils.map((council, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{council}</p>
                      <p className="text-sm text-muted-foreground">
                        {index === 0 ? '6 reuniões/ano' : '12 reuniões/ano'}
                      </p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberPortal;
