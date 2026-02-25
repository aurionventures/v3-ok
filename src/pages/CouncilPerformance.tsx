import { useState } from "react";
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  RefreshCw,
  Download,
  Settings,
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

const CouncilPerformance = () => {
  const [period, setPeriod] = useState("1s2026");
  const [organ, setOrgan] = useState("all");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Desempenho do Conselho" />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Barra de período e ações */}
            <div className="flex flex-wrap items-center justify-between gap-4">
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
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

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

            {/* Abas */}
            <Tabs defaultValue="ranking" className="space-y-4">
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
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                              {item.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.role}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-semibold">{item.score}</span>
                              <Badge variant="secondary" className="text-xs">
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
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Conteúdo de Análise Individual em desenvolvimento.
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tendencies" className="space-y-4">
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Conteúdo de Tendências em desenvolvimento.
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Conteúdo de Alertas em desenvolvimento.
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
