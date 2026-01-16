/**
 * Página de Boas-Vindas para Novos Usuários
 * Exibida após criação de senha no fluxo PLG
 * Oferece um guia de início guiado para começar do zero na Legacy OS
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  Users,
  Target,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { toast } from 'sonner';

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  completed?: boolean;
}

export default function WelcomeNewUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleStartChecklist = useCallback(() => {
    // Limpar flags de novo usuário
    localStorage.removeItem('just_created_password');
    localStorage.removeItem('from_contract_sign');
    
    // Redirecionar para checklist para iniciar preenchimento dos dados
    navigate('/document-checklist?tab=empresa&subtab=fase-1');
  }, [navigate]);

  useEffect(() => {
    // Verificar se realmente é um novo usuário
    const justCreatedPassword = localStorage.getItem('just_created_password');
    const fromContractSign = localStorage.getItem('from_contract_sign');
    
    if (!justCreatedPassword || !fromContractSign) {
      // Se não veio do fluxo de criação de senha, redirecionar para dashboard
      navigate('/dashboard');
      return;
    }

    // Redirecionar automaticamente para o Checklist após 2 segundos (passo 1/4)
    // Isso permite que o usuário veja a página de boas-vindas brevemente antes de ser direcionado
    const autoRedirectTimer = setTimeout(() => {
      // Verificar se o usuário ainda está no passo 1 (welcome)
      if (currentStep === 0) {
        handleStartChecklist();
      }
    }, 2000);

    return () => clearTimeout(autoRedirectTimer);
  }, [navigate, currentStep, handleStartChecklist]);

  const welcomeSteps: WelcomeStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo à Legacy OS!',
      description: 'Seu sistema operacional de governança está pronto para uso.',
      icon: Sparkles,
      action: () => {
        // Redirecionar automaticamente para o Checklist ao clicar em "Começar"
        handleStartChecklist();
      },
    },
    {
      id: 'what-is',
      title: 'O que é a Legacy OS?',
      description: 'Um sistema operacional de governança que organiza decisões, estrutura a sucessão e sustenta a continuidade da empresa ao longo do tempo.',
      icon: Building2,
      action: () => setCurrentStep(2),
    },
    {
      id: 'features',
      title: 'Principais Funcionalidades',
      description: 'Descubra as ferramentas que vão transformar a governança da sua empresa.',
      icon: Zap,
      action: () => setCurrentStep(3),
    },
    {
      id: 'get-started',
      title: 'Comece Aqui',
      description: 'Configure sua empresa e comece a usar a plataforma em minutos.',
      icon: Rocket,
      action: () => handleStartOnboarding(),
    },
  ];

  const handleStartOnboarding = () => {
    // Marcar passo como completo
    setCompletedSteps(prev => new Set([...prev, 'get-started']));
    
    // Limpar flags de novo usuário
    localStorage.removeItem('just_created_password');
    localStorage.removeItem('from_contract_sign');
    
    // Redirecionar para checklist para iniciar preenchimento dos dados
    navigate('/document-checklist?tab=empresa&subtab=fase-1');
  };

  const handleSkipToDashboard = () => {
    // Limpar flags
    localStorage.removeItem('just_created_password');
    localStorage.removeItem('from_contract_sign');
    
    // Redirecionar para dashboard
    navigate('/dashboard');
  };

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const currentIndex = welcomeSteps.findIndex(s => s.id === stepId);
    if (currentIndex < welcomeSteps.length - 1) {
      setCurrentStep(currentIndex + 1);
    }
  };

  const progress = ((currentStep + 1) / welcomeSteps.length) * 100;

  const renderStepContent = () => {
    const step = welcomeSteps[currentStep];
    const StepIcon = step.icon;

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <StepIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
              <p className="text-lg text-muted-foreground mb-4">{step.description}</p>
              {user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge variant="secondary">{user.company || 'Empresa'}</Badge>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleStartChecklist} className="gap-2">
                Começar <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleSkipToDashboard}>
                Pular e ir para o Dashboard
              </Button>
            </div>
          </div>
        );

      case 'what-is':
        return (
          <div className="space-y-6 py-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Governança Completa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gerencie conselhos, reuniões, documentos e compliance em uma única plataforma.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Inteligência Artificial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Inteligência Artificial atua com estrutura de multi-agentes que atuam para trazer governança e inteligência preditiva.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Crescimento Sustentável</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ferramentas para escalar sua governança e preparar sua empresa para o futuro.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
              <Button onClick={() => handleCompleteStep(step.id)} className="gap-2">
                Próximo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6 py-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Inteligência Artificial</CardTitle>
                      <CardDescription>Multi-agentes que trazem governança e inteligência preditiva</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Conselhos e Reuniões</CardTitle>
                      <CardDescription>Gerencie conselhos, membros e atas de reuniões</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Documentos e Compliance</CardTitle>
                      <CardDescription>Centralize documentos e gerencie checklists</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
              <Button onClick={() => handleCompleteStep(step.id)} className="gap-2">
                Próximo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'get-started':
        return (
          <div className="space-y-6 py-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  Guia de Início Rápido
                </CardTitle>
                <CardDescription>
                  Configure sua empresa em 3 etapas simples e comece a usar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Configurar Empresa</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione informações básicas da sua empresa e estrutura organizacional
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Criar Conselho</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure seu primeiro conselho e adicione membros da equipe
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Primeira Reunião</h3>
                    <p className="text-sm text-muted-foreground">
                      Agende sua primeira reunião e comece a usar todas as funcionalidades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
              <Button size="lg" onClick={handleStartOnboarding} className="gap-2">
                <Rocket className="h-4 w-4" />
                Começar Configuração Guiada
              </Button>
              <Button size="lg" variant="ghost" onClick={handleSkipToDashboard}>
                Pular e ir para o Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Bem-vindo à Legacy OS" />
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-2">
                Novo Usuário
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Passo {currentStep + 1} de {welcomeSteps.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% completo
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Main Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {welcomeSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-8'
                      : completedSteps.has(step.id)
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>

            {/* Help Link */}
            <div className="text-center mt-8">
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSkipToDashboard}>
                <BookOpen className="h-4 w-4" />
                Acessar Dashboard Diretamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
