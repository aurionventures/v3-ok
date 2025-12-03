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
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Search, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  BarChart3,
  FileEdit
} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useToast } from "@/components/ui/use-toast";

// Document categories for upload
const documentCategories = [
  'Estatuto Social',
  'Atas de Assembleia',
  'Políticas Corporativas',
  'Contratos Sociais',
  'Acordo de Acionistas',
  'Código de Conduta',
  'Política de Compliance',
  'Política de Riscos',
  'Regimento Interno',
  'Outros Documentos'
];

// Document status helpers
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'divergent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'analyzing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
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

  return (
    <Badge className={variants[status as keyof typeof variants] || "bg-muted text-muted-foreground"}>
      {labels[status as keyof typeof labels] || "Desconhecido"}
    </Badge>
  );
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

// Mock documents data
const initialDocuments: UploadedDocument[] = [
  {
    id: '1',
    name: 'Estatuto Social v2024.pdf',
    category: 'Estatuto Social',
    uploadDate: '2024-01-15',
    status: 'compliant',
    aiAnalysis: {
      summary: 'Documento conforme com as melhores práticas de governança corporativa.',
      issues: [],
      recommendations: ['Considerar adicionar cláusula sobre sustentabilidade.']
    }
  },
  {
    id: '2', 
    name: 'Política de Compliance.pdf',
    category: 'Políticas Corporativas',
    uploadDate: '2024-01-10',
    status: 'divergent',
    aiAnalysis: {
      summary: 'Política necessita de atualizações para conformidade com LGPD.',
      issues: ['Ausência de procedimentos LGPD', 'Falta definição de responsabilidades'],
      recommendations: ['Incluir seção específica sobre proteção de dados', 'Definir papel do encarregado de dados']
    }
  },
  {
    id: '3',
    name: 'Ata AGO 2023.pdf', 
    category: 'Atas de Assembleia',
    uploadDate: '2024-01-08',
    status: 'pending',
    aiAnalysis: {
      summary: 'Ata bem estruturada, mas faltam algumas informações obrigatórias.',
      issues: ['Ausência de quórum detalhado'],
      recommendations: ['Incluir detalhamento do quórum presente', 'Adicionar lista de presença completa']
    }
  }
];

