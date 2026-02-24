import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Trophy, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

interface MaturityGlobalIndicatorProps {
  data: MaturityDimension[];
}

const MaturityGlobalIndicator = ({ data }: MaturityGlobalIndicatorProps) => {
  const companyAverage = data.reduce((sum, item) => sum + item.score, 0) / data.length;
  const sectorAverage = data.reduce((sum, item) => sum + item.sectorAverage, 0) / data.length;
  
  // Calcular percentil baseado na diferença
  const difference = companyAverage - sectorAverage;
  const currentPercentile = Math.max(10, Math.min(90, 50 + (difference * 10)));
  
  // Projeção se seguir recomendações
  const belowAverageCount = data.filter(d => d.score < d.sectorAverage).length;
  const projectedImprovement = belowAverageCount * 0.3; // Melhoria estimada
  const projectedPercentile = Math.min(90, currentPercentile + (projectedImprovement * 10));
  
  // Impacto financeiro estimado
  const totalImpact = belowAverageCount * 5; // R$ 5M por dimensão abaixo da média
  
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return "text-green-600";
    if (percentile >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 75) return <Trophy className="h-5 w-5 text-green-600" />;
    if (percentile >= 50) return <Target className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getPercentileDescription = (percentile: number) => {
    if (percentile >= 80) return "Avançado - Liderança setorial";
    if (percentile >= 60) return "Sólido - Acima da média";
    if (percentile >= 40) return "Básico - Posicionamento mediano";
    if (percentile >= 20) return "Inicial - Abaixo da média";
    return "Embrionário - Precisa melhorar";
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Indicador Global de Maturidade
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Posição Atual */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getPercentileIcon(currentPercentile)}
            </div>
            <div className="text-2xl font-bold mb-1">
              <span className={getPercentileColor(currentPercentile)}>
                {Math.round(currentPercentile)}º
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Percentil Atual</div>
            <Badge variant="outline" className="text-xs">
              {getPercentileDescription(currentPercentile)}
            </Badge>
            <div className="mt-3">
              <Progress value={currentPercentile} className="h-2" />
            </div>
          </div>

          {/* Projeção */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(projectedPercentile)}º
            </div>
            <div className="text-sm text-gray-600 mb-2">Projeção em 12 meses</div>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              +{Math.round(projectedPercentile - currentPercentile)} percentis
            </Badge>
            <div className="mt-3">
              <Progress value={projectedPercentile} className="h-2" />
            </div>
          </div>

          {/* Impacto Financeiro */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              +R$ {totalImpact}M
            </div>
            <div className="text-sm text-gray-600 mb-2">Impacto em Valuation</div>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              +{Math.round((totalImpact / 50) * 100)}% múltiplo EBITDA
            </Badge>
            
            {belowAverageCount > 0 && (
              <div className="mt-3 text-xs text-gray-500">
                {belowAverageCount} dimensões abaixo da média
              </div>
            )}
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="mt-6 p-4 bg-white/50 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-2">Resumo Executivo</h4>
          <p className="text-sm text-gray-700">
            Sua empresa está no <strong>{Math.round(currentPercentile)}º percentil</strong> de maturidade setorial.
            {belowAverageCount > 0 ? (
              <>
                {" "}Implementando as {belowAverageCount} recomendações prioritárias, pode alcançar o{" "}
                <strong>{Math.round(projectedPercentile)}º percentil</strong> em 12 meses, com impacto estimado de{" "}
                <strong>R$ {totalImpact}M no valuation</strong>.
              </>
            ) : (
              " Mantendo os altos padrões atuais, continue sustentando a vantagem competitiva no setor."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaturityGlobalIndicator;