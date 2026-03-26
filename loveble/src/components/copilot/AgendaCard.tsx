import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Check,
  X,
  Edit,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
  FileText,
  Brain,
  Send,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { GeneratedAgenda } from "@/types/copilot";
import { TopicCard } from "./TopicCard";
import { PriorityMatrix } from "./PriorityMatrix";

interface AgendaCardProps {
  agenda: GeneratedAgenda;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Aguardando Aprovação",
    color: "bg-warning/10 text-warning dark:bg-warning/10 dark:text-warning",
  },
  approved: {
    label: "Aprovada",
    color: "bg-success/10 text-success dark:bg-success/10 dark:text-success",
  },
  rejected: {
    label: "Rejeitada",
    color: "bg-destructive/10 text-destructive dark:bg-destructive/10 dark:text-destructive",
  },
  archived: {
    label: "Arquivada",
    color: "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
  },
};

export function AgendaCard({ agenda, onApprove, onReject, onEdit }: AgendaCardProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [expandedView, setExpandedView] = useState(false);

  const status = statusConfig[agenda.status];
  const meetingDate = new Date(agenda.meetingDate);

  const totalDuration = agenda.topics.reduce(
    (acc, topic) => acc + topic.estimatedDuration,
    0
  );

  const criticalTopics = agenda.topics.filter((t) => t.priority === "critical");
  const highTopics = agenda.topics.filter((t) => t.priority === "high");

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/5 dark:to-primary/10 border-b">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">
                  Reunião de{" "}
                  {format(meetingDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={status.color}>{status.label}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Gerada em{" "}
                  {format(new Date(agenda.generatedAt), "dd/MM 'às' HH:mm")}
                </span>
              </div>
            </div>

            {agenda.status === "pending" && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(agenda.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => setShowApproveDialog(true)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {agenda.topics.length}
              </div>
              <div className="text-xs text-muted-foreground">Pautas Sugeridas</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                <Clock className="h-5 w-5" />
                {Math.floor(totalDuration / 60)}h{totalDuration % 60 > 0 ? ` ${totalDuration % 60}m` : ""}
              </div>
              <div className="text-xs text-muted-foreground">Duração Estimada</div>
            </div>
            <div className="text-center p-3 bg-destructive/10 dark:bg-destructive/10 rounded-lg">
              <div className="text-2xl font-bold text-destructive">
                {criticalTopics.length}
              </div>
              <div className="text-xs text-destructive/80">Críticas</div>
            </div>
            <div className="text-center p-3 bg-warning/10 dark:bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {highTopics.length}
              </div>
              <div className="text-xs text-warning/80">Alta Prioridade</div>
            </div>
          </div>

          {/* Market Context Alert */}
          <Alert className="border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary dark:text-primary">
              Contexto de Mercado
            </AlertTitle>
            <AlertDescription className="text-sm text-primary/80 dark:text-primary/80">
              {agenda.marketContext}
            </AlertDescription>
          </Alert>

          {/* Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Alerts */}
            {agenda.riskAlerts.length > 0 && (
              <div className="p-4 rounded-lg bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 dark:border-destructive/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-sm text-destructive dark:text-destructive">
                    Alertas de Risco
                  </span>
                </div>
                <ul className="space-y-2">
                  {agenda.riskAlerts.map((alert, i) => (
                    <li key={i} className="text-xs text-destructive/80 dark:text-destructive/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunity Highlights */}
            {agenda.opportunityHighlights.length > 0 && (
              <div className="p-4 rounded-lg bg-success/5 dark:bg-success/10 border border-success/20 dark:border-success/20">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-success" />
                  <span className="font-semibold text-sm text-success dark:text-success">
                    Oportunidades em Destaque
                  </span>
                </div>
                <ul className="space-y-2">
                  {agenda.opportunityHighlights.map((opp, i) => (
                    <li key={i} className="text-xs text-success/80 dark:text-success/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Priority Matrix */}
          <div>
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Matriz de Priorização
            </h4>
            <PriorityMatrix matrix={agenda.priorityMatrix} topics={agenda.topics} />
          </div>

          {/* Toggle Topics View */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? "Ocultar Pautas Detalhadas" : "Ver Pautas Detalhadas"}
          </Button>

          {/* Topics Grid */}
          {expandedView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {agenda.topics.map((topic, index) => (
                <TopicCard key={topic.id} topic={topic} index={index + 1} />
              ))}
            </div>
          )}

          {/* Briefing Info (quando aprovada) */}
          {agenda.status === "approved" && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-success/5 to-success/10 dark:from-success/5 dark:to-success/10 border border-success/20 dark:border-success/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
                  <Brain className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Briefings Personalizados Gerados
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Os membros do conselho receberam seus briefings personalizados com análises e perguntas críticas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    Enviados
                  </Badge>
                  <Badge variant="outline" className="border-success/30 text-success">
                    <Send className="h-3 w-3 mr-1" />
                    Notificados
                  </Badge>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              Aprovar Agenda
            </DialogTitle>
            <DialogDescription>
              Ao aprovar, a pauta será disponibilizada para todos os membros do conselho.
            </DialogDescription>
          </DialogHeader>
          
          {/* Info sobre briefings */}
          <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Geração Automática de Briefings
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  O Agent D irá gerar briefings personalizados para cada membro do conselho com:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-success" /> Resumo executivo personalizado
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-success" /> Análise por pauta
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-success" /> Perguntas críticas específicas
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-success" /> Checklist de preparação
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={() => {
                onApprove(agenda.id);
                setShowApproveDialog(false);
              }}
            >
              <Check className="h-4 w-4 mr-1" />
              Aprovar e Gerar Briefings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Agenda</DialogTitle>
            <DialogDescription>
              A agenda será rejeitada e você poderá gerar uma nova pauta para esta
              reunião. Os tópicos não serão aproveitados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onReject(agenda.id);
                setShowRejectDialog(false);
              }}
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AgendaCard;




