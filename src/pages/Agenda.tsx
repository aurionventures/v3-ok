import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Settings,
  Filter,
  BarChart3,
  Building2,
  Users,
  UserCog,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
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
import { cn } from "@/lib/utils";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useGovernance } from "@/hooks/useGovernance";
import { useAgenda } from "@/hooks/useAgenda";
import { gerarDatasReunioes, criarConvidadoReuniao } from "@/services/agenda";
import { fetchMembrosPorOrgao } from "@/services/governance";
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

const Agenda = () => {
  const { firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { conselhos, comites, comissoes } = useGovernance(empresaId);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const { reunioes, isLoading, refetch, insertReuniao, insertReuniaoLoading, insertReunioesEmLote, insertReunioesEmLoteLoading } = useAgenda(empresaId, anoSelecionado);

  const [currentMonth, setCurrentMonth] = useState(new Date(anoSelecionado, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [filterBodyType, setFilterBodyType] = useState("all");
  const [filterBody, setFilterBody] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMeetingType, setFilterMeetingType] = useState("all");
  const [gestaoOpen, setGestaoOpen] = useState(false);
  const [reuniaoGestao, setReuniaoGestao] = useState<ReuniaoEnriquecida | null>(null);

  const [configurarOpen, setConfigurarOpen] = useState(false);
  const [formAno, setFormAno] = useState(String(anoSelecionado));
  const [configTipoOrgao, setConfigTipoOrgao] = useState<"conselho" | "comite" | "comissao">("conselho");
  const [configOrgaoId, setConfigOrgaoId] = useState("");
  const [configTipoReuniao, setConfigTipoReuniao] = useState("ordinaria");
  const [configFrequencia, setConfigFrequencia] = useState("");
  const [configDiaReuniao, setConfigDiaReuniao] = useState("");
  const [configHorarioPadrao, setConfigHorarioPadrao] = useState("14:00");
  const [configModalidade, setConfigModalidade] = useState("presencial");
  const [configLocal, setConfigLocal] = useState("");
  const [formTipoOrgao, setFormTipoOrgao] = useState<"conselho" | "comite" | "comissao">("conselho");
  const [formOrgaoId, setFormOrgaoId] = useState("");
  const [formData, setFormData] = useState("");
  const [formHorario, setFormHorario] = useState("14:00");
  const [formTipoReuniao, setFormTipoReuniao] = useState("ordinaria");
  const [membrosOrgao, setMembrosOrgao] = useState<{ id: string; nome: string; cargo: string | null }[]>([]);
  const [novaReuniaoOpen, setNovaReuniaoOpen] = useState(false);
  const [formModoReuniao, setFormModoReuniao] = useState<"orgao" | "avulsa">("avulsa");
  const [formTituloAvulsa, setFormTituloAvulsa] = useState("");
  const [formModalidade, setFormModalidade] = useState("presencial");
  const [formLocal, setFormLocal] = useState("");
  const [formConvidados, setFormConvidados] = useState<{ id: string; email: string; senha_provisoria: string; senha_valida_ate: string }[]>([]);

  useEffect(() => {
    setCurrentMonth(new Date(anoSelecionado, 0, 1));
  }, [anoSelecionado]);

  useEffect(() => {
    if (configurarOpen) {
      setFormAno(String(anoSelecionado));
      setConfigTipoOrgao("conselho");
      setConfigOrgaoId("");
      setConfigTipoReuniao("ordinaria");
      setConfigFrequencia("");
      setConfigDiaReuniao("");
      setConfigHorarioPadrao("14:00");
      setConfigModalidade("presencial");
      setConfigLocal("");
    }
  }, [configurarOpen, anoSelecionado]);

  const configOrgaosPorTipo = useMemo(() => {
    if (configTipoOrgao === "conselho") return conselhos;
    if (configTipoOrgao === "comite") return comites;
    return comissoes;
  }, [configTipoOrgao, conselhos, comites, comissoes]);

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

  const openNovaReuniaoParaData = (day: Date) => {
    setFormData(format(day, "yyyy-MM-dd"));
    setFormModoReuniao("avulsa");
    setFormTituloAvulsa("");
    setFormOrgaoId("");
    setFormConvidados([]);
    setNovaReuniaoOpen(true);
  };

  const addConvidado = () => {
    setFormConvidados((prev) => [
      ...prev,
      { id: `conv-${Date.now()}-${Math.random().toString(36).slice(2)}`, email: "", senha_provisoria: "", senha_valida_ate: "" },
    ]);
  };

  const removeConvidado = (id: string) => {
    setFormConvidados((prev) => prev.filter((c) => c.id !== id));
  };

  const updateConvidado = (id: string, field: "email" | "senha_provisoria" | "senha_valida_ate", value: string) => {
    setFormConvidados((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleAgendar = async () => {
    if (!empresaId || !formData.trim()) {
      toast({ title: "Preencha a data", variant: "destructive" });
      return;
    }
    const isAvulsa = formModoReuniao === "avulsa";
    let titulo: string;
    let conselhoId: string | null = null;
    let comiteId: string | null = null;
    let comissaoId: string | null = null;

    if (isAvulsa) {
      if (!formTituloAvulsa.trim()) {
        toast({ title: "Preencha o título da reunião avulsa", variant: "destructive" });
        return;
      }
      titulo = formTituloAvulsa.trim();
    } else {
      if (!orgaoSelecionado) {
        toast({ title: "Selecione o órgão", variant: "destructive" });
        return;
      }
      titulo = orgaoSelecionado.nome;
      conselhoId = formTipoOrgao === "conselho" ? orgaoSelecionado.id : null;
      comiteId = formTipoOrgao === "comite" ? orgaoSelecionado.id : null;
      comissaoId = formTipoOrgao === "comissao" ? orgaoSelecionado.id : null;
    }

    const tipoLabel = formTipoReuniao === "ordinaria" ? "Ordinária" : "Extraordinária";
    const { data: reuniaoCriada, error } = await insertReuniao({
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
    const reuniaoId = reuniaoCriada?.id;
    const convidadosValidos = formConvidados.filter((c) => c.email.trim() && c.senha_provisoria.length >= 6 && c.senha_valida_ate);
    for (const c of convidadosValidos) {
      if (!reuniaoId) break;
      const { error: errConv } = await criarConvidadoReuniao({
        reuniao_id: reuniaoId,
        email: c.email.trim(),
        senha_provisoria: c.senha_provisoria,
        senha_valida_ate: c.senha_valida_ate,
      });
      if (errConv) {
        toast({ title: "Reunião criada, mas erro em convidado", description: `${c.email}: ${errConv}`, variant: "destructive" });
      }
    }
    if (convidadosValidos.length > 0 && reuniaoId) {
      toast({ title: "Reunião agendada", description: `${titulo} em ${formData}${convidadosValidos.length > 0 ? ` • ${convidadosValidos.length} convidado(s)` : ""}` });
    } else {
      toast({ title: "Reunião agendada", description: `${titulo} em ${formData}` });
    }
    setNovaReuniaoOpen(false);
    setFormOrgaoId("");
    setFormData("");
    setFormTituloAvulsa("");
    setFormConvidados([]);
    refetch();
  };

  const handleViewDetails = (r: ReuniaoEnriquecida) => {
    setReuniaoGestao(r);
    setGestaoOpen(true);
  };

  const handleGerarAtaIA = () => {
    // Geração implementada internamente no GestaoReuniao
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
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Filtrar Reuniões</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={configurarOpen} onOpenChange={setConfigurarOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar Calendário Anual
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Configurador de Calendário Anual</DialogTitle>
                        <DialogDescription>Crie automaticamente o calendário de reuniões para o ano todo</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        {/* 1. Informações Básicas */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground">1. Informações Básicas</h3>
                          <div className="space-y-2">
                            <Label>Ano do Calendário</Label>
                            <Input
                              type="number"
                              min={2020}
                              max={2030}
                              value={formAno}
                              onChange={(e) => setFormAno(e.target.value)}
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de Órgão <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: "conselho" as const, label: "Conselho", icon: Building2 },
                                { value: "comite" as const, label: "Comitê", icon: Users },
                                { value: "comissao" as const, label: "Comissão", icon: UserCog },
                              ].map(({ value, label, icon: Icon }) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => { setConfigTipoOrgao(value); setConfigOrgaoId(""); }}
                                  className={cn(
                                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                                    configTipoOrgao === value
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                                  )}
                                >
                                  <Icon className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-sm font-medium">{label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>
                              {configTipoOrgao === "conselho" && "Conselho"}
                              {configTipoOrgao === "comite" && "Comitê"}
                              {configTipoOrgao === "comissao" && "Comissão"}
                            </Label>
                            <Select value={configOrgaoId} onValueChange={setConfigOrgaoId}>
                              <SelectTrigger>
                                <SelectValue placeholder={`Selecione o ${configTipoOrgao === "conselho" ? "conselho" : configTipoOrgao === "comite" ? "comitê" : "comissão"}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {configOrgaosPorTipo.map((o) => (
                                  <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de Reunião Padrão</Label>
                            <Select value={configTipoReuniao} onValueChange={setConfigTipoReuniao}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ordinaria">Ordinária</SelectItem>
                                <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* 2. Configuração de Frequência */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground">2. Configuração de Frequência</h3>
                          <div className="space-y-2">
                            <Label>Frequência das Reuniões</Label>
                            <Select value={configFrequencia} onValueChange={setConfigFrequencia}>
                              <SelectTrigger><SelectValue placeholder="Selecione a frequência" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="bimestral">Bimestral</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Dia da Reunião</Label>
                            <Select value={configDiaReuniao} onValueChange={setConfigDiaReuniao}>
                              <SelectTrigger><SelectValue placeholder="Selecione a regra do dia" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primeiro_segunda">Primeira segunda-feira</SelectItem>
                                <SelectItem value="segundo_terca">Segunda terça-feira</SelectItem>
                                <SelectItem value="terceira_quarta">Terceira quarta-feira</SelectItem>
                                <SelectItem value="ultima_sexta">Última sexta-feira</SelectItem>
                                <SelectItem value="dia_10">Dia 10 de cada mês</SelectItem>
                                <SelectItem value="dia_15">Dia 15 de cada mês</SelectItem>
                                <SelectItem value="dia_20">Dia 20 de cada mês</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* 3. Horário e Local */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground">3. Horário e Local</h3>
                          <div className="space-y-2">
                            <Label>Horário Padrão</Label>
                            <Input
                              type="time"
                              value={configHorarioPadrao}
                              onChange={(e) => setConfigHorarioPadrao(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Modalidade</Label>
                            <Select value={configModalidade} onValueChange={setConfigModalidade}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="presencial">Presencial</SelectItem>
                                <SelectItem value="hibrido">Híbrido</SelectItem>
                                <SelectItem value="remoto">Remoto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Local (opcional)</Label>
                            <Input
                              placeholder="Ex: Sala de reuniões - Sede"
                              value={configLocal}
                              onChange={(e) => setConfigLocal(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          disabled={!empresaId || !configOrgaoId || !configFrequencia || !configDiaReuniao || insertReunioesEmLoteLoading}
                          onClick={async () => {
                            const y = parseInt(formAno, 10);
                            if (isNaN(y) || !empresaId || !configOrgaoId || !configFrequencia || !configDiaReuniao) {
                              toast({
                                title: "Campos obrigatórios",
                                description: "Preencha Ano, Tipo de Órgão, Órgão, Frequência e Dia da Reunião.",
                                variant: "destructive",
                              });
                              return;
                            }
                            const orgao = configOrgaosPorTipo.find((o) => o.id === configOrgaoId);
                            const titulo = orgao?.nome ?? "Reunião";
                            const datas = gerarDatasReunioes(y, configFrequencia, configDiaReuniao);
                            const conselhoId = configTipoOrgao === "conselho" ? configOrgaoId : null;
                            const comiteId = configTipoOrgao === "comite" ? configOrgaoId : null;
                            const comissaoId = configTipoOrgao === "comissao" ? configOrgaoId : null;
                            const itens = datas.map((data_reuniao) => ({
                              conselho_id: conselhoId,
                              comite_id: comiteId,
                              comissao_id: comissaoId,
                              titulo,
                              data_reuniao: data_reuniao,
                              horario: configHorarioPadrao || null,
                              tipo: configTipoReuniao === "ordinaria" ? "ordinaria" : "extraordinaria",
                              status: "agendada",
                            }));
                            const { count, error } = await insertReunioesEmLote({ empresaId, itens });
                            if (error) {
                              toast({
                                title: "Erro ao gerar calendário",
                                description: error,
                                variant: "destructive",
                              });
                              return;
                            }
                            setAnoSelecionado(y);
                            setConfigurarOpen(false);
                            toast({
                              title: "Calendário configurado",
                              description: `${count} reuniões agendadas para ${titulo} em ${y}.`,
                            });
                          }}
                        >
                          {insertReunioesEmLoteLoading ? "Gerando..." : "Gerar Calendário"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={novaReuniaoOpen}
                    onOpenChange={(open) => {
                      setNovaReuniaoOpen(open);
                      if (!open) {
                        setFormTituloAvulsa("");
                        setFormOrgaoId("");
                        setFormConvidados([]);
                      }
                    }}
                  >
                    <Button
                      size="sm"
                      onClick={() => {
                        setFormData("");
                        setFormTituloAvulsa("");
                        setFormModoReuniao("avulsa");
                        setFormOrgaoId("");
                        setFormConvidados([]);
                        setNovaReuniaoOpen(true);
                      }}
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Nova Reunião
                    </Button>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Nova Reunião</DialogTitle>
                        <DialogDescription>Preencha os dados para agendar uma nova reunião</DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="informacoes" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="informacoes">Informações</TabsTrigger>
                          <TabsTrigger value="participantes">Participantes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="informacoes" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Tipo de Órgão <span className="text-destructive">*</span></Label>
                            <Select value={formModoReuniao} onValueChange={(v: "orgao" | "avulsa") => { setFormModoReuniao(v); setFormOrgaoId(""); setFormTituloAvulsa(""); }}>
                              <SelectTrigger><SelectValue placeholder="Selecione o tipo de órgão" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="avulsa">Reunião avulsa</SelectItem>
                                <SelectItem value="orgao">Conselho / Comitê / Comissão</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {formModoReuniao === "avulsa" ? (
                            <div className="space-y-2">
                              <Label>Título da Reunião <span className="text-destructive">*</span></Label>
                              <Input
                                value={formTituloAvulsa}
                                onChange={(e) => setFormTituloAvulsa(e.target.value)}
                                placeholder="Ex: Reunião Ordinária de Janeiro"
                              />
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Data <span className="text-destructive">*</span></Label>
                              <Input type="date" value={formData} onChange={(e) => setFormData(e.target.value)} placeholder="22/03/2026" />
                            </div>
                            <div className="space-y-2">
                              <Label>Hora <span className="text-destructive">*</span></Label>
                              <Input type="time" value={formHorario} onChange={(e) => setFormHorario(e.target.value)} placeholder="12:30" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tipo <span className="text-destructive">*</span></Label>
                              <Select value={formTipoReuniao} onValueChange={setFormTipoReuniao}>
                                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ordinaria">Ordinária</SelectItem>
                                  <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Modalidade</Label>
                              <Select value={formModalidade} onValueChange={setFormModalidade}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="presencial">Presencial</SelectItem>
                                  <SelectItem value="remoto">Remoto</SelectItem>
                                  <SelectItem value="hibrido">Híbrido</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Local</Label>
                            <Input value={formLocal} onChange={(e) => setFormLocal(e.target.value)} placeholder="Ex: Sala de Reuniões - 3º Andar" />
                          </div>
                        </TabsContent>
                        <TabsContent value="participantes" className="space-y-4 pt-4">
                          <p className="text-sm text-muted-foreground">Adicione convidados com acesso provisório por e-mail e senha.</p>
                          <Button type="button" variant="outline" size="sm" onClick={addConvidado}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar convidado
                          </Button>
                          <div className="space-y-3 max-h-[280px] overflow-y-auto">
                            {formConvidados.map((c) => (
                              <div key={c.id} className="rounded-lg border p-4 space-y-3 bg-muted/30">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Convidado</span>
                                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeConvidado(c.id)} aria-label="Inativar">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">E-mail</Label>
                                    <Input type="email" value={c.email} onChange={(e) => updateConvidado(c.id, "email", e.target.value)} placeholder="convidado@email.com" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Senha provisória (visível)</Label>
                                    <Input type="text" value={c.senha_provisoria} onChange={(e) => updateConvidado(c.id, "senha_provisoria", e.target.value)} placeholder="Mín. 6 caracteres" autoComplete="off" />
                                  </div>
                                  <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-xs">Senha válida até</Label>
                                    <Input type="date" value={c.senha_valida_ate} onChange={(e) => updateConvidado(c.id, "senha_valida_ate", e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {formConvidados.length === 0 && (
                              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum convidado adicionado. Clique em &quot;Adicionar convidado&quot; para incluir.</p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                      <DialogFooter className="mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={() => setNovaReuniaoOpen(false)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAgendar}
                          disabled={
                            insertReuniaoLoading ||
                            !formData ||
                            (formModoReuniao === "avulsa" ? !formTituloAvulsa.trim() : !formOrgaoId)
                          }
                        >
                          Criar Reunião
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
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
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Calendário Anual de Reuniões</h2>
              </div>

              <Tabs
                value={viewMode === "annual" ? "agenda" : "mensal"}
                onValueChange={(v) => setViewMode(v === "agenda" ? "annual" : "monthly")}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="agenda">Agenda anual</TabsTrigger>
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
                                    onClick={() => {
                                      setSelectedDate(day);
                                      openNovaReuniaoParaData(day);
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && (setSelectedDate(day), openNovaReuniaoParaData(day))}
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
        onGerarAtaIA={handleGerarAtaIA}
        empresaId={empresaId}
      />
    </div>
  );
};

export default Agenda;
