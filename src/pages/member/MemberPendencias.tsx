import { useState } from "react";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Eye, CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { MemberTaskDetailModal } from "@/components/member/MemberTaskDetailModal";

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

const MemberPendencias = () => {
  const [tasks, setTasks] = useState(initialMemberTasks);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof initialMemberTasks[0] | null>(null);

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

  const getUrgencyBg = (daysRemaining: number) => {
    if (daysRemaining <= 3) return 'bg-red-500/10';
    if (daysRemaining <= 7) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  const handleOpenTaskDetail = (task: typeof initialMemberTasks[0]) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleMarkTaskResolved = (taskId: string, comment: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'RESOLVIDA' } : t));
    setTaskDetailOpen(false);
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDENTE');

  return (
    <MemberLayout 
      title="Minhas Pendências"
      subtitle="Tarefas atribuídas a você"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <AlertTriangle className="h-7 w-7 text-yellow-500" />
            Tarefas Pendentes
            <Badge variant="secondary" className="ml-2 text-base px-3 py-1">
              {pendingTasks.length} pendentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {pendingTasks.map((task) => {
            const daysRemaining = getDaysRemaining(task.dueDate);
            const urgencyColor = getUrgencyColor(daysRemaining);
            const urgencyBg = getUrgencyBg(daysRemaining);
            
            return (
              <div 
                key={task.id} 
                className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-xl border-2 bg-card gap-5"
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center ${urgencyBg}`}>
                    <Clock className={`h-7 w-7 ${urgencyColor}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground mt-1">
                      <span>Prazo: {format(task.dueDate, "dd/MM/yyyy")}</span>
                      <span className={`font-medium ${urgencyColor}`}>
                        ({daysRemaining < 0 
                          ? `${Math.abs(daysRemaining)} dias atrasado` 
                          : `${daysRemaining} dias restantes`})
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground mt-2">
                      Origem: {task.origin}
                    </p>
                    <Badge 
                      variant={task.priority === 'Alta' ? 'destructive' : 'secondary'}
                      className="mt-3 text-sm px-4 py-1.5"
                    >
                      Prioridade {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto lg:ml-0">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => handleOpenTaskDetail(task)}
                    className="text-base h-12 px-6"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => handleOpenTaskDetail(task)}
                    className="text-base h-12 px-6"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Resolver
                  </Button>
                </div>
              </div>
            );
          })}

          {pendingTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-medium">Todas as pendências resolvidas</p>
              <p className="text-base text-muted-foreground">Você não tem tarefas pendentes no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Detail Modal */}
      <MemberTaskDetailModal
        open={taskDetailOpen}
        onClose={() => setTaskDetailOpen(false)}
        task={selectedTask ? {
          id: selectedTask.id,
          title: selectedTask.title,
          description: selectedTask.description,
          deadline: selectedTask.deadline,
          priority: selectedTask.priority,
          origin: selectedTask.origin,
          council: selectedTask.council,
          createdAt: selectedTask.createdAt,
          status: selectedTask.status
        } : null}
        onMarkResolved={handleMarkTaskResolved}
      />
    </MemberLayout>
  );
};

export default MemberPendencias;
