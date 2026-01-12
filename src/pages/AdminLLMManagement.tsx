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
  Filter,
  Sparkles,
  Target,
  Eye
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
import { 
  aiAgents, 
  aiCopilots, 
  aiServices,
  getEngineStats,
  getAgentDisplayConfigs,
  getCopilotDisplayConfigs
} from '@/data/aiEngineData';

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

// Gerar dados de uso por agente a partir dos dados consolidados
const mockAgentUsage = aiAgents.flatMap(agent => 
  agent.prompts.map(prompt => ({
    agentId: prompt.id,
    agentName: `${agent.name} - ${prompt.name}`,
    category: 'MOAT Engine',
    totalTokens: prompt.metrics.executions * 2500,
    totalCost: prompt.metrics.executions * 0.01,
    executions: prompt.metrics.executions,
    avgLatency: agent.metrics.avgLatencyMs,
    successRate: prompt.metrics.successRate,
    trend: Math.random() > 0.3 ? 'up' as const : Math.random() > 0.5 ? 'down' as const : 'stable' as const,
    trendPercent: Math.floor(Math.random() * 25),
  }))
);

const mockClientUsage: ClientUsage[] = [
  {
    clientId: 'client-1',
    clientName: 'Grupo Industrial ABC',
    plan: 'Enterprise',
    totalTokens: 5678000,
    totalCost: 11.36,
    executions: 234,
    lastActivity: '2025-12-15T14:30:00Z',
    monthlyLimit: 10000000,
    usagePercent: 56.78,
  },
  {
    clientId: 'client-2',
    clientName: 'Holding Familiar XYZ',
    plan: 'Professional',
    totalTokens: 3456000,
    totalCost: 6.91,
    executions: 156,
    lastActivity: '2025-12-15T12:00:00Z',
    monthlyLimit: 5000000,
    usagePercent: 69.12,
  },
  {
    clientId: 'client-3',
    clientName: 'Conselho Alpha',
    plan: 'Starter',
    totalTokens: 890000,
    totalCost: 1.78,
    executions: 45,
    lastActivity: '2025-12-14T16:00:00Z',
    monthlyLimit: 1000000,
    usagePercent: 89.0,
  },
];

const mockModelUsage: ModelUsage[] = [
  {
    model: 'google/gemini-3-flash-preview',
    provider: 'Google',
    totalTokens: 15678000,
    totalCost: 31.36,
    executions: 2345,
    avgLatency: 1823,
  },
  {
    model: 'google/gemini-2.5-flash',
    provider: 'Google',
    totalTokens: 8934000,
    totalCost: 17.87,
    executions: 1234,
    avgLatency: 1456,
  },
];

// ============================================================================
// COMPONENTES
// ============================================================================

