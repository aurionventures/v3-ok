import { useState } from "react";
import { 
  Bot, Search, Filter, Plus, Book, BookText, Save, Trash2, Check, AlertCircle, X, File, ArrowUpDown, ChevronDown, Eye, Download, Upload, Pencil
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// Knowledge base item interface
interface KnowledgeItem {
  id: number;
  title: string;
  description: string;
  contentType: "document" | "faq" | "guide" | "protocol";
  status: "active" | "draft" | "archived";
  dateCreated: string;
  dateModified: string;
  associatedAgents: string[];
  content: string;
}

// Sample knowledge base items
const initialKnowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: "Protocolo de Sucessão Familiar",
    description: "Documento orientador para transição de liderança em empresas familiares",
    contentType: "protocol",
    status: "active",
    dateCreated: "2023-05-15",
    dateModified: "2024-04-10",
    associatedAgents: ["Assistente Legacy", "Especialista em Sucessão"],
    content: `# Protocolo de Sucessão Familiar

## Introdução
Este protocolo estabelece as diretrizes para a sucessão familiar na empresa, visando garantir a continuidade do negócio e preservar o legado familiar.

## Critérios para Sucessores
- Formação acadêmica compatível
- Experiência profissional prévia
- Alinhamento com os valores familiares
- Competências de liderança

## Processo de Preparação
1. Identificação de potenciais sucessores
2. Programa de desenvolvimento individual
3. Mentoria com líderes atuais
4. Avaliação periódica de desempenho

## Governança do Processo
O Comitê de Sucessão será responsável por supervisionar todo o processo, composto por:
- Representantes da família
- Conselheiros independentes
- Especialistas externos

## Cronograma de Implementação
Definição de marco temporal para cada etapa do processo sucessório.`
  },
  {
    id: 2,
    title: "Estrutura de Conselhos Recomendada",
    description: "Guia para implementação de estruturas de governança eficientes",
    contentType: "guide",
    status: "active",
    dateCreated: "2023-06-22",
    dateModified: "2024-03-18",
    associatedAgents: ["Assistente Legacy"],
    content: `# Estrutura de Conselhos Recomendada

## Conselho de Administração
- Composição: 5-9 membros
- Frequência: reuniões mensais
- Mandato: 2 anos, renovável uma vez
- Comitês recomendados:
  - Auditoria e Riscos
  - Estratégia e Inovação
  - Pessoas e Remuneração

## Conselho de Família
- Composição: representantes de cada ramo familiar
- Frequência: reuniões trimestrais
- Mandato: 3 anos, rotativo
- Temas principais:
  - Educação e desenvolvimento de familiares
  - Resolução de conflitos
  - Preservação de valores e legado

## Conselho de Sócios
- Composição: todos os sócios
- Frequência: reuniões semestrais
- Temas principais:
  - Política de dividendos
  - Investimentos estratégicos
  - Acordo de acionistas`
  },
  {
    id: 3,
    title: "Perguntas Frequentes sobre ESG",
    description: "Respostas às dúvidas mais comuns sobre práticas ESG",
    contentType: "faq",
    status: "draft",
    dateCreated: "2023-09-05",
    dateModified: "2024-05-12",
    associatedAgents: ["Consultor de ESG"],
    content: `# Perguntas Frequentes sobre ESG

## O que é ESG?
ESG significa Environmental, Social and Governance (Ambiental, Social e Governança). São critérios que avaliam as práticas ambientais, sociais e de governança de uma empresa.

## Por que implementar práticas ESG?
- Redução de riscos operacionais e reputacionais
- Atração de investidores alinhados com sustentabilidade
- Melhoria na retenção de talentos
- Vantagem competitiva no mercado
- Preparação para regulações futuras

## Como iniciar a jornada ESG?
1. Realize um diagnóstico da situação atual
2. Defina materialidade dos temas ESG para seu negócio
3. Estabeleça métricas e metas claras
4. Implemente ações prioritárias
5. Comunique resultados com transparência

## Quais certificações são relevantes?
Depende do setor, mas algumas importantes são:
- B Corp
- ISO 14001 (Gestão Ambiental)
- ISO 45001 (Saúde e Segurança Ocupacional)
- SA8000 (Responsabilidade Social)`
  },
  {
    id: 4,
    title: "Manual de Governança Corporativa",
    description: "Documento completo com diretrizes de governança para empresas familiares",
    contentType: "document",
    status: "active",
    dateCreated: "2023-04-10",
    dateModified: "2024-04-25",
    associatedAgents: ["Assistente Legacy", "Especialista em Sucessão"],
    content: `# Manual de Governança Corporativa

## Princípios Fundamentais
- Transparência
- Equidade
- Prestação de contas
- Responsabilidade corporativa

## Estruturas de Governança
### Assembleia de Acionistas
Composição e funcionamento

### Conselho de Administração
Composição, competências e responsabilidades

### Diretoria Executiva
Composição, competências e responsabilidades

### Comitês de Assessoramento
Tipos, composição e funcionamento

## Políticas Corporativas
- Código de Ética e Conduta
- Política de Divulgação de Informações
- Política de Gerenciamento de Riscos
- Política de Transações com Partes Relacionadas
- Política de Remuneração

## Auditoria e Conformidade
Diretrizes para garantir a integridade das informações financeiras e operacionais.

## Gestão de Riscos
Metodologia para identificação, avaliação e tratamento de riscos corporativos.`
  },
];

