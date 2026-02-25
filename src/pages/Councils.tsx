
import React, { useState } from "react";
import { Users, Plus, Search, FileText, Bot, TrendingUp, AlertTriangle, CheckCircle2, Send, Sparkles, Vote, Building2, Trash2, ChevronDown, Pencil } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Configuração de Governança - Conselhos
const governanceConselhos = [
  { id: 1, name: "Conselho de Administração", description: "Conselho responsável pela gestão estratégica da empresa", tipo: "administrativo", quorum: 3, nivel: "Estratégico", membros: 4 },
  { id: 2, name: "Conselho Fiscal", description: "Conselho de fiscalização contábil e financeira", tipo: "fiscal", quorum: 3, nivel: "Estratégico", membros: 3 },
  { id: 3, name: "Conselho Consultivo", description: "Conselho de especialistas externos para orientação estratégica", tipo: "consultivo", quorum: 5, nivel: "Estratégico", membros: 5 },
];

// Configuração de Governança - Comitês
const governanceComites = [
  { id: 1, name: "Comitê de Auditoria", description: "Supervisão de processos de auditoria interna e externa", tipo: "auditoria", quorum: 3, nivel: "Tático", membros: 4 },
  { id: 2, name: "Comitê de Estratégia", description: "Definição e acompanhamento do planejamento estratégico", tipo: "estrategia", quorum: 4, nivel: "Tático", membros: 5 },
  { id: 3, name: "Comitê de Riscos", description: "Gestão e mitigação de riscos corporativos", tipo: "outros", quorum: 3, nivel: "Tático", membros: 3 },
];

// Configuração de Governança - Comissões
const governanceComissoes = [
  { id: 1, name: "Comissão de Ética", description: "Análise de questões éticas e compliance corporativo", tipo: "outros", quorum: 3, nivel: "Operacional", membros: 4 },
  { id: 2, name: "Comissão de Inovação", description: "Avaliação de projetos de inovação e transformação digital", tipo: "outros", quorum: 4, nivel: "Operacional", membros: 4 },
  { id: 3, name: "Comissão de Sustentabilidade", description: "Iniciativas ESG e sustentabilidade empresarial", tipo: "outros", quorum: 3, nivel: "Operacional", membros: 3 },
];

// Sample councils data (legacy)
const councils = [
  { id: 1, name: "Conselho de Administração", type: "Estatutário", members: 5, nextMeeting: "24/05/2025" },
  { id: 2, name: "Conselho Consultivo", type: "Não estatutário", members: 3, nextMeeting: "10/06/2025" },
  { id: 3, name: "Comitê de Sucessão", type: "Temporário", members: 4, nextMeeting: "15/06/2025" },
];

// Sample council members data
const councilMembers = [
  {
    id: 1,
    name: "José Silva",
    council: "Conselho de Administração",
    role: "Presidente",
    startDate: "01/01/2024",
    endDate: "31/12/2026",
  },
  {
    id: 2,
    name: "Maria Silva",
    council: "Conselho de Administração",
    role: "Conselheira",
    startDate: "01/01/2024",
    endDate: "31/12/2026",
  },
  {
    id: 3,
    name: "Roberto Mendes",
    council: "Conselho de Administração",
    role: "Conselheiro Externo",
    startDate: "01/01/2024",
    endDate: "31/12/2026",
  },
  {
    id: 4,
    name: "Ana Paula Costa",
    council: "Conselho de Administração",
    role: "Conselheira Externa",
    startDate: "01/01/2024",
    endDate: "31/12/2026",
  },
  {
    id: 5,
    name: "Carlos Silva",
    council: "Conselho de Administração",
    role: "Conselheiro",
    startDate: "01/01/2024",
    endDate: "31/12/2026",
  },
  {
    id: 6,
    name: "João Mendonça",
    council: "Conselho Consultivo",
    role: "Conselheiro Externo",
    startDate: "01/03/2024",
    endDate: "28/02/2026",
  },
];

