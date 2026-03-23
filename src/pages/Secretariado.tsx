import { useState } from "react";
import {
  Library,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  FileEdit,
  PenLine,
  CheckSquare,
  BarChart3,
  Users,
  LayoutGrid,
  Search,
  Loader2,
  Check,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/Sidebar";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { BuscaConversacionalAtas } from "@/components/secretariado/BuscaConversacionalAtas";
import { AprovacaoConvidadosContent } from "@/components/secretariado/AprovacaoConvidadosContent";
import { ListaAtasContent } from "@/components/secretariado/ListaAtasContent";
import { useSecretariadoIndicadores } from "@/hooks/useSecretariadoIndicadores";
import { fetchAtaFluxoDetalhe, type AtaFluxoDetalhe, type AtaListItem } from "@/services/secretariado";
import { adminAceitarReprovacao, adminReprovarReprovacao, aprovarAta, assinarAta } from "@/services/ataAprovacoes";
import { isCompanyAdm, isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

function BibliotecaContent() {
  const [subTab, setSubTab] = useState<"busca" | "atas">("busca");

  return (
    <div className="space-y-6 mt-6">
      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as "busca" | "atas")} className="w-full">
        <TabsList className="h-9 bg-transparent p-0 gap-0 border-b rounded-none mb-4">
          <TabsTrigger
            value="busca"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-2 mr-6 text-gray-600 data-[state=active]:text-gray-900"
          >
            <Search className="h-4 w-4 mr-2" />
            Busca conversacional
          </TabsTrigger>
          <TabsTrigger
            value="atas"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-2 text-gray-600 data-[state=active]:text-gray-900"
          >
            <FileText className="h-4 w-4 mr-2" />
            ATAs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="busca" className="mt-0">
          <BuscaConversacionalAtas />
        </TabsContent>
        <TabsContent value="atas" className="mt-0">
          <ListaAtasContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GestaoTarefasIndicadores() {
  const {
    indicadoresTarefas,
    atasPendentes,
    atasAguardandoAprovacao,
    atasAguardandoAssinatura,
    tarefasPendentesHistorico,
    isLoading,
    refetchAtas,
  } = useSecretariadoIndicadores();

  const { total, resolvidas, pendentes, taxaResolucao, statusPieData, tarefasPorOrgao } = indicadoresTarefas;
  const [ataDetalheOpen, setAtaDetalheOpen] = useState(false);
  const [ataDetalheLoading, setAtaDetalheLoading] = useState(false);
  const [ataDetalhe, setAtaDetalhe] = useState<AtaFluxoDetalhe | null>(null);
  const [tarefaDetalheOpen, setTarefaDetalheOpen] = useState(false);
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState<string | null>(null);
  const [adminRevisando, setAdminRevisando] = useState<string | null>(null);
  const [adminAcaoEmAndamento, setAdminAcaoEmAndamento] = useState<string | null>(null);
  const [adminTarefaAprovarEmAndamento, setAdminTarefaAprovarEmAndamento] = useState(false);
  const isAdm = isCompanyAdm();
  const isSuperAdm = isAdmin();

  const openAtaDetalhe = async (ata: AtaListItem) => {
    setAtaDetalheLoading(true);
    setAtaDetalheOpen(true);
    const { data } = await fetchAtaFluxoDetalhe(ata.id);
    setAtaDetalhe(data);
    setAtaDetalheLoading(false);
  };

  const handleAdminAceitar = async (ataId: string, membroId: string) => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      toast({ title: "Erro", description: "Sessão não encontrada.", variant: "destructive" });
      return;
    }
    setAdminRevisando(`${ataId}-${membroId}`);
    const { error } = await adminAceitarReprovacao(ataId, membroId, session.user.id);
    setAdminRevisando(null);
    if (error) {
      toast({ title: "Erro ao aceitar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Objeção aceita", description: "A objeção do membro foi aceita." });
    refetchAtas?.();
    if (ataDetalhe?.ata_id === ataId) {
      const { data } = await fetchAtaFluxoDetalhe(ataId);
      setAtaDetalhe(data);
    }
  };

  const handleAdminReprovar = async (ataId: string, membroId: string) => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      toast({ title: "Erro", description: "Sessão não encontrada.", variant: "destructive" });
      return;
    }
    setAdminRevisando(`${ataId}-${membroId}`);
    const { error } = await adminReprovarReprovacao(ataId, membroId, session.user.id);
    setAdminRevisando(null);
    if (error) {
      toast({ title: "Erro ao reprovar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Objeção reprovada", description: "A objeção do membro foi reprovada." });
    refetchAtas?.();
    if (ataDetalhe?.ata_id === ataId) {
      const { data } = await fetchAtaFluxoDetalhe(ataId);
      setAtaDetalhe(data);
    }
  };

  const handleAdminAprovar = async (ataId: string, membroId: string) => {
    const key = `${ataId}-${membroId}-aprov`;
    setAdminAcaoEmAndamento(key);
    const { error } = await aprovarAta(ataId, membroId);
    setAdminAcaoEmAndamento(null);
    if (error) {
      toast({ title: "Erro ao aprovar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "ATA aprovada", description: "Aprovação registrada em nome do membro." });
    refetchAtas?.();
    if (ataDetalhe?.ata_id === ataId) {
      const { data } = await fetchAtaFluxoDetalhe(ataId);
      setAtaDetalhe(data);
    }
  };

  const handleAdminAssinar = async (ataId: string, membroId: string) => {
    const key = `${ataId}-${membroId}-ass`;
    setAdminAcaoEmAndamento(key);
    const { error } = await assinarAta(ataId, membroId);
    setAdminAcaoEmAndamento(null);
    if (error) {
      toast({ title: "Erro ao assinar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "ATA assinada", description: "Assinatura registrada em nome do membro." });
    refetchAtas?.();
    if (ataDetalhe?.ata_id === ataId) {
      const { data } = await fetchAtaFluxoDetalhe(ataId);
      setAtaDetalhe(data);
    }
  };

  const handleAprovarTarefaComoAdm = async () => {
    if (!tarefaSelecionada?.ata_id || !tarefaSelecionada?.membro_id) return;
    const { ata_id, membro_id, etapa } = tarefaSelecionada;
    setAdminTarefaAprovarEmAndamento(true);
    const fn = etapa === "aprovacao" ? aprovarAta : assinarAta;
    const { error } = await fn(ata_id, membro_id);
    setAdminTarefaAprovarEmAndamento(false);
    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" });
      return;
    }
    const msg = etapa === "aprovacao" ? "ATA aprovada em nome do membro." : "ATA assinada em nome do membro.";
    toast({ title: "Sucesso", description: msg });
    refetchAtas?.();
    setTarefaDetalheOpen(false);
    setTarefaSelecionadaId(null);
  };

  const tarefaSelecionada = tarefasPendentesHistorico.find((t) => t.id === tarefaSelecionadaId) ?? null;

  const kpiCards = [
    {
      title: "Total Criadas",
      value: total,
      description: "Todas as tarefas registradas",
      progress: total > 0 ? 100 : 0,
      icon: CheckCircle,
      iconBg: "bg-blue-500",
    },
    {
      title: "Resolvidas",
      value: resolvidas,
      description: total > 0 ? `${Math.round((resolvidas / total) * 100)}% do total` : "0% do total",
      progress: total > 0 ? Math.round((resolvidas / total) * 100) : 0,
      icon: CheckCircle,
      iconBg: "bg-green-500",
    },
    {
      title: "Pendentes",
      value: pendentes,
      description: total > 0 ? `${Math.round((pendentes / total) * 100)}% do total` : "0% do total",
      progress: total > 0 ? Math.round((pendentes / total) * 100) : 0,
      icon: Clock,
      iconBg: "bg-orange-500",
    },
    {
      title: "Taxa de Resolução",
      value: `${taxaResolucao}%`,
      description: "Eficiência da equipe",
      progress: taxaResolucao,
      icon: TrendingUp,
      iconBg: "bg-blue-500",
    },
  ];

  const atasCards = [
    {
      title: "Aguardando Aprovação",
      value: atasPendentes.aguardandoAprovacao,
      icon: FileEdit,
      bgClass: "bg-amber-50 border-amber-200",
      textClass: "text-amber-800",
    },
    {
      title: "Aguardando Assinatura",
      value: atasPendentes.aguardandoAssinatura,
      icon: PenLine,
      bgClass: "bg-blue-50 border-blue-200",
      textClass: "text-blue-800",
    },
    {
      title: "Finalizadas",
      value: atasPendentes.finalizadas,
      icon: CheckSquare,
      bgClass: "bg-green-50 border-green-200",
      textClass: "text-green-800",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Visão Gerencial - Indicadores Executivos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-white",
                      kpi.iconBg
                    )}
                  >
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {kpi.value}
                </CardTitle>
                <p className="text-sm text-gray-500">{kpi.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Progress value={kpi.progress} className="h-2 bg-gray-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ATAS Pendentes de Aprovação/Assinatura
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {atasCards.map((ata) => (
            <Card
              key={ata.title}
              className={cn("border", ata.bgClass)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ata.icon className={cn("h-8 w-8", ata.textClass)} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{ata.value}</p>
                    <p className={cn("text-sm font-medium", ata.textClass)}>
                      {ata.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Tabs defaultValue="aprovacao" className="w-full">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0">
            <TabsTrigger
              value="aprovacao"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-2 mr-6 text-gray-600 data-[state=active]:text-gray-900"
            >
              <Clock className="h-4 w-4 mr-2" />
              Pendentes de Aprovação
            </TabsTrigger>
            <TabsTrigger
              value="assinaturas"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-2 text-gray-600 data-[state=active]:text-gray-900"
            >
              <PenLine className="h-4 w-4 mr-2" />
              Pendentes de Assinaturas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="aprovacao" className="mt-4">
            {atasAguardandoAprovacao.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma ATA aguardando aprovação.
              </p>
            ) : (
              <div className="space-y-2">
                {atasAguardandoAprovacao.map((ata) => (
                  <Card key={ata.id} className="border">
                    <CardContent
                      className="py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                      role="button"
                      tabIndex={0}
                      onClick={() => openAtaDetalhe(ata)}
                      onKeyDown={(e) => e.key === "Enter" && openAtaDetalhe(ata)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-medium">{ata.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {ata.data_reuniao
                              ? new Date(ata.data_reuniao).toLocaleDateString("pt-BR")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Aguardando membros</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="assinaturas" className="mt-4">
            {atasAguardandoAssinatura.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma ATA aguardando assinaturas.
              </p>
            ) : (
              <div className="space-y-2">
                {atasAguardandoAssinatura.map((ata) => (
                  <Card key={ata.id} className="border">
                    <CardContent
                      className="py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                      role="button"
                      tabIndex={0}
                      onClick={() => openAtaDetalhe(ata)}
                      onKeyDown={(e) => e.key === "Enter" && openAtaDetalhe(ata)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-medium">{ata.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {ata.data_reuniao
                              ? new Date(ata.data_reuniao).toLocaleDateString("pt-BR")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Aguardando assinaturas</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Visão Estratégica - Análise por Órgãos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                Distribuição por Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {statusPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, ""]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Nenhuma tarefa para exibir
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                Tarefas por Órgão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {tarefasPorOrgao.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tarefasPorOrgao}
                      margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                    >
                      <XAxis
                        dataKey="orgao"
                        tick={{ fontSize: 11 }}
                        angle={-35}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        dataKey="quantidade"
                        allowDecimals={false}
                        label={{
                          value: "Quantidade",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 12 },
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [value, "Quantidade"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                        {tarefasPorOrgao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Nenhuma tarefa para exibir
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Histórico &gt; Tarefas Pendentes
        </h2>
        {tarefasPendentesHistorico.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma tarefa pendente no momento.</p>
        ) : (
          <div className="space-y-3">
            {tarefasPendentesHistorico.map((tarefa) => (
              <Card
                key={tarefa.id}
                className={cn(
                  "border-l-4 hover:bg-red-50 transition-colors cursor-pointer",
                  tarefa.etapa === "aprovacao"
                    ? "border-l-amber-400 bg-amber-50/40"
                    : tarefa.etapa === "assinatura"
                      ? "border-l-blue-400 bg-blue-50/30"
                      : "border-l-red-400 bg-red-50/40"
                )}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setTarefaSelecionadaId(tarefa.id);
                  setTarefaDetalheOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setTarefaSelecionadaId(tarefa.id);
                    setTarefaDetalheOpen(true);
                  }
                }}
              >
                <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{tarefa.nome}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">{tarefa.orgao}</span>
                      {" • "}
                      {tarefa.responsavel}
                      {" • "}
                      Prazo: {tarefa.prazo ? new Date(tarefa.prazo).toLocaleDateString("pt-BR") : "não definido"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={tarefa.etapa === "aprovacao" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"}>
                      {tarefa.etapa === "aprovacao"
                        ? "Aprovação"
                        : tarefa.etapa === "assinatura"
                          ? "Assinatura"
                          : "Tarefa e Combinado"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver e Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog open={ataDetalheOpen} onOpenChange={setAtaDetalheOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {ataDetalhe?.titulo ?? "Andamento da ATA"}
            </DialogTitle>
          </DialogHeader>

          {ataDetalheLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando andamento...
            </div>
          ) : !ataDetalhe ? (
            <p className="text-sm text-muted-foreground">Não foi possível carregar os detalhes.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  Aprovação: {ataDetalhe.aprovados}/{ataDetalhe.participantes.length}
                </Badge>
                <Badge variant="secondary">
                  Assinatura: {ataDetalhe.assinados}/{ataDetalhe.participantes.length}
                </Badge>
              </div>
              {(ataDetalhe.participantes.some((p) => !p.aprovado_em && !p.reprovado_em) ||
                ataDetalhe.participantes.some((p) => p.aprovado_em && !p.assinado_em)) && (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium">Pendências para gestão</p>
                  {ataDetalhe.participantes.some((p) => !p.aprovado_em && !p.reprovado_em) && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Aguardando aprovação</p>
                      <ul className="text-sm space-y-1">
                        {ataDetalhe.participantes
                          .filter((p) => !p.aprovado_em && !p.reprovado_em)
                          .map((p) => (
                            <li key={p.membro_id} className="flex items-center gap-2">
                              <span className="font-medium">{p.nome}</span>
                              {p.email && (
                                <a
                                  href={`mailto:${p.email}`}
                                  className="text-blue-600 hover:underline truncate"
                                  title={`Enviar e-mail para ${p.nome}`}
                                >
                                  {p.email}
                                </a>
                              )}
                              {!p.email && p.cargo && (
                                <span className="text-muted-foreground">— {p.cargo}</span>
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {ataDetalhe.participantes.some((p) => p.aprovado_em && !p.assinado_em) && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Aguardando assinatura</p>
                      <ul className="text-sm space-y-1">
                        {ataDetalhe.participantes
                          .filter((p) => p.aprovado_em && !p.assinado_em)
                          .map((p) => (
                            <li key={p.membro_id} className="flex items-center gap-2">
                              <span className="font-medium">{p.nome}</span>
                              {p.email && (
                                <a
                                  href={`mailto:${p.email}`}
                                  className="text-blue-600 hover:underline truncate"
                                  title={`Enviar e-mail para ${p.nome}`}
                                >
                                  {p.email}
                                </a>
                              )}
                              {!p.email && p.cargo && (
                                <span className="text-muted-foreground">— {p.cargo}</span>
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {ataDetalhe.participantes.map((p) => {
                  const aprovou = !!p.aprovado_em;
                  const reprovou = !!p.reprovado_em;
                  const assinou = !!p.assinado_em;
                  const adminPendente = reprovou && p.admin_revisao === "pendente";
                  const adminAceito = reprovou && p.admin_revisao === "aceito";
                  const adminReprovado = reprovou && p.admin_revisao === "reprovado";
                  const revisando = adminRevisando === `${ataDetalhe.ata_id}-${p.membro_id}`;
                  return (
                    <Card key={p.membro_id} className={cn(
                      "border",
                      aprovou ? "border-emerald-200" : reprovou ? "border-red-200" : "border-amber-200"
                    )}>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{p.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {[p.email, p.cargo].filter(Boolean).join(" • ") || "Membro"}
                            </p>
                            {reprovou && p.reprovacao_comentario && (
                              <div className="mt-2 p-2 rounded bg-red-50 border border-red-100 text-sm text-red-800">
                                <span className="font-medium">Objeção: </span>
                                {p.reprovacao_comentario}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={aprovou ? "bg-emerald-100 text-emerald-700 border-emerald-200" : reprovou ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"} variant="outline">
                              {aprovou ? "Aprovado" : reprovou ? "Reprovado" : "Aprovação pendente"}
                            </Badge>
                            {(isAdm || isSuperAdm) && reprovou && adminPendente && (
                              <>
                                <Badge variant="secondary">Aguardando sua revisão</Badge>
                                <Button size="sm" variant="outline" disabled={!!revisando} onClick={() => handleAdminAceitar(ataDetalhe.ata_id, p.membro_id)}>
                                  {revisando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                  Aceitar análise
                                </Button>
                                <Button size="sm" variant="destructive" disabled={!!revisando} onClick={() => handleAdminReprovar(ataDetalhe.ata_id, p.membro_id)}>
                                  {revisando ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                  Reprovar análise
                                </Button>
                              </>
                            )}
                            {reprovou && adminAceito && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Objeção aceita</Badge>
                            )}
                            {reprovou && adminReprovado && (
                              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Objeção reprovada</Badge>
                            )}
                            {(isAdm || isSuperAdm) && !aprovou && !reprovou && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                disabled={adminAcaoEmAndamento === `${ataDetalhe.ata_id}-${p.membro_id}-aprov`}
                                onClick={() => handleAdminAprovar(ataDetalhe.ata_id, p.membro_id)}
                              >
                                {adminAcaoEmAndamento === `${ataDetalhe.ata_id}-${p.membro_id}-aprov` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Aprovar
                                  </>
                                )}
                              </Button>
                            )}
                            {(isAdm || isSuperAdm) && aprovou && !assinou && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                disabled={adminAcaoEmAndamento === `${ataDetalhe.ata_id}-${p.membro_id}-ass`}
                                onClick={() => handleAdminAssinar(ataDetalhe.ata_id, p.membro_id)}
                              >
                                {adminAcaoEmAndamento === `${ataDetalhe.ata_id}-${p.membro_id}-ass` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <PenLine className="h-4 w-4 mr-1" />
                                    Assinar
                                  </>
                                )}
                              </Button>
                            )}
                            <Badge className={assinou ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"} variant="outline">
                              {assinou ? "Assinado" : "Assinatura pendente"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={tarefaDetalheOpen} onOpenChange={setTarefaDetalheOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tarefa Pendente</DialogTitle>
          </DialogHeader>
          {!tarefaSelecionada ? (
            <p className="text-sm text-muted-foreground">Tarefa não encontrada.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Tarefa</p>
                <p className="font-medium">{tarefaSelecionada.nome}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Etapa</p>
                <p className="font-medium">
                  {tarefaSelecionada.etapa === "aprovacao"
                    ? "Aprovação da ATA"
                    : tarefaSelecionada.etapa === "assinatura"
                      ? "Assinatura da ATA"
                      : "Tarefas e Combinados"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-muted-foreground">Órgão</p>
                  <p className="font-medium">{tarefaSelecionada.orgao}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Responsável</p>
                  <p className="font-medium">{tarefaSelecionada.responsavel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prazo</p>
                  <p className="font-medium">
                    {tarefaSelecionada.prazo ? new Date(tarefaSelecionada.prazo).toLocaleDateString("pt-BR") : "Não definido"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Reunião</p>
                <p className="font-medium">{tarefaSelecionada.reuniao_titulo}</p>
              </div>
              {(isAdm || isSuperAdm) && (tarefaSelecionada.etapa === "aprovacao" || tarefaSelecionada.etapa === "assinatura") && tarefaSelecionada.ata_id && tarefaSelecionada.membro_id && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleAprovarTarefaComoAdm}
                    disabled={adminTarefaAprovarEmAndamento}
                    variant="outline"
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    {adminTarefaAprovarEmAndamento ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar como ADM
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Secretariado = () => {
  const [activeTab, setActiveTab] = useState("indicadores");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Painel de Secretariado
              </h1>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-2"
              >
                <TabsList className="h-9 bg-transparent p-0 gap-0 border-b-0 rounded-none">
                  <TabsTrigger
                    value="indicadores"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-1 mr-6 text-gray-600 data-[state=active]:text-gray-900"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Indicadores
                  </TabsTrigger>
                  <TabsTrigger
                    value="biblioteca"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-1 mr-6 text-gray-600 data-[state=active]:text-gray-900"
                  >
                    <Library className="h-4 w-4 mr-2" />
                    Biblioteca
                  </TabsTrigger>
                  <TabsTrigger
                    value="convidados"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-1 mr-6 text-gray-600 data-[state=active]:text-gray-900"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Aprovação de Convidados
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <GuiaLegacyButton />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {activeTab === "indicadores" && (
            <div className="mt-6">
              <GestaoTarefasIndicadores />
            </div>
          )}
          {activeTab === "biblioteca" && <BibliotecaContent />}
          {activeTab === "convidados" && <AprovacaoConvidadosContent />}
        </main>
      </div>
    </div>
  );
};

export default Secretariado;
