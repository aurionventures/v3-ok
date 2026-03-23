import React, { useState, useMemo } from "react";
import { FileText, Search, FolderOpen, Download, Link, Eye } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEmpresas } from "@/hooks/useEmpresas";
import { useDocumentos } from "@/hooks/useDocumentos";
import type { Documento } from "@/types/documentos";

const CATEGORIAS = [
  "Estatutos e Contratos",
  "Atas e Registros",
  "Relatórios Financeiros",
  "Planejamento Estratégico",
  "Políticas e Normas",
  "Outros",
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewDocument, setViewDocument] = useState<Documento | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>(CATEGORIAS[0]);

  const { empresas, isLoading: loadingEmpresas, firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { documentos, isLoading, uploadFiles } = useDocumentos(empresaId);

  const filteredDocuments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return documentos.filter(
      (doc) =>
        (selectedCategory ? doc.category === selectedCategory : true) &&
        (term
          ? doc.name.toLowerCase().includes(term) ||
            (doc.category ?? "").toLowerCase().includes(term)
          : true)
    );
  }, [documentos, searchTerm, selectedCategory]);

  const categoriasUnicas = useMemo(
    () => [...new Set(documentos.map((d) => d.category).filter(Boolean))] as string[],
    [documentos]
  );

  const handleViewDocument = (doc: Documento) => {
    setViewDocument(doc);
  };

  const handleDownloadDocument = (doc: Documento) => {
    if (doc.arquivoUrl) {
      window.open(doc.arquivoUrl, "_blank");
    } else {
      toast({
        title: "Link indisponível",
        description: "O arquivo não possui URL de download.",
        variant: "destructive",
      });
    }
  };

  const handleShareDocument = (doc: Documento) => {
    if (doc.arquivoUrl) {
      navigator.clipboard.writeText(doc.arquivoUrl);
      toast({
        title: "Link copiado",
        description: "Link do documento copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Link indisponível",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (files: File[]) => {
    if (!empresaId) {
      throw new Error("Selecione uma empresa primeiro.");
    }
    await uploadFiles(files, uploadCategory);
    toast({
      title: "Documentos salvos",
      description: `${files.length} documento(s) adicionado(s) ao histórico.`,
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "DOCX":
      case "DOC":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "XLSX":
      case "XLS":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "PPTX":
      case "PPT":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const hasEmpresas = empresas.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Checklist" />
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
                  <TabsTrigger value="all">Histórico de Documentos</TabsTrigger>
                  <TabsTrigger value="upload">Upload de Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {hasEmpresas && !isLoading && documentos.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Filtrar por tipo:
                      </Label>
                      <Select
                        value={selectedCategory ?? "all"}
                        onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          {categoriasUnicas.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedCategory && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="text-muted-foreground"
                        >
                          Limpar filtro
                        </Button>
                      )}
                    </div>
                  )}

                  {!hasEmpresas ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Nenhuma empresa cadastrada</p>
                      <p className="text-sm mt-1">
                        Cadastre uma empresa para visualizar o histórico de documentos.
                      </p>
                    </div>
                  ) : isLoading ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Carregando documentos...
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">
                        {searchTerm || selectedCategory
                          ? "Nenhum documento encontrado"
                          : "Nenhum documento no histórico"}
                      </p>
                      <p className="text-sm mt-1">
                        Use a aba Upload de Documentos para enviar PDFs e salvar no histórico.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
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
                              <TableCell>{doc.category ?? "—"}</TableCell>
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
                    </>
                  )}
                </TabsContent>

                <TabsContent value="upload">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Upload de Documentos (PDF)</h3>
                      {!empresaId ? (
                        <p className="text-muted-foreground text-sm">
                          Cadastre uma empresa para fazer upload.
                        </p>
                      ) : (
                        <>
                          <div className="mb-4">
                            <Label className="text-sm font-medium">Categoria</Label>
                            <Select
                              value={uploadCategory}
                              onValueChange={setUploadCategory}
                              className="mt-1"
                            >
                              <SelectTrigger className="w-[240px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIAS.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FileUpload
                            label="Selecionar arquivos"
                            multiple={true}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                            onUpload={handleUpload}
                            saveButtonLabel="Salvar no histórico"
                          />
                        </>
                      )}
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
              {viewDocument?.category ?? "—"} • {viewDocument?.uploadDate}
            </DialogDescription>
          </DialogHeader>

          {viewDocument && (
            <div className="py-4">
              <div className="bg-gray-50 border rounded-md p-8 mb-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center">
                  {getDocumentIcon(viewDocument.type)}
                  <div className="mt-4 font-medium">{viewDocument.name}</div>
                  <div className="text-sm text-gray-500 mt-2">{viewDocument.size}</div>
                </div>
              </div>

              {viewDocument.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                  <p>{viewDocument.description}</p>
                </div>
              )}

              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => handleShareDocument(viewDocument)}>
                  <Link className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button onClick={() => handleDownloadDocument(viewDocument)}>
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
