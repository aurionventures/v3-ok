import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Award, Building2, TrendingUp, AlertTriangle, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const PeopleGovernancePage = () => {
  const navigate = useNavigate();

  // Mock data para demonstração
  const stats = {
    heirs: { total: 4, ready: 1, percentage: 25 },
    keyPositions: { total: 8, ready: 5, percentage: 63 },
    boardMembers: { total: 6, ready: 4, percentage: 67 }
  };

  const alerts = [
    { type: 'critical', message: 'Nenhum sucessor habilitado para CEO', priority: 'high' },
    { type: 'warning', message: 'Conselho sem diversidade técnica adequada', priority: 'medium' },
    { type: 'info', message: '3 herdeiros necessitam de experiência externa', priority: 'low' }
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 70) return <Badge className="bg-green-500">Saudável</Badge>;
    if (percentage >= 40) return <Badge className="bg-yellow-500">Atenção</Badge>;
    return <Badge variant="destructive">Crítico</Badge>;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Pessoas & Governança" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Users className="h-10 w-10" />
                Gestão de Talentos para Governança
              </h1>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                Visão integrada da prontidão de herdeiros, capacitação de cargos-chave e 
                adequação de conselheiros baseada em critérios do IBGC.
              </p>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-500" />
                    Herdeiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Prontidão para Sucessão</span>
                      {getStatusBadge(stats.heirs.percentage)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Habilitados</span>
                        <span className={getStatusColor(stats.heirs.percentage)}>
                          {stats.heirs.ready}/{stats.heirs.total}
                        </span>
                      </div>
                      <Progress value={stats.heirs.percentage} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/people-governance/heirs')}
                    >
                      Gerenciar Herdeiros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-green-500" />
                    Cargos-Chave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Habilitação para Gestão</span>
                      {getStatusBadge(stats.keyPositions.percentage)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prontos</span>
                        <span className={getStatusColor(stats.keyPositions.percentage)}>
                          {stats.keyPositions.ready}/{stats.keyPositions.total}
                        </span>
                      </div>
                      <Progress value={stats.keyPositions.percentage} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/people-governance/key-positions')}
                    >
                      Gerenciar Cargos-Chave
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-purple-500" />
                    Conselheiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aderência Técnica</span>
                      {getStatusBadge(stats.boardMembers.percentage)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Elegíveis</span>
                        <span className={getStatusColor(stats.boardMembers.percentage)}>
                          {stats.boardMembers.ready}/{stats.boardMembers.total}
                        </span>
                      </div>
                      <Progress value={stats.boardMembers.percentage} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/people-governance/board-members')}
                    >
                      Gerenciar Conselheiros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Alerts */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Alertas de Risco em Governança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                      </div>
                      <Badge 
                        variant={alert.priority === 'high' ? 'destructive' : 
                                alert.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {alert.priority === 'high' ? 'Urgente' : 
                         alert.priority === 'medium' ? 'Importante' : 'Baixa'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-20 flex flex-col gap-2"
                onClick={() => navigate('/people-governance/heirs')}
              >
                <Plus className="h-5 w-5" />
                <span>Cadastrar Herdeiro</span>
              </Button>
              <Button 
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => navigate('/people-governance/key-positions')}
              >
                <Plus className="h-5 w-5" />
                <span>Avaliar Cargo-Chave</span>
              </Button>
              <Button 
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => navigate('/people-governance/board-members')}
              >
                <Plus className="h-5 w-5" />
                <span>Incluir Conselheiro</span>
              </Button>
            </div>

            {/* Summary Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análise Consolidada de Governança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Pontos Fortes</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Pipeline de cargos-chave bem estruturado
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Conselho com experiência adequada
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Processo de avaliação sistemático implementado
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Oportunidades de Melhoria</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Acelerar desenvolvimento de herdeiros
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Diversificar competências do conselho
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        Definir sucessor imediato para CEO
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation to Legacy Pages */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Acesso Rápido aos Módulos Anteriores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/succession')}
                  >
                    Sucessão (Legacy)
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/people-development')}
                  >
                    Desenvolvimento de Pessoas (Legacy)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PeopleGovernancePage;