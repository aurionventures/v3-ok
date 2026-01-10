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
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  approved: {
    label: "Aprovada",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejeitada",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  archived: {
    label: "Arquivada",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
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
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-indigo-600" />
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
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
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
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {criticalTopics.length}
              </div>
              <div className="text-xs text-red-600/80">Críticas</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {highTopics.length}
              </div>
              <div className="text-xs text-orange-600/80">Alta Prioridade</div>
            </div>
          </div>

          {/* Market Context Alert */}
          <Alert className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <AlertTitle className="text-indigo-700 dark:text-indigo-400">
              Contexto de Mercado
            </AlertTitle>
            <AlertDescription className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
              {agenda.marketContext}
            </AlertDescription>
          </Alert>

          {/* Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Alerts */}
            {agenda.riskAlerts.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-sm text-red-700 dark:text-red-400">
                    Alertas de Risco
                  </span>
                </div>
                <ul className="space-y-2">
                  {agenda.riskAlerts.map((alert, i) => (
                    <li key={i} className="text-xs text-red-600/80 dark:text-red-400/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunity Highlights */}
            {agenda.opportunityHighlights.length > 0 && (
              <div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-sm text-green-700 dark:text-green-400">
                    Oportunidades em Destaque
                  </span>
                </div>
                <ul className="space-y-2">
                  {agenda.opportunityHighlights.map((opp, i) => (
                    <li key={i} className="text-xs text-green-600/80 dark:text-green-400/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
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

          {/* Generation Metadata */}
          {agenda.generationMetadata && (
            <div className="pt-4 border-t text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Modelo: {agenda.generationMetadata.model} | Tokens:{" "}
                {agenda.generationMetadata.tokensUsed.toLocaleString()}
              </span>
              <span>
                Tempo de geração: {(agenda.generationMetadata.generationTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Agenda</DialogTitle>
            <DialogDescription>
              Ao aprovar, a pauta será disponibilizada para todos os membros do conselho
              e os briefings personalizados serão gerados automaticamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onApprove(agenda.id);
                setShowApproveDialog(false);
              }}
            >
              Confirmar Aprovação
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




