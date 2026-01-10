import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, AlertTriangle, Trophy, Target, Calendar, Settings, Download, RefreshCw, ChevronRight, Award, BarChart3, Clock, CheckCircle2, XCircle, ClipboardCheck, GraduationCap, LineChart } from "lucide-react";
import { useBoardPerformance } from "@/hooks/useBoardPerformance";
import { PERFORMANCE_LEVEL_LABELS, PERFORMANCE_LEVEL_COLORS } from "@/types/boardPerformance";
import { cn } from "@/lib/utils";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Importar novos componentes
import { Evaluations360Tab, PDITab, TrendsTab } from "@/components/board-performance";
export default function BoardPerformance() {
  const [selectedCouncil, setSelectedCouncil] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ranking");
  const {
    isLoading,
    currentPeriod,
    performances,
    councilSummaries,
    getAlerts,
    refresh
  } = useBoardPerformance();
  const alerts = getAlerts();
  const filteredPerformances = selectedCouncil === "all" ? performances : performances.filter(p => p.council_id === selectedCouncil);

  // Dados para o gráfico radar do membro selecionado
  const selectedPerformance = selectedMember ? performances.find(p => p.member_id === selectedMember) : null;
  const radarData = selectedPerformance ? [{
    dimension: 'Presença',
    score: selectedPerformance.presence_score,
    fullMark: 100
  }, {
    dimension: 'Contribuição',
    score: selectedPerformance.contribution_score,
    fullMark: 100
  }, {
    dimension: 'Entrega',
    score: selectedPerformance.delivery_score,
    fullMark: 100
  }, {
    dimension: 'Engajamento',
    score: selectedPerformance.engagement_score,
    fullMark: 100
  }, {
    dimension: 'Liderança',
    score: selectedPerformance.leadership_score,
    fullMark: 100
  }] : [];

  // Dados para o gráfico de barras comparativo
  const barChartData = filteredPerformances.slice(0, 10).map(p => ({
    name: p.member_name.split(' ')[0],
    score: p.final_score,
    meta: 75
  }));
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };
  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Handler para selecionar membro a partir de outras abas
  const handleSelectMember = (memberId: string) => {
    setSelectedMember(memberId);
    setActiveTab("individual");
  };
  return <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-amber-500" />
                  Desempenho do Conselho
                </h1>
                <p className="text-muted-foreground">
                  Avaliação 360°, PDI com IA e análise preditiva de performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                {currentPeriod}
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total de Conselheiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performances.length}</div>
                  <p className="text-xs text-muted-foreground">
                    em {councilSummaries.length} órgão(s)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Score Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", getScoreColor(performances.reduce((sum, p) => sum + p.final_score, 0) / (performances.length || 1)))}>
                    {performances.length > 0 ? (performances.reduce((sum, p) => sum + p.final_score, 0) / performances.length).toFixed(1) : '-'}
                  </div>
                  <Progress value={performances.length > 0 ? performances.reduce((sum, p) => sum + p.final_score, 0) / performances.length : 0} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Top Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {performances[0] ? <>
                      <div className="text-lg font-bold truncate">{performances[0].member_name}</div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          {performances[0].final_score.toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{performances[0].member_role}</span>
                      </div>
                    </> : <div className="text-muted-foreground">-</div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", alerts.length > 0 ? "text-amber-600" : "text-emerald-600")}>
                    {alerts.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alerts.filter(a => a.severity === 'error').length} críticos
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="ranking" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Ranking
                </TabsTrigger>
                <TabsTrigger value="individual" className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Análise Individual
                </TabsTrigger>
                <TabsTrigger value="evaluations" className="flex items-center gap-1">
                  <ClipboardCheck className="h-4 w-4" />
                  Avaliações 360°
                </TabsTrigger>
                <TabsTrigger value="pdi" className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  PDI
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  Tendências
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas ({alerts.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab Ranking */}
              <TabsContent value="ranking" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedCouncil} onValueChange={setSelectedCouncil}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filtrar por órgão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os órgãos</SelectItem>
                      {councilSummaries.map(s => <SelectItem key={s.council_id} value={s.council_id}>
                          {s.council_name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Lista de Ranking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ranking de Conselheiros</CardTitle>
                      <CardDescription>Ordenado por score final</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[500px] overflow-auto">
                      {filteredPerformances.map((perf, index) => <div key={perf.id} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", selectedMember === perf.member_id ? "border-primary bg-primary/5" : "hover:bg-muted/50")} onClick={() => setSelectedMember(perf.member_id)}>
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white", index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-amber-700" : "bg-muted-foreground/30")}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{perf.member_name}</div>
                            <div className="text-xs text-muted-foreground">{perf.member_role}</div>
                          </div>
                          <div className="text-right">
                            <div className={cn("text-lg font-bold", getScoreColor(perf.final_score))}>
                              {perf.final_score.toFixed(1)}
                            </div>
                            {perf.performance_level && <Badge variant="secondary" className={cn("text-xs", PERFORMANCE_LEVEL_COLORS[perf.performance_level])}>
                                {PERFORMANCE_LEVEL_LABELS[perf.performance_level]}
                              </Badge>}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>)}
                    </CardContent>
                  </Card>

                  {/* Gráfico Comparativo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Comparativo de Performance</CardTitle>
                      <CardDescription>Top 10 conselheiros vs meta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="meta" name="Meta" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} opacity={0.3} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab Análise Individual */}
              <TabsContent value="individual" className="space-y-4">
                {/* Dropdown de seleção - sempre visível */}
                <div className="flex items-center gap-4">
                  <Select value={selectedMember || ""} onValueChange={value => setSelectedMember(value || null)}>
                    <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Selecione um conselheiro para análise" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {performances.map(perf => <SelectItem key={perf.member_id} value={perf.member_id}>
                          <div className="flex items-center gap-2">
                            <span>{perf.member_name}</span>
                            <span className="text-muted-foreground text-xs">
                              ({perf.member_role})
                            </span>
                          </div>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  
                  {selectedMember && <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                      Limpar seleção
                    </Button>}
                </div>

                {selectedPerformance ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informações do Membro */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", getScoreBgColor(selectedPerformance.final_score))}>
                            {selectedPerformance.final_score.toFixed(0)}
                          </div>
                          <div>
                            <CardTitle>{selectedPerformance.member_name}</CardTitle>
                            <CardDescription>{selectedPerformance.member_role}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Classificação</span>
                          {selectedPerformance.performance_level && <Badge className={PERFORMANCE_LEVEL_COLORS[selectedPerformance.performance_level]}>
                              {PERFORMANCE_LEVEL_LABELS[selectedPerformance.performance_level]}
                            </Badge>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Ranking</span>
                          <span className="font-bold">#{selectedPerformance.rank_in_council}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Órgão</span>
                          <span className="text-sm">{selectedPerformance.council_name}</span>
                        </div>
                        
                        <div className="pt-4 border-t space-y-3">
                          <h4 className="font-medium text-sm">Métricas Detalhadas</h4>
                          {selectedPerformance.metrics && <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  Reuniões
                                </span>
                                <span>{selectedPerformance.metrics.meetings_attended}/{selectedPerformance.metrics.meetings_scheduled}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-blue-500" />
                                  Ações Concluídas
                                </span>
                                <span>{selectedPerformance.metrics.actions_completed}/{selectedPerformance.metrics.actions_assigned}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-amber-500" />
                                  Tempo Resposta
                                </span>
                                <span>{selectedPerformance.metrics.avg_response_time_hours}h</span>
                              </div>
                            </>}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico Radar */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Análise por Dimensão</CardTitle>
                        <CardDescription>Performance em cada área de avaliação</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="dimension" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                          {radarData.map(item => <div key={item.dimension} className="text-center p-2 rounded-lg bg-muted/50">
                              <div className={cn("text-lg font-bold", getScoreColor(item.score))}>
                                {item.score.toFixed(0)}
                              </div>
                              <div className="text-xs text-muted-foreground">{item.dimension}</div>
                            </div>)}
                        </div>
                      </CardContent>
                    </Card>
                  </div> : <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="font-medium text-lg">Selecione um conselheiro</h3>
                      <p className="text-muted-foreground">
                        Use o dropdown acima para escolher um conselheiro
                      </p>
                    </CardContent>
                  </Card>}
              </TabsContent>

              {/* Tab Avaliações 360° */}
              <TabsContent value="evaluations">
                <Evaluations360Tab periodId={currentPeriod?.id || 'current-period'} periodName={currentPeriod?.name || '1º Semestre 2026'} selfDeadline={currentPeriod?.self_evaluation_deadline} peerDeadline={currentPeriod?.peer_evaluation_deadline} />
              </TabsContent>

              {/* Tab PDI */}
              <TabsContent value="pdi">
                <PDITab memberId="current-user" periodId={currentPeriod?.id} />
              </TabsContent>

              {/* Tab Tendências */}
              <TabsContent value="trends">
                <TrendsTab companyId="demo-company" periodId={currentPeriod?.id} onSelectMember={handleSelectMember} />
              </TabsContent>

              {/* Tab Alertas */}
              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alertas de Performance</CardTitle>
                    <CardDescription>Situações que requerem atenção</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alerts.length > 0 ? <div className="space-y-3">
                        {alerts.map((alert, index) => <div key={index} className={cn("flex items-center gap-3 p-3 rounded-lg border", alert.severity === 'error' ? "border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800" : alert.severity === 'warning' ? "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800" : "border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800")}>
                            {alert.severity === 'error' ? <XCircle className="h-5 w-5 text-red-500 shrink-0" /> : <AlertTriangle className={cn("h-5 w-5 shrink-0", alert.severity === 'warning' ? "text-amber-500" : "text-blue-500")} />}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => alert.memberId && handleSelectMember(alert.memberId)}>
                              Ver detalhes
                            </Button>
                          </div>)}
                      </div> : <div className="text-center py-8">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                        <h3 className="font-medium">Nenhum alerta</h3>
                        <p className="text-muted-foreground text-sm">
                          Todos os conselheiros estão com performance adequada
                        </p>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>;
}