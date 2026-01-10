import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Clock, DollarSign, Star, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockTestExecutions } from '@/data/mockPromptsData';

interface PromptPerformanceChartProps {
  promptId: string;
}

export function PromptPerformanceChart({ promptId }: PromptPerformanceChartProps) {
  // Filter executions for this prompt from mock data
  const executions = mockTestExecutions.filter(e => e.prompt_id === promptId);

  if (!executions || executions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium mb-2">Sem dados de performance</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Execute testes no Playground para começar a coletar métricas de performance deste prompt.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter(e => e.success).length;
  const successRate = Math.round((successfulExecutions / totalExecutions) * 100);
  const avgLatency = Math.round(executions.reduce((sum, e) => sum + (e.latency_ms || 0), 0) / totalExecutions);
  const avgTokens = Math.round(executions.reduce((sum, e) => sum + (e.tokens_used || 0), 0) / totalExecutions);
  const totalCost = executions.reduce((sum, e) => sum + (e.cost_usd || 0), 0);

  const ratedExecutions = executions.filter(e => e.quality_score !== null);
  const avgQuality = ratedExecutions.length > 0
    ? (ratedExecutions.reduce((sum, e) => sum + (e.quality_score || 0), 0) / ratedExecutions.length).toFixed(1)
    : null;

  // Prepare chart data
  const latencyData = executions.slice(-20).map(e => ({
    date: format(new Date(e.created_at), 'dd/MM HH:mm'),
    latency: e.latency_ms,
    tokens: e.tokens_used
  }));

  const successData = [
    { name: 'Sucesso', value: successfulExecutions, color: 'hsl(142, 76%, 36%)' },
    { name: 'Falha', value: totalExecutions - successfulExecutions, color: 'hsl(0, 84%, 60%)' }
  ];

  const qualityDistribution = [1, 2, 3, 4, 5].map(score => ({
    score: `${score}★`,
    count: executions.filter(e => e.quality_score === score).length
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricSummaryCard
          icon={<Zap className="h-4 w-4 text-blue-500" />}
          label="Execuções"
          value={totalExecutions.toString()}
        />
        <MetricSummaryCard
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          label="Taxa de Sucesso"
          value={`${successRate}%`}
        />
        <MetricSummaryCard
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
          label="Latência Média"
          value={`${avgLatency}ms`}
        />
        <MetricSummaryCard
          icon={<DollarSign className="h-4 w-4 text-purple-500" />}
          label="Custo Total"
          value={`$${totalCost.toFixed(4)}`}
        />
        <MetricSummaryCard
          icon={<Star className="h-4 w-4 text-amber-500" />}
          label="Qualidade Média"
          value={avgQuality ? `${avgQuality}/5` : '-'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latência ao Longo do Tempo</CardTitle>
            <CardDescription>Últimas 20 execuções</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}ms`, 'Latência']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#latencyGradient)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rate Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taxa de Sucesso</CardTitle>
            <CardDescription>Distribuição de resultados</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} execuções`, '']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quality Distribution */}
      {ratedExecutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Qualidade</CardTitle>
            <CardDescription>Avaliações dos testes</CardDescription>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityDistribution}>
                <XAxis 
                  dataKey="score" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) => [`${value} avaliações`, '']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricSummaryCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
