import { useState, useMemo } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Zap,
  Users,
  Building2,
  BarChart3,
  Calendar,
  AlertTriangle,
  Settings,
  Download,
  RefreshCw,
  ChevronDown,
  Bot,
  Brain,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface TokenUsage {
  date: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

interface AgentUsage {
  agentId: string;
  agentName: string;
  category: string;
  totalTokens: number;
  totalCost: number;
  executions: number;
  avgLatency: number;
  successRate: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

interface ClientUsage {
  clientId: string;
  clientName: string;
  plan: string;
  totalTokens: number;
  totalCost: number;
  executions: number;
  lastActivity: string;
  monthlyLimit: number;
  usagePercent: number;
}

interface ModelUsage {
  model: string;
  provider: string;
  totalTokens: number;
  totalCost: number;
  executions: number;
  avgLatency: number;
}

// ============================================================================
// DADOS MOCK
// ============================================================================

const mockDailyUsage: TokenUsage[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseTokens = 50000 + Math.random() * 100000;
  return {
    date: date.toISOString().split('T')[0],
    promptTokens: Math.floor(baseTokens * 0.6),
    completionTokens: Math.floor(baseTokens * 0.4),
    totalTokens: Math.floor(baseTokens),
    cost: baseTokens * 0.000002,
  };
});

const mockAgentUsage: AgentUsage[] = [
  {
    agentId: 'a1-collector',
    agentName: 'Agent A - Collector',
    category: 'MOAT Engine',
    totalTokens: 2456000,
    totalCost: 4.91,
    executions: 487,
    avgLatency: 1823,
    successRate: 97.2,
    trend: 'up',
    trendPercent: 12.5,
  },
  {
    agentId: 'a2-classifier',
    agentName: 'Agent A - Classifier',
    category: 'MOAT Engine',
    totalTokens: 1890000,
    totalCost: 3.78,
    executions: 423,
    avgLatency: 1456,
    successRate: 98.5,
    trend: 'stable',
    trendPercent: 2.1,
  },
  {
    agentId: 'b1-analyzer',
    agentName: 'Agent B - Analyzer',
    category: 'MOAT Engine',
    totalTokens: 3245000,
    totalCost: 6.49,
    executions: 312,
    avgLatency: 2456,
    successRate: 95.4,
    trend: 'up',
    trendPercent: 18.3,
  },
  {
    agentId: 'b2-pattern',
    agentName: 'Agent B - Pattern Detector',
    category: 'MOAT Engine',
    totalTokens: 2890000,
    totalCost: 5.78,
    executions: 278,
    avgLatency: 2134,
    successRate: 96.8,
    trend: 'down',
    trendPercent: -5.2,
  },
  {
    agentId: 'c1-scorer',
    agentName: 'Agent C - Scorer',
    category: 'MOAT Engine',
    totalTokens: 2234000,
    totalCost: 4.47,
    executions: 256,
    avgLatency: 1567,
    successRate: 98.1,
    trend: 'up',
    trendPercent: 8.7,
  },
  {
    agentId: 'c2-prioritizer',
    agentName: 'Agent C - Prioritizer',
    category: 'MOAT Engine',
    totalTokens: 1890000,
    totalCost: 3.78,
    executions: 234,
    avgLatency: 1345,
    successRate: 97.9,
    trend: 'stable',
    trendPercent: 1.2,
  },
  {
    agentId: 'd1-agenda',
    agentName: 'Agent D - Agenda Generator',
    category: 'MOAT Engine',
    totalTokens: 3456000,
    totalCost: 6.91,
    executions: 198,
    avgLatency: 2678,
    successRate: 96.5,
    trend: 'up',
    trendPercent: 22.4,
  },
  {
    agentId: 'd2-briefing',
    agentName: 'Agent D - Briefing Generator',
    category: 'MOAT Engine',
    totalTokens: 4567000,
    totalCost: 9.13,
    executions: 189,
    avgLatency: 3245,
    successRate: 95.8,
    trend: 'up',
    trendPercent: 15.6,
  },
  {
    agentId: 'copilot-insights',
    agentName: 'Copilot Insights',
    category: 'Copilot',
    totalTokens: 2890000,
    totalCost: 5.78,
    executions: 245,
    avgLatency: 2156,
    successRate: 96.5,
    trend: 'up',
    trendPercent: 28.9,
  },
  {
    agentId: 'pdi-generator',
    agentName: 'PDI Generator',
    category: 'Servicos',
    totalTokens: 3890000,
    totalCost: 7.78,
    executions: 156,
    avgLatency: 2890,
    successRate: 94.2,
    trend: 'stable',
    trendPercent: 3.5,
  },
  {
    agentId: 'secretariat-search',
    agentName: 'Secretariat Search',
    category: 'Servicos',
    totalTokens: 890000,
    totalCost: 1.78,
    executions: 523,
    avgLatency: 890,
    successRate: 98.9,
    trend: 'up',
    trendPercent: 45.2,
  },
  {
    agentId: 'ata-generator',
    agentName: 'ATA Generator',
    category: 'Servicos',
    totalTokens: 5670000,
    totalCost: 11.34,
    executions: 342,
    avgLatency: 2345,
    successRate: 97.4,
    trend: 'up',
    trendPercent: 32.1,
  },
];

const mockClientUsage: ClientUsage[] = [
  {
    clientId: '1',
    clientName: 'Grupo Alpha S.A.',
    plan: 'Enterprise',
    totalTokens: 12500000,
    totalCost: 25.00,
    executions: 1245,
    lastActivity: '2026-01-12T15:30:00Z',
    monthlyLimit: 50000000,
    usagePercent: 25,
  },
  {
    clientId: '2',
    clientName: 'Beta Investimentos',
    plan: 'Professional',
    totalTokens: 8900000,
    totalCost: 17.80,
    executions: 890,
    lastActivity: '2026-01-12T14:45:00Z',
    monthlyLimit: 20000000,
    usagePercent: 44.5,
  },
  {
    clientId: '3',
    clientName: 'Gamma Holdings',
    plan: 'Enterprise',
    totalTokens: 15600000,
    totalCost: 31.20,
    executions: 1567,
    lastActivity: '2026-01-12T16:00:00Z',
    monthlyLimit: 50000000,
    usagePercent: 31.2,
  },
  {
    clientId: '4',
    clientName: 'Delta Participacoes',
    plan: 'Professional',
    totalTokens: 6700000,
    totalCost: 13.40,
    executions: 678,
    lastActivity: '2026-01-12T12:30:00Z',
    monthlyLimit: 20000000,
    usagePercent: 33.5,
  },
  {
    clientId: '5',
    clientName: 'Epsilon Corp',
    plan: 'Starter',
    totalTokens: 2300000,
    totalCost: 4.60,
    executions: 234,
    lastActivity: '2026-01-12T10:15:00Z',
    monthlyLimit: 5000000,
    usagePercent: 46,
  },
  {
    clientId: '6',
    clientName: 'Zeta Tecnologia',
    plan: 'Enterprise',
    totalTokens: 18900000,
    totalCost: 37.80,
    executions: 1890,
    lastActivity: '2026-01-12T16:30:00Z',
    monthlyLimit: 50000000,
    usagePercent: 37.8,
  },
  {
    clientId: '7',
    clientName: 'Eta Consulting',
    plan: 'Professional',
    totalTokens: 4500000,
    totalCost: 9.00,
    executions: 456,
    lastActivity: '2026-01-11T18:00:00Z',
    monthlyLimit: 20000000,
    usagePercent: 22.5,
  },
  {
    clientId: '8',
    clientName: 'Theta Industrial',
    plan: 'Starter',
    totalTokens: 4800000,
    totalCost: 9.60,
    executions: 489,
    lastActivity: '2026-01-12T09:45:00Z',
    monthlyLimit: 5000000,
    usagePercent: 96,
  },
];

const mockModelUsage: ModelUsage[] = [
  {
    model: 'gemini-2.5-flash',
    provider: 'Google',
    totalTokens: 28900000,
    totalCost: 28.90,
    executions: 3456,
    avgLatency: 1890,
  },
  {
    model: 'gemini-3-flash-preview',
    provider: 'Google',
    totalTokens: 12400000,
    totalCost: 24.80,
    executions: 1234,
    avgLatency: 2100,
  },
  {
    model: 'gpt-4o-mini',
    provider: 'OpenAI',
    totalTokens: 5600000,
    totalCost: 16.80,
    executions: 567,
    avgLatency: 2345,
  },
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'blue'
}: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  icon: any; 
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                trend === 'up' && "text-green-500",
                trend === 'down' && "text-red-500",
                trend === 'stable' && "text-muted-foreground"
              )}>
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl border", colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UsageChart = ({ data }: { data: TokenUsage[] }) => {
  const maxTokens = Math.max(...data.map(d => d.totalTokens));
  
  return (
    <div className="h-48 flex items-end gap-1">
      {data.slice(-14).map((day, i) => {
        const height = (day.totalTokens / maxTokens) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-primary/20 rounded-t hover:bg-primary/30 transition-colors cursor-pointer group relative"
              style={{ height: `${height}%` }}
            >
              <div 
                className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                style={{ height: `${(day.completionTokens / day.totalTokens) * 100}%` }}
              />
              <div className="hidden group-hover:block absolute -top-12 left-1/2 -translate-x-1/2 bg-popover border rounded-lg p-2 text-xs whitespace-nowrap z-10">
                <p className="font-medium">{day.date}</p>
                <p className="text-muted-foreground">{(day.totalTokens / 1000).toFixed(0)}K tokens</p>
                <p className="text-muted-foreground">US$ {day.cost.toFixed(2)}</p>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {new Date(day.date).getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AdminLLMManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calcular metricas totais
  const totalMetrics = useMemo(() => {
    const totalTokens = mockDailyUsage.reduce((sum, d) => sum + d.totalTokens, 0);
    const totalCost = mockDailyUsage.reduce((sum, d) => sum + d.cost, 0);
    const avgDailyTokens = totalTokens / mockDailyUsage.length;
    const totalExecutions = mockAgentUsage.reduce((sum, a) => sum + a.executions, 0);
    
    return {
      totalTokens,
      totalCost,
      avgDailyTokens,
      totalExecutions,
    };
  }, []);

  // Filtrar agentes
  const filteredAgents = useMemo(() => {
    return mockAgentUsage.filter(agent => {
      const matchesSearch = agent.agentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return mockClientUsage.filter(client => 
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestao de LLMs" />
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header com acoes */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Gestao de LLMs</h1>
                <p className="text-muted-foreground">
                  Monitore o uso de tokens, custos e performance dos modelos de IA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                    <SelectItem value="1y">1 ano</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>

            {/* Cards de Metricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total de Tokens"
                value={`${(totalMetrics.totalTokens / 1000000).toFixed(1)}M`}
                subtitle="Ultimos 30 dias"
                icon={Zap}
                trend="up"
                trendValue="+15.3% vs mes anterior"
                color="blue"
              />
              <StatCard
                title="Custo Total"
                value={`US$ ${totalMetrics.totalCost.toFixed(2)}`}
                subtitle="Ultimos 30 dias"
                icon={DollarSign}
                trend="up"
                trendValue="+12.8% vs mes anterior"
                color="green"
              />
              <StatCard
                title="Media Diaria"
                value={`${(totalMetrics.avgDailyTokens / 1000).toFixed(0)}K`}
                subtitle="tokens/dia"
                icon={BarChart3}
                trend="stable"
                trendValue="+2.1% vs semana anterior"
                color="purple"
              />
              <StatCard
                title="Execucoes"
                value={totalMetrics.totalExecutions.toLocaleString()}
                subtitle="Total de chamadas"
                icon={Cpu}
                trend="up"
                trendValue="+28.5% vs mes anterior"
                color="amber"
              />
            </div>

            {/* Grafico de Uso */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Consumo de Tokens</CardTitle>
                    <CardDescription>Ultimos 14 dias</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary/20" />
                      <span className="text-muted-foreground">Prompt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary" />
                      <span className="text-muted-foreground">Completion</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UsageChart data={mockDailyUsage} />
              </CardContent>
            </Card>

            {/* Tabs de Detalhes */}
            <Tabs defaultValue="agents" className="space-y-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Por Agente
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Por Cliente
                </TabsTrigger>
                <TabsTrigger value="models" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Por Modelo
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas
                </TabsTrigger>
              </TabsList>

              {/* Tab: Por Agente */}
              <TabsContent value="agents" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar agente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="MOAT Engine">MOAT Engine</SelectItem>
                      <SelectItem value="Copilot">Copilot</SelectItem>
                      <SelectItem value="Servicos">Servicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agente</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead className="text-right">Tokens</TableHead>
                          <TableHead className="text-right">Custo</TableHead>
                          <TableHead className="text-right">Execucoes</TableHead>
                          <TableHead className="text-right">Latencia</TableHead>
                          <TableHead className="text-right">Sucesso</TableHead>
                          <TableHead className="text-right">Tendencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAgents.map((agent) => (
                          <TableRow key={agent.agentId}>
                            <TableCell className="font-medium">{agent.agentName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                agent.category === 'MOAT Engine' && "border-blue-500/50 text-blue-500",
                                agent.category === 'Copilot' && "border-purple-500/50 text-purple-500",
                                agent.category === 'Servicos' && "border-slate-500/50 text-slate-500",
                              )}>
                                {agent.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {(agent.totalTokens / 1000000).toFixed(2)}M
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              US$ {agent.totalCost.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">{agent.executions}</TableCell>
                            <TableCell className="text-right">{agent.avgLatency}ms</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className={cn(
                                agent.successRate >= 97 && "border-green-500/50 text-green-500",
                                agent.successRate >= 95 && agent.successRate < 97 && "border-amber-500/50 text-amber-500",
                                agent.successRate < 95 && "border-red-500/50 text-red-500",
                              )}>
                                {agent.successRate}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className={cn(
                                "flex items-center justify-end gap-1",
                                agent.trend === 'up' && "text-green-500",
                                agent.trend === 'down' && "text-red-500",
                                agent.trend === 'stable' && "text-muted-foreground",
                              )}>
                                {agent.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                {agent.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                <span className="text-sm">{agent.trendPercent > 0 ? '+' : ''}{agent.trendPercent}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Por Cliente */}
              <TabsContent value="clients" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead className="text-right">Tokens</TableHead>
                          <TableHead className="text-right">Custo</TableHead>
                          <TableHead className="text-right">Execucoes</TableHead>
                          <TableHead>Uso do Limite</TableHead>
                          <TableHead>Ultima Atividade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.map((client) => (
                          <TableRow key={client.clientId}>
                            <TableCell className="font-medium">{client.clientName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                client.plan === 'Enterprise' && "border-purple-500/50 text-purple-500",
                                client.plan === 'Professional' && "border-blue-500/50 text-blue-500",
                                client.plan === 'Starter' && "border-slate-500/50 text-slate-500",
                              )}>
                                {client.plan}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {(client.totalTokens / 1000000).toFixed(2)}M
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              US$ {client.totalCost.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">{client.executions}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={client.usagePercent} 
                                  className={cn(
                                    "h-2 w-24",
                                    client.usagePercent >= 90 && "[&>div]:bg-red-500",
                                    client.usagePercent >= 70 && client.usagePercent < 90 && "[&>div]:bg-amber-500",
                                  )}
                                />
                                <span className={cn(
                                  "text-xs",
                                  client.usagePercent >= 90 && "text-red-500",
                                  client.usagePercent >= 70 && client.usagePercent < 90 && "text-amber-500",
                                )}>
                                  {client.usagePercent}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(client.lastActivity).toLocaleString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Por Modelo */}
              <TabsContent value="models" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockModelUsage.map((model) => (
                    <Card key={model.model}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{model.provider}</Badge>
                          <Brain className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">{model.model}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tokens</p>
                            <p className="font-medium font-mono">{(model.totalTokens / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Custo</p>
                            <p className="font-medium font-mono">US$ {model.totalCost.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Execucoes</p>
                            <p className="font-medium">{model.executions}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Latencia</p>
                            <p className="font-medium">{model.avgLatency}ms</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Participacao</span>
                            <span className="font-medium">
                              {((model.totalTokens / mockModelUsage.reduce((s, m) => s + m.totalTokens, 0)) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={(model.totalTokens / mockModelUsage.reduce((s, m) => s + m.totalTokens, 0)) * 100} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab: Alertas */}
              <TabsContent value="alerts" className="space-y-4">
                <div className="grid gap-4">
                  <Card className="border-red-500/30 bg-red-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-red-500">Limite Critico - Theta Industrial</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Cliente atingiu 96% do limite mensal de tokens. Considere upgrade de plano ou ajuste de limite.
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                              Notificar Cliente
                            </Button>
                            <Button size="sm" variant="ghost">
                              Ajustar Limite
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Há 2h</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-500">Taxa de Sucesso Baixa - Agent B Pattern Detector</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            A taxa de sucesso caiu para 95.4%. Considere revisar o prompt ou aumentar o timeout.
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                              Ver Logs
                            </Button>
                            <Button size="sm" variant="ghost">
                              Editar Prompt
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Há 5h</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/30 bg-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-500">Crescimento Acelerado - Secretariat Search</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Uso cresceu 45% nesta semana. Funcionalidade esta sendo muito utilizada pelos clientes.
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Há 1d</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
