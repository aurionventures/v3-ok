import React, { useState, useEffect } from "react";
import { ArrowLeft, Building2, Download, Trash2, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { getMaturityHistory, StoredMaturityAssessment } from "@/utils/maturityStorage";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { MaturityDimension } from "@/types/maturity";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IGBCHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<StoredMaturityAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<StoredMaturityAssessment | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const assessmentHistory = getMaturityHistory();
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
    if (score >= 4.5) return { name: "Excelente", color: "bg-green-100 text-green-800" };
    if (score >= 4.0) return { name: "Muito Bom", color: "bg-blue-100 text-blue-800" };
    if (score >= 3.0) return { name: "Bom", color: "bg-yellow-100 text-yellow-800" };
    if (score >= 2.0) return { name: "Regular", color: "bg-orange-100 text-orange-800" };
    return { name: "Básico", color: "bg-red-100 text-red-800" };
  };

  const getMainDimensions = (result: any) => {
    if (!result?.pontuacao_dimensoes) return [];
    
    return Object.entries(result.pontuacao_dimensoes)
      .map(([key, value]: [string, any]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: Number(value.toFixed(1))
      }))
      .slice(0, 4);
  };

  const convertToRadarData = (assessment: StoredMaturityAssessment): MaturityDimension[] => {
    if (!assessment?.result?.pontuacao_dimensoes) return [];
    
    return Object.entries(assessment.result.pontuacao_dimensoes).map(([key, value]: [string, any]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Number(value),
      sectorAverage: Number(value) * 0.8, // Mock sector average
      fullMark: 5
    }));
  };

  const getEvolutionData = () => {
    return history.slice().reverse().map((assessment, index) => ({
      date: new Date(assessment.timestamp).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      score: assessment.result.pontuacao_total
    }));
  };

  const deleteAssessment = (id: string) => {
    const updatedHistory = history.filter(assessment => assessment.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('maturityAssessmentHistory', JSON.stringify(updatedHistory));
    
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
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-foreground">Histórico IGBC</h1>
                </div>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhuma avaliação encontrada
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Você ainda não possui avaliações de maturidade IGBC registradas.
                  </p>
                  <Button
                    onClick={() => navigate("/maturity")}
                    className="bg-blue-600 hover:bg-blue-700"
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
                <Building2 className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-foreground">Histórico de Maturidade IGBC</h1>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {history.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Avaliações Realizadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {history[0]?.result?.pontuacao_total?.toFixed(1) || '0.0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Pontuação Atual</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {history.length > 1 ? 
                        ((history[0]?.result?.pontuacao_total - history[1]?.result?.pontuacao_total) || 0).toFixed(1) 
                        : '0.0'
                      }
                    </div>
                    {history.length > 1 && getTrendIcon(
                      history[0]?.result?.pontuacao_total || 0,
                      history[1]?.result?.pontuacao_total || 0
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Evolução</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {getMaturityLevelInfo(history[0]?.result?.pontuacao_total || 0).name}
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
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        name="Pontuação IGBC"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Selected Assessment Radar Chart */}
            {selectedAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Detalhes da Avaliação - {formatDate(selectedAssessment.timestamp)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MaturityRadarChart data={convertToRadarData(selectedAssessment)} />
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
                    const maturityInfo = getMaturityLevelInfo(assessment.result.pontuacao_total);
                    const mainDimensions = getMainDimensions(assessment.result);
                    
                    return (
                      <Card 
                        key={assessment.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedAssessment?.id === assessment.id ? 'ring-2 ring-blue-500' : ''
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
                                <span className="text-2xl font-bold text-blue-600">
                                  {assessment.result.pontuacao_total.toFixed(1)}/5.0
                                </span>
                                {previousAssessment && (
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(
                                      assessment.result.pontuacao_total,
                                      previousAssessment.result.pontuacao_total
                                    )}
                                    <span className={`text-sm ${
                                      assessment.result.pontuacao_total > previousAssessment.result.pontuacao_total
                                        ? 'text-green-600'
                                        : assessment.result.pontuacao_total < previousAssessment.result.pontuacao_total
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                    }`}>
                                      {assessment.result.pontuacao_total > previousAssessment.result.pontuacao_total
                                        ? `+${(assessment.result.pontuacao_total - previousAssessment.result.pontuacao_total).toFixed(1)}`
                                        : assessment.result.pontuacao_total < previousAssessment.result.pontuacao_total
                                        ? `${(assessment.result.pontuacao_total - previousAssessment.result.pontuacao_total).toFixed(1)}`
                                        : '0.0'
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
                          
                          {/* Top Dimensions */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {mainDimensions.map((dimension, dimIndex) => {
                              const previousDimScore = previousAssessment?.result?.pontuacao_dimensoes?.[
                                Object.keys(assessment.result.pontuacao_dimensoes || {})[dimIndex]
                              ];
                              
                              return (
                                <div key={dimIndex} className="text-center p-2 bg-gray-50 rounded">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-sm font-semibold">
                                      {dimension.score}
                                    </span>
                                    {previousDimScore && (
                                      getTrendIcon(dimension.score, previousDimScore)
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {dimension.name}
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
                onClick={() => navigate("/maturity")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Nova Avaliação IGBC
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IGBCHistory;