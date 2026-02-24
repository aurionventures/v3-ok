
import React, { useState } from "react";
import { FileText, Search, FolderOpen, Calendar, File, Download, Link, Eye } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

// Sample document categories
const documentCategories = [
  { id: 1, name: "Estatutos e Contratos", icon: FolderOpen, count: 8 },
  { id: 2, name: "Atas e Registros", icon: Calendar, count: 15 },
  { id: 3, name: "Relatórios Financeiros", icon: FileText, count: 12 },
  { id: 4, name: "Planejamento Estratégico", icon: File, count: 5 },
  { id: 5, name: "Políticas e Normas", icon: FileText, count: 9 },
];

// Sample documents data
const documents = [
  {
    id: 1,
    name: "Estatuto Social.pdf",
    category: "Estatutos e Contratos",
    uploadedBy: "José Silva",
    uploadDate: "12/01/2025",
    size: "2.5MB",
    type: "PDF",
    description: "Estatuto social da empresa, aprovado na Assembleia Geral de 10/01/2025.",
    tags: ["legal", "estatuto", "governance"],
    version: "1.2"
  },
  {
    id: 2,
    name: "Acordo de Acionistas.pdf",
    category: "Estatutos e Contratos",
    uploadedBy: "Maria Silva",
    uploadDate: "15/01/2025",
    size: "3.8MB",
    type: "PDF",
    description: "Acordo de acionistas vigente, assinado por todos os sócios em 15/01/2025.",
    tags: ["legal", "acionistas", "acordo"],
    version: "2.0"
  },
  {
    id: 3,
    name: "Protocolo Familiar v2.docx",
    category: "Estatutos e Contratos",
    uploadedBy: "Carlos Silva",
    uploadDate: "10/02/2025",
    size: "1.2MB",
    type: "DOCX",
    description: "Protocolo familiar com diretrizes para relacionamento família-empresa.",
    tags: ["protocolo", "família", "governance"],
    version: "2.1"
  },
  {
    id: 4,
    name: "Ata Assembleia Jan-2025.pdf",
    category: "Atas e Registros",
    uploadedBy: "Carlos Silva",
    uploadDate: "05/02/2025",
    size: "1.4MB",
    type: "PDF",
    description: "Ata da Assembleia Geral Ordinária realizada em 25/01/2025.",
    tags: ["ata", "assembleia", "AGO"],
    version: "1.0"
  },
  {
    id: 5,
    name: "Ata Conselho Administração Fev-2025.pdf",
    category: "Atas e Registros",
    uploadedBy: "Ana Silva",
    uploadDate: "20/02/2025",
    size: "1.8MB",
    type: "PDF",
    description: "Ata da reunião do Conselho de Administração de fevereiro de 2025.",
    tags: ["ata", "conselho", "RCA"],
    version: "1.0"
  },
  {
    id: 6,
    name: "Relatório Financeiro Q1-2025.xlsx",
    category: "Relatórios Financeiros",
    uploadedBy: "Ana Silva",
    uploadDate: "15/04/2025",
    size: "4.2MB",
    type: "XLSX",
    description: "Relatório financeiro do primeiro trimestre de 2025.",
    tags: ["finanças", "relatório", "trimestral"],
    version: "1.1"
  },
  {
    id: 7,
    name: "Planejamento Estratégico 2025-2030.pptx",
    category: "Planejamento Estratégico",
    uploadedBy: "José Silva",
    uploadDate: "10/01/2025",
    size: "8.5MB",
    type: "PPTX",
    description: "Apresentação do planejamento estratégico quinquenal.",
    tags: ["estratégia", "planejamento", "longo prazo"],
    version: "1.3"
  },
  {
    id: 8,
    name: "Política de Dividendos.pdf",
    category: "Políticas e Normas",
    uploadedBy: "Maria Silva",
    uploadDate: "05/03/2025",
    size: "0.9MB",
    type: "PDF",
    description: "Política de distribuição de dividendos aprovada pelo CA.",
    tags: ["política", "dividendos", "finanças"],
    version: "2.1"
  },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewDocument, setViewDocument] = useState<any>(null);

  const filteredDocuments = documents.filter(
    (doc) =>
      (selectedCategory ? doc.category === selectedCategory : true) &&
      (searchTerm
        ? doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };

  const handleViewDocument = (document: any) => {
    setViewDocument(document);
  };

  const handleDownloadDocument = (document: any) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${document.name}`,
    });
  };

  const handleShareDocument = (document: any) => {
    toast({
      title: "Compartilhar documento",
      description: `Link para compartilhar ${document.name} copiado para a área de transferência`,
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "DOCX":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "XLSX":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "PPTX":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Documentos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Documentação Oficial
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar documentos..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Todos os Documentos</TabsTrigger>
                  <TabsTrigger value="upload">Upload de Documentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    {documentCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === category.name
                            ? "bg-legacy-purple-500 text-white border-legacy-purple-500"
                            : "bg-white border-gray-200 hover:border-legacy-purple-500"
                        }`}
                        onClick={() => handleSelectCategory(category.name)}
                      >
                        <div className="flex items-center mb-2">
                          <category.icon
                            className={`h-5 w-5 mr-2 ${
                              selectedCategory === category.name
                                ? "text-white"
                                : "text-legacy-purple-500"
                            }`}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div
                          className={`text-sm ${
                            selectedCategory === category.name
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          {category.count} documento(s)
                        </div>
                      </div>
                    ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Enviado por</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getDocumentIcon(doc.type)}
                              <span className="ml-2">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.category}</TableCell>
                          <TableCell>{doc.uploadedBy}</TableCell>
                          <TableCell>{doc.uploadDate}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDocument(doc)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadDocument(doc)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShareDocument(doc)}
                                title="Compartilhar"
                              >
                                <Link className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Upload de Documentos</h3>
                      <FileUpload 
                        label="Fazer upload de documentos" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for document preview */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewDocument && getDocumentIcon(viewDocument.type)}
              {viewDocument?.name}
            </DialogTitle>
            <DialogDescription>
              {viewDocument?.category} • {viewDocument?.uploadDate}
            </DialogDescription>
          </DialogHeader>

          {viewDocument && (
            <div className="py-4">
              {/* Document preview/info */}
              <div className="bg-gray-50 border rounded-md p-8 mb-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center">
                  {getDocumentIcon(viewDocument.type)}
                  <div className="mt-4 font-medium">{viewDocument.name}</div>
                  <div className="text-sm text-gray-500 mt-2">{viewDocument.size}</div>
                </div>
              </div>

              {/* Document metadata */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                  <p>{viewDocument.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
                    <p>{viewDocument.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Enviado por</h3>
                    <p>{viewDocument.uploadedBy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Data de Upload</h3>
                    <p>{viewDocument.uploadDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Versão</h3>
                    <p>{viewDocument.version}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewDocument.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleShareDocument(viewDocument)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button 
                  onClick={() => handleDownloadDocument(viewDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
