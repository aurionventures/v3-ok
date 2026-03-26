import React, { useState } from "react";
import { Bot, TrendingUp, AlertTriangle, CheckCircle2, Send, Sparkles, Vote, CalendarDays, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// Sample projects data
const projects = [{
  id: 1,
  title: "Expansão para Mercado Internacional",
  description: "Proposta de abertura de filial na Europa com investimento de R$ 50 milhões",
  submittedBy: "Carlos Silva",
  submissionDate: "15/05/2025",
  council: "Conselho de Administração",
  status: "Aguardando Análise",
  aiAnalysis: null,
  priority: "Alta",
  category: "Estratégia"
}, {
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
    recommendations: ["Incluir análise detalhada de due diligence", "Apresentar plano de integração das equipes", "Definir métricas de ROI para 24 meses"],
    historicalComparison: "Projetos similares tiveram 80% de aprovação nos últimos 2 anos"
  },
  priority: "Alta",
  category: "Investimento"
}, {
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
    recommendations: ["Excelente alinhamento com tendências do mercado", "Proposta bem estruturada e fundamentada"],
    historicalComparison: "Projetos ESG têm 90% de aprovação histórica"
  },
  priority: "Média",
  category: "ESG"
}];

// Sample voted projects history
const votedProjects = [{
  id: 101,
  title: "Modernização do Sistema ERP",
  description: "Atualização completa do sistema de gestão empresarial",
  submittedBy: "Roberto Silva",
  submissionDate: "10/02/2025",
  votingDate: "25/02/2025",
  council: "Conselho de Administração",
  status: "Aprovado",
  votes: {
    favor: 4,
    contra: 1,
    abstencoes: 0
  },
  priority: "Alta",
  category: "Tecnologia",
  result: "Aprovado por maioria"
}, {
  id: 102,
  title: "Expansão para Mercado Sul-Americano",
  description: "Abertura de escritório no Chile e Colômbia",
  submittedBy: "Laura Santos",
  submissionDate: "15/01/2025",
  votingDate: "30/01/2025",
  council: "Conselho de Administração",
  status: "Rejeitado",
  votes: {
    favor: 2,
    contra: 3,
    abstencoes: 0
  },
  priority: "Média",
  category: "Estratégia",
  result: "Rejeitado por maioria"
}, {
  id: 103,
  title: "Política de Home Office",
  description: "Implementação de política de trabalho remoto híbrido",
  submittedBy: "Carlos Silva",
  submissionDate: "20/01/2025",
  votingDate: "05/02/2025",
  council: "Conselho Consultivo",
  status: "Aprovado",
  votes: {
    favor: 3,
    contra: 0,
    abstencoes: 0
  },
  priority: "Baixa",
  category: "RH",
  result: "Aprovado por unanimidade"
}];
const SubmitProjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.orgRole === 'org_admin' || !user?.orgRole;
  const [searchTerm, setSearchTerm] = useState("");
  const [projectList, setProjectList] = useState(projects);
  const [votedProjectsList, setVotedProjectsList] = useState(votedProjects);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const filteredProjects = projectList.filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) || project.status.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVotedProjects = votedProjectsList.filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) || project.status.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleViewDetails = (item: any) => {
    setSelectedProject(item);
    setIsProjectModalOpen(true);
  };
  const handleSubmitProject = () => {
    toast({
      title: "Projeto submetido",
      description: "O projeto foi submetido para análise do conselho."
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
              approvalProbability: Math.floor(Math.random() * 40) + 60,
              // 60-100%
              riskLevel: ["Baixo", "Médio", "Alto"][Math.floor(Math.random() * 3)],
              recommendations: ["Incluir mais detalhes técnicos na proposta", "Adicionar análise de impacto financeiro detalhada", "Considerar cenários alternativos de implementação"],
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
        description: "A IA concluiu a análise do projeto."
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
              approvalProbability: Math.min(project.aiAnalysis?.approvalProbability + 10 || 70, 95),
              recommendations: ["Projeto foi aprimorado com informações adicionais", "Dados de mercado atualizados incluídos", "Análise de riscos mais detalhada incorporada"]
            }
          };
        }
        return project;
      });
      setProjectList(updatedProjects);
      setIsEnriching(false);
      toast({
        title: "Projeto enriquecido",
        description: "A IA enriqueceu o projeto com informações adicionais."
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
      description: "O projeto foi submetido para votação do conselho."
    });
  };
  const handleSendToDocuments = (projectId: number) => {
    const project = votedProjectsList.find(p => p.id === projectId);
    if (project) {
      toast({
        title: "Projeto enviado",
        description: `O projeto "${project.title}" foi enviado para a aba de documentação.`
      });
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Aguardando Análise": {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock
      },
      "Analisado por IA": {
        color: "bg-blue-100 text-blue-800",
        icon: Bot
      },
      "Enriquecido pela IA": {
        color: "bg-purple-100 text-purple-800",
        icon: Sparkles
      },
      "Submetido para Votação": {
        color: "bg-orange-100 text-orange-800",
        icon: Vote
      },
      "Aprovado": {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2
      },
      "Rejeitado": {
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle
      }
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: Clock
    };
    const Icon = config.icon;
    return <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>;
  };
  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      "Alta": "bg-red-100 text-red-800",
      "Média": "bg-yellow-100 text-yellow-800",
      "Baixa": "bg-green-100 text-green-800"
    };
    return <Badge className={priorityColors[priority] || "bg-gray-100 text-gray-800"}>
        {priority}
      </Badge>;
  };
  const getVoteResultIcon = (status: string) => {
    if (status === "Aprovado") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === "Rejeitado") return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-600" />;
  };
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Submeter Projetos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-legacy-500 mb-2">
                    Submeter Projetos
                  </h2>
                  <p className="text-gray-600">
                    Gerencie projetos para análise e votação dos conselhos
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  
                  <div className="relative">
                    <Input type="search" placeholder="Buscar projetos..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="projects">
                <TabsList className="mb-4">
                  <TabsTrigger value="projects">Projetos para Votação</TabsTrigger>
                  <TabsTrigger value="history">Histórico de Projetos</TabsTrigger>
                </TabsList>

                <TabsContent value="projects">
                  {isAdmin && (
                    <div className="flex justify-end mb-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Submeter Projeto
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Submeter Novo Projeto</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do projeto para análise do conselho.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Título do Projeto</label>
                            <Input placeholder="Ex: Expansão para novo mercado" />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Descrição</label>
                            <Textarea placeholder="Descrição detalhada do projeto..." rows={4} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Conselho</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar conselho" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Conselho de Administração</SelectItem>
                                  <SelectItem value="consultivo">Conselho Consultivo</SelectItem>
                                  <SelectItem value="sucessao">Comitê de Sucessão</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Prioridade</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="alta">Alta</SelectItem>
                                  <SelectItem value="media">Média</SelectItem>
                                  <SelectItem value="baixa">Baixa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Categoria</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="estrategia">Estratégia</SelectItem>
                                <SelectItem value="investimento">Investimento</SelectItem>
                                <SelectItem value="esg">ESG</SelectItem>
                                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                                <SelectItem value="rh">RH</SelectItem>
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
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Conselho</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Análise IA</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map(project => <TableRow key={project.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{project.title}</div>
                                <div className="text-sm text-gray-500">
                                  {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Submetido por {project.submittedBy} em {project.submissionDate}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{project.council}</TableCell>
                            <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>
                              {project.aiAnalysis ? <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Progress value={project.aiAnalysis.approvalProbability} className="w-16 h-2" />
                                    <span className="text-sm font-medium">{project.aiAnalysis.approvalProbability}%</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    Risco {project.aiAnalysis.riskLevel}
                                  </Badge>
                                </div> : <span className="text-sm text-gray-500">Não analisado</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(project)}>
                                  Ver Detalhes
                                </Button>
                                {isAdmin && project.status !== "Enriquecido pela IA" && <Button variant="outline" size="sm" onClick={() => handleEnrichProject(project.id)} disabled={isEnriching} className="flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    {isEnriching ? "Enriquecendo..." : "Enriquecer com IA"}
                                  </Button>}
                                {isAdmin && project.status !== "Submetido para Votação" && <Button size="sm" onClick={() => handleSubmitForVoting(project.id)} className="flex items-center gap-1">
                                    <Vote className="h-3 w-3" />
                                    Submeter Votação
                                  </Button>}
                              </div>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Conselho</TableHead>
                          <TableHead>Data Votação</TableHead>
                          <TableHead>Resultado</TableHead>
                          <TableHead>Votos</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVotedProjects.map(project => <TableRow key={project.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {getVoteResultIcon(project.status)}
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Submetido por {project.submittedBy}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{project.council}</TableCell>
                            <TableCell>{project.votingDate}</TableCell>
                            <TableCell>
                              <Badge className={project.status === "Aprovado" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {project.result}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-4">
                                  <span className="text-green-600">✓ {project.votes.favor}</span>
                                  <span className="text-red-600">✗ {project.votes.contra}</span>
                                  {project.votes.abstencoes > 0 && <span className="text-gray-600">⊘ {project.votes.abstencoes}</span>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(project)}>
                                  Ver Detalhes
                                </Button>
                                {isAdmin && project.status === "Aprovado" && <Button variant="outline" size="sm" onClick={() => handleSendToDocuments(project.id)} className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Enviar p/ Docs
                                  </Button>}
                              </div>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Project Details Modal */}
          <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedProject?.title}
                </DialogTitle>
                <DialogDescription>
                  Detalhes completos do projeto submetido para análise
                </DialogDescription>
              </DialogHeader>
              
              {selectedProject && <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Informações Básicas</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Conselho:</strong> {selectedProject.council}</p>
                        <p><strong>Submetido por:</strong> {selectedProject.submittedBy}</p>
                        <p><strong>Data:</strong> {selectedProject.submissionDate}</p>
                        <p><strong>Categoria:</strong> {selectedProject.category}</p>
                        <div className="flex items-center gap-2">
                          <strong>Prioridade:</strong>
                          {getPriorityBadge(selectedProject.priority)}
                        </div>
                        <div className="flex items-center gap-2">
                          <strong>Status:</strong>
                          {getStatusBadge(selectedProject.status)}
                        </div>
                      </div>
                    </div>
                    
                    {selectedProject.aiAnalysis && <div>
                        <h4 className="font-medium mb-2">Análise da IA</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">Probabilidade de Aprovação:</span>
                              <span className="text-sm font-bold text-primary">
                                {selectedProject.aiAnalysis.approvalProbability}%
                              </span>
                            </div>
                            <Progress value={selectedProject.aiAnalysis.approvalProbability} className="h-2" />
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">Nível de Risco: </span>
                            <Badge variant="outline">
                              {selectedProject.aiAnalysis.riskLevel}
                            </Badge>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600">
                              {selectedProject.aiAnalysis.historicalComparison}
                            </p>
                          </div>
                        </div>
                      </div>}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Descrição do Projeto</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  {selectedProject.aiAnalysis?.recommendations && <div>
                      <h4 className="font-medium mb-2">Recomendações da IA</h4>
                      <ul className="space-y-1">
                        {selectedProject.aiAnalysis.recommendations.map((rec, index) => <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {rec}
                          </li>)}
                      </ul>
                    </div>}
                  
                  {selectedProject.votes && <div>
                      <h4 className="font-medium mb-2">Resultado da Votação</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-6 mb-2">
                          <span className="text-green-600 font-medium">
                            ✓ A favor: {selectedProject.votes.favor}
                          </span>
                          <span className="text-red-600 font-medium">
                            ✗ Contra: {selectedProject.votes.contra}
                          </span>
                          {selectedProject.votes.abstencoes > 0 && <span className="text-gray-600 font-medium">
                              ⊘ Abstenções: {selectedProject.votes.abstencoes}
                            </span>}
                        </div>
                        <p className="text-sm text-gray-600">
                          <strong>Data da Votação:</strong> {selectedProject.votingDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Resultado:</strong> {selectedProject.result}
                        </p>
                      </div>
                    </div>}
                </div>}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>;
};
export default SubmitProjects;