import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const PERFORMANCE_DATA = {
  monthlyMetrics: {
    clientsServed: 3,
    assessmentsCompleted: 2,
    reportsGenerated: 5,
    meetingsHeld: 8,
    revenue: 45000,
    growth: 15
  },
  yearlyGoals: {
    newClients: { target: 12, current: 3, percentage: 25 },
    assessments: { target: 24, current: 8, percentage: 33 },
    revenue: { target: 200000, current: 65000, percentage: 32.5 },
    satisfaction: { target: 90, current: 88, percentage: 97.8 }
  },
  clientSatisfaction: [
    { client: 'TechCorp Soluções', rating: 9.2, feedback: 'Excelente trabalho na análise' },
    { client: 'InvestPro Capital', rating: 8.8, feedback: 'Muito profissional' },
    { client: 'MedLife Hospitais', rating: 9.0, feedback: 'Resultados claros e precisos' }
  ],
  recentAchievements: [
    { title: 'Meta de Clientes Q1', description: 'Alcançou 120% da meta de novos clientes', date: '2024-02-01', type: 'milestone' },
    { title: 'Certificação IBGC', description: 'Renovação da certificação concluída', date: '2024-01-15', type: 'certification' },
    { title: 'Feedback Excelente', description: 'Cliente TechCorp deu nota 9.5/10', date: '2024-01-30', type: 'feedback' }
  ]
};

export const ParceiroPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="h-4 w-4" />;
      case 'certification': return <Award className="h-4 w-4" />;
      case 'feedback': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance e Métricas</h1>
            <p className="text-muted-foreground">
              Acompanhe seu desempenho e evolução como parceiro
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              Este Mês
            </Button>
            <Button
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('year')}
            >
              Este Ano
            </Button>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{PERFORMANCE_DATA.monthlyMetrics.clientsServed}</div>
              <p className="text-xs text-muted-foreground">neste mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Concluídos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{PERFORMANCE_DATA.monthlyMetrics.assessmentsCompleted}</div>
              <p className="text-xs text-muted-foreground">+1 vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{PERFORMANCE_DATA.monthlyMetrics.reportsGenerated}</div>
              <p className="text-xs text-muted-foreground">+25% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(PERFORMANCE_DATA.monthlyMetrics.revenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{PERFORMANCE_DATA.monthlyMetrics.growth}% crescimento
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yearly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas Anuais 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(PERFORMANCE_DATA.yearlyGoals).map(([key, goal]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium capitalize">
                        {key === 'newClients' ? 'Novos Clientes' :
                         key === 'assessments' ? 'Assessments' :
                         key === 'revenue' ? 'Receita Anual' :
                         'Satisfação do Cliente'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {goal.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={goal.percentage} 
                      className="h-2 mb-2" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Atual: {key === 'revenue' ? formatCurrency(goal.current) : 
                               key === 'satisfaction' ? `${goal.current}%` : goal.current}
                      </span>
                      <span>
                        Meta: {key === 'revenue' ? formatCurrency(goal.target) : 
                              key === 'satisfaction' ? `${goal.target}%` : goal.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Satisfaction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Satisfação dos Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PERFORMANCE_DATA.clientSatisfaction.map((client, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{client.client}</h4>
                      <Badge variant="secondary" className="ml-2">
                        {client.rating}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.feedback}</p>
                    <Progress value={client.rating * 10} className="mt-2 h-1" />
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">8.9/10</div>
                  <p className="text-sm text-muted-foreground">Avaliação média geral</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PERFORMANCE_DATA.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(achievement.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {achievement.type === 'milestone' ? 'Meta' :
                     achievement.type === 'certification' ? 'Certificação' : 'Feedback'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};