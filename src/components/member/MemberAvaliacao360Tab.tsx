import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Star, 
  Target, 
  ClipboardCheck, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for 360 evaluation
const mockEvaluationData = {
  currentScore: 82,
  previousScore: 77,
  level: "Excelente",
  evaluationDate: "Dezembro 2025",
  nextEvaluation: "Junho 2026",
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

// Quiz questions for self-assessment
const quizQuestions = [
  {
    id: "presence",
    dimension: "Presença",
    question: "Com que frequência você está presente nas reuniões do conselho?",
    options: [
      { label: "Sempre (100%)", score: 100 },
      { label: "Quase sempre (80-99%)", score: 85 },
      { label: "Frequentemente (60-79%)", score: 70 },
      { label: "Às vezes (menos de 60%)", score: 50 },
    ]
  },
  {
    id: "contribution",
    dimension: "Contribuição",
    question: "Como você avalia suas contribuições nas discussões?",
    options: [
      { label: "Contribuo ativamente em todos os temas", score: 100 },
      { label: "Contribuo na maioria dos temas relevantes", score: 85 },
      { label: "Contribuo ocasionalmente", score: 70 },
      { label: "Prefiro ouvir mais do que falar", score: 50 },
    ]
  },
  {
    id: "preparation",
    dimension: "Preparação",
    question: "Quanto tempo você dedica à preparação antes das reuniões?",
    options: [
      { label: "Leio todos os materiais com antecedência", score: 100 },
      { label: "Leio a maior parte dos materiais", score: 85 },
      { label: "Leio os materiais mais importantes", score: 70 },
      { label: "Tenho pouco tempo para preparação", score: 50 },
    ]
  },
  {
    id: "leadership",
    dimension: "Liderança",
    question: "Com que frequência você lidera discussões ou propõe novos temas?",
    options: [
      { label: "Frequentemente lidero discussões", score: 100 },
      { label: "Ocasionalmente proponho temas", score: 85 },
      { label: "Raramente tomo a liderança", score: 70 },
      { label: "Prefiro seguir a pauta estabelecida", score: 50 },
    ]
  },
  {
    id: "collaboration",
    dimension: "Colaboração",
    question: "Como você avalia seu trabalho em conjunto com outros conselheiros?",
    options: [
      { label: "Excelente - busco sempre o consenso", score: 100 },
      { label: "Bom - colaboro bem na maioria das vezes", score: 85 },
      { label: "Regular - poderia colaborar mais", score: 70 },
      { label: "Preciso melhorar neste aspecto", score: 50 },
    ]
  },
];

export function MemberAvaliacao360Tab() {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const totalSteps = quizQuestions.length;
  const scoreDiff = mockEvaluationData.currentScore - mockEvaluationData.previousScore;
  const isImproving = scoreDiff > 0;

  const handleQuizAnswer = (questionId: string, score: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: score }));
    
    // Auto-advance after 400ms
    setTimeout(() => {
      if (quizStep < totalSteps - 1) {
        setQuizStep(prev => prev + 1);
      }
    }, 400);
  };

  const handleSubmitQuiz = () => {
    const scores = Object.values(quizAnswers);
    if (scores.length < quizQuestions.length) {
      toast({
        title: "Questionário incompleto",
        description: "Por favor, responda todas as perguntas antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    setCalculatedScore(avgScore);
    setQuizSubmitted(true);
    setShowQuiz(false);
    
    toast({
      title: "Autoavaliação enviada!",
      description: `Seu score calculado é ${avgScore}/100.`,
    });
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: "Excepcional", color: "text-green-600" };
    if (score >= 80) return { label: "Excelente", color: "text-blue-600" };
    if (score >= 70) return { label: "Bom", color: "text-yellow-600" };
    return { label: "Precisa Melhorar", color: "text-orange-600" };
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizStep(0);
    setQuizAnswers({});
  };

  const currentQuestion = quizQuestions[quizStep];
  const progressPercentage = ((quizStep) / totalSteps) * 100;
  const allQuestionsAnswered = Object.keys(quizAnswers).length === totalSteps;

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Score Atual (Avaliação 360°)</p>
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
      </div>

      {/* Self-Assessment Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Autoavaliação Rápida
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Realize sua autoavaliação para comparar com a avaliação 360° e identificar gaps de percepção
          </p>
        </CardHeader>
        <CardContent>
          {quizSubmitted && calculatedScore !== null ? (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seu Score de Autoavaliação</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-green-600">{calculatedScore}</span>
                        <span className="text-xl text-muted-foreground">/100</span>
                      </div>
                      <Badge className={`mt-1 ${getScoreLevel(calculatedScore).color} bg-transparent`}>
                        {getScoreLevel(calculatedScore).label}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Comparativo</p>
                    <div className={`text-lg font-semibold ${
                      calculatedScore >= mockEvaluationData.currentScore ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {calculatedScore >= mockEvaluationData.currentScore ? '+' : ''}
                      {calculatedScore - mockEvaluationData.currentScore}pts
                    </div>
                    <p className="text-xs text-muted-foreground">vs avaliação 360°</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              onClick={startQuiz}
              className="w-full"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Iniciar Autoavaliação
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Autoavaliação
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pergunta {quizStep + 1} de {totalSteps}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Current Question */}
          <div className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {currentQuestion.dimension}
              </Badge>
            </div>
            <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <Button
                  key={opt.score}
                  variant={quizAnswers[currentQuestion.id] === opt.score ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-4 px-4"
                  onClick={() => handleQuizAnswer(currentQuestion.id, opt.score)}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      quizAnswers[currentQuestion.id] === opt.score 
                        ? 'border-primary-foreground bg-primary-foreground' 
                        : 'border-muted-foreground'
                    }`}>
                      {quizAnswers[currentQuestion.id] === opt.score && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                    {opt.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => setQuizStep(prev => Math.max(0, prev - 1))}
              disabled={quizStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
            </Button>
            
            {quizStep === totalSteps - 1 ? (
              <Button 
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" /> Calcular Meu Score
              </Button>
            ) : (
              <Button 
                onClick={() => setQuizStep(prev => prev + 1)}
                disabled={!quizAnswers[currentQuestion.id]}
              >
                Próxima <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Feedback - with Lucide icons instead of emojis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvaluationData.feedback.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {section.category === "Pontos Fortes" ? (
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                ) : (
                  <Target className="h-5 w-5 text-amber-600" />
                )}
                {section.category}
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
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução Histórica
          </CardTitle>
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
