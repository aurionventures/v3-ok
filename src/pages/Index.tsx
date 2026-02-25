import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle, BarChart3 } from "lucide-react";

import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingWhatIs from "@/components/landing/LandingWhatIs";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingPillars from "@/components/landing/LandingPillars";
import LandingComparison from "@/components/landing/LandingComparison";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingFooter from "@/components/landing/LandingFooter";

// --- Quiz data & types ---
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
  { id: 1, category: "Estrutura Formal", question: "Sua empresa possui um conselho de administração formal e ativo?", options: [{ value: 1, label: "Não possuímos estrutura formal" }, { value: 2, label: "Temos reuniões informais ocasionais" }, { value: 3, label: "Temos estrutura básica estabelecida" }, { value: 4, label: "Conselho ativo com reuniões regulares" }, { value: 5, label: "Estrutura profissional com membros independentes" }] },
  { id: 2, category: "Processos Decisórios", question: "Como são tomadas as principais decisões estratégicas da empresa?", options: [{ value: 1, label: "Decisões centralizadas no fundador/proprietário" }, { value: 2, label: "Discussões informais entre sócios" }, { value: 3, label: "Processos definidos mas nem sempre seguidos" }, { value: 4, label: "Processos estruturados e documentados" }, { value: 5, label: "Governança profissional com comitês especializados" }] },
  { id: 3, category: "Participação Familiar", question: "Como a família participa da gestão e governança do negócio?", options: [{ value: 1, label: "Participação conflituosa ou desestruturada" }, { value: 2, label: "Participação informal sem regras claras" }, { value: 3, label: "Algumas regras básicas definidas" }, { value: 4, label: "Protocolo familiar estabelecido" }, { value: 5, label: "Governança familiar profissionalizada" }] },
  { id: 4, category: "Sucessão", question: "Qual o nível de preparação para a sucessão na sua empresa?", options: [{ value: 1, label: "Tema não é discutido" }, { value: 2, label: "Conversas informais sobre sucessão" }, { value: 3, label: "Sucessores identificados informalmente" }, { value: 4, label: "Plano de sucessão em desenvolvimento" }, { value: 5, label: "Plano de sucessão estruturado e em execução" }] },
  { id: 5, category: "Prestação de Contas", question: "Como funcionam os relatórios e prestação de contas na empresa?", options: [{ value: 1, label: "Informações financeiras básicas irregulares" }, { value: 2, label: "Relatórios informais quando solicitados" }, { value: 3, label: "Relatórios financeiros regulares" }, { value: 4, label: "Relatórios gerenciais estruturados" }, { value: 5, label: "Dashboard completo com KPIs e métricas" }] },
  { id: 6, category: "Cultura de Governança", question: "Como você avalia a cultura de governança na sua organização?", options: [{ value: 1, label: "Cultura familiar tradicional sem formalização" }, { value: 2, label: "Início de consciência sobre governança" }, { value: 3, label: "Alguns processos implementados" }, { value: 4, label: "Cultura de governança em desenvolvimento" }, { value: 5, label: "Cultura de governança consolidada" }] },
];

