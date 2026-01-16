import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Eye, Calendar, ArrowUpRight, ArrowDownRight, Minus, Clock, User, ChevronDown, ChevronUp, FileText, Lightbulb, Target, Download } from "lucide-react";
import { generateGovernancePDFReport } from "@/components/GovernancePDFReport";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import MaturityTimeline from "@/components/MaturityTimeline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockHistoricalAssessments, getHistoricalTrend, HistoricalAssessment } from "@/data/mockHistoricalData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCurrentMaturityAssessment, getMaturityHistory, convertStoredDataToRadarData, StoredMaturityAssessment } from "@/utils/maturityStorage";

// Sample historical data for maturity scores
const historyData = [{
  id: 1,
  date: "Jun/2024",
  overall: 3.6,
  details: [{
    name: "Estrutura Formal",
    score: 4.2
  }, {
    name: "Processos Decisórios",
    score: 3.1
  }, {
    name: "Participação Familiar",
    score: 4.5
  }, {
    name: "Sucessão",
    score: 2.8
  }, {
    name: "Prestação de Contas",
    score: 3.7
  }, {
    name: "Cultura de Governança",
    score: 3.4
  }]
}, {
  id: 2,
  date: "Dez/2023",
  overall: 3.3,
  details: [{
    name: "Estrutura Formal",
    score: 3.8
  }, {
    name: "Processos Decisórios",
    score: 2.9
  }, {
    name: "Participação Familiar",
    score: 4.2
  }, {
    name: "Sucessão",
    score: 2.5
  }, {
    name: "Prestação de Contas",
    score: 3.5
  }, {
    name: "Cultura de Governança",
    score: 3.0
  }]
}, {
  id: 3,
  date: "Jun/2023",
  overall: 2.9,
  details: [{
    name: "Estrutura Formal",
    score: 3.5
  }, {
    name: "Processos Decisórios",
    score: 2.6
  }, {
    name: "Participação Familiar",
    score: 3.8
  }, {
    name: "Sucessão",
    score: 2.0
  }, {
    name: "Prestação de Contas",
    score: 3.0
  }, {
    name: "Cultura de Governança",
    score: 2.6
  }]
}, {
  id: 4,
  date: "Dez/2022",
  overall: 2.5,
  details: [{
    name: "Estrutura Formal",
    score: 3.0
  }, {
    name: "Processos Decisórios",
    score: 2.2
  }, {
    name: "Participação Familiar",
    score: 3.0
  }, {
    name: "Sucessão",
    score: 1.8
  }, {
    name: "Prestação de Contas",
    score: 2.5
  }, {
    name: "Cultura de Governança",
    score: 2.2
  }]
}];

// Progress data for line chart
const progressData = historyData.map(entry => ({
  date: entry.date,
  score: entry.overall
})).reverse();

