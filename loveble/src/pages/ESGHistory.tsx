import React, { useState, useEffect } from "react";
import { ArrowLeft, Leaf, Download, Trash2, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { loadESGAssessmentHistory } from "@/utils/esgMaturityCalculator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ESGHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const assessmentHistory = loadESGAssessmentHistory();
    setHistory(assessmentHistory);
    if (assessmentHistory.length > 0) {
      setSelectedAssessment(assessmentHistory[0]);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaturityLevelInfo = (score: number) => {
    if (score >= 80) return { name: "Excelente", color: "bg-green-100 text-green-800" };
    if (score >= 70) return { name: "Muito Bom", color: "bg-blue-100 text-blue-800" };
    if (score >= 60) return { name: "Bom", color: "bg-yellow-100 text-yellow-800" };
    if (score >= 40) return { name: "Regular", color: "bg-orange-100 text-orange-800" };
    return { name: "Básico", color: "bg-red-100 text-red-800" };
  };

  const getPillarScores = (result: any) => {
    if (!result?.pillarScores) return [];
    
    return Object.entries(result.pillarScores).map(([key, pillar]: [string, any]) => ({
      name: pillar.title,
      score: pillar.percentage
    }));
  };

  const getEvolutionData = () => {
    return history.slice().reverse().map((assessment, index) => ({
      date: new Date(assessment.timestamp).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      score: assessment.result.overallScore,
      environmental: assessment.result.pillarScores.environmental.percentage,
      social: assessment.result.pillarScores.social.percentage,
      governance: assessment.result.pillarScores.governance.percentage,
      strategy: assessment.result.pillarScores.strategy.percentage
    }));
  };

  const deleteAssessment = (id: string) => {
    const updatedHistory = history.filter(assessment => assessment.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('esgAssessmentHistory', JSON.stringify(updatedHistory));
    
    if (selectedAssessment?.id === id && updatedHistory.length > 0) {
      setSelectedAssessment(updatedHistory[0]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
                <div className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <h1 className="text-2xl font-bold text-foreground">Histórico ESG</h1>
                </div>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhuma avaliação encontrada
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Você ainda não possui avaliações de maturidade ESG registradas.
                  </p>
                  <Button
                    onClick={() => navigate("/esg?tab=new-assessment")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Iniciar Nova Avaliação
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-foreground">Histórico de Maturidade ESG</h1>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {history.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Avaliações Realizadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {history[0]?.result?.overallScore?.toFixed(0) || '0'}%
                  </div>
                  <p className="text-sm text-muted-foreground">Pontuação Atual</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-green-600">
                      {history.length > 1 ? 
                        ((history[0]?.result?.overallScore - history[1]?.result?.overallScore) || 0).toFixed(0) 
                        : '0'
                      }%
                    </div>
                    {history.length > 1 && getTrendIcon(
                      history[0]?.result?.overallScore || 0,
                      history[1]?.result?.overallScore || 0
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Evolução</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {getMaturityLevelInfo(history[0]?.result?.overallScore || 0).name}
                  </div>
                  <p className="text-sm text-muted-foreground">Nível Atual</p>
                </CardContent>
              </Card>
            </div>

            {/* Evolution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Pontuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getEvolutionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        name="Pontuação Geral"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="environmental" 
                        stroke="#059669" 
                        strokeWidth={2}
                        name="Ambiental"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="social" 
                        stroke="#0891b2" 
                        strokeWidth={2}
                        name="Social"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="governance" 
                        stroke="#7c3aed" 
                        strokeWidth={2}
                        name="Governança"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="strategy" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        name="Estratégia"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Selected Assessment Pillar Chart */}
            {selectedAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Detalhes da Avaliação - {formatDate(selectedAssessment.timestamp)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getPillarScores(selectedAssessment.result)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="score" fill="#16a34a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((assessment, index) => {
                    const previousAssessment = history[index + 1];
                    const maturityInfo = getMaturityLevelInfo(assessment.result.overallScore);
                    const pillarScores = getPillarScores(assessment.result);
                    
                    return (
                      <Card 
                        key={assessment.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedAssessment?.id === assessment.id ? 'ring-2 ring-green-500' : ''
                        }`}
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-lg">
                                  {formatDate(assessment.timestamp)}
                                </span>
                                <Badge className={maturityInfo.color}>
                                  {maturityInfo.name}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-600">
                                  {assessment.result.overallScore.toFixed(0)}%
                                </span>
                                {previousAssessment && (
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(
                                      assessment.result.overallScore,
                                      previousAssessment.result.overallScore
                                    )}
                                    <span className={`text-sm ${
                                      assessment.result.overallScore > previousAssessment.result.overallScore
                                        ? 'text-green-600'
                                        : assessment.result.overallScore < previousAssessment.result.overallScore
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                    }`}>
                                      {assessment.result.overallScore > previousAssessment.result.overallScore
                                        ? `+${(assessment.result.overallScore - previousAssessment.result.overallScore).toFixed(0)}%`
                                        : assessment.result.overallScore < previousAssessment.result.overallScore
                                        ? `${(assessment.result.overallScore - previousAssessment.result.overallScore).toFixed(0)}%`
                                        : '0%'
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAssessment(assessment);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAssessment(assessment.id);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Pillar Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {pillarScores.map((pillar, pillarIndex) => {
                              const previousPillarScore = previousAssessment?.result?.pillarScores?.[
                                Object.keys(assessment.result.pillarScores)[pillarIndex]
                              ]?.percentage;
                              
                              return (
                                <div key={pillarIndex} className="text-center p-2 bg-gray-50 rounded">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-sm font-semibold">
                                      {pillar.score.toFixed(0)}%
                                    </span>
                                    {previousPillarScore && (
                                      getTrendIcon(pillar.score, previousPillarScore)
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {pillar.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate("/esg?tab=new-assessment")}
                className="bg-green-600 hover:bg-green-700"
              >
                Nova Avaliação ESG
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ESGHistory;