const sectorBenchmarks: Record<string, number> = {
  "Estrutura Formal": 3.8, "Processos Decisórios": 3.6, "Participação Familiar": 3.9,
  "Sucessão": 3.6, "Prestação de Contas": 3.5, "Cultura de Governança": 3.7,
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [contactInfo, setContactInfo] = useState<ContactForm>({ name: "", email: "", phone: "", company: "" });
  const [showResult, setShowResult] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const isQuestionsPhase = currentStep < questions.length;
  const isContactPhase = currentStep === questions.length;
  const progress = (currentStep / (questions.length + 1)) * 100;

  const handleAnswer = (qId: number, val: number) => setAnswers((p) => ({ ...p, [qId]: val }));

  const handleNext = () => {
    if (isQuestionsPhase && !answers[questions[currentStep].id]) {
      toast({ title: "Resposta obrigatória", description: "Selecione uma resposta.", variant: "destructive" });
      return;
    }
    if (isContactPhase) {
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
        toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
        return;
      }
      setShowResult(true);
      return;
    }
    setCurrentStep((p) => p + 1);
  };

  const calculateMaturityData = () => {
    const cats: Record<string, number[]> = {};
    questions.forEach((q) => {
      if (!cats[q.category]) cats[q.category] = [];
      cats[q.category].push(answers[q.id] || 0);
    });
    return Object.entries(cats).map(([name, scores]) => ({
      name, score: scores.reduce((a, b) => a + b, 0) / scores.length,
      sectorAverage: sectorBenchmarks[name] || 3.5, fullMark: 5,
    }));
  };

  const getLevel = (s: number) => {
    if (s >= 4) return { level: "Alto", color: "bg-green-500", textColor: "text-green-700" };
    if (s >= 3) return { level: "Médio", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { level: "Baixo", color: "bg-red-500", textColor: "text-red-700" };
  };

  const overallScore = Object.values(answers).length ? Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length : 0;
  const maturityData = calculateMaturityData();
  const maturityLevel = getLevel(overallScore);

  const handleWhatsAppClick = () => {
    const msg = `Olá! Realizei o diagnóstico de governança. Resultado: ${maturityLevel.level} (${overallScore.toFixed(1)}/5.0)`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingWhatIs />
        <LandingFeatures />
        <LandingPillars />
        <LandingComparison />

        {/* Diagnóstico CTA */}
        <section className="py-20 bg-[hsl(210,33%,98%)]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-foreground mb-4">
              Diagnóstico Gratuito de Maturidade em Governança
            </h2>
            <p className="font-lato text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Descubra o nível de maturidade da governança da sua empresa em apenas 5 minutos.
            </p>

            <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
              <DialogTrigger asChild>
                <Button className="legacy-button-primary text-lg px-8 py-6 h-auto">
                  <BarChart3 className="w-5 h-5 mr-2" /> Quero fazer o Diagnóstico
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-montserrat text-2xl font-bold text-center">
                    Diagnóstico de Maturidade em Governança
                  </DialogTitle>
                </DialogHeader>

                {showResult ? (
                  <div className="max-w-4xl mx-auto py-8">
                    <div className="text-center mb-6">
                      <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-montserrat text-2xl font-bold">Diagnóstico Concluído</h3>
                      <p className="text-muted-foreground">Obrigado, {contactInfo.name}!</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-montserrat text-lg font-semibold mb-4">Radar de Maturidade</h3>
                        <MaturityRadarChart data={maturityData} />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-montserrat font-semibold mb-2">Nível Geral</h3>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${maturityLevel.color}`} />
                            <span className={`font-medium ${maturityLevel.textColor}`}>
                              {maturityLevel.level} ({overallScore.toFixed(1)}/5.0)
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {maturityData.map((d) => {
                            const l = getLevel(d.score);
                            return (
                              <div key={d.name} className="flex justify-between items-center">
                                <span className="text-sm">{d.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                                  <span className="text-sm font-medium">{d.score.toFixed(1)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <MessageCircle className="w-4 h-4 mr-2" /> Saber Mais pelo WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      {isQuestionsPhase ? `Pergunta ${currentStep + 1} de ${questions.length}` : "Dados de contato"}
                    </p>

                    {isQuestionsPhase ? (
                      <div>
                        <div className="text-sm text-secondary font-medium mb-2">{questions[currentStep].category}</div>
                        <h2 className="font-montserrat text-xl font-semibold mb-4">{questions[currentStep].question}</h2>
                        <RadioGroup
                          value={answers[questions[currentStep].id]?.toString()}
                          onValueChange={(v) => handleAnswer(questions[currentStep].id, parseInt(v))}
                          className="space-y-3"
                        >
                          {questions[currentStep].options.map((o) => (
                            <div key={o.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={o.value.toString()} id={`opt-${o.value}`} />
                              <Label htmlFor={`opt-${o.value}`} className="flex-1 cursor-pointer">{o.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="font-montserrat text-xl font-semibold mb-4">Para receber seu diagnóstico</h2>
                        {[
                          { id: "name", label: "Nome completo *", value: contactInfo.name, key: "name" as const },
                          { id: "email", label: "E-mail *", value: contactInfo.email, key: "email" as const, type: "email" },
                          { id: "phone", label: "Telefone *", value: contactInfo.phone, key: "phone" as const },
                          { id: "company", label: "Empresa", value: contactInfo.company, key: "company" as const },
                        ].map((f) => (
                          <div key={f.id}>
                            <Label htmlFor={f.id}>{f.label}</Label>
                            <Input
                              id={f.id}
                              type={f.type || "text"}
                              value={f.value}
                              onChange={(e) => setContactInfo((p) => ({ ...p, [f.key]: e.target.value }))}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={() => setCurrentStep((p) => p - 1)} disabled={currentStep === 0}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                      </Button>
                      <Button onClick={handleNext} className="bg-secondary text-secondary-foreground hover:brightness-110">
                        {isContactPhase ? "Gerar Diagnóstico" : "Próxima"} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <LandingCTA />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
