import { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useAgenda } from "@/hooks/useAgenda";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  gerarPautaComIA,
  fetchPautasSugeridas,
  aprovarPautaSugerida,
  rejeitarPautaSugerida,
  type PautaSugeridaIA,
} from "@/services/copilotoPautas";
import { toast } from "@/hooks/use-toast";
import type { ReuniaoEnriquecida } from "@/types/agenda";

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
  reuniaoId: string;
  empresaId: string;
};

function reuniaoToMeeting(r: ReuniaoEnriquecida): Meeting {
  const data = r.data_reuniao ? new Date(r.data_reuniao) : new Date();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  const daysFromNow = Math.round((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  const councilName =
    r.conselho_nome ?? r.comite_nome ?? r.comissao_nome ?? r.titulo ?? "Reunião";
  const dateLabel = r.data_reuniao
    ? new Date(r.data_reuniao).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    : "—";
  return {
    id: r.id,
    dateLabel,
    daysFromNow,
    councilName,
    status: "sem_pauta",
  };
}

function pautaToAgenda(p: PautaSugeridaIA & { reunioes?: { titulo?: string; data_reuniao?: string } | null }): GeneratedAgenda {
  const titulo = p.reunioes?.titulo ?? "Reunião";
  const dataReuniao = p.reunioes?.data_reuniao;
  const meetingDate = dataReuniao ? new Date(dataReuniao).toLocaleDateString("pt-BR") : "—";
  const meetingAgenda = p.output_2a?.meeting_agenda ?? [];
  const suggestedCount = meetingAgenda.length;
  const criticalCount = (p.output_1?.strategic_risks?.length ?? 0) + (p.output_1?.operational_threats?.length ?? 0);
  const highPriorityCount = p.output_1?.strategic_opportunities?.length ?? 0;
  const created = p.created_at ? new Date(p.created_at) : new Date();
  const generatedAt = created.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " às " + created.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return {
    id: p.id,
    meetingTitle: titulo,
    meetingDate,
    status: p.status as AgendaStatus,
    generatedAt,
    suggestedCount,
    durationEstimated: suggestedCount > 0 ? `~${suggestedCount * 25} min` : "—",
    criticalCount,
    highPriorityCount,
    reuniaoId: p.reuniao_id,
    empresaId: p.empresa_id,
  };
}

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
          {isPast ? `${meeting.daysFromNow} dias` : `+${meeting.daysFromNow} dias`}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2 truncate">{meeting.councilName}</p>
      <div className="flex items-center gap-1.5">
        <FileText className="h-4 w-4 text-gray-500 shrink-0" />
        <span className="text-xs font-medium text-gray-600">Sem Pauta</span>
      </div>
    </button>
  );
}