export default function DocumentChecklist() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast: toastUI } = useToast();
  
  // Checklist state
  const { 
    checklist, 
    calculateProgress, 
    handleItemCheck,
    handleStatusChange,
    getCategoryProgress, 
    getAISuggestions 
  } = useDocumentChecklist();

  const progress = calculateProgress();

  // Library state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewDocument, setViewDocument] = useState<UploadedDocument | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [divergencesModalOpen, setDivergencesModalOpen] = useState(false);
  const [correctionsModalOpen, setCorrectionsModalOpen] = useState(false);
  const [selectedIssueDoc, setSelectedIssueDoc] = useState<UploadedDocument | null>(null);
  const [librarySubTab, setLibrarySubTab] = useState('upload');

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

  const handleItemStatusChange = (
    categoryIndex: number, 
    itemIndex: number, 
    status: DocumentStatus
  ) => {
    handleStatusChange(categoryIndex, itemIndex, status);
    
    const statusLabels: Record<string, string> = {
      "not-sent": "Não enviou",
      "not-have": "Não tem",
      "not-applicable": "Não se aplica",
    };
    toast.success(`Status atualizado: ${statusLabels[status as string]}`);
  };

  const handleUploadRedirect = (categoryName: string, itemName: string) => {
    localStorage.setItem('upload-context', JSON.stringify({
      category: categoryName,
      item: itemName
    }));
    setSearchParams({ tab: 'biblioteca' });
  };

  // Library handlers
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalDocuments = documents.length;
  const compliantDocs = documents.filter(d => d.status === 'compliant').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const divergentDocs = documents.filter(d => d.status === 'divergent').length;
  const overallProgress = totalDocuments > 0 ? (compliantDocs / totalDocuments) * 100 : 0;

  const simulateAIAnalysis = async (): Promise<{summary: string, issues: string[], recommendations: string[]}> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      summary: "Documento analisado com base nas melhores práticas de governança corporativa.",
      issues: [
        "Ausência de algumas cláusulas recomendadas",
        "Necessita atualização de acordo com nova legislação"
      ],
      recommendations: [
        "Incluir cláusula de sustentabilidade",
        "Atualizar referências legais",
        "Revisar política de conflito de interesses"
      ]
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
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { 
                ...doc, 
                status: analysis.issues.length > 0 ? 'divergent' : 'compliant' as const,
                aiAnalysis: analysis 
              }
            : doc
        ));

        toastUI({
          title: "Análise concluída",
          description: `${file.name} foi analisado com sucesso.`,
        });
      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: 'pending' as const } : doc
        ));
        
        toastUI({
          title: "Erro na análise",
          description: `Falha ao analisar ${file.name}.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadDocument = (document: UploadedDocument) => {
    toastUI({
      title: "Download iniciado",
      description: `Baixando ${document.name}...`,
    });
  };

  const handleShareDocument = (document: UploadedDocument) => {
    toastUI({
      title: "Link copiado",
      description: `Link de compartilhamento de ${document.name} copiado para a área de transferência.`,
    });
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex h-screen bg-background">
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
                
                <div className="grid gap-6">
                  {checklist.map((category, categoryIndex) => (
                    <ChecklistCategoryCard
                      key={category.id}
                      category={category}
                      categoryIndex={categoryIndex}
                      progress={getCategoryProgress(category)}
                      onItemCheck={handleItemChecked}
                      onStatusChange={handleItemStatusChange}
                      onUploadRedirect={handleUploadRedirect}
                    />
                  ))}
                </div>

                <ChecklistActions
                  onNavigateToDashboard={() => navigate('/dashboard')}
                  onNavigateToUpload={() => handleTabChange('biblioteca')}
                  onNavigateToInterviews={() => navigate('/interviews')}
                />
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

                {/* Library Sub-Tabs */}
                <Tabs value={librarySubTab} onValueChange={setLibrarySubTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">Upload & Análise</TabsTrigger>
                    <TabsTrigger value="library">Documentos</TabsTrigger>
                    <TabsTrigger value="analysis">Análises</TabsTrigger>
                  </TabsList>

                  {/* Upload Sub-Tab */}
                  <TabsContent value="upload">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Upload por Categoria</CardTitle>
                          <p className="text-muted-foreground">Selecione a categoria e faça upload dos documentos para análise automática</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {selectedCategory && selectedCategory !== 'all' && (
                            <FileUpload 
                              onFileUpload={(files) => handleFileUpload(files, selectedCategory)}
                            />
                          )}
                        </CardContent>
                      </Card>

                      {documents.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Documentos Recentes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {documents.slice(0, 5).map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <div>
                                      <div className="font-medium">{doc.name}</div>
                                      <div className="text-sm text-muted-foreground">{doc.category}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(doc.status)}
                                    {getStatusBadge(doc.status)}
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setViewDocument(doc)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Library Sub-Tab */}
                  <TabsContent value="library">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <CardTitle>Biblioteca de Documentos ({filteredDocuments.length})</CardTitle>
                          <div className="flex space-x-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                placeholder="Pesquisar documentos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                              />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todas as categorias</SelectItem>
                                {documentCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
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
                            {filteredDocuments.map((document) => (
                              <TableRow key={document.id}>
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
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setViewDocument(document)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadDocument(document)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShareDocument(document)}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analysis Sub-Tab */}
                  <TabsContent value="analysis">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Conformidade por Categoria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {documentCategories.slice(0, 5).map((category) => {
                              const categoryDocs = documents.filter(d => d.category === category);
                              const categoryCompliant = categoryDocs.filter(d => d.status === 'compliant').length;
                              const categoryProgress = categoryDocs.length > 0 ? (categoryCompliant / categoryDocs.length) * 100 : 0;
                              
                              return (
                                <div key={category} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{category}</span>
                                    <span className="text-muted-foreground">{categoryDocs.length} docs</span>
                                  </div>
                                  <Progress value={categoryProgress} className="h-2" />
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Problemas Identificados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {documents.filter(d => d.status === 'divergent').map((doc) => (
                              <div key={doc.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium text-red-800">{doc.name}</div>
                                    <div className="text-sm text-red-600 mt-1">
                                      {doc.aiAnalysis?.issues?.join(', ') || 'Problemas identificados'}
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedIssueDoc(doc);
                                      setCorrectionsModalOpen(true);
                                    }}
                                  >
                                    <FileEdit className="h-4 w-4 mr-1" />
                                    Ver Correções
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {documents.filter(d => d.status === 'divergent').length === 0 && (
                              <p className="text-muted-foreground text-center py-4">
                                Nenhum problema identificado nos documentos.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
          {viewDocument?.aiAnalysis && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Resumo da Análise</h4>
                <p className="text-muted-foreground">{viewDocument.aiAnalysis.summary}</p>
              </div>
              {viewDocument.aiAnalysis.issues.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Problemas Identificados</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {viewDocument.aiAnalysis.issues.map((issue, i) => (
                      <li key={i} className="text-red-600">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewDocument.aiAnalysis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Recomendações</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {viewDocument.aiAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-blue-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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
          {selectedIssueDoc?.aiAnalysis && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Problemas</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedIssueDoc.aiAnalysis.issues.map((issue, i) => (
                    <li key={i} className="text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recomendações de Correção</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedIssueDoc.aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-blue-600">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
