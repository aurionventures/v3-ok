import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Search, 
  Filter, 
  FolderOpen,
  Upload,
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

// Document status
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'divergent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'analyzing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
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
    <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
      {labels[status as keyof typeof labels] || "Desconhecido"}
    </Badge>
  );
};

// Interface para documentos
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

const Documents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewDocument, setViewDocument] = useState<UploadedDocument | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [divergencesModalOpen, setDivergencesModalOpen] = useState(false);
  const [correctionsModalOpen, setCorrectionsModalOpen] = useState(false);
  const [selectedIssueDoc, setSelectedIssueDoc] = useState<UploadedDocument | null>(null);

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

  // Filter documents based on search term and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalDocuments = documents.length;
  const compliantDocs = documents.filter(d => d.status === 'compliant').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const divergentDocs = documents.filter(d => d.status === 'divergent').length;
  const overallProgress = totalDocuments > 0 ? (compliantDocs / totalDocuments) * 100 : 0;

  // Simulate AI analysis
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

  // Handle file upload
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

        toast({
          title: "Análise concluída",
          description: `${file.name} foi analisado com sucesso.`,
        });
      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: 'pending' as const } : doc
        ));
        
        toast({
          title: "Erro na análise",
          description: `Falha ao analisar ${file.name}.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadDocument = (document: UploadedDocument) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${document.name}...`,
    });
  };

  const handleShareDocument = (document: UploadedDocument) => {
    toast({
      title: "Link copiado",
      description: `Link de compartilhamento de ${document.name} copiado para a área de transferência.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Repositório de Documentos</h1>
                <p className="text-gray-600 mt-1">Upload, análise e gestão inteligente de documentos de governança</p>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {Math.round(overallProgress)}% Analisados
                </span>
              </div>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Status da Análise de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={overallProgress} className="w-full" />
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{totalDocuments}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{compliantDocs}</div>
                      <div className="text-sm text-gray-600">Conformes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{pendingDocs}</div>
                      <div className="text-sm text-gray-600">Pendentes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{divergentDocs}</div>
                      <div className="text-sm text-gray-600">Divergentes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload & Análise</TabsTrigger>
                <TabsTrigger value="library">Biblioteca</TabsTrigger>
                <TabsTrigger value="analysis">Análises</TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload por Categoria</CardTitle>
                      <p className="text-gray-600">Selecione a categoria e faça upload dos documentos para análise automática</p>
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
                      
                      {selectedCategory && (
                        <FileUpload 
                          onFileUpload={(files) => handleFileUpload(files, selectedCategory)}
                        />
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Uploads */}
                  {documents.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Documentos Analisados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {documents.slice(0, 5).map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div>
                                  <div className="font-medium">{doc.name}</div>
                                  <div className="text-sm text-gray-500">{doc.category}</div>
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

              {/* Library Tab */}
              <TabsContent value="library">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <CardTitle>Biblioteca de Documentos ({filteredDocuments.length})</CardTitle>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                                <FileText className="h-4 w-4 text-blue-600" />
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

              {/* Analysis Tab */}
              <TabsContent value="analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conformidade por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {documentCategories.map((category) => {
                          const categoryDocs = documents.filter(d => d.category === category);
                          const categoryCompliant = categoryDocs.filter(d => d.status === 'compliant').length;
                          const categoryProgress = categoryDocs.length > 0 ? (categoryCompliant / categoryDocs.length) * 100 : 0;
                          
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{category}</span>
                                <span>{categoryDocs.length} docs</span>
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
                      <CardTitle>Principais Issues Identificadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {documents
                          .filter(d => d.aiAnalysis?.issues.length)
                          .slice(0, 5)
                          .map((doc) => (
                            <div key={doc.id} className="p-3 border-l-4 border-red-400 bg-red-50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{doc.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {doc.aiAnalysis?.issues[0]}
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedIssueDoc(doc);
                                      setDivergencesModalOpen(true);
                                    }}
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Ver Divergências
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedIssueDoc(doc);
                                      setCorrectionsModalOpen(true);
                                    }}
                                  >
                                    <FileEdit className="h-3 w-3 mr-1" />
                                    Sugerir Correções
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Document Analysis Dialog */}
        {viewDocument && (
          <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>{viewDocument.name}</span>
                  {getStatusBadge(viewDocument.status)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informações do Documento</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Categoria:</strong> {viewDocument.category}</div>
                      <div><strong>Data de Upload:</strong> {viewDocument.uploadDate}</div>
                      <div><strong>Status:</strong> {getStatusBadge(viewDocument.status)}</div>
                    </div>
                  </div>
                </div>
                
                {viewDocument.aiAnalysis && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Resumo da Análise</h3>
                      <p className="text-gray-600">{viewDocument.aiAnalysis.summary}</p>
                    </div>

                    {viewDocument.aiAnalysis.issues.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-red-600">Issues Identificadas</h3>
                        <ul className="space-y-1">
                          {viewDocument.aiAnalysis.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-red-600 flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {viewDocument.aiAnalysis.recommendations.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-blue-600">Recomendações</h3>
                        <ul className="space-y-1">
                          {viewDocument.aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-blue-600 flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={() => handleDownloadDocument(viewDocument)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => handleShareDocument(viewDocument)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Divergences Modal */}
        <Dialog open={divergencesModalOpen} onOpenChange={setDivergencesModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Divergências Encontradas - {selectedIssueDoc?.name}
              </DialogTitle>
              <DialogDescription>
                Análise comparativa entre documentos oficiais e informações das entrevistas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Divergências Identificadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border-l-4 border-red-500 bg-red-50">
                      <div className="font-medium text-sm mb-2">Estrutura Societária</div>
                      <div className="text-xs space-y-1">
                        <p><strong>Documento:</strong> Capital social de R$ 10.000.000</p>
                        <p><strong>Entrevista:</strong> Mencionado R$ 8.500.000 pelo CFO</p>
                        <p className="text-red-700 mt-2"><strong>Impacto:</strong> Possível desatualização documental</p>
                      </div>
                    </div>
                    <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                      <div className="font-medium text-sm mb-2">Composição Acionária</div>
                      <div className="text-xs space-y-1">
                        <p><strong>Documento:</strong> 3 sócios principais</p>
                        <p><strong>Entrevista:</strong> Mencionado 4 sócios ativos</p>
                        <p className="text-yellow-700 mt-2"><strong>Impacto:</strong> Verificar entrada de novo sócio</p>
                      </div>
                    </div>
                    <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                      <div className="font-medium text-sm mb-2">Conselho de Administração</div>
                      <div className="text-xs space-y-1">
                        <p><strong>Documento:</strong> 5 membros definidos</p>
                        <p><strong>Entrevista:</strong> Mencionado plano de ampliar para 7</p>
                        <p className="text-orange-700 mt-2"><strong>Impacto:</strong> Atualização futura necessária</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDivergencesModalOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setDivergencesModalOpen(false);
                  setCorrectionsModalOpen(true);
                }}>
                  <FileEdit className="h-4 w-4 mr-2" />
                  Ver Correções Sugeridas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Corrections Modal */}
        <Dialog open={correctionsModalOpen} onOpenChange={setCorrectionsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-blue-600" />
                Correções Sugeridas - {selectedIssueDoc?.name}
              </DialogTitle>
              <DialogDescription>
                Recomendações de correções baseadas na análise de IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ações Recomendadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">1. Atualizar Capital Social</div>
                          <p className="text-xs text-gray-700">
                            Revisar e atualizar o valor do capital social no estatuto social para R$ 10.000.000 conforme documentação mais recente
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">Prioridade: Alta</Badge>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">2. Verificar Novo Sócio</div>
                          <p className="text-xs text-gray-700">
                            Solicitar documentação comprobatória da entrada do quarto sócio e atualizar acordo de acionistas
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">Prioridade: Alta</Badge>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">3. Planejar Expansão do Conselho</div>
                          <p className="text-xs text-gray-700">
                            Preparar minuta de alteração do estatuto para acomodar expansão do conselho para 7 membros
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">Prioridade: Média</Badge>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCorrectionsModalOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Ações exportadas",
                    description: "As correções sugeridas foram exportadas para sua lista de tarefas",
                  });
                  setCorrectionsModalOpen(false);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Ações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Documents;