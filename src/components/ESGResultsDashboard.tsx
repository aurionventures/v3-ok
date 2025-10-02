import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { RotateCcw, Download, Share2, TrendingUp, Target, Leaf, Users, Scale } from 'lucide-react';
import { ESGMaturityResult } from '@/types/esgMaturity';
import { generateESGRecommendations } from '@/utils/esgMaturityCalculator';
import { generateESGPDFReport } from '@/components/ESGPDFReport';
import ESGHistoryModal from '@/components/ESGHistoryModal';
import { toast } from '@/hooks/use-toast';

interface ESGResultsDashboardProps {
  results: ESGMaturityResult;
  onRestart: () => void;
}

const ESGResultsDashboard: React.FC<ESGResultsDashboardProps> = ({ results, onRestart }) => {
  const { overallScore, maturityLevel, pillarScores } = results;

  const pillarIconMap = {
    environmental: Leaf,
    social: Users,
    governance: Scale,
    strategy: Target
  };

  const pillarData = Object.entries(pillarScores).map(([key, data]) => ({
    name: data.title,
    score: data.score,
    percentage: data.percentage,
    icon: pillarIconMap[key as keyof typeof pillarIconMap],
    key
  }));

  const handleDownloadPDF = async () => {
    try {
      await generateESGPDFReport(results);
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado para seus downloads.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const radarData = pillarData.map(item => ({
    subject: item.name,
    score: item.score,
    fullMark: 6
  }));

  const recommendations = generateESGRecommendations(results);

  const getMaturityDescription = () => {
    switch (maturityLevel.level) {
      case 1:
        return "Sua empresa está no estágio inicial da jornada ESG. Foque em estabelecer políticas básicas e conformidade regulatória.";
      case 2:
        return "Sua empresa está desenvolvendo práticas ESG reativas. É hora de estruturar programas mais robustos e proativos.";
      case 3:
        return "Sua empresa tem uma abordagem estratégica para ESG. Continue expandindo e integrando essas práticas ao negócio.";
      case 4:
        return "Sua empresa demonstra maturidade inclusiva em ESG. Foque em engajar stakeholders e criar valor compartilhado.";
      case 5:
        return "Sua empresa está integrada em ESG. Continue liderando e inovando em sustentabilidade.";
      case 6:
        return "Parabéns! Sua empresa é regenerativa em ESG. Você é um líder em transformação sistêmica.";
      default:
        return "Continue sua jornada de melhoria contínua em ESG.";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return '#22c55e'; // green
    if (score >= 4) return '#3b82f6'; // blue
    if (score >= 3) return '#eab308'; // yellow
    if (score >= 2) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados da Avaliação de Maturidade ESG</h1>
          <p className="text-gray-600">Análise completa baseada em 90 perguntas distribuídas em 4 pilares principais</p>
        </div>

        {/* Score Geral */}
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Score Geral de Maturidade ESG</CardTitle>
            <CardDescription>Avaliação {results.answeredQuestions} de {results.totalQuestions} perguntas</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={getScoreColor(overallScore)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(overallScore / 6) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{overallScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">de 6.0</div>
                </div>
              </div>
            </div>
            
            <div>
              <Badge className={`${maturityLevel.color} text-white text-lg px-4 py-2`}>
                Nível {maturityLevel.level}: {maturityLevel.name}
              </Badge>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
                {getMaturityDescription()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scores por Pilar */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Scores por Pilar
              </CardTitle>
              <CardDescription>Comparação do desempenho em cada dimensão ESG</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pillarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 6]} />
                  <Tooltip 
                    formatter={(value) => [Number(value).toFixed(2), 'Score']}
                    labelFormatter={(label) => `Pilar: ${label}`}
                  />
                  <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Análise Radar</CardTitle>
              <CardDescription>Visão 360° do desempenho ESG</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={12} />
                  <PolarRadiusAxis angle={90} domain={[0, 6]} fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento por Pilar */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Pilar</CardTitle>
            <CardDescription>Análise detalhada do desempenho em cada dimensão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {pillarData.map((pillar, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center">
                      {React.createElement(pillar.icon, { 
                        className: "h-5 w-5 mr-2 text-green-600" 
                      })}
                      {pillar.name}
                    </h3>
                    <Badge variant="outline">{pillar.score.toFixed(1)}/6.0</Badge>
                  </div>
                  <Progress value={pillar.percentage} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">
                    {pillar.percentage.toFixed(0)}% do potencial máximo
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recomendações Prioritárias
              </CardTitle>
              <CardDescription>Ações sugeridas para evoluir na jornada ESG</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{rec.pillar}</h3>
                      <Badge variant={rec.priority === 'Alta' ? 'destructive' : rec.priority === 'Média' ? 'default' : 'secondary'}>
                        Prioridade {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{rec.action}</p>
                    <p className="text-xs text-gray-500">{rec.impact}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Score atual: {rec.currentScore.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">→</span>
                      <span className="text-xs text-green-600">Meta: {rec.targetScore.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximos Passos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Roadmap para Evolução
            </CardTitle>
            <CardDescription>Plano sugerido para avançar para o próximo nível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">Curto Prazo (3-6 meses)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Implementar políticas básicas ESG</li>
                    <li>• Estabelecer métricas de monitoramento</li>
                    <li>• Capacitar equipes internas</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-blue-600 mb-2">Médio Prazo (6-12 meses)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Integrar ESG à estratégia</li>
                    <li>• Engajar stakeholders</li>
                    <li>• Implementar programas estruturados</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-purple-600 mb-2">Longo Prazo (1-2 anos)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Liderar transformação setorial</li>
                    <li>• Inovar em soluções sustentáveis</li>
                    <li>• Alcançar impacto regenerativo</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onRestart} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" />
            Nova Avaliação
          </Button>
          <ESGHistoryModal />
          <Button onClick={handleDownloadPDF} size="lg" className="bg-green-600 hover:bg-green-700">
            <Download className="h-5 w-5 mr-2" />
            Baixar Relatório
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ESGResultsDashboard;