const AIConfig = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(initialKnowledgeItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "document" | "faq" | "guide" | "protocol">("all");
  
  // Create/Edit state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [viewingItem, setViewingItem] = useState<KnowledgeItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // New document state
  const [newItem, setNewItem] = useState<Omit<KnowledgeItem, "id" | "dateCreated" | "dateModified">>({
    title: "",
    description: "",
    contentType: "document",
    status: "draft",
    associatedAgents: [],
    content: ""
  });

  // Filter items based on search term and filters
  const filteredItems = knowledgeBase.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.contentType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateNewItem = () => {
    // Validation
    if (!newItem.title || !newItem.content) {
      toast({
        title: "Campos obrigatórios",
        description: "O título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const newId = knowledgeBase.length > 0 ? Math.max(...knowledgeBase.map(item => item.id)) + 1 : 1;
    
    const createdItem: KnowledgeItem = {
      ...newItem,
      id: newId,
      dateCreated: currentDate,
      dateModified: currentDate
    };
    
    setKnowledgeBase([...knowledgeBase, createdItem]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewItem({
      title: "",
      description: "",
      contentType: "document",
      status: "draft",
      associatedAgents: [],
      content: ""
    });
    
    toast({
      title: "Item adicionado",
      description: "O novo item foi adicionado à base de conhecimento."
    });
  };

  const handleEditItem = (item: KnowledgeItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleViewItem = (item: KnowledgeItem) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const currentDate = new Date().toISOString().split("T")[0];
    
    setKnowledgeBase(knowledgeBase.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, dateModified: currentDate } 
        : item
    ));
    
    setIsDialogOpen(false);
    setEditingItem(null);
    
    toast({
      title: "Item atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const handleDeleteItem = (id: number) => {
    setKnowledgeBase(knowledgeBase.filter(item => item.id !== id));
    
    toast({
      title: "Item removido",
      description: "O item foi removido da base de conhecimento."
    });
  };

  const handleToggleItemStatus = (id: number, newStatus: "active" | "draft" | "archived") => {
    const currentDate = new Date().toISOString().split("T")[0];
    
    setKnowledgeBase(knowledgeBase.map(item => 
      item.id === id 
        ? { ...item, status: newStatus, dateModified: currentDate } 
        : item
    ));
    
    toast({
      title: "Status atualizado",
      description: `O status do item foi alterado para ${
        newStatus === "active" ? "ativo" : 
        newStatus === "draft" ? "rascunho" : "arquivado"
      }.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "archived":
        return <Badge variant="secondary">Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "document":
        return <BookText className="h-5 w-5 text-blue-500" />;
      case "faq":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case "guide":
        return <Book className="h-5 w-5 text-green-500" />;
      case "protocol":
        return <Check className="h-5 w-5 text-orange-500" />;
      default:
        return <BookText className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configuração da IA" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
              <p className="text-gray-600 mt-1">
                Gerencie os documentos e informações utilizadas pelos assistentes de IA
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingItem(null);
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Documento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Documento" : "Adicionar Novo Documento"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem 
                      ? "Modifique as informações do documento existente." 
                      : "Preencha os detalhes para adicionar um novo documento à base de conhecimento."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Título*</label>
                      <Input 
                        value={editingItem ? editingItem.title : newItem.title}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, title: e.target.value})
                          : setNewItem({...newItem, title: e.target.value})
                        }
                        placeholder="Título do documento"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input 
                      value={editingItem ? editingItem.description : newItem.description}
                      onChange={(e) => editingItem 
                        ? setEditingItem({...editingItem, description: e.target.value})
                        : setNewItem({...newItem, description: e.target.value})
                      }
                      placeholder="Breve descrição do conteúdo"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Conteúdo</label>
                      <Select
                        value={editingItem ? editingItem.contentType : newItem.contentType}
                        onValueChange={(value) => editingItem 
                          ? setEditingItem({...editingItem, contentType: value as any})
                          : setNewItem({...newItem, contentType: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Documento</SelectItem>
                          <SelectItem value="faq">Perguntas Frequentes</SelectItem>
                          <SelectItem value="guide">Guia</SelectItem>
                          <SelectItem value="protocol">Protocolo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <Select
                        value={editingItem ? editingItem.status : newItem.status}
                        onValueChange={(value) => editingItem 
                          ? setEditingItem({...editingItem, status: value as any})
                          : setNewItem({...newItem, status: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Associar Agentes</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os agentes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assistente-legacy">Assistente Legacy</SelectItem>
                        <SelectItem value="especialista-sucessao">Especialista em Sucessão</SelectItem>
                        <SelectItem value="consultor-esg">Consultor de ESG</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(editingItem ? editingItem.associatedAgents : newItem.associatedAgents).map((agent, index) => (
                        <Badge key={index} variant="secondary" className="py-1">
                          {agent}
                          <button 
                            className="ml-1 hover:text-red-500" 
                            onClick={() => {
                              if (editingItem) {
                                const newAgents = [...editingItem.associatedAgents];
                                newAgents.splice(index, 1);
                                setEditingItem({...editingItem, associatedAgents: newAgents});
                              } else {
                                const newAgents = [...newItem.associatedAgents];
                                newAgents.splice(index, 1);
                                setNewItem({...newItem, associatedAgents: newAgents});
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Conteúdo*</label>
                    <Textarea 
                      value={editingItem ? editingItem.content : newItem.content}
                      onChange={(e) => editingItem 
                        ? setEditingItem({...editingItem, content: e.target.value})
                        : setNewItem({...newItem, content: e.target.value})
                      }
                      placeholder="Conteúdo do documento (suporta formato Markdown)"
                      className="min-h-[300px] font-mono"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    if (!editingItem) {
                      setNewItem({
                        title: "",
                        description: "",
                        contentType: "document",
                        status: "draft",
                        associatedAgents: [],
                        content: ""
                      });
                    }
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={editingItem ? handleUpdateItem : handleCreateNewItem}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingItem ? "Salvar Alterações" : "Criar Documento"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              {viewingItem && (
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      {getContentTypeIcon(viewingItem.contentType)}
                      <DialogTitle>{viewingItem.title}</DialogTitle>
                    </div>
                    <DialogDescription>
                      {viewingItem.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getStatusBadge(viewingItem.status)}
                    <Badge variant="outline" className="text-gray-500">
                      Modificado: {viewingItem.dateModified}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap font-mono text-sm">
                    {viewingItem.content}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Agentes associados:</h4>
                    <div className="flex flex-wrap gap-1">
                      {viewingItem.associatedAgents.map((agent, index) => (
                        <Badge key={index} variant="secondary">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Fechar
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handleEditItem(viewingItem);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Busca</label>
                  <Input
                    placeholder="Buscar na base de conhecimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="draft">Rascunhos</SelectItem>
                      <SelectItem value="archived">Arquivados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo</label>
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="faq">Perguntas Frequentes</SelectItem>
                      <SelectItem value="guide">Guia</SelectItem>
                      <SelectItem value="protocol">Protocolo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Modificado</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id} className="cursor-pointer" onClick={() => handleViewItem(item)}>
                          <TableCell>
                            <div className="font-medium truncate max-w-xs">{item.title}</div>
                            <div className="text-gray-500 text-xs truncate max-w-xs">{item.description}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getContentTypeIcon(item.contentType)}
                              <span className="capitalize">
                                {item.contentType === "faq" ? "Perguntas Frequentes" : 
                                item.contentType === "document" ? "Documento" :
                                item.contentType === "guide" ? "Guia" : "Protocolo"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.dateModified}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              {item.status === "draft" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleItemStatus(item.id, "active")}
                                >
                                  Ativar
                                </Button>
                              ) : item.status === "active" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleItemStatus(item.id, "archived")}
                                >
                                  Arquivar
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleItemStatus(item.id, "active")}
                                >
                                  Restaurar
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditItem(item);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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
            
            <TabsContent value="cards" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:border-primary" onClick={() => handleViewItem(item)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getContentTypeIcon(item.contentType)}
                          <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <CardDescription className="truncate">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-700 line-clamp-3 h-16 overflow-hidden">
                        {item.content}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t flex justify-between">
                      <div className="text-xs text-gray-500">Modificado: {item.dateModified}</div>
                      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditItem(item);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;
