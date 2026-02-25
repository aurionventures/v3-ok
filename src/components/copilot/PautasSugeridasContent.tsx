import { useState } from "react";
import {
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MeetingStatus = "sem_pauta" | "pendente";
type AgendaStatus = "pendente" | "aprovada";
type AgendaFilter = "todas" | "pendentes" | "aprovadas";

type Meeting = {
  id: string;
  dateLabel: string;
  daysFromNow: number;
  councilName: string;
  status: MeetingStatus;
};

type GeneratedAgenda = {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  status: AgendaStatus;
  generatedAt: string;
  suggestedCount: number;
  durationEstimated: string;
  criticalCount: number;
  highPriorityCount: number;
};

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "1",
    dateLabel: "13/04",
    daysFromNow: 47,
    councilName: "Conselho de Administração",
    status: "sem_pauta",
  },
  {
    id: "2",
    dateLabel: "19/01",
    daysFromNow: -36,
    councilName: "Conselho de Administração",
    status: "pendente",
  },
  {
    id: "3",
    dateLabel: "27/01",
    daysFromNow: -28,
    councilName: "Conselho de Administração",
    status: "sem_pauta",
  },
  {
    id: "4",
    dateLabel: "04/02",
    daysFromNow: -20,
    councilName: "Conselho Fiscal",
    status: "sem_pauta",
  },
];

const MOCK_AGENDAS: GeneratedAgenda[] = [
  {
    id: "1",
    meetingTitle: "Reunião de 19 de janeiro de 2026",
    meetingDate: "19/01/2026",
    status: "pendente",
    generatedAt: "09/01 às 11:30",
    suggestedCount: 6,
    durationEstimated: "2h 55m",
    criticalCount: 2,
    highPriorityCount: 2,
  },
];

function MeetingCard({
  meeting,
  selected,
  onSelect,
}: {
  meeting: Meeting;
  selected: boolean;
  onSelect: () => void;
}) {
  const isPast = meeting.daysFromNow < 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "text-left rounded-lg border p-4 transition-colors w-full min-w-0",
        selected
          ? "border-amber-500 bg-amber-50/50"
          : "border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50/50"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-semibold text-gray-900">{meeting.dateLabel}</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            isPast ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {isPast ? `${meeting.daysFromNow} dias` : `${meeting.daysFromNow} dias`}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{meeting.councilName}</p>
      <div className="flex items-center gap-1.5">
        {meeting.status === "pendente" ? (
          <>
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs font-medium text-amber-700">Pendente</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="text-xs font-medium text-gray-600">Sem Pauta</span>
          </>
        )}
      </div>
    </button>
  );
}

function AgendaCard({
  agenda,
  onApprove,
  onReject,
}: {
  agenda: GeneratedAgenda;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="rounded-lg shadow-sm border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="h-5 w-5 text-gray-500 shrink-0" />
            <h3 className="font-semibold text-gray-900 truncate">
              {agenda.meetingTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReject}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Rejeitar
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge
            variant="secondary"
            className={
              agenda.status === "pendente"
                ? "bg-amber-100 text-amber-800 border-0"
                : "bg-green-100 text-green-800 border-0"
            }
          >
            {agenda.status === "pendente"
              ? "Aguardando Aprovação"
              : "Aprovada"}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Sparkles className="h-3.5 w-3.5" />
            Gerada em {agenda.generatedAt}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-md border bg-gray-50/80 p-3">
            <p className="text-xs text-gray-500 mb-0.5">Pautas Sugeridas</p>
            <p className="text-lg font-semibold text-gray-900">
              {agenda.suggestedCount}
            </p>
          </div>
          <div className="rounded-md border bg-gray-50/80 p-3">
            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Duração Estimada
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {agenda.durationEstimated}
            </p>
          </div>
          <div className="rounded-md border bg-red-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">Críticas</p>
            <p className="text-lg font-semibold text-red-700">
              {agenda.criticalCount}
            </p>
          </div>
          <div className="rounded-md border bg-amber-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">Alta Prioridade</p>
            <p className="text-lg font-semibold text-amber-700">
              {agenda.highPriorityCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PautasSugeridasContent() {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>("2");
  const [agendaFilter, setAgendaFilter] = useState<AgendaFilter>("todas");
  const [agendas, setAgendas] = useState<GeneratedAgenda[]>(MOCK_AGENDAS);

  const filteredAgendas = agendas.filter((a) => {
    if (agendaFilter === "pendentes") return a.status === "pendente";
    if (agendaFilter === "aprovadas") return a.status === "aprovada";
    return true;
  });

  const handleApprove = (id: string) => {
    setAgendas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "aprovada" as const } : a))
    );
  };

  const handleReject = (id: string) => {
    setAgendas((prev) => prev.filter((a) => a.id !== id));
  };

  const pendentesCount = agendas.filter((a) => a.status === "pendente").length;
  const aprovadasCount = agendas.filter((a) => a.status === "aprovada").length;

  return (
    <div className="space-y-8 mt-6">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Próximas Reuniões</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Selecione uma reunião para gerar pautas com IA
        </p>
        <div className="flex flex-wrap items-stretch gap-4">
          {MOCK_MEETINGS.map((meeting) => (
            <div key={meeting.id} className="flex-1 min-w-[200px] max-w-[260px]">
              <MeetingCard
                meeting={meeting}
                selected={selectedMeetingId === meeting.id}
                onSelect={() => setSelectedMeetingId(meeting.id)}
              />
            </div>
          ))}
          <div className="flex items-center min-w-[200px]">
            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white h-full min-h-[120px] px-6"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Gerar Nova Pauta com IA
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Pautas Geradas</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={agendaFilter === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("todas")}
            className={
              agendaFilter === "todas"
                ? "bg-gray-900 hover:bg-gray-800"
                : "border-gray-300"
            }
          >
            Todas ({agendas.length})
          </Button>
          <Button
            variant={agendaFilter === "pendentes" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("pendentes")}
            className={
              agendaFilter === "pendentes"
                ? "bg-gray-900 hover:bg-gray-800"
                : "border-gray-300"
            }
          >
            <Clock className="h-4 w-4 mr-1" />
            Pendentes ({pendentesCount})
          </Button>
          <Button
            variant={agendaFilter === "aprovadas" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("aprovadas")}
            className={
              agendaFilter === "aprovadas"
                ? "bg-gray-900 hover:bg-gray-800"
                : "border-gray-300"
            }
          >
            <Check className="h-4 w-4 mr-1" />
            Aprovadas ({aprovadasCount})
          </Button>
        </div>
        <div className="space-y-4">
          {filteredAgendas.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Nenhuma pauta encontrada para o filtro selecionado.
            </p>
          ) : (
            filteredAgendas.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={agenda}
                onApprove={() => handleApprove(agenda.id)}
                onReject={() => handleReject(agenda.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
