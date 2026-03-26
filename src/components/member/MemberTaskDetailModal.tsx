import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CheckCircle, Calendar, Clock, AlertTriangle, Flag, Building2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "Alta" | "Média" | "Baixa";
  origin: string;
  council: string;
  createdAt: string;
  status: string;
}

interface MemberTaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onMarkResolved: (taskId: string, comment: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta": return "bg-red-100 text-red-700 border-red-200";
    case "Média": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Baixa": return "bg-green-100 text-green-700 border-green-200";
    default: return "";
  }
};

const getDaysRemaining = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline.split("/").reverse().join("-"));
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getUrgencyInfo = (daysRemaining: number) => {
  if (daysRemaining < 0) {
    return { text: `${Math.abs(daysRemaining)} dias em atraso`, color: "text-red-600", bgColor: "bg-red-50 border-red-200" };
  }
  if (daysRemaining === 0) {
    return { text: "Vence hoje", color: "text-red-600", bgColor: "bg-red-50 border-red-200" };
  }
  if (daysRemaining <= 3) {
    return { text: `${daysRemaining} dias restantes`, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" };
  }
  if (daysRemaining <= 7) {
    return { text: `${daysRemaining} dias restantes`, color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200" };
  }
  return { text: `${daysRemaining} dias restantes`, color: "text-green-600", bgColor: "bg-green-50 border-green-200" };
};

export function MemberTaskDetailModal({ open, onClose, task, onMarkResolved }: MemberTaskDetailModalProps) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleMarkResolved = async () => {
    if (!task) return;

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onMarkResolved(task.id, comment);
    toast.success("Tarefa marcada como resolvida");
    setSubmitting(false);
    setComment("");
    onClose();
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  if (!task) return null;

  const daysRemaining = getDaysRemaining(task.deadline);
  const urgency = getUrgencyInfo(daysRemaining);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalhes da Pendência
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Task Title and Priority */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>

          {/* Urgency Alert */}
          <div className={`flex items-center gap-3 p-3 border rounded-lg ${urgency.bgColor}`}>
            {daysRemaining < 0 ? (
              <AlertTriangle className={`h-5 w-5 ${urgency.color}`} />
            ) : (
              <Clock className={`h-5 w-5 ${urgency.color}`} />
            )}
            <div>
              <p className={`font-medium ${urgency.color}`}>{urgency.text}</p>
              <p className="text-xs text-muted-foreground">Prazo: {task.deadline}</p>
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Órgão</Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{task.council}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Origem</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{task.origin}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Criada em</Label>
              <span className="text-sm">{task.createdAt}</span>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="outline">{task.status}</Badge>
            </div>
          </div>

          {/* Resolution Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comentário de Resolução (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Descreva como a tarefa foi resolvida ou adicione observações relevantes..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleMarkResolved} 
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              "Processando..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Resolvida
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
