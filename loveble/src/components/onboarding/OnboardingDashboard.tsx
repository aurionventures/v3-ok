// =====================================================
// ONBOARDING DASHBOARD
// Visao geral do progresso e Knowledge Base Score
// =====================================================

import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Target, Users, TrendingUp, ChevronRight, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOnboardingProgress, useDocumentLibrary, useDemoMode } from '@/hooks/useOnboardingMock';

interface NextStep {
  priority: number;
  title: string;
  description: string;
}

interface OnboardingProgress {
  phase_1_basic_setup: boolean;
  phase_2_document_upload: boolean;
  phase_3_strategic_context: boolean;
  basic_setup_score: number;
  document_upload_score: number;
  strategic_context_score: number;
  overall_score: number;
  missing_critical_data?: string[];
  next_steps?: NextStep[];
}

interface OnboardingDashboardProps {
  onNavigateToPhase: (phase: number) => void;
  // Optional props for integrated mode in Settings
  progress?: OnboardingProgress;
  score?: number;
  nextSteps?: NextStep[];
  onLaunchMOAT?: () => Promise<void>;
  isReadyForUse?: boolean;
}

export function OnboardingDashboard({ onNavigateToPhase }: OnboardingDashboardProps) {
  const { progress, isLoading } = useOnboardingProgress();
  const { documents } = useDocumentLibrary();
  const { mode, setMode } = useDemoMode();
  const [showDemoControls, setShowDemoControls] = useState(false);

  if (isLoading || !progress) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Razoavel';
    return 'Iniciante';
  };

  const getPhaseStatus = (completed: boolean) => {
    return completed ? (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completo
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    );
  };

  const phases = [
    {
      number: 1,
      title: 'Setup Basico',
      description: 'Informacoes essenciais da empresa',
      completed: progress.phase_1_basic_setup,
      score: progress.basic_setup_score,
      icon: FileText
    },
    {
      number: 2,
      title: 'Documentos',
      description: `${documents.length} documentos carregados`,
      completed: progress.phase_2_document_upload,
      score: progress.document_upload_score,
      icon: Target
    },
    {
      number: 3,
      title: 'Contexto Estrategico',
      description: 'Missao, visao e objetivos',
      completed: progress.phase_3_strategic_context,
      score: progress.strategic_context_score,
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Mode Controls */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDemoControls(!showDemoControls)}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Modo Demo
        </Button>
      </div>

      {showDemoControls && (
        <Card className="border-dashed border-2 border-amber-400 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-amber-800">Resetar demonstracao:</span>
              <Button
                size="sm"
                variant={mode === 'empty' ? 'default' : 'outline'}
                onClick={() => setMode('empty')}
              >
                Vazio
              </Button>
              <Button
                size="sm"
                variant={mode === 'partial' ? 'default' : 'outline'}
                onClick={() => setMode('partial')}
              >
                Parcial
              </Button>
              <Button
                size="sm"
                variant={mode === 'complete' ? 'default' : 'outline'}
                onClick={() => setMode('complete')}
              >
                Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Card - Knowledge Base Score */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-slate-300 mb-1">Knowledge Base Score</h2>
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-bold ${getScoreColor(progress.overall_score).replace('text-', 'text-')}`}>
                  {progress.overall_score}
                </span>
                <span className="text-2xl text-slate-400">/100</span>
              </div>
              <p className="text-slate-300 mt-2">
                Status: <span className="font-semibold">{getScoreLabel(progress.overall_score)}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Quanto maior o score, melhor será a qualidade dos insights e recomendações
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${(progress.overall_score / 100) * 440} 440`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phases Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {phases.map((phase) => {
          const Icon = phase.icon;
          return (
            <Card
              key={phase.number}
              className={`cursor-pointer transition-all hover:shadow-md ${
                phase.completed ? 'border-green-200 bg-green-50/50' : ''
              }`}
              onClick={() => onNavigateToPhase(phase.number)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${phase.completed ? 'bg-green-100' : 'bg-slate-100'}`}>
                      <Icon className={`w-5 h-5 ${phase.completed ? 'text-green-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Fase {phase.number}</CardTitle>
                      <CardDescription className="text-xs">{phase.title}</CardDescription>
                    </div>
                  </div>
                  {getPhaseStatus(phase.completed)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{phase.description}</span>
                    <span className="font-medium">{phase.score}%</span>
                  </div>
                  <Progress value={phase.score} className="h-2" />
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  {phase.completed ? 'Revisar' : 'Continuar'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {progress.missing_critical_data && progress.missing_critical_data.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dados Criticos Faltando</AlertTitle>
          <AlertDescription>
            Complete os seguintes campos para melhorar a qualidade dos insights:
            <ul className="list-disc list-inside mt-2">
              {progress.missing_critical_data.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Next Steps */}
      {progress.next_steps && progress.next_steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proximos Passos</CardTitle>
            <CardDescription>
              Acoes recomendadas para melhorar seu Knowledge Base Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.next_steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {step.priority}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

export default OnboardingDashboard;
