import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Settings,
  Filter,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GestaoReuniao from "@/components/GestaoReuniao";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useGovernance } from "@/hooks/useGovernance";
import { useAgenda } from "@/hooks/useAgenda";
import { fetchMembrosPorOrgao } from "@/services/governance";
import type { ReuniaoGestao } from "@/types/gestaoReuniao";
import type { ReuniaoEnriquecida } from "@/types/agenda";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const STATUS_BADGE_CLASS: Record<string, string> = {
  agendada: "bg-blue-500 text-white border-0 hover:bg-blue-500",
  pauta_definida: "bg-orange-500 text-white border-0 hover:bg-orange-500",
  docs_enviados: "bg-red-500 text-white border-0 hover:bg-red-500",
  realizada: "bg-purple-500 text-white border-0 hover:bg-purple-500",
  ata_gerada: "bg-green-500 text-white border-0 hover:bg-green-500",
};

const STATUS_LABEL: Record<string, string> = {
  agendada: "Agendada",
  pauta_definida: "Pauta Definida",
  docs_enviados: "Docs Enviados",
  realizada: "Concluída",
  ata_gerada: "ATA Gerada",
};

function getMonthGrid(month: Date): (Date | null)[][] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const firstWeekday = getDay(start);
  const grid: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < firstWeekday; i++) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

type ViewMode = "annual" | "monthly";

function reuniaoToGestao(r: ReuniaoEnriquecida): ReuniaoGestao {
  const titulo = r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || "Reunião";
  const dataStr = r.data_reuniao ? format(new Date(r.data_reuniao), "dd/MM/yyyy") : undefined;
  const horario = r.horario ? String(r.horario).slice(0, 5) : undefined;
  return {
    id: r.id,
    titulo,
    data_reuniao: dataStr,
    tipo: r.tipo ?? undefined,
    status: r.status,
    pautas: [],
    documentos_previos_count: 0,
    gravacao_url: undefined,
    participantes_confirmados: [],
  };
}

