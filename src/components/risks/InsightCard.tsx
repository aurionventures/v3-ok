import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketThreat, MarketOpportunity } from '@/types/riskIntelligence';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Target,
  Shield,
  Globe,
  Zap,
  Scale,
  DollarSign,
  Users
} from 'lucide-react';

interface InsightCardProps {
  insight: MarketThreat | MarketOpportunity;
  type: 'threat' | 'opportunity';
  onCreateAgenda: () => void;
}

const sourceIcons = {
  regulatory: Scale,
  market: Globe,
  competitive: Users,
  technological: Zap,
  economic: DollarSign,
  esg: Shield,
  market_gap: Target,
  trend: TrendingUp,
  regulation: Scale,
  technology: Zap,
  partnership: Users,
};

const sourceLabels = {
  regulatory: 'Regulatório',
  market: 'Mercado',
  competitive: 'Competitivo',
  technological: 'Tecnológico',
  economic: 'Econômico',
  esg: 'ESG',
  market_gap: 'Gap de Mercado',
  trend: 'Tendência',
  regulation: 'Regulação',
  technology: 'Tecnologia',
  partnership: 'Parceria',
};

export const InsightCard = ({ insight, type, onCreateAgenda }: InsightCardProps) => {
  const isThreat = type === 'threat';
  const threat = isThreat ? (insight as MarketThreat) : null;
  const opportunity = !isThreat ? (insight as MarketOpportunity) : null;

  const SourceIcon = sourceIcons[insight.source];
  const sourceLabel = sourceLabels[insight.source];

  const getRiskLevel = () => {
    if (!threat) return null;
    const score = threat.impact * threat.probability;
    if (score >= 16) return { label: 'Crítico', color: 'bg-destructive' };
    if (score >= 12) return { label: 'Alto', color: 'bg-orange-500' };
    if (score >= 6) return { label: 'Médio', color: 'bg-yellow-500' };
    return { label: 'Baixo', color: 'bg-green-500' };
  };

  const getValueColor = () => {
    if (!opportunity) return '';
    if (opportunity.potentialValue === 'high') return 'bg-green-500';
    if (opportunity.potentialValue === 'medium') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const timeHorizonLabels = {
    immediate: 'Imediato',
    short_term: 'Curto Prazo',
    medium_term: 'Médio Prazo',
    long_term: 'Longo Prazo',
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {isThreat ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <TrendingUp className="h-5 w-5 text-green-600" />
            )}
            <h3 className="font-semibold text-foreground">{insight.title}</h3>
          </div>
          
          {threat && getRiskLevel() && (
            <Badge className={`${getRiskLevel()?.color} text-white`}>
              {getRiskLevel()?.label}
            </Badge>
          )}
          
          {opportunity && (
            <Badge className={`${getValueColor()} text-white`}>
              {opportunity.potentialValue === 'high' ? 'Alto Valor' : 
               opportunity.potentialValue === 'medium' ? 'Médio Valor' : 'Baixo Valor'}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{insight.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <SourceIcon className="h-3 w-3" />
            {sourceLabel}
          </Badge>

          {threat && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {timeHorizonLabels[threat.timeHorizon]}
            </Badge>
          )}

          {opportunity && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {opportunity.timeWindow}
            </Badge>
          )}
        </div>

        {threat && threat.suggestedActions && threat.suggestedActions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Ações Sugeridas:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {threat.suggestedActions.slice(0, 2).map((action, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {opportunity && opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Requisitos:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {opportunity.requirements.slice(0, 2).map((req, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={onCreateAgenda}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Criar Pauta para Reunião
        </Button>
      </div>
    </Card>
  );
};
