import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, BarChart3, Lightbulb, Save } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { QuestionInput } from "@/components/QuestionInput";
import { COMPANY_DATA, QUESTIONS } from "@/data/maturityData";
import { calcularPontuacao, convertToRadarData, detectFamilyBusiness } from "@/utils/maturityCalculator";
import { UserAnswers } from "@/types/maturity";
import { saveMaturityAssessment, getCurrentMaturityAssessment } from "@/utils/maturityStorage";
import { upsertDiagnosticoMaturidade } from "@/services/maturidade";
import { useEmpresas } from "@/hooks/useEmpresas";

const MaturityQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState<'company' | 'questions'>('company');
  const [answers, setAnswers] = useState<UserAnswers>({
    companyData: {},
    questions: {}
  });
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFamilyBusiness, setIsFamilyBusiness] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { firstEmpresaId } = useEmpresas();

  const totalSteps = COMPANY_DATA.length + QUESTIONS.length;
  const progress = (currentStep / totalSteps) * 100;
  
  const isCompanyDataPhase = currentSection === 'company';
  const isQuestionsPhase = currentSection === 'questions';

  useEffect(() => {
    // Detectar se é empresa familiar quando dados da empresa mudarem
    setIsFamilyBusiness(detectFamilyBusiness(answers.companyData));
  }, [answers.companyData]);

  const needsExplicitNext = () => {
    if (isCompanyDataPhase && currentStep < COMPANY_DATA.length) {
      const t = COMPANY_DATA[currentStep].tipo;
      return t === "numerico" || t === "texto";
    }
    if (isQuestionsPhase && currentStep >= COMPANY_DATA.length) {
      const q = QUESTIONS[currentStep - COMPANY_DATA.length];
      const t = q.tipo;
      return ["numerico", "numerico_multiplo", "multipla_escolha_multipla", "texto", "matriz"].includes(t);
    }
    return false;
  };

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

      const isSingleChoice = () => {
        if (isCompanyDataPhase && currentStep < COMPANY_DATA.length)
          return COMPANY_DATA[currentStep].tipo === "multipla_escolha_unica";
        if (isQuestionsPhase && currentStep >= COMPANY_DATA.length)
          return QUESTIONS[currentStep - COMPANY_DATA.length].tipo === "multipla_escolha_unica";
        return false;
      };

      if (isSingleChoice()) {
        setIsTransitioning(true);
        setTimeout(() => {
          handleNext(false);
          setIsTransitioning(false);
        }, 400);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      setIsTransitioning(false);
    }
  };

  const getQuestionAtStep = (step: number) => {
    if (step < COMPANY_DATA.length) return null;
    const idx = step - COMPANY_DATA.length;
    return idx < QUESTIONS.length ? QUESTIONS[idx] : null;
  };

  const handleNext = (validateRequired = true) => {
    if (validateRequired) {
      if (isCompanyDataPhase) {
        const currentData = COMPANY_DATA[currentStep];
        const currentValue = answers.companyData[currentData.numero];
        if (currentValue === undefined || currentValue === null || currentValue === "")
          return;
        if (typeof currentValue === "number" && isNaN(currentValue)) return;
        if (Array.isArray(currentValue) && currentValue.length === 0) return;
      } else if (isQuestionsPhase) {
        const questionIndex = currentStep - COMPANY_DATA.length;
        const currentQuestion = QUESTIONS[questionIndex];
        if (shouldSkipQuestion(currentQuestion)) {
          // segue
        } else {
          const currentValue = answers.questions[currentQuestion.numero];
          if (currentValue === undefined || currentValue === null || currentValue === "")
            return;
          if (typeof currentValue === "number" && isNaN(currentValue)) return;
          if (Array.isArray(currentValue) && currentValue.length === 0) return;
        }
      }
    }

    let newStep = currentStep + 1;
    // Pular questões condicionais quando não se aplicam
    while (newStep < totalSteps) {
      const q = getQuestionAtStep(newStep);
      if (!q || !shouldSkipQuestion(q)) break;
      newStep++;
    }

    if (newStep >= totalSteps) {
      const result = calcularPontuacao(answers, isFamilyBusiness);
      saveMaturityAssessment(result, answers.companyData);
      setShowResult(true);
      toast({
        title: "Diagnóstico gerado!",
        description: "Seu diagnóstico de maturidade foi processado com sucesso.",
      });
      return;
    }

    setCurrentStep(newStep);
    if (newStep < COMPANY_DATA.length) {
      setCurrentSection('company');
    } else {
      setCurrentSection('questions');
    }
  };

  const shouldSkipQuestion = (question: any): boolean => {
    if (question.numero === "4.1") return answers.questions["4"] !== "sim";
    if (question.numero === "10.1") return answers.questions["10"] !== "sim";
    return false;
  };

  const handlePrevious = () => {
    let prevStep = currentStep - 1;
    while (prevStep >= COMPANY_DATA.length) {
      const q = getQuestionAtStep(prevStep);
      if (!q || !shouldSkipQuestion(q)) break;
      prevStep--;
    }
    setCurrentStep(prevStep);
    setCurrentSection(prevStep < COMPANY_DATA.length ? 'company' : 'questions');
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

  const handleSaveAndExit = async () => {
    const result = calcularPontuacao(answers, isFamilyBusiness);
    saveMaturityAssessment(result, answers.companyData);
    if (firstEmpresaId) {
      const stored = getCurrentMaturityAssessment();
      if (stored) {
        await upsertDiagnosticoMaturidade(firstEmpresaId, stored);
      }
    }
    toast({
      title: "Diagnóstico salvo",
      description: "Os dados foram salvos com sucesso. Redirecionando...",
    });
    navigate("/maturidade-governanca");
  };

  if (showResult) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Diagnóstico de Maturidade" />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="w-full">
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="text-center px-3 sm:px-6 py-4 sm:py-6">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-2xl leading-tight">Diagnóstico de Maturidade Concluído</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">
                    Aqui está seu diagnóstico de maturidade em governança.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-8 sm:space-y-10">
                    {/* Nível geral em destaque */}
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 w-full py-4 px-4 sm:px-6 bg-muted/30 rounded-lg">
                      <h3 className="text-lg sm:text-xl font-semibold">Nível Geral de Maturidade</h3>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full ${maturityLevel.color}`} />
                        <span className={`font-bold text-xl sm:text-2xl ${maturityLevel.textColor}`}>
                          {maturityLevel.level} ({overallScore.toFixed(1)}/5.0)
                        </span>
                      </div>
                    </div>

                    {/* Radar + Barras lado a lado em telas grandes */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                      <div className="w-full">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center xl:text-left">Radar de Maturidade</h3>
                        <div className="w-full h-72 sm:h-80 xl:h-96">
                          <MaturityRadarChart data={maturityData} />
                        </div>
                      </div>
                      <div className="w-full">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center xl:text-left">Resultados por Dimensão</h3>
                        <div className="space-y-4">
                          {maturityData.map((item) => {
                            const level = getMaturityLevel(item.score);
                            const pct = Math.round((item.score / item.fullMark) * 100);
                            return (
                              <div key={item.name} className="w-full">
                                <div className="flex justify-between items-baseline mb-1.5">
                                  <span className="text-sm sm:text-base font-medium">{item.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${level.color} text-white`}>
                                      {level.level}
                                    </span>
                                    <span className="text-sm font-semibold min-w-[2.5rem] text-right">{item.score.toFixed(1)}</span>
                                  </div>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${level.color}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-8">
                      <Button
                        onClick={handleSaveAndExit}
                        className="bg-legacy-500 hover:bg-legacy-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar e Sair
                      </Button>
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
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/maturidade-governanca")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
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
                  <strong>Perguntas de única escolha:</strong> avanço automático ao selecionar. <strong>Números ou múltipla escolha:</strong> use o botão Avançar.
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 px-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                {isCompanyDataPhase && `Dados da empresa ${currentStep + 1} de ${COMPANY_DATA.length}`}
                {isQuestionsPhase && `Pergunta ${currentStep - COMPANY_DATA.length + 1} de ${QUESTIONS.length}`}
              </p>
            </div>

            <Card className="mx-2">
              <CardContent className="p-4 sm:p-6">
                {(isCompanyDataPhase || isQuestionsPhase) && (
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
                  {needsExplicitNext() && (
                    <Button
                      onClick={() => handleNext(true)}
                      disabled={isTransitioning}
                      className="text-sm sm:text-base"
                    >
                      Avançar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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