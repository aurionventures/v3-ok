import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Building2, Users, Briefcase, Mail, MessageCircle, CheckCircle2, User, Clock, AlertCircle, Link2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    task: string;
    organName: string;
    organType: 'conselho' | 'comite' | 'comissao';
    dueDate: Date;
    priority: 'high' | 'medium' | 'low';
    responsible: string;
    responsibleEmail?: string | null;
    status: string;
  } | null;
  onComplete: (taskId: string) => void;
}

export const TaskDetailModal = ({ open, onOpenChange, task, onComplete }: TaskDetailModalProps) => {
  const { toast } = useToast();

  if (!task) return null;

  const getOrganTypeIcon = () => {
    switch (task.organType) {
      case 'conselho': return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'comite': return <Users className="h-5 w-5 text-green-600" />;
      case 'comissao': return <Briefcase className="h-5 w-5 text-orange-600" />;
    }
  };

  const getOrganTypeLabel = () => {
    switch (task.organType) {
      case 'conselho': return 'Conselho';
      case 'comite': return 'Comitê';
      case 'comissao': return 'Comissão';
    }
  };

  const getPriorityBadge = () => {
    const variants = {
      high: { label: 'Alta', variant: 'destructive' as const },
      medium: { label: 'Média', variant: 'default' as const },
      low: { label: 'Baixa', variant: 'secondary' as const },
    };
    const { label, variant } = variants[task.priority];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: any }> = {
      PENDENTE: { label: 'Pendente', variant: 'default', icon: Clock },
      EM_ANDAMENTO: { label: 'Em Andamento', variant: 'secondary', icon: AlertCircle },
      ATRASADA: { label: 'Atrasada', variant: 'destructive', icon: AlertCircle },
      CONCLUIDA: { label: 'Concluída', variant: 'default', icon: CheckCircle2 },
    };
    const status = statusMap[task.status] || statusMap.PENDENTE;
    const Icon = status.icon;
    return (
      <Badge variant={status.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.label}
      </Badge>
    );
  };

  const getUrgencyInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Atrasada há ${Math.abs(diffDays)} dia(s)`, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (diffDays === 0) return { text: 'Vence hoje!', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (diffDays <= 3) return { text: `Vence em ${diffDays} dia(s)`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { text: `Vence em ${diffDays} dias`, color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const handleSendEmailAlert = async () => {
    if (!task.responsibleEmail) {
      toast({
        title: "E-mail não cadastrado",
        description: "Esta tarefa não possui um e-mail de responsável cadastrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('notifications').insert({
        external_email: task.responsibleEmail,
        type: 'PENDENCIA_COBRANCA',
        channel: 'EMAIL',
        title: `Alerta: Tarefa Pendente - ${task.organName}`,
        message: `Olá ${task.responsible}, você possui uma tarefa pendente que requer sua atenção: "${task.task}". Prazo: ${format(task.dueDate, 'dd/MM/yyyy')}`,
        status: 'PENDENTE',
        scheduled_at: new Date().toISOString(),
        context: {
          task_id: task.id,
          description: task.task,
          due_date: task.dueDate.toISOString(),
          priority: task.priority,
          organ: task.organName,
        },
      });

      if (error) throw error;

      toast({
        title: "Alerta enviado por e-mail",
        description: `Notificação enviada para ${task.responsibleEmail}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível enviar a notificação por e-mail.",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsAppAlert = async () => {
    if (!task.responsibleEmail) {
      toast({
        title: "Responsável não cadastrado",
        description: "Esta tarefa não possui um responsável cadastrado para envio via WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('notifications').insert({
        external_email: task.responsibleEmail,
        type: 'PENDENCIA_COBRANCA',
        channel: 'WHATSAPP',
        title: `Alerta: Tarefa Pendente - ${task.organName}`,
        message: `🔔 *Alerta de Pendência*\n\n*Tarefa:* ${task.task}\n*Órgão:* ${task.organName}\n*Prazo:* ${format(task.dueDate, 'dd/MM/yyyy', { locale: ptBR })}\n*Prioridade:* ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}\n\nPor favor, tome as ações necessárias.`,
        status: 'PENDENTE',
        scheduled_at: new Date().toISOString(),
        context: {
          task_id: task.id,
          description: task.task,
          due_date: task.dueDate.toISOString(),
          priority: task.priority,
          organ: task.organName,
        },
      });

      if (error) throw error;

      toast({
        title: "Alerta enviado via WhatsApp",
        description: `Notificação programada para ${task.responsible}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível programar a notificação via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async () => {
    await onComplete(task.id);
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    if (!task.responsibleEmail) {
      toast({
        title: "Responsável não cadastrado",
        description: "Esta tarefa não possui um responsável cadastrado.",
        variant: "destructive",
      });
      return;
    }

    // Gerar token demo
    const token = crypto.randomUUID();
    const demoLink = `${window.location.origin}/task-access/${token}`;
    
    // Salvar token no localStorage
    localStorage.setItem(`task_token_${token}`, JSON.stringify({
      actionId: task.id,
      responsibleName: task.responsible,
      responsibleEmail: task.responsibleEmail,
      createdAt: new Date().toISOString(),
    }));
    
    // Copiar para área de transferência
    navigator.clipboard.writeText(demoLink);
    
    toast({
      title: "Link copiado!",
      description: "O link de acesso à tarefa foi copiado para a área de transferência.",
    });
  };

  const urgency = getUrgencyInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {getOrganTypeIcon()}
            Detalhes da Tarefa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Urgency Banner */}
          <Card className={`${urgency.bgColor} border-0`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className={`h-5 w-5 ${urgency.color}`} />
                <span className={`font-semibold ${urgency.color}`}>{urgency.text}</span>
              </div>
            </CardContent>
          </Card>

          {/* Task Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Descrição da Tarefa</h3>
            <p className="text-base font-medium">{task.task}</p>
          </div>

          <Separator />

          {/* Task Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getOrganTypeIcon()}
                <span>Órgão</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getOrganTypeLabel()}</Badge>
                <span className="text-sm font-medium">{task.organName}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Responsável</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{task.responsible}</p>
                {task.responsibleEmail && (
                  <p className="text-xs text-muted-foreground">{task.responsibleEmail}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Prazo</span>
              </div>
              <p className="text-sm font-semibold">
                {format(task.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Prioridade</span>
              </div>
              {getPriorityBadge()}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>Status</span>
              </div>
              {getStatusBadge()}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Ações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleSendEmailAlert}
                className="w-full"
                disabled={!task.responsibleEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar E-mail
              </Button>

              <Button
                variant="outline"
                onClick={handleSendWhatsAppAlert}
                className="w-full"
                disabled={!task.responsibleEmail}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="w-full"
                disabled={!task.responsibleEmail}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Copiar Link de Acesso
              </Button>

              <Button
                variant="default"
                onClick={handleCompleteTask}
                className="w-full"
                disabled={task.status === 'CONCLUIDA'}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como Concluída
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
