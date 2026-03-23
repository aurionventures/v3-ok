import React, { useState, useMemo } from "react";
import { FileText, Search, FolderOpen, Download, Link, Eye, Building2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useEmpresaDados } from "@/hooks/useEmpresaDados";
import type { Documento } from "@/types/documentos";

const SETORES = [
  "Indústria",
  "Tecnologia",
  "Serviços",
  "Saúde",
  "Financeiro",
  "Agronegócio",
  "Comércio",
  "Construção",
  "Energia",
  "Educação",
  "Outros",
];

const PORTES = [
  { value: "micro", label: "Microempresa" },
  { value: "pequena", label: "Pequena" },
  { value: "media", label: "Média" },
  { value: "grande", label: "Grande" },
];

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
  const [mainTab, setMainTab] = useState("documentos");

  const { empresas, isLoading: loadingEmpresas, firstEmpresaId } = useEmpresas();
  const { dados, isLoading: loadingDados, hasEmpresa, saveDados, isSaving } = useEmpresaDados();
  const empresaId = firstEmpresaId;

  const [formSetor, setFormSetor] = useState("");
  const [formSegmento, setFormSegmento] = useState("");
  const [formPorte, setFormPorte] = useState("");
  const [formAreasAtuacao, setFormAreasAtuacao] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formMissao, setFormMissao] = useState("");

  React.useEffect(() => {
    if (dados) {
      setFormSetor(dados.setor ?? "");
      setFormSegmento(dados.segmento ?? "");
      setFormPorte(dados.porte ?? "");
      setFormAreasAtuacao(dados.areas_atuacao ?? "");
      setFormDescricao(dados.descricao ?? "");
      setFormMissao(dados.missao ?? "");
    }
  }, [dados]);
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

  const handleSaveDados = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaId) return;
    const payload = {
      setor: formSetor.trim() || null,
      segmento: formSegmento.trim() || null,
      porte: formPorte.trim() || null,
      areas_atuacao: formAreasAtuacao.trim() || null,
      descricao: formDescricao.trim() || null,
      missao: formMissao.trim() || null,
    };
    try {
      const { error } = await saveDados(payload);
      if (error) {
        toast({ title: "Erro ao salvar", description: String(error), variant: "destructive" });
      } else {
        toast({ title: "Dados salvos", description: "O contexto da empresa foi atualizado e será usado pela IA." });
      }
    } catch (err) {
      toast({ title: "Erro ao salvar", description: String(err), variant: "destructive" });
    }
  };

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
              </div>

              <Tabs value={mainTab} onValueChange={setMainTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="documentos" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos
                  </TabsTrigger>
                  <TabsTrigger value="dados" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Dados da empresa
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="documentos">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="relative w-full sm:w-[280px]">
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
                </TabsContent>

                <TabsContent value="dados">
                  <div className="max-w-2xl">
                    {!hasEmpresa ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Nenhuma empresa selecionada</p>
                        <p className="text-sm mt-1">Selecione uma empresa para cadastrar os dados de contexto.</p>
                      </div>
                    ) : loadingDados ? (
                      <div className="py-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-legacy-500" />
                      </div>
                    ) : (
                      <form onSubmit={handleSaveDados} className="space-y-6">
                        <p className="text-sm text-muted-foreground">
                          Esses dados servem de contexto para a IA entender o que a empresa faz e sugerir pautas de
                          reuniões mais relevantes.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="setor">Setor</Label>
                            <Select value={formSetor || "none"} onValueChange={(v) => setFormSetor(v === "none" ? "" : v)}>
                              <SelectTrigger id="setor" className="mt-1">
                                <SelectValue placeholder="Selecione o setor" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">—</SelectItem>
                                {SETORES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="porte">Porte</Label>
                            <Select value={formPorte || "none"} onValueChange={(v) => setFormPorte(v === "none" ? "" : v)}>
                              <SelectTrigger id="porte" className="mt-1">
                                <SelectValue placeholder="Selecione o porte" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">—</SelectItem>
                                {PORTES.map((p) => (
                                  <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="segmento">Segmento / Nicho</Label>
                          <Input
                            id="segmento"
                            placeholder="Ex: Software B2B, E-commerce de moda, Consultoria jurídica"
                            value={formSegmento}
                            onChange={(e) => setFormSegmento(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="areas_atuacao">Áreas de atuação</Label>
                          <Textarea
                            id="areas_atuacao"
                            placeholder="Descreva as principais áreas em que a empresa atua (ex: desenvolvimento de software, assessoria fiscal, logística)"
                            value={formAreasAtuacao}
                            onChange={(e) => setFormAreasAtuacao(e.target.value)}
                            className="mt-1 min-h-[80px]"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="descricao">Descrição da empresa</Label>
                          <Textarea
                            id="descricao"
                            placeholder="Breve descrição do negócio para contexto da IA"
                            value={formDescricao}
                            onChange={(e) => setFormDescricao(e.target.value)}
                            className="mt-1 min-h-[100px]"
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="missao">Missão / Visão</Label>
                          <Textarea
                            id="missao"
                            placeholder="Missão ou visão da empresa (opcional)"
                            value={formMissao}
                            onChange={(e) => setFormMissao(e.target.value)}
                            className="mt-1 min-h-[80px]"
                            rows={3}
                          />
                        </div>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar dados"
                          )}
                        </Button>
                      </form>
                    )}
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
