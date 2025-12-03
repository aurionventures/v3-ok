import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Eye, Calendar, ArrowUpRight, ArrowDownRight, Minus, Clock, User, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import MaturityInsights from "@/components/MaturityInsights";
import MaturityGlobalIndicator from "@/components/MaturityGlobalIndicator";
import SectorRanking from "@/components/SectorRanking";
import MaturityTimeline from "@/components/MaturityTimeline";
import { useNavigate } from "react-router-dom";
import { mockHistoricalAssessments, getHistoricalTrend } from "@/data/mockHistoricalData";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [maturityData, setMaturityData] = useState(convertStoredDataToRadarData(null));
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  useEffect(() => {
    // Load current assessment
    const currentAssessment = getCurrentMaturityAssessment();
    setMaturityData(convertStoredDataToRadarData(currentAssessment));

    // Load IBGC historical data
    const ibgcHistory = mockHistoricalAssessments;
    const formattedHistory = ibgcHistory.map(assessment => ({
      id: assessment.id,
      date: assessment.period,
      overall: assessment.result.pontuacao_total * 5,
      // Convert to 0-5 scale
      details: Object.entries(assessment.result.pontuacao_dimensoes).map(([name, score]) => ({
        name,
        score: score * 5
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
      details: `Pontuação geral: ${(assessment.result.pontuacao_total * 100).toFixed(0)}% | Estágio: ${assessment.result.estagio}`
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
        <Header title="Maturidade" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-legacy-500">Maturidade em Governança
              </h2>
                  <Button onClick={() => navigate("/data-input")}>Nova Avaliação</Button>
                </div>
                <div className="h-96 mb-4">
                  {maturityData && maturityData.length > 0 ? <MaturityRadarChart data={maturityData} /> : <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p>Carregando dados de maturidade...</p>
                        <p className="text-sm mt-1">Aguarde enquanto processamos as informações</p>
                      </div>
                    </div>}
                </div>
                <div className="flex justify-center gap-6 text-sm text-gray-600 mb-6">
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
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        {item.name}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`text-xl font-semibold text-legacy-purple-500`}>
                          {item.score}
                        </div>
                        <Badge className={`${maturity.color} hover:${maturity.color}`}>
                          {maturity.level}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Setor: {item.sectorAverage} | Gap: {item.score - item.sectorAverage > 0 ? '+' : ''}{(item.score - item.sectorAverage).toFixed(1)}
                      </div>
                    </div>;
              })}
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button onClick={() => navigate("/maturity-quiz")} className="bg-legacy-500 hover:bg-legacy-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Iniciar Nova Avaliação
                </Button>
                <Button variant="outline" onClick={() => setShowHistoricalData(!showHistoricalData)}>
                  {showHistoricalData ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                  {showHistoricalData ? 'Ocultar Histórico' : 'Ver Histórico'}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Timeline de Maturidade */}
          <MaturityTimeline data={timelineData} />

          {/* Indicador Global */}
          <div className="mb-6">
            <MaturityGlobalIndicator data={maturityData} />
          </div>

          {/* Ranking Setorial */}
          <div className="mb-6">
            <SectorRanking currentCompanyScore={maturityData.reduce((acc, item) => acc + item.score, 0) / maturityData.length} sector="Tecnologia" />
          </div>

          {/* Painel de Insights */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Insights Estratégicos
                </h2>
              </div>
              <MaturityInsights data={maturityData} />
            </CardContent>
          </Card>
          
          {/* Historical Data Section - Expandable */}
          {showHistoricalData && <>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-legacy-500">
                      Atividades Recentes
                    </h2>
                  </div>
                  
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
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-legacy-500">
                      Histórico de Avaliações
                    </h2>
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
                            <TableCell className="font-medium">{(assessment.overall * 20).toFixed(0)}%</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {assessment.stage}
                              </Badge>
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
          </>}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Avaliação de Maturidade - {selectedAssessment?.date}</DialogTitle>
            <DialogDescription>
              Detalhes da avaliação de maturidade para o período {selectedAssessment?.date}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && <div className="py-4">
              <div className="mb-4">
                <div className="text-lg font-medium flex items-center">
                  Pontuação Geral: 
                  <span className="text-legacy-purple-600 ml-2">{selectedAssessment.overall.toFixed(1)}</span>
                  <Badge className={`ml-2 ${getMaturityLevel(selectedAssessment.overall).color}`}>
                    {getMaturityLevel(selectedAssessment.overall).level}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedAssessment.details.map((detail: any) => {
              const maturity = getMaturityLevel(detail.score);
              return <div key={detail.name} className="border rounded-md p-3">
                      <div className="text-sm font-medium text-gray-500">{detail.name}</div>
                      <div className="flex items-center mt-1">
                        <div className="text-lg font-medium text-legacy-purple-500 mr-2">
                          {detail.score.toFixed(1)}
                        </div>
                        <Badge className={`${maturity.color} hover:${maturity.color}`}>
                          {maturity.level}
                        </Badge>
                      </div>
                    </div>;
            })}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Comentários da Avaliação</h4>
                <p className="text-sm text-gray-600 border rounded-md p-3 bg-gray-50">
                  {selectedAssessment.id === 1 ? "Houve progresso significativo na estrutura formal e participação familiar. O processo sucessório ainda precisa ser melhor definido." : "Avaliação referente ao período indicado. Verificar áreas com pontuações mais baixas para desenvolvimento de ações de melhoria."}
                </p>
              </div>
              
              {/* Add activity information to the dialog */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Informações de Atividade</h4>
                {activityLogs.find(log => log.details?.includes(selectedAssessment.overall.toFixed(1))) ? <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      Atualizado por {activityLogs.find(log => log.details?.includes(selectedAssessment.overall.toFixed(1)))?.user}
                    </span>
                  </div> : <p className="text-sm text-gray-600">Informações de atividade não disponíveis</p>}
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default Maturity;