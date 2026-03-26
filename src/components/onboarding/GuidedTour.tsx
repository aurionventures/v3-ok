import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Building2, Upload, FileText, Shield, UserPlus, UserCheck, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  path: string;
  targetSelector?: string; // Seletor CSS para o elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right'; // Posição do balão
  waitForElement?: boolean; // Se deve esperar o elemento aparecer
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Legacy OS!',
    description: 'Vamos te ajudar a configurar sua empresa na plataforma seguindo os primeiros passos essenciais.',
    instruction: 'Vamos começar configurando a Base de Conhecimento da empresa, depois o Checklist de documentos, seguido pela estruturação dos órgãos de governança e parametrização.',
    path: '/knowledge-base',
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'knowledge-base',
    title: 'Passo 1: Configurar Base de Conhecimento',
    description: 'Configure os dados básicos da sua empresa.',
    instruction: 'Preencha os dados básicos da empresa: razão social, CNPJ, setor, porte e informações estratégicas. Isso criará uma base sólida para a plataforma.',
    path: '/knowledge-base?tab=phase-1',
    targetSelector: '[data-tour="knowledge-base-form"]',
    position: 'right',
    waitForElement: true,
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'checklist',
    title: 'Passo 2: Checklist de Documentos',
    description: 'Faça upload dos documentos importantes da empresa.',
    instruction: 'Acesse a aba Checklist e faça upload dos documentos da empresa (contratos sociais, estatutos, atas, etc.) na aba Biblioteca. Isso enriquece a base de conhecimento.',
    path: '/document-checklist?tab=library',
    targetSelector: '[data-tour="checklist-upload"]',
    position: 'bottom',
    waitForElement: true,
    icon: Upload,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'governance-organs',
    title: 'Passo 3: Criar Órgãos de Governança',
    description: 'Estruture seus conselhos, comitês e comissões.',
    instruction: 'Clique no botão "Criar Conselho" para adicionar seu primeiro órgão de governança. Configure o tipo, descrição, quórum e nível hierárquico.',
    path: '/governance-config',
    targetSelector: '[data-tour="create-organ-button"]',
    position: 'bottom',
    waitForElement: true,
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'create-members',
    title: 'Passo 4: Criar Membros',
    description: 'Cadastre os membros dos órgãos de governança.',
    instruction: 'Vá para a aba "Membros" e clique em "Criar Membro". Preencha nome, email, CPF e cargo. Você pode criar quantos membros precisar.',
    path: '/governance-config',
    targetSelector: '[data-tour="create-member-button"]',
    position: 'bottom',
    waitForElement: true,
    icon: UserPlus,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'allocate-members',
    title: 'Passo 5: Alocar Membros',
    description: 'Distribua os membros entre os órgãos de governança.',
    instruction: 'Na lista de membros, clique no botão "Alocar" ao lado de cada membro. Selecione o órgão, cargo e datas de mandato.',
    path: '/governance-config',
    targetSelector: '[data-tour="allocate-member-button"]',
    position: 'left',
    waitForElement: true,
    icon: UserCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
];

