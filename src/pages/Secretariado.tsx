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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/Sidebar";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import GuidedNavigation from "@/components/GuidedNavigation";
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
    isLoading,
  } = useSecretariadoIndicadores();

  const { total, resolvidas, pendentes, taxaResolucao, statusPieData, tarefasPorOrgao } = indicadoresTarefas;

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
            <p className="text-sm text-gray-500">
              Lista de atas aguardando aprovação.
            </p>
          </TabsContent>
          <TabsContent value="assinaturas" className="mt-4">
            <p className="text-sm text-gray-500">
              Lista de atas aguardando assinaturas.
            </p>
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
    </div>
  );
}

const Secretariado = () => {
  const [activeTab, setActiveTab] = useState("indicadores");
  const [showGuidedNav, setShowGuidedNav] = useState(false);

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
              <GuiaLegacyButton onClick={() => setShowGuidedNav(true)} />
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

      <GuidedNavigation
        isOpen={showGuidedNav}
        onClose={() => setShowGuidedNav(false)}
      />
    </div>
  );
};

export default Secretariado;
