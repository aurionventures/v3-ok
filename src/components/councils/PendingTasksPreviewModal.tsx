import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Building2, Users, Briefcase, Mail, Download, BarChart3, Filter, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { generatePendingTasksReportPDF } from "./PendingTasksReportPDF";
import { MeetingActionWithContext } from "@/hooks/useAllMeetingActions";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  description: string;
  priority?: 'ALTA' | 'MEDIA' | 'BAIXA';
  due_date: string;
  organType?: string;
  organName?: string;
  responsibleName?: string;
  responsibleEmail?: string;
}

interface PendingTasksPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  selectedOrganType?: string;
  selectedOrganId?: string;
}

export const PendingTasksPreviewModal = ({
  open,
  onOpenChange,
  tasks,
  selectedOrganType,
  selectedOrganId,
}: PendingTasksPreviewModalProps) => {
  const { toast } = useToast();

  const getOrganTypeIcon = (type?: string) => {
    switch (type) {
      case 'conselho': return <Building2 className="h-4 w-4" />;
      case 'comite': return <Users className="h-4 w-4" />;
      case 'comissao': return <Briefcase className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const variantMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      ALTA: 'destructive',
      MEDIA: 'default',
      BAIXA: 'secondary',
    };
    return (
      <Badge variant={variantMap[priority || 'MEDIA']}>
        {priority || 'MÉDIA'}
      </Badge>
    );
  };

  const getOrganTypeLabel = (type?: string) => {
    switch (type) {
      case 'conselho': return 'Conselho';
      case 'comite': return 'Comitê';
      case 'comissao': return 'Comissão';
      default: return 'Órgão';
    }
  };

  const getUrgencyColor = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays === 0) return 'text-orange-600 font-semibold';
    if (diffDays <= 3) return 'text-yellow-600 font-semibold';
    return 'text-muted-foreground';
  };

  const summary = {
    total: tasks.length,
    byOrganType: tasks.reduce((acc, task) => {
      const type = task.organType || 'Outros';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleExportPDF = async () => {
    try {
      const reportData = {
        tasks: tasks.map(t => ({
          id: t.id,
          task: t.description,
          description: t.description,
          priority: (t.priority === 'ALTA' ? 'high' : 
                    t.priority === 'MEDIA' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
          due_date: t.due_date,
          dueDate: new Date(t.due_date),
          organ: t.organName || 'N/A',
          organName: t.organName,
          organType: t.organType as 'conselho' | 'comite' | 'comissao',
          responsibleName: t.responsibleName,
          responsibleEmail: t.responsibleEmail,
        })),
        summary: {
          total: summary.total,
          byOrganType: {
            conselhos: Object.entries(summary.byOrganType).filter(([k]) => k === 'conselho').reduce((sum, [, v]) => sum + v, 0),
            comites: Object.entries(summary.byOrganType).filter(([k]) => k === 'comite').reduce((sum, [, v]) => sum + v, 0),
            comissoes: Object.entries(summary.byOrganType).filter(([k]) => k === 'comissao').reduce((sum, [, v]) => sum + v, 0),
          },
        },
        filters: {
          priorities: [],
          organs: [],
          organsByType: {
            conselhos: [],
            comites: [],
            comissoes: [],
          },
        },
      };
      await generatePendingTasksReportPDF(reportData);
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi baixado.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível criar o relatório.",
        variant: "destructive",
      });
    }
  };

  const handleSendToResponsibles = async () => {
    try {
      // Agrupar tarefas por responsável
      const tasksByResponsible = tasks.reduce((acc, task) => {
        const email = task.responsibleEmail;
        if (email) {
          if (!acc[email]) {
            acc[email] = {
              name: task.responsibleName || 'Responsável',
              tasks: [],
            };
          }
          acc[email].tasks.push(task);
        }
        return acc;
      }, {} as Record<string, { name: string; tasks: Task[] }>);

      const emails = Object.keys(tasksByResponsible);
      
      if (emails.length === 0) {
        toast({
          title: "Nenhum responsável encontrado",
          description: "As tarefas não possuem e-mails de responsáveis.",
          variant: "destructive",
        });
        return;
      }

      // Criar notificações para cada responsável
      for (const email of emails) {
        const { name, tasks: responsibleTasks } = tasksByResponsible[email];
        
        await supabase.from('notifications').insert({
          external_email: email,
          type: 'PENDENCIA_COBRANCA',
          channel: 'EMAIL',
          title: `Relatório de Pendências - ${responsibleTasks.length} ações`,
          message: `Olá ${name}, você possui ${responsibleTasks.length} pendências que requerem sua atenção.`,
          status: 'PENDENTE',
          scheduled_at: new Date().toISOString(),
          context: {
            tasks: responsibleTasks.map(t => ({
              description: t.description,
              due_date: t.due_date,
              priority: t.priority,
            })),
          },
        });
      }

      toast({
        title: "E-mails enviados com sucesso",
        description: `Relatórios enviados para ${emails.length} responsável(is).`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar e-mails",
        description: "Não foi possível enviar os relatórios.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Preview do Relatório de Pendências</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cabeçalho do Relatório */}
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório de Tarefas Pendentes
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerado em: {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </CardHeader>
          </Card>

          {/* Resumo Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Resumo Executivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Total de Tarefas:</span>
                <Badge variant="default">{summary.total}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {Object.entries(summary.byOrganType).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    {getOrganTypeIcon(type)}
                    <span className="text-sm">
                      {getOrganTypeLabel(type)}: <strong>{count}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filtros Aplicados */}
          {(selectedOrganType || selectedOrganId) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  Filtros Aplicados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedOrganType && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tipo de Órgão:</span>
                    <Badge>{getOrganTypeLabel(selectedOrganType)}</Badge>
                  </div>
                )}
                {selectedOrganId && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Órgão Específico:</span>
                    <Badge variant="outline">Selecionado</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lista de Tarefas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-600" />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma tarefa pendente encontrada
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-muted-foreground">
                        {index + 1}.
                      </span>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">{task.description}</p>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {task.organName && (
                            <div className="flex items-center gap-1">
                              {getOrganTypeIcon(task.organType)}
                              <span>{task.organName}</span>
                            </div>
                          )}
                          {task.responsibleName && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{task.responsibleName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={getUrgencyColor(task.due_date)}>
                              {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {tasks.length} tarefa(s) neste relatório
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="secondary" onClick={handleSendToResponsibles}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar para Responsáveis
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
