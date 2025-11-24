import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, ListTodo, UserCheck, FileText, Building2, Users, UserCog, Settings, CheckCircle2, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingTasksReportModal } from "./PendingTasksReportModal";
import { PendingTasksPreviewModal } from "./PendingTasksPreviewModal";
import { ATALibrary } from "./ATALibrary";
import { GuestDocumentApproval } from "./GuestDocumentApproval";
import { useAllMeetingActions } from "@/hooks/useAllMeetingActions";

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
  const { toast } = useToast();
  const { 
    actions, 
    loading, 
    completeAction,
    getUrgencyCounts 
  } = useAllMeetingActions();
  
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTasks, setPreviewTasks] = useState<any[]>([]);
  const [previewOrganType, setPreviewOrganType] = useState<string | undefined>();
  const [organFilter, setOrganFilter] = useState('all');

  const urgencyCounts = getUrgencyCounts();

  // Transform real actions to display format
  const pendingTasks = actions.map(action => ({
    id: action.id,
    task: action.description,
    organName: action.meeting?.councils?.name || 'N/A',
    organType: action.meeting?.councils?.organ_type as 'conselho' | 'comite' | 'comissao',
    dueDate: new Date(action.due_date),
    priority: action.priority === 'ALTA' ? 'high' as const : 
              action.priority === 'MEDIA' ? 'medium' as const : 'low' as const,
    responsible: action.responsible_external_name || 'Não atribuído',
    responsibleEmail: action.responsible_external_email,
    status: action.status,
    meetingId: action.meeting_id,
  }));

  const filteredTasks = organFilter === 'all' 
    ? pendingTasks 
    : pendingTasks.filter(task => task.organType === organFilter);

  const handleOpenPreview = (type: 'all' | 'conselho' | 'comite' | 'comissao') => {
    const filtered = type === 'all' 
      ? pendingTasks 
      : pendingTasks.filter(task => task.organType === type);

    const mapped = filtered.map(task => ({
      id: task.id,
      description: task.task,
      priority: task.priority === 'high' ? 'ALTA' as const : 
                task.priority === 'medium' ? 'MEDIA' as const : 'BAIXA' as const,
      due_date: task.dueDate.toISOString().split('T')[0],
      organType: task.organType,
      organName: task.organName,
      responsibleName: task.responsible,
      responsibleEmail: task.responsibleEmail,
    }));

    setPreviewTasks(mapped);
    setPreviewOrganType(type === 'all' ? undefined : type);
    setPreviewModalOpen(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    await completeAction(taskId);
  };

  const getUrgencyColor = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'border-l-4 border-red-500 bg-red-50';
    if (diffDays === 0) return 'border-l-4 border-orange-500 bg-orange-50';
    if (diffDays <= 3) return 'border-l-4 border-yellow-500 bg-yellow-50';
    return 'border-l-4 border-green-500 bg-white';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="gap-2">
            <Library className="h-4 w-4" />
            Bibliotecas
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Tarefas Pendentes
          </TabsTrigger>
          <TabsTrigger value="guests" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Aprovação de Convidados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <ATALibrary />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6 space-y-4">
          {/* Urgency Counters */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{urgencyCounts.overdue}</div>
                  <div className="text-sm text-muted-foreground">🔴 Atrasadas</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{urgencyCounts.today}</div>
                  <div className="text-sm text-muted-foreground">🟠 Hoje</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{urgencyCounts.next3Days}</div>
                  <div className="text-sm text-muted-foreground">🟡 Próximos 3 dias</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Tarefas Pendentes
                  <Badge variant="secondary">{filteredTasks.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {loading ? 'Carregando...' : 'Ações que requerem sua atenção'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filter */}
                <Select value={organFilter} onValueChange={setOrganFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo de órgão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Órgãos</SelectItem>
                    <SelectItem value="conselho">Conselhos</SelectItem>
                    <SelectItem value="comite">Comitês</SelectItem>
                    <SelectItem value="comissao">Comissões</SelectItem>
                  </SelectContent>
                </Select>

                {/* Relatórios Rápidos - Preview Mode */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Relatórios Rápidos (Preview)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all"
                        onClick={() => handleOpenPreview('all')}
                      >
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Todas Tarefas</span>
                        <Badge variant="secondary" className="text-xs">{pendingTasks.length}</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all"
                        onClick={() => handleOpenPreview('conselho')}
                      >
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Conselhos</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'conselho').length}
                        </Badge>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-green-100 hover:border-green-400 transition-all"
                        onClick={() => handleOpenPreview('comite')}
                      >
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium">Comitês</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comite').length}
                        </Badge>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-amber-100 hover:border-amber-400 transition-all"
                        onClick={() => handleOpenPreview('comissao')}
                      >
                        <Briefcase className="h-5 w-5 text-amber-600" />
                        <span className="text-xs font-medium">Comissões</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comissao').length}
                        </Badge>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-purple-100 hover:border-purple-400 transition-all"
                        onClick={() => setReportModalOpen(true)}
                      >
                        <Settings className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-medium">Personalizado</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks List */}
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Carregando tarefas...</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma tarefa encontrada para este filtro</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-start justify-between gap-4 p-4 rounded-lg transition-colors ${getUrgencyColor(task.dueDate)}`}
                    >
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-none">{task.task}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {task.organName}
                          </Badge>
                          {task.responsible && (
                            <Badge variant="secondary" className="text-xs">
                              {task.responsible}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Prazo: {format(task.dueDate, "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Concluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests" className="mt-6">
          <GuestDocumentApproval />
        </TabsContent>
      </Tabs>

      <PendingTasksReportModal 
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        tasks={pendingTasks.map(task => ({
          id: task.id,
          task: task.task,
          description: task.task,
          priority: task.priority,
          due_date: task.dueDate.toISOString().split('T')[0],
          dueDate: task.dueDate,
          organType: task.organType,
          organName: task.organName,
          responsibleName: task.responsible,
          responsibleEmail: task.responsibleEmail,
        }))}
      />

      <PendingTasksPreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        tasks={previewTasks}
        selectedOrganType={previewOrganType}
      />
    </div>
  );
};
