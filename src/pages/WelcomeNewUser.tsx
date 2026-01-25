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
    // Marcar que o usuário já viu a tela de boas-vindas (flag permanente)
    localStorage.setItem('welcome_screen_seen', 'true');
    
    // Limpar flags de novo usuário
    localStorage.removeItem('just_created_password');
    localStorage.removeItem('from_contract_sign');
    
    // Redirecionar para checklist na aba "Cadastro da Empresa"
    navigate('/document-checklist?tab=cadastro-empresa');
  }, [navigate]);

  useEffect(() => {
    // Verificar se o usuário já viu a tela de boas-vindas
    const hasSeenWelcome = localStorage.getItem('welcome_screen_seen') === 'true';
    
    // Se já viu a tela, redirecionar para dashboard
    if (hasSeenWelcome) {
      navigate('/dashboard');
      return;
    }
    
    // Verificar se realmente é um novo usuário
    const justCreatedPassword = localStorage.getItem('just_created_password');
    const fromContractSign = localStorage.getItem('from_contract_sign');
    
    if (!justCreatedPassword || !fromContractSign) {
      // Se não veio do fluxo de criação de senha, redirecionar para dashboard
      navigate('/dashboard');
      return;
    }

    // Removido redirecionamento automático - usuário deve navegar manualmente pelo carrossel
  }, [navigate]);

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
    
    // Marcar que o usuário já viu a tela de boas-vindas (flag permanente)
    localStorage.setItem('welcome_screen_seen', 'true');
    
    // Limpar flags de novo usuário
    localStorage.removeItem('just_created_password');
    localStorage.removeItem('from_contract_sign');
    
    // Redirecionar para checklist na aba "Cadastro da Empresa"
    navigate('/document-checklist?tab=cadastro-empresa');
  };

  const handleSkipToDashboard = () => {
    // Marcar que o usuário já viu a tela de boas-vindas (flag permanente)
    localStorage.setItem('welcome_screen_seen', 'true');
    
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
          <div className="text-center space-y-4 py-4 h-full flex flex-col justify-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <StepIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-base text-muted-foreground mb-3">{step.description}</p>
              {user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge variant="secondary">{user.company || 'Empresa'}</Badge>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => handleCompleteStep(step.id)} className="gap-2">
                Próximo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleStartChecklist}>
                Pular Boas vindas
              </Button>
            </div>
          </div>
        );

      case 'what-is':
        return (
          <div className="space-y-4 py-2 h-full flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">Governança Completa</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    Gerencie conselhos, reuniões, documentos e compliance em uma única plataforma.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="pb-3">
                  <Target className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">Inteligência Artificial</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    Inteligência Artificial atua com estrutura de multi-agentes que trazem governança e inteligência preditiva.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="pb-3">
                  <TrendingUp className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">Crescimento Sustentável</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    Ferramentas para escalar sua governança e preparar sua empresa para o futuro.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-3 pt-2 mt-auto">
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
          <div className="space-y-4 py-2 h-full flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-0.5 text-sm">Inteligência Artificial</h3>
                  <p className="text-xs text-muted-foreground">
                    Multi-agentes que trazem governança e inteligência preditiva
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-0.5 text-sm">Conselhos e Reuniões</h3>
                  <p className="text-xs text-muted-foreground">
                    Gerencie conselhos, membros e atas de reuniões
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-0.5 text-sm">Documentos e Compliance</h3>
                  <p className="text-xs text-muted-foreground">
                    Centralize documentos e gerencie checklists
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2 mt-auto">
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
          <div className="space-y-4 py-2 h-full flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PlayCircle className="h-4 w-4 text-primary" />
                  Guia de Início Rápido
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure sua empresa em 3 etapas simples e comece a usar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5 text-sm">Configurar Empresa</h3>
                    <p className="text-xs text-muted-foreground">
                      Adicione informações básicas da sua empresa e estrutura organizacional
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5 text-sm">Criar Conselho</h3>
                    <p className="text-xs text-muted-foreground">
                      Configure seu primeiro conselho e adicione membros da equipe
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5 text-sm">Primeira Reunião</h3>
                    <p className="text-xs text-muted-foreground">
                      Agende sua primeira reunião e comece a usar todas as funcionalidades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2 mt-auto">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
              <Button size="lg" onClick={handleStartOnboarding} className="gap-2">
                <Rocket className="h-4 w-4" />
                Começar Configuração Guiada
              </Button>
              <Button size="lg" variant="ghost" onClick={handleStartChecklist}>
                Pular Boas vindas
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
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-4 max-w-4xl h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-3 flex-shrink-0">
              <Badge variant="secondary" className="mb-2">
                Novo Usuário
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 flex-shrink-0">
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
            <Card className="shadow-lg flex-1 flex flex-col min-h-0">
              <CardContent className="p-4 md:p-6 flex-1 flex flex-col min-h-0 overflow-y-auto">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mt-4 flex-shrink-0">
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
            <div className="text-center mt-4 flex-shrink-0">
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
