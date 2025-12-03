import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, AlertTriangle, CheckCircle, TrendingUp, Users, BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { initialDocumentChecklist } from '@/data/documentChecklistData';

// Mock documents data for fallback
const initialDocumentsData = [
  { id: '1', name: 'Estatuto Social', status: 'complete', category: 'Societário' },
  { id: '2', name: 'Ata AGO 2023', status: 'incomplete', category: 'Governança' },
  { id: '3', name: 'Política de Compliance', status: 'divergent', category: 'Compliance' }
];

// Mock interviews data for fallback
const mockInterviews = [
  { 
    id: '1', 
    name: 'Roberto Silva',
    role: 'Fundador/CEO',
    alignmentScore: 85,
    conflicts: [],
    keyTopics: ['Sucessão', 'Governança', 'Estratégia']
  },
  { 
    id: '2', 
    name: 'Maria Santos',
    role: 'Herdeira',
    alignmentScore: 72,
    conflicts: ['Visão sobre expansão'],
    keyTopics: ['Herança', 'Formação', 'Papel na empresa']
  },
  { 
    id: '3', 
    name: 'Carlos Oliveira',
    role: 'Conselheiro',
    alignmentScore: 90,
    conflicts: [],
    keyTopics: ['Riscos', 'Compliance', 'Auditoria']
  },
  { 
    id: '4', 
    name: 'Ana Costa',
    role: 'Diretora Financeira',
    alignmentScore: 78,
    conflicts: ['Investimentos prioritários'],
    keyTopics: ['Finanças', 'Investimentos', 'Controles']
  }
];

