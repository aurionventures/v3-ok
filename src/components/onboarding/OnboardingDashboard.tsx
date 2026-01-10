import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Building2,
  FileText,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Zap,
  Trophy,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnboardingProgress, NextStep } from '@/types/onboarding';

interface OnboardingDashboardProps {
  progress: OnboardingProgress | null;
  score: number;
  nextSteps: NextStep[];
  onNavigateToPhase: (phase: 1 | 2 | 3) => void;
  onLaunchMOAT: () => void;
  isReadyForUse: boolean;
}

interface PhaseCardProps {
  phase: number;
  title: string;
  description: string;
  score: number;
  completed: boolean;
  estimatedTime: number;
  onClick: () => void;
}

function PhaseCard({
  phase,
  title,
  description,
  score,
  completed,
  estimatedTime,
  onClick
}: PhaseCardProps) {
  const Icon = phase === 1 ? Building2 : phase === 2 ? FileText : Target;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        completed && 'border-green-500/50 bg-green-50/30'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                completed ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
              )}
            >
              {completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base">Fase {phase}</CardTitle>
              <CardDescription>{title}</CardDescription>
            </div>
          </div>
          <Badge variant={completed ? 'default' : 'outline'}>
            {completed ? 'Completa' : `~${estimatedTime} min`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Progress value={score} className="w-24 h-2" />
            <span className="text-sm font-medium">{score}%</span>
          </div>
          <Button variant="ghost" size="sm">
            {completed ? 'Revisar' : 'Iniciar'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Suficiente';
    return 'Incompleto';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000', getScoreColor())}
        />
      </svg>
      <div className="absolute text-center">
        <span className={cn('text-3xl font-bold', getScoreColor())}>{score}</span>
        <p className="text-xs text-muted-foreground">{getScoreLabel()}</p>
      </div>
    </div>
  );
}

export function OnboardingDashboard({
  progress,
  score,
  nextSteps,
  onNavigateToPhase,
  onLaunchMOAT,
  isReadyForUse
}: OnboardingDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ScoreCircle score={score} />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">
                Configure sua Base de Conhecimento
              </h1>
              <p className="text-muted-foreground mb-4">
                Quanto mais contexto fornecemos, mais inteligente o MOAT Engine sera desde o dia 1.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge
                  variant={progress?.phase_1_basic_setup ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {progress?.phase_1_basic_setup ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  Fase 1: {progress?.phase_1_basic_setup ? 'Completa' : 'Pendente'}
                </Badge>
                <Badge
                  variant={progress?.phase_2_document_upload ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {progress?.phase_2_document_upload ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  Fase 2: {progress?.phase_2_document_upload ? 'Completa' : 'Pendente'}
                </Badge>
                <Badge
                  variant={progress?.phase_3_strategic_context ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {progress?.phase_3_strategic_context ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  Fase 3: {progress?.phase_3_strategic_context ? 'Completa' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <PhaseCard
          phase={1}
          title="Setup Basico"
          description="Informacoes essenciais da empresa: dados cadastrais, setor, estrutura e sistemas."
          score={progress?.basic_setup_score || 0}
          completed={progress?.phase_1_basic_setup || false}
          estimatedTime={15}
          onClick={() => onNavigateToPhase(1)}
        />
        <PhaseCard
          phase={2}
          title="Upload de Documentos"
          description="Estatuto, regimentos, ATAs antigas e outros documentos de governanca."
          score={progress?.document_upload_score || 0}
          completed={progress?.phase_2_document_upload || false}
          estimatedTime={30}
          onClick={() => onNavigateToPhase(2)}
        />
        <PhaseCard
          phase={3}
          title="Contexto Estrategico"
          description="Missao, visao, objetivos estrategicos, riscos conhecidos e stakeholders."
          score={progress?.strategic_context_score || 0}
          completed={progress?.phase_3_strategic_context || false}
          estimatedTime={20}
          onClick={() => onNavigateToPhase(3)}
        />
      </div>

      {/* Missing Critical Data Alert */}
      {progress?.missing_critical_data && progress.missing_critical_data.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dados Criticos Faltando</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {progress.missing_critical_data.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Proximos Passos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Completar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready to Launch */}
      {isReadyForUse && (
        <Card className="border-green-500/50 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Pronto para Comecar!
                  </h3>
                  <p className="text-sm text-green-600">
                    Voce ja tem contexto suficiente para o MOAT Engine funcionar.
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={onLaunchMOAT} className="bg-green-600 hover:bg-green-700">
                <Zap className="mr-2 h-5 w-5" />
                Ativar MOAT Engine
              </Button>
            </div>
            <p className="text-xs text-green-600 mt-4 text-center md:text-right">
              Voce pode continuar enriquecendo sua base de conhecimento a qualquer momento.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Score Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Entenda o Knowledge Base Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm">0-49: Incompleto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm">50-69: Suficiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">70-89: Bom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">90-100: Excelente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

