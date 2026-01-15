import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Target, Users, BarChart3, FileText, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Legacy OS!',
    description: 'Vamos te ajudar a conhecer a plataforma em poucos passos. Você pode pular a qualquer momento.',
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'dashboard',
    title: 'Seu Dashboard',
    description: 'Aqui você vê métricas importantes, tarefas pendentes e um resumo da sua governança.',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'councils',
    title: 'Gerencie Conselhos',
    description: 'Crie e gerencie seus conselhos, reuniões e membros em um só lugar.',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'documents',
    title: 'Documentos e ATAs',
    description: 'Organize documentos, gere ATAs automaticamente e mantenha tudo em ordem.',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'ai-copilot',
    title: 'Copiloto de IA',
    description: 'Use nossa IA para gerar pautas, insights e sugestões inteligentes para suas reuniões.',
    icon: Target,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

interface GuidedTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function GuidedTour({ onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Marcar onboarding assistido como completo
    localStorage.setItem('guided_tour_completed', 'true');
    localStorage.setItem('guided_tour_completed_at', new Date().toISOString());
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('guided_tour_skipped', 'true');
    localStorage.setItem('guided_tour_skipped_at', new Date().toISOString());
    onSkip();
  };

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <CardContent className="p-8 sm:p-12">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {TOUR_STEPS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className={cn(
              "mx-auto w-24 h-24 rounded-full flex items-center justify-center",
              step.bgColor
            )}>
              <StepIcon className={cn("h-12 w-12", step.color)} />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {step.description}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentStep
                      ? "bg-primary w-8"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-12 gap-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Pular tour
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}

              <Button
                onClick={handleNext}
                size="lg"
                className="gap-2 px-8"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Começar
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}