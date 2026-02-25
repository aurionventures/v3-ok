import { useState } from "react";
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  RefreshCw,
  Download,
  BarChart3,
  User,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const RANKING_DATA = [
  { rank: 1, name: "Juliana Rodrigues Martins", role: "Conselheiro", score: 87.0, badge: "Acima das Expectativas" },
  { rank: 2, name: "Roberto Almeida Silva", role: "Presidente", score: 86.2, badge: "Acima das Expectativas" },
  { rank: 3, name: "Bruno Henrique Cardoso", role: "Consultor de Tecnologia", score: 85.4, badge: "Acima das Expectativas" },
  { rank: 4, name: "Mariana Costa Lima", role: "Conselheiro Independente", score: 83.9, badge: "Acima das Expectativas" },
  { rank: 5, name: "Fernando Dias Oliveira", role: "Conselheiro", score: 81.6, badge: "Acima das Expectativas" },
  { rank: 6, name: "Ricardo Mendes Souza", role: "Conselheiro", score: 80.2, badge: "Dentro das Expectativas" },
  { rank: 7, name: "Dr. Carlos Eduardo Ferreira", role: "Conselheiro", score: 79.1, badge: "Dentro das Expectativas" },
  { rank: 8, name: "Dr. Ana Paula Ribeiro", role: "Conselheiro Independente", score: 78.5, badge: "Dentro das Expectativas" },
  { rank: 9, name: "Patricia Gomes Santos", role: "Conselheiro", score: 77.8, badge: "Dentro das Expectativas" },
  { rank: 10, name: "Claudia Oliveira Lima", role: "Conselheiro", score: 76.4, badge: "Dentro das Expectativas" },
];

const COMPARATIVO_DATA = RANKING_DATA.map((r) => ({
  name: r.name.split(" ").slice(0, 2).join(" "),
  fullName: r.name,
  score: r.score,
  meta: 80,
}));

const INDIVIDUAL_DIMENSOES = [
  { dimensao: "Participação", score: 88, meta: 80, descricao: "Presença e pontualidade" },
  { dimensao: "Preparação", score: 82, meta: 80, descricao: "Leitura prévia de materiais" },
  { dimensao: "Contribuição", score: 85, meta: 80, descricao: "Qualidade das intervenções" },
  { dimensao: "Colaboração", score: 79, meta: 80, descricao: "Trabalho em conjunto" },
  { dimensao: "Governança", score: 84, meta: 80, descricao: "Conformidade e ética" },
];

const EVOLUCAO_INDIVIDUAL = [
  { periodo: "1S 2024", score: 76 },
  { periodo: "2S 2024", score: 78 },
  { periodo: "1S 2025", score: 81 },
  { periodo: "2S 2025", score: 83 },
  { periodo: "1S 2026", score: 87 },
];

const TENDENCIAS_SEMESTRE = [
  { semestre: "1S 2024", media: 74.2, meta: 80 },
  { semestre: "2S 2024", media: 76.1, meta: 80 },
  { semestre: "1S 2025", media: 77.8, meta: 80 },
  { semestre: "2S 2025", media: 78.5, meta: 80 },
  { semestre: "1S 2026", media: 79.8, meta: 80 },
];

const TENDENCIAS_DIMENSAO = [
  { dimensao: "Participação", 1: 72, 2: 75, 3: 78, 4: 80, 5: 82 },
  { dimensao: "Preparação", 1: 70, 2: 73, 3: 76, 4: 78, 5: 79 },
  { dimensao: "Contribuição", 1: 75, 2: 77, 3: 79, 4: 80, 5: 81 },
  { dimensao: "Colaboração", 1: 76, 2: 77, 3: 78, 4: 79, 5: 79 },
  { dimensao: "Governança", 1: 78, 2: 79, 3: 80, 4: 81, 5: 82 },
];

const ALERTAS_MOCK = [
  {
    id: "1",
    titulo: "Participação abaixo do esperado",
    descricao: "Claudia Oliveira Lima ausente em 2 reuniões ordinárias no período. Taxa de presença em 73%.",
    severidade: "media" as const,
    data: "15/02/2026",
    acao: "Enviar lembrete de calendário e verificar disponibilidade.",
  },
  {
    id: "2",
    titulo: "Score abaixo da meta",
    descricao: "Ricardo Mendes Souza com score 80.2 (meta 80). Dimensão Colaboração em 76; sugerir feedback estruturado.",
    severidade: "baixa" as const,
    data: "10/02/2026",
    acao: "Agendar conversa de desenvolvimento com o conselheiro.",
  },
];

