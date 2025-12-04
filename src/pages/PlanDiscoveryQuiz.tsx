import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MessageCircle,
  Users,
  Shield,
  Target,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  QuizAnswers,
  ContactInfo,
  RevenueRange,
  getRecommendedPlan,
  REVENUE_LABELS,
  COUNCIL_LABELS,
  SUCCESSION_LABELS,
  ESG_LABELS,
  EMPLOYEES_LABELS
} from '@/utils/planRecommendation';

// Removed 'resultado' step - now redirects directly to plan-activation
type Step = 'faturamento' | 'conselho' | 'sucessao' | 'esg' | 'colaboradores' | 'contato';

const STEPS: Step[] = ['faturamento', 'conselho', 'sucessao', 'esg', 'colaboradores', 'contato'];

// Salvar lead no localStorage (fallback até as tabelas serem criadas)
function saveQuizResponse(data: {
  empresaNome: string;
  contatoNome: string;
  contatoEmail: string;
  contatoWhatsapp: string;
  faturamentoFaixa: string;
  numeroColaboradores: string;
  temConselho: string;
  temSucessao: string;
  avaliacaoRiscosEsg: string;
  planoRecomendado: string;
}) {
  try {
    const existing = JSON.parse(localStorage.getItem('quiz_responses') || '[]');
    existing.push({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'novo'
    });
    localStorage.setItem('quiz_responses', JSON.stringify(existing));
    
    // Also save quiz_result for OrganizationContext to use during onboarding
    localStorage.setItem('quiz_result', JSON.stringify({
      empresaNome: data.empresaNome,
      faturamentoFaixa: data.faturamentoFaixa,
      temConselho: data.temConselho,
      temSucessao: data.temSucessao,
      avaliacaoRiscosEsg: data.avaliacaoRiscosEsg,
      timestamp: new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error saving quiz response:', err);
  }
}

export default function PlanDiscoveryQuiz() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('faturamento');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [contact, setContact] = useState<ContactInfo>({
    empresaNome: '',
    contatoNome: '',
    contatoEmail: '',
    contatoWhatsapp: ''
  });
  
  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex) / (STEPS.length - 1)) * 100;
  
  const canProceed = () => {
    switch (currentStep) {
      case 'faturamento':
        return !!answers.faturamentoFaixa;
      case 'conselho':
        return !!answers.temConselho;
      case 'sucessao':
        return !!answers.temSucessao;
      case 'esg':
        return !!answers.avaliacaoRiscosEsg;
      case 'colaboradores':
        return !!answers.numeroColaboradores;
      case 'contato':
        return contact.empresaNome && contact.contatoNome && contact.contatoEmail && contact.contatoWhatsapp;
      default:
        return true;
    }
  };
  
  const handleNext = async () => {
    if (currentStep === 'contato') {
      setIsSubmitting(true);
      try {
        // Calculate recommended plan
        const fullAnswers = answers as QuizAnswers;
        const planId = getRecommendedPlan(fullAnswers);
        
        // Save quiz response data
        saveQuizResponse({
          empresaNome: contact.empresaNome,
          contatoNome: contact.contatoNome,
          contatoEmail: contact.contatoEmail,
          contatoWhatsapp: contact.contatoWhatsapp,
          faturamentoFaixa: answers.faturamentoFaixa || '',
          numeroColaboradores: answers.numeroColaboradores || '',
          temConselho: answers.temConselho || '',
          temSucessao: answers.temSucessao || '',
          avaliacaoRiscosEsg: answers.avaliacaoRiscosEsg || '',
          planoRecomendado: planId
        });
        
        // Create automatic demo client session
        const mockUser = {
          id: crypto.randomUUID(),
          email: contact.contatoEmail,
          name: contact.contatoNome,
          role: 'cliente' as const,
          empresa: contact.empresaNome
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('auth_role', 'cliente');
        localStorage.setItem('onboarding_completed', 'false');
        
        toast({
          title: "Plano recomendado com sucesso!",
          description: "Preparando sua plataforma...",
        });
        
        // Small delay for UX then redirect to plan result
        setTimeout(() => {
          navigate('/plan-result');
        }, 800);
        
      } catch (err) {
        console.error('Error in quiz submission:', err);
        toast({
          title: "Erro ao processar",
          description: "Tente novamente.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < STEPS.length) {
        setCurrentStep(STEPS[nextIndex]);
      }
    }
  };
  
  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    } else {
      navigate('/');
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'faturamento':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Qual a faixa de faturamento anual da sua empresa?</h2>
              <p className="text-muted-foreground">Essa é a principal informação para recomendar o plano ideal.</p>
            </div>
            
            <RadioGroup
              value={answers.faturamentoFaixa || ''}
              onValueChange={(value) => setAnswers({ ...answers, faturamentoFaixa: value as RevenueRange })}
              className="grid gap-3"
            >
              {Object.entries(REVENUE_LABELS).map(([value, label]) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={value} className="peer sr-only" />
                  <Label
                    htmlFor={value}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1 font-medium">{label}</div>
                    {answers.faturamentoFaixa === value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'conselho':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Sua empresa possui conselho ou comitê formal de governança?</h2>
              <p className="text-muted-foreground">Entender seu estágio atual nos ajuda a recomendar melhor.</p>
            </div>
            
            <RadioGroup
              value={answers.temConselho || ''}
              onValueChange={(value) => setAnswers({ ...answers, temConselho: value as QuizAnswers['temConselho'] })}
              className="grid gap-3"
            >
              {Object.entries(COUNCIL_LABELS).map(([value, label]) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={`conselho-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`conselho-${value}`}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1 font-medium">{label}</div>
                    {answers.temConselho === value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'sucessao':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Vocês têm plano de sucessão formalizado?</h2>
              <p className="text-muted-foreground">Planejamento de sucessão é essencial para continuidade.</p>
            </div>
            
            <RadioGroup
              value={answers.temSucessao || ''}
              onValueChange={(value) => setAnswers({ ...answers, temSucessao: value as QuizAnswers['temSucessao'] })}
              className="grid gap-3"
            >
              {Object.entries(SUCCESSION_LABELS).map(([value, label]) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={`sucessao-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`sucessao-${value}`}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1 font-medium">{label}</div>
                    {answers.temSucessao === value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'esg':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Já realizam avaliação estruturada de riscos e ESG?</h2>
              <p className="text-muted-foreground">Gestão de riscos e ESG são diferenciais competitivos.</p>
            </div>
            
            <RadioGroup
              value={answers.avaliacaoRiscosEsg || ''}
              onValueChange={(value) => setAnswers({ ...answers, avaliacaoRiscosEsg: value as QuizAnswers['avaliacaoRiscosEsg'] })}
              className="grid gap-3"
            >
              {Object.entries(ESG_LABELS).map(([value, label]) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={`esg-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`esg-${value}`}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1 font-medium">{label}</div>
                    {answers.avaliacaoRiscosEsg === value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'colaboradores':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Número aproximado de colaboradores?</h2>
              <p className="text-muted-foreground">O tamanho da equipe influencia na complexidade da governança.</p>
            </div>
            
            <RadioGroup
              value={answers.numeroColaboradores || ''}
              onValueChange={(value) => setAnswers({ ...answers, numeroColaboradores: value as QuizAnswers['numeroColaboradores'] })}
              className="grid gap-3"
            >
              {Object.entries(EMPLOYEES_LABELS).map(([value, label]) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={`colab-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`colab-${value}`}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="flex-1 font-medium">{label}</div>
                    {answers.numeroColaboradores === value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'contato':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Seus dados de contato</h2>
              <p className="text-muted-foreground">Para que possamos entrar em contato e apresentar sua proposta personalizada.</p>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa">Nome da Empresa *</Label>
                <Input
                  id="empresa"
                  placeholder="Ex: Empresa XYZ Ltda"
                  value={contact.empresaNome}
                  onChange={(e) => setContact({ ...contact, empresaNome: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Seu Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva"
                  value={contact.contatoNome}
                  onChange={(e) => setContact({ ...contact, contatoNome: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={contact.contatoEmail}
                  onChange={(e) => setContact({ ...contact, contatoEmail: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  placeholder="Ex: (47) 99999-9999"
                  value={contact.contatoWhatsapp}
                  onChange={(e) => setContact({ ...contact, contatoWhatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-primary mb-2">Legacy Governança</h1>
          <p className="text-muted-foreground">Descubra o plano ideal para sua empresa</p>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passo {currentStepIndex + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg font-medium">Preparando sua plataforma...</p>
                <p className="text-muted-foreground text-sm">Calculando o plano ideal para sua empresa</p>
              </div>
            ) : (
              renderStep()
            )}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        {!isSubmitting && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                'Calculando...'
              ) : currentStep === 'contato' ? (
                <>
                  Ver meu plano
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
