import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompetitorInsight } from '@/types/riskIntelligence';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';

interface CompetitorAnalysisCardProps {
  competitors: CompetitorInsight[];
}

export const CompetitorAnalysisCard = ({ competitors }: CompetitorAnalysisCardProps) => {
  const getThreatColor = (level: string) => {
    if (level === 'high') return 'bg-destructive';
    if (level === 'medium') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getThreatLabel = (level: string) => {
    if (level === 'high') return 'Alto';
    if (level === 'medium') return 'Médio';
    return 'Baixo';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Análise de Competidores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold text-foreground">{competitor.name}</h4>
                </div>
                <Badge className={`${getThreatColor(competitor.threatLevel)} text-white`}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {getThreatLabel(competitor.threatLevel)}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Movimento Recente:</p>
                  <p className="text-sm text-foreground">{competitor.recentMove}</p>
                </div>

                {competitor.marketShare && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Market Share:</p>
                    <p className="text-sm text-foreground">{competitor.marketShare}</p>
                  </div>
                )}

                {competitor.opportunityFromWeakness && (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-500/20 rounded p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-green-700 dark:text-green-500 mb-1">
                          Oportunidade:
                        </p>
                        <p className="text-xs text-foreground">
                          {competitor.opportunityFromWeakness}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
