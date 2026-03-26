
import React, { useState, useEffect } from "react";
import { Leaf, BarChart3, Users, Search, Eye, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Download, FileText, Edit, Target, TrendingUp, Calendar, Activity, Shield, Scale, AlertTriangle, MinusCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { Badge } from "@/components/ui/badge";
import { loadLatestESGAssessment, loadESGAssessmentHistory, generateESGRecommendations, calculateESGMaturity, saveESGAssessment } from "@/utils/esgMaturityCalculator";
import { ESGMaturityResult, ESGAssessmentHistory, ESGUserAnswers } from "@/types/esgMaturity";
import { esgQuestions, maturityLevels, pillarInfo } from "@/data/esgMaturityData";
import ESGResultsDashboard from "@/components/ESGResultsDashboard";
import ESGHistoryModal from "@/components/ESGHistoryModal";

// Sample ESG policies
const esgPolicies = [
  {
    id: 1,
    name: "Código de Ética e Conduta Ambiental",
    category: "Ambiental",
    lastUpdate: "10/01/2025",
    status: "Ativo",
    description: "Documento que estabelece diretrizes éticas para as atividades ambientais da empresa, visando a sustentabilidade e preservação ambiental.",
    responsible: "Comitê de Sustentabilidade",
    approvalDate: "05/01/2025",
    reviewDate: "05/01/2026"
  },
  {
    id: 2,
    name: "Política de Diversidade e Inclusão",
    category: "Social",
    lastUpdate: "15/02/2025",
    status: "Ativo",
    description: "Define princípios para promover diversidade, equidade e inclusão no ambiente de trabalho, incluindo metas e indicadores de progresso.",
    responsible: "Recursos Humanos",
    approvalDate: "10/02/2025",
    reviewDate: "10/02/2026"
  },
  {
    id: 3,
    name: "Política de Compras Sustentáveis",
    category: "Ambiental",
    lastUpdate: "05/03/2025",
    status: "Ativo",
    description: "Estabelece critérios sustentáveis para seleção de fornecedores e compra de produtos, priorizando fornecedores com práticas sustentáveis.",
    responsible: "Departamento de Compras",
    approvalDate: "01/03/2025",
    reviewDate: "01/03/2026"
  },
  {
    id: 4,
    name: "Política de Relacionamento com Comunidades",
    category: "Social",
    lastUpdate: "20/01/2025",
    status: "Em revisão",
    description: "Orienta o relacionamento da empresa com as comunidades do entorno, definindo padrões para engajamento comunitário e investimento social.",
    responsible: "Relações Institucionais",
    approvalDate: "15/01/2024",
    reviewDate: "15/01/2025"
  },
  {
    id: 5,
    name: "Política Anticorrupção",
    category: "Governança",
    lastUpdate: "08/02/2025",
    status: "Ativo",
    description: "Define diretrizes e procedimentos para prevenir e combater práticas de corrupção, suborno e condutas antiéticas nos negócios.",
    responsible: "Compliance",
    approvalDate: "05/02/2025",
    reviewDate: "05/02/2026"
  },
];

// Sample ESG indicators based on new ESG maturity framework
const esgIndicators = [
  {
    id: 1,
    name: "Gestão de Mudanças Climáticas",
    category: "Ambiental",
    value: "4.2",
    target: "5.0",
    progress: 84,
    description: "Avaliação da maturidade em gestão de mudanças climáticas, incluindo metas de redução de emissões e estratégias de adaptação.",
    historicalData: [
      { period: "Q1 2024", value: "3.8" },
      { period: "Q2 2024", value: "4.0" },
      { period: "Q3 2024", value: "4.1" },
      { period: "Q4 2024", value: "4.2" }
    ],
    actionPlan: "Implementar sistema de monitoramento de emissões em tempo real; Desenvolver plano de neutralidade carbônica até 2030."
  },
  {
    id: 2,
    name: "Gestão de Recursos Naturais",
    category: "Ambiental",
    value: "3.8",
    target: "4.5",
    progress: 76,
    description: "Avaliação da eficiência na gestão de recursos naturais como água, energia e materiais.",
    historicalData: [
      { period: "Q1 2024", value: "3.5" },
      { period: "Q2 2024", value: "3.6" },
      { period: "Q3 2024", value: "3.7" },
      { period: "Q4 2024", value: "3.8" }
    ],
    actionPlan: "Instalar sistemas de reuso de água; Implementar programa de eficiência energética."
  },
  {
    id: 3,
    name: "Capital Humano",
    category: "Social",
    value: "4.5",
    target: "5.0",
    progress: 90,
    description: "Avaliação da gestão de pessoas, incluindo desenvolvimento, diversidade, saúde e segurança.",
    historicalData: [
      { period: "Q1 2024", value: "4.2" },
      { period: "Q2 2024", value: "4.3" },
      { period: "Q3 2024", value: "4.4" },
      { period: "Q4 2024", value: "4.5" }
    ],
    actionPlan: "Expandir programa de diversidade e inclusão; Implementar sistema de feedback 360°."
  },
  {
    id: 4,
    name: "Relações com Comunidade",
    category: "Social", 
    value: "4.1",
    target: "4.8",
    progress: 85,
    description: "Avaliação do engajamento e impacto nas comunidades locais através de projetos sociais e parcerias.",
    historicalData: [
      { period: "Q1 2024", value: "3.8" },
      { period: "Q2 2024", value: "3.9" },
      { period: "Q3 2024", value: "4.0" },
      { period: "Q4 2024", value: "4.1" }
    ],
    actionPlan: "Ampliar parcerias com organizações locais; Criar comitê de engajamento comunitário."
  },
  {
    id: 5,
    name: "Estrutura de Governança ESG",
    category: "Governança",
    value: "4.8",
    target: "5.0",
    progress: 96,
    description: "Avaliação da estrutura de governança para supervisão e gestão de questões ESG.",
    historicalData: [
      { period: "Q1 2024", value: "4.5" },
      { period: "Q2 2024", value: "4.6" },
      { period: "Q3 2024", value: "4.7" },
      { period: "Q4 2024", value: "4.8" }
    ],
    actionPlan: "Criar comitê ESG no conselho; Implementar sistema de remuneração variável baseado em metas ESG."
  },
  {
    id: 6,
    name: "Integração ESG na Estratégia",
    category: "Estratégia",
    value: "4.0",
    target: "4.7",
    progress: 80,
    description: "Avaliação da integração de critérios ESG na estratégia de negócios e tomada de decisões.",
    historicalData: [
      { period: "Q1 2024", value: "3.7" },
      { period: "Q2 2024", value: "3.8" },
      { period: "Q3 2024", value: "3.9" },
      { period: "Q4 2024", value: "4.0" }
    ],
    actionPlan: "Incorporar métricas ESG no planejamento estratégico; Treinar liderança em tomada de decisão sustentável."
  },
];

// Sample ESG benchmark data
const benchmarkData = [
  {
    name: "Ambiental",
    empresa: 75,
    setor: 65,
    benchmark: 80,
  },
  {
    name: "Social",
    empresa: 82,
    setor: 70,
    benchmark: 85,
  },
  {
    name: "Governança",
    empresa: 88,
    setor: 75,
    benchmark: 90,
  },
  {
    name: "Geral",
    empresa: 82,
    setor: 70,
    benchmark: 85,
  },
];

// Mock data for ESG Reports (CVM 193/2023)
const esgReportMockData = {
  empresa: {
    razao_social: "Exemplo S.A.",
    cnpj: "12.345.678/0001-90",
    setor: "Indústria de Alimentos",
    data_relatorio: "31/07/2025"
  },
  scores: {
    ambiental: 75,
    social: 82,
    governanca: 88,
    geral: 82
  },
  comparativo_setor: {
    ambiental: 68,
    social: 73,
    governanca: 77,
    geral: 73
  },
  benchmark: {
    ambiental: 80,
    social: 85,
    governanca: 90,
    geral: 85
  },
  diversidade: {
    genero: 43,
    etnica: 35,
    pcd: 12,
    geracional: 65
  },
  acoes_ambientais: [
    "Redução de emissões de CO2 em 8% no ano",
    "100% de energia elétrica de fontes renováveis",
    "Programa de gestão de resíduos sólidos"
  ],
  acoes_sociais: [
    "Expansão do programa de diversidade e inclusão",
    "Treinamento ESG para 100% dos líderes",
    "Iniciativas de voluntariado com 250 horas em 2025"
  ],
  proximos_passos: [
    "Finalizar relatório de sustentabilidade até 30/09/2025",
    "Implementar novo programa de compras sustentáveis",
    "Preparar workshops ESG para liderança no próximo trimestre"
  ],
  responsavel: {
    nome: "Maria Souza",
    email: "maria.souza@exemplo.com",
    telefone: "+55 11 98765-4321"
  }
};

const ESG = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [esgMaturityData, setESGMaturityData] = useState<ESGMaturityResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<ESGAssessmentHistory[]>([]);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ESGUserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [currentPillar, setCurrentPillar] = useState<string>('environmental');
  const [showNavigator, setShowNavigator] = useState(false);
  
  // Get active tab from URL params
  const activeTab = searchParams.get('tab') || 'maturity';

  const totalQuestions = esgQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  useEffect(() => {
    // Load latest ESG maturity assessment
    const latestAssessment = loadLatestESGAssessment();
    if (latestAssessment && latestAssessment.result) {
      setESGMaturityData(latestAssessment.result);
    }

    // Load assessment history
    const history = loadESGAssessmentHistory();
    setAssessmentHistory(history);
    
    // Load saved quiz answers
    const savedAnswers = localStorage.getItem('esg_temp_answers');
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }
  }, []);
  
  // Auto-save quiz answers
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('esg_temp_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const currentQuestionData = esgQuestions[currentQuestion];
  const isAnswered = currentQuestionData ? answers[currentQuestionData.id] !== undefined : false;

  const getPillarIcon = (pillar: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      environmental: Leaf,
      social: Users,
      governance: Scale,
      strategy: Target
    };
    return iconMap[pillar] || Leaf;
  };

  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
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
    setQuizResults(result);
    saveESGAssessment(answers, result);
    setShowResults(true);
    setESGMaturityData(result);
    localStorage.removeItem('esg_temp_answers');
    
    toast({
      title: "Avaliação ESG Concluída!",
      description: `Sua maturidade ESG é: ${result.maturityLevel.name} (${result.overallScore.toFixed(1)}/6.0)`,
    });
    
    // Switch to maturity tab after completing
    setSearchParams({ tab: 'maturity' });
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizResults(null);
    setCurrentPillar('environmental');
    localStorage.removeItem('esg_temp_answers');
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    updateCurrentPillar(index);
  };

  const filteredPolicies = esgPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIndicators = esgIndicators.filter(
    (indicator) =>
      indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
  };

  const handleViewIndicator = (indicator: any) => {
    setSelectedIndicator(indicator);
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleViewReport = () => {
    setShowReport(!showReport);
    toast({
      title: showReport ? "Relatório ocultado" : "Relatório exibido",
      description: showReport ? "O relatório foi ocultado" : "Visualizando modelo de relatório ESG CVM 193/2023",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Novo relatório ESG está sendo gerado com dados atuais",
    });
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('esg-report');
    if (!element) return;

    try {
      // Importa dinamicamente o html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: 1,
        filename: 'relatorio-esg-cvm-193-2023.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório ESG foi exportado em formato PDF",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Houve um problema na exportação do relatório",
        variant: "destructive",
      });
    }
  };

  const handleExportWord = () => {
    toast({
      title: "Exportando Word",
      description: "O relatório está sendo exportado em formato Word",
    });
  };

  const goToNewAssessment = () => {
    setSearchParams({ tab: 'new-assessment' });
  };

  // If quiz completed and showing results within assessment tab
  if (showResults && quizResults && activeTab === 'new-assessment') {
    return <ESGResultsDashboard results={quizResults} onRestart={handleRestartQuiz} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Maturidade ESG" />
        <div className="flex-1 overflow-y-auto p-6">
          {/* High-level tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="maturity">Maturidade em ESG</TabsTrigger>
              <TabsTrigger value="new-assessment">Nova Avaliação</TabsTrigger>
            </TabsList>

            {/* Tab 1: Maturidade em ESG */}
            <TabsContent value="maturity">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                      Dashboard ESG
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="Buscar..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button onClick={goToNewAssessment}>
                        Nova Avaliação
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <Leaf className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Leaf className="h-4 w-4" />
                          Ambiental
                        </h3>
                        <p className="text-sm text-gray-600">
                          Score: {esgMaturityData ? esgMaturityData.pillarScores.environmental.percentage.toFixed(0) : '75'}%
                        </p>
                    <p className="text-xs text-gray-500">
                      Nível: {esgMaturityData ? esgMaturityData.pillarScores.environmental.maturityLevel : '4'}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Social
                    </h3>
                    <p className="text-sm text-gray-600">
                      Score: {esgMaturityData ? esgMaturityData.pillarScores.social.percentage.toFixed(0) : '82'}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Nível: {esgMaturityData ? esgMaturityData.pillarScores.social.maturityLevel : '4'}
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Governança
                    </h3>
                    <p className="text-sm text-gray-600">
                      Score: {esgMaturityData ? esgMaturityData.pillarScores.governance.percentage.toFixed(0) : '88'}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Nível: {esgMaturityData ? esgMaturityData.pillarScores.governance.maturityLevel : '5'}
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Estratégia
                    </h3>
                    <p className="text-sm text-gray-600">
                      Score: {esgMaturityData ? esgMaturityData.pillarScores.strategy.percentage.toFixed(0) : '78'}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Nível: {esgMaturityData ? esgMaturityData.pillarScores.strategy.maturityLevel : '4'}
                    </p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="dashboard">
                <TabsList className="mb-4">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="policies">Políticas</TabsTrigger>
                  <TabsTrigger value="indicators">Indicadores</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="reports">Relatórios ESG</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                  <div className="space-y-6">
                    {/* Primeira Seção Horizontal: Score Geral ESG + Evolução Histórica */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Score Geral ESG
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                              {esgMaturityData ? (esgMaturityData.overallScore * 16.67).toFixed(0) : '82'}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">
                              Pontuação de 0 a 100
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={esgMaturityData?.maturityLevel.color || "bg-blue-500"}
                              >
                                {esgMaturityData ? esgMaturityData.maturityLevel.name : 'Estratégico'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {esgMaturityData ? esgMaturityData.maturityLevel.description : 'ESG como oportunidade de negócio'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Evolução Histórica
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={assessmentHistory.slice(-6).map((assessment, index) => ({
                                periodo: `Avaliação ${index + 1}`,
                                score: (assessment.result.overallScore * 16.67).toFixed(0)
                              }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="periodo" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => [`${value}`, 'Score ESG']} />
                                <Line 
                                  type="monotone" 
                                  dataKey="score" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={3}
                                  dot={{ fill: "hsl(var(--primary))" }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Segunda Seção: Performance por Pilar ESG (largura total) */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Performance por Pilar ESG
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={esgMaturityData ? [
                                {
                                  name: "Ambiental",
                                  atual: esgMaturityData.pillarScores.environmental.percentage,
                                  meta: 85,
                                  setor: 70
                                },
                                {
                                  name: "Social", 
                                  atual: esgMaturityData.pillarScores.social.percentage,
                                  meta: 85,
                                  setor: 75
                                },
                                {
                                  name: "Governança",
                                  atual: esgMaturityData.pillarScores.governance.percentage,
                                  meta: 90,
                                  setor: 80
                                },
                                {
                                  name: "Estratégia",
                                  atual: esgMaturityData.pillarScores.strategy.percentage,
                                  meta: 85,
                                  setor: 72
                                }
                              ] : benchmarkData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                              <Legend />
                              <Bar dataKey="atual" name="Score Atual" fill="hsl(var(--primary))" />
                              <Bar dataKey="meta" name="Meta" fill="hsl(var(--chart-2))" />
                              <Bar dataKey="setor" name="Média do Setor" fill="hsl(var(--chart-3))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recomendações e Progresso Detalhado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Recomendações Prioritárias
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {esgMaturityData && generateESGRecommendations(esgMaturityData).slice(0, 4).map((rec, index) => {
                              const getPriorityIcon = () => {
                                if (rec.priority === 'Alta') return <AlertTriangle className="h-4 w-4 text-red-500" />;
                                if (rec.priority === 'Média') return <MinusCircle className="h-4 w-4 text-yellow-500" />;
                                return <CheckCircle className="h-4 w-4 text-green-500" />;
                              };
                              
                              return (
                                <div key={index} className="border-l-4 border-primary pl-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getPriorityIcon()}
                                    <Badge variant={rec.priority === 'Alta' ? 'destructive' : rec.priority === 'Média' ? 'default' : 'secondary'}>
                                      {rec.priority}
                                    </Badge>
                                    <span className="text-sm font-medium">{rec.pillar}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{rec.action}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs">Atual: {rec.currentScore.toFixed(1)}</span>
                                    <Progress value={(rec.currentScore / 6) * 100} className="h-1 flex-1" />
                                    <span className="text-xs">Meta: {rec.targetScore}</span>
                                  </div>
                                </div>
                              );
                            })}
                              {!esgMaturityData && (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">
                                  Nenhuma avaliação ESG encontrada.
                                </p>
                                <Button 
                                  onClick={goToNewAssessment}
                                >
                                  Realizar Primeira Avaliação
                                </Button>
                              </div>
                            )}
                          </div>
                          {esgMaturityData && (
                            <Button 
                              variant="outline" 
                              className="w-full mt-4"
                              onClick={goToNewAssessment}
                            >
                              Fazer Nova Avaliação
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Progresso por Sub-dimensão
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {esgMaturityData && Object.entries(esgMaturityData.pillarScores).map(([pillar, data]) => (
                              <div key={pillar}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">{data.title}</span>
                                  <span className="text-sm text-muted-foreground">{data.percentage.toFixed(0)}%</span>
                                </div>
                                <Progress value={data.percentage} className="h-2" />
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {Object.keys(data.subDimensions).length} sub-dimensões
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Nível {data.maturityLevel}/6
                                  </span>
                                </div>
                              </div>
                            ))}
                            {!esgMaturityData && (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Dados não disponíveis. Realize uma avaliação para ver o progresso detalhado.
                                </p>
                              </div>
                            )}
                          </div>
                          {esgMaturityData && (
                            <Button 
                              variant="outline" 
                              className="w-full mt-4"
                              onClick={() => navigate('/esg-history')}
                            >
                              Ver Histórico Completo
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="policies">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome da Política</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Última Atualização</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPolicies.map((policy) => (
                        <TableRow
                          key={policy.id}
                          className="cursor-pointer"
                          onClick={() => handleViewPolicy(policy)}
                        >
                          <TableCell className="font-medium">{policy.name}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                policy.category === "Ambiental"
                                  ? "bg-green-100 text-green-800"
                                  : policy.category === "Social"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {policy.category}
                            </span>
                          </TableCell>
                          <TableCell>{policy.lastUpdate}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                policy.status === "Ativo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {policy.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPolicy(policy);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="indicators">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicador</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Atual</TableHead>
                        <TableHead>Meta</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIndicators.map((indicator) => (
                        <TableRow
                          key={indicator.id}
                          className="cursor-pointer"
                          onClick={() => handleViewIndicator(indicator)}
                        >
                          <TableCell className="font-medium">{indicator.name}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                indicator.category === "Ambiental"
                                  ? "bg-green-100 text-green-800"
                                  : indicator.category === "Social"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {indicator.category}
                            </span>
                          </TableCell>
                          <TableCell>{indicator.value}</TableCell>
                          <TableCell>{indicator.target}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={indicator.progress}
                                className={`h-2 w-[100px] ${getProgressColor(
                                  indicator.progress
                                )}`}
                              />
                              <span>{indicator.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewIndicator(indicator);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Relatórios ESG</h3>
                      <FileUpload 
                        label="Fazer upload de relatórios" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx,.pptx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Certificações</h3>
                      <FileUpload 
                        label="Fazer upload de certificações" 
                        multiple={true} 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Dados e Métricas</h3>
                      <FileUpload 
                        label="Fazer upload de planilhas e dados" 
                        multiple={true} 
                        accept=".xlsx,.csv"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reports">
                  <div className="space-y-6">
                    {/* Models List */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Modelos de Relatório ESG</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Modelo CVM 193/2023</h4>
                            <p className="text-sm text-gray-600">Relatório ESG conforme Resolução CVM 193/2023</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleViewReport}
                              className="bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </Button>
                            <Button size="sm" onClick={handleGenerateReport}>
                              <FileText className="h-4 w-4 mr-2" />
                              Gerar Novo Relatório
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {showReport && (
                    <div id="esg-report" className="bg-white p-6 rounded-lg border">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-xl font-bold">Relatório ESG – Modelo CVM 193/2023</h3>
                          <p className="text-sm text-gray-600">
                            Empresa: {esgReportMockData.empresa.razao_social} | Data: {esgReportMockData.empresa.data_relatorio}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Personalizar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleExportPDF}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Exportar PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleExportWord}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar Word
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* 1. Identificação da Empresa */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">1. Identificação da Empresa</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>Razão Social:</strong> {esgReportMockData.empresa.razao_social}
                            </div>
                            <div>
                              <strong>CNPJ:</strong> {esgReportMockData.empresa.cnpj}
                            </div>
                            <div>
                              <strong>Setor:</strong> {esgReportMockData.empresa.setor}
                            </div>
                            <div>
                              <strong>Data do Relatório:</strong> {esgReportMockData.empresa.data_relatorio}
                            </div>
                          </div>
                        </section>

                        {/* 2. Introdução */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">2. Introdução</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Este relatório apresenta as práticas de Environmental, Social and Governance (ESG) da {esgReportMockData.empresa.razao_social}, 
                            demonstrando nosso compromisso com a sustentabilidade, responsabilidade social e governança corporativa, 
                            em conformidade com a Resolução CVM 193/2023.
                          </p>
                        </section>

                        {/* 3. Governança Regenerativa & ESG */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">3. Governança Regenerativa & ESG</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-2">Políticas Implementadas:</h5>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Código de Ética e Conduta Ambiental</li>
                                <li>Política de Diversidade e Inclusão</li>
                                <li>Política Anticorrupção</li>
                                <li>Política de Compras Sustentáveis</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Composição do Conselho:</h5>
                              <p className="text-sm text-gray-700">
                                Conselho diversificado com representação equilibrada de gênero e expertise em sustentabilidade.
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* 4. Desempenho ESG */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">4. Desempenho ESG</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Dimensão</TableHead>
                                    <TableHead>Score Obtido</TableHead>
                                    <TableHead>Média do Setor</TableHead>
                                    <TableHead>Benchmark</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">Ambiental</TableCell>
                                    <TableCell>{esgReportMockData.scores.ambiental}</TableCell>
                                    <TableCell>{esgReportMockData.comparativo_setor.ambiental}</TableCell>
                                    <TableCell>{esgReportMockData.benchmark.ambiental}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Social</TableCell>
                                    <TableCell>{esgReportMockData.scores.social}</TableCell>
                                    <TableCell>{esgReportMockData.comparativo_setor.social}</TableCell>
                                    <TableCell>{esgReportMockData.benchmark.social}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Governança</TableCell>
                                    <TableCell>{esgReportMockData.scores.governanca}</TableCell>
                                    <TableCell>{esgReportMockData.comparativo_setor.governanca}</TableCell>
                                    <TableCell>{esgReportMockData.benchmark.governanca}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Geral</TableCell>
                                    <TableCell>{esgReportMockData.scores.geral}</TableCell>
                                    <TableCell>{esgReportMockData.comparativo_setor.geral}</TableCell>
                                    <TableCell>{esgReportMockData.benchmark.geral}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarkData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[0, 100]} />
                                  <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                                  <Legend />
                                  <Bar dataKey="empresa" name="Empresa" fill="#8884d8" />
                                  <Bar dataKey="setor" name="Setor" fill="#82ca9d" />
                                  <Bar dataKey="benchmark" name="Benchmark" fill="#ffc658" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </section>

                        {/* 5. Indicadores de Diversidade */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">5. Indicadores de Diversidade</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">Diversidade de Gênero</span>
                                  <span className="font-medium">{esgReportMockData.diversidade.genero}%</span>
                                </div>
                                <Progress value={esgReportMockData.diversidade.genero} className="h-3" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">Diversidade Étnica</span>
                                  <span className="font-medium">{esgReportMockData.diversidade.etnica}%</span>
                                </div>
                                <Progress value={esgReportMockData.diversidade.etnica} className="h-3" />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">Inclusão de PCDs</span>
                                  <span className="font-medium">{esgReportMockData.diversidade.pcd}%</span>
                                </div>
                                <Progress value={esgReportMockData.diversidade.pcd} className="h-3" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">Diversidade Geracional</span>
                                  <span className="font-medium">{esgReportMockData.diversidade.geracional}%</span>
                                </div>
                                <Progress value={esgReportMockData.diversidade.geracional} className="h-3" />
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* 6. Políticas e Práticas Ambientais */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">6. Políticas e Práticas Ambientais</h4>
                          <ul className="space-y-2">
                            {esgReportMockData.acoes_ambientais.map((acao, index) => (
                              <li key={index} className="flex items-start">
                                <span className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-700">{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        {/* 7. Políticas e Práticas Sociais */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">7. Políticas e Práticas Sociais</h4>
                          <ul className="space-y-2">
                            {esgReportMockData.acoes_sociais.map((acao, index) => (
                              <li key={index} className="flex items-start">
                                <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-700">{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        {/* 8. Próximos Passos */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">8. Próximos Passos</h4>
                          <ul className="space-y-2">
                            {esgReportMockData.proximos_passos.map((passo, index) => (
                              <li key={index} className="flex items-start">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-700">{passo}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        {/* 9. Anexos e Documentos */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">9. Anexos e Documentos</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-700">Política de Sustentabilidade.pdf</span>
                            </li>
                            <li className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-700">Código de Conduta.pdf</span>
                            </li>
                            <li className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-700">Relatório de Emissões 2024.pdf</span>
                            </li>
                          </ul>
                        </section>

                        {/* 10. Declaração da Administração */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">10. Declaração da Administração</h4>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border-l-4 border-legacy-500">
                            A Administração da {esgReportMockData.empresa.razao_social} declara que as informações aqui prestadas 
                            refletem de forma fidedigna as práticas ESG adotadas pela empresa, tendo sido elaboradas de acordo 
                            com as melhores práticas de mercado e em conformidade com a Resolução CVM 193/2023.
                          </p>
                        </section>

                        {/* 11. Contato */}
                        <section>
                          <h4 className="text-lg font-semibold text-legacy-500 mb-4 border-b pb-2">11. Contato para esclarecimentos</h4>
                          <div className="bg-gray-50 p-4 rounded">
                            <p className="font-medium">{esgReportMockData.responsavel.nome}</p>
                            <p className="text-gray-600">{esgReportMockData.responsavel.email}</p>
                            <p className="text-gray-600">{esgReportMockData.responsavel.telefone}</p>
                          </div>
                        </section>
                      </div>
                    </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Nova Avaliação */}
        <TabsContent value="new-assessment">
          {/* Progress Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentQuestionData && React.createElement(getPillarIcon(currentPillar), { 
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
          {currentQuestionData && (
            <div className="mb-4">
              <Badge className={`${pillarInfo[currentPillar as keyof typeof pillarInfo]?.color || 'bg-green-500'} text-white px-4 py-2`}>
                {pillarInfo[currentPillar as keyof typeof pillarInfo]?.title || 'Ambiental'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {pillarInfo[currentPillar as keyof typeof pillarInfo]?.description || ''}
              </p>
            </div>
          )}

          {/* Question Card */}
          {currentQuestionData && (
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
          )}

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
        </TabsContent>
      </Tabs>
    </div>
  </div>

      {/* Dialog for policy details */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.name}</DialogTitle>
            <DialogDescription>
              Detalhes da política ESG
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="py-4 space-y-6">
              <div className="flex items-center">
                <Badge className={`${
                  selectedPolicy.category === "Ambiental"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : selectedPolicy.category === "Social"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                }`}>
                  {selectedPolicy.category}
                </Badge>
                <span className="mx-2">•</span>
                <Badge className={`${
                  selectedPolicy.status === "Ativo"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }`}>
                  {selectedPolicy.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                <p>{selectedPolicy.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Responsável</h3>
                  <p>{selectedPolicy.responsible}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Última Atualização</h3>
                  <p>{selectedPolicy.lastUpdate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Data de Aprovação</h3>
                  <p>{selectedPolicy.approvalDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Próxima Revisão</h3>
                  <p>{selectedPolicy.reviewDate}</p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-4">
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Download iniciado",
                    description: `Baixando ${selectedPolicy.name}`,
                  });
                }}>
                  Download
                </Button>
                <Button onClick={() => setSelectedPolicy(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for indicator details */}
      <Dialog open={!!selectedIndicator} onOpenChange={() => setSelectedIndicator(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedIndicator?.name}</DialogTitle>
            <DialogDescription>
              Detalhes do indicador ESG
            </DialogDescription>
          </DialogHeader>
          {selectedIndicator && (
            <div className="py-4 space-y-6">
              <div className="flex items-center">
                <Badge className={`${
                  selectedIndicator.category === "Ambiental"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : selectedIndicator.category === "Social"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                }`}>
                  {selectedIndicator.category}
                </Badge>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <span className="font-medium mr-1">Progresso:</span>
                  <Progress
                    value={selectedIndicator.progress}
                    className={`h-2 w-[60px] ${getProgressColor(selectedIndicator.progress)}`}
                  />
                  <span className="ml-2">{selectedIndicator.progress}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                <p>{selectedIndicator.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Valor Atual</h3>
                  <p className="font-medium">{selectedIndicator.value}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Meta</h3>
                  <p className="font-medium">{selectedIndicator.target}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Histórico</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedIndicator.historicalData.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.period}</TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Plano de Ação</h3>
                <p>{selectedIndicator.actionPlan}</p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedIndicator(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ESG;
