import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HistoricalAssessment } from "@/data/mockHistoricalData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, TrendingDown, Target, CheckCircle2, AlertCircle, Calendar, User, Building2, FileText, Download } from "lucide-react";
import { generateIGBCPDFReport } from "@/components/IGBCPDFReport";
import { useToast } from "@/hooks/use-toast";

interface ExecutiveReportProps {
  assessment: HistoricalAssessment;
  isLatest?: boolean;
}

const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ assessment, isLatest = false }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const getMaturityBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'básico':
        return 'bg-destructive text-destructive-foreground';
      case 'sólido':
        return 'bg-secondary text-secondary-foreground';
      case 'avançado':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const dimensionData = [
    { name: "Sócios", score: (assessment.result.pontuacao_dimensoes["Sócios"] || 0) * 5, fullMark: 5 },
    { name: "Conselho", score: (assessment.result.pontuacao_dimensoes["Conselho"] || 0) * 5, fullMark: 5 },
    { name: "Diretoria", score: (assessment.result.pontuacao_dimensoes["Diretoria"] || 0) * 5, fullMark: 5 },
    { name: "Órgãos de fiscalização e controle", score: (assessment.result.pontuacao_dimensoes["Órgãos de fiscalização e controle"] || 0) * 5, fullMark: 5 },
    { name: "Conduta e conflitos de interesses", score: (assessment.result.pontuacao_dimensoes["Conduta e conflitos de interesses"] || 0) * 5, fullMark: 5 }
  ];

  const concentratedControlScore = (assessment.result.pontuacao_empresas_controle_concentrado?.percentual || 0) * 100;

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateIGBCPDFReport(assessment);
      toast({
        title: "PDF gerado!",
        description: "PDF gerado e baixado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório Executivo</h1>
          <p className="text-muted-foreground">Avaliação de Maturidade IBGC - {assessment.period}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                Gerando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Gerar PDF
              </>
            )}
          </Button>
          {isLatest && (
            <Badge variant="outline" className="bg-accent text-accent-foreground">
              Mais Recente
            </Badge>
          )}
        </div>
      </div>

      {/* Company and Assessment Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="font-semibold">{assessment.companyData.nome}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Data da Avaliação</p>
                <p className="font-semibold">{assessment.date.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Analista</p>
                <p className="font-semibold">{assessment.analyst}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pontuação Geral</span>
            <Badge className={getMaturityBadgeColor(assessment.result.estagio)}>
              {assessment.result.estagio}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">
              {(assessment.result.pontuacao_total * 100).toFixed(1)}%
            </div>
            <div className="text-xl text-muted-foreground mb-4">Pontuação Geral</div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${assessment.result.pontuacao_total * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Nível de Maturidade: <strong>{assessment.result.estagio}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pontuação por Dimensão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={dimensionData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar
                  name="Pontuação"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Dimensão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dimensionData.map((dimension, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dimension.name}</span>
                  <span className="text-sm font-bold">{dimension.score.toFixed(1)}/5.0</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(dimension.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Concentrated Control Business Score */}
      {concentratedControlScore > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Empresas de Controle Concentrado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {concentratedControlScore}%
              </div>
              <p className="text-muted-foreground">
                Pontuação específica para aspectos de empresas de controle concentrado
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Principais Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessment.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Recomendações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Próximos Passos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessment.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveReport;