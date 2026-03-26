import { Card } from '@/components/ui/card';
import { MarketThreat, MarketOpportunity } from '@/types/riskIntelligence';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ThreatOpportunityMatrixProps {
  threats: MarketThreat[];
  opportunities: MarketOpportunity[];
  onInsightClick: (insight: MarketThreat | MarketOpportunity, type: 'threat' | 'opportunity') => void;
}

export const ThreatOpportunityMatrix = ({ 
  threats, 
  opportunities, 
  onInsightClick 
}: ThreatOpportunityMatrixProps) => {
  
  const getQuadrantThreats = (timeHorizon: string) => {
    const filtered = threats.filter(t => {
      if (timeHorizon === 'immediate') return t.timeHorizon === 'immediate';
      return t.timeHorizon !== 'immediate';
    });
    return filtered.slice(0, 3);
  };

  const getQuadrantOpportunities = (value: string) => {
    const filtered = opportunities.filter(o => {
      if (value === 'high') return o.potentialValue === 'high';
      return o.potentialValue !== 'high';
    });
    return filtered.slice(0, 3);
  };

  const immediateThreats = getQuadrantThreats('immediate');
  const futureThreats = getQuadrantThreats('future');
  const priorityOpportunities = getQuadrantOpportunities('high');
  const longTermOpportunities = getQuadrantOpportunities('medium');

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      {/* Quadrante: Ameaças Imediatas */}
      <Card className="p-4 bg-destructive/5 border-destructive/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Ameaças Imediatas</h3>
            <Badge variant="destructive">{immediateThreats.length}</Badge>
          </div>
          
          <div className="space-y-2 overflow-auto max-h-[500px]">
            {immediateThreats.map((threat) => (
              <div
                key={threat.id}
                onClick={() => onInsightClick(threat, 'threat')}
                className="p-3 bg-background rounded-md border border-border hover:border-destructive cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{threat.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {threat.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Impacto: {threat.impact}/5
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Prob: {threat.probability}/5
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quadrante: Oportunidades Prioritárias */}
      <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-500/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-700 dark:text-green-500">Oportunidades Prioritárias</h3>
            <Badge className="bg-green-600">{priorityOpportunities.length}</Badge>
          </div>
          
          <div className="space-y-2 overflow-auto max-h-[500px]">
            {priorityOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => onInsightClick(opp, 'opportunity')}
                className="p-3 bg-background rounded-md border border-border hover:border-green-500 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{opp.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {opp.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Alto Valor
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {opp.timeWindow}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quadrante: Ameaças Futuras */}
      <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-500/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-700 dark:text-orange-500">Ameaças Futuras</h3>
            <Badge className="bg-orange-600">{futureThreats.length}</Badge>
          </div>
          
          <div className="space-y-2 overflow-auto max-h-[500px]">
            {futureThreats.map((threat) => (
              <div
                key={threat.id}
                onClick={() => onInsightClick(threat, 'threat')}
                className="p-3 bg-background rounded-md border border-border hover:border-orange-500 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{threat.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {threat.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {threat.timeHorizon === 'short_term' ? 'Curto Prazo' : 
                     threat.timeHorizon === 'medium_term' ? 'Médio Prazo' : 'Longo Prazo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quadrante: Oportunidades de Longo Prazo */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-500/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-700 dark:text-blue-500">Oportunidades de Longo Prazo</h3>
            <Badge className="bg-blue-600">{longTermOpportunities.length}</Badge>
          </div>
          
          <div className="space-y-2 overflow-auto max-h-[500px]">
            {longTermOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => onInsightClick(opp, 'opportunity')}
                className="p-3 bg-background rounded-md border border-border hover:border-blue-500 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{opp.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {opp.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {opp.potentialValue === 'medium' ? 'Médio Valor' : 'Exploratório'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {opp.timeWindow}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
