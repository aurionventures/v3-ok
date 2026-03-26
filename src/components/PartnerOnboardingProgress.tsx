import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  progress: number;
}

interface PartnerOnboardingProgressProps {
  currentStep: number; // 1 = Cadastro, 2 = Contrato, 3 = Senha, 4 = Completo
}

export default function PartnerOnboardingProgress({ currentStep }: PartnerOnboardingProgressProps) {
  const steps: Step[] = [
    { label: 'Cadastro', progress: 33 },
    { label: 'Contrato', progress: 66 },
    { label: 'Senha de Acesso', progress: 100 },
  ];

  const currentProgress = steps[currentStep - 1]?.progress || 0;

  return (
    <div className="w-full space-y-4 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isCompleted && "bg-primary text-primary-foreground border-primary",
                  isCurrent && "bg-primary/10 text-primary border-primary",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-muted-foreground/20"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center",
                  isCurrent && "font-semibold text-primary",
                  !isCurrent && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="text-xs text-primary mt-1 font-medium">
                    {currentProgress}%
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-full mx-2 transition-colors",
                  stepNumber < currentStep ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
      <Progress value={currentProgress} className="h-2" />
    </div>
  );
}
