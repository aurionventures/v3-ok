import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useDocumentChecklist } from "@/hooks/useDocumentChecklist";
import { DocumentStatus } from "@/types/documentChecklist";
import { ChecklistProgressCard } from "@/components/checklist/ChecklistProgressCard";
import { AISuggestionsCard } from "@/components/checklist/AISuggestionsCard";
import { ChecklistCategoryCard } from "@/components/checklist/ChecklistCategoryCard";
import { ChecklistActions } from "@/components/checklist/ChecklistActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, Share2, Search, CheckCircle, Clock, AlertTriangle, Loader2, BarChart3, FileEdit, Plus, FolderPlus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import FileUpload from '@/components/FileUpload';
import { useToast } from "@/components/ui/use-toast";

// Document categories for upload
const documentCategories = ['Estatuto Social', 'Atas de Assembleia', 'Políticas Corporativas', 'Contratos Sociais', 'Acordo de Acionistas', 'Código de Conduta', 'Política de Compliance', 'Política de Riscos', 'Regimento Interno', 'Outros Documentos', 'Documentos Personalizados'];

// Document status helpers
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'divergent':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'analyzing':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};
const getStatusBadge = (status: string) => {
  const variants = {
    compliant: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    divergent: "bg-red-100 text-red-800",
    analyzing: "bg-blue-100 text-blue-800"
  };
  const labels = {
    compliant: "Conforme",
    pending: "Pendente",
    divergent: "Divergente",
    analyzing: "Analisando"
  };
  return <Badge className={variants[status as keyof typeof variants] || "bg-muted text-muted-foreground"}>
      {labels[status as keyof typeof labels] || "Desconhecido"}
    </Badge>;
};

// Interface for documents
interface UploadedDocument {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  status: 'analyzing' | 'compliant' | 'pending' | 'divergent';
  aiAnalysis?: {
    summary: string;
    issues: string[];
    recommendations: string[];
  };
}

