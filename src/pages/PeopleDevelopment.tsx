
import React, { useState } from "react";
import { Activity, Plus, Search, FileText, User, GraduationCap } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample key individuals data
const keyIndividuals = [
  {
    id: 1,
    name: "Carlos Silva",
    role: "CEO",
    age: 45,
    purposeScore: 85,
    healthScore: 75,
    readinessScore: 90,
  },
  {
    id: 2,
    name: "Ana Silva",
    role: "Diretora Financeira",
    age: 38,
    purposeScore: 80,
    healthScore: 90,
    readinessScore: 85,
  },
  {
    id: 3,
    name: "Pedro Silva",
    role: "Acionista",
    age: 36,
    purposeScore: 65,
    healthScore: 80,
    readinessScore: 40,
  },
  {
    id: 4,
    name: "Lucas Silva",
    role: "Estudante",
    age: 18,
    purposeScore: 70,
    healthScore: 95,
    readinessScore: 25,
  },
  {
    id: 5,
    name: "Júlia Silva",
    role: "Estudante",
    age: 16,
    purposeScore: 75,
    healthScore: 90,
    readinessScore: 20,
  },
];

// Sample development activities
const developmentActivities = [
  {
    id: 1,
    individual: "Carlos Silva",
    activity: "Mentoria de Propósito e Liderança",
    startDate: "01/02/2025",
    endDate: "01/12/2025",
    status: "Em andamento",
  },
  {
    id: 2,
    individual: "Ana Silva",
    activity: "Programa de Saúde Integral",
    startDate: "10/03/2025",
    endDate: "10/06/2025",
    status: "Em andamento",
  },
  {
    id: 3,
    individual: "Pedro Silva",
    activity: "Workshop de Autoconhecimento",
    startDate: "01/01/2025",
    endDate: "31/12/2025",
    status: "Em andamento",
  },
  {
    id: 4,
    individual: "Lucas Silva",
    activity: "Desenvolvimento de Autoconhecimento",
    startDate: "15/05/2025",
    endDate: "17/05/2025",
    status: "Agendado",
  },
];


const PeopleDevelopment = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIndividuals = keyIndividuals.filter(
    (individual) =>
      individual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      individual.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = developmentActivities.filter(
    (activity) =>
      activity.individual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPerson = () => {
    toast({
      title: "Pessoa adicionada",
      description: "O novo indivíduo-chave foi adicionado com sucesso.",
    });
  };

  const handleAddDevelopment = () => {
    toast({
      title: "Atividade adicionada",
      description: "A nova atividade de desenvolvimento foi adicionada com sucesso.",
    });
  };

  const handleViewDetails = (individual: any) => {
    toast({
      title: "Detalhes do indivíduo",
      description: `Visualizando informações de ${individual.name}`,
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
        <Header title="Desenvolvimento de Pessoas" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Indivíduos-Chave: Desenvolvimento e Propósito
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

              <Tabs defaultValue="individuals">
                <TabsList className="mb-4">
                  <TabsTrigger value="individuals">Indivíduos-Chave</TabsTrigger>
                  <TabsTrigger value="development">Desenvolvimento Pessoal</TabsTrigger>
                  <TabsTrigger value="purpose">Propósito e Valores</TabsTrigger>
                </TabsList>

                <TabsContent value="individuals">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Indivíduo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Indivíduo-Chave</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do indivíduo-chave
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="personName" className="text-right">
                              Nome
                            </label>
                            <Input id="personName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="personRole" className="text-right">
                              Papel
                            </label>
                            <Input id="personRole" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="personAge" className="text-right">
                              Idade
                            </label>
                            <Input id="personAge" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="purposeScore" className="text-right">
                              Score de Propósito (%)
                            </label>
                            <Input id="purposeScore" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="healthScore" className="text-right">
                              Score de Saúde (%)
                            </label>
                            <Input id="healthScore" type="number" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddPerson}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Propósito</TableHead>
                        <TableHead>Saúde Integral</TableHead>
                        <TableHead>Prontidão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIndividuals.map((individual) => (
                        <TableRow
                          key={individual.id}
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(individual)}
                        >
                          <TableCell className="font-medium">{individual.name}</TableCell>
                          <TableCell>{individual.role}</TableCell>
                          <TableCell>{individual.age}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={individual.purposeScore}
                                className={`h-2 w-[100px] ${getProgressColor(individual.purposeScore)}`}
                              />
                              <span>{individual.purposeScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={individual.healthScore}
                                className={`h-2 w-[100px] ${getProgressColor(individual.healthScore)}`}
                              />
                              <span>{individual.healthScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={individual.readinessScore}
                                className={`h-2 w-[100px] ${getProgressColor(individual.readinessScore)}`}
                              />
                              <span>{individual.readinessScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(individual);
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

                <TabsContent value="development">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Activity className="mr-2 h-4 w-4" /> Nova Atividade
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Atividade de Desenvolvimento</DialogTitle>
                          <DialogDescription>
                            Cadastre uma nova atividade para desenvolvimento pessoal
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="activityIndividual" className="text-right">
                              Indivíduo
                            </label>
                            <Input id="activityIndividual" className="col-span-3" />
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
                          <Button onClick={handleAddDevelopment}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indivíduo</TableHead>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Término</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.individual}</TableCell>
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

                <TabsContent value="purpose">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Carta de Propósito</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Documento que expressa sua missão pessoal, valores e contribuição para o legado familiar.
                        </p>
                        <Textarea 
                          placeholder="Escreva sua carta de propósito aqui..." 
                          className="h-40 mb-4"
                        />
                        <Button>Salvar Carta de Propósito</Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Testamento de Valores</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Registro dos valores essenciais que você deseja transmitir para as próximas gerações.
                        </p>
                        <Textarea 
                          placeholder="Escreva seu testamento de valores aqui..." 
                          className="h-40 mb-4"
                        />
                        <Button>Salvar Testamento de Valores</Button>
                      </div>
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

export default PeopleDevelopment;
