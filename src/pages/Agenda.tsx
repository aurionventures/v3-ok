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
  Globe,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Link2,
  Loader2,
  UserPlus,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  realizada: "bg-purple-500 text-white border-0 hover:bg-purple-500",
  ata_gerada: "bg-green-500 text-white border-0 hover:bg-green-500",
};

const STATUS_LABEL: Record<string, string> = {
  agendada: "Agendada",
  pauta_definida: "Pauta Definida",
  realizada: "Realizada",
  ata_gerada: "ATA Gerada",
};

type TipoOrgaoReuniao = "conselho" | "comite" | "comissao" | "avulsa";
const TIPO_ORGAO_LABEL: Record<TipoOrgaoReuniao, string> = {
  conselho: "Conselho",
  comite: "Comitê",
  comissao: "Comissão",
  avulsa: "Avulsa",
};
const TIPO_ORGAO_BADGE_CLASS: Record<TipoOrgaoReuniao, string> = {
  conselho: "bg-blue-500 text-white border-0 hover:bg-blue-500",
  comite: "bg-violet-500 text-white border-0 hover:bg-violet-500",
  comissao: "bg-emerald-500 text-white border-0 hover:bg-emerald-500",
  avulsa: "bg-amber-500 text-white border-0 hover:bg-amber-500",
};
function getTipoOrgaoReuniao(
  r: { conselho_id?: string | null; comite_id?: string | null; comissao_id?: string | null }
): TipoOrgaoReuniao {
  if (r.conselho_id) return "conselho";
  if (r.comite_id) return "comite";
  if (r.comissao_id) return "comissao";
  return "avulsa";
}

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
  const { reunioes, isLoading, refetch, insertReuniao, insertReuniaoLoading, insertReunioesEmLote, insertReunioesEmLoteLoading, limparAgendas, limparAgendasLoading } = useAgenda(empresaId, anoSelecionado);

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
  const [configTipoOrgao, setConfigTipoOrgao] = useState<"conselho" | "comite" | "comissao" | "virtual">("conselho");
  const [configOrgaoId, setConfigOrgaoId] = useState("");
  const [configTipoReuniao, setConfigTipoReuniao] = useState("ordinaria");
  const [configFrequencia, setConfigFrequencia] = useState("");
  const [configDiaReuniao, setConfigDiaReuniao] = useState("");
  const [configDataAvulsa, setConfigDataAvulsa] = useState("");
  const [configHorarioPadrao, setConfigHorarioPadrao] = useState("14:00");
  const [configModalidade, setConfigModalidade] = useState("presencial");
  const [configLocal, setConfigLocal] = useState("");
  const [formTipoOrgao, setFormTipoOrgao] = useState<"conselho" | "comite" | "comissao" | "virtual">("conselho");
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
  const [magicLinksDialog, setMagicLinksDialog] = useState<{ email: string; link: string }[]>([]);
  const [convidadoLinks, setConvidadoLinks] = useState<Record<string, string>>({});
  const [convidadoLinksLoading, setConvidadoLinksLoading] = useState<Record<string, boolean>>({});
  const [reuniaoRascunhoId, setReuniaoRascunhoId] = useState<string | null>(null);
  const [formConvidados, setFormConvidados] = useState<{
    id: string;
    nome: string;
    email: string;
    cargo?: string;
    permissoes: "upload" | "visualizar" | "comentar";
    senha_valida_ate: string;
  }[]>([]);
  const [formConvidadoNome, setFormConvidadoNome] = useState("");
  const [formConvidadoEmail, setFormConvidadoEmail] = useState("");
  const [formConvidadoCargo, setFormConvidadoCargo] = useState("");
  const [formConvidadoPermissoes, setFormConvidadoPermissoes] = useState<"upload" | "visualizar" | "comentar">("visualizar");

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
      setConfigDataAvulsa("");
      setConfigHorarioPadrao("14:00");
      setConfigModalidade("presencial");
      setConfigLocal("");
    }
  }, [configurarOpen, anoSelecionado]);

  const PAUTA_VIRTUAL_TIPOS = [
    { id: "virtual_conselho", nome: "Conselho" },
    { id: "virtual_comite", nome: "Comitê" },
    { id: "virtual_comissao", nome: "Comissão" },
  ] as const;

  const configOrgaosPorTipo = useMemo(() => {
    if (configTipoOrgao === "conselho") return conselhos;
    if (configTipoOrgao === "comite") return comites;
    if (configTipoOrgao === "comissao") return comissoes;
    return PAUTA_VIRTUAL_TIPOS;
  }, [configTipoOrgao, conselhos, comites, comissoes]);

  const orgaosPorTipo = useMemo(() => {
    if (formTipoOrgao === "conselho") return conselhos;
    if (formTipoOrgao === "comite") return comites;
    if (formTipoOrgao === "comissao") return comissoes;
    return PAUTA_VIRTUAL_TIPOS;
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
        if (filterBodyType === "virtual") return !r.conselho_id && !r.comite_id && !r.comissao_id;
        return true;
      });
    }
    if (filterBody !== "all") {
      list = list.filter((r) => {
        if (filterBody === "virtual") return !r.conselho_id && !r.comite_id && !r.comissao_id;
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
    setReuniaoRascunhoId(null);
    setFormConvidadoNome("");
    setFormConvidadoEmail("");
    setFormConvidadoCargo("");
    setFormConvidadoPermissoes("visualizar");
    setFormHorario(configHorarioPadrao || "14:00");
    setFormModalidade(configModalidade || "presencial");
    setFormLocal(configLocal);
    setFormTipoReuniao(configTipoReuniao || "ordinaria");
    setNovaReuniaoOpen(true);
  };

  const senhaValidaAtePadrao = (): string => {
    const ano = formData ? parseInt(formData.substring(0, 4), 10) : new Date().getFullYear();
    return `${ano}-12-31`;
  };

  const addConvidado = () => {
    const nome = formConvidadoNome.trim();
    const email = formConvidadoEmail.trim();
    if (!nome || !email) {
      toast({ title: "Preencha nome e e-mail", variant: "destructive" });
      return;
    }
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFormConvidados((prev) => [
      ...prev,
      {
        id,
        nome,
        email,
        cargo: formConvidadoCargo.trim() || undefined,
        permissoes: formConvidadoPermissoes,
        senha_valida_ate: senhaValidaAtePadrao(),
      },
    ]);
    setFormConvidadoNome("");
    setFormConvidadoEmail("");
    setFormConvidadoCargo("");
    setFormConvidadoPermissoes("visualizar");
    setConvidadoLinks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const removeConvidado = (id: string) => {
    setFormConvidados((prev) => prev.filter((c) => c.id !== id));
    setConvidadoLinks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const obterOuCriarReuniaoParaLink = async (): Promise<string | null> => {
    if (reuniaoRascunhoId) return reuniaoRascunhoId;
    if (!empresaId || !formData.trim()) {
      toast({ title: "Preencha a data da reunião", variant: "destructive" });
      return null;
    }
    const isAvulsa = formModoReuniao === "avulsa";
    let titulo: string;
    let conselhoId: string | null = null;
    let comiteId: string | null = null;
    let comissaoId: string | null = null;
    if (isAvulsa) {
      if (!formTituloAvulsa.trim()) {
        toast({ title: "Preencha o título da reunião", variant: "destructive" });
        return null;
      }
      titulo = formTituloAvulsa.trim();
    } else {
      if (!orgaoSelecionado) {
        toast({ title: "Selecione o órgão", variant: "destructive" });
        return null;
      }
      titulo = formTipoOrgao === "virtual" ? `Pauta Virtual - ${orgaoSelecionado.nome}` : orgaoSelecionado.nome;
      conselhoId = formTipoOrgao === "conselho" ? orgaoSelecionado.id : null;
      comiteId = formTipoOrgao === "comite" ? orgaoSelecionado.id : null;
      comissaoId = formTipoOrgao === "comissao" ? orgaoSelecionado.id : null;
      if (formTipoOrgao === "virtual") conselhoId = comiteId = comissaoId = null;
    }
    const virtualTipo = formTipoOrgao === "virtual"
      ? (formOrgaoId === "virtual_conselho" ? "conselho" : formOrgaoId === "virtual_comite" ? "comite" : formOrgaoId === "virtual_comissao" ? "comissao" : null)
      : null;
    const tipoLabel = formTipoReuniao === "ordinaria" ? "Ordinária" : "Extraordinária";
    const { data: reuniaoCriada, error } = await insertReuniao({
      empresa_id: empresaId,
      conselho_id: conselhoId ?? undefined,
      comite_id: comiteId ?? undefined,
      comissao_id: comissaoId ?? undefined,
      virtual_tipo: virtualTipo ?? undefined,
      titulo,
      data_reuniao: formData,
      horario: formHorario,
      tipo: tipoLabel,
      status: "agendada",
    });
    if (error || !reuniaoCriada?.id) {
      toast({ title: "Erro ao criar reunião", description: error ?? "Tente novamente.", variant: "destructive" });
      return null;
    }
    setReuniaoRascunhoId(reuniaoCriada.id);
    refetch();
    return reuniaoCriada.id;
  };

  const gerarLinkConvidado = async (c: (typeof formConvidados)[0]): Promise<string | null> => {
    if (!c.email.trim()) return null;
    const reuniaoId = await obterOuCriarReuniaoParaLink();
    if (!reuniaoId) return null;
    setConvidadoLinksLoading((prev) => ({ ...prev, [c.id]: true }));
    setConvidadoLinks((prev) => ({ ...prev, [c.id]: "" }));
    const { data, error } = await criarConvidadoReuniao({
      reuniao_id: reuniaoId,
      email: c.email.trim(),
      senha_valida_ate: c.senha_valida_ate,
      use_magic_link: true,
      redirect_to: window.location.origin,
    });
    setConvidadoLinksLoading((prev) => ({ ...prev, [c.id]: false }));
    if (error) {
      toast({ title: "Erro ao gerar link", description: error, variant: "destructive" });
      return null;
    }
    if (data?.magic_link) {
      setConvidadoLinks((prev) => ({ ...prev, [c.id]: data.magic_link }));
      toast({ title: "Link gerado", description: "Convidado cadastrado. Copie e envie o link." });
      return data.magic_link;
    }
    return null;
  };

  const copiarOuGerarLink = async (c: (typeof formConvidados)[0]) => {
    const link = convidadoLinks[c.id];
    if (link) {
      navigator.clipboard.writeText(link);
      toast({ title: "Link copiado", description: "Pronto para enviar ao convidado." });
      return;
    }
    const novoLink = await gerarLinkConvidado(c);
    if (novoLink) navigator.clipboard.writeText(novoLink);
  };

  const handleAgendar = async () => {
    if (!empresaId || !formData.trim()) {
      toast({ title: "Preencha a data", variant: "destructive" });
      return;
    }
    const isAvulsa = formModoReuniao === "avulsa";
    const titulo = isAvulsa
      ? formTituloAvulsa.trim()
      : orgaoSelecionado
        ? (formTipoOrgao === "virtual" ? `Pauta Virtual - ${orgaoSelecionado.nome}` : orgaoSelecionado.nome)
        : "";

    let reuniaoId: string | undefined;
    if (reuniaoRascunhoId) {
      reuniaoId = reuniaoRascunhoId;
    } else {
      let conselhoId: string | null = null;
      let comiteId: string | null = null;
      let comissaoId: string | null = null;

      if (isAvulsa && !formTituloAvulsa.trim()) {
        toast({ title: "Preencha o título da reunião avulsa", variant: "destructive" });
        return;
      }
      if (!isAvulsa && !orgaoSelecionado) {
        toast({ title: "Selecione o órgão", variant: "destructive" });
        return;
      }
      conselhoId = formTipoOrgao === "conselho" && orgaoSelecionado ? orgaoSelecionado.id : null;
      comiteId = formTipoOrgao === "comite" && orgaoSelecionado ? orgaoSelecionado.id : null;
      comissaoId = formTipoOrgao === "comissao" && orgaoSelecionado ? orgaoSelecionado.id : null;
      if (formTipoOrgao === "virtual") conselhoId = comiteId = comissaoId = null;

      const virtualTipo =
        formTipoOrgao === "virtual"
          ? (formOrgaoId === "virtual_conselho" ? "conselho" : formOrgaoId === "virtual_comite" ? "comite" : formOrgaoId === "virtual_comissao" ? "comissao" : null)
          : null;

      const tipoLabel = formTipoReuniao === "ordinaria" ? "Ordinária" : "Extraordinária";
      const { data: reuniaoCriada, error } = await insertReuniao({
        empresa_id: empresaId,
        conselho_id: conselhoId,
        comite_id: comiteId,
        comissao_id: comissaoId,
        virtual_tipo: virtualTipo ?? undefined,
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
      reuniaoId = reuniaoCriada?.id;
    }

    const convidadosValidos = formConvidados.filter((c) => c.email.trim() && c.senha_valida_ate);
    const magicLinks: { email: string; link: string }[] = [];
    for (const c of convidadosValidos) {
      if (!reuniaoId) break;
      if (convidadoLinks[c.id]) {
        magicLinks.push({ email: c.email, link: convidadoLinks[c.id] });
        continue;
      }
      const { data: convData, error: errConv } = await criarConvidadoReuniao({
        reuniao_id: reuniaoId,
        email: c.email.trim(),
        senha_valida_ate: c.senha_valida_ate,
        use_magic_link: true,
        redirect_to: window.location.origin,
      });
      if (errConv) {
        toast({ title: "Reunião criada, mas erro em convidado", description: `${c.email}: ${errConv}`, variant: "destructive" });
      } else if (convData?.magic_link) {
        magicLinks.push({ email: convData.email, link: convData.magic_link });
      }
    }
    if (convidadosValidos.length > 0 && reuniaoId) {
      toast({ title: "Reunião agendada", description: `${titulo} em ${formData} • ${convidadosValidos.length} convidado(s)` });
    } else {
      toast({ title: "Reunião agendada", description: `${titulo} em ${formData}` });
    }
    if (magicLinks.length > 0) {
      setMagicLinksDialog(magicLinks);
    }
    setNovaReuniaoOpen(false);
    setFormOrgaoId("");
    setFormData("");
    setFormTituloAvulsa("");
    setFormConvidados([]);
    setReuniaoRascunhoId(null);
    setConvidadoLinks({});
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
                    <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { value: "conselho" as const, label: "Conselho", icon: Building2 },
                                { value: "comite" as const, label: "Comitê", icon: Users },
                                { value: "comissao" as const, label: "Comissão", icon: UserCog },
                                { value: "virtual" as const, label: "Pauta Virtual", icon: Globe },
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
                              {configTipoOrgao === "virtual" && "Tipo de Órgão"}
                            </Label>
                            <Select value={configOrgaoId} onValueChange={setConfigOrgaoId}>
                              <SelectTrigger>
                                <SelectValue placeholder={`Selecione o ${configTipoOrgao === "conselho" ? "conselho" : configTipoOrgao === "comite" ? "comitê" : configTipoOrgao === "comissao" ? "comissão" : "tipo de órgão"}`} />
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
                            <Select
                              value={configFrequencia}
                              onValueChange={(v) => {
                                setConfigFrequencia(v);
                                if (v === "avulsa") setConfigDiaReuniao("");
                                else setConfigDataAvulsa("");
                              }}
                            >
                              <SelectTrigger><SelectValue placeholder="Selecione a frequência" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="bimestral">Bimestral</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                                <SelectItem value="avulsa">Avulsa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {configFrequencia === "avulsa" ? (
                            <div className="space-y-2">
                              <Label>Data da Reunião</Label>
                              <Input
                                type="date"
                                value={configDataAvulsa}
                                onChange={(e) => setConfigDataAvulsa(e.target.value)}
                                min={`${formAno}-01-01`}
                                max={`${formAno}-12-31`}
                              />
                            </div>
                          ) : (
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
                          )}
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
                          disabled={
                            !empresaId || !configOrgaoId || !configFrequencia ||
                            (configFrequencia === "avulsa" ? !configDataAvulsa : !configDiaReuniao) ||
                            insertReunioesEmLoteLoading
                          }
                          onClick={async () => {
                            const y = parseInt(formAno, 10);
                            const isAvulsa = configFrequencia === "avulsa";
                            const faltaCampo = isAvulsa ? !configDataAvulsa : !configDiaReuniao;
                            if (isNaN(y) || !empresaId || !configOrgaoId || !configFrequencia || faltaCampo) {
                              toast({
                                title: "Campos obrigatórios",
                                description: isAvulsa ? "Preencha a Data da Reunião." : "Preencha Ano, Tipo de Órgão, Órgão, Frequência e Dia da Reunião.",
                                variant: "destructive",
                              });
                              return;
                            }
                            const orgao = configOrgaosPorTipo.find((o) => o.id === configOrgaoId);
                            const titulo = orgao?.nome ?? "Reunião";
                            const datas = isAvulsa ? [configDataAvulsa] : gerarDatasReunioes(y, configFrequencia, configDiaReuniao);
                            const conselhoId = configTipoOrgao === "conselho" ? configOrgaoId : null;
                            const comiteId = configTipoOrgao === "comite" ? configOrgaoId : null;
                            const comissaoId = configTipoOrgao === "comissao" ? configOrgaoId : null;
                            const virtualTipo =
                              configTipoOrgao === "virtual"
                                ? (configOrgaoId === "virtual_conselho"
                                  ? "conselho"
                                  : configOrgaoId === "virtual_comite"
                                    ? "comite"
                                    : configOrgaoId === "virtual_comissao"
                                      ? "comissao"
                                      : null)
                                : null;
                            const itens = datas.map((data_reuniao) => ({
                              conselho_id: conselhoId,
                              comite_id: comiteId,
                              comissao_id: comissaoId,
                              virtual_tipo: virtualTipo,
                              titulo: configTipoOrgao === "virtual" ? `Pauta Virtual - ${titulo}` : titulo,
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
                          setConvidadoLinks({});
                          setConvidadoLinksLoading({});
                          setReuniaoRascunhoId(null);
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
                        setFormHorario(configHorarioPadrao || "14:00");
                        setFormModalidade(configModalidade || "presencial");
                        setFormLocal(configLocal);
                        setFormTipoReuniao(configTipoReuniao || "ordinaria");
                        setNovaReuniaoOpen(true);
                      }}
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Nova Reunião
                    </Button>
                    <DialogContent className="sm:max-w-[800px] min-h-[85vh] max-h-[90vh] overflow-y-auto">
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
                            <Label>Tipo de Reunião <span className="text-destructive">*</span></Label>
                            <Select
                              value={formModoReuniao === "avulsa" ? "avulsa" : formTipoOrgao}
                              onValueChange={(v) => {
                                if (v === "avulsa") {
                                  setFormModoReuniao("avulsa");
                                  setFormTipoOrgao("conselho");
                                  setFormOrgaoId("");
                                } else {
                                  setFormModoReuniao("orgao");
                                  setFormTipoOrgao(v as "conselho" | "comite" | "comissao" | "virtual");
                                  setFormOrgaoId("");
                                }
                                setFormTituloAvulsa("");
                              }}
                            >
                              <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="avulsa">Reunião avulsa</SelectItem>
                                <SelectItem value="conselho">Conselho</SelectItem>
                                <SelectItem value="comite">Comitê</SelectItem>
                                <SelectItem value="comissao">Comissão</SelectItem>
                                <SelectItem value="virtual">Pauta Virtual</SelectItem>
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
                                <Label>{formTipoOrgao === "virtual" ? "Tipo de Órgão" : "Órgão"} <span className="text-destructive">*</span></Label>
                                <Select value={formOrgaoId} onValueChange={setFormOrgaoId}>
                                  <SelectTrigger><SelectValue placeholder={formTipoOrgao === "virtual" ? "Selecione o tipo de órgão" : "Selecione o órgão"} /></SelectTrigger>
                                  <SelectContent>
                                    {orgaosPorTipo.map((o) => (
                                      <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {membrosOrgao.length > 0 && (
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Membros do órgão ({membrosOrgao.length}) — participantes automáticos</Label>
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
                        <TabsContent value="participantes" className="space-y-6 pt-4">
                          {formModoReuniao === "orgao" && formOrgaoId && membrosOrgao.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Os <strong>{membrosOrgao.length} membros</strong> do órgão selecionado são participantes automáticos. Adicione convidados externos abaixo.
                            </p>
                          )}
                          <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Adicionar Convidados Externos</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="conv-nome">Nome do Convidado</Label>
                                <Input
                                  id="conv-nome"
                                  value={formConvidadoNome}
                                  onChange={(e) => setFormConvidadoNome(e.target.value)}
                                  placeholder="Nome completo"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="conv-email">Email</Label>
                                <Input
                                  id="conv-email"
                                  type="email"
                                  value={formConvidadoEmail}
                                  onChange={(e) => setFormConvidadoEmail(e.target.value)}
                                  placeholder="email@exemplo.com"
                                />
                              </div>
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="conv-cargo">Cargo (opcional)</Label>
                                <Input
                                  id="conv-cargo"
                                  value={formConvidadoCargo}
                                  onChange={(e) => setFormConvidadoCargo(e.target.value)}
                                  placeholder="Ex: Consultor de Compliance, Auditoria"
                                />
                              </div>
                            </div>
                            <Button type="button" onClick={addConvidado} className="w-full">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Adicionar Convidado
                            </Button>
                          </div>
                          {formConvidados.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold">Links de Demonstração</h3>
                              <div className="space-y-3">
                                {formConvidados.map((c) => (
                                    <div
                                      key={c.id}
                                      className="rounded-lg border p-4 flex flex-col gap-3 bg-muted/30"
                                    >
                                      <div className="flex justify-between items-start gap-2">
                                        <div>
                                          <p className="font-medium text-sm">{c.nome}{c.cargo ? ` - ${c.cargo}` : ""}</p>
                                          <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeConvidado(c.id)} aria-label="Remover convidado">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copiarOuGerarLink(c)}
                                        disabled={convidadoLinksLoading[c.id]}
                                        className="w-full sm:w-auto bg-background"
                                      >
                                        {convidadoLinksLoading[c.id] ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <Copy className="h-4 w-4 mr-2" />
                                        )}
                                        Gerar / Copiar Link
                                      </Button>
                                      {convidadoLinks[c.id] && (
                                        <div className="flex gap-2">
                                          <Input
                                            readOnly
                                            value={convidadoLinks[c.id]}
                                            className="text-xs font-mono flex-1"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              navigator.clipboard.writeText(convidadoLinks[c.id]);
                                              toast({ title: "Link copiado", description: "Pronto para enviar ao convidado." });
                                            }}
                                            aria-label="Copiar link"
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                ))}
                              </div>
                            </div>
                          )}
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

                  <Dialog open={magicLinksDialog.length > 0} onOpenChange={(open) => !open && setMagicLinksDialog([])}>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Link2 className="h-5 w-5 text-primary" />
                          Links de acesso para convidados
                        </DialogTitle>
                        <DialogDescription>
                          Copie e envie cada link ao respectivo convidado. O link dá acesso ao Portal de Membros sem precisar de senha.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {magicLinksDialog.map(({ email, link }) => (
                          <div key={email} className="flex flex-col gap-2 rounded-lg border p-3 bg-muted/30">
                            <Label className="text-xs text-muted-foreground">{email}</Label>
                            <div className="flex gap-2">
                              <Input readOnly value={link} className="text-xs font-mono flex-1" />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  navigator.clipboard.writeText(link);
                                  toast({ title: "Link copiado", description: `Link de ${email} copiado para a área de transferência.` });
                                }}
                                aria-label="Copiar link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setMagicLinksDialog([])}>Fechar</Button>
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
                  <Select value={filterBodyType} onValueChange={(v) => { setFilterBodyType(v); setFilterBody("all"); }}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="conselho">Conselho</SelectItem>
                      <SelectItem value="comite">Comitê</SelectItem>
                      <SelectItem value="comissao">Comissão</SelectItem>
                      <SelectItem value="virtual">Pauta Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Órgão</label>
                  <Select value={filterBody} onValueChange={setFilterBody}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {filterBodyType === "conselho" && conselhos.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      {filterBodyType === "comite" && comites.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      {filterBodyType === "comissao" && comissoes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      {filterBodyType === "virtual" && <SelectItem value="virtual">Pauta Virtual</SelectItem>}
                      {filterBodyType === "all" && (
                        <>
                          {conselhos.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                          {comites.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                          {comissoes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                          <SelectItem value="virtual">Pauta Virtual</SelectItem>
                        </>
                      )}
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
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Calendário Anual de Reuniões</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!empresaId) return;
                    if (!window.confirm(`Tem certeza que deseja limpar todas as ${reunioes.length} reuniões de ${anoSelecionado}? Esta ação não pode ser desfeita.`)) return;
                    const { count, error } = await limparAgendas({ empresaId, ano: anoSelecionado });
                    if (error) toast({ title: "Erro ao limpar agendas", description: error, variant: "destructive" });
                    else {
                      toast({ title: "Agendas limpas", description: `${count} reunião(ões) removida(s).` });
                      setReuniaoGestao(null);
                      setGestaoOpen(false);
                    }
                  }}
                  disabled={!empresaId || reunioes.length === 0 || limparAgendasLoading}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Limpar agendas
                </Button>
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
                                const isVirtualR = !r.conselho_id && !r.comite_id && !r.comissao_id;
                                const titulo = r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || (isVirtualR ? "Pauta Virtual" : "Reunião");
                                const dataStr = r.data_reuniao ? format(new Date(r.data_reuniao), "d/M") : "";
                                const hora = r.horario ? String(r.horario).slice(0, 5) : "";
                                const statusLabel = STATUS_LABEL[r.status] ?? r.status;
                                const statusBadgeClass = STATUS_BADGE_CLASS[r.status] ?? "bg-gray-500";
                                const tipoOrgao = getTipoOrgaoReuniao(r);
                                const tipoBadgeClass = TIPO_ORGAO_BADGE_CLASS[tipoOrgao];
                                const tipoLabel = TIPO_ORGAO_LABEL[tipoOrgao];
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
                                    <div className="flex flex-wrap gap-1.5">
                                      <Badge className={tipoBadgeClass} variant="outline">{tipoLabel}</Badge>
                                      <Badge className={statusBadgeClass} variant="outline">{statusLabel}</Badge>
                                    </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                      aria-label="Mês anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold capitalize">
                      {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                    </h3>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                      aria-label="Próximo mês"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
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
                                        const isVirtualR = !r.conselho_id && !r.comite_id && !r.comissao_id;
                                        const titulo = r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || (isVirtualR ? "Pauta Virtual" : "Reunião");
                                        const hora = r.horario ? String(r.horario).slice(0, 5) : "";
                                        const tipoOrgao = getTipoOrgaoReuniao(r);
                                        const tipoBgClass =
                                          tipoOrgao === "conselho"
                                            ? "bg-blue-100 hover:bg-blue-200"
                                            : tipoOrgao === "comite"
                                              ? "bg-violet-100 hover:bg-violet-200"
                                              : tipoOrgao === "comissao"
                                                ? "bg-emerald-100 hover:bg-emerald-200"
                                                : "bg-amber-100 hover:bg-amber-200";
                                        return (
                                          <button
                                            key={r.id}
                                            type="button"
                                            className={cn(
                                              "w-full text-left rounded px-2 py-1.5 text-xs transition-colors",
                                              tipoBgClass
                                            )}
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
                    <div className="flex flex-wrap gap-6">
                      <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                      {Object.entries(TIPO_ORGAO_LABEL).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              TIPO_ORGAO_BADGE_CLASS[k as TipoOrgaoReuniao].split(" ")[0]
                            )}
                          />
                          <span className="text-sm text-muted-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-6 ml-4 pl-4 border-l">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      {Object.entries(STATUS_LABEL).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_BADGE_CLASS[k] ?? "bg-gray-500"}`} />
                          <span className="text-sm text-muted-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
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