// Mock documents data - 15 realistic governance documents
const initialDocuments: UploadedDocument[] = [
// DOCUMENTOS SOCIETÁRIOS
{
  id: '1',
  name: 'Estatuto Social v2024.pdf',
  category: 'Estatuto Social',
  uploadDate: '2024-01-15',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Estatuto Social em plena conformidade com a Lei das S.A. e melhores práticas do IBGC. Estrutura de governança bem definida.',
    issues: [],
    recommendations: ['Considerar adicionar cláusula sobre sustentabilidade ESG', 'Avaliar inclusão de mecanismo de voto múltiplo']
  }
}, {
  id: '2',
  name: 'Contrato Social Consolidado.pdf',
  category: 'Contratos Sociais',
  uploadDate: '2024-01-12',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Contrato Social consolidado e atualizado conforme Código Civil e legislação vigente.',
    issues: [],
    recommendations: ['Manter registro das alterações anteriores para histórico']
  }
}, {
  id: '3',
  name: 'Acordo de Acionistas 2023.pdf',
  category: 'Acordo de Acionistas',
  uploadDate: '2024-01-10',
  status: 'pending',
  aiAnalysis: {
    summary: 'Acordo de Acionistas com estrutura adequada, mas necessita revisão de cláusulas de saída.',
    issues: ['Cláusula de tag-along incompleta'],
    recommendations: ['Revisar mecanismo de tag-along para 100%', 'Incluir cláusula de drag-along']
  }
},
// ATAS E DELIBERAÇÕES
{
  id: '4',
  name: 'Ata AGO 2024.pdf',
  category: 'Atas de Assembleia',
  uploadDate: '2024-03-20',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Ata da Assembleia Geral Ordinária completa e em conformidade com requisitos legais.',
    issues: [],
    recommendations: ['Modelo pode ser padronizado para futuras assembleias']
  }
}, {
  id: '5',
  name: 'Ata AGE Janeiro 2024.pdf',
  category: 'Atas de Assembleia',
  uploadDate: '2024-01-28',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Ata Extraordinária bem estruturada com todas as formalidades necessárias.',
    issues: [],
    recommendations: ['Incluir resumo executivo no início do documento']
  }
}, {
  id: '6',
  name: 'Ata Conselho Administração Q1.pdf',
  category: 'Atas de Assembleia',
  uploadDate: '2024-04-05',
  status: 'pending',
  aiAnalysis: {
    summary: 'Ata do Conselho necessita assinaturas pendentes de 2 conselheiros.',
    issues: ['Assinaturas pendentes', 'Falta anexo mencionado na deliberação 3'],
    recommendations: ['Coletar assinaturas restantes', 'Anexar documento referenciado']
  }
},
// POLÍTICAS CORPORATIVAS
{
  id: '7',
  name: 'Código de Conduta Empresarial.pdf',
  category: 'Código de Conduta',
  uploadDate: '2024-02-01',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Código de Conduta abrangente, alinhado com práticas anticorrupção e compliance.',
    issues: [],
    recommendations: ['Atualizar seção sobre uso de redes sociais', 'Incluir casos práticos como exemplos']
  }
}, {
  id: '8',
  name: 'Política de Compliance v3.pdf',
  category: 'Política de Compliance',
  uploadDate: '2024-01-10',
  status: 'divergent',
  aiAnalysis: {
    summary: 'Política de Compliance necessita adequação urgente à LGPD e nova Lei Anticorrupção.',
    issues: ['Ausência de procedimentos LGPD', 'Falta definição do encarregado de dados', 'Desatualização com Lei 14.230/2021'],
    recommendations: ['Incluir seção específica sobre proteção de dados', 'Nomear DPO formalmente', 'Atualizar referências à Lei de Improbidade']
  }
}, {
  id: '9',
  name: 'Política de Gestão de Riscos.pdf',
  category: 'Política de Riscos',
  uploadDate: '2024-02-15',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Política de Riscos bem estruturada com matriz de riscos e planos de mitigação adequados.',
    issues: [],
    recommendations: ['Considerar integração com framework COSO ERM', 'Incluir riscos cibernéticos específicos']
  }
}, {
  id: '10',
  name: 'Política Anticorrupção.pdf',
  category: 'Políticas Corporativas',
  uploadDate: '2024-02-20',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Política Anticorrupção em conformidade com Lei 12.846/2013 e FCPA.',
    issues: [],
    recommendations: ['Incluir treinamento obrigatório anual', 'Adicionar due diligence para terceiros']
  }
},
// REGIMENTOS E REGULAMENTOS
{
  id: '11',
  name: 'Regimento Interno Conselho.pdf',
  category: 'Regimento Interno',
  uploadDate: '2024-01-25',
  status: 'pending',
  aiAnalysis: {
    summary: 'Regimento do Conselho de Administração necessita atualização quanto à periodicidade das reuniões.',
    issues: ['Periodicidade de reuniões não especificada', 'Ausência de quórum para deliberações específicas'],
    recommendations: ['Definir calendário anual de reuniões', 'Especificar quóruns qualificados por tipo de matéria']
  }
}, {
  id: '12',
  name: 'Regimento Comitê Auditoria.pdf',
  category: 'Regimento Interno',
  uploadDate: '2024-02-10',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Regimento do Comitê de Auditoria completo e alinhado às melhores práticas de mercado.',
    issues: [],
    recommendations: ['Incluir interação formal com auditoria externa']
  }
}, {
  id: '13',
  name: 'Regulamento Canal Denúncias.pdf',
  category: 'Políticas Corporativas',
  uploadDate: '2024-03-01',
  status: 'divergent',
  aiAnalysis: {
    summary: 'Regulamento do Canal de Denúncias com falhas críticas de confidencialidade e não-retaliação.',
    issues: ['Garantia de anonimato insuficiente', 'Política de não-retaliação incompleta', 'Ausência de SLA para investigação'],
    recommendations: ['Garantir anonimato tecnológico do canal', 'Detalhar proteções contra retaliação', 'Definir prazos máximos de apuração']
  }
},
// OUTROS DOCUMENTOS
{
  id: '14',
  name: 'Protocolo Familiar 2024.pdf',
  category: 'Outros Documentos',
  uploadDate: '2024-01-05',
  status: 'compliant',
  aiAnalysis: {
    summary: 'Protocolo Familiar bem elaborado com regras claras de sucessão e governança familiar.',
    issues: [],
    recommendations: ['Revisar anualmente em Assembleia Familiar', 'Incluir programa de formação de herdeiros']
  }
}, {
  id: '15',
  name: 'Matriz de Riscos Corporativos.xlsx',
  category: 'Política de Riscos',
  uploadDate: '2024-03-15',
  status: 'pending',
  aiAnalysis: {
    summary: 'Matriz de Riscos necessita atualização do mapeamento de riscos operacionais.',
    issues: ['Riscos cibernéticos desatualizados', 'Falta avaliação de riscos ESG'],
    recommendations: ['Atualizar riscos de segurança da informação', 'Incluir riscos climáticos e sociais']
  }
}];
export default function DocumentChecklist() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    toast: toastUI
  } = useToast();

  // Checklist state
  const {
    checklist,
    calculateProgress,
    handleItemCheck,
    handleStatusChange,
    getCategoryProgress,
    getAISuggestions,
    addCustomItem
  } = useDocumentChecklist();

  // Custom document modal state
  const [showCustomDocModal, setShowCustomDocModal] = useState(false);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocFile, setCustomDocFile] = useState<File | null>(null);
  const progress = calculateProgress();

  // Library state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewDocument, setViewDocument] = useState<UploadedDocument | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [divergencesModalOpen, setDivergencesModalOpen] = useState(false);
  const [correctionsModalOpen, setCorrectionsModalOpen] = useState(false);
  const [selectedIssueDoc, setSelectedIssueDoc] = useState<UploadedDocument | null>(null);
  const [librarySubTab, setLibrarySubTab] = useState('library');

  // Get active tab from URL
  const activeTab = searchParams.get('tab') || 'checklist';

  // Load documents from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('uploaded-documents');
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      setDocuments(initialDocuments);
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploaded-documents', JSON.stringify(documents));
  }, [documents]);

  // Checklist handlers
  const handleItemChecked = (categoryIndex: number, itemIndex: number, checked: boolean) => {
    handleItemCheck(categoryIndex, itemIndex, checked);
    if (checked) {
      toast.success("Documento marcado como existente.");
    }
  };
  const handleItemStatusChange = (categoryIndex: number, itemIndex: number, status: DocumentStatus) => {
    handleStatusChange(categoryIndex, itemIndex, status);
    const statusLabels: Record<string, string> = {
      "not-sent": "Não enviou",
      "not-have": "Não tem",
      "not-applicable": "Não se aplica"
    };
    toast.success(`Status atualizado: ${statusLabels[status as string]}`);
  };
  const handleUploadRedirect = (categoryName: string, itemName: string) => {
    localStorage.setItem('upload-context', JSON.stringify({
      category: categoryName,
      item: itemName
    }));
    setSearchParams({
      tab: 'biblioteca'
    });
  };

  // Library handlers
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const totalDocuments = documents.length;
  const compliantDocs = documents.filter(d => d.status === 'compliant').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const divergentDocs = documents.filter(d => d.status === 'divergent').length;
  const overallProgress = totalDocuments > 0 ? compliantDocs / totalDocuments * 100 : 0;
  const simulateAIAnalysis = async (): Promise<{
    summary: string;
    issues: string[];
    recommendations: string[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      summary: "Documento analisado com base nas melhores práticas de governança corporativa.",
      issues: ["Ausência de algumas cláusulas recomendadas", "Necessita atualização de acordo com nova legislação"],
      recommendations: ["Incluir cláusula de sustentabilidade", "Atualizar referências legais", "Revisar política de conflito de interesses"]
    };
  };
  const handleFileUpload = async (uploadedFiles: File[], category: string) => {
    for (const file of uploadedFiles) {
      const newDoc: UploadedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        category: category,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'analyzing'
      };
      setDocuments(prev => [...prev, newDoc]);
      try {
        const analysis = await simulateAIAnalysis();
        setDocuments(prev => prev.map(doc => doc.id === newDoc.id ? {
          ...doc,
          status: analysis.issues.length > 0 ? 'divergent' : 'compliant' as const,
          aiAnalysis: analysis
        } : doc));
        toastUI({
          title: "Análise concluída",
          description: `${file.name} foi analisado com sucesso.`
        });
      } catch (error) {
        setDocuments(prev => prev.map(doc => doc.id === newDoc.id ? {
          ...doc,
          status: 'pending' as const
        } : doc));
        toastUI({
          title: "Erro na análise",
          description: `Falha ao analisar ${file.name}.`,
          variant: "destructive"
        });
      }
    }
  };
  const handleDownloadDocument = (document: UploadedDocument) => {
    toastUI({
      title: "Download iniciado",
      description: `Baixando ${document.name}...`
    });
  };
  const handleShareDocument = (document: UploadedDocument) => {
    toastUI({
      title: "Link copiado",
      description: `Link de compartilhamento de ${document.name} copiado para a área de transferência.`
    });
  };
  const handleTabChange = (value: string) => {
    setSearchParams({
      tab: value
    });
  };
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Checklist de Documentos" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
              </TabsList>

              {/* Checklist Tab */}
              <TabsContent value="checklist" className="space-y-6">
                <ChecklistProgressCard progress={progress} />
                <AISuggestionsCard suggestions={getAISuggestions(progress.completionPercentage)} />
                
                {/* Button for custom documents */}
                <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                  <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6">
                    <Button variant="outline" className="gap-2" onClick={() => setShowCustomDocModal(true)}>
                      <Plus className="h-4 w-4" />
                      Adicionar Documento Personalizado
                    </Button>
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                      Adicione documentos que não constam no checklist padrão
                    </p>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6">
                  {checklist.map((category, categoryIndex) => <ChecklistCategoryCard key={category.id} category={category} categoryIndex={categoryIndex} progress={getCategoryProgress(category)} onItemCheck={handleItemChecked} onStatusChange={handleItemStatusChange} onUploadRedirect={handleUploadRedirect} />)}
                </div>

                <ChecklistActions onNavigateToDashboard={() => navigate('/dashboard')} onNavigateToUpload={() => handleTabChange('biblioteca')} onNavigateToInterviews={() => navigate('/interviews')} />
              </TabsContent>

              {/* Library Tab */}
              <TabsContent value="biblioteca" className="space-y-6">
                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Status da Análise de Documentos</CardTitle>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {Math.round(overallProgress)}% Analisados
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={overallProgress} className="w-full" />
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-foreground">{totalDocuments}</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{compliantDocs}</div>
                          <div className="text-sm text-muted-foreground">Conformes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{pendingDocs}</div>
                          <div className="text-sm text-muted-foreground">Pendentes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{divergentDocs}</div>
                          <div className="text-sm text-muted-foreground">Divergentes</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload por Categoria - Sempre visível na Biblioteca */}
                

                {/* Library Sub-Tabs */}
                <Tabs value={librarySubTab} onValueChange={setLibrarySubTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="library">Documentos</TabsTrigger>
                    <TabsTrigger value="analysis">Análises</TabsTrigger>
                  </TabsList>

                  {/* Library Sub-Tab */}
                  <TabsContent value="library">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <CardTitle>Biblioteca de Documentos ({filteredDocuments.length})</CardTitle>
                          <div className="flex space-x-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="Pesquisar documentos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todas as categorias</SelectItem>
                                {documentCategories.map(category => <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Documento</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Data Upload</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDocuments.map(document => <TableRow key={document.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <div>
                                      <div className="font-medium">{document.name}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{document.category}</Badge>
                                </TableCell>
                                <TableCell>{document.uploadDate}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(document.status)}
                                    {getStatusBadge(document.status)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setViewDocument(document)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(document)}>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleShareDocument(document)}>
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>)}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analysis Sub-Tab */}
                  <TabsContent value="analysis">
                    <div className="space-y-6">
                      {/* Status Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-green-200 bg-green-50/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-green-700">{compliantDocs}</div>
                                <div className="text-sm text-green-600">Documentos Conformes</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-yellow-200 bg-yellow-50/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-yellow-100">
                                <Clock className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-yellow-700">{pendingDocs}</div>
                                <div className="text-sm text-yellow-600">Aguardando Análise</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-red-200 bg-red-50/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-red-700">{divergentDocs}</div>
                                <div className="text-sm text-red-600">Requerem Atenção</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Compliance by Category - All Categories */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Conformidade por Categoria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documentCategories.map(category => {
                            const categoryDocs = documents.filter(d => d.category === category);
                            const categoryCompliant = categoryDocs.filter(d => d.status === 'compliant').length;
                            const categoryProgress = categoryDocs.length > 0 ? categoryCompliant / categoryDocs.length * 100 : 0;
                            return <div key={category} className="space-y-2 p-3 border rounded-lg">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{category}</span>
                                    <span className="text-muted-foreground">
                                      {categoryCompliant}/{categoryDocs.length} conformes
                                    </span>
                                  </div>
                                  <Progress value={categoryProgress} className="h-2" />
                                </div>;
                          })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Complete Document Analysis List */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Análises Detalhadas por Documento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {documents.map(doc => <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    {getStatusIcon(doc.status)}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium">{doc.name}</span>
                                        {getStatusBadge(doc.status)}
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {doc.category} | {doc.uploadDate}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {doc.aiAnalysis?.summary || 'Análise pendente...'}
                                      </p>
                                      
                                      {/* Show issues inline if divergent */}
                                      {doc.status === 'divergent' && doc.aiAnalysis?.issues && doc.aiAnalysis.issues.length > 0 && <div className="mt-2 pl-3 border-l-2 border-red-300">
                                          <ul className="text-xs text-red-600 space-y-1">
                                            {doc.aiAnalysis.issues.slice(0, 2).map((issue, i) => <li key={i}>{issue}</li>)}
                                            {doc.aiAnalysis.issues.length > 2 && <li className="text-red-500">+{doc.aiAnalysis.issues.length - 2} mais...</li>}
                                          </ul>
                                        </div>}
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => setViewDocument(doc)}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Ver Análise
                                  </Button>
                                </div>
                              </div>)}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Critical Issues Section */}
                      {divergentDocs > 0 && <Card className="border-red-200">
                          <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              Problemas Críticos ({divergentDocs})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {documents.filter(d => d.status === 'divergent').map(doc => <div key={doc.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-red-800">{doc.name}</div>
                                      <div className="text-sm text-red-600 mt-1">
                                        {doc.aiAnalysis?.issues?.join(' | ') || 'Problemas identificados'}
                                      </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100" onClick={() => {
                                setSelectedIssueDoc(doc);
                                setCorrectionsModalOpen(true);
                              }}>
                                      <FileEdit className="h-4 w-4 mr-1" />
                                      Ver Correções
                                    </Button>
                                  </div>
                                </div>)}
                            </div>
                          </CardContent>
                        </Card>}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Document View Modal */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewDocument?.name}</DialogTitle>
            <DialogDescription>
              {viewDocument?.category} - Enviado em {viewDocument?.uploadDate}
            </DialogDescription>
          </DialogHeader>
          {viewDocument?.aiAnalysis && <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Resumo da Análise</h4>
                <p className="text-muted-foreground">{viewDocument.aiAnalysis.summary}</p>
              </div>
              {viewDocument.aiAnalysis.issues.length > 0 && <div>
                  <h4 className="font-semibold mb-2 text-red-600">Problemas Identificados</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {viewDocument.aiAnalysis.issues.map((issue, i) => <li key={i} className="text-red-600">{issue}</li>)}
                  </ul>
                </div>}
              {viewDocument.aiAnalysis.recommendations.length > 0 && <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Recomendações</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {viewDocument.aiAnalysis.recommendations.map((rec, i) => <li key={i} className="text-blue-600">{rec}</li>)}
                  </ul>
                </div>}
            </div>}
        </DialogContent>
      </Dialog>

      {/* Corrections Modal */}
      <Dialog open={correctionsModalOpen} onOpenChange={setCorrectionsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Correções Sugeridas</DialogTitle>
            <DialogDescription>
              {selectedIssueDoc?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedIssueDoc?.aiAnalysis && <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Problemas</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedIssueDoc.aiAnalysis.issues.map((issue, i) => <li key={i} className="text-red-600">{issue}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recomendações de Correção</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedIssueDoc.aiAnalysis.recommendations.map((rec, i) => <li key={i} className="text-blue-600">{rec}</li>)}
                </ul>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Custom Document Modal */}
      <Dialog open={showCustomDocModal} onOpenChange={setShowCustomDocModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Adicionar Documento Personalizado
            </DialogTitle>
            <DialogDescription>
              Adicione documentos que não constam no checklist padrão. O documento será salvo na categoria "Documentos Personalizados".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-doc-name">Nome do Documento</Label>
              <Input id="custom-doc-name" placeholder="Ex: Contrato de Licença de Software" value={customDocName} onChange={e => setCustomDocName(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Arquivo (opcional)</Label>
              <FileUpload onFileUpload={files => {
              if (files.length > 0) {
                setCustomDocFile(files[0]);
                if (!customDocName) {
                  setCustomDocName(files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }
            }} />
              {customDocFile && <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {customDocFile.name}
                </p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
            setShowCustomDocModal(false);
            setCustomDocName('');
            setCustomDocFile(null);
          }}>
              Cancelar
            </Button>
            <Button onClick={async () => {
            if (!customDocName.trim()) {
              toast.error("Por favor, informe o nome do documento.");
              return;
            }

            // Add to checklist
            addCustomItem(customDocName);

            // If file was uploaded, add to library
            if (customDocFile) {
              await handleFileUpload([customDocFile], 'Documentos Personalizados');
            }
            toast.success(`"${customDocName}" adicionado ao checklist com sucesso!`);

            // Reset and close
            setShowCustomDocModal(false);
            setCustomDocName('');
            setCustomDocFile(null);
          }} disabled={!customDocName.trim()}>
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}