import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, ChevronRight, CheckCircle, Users, Building2, 
  BarChart3, Shield, Eye, Award, Target, TrendingUp, ArrowRight,
  Loader2, Mail, Phone, Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Legend 
} from "recharts";

interface GovMetrixQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollToPricing?: () => void;
}

interface QuestionOption {
  label: string;
  value: number;
  exclusive?: boolean;
}

interface Question {
  id: number;
  category: string;
  subcategory: string;
  question: string;
  reference: string;
  type: 'checkbox' | 'radio';
  options: QuestionOption[];
}

interface LeadData {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
}

interface Stage {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

// 10 perguntas do Quiz baseadas no IBGC
const questions: Question[] = [
  {
    id: 1,
    category: 'Sócios',
    subcategory: 'Assembleia geral/reunião de Sócios',
    question: 'Com relação às assembleias/reuniões de sócios, assinale todas as alternativas que se apliquem:',
    reference: 'Código IBGC - 6ª edição: 2.5',
    type: 'checkbox',
    options: [
      { label: 'A convocação ocorre com no mínimo 30 dias de antecedência', value: 14 },
      { label: 'Em conjunto com a convocação são encaminhados os documentos relacionados às matérias a serem discutidas', value: 14 },
      { label: 'Disponibilizam-se meios para voto não presencial', value: 14 },
      { label: 'O presidente do conselho de administração/consultivo participa', value: 14 },
      { label: 'Os demais conselheiros de administração/consultivos participam', value: 14 },
      { label: 'O diretor-presidente participa', value: 14 },
      { label: 'Os demais diretores participam, quando convidados', value: 14 },
      { label: 'Nenhuma das anteriores', value: 0, exclusive: true },
    ],
  },
  {
    id: 2,
    category: 'Sócios',
    subcategory: 'Formalização da Governança',
    question: 'Existe acordo entre sócios/acionistas?',
    reference: 'Código IBGC - 6ª edição: 2.4',
    type: 'radio',
    options: [
      { label: 'Sim', value: 100 },
      { label: 'Não', value: 0 },
    ],
  },
  {
    id: 3,
    category: 'Conselho de administração/consultivo',
    subcategory: 'Estrutura e Composição',
    question: 'Qual a composição do Conselho de Administração/Consultivo?',
    reference: 'Código IBGC - 6ª edição: 3.2',
    type: 'radio',
    options: [
      { label: 'Possui maioria de membros independentes', value: 100 },
      { label: 'Possui alguns membros independentes', value: 60 },
      { label: 'Não possui membros independentes', value: 20 },
      { label: 'Não possui conselho estruturado', value: 0 },
    ],
  },
  {
    id: 4,
    category: 'Conselho de administração/consultivo',
    subcategory: 'Funcionamento',
    question: 'Com relação às reuniões do Conselho, assinale as práticas existentes:',
    reference: 'Código IBGC - 6ª edição: 3.5',
    type: 'checkbox',
    options: [
      { label: 'Reuniões ordinárias com frequência mínima mensal', value: 20 },
      { label: 'Pauta distribuída com antecedência mínima de 7 dias', value: 20 },
      { label: 'Materiais de suporte enviados previamente', value: 20 },
      { label: 'Atas formalizadas e assinadas', value: 20 },
      { label: 'Avaliação anual de desempenho do conselho', value: 20 },
      { label: 'Nenhuma das anteriores', value: 0, exclusive: true },
    ],
  },
  {
    id: 5,
    category: 'Diretoria',
    subcategory: 'Estrutura Executiva',
    question: 'Qual a estrutura da Diretoria Executiva?',
    reference: 'Código IBGC - 6ª edição: 4.1',
    type: 'radio',
    options: [
      { label: 'CEO separado do presidente do conselho, com atribuições claras', value: 100 },
      { label: 'CEO separado do presidente do conselho', value: 70 },
      { label: 'CEO é também presidente do conselho', value: 30 },
      { label: 'Não há separação clara de funções', value: 0 },
    ],
  },
  {
    id: 6,
    category: 'Auditoria e Fiscalização',
    subcategory: 'Controles',
    question: 'Quais mecanismos de auditoria e fiscalização existem?',
    reference: 'Código IBGC - 6ª edição: 5.1',
    type: 'checkbox',
    options: [
      { label: 'Auditoria externa independente', value: 25 },
      { label: 'Comitê de Auditoria instituído', value: 25 },
      { label: 'Auditoria interna estruturada', value: 25 },
      { label: 'Conselho Fiscal ativo', value: 25 },
      { label: 'Nenhum dos anteriores', value: 0, exclusive: true },
    ],
  },
  {
    id: 7,
    category: 'Transparência',
    subcategory: 'Divulgação de Informações',
    question: 'Como é a prática de transparência na empresa?',
    reference: 'Código IBGC - 6ª edição: 6.1',
    type: 'checkbox',
    options: [
      { label: 'Relatório Anual publicado', value: 25 },
      { label: 'Demonstrações financeiras auditadas', value: 25 },
      { label: 'Política de divulgação de informações', value: 25 },
      { label: 'Canal de comunicação com stakeholders', value: 25 },
      { label: 'Nenhum dos anteriores', value: 0, exclusive: true },
    ],
  },
  {
    id: 8,
    category: 'Ética e Conduta',
    subcategory: 'Código de Conduta',
    question: 'Sobre ética e conduta, quais práticas existem?',
    reference: 'Código IBGC - 6ª edição: 1.3',
    type: 'checkbox',
    options: [
      { label: 'Código de Ética/Conduta formalizado', value: 25 },
      { label: 'Canal de denúncias implementado', value: 25 },
      { label: 'Comitê de Ética instituído', value: 25 },
      { label: 'Treinamentos periódicos sobre ética', value: 25 },
      { label: 'Nenhum dos anteriores', value: 0, exclusive: true },
    ],
  },
  {
    id: 9,
    category: 'Gestão de Riscos',
    subcategory: 'Estrutura de Riscos',
    question: 'Qual o nível de maturidade da gestão de riscos?',
    reference: 'Código IBGC - 6ª edição: 5.3',
    type: 'radio',
    options: [
      { label: 'Gestão integrada com comitê dedicado e reporte ao conselho', value: 100 },
      { label: 'Mapeamento estruturado de riscos com responsáveis definidos', value: 70 },
      { label: 'Identificação básica de riscos operacionais', value: 40 },
      { label: 'Sem estrutura formal de gestão de riscos', value: 0 },
    ],
  },
  {
    id: 10,
    category: 'Gestão de Riscos',
    subcategory: 'ESG',
    question: 'Como a empresa trata questões ESG (Ambiental, Social e Governança)?',
    reference: 'Código IBGC - 6ª edição: 1.2',
    type: 'checkbox',
    options: [
      { label: 'Política ESG formalizada e publicada', value: 25 },
      { label: 'Metas ESG definidas e monitoradas', value: 25 },
      { label: 'Relatório de sustentabilidade publicado', value: 25 },
      { label: 'Comitê ou responsável por ESG', value: 25 },
      { label: 'Nenhum dos anteriores', value: 0, exclusive: true },
    ],
  },
];

// Estágios de maturidade
const stages: Stage[] = [
  { min: 0, max: 20, label: 'Embrionário', color: 'text-red-600', bgColor: 'bg-red-100', description: 'Governança informal ou inexistente' },
  { min: 21, max: 40, label: 'Inicial', color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Primeiros passos em estruturação' },
  { min: 41, max: 60, label: 'Em Desenvolvimento', color: 'text-amber-600', bgColor: 'bg-amber-100', description: 'Estruturas em consolidação' },
  { min: 61, max: 80, label: 'Estruturado', color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Governança bem estabelecida' },
  { min: 81, max: 100, label: 'Avançado', color: 'text-emerald-600', bgColor: 'bg-emerald-100', description: 'Excelência em governança' },
];

// Benchmarks de mercado
const benchmarkScores: Record<string, number> = {
  'Sócios': 64,
  'Conselho de administração/consultivo': 56,
  'Diretoria': 60,
  'Auditoria e Fiscalização': 50,
  'Transparência': 50,
  'Ética e Conduta': 54,
  'Gestão de Riscos': 50,
};

const categoryIcons: Record<string, typeof Users> = {
  'Sócios': Users,
  'Conselho de administração/consultivo': Building2,
  'Diretoria': Briefcase,
  'Auditoria e Fiscalização': Shield,
  'Transparência': Eye,
  'Ética e Conduta': Award,
  'Gestão de Riscos': Target,
};

export default function GovMetrixQuizModal({ isOpen, onClose, onScrollToPricing }: GovMetrixQuizModalProps) {
  const [step, setStep] = useState<'lead' | 'quiz' | 'result'>('lead');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [leadData, setLeadData] = useState<LeadData>({ name: '', company: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    stage: Stage;
    categoryScores: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('lead');
      setCurrentQuestion(0);
      setAnswers({});
      setResult(null);
    }
  }, [isOpen]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email || !leadData.company) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setStep('quiz');
  };

  const handleAnswerChange = (questionId: number, optionIndex: number, isExclusive: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      
      if (isExclusive) {
        // If exclusive option, clear all and set only this
        return { ...prev, [questionId]: [optionIndex] };
      }
      
      // Remove exclusive option if selecting non-exclusive
      const exclusiveIndex = questions.find(q => q.id === questionId)?.options.findIndex(o => o.exclusive);
      let updated = current.filter(i => i !== exclusiveIndex);
      
      if (current.includes(optionIndex)) {
        updated = updated.filter(i => i !== optionIndex);
      } else {
        updated = [...updated, optionIndex];
      }
      
      return { ...prev, [questionId]: updated };
    });
  };

  const handleRadioChange = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: [optionIndex] }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    const categoryScores: Record<string, { total: number; max: number }> = {};

    questions.forEach(question => {
      const selectedIndices = answers[question.id] || [];
      const maxPossible = question.options
        .filter(o => !o.exclusive)
        .reduce((sum, o) => sum + o.value, 0);

      let questionScore = 0;
      selectedIndices.forEach(index => {
        questionScore += question.options[index]?.value || 0;
      });

      const normalizedScore = maxPossible > 0 ? (questionScore / maxPossible) * 100 : 0;
      totalScore += normalizedScore;

      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, max: 0 };
      }
      categoryScores[question.category].total += normalizedScore;
      categoryScores[question.category].max += 100;
    });

    const averageScore = totalScore / questions.length;
    const stage = stages.find(s => averageScore >= s.min && averageScore <= s.max) || stages[0];

    const normalizedCategoryScores: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([cat, data]) => {
      normalizedCategoryScores[cat] = Math.round((data.total / data.max) * 100);
    });

    return { score: Math.round(averageScore), stage, categoryScores: normalizedCategoryScores };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const calculatedResult = calculateScore();
      setResult(calculatedResult);

      // Save to database (using type assertion as table may be pending migration)
      const { error } = await (supabase as any).from('contacts').insert({
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.whatsapp,
        message: JSON.stringify({
          type: 'govmetrix_diagnostic',
          answers,
          score: calculatedResult.score,
          stage: calculatedResult.stage.label,
          categoryScores: calculatedResult.categoryScores,
        }),
        source: 'govmetrix_quiz',
      });

      if (error) {
        console.error('Error saving lead:', error);
      }

      // Try to send email (optional - may fail if edge function not deployed)
      try {
        await supabase.functions.invoke('send-govmetrix-result', {
          body: {
            recipientEmail: leadData.email,
            recipientName: leadData.name,
            company: leadData.company,
            score: calculatedResult.score,
            stage: calculatedResult.stage.label,
            categoryScores: calculatedResult.categoryScores
          }
        });
      } catch (emailError) {
        console.log('Email sending skipped (function may not be deployed)');
      }

      setStep('result');
      toast.success("Diagnóstico concluído com sucesso!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao processar diagnóstico. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const radarData = result ? Object.entries(result.categoryScores).map(([category, score]) => ({
    category: category.split('/')[0].substring(0, 15),
    'Sua Empresa': score,
    'Benchmark': benchmarkScores[category] || 50,
  })) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'lead' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-accent" />
                Diagnóstico GovMetrix®
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <p className="text-sm text-foreground/80">
                  Em apenas <strong>5 minutos</strong>, avalie a maturidade da governança corporativa 
                  da sua empresa baseado nos princípios do <strong>Código IBGC</strong>.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={leadData.name}
                        onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Nome da empresa"
                        value={leadData.company}
                        onChange={(e) => setLeadData(prev => ({ ...prev, company: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Corporativo *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@empresa.com"
                        value={leadData.email}
                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="whatsapp"
                        placeholder="(00) 00000-0000"
                        value={leadData.whatsapp}
                        onChange={(e) => setLeadData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-accent text-primary hover:bg-accent/90" size="lg">
                  Iniciar Diagnóstico
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>
          </>
        )}

        {step === 'quiz' && question && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-primary">
                  {question.category}
                </DialogTitle>
                <Badge variant="outline" className="text-xs">
                  {currentQuestion + 1} de {questions.length}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{question.reference}</p>
                <h3 className="text-lg font-medium">{question.question}</h3>
              </div>

              <div className="space-y-3">
                {question.type === 'checkbox' ? (
                  question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        answers[question.id]?.includes(index) 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => handleAnswerChange(question.id, index, option.exclusive || false)}
                    >
                      <Checkbox
                        checked={answers[question.id]?.includes(index) || false}
                        onCheckedChange={() => handleAnswerChange(question.id, index, option.exclusive || false)}
                        className="mt-0.5"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))
                ) : (
                  <RadioGroup
                    value={answers[question.id]?.[0]?.toString()}
                    onValueChange={(value) => handleRadioChange(question.id, parseInt(value))}
                  >
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          answers[question.id]?.[0] === index 
                            ? 'border-accent bg-accent/10' 
                            : 'border-border hover:border-accent/50'
                        }`}
                        onClick={() => handleRadioChange(question.id, index)}
                      >
                        <RadioGroupItem value={index.toString()} />
                        <span className="text-sm">{option.label}</span>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent text-primary hover:bg-accent/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Finalizar
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="bg-primary text-primary-foreground"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {step === 'result' && result && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary text-center">
                Resultado do Diagnóstico GovMetrix®
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Score Card */}
              <Card className={`${result.stage.bgColor} border-0`}>
                <CardContent className="p-6 text-center">
                  <div className="text-6xl font-bold text-primary mb-2">{result.score}</div>
                  <Badge className={`${result.stage.bgColor} ${result.stage.color} border-0 text-lg px-4 py-1`}>
                    {result.stage.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{result.stage.description}</p>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Sua Empresa"
                      dataKey="Sua Empresa"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Benchmark"
                      dataKey="Benchmark"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Scores */}
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(result.categoryScores).map(([category, score]) => {
                  const Icon = categoryIcons[category] || Target;
                  const benchmark = benchmarkScores[category] || 50;
                  const isAboveBenchmark = score >= benchmark;
                  
                  return (
                    <div key={category} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{category}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{score}%</span>
                          {isAboveBenchmark ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <TrendingUp className="h-3 w-3 text-orange-500 rotate-180" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => {
                    onClose();
                    onScrollToPricing?.();
                  }}
                  className="flex-1 bg-accent text-primary hover:bg-accent/90"
                >
                  Ver Planos Legacy OS
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
