import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Eye,
  ChevronRight,
  Target,
  Clock,
  Activity,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  usePerformanceAlerts, 
  useRiskPredictions, 
  useHistoricalPerformance 
} from '@/hooks/useBoardPerformance360';
import { 
  RISK_LEVEL_LABELS, 
  RISK_LEVEL_COLORS,
  ALERT_TYPE_LABELS 
} from '@/types/boardPerformance';
import type { 
  PerformanceAlert, 
  MemberRiskPrediction,
  TrendDirection 
} from '@/types/boardPerformance';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrendsTabProps {
  companyId?: string;
  periodId?: string;
  onSelectMember?: (memberId: string) => void;
}

// Ícone de tendência
function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === 'improving') {
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  }
  if (direction === 'declining') {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

// Card de Alerta
function AlertCard({ 
  alert, 
  onAcknowledge, 
  onViewDetails 
}: { 
  alert: PerformanceAlert;
  onAcknowledge: (alertId: string) => void;
  onViewDetails: (memberId: string) => void;
}) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800';
      case 'warning':
        return 'border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800';
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical' || severity === 'error') {
      return <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0" />;
    }
    if (severity === 'warning') {
      return <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />;
    }
    return <Activity className="h-5 w-5 text-blue-500 flex-shrink-0" />;
  };

  return (
    <div className={cn('p-4 rounded-lg border-2', getSeverityStyles(alert.severity))}>
      <div className="flex items-start gap-3">
        {getSeverityIcon(alert.severity)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{alert.member_name}</span>
            <Badge variant="outline" className="text-xs">
              {ALERT_TYPE_LABELS[alert.alert_type]}
            </Badge>
          </div>
          <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
          <p className="text-sm text-muted-foreground">{alert.description}</p>
          
          {alert.metric_value !== undefined && alert.threshold_value !== undefined && (
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span>
                Valor atual: <strong className="text-red-600">{alert.metric_value}</strong>
              </span>
              <span>
                Limite: <strong>{alert.threshold_value}</strong>
              </span>
            </div>
          )}
          
          {alert.recommended_actions.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-medium text-muted-foreground">Ações recomendadas:</span>
              <ul className="mt-1 space-y-0.5">
                {alert.recommended_actions.slice(0, 2).map((action, i) => (
                  <li key={i} className="text-xs flex items-start gap-1">
                    <span className="text-primary">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(alert.member_id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes
            </Button>
            {alert.status === 'active' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Reconhecer
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground text-right">
          {format(parseISO(alert.created_at), "dd/MM HH:mm")}
        </div>
      </div>
    </div>
  );
}

// Card de Predição de Risco
function PredictionCard({ 
  prediction,
  onViewDetails 
}: { 
  prediction: MemberRiskPrediction;
  onViewDetails: (memberId: string) => void;
}) {
  const getRiskBorderColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-emerald-500';
    }
  };

  const scoreDiff = prediction.predictedScore - prediction.currentScore;

  return (
    <Card className={cn('border-l-4', getRiskBorderColor(prediction.riskLevel))}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{prediction.memberName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{prediction.memberName}</p>
              <p className="text-xs text-muted-foreground">{prediction.memberRole}</p>
            </div>
          </div>
          <Badge className={RISK_LEVEL_COLORS[prediction.riskLevel]}>
            {RISK_LEVEL_LABELS[prediction.riskLevel]}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">{prediction.currentScore}</div>
            <div className="text-xs text-muted-foreground">Score Atual</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className={cn(
              "text-lg font-bold",
              scoreDiff < 0 ? "text-red-600" : "text-emerald-600"
            )}>
              {prediction.predictedScore}
            </div>
            <div className="text-xs text-muted-foreground">Predição 30d</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">{prediction.confidence}%</div>
            <div className="text-xs text-muted-foreground">Confiança</div>
          </div>
        </div>
        
        {/* Tendências */}
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendIcon direction={prediction.trends.attendance} />
            <span>Presença</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon direction={prediction.trends.engagement} />
            <span>Engajamento</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon direction={prediction.trends.delivery} />
            <span>Entrega</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon direction={prediction.trends.preparation} />
            <span>Preparação</span>
          </div>
        </div>
        
        {/* Fatores de Risco */}
        {prediction.riskFactors.length > 0 && (
          <div className="mb-3">
            <span className="text-xs font-medium text-muted-foreground">Fatores de risco:</span>
            <ul className="mt-1 space-y-0.5">
              {prediction.riskFactors.slice(0, 2).map((factor, i) => (
                <li key={i} className="text-xs flex items-start gap-1">
                  <span className="text-red-500">•</span>
                  {factor.factor}: {factor.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onViewDetails(prediction.memberId)}
        >
          Ver Análise Completa
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Componente Principal
export function TrendsTab({ companyId, periodId, onSelectMember }: TrendsTabProps) {
  const { 
    getActiveAlerts, 
    getCriticalAlerts,
    acknowledgeAlert 
  } = usePerformanceAlerts(companyId);
  
  const { 
    isLoading: isLoadingPredictions,
    getHighRiskMembers,
    refreshPredictions 
  } = useRiskPredictions(companyId);
  
  const { 
    historicalData, 
    getStatistics 
  } = useHistoricalPerformance(companyId);

  const activeAlerts = getActiveAlerts();
  const criticalAlerts = getCriticalAlerts();
  const highRiskMembers = getHighRiskMembers();
  const stats = getStatistics();

  const handleViewDetails = (memberId: string) => {
    onSelectMember?.(memberId);
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Tendência */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Evolução de Performance</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendIcon direction={stats.trend} />
                <span className={cn(
                  "font-medium",
                  stats.trend === 'improving' && "text-emerald-600",
                  stats.trend === 'declining' && "text-red-600"
                )}>
                  {stats.trend === 'improving' ? 'Em melhoria' : 
                   stats.trend === 'declining' ? 'Em declínio' : 'Estável'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Média: <strong className="text-foreground">{stats.avg}</strong>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[0, 100]} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Score Médio"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Presença"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Engajamento"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="delivery" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Entrega"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="preparation" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="Preparação"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Score Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.latest}</div>
            <p className="text-xs text-muted-foreground">
              Min: {stats.min} / Max: {stats.max}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-3xl font-bold",
              activeAlerts.length > 0 ? "text-amber-600" : "text-emerald-600"
            )}>
              {activeAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} crítico(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Em Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-3xl font-bold",
              highRiskMembers.length > 0 ? "text-red-600" : "text-emerald-600"
            )}>
              {highRiskMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              membro(s) identificado(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Próxima Revisão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">30 dias</div>
            <p className="text-xs text-muted-foreground">
              Atualização automática
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Predições de Risco */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predições de Risco (Próximos 30 Dias)
              </CardTitle>
              <CardDescription>
                Membros identificados com potencial declínio de performance
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshPredictions}
              disabled={isLoadingPredictions}
            >
              {isLoadingPredictions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1">Atualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {highRiskMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highRiskMembers.map(prediction => (
                <PredictionCard
                  key={prediction.memberId}
                  prediction={prediction}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700">Nenhum Risco Identificado</AlertTitle>
              <AlertDescription className="text-emerald-600">
                Todos os membros estão com performance estável ou em melhoria.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Alertas Ativos */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Ativos
          </CardTitle>
          <CardDescription>
            Situações que requerem atenção imediata
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledgeAlert}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700">Nenhum Alerta Ativo</AlertTitle>
              <AlertDescription className="text-emerald-600">
                Todos os indicadores estão dentro dos parâmetros esperados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TrendsTab;




