import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Leaf, BarChart3, Save, Users, Scale, Target, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { esgQuestions, maturityLevels, pillarInfo } from "@/data/esgMaturityData";
import { ESGUserAnswers } from "@/types/esgMaturity";
import { calculateESGMaturity, saveESGAssessment } from "@/utils/esgMaturityCalculator";
import ESGResultsDashboard from "@/components/ESGResultsDashboard";
import ESGHistoryModal from "@/components/ESGHistoryModal";

const MaturityESG = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ESGUserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [currentPillar, setCurrentPillar] = useState<string>('environmental');
  const [showNavigator, setShowNavigator] = useState(false);

  const totalQuestions = esgQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  // Load saved answers on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('esg_temp_answers');
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }
  }, []);

  // Auto-save answers
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('esg_temp_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const currentQuestionData = esgQuestions[currentQuestion];
  const isAnswered = answers[currentQuestionData.id] !== undefined;
  
  const pillarQuestions = esgQuestions.filter(q => q.pillar === currentPillar);
  const currentPillarIndex = pillarQuestions.findIndex(q => q.id === currentQuestionData.id);

  const getPillarIcon = (pillar: string) => {
    const iconMap = {
      environmental: Leaf,
      social: Users,
      governance: Scale,
      strategy: Target
    };
    return iconMap[pillar as keyof typeof iconMap] || Leaf;
  };

  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        handleNext();
      }
    }, 400);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      updateCurrentPillar(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      updateCurrentPillar(currentQuestion - 1);
    }
  };

  const updateCurrentPillar = (questionIndex: number) => {
    const question = esgQuestions[questionIndex];
    if (question && question.pillar !== currentPillar) {
      setCurrentPillar(question.pillar);
    }
  };

  const handleFinishAssessment = () => {
    const result = calculateESGMaturity(answers);
    setResults(result);
    saveESGAssessment(answers, result);
    setShowResults(true);
    
    // Clear temporary answers
    localStorage.removeItem('esg_temp_answers');
    
    toast({
      title: "Avaliação ESG Concluída!",
      description: `Sua maturidade ESG é: ${result.maturityLevel.name} (${result.overallScore.toFixed(1)}/6.0)`,
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setCurrentPillar('environmental');
    localStorage.removeItem('esg_temp_answers');
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    updateCurrentPillar(index);
  };

  if (showResults && results) {
    return <ESGResultsDashboard results={results} onRestart={handleRestart} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Maturidade ESG" />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {React.createElement(getPillarIcon(currentPillar), { 
                    className: "h-8 w-8 text-green-500" 
                  })}
                  <div>
                    <CardTitle className="text-xl">Avaliação de Maturidade ESG</CardTitle>
                    <p className="text-sm text-gray-600">
                      Responda 90 perguntas para descobrir o nível de maturidade ESG da sua empresa
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {Object.keys(answers).length}/{totalQuestions}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso da Avaliação</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* Current Pillar Badge */}
          <div className="mb-4">
            <Badge className={`${pillarInfo[currentPillar as keyof typeof pillarInfo].color} text-white px-4 py-2`}>
              {pillarInfo[currentPillar as keyof typeof pillarInfo].title}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              {pillarInfo[currentPillar as keyof typeof pillarInfo].description}
            </p>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      Pergunta {currentQuestion + 1}
                    </Badge>
                    <Badge variant="secondary">
                      {currentQuestionData.subDimension}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQuestionData.text}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestionData.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQuestionData.id, parseInt(value))}
                className="space-y-4"
              >
                {maturityLevels.map((level) => (
                  <div key={level.level} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={level.level.toString()} id={`level-${level.level}`} className="mt-1" />
                    <Label htmlFor={`level-${level.level}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${level.color} text-white text-xs`}>
                          {level.level}
                        </Badge>
                        <span className="font-medium">{level.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <ESGHistoryModal />
            </div>

            <div className="flex gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button
                  onClick={handleFinishAssessment}
                  disabled={!isAnswered}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Finalizar Avaliação
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator Toggle */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowNavigator(!showNavigator)}
              className="w-full flex items-center justify-center gap-2"
            >
              {showNavigator ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ocultar Navegação Rápida
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Mostrar Navegação Rápida ({Object.keys(answers).length}/{totalQuestions} respondidas)
                </>
              )}
            </Button>

            {showNavigator && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Navegação Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 gap-2">
                    {esgQuestions.map((question, index) => (
                      <Button
                        key={question.id}
                        variant={answers[question.id] ? "default" : "outline"}
                        size="sm"
                        onClick={() => jumpToQuestion(index)}
                        className={`w-10 h-10 p-0 ${currentQuestion === index ? 'ring-2 ring-primary' : ''}`}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityESG;