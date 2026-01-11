import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  FileText,
  CheckCircle2,
  Loader2,
  Brain,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useGeneratedAgendas, useUpcomingMeetings } from "@/hooks/useMockCopilot";
import { AgendaCard } from "./AgendaCard";
import { BriefingGenerationStatus } from "./BriefingGenerationStatus";

export function AgendaSuggestionsTab() {
  const { meetings, nextMeeting } = useUpcomingMeetings();
  const {
    agendas,
    pendingAgendas,
    approvedAgendas,
    isGenerating,
    generateAgenda,
    approveAgenda,
    rejectAgenda,
    briefingGeneratorState,
  } = useGeneratedAgendas();

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [showBriefingStatus, setShowBriefingStatus] = useState(true);

  const meetingsWithoutAgenda = meetings.filter(
    (m) => !agendas.some((a) => a.meetingId === m.id)
  );

  const filteredAgendas =
    filter === "pending"
      ? pendingAgendas
      : filter === "approved"
      ? approvedAgendas
      : agendas;

  const handleGenerateAgenda = async () => {
    if (selectedMeetingId) {
      await generateAgenda(selectedMeetingId);
      setSelectedMeetingId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Status de Geração de Briefings */}
      {showBriefingStatus && (briefingGeneratorState.isGenerating || briefingGeneratorState.generatedBriefings.length > 0) && (
        <BriefingGenerationStatus
          isGenerating={briefingGeneratorState.isGenerating}
          progress={briefingGeneratorState.progress}
          currentMember={briefingGeneratorState.currentMember}
          totalMembers={briefingGeneratorState.totalMembers}
          completedBriefings={briefingGeneratorState.generatedBriefings}
          onClose={() => setShowBriefingStatus(false)}
        />
      )}

      {/* Upcoming Meetings Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Próximas Reuniões
          </CardTitle>
          <CardDescription>
            Selecione uma reunião para gerar pautas com IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {meetings.map((meeting) => {
              const daysUntil = differenceInDays(new Date(meeting.date), new Date());
              const hasAgenda = agendas.some((a) => a.meetingId === meeting.id);
              const hasApprovedAgenda = agendas.some(
                (a) => a.meetingId === meeting.id && a.status === "approved"
              );

              return (
                <div
                  key={meeting.id}
                  className={cn(
                    "flex-1 min-w-[200px] p-4 rounded-lg border-2 transition-all",
                    hasApprovedAgenda
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : hasAgenda
                      ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-muted/50 border-dashed hover:border-indigo-300 cursor-pointer"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {format(new Date(meeting.date), "dd/MM", { locale: ptBR })}
                    </span>
                    <Badge
                      variant={daysUntil <= 7 ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {daysUntil === 0
                        ? "Hoje"
                        : daysUntil === 1
                        ? "Amanhã"
                        : `${daysUntil} dias`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {meeting.councilName}
                  </p>
                  <div className="flex items-center gap-1">
                    {hasApprovedAgenda ? (
                      <Badge className="text-[10px] bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Aprovada
                      </Badge>
                    ) : hasAgenda ? (
                      <Badge className="text-[10px] bg-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        <FileText className="h-3 w-3 mr-1" />
                        Sem Pauta
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generate New Agenda */}
      {meetingsWithoutAgenda.length > 0 && (
        <Card className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  Gerar Nova Pauta com IA
                </h4>
                <p className="text-sm text-muted-foreground">
                  A IA analisará dados internos, riscos, oportunidades e contexto de
                  mercado para sugerir pautas estratégicas.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Selecione uma reunião" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingsWithoutAgenda.map((meeting) => (
                      <SelectItem key={meeting.id} value={meeting.id}>
                        {format(new Date(meeting.date), "dd/MM/yyyy")} -{" "}
                        {meeting.councilName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleGenerateAgenda}
                  disabled={!selectedMeetingId || isGenerating}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Gerar Pauta
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info sobre briefings automáticos */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Brain className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Geração Automática de Briefings
              </p>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">
                Ao aprovar uma pauta, o sistema gera automaticamente briefings personalizados para cada membro do conselho usando IA.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pautas Geradas</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas ({agendas.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            <Clock className="h-4 w-4 mr-1" />
            Pendentes ({pendingAgendas.length})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
            className={filter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Aprovadas ({approvedAgendas.length})
          </Button>
        </div>
      </div>

      {/* Agendas List */}
      {filteredAgendas.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">Nenhuma pauta encontrada</h4>
          <p className="text-muted-foreground mb-4">
            {filter === "pending"
              ? "Não há pautas aguardando aprovação."
              : filter === "approved"
              ? "Nenhuma pauta foi aprovada ainda."
              : "Gere sua primeira pauta selecionando uma reunião acima."}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredAgendas.map((agenda) => (
            <AgendaCard
              key={agenda.id}
              agenda={agenda}
              onApprove={approveAgenda}
              onReject={rejectAgenda}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AgendaSuggestionsTab;
