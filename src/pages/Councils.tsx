
import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Calendar, FileText, Bot, TrendingUp, AlertTriangle, CheckCircle2, Send, Sparkles, Vote, ChevronDown, Settings, Clock, MapPin, List, Copy } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCouncils } from "@/hooks/useCouncils";
import {useCouncilMembers } from "@/hooks/useCouncilMembers";
import { useMeetings } from "@/hooks/useMeetings";
import { useDocuments } from "@/hooks/useDocuments";
import CouncilReminderConfig from "@/components/councils/CouncilReminderConfig";
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
import CouncilDocumentUpload from "@/components/ui/CouncilDocumentUpload";
import { DocumentType } from "@/types/document";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [newCouncil, setNewCouncil] = useState({
    name: "",
    type: "",
    description: ""
  });
  const [newMember, setNewMember] = useState({
    council_id: "",
    name: "",
    role: "",
    start_date: "",
    end_date: ""
  });
  const [membersCount, setMembersCount] = useState<Record<string, number>>({});
  const [nextMeetings, setNextMeetings] = useState<Record<string, any>>({});
  const [meetingsCount, setMeetingsCount] = useState<Record<string, number>>({});
  const [selectedCouncilId, setSelectedCouncilId] = useState<string>("");
  
  // Estados para o formulário de reunião
  const [meetingForm, setMeetingForm] = useState({
    council_id: "",
    title: "",
    date: "",
    time: "",
    type: "",
    location: "",
    agenda: ""
  });

  // Usar o hook de conselhos
  const { councils, loading, createCouncil } = useCouncils();
  
  // Usar o hook de conselheiros
  const { 
    members: councilMembers, 
    loading: membersLoading, 
    addCouncilMember,
    fetchCompanyCouncils,
    getMembersCountByCouncil,
    fetchAllCompanyMembers
  } = useCouncilMembers();

  // Usar o hook de reuniões
  const { 
    meetings: realMeetings, 
    loading: meetingsLoading, 
    createMeeting, 
    loading: creatingMeeting,
    fetchMeetings,
    getNextMeetingByCouncil,
    getMeetingsCountByCouncil,
    updateMeeting
  } = useMeetings();

  // Usar o hook de documentos
  const { 
    documents, 
    loading: documentsLoading, 
    fetchDocuments,
    deleteDocument,
    getDownloadUrl
  } = useDocuments();

  // Função para carregar contagem de membros quando necessário
  const loadMembersCount = async () => {
    if (councils.length > 0) {
      const counts: Record<string, number> = {};
      for (const council of councils) {
        const count = await getMembersCountByCouncil(council.id);
        counts[council.id] = count;
      }
      setMembersCount(counts);
    }
  };

  // Função para carregar próximas reuniões de todos os conselhos
  const loadNextMeetings = async () => {
    if (councils.length > 0) {
      const meetings: Record<string, any> = {};
      for (const council of councils) {
        const nextMeeting = await getNextMeetingByCouncil(council.id);
        meetings[council.id] = nextMeeting;
      }
      setNextMeetings(meetings);
    }
  };

  // Função para carregar contagem de reuniões de todos os conselhos
  const loadMeetingsCount = async () => {
    if (councils.length > 0) {
      const counts: Record<string, number> = {};
      for (const council of councils) {
        const count = await getMeetingsCountByCouncil(council.id);
        counts[council.id] = count;
      }
      setMeetingsCount(counts);
    }
  };

  const filteredCouncils = councils.filter(
    (council) =>
      council.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (council.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (council.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  console.log('🔍 Conselhos filtrados:', filteredCouncils)

  // Converter dados reais para formato de exibição
  const allMembers = councilMembers.map(member => ({
    id: member.id,
    name: member.name,
    council: councils.find(c => c.id === member.council_id)?.name || 'Conselho não encontrado',
    role: member.role,
    startDate: member.start_date,
    endDate: member.end_date
  }));

  const filteredMembers = allMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.council.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredMeetings = realMeetings.filter((meeting) => {
    // Buscar o nome do conselho
    const council = councils.find(c => c.id === meeting.council_id);
    const councilName = council?.name || '';
    
    return (
      councilName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  // Carregar dados quando os conselhos forem carregados
  useEffect(() => {
    if (councils.length > 0) {
      // Carregar dados em paralelo para melhor performance
      Promise.all([
        loadMembersCount(),
        loadNextMeetings(),
        loadMeetingsCount()
      ]);
    }
  }, [councils]);

  // Carregar documentos quando um conselho for selecionado
  useEffect(() => {
    if (selectedCouncilId) {
      fetchDocuments({ council_id: selectedCouncilId });
    }
  }, [selectedCouncilId, fetchDocuments]);
  const handleAddCouncil = async () => {
    try {
      if (!newCouncil.name.trim()) {
        toast({
          title: "Erro",
          description: "Nome do conselho é obrigatório",
          variant: "destructive"
        });
        return;
      }

      await createCouncil({
        name: newCouncil.name,
        type: newCouncil.type || null,
        description: newCouncil.description || null
        // company_id removido - não é mais obrigatório
      });

      // Limpar formulário
      setNewCouncil({
        name: "",
        type: "",
        description: ""
      });

      // Fechar modal
      setIsCreateModalOpen(false);

      toast({
        title: "Sucesso",
        description: "Conselho criado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar conselho:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conselho. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAddMember = async () => {
    try {
      if (!newMember.council_id || !newMember.name || !newMember.role || !newMember.start_date) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }

      await addCouncilMember({
        council_id: newMember.council_id,
        name: newMember.name,
        role: newMember.role,
        start_date: newMember.start_date,
        end_date: newMember.end_date || undefined
      });

      // Limpar formulário
      setNewMember({
        council_id: "",
        name: "",
        role: "",
        start_date: "",
        end_date: ""
      });

      // Fechar modal
      setIsAddMemberModalOpen(false);

      // Recarregar todos os conselheiros e contagem de membros
      await fetchAllCompanyMembers();
      const newCount = await getMembersCountByCouncil(newMember.council_id);
      setMembersCount(prev => ({
        ...prev,
        [newMember.council_id]: newCount
      }));

      toast({
        title: "Sucesso",
        description: "Conselheiro adicionado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao adicionar conselheiro:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar conselheiro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAddMeeting = async () => {
    try {
      // Validar se todos os campos obrigatórios estão preenchidos
      if (!meetingForm.council_id || !meetingForm.title || !meetingForm.date || !meetingForm.time || !meetingForm.type) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      await createMeeting({
        council_id: meetingForm.council_id,
        title: meetingForm.title,
        date: meetingForm.date,
        time: meetingForm.time,
        type: meetingForm.type as 'Ordinária' | 'Extraordinária',
        location: meetingForm.location || undefined,
        agenda: meetingForm.agenda || undefined
      });

      toast({
        title: "Reunião agendada",
        description: "A nova reunião foi agendada com sucesso.",
      });

      // Recarregar a lista de reuniões e próximas reuniões
      await fetchMeetings();
      await loadNextMeetings();
      await loadMeetingsCount();

      // Limpar o formulário
      setMeetingForm({
        council_id: "",
        title: "",
        date: "",
        time: "",
        type: "",
        location: "",
        agenda: ""
      });
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar reunião. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMeetingStatus = async (meetingId: string, newStatus: 'Agendada' | 'Realizada' | 'Cancelada') => {
    try {
      const statusMap = { 'Agendada': 'AGENDADA', 'Realizada': 'CONCLUIDA', 'Cancelada': 'CANCELADA' } as const;
      await updateMeeting(meetingId, { status: statusMap[newStatus] });
      
      toast({
        title: "Status atualizado",
        description: `Reunião marcada como ${newStatus.toLowerCase()}.`,
      });

      // Recarregar a lista de reuniões
      await fetchMeetings();
      await loadNextMeetings();
      await loadMeetingsCount();
    } catch (error) {
      console.error('Erro ao atualizar status da reunião:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da reunião. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (item: any, type: string) => {
    if (type === "projeto") {
      setSelectedProject(item);
      setIsProjectModalOpen(true);
    } else if (type === "reunião") {
      setSelectedMeeting(item);
      setIsMeetingModalOpen(true);
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Conselhos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Conselhos e Comitês
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="councils">
                <TabsList className="mb-4">
                  <TabsTrigger value="councils">Conselhos</TabsTrigger>
                  <TabsTrigger value="members">Conselheiros</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="councils">
                  <div className="flex justify-end mb-4">
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Novo Conselho
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Conselho</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do novo conselho ou comitê
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="councilName" className="text-right">
                              Nome
                            </label>
                            <Input 
                              id="councilName" 
                              className="col-span-3"
                              value={newCouncil.name}
                              onChange={(e) => setNewCouncil({...newCouncil, name: e.target.value})}
                              placeholder="Nome do conselho"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="councilType" className="text-right">
                              Tipo
                            </label>
                            <Input 
                              id="councilType" 
                              className="col-span-3"
                              value={newCouncil.type}
                              onChange={(e) => setNewCouncil({...newCouncil, type: e.target.value})}
                              placeholder="Tipo do conselho"
                            />
                          </div>
                                                     <div className="grid grid-cols-4 items-start gap-4">
                             <label htmlFor="description" className="text-right pt-2">
                               Descrição
                             </label>
                             <Textarea 
                               id="description" 
                               className="col-span-3 h-24"
                               value={newCouncil.description}
                               onChange={(e) => setNewCouncil({...newCouncil, description: e.target.value})}
                               placeholder="Descrição do conselho"
                             />
                           </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCouncil} disabled={loading}>
                            {loading ? "Criando..." : "Criar Conselho"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legacy-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Carregando conselhos...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Membros</TableHead>
                          <TableHead>Reuniões</TableHead>
                          <TableHead>Próxima Reunião</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCouncils.length > 0 ? (
                          filteredCouncils.map((council) => (
                            <TableRow
                              key={council.id}
                              className="cursor-pointer"
                              onClick={() => handleViewDetails(council, "conselho")}
                            >
                              <TableCell className="font-medium">{council.name}</TableCell>
                              <TableCell>{council.type || "-"}</TableCell>
                              <TableCell>{membersCount[council.id] || 0}</TableCell>
                              <TableCell>{meetingsCount[council.id] || 0}</TableCell>
                              <TableCell>
                                {nextMeetings[council.id] ? (
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      {new Date(nextMeetings[council.id].date).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="text-gray-500">
                                      {nextMeetings[council.id].time || '--:--'}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(council, "conselho");
                                  }}
                                >
                                  Ver Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              Nenhum conselho encontrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="members">
                  <div className="flex justify-end mb-4">
                    <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Novo Conselheiro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Conselheiro</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do novo conselheiro
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="memberCouncil" className="text-right">
                              Conselho *
                            </label>
                            <Select
                              value={newMember.council_id}
                              onValueChange={(value) => setNewMember({...newMember, council_id: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o conselho" />
                              </SelectTrigger>
                              <SelectContent>
                                {councils.map((council) => (
                                  <SelectItem key={council.id} value={council.id}>
                                    {council.name} {council.type && `(${council.type})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="memberName" className="text-right">
                              Nome *
                            </label>
                            <Input 
                              id="memberName" 
                              className="col-span-3"
                              value={newMember.name}
                              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                              placeholder="Nome completo do conselheiro"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="memberRole" className="text-right">
                              Cargo *
                            </label>
                            <Input 
                              id="memberRole" 
                              className="col-span-3"
                              value={newMember.role}
                              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                              placeholder="Ex: Presidente, Conselheiro, Conselheiro Externo"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="startDate" className="text-right">
                              Data Início *
                            </label>
                            <Input 
                              id="startDate" 
                              type="date"
                              className="col-span-3"
                              value={newMember.start_date}
                              onChange={(e) => setNewMember({...newMember, start_date: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="endDate" className="text-right">
                              Data Fim
                            </label>
                            <Input 
                              id="endDate" 
                              type="date"
                              className="col-span-3"
                              value={newMember.end_date}
                              onChange={(e) => setNewMember({...newMember, end_date: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddMemberModalOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleAddMember} disabled={membersLoading}>
                            {membersLoading ? "Adicionando..." : "Adicionar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Conselho</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Fim</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {membersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Carregando conselheiros...
                          </TableCell>
                        </TableRow>
                      ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                          <TableRow
                            key={member.id}
                            className="cursor-pointer"
                            onClick={() => handleViewDetails(member, "conselheiro")}
                          >
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.council}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>{member.startDate}</TableCell>
                            <TableCell>{member.endDate}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(member, "conselheiro");
                                }}
                              >
                                Ver Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Nenhum conselheiro encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    {/* Seletor de Conselho */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Selecionar Conselho</h3>
                      <Select value={selectedCouncilId} onValueChange={setSelectedCouncilId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um conselho para fazer upload de documentos" />
                        </SelectTrigger>
                        <SelectContent>
                          {councils.map((council) => (
                            <SelectItem key={council.id} value={council.id}>
                              {council.name} - {council.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                        {/* Upload de Documentos - só aparece se um conselho estiver selecionado */}
                    {selectedCouncilId && (
                      <>
                        {/* Configuração de Lembretes */}
                        <CouncilReminderConfig councilId={selectedCouncilId} />

                        <div className="bg-white p-6 rounded-lg border">
                          <CouncilDocumentUpload
                            councilId={selectedCouncilId}
                            documentType="council_documents"
                            onUploadSuccess={() => {
                              toast({
                                title: "Sucesso",
                                description: "Documentos dos conselhos enviados com sucesso!",
                              });
                              // Recarregar lista de documentos
                              fetchDocuments({ council_id: selectedCouncilId });
                            }}
                          />
                        </div>

                        <div className="bg-white p-6 rounded-lg border">
                          <CouncilDocumentUpload
                            councilId={selectedCouncilId}
                            documentType="meeting_minutes"
                            onUploadSuccess={() => {
                              toast({
                                title: "Sucesso",
                                description: "Atas de reuniões enviadas com sucesso!",
                              });
                              // Recarregar lista de documentos
                              fetchDocuments({ council_id: selectedCouncilId });
                            }}
                          />
                        </div>

                        <div className="bg-white p-6 rounded-lg border">
                          <CouncilDocumentUpload
                            councilId={selectedCouncilId}
                            documentType="contracts"
                            onUploadSuccess={() => {
                              toast({
                                title: "Sucesso",
                                description: "Contratos de conselheiros enviados com sucesso!",
                              });
                              // Recarregar lista de documentos
                              fetchDocuments({ council_id: selectedCouncilId });
                            }}
                          />
                        </div>

                        {/* Lista de Documentos */}
                        <div className="bg-white p-6 rounded-lg border">
                          <h3 className="text-lg font-medium mb-4">Documentos do Conselho</h3>
                          {documentsLoading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legacy-500 mx-auto"></div>
                              <p className="mt-2 text-gray-600">Carregando documentos...</p>
                            </div>
                          ) : documents.length > 0 ? (
                            <div className="space-y-4">
                              {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center space-x-4">
                                    <FileText className="h-8 w-8 text-blue-500" />
                                    <div>
                                      <h4 className="font-medium">{doc.name}</h4>
                                      <p className="text-sm text-gray-500">
                                        {doc.type} • {doc.file_size ? `${(parseInt(doc.file_size) / 1024 / 1024).toFixed(2)} MB` : 'Tamanho não disponível'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={async () => {
                                        try {
                                          const url = await getDownloadUrl(doc.id);
                                          window.open(url, '_blank');
                                        } catch (error) {
                                          toast({
                                            title: "Erro",
                                            description: "Erro ao baixar documento",
                                            variant: "destructive"
                                          });
                                        }
                                      }}
                                    >
                                      Download
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={async () => {
                                        try {
                                          await deleteDocument(doc.id);
                                          toast({
                                            title: "Sucesso",
                                            description: "Documento removido com sucesso"
                                          });
                                          // Recarregar documentos
                                          fetchDocuments({ council_id: selectedCouncilId });
                                        } catch (error) {
                                          toast({
                                            title: "Erro",
                                            description: "Erro ao remover documento",
                                            variant: "destructive"
                                          });
                                        }
                                      }}
                                    >
                                      Remover
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                              <p>Nenhum documento encontrado</p>
                              <p className="text-sm">Faça upload de documentos usando os formulários acima</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Mensagem quando nenhum conselho está selecionado */}
                    {!selectedCouncilId && (
                      <div className="bg-gray-50 p-6 rounded-lg border border-dashed">
                        <div className="text-center text-gray-500">
                          <FileText className="mx-auto h-12 w-12 mb-4" />
                          <p className="text-lg font-medium mb-2">Selecione um conselho</p>
                          <p className="text-sm">Escolha um conselho acima para fazer upload de documentos</p>
                        </div>
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

          {/* Modal de Detalhes da Reunião */}
          <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4 border-b border-gray-200">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Detalhes da Reunião
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Informações completas e ações disponíveis para esta reunião
                </DialogDescription>
              </DialogHeader>
              
              {selectedMeeting && (
                <div className="space-y-8 py-6">
                  {/* Cabeçalho da Reunião */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMeeting.title}</h3>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">Conselho:</span>
                          <span className="text-gray-800">{selectedMeeting.council}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
                            selectedMeeting.status === "Agendada"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : selectedMeeting.status === "Realizada"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : selectedMeeting.status === "Cancelada"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          }`}
                        >
                          {selectedMeeting.status}
                        </span>
                        <Badge variant="outline" className="text-xs font-medium">
                          {selectedMeeting.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Reunião */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Informações Básicas */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-gray-900">Informações Básicas</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Data:</span>
                          </div>
                          <span className="font-semibold text-gray-900">{new Date(selectedMeeting.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Horário:</span>
                          </div>
                          <span className="font-semibold text-gray-900">{selectedMeeting.time || '--:--'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Tipo:</span>
                          </div>
                          <span className="font-semibold text-gray-900">{selectedMeeting.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Adicionais */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-gray-900">Detalhes Adicionais</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedMeeting.location && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-700">Local:</span>
                            </div>
                            <p className="text-gray-900 font-medium">{selectedMeeting.location}</p>
                          </div>
                        )}
                        {selectedMeeting.agenda && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-700">Agenda:</span>
                            </div>
                            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedMeeting.agenda}</p>
                          </div>
                        )}
                        {selectedMeeting.minutes && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-700">Ata:</span>
                            </div>
                            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedMeeting.minutes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-gray-900">Ações Rápidas</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2"
                        onClick={() => {
                          if (selectedMeeting.status === 'Agendada') {
                            handleUpdateMeetingStatus(selectedMeeting.id, 'Realizada');
                          } else if (selectedMeeting.status === 'Realizada') {
                            handleUpdateMeetingStatus(selectedMeeting.id, 'Agendada');
                          }
                          setIsMeetingModalOpen(false);
                        }}
                      >
                        {selectedMeeting.status === 'Agendada' ? 'Marcar como Realizada' : 
                         selectedMeeting.status === 'Realizada' ? 'Reagendar' : 'Alterar Status'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 font-medium px-4 py-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${selectedMeeting.title} - ${new Date(selectedMeeting.date).toLocaleDateString('pt-BR')} às ${selectedMeeting.time}`);
                          toast({
                            title: "Copiado",
                            description: "Informações da reunião copiadas para a área de transferência",
                          });
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Copiar Informações
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="font-medium"
                >
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Councils;
