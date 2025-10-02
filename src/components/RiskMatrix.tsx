import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { IBGCRisk } from "@/data/riskData";

interface RiskMatrixProps {
  risks: IBGCRisk[];
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  // Matriz 5x3: Impacto (1-5) x Probabilidade (1-3)
  const impactLabels = ["", "Insignificante", "Menor", "Moderado", "Maior", "Catastrófico"];
  const probabilityLabels = ["Alta", "Média", "Baixa"];
  
  const getRiskColor = (impact: number, probability: number) => {
    // Convertendo probabilidade de escala 1-5 para 1-3
    const adjustedProb = probability <= 2 ? 3 : probability <= 3 ? 2 : 1; // Baixa=3, Média=2, Alta=1
    
    if (impact >= 4 && adjustedProb <= 2) return "bg-red-500"; // Crítico
    if (impact >= 3 && adjustedProb <= 2) return "bg-red-400"; // Alto
    if (impact >= 3 || adjustedProb <= 2) return "bg-yellow-400"; // Médio
    return "bg-green-400"; // Baixo
  };
  
  const getCellRisks = (impact: number, probability: number) => {
    return risks.filter(risk => {
      const adjustedProb = risk.probability <= 2 ? 3 : risk.probability <= 3 ? 2 : 1;
      return risk.impact === impact && adjustedProb === probability;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Matriz de Riscos - Impacto x Probabilidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Título dos eixos */}
          <div className="absolute -left-16 top-1/2 transform -rotate-90 text-sm font-medium text-muted-foreground">
            Probabilidade
          </div>
          <div className="text-center mb-4 text-sm font-medium text-muted-foreground">
            Impacto
          </div>
          
          <TooltipProvider>
            <div className="grid grid-cols-6 gap-1 max-w-4xl mx-auto">
              {/* Header com labels de impacto */}
              <div></div>
              {impactLabels.slice(1).map((label, idx) => (
                <div key={idx} className="text-xs text-center font-medium p-2 text-muted-foreground">
                  {label}
                </div>
              ))}
              
              {/* Linhas da matriz */}
              {probabilityLabels.map((probLabel, probIdx) => (
                <React.Fragment key={probIdx}>
                  {/* Label da probabilidade */}
                  <div className="text-xs font-medium p-2 text-muted-foreground flex items-center justify-center">
                    {probLabel}
                  </div>
                  
                  {/* Células da matriz */}
                  {[1, 2, 3, 4, 5].map((impact) => {
                    const cellRisks = getCellRisks(impact, probIdx + 1);
                    const cellColor = getRiskColor(impact, probIdx + 1);
                    
                    return (
                      <Tooltip key={impact}>
                        <TooltipTrigger asChild>
                          <div
                            className={`min-h-[80px] border border-gray-300 rounded-lg p-2 cursor-pointer hover:opacity-80 transition-opacity ${cellColor} relative`}
                          >
                            {cellRisks.length > 0 && (
                              <div className="space-y-1">
                                {cellRisks.slice(0, 2).map((risk) => (
                                  <Badge
                                    key={risk.id}
                                    variant="secondary"
                                    className="text-xs text-white bg-black/20 hover:bg-black/30"
                                  >
                                    R{risk.id}
                                  </Badge>
                                ))}
                                {cellRisks.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs text-white bg-black/20"
                                  >
                                    +{cellRisks.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <div className="space-y-2">
                            <p className="font-medium">
                              Impacto: {impact} | Probabilidade: {probLabel}
                            </p>
                            {cellRisks.length > 0 ? (
                              cellRisks.map((risk) => (
                                <div key={risk.id} className="text-sm">
                                  <p className="font-medium">{risk.title}</p>
                                  <p className="text-muted-foreground">
                                    Responsável: {risk.responsible}
                                  </p>
                                  {risk.estimatedResolution && (
                                    <p className="text-muted-foreground">
                                      Resolução: {risk.estimatedResolution}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum risco nesta célula</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </TooltipProvider>
          
          {/* Legenda */}
          <div className="mt-6 flex justify-center">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Baixo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Médio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>Alto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Crítico</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskMatrix;