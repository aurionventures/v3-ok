import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import MaturityRadarChart from '@/components/MaturityRadarChart';
import MaturityBarChart from '@/components/MaturityBarChart';
import { QuestionInput } from '@/components/QuestionInput';
import { CompletionModal } from '@/components/CompletionModal';
import { 
  ChevronLeft, 
  Trophy, 
  Target, 
  Mail,
  Phone,
  Building2,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { COMPANY_DATA, QUESTIONS, MATURITY_STRUCTURE } from '@/data/maturityData';
import { calcularPontuacao, convertToRadarData, detectFamilyBusiness } from '@/utils/maturityCalculator';
import { UserAnswers } from '@/types/maturity';
import { saveLeadData, sendDiagnosticEmail } from '@/utils/leadStorage';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  revenue: string;
  size: string;
}

const StandaloneQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState<'company' | 'questions'>('company');
  const [answers, setAnswers] = useState<UserAnswers>({
    companyData: {},
    questions: {}
  });
  const [contactData, setContactData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: '',
    revenue: '',
    size: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFamilyBusiness, setIsFamilyBusiness] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pre-preencher dados do lead se disponível
  useEffect(() => {
    const storedData = localStorage.getItem('diagnostic_lead_data');
    if (storedData) {
      try {
        const leadData = JSON.parse(storedData);
        setContactData(leadData);
        localStorage.removeItem('diagnostic_lead_data'); // Limpar após uso
        toast({
          title: "Bem-vindo!",
          description: `Bem-vindo, ${leadData.name}! Vamos iniciar seu diagnóstico.`,
        });
      } catch (error) {
        console.error('Erro ao recuperar dados do lead:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Detectar se é empresa familiar quando dados da empresa mudarem
    setIsFamilyBusiness(detectFamilyBusiness(answers.companyData));
  }, [answers.companyData]);

  const totalSteps = COMPANY_DATA.length + QUESTIONS.length;
  const progress = (currentStep / totalSteps) * 100;
  
  const isCompanyDataPhase = currentSection === 'company';
  const isQuestionsPhase = currentSection === 'questions';

  const handleAnswer = (value: string | string[] | number | object) => {
    try {
      let shouldAutoAdvance = true;
      
      if (isCompanyDataPhase && currentStep < COMPANY_DATA.length) {
        const currentData = COMPANY_DATA[currentStep];
        setAnswers(prev => ({
          ...prev,
          companyData: { ...prev.companyData, [currentData.numero]: value }
        }));
        
        // Auto-advance for single choice and numeric, not for text
        shouldAutoAdvance = currentData.tipo === "multipla_escolha_unica" || currentData.tipo === "numerico";
      } else if (isQuestionsPhase && currentStep >= COMPANY_DATA.length) {
        const questionIndex = currentStep - COMPANY_DATA.length;
        if (questionIndex < QUESTIONS.length) {
          const currentQuestion = QUESTIONS[questionIndex];
          setAnswers(prev => ({
            ...prev,
            questions: { ...prev.questions, [currentQuestion.numero]: value }
          }));
          
          // Auto-advance for single choice and numeric, not for text, multiple choice multiple, numeric_multiplo, or matriz
          shouldAutoAdvance = currentQuestion.tipo === "multipla_escolha_unica" || currentQuestion.tipo === "numerico";
        }
      }
      
      if (shouldAutoAdvance) {
        setIsTransitioning(true);
        
        // Auto-advance after selection
        setTimeout(() => {
          handleNext(true); // Pass flag to indicate auto-advance
          setIsTransitioning(false);
        }, 600);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      setIsTransitioning(false);
    }
  };

  const shouldSkipQuestion = (question: any): boolean => {
    // Lógica para questões condicionais (ex: 4.1 só aparece se 4 = "sim")
    if (question.numero === "4.1") {
      return answers.questions["4"] !== "sim";
    }
    if (question.numero === "10.1") {
      return answers.questions["10"] !== "sim";
    }
    return false;
  };

  const handleNext = (isAutoAdvance = false) => {
    // Skip validation for auto-advance since answer was just provided
    if (!isAutoAdvance) {
      // Validações apenas para navegação manual
      if (isCompanyDataPhase) {
        const currentData = COMPANY_DATA[currentStep];
        const currentValue = answers.companyData[currentData.numero];
        
        // Validação específica por tipo
        if (currentData.tipo === "texto") {
          if (!currentValue || (typeof currentValue === 'string' && currentValue.trim() === '')) {
            return;
          }
        } else if (currentData.tipo === "numerico") {
          if (!currentValue && currentValue !== 0) {
            return;
          }
        } else {
          // Para múltipla escolha e outros tipos
          if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
            return;
          }
        }
      } else if (isQuestionsPhase) {
        const questionIndex = currentStep - COMPANY_DATA.length;
        const currentQuestion = QUESTIONS[questionIndex];
        const currentValue = answers.questions[currentQuestion.numero];
        
        // Verificar questões condicionais
        if (shouldSkipQuestion(currentQuestion)) {
          // Pular questão automaticamente
        } else {
          // Validação específica por tipo
          if (currentQuestion.tipo === "texto") {
            if (!currentValue || (typeof currentValue === 'string' && currentValue.trim() === '')) {
              return;
            }
          } else if (currentQuestion.tipo === "numerico") {
            if (!currentValue && currentValue !== 0) {
              return;
            }
          } else if (currentQuestion.tipo === "numerico_multiplo") {
            const numericValue = currentValue as { total: number, women: number } | undefined;
            if (!numericValue || (!numericValue.total && numericValue.total !== 0) || (!numericValue.women && numericValue.women !== 0)) {
              return;
            }
          } else if (currentQuestion.tipo === "matriz") {
            try {
              const matrixValue = typeof currentValue === 'string' ? JSON.parse(currentValue) : {};
              if (Object.keys(matrixValue).length < currentQuestion.opcoes.length) {
                return;
              }
            } catch {
              return;
            }
          } else {
            // Para múltipla escolha e outros tipos
            if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
              return;
            }
          }
        }
      }
    }

    // Navegar para próxima etapa
    let newStep = currentStep + 1;
    
    // Skip conditional questions if needed
    while (newStep < totalSteps) {
      if (newStep >= COMPANY_DATA.length) {
        const questionIndex = newStep - COMPANY_DATA.length;
        if (questionIndex < QUESTIONS.length && shouldSkipQuestion(QUESTIONS[questionIndex])) {
          newStep++;
          continue;
        }
      }
      break;
    }
    
    // Verificar se chegou ao fim das questões
    if (newStep >= totalSteps) {
      handleFinish();
      return;
    }
    
    setCurrentStep(newStep);
    
    // Atualizar seção atual
    if (newStep < COMPANY_DATA.length) {
      setCurrentSection('company');
    } else {
      setCurrentSection('questions');
    }
  };

  const handlePrevious = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    
    // Atualizar seção atual
    if (newStep < COMPANY_DATA.length) {
      setCurrentSection('company');
    } else {
      setCurrentSection('questions');
    }
  };

  const handleFinish = async () => {
    // Verificar se temos dados de contato
    if (!contactData.email || !contactData.name) {
      toast({
        title: "Erro",
        description: "Dados de contato necessários não encontrados. Recarregue a página.",
        variant: "destructive"
      });
      return;
    }

    setShowCompletionModal(true);
    setIsSubmitting(true);

    try {
      // Calcular maturidade
      const maturityResult = calcularPontuacao(answers, isFamilyBusiness);
      
      // Salvar lead
      const leadData = saveLeadData({
        ...contactData,
        maturityResult,
        companyData: answers.companyData
      });

      // Simular envio de email
      const emailSent = await sendDiagnosticEmail(leadData, maturityResult);

      if (emailSent) {
        toast({
          title: "Diagnóstico Concluído!",
          description: `Relatório enviado para ${contactData.email}`,
        });
      } else {
        throw new Error('Erro no envio do email');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar diagnóstico. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResult = () => {
    setShowCompletionModal(false);
    setShowResult(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  if (showResult) {
    const maturityResult = calcularPontuacao(answers, isFamilyBusiness);
    const getMaturityLevel = (score: number) => {
      if (score >= 0.8) return { level: "Avançado", variant: "default" as const, color: "text-green-600" };
      if (score >= 0.6) return { level: "Sólido", variant: "secondary" as const, color: "text-blue-600" };
      if (score >= 0.4) return { level: "Em Desenvolvimento", variant: "outline" as const, color: "text-yellow-600" };
      return { level: "Inicial", variant: "destructive" as const, color: "text-red-600" };
    };

    const maturityLevel = getMaturityLevel(maturityResult.pontuacao_total);
    
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0">
          <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl relative">
              {/* Header */}
              <div className="text-center mb-6">
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                  className="absolute top-4 left-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Site
                </Button>
                
                <Badge variant="outline" className="mb-3">
                  <Trophy className="h-3 w-3 mr-1" />
                  Diagnóstico Concluído
                </Badge>
                <h1 className="text-2xl font-bold mb-2">Relatório de Maturidade</h1>
                <p className="text-sm text-muted-foreground">
                  {contactData.company} • {contactData.sector}
                </p>
              </div>

              {/* Compact Summary Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Main Score */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Badge variant={maturityLevel.variant} className="mb-3">
                      {maturityLevel.level}
                    </Badge>
                    <div className={`text-4xl font-bold mb-2 ${maturityLevel.color}`}>
                      {(maturityResult.pontuacao_total * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Índice de Maturidade</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Empresa:</span>
                        <span className="font-medium">{contactData.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Setor:</span>
                        <span className="font-medium">{contactData.sector}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Radar Chart Compact */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Dimensões de Governança</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-48">
                      <MaturityRadarChart data={convertToRadarData(maturityResult)} />
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps Compact */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Próximos Passos</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Button onClick={handleClose} size="sm" className="w-full">
                        <Building2 className="h-3 w-3 mr-2" />
                        Explorar Plataforma
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open('https://wa.me/5511949783636', '_blank')}
                      >
                        <Phone className="h-3 w-3 mr-2" />
                        Falar com Especialista
                      </Button>
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{contactData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>(11) 94978-3636</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer Summary */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Relatório enviado para <strong>{contactData.email}</strong> • 
                  Resultado: <strong>{(maturityResult.pontuacao_total * 100).toFixed(0)}% de maturidade</strong>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render current question
  let currentQuestion = null;
  let questionStep = 0;
  let dimensionBadge = null;
  let ibgcReference = null;

  if (isCompanyDataPhase) {
    currentQuestion = COMPANY_DATA[currentStep];
    questionStep = currentStep + 1;
  } else if (isQuestionsPhase) {
    const questionIndex = currentStep - COMPANY_DATA.length;
    if (questionIndex < QUESTIONS.length) {
      currentQuestion = QUESTIONS[questionIndex];
      questionStep = currentStep + 1;
      
      // Add dimension badge for questions
      if (currentQuestion.dimensao) {
        const dimensionName = MATURITY_STRUCTURE.dimensoes[currentQuestion.dimensao]?.nome || currentQuestion.dimensao;
        dimensionBadge = (
          <Badge variant="outline" className="mb-3">
            {dimensionName}
          </Badge>
        );
      }
      
      // Add IBGC reference if available
      if (currentQuestion.referencia) {
        ibgcReference = (
          <p className="text-xs text-muted-foreground mt-2">
            Referência IBGC: {currentQuestion.referencia}
          </p>
        );
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
        <div className="h-full overflow-y-auto bg-gradient-to-br from-background to-muted/50">
          <div className="container mx-auto px-4 py-8 relative">
            {/* Header */}
            <div className="text-center mb-8">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="absolute top-4 left-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Site
              </Button>
              
              <Badge variant="outline" className="mb-4">
                <BarChart3 className="h-3 w-3 mr-1" />
                Diagnóstico Gratuito de Governança
              </Badge>
              <h1 className="text-2xl font-bold mb-2">Avalie sua Maturidade em Governança</h1>
              
              {/* Progress */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Etapa {questionStep} de {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto">
              {currentQuestion && (
                <Card className={`transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                  <CardHeader>
                    {dimensionBadge}
                    <CardTitle className="text-lg leading-relaxed">
                      {currentQuestion.texto}
                    </CardTitle>
                    {ibgcReference}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <QuestionInput
                        question={currentQuestion}
                        value={
                          isCompanyDataPhase 
                            ? answers.companyData[currentQuestion.numero]
                            : answers.questions[currentQuestion.numero]
                        }
                        onChange={handleAnswer}
                        disabled={isTransitioning}
                        onNext={
                          (currentQuestion.tipo === "texto" || 
                          currentQuestion.tipo === "numerico_multiplo" || 
                          currentQuestion.tipo === "multipla_escolha_multipla" ||
                          currentQuestion.tipo === "matriz")
                            ? () => handleNext(false)
                            : undefined
                        }
                      />

                      {/* Navigation for auto-advance questions */}
                      {(currentQuestion.tipo === "multipla_escolha_unica" || currentQuestion.tipo === "numerico") && (
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0 || isTransitioning}
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                          </Button>
                          
                          <div className="text-center flex-1 px-4">
                            {isTransitioning && (
                              <p className="text-sm text-green-600 animate-pulse">
                                ✓ Resposta registrada
                              </p>
                            )}
                          </div>
                          
                          <div className="w-20">
                            {/* Next button will appear automatically */}
                          </div>
                        </div>
                      )}

                      {/* For non-auto-advance questions, show manual navigation */}
                      {(currentQuestion.tipo === "multipla_escolha_multipla" || 
                        currentQuestion.tipo === "texto" || 
                        currentQuestion.tipo === "numerico" ||
                        currentQuestion.tipo === "numerico_multiplo" ||
                        currentQuestion.tipo === "matriz") && (
                        <div className="flex justify-between mt-6">
                          <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0 || isTransitioning}
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                          </Button>
                          
                          <Button
                            onClick={() => handleNext(false)}
                            disabled={isTransitioning}
                          >
                            Próxima
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Completion Modal */}
            <CompletionModal
              isVisible={showCompletionModal}
              isProcessing={isSubmitting}
              email={contactData.email}
              onViewResult={handleViewResult}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StandaloneQuiz;