function AgendaCard({
  agenda,
  onApprove,
  onReject,
  approveLoading,
  rejectLoading,
}: {
  agenda: GeneratedAgenda;
  onApprove: () => void;
  onReject: () => void;
  approveLoading?: boolean;
  rejectLoading?: boolean;
}) {
  return (
    <Card className="rounded-lg shadow-sm border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="h-5 w-5 text-gray-500 shrink-0" />
            <h3 className="font-semibold text-gray-900 truncate">{agenda.meetingTitle}</h3>
          </div>
          {agenda.status === "pendente" && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReject}
                disabled={rejectLoading || approveLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {rejectLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                Rejeitar
              </Button>
              <Button
                size="sm"
                onClick={onApprove}
                disabled={approveLoading || rejectLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {approveLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                Aprovar
              </Button>
            </div>
          )}
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
            {agenda.status === "pendente" ? "Aguardando Aprovação" : "Aprovada"}
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
            <p className="text-lg font-semibold text-gray-900">{agenda.suggestedCount}</p>
          </div>
          <div className="rounded-md border bg-gray-50/80 p-3">
            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Duração Estimada
            </p>
            <p className="text-lg font-semibold text-gray-900">{agenda.durationEstimated}</p>
          </div>
          <div className="rounded-md border bg-red-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">Riscos/Ameaças</p>
            <p className="text-lg font-semibold text-red-700">{agenda.criticalCount}</p>
          </div>
          <div className="rounded-md border bg-amber-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">Oportunidades</p>
            <p className="text-lg font-semibold text-amber-700">{agenda.highPriorityCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const COPILOTO_PAUTAS_KEY = ["copiloto", "pautas"] as const;

export function PautasSugeridasContent() {
  const { firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { reunioes } = useAgenda(empresaId ?? null);
  const qc = useQueryClient();

  const meetingsForSelect = reunioes
    .filter((r) => r.data_reuniao)
    .slice(0, 8);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [agendaFilter, setAgendaFilter] = useState<AgendaFilter>("todas");

  useEffect(() => {
    if (meetingsForSelect.length > 0 && !selectedMeetingId) {
      setSelectedMeetingId(meetingsForSelect[0].id);
    }
  }, [reunioes, selectedMeetingId]);

  const pautasQuery = useQuery({
    queryKey: [...COPILOTO_PAUTAS_KEY, empresaId ?? "none"],
    queryFn: () => fetchPautasSugeridas(empresaId!),
    enabled: !!empresaId,
  });

  const gerarMt = useMutation({
    mutationFn: ({ empresaId, reuniaoId }: { empresaId: string; reuniaoId: string }) =>
      gerarPautaComIA(empresaId, reuniaoId),
    onSuccess: (result) => {
      if (result.error) {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Pauta gerada", description: "A IA gerou a pauta. Revise e aprove para enviar briefings aos membros." });
        qc.invalidateQueries({ queryKey: [...COPILOTO_PAUTAS_KEY, empresaId ?? "none"] });
      }
    },
  });

  const aprovarMt = useMutation({
    mutationFn: ({ pautaId, empresaId, reuniaoId }: { pautaId: string; empresaId: string; reuniaoId: string }) =>
      aprovarPautaSugerida(pautaId, empresaId, reuniaoId),
    onSuccess: (result) => {
      if (result.error) {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Pauta aprovada", description: "Briefings foram enviados aos membros." });
        qc.invalidateQueries({ queryKey: [...COPILOTO_PAUTAS_KEY, empresaId ?? "none"] });
      }
    },
  });

  const rejeitarMt = useMutation({
    mutationFn: ({ pautaId, empresaId }: { pautaId: string; empresaId: string }) =>
      rejeitarPautaSugerida(pautaId, empresaId),
    onSuccess: (result) => {
      if (result.error) {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Pauta rejeitada" });
        qc.invalidateQueries({ queryKey: [...COPILOTO_PAUTAS_KEY, empresaId ?? "none"] });
      }
    },
  });

  const meetings: Meeting[] = meetingsForSelect.map(reuniaoToMeeting);

  const rawPautas = (pautasQuery.data ?? []) as (PautaSugeridaIA & { reunioes?: { titulo?: string; data_reuniao?: string } | null })[];
  const agendas: GeneratedAgenda[] = rawPautas.map(pautaToAgenda);

  const filteredAgendas = agendas.filter((a) => {
    if (agendaFilter === "pendentes") return a.status === "pendente";
    if (agendaFilter === "aprovadas") return a.status === "aprovada";
    return true;
  });

  const pendentesCount = agendas.filter((a) => a.status === "pendente").length;
  const aprovadasCount = agendas.filter((a) => a.status === "aprovada").length;

  const handleGerar = () => {
    if (!empresaId || !selectedMeetingId) {
      toast({ title: "Selecione uma reunião", variant: "destructive" });
      return;
    }
    gerarMt.mutate({ empresaId, reuniaoId: selectedMeetingId });
  };

  if (!empresaId) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center text-gray-500">
        Selecione uma empresa para gerar pautas com IA.
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      <section>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Próximas Reuniões</h2>
          </div>
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white shrink-0"
            size="lg"
            onClick={handleGerar}
            disabled={gerarMt.isPending || !selectedMeetingId}
          >
            {gerarMt.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-5 w-5 mr-2" />
            )}
            Gerar Nova Pauta com IA
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Selecione uma reunião para gerar pautas com IA</p>
        <div className="flex flex-wrap items-stretch gap-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex-1 min-w-[200px] max-w-[260px]">
              <MeetingCard
                meeting={meeting}
                selected={selectedMeetingId === meeting.id}
                onSelect={() => setSelectedMeetingId(meeting.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Pautas Geradas</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={agendaFilter === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("todas")}
            className={agendaFilter === "todas" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300"}
          >
            Todas ({agendas.length})
          </Button>
          <Button
            variant={agendaFilter === "pendentes" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("pendentes")}
            className={agendaFilter === "pendentes" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300"}
          >
            <Clock className="h-4 w-4 mr-1" />
            Pendentes ({pendentesCount})
          </Button>
          <Button
            variant={agendaFilter === "aprovadas" ? "default" : "outline"}
            size="sm"
            onClick={() => setAgendaFilter("aprovadas")}
            className={agendaFilter === "aprovadas" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300"}
          >
            <Check className="h-4 w-4 mr-1" />
            Aprovadas ({aprovadasCount})
          </Button>
        </div>
        <div className="space-y-4">
          {pautasQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredAgendas.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Nenhuma pauta encontrada para o filtro selecionado.
            </p>
          ) : (
            filteredAgendas.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={agenda}
                onApprove={() =>
                  aprovarMt.mutate({
                    pautaId: agenda.id,
                    empresaId: agenda.empresaId,
                    reuniaoId: agenda.reuniaoId,
                  })
                }
                onReject={() =>
                  rejeitarMt.mutate({ pautaId: agenda.id, empresaId: agenda.empresaId })
                }
                approveLoading={aprovarMt.isPending}
                rejectLoading={rejeitarMt.isPending}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