interface ReportData {
  documentStats: {
    total: number;
    complete: number;
    incomplete: number;
    divergent: number;
    completionPercentage: number;
  };
  interviewStats: {
    total: number;
    avgAlignment: number;
    totalConflicts: number;
    keyTopics: string[];
  };
  incongruences: Array<{
    type: 'document-interview' | 'document-document' | 'interview-interview';
    severity: 'high' | 'medium' | 'low';
    description: string;
    source1: string;
    source2: string;
  }>;
  gaps: Array<{
    category: string;
    missing: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  actionPlan: Array<{
    priority: number;
    action: string;
    category: string;
    timeline: string;
    impact: string;
  }>;
}
export default function InitialReport() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
    generateReport();
  }, []);
  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate AI report generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Load data from localStorage with correct keys and fallbacks
    const storedChecklist = localStorage.getItem('document-checklist');
    const documentChecklist = storedChecklist ? JSON.parse(storedChecklist) : initialDocumentChecklist;
    
    const storedDocuments = localStorage.getItem('uploaded-documents');
    const uploadedDocuments = storedDocuments ? JSON.parse(storedDocuments) : initialDocumentsData;
    
    const storedInterviews = localStorage.getItem('interviews');
    const interviews = storedInterviews ? JSON.parse(storedInterviews) : mockInterviews;

    // Calculate document stats
    const allItems = documentChecklist.flatMap((cat: any) => cat.items || []);
    const checkedItems = allItems.filter((item: any) => item.checked);
    const documentStats = {
      total: allItems.length,
      complete: uploadedDocuments.filter((doc: any) => doc.status === 'complete').length,
      incomplete: uploadedDocuments.filter((doc: any) => doc.status === 'incomplete').length,
      divergent: uploadedDocuments.filter((doc: any) => doc.status === 'divergent').length,
      completionPercentage: allItems.length > 0 ? Math.round(checkedItems.length / allItems.length * 100) : 0
    };

    // Calculate interview stats
    const interviewStats = {
      total: interviews.length,
      avgAlignment: interviews.length > 0 ? Math.round(interviews.reduce((sum: number, int: any) => sum + (int.alignmentScore || 0), 0) / interviews.length) : 0,
      totalConflicts: interviews.reduce((sum: number, int: any) => sum + (int.conflicts?.length || 0), 0),
      keyTopics: [...new Set(interviews.flatMap((int: any) => int.keyTopics || []))].slice(0, 8) as string[]
    };

    // Generate mock incongruences
    const incongruences = [{
      type: 'document-interview' as const,
      severity: 'high' as const,
      description: 'Estatuto social define processo decisório diferente do relatado nas entrevistas',
      source1: 'Estatuto Social',
      source2: 'Entrevista CEO'
    }, {
      type: 'interview-interview' as const,
      severity: 'medium' as const,
      description: 'Visões divergentes sobre sucessão entre família e executivos',
      source1: 'Entrevista Fundador',
      source2: 'Entrevista Herdeiro'
    }, {
      type: 'document-document' as const,
      severity: 'low' as const,
      description: 'Política de remuneração não alinhada com acordo de sócios',
      source1: 'Política de Remuneração',
      source2: 'Acordo de Sócios'
    }];

    // Generate gaps
    const gaps = [{
      category: 'Governança e Conselho',
      missing: ['Regimento Interno do Conselho', 'Calendário Anual de Reuniões'],
      priority: 'high' as const
    }, {
      category: 'Família Empresária',
      missing: ['Protocolo Familiar', 'Plano de Sucessão'],
      priority: 'high' as const
    }, {
      category: 'Compliance & Conduta',
      missing: ['Código de Conduta', 'Canal de Denúncias'],
      priority: 'medium' as const
    }];

    // Generate action plan
    const actionPlan = [{
      priority: 1,
      action: 'Elaborar Protocolo Familiar estruturado',
      category: 'Família Empresária',
      timeline: '30-60 dias',
      impact: 'Alinhamento de expectativas familiares e redução de conflitos'
    }, {
      priority: 2,
      action: 'Implementar Regimento Interno do Conselho',
      category: 'Governança',
      timeline: '45-90 dias',
      impact: 'Profissionalização da tomada de decisão'
    }, {
      priority: 3,
      action: 'Desenvolver Plano de Sucessão formal',
      category: 'Sucessão',
      timeline: '60-120 dias',
      impact: 'Continuidade empresarial e redução de incertezas'
    }, {
      priority: 4,
      action: 'Criar Código de Conduta corporativo',
      category: 'Compliance',
      timeline: '30-45 dias',
      impact: 'Fortalecimento da cultura ética'
    }, {
      priority: 5,
      action: 'Estabelecer reuniões familiares periódicas',
      category: 'Comunicação',
      timeline: '15-30 dias',
      impact: 'Melhoria na comunicação e transparência'
    }];
    const report: ReportData = {
      documentStats,
      interviewStats,
      incongruences,
      gaps,
      actionPlan
    };
    setReportData(report);
    setIsGenerating(false);
    toast.success('Relatório Inicial gerado pela IA', {
      description: 'Análise completa baseada em documentos e entrevistas'
    });
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  const exportToPDF = () => {
    toast.success('Relatório exportado para PDF', {
      description: 'Download iniciado automaticamente'
    });
  };
  if (isGenerating) {
    return <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h3 className="text-lg font-semibold">Gerando Relatório Inicial</h3>
            <p className="text-sm text-muted-foreground">
              Nossa IA está analisando documentos e entrevistas para gerar insights...
            </p>
            <Progress value={66} className="h-2" />
          </CardContent>
        </Card>
      </div>;
  }
  if (!reportData) {
    return <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erro ao gerar relatório</h3>
            <Button className="mt-4" onClick={generateReport}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Relatório Inicial de Governança" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header Info */}
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Análise completa baseada em documentos e entrevistas coletadas, 
                  com insights da IA para melhorar a governança corporativa.
                </p>
                
              </div>

        {/* Executive Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Status dos Documentos
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Checklist completo</span>
                    <span className="font-medium">{reportData.documentStats.completionPercentage}%</span>
                  </div>
                  <Progress value={reportData.documentStats.completionPercentage} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-green-500 font-medium">{reportData.documentStats.complete}</div>
                      <div className="text-muted-foreground">Completos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-500 font-medium">{reportData.documentStats.incomplete}</div>
                      <div className="text-muted-foreground">Incompletos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-500 font-medium">{reportData.documentStats.divergent}</div>
                      <div className="text-muted-foreground">Divergentes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análise das Entrevistas
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Alinhamento geral</span>
                    <span className={`font-medium ${reportData.interviewStats.avgAlignment >= 70 ? 'text-green-500' : reportData.interviewStats.avgAlignment >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {reportData.interviewStats.avgAlignment}%
                    </span>
                  </div>
                  <Progress value={reportData.interviewStats.avgAlignment} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-primary font-medium">{reportData.interviewStats.total}</div>
                      <div className="text-muted-foreground">Entrevistas</div>
                    </div>
                    <div>
                      <div className="text-red-500 font-medium">{reportData.interviewStats.totalConflicts}</div>
                      <div className="text-muted-foreground">Conflitos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Incongruences Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Mapa de Incongruências
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.incongruences.length === 0 ? <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Nenhuma incongruência detectada</p>
                </div> : <div className="space-y-4">
                  {reportData.incongruences.map((incongruence, index) => <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{incongruence.description}</h5>
                        {getSeverityBadge(incongruence.severity)}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>📄 {incongruence.source1}</div>
                        <div>📄 {incongruence.source2}</div>
                      </div>
                    </div>)}
                </div>}
            </CardContent>
          </Card>

          {/* Documentation Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                Gaps de Documentação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.gaps.length === 0 ? <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Documentação completa</p>
                </div> : <div className="space-y-4">
                  {reportData.gaps.map((gap, index) => <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{gap.category}</h5>
                        {getPriorityBadge(gap.priority)}
                      </div>
                      <div className="space-y-1">
                        {gap.missing.map((item, itemIndex) => <div key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            {item}
                          </div>)}
                      </div>
                    </div>)}
                </div>}
            </CardContent>
          </Card>
        </div>

        {/* Key Topics from Interviews */}
        {reportData.interviewStats.keyTopics.length > 0 && <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Tópicos-Chave Identificados nas Entrevistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {reportData.interviewStats.keyTopics.map((topic, index) => <Badge key={index} variant="secondary" className="px-3 py-1">
                    {topic}
                  </Badge>)}
              </div>
            </CardContent>
          </Card>}

        {/* Action Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Plano de Ação Sugerido pela IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.actionPlan.map((action, index) => <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {action.priority}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h5 className="font-semibold">{action.action}</h5>
                      <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Categoria:</span> {action.category}
                        </div>
                        <div>
                          <span className="font-medium">Prazo:</span> {action.timeline}
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span> {action.timeline}
                        </div>
                      </div>
                       <p className="text-sm bg-muted/50 p-2 rounded italic">
                         {action.impact}
                       </p>
                     </div>
                   </div>
                 </div>)}
             </div>
           </CardContent>
         </Card>

         {/* Export and Navigation */}
         <div className="flex gap-4 justify-center">
           <Button variant="outline" size="lg" onClick={exportToPDF} className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportar PDF
              </Button>
              <Button size="lg" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Finalizar Preparação
              </Button>
            </div>

            {/* Footer */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                <p>
                  Relatório gerado pela IA da plataforma Legacy • Baseado nas diretrizes do IBGC • 
                  Para próximos passos, consulte o módulo de Estruturação de Conselhos
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
        </main>
      </div>
    </div>;
}