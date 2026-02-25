
import React, { useState } from "react";
import { Users, Search, UserPlus, Eye, Pencil, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

// Sample family members data
const familyMembers = [
  {
    id: 1,
    name: "José Silva",
    age: 68,
    generation: "1ª",
    role: "Fundador",
    involvement: "Presidente do Conselho",
    status: "Ativo",
    imageSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    shareholding: "45%",
    education: "MBA em Administração, Universidade XYZ",
    experience: "30 anos no setor, fundador da empresa em 1985",
    contact: {
      email: "jose.silva@email.com",
      phone: "+55 11 99999-1111"
    },
    companies: [
      { name: "Silva Empreendimentos", role: "Presidente do Conselho", shareholding: "45%" },
      { name: "Silva Investimentos", role: "CEO", shareholding: "60%" }
    ]
  },
  {
    id: 2,
    name: "Maria Silva",
    age: 66,
    generation: "1ª",
    role: "Co-fundadora",
    involvement: "Conselheira",
    status: "Ativo",
    imageSrc: "https://randomuser.me/api/portraits/women/32.jpg",
    shareholding: "30%",
    education: "Graduação em Economia, Universidade ABC",
    experience: "28 anos de experiência, liderou a expansão internacional",
    contact: {
      email: "maria.silva@email.com",
      phone: "+55 11 99999-2222"
    },
    companies: [
      { name: "Silva Empreendimentos", role: "Conselheira", shareholding: "30%" },
      { name: "Fundação Silva", role: "Presidente", shareholding: "N/A" }
    ]
  },
  {
    id: 3,
    name: "Carlos Silva",
    age: 42,
    generation: "2ª",
    role: "Herdeiro",
    involvement: "Diretor de Operações",
    status: "Ativo",
    imageSrc: "https://randomuser.me/api/portraits/men/22.jpg",
    shareholding: "10%",
    education: "MBA em Finanças, Universidade Internacional",
    experience: "15 anos na empresa, liderando inovação e expansão",
    contact: {
      email: "carlos.silva@email.com",
      phone: "+55 11 99999-3333"
    },
    companies: [
      { name: "Silva Empreendimentos", role: "Diretor de Operações", shareholding: "10%" },
      { name: "Silva Tech", role: "CEO", shareholding: "40%" }
    ]
  },
  {
    id: 4,
    name: "Ana Silva",
    age: 40,
    generation: "2ª",
    role: "Herdeira",
    involvement: "CFO",
    status: "Ativo",
    imageSrc: "https://randomuser.me/api/portraits/women/22.jpg",
    shareholding: "10%",
    education: "PhD em Administração de Empresas",
    experience: "12 anos na empresa, responsável pela reestruturação financeira",
    contact: {
      email: "ana.silva@email.com",
      phone: "+55 11 99999-4444"
    },
    companies: [
      { name: "Silva Empreendimentos", role: "CFO", shareholding: "10%" },
      { name: "Silva Capital", role: "Managing Partner", shareholding: "50%" }
    ]
  },
  {
    id: 5,
    name: "Pedro Silva",
    age: 38,
    generation: "2ª",
    role: "Herdeiro",
    involvement: "Head de Marketing",
    status: "Afastado",
    imageSrc: "https://randomuser.me/api/portraits/men/12.jpg",
    shareholding: "5%",
    education: "Mestrado em Marketing Digital",
    experience: "Atualmente trabalhando em empresa externa",
    contact: {
      email: "pedro.silva@email.com",
      phone: "+55 11 99999-5555"
    },
    companies: [
      { name: "Silva Empreendimentos", role: "Conselho Consultivo", shareholding: "5%" },
      { name: "AgênciaX", role: "Diretor de Criação", shareholding: "N/A" }
    ]
  },
];

const FamilyStructure = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showDetailsMember, setShowDetailsMember] = useState<any>(null);

  const filteredMembers = familyMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.involvement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (member: any) => {
    setShowDetailsMember(member);
  };

  const handleAddMember = () => {
    setIsAddingMember(true);
  };

  const handleEditMember = (member: any) => {
    toast({
      title: "Editar membro",
      description: `Editando informações de ${member.name}`,
    });
  };

  const handleDeleteMember = (member: any) => {
    toast({
      title: "Excluir membro",
      description: `${member.name} será removido da estrutura familiar`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Estrutura Societária" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Estrutura Societária
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar familiares..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMember}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Familiar
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Geração</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Envolvimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.generation}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.involvement}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            member.status === "Ativo"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(member)}
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMember(member)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member)}
                            title="Remover"
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
        </div>
      </div>

      {/* Dialog for adding new family member */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Adicionar Familiar</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo membro da família
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input id="name" placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Idade
                </label>
                <Input id="age" type="number" placeholder="Idade" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="generation" className="text-sm font-medium">
                  Geração
                </label>
                <select id="generation" className="w-full p-2 border rounded-md">
                  <option value="">Selecione...</option>
                  <option value="1ª">1ª Geração</option>
                  <option value="2ª">2ª Geração</option>
                  <option value="3ª">3ª Geração</option>
                  <option value="4ª">4ª Geração</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Papel
                </label>
                <Input id="role" placeholder="Ex: Fundador, Herdeiro, etc." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="involvement" className="text-sm font-medium">
                  Envolvimento
                </label>
                <Input id="involvement" placeholder="Ex: CEO, Conselheiro, etc." />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select id="status" className="w-full p-2 border rounded-md">
                  <option value="">Selecione...</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Afastado">Afastado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="shareholding" className="text-sm font-medium">
                Participação Societária
              </label>
              <Input id="shareholding" placeholder="Ex: 25%" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMember(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Membro adicionado",
                description: "O novo membro da família foi adicionado com sucesso!"
              });
              setIsAddingMember(false);
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet for showing member details */}
      <Sheet open={!!showDetailsMember} onOpenChange={() => setShowDetailsMember(null)}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Familiar</SheetTitle>
            <SheetDescription>
              Informações detalhadas sobre o membro da família
            </SheetDescription>
          </SheetHeader>
          
          {showDetailsMember && (
            <div className="py-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                  <img 
                    src={showDetailsMember.imageSrc} 
                    alt={showDetailsMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{showDetailsMember.name}</h3>
                  <p className="text-gray-500">{showDetailsMember.role} • {showDetailsMember.generation} Geração</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Idade</h4>
                    <p>{showDetailsMember.age} anos</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        showDetailsMember.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {showDetailsMember.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Participação Societária</h4>
                  <p>{showDetailsMember.shareholding}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Formação</h4>
                  <p>{showDetailsMember.education}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Experiência</h4>
                  <p>{showDetailsMember.experience}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Contato</h4>
                  <p>Email: {showDetailsMember.contact.email}</p>
                  <p>Telefone: {showDetailsMember.contact.phone}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Empresas</h4>
                  <div className="space-y-3">
                    {showDetailsMember.companies.map((company: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-500">Cargo: {company.role}</div>
                        {company.shareholding !== "N/A" && (
                          <div className="text-sm text-gray-500">
                            Participação: {company.shareholding}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleEditMember(showDetailsMember)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  onClick={() => setShowDetailsMember(null)}
                  className="flex-1 bg-legacy-purple-500 hover:bg-legacy-purple-600"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FamilyStructure;