// Sample meetings data
const meetings = [
  {
    id: 1,
    council: "Conselho de Administração",
    date: "24/05/2025",
    time: "14:00",
    type: "Ordinária",
    status: "Agendada",
  },
  {
    id: 2,
    council: "Conselho Consultivo",
    date: "10/06/2025",
    time: "10:00",
    type: "Ordinária",
    status: "Agendada",
  },
  {
    id: 3,
    council: "Comitê de Sucessão",
    date: "15/06/2025",
    time: "15:00",
    type: "Extraordinária",
    status: "Agendada",
  },
  {
    id: 4,
    council: "Conselho de Administração",
    date: "24/04/2025",
    time: "14:00",
    type: "Ordinária",
    status: "Realizada",
  },
  {
    id: 5,
    council: "Conselho Consultivo",
    date: "10/04/2025",
    time: "10:00",
    type: "Ordinária",
    status: "Realizada",
  },
];

// Sample projects data
const projects = [
  {
    id: 1,
    title: "Expansão para Mercado Internacional",
    description: "Proposta de abertura de filial na Europa com investimento de R$ 50 milhões",
    submittedBy: "Carlos Silva",
    submissionDate: "15/05/2025",
    council: "Conselho de Administração",
    status: "Aguardando Análise",
    aiAnalysis: null,
    priority: "Alta",
    category: "Estratégia",
  },
  {
    id: 2,
    title: "Aquisição da TechStart Ltd",
    description: "Proposta de aquisição de startup de tecnologia por R$ 25 milhões",
    submittedBy: "Ana Silva",
    submissionDate: "10/05/2025",
    council: "Conselho de Administração",
    status: "Analisado por IA",
    aiAnalysis: {
      approvalProbability: 75,
      riskLevel: "Médio",
      recommendations: [
        "Incluir análise detalhada de due diligence",
        "Apresentar plano de integração das equipes",
        "Definir métricas de ROI para 24 meses"
      ],
      historicalComparison: "Projetos similares tiveram 80% de aprovação nos últimos 2 anos"
    },
    priority: "Alta",
    category: "Investimento",
  },
  {
    id: 3,
    title: "Programa de Sustentabilidade ESG",
    description: "Implementação de programa ESG com metas para 2030",
    submittedBy: "Maria Silva",
    submissionDate: "08/05/2025",
    council: "Conselho Consultivo",
    status: "Aprovado",
    aiAnalysis: {
      approvalProbability: 95,
      riskLevel: "Baixo",
      recommendations: [
        "Excelente alinhamento com tendências do mercado",
        "Proposta bem estruturada e fundamentada"
      ],
      historicalComparison: "Projetos ESG têm 90% de aprovação histórica"
    },
    priority: "Média",
    category: "ESG",
  },
];

// Sample voted projects history
const votedProjects = [
  {
    id: 101,
    title: "Modernização do Sistema ERP",
    description: "Atualização completa do sistema de gestão empresarial",
    submittedBy: "Roberto Silva",
    submissionDate: "10/02/2025",
    votingDate: "25/02/2025",
    council: "Conselho de Administração",
    status: "Aprovado",
    votes: { favor: 4, contra: 1, abstencoes: 0 },
    priority: "Alta",
    category: "Tecnologia",
    result: "Aprovado por maioria",
  },
  {
    id: 102,
    title: "Expansão para Mercado Sul-Americano",
    description: "Abertura de escritório no Chile e Colômbia",
    submittedBy: "Laura Santos",
    submissionDate: "15/01/2025",
    votingDate: "30/01/2025",
    council: "Conselho de Administração",
    status: "Rejeitado",
    votes: { favor: 2, contra: 3, abstencoes: 0 },
    priority: "Média",
    category: "Estratégia",
    result: "Rejeitado por maioria",
  },
  {
    id: 103,
    title: "Política de Home Office",
    description: "Implementação de política de trabalho remoto híbrido",
    submittedBy: "Carlos Silva",
    submissionDate: "20/01/2025",
    votingDate: "05/02/2025",
    council: "Conselho Consultivo",
    status: "Aprovado",
    votes: { favor: 3, contra: 0, abstencoes: 0 },
    priority: "Baixa",
    category: "RH",
    result: "Aprovado por unanimidade",
  },
];

