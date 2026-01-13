/**
 * Dashboard Admin: Funil PLG (Product-Led Growth)
 * 
 * Visualização de métricas do funil de conversão:
 * ISCA → Descoberta → Contratação → Ativação
 */

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Target, 
  ArrowRight, RefreshCw, Download, Filter, Clock,
  Zap, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell
} from 'recharts';
import { 
  getMockPLGMetrics, 
  PLGMetrics, 
  FUNNEL_STAGE_LABELS, 
  FUNNEL_STAGE_COLORS 
} from '@/services/plgService';

// Cores do funil
const FUNNEL_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'
];

export default function AdminPLGFunnel() {
  const [metrics, setMetrics] = useState<PLGMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadMetrics();
  }, [period]);

  const loadMetrics = async () => {
    setLoading(true);
    // Por enquanto usando mock, depois trocar por API real
    setTimeout(() => {
      setMetrics(getMockPLGMetrics());
      setLoading(false);
    }, 500);
  };

  if (loading || !metrics) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Funil PLG" />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Preparar dados do funil para o gráfico
  const funnelData = metrics.funnelStages.map((stage, index) => ({
    name: FUNNEL_STAGE_LABELS[stage.stage] || stage.stage,
    value: stage.count,
    fill: FUNNEL_COLORS[index % FUNNEL_COLORS.length]
  }));

  // Preparar dados de conversão
  const conversionData = metrics.conversionRates.map(rate => ({
    name: `${FUNNEL_STAGE_LABELS[rate.fromStage]?.split(' ')[0] || rate.fromStage} → ${FUNNEL_STAGE_LABELS[rate.toStage]?.split(' ')[0] || rate.toStage}`,
    rate: rate.rate
  }));

  // Preparar dados diários para gráfico de área
  const dailyData = metrics.dailyMetrics.map(day => ({
    date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    'ISCA Iniciada': day.iscaStarted,
    'ISCA Completa': day.iscaCompleted,
    'Descoberta': day.discoveryCompleted,
    'Checkout': day.checkoutCompleted,
    'Pagamento': day.paymentCompleted,
    'Ativação': day.activationCompleted,
  }));

  // Preparar dados de distribuição de planos
  const planData = Object.entries(metrics.planDistribution).map(([plan, count]) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: count
  }));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Funil PLG" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header com filtros */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Funil PLG</h1>
              <p className="text-muted-foreground">
                Acompanhe a jornada do lead: ISCA → Descoberta → Contratação → Ativação
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={loadMetrics}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Leads</p>
                    <p className="text-3xl font-bold">{metrics.summary.totalLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+12%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads Convertidos</p>
                    <p className="text-3xl font-bold">{metrics.summary.convertedLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+8%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                    <p className="text-3xl font-bold">{metrics.summary.overallConversionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+2.3%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Score Médio ISCA</p>
                    <p className="text-3xl font-bold">{metrics.summary.avgGovMetrixScore || '-'}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500">-3</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de conteúdo */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="funnel">Funil Detalhado</TabsTrigger>
              <TabsTrigger value="leads">Leads Recentes</TabsTrigger>
              <TabsTrigger value="plans">Distribuição de Planos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Gráfico de área - Volume por dia */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume de Leads por Dia</CardTitle>
                  <CardDescription>Evolução do funil ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="ISCA Iniciada" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="ISCA Completa" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Descoberta" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Checkout" stackId="1" stroke="#d946ef" fill="#d946ef" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Pagamento" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Ativação" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de barras - Taxas de conversão */}
              <Card>
                <CardHeader>
                  <CardTitle>Taxas de Conversão por Etapa</CardTitle>
                  <CardDescription>Percentual de leads que avançam entre etapas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={conversionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="rate" fill="#8b5cf6">
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rate >= 70 ? '#22c55e' : entry.rate >= 50 ? '#eab308' : '#f43f5e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-6">
              {/* Funil visual */}
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Conversão PLG</CardTitle>
                  <CardDescription>ISCA → Descoberta → Contratação → Ativação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.funnelStages.map((stage, index) => {
                      const prevCount = index > 0 ? metrics.funnelStages[index - 1].count : stage.count;
                      const conversionRate = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : 100;
                      const widthPercent = metrics.funnelStages[0].count > 0 
                        ? (stage.count / metrics.funnelStages[0].count) * 100 
                        : 0;

                      return (
                        <div key={stage.stage} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: FUNNEL_COLORS[index], color: FUNNEL_COLORS[index] }}
                              >
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{FUNNEL_STAGE_LABELS[stage.stage]}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold">{stage.count} leads</span>
                              {index > 0 && (
                                <Badge variant={conversionRate >= 70 ? "default" : conversionRate >= 50 ? "secondary" : "destructive"}>
                                  {conversionRate}% conversão
                                </Badge>
                              )}
                              {stage.avgScore && (
                                <span className="text-muted-foreground text-xs">
                                  Score médio: {stage.avgScore}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-8 bg-muted rounded-lg overflow-hidden">
                            <div 
                              className="h-full rounded-lg transition-all duration-500"
                              style={{ 
                                width: `${widthPercent}%`,
                                backgroundColor: FUNNEL_COLORS[index]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Drop-off Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Abandono</CardTitle>
                  <CardDescription>Onde os leads estão abandonando o funil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.conversionRates.map((rate, index) => {
                      const dropOff = 100 - rate.rate;
                      const isHighDropOff = dropOff > 30;
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {FUNNEL_STAGE_LABELS[rate.fromStage]} → {FUNNEL_STAGE_LABELS[rate.toStage]}
                              </span>
                              {isHighDropOff && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <Progress value={dropOff} className="mt-2 h-2" />
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${isHighDropOff ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {dropOff.toFixed(0)}%
                            </p>
                            <p className="text-xs text-muted-foreground">abandonam</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              {/* Leads recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Leads Recentes</CardTitle>
                  <CardDescription>Últimos leads que entraram no funil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentLeads.map((lead) => {
                      const stageIndex = metrics.funnelStages.findIndex(s => s.stage === lead.funnel_stage);
                      const isConverted = lead.funnel_stage === 'activation_completed';
                      
                      return (
                        <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.company}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {lead.govmetrix_score && (
                              <div className="text-center">
                                <p className="text-sm font-medium">{lead.govmetrix_score}</p>
                                <p className="text-xs text-muted-foreground">Score</p>
                              </div>
                            )}
                            
                            <Badge 
                              variant={isConverted ? "default" : "outline"}
                              style={{ 
                                borderColor: FUNNEL_COLORS[stageIndex],
                                color: isConverted ? undefined : FUNNEL_COLORS[stageIndex],
                                backgroundColor: isConverted ? '#22c55e' : undefined
                              }}
                            >
                              {FUNNEL_STAGE_LABELS[lead.funnel_stage]}
                            </Badge>
                            
                            <div className="text-right text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(lead.created_at).toLocaleString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              {/* Distribuição de planos */}
              <Card>
                <CardHeader>
                  <CardTitle>Planos Recomendados</CardTitle>
                  <CardDescription>Distribuição de planos recomendados pelo quiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={planData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6">
                          {planData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cards por plano */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {planData.map((plan, index) => (
                  <Card key={plan.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{plan.name}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }}
                        />
                      </div>
                      <p className="text-2xl font-bold">{plan.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {((plan.value / metrics.summary.totalLeads) * 100).toFixed(1)}% do total
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
