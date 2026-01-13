import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Library, ListTodo, UserCheck, FileText, Building2, Users, UserCog, Settings, CheckCircle2, Briefcase, AlertCircle, Clock, Timer, PlayCircle, TrendingUp, Target, Activity, LayoutDashboard, CalendarIcon, FileSignature, PenTool, Eye } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingTasksReportModal } from "./PendingTasksReportModal";
import { PendingTasksPreviewModal } from "./PendingTasksPreviewModal";
import { TaskDetailModal } from "./TaskDetailModal";
import { ATALibrary } from "./ATALibrary";
import { GuestDocumentApproval } from "./GuestDocumentApproval";
import { useAllMeetingActions } from "@/hooks/useAllMeetingActions";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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
  const {
    toast
  } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.orgRole === 'org_admin' || !user?.orgRole;
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
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [organFilter, setOrganFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'overdue' | 'completed'>('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });

  // ATA Approval Metrics
  const [ataMetrics, setAtaMetrics] = useState({
    pendingApproval: 0,
    pendingSignature: 0,
    finalized: 0
  });
  useEffect(() => {
    const calculateATAMetrics = () => {
      const ataStatusMap = localStorage.getItem('meeting_ata_status');
      if (!ataStatusMap) return {
        pendingApproval: 0,
        pendingSignature: 0,
        finalized: 0
      };
      const statusMap = JSON.parse(ataStatusMap);
      let pendingApproval = 0;
      let pendingSignature = 0;
      let finalized = 0;
      Object.values(statusMap).forEach((status: any) => {
        if (status === 'EM_APROVACAO') pendingApproval++;
        if (status === 'APROVADO') pendingSignature++;
        if (status === 'ASSINADO') finalized++;
      });
      return {
        pendingApproval,
        pendingSignature,
        finalized
      };
    };
    setAtaMetrics(calculateATAMetrics());
  }, []);
  const urgencyCounts = getUrgencyCounts();

  // Calculate metrics
  const calculateMetrics = () => {
    const total = actions.length;
    const resolved = actions.filter(a => a.status === 'CONCLUIDA').length;
    const pending = actions.filter(a => a.status !== 'CONCLUIDA').length;
    const resolutionRate = total > 0 ? Math.round(resolved / total * 100) : 0;
    return {
      total,
      resolved,
      pending,
      resolutionRate
    };
  };
  const getMetricsByOrganType = (type: string) => {
    const filtered = actions.filter(a => a.meetings?.councils?.organ_type === type);
    const total = filtered.length;
    const resolved = filtered.filter(a => a.status === 'CONCLUIDA').length;
    const pending = filtered.filter(a => a.status === 'PENDENTE').length;
    const overdue = filtered.filter(a => {
      const today = new Date();
      const dueDate = new Date(a.due_date);
      return dueDate < today && a.status !== 'CONCLUIDA';
    }).length;
    const inProgress = filtered.filter(a => a.status === 'EM_ANDAMENTO').length;
    const resolutionRate = total > 0 ? Math.round(resolved / total * 100) : 0;
    return {
      total,
      resolved,
      pending,
      overdue,
      inProgress,
      resolutionRate
    };
  };
  const metrics = calculateMetrics();
  const councilMetrics = getMetricsByOrganType('conselho');
  const committeeMetrics = getMetricsByOrganType('comite');
  const commissionMetrics = getMetricsByOrganType('comissao');

  // Chart data
  const pendingOnTime = actions.filter(a => a.status === 'PENDENTE' && a.due_date >= new Date().toISOString().split('T')[0]);
  const inProgress = actions.filter(a => a.status === 'EM_ANDAMENTO');
  const overdue = actions.filter(a => a.status === 'ATRASADA');
  const completed = actions.filter(a => a.status === 'CONCLUIDA');
  const statusChartData = [{
    name: 'Resolvidas',
    value: completed.length,
    color: 'hsl(var(--success))'
  }, {
    name: 'Pendentes',
    value: pendingOnTime.length,
    color: 'hsl(var(--info))'
  }, {
    name: 'Em Andamento',
    value: inProgress.length,
    color: 'hsl(var(--accent))'
  }, {
    name: 'Atrasadas',
    value: overdue.length,
    color: 'hsl(var(--destructive))'
  }].filter(item => item.value > 0);
  const organChartData = actions.filter(action => action.meetings?.councils?.name) // Filter out actions without organ
  .reduce((acc, action) => {
    const organName = action.meetings!.councils!.name;
    const organType = action.meetings!.councils!.organ_type || 'outros';
    const existing = acc.find(item => item.name === organName);
    if (existing) {
      existing.tasks += 1;
    } else {
      acc.push({
        name: organName,
        tasks: 1,
        organType
      });
    }
    return acc;
  }, [] as {
    name: string;
    tasks: number;
    organType: string;
  }[]).sort((a, b) => b.tasks - a.tasks).slice(0, 8);

  // Transform real actions to display format
  const pendingTasks = actions.map(action => ({
    id: action.id,
    task: action.description,
    organName: action.meetings?.councils?.name || 'N/A',
    organType: action.meetings?.councils?.organ_type as 'conselho' | 'comite' | 'comissao',
    dueDate: new Date(action.due_date),
    priority: action.priority === 'ALTA' ? 'high' as const : action.priority === 'MEDIA' ? 'medium' as const : 'low' as const,
    responsible: action.responsible_external_name || 'Não atribuído',
    responsibleEmail: action.responsible_external_email,
    status: action.status,
    meetingId: action.meeting_id
  }));
  const filteredByOrgan = organFilter === 'all' ? pendingTasks : pendingTasks.filter(task => task.organType === organFilter);
  const getFilteredByStatus = (tasks: typeof pendingTasks) => {
    const today = new Date().toISOString().split('T')[0];
    switch (statusFilter) {
      case 'pending':
        return tasks.filter(t => t.status === 'PENDENTE' && t.dueDate.toISOString().split('T')[0] >= today);
      case 'in-progress':
        return tasks.filter(t => t.status === 'EM_ANDAMENTO');
      case 'overdue':
        return tasks.filter(t => t.status === 'ATRASADA');
      case 'completed':
        return tasks.filter(t => t.status === 'CONCLUIDA');
      default:
        return tasks;
    }
  };
  const getFilteredByDateRange = (tasks: typeof pendingTasks) => {
    if (!dateRange.from && !dateRange.to) return tasks;
    return tasks.filter(task => {
      const taskDate = task.dueDate;
      if (dateRange.from && dateRange.to) {
        return taskDate >= dateRange.from && taskDate <= dateRange.to;
      }
      if (dateRange.from) {
        return taskDate >= dateRange.from;
      }
      if (dateRange.to) {
        return taskDate <= dateRange.to;
      }
      return true;
    });
  };
  const filteredByStatus = getFilteredByStatus(filteredByOrgan);
  const filteredTasks = getFilteredByDateRange(filteredByStatus);
  const handleOpenPreview = (type: 'all' | 'conselho' | 'comite' | 'comissao') => {
    const filtered = type === 'all' ? pendingTasks : pendingTasks.filter(task => task.organType === type);
    const mapped = filtered.map(task => ({
      id: task.id,
      description: task.task,
      priority: task.priority === 'high' ? 'ALTA' as const : task.priority === 'medium' ? 'MEDIA' as const : 'BAIXA' as const,
      due_date: task.dueDate.toISOString().split('T')[0],
      organType: task.organType,
      organName: task.organName,
      responsibleName: task.responsible,
      responsibleEmail: task.responsibleEmail
    }));
    setPreviewTasks(mapped);
    setPreviewOrganType(type === 'all' ? undefined : type);
    setPreviewModalOpen(true);
  };
  const handleCompleteTask = async (taskId: string) => {
    await completeAction(taskId);
  };
  const handleOpenTaskDetail = (task: typeof pendingTasks[0]) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };
  const getUrgencyColor = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'border-l-4 border-destructive bg-destructive/5';
    if (diffDays === 0) return 'border-l-4 border-warning bg-warning/5';
    if (diffDays <= 3) return 'border-l-4 border-warning/70 bg-warning/5';
    return 'border-l-4 border-success bg-background';
  };
  return <div className="space-y-6">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="gap-2">
            <Library className="h-4 w-4" />
            Bibliotecas
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Gestão de Tarefas
          </TabsTrigger>
          <TabsTrigger value="guests" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Aprovação de Convidados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <ATALibrary />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6 space-y-8">
          {/* ====================== VISÃO GERENCIAL ====================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-primary">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Visão Gerencial - Indicadores Executivos</h2>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-info" />
                    Total Criadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metrics.total}</div>
                  <Progress value={100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Todas as tarefas registradas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Resolvidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{metrics.resolved}</div>
                  <Progress value={metrics.resolutionRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics.resolutionRate}% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">{metrics.pending}</div>
                  <Progress value={metrics.pending / metrics.total * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round(metrics.pending / metrics.total * 100)}% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Taxa de Resolução
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{metrics.resolutionRate}%</div>
                  <Progress value={metrics.resolutionRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Eficiência da equipe</p>
                </CardContent>
              </Card>
            </div>

            {/* ATAs Pendentes Card */}
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-warning" />
                  ATAs Pendentes de Aprovação/Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-warning/20 rounded-lg">
                    <div className="text-2xl font-bold text-warning">{ataMetrics.pendingApproval}</div>
                    <p className="text-xs text-warning/80">Aguardando Aprovação</p>
                  </div>
                  <div className="text-center p-3 bg-info/20 rounded-lg">
                    <div className="text-2xl font-bold text-info">{ataMetrics.pendingSignature}</div>
                    <p className="text-xs text-info/80">Aguardando Assinatura</p>
                  </div>
                  <div className="text-center p-3 bg-success/20 rounded-lg">
                    <div className="text-2xl font-bold text-success">{ataMetrics.finalized}</div>
                    <p className="text-xs text-success/80">Finalizadas</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => window.location.href = '/ata-pending?tab=approvals'}>
                    <AlertCircle className="h-3 w-3" />
                    Pendentes de Aprovação
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => window.location.href = '/ata-pending?tab=signatures'}>
                    <PenTool className="h-3 w-3" />
                    Pendentes de Assinaturas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================== VISÃO ESTRATÉGICA ====================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-primary">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Visão Estratégica - Análise por Órgãos</h2>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Distribuição por Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={statusChartData} cx="50%" cy="50%" labelLine={false} label={({
                      name,
                      percent
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {statusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {statusChartData.map(item => <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: item.color
                      }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}</span>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Tarefas por Órgão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={organChartData} margin={{
                    bottom: 80,
                    top: 20,
                    left: 10,
                    right: 10
                  }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} style={{
                      fontSize: '11px'
                    }} tick={{
                      fill: 'hsl(var(--foreground))'
                    }} />
                      <YAxis label={{
                      value: 'Quantidade',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        fontSize: '12px'
                      }
                    }} tick={{
                      fill: 'hsl(var(--foreground))'
                    }} />
                      <Tooltip contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      padding: '8px'
                    }} formatter={(value: any) => [`${value} tarefa${value !== 1 ? 's' : ''}`, 'Total']} />
                      <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                        {organChartData.map((entry, index) => {
                        let fillColor = 'hsl(var(--primary))';
                        if (entry.organType === 'conselho') fillColor = '#3b82f6';
                        if (entry.organType === 'comite') fillColor = '#10b981';
                        if (entry.organType === 'comissao') fillColor = '#f97316';
                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                      })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#3b82f6]" />
                      <span>Conselhos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
                      <span>Comitês</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#f97316]" />
                      <span>Comissões</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cards por Tipo de Órgão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Conselhos
                  </CardTitle>
                  <CardDescription>{councilMetrics.total} tarefas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Resolvidas
                    </span>
                    <span className="font-semibold">{councilMetrics.resolved}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Pendentes
                    </span>
                    <span className="font-semibold">{councilMetrics.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Atrasadas
                    </span>
                    <span className="font-semibold">{councilMetrics.overdue}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Taxa de Resolução</span>
                      <span className="text-primary">{councilMetrics.resolutionRate}%</span>
                    </div>
                    <Progress value={councilMetrics.resolutionRate} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Comitês
                  </CardTitle>
                  <CardDescription>{committeeMetrics.total} tarefas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Resolvidas
                    </span>
                    <span className="font-semibold">{committeeMetrics.resolved}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Pendentes
                    </span>
                    <span className="font-semibold">{committeeMetrics.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Atrasadas
                    </span>
                    <span className="font-semibold">{committeeMetrics.overdue}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Taxa de Resolução</span>
                      <span className="text-primary">{committeeMetrics.resolutionRate}%</span>
                    </div>
                    <Progress value={committeeMetrics.resolutionRate} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                    Comissões
                  </CardTitle>
                  <CardDescription>{commissionMetrics.total} tarefas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Resolvidas
                    </span>
                    <span className="font-semibold">{commissionMetrics.resolved}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Pendentes
                    </span>
                    <span className="font-semibold">{commissionMetrics.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Atrasadas
                    </span>
                    <span className="font-semibold">{commissionMetrics.overdue}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Taxa de Resolução</span>
                      <span className="text-primary">{commissionMetrics.resolutionRate}%</span>
                    </div>
                    <Progress value={commissionMetrics.resolutionRate} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Urgency Counters */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{urgencyCounts.overdue}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span>Atrasadas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{urgencyCounts.today}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Hoje</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{urgencyCounts.next3Days}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4 text-yellow-600" />
                    <span>Próximos 3 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>

          {/* ====================== VISÃO OPERACIONAL ====================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-primary">
              <ListTodo className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Visão Operacional - Gestão de Tarefas</h2>
            </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Tarefas Pendentes
                  <Badge variant="secondary">{filteredTasks.length}</Badge><Badge variant="secondary">{filteredTasks.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {loading ? 'Carregando...' : 'Ações que requerem sua atenção'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-3 gap-3">
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

                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todos ({actions.length})
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          Pendentes (No Prazo) ({pendingOnTime.length})
                        </div>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-purple-600" />
                          Em Andamento ({inProgress.length})
                        </div>
                      </SelectItem>
                      <SelectItem value="overdue">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          Atrasadas ({overdue.length})
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Resolvidas ({completed.length})
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange.from && !dateRange.to && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? dateRange.to ? <>
                              {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                            </> : format(dateRange.from, "dd/MM/yyyy") : <span>Filtrar por período</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 space-y-2">
                        <Calendar mode="range" selected={{
                          from: dateRange.from,
                          to: dateRange.to
                        }} onSelect={range => setDateRange({
                          from: range?.from,
                          to: range?.to
                        })} numberOfMonths={2} locale={ptBR} className="pointer-events-auto" />
                        <Button variant="outline" className="w-full" onClick={() => setDateRange({
                          from: undefined,
                          to: undefined
                        })}>
                          Limpar filtro
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

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
                      <Button variant="outline" size="sm" className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all" onClick={() => handleOpenPreview('all')}>
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Todas Tarefas</span>
                        <Badge variant="secondary" className="text-xs">{pendingTasks.length}</Badge>
                      </Button>

                      <Button variant="outline" size="sm" className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all" onClick={() => handleOpenPreview('conselho')}>
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Conselhos</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'conselho').length}
                        </Badge>
                      </Button>

                      <Button variant="outline" size="sm" className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-green-100 hover:border-green-400 transition-all" onClick={() => handleOpenPreview('comite')}>
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium">Comitês</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comite').length}
                        </Badge>
                      </Button>

                      <Button variant="outline" size="sm" className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-amber-100 hover:border-amber-400 transition-all" onClick={() => handleOpenPreview('comissao')}>
                        <Briefcase className="h-5 w-5 text-amber-600" />
                        <span className="text-xs font-medium">Comissões</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comissao').length}
                        </Badge>
                      </Button>

                      <Button variant="outline" size="sm" className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-purple-100 hover:border-purple-400 transition-all" onClick={() => setReportModalOpen(true)}>
                        <Settings className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-medium">Personalizado</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks List */}
                {loading ? <div className="text-center py-8 text-muted-foreground">
                    <p>Carregando tarefas...</p>
                  </div> : filteredTasks.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma tarefa encontrada para este filtro</p>
                  </div> : filteredTasks.map(task => <div key={task.id} className={`flex items-start justify-between gap-4 p-4 rounded-lg transition-colors cursor-pointer hover:opacity-80 ${getUrgencyColor(task.dueDate)}`} onClick={() => handleOpenTaskDetail(task)}>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-none">{task.task}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {task.organName}
                          </Badge>
                          {task.responsible && <Badge variant="secondary" className="text-xs">
                              {task.responsible}
                            </Badge>}
                          <span className="text-xs text-muted-foreground">
                            Prazo: {format(task.dueDate, "dd 'de' MMMM", {
                          locale: ptBR
                        })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={e => {
                      e.stopPropagation();
                      handleOpenTaskDetail(task);
                    }}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver e Editar
                        </Button>
                      </div>
                    </div>)}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="guests" className="mt-6">
          <GuestDocumentApproval />
        </TabsContent>
      </Tabs>

      <PendingTasksReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} tasks={pendingTasks.map(task => ({
      id: task.id,
      task: task.task,
      description: task.task,
      priority: task.priority,
      due_date: task.dueDate.toISOString().split('T')[0],
      dueDate: task.dueDate,
      organType: task.organType,
      organName: task.organName,
      responsibleName: task.responsible,
      responsibleEmail: task.responsibleEmail
    }))} />

      <PendingTasksPreviewModal open={previewModalOpen} onOpenChange={setPreviewModalOpen} tasks={previewTasks} selectedOrganType={previewOrganType} />

      <TaskDetailModal open={taskDetailModalOpen} onOpenChange={setTaskDetailModalOpen} task={selectedTask} onComplete={isAdmin ? handleCompleteTask : undefined} />
    </div>;
};