const Councils = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectList, setProjectList] = useState(projects);
  const [votedProjectsList, setVotedProjectsList] = useState(votedProjects);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const filteredCouncils = councils.filter(
    (council) =>
      council.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      council.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = councilMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.council.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.council.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projectList.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVotedProjects = votedProjectsList.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAddCouncil = () => {
    toast({
      title: "Conselho adicionado",
      description: "O novo conselho foi criado com sucesso.",
    });
  };

  const handleAddMember = () => {
    toast({
      title: "Conselheiro adicionado",
      description: "O novo conselheiro foi adicionado com sucesso.",
    });
  };

  const handleViewDetails = (item: any, type: string) => {
    if (type === "projeto") {
      setSelectedProject(item);
      setIsProjectModalOpen(true);
    } else {
      toast({
        title: `Detalhes de ${type}`,
        description: `Visualizando informações de ${
          type === "conselho" ? item.name : item.council || item.name || item.title
        }`,
      });
    }
  };

  const handleSubmitProject = () => {
    toast({
      title: "Projeto submetido",
      description: "O projeto foi submetido para análise do conselho.",
    });
  };

  const handleAnalyzeWithAI = async (projectId: number) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const updatedProjects = projectList.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            status: "Analisado por IA",
            aiAnalysis: {
              approvalProbability: Math.floor(Math.random() * 40) + 60, // 60-100%
              riskLevel: ["Baixo", "Médio", "Alto"][Math.floor(Math.random() * 3)],
              recommendations: [
                "Incluir mais detalhes técnicos na proposta",
                "Adicionar análise de impacto financeiro detalhada",
                "Considerar cenários alternativos de implementação"
              ],
              historicalComparison: "Projetos similares tiveram 78% de aprovação nos últimos anos"
            }
          };
        }
        return project;
      });
      
      setProjectList(updatedProjects);
      setIsAnalyzing(false);
      
      toast({
        title: "Análise concluída",
        description: "A IA concluiu a análise do projeto.",
      });
    }, 3000);
  };

  const handleEnrichProject = async (projectId: number) => {
    setIsEnriching(true);
    
    // Simulate AI enrichment
    setTimeout(() => {
      const updatedProjects = projectList.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            status: "Enriquecido pela IA",
            description: project.description + " - Projeto enriquecido com dados de mercado, análise de viabilidade técnica e projeções financeiras detalhadas.",
            aiAnalysis: {
              ...project.aiAnalysis,
              approvalProbability: Math.min(project.aiAnalysis.approvalProbability + 10, 95),
              recommendations: [
                "Projeto foi aprimorado com informações adicionais",
                "Dados de mercado atualizados incluídos",
                "Análise de riscos mais detalhada incorporada"
              ]
            }
          };
        }
        return project;
      });
      
      setProjectList(updatedProjects);
      setIsEnriching(false);
      
      toast({
        title: "Projeto enriquecido",
        description: "A IA enriqueceu o projeto com informações adicionais.",
      });
    }, 2500);
  };

  const handleSubmitForVoting = (projectId: number) => {
    const updatedProjects = projectList.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          status: "Submetido para Votação"
        };
      }
      return project;
    });
    
    setProjectList(updatedProjects);
    
    toast({
      title: "Projeto submetido",
      description: "O projeto foi submetido para votação do conselho.",
    });
  };

  const handleSendToDocuments = (projectId: number) => {
    const project = votedProjectsList.find(p => p.id === projectId);
    if (project) {
      toast({
        title: "Projeto enviado",
        description: `O projeto "${project.title}" foi enviado para a aba de documentação.`,
      });
    }
  };

  type GovernanceItem = { id: number; name: string; description: string; tipo: string; quorum: number; nivel: string; membros: number };
  function GovernanceCard({ item, icon, onDelete }: { item: GovernanceItem; icon: React.ReactNode; onDelete: () => void }) {
    const [docOpen, setDocOpen] = useState(false);
    return (
      <Card className="rounded-lg border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {icon}
                <h3 className="font-semibold text-base">{item.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">Tipo: {item.tipo}</span>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">Quórum: {item.quorum}</span>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">Nível: {item.nivel}</span>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">Membros: {item.membros}</span>
              </div>
              <Collapsible open={docOpen} onOpenChange={setDocOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <FileText className="h-4 w-4" />
                  Documentos (0)
                  <ChevronDown className={`h-4 w-4 transition-transform ${docOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-muted-foreground">Nenhum documento anexado.</CollapsibleContent>
              </Collapsible>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Conselhos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Configuração de Governança
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie conselhos, comitês e comissões da sua empresa
                </p>
              </div>

              <Tabs defaultValue="councils">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                    <TabsTrigger value="councils" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                      <Building2 className="mr-2 h-4 w-4" /> Conselhos
                    </TabsTrigger>
                    <TabsTrigger value="comites">
                      <Users className="mr-2 h-4 w-4" /> Comitês
                    </TabsTrigger>
                    <TabsTrigger value="comissoes">
                      <Users className="mr-2 h-4 w-4" /> Comissões
                    </TabsTrigger>
                    <TabsTrigger value="members">
                      <Users className="mr-2 h-4 w-4" /> Membros
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="councils">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Criar Conselho</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Conselho</DialogTitle>
                          <DialogDescription>Preencha as informações do novo conselho</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="councilName" className="text-right">Nome</label>
                            <Input id="councilName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="councilType" className="text-right">Tipo</label>
                            <Input id="councilType" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="description" className="text-right">Descrição</label>
                            <Input id="description" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCouncil}>Criar Conselho</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-4">
                    {governanceConselhos.map((item) => (
                      <GovernanceCard key={item.id} item={item} icon={<Building2 className="h-5 w-5" />} onDelete={() => toast({ title: "Conselho removido" })} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comites">
                  <div className="flex justify-end mb-4">
                    <Button><Plus className="mr-2 h-4 w-4" /> Criar Comitê</Button>
                  </div>
                  <div className="space-y-4">
                    {governanceComites.map((item) => (
                      <GovernanceCard key={item.id} item={item} icon={<Users className="h-5 w-5" />} onDelete={() => toast({ title: "Comitê removido" })} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comissoes">
                  <div className="flex justify-end mb-4">
                    <Button><Plus className="mr-2 h-4 w-4" /> Criar Comissão</Button>
                  </div>
                  <div className="space-y-4">
                    {governanceComissoes.map((item) => (
                      <GovernanceCard key={item.id} item={item} icon={<Users className="h-5 w-5" />} onDelete={() => toast({ title: "Comissão removida" })} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="members">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="relative w-full sm:max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar por nome ou cargo..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="shrink-0"><Plus className="mr-2 h-4 w-4" /> Criar Membro</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Membro</DialogTitle>
                          <DialogDescription>Preencha as informações do novo membro</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="memberName" className="text-right">Nome</label>
                            <Input id="memberName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="memberRole" className="text-right">Cargo Principal</label>
                            <Input id="memberRole" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="startDate" className="text-right">Data de Início</label>
                            <Input id="startDate" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddMember}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-lg font-semibold mb-4">{filteredMembers.length} Membros</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Cargo Principal</TableHead>
                        <TableHead>Órgãos Alocados</TableHead>
                        <TableHead>Data de Início</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.council || "Não alocado"}</TableCell>
                          <TableCell>{member.startDate}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">Ativo</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => handleViewDetails(member, "conselheiro")}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Alocar" onClick={() => toast({ title: "Alocar membro" })}>
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="Excluir" onClick={() => toast({ title: "Membro removido" })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="projects" className="hidden">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Send className="mr-2 h-4 w-4" /> Submeter Projeto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Submeter Projeto para Votação</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do projeto que será submetido ao conselho
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="projectTitle" className="text-right">
                              Título
                            </label>
                            <Input id="projectTitle" className="col-span-3" placeholder="Título do projeto" />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <label htmlFor="projectDescription" className="text-right pt-2">
                              Descrição
                            </label>
                            <Textarea 
                              id="projectDescription" 
                              className="col-span-3 h-24" 
                              placeholder="Descreva detalhadamente o projeto..."
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="projectCouncil" className="text-right">
                              Conselho
                            </label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o conselho" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Conselho de Administração</SelectItem>
                                <SelectItem value="consultivo">Conselho Consultivo</SelectItem>
                                <SelectItem value="sucessao">Comitê de Sucessão</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="projectPriority" className="text-right">
                              Prioridade
                            </label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a prioridade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alta">Alta</SelectItem>
                                <SelectItem value="media">Média</SelectItem>
                                <SelectItem value="baixa">Baixa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="projectCategory" className="text-right">
                              Categoria
                            </label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="estrategia">Estratégia</SelectItem>
                                <SelectItem value="investimento">Investimento</SelectItem>
                                <SelectItem value="esg">ESG</SelectItem>
                                <SelectItem value="rh">Recursos Humanos</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="operacional">Operacional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSubmitProject}>Submeter Projeto</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="bg-white p-6 rounded-lg border">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{project.title}</h3>
                              <Badge variant={project.priority === "Alta" ? "destructive" : project.priority === "Média" ? "default" : "secondary"}>
                                {project.priority}
                              </Badge>
                              <Badge variant="outline">{project.category}</Badge>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Submetido por:</span>
                                <br />
                                {project.submittedBy}
                              </div>
                              <div>
                                <span className="font-medium">Data:</span>
                                <br />
                                {project.submissionDate}
                              </div>
                              <div>
                                <span className="font-medium">Conselho:</span>
                                <br />
                                {project.council}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <br />
                                <Badge variant={
                                  project.status === "Aprovado" ? "default" :
                                  project.status === "Rejeitado" ? "destructive" :
                                  project.status === "Analisado por IA" ? "secondary" : "outline"
                                }>
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-4">
                            {project.status === "Aguardando Análise" && (
                              <Button
                                onClick={() => handleAnalyzeWithAI(project.id)}
                                disabled={isAnalyzing}
                                size="sm"
                                variant="outline"
                              >
                                <Bot className="mr-2 h-4 w-4" />
                                {isAnalyzing ? "Analisando..." : "Analisar com IA"}
                              </Button>
                            )}
                            {(project.status === "Analisado por IA" || project.status === "Enriquecido pela IA") && (
                              <>
                                {project.status === "Analisado por IA" && (
                                  <Button
                                    onClick={() => handleEnrichProject(project.id)}
                                    disabled={isEnriching}
                                    size="sm"
                                    variant="default"
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {isEnriching ? "Enriquecendo..." : "Atualizar e enriquecer o projeto com IA"}
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleSubmitForVoting(project.id)}
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Vote className="mr-2 h-4 w-4" />
                                  Submeter para Votação
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(project, "projeto")}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>

                        {project.aiAnalysis && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-2 mb-3">
                              <Bot className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-900">Análise da IA</h4>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">Probabilidade de Aprovação</span>
                                    <span className="text-sm font-bold">{project.aiAnalysis.approvalProbability}%</span>
                                  </div>
                                  <Progress 
                                    value={project.aiAnalysis.approvalProbability} 
                                    className={`h-2 ${
                                      project.aiAnalysis.approvalProbability >= 80 ? "text-green-600" :
                                      project.aiAnalysis.approvalProbability >= 60 ? "text-yellow-600" : "text-red-600"
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  {project.aiAnalysis.riskLevel === "Baixo" ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : project.aiAnalysis.riskLevel === "Médio" ? (
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm">
                                    Nível de Risco: <strong>{project.aiAnalysis.riskLevel}</strong>
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">Comparação Histórica</span>
                                </div>
                                <p className="text-sm text-gray-700">{project.aiAnalysis.historicalComparison}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium mb-2">Recomendações para Melhorar a Aprovação:</h5>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {project.aiAnalysis.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {filteredProjects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum projeto encontrado.</p>
                        <p className="text-sm">Submeta um novo projeto para votação do conselho.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Documentos dos Conselhos</h3>
                      <FileUpload 
                        label="Fazer upload de documentos de conselhos" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Atas de Reuniões</h3>
                      <FileUpload 
                        label="Fazer upload de atas" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Contratos de Conselheiros</h3>
                      <FileUpload 
                        label="Fazer upload de contratos" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Histórico de Projetos Votados</h3>
                      <div className="text-sm text-gray-500">
                        {filteredVotedProjects.length} projeto(s) encontrado(s)
                      </div>
                    </div>
                    
                    {filteredVotedProjects.map((project) => (
                      <Card key={project.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">{project.title}</h4>
                              <Badge variant={project.status === "Aprovado" ? "default" : "destructive"}>
                                {project.status}
                              </Badge>
                              <Badge variant="outline">{project.category}</Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{project.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Submetido por:</span> {project.submittedBy}
                              </div>
                              <div>
                                <span className="font-medium">Data da Votação:</span> {project.votingDate}
                              </div>
                              <div>
                                <span className="font-medium">Conselho:</span> {project.council}
                              </div>
                            </div>
                            
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">Resultado da Votação:</span>
                                <span className="text-sm text-gray-600">{project.result}</span>
                              </div>
                              <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-green-600">
                                  <strong>A favor:</strong> {project.votes.favor}
                                </span>
                                <span className="text-red-600">
                                  <strong>Contra:</strong> {project.votes.contra}
                                </span>
                                <span className="text-gray-600">
                                  <strong>Abstenções:</strong> {project.votes.abstencoes}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(project, "projeto")}
                            >
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleSendToDocuments(project.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Enviar para Documentos
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {filteredVotedProjects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum projeto votado encontrado</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Modal de Detalhes do Projeto */}
          <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalhes do Projeto</DialogTitle>
                <DialogDescription>
                  Informações completas do projeto submetido
                </DialogDescription>
              </DialogHeader>
              
              {selectedProject && (
                <div className="space-y-6">
                  {/* Cabeçalho do Projeto */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant={selectedProject.priority === "Alta" ? "destructive" : selectedProject.priority === "Média" ? "default" : "secondary"}>
                          {selectedProject.priority}
                        </Badge>
                        <Badge variant="outline">{selectedProject.category}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Informações Gerais */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Informações de Submissão</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Submetido por:</span>
                          <span>{selectedProject.submittedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Data de Submissão:</span>
                          <span>{selectedProject.submissionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Conselho:</span>
                          <span>{selectedProject.council}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge variant={
                            selectedProject.status === "Aprovado" ? "default" :
                            selectedProject.status === "Rejeitado" ? "destructive" :
                            selectedProject.status === "Analisado por IA" ? "secondary" : 
                            selectedProject.status === "Enriquecido pela IA" ? "secondary" :
                            selectedProject.status === "Submetido para Votação" ? "default" : "outline"
                          }>
                            {selectedProject.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Timeline de Status */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Timeline do Projeto</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Projeto submetido - {selectedProject.submissionDate}</span>
                        </div>
                        {selectedProject.status !== "Aguardando Análise" && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Análise por IA concluída</span>
                          </div>
                        )}
                        {selectedProject.status === "Enriquecido pela IA" && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Projeto enriquecido pela IA</span>
                          </div>
                        )}
                        {selectedProject.status === "Submetido para Votação" && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <span>Submetido para votação</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Análise da IA */}
                  {selectedProject.aiAnalysis && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Bot className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Análise Detalhada da IA</h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Probabilidade de Aprovação</span>
                              <span className="text-lg font-bold text-blue-600">{selectedProject.aiAnalysis.approvalProbability}%</span>
                            </div>
                            <Progress 
                              value={selectedProject.aiAnalysis.approvalProbability} 
                              className="h-3"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {selectedProject.aiAnalysis.riskLevel === "Baixo" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : selectedProject.aiAnalysis.riskLevel === "Médio" ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            <span>
                              Nível de Risco: <strong>{selectedProject.aiAnalysis.riskLevel}</strong>
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Comparação Histórica</span>
                          </div>
                          <p className="text-sm text-gray-700">{selectedProject.aiAnalysis.historicalComparison}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Recomendações:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {selectedProject.aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>
                  Fechar
                </Button>
                {selectedProject && selectedProject.status === "Aguardando Análise" && (
                  <Button 
                    onClick={() => {
                      handleAnalyzeWithAI(selectedProject.id);
                      setIsProjectModalOpen(false);
                    }}
                    disabled={isAnalyzing}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    {isAnalyzing ? "Analisando..." : "Analisar com IA"}
                  </Button>
                )}
                {selectedProject && (selectedProject.status === "Analisado por IA" || selectedProject.status === "Enriquecido pela IA") && (
                  <>
                    {selectedProject.status === "Analisado por IA" && (
                      <Button 
                        onClick={() => {
                          handleEnrichProject(selectedProject.id);
                          setIsProjectModalOpen(false);
                        }}
                        disabled={isEnriching}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isEnriching ? "Enriquecendo..." : "Enriquecer Projeto"}
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        handleSubmitForVoting(selectedProject.id);
                        setIsProjectModalOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      Submeter para Votação
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Councils;
