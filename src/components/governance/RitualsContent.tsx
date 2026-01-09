import React, { useState } from "react";
import { Calendar, Plus, Search, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { id: 1, name: "Assembleia Familiar Anual", type: "Assembleia", date: "15/07/2025", participants: 18, status: "Agendado" },
  { id: 2, name: "Fórum de Gerações", type: "Fórum", date: "20/08/2025", participants: 12, status: "Agendado" },
  { id: 3, name: "Encontro de Herdeiros", type: "Formação", date: "05/06/2025", participants: 5, status: "Agendado" },
  { id: 4, name: "Workshop de Cultura Organizacional", type: "Workshop", date: "10/04/2025", participants: 25, status: "Realizado" },
  { id: 5, name: "Almoço Familiar Trimestral", type: "Confraternização", date: "15/03/2025", participants: 22, status: "Realizado" },
];

// Sample participants data
const participants = [
  { id: 1, name: "José Silva", ritual: "Assembleia Familiar Anual", role: "Fundador", status: "Confirmado" },
  { id: 2, name: "Maria Silva", ritual: "Assembleia Familiar Anual", role: "Sócia", status: "Confirmado" },
  { id: 3, name: "Carlos Silva", ritual: "Assembleia Familiar Anual", role: "CEO", status: "Confirmado" },
  { id: 4, name: "Ana Silva", ritual: "Assembleia Familiar Anual", role: "Diretora Financeira", status: "Confirmado" },
  { id: 5, name: "Pedro Silva", ritual: "Assembleia Familiar Anual", role: "Herdeiro", status: "Pendente" },
];

const RitualsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRituals = rituals.filter(
    (ritual) =>
      ritual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ritual.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.ritual.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRitual = () => {
    toast({ title: "Ritual agendado", description: "O novo ritual foi agendado com sucesso." });
  };

  const handleAddParticipant = () => {
    toast({ title: "Participante adicionado", description: "O participante foi adicionado com sucesso." });
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar rituais..."
              className="pl-8 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <div className="flex justify-end mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm"><Calendar className="mr-2 h-4 w-4" /> Agendar Ritual</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Novo Ritual</DialogTitle>
                    <DialogDescription>Preencha as informações para agendar um novo ritual</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nome" />
                    <Input placeholder="Tipo" />
                    <Input type="date" />
                    <Input type="time" />
                    <Input placeholder="Local" />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRituals.map((ritual) => (
                  <TableRow key={ritual.id}>
                    <TableCell className="font-medium">{ritual.name}</TableCell>
                    <TableCell>{ritual.type}</TableCell>
                    <TableCell>{ritual.date}</TableCell>
                    <TableCell>{ritual.participants}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        ritual.status === "Agendado" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {ritual.status}
                      </span>
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
                  <Button size="sm"><Users className="mr-2 h-4 w-4" /> Adicionar Participante</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Participante</DialogTitle>
                    <DialogDescription>Adicione um participante a um ritual</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nome" />
                    <Input placeholder="Ritual" />
                    <Input placeholder="Papel" />
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
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        participant.status === "Confirmado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {participant.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Atas e Registros</h4>
                <FileUpload label="Upload de atas" multiple={true} accept=".pdf,.doc,.docx" />
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Apresentações e Materiais</h4>
                <FileUpload label="Upload de materiais" multiple={true} accept=".pdf,.ppt,.pptx" />
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Fotos e Registros Visuais</h4>
                <FileUpload label="Upload de fotos" multiple={true} accept=".jpg,.jpeg,.png" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RitualsContent;
