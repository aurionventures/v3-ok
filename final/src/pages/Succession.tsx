
import React, { useState } from "react";
import { Award, Plus, Search, FileText, Calendar, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

// Sample succession requirements
const successionRequirements = [
  {
    id: 1,
    category: "Formação Acadêmica",
    requirement: "MBA Internacional",
    priority: "Alta",
    description: "Mestrado em Administração de Empresas em universidade internacional de prestígio",
  },
  {
    id: 2,
    category: "Experiência Profissional",
    requirement: "Mínimo 10 anos em liderança",
    priority: "Alta",
    description: "Experiência comprovada em posições de liderança por pelo menos 10 anos",
  },
  {
    id: 3,
    category: "Competências Técnicas",
    requirement: "Conhecimento em Finanças",
    priority: "Média",
    description: "Sólidos conhecimentos em gestão financeira e análise de investimentos",
  },
  {
    id: 4,
    category: "Valores Familiares",
    requirement: "Alinhamento com os valores da família",
    priority: "Alta",
    description: "Demonstrar comprometimento com os valores e princípios familiares",
  },
  {
    id: 5,
    category: "Idiomas",
    requirement: "Fluência em inglês e espanhol",
    priority: "Média",
    description: "Capacidade de comunicação internacional para expansão dos negócios",
  },
];

// Sample heirs data with requirements completion
const heirs = [
  {
    id: 1,
    name: "Carlos Silva",
    age: 42,
    generation: "2ª",
    role: "CEO",
    readiness: 90,
    completedRequirements: [1, 2, 3, 4], // IDs dos requisitos atendidos
  },
  {
    id: 2,
    name: "Ana Silva",
    age: 38,
    generation: "2ª",
    role: "Diretora Financeira",
    readiness: 85,
    completedRequirements: [1, 3, 4, 5],
  },
  {
    id: 3,
    name: "Pedro Silva",
    age: 36,
    generation: "2ª",
    role: "Não atuante",
    readiness: 40,
    completedRequirements: [4],
  },
  {
    id: 4,
    name: "Lucas Silva",
    age: 18,
    generation: "3ª",
    role: "Estudante",
    readiness: 25,
    completedRequirements: [],
  },
  {
    id: 5,
    name: "Júlia Silva",
    age: 16,
    generation: "3ª",
    role: "Estudante",
    readiness: 20,
    completedRequirements: [],
  },
];

// Sample training activities data
const trainingActivities = [
  {
    id: 1,
    heir: "Carlos Silva",
    activity: "MBA em Gestão de Empresas Familiares",
    startDate: "01/02/2024",
    endDate: "01/12/2025",
    status: "Em andamento",
  },
  {
    id: 2,
    heir: "Ana Silva",
    activity: "Curso de Governança Corporativa",
    startDate: "10/03/2024",
    endDate: "10/06/2024",
    status: "Em andamento",
  },
  {
    id: 3,
    heir: "Carlos Silva",
    activity: "Mentoria com Conselheiro Externo",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    status: "Em andamento",
  },
  {
    id: 4,
    heir: "Pedro Silva",
    activity: "Workshop de Liderança",
    startDate: "15/05/2025",
    endDate: "17/05/2025",
    status: "Agendado",
  },
  {
    id: 5,
    heir: "Ana Silva",
    activity: "Curso de Comunicação Estratégica",
    startDate: "05/01/2024",
    endDate: "15/02/2024",
    status: "Concluído",
  },
  {
    id: 6,
    heir: "Lucas Silva",
    activity: "Estágio na Empresa",
    startDate: "01/07/2025",
    endDate: "31/01/2026",
    status: "Agendado",
  },
];

const Succession = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("heirs");
  const [requirements, setRequirements] = useState(successionRequirements);

  const filteredHeirs = heirs.filter(
    (heir) =>
      heir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heir.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heir.generation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = trainingActivities.filter(
    (activity) =>
      activity.heir.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHeir = () => {
    toast({
      title: "Herdeiro adicionado",
      description: "O novo herdeiro foi adicionado com sucesso.",
    });
  };

  const handleAddActivity = () => {
    toast({
      title: "Atividade adicionada",
      description: "A nova atividade de desenvolvimento foi adicionada com sucesso.",
    });
  };

  const handleAddRequirement = () => {
    toast({
      title: "Requisito adicionado",
      description: "O novo requisito de sucessão foi adicionado com sucesso.",
    });
  };

  const handleDeleteRequirement = (id: number) => {
    setRequirements(requirements.filter(req => req.id !== id));
    toast({
      title: "Requisito removido",
      description: "O requisito foi removido com sucesso.",
    });
  };

  // Calcula a porcentagem de requisitos completados
  const calculateCompletionPercentage = (completedRequirements: number[]) => {
    if (requirements.length === 0) return 0;
    return Math.round((completedRequirements.length / requirements.length) * 100);
  };

  const handleViewDetails = (heir: any) => {
    toast({
      title: "Detalhes do herdeiro",
      description: `Visualizando informações de ${heir.name}`,
    });
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Sucessão" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Sucessão e Desenvolvimento de Herdeiros
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

              <Tabs defaultValue="heirs" onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="heirs">Sucessão</TabsTrigger>
                  <TabsTrigger value="requirements">Requisitos de Sucessão</TabsTrigger>
                  <TabsTrigger value="training">Desenvolvimento</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="heirs">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Herdeiro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Herdeiro</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do herdeiro
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="heirName" className="text-right">
                              Nome
                            </label>
                            <Input id="heirName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="heirAge" className="text-right">
                              Idade
                            </label>
                            <Input id="heirAge" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="heirGeneration" className="text-right">
                              Geração
                            </label>
                            <Input id="heirGeneration" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="heirRole" className="text-right">
                              Papel
                            </label>
                            <Input id="heirRole" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddHeir}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Geração</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Prontidão para Sucessão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHeirs.map((heir) => (
                        <TableRow
                          key={heir.id}
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(heir)}
                        >
                          <TableCell className="font-medium">{heir.name}</TableCell>
                          <TableCell>{heir.age}</TableCell>
                          <TableCell>{heir.generation}</TableCell>
                          <TableCell>{heir.role}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={calculateCompletionPercentage(heir.completedRequirements)}
                                  className="h-2 w-[100px]"
                                />
                                <span className="text-sm font-medium">
                                  {calculateCompletionPercentage(heir.completedRequirements)}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {heir.completedRequirements.length}/{requirements.length} requisitos
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(heir);
                              }}
                            >
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="requirements">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <GraduationCap className="mr-2 h-4 w-4" /> Adicionar Requisito
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Requisito para Sucessores</DialogTitle>
                          <DialogDescription>
                            Defina um novo requisito que os sucessores devem possuir para entrarem no plano sucessório
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="reqCategory" className="text-right">
                              Categoria
                            </label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="academic">Formação Acadêmica</SelectItem>
                                <SelectItem value="experience">Experiência Profissional</SelectItem>
                                <SelectItem value="technical">Competências Técnicas</SelectItem>
                                <SelectItem value="values">Valores Familiares</SelectItem>
                                <SelectItem value="languages">Idiomas</SelectItem>
                                <SelectItem value="leadership">Liderança</SelectItem>
                                <SelectItem value="other">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="reqTitle" className="text-right">
                              Requisito
                            </label>
                            <Input 
                              id="reqTitle" 
                              placeholder="Ex: MBA Internacional"
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="reqPriority" className="text-right">
                              Prioridade
                            </label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a prioridade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="low">Baixa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <label htmlFor="reqDescription" className="text-right pt-2">
                              Descrição
                            </label>
                            <Textarea 
                              id="reqDescription" 
                              placeholder="Descreva detalhadamente o requisito..."
                              className="col-span-3 h-24"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddRequirement}>Adicionar Requisito</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {requirements.map((requirement) => (
                      <div key={requirement.id} className="bg-white p-6 rounded-lg border">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium">{requirement.requirement}</h3>
                            <Badge 
                              variant={
                                requirement.priority === "Alta" ? "destructive" : 
                                requirement.priority === "Média" ? "default" : "secondary"
                              }
                            >
                              {requirement.priority}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRequirement(requirement.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </Button>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Categoria: {requirement.category}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {requirement.description}
                        </p>
                      </div>
                    ))}
                    
                    {requirements.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum requisito cadastrado ainda.</p>
                        <p className="text-sm">Adicione requisitos que os sucessores devem possuir.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="training">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Calendar className="mr-2 h-4 w-4" /> Nova Atividade
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Atividade de Desenvolvimento</DialogTitle>
                          <DialogDescription>
                            Cadastre uma nova atividade para desenvolvimento de herdeiros
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="activityHeir" className="text-right">
                              Herdeiro
                            </label>
                            <Input id="activityHeir" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="activityName" className="text-right">
                              Atividade
                            </label>
                            <Input id="activityName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="activityStart" className="text-right">
                              Início
                            </label>
                            <Input id="activityStart" type="date" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="activityEnd" className="text-right">
                              Término
                            </label>
                            <Input id="activityEnd" type="date" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddActivity}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Herdeiro</TableHead>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Término</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.heir}</TableCell>
                          <TableCell>{activity.activity}</TableCell>
                          <TableCell>{activity.startDate}</TableCell>
                          <TableCell>{activity.endDate}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                activity.status === "Concluído"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Plano de Sucessão</h3>
                      <FileUpload 
                        label="Fazer upload do plano de sucessão" 
                        multiple={false} 
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Avaliações de Competências</h3>
                      <FileUpload 
                        label="Fazer upload de avaliações" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx,.xlsx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Certificados de Formação</h3>
                      <FileUpload 
                        label="Fazer upload de certificados" 
                        multiple={true} 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Succession;
