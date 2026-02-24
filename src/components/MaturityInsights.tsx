import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, DollarSign } from "lucide-react";

interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

interface InsightCardProps {
  dimension: MaturityDimension;
}

const InsightCard = ({ dimension }: InsightCardProps) => {
  const difference = dimension.score - dimension.sectorAverage;
  const isBelow = difference < 0;
  
  const insights = {
    "Propósito": {
      insight: isBelow ? "Propósito organizacional pouco claro compromete direcionamento estratégico e engajamento." : "Propósito bem definido fortalece cultura e direcionamento estratégico.",
      action: isBelow ? "Definir propósito organizacional com participação da família nos próximos 3 meses." : "Reforçar comunicação do propósito e alinhamento com estratégia.",
      impact: isBelow ? "+R$ 4M" : "+R$ 2M"
    },
    "Liderança": {
      insight: isBelow ? "Liderança inadequada reduz eficácia da gestão e compromete resultados operacionais." : "Liderança eficaz mantém alta performance organizacional.",
      action: isBelow ? "Implementar programa de desenvolvimento de líderes e sucessão em 6 meses." : "Aprimorar competências de liderança com coaching contínuo.",
      impact: isBelow ? "+R$ 6M" : "+R$ 3M"
    },
    "Estratégia": {
      insight: isBelow ? "Estratégia mal estruturada limita crescimento e competitividade no mercado." : "Estratégia sólida assegura crescimento sustentável.",
      action: isBelow ? "Criar planejamento estratégico formal com revisões trimestrais." : "Otimizar execução estratégica com KPIs e dashboards.",
      impact: isBelow ? "+R$ 8M" : "+R$ 4M"
    },
    "Riscos e Controles": {
      insight: isBelow ? "Controles inadequados aumentam exposição a riscos e comprometem sustentabilidade." : "Sistema robusto de controles protege valor e reputação.",
      action: isBelow ? "Implementar matriz de riscos e controles internos em 90 dias." : "Automatizar processos de monitoramento e compliance.",
      impact: isBelow ? "+R$ 5M" : "+R$ 2.5M"
    },
    "Transparência": {
      insight: isBelow ? "Baixa transparência limita confiança de stakeholders e acesso a recursos." : "Alta transparência facilita relacionamentos e parcerias estratégicas.",
      action: isBelow ? "Desenvolver relatórios regulares e canais de comunicação claros." : "Digitalizar processos de transparência e reporting.",
      impact: isBelow ? "+R$ 7M" : "+R$ 3.5M"
    },
    "Empresas Familiares": {
      insight: isBelow ? "Governança familiar deficiente pode gerar conflitos e comprometer continuidade." : "Governança familiar estruturada fortalece legado e sucessão.",
      action: isBelow ? "Criar conselho de família e protocolos de governança familiar." : "Aprimorar processos familiares e desenvolvimento de próxima geração.",
      impact: isBelow ? "+R$ 10M" : "+R$ 5M"
    }
  };

  const dimensionInsight = insights[dimension.name as keyof typeof insights];

  // Se não encontrar insight para a dimensão ou se não está abaixo da média, não renderiza
  if (!dimensionInsight || !isBelow) return null;

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900">{dimension.name}</h3>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Oportunidade
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Situação:</span>
            <span className="text-sm font-medium">
              Empresa {dimension.score.toFixed(1)} vs Setor {dimension.sectorAverage.toFixed(1)}
            </span>
          </div>
          
          <div>
            <div className="flex items-start gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-gray-700">Insight:</span>
                <p className="text-sm text-gray-600 mt-1">{dimensionInsight.insight}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-start gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-gray-700">Ação Sugerida:</span>
                <p className="text-sm text-gray-600 mt-1">{dimensionInsight.action}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Impacto Estimado:</span>
              <span className="text-sm font-semibold text-purple-600">{dimensionInsight.impact} em valuation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MaturityInsightsProps {
  data: MaturityDimension[];
}

const MaturityInsights = ({ data }: MaturityInsightsProps) => {
  const belowAverageCount = data.filter(d => d.score < d.sectorAverage).length;
  
  if (belowAverageCount === 0) {
    return (
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Parabéns! Sua empresa está acima da média setorial
            </h3>
            <p className="text-gray-600">
              Continue mantendo os altos padrões de governança para sustentar a vantagem competitiva.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((dimension) => (
          <InsightCard key={dimension.name} dimension={dimension} />
        ))}
      </div>
    </div>
  );
};

export default MaturityInsights;