import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Users, Star, Target } from "lucide-react";

// Mock data for 360 evaluation
const mockEvaluationData = {
  currentScore: 82,
  previousScore: 77,
  level: "Excelente",
  evaluationDate: "Dezembro 2025",
  nextEvaluation: "Junho 2026",
  respondents: 12,
  dimensions: [
    { name: "Presença", score: 85, average: 78 },
    { name: "Contribuição", score: 88, average: 75 },
    { name: "Liderança", score: 75, average: 72 },
    { name: "Colaboração", score: 90, average: 80 },
    { name: "Visão Estratégica", score: 80, average: 77 },
    { name: "Comunicação", score: 78, average: 74 },
  ],
  radarData: [
    { dimension: "Presença", você: 85, média: 78 },
    { dimension: "Contribuição", você: 88, média: 75 },
    { dimension: "Liderança", você: 75, média: 72 },
    { dimension: "Colaboração", você: 90, média: 80 },
    { dimension: "Visão Estratégica", você: 80, média: 77 },
    { dimension: "Comunicação", você: 78, média: 74 },
  ],
  feedback: [
    {
      category: "Pontos Fortes",
      items: [
        "Excelente capacidade de síntese e análise crítica",
        "Sempre preparado para as reuniões com contribuições relevantes",
        "Promove debates construtivos e busca consenso",
      ]
    },
    {
      category: "Oportunidades de Melhoria",
      items: [
        "Poderia participar mais ativamente das reuniões de comitês",
        "Desenvolver maior proatividade em temas de ESG",
      ]
    }
  ],
  historicalScores: [
    { period: "Jun 2024", score: 72 },
    { period: "Dez 2024", score: 77 },
    { period: "Jun 2025", score: 80 },
    { period: "Dez 2025", score: 82 },
  ]
};

export function MemberAvaliacao360Tab() {
  const scoreDiff = mockEvaluationData.currentScore - mockEvaluationData.previousScore;
  const isImproving = scoreDiff > 0;

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Score Atual</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">{mockEvaluationData.currentScore}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-primary/20 text-primary"
                >
                  {mockEvaluationData.level}
                </Badge>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                  {isImproving ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="text-lg font-semibold">{isImproving ? '+' : ''}{scoreDiff}pts</span>
                </div>
                <p className="text-xs text-muted-foreground">vs avaliação anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Avaliação</p>
                <p className="font-semibold">{mockEvaluationData.evaluationDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliadores</p>
                <p className="font-semibold">{mockEvaluationData.respondents} respondentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart and Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Análise por Dimensão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockEvaluationData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Você"
                    dataKey="você"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Média do Conselho"
                    dataKey="média"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted-foreground))"
                    fillOpacity={0.1}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Detalhamento por Dimensão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockEvaluationData.dimensions.map((dim) => (
              <div key={dim.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dim.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">{dim.score}</span>
                    <span className="text-muted-foreground text-xs">
                      (média: {dim.average})
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={dim.score} className="h-2" />
                  <div 
                    className="absolute top-0 h-2 w-0.5 bg-muted-foreground/50"
                    style={{ left: `${dim.average}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvaluationData.feedback.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="text-lg">
                {section.category === "Pontos Fortes" ? "💪" : "🎯"} {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      section.category === "Pontos Fortes" ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historical Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução Histórica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4 h-32">
            {mockEvaluationData.historicalScores.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 relative"
                  style={{ height: `${item.score}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold">
                    {item.score}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{item.period}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberAvaliacao360Tab;
