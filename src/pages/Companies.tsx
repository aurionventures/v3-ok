import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Search, PlusCircle, Filter, Download, Trash2, Pencil
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

// Sample company data
const companies = [
  { 
    id: 1, 
    name: "Grupo Insper", 
    plan: "Enterprise", 
    status: "active",
    users: 15,
    created: "12/01/2023",
    nextPayment: "12/06/2025",
    contact: "Maria Silva",
    contactEmail: "maria@insper.com.br",
    contactPhone: "(11) 99999-8888"
  },
  { 
    id: 2, 
    name: "Família Almeida Investimentos", 
    plan: "Professional", 
    status: "active",
    users: 8,
    created: "05/02/2023",
    nextPayment: "05/07/2025",
    contact: "João Almeida",
    contactEmail: "joao@almeidainvest.com.br",
    contactPhone: "(11) 97777-6666"
  },
  { 
    id: 3, 
    name: "Grupo Xavier", 
    plan: "Professional", 
    status: "active",
    users: 6,
    created: "18/03/2023",
    nextPayment: "18/08/2025",
    contact: "Pedro Xavier",
    contactEmail: "pedro@xavier.com.br",
    contactPhone: "(11) 95555-4444"
  },
  { 
    id: 4, 
    name: "Família Costa Holdings", 
    plan: "Basic", 
    status: "active",
    users: 4,
    created: "22/04/2023",
    nextPayment: "22/09/2025",
    contact: "Ana Costa",
    contactEmail: "ana@costaholdings.com.br",
    contactPhone: "(11) 93333-2222"
  },
  { 
    id: 5, 
    name: "Grupo Oliveira", 
    plan: "Basic", 
    status: "active",
    users: 3,
    created: "10/05/2023",
    nextPayment: "10/10/2025",
    contact: "Luciana Oliveira",
    contactEmail: "luciana@grupooliveira.com.br",
    contactPhone: "(11) 92222-1111"
  },
  { 
    id: 6, 
    name: "Família Santos Participações", 
    plan: "Enterprise", 
    status: "inactive",
    users: 0,
    created: "15/06/2023",
    nextPayment: "15/11/2025",
    contact: "Carlos Santos",
    contactEmail: "carlos@santosparticipacoes.com.br",
    contactPhone: "(11) 91111-0000"
  }
];

const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    plan: "Basic",
    contact: "",
    contactEmail: "",
    contactPhone: ""
  });

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany({
      ...newCompany,
      [name]: value
    });
  };

  const handlePlanChange = (value: string) => {
    setNewCompany({
      ...newCompany,
      plan: value
    });
  };

  const handleCreateCompany = () => {
    // Validation
    if (!newCompany.name || !newCompany.contact || !newCompany.contactEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Add company logic would go here
    toast({
      title: "Empresa criada",
      description: `${newCompany.name} foi adicionada com sucesso.`
    });
    
    // Reset form and close dialog
    setNewCompany({
      name: "",
      plan: "Basic",
      contact: "",
      contactEmail: "",
      contactPhone: ""
    });
    setIsNewCompanyDialogOpen(false);
  };

  // Handle company actions
  const handleEditCompany = (id: number) => {
    toast({
      title: "Editar empresa",
      description: `Edição da empresa ID: ${id} iniciada.`
    });
  };

  const handleDeleteCompany = (id: number) => {
    toast({
      title: "Excluir empresa",
      description: `Empresa ID: ${id} excluída com sucesso.`
    });
  };

  const handleCompanyClick = (id: number) => {
    // Navigate to company details
    toast({
      title: "Detalhes da empresa",
      description: `Visualizando detalhes da empresa ID: ${id}`
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Empresas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Empresas</h1>
            <p className="text-gray-500">Gerencie os clientes da plataforma Legacy</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar empresas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isNewCompanyDialogOpen} onOpenChange={setIsNewCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                    <DialogDescription>
                      Preencha os dados da nova empresa para adicionar à plataforma.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nome*
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={newCompany.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="plan" className="text-right">
                        Plano*
                      </Label>
                      <Select value={newCompany.plan} onValueChange={handlePlanChange}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact" className="text-right">
                        Contato*
                      </Label>
                      <Input
                        id="contact"
                        name="contact"
                        value={newCompany.contact}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactEmail" className="text-right">
                        Email*
                      </Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={newCompany.contactEmail}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactPhone" className="text-right">
                        Telefone
                      </Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={newCompany.contactPhone}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateCompany}>
                      Adicionar Empresa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Empresas Ativas ({filteredCompanies.filter(c => c.status === "active").length})</TabsTrigger>
              <TabsTrigger value="inactive">Inativas ({filteredCompanies.filter(c => c.status === "inactive").length})</TabsTrigger>
              <TabsTrigger value="all">Todas ({filteredCompanies.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Usuários</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Próx. Pagamento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies
                        .filter(company => company.status === "active")
                        .map((company) => (
                        <TableRow 
                          key={company.id} 
                          className="cursor-pointer"
                          onClick={() => handleCompanyClick(company.id)}
                        >
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <Badge variant={
                              company.plan === "Enterprise" ? "default" : 
                              company.plan === "Professional" ? "secondary" : "outline"
                            }>
                              {company.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>{company.users}</TableCell>
                          <TableCell>{company.contact}</TableCell>
                          <TableCell>{company.nextPayment}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditCompany(company.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => toast({ title: "Acessar", description: `Acessando empresa ${company.name}` })}>
                                    Acessar como Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast({ title: "Renovar", description: `Renovando assinatura de ${company.name}` })}>
                                    Renovar Assinatura
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteCompany(company.id)}
                                  >
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies
                        .filter(company => company.status === "inactive")
                        .map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{company.plan}</Badge>
                          </TableCell>
                          <TableCell>{company.contact}</TableCell>
                          <TableCell>{company.created}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toast({ title: "Reativar", description: `Empresa ${company.name} reativada` })}
                              >
                                Reativar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <Badge variant={
                              company.plan === "Enterprise" ? "default" : 
                              company.plan === "Professional" ? "secondary" : "outline"
                            }>
                              {company.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={company.status === "active" ? "default" : "destructive"}>
                              {company.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>{company.contact}</TableCell>
                          <TableCell>{company.contactEmail}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditCompany(company.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Companies;