interface GuidedTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function GuidedTour({ onComplete, onSkip }: GuidedTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [elementPosition, setElementPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  // Navegar para a página do passo atual se necessário
  useEffect(() => {
    if (step.path && step.path !== '/knowledge-base') {
      const targetPath = step.path.split('?')[0];
      const currentPath = location.pathname;
      
      // Só navegar se não estiver na página correta
      if (!currentPath.includes(targetPath)) {
        // Delay para garantir que o tour continue visível
        setTimeout(() => {
          navigate(step.path, { replace: true });
        }, 100);
      }
    }
  }, [currentStep, step.path, navigate, location]);

  // Procurar e destacar elemento alvo
  useEffect(() => {
    if (!step.targetSelector || currentStep === 0) {
      setTargetElement(null);
      setElementPosition(null);
      return;
    }

    // Limpar interval anterior
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    const findElement = () => {
      // Aguardar um pouco para o DOM carregar
      setTimeout(() => {
        const element = document.querySelector(step.targetSelector!) as HTMLElement;
        if (element) {
          setTargetElement(element);
          updateElementPosition(element);
          
          // Scroll suave para o elemento
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          return true;
        }
        return false;
      }, 300);
    };

    // Tentar encontrar após um delay para garantir que a página carregou
    const timeoutId = setTimeout(() => {
      if (!findElement() && step.waitForElement) {
        // Se waitForElement, tentar periodicamente
        checkIntervalRef.current = setInterval(() => {
          const element = document.querySelector(step.targetSelector!) as HTMLElement;
          if (element) {
            setTargetElement(element);
            updateElementPosition(element);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
          }
        }, 200);

        // Timeout após 10 segundos
        setTimeout(() => {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }, 10000);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [currentStep, step.targetSelector, step.waitForElement, location.pathname]);

  // Atualizar posição do elemento quando a janela redimensiona
  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => updateElementPosition(targetElement);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [targetElement]);

  const updateElementPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setElementPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

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
    localStorage.setItem('guided_tour_completed', 'true');
    localStorage.setItem('guided_tour_completed_at', new Date().toISOString());
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('guided_tour_skipped', 'true');
    localStorage.setItem('guided_tour_skipped_at', new Date().toISOString());
    onSkip();
  };

  // Calcular posição do balão de texto
  const getTooltipPosition = () => {
    if (!elementPosition) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const { top, left, width, height } = elementPosition;
    const spacing = 20;
    
    switch (step.position) {
      case 'top':
        return {
          top: `${top - 10}px`,
          left: `${left + width / 2}px`,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: `${top + height + spacing}px`,
          left: `${left + width / 2}px`,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          top: `${top + height / 2}px`,
          left: `${left - spacing}px`,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: `${top + height / 2}px`,
          left: `${left + width + spacing}px`,
          transform: 'translate(0, -50%)',
        };
      default:
        return {
          top: `${top + height + spacing}px`,
          left: `${left + width / 2}px`,
          transform: 'translate(-50%, 0)',
        };
    }
  };

  // Renderizar overlay com spotlight
  const renderOverlay = () => {
    const padding = 8; // Espaçamento ao redor do elemento
    
    if (!elementPosition) {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] pointer-events-none" />
      );
    }

    const { top, left, width, height } = elementPosition;

    return (
      <div className="fixed inset-0 z-[9998] pointer-events-none" ref={overlayRef}>
        
        {/* Área destacada (spotlight) usando clip-path para melhor performance */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"
          style={{
            clipPath: `polygon(
              0% 0%, 
              0% 100%, 
              ${left - padding}px 100%, 
              ${left - padding}px ${top - padding}px, 
              ${left + width + padding}px ${top - padding}px, 
              ${left + width + padding}px ${top + height + padding}px, 
              ${left - padding}px ${top + height + padding}px, 
              ${left - padding}px 100%, 
              100% 100%, 
              100% 0%
            )`,
          }}
        />
        
        {/* Borda destacada ao redor do elemento */}
        <div
          className="absolute pointer-events-none z-[9999] ring-4 ring-primary ring-offset-4 rounded-lg animate-pulse"
          style={{
            top: `${top - padding}px`,
            left: `${left - padding}px`,
            width: `${width + padding * 2}px`,
            height: `${height + padding * 2}px`,
          }}
        />
        
        {/* Área clicável sobre o elemento destacado */}
        <div
          className="absolute z-[9997]"
          style={{
            top: `${top - padding}px`,
            left: `${left - padding}px`,
            width: `${width + padding * 2}px`,
            height: `${height + padding * 2}px`,
          }}
          onClick={(e) => {
            // Permitir cliques no elemento
            e.stopPropagation();
            if (targetElement) {
              targetElement.click();
            }
          }}
        />
      </div>
    );
  };

  // Renderizar balão de texto
  const renderTooltip = () => {
    const tooltipStyle = getTooltipPosition();

    return (
      <div
        className="fixed z-[10000] max-w-sm"
        style={tooltipStyle}
      >
        <div className={cn(
          "bg-card border-2 border-primary shadow-2xl rounded-lg p-4 relative",
          "animate-in fade-in zoom-in duration-300"
        )}>
          {/* Seta apontando para o elemento */}
          <div
            className={cn(
              "absolute w-0 h-0 border-8 border-transparent",
              step.position === 'top' && "bottom-[-16px] left-1/2 -translate-x-1/2 border-t-primary",
              step.position === 'bottom' && "top-[-16px] left-1/2 -translate-x-1/2 border-b-primary",
              step.position === 'left' && "right-[-16px] top-1/2 -translate-y-1/2 border-l-primary",
              step.position === 'right' && "left-[-16px] top-1/2 -translate-y-1/2 border-r-primary",
            )}
          />
          
          {/* Ícone */}
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3", step.bgColor)}>
            <StepIcon className={cn("h-5 w-5", step.color)} />
          </div>

          {/* Conteúdo */}
          <h3 className="text-lg font-bold mb-1">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
          <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md mb-4">
            {step.instruction}
          </p>

          {/* Ações */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-xs"
            >
              Pular tour
            </Button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Voltar
                </Button>
              )}

              <Button
                onClick={handleNext}
                size="sm"
                className="gap-1"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Indicador de progresso */}
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Passo {currentStep + 1} de {TOUR_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay com spotlight */}
      {renderOverlay()}
      
      {/* Balão de texto */}
      {renderTooltip()}
      
      {/* Botão fechar (canto superior direito) */}
      <button
        onClick={handleSkip}
        className="fixed top-4 right-4 z-[10001] p-2 bg-card border-2 border-primary rounded-full shadow-lg hover:bg-muted transition-colors"
        aria-label="Fechar tour"
      >
        <X className="h-5 w-5 text-foreground" />
      </button>
    </>
  );
}
