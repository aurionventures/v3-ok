import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  ArrowUpRight, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Zap,
  AlertCircle,
  Clock,
  CheckCircle,
  PauseCircle,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";

// Dados mock para MRR
const mrrData = [
  { month: "Jul", mrr: 45200 },
  { month: "Ago", mrr: 48900 },
  { month: "Set", mrr: 52100 },
  { month: "Out", mrr: 58400 },
  { month: "Nov", mrr: 62800 },
  { month: "Dez", mrr: 68500 },
];

// Distribuição por estágio de governança
const companiesByStage = [
  { name: "Foundation", value: 4, color: "hsl(var(--chart-1))" },
  { name: "Structured", value: 6, color: "hsl(var(--chart-2))" },
  { name: "Institutional", value: 3, color: "hsl(var(--chart-3))" },
  { name: "Listed", value: 2, color: "hsl(var(--chart-4))" },
];

// Distribuição por porte
const companiesBySize = [
  { name: "Startup", value: 3, color: "hsl(var(--chart-1))" },
  { name: "Pequena", value: 4, color: "hsl(var(--chart-2))" },
  { name: "Média", value: 5, color: "hsl(var(--chart-3))" },
  { name: "Grande", value: 2, color: "hsl(var(--chart-4))" },
  { name: "Listada", value: 1, color: "hsl(var(--chart-5))" },
];

// Ativações recentes
const recentActivations = [
  { id: 1, company: "TechCorp Brasil", plan: "Professional", origin: "Landing", date: "2024-12-19", mrr: 4990 },
  { id: 2, company: "Indústria Alfa", plan: "Enterprise", origin: "Venda Direta", date: "2024-12-18", mrr: 9990 },
  { id: 3, company: "StartupX", plan: "Starter", origin: "Parceiro", date: "2024-12-17", mrr: 1990 },
  { id: 4, company: "Grupo Omega", plan: "Enterprise", origin: "Landing", date: "2024-12-15", mrr: 9990 },
];

// Métricas de conversão
const conversionData = [
  { stage: "Visitas Landing", value: 1240 },
  { stage: "Quiz Iniciado", value: 480 },
  { stage: "Quiz Completo", value: 320 },
  { stage: "Trial Iniciado", value: 85 },
  { stage: "Convertido", value: 42 },
];

const Admin = () => {
  const navigate = useNavigate();
  
  // Métricas principais
  const metrics = {
    mrr: 68500,
    mrrGrowth: 9.1,
    activeCompanies: 15,
    newCompaniesThisMonth: 4,
    trialCompanies: 6,
    suspendedCompanies: 2,
    pendingActivations: 3,
    churnRate: 2.1,
    avgTicket: 4567,
    conversionRate: 3.4
  };

  const getOriginBadge = (origin: string) => {
    switch (origin) {
      case 'Landing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Landing</Badge>;
      case 'Venda Direta':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Venda Direta</Badge>;
      case 'Parceiro':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Parceiro</Badge>;
      default:
        return <Badge variant="outline">{origin}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Super Admin" />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header com ações rápidas */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
              <p className="text-muted-foreground">Visão estratégica da plataforma Legacy</p>
            </div>
            <Button onClick={() => navigate("/admin/empresas")} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Empresa
            </Button>
          </div>

          {/* Métricas principais - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  MRR (Receita Recorrente)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {metrics.mrr.toLocaleString('pt-BR')}</div>
                <div className="flex items-center gap-1 text-sm text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{metrics.mrrGrowth}% vs. mês anterior
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeCompanies}</div>
                <div className="flex items-center gap-1 text-sm text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{metrics.newCompaniesThisMonth} este mês
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Taxa de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  Ticket médio: R$ {metrics.avgTicket.toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos - MRR e Distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Gráfico de MRR */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução do MRR</CardTitle>
                <CardDescription>Receita recorrente mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'MRR']}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} 
                    />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" fill="url(#mrrGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição por porte */}
            <Card>
              <CardHeader>
                <CardTitle>Empresas por Porte</CardTitle>
                <CardDescription>Distribuição atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companiesBySize}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {companiesBySize.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} empresas`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {companiesBySize.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ativações Recentes e Status das Empresas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ativações recentes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ativações Recentes</CardTitle>
                    <CardDescription>Últimas 7 dias</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/admin/vendas")} className="gap-1">
                    Ver todas
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivations.map((activation) => (
                    <div key={activation.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="space-y-1">
                        <div className="font-medium">{activation.company}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{activation.plan}</span>
                          {getOriginBadge(activation.origin)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">R$ {activation.mrr.toLocaleString('pt-BR')}/mês</div>
                        <div className="text-xs text-muted-foreground">{new Date(activation.date).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cards de status */}
            <div className="space-y-4">
              {/* Status das empresas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Status das Empresas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Ativas</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">{metrics.activeCompanies}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Pendentes</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">{metrics.pendingActivations}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PauseCircle className="h-4 w-4 text-red-500" />
                      <span>Suspensas</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400">{metrics.suspendedCompanies}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Indicadores de saúde */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Indicadores de Saúde</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Churn Rate</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="font-medium">{metrics.churnRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxa de Conversão</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="font-medium">{metrics.conversionRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ticket Médio</span>
                    <span className="font-medium">R$ {metrics.avgTicket.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LTV Estimado</span>
                    <span className="font-medium">R$ {(metrics.avgTicket * 24).toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