const Agenda = () => {
  const { firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { conselhos, comites, comissoes } = useGovernance(empresaId);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const { reunioes, isLoading, refetch, insertReuniao, insertReuniaoLoading } = useAgenda(empresaId, anoSelecionado);

  const [currentMonth, setCurrentMonth] = useState(new Date(anoSelecionado, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [filterBodyType, setFilterBodyType] = useState("all");
  const [filterBody, setFilterBody] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMeetingType, setFilterMeetingType] = useState("all");
  const [gestaoOpen, setGestaoOpen] = useState(false);
  const [reuniaoGestao, setReuniaoGestao] = useState<ReuniaoGestao | null>(null);

  const [configurarOpen, setConfigurarOpen] = useState(false);
  const [formAno, setFormAno] = useState(String(anoSelecionado));
  const [formTipoOrgao, setFormTipoOrgao] = useState<"conselho" | "comite" | "comissao">("conselho");
  const [formOrgaoId, setFormOrgaoId] = useState("");
  const [formData, setFormData] = useState("");
  const [formHorario, setFormHorario] = useState("14:00");
  const [formTipoReuniao, setFormTipoReuniao] = useState("ordinaria");
  const [membrosOrgao, setMembrosOrgao] = useState<{ id: string; nome: string; cargo: string | null }[]>([]);

  useEffect(() => {
    setCurrentMonth(new Date(anoSelecionado, 0, 1));
  }, [anoSelecionado]);

  useEffect(() => {
    if (configurarOpen) setFormAno(String(anoSelecionado));
  }, [configurarOpen, anoSelecionado]);

  const orgaosPorTipo = useMemo(() => {
    if (formTipoOrgao === "conselho") return conselhos;
    if (formTipoOrgao === "comite") return comites;
    return comissoes;
  }, [formTipoOrgao, conselhos, comites, comissoes]);

  const orgaoSelecionado = useMemo(() => {
    return orgaosPorTipo.find((o) => o.id === formOrgaoId);
  }, [orgaosPorTipo, formOrgaoId]);

  useEffect(() => {
    if (!empresaId || !formOrgaoId) {
      setMembrosOrgao([]);
      return;
    }
    fetchMembrosPorOrgao(empresaId, formTipoOrgao, formOrgaoId).then(setMembrosOrgao);
  }, [empresaId, formTipoOrgao, formOrgaoId]);

  const filteredMeetings = useMemo(() => {
    let list = [...reunioes];
    if (filterBodyType !== "all") {
      list = list.filter((r) => {
        if (filterBodyType === "conselho") return !!r.conselho_id;
        if (filterBodyType === "comite") return !!r.comite_id;
        if (filterBodyType === "comissao") return !!r.comissao_id;
        return true;
      });
    }
    if (filterBody !== "all") {
      list = list.filter((r) => {
        const id = r.conselho_id || r.comite_id || r.comissao_id;
        return id === filterBody;
      });
    }
    if (filterStatus !== "all") list = list.filter((r) => r.status === filterStatus);
    if (filterMeetingType !== "all") list = list.filter((r) => (r.tipo ?? "").toLowerCase().includes(filterMeetingType));
    return list;
  }, [reunioes, filterBodyType, filterBody, filterStatus, filterMeetingType]);

  const meetingsByDate = useMemo(() => {
    const map = new Map<string, ReuniaoEnriquecida[]>();
    for (const r of filteredMeetings) {
      if (!r.data_reuniao) continue;
      const key = format(new Date(r.data_reuniao), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [filteredMeetings]);

  const meetingsByMonth = useMemo(() => {
    const byMonth: Record<number, ReuniaoEnriquecida[]> = {};
    for (let m = 1; m <= 12; m++) byMonth[m] = [];
    for (const r of filteredMeetings) {
      if (!r.data_reuniao) continue;
      const d = new Date(r.data_reuniao);
      if (d.getFullYear() === anoSelecionado) byMonth[d.getMonth() + 1].push(r);
    }
    for (let m = 1; m <= 12; m++) {
      byMonth[m].sort((a, b) => new Date(a.data_reuniao!).getTime() - new Date(b.data_reuniao!).getTime());
    }
    return byMonth;
  }, [filteredMeetings, anoSelecionado]);

  const monthGrid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const handleAgendar = async () => {
    if (!empresaId || !orgaoSelecionado || !formData.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    const conselhoId = formTipoOrgao === "conselho" ? orgaoSelecionado.id : null;
    const comiteId = formTipoOrgao === "comite" ? orgaoSelecionado.id : null;
    const comissaoId = formTipoOrgao === "comissao" ? orgaoSelecionado.id : null;
    const titulo = orgaoSelecionado.nome;
    const tipoLabel = formTipoReuniao === "ordinaria" ? "Ordinária" : "Extraordinária";
    const { data, error } = await insertReuniao({
      empresa_id: empresaId,
      conselho_id: conselhoId,
      comite_id: comiteId,
      comissao_id: comissaoId,
      titulo,
      data_reuniao: formData,
      horario: formHorario,
      tipo: tipoLabel,
      status: "agendada",
    });
    if (error) {
      toast({ title: "Erro ao agendar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Reunião agendada", description: `${titulo} em ${formData}` });
    setNovaReuniaoOpen(false);
    setFormOrgaoId("");
    setFormData("");
    refetch();
  };

  const handleViewDetails = (r: ReuniaoEnriquecida) => {
    setReuniaoGestao(reuniaoToGestao(r));
    setGestaoOpen(true);
  };

  const handleGerarPautaIA = () => {
    toast({ title: "Gerar pauta com IA", description: "Esta funcionalidade estará disponível em breve." });
    setGestaoOpen(false);
  };

  if (!empresaId) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Selecione ou cadastre uma empresa para acessar a agenda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3">
          <h1 className="text-xl font-semibold">Agenda Anual</h1>
          <div className="flex items-center gap-2">
            <Dialog open={configurarOpen} onOpenChange={setConfigurarOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar Calendário Anual
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Configurar Calendário Anual</DialogTitle>
                  <DialogDescription>Defina o ano da agenda</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Input
                      type="number"
                      min={2020}
                      max={2030}
                      value={formAno}
                      onChange={(e) => setFormAno(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const y = parseInt(formAno, 10);
                      if (!isNaN(y)) {
                        setAnoSelecionado(y);
                        setConfigurarOpen(false);
                        toast({ title: "Ano atualizado", description: `Agenda ${y}` });
                      }
                    }}
                  >
                    Aplicar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Nova Reunião
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Agendar Nova Reunião</DialogTitle>
                  <DialogDescription>Selecione o órgão (conselho, comitê ou comissão) e preencha os dados</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Tipo de Órgão</Label>
                    <Select value={formTipoOrgao} onValueChange={(v) => { setFormTipoOrgao(v as "conselho" | "comite" | "comissao"); setFormOrgaoId(""); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conselho">Conselho</SelectItem>
                        <SelectItem value="comite">Comitê</SelectItem>
                        <SelectItem value="comissao">Comissão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Órgão</Label>
                    <Select value={formOrgaoId} onValueChange={setFormOrgaoId}>
                      <SelectTrigger><SelectValue placeholder="Selecione o órgão" /></SelectTrigger>
                      <SelectContent>
                        {orgaosPorTipo.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {membrosOrgao.length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Membros do órgão ({membrosOrgao.length})</Label>
                      <div className="rounded border p-2 max-h-24 overflow-y-auto text-xs space-y-0.5">
                        {membrosOrgao.map((m) => (
                          <div key={m.id}>{m.nome}{m.cargo ? ` (${m.cargo})` : ""}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={formData} onChange={(e) => setFormData(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input type="time" value={formHorario} onChange={(e) => setFormHorario(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Reunião</Label>
                    <Select value={formTipoReuniao} onValueChange={setFormTipoReuniao}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordinaria">Ordinária</SelectItem>
                        <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAgendar} disabled={insertReuniaoLoading || !formOrgaoId || !formData}>
                    Agendar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Filtrar Reuniões</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" /> Tipo de Órgão
                  </label>
                  <Select value={filterBodyType} onValueChange={setFilterBodyType}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="conselho">Conselho</SelectItem>
                      <SelectItem value="comite">Comitê</SelectItem>
                      <SelectItem value="comissao">Comissão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Órgão</label>
                  <Select value={filterBody} onValueChange={setFilterBody}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {conselhos.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      {comites.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      {comissoes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Reunião</label>
                  <Select value={filterMeetingType} onValueChange={setFilterMeetingType}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="ordinaria">Ordinária</SelectItem>
                      <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredMeetings.length} reuniões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Calendário Anual de Reuniões</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium capitalize">
                    {viewMode === "monthly"
                      ? format(currentMonth, "MMMM yyyy", { locale: ptBR })
                      : `Agenda ${anoSelecionado}`}
                  </span>
                  <Button
                    variant={viewMode === "annual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("annual")}
                  >
                    Visão Anual
                  </Button>
                  {viewMode === "monthly" && (
                    <div className="flex rounded-md border">
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCurrentMonth((m) => subMonths(m, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Tabs
                value={viewMode === "annual" ? "agenda" : "mensal"}
                onValueChange={(v) => setViewMode(v === "agenda" ? "annual" : "monthly")}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="agenda">Agenda {anoSelecionado}</TabsTrigger>
                  <TabsTrigger value="mensal">Visão Mensal</TabsTrigger>
                </TabsList>

                {viewMode === "annual" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((monthNum) => {
                      const monthDate = new Date(anoSelecionado, monthNum - 1, 1);
                      const monthName = format(monthDate, "MMMM", { locale: ptBR });
                      const meetings = meetingsByMonth[monthNum] ?? [];
                      return (
                        <div key={monthNum} className="rounded-lg border bg-card p-4 space-y-3">
                          <h3 className="text-sm font-semibold capitalize text-muted-foreground">{monthName}</h3>
                          <div className="space-y-2">
                            {meetings.length === 0 ? (
                              <p className="text-xs text-muted-foreground">Nenhuma reunião</p>
                            ) : (
                              meetings.map((r) => {
                                const titulo = r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || "Reunião";
                                const dataStr = r.data_reuniao ? format(new Date(r.data_reuniao), "d/M") : "";
                                const hora = r.horario ? String(r.horario).slice(0, 5) : "";
                                const statusLabel = STATUS_LABEL[r.status] ?? r.status;
                                const badgeClass = STATUS_BADGE_CLASS[r.status] ?? "bg-gray-500";
                                return (
                                  <div
                                    key={r.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleViewDetails(r)}
                                    onKeyDown={(e) => e.key === "Enter" && handleViewDetails(r)}
                                    className="flex flex-col gap-1 rounded p-2 bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
                                  >
                                    <div className="font-medium text-sm text-foreground">{titulo}</div>
                                    <div className="text-xs text-muted-foreground">{dataStr}{hora ? ` ${hora}` : ""}</div>
                                    <Badge className={badgeClass} variant="outline">{statusLabel}</Badge>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Tabs>

              {viewMode === "monthly" && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {WEEKDAYS.map((day) => (
                            <th key={day} className="border border-border p-2 text-center text-xs font-medium text-muted-foreground bg-muted/50">{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthGrid.map((week, wi) => (
                          <tr key={wi}>
                            {week.map((day, di) => {
                              if (!day) return <td key={di} className="border border-border p-1 min-h-[100px] bg-muted/20" />;
                              const dateKey = format(day, "yyyy-MM-dd");
                              const dayMeetings = meetingsByDate.get(dateKey) ?? [];
                              const isSelected = selectedDate && isSameDay(day, selectedDate);
                              const hasMeetings = dayMeetings.length > 0;
                              return (
                                <td key={di} className="border border-border p-1 align-top min-h-[100px] w-[14.28%]">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedDate(day)}
                                    onKeyDown={(e) => e.key === "Enter" && setSelectedDate(day)}
                                    className={`h-full min-h-[100px] rounded p-1 cursor-pointer ${isSelected || hasMeetings ? "bg-blue-100" : "bg-background"}`}
                                  >
                                    <div className={`text-sm font-medium mb-1 ${isSelected || hasMeetings ? "text-blue-700" : "text-foreground"}`}>
                                      {format(day, "d")}
                                    </div>
                                    <div className="space-y-1">
                                      {dayMeetings.map((r) => {
                                        const titulo = r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || "Reunião";
                                        const hora = r.horario ? String(r.horario).slice(0, 5) : "";
                                        return (
                                          <button
                                            key={r.id}
                                            type="button"
                                            className="w-full text-left rounded px-2 py-1.5 bg-green-100 hover:bg-green-200 text-xs transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedDate(day);
                                              handleViewDetails(r);
                                            }}
                                          >
                                            <div className="font-medium text-foreground truncate">{titulo}</div>
                                            <div className="text-muted-foreground">{hora}</div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t">
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_BADGE_CLASS[k] ?? "bg-gray-500"}`} />
                        <span className="text-sm text-muted-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <GestaoReuniao
        reuniao={reuniaoGestao}
        open={gestaoOpen}
        onOpenChange={setGestaoOpen}
        onGerarPautaIA={handleGerarPautaIA}
      />
    </div>
  );
};

export default Agenda;