// Mapeamento de ícones
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Target,
  Zap,
  FileText,
  Brain,
  TrendingUp,
  Bot,
  Search,
};

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'primary'
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType; 
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-2 rounded-lg', colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-3">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-gray-400" />
            )}
            <span className={cn(
              'text-xs',
              trend === 'up' && 'text-green-500',
              trend === 'down' && 'text-red-500',
              trend === 'stable' && 'text-muted-foreground'
            )}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsageChart({ data }: { data: TokenUsage[] }) {
  const maxTokens = Math.max(...data.map(d => d.totalTokens));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Uso de Tokens - Ultimos 30 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end gap-1">
          {data.map((day, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t cursor-pointer group relative"
              style={{ height: `${(day.totalTokens / maxTokens) * 100}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-medium">{new Date(day.date).toLocaleDateString('pt-BR')}</p>
                <p>{day.totalTokens.toLocaleString()} tokens</p>
                <p>R$ {(day.cost * 5).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{new Date(data[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
          <span>{new Date(data[data.length - 1].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentUsageTable({ 
  data, 
  searchTerm,
  categoryFilter 
}: { 
  data: typeof mockAgentUsage;
  searchTerm: string;
  categoryFilter: string;
}) {
  const filteredData = useMemo(() => {
    return data.filter(agent => {
      const matchesSearch = agent.agentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  return (
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
        {filteredData.map((agent) => (
          <TableRow key={agent.agentId}>
            <TableCell className="font-medium">{agent.agentName}</TableCell>
            <TableCell>
              <Badge variant="outline">{agent.category}</Badge>
            </TableCell>
            <TableCell className="text-right">{(agent.totalTokens / 1000).toFixed(0)}K</TableCell>
            <TableCell className="text-right">R$ {(agent.totalCost * 5).toFixed(2)}</TableCell>
            <TableCell className="text-right">{agent.executions}</TableCell>
            <TableCell className="text-right">{agent.avgLatency}ms</TableCell>
            <TableCell className="text-right">
              <span className={cn(
                agent.successRate >= 97 && 'text-green-600',
                agent.successRate >= 95 && agent.successRate < 97 && 'text-amber-600',
                agent.successRate < 95 && 'text-red-600'
              )}>
                {agent.successRate.toFixed(1)}%
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {agent.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : agent.trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                )}
                <span className={cn(
                  'text-xs',
                  agent.trend === 'up' && 'text-green-500',
                  agent.trend === 'down' && 'text-red-500'
                )}>
                  {agent.trendPercent}%
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ClientUsageTable({ data }: { data: ClientUsage[] }) {
  return (
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
        {data.map((client) => (
          <TableRow key={client.clientId}>
            <TableCell className="font-medium">{client.clientName}</TableCell>
            <TableCell>
              <Badge variant="outline">{client.plan}</Badge>
            </TableCell>
            <TableCell className="text-right">{(client.totalTokens / 1000000).toFixed(2)}M</TableCell>
            <TableCell className="text-right">R$ {(client.totalCost * 5).toFixed(2)}</TableCell>
            <TableCell className="text-right">{client.executions}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={client.usagePercent} className="h-2 w-24" />
                <span className={cn(
                  'text-xs',
                  client.usagePercent >= 90 && 'text-red-600',
                  client.usagePercent >= 70 && client.usagePercent < 90 && 'text-amber-600',
                  client.usagePercent < 70 && 'text-green-600'
                )}>
                  {client.usagePercent.toFixed(0)}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(client.lastActivity).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ModelUsageTable({ data }: { data: ModelUsage[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Modelo</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead className="text-right">Tokens</TableHead>
          <TableHead className="text-right">Custo</TableHead>
          <TableHead className="text-right">Execucoes</TableHead>
          <TableHead className="text-right">Latencia Media</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((model) => (
          <TableRow key={model.model}>
            <TableCell className="font-medium">{model.model}</TableCell>
            <TableCell>
              <Badge variant="outline">{model.provider}</Badge>
            </TableCell>
            <TableCell className="text-right">{(model.totalTokens / 1000000).toFixed(2)}M</TableCell>
            <TableCell className="text-right">R$ {(model.totalCost * 5).toFixed(2)}</TableCell>
            <TableCell className="text-right">{model.executions}</TableCell>
            <TableCell className="text-right">{model.avgLatency}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ============================================================================
// VISUALIZAÇÃO DA ARQUITETURA
// ============================================================================

function ArchitectureOverview() {
  const stats = getEngineStats();
  const agentConfigs = getAgentDisplayConfigs();
  const copilotConfigs = getCopilotDisplayConfigs();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Copilotos Ativos" 
          value={stats.totalCopilots} 
          icon={Brain} 
          color="primary"
        />
        <StatCard 
          title="Agentes MOAT" 
          value={stats.totalAgents} 
          icon={Bot} 
          color="success"
        />
        <StatCard 
          title="Prompts Criticos" 
          value={stats.criticalPrompts} 
          subtitle={`de ${stats.totalPrompts} total`}
          icon={AlertTriangle} 
          color="warning"
        />
        <StatCard 
          title="Taxa de Sucesso" 
          value={`${stats.avgSuccessRate.toFixed(1)}%`} 
          icon={TrendingUp} 
          color="success"
        />
      </div>

      {/* Copilotos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Copilotos
          </CardTitle>
          <CardDescription>Interfaces de alto nivel para usuarios finais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {copilotConfigs.map(copilot => {
              const Icon = iconMap[copilot.icon] || Brain;
              return (
                <Card key={copilot.id} className="border-l-4" style={{ borderLeftColor: copilot.color }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${copilot.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: copilot.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{copilot.name}</h4>
                        <p className="text-sm text-muted-foreground">{copilot.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            {copilot.scope === 'council' ? 'Conselho de Administracao' : 'Sistema'}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Agentes Dependentes:</p>
                          <div className="flex gap-1">
                            {copilot.connectedAgents.map(agentId => {
                              const agent = aiAgents.find(a => a.id === agentId);
                              return agent ? (
                                <Badge key={agentId} variant="secondary" className="text-xs">
                                  {agent.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Prompts Conectados:</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {copilotConfigs.find(c => c.id === copilot.id)?.connectedPrompts[0]?.name || 'N/A'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">v1.0.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agentes de IA
          </CardTitle>
          <CardDescription>Especialistas em dominios especificos do MOAT Engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {agentConfigs.map(agent => {
              const Icon = iconMap[agent.icon] || Sparkles;
              return (
                <Card key={agent.id} className="border-l-4" style={{ borderLeftColor: agent.color }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: agent.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold" style={{ color: agent.color }}>{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.shortName}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          {agent.badges.critical} Critico
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {agent.badges.active}/{agent.prompts.length} Ativos
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{agent.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {agent.scope === 'council' ? 'Conselho' : agent.scope === 'system' ? 'Sistema' : agent.scope}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Prompts deste Agente:</p>
                      <div className="space-y-1">
                        {agent.prompts.map(prompt => (
                          <div key={prompt.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={cn(
                                  "h-4 w-4 p-0 flex items-center justify-center text-[10px]",
                                  prompt.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                )}
                              >
                                {prompt.status === 'active' ? '✓' : '○'}
                              </Badge>
                              <span>{prompt.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  prompt.impactLevel === 'critical' && 'bg-red-50 text-red-700 border-red-200',
                                  prompt.impactLevel === 'high' && 'bg-amber-50 text-amber-700 border-amber-200'
                                )}
                              >
                                {prompt.impactLevel === 'critical' ? 'Critico' : 'Alto'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">v{prompt.version}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Prompts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Servicos
          </CardTitle>
          <CardDescription>Funcoes atomicas reutilizaveis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servico</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead className="text-right">Execucoes</TableHead>
                <TableHead className="text-right">Latencia</TableHead>
                <TableHead className="text-right">Sucesso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiServices.map(service => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{service.model}</TableCell>
                  <TableCell className="text-right">{service.metrics.totalExecutions}</TableCell>
                  <TableCell className="text-right">{service.metrics.avgLatencyMs}ms</TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600">{service.metrics.successRate}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AdminLLMManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('30d');

  const stats = getEngineStats();

  // Estatísticas calculadas
  const totalTokens = mockDailyUsage.reduce((sum, d) => sum + d.totalTokens, 0);
  const totalCost = mockDailyUsage.reduce((sum, d) => sum + d.cost, 0);
  const avgDailyTokens = totalTokens / mockDailyUsage.length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestao de LLM" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" />
                Gestao de LLM e Tokens
              </h1>
              <p className="text-muted-foreground">
                Monitore o uso de tokens, custos e performance dos agentes de IA
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Exportar CSV</DropdownMenuItem>
                  <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
                  <DropdownMenuItem>Exportar JSON</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total de Tokens" 
              value={`${(totalTokens / 1000000).toFixed(2)}M`}
              subtitle={`Media: ${(avgDailyTokens / 1000).toFixed(0)}K/dia`}
              icon={Cpu} 
              trend="up"
              trendValue="+12.5% vs periodo anterior"
            />
            <StatCard 
              title="Custo Total" 
              value={`R$ ${(totalCost * 5).toFixed(2)}`}
              subtitle="Convertido para BRL"
              icon={DollarSign}
              color="warning"
              trend="up"
              trendValue="+8.3% vs periodo anterior"
            />
            <StatCard 
              title="Execucoes" 
              value={stats.totalExecutions.toLocaleString()}
              subtitle={`${stats.totalAgents} agentes ativos`}
              icon={Zap}
              color="success"
              trend="up"
              trendValue="+15.2% vs periodo anterior"
            />
            <StatCard 
              title="Taxa de Sucesso" 
              value={`${stats.avgSuccessRate.toFixed(1)}%`}
              subtitle="Media geral"
              icon={TrendingUp}
              color="success"
              trend="stable"
              trendValue="Estavel"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Visao Geral
              </TabsTrigger>
              <TabsTrigger value="architecture" className="gap-2">
                <Bot className="h-4 w-4" />
                Arquitetura IA
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Bot className="h-4 w-4" />
                Por Agente
              </TabsTrigger>
              <TabsTrigger value="clients" className="gap-2">
                <Users className="h-4 w-4" />
                Por Cliente
              </TabsTrigger>
              <TabsTrigger value="models" className="gap-2">
                <Cpu className="h-4 w-4" />
                Por Modelo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <UsageChart data={mockDailyUsage} />
            </TabsContent>

            <TabsContent value="architecture">
              <ArchitectureOverview />
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar agente..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    <SelectItem value="MOAT Engine">MOAT Engine</SelectItem>
                    <SelectItem value="Copilot">Copilot</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Card>
                <ScrollArea className="h-[500px]">
                  <AgentUsageTable 
                    data={mockAgentUsage} 
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                  />
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uso por Cliente</CardTitle>
                  <CardDescription>
                    Consumo de tokens e custos por organizacao
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientUsageTable data={mockClientUsage} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uso por Modelo</CardTitle>
                  <CardDescription>
                    Distribuicao de tokens entre modelos de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModelUsageTable data={mockModelUsage} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
