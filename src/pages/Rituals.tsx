
import React, { useState } from "react";
import { Calendar, Plus, Search, Users, FileText } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

// Sample rituals data
const rituals = [
  {
    id: 1,
    name: "Assembleia Familiar Anual",
    type: "Assembleia",
    date: "15/07/2025",
    participants: 18,
    status: "Agendado",
  },
  {
    id: 2,
    name: "Fórum de Gerações",
    type: "Fórum",
    date: "20/08/2025",
    participants: 12,
    status: "Agendado",
  },
  {
    id: 3,
    name: "Encontro de Herdeiros",
    type: "Formação",
    date: "05/06/2025",
    participants: 5,
    status: "Agendado",
  },
  {
    id: 4,
    name: "Workshop de Cultura Organizacional",
    type: "Workshop",
    date: "10/04/2025",
    participants: 25,
    status: "Realizado",
  },
  {
    id: 5,
    name: "Almoço Familiar Trimestral",
    type: "Confraternização",
    date: "15/03/2025",
    participants: 22,
    status: "Realizado",
  },
];

// Sample participants data
const participants = [
  {
    id: 1,
    name: "José Silva",
    ritual: "Assembleia Familiar Anual",
    role: "Fundador",
    status: "Confirmado",
  },
  {
    id: 2,
    name: "Maria Silva",
    ritual: "Assembleia Familiar Anual",
    role: "Sócia",
    status: "Confirmado",
  },
  {
    id: 3,
    name: "Carlos Silva",
    ritual: "Assembleia Familiar Anual",
    role: "CEO",
    status: "Confirmado",
  },
  {
    id: 4,
    name: "Ana Silva",
    ritual: "Assembleia Familiar Anual",
    role: "Diretora Financeira",
    status: "Confirmado",
  },
  {
    id: 5,
    name: "Pedro Silva",
    ritual: "Assembleia Familiar Anual",
    role: "Herdeiro",
    status: "Pendente",
  },
  {
    id: 6,
    name: "Carlos Silva",
    ritual: "Fórum de Gerações",
    role: "CEO",
    status: "Confirmado",
  },
  {
    id: 7,
    name: "Ana Silva",
    ritual: "Fórum de Gerações",
    role: "Diretora Financeira",
    status: "Confirmado",
  },
  {
    id: 8,
    name: "Lucas Silva",
    ritual: "Encontro de Herdeiros",
    role: "Herdeiro",
    status: "Confirmado",
  },
  {
    id: 9,
    name: "Júlia Silva",
    ritual: "Encontro de Herdeiros",
    role: "Herdeira",
    status: "Confirmada",
  },
];

const Rituals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("calendar");

  const filteredRituals = rituals.filter(
    (ritual) =>
      ritual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ritual.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ritual.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.ritual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRitual = () => {
    toast({
      title: "Ritual agendado",
      description: "O novo ritual foi agendado com sucesso.",
    });
  };

  const handleAddParticipant = () => {
    toast({
      title: "Participante adicionado",
      description: "O participante foi adicionado com sucesso.",
    });
  };

  const handleViewDetails = (ritual: any) => {
    toast({
      title: "Detalhes do ritual",
      description: `Visualizando informações de ${ritual.name}`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Rituais" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Rituais de Governança
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar rituais..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="calendar" onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="participants">Participantes</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Calendar className="mr-2 h-4 w-4" /> Agendar Ritual
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Agendar Novo Ritual</DialogTitle>
                          <DialogDescription>
                            Preencha as informações para agendar um novo ritual de governança
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualName" className="text-right">
                              Nome
                            </label>
                            <Input id="ritualName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualType" className="text-right">
                              Tipo
                            </label>
                            <Input id="ritualType" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualDate" className="text-right">
                              Data
                            </label>
                            <Input id="ritualDate" type="date" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualTime" className="text-right">
                              Horário
                            </label>
                            <Input id="ritualTime" type="time" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualLocation" className="text-right">
                              Local
                            </label>
                            <Input id="ritualLocation" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="ritualDescription" className="text-right">
                              Descrição
                            </label>
                            <Input id="ritualDescription" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddRitual}>Agendar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Participantes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRituals.map((ritual) => (
                        <TableRow
                          key={ritual.id}
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(ritual)}
                        >
                          <TableCell className="font-medium">{ritual.name}</TableCell>
                          <TableCell>{ritual.type}</TableCell>
                          <TableCell>{ritual.date}</TableCell>
                          <TableCell>{ritual.participants}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                ritual.status === "Agendado"
                                  ? "bg-blue-100 text-blue-800"
                                  : ritual.status === "Realizado"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {ritual.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(ritual);
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

                <TabsContent value="participants">
                  <div className="flex justify-end mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Users className="mr-2 h-4 w-4" /> Adicionar Participante
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Participante</DialogTitle>
                          <DialogDescription>
                            Adicione um participante a um ritual
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="participantName" className="text-right">
                              Nome
                            </label>
                            <Input id="participantName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="participantRitual" className="text-right">
                              Ritual
                            </label>
                            <Input id="participantRitual" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="participantRole" className="text-right">
                              Papel
                            </label>
                            <Input id="participantRole" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddParticipant}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Ritual</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">{participant.name}</TableCell>
                          <TableCell>{participant.ritual}</TableCell>
                          <TableCell>{participant.role}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                participant.status === "Confirmado" || participant.status === "Confirmada"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {participant.status}
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
                      <h3 className="text-lg font-medium mb-4">Atas e Registros</h3>
                      <FileUpload 
                        label="Fazer upload de atas" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Apresentações e Materiais</h3>
                      <FileUpload 
                        label="Fazer upload de materiais" 
                        multiple={true} 
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Fotos e Registros Visuais</h3>
                      <FileUpload 
                        label="Fazer upload de fotos" 
                        multiple={true} 
                        accept=".jpg,.jpeg,.png"
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

export default Rituals;
