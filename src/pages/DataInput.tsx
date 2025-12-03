import React from "react";
import { BarChart3, TrendingUp, FileText, Calendar, Eye } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockHistoricalAssessments, getHistoricalTrend } from "@/data/mockHistoricalData";
import ExecutiveReport from "@/components/ExecutiveReport";
const DataInput = () => {
  const handleGovernanceStart = () => {
    window.location.href = '/maturity-quiz';
  };
  const getMaturityBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'básico':
        return 'destructive';
      case 'sólido':
        return 'secondary';
      case 'avançado':
        return 'default';
      default:
        return 'outline';
    }
  };
  const historicalTrend = getHistoricalTrend();
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Maturidade de Governança" />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Maturidade de Governança Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  
                </div>
                <h2 className="text-2xl font-semibold text-legacy-500 mb-4">
                  Avaliação de Maturidade de Governança
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Avalie a maturidade da governança corporativa da sua organização com base em diretrizes de boas práticas de governança corporativa. </p>
                <Button onClick={handleGovernanceStart} size="lg" className="w-full md:w-auto px-8">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Iniciar Avaliação de Governança
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Maturity Evolution Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Evolução da Maturidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" fontSize={12} />
                  <YAxis domain={[0, 5]} fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 4
                }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Historical Reports Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Relatórios Históricos de Maturidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHistoricalAssessments.map(assessment => <Card key={assessment.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {assessment.analystInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-foreground">{assessment.period}</h3>
                              <Badge variant={getMaturityBadgeColor(assessment.result.estagio)}>
                                {assessment.result.estagio}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Analista: {assessment.analyst}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {assessment.date.toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {assessment.result.pontuacao_total.toFixed(1)}/5.0
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Relatório
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Relatório Executivo - {assessment.period}</DialogTitle>
                            </DialogHeader>
                            <ExecutiveReport assessment={assessment} isLatest={assessment.id === mockHistoricalAssessments[mockHistoricalAssessments.length - 1].id} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>;
};
export default DataInput;