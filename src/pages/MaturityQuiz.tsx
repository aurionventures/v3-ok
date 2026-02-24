import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, BarChart3, MessageCircle, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { QuestionInput } from "@/components/QuestionInput";
import { COMPANY_DATA, QUESTIONS } from "@/data/maturityData";
import { calcularPontuacao, convertToRadarData, detectFamilyBusiness } from "@/utils/maturityCalculator";
import { UserAnswers } from "@/types/maturity";
import { saveMaturityAssessment } from "@/utils/maturityStorage";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const MaturityQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState<'company' | 'questions' | 'contact'>('company');
  const [answers, setAnswers] = useState<UserAnswers>({
    companyData: {},
    questions: {}
  });
  const [contactInfo, setContactInfo] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFamilyBusiness, setIsFamilyBusiness] = useState(false);
  const { toast } = useToast();

  const totalSteps = COMPANY_DATA.length + QUESTIONS.length + 1; // +1 para contato
  const progress = (currentStep / totalSteps) * 100;
  
  const isCompanyDataPhase = currentSection === 'company';
  const isQuestionsPhase = currentSection === 'questions';
  const isContactPhase = currentSection === 'contact';

  useEffect(() => {
    // Detectar se é empresa familiar quando dados da empresa mudarem
    setIsFamilyBusiness(detectFamilyBusiness(answers.companyData));
  }, [answers.companyData]);

  const handleAnswer = (value: string | string[] | number) => {
    try {
      if (isCompanyDataPhase && currentStep < COMPANY_DATA.length) {
        const currentData = COMPANY_DATA[currentStep];
        setAnswers(prev => ({
          ...prev,
          companyData: { ...prev.companyData, [currentData.numero]: value }
        }));
      } else if (isQuestionsPhase && currentStep >= COMPANY_DATA.length) {
        const questionIndex = currentStep - COMPANY_DATA.length;
        if (questionIndex < QUESTIONS.length) {
          const currentQuestion = QUESTIONS[questionIndex];
          setAnswers(prev => ({
            ...prev,
            questions: { ...prev.questions, [currentQuestion.numero]: value }
          }));
        }
      }
      
      setIsTransitioning(true);
      
      // Auto-advance after selection
      setTimeout(() => {
        handleNext();
        setIsTransitioning(false);
      }, 800);
    } catch (error) {
      console.error('Error handling answer:', error);
      setIsTransitioning(false);
    }
  };

  const handleNext = () => {
    // Validações por seção
    if (isCompanyDataPhase) {
      const currentData = COMPANY_DATA[currentStep];
      const currentValue = answers.companyData[currentData.numero];
      if (!currentValue && currentValue !== 0) {
        toast({
          title: "Resposta obrigatória",
          description: "Por favor, preencha esta informação antes de continuar.",
          variant: "destructive"
        });
        return;
      }
    } else if (isQuestionsPhase) {
      const questionIndex = currentStep - COMPANY_DATA.length;
      const currentQuestion = QUESTIONS[questionIndex];
      const currentValue = answers.questions[currentQuestion.numero];
      
      // Verificar questões condicionais
      if (shouldSkipQuestion(currentQuestion)) {
        // Pular questão automaticamente
      } else if (!currentValue && currentValue !== 0) {
        toast({
          title: "Resposta obrigatória",
          description: "Por favor, selecione uma resposta antes de continuar.",
          variant: "destructive"
        });
        return;
      }
    } else if (isContactPhase) {
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      // Save assessment to localStorage
      const result = calcularPontuacao(answers, isFamilyBusiness);
      saveMaturityAssessment(result, answers.companyData, contactInfo);

      setShowResult(true);
      toast({
        title: "Diagnóstico gerado!",
        description: "Seu diagnóstico de maturidade foi processado com sucesso.",
      });
      return;
    }

    // Navegar para próxima etapa
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    
    // Atualizar seção atual
    if (newStep < COMPANY_DATA.length) {
      setCurrentSection('company');
    } else if (newStep < COMPANY_DATA.length + QUESTIONS.length) {
      setCurrentSection('questions');
    } else {
      setCurrentSection('contact');
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
    // Adicionar outras condições conforme necessário
    return false;
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const calculateMaturityData = () => {
    const result = calcularPontuacao(answers, isFamilyBusiness);
    return convertToRadarData(result);
  };

  const getMaturityLevel = (score: number) => {
    if (score >= 4) return { level: "Avançado", color: "bg-green-500", textColor: "text-green-700" };
    if (score >= 3) return { level: "Sólido", color: "bg-blue-500", textColor: "text-blue-700" };
    if (score >= 2) return { level: "Básico", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (score >= 1) return { level: "Inicial", color: "bg-orange-500", textColor: "text-orange-700" };
    return { level: "Embrionário", color: "bg-red-500", textColor: "text-red-700" };
  };

  const maturityData = calculateMaturityData();
  const overallScore = maturityData.reduce((sum, item) => sum + item.score, 0) / maturityData.length;
  const maturityLevel = getMaturityLevel(overallScore);

  const handleWhatsAppClick = () => {
    const message = `Olá! Acabei de realizar o diagnóstico de maturidade em governança e gostaria de saber mais sobre como podem me ajudar. Meu resultado foi: ${maturityLevel.level} (${overallScore.toFixed(1)}/5.0)`;
    const phoneNumber = "5511949783636";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (showResult) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Diagnóstico de Maturidade" />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="text-center px-3 sm:px-6 py-4 sm:py-6">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-2xl leading-tight">Diagnóstico de Maturidade Concluído</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">
                    Obrigado, {contactInfo.name}! Aqui está seu diagnóstico personalizado de governança.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                  {/* Mensagem em destaque */}
                  <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 text-center">
                    <p className="text-sm sm:text-base font-medium text-blue-800 leading-relaxed">
                      <BarChart3 className="inline w-4 h-4 mr-1" />
                      <strong>Empresas com governança estruturada têm valor de mercado 47% maior que seus competidores e reduzem conflitos familiares em 73%.</strong>
                      <br/><span className="text-xs sm:text-sm italic">Fonte: IBGC</span>
                    </p>
                  </div>

                  {/* Layout reorganizado: Radar acima, informações abaixo */}
                  <div className="space-y-6 sm:space-y-8">
                    {/* Seção do Radar */}
                    <div className="w-full">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Radar de Maturidade</h3>
                      <div className="w-full h-72 sm:h-96 max-w-2xl mx-auto">
                        <MaturityRadarChart data={maturityData} />
                      </div>
                    </div>

                    {/* Seção das Informações */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                      {/* Coluna 1: Nível Geral */}
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center lg:text-left">Nível Geral de Maturidade</h3>
                          <div className="flex items-center justify-center lg:justify-start gap-3">
                            <div className={`w-4 h-4 rounded-full ${maturityLevel.color}`}></div>
                            <span className={`font-semibold text-lg sm:text-xl ${maturityLevel.textColor}`}>
                              {maturityLevel.level} ({overallScore.toFixed(1)}/5.0)
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-center lg:text-left">Resultados por Dimensão:</h4>
                          <div className="space-y-3">
                            {maturityData.map((item) => {
                              const level = getMaturityLevel(item.score);
                              return (
                                <div key={item.name} className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                                  <span className="text-sm sm:text-base font-medium flex-1 pr-3">{item.name}</span>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                                    <span className="text-sm sm:text-base font-semibold min-w-[3rem] text-right">{item.score.toFixed(1)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Coluna 2: Próximos Passos */}
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-primary/5 p-4 sm:p-6 rounded-lg">
                          <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-center lg:text-left">Próximos Passos</h4>
                          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                            Baseado no seu diagnóstico, nossa equipe pode ajudar você a elevar 
                            o nível de governança da sua empresa com soluções personalizadas.
                          </p>
                          <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-3">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Saber Mais pelo WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Diagnóstico de Maturidade" />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 px-2">
              <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 leading-tight">
                Diagnóstico de Maturidade em Governança
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground px-2">
                Descubra o nível de maturidade da governança da sua empresa em apenas alguns minutos
              </p>
              <div className="mt-3 sm:mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 mx-2">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <strong>Avanço Automático:</strong> Selecione uma resposta e avançaremos automaticamente para a próxima pergunta
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 px-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                {isCompanyDataPhase && `Dados da empresa ${currentStep + 1} de ${COMPANY_DATA.length}`}
                {isQuestionsPhase && `Pergunta ${currentStep - COMPANY_DATA.length + 1} de ${QUESTIONS.length}`}
                {isContactPhase && 'Dados de contato'}
              </p>
            </div>

            <Card className="mx-2">
              <CardContent className="p-4 sm:p-6">
                {(isCompanyDataPhase || isQuestionsPhase) ? (
                  <div>
                    <div className="mb-4 sm:mb-6">
                      {isCompanyDataPhase && currentStep < COMPANY_DATA.length && (
                        <>
                          <div className="text-xs sm:text-sm text-primary font-medium mb-2">
                            Dados da Empresa
                          </div>
                          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-tight">
                            {COMPANY_DATA[currentStep].texto}
                          </h2>
                        </>
                      )}
                      {isQuestionsPhase && currentStep >= COMPANY_DATA.length && currentStep - COMPANY_DATA.length < QUESTIONS.length && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xs sm:text-sm text-primary font-medium">
                              {QUESTIONS[currentStep - COMPANY_DATA.length].dimensao}
                            </div>
                            {QUESTIONS[currentStep - COMPANY_DATA.length].indicador && (
                              <Badge variant="secondary" className="text-xs">
                                {QUESTIONS[currentStep - COMPANY_DATA.length].indicador}
                              </Badge>
                            )}
                          </div>
                          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-tight">
                            {QUESTIONS[currentStep - COMPANY_DATA.length].texto}
                          </h2>
                          {QUESTIONS[currentStep - COMPANY_DATA.length].referencia && (
                            <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
                              <strong>Referência IBGC:</strong> {QUESTIONS[currentStep - COMPANY_DATA.length].referencia}
                            </div>
                          )}
                        </>
                      )}
                      
                      {isTransitioning && (
                        <div className="flex items-center gap-2 text-primary mb-3 sm:mb-4 p-3 bg-primary/10 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs sm:text-sm font-medium">Resposta registrada! Avançando...</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {isCompanyDataPhase && (
                        <QuestionInput
                          question={COMPANY_DATA[currentStep]}
                          value={answers.companyData[COMPANY_DATA[currentStep].numero]}
                          onChange={handleAnswer}
                          disabled={isTransitioning}
                        />
                      )}
                      {isQuestionsPhase && (
                        <QuestionInput
                          question={QUESTIONS[currentStep - COMPANY_DATA.length]}
                          value={answers.questions[QUESTIONS[currentStep - COMPANY_DATA.length].numero]}
                          onChange={handleAnswer}
                          disabled={isTransitioning}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-tight">
                      Para receber seu diagnóstico personalizado
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                      Preencha seus dados abaixo e enviaremos o relatório completo
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={contactInfo.company}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || isTransitioning}
                    className="text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  {isContactPhase ? (
                    <Button 
                      onClick={handleNext}
                      disabled={isTransitioning}
                      className="text-sm sm:text-base"
                    >
                      Gerar Diagnóstico
                    </Button>
                  ) : (
                    false && ( // Disable skip functionality for now
                      <Button 
                        onClick={handleNext}
                        variant="ghost"
                        className="text-muted-foreground text-sm sm:text-base"
                      >
                        Pular ⏭️
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground px-4">
              Seus dados estão seguros e serão utilizados apenas para envio do diagnóstico
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityQuiz;