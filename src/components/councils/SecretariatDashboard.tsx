import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Send, CheckCircle2, Clock, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SecretariatDashboardProps {
  onOpenConvocations?: () => void;
  onOpenMaterials?: () => void;
  onViewMeeting?: (meetingId: string) => void;
}

export const SecretariatDashboard = ({ 
  onOpenConvocations, 
  onOpenMaterials,
  onViewMeeting 
}: SecretariatDashboardProps) => {
  // Mock data - substituir por dados reais do backend
  const upcomingMeetings = [
    {
      id: "1",
      title: "Reunião do Conselho de Administração",
      date: new Date(2025, 0, 25, 14, 0),
      organ: "Conselho de Administração",
      status: "convocation_pending",
      participants: 12,
      materialsUploaded: 3,
      materialsTotal: 5,
    },
    {
      id: "2",
      title: "Comitê de Auditoria - Janeiro",
      date: new Date(2025, 0, 28, 10, 0),
      organ: "Comitê de Auditoria",
      status: "convocation_sent",
      participants: 6,
      materialsUploaded: 5,
      materialsTotal: 5,
    },
  ];

  const pendingTasks = [
    { id: "1", task: "Enviar convocação - Conselho de Administração", priority: "high", dueDate: new Date(2025, 0, 20) },
    { id: "2", task: "Aprovar materiais - Comitê de Auditoria", priority: "medium", dueDate: new Date(2025, 0, 23) },
    { id: "3", task: "Confirmar presença dos membros", priority: "low", dueDate: new Date(2025, 0, 24) },
  ];

  const materialsAwaitingApproval = [
    { id: "1", name: "Relatório Financeiro Q4 2024.pdf", uploadedBy: "João Silva", uploadedAt: new Date(2025, 0, 18) },
    { id: "2", name: "Proposta de Orçamento 2025.xlsx", uploadedBy: "Maria Santos", uploadedAt: new Date(2025, 0, 18) },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "convocation_pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Convocação Pendente</Badge>;
      case "convocation_sent":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Convocação Enviada</Badge>;
      case "materials_pending":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Materiais Pendentes</Badge>;
      case "ready":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pronta</Badge>;
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Reuniões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convocações Pendentes</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Aguardando envio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas do Dia</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pendentes hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Reuniões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">{meeting.organ}</p>
                    </div>
                    {getStatusBadge(meeting.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(meeting.date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {meeting.participants} participantes
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      Materiais: {meeting.materialsUploaded}/{meeting.materialsTotal}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewMeeting?.(meeting.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getPriorityIcon(task.priority)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento: {format(task.dueDate, "dd/MM/yyyy")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Materials Awaiting Approval */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Materiais Aguardando Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materialsAwaitingApproval.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{material.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Por {material.uploadedBy} • {format(material.uploadedAt, "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Rejeitar</Button>
                    <Button size="sm">Aprovar</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={onOpenMaterials}
            >
              Ver Todos os Materiais
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={onOpenConvocations}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Convocações
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Upload de Materiais
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Confirmar Presenças
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Nova Reunião
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};