// =====================================================
// KNOWLEDGE BASE - ONBOARDING WIZARD
// Pagina principal do sistema de carga inicial de contexto
// =====================================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Database, FileText, Target, CheckCircle, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  OnboardingDashboard,
  Phase1BasicSetup,
  Phase2DocumentUpload,
  Phase3StrategicContext
} from '@/components/onboarding';
import { useOnboardingProgress, useCompanyProfile } from '@/hooks/useOnboardingMock';
import { ONBOARDING_STEPS } from '@/types/onboarding';

type OnboardingStepId = 'welcome' | 'phase-1-basic' | 'phase-2-documents' | 'phase-3-strategic' | 'processing' | 'complete';

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { progress, isLoading } = useOnboardingProgress();
  const { profile } = useCompanyProfile();
  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>('welcome');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Check URL params for direct navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'phase-1') setCurrentStepId('phase-1-basic');
    else if (tab === 'phase-2') setCurrentStepId('phase-2-documents');
    else if (tab === 'phase-3') setCurrentStepId('phase-3-strategic');
    else if (tab === 'dashboard') setCurrentStepId('complete');
  }, [searchParams]);

  // Determine initial step based on progress
  useEffect(() => {
    if (!isLoading && progress) {
      if (progress.status === 'completed' || progress.overall_score >= 50) {
        setCurrentStepId('complete');
      } else if (progress.phase_2_document_upload) {
        setCurrentStepId('phase-3-strategic');
      } else if (progress.phase_1_basic_setup) {
        setCurrentStepId('phase-2-documents');
      }
    }
  }, [isLoading, progress]);

  // Simulate processing
  useEffect(() => {
    if (currentStepId === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setCurrentStepId('complete');
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentStepId]);

  const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.id === currentStepId);

  const navigateToPhase = (phase: number) => {
    if (phase === 1) setCurrentStepId('phase-1-basic');
    else if (phase === 2) setCurrentStepId('phase-2-documents');
    else if (phase === 3) setCurrentStepId('phase-3-strategic');
  };

  const renderWelcomeScreen = () => (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Bem-vindo a Knowledge Base</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Configure sua base de conhecimento em 3 etapas simples para obter o maximo do MOAT Engine.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 py-8">
        {[
          {
            icon: FileText,
            title: 'Fase 1: Setup Basico',
            description: 'Informacoes essenciais da empresa',
            time: '15 min'
          },
          {
            icon: Database,
            title: 'Fase 2: Documentos',
            description: 'Upload de documentos historicos',
            time: '30 min'
          },
          {
            icon: Target,
            title: 'Fase 3: Estrategia',
            description: 'Contexto estrategico e objetivos',
            time: '20 min'
          }
        ].map((phase, index) => {
          const Icon = phase.icon;
          return (
            <Card key={index} className="text-left">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{phase.title}</CardTitle>
                    <CardDescription className="text-xs">{phase.time}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{phase.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <Button size="lg" onClick={() => setCurrentStepId('phase-1-basic')}>
          Comecar Agora
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Tempo estimado total: ~65 minutos
        </p>
      </div>

      {progress?.overall_score && progress.overall_score > 0 && (
        <Card className="mt-8 max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Progresso anterior detectado</p>
            <div className="flex items-center gap-4">
              <Progress value={progress.overall_score} className="flex-1" />
              <span className="font-bold">{progress.overall_score}%</span>
            </div>
            <Button variant="link" className="mt-2" onClick={() => setCurrentStepId('complete')}>
              Ir para Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProcessingScreen = () => (
    <div className="max-w-xl mx-auto text-center space-y-8 py-12">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Processando sua Knowledge Base</h1>
        <p className="text-muted-foreground">
          Estamos analisando os dados e preparando o MOAT Engine...
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={processingProgress} className="h-3" />
        <p className="text-sm font-medium">{processingProgress}%</p>
      </div>

      <div className="space-y-3 text-left max-w-md mx-auto">
        {[
          { text: 'Validando dados basicos', done: processingProgress >= 20 },
          { text: 'Processando documentos', done: processingProgress >= 40 },
          { text: 'Extraindo entidades', done: processingProgress >= 60 },
          { text: 'Gerando embeddings', done: processingProgress >= 80 },
          { text: 'Configurando MOAT Engine', done: processingProgress >= 100 }
        ].map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {step.done ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
            )}
            <span className={step.done ? 'text-green-700' : 'text-muted-foreground'}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStepId) {
      case 'welcome':
        return renderWelcomeScreen();
      
      case 'phase-1-basic':
        return (
          <Phase1BasicSetup
            onComplete={() => setCurrentStepId('phase-2-documents')}
            onBack={() => setCurrentStepId('welcome')}
          />
        );
      
      case 'phase-2-documents':
        return (
          <Phase2DocumentUpload
            onComplete={() => setCurrentStepId('phase-3-strategic')}
            onBack={() => setCurrentStepId('phase-1-basic')}
          />
        );
      
      case 'phase-3-strategic':
        return (
          <Phase3StrategicContext
            onComplete={() => setCurrentStepId('processing')}
            onBack={() => setCurrentStepId('phase-2-documents')}
          />
        );
      
      case 'processing':
        return renderProcessingScreen();
      
      case 'complete':
        return <OnboardingDashboard onNavigateToPhase={navigateToPhase} />;
      
      default:
        return <OnboardingDashboard onNavigateToPhase={navigateToPhase} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold">Knowledge Base</h1>
                <p className="text-xs text-muted-foreground">
                  {profile?.trade_name || profile?.legal_name || 'Nova Empresa'}
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            {currentStepId !== 'welcome' && currentStepId !== 'complete' && (
              <div className="hidden md:flex items-center gap-2">
                {ONBOARDING_STEPS.slice(1, 4).map((step, index) => {
                  const isActive = currentStepIndex === index + 1;
                  const isPast = currentStepIndex > index + 1;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isPast
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                      )}
                      <span className="hidden lg:inline">{step.title.replace('Fase ', '').replace(': ', ': ')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {currentStepId === 'complete' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Score:</span>
                <span className="font-bold text-lg">{progress?.overall_score || 0}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