const CouncilPerformance = () => {
  const [period, setPeriod] = useState("1s2026");
  const [organ, setOrgan] = useState("all");

  const headerRight = (
    <>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1s2026">1º Semestre 2026</SelectItem>
          <SelectItem value="2s2025">2º Semestre 2025</SelectItem>
          <SelectItem value="1s2025">1º Semestre 2025</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Exportar
      </Button>
    </>
  );

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-900 font-bold";
    if (rank === 2) return "bg-slate-300 text-slate-700 font-semibold";
    if (rank === 3) return "bg-amber-700 text-amber-100 font-semibold";
    return "bg-muted text-muted-foreground font-semibold";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Desempenho do Conselho" rightExtra={headerRight} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Cartões de métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">11</p>
                      <p className="text-sm text-muted-foreground">em 2 órgão(s)</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Total de Conselheiros</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-bold text-gray-900">79.8</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Score Médio</p>
                      <Progress value={79.8} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-amber-100 p-2">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Juliana Rodrigues Martins</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">87.0</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Conselheiro</p>
                      <p className="text-xs font-medium text-muted-foreground">Top Performer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-100 p-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">2</p>
                      <p className="text-sm text-muted-foreground">0 críticos</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Alertas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Abas e filtro */}
            <Tabs defaultValue="ranking" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <TabsList className="bg-white border">
                  <TabsTrigger value="ranking" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Ranking
                  </TabsTrigger>
                  <TabsTrigger value="individual" className="gap-2">
                    <User className="h-4 w-4" />
                    Análise Individual
                  </TabsTrigger>
                  <TabsTrigger value="tendencies" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Tendências
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Alertas (2)
                  </TabsTrigger>
                </TabsList>
                <Select value={organ} onValueChange={setOrgan}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Órgão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os órgãos</SelectItem>
                    <SelectItem value="ca">Conselho de Administração</SelectItem>
                    <SelectItem value="fiscal">Conselho Fiscal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="ranking" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ranking de Conselheiros */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ranking de Conselheiros</CardTitle>
                      <p className="text-sm text-muted-foreground">Ordenado por score final</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {RANKING_DATA.map((item) => (
                          <div
                            key={item.rank}
                            className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
                                getRankStyle(item.rank)
                              )}
                            >
                              {item.rank}º
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.role}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-semibold">{item.score}</span>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  item.badge === "Acima das Expectativas"
                                    ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {item.badge}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comparativo de Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparativo de Performance</CardTitle>
                      <p className="text-sm text-muted-foreground">Top 10 conselheiros vs meta</p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={COMPARATIVO_DATA}
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                            <Tooltip
                              formatter={(value: number) => [value, ""]}
                              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName}
                            />
                            <Legend />
                            <Bar dataKey="score" name="Score" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="meta" name="Meta" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="individual" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análise por dimensão</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Juliana Rodrigues Martins — 1º Semestre 2026
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {INDIVIDUAL_DIMENSOES.map((d) => (
                          <div key={d.dimensao} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-900">{d.dimensao}</span>
                              <span className={d.score >= d.meta ? "text-emerald-600" : "text-amber-600"}>
                                {d.score} / {d.meta}
                              </span>
                            </div>
                            <Progress
                              value={Math.min(100, (d.score / 100) * 100)}
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground">{d.descricao}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do score</CardTitle>
                      <p className="text-sm text-muted-foreground">Últimos 5 períodos</p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={EVOLUCAO_INDIVIDUAL} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                            <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value: number) => [value, "Score"]} />
                            <Line type="monotone" dataKey="score" name="Score" stroke="#1e3a5f" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pontos fortes: </span>
                          <span className="font-medium">Participação, Contribuição</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">A desenvolver: </span>
                          <span className="font-medium">Colaboração</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tendencies" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Score médio do conselho por semestre</CardTitle>
                      <p className="text-sm text-muted-foreground">Comparativo com meta (80)</p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={TENDENCIAS_SEMESTRE} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis dataKey="semestre" tick={{ fontSize: 11 }} />
                            <YAxis domain={[70, 85]} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="media" name="Média" stroke="#1e3a5f" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="meta" name="Meta" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendência por dimensão (últimos 5 semestres)</CardTitle>
                      <p className="text-sm text-muted-foreground">Evolução da média por área</p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={TENDENCIAS_DIMENSAO} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis dataKey="dimensao" tick={{ fontSize: 10 }} />
                            <YAxis domain={[68, 85]} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="1" name="S1" stroke="#1e3a5f" strokeWidth={1.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="2" name="S2" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="3" name="S3" stroke="#6366f1" strokeWidth={1.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="4" name="S4" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="5" name="S5" stroke="#a855f7" strokeWidth={1.5} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Alertas de desempenho</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {ALERTAS_MOCK.length} alerta(s) no período — nenhum crítico
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ALERTAS_MOCK.map((alerta) => (
                        <div
                          key={alerta.id}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4",
                            alerta.severidade === "media" && "border-amber-200 bg-amber-50/50",
                            alerta.severidade === "baixa" && "border-slate-200 bg-slate-50/50"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                              <h4 className="font-medium text-gray-900">{alerta.titulo}</h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  alerta.severidade === "media" && "border-amber-300 text-amber-800",
                                  alerta.severidade === "baixa" && "border-slate-400 text-slate-700"
                                )}
                              >
                                {alerta.severidade === "media" ? "Média" : "Baixa"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{alerta.descricao}</p>
                            <p className="text-xs text-muted-foreground mt-2">{alerta.data}</p>
                          </div>
                          <div className="shrink-0">
                            <p className="text-xs font-medium text-gray-700 mb-1">Ação sugerida</p>
                            <p className="text-sm text-muted-foreground">{alerta.acao}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Ver detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CouncilPerformance;