// Sample log data for activity tracking
const activityLogs = [{
  id: "1",
  user: "Admin",
  userInitials: "A",
  action: "Atualizou a avaliação de maturidade",
  timestamp: new Date(2024, 5, 15, 14, 30),
  details: "Pontuação geral: 3.6"
}, {
  id: "2",
  user: "Maria Silva",
  userInitials: "MS",
  action: "Criou nova avaliação de maturidade",
  timestamp: new Date(2023, 11, 10, 9, 45),
  details: "Pontuação geral: 3.3"
}, {
  id: "3",
  user: "João Costa",
  userInitials: "JC",
  action: "Atualizou a avaliação de maturidade",
  timestamp: new Date(2023, 5, 5, 16, 15),
  details: "Pontuação geral: 2.9"
}, {
  id: "4",
  user: "Carolina Mendes",
  userInitials: "CM",
  action: "Criou a primeira avaliação de maturidade",
  timestamp: new Date(2022, 11, 20, 11, 20),
  details: "Pontuação geral: 2.5"
}];
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
const Maturity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "results";
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [maturityData, setMaturityData] = useState(convertStoredDataToRadarData(null));
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const historicalTrend = getHistoricalTrend();
  useEffect(() => {
    // Load current assessment
    const currentAssessment = getCurrentMaturityAssessment();
    setMaturityData(convertStoredDataToRadarData(currentAssessment));

    // Load IBGC historical data
    const ibgcHistory = mockHistoricalAssessments;
    const formattedHistory = ibgcHistory.map(assessment => ({
      id: assessment.id,
      date: assessment.period,
      overall: assessment.result.pontuacao_total, // Já está em pontos (0-5)
      details: Object.entries(assessment.result.pontuacao_dimensoes).map(([name, score]) => ({
        name,
        score: score // Já está em pontos (0-5)
      })),
      timestamp: assessment.date,
      stage: assessment.result.estagio
    }));
    setHistoryData(formattedHistory);

    // Set timeline data with IBGC historical trend
    const timeline = getHistoricalTrend();
    setTimelineData(timeline);
    setProgressData(formattedHistory.map(entry => ({
      date: entry.date,
      score: entry.overall
    })).reverse());

    // Convert history to activity logs
    const logs = ibgcHistory.map(assessment => ({
      id: assessment.id,
      user: assessment.analyst,
      userInitials: assessment.analystInitials,
      action: "Avaliação de maturidade IBGC concluída",
      timestamp: assessment.date,
      details: `Pontuação geral: ${assessment.result.pontuacao_total.toFixed(2)} pontos | Estágio: ${assessment.result.estagio}`
    }));
    setActivityLogs(logs);
  }, []);
  const handleOpenDetails = (assessment: any) => {
    setSelectedAssessment(assessment);
    setOpenDialog(true);
  };
  const getMaturityLevel = (score: number) => {
    if (score >= 4) return {
      level: "Alto",
      color: "bg-purple-500"
    };
    if (score >= 3) return {
      level: "Médio",
      color: "bg-orange-500"
    };
    return {
      level: "Baixo",
      color: "bg-red-500"
    };
  };
  const getScoreTrend = (currentIndex: number) => {
    if (currentIndex >= historyData.length - 1) return null;
    const currentScore = historyData[currentIndex].overall;
    const previousScore = historyData[currentIndex + 1].overall;
    const diff = currentScore - previousScore;
    if (diff > 0) return {
      icon: <ArrowUpRight className="h-4 w-4 text-green-600" />,
      text: `+${diff.toFixed(1)}`
    };
    if (diff < 0) return {
      icon: <ArrowDownRight className="h-4 w-4 text-red-600" />,
      text: diff.toFixed(1)
    };
    return {
      icon: <Minus className="h-4 w-4 text-gray-600" />,
      text: "0.0"
    };
  };
  const goToMaturityQuiz = () => {
    navigate("/maturity-quiz");
  };
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Maturidade de Governança" />
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="results">Maturidade e Histórico</TabsTrigger>
              <TabsTrigger value="new-assessment">Nova Avaliação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="space-y-6">
              {/* Radar Chart Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-legacy-500">Maturidade em Governança</h2>
                  </div>
                  <div className="h-80 mb-4">
                    {maturityData && maturityData.length > 0 ? <MaturityRadarChart data={maturityData} /> : <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <p>Carregando dados de maturidade...</p>
                          <p className="text-sm mt-1">Aguarde enquanto processamos as informações</p>
                        </div>
                      </div>}
                  </div>
                  <div className="flex justify-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded opacity-60"></div>
                      <span>Sua Empresa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 border-2 border-gray-500 border-dashed"></div>
                      <span>Média do Setor</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {maturityData.map(item => {
                    const maturity = getMaturityLevel(item.score);
                    return <div key={item.name} className="text-center p-3 border rounded-md">
                        <div className="text-sm font-medium text-gray-500 mb-1">{item.name}</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="text-xl font-semibold text-legacy-purple-500">{item.score}</div>
                          <Badge className={`${maturity.color} hover:${maturity.color}`}>{maturity.level}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Setor: {item.sectorAverage} | Gap: {item.score - item.sectorAverage > 0 ? '+' : ''}{(item.score - item.sectorAverage).toFixed(1)}
                        </div>
                      </div>;
                  })}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Evolução */}
              

              {/* Timeline de Maturidade */}
              <MaturityTimeline data={timelineData} />
              
              {/* Histórico de Avaliações */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-legacy-500">Histórico de Avaliações</h2>
                    <Button variant="outline" onClick={() => setShowHistoricalData(!showHistoricalData)}>
                      {showHistoricalData ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                      {showHistoricalData ? 'Ocultar Atividades' : 'Ver Atividades'}
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Período</TableHead>
                        <TableHead>Pontuação Geral</TableHead>
                        <TableHead>Estágio IBGC</TableHead>
                        <TableHead>Evolução</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.map((assessment, index) => {
                      const trend = getScoreTrend(index);
                      return <TableRow key={assessment.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleOpenDetails(assessment)}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-legacy-purple-500" />
                              {assessment.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{assessment.overall.toFixed(2)} pontos</TableCell>
                          <TableCell>
                            <Badge variant="outline">{assessment.stage}</Badge>
                          </TableCell>
                          <TableCell>
                            {trend ? <div className="flex items-center">
                              {trend.icon}
                              <span className={`ml-1 ${trend.text.startsWith('+') ? 'text-green-600' : trend.text === '0.0' ? 'text-gray-600' : 'text-red-600'}`}>
                                {trend.text}
                              </span>
                            </div> : <span>-</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" onClick={e => {
                            e.stopPropagation();
                            handleOpenDetails(assessment);
                          }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>;
                    })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Atividades Recentes - Expandable */}
              {showHistoricalData && <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-legacy-500 mb-6">Atividades Recentes</h2>
                    <div className="space-y-4">
                      {activityLogs.map(log => <div key={log.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarFallback className="bg-legacy-500 text-white">{log.userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">{log.user}</h4>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{log.action}</p>
                          {log.details && <p className="text-sm text-gray-500 mt-1">{log.details}</p>}
                        </div>
                      </div>)}
                    </div>
                  </CardContent>
                </Card>}
            </TabsContent>

            <TabsContent value="new-assessment">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <BarChart3 className="h-16 w-16 mx-auto mb-6 text-legacy-500" />
                    <h2 className="text-2xl font-semibold text-legacy-500 mb-4">
                      Avaliação de Maturidade de Governança
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Avalie a maturidade da governança corporativa da sua organização com base em diretrizes de boas práticas de governança corporativa.
                    </p>
                    <Button onClick={() => navigate("/maturity-quiz")} size="lg" className="w-full md:w-auto px-8">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Iniciar Avaliação de Governança
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Relatório de Maturidade IBGC - {selectedAssessment?.date}
            </DialogTitle>
            <DialogDescription>
              Análise completa de governança corporativa
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && (() => {
            // Find the full assessment data from mockHistoricalAssessments
            const fullAssessment = mockHistoricalAssessments.find(a => a.period === selectedAssessment.date);
            const scorePoints = selectedAssessment.overall; // Já está em pontos (0-5)
            
            const getStageDescription = (stage: string) => {
              const descriptions: Record<string, string> = {
                "Básico": "Empresa em estágio inicial de governança. Foco em formalização de estruturas básicas e processos decisórios.",
                "Intermediário": "Boa evolução em governança. Continuar aprimorando controles e transparência.",
                "Sólido": "Maturidade sólida em governança. Foque em otimização e práticas avançadas.",
                "Avançado": "Excelência em governança corporativa. Referência para o setor."
              };
              return descriptions[stage] || "Avaliação em andamento.";
            };
            
            return (
              <div className="py-4 space-y-6">
                {/* Score Card */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Pontuação Geral</h3>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {selectedAssessment.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{scorePoints.toFixed(2)}</span>
                      <span className="text-xl text-muted-foreground">pontos</span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                    <Badge className={`${getMaturityLevel(selectedAssessment.overall).color} hover:${getMaturityLevel(selectedAssessment.overall).color}`}>
                      {getMaturityLevel(selectedAssessment.overall).level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getStageDescription(selectedAssessment.stage)}
                  </p>
                </div>
                
                {/* Dimensões Grid */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Desempenho por Dimensão
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {selectedAssessment.details.map((detail: any) => {
                      const maturity = getMaturityLevel(detail.score);
                      return (
                        <div key={detail.name} className="border rounded-lg p-3 text-center bg-card">
                          <div className="text-xs font-medium text-muted-foreground mb-2 line-clamp-2 h-8">
                            {detail.name}
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {detail.score.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">/5.0</div>
                          <Badge className={`${maturity.color} hover:${maturity.color} text-xs`}>
                            {maturity.level}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Insights */}
                {fullAssessment?.keyInsights && fullAssessment.keyInsights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Principais Insights
                    </h3>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {fullAssessment.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Recomendações */}
                {fullAssessment?.recommendations && fullAssessment.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Recomendações Prioritárias
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {fullAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-1">{index + 1}.</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Próximos Passos */}
                {fullAssessment?.nextSteps && fullAssessment.nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Próximos Passos
                    </h3>
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {fullAssessment.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-1">→</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={async () => {
                      if (fullAssessment) {
                        await generateGovernancePDFReport(fullAssessment);
                      }
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                    Fechar
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>;
};
export default Maturity;