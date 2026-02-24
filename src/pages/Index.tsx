import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { 
  Users, 
  FileText,
  Calendar, 
  ArrowRight, 
  BarChart3, 
  Settings, 
  Activity, 
  Info,
  Shield,
  Layers,
  Network,
  Check,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  HelpCircle
} from "lucide-react";

interface Question {
  id: number;
  category: string;
  question: string;
  options: { value: number; label: string }[];
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const questions: Question[] = [
  {
    id: 1,
    category: "Estrutura Formal",
    question: "Sua empresa possui um conselho de administração formal e ativo?",
    options: [
      { value: 1, label: "Não possuímos estrutura formal" },
      { value: 2, label: "Temos reuniões informais ocasionais" },
      { value: 3, label: "Temos estrutura básica estabelecida" },
      { value: 4, label: "Conselho ativo com reuniões regulares" },
      { value: 5, label: "Estrutura profissional com membros independentes" }
    ]
  },
  {
    id: 2,
    category: "Processos Decisórios",
    question: "Como são tomadas as principais decisões estratégicas da empresa?",
    options: [
      { value: 1, label: "Decisões centralizadas no fundador/proprietário" },
      { value: 2, label: "Discussões informais entre sócios" },
      { value: 3, label: "Processos definidos mas nem sempre seguidos" },
      { value: 4, label: "Processos estruturados e documentados" },
      { value: 5, label: "Governança profissional com comitês especializados" }
    ]
  },
  {
    id: 3,
    category: "Participação Familiar",
    question: "Como a família participa da gestão e governança do negócio?",
    options: [
      { value: 1, label: "Participação conflituosa ou desestruturada" },
      { value: 2, label: "Participação informal sem regras claras" },
      { value: 3, label: "Algumas regras básicas definidas" },
      { value: 4, label: "Protocolo familiar estabelecido" },
      { value: 5, label: "Governança familiar profissionalizada" }
    ]
  },
  {
    id: 4,
    category: "Sucessão",
    question: "Qual o nível de preparação para a sucessão na sua empresa?",
    options: [
      { value: 1, label: "Tema não é discutido" },
      { value: 2, label: "Conversas informais sobre sucessão" },
      { value: 3, label: "Sucessores identificados informalmente" },
      { value: 4, label: "Plano de sucessão em desenvolvimento" },
      { value: 5, label: "Plano de sucessão estruturado e em execução" }
    ]
  },
  {
    id: 5,
    category: "Prestação de Contas",
    question: "Como funcionam os relatórios e prestação de contas na empresa?",
    options: [
      { value: 1, label: "Informações financeiras básicas irregulares" },
      { value: 2, label: "Relatórios informais quando solicitados" },
      { value: 3, label: "Relatórios financeiros regulares" },
      { value: 4, label: "Relatórios gerenciais estruturados" },
      { value: 5, label: "Dashboard completo com KPIs e métricas" }
    ]
  },
  {
    id: 6,
    category: "Cultura de Governança",
    question: "Como você avalia a cultura de governança na sua organização?",
    options: [
      { value: 1, label: "Cultura familiar tradicional sem formalização" },
      { value: 2, label: "Início de consciência sobre governança" },
      { value: 3, label: "Alguns processos implementados" },
      { value: 4, label: "Cultura de governança em desenvolvimento" },
      { value: 5, label: "Cultura de governança consolidada" }
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Quiz state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [contactInfo, setContactInfo] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [showResult, setShowResult] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const isQuestionsPhase = currentStep < questions.length;
  const isContactPhase = currentStep === questions.length;
  const progress = (currentStep / (questions.length + 1)) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isQuestionsPhase && !answers[questions[currentStep].id]) {
      toast({
        title: "Resposta obrigatória",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (isContactPhase) {
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      setShowResult(true);
      toast({
        title: "Diagnóstico gerado!",
        description: "Seu diagnóstico de maturidade foi processado com sucesso.",
      });
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const calculateMaturityData = () => {
    const categoryScores: { [key: string]: number[] } = {};
    
    questions.forEach(question => {
      const answer = answers[question.id] || 0;
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = [];
      }
      categoryScores[question.category].push(answer);
    });

    // Sector benchmarks for each category
    const sectorBenchmarks: { [key: string]: number } = {
      "Estrutura Formal": 3.8,
      "Processos Decisórios": 3.6,
      "Participação Familiar": 3.9,
      "Sucessão": 3.6,
      "Prestação de Contas": 3.5,
      "Cultura de Governança": 3.7
    };

    return Object.entries(categoryScores).map(([category, scores]) => ({
      name: category,
      score: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      sectorAverage: sectorBenchmarks[category] || 3.5,
      fullMark: 5
    }));
  };

  const getMaturityLevel = (score: number) => {
    if (score >= 4) return { level: "Alto", color: "bg-green-500", textColor: "text-green-700" };
    if (score >= 3) return { level: "Médio", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { level: "Baixo", color: "bg-red-500", textColor: "text-red-700" };
  };

  const handleWhatsAppClick = () => {
    const overallScore = Object.values(answers).reduce((sum, score) => sum + score, 0) / Object.values(answers).length;
    const maturityLevel = getMaturityLevel(overallScore);
    const message = `Olá! Acabei de realizar o diagnóstico de maturidade em governança e gostaria de saber mais sobre como podem me ajudar. Meu resultado foi: ${maturityLevel.level} (${overallScore.toFixed(1)}/5.0)`;
    const phoneNumber = "5511999999999";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const overallScore = Object.values(answers).reduce((sum, score) => sum + score, 0) / Object.values(answers).length;
  const maturityData = calculateMaturityData();
  const maturityLevel = getMaturityLevel(overallScore);

  // Quiz Result Component
  const QuizResult = () => (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Diagnóstico de Maturidade Concluído</CardTitle>
          <p className="text-muted-foreground">
            Obrigado, {contactInfo.name}! Aqui está seu diagnóstico personalizado de governança.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Radar de Maturidade</h3>
              <MaturityRadarChart data={maturityData} />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Nível Geral de Maturidade</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${maturityLevel.color}`}></div>
                  <span className={`font-medium ${maturityLevel.textColor}`}>
                    {maturityLevel.level} ({overallScore.toFixed(1)}/5.0)
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Resultados por Dimensão:</h4>
                <div className="space-y-2">
                  {maturityData.map((item) => {
                    const level = getMaturityLevel(item.score);
                    return (
                      <div key={item.name} className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${level.color}`}></div>
                          <span className="text-sm font-medium">{item.score.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Próximos Passos</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Baseado no seu diagnóstico, nossa equipe pode ajudar você a elevar 
                  o nível de governança da sua empresa com soluções personalizadas.
                </p>
                <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Saber Mais pelo WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white py-4 px-4 sm:px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center min-w-0 flex-1">
            <img 
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
              alt="Legacy" 
              className="h-6 sm:h-8 w-auto flex-shrink-0"
            />
            <p className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600 hidden sm:block">
              Governança Corporativa para Empresas Familiares
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              className="bg-legacy-purple-500 text-white hover:bg-opacity-90 px-3 sm:px-4 py-2 text-sm sm:text-base"
              onClick={() => navigate("/login")}
            >
              <span className="hidden xs:inline">Entrar</span>
              <span className="xs:hidden">Login</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="legacy-gradient text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                90% das empresas familiares desaparecem na 3ª geração. A sua será diferente?
              </h1>
              <p className="text-xl mb-8">
                Tecnologia e inteligência artificial para organizar, documentar e garantir o legado da sua empresa familiar.
              </p>
              <div>
                <Button 
                  className="bg-white text-legacy-500 hover:bg-gray-100 px-6 py-3 text-lg"
                  onClick={() => navigate("/login")}
                >
                  Começar Agora <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-12 text-legacy-500">Módulos Principais</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Estrutura Familiar e Societária"
                description="Cadastre membros da família, mapeie empresas e gerencie documentos-chave."
                icon={<Users className="h-10 w-10 text-legacy-purple-500" />}
              />
              <FeatureCard 
                title="Conselhos e Comitês"
                description="Organize conselhos, cadastre conselheiros e gerencie reuniões com eficiência."
                icon={<Shield className="h-10 w-10 text-legacy-purple-500" />}
              />
              <FeatureCard 
                title="Rituais de Governança"
                description="Programe e documente assembleias familiares, fóruns e encontros de herdeiros."
                icon={<Calendar className="h-10 w-10 text-legacy-purple-500" />}
              />
              <FeatureCard 
                title="Sucessão e Desenvolvimento"
                description="Planeje a sucessão e acompanhe o desenvolvimento de herdeiros."
                icon={<Network className="h-10 w-10 text-legacy-purple-500" />}
              />
              <FeatureCard 
                title="Documentação Oficial"
                description="Armazene com segurança todos os documentos importantes da governança."
                icon={<FileText className="h-10 w-10 text-legacy-purple-500" />}
              />
              <FeatureCard 
                title="Avaliação de Maturidade"
                description="Avalie o nível de maturidade da governança em 6 dimensões-chave."
                icon={<Layers className="h-10 w-10 text-legacy-purple-500" />}
              />
            </div>
            
          </div>
        </section>

        
        {/* Diagnóstico de Maturidade Section */}
        <section id="diagnostico" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-legacy-500">
                Diagnóstico Gratuito de Maturidade em Governança
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Descubra o nível de maturidade da governança da sua empresa em apenas alguns minutos
              </p>
              
              <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-legacy-purple-500 hover:bg-legacy-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                    onClick={() => setIsQuizOpen(true)}
                  >
                     <BarChart3 className="w-5 h-5 mr-2" />
                     Quero fazer o Diagnóstico
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                      Diagnóstico de Maturidade em Governança
                    </DialogTitle>
                  </DialogHeader>
                  
                  {showResult ? (
                    <QuizResult />
                  ) : (
                    <div className="p-6">
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          {isQuestionsPhase ? `Pergunta ${currentStep + 1} de ${questions.length}` : 'Dados de contato'}
                        </p>
                      </div>

                      {isQuestionsPhase ? (
                        <div>
                          <div className="mb-6">
                            <div className="text-sm text-primary font-medium mb-2">
                              {questions[currentStep].category}
                            </div>
                            <h2 className="text-xl font-semibold mb-4">
                              {questions[currentStep].question}
                            </h2>
                          </div>

                          <RadioGroup
                            value={answers[questions[currentStep].id]?.toString()}
                            onValueChange={(value) => handleAnswer(questions[currentStep].id, parseInt(value))}
                            className="space-y-3"
                          >
                            {questions[currentStep].options.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                                <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Para receber seu diagnóstico personalizado
                          </h2>
                          <p className="text-muted-foreground mb-6">
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

                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Anterior
                        </Button>

                        <Button onClick={handleNext}>
                          {isContactPhase ? 'Gerar Diagnóstico' : 'Próxima'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      <div className="text-center mt-6 text-sm text-muted-foreground">
                        Seus dados estão seguros e serão utilizados apenas para envio do diagnóstico
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-legacy-500">Escolha o plano ideal para sua empresa</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Opções flexíveis para atender às necessidades de governança da sua empresa familiar.
              </p>
            </div>

            <Tabs defaultValue="monthly" className="max-w-5xl mx-auto">
              <div className="text-center mb-8 px-4">
                <TabsList className="w-fit max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 h-auto p-1 gap-1">
                  <TabsTrigger value="monthly" className="text-sm sm:text-base py-2 px-3">Pagamento Mensal</TabsTrigger>
                  <TabsTrigger value="annual" className="text-sm sm:text-base py-2 px-3">
                    <span className="block sm:inline">Pagamento Anual</span>
                    <Badge className="ml-0 sm:ml-2 mt-1 sm:mt-0 bg-green-100 text-green-800 text-xs">-10%</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="monthly">
                <div className="grid md:grid-cols-3 gap-8">
                  <PricingCard 
                    name="Basic"
                    description="Para pequenas empresas familiares"
                    features={[
                      "Até 5 usuários",
                      "Acesso a 3 Agentes de IA",
                      "Armazenamento básico para documentos",
                      "Suporte por e-mail"
                    ]}
                    highlightedFeatures={[]}
                    cta="Solicitar Proposta"
                  />
                  
                  <PricingCard 
                    name="Professional"
                    description="Para empresas em crescimento"
                    featured={true}
                    features={[
                      "Até 15 usuários",
                      "Acesso a todos os Agentes de IA",
                      "Armazenamento ampliado para documentos",
                      "Suporte por telefone e e-mail",
                      "Relatórios avançados"
                    ]}
                    highlightedFeatures={[
                      "Acesso a todos os Agentes de IA",
                      "Relatórios avançados"
                    ]}
                    cta="Solicitar Proposta"
                  />
                  
                  <PricingCard 
                    name="Enterprise"
                    description="Para empresas familiares complexas"
                    features={[
                      "Usuários ilimitados",
                      "Acesso a todos os Agentes de IA com recursos personalizados",
                      "Armazenamento ilimitado",
                      "Suporte 24/7 com gerente de conta dedicado",
                      "Consultoria de governança incluída",
                      "API e integrações personalizadas"
                    ]}
                    highlightedFeatures={[
                      "Usuários ilimitados",
                      "Consultoria de governança incluída",
                      "API e integrações personalizadas"
                    ]}
                    cta="Solicitar Proposta"
                  />
                </div>
                
              </TabsContent>
              
              <TabsContent value="annual">
                <div className="grid md:grid-cols-3 gap-8">
                  <PricingCard 
                    name="Basic"
                    description="Para pequenas empresas familiares"
                    features={[
                      "Até 5 usuários",
                      "Acesso a 3 Agentes de IA",
                      "Armazenamento básico para documentos",
                      "Suporte por e-mail"
                    ]}
                    highlightedFeatures={[]}
                    cta="Solicitar Proposta"
                  />
                  
                  <PricingCard 
                    name="Professional"
                    description="Para empresas em crescimento"
                    featured={true}
                    features={[
                      "Até 15 usuários",
                      "Acesso a todos os Agentes de IA",
                      "Armazenamento ampliado para documentos",
                      "Suporte por telefone e e-mail",
                      "Relatórios avançados"
                    ]}
                    highlightedFeatures={[
                      "Acesso a todos os Agentes de IA",
                      "Relatórios avançados"
                    ]}
                    cta="Solicitar Proposta"
                  />
                  
                  <PricingCard 
                    name="Enterprise"
                    description="Para empresas familiares complexas"
                    features={[
                      "Usuários ilimitados",
                      "Acesso a todos os Agentes de IA com recursos personalizados",
                      "Armazenamento ilimitado",
                      "Suporte 24/7 com gerente de conta dedicado",
                      "Consultoria de governança incluída",
                      "API e integrações personalizadas"
                    ]}
                    highlightedFeatures={[
                      "Usuários ilimitados",
                      "Consultoria de governança incluída",
                      "API e integrações personalizadas"
                    ]}
                    cta="Solicitar Proposta"
                  />
                </div>
                
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold mb-4 text-legacy-500">Perguntas Frequentes</h2>
                <p className="text-xl text-gray-600">
                  Tire suas dúvidas sobre a Legacy e governança familiar
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    O que é a Legacy?
                  </AccordionTrigger>
                  <AccordionContent>
                    A Legacy é a primeira plataforma digital do Brasil especializada em governança corporativa para empresas familiares. 
                    Combinamos tecnologia e inteligência artificial para organizar, documentar e operacionalizar toda a estrutura de governança.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Como a plataforma se diferencia de consultorias tradicionais?
                  </AccordionTrigger>
                  <AccordionContent>
                    Diferentemente das consultorias, oferecemos uma solução escalável, acessível e sempre disponível. Nossa plataforma 
                    reduz em 90% o tempo de implementação e 80% o custo comparado a consultorias tradicionais, mantendo toda a 
                    documentação e processos organizados digitalmente.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Preciso de conhecimento em governança para usar?
                  </AccordionTrigger>
                  <AccordionContent>
                    Não! Nossa plataforma foi desenvolvida para ser intuitiva e guiar você em cada passo. Os agentes de IA fornecem 
                    orientações contextualizadas e templates prontos. Além disso, oferecemos suporte especializado e materiais 
                    educativos para sua jornada.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Qual o tempo médio para estruturar a governança com a Legacy?
                  </AccordionTrigger>
                  <AccordionContent>
                    Em média, nossos clientes conseguem estruturar a governança básica em 30-60 dias, comparado aos 6-12 meses 
                    típicos de consultorias tradicionais. O tempo varia conforme a complexidade da empresa e o engajamento da família.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Os dados da minha família e empresa estão seguros?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutamente. Utilizamos criptografia de ponta a ponta, infraestrutura em nuvem com certificações 
                    internacionais e seguimos rigorosamente a LGPD. Seus dados são exclusivamente seus e jamais são 
                    compartilhados ou utilizados para outros fins.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Como a IA ajuda no processo de sucessão?
                  </AccordionTrigger>
                  <AccordionContent>
                    Nossa IA analisa perfis familiares, competências e preferências para sugerir planos de sucessão personalizados. 
                    Ela também monitora o desenvolvimento de herdeiros, identifica lacunas de competência e recomenda ações 
                    específicas para preparar a próxima geração.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    É possível integrar a Legacy a outras ferramentas da empresa?
                  </AccordionTrigger>
                  <AccordionContent>
                    Sim! Nossa plataforma oferece APIs e integrações com principais ERPs, sistemas financeiros e ferramentas 
                    de gestão. Nos planos Professional e Enterprise, desenvolvemos integrações customizadas conforme sua necessidade.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Como funciona o suporte da plataforma?
                  </AccordionTrigger>
                  <AccordionContent>
                    Oferecemos suporte multicanal: chat online, e-mail e telefone. Planos Professional incluem consultoria 
                    especializada, e planos Enterprise contam com gerente de conta dedicado e suporte 24/7.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Bancas jurídicas podem usar a plataforma com seus clientes?
                  </AccordionTrigger>
                  <AccordionContent>
                    Sim! Temos um programa especial para escritórios jurídicos, incluindo licenças para múltiplos clientes, 
                    whitelabel e comissionamento. A plataforma permite que advogados prestem consultoria de governança 
                    de forma mais eficiente e escalável.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Quanto tempo até ver resultados práticos na governança?
                  </AccordionTrigger>
                  <AccordionContent>
                    Os primeiros resultados aparecem já nas primeiras semanas: maior organização documental, clareza 
                    nos processos e redução de conflitos. Em 3-6 meses, você terá uma governança estruturada funcionando, 
                    com melhor tomada de decisão e preparação sucessória encaminhada.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-legacy-500">Pronto para transformar a governança da sua empresa?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Comece hoje a organizar, documentar e evoluir a governança da sua empresa familiar.
            </p>
            <Button 
              className="legacy-button-primary px-8 py-3 text-lg"
              onClick={() => navigate("/login")}
            >
              Comece Agora <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <img 
                src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png" 
                alt="Legacy" 
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-300 mb-4">
                Plataforma completa de governança corporativa para empresas familiares.
              </p>
              <p className="text-sm text-gray-400">
                Transformando a gestão de empresas familiares com tecnologia e inteligência artificial.
              </p>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Estrutura Familiar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conselhos & Comitês</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rituais de Governança</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sucessão</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Avaliação de Maturidade</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="/investors" className="hover:text-white transition-colors">Investidores</a></li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-700 my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">LGPD</a>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Legacy. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-legacy-500 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

const PricingCard = ({
  name,
  description,
  features,
  highlightedFeatures,
  cta,
  featured = false
}: {
  name: string;
  description: string;
  features: string[];
  highlightedFeatures: string[];
  cta: string;
  featured?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Card className={`flex flex-col ${featured ? 'border-2 border-blue-500 shadow-lg relative' : ''}`}>
      {featured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">Mais Popular</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">R$</span>
          <span className="text-gray-500 ml-2">Consulte valores</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className={`rounded-full p-0.5 ${highlightedFeatures.includes(feature) ? 'text-blue-600' : 'text-green-600'}`}>
                <Check className="h-4 w-4" />
              </div>
              <span className={highlightedFeatures.includes(feature) ? 'font-medium' : ''}>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${featured ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
          onClick={() => navigate("/login")}
        >
          {cta}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Index;
