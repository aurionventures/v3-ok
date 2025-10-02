import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Search, PlusCircle, Download, Trash2, Pencil, Loader2
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
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { InviteTypeSelector } from "@/components/invitation/InviteTypeSelector";
import { InviteForm } from "@/components/invitation/InviteForm";
import { CompanyFilters, CompanyFiltersState } from "@/components/admin/CompanyFilters";
import { useCompanies, type Company } from "@/hooks/useCompanies";

const Companies = () => {
  const navigate = useNavigate();
  const { companies, loading, error, deleteCompany, fetchCompanies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [inviteStep, setInviteStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<'cliente' | 'parceiro' | null>(null);
  const [filters, setFilters] = useState<CompanyFiltersState>({
    type: 'all',
    plans: [],
    paymentStatus: []
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  // Recarregar dados quando a página receber foco
  useEffect(() => {
    const handleFocus = () => {
      fetchCompanies();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchCompanies]);

  // Filter companies based on search term and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || company.type === filters.type;
    const matchesPlan = filters.plans.length === 0 || filters.plans.includes(company.plan);
    const matchesPaymentStatus = filters.paymentStatus.length === 0 || 
      filters.paymentStatus.includes(company.paymentStatus);
    
    return matchesSearch && matchesType && matchesPlan && matchesPaymentStatus;
  });

  const handleTypeSelect = (type: 'cliente' | 'parceiro') => {
    setSelectedType(type);
    setInviteStep('form');
  };

  const handleBackToSelect = () => {
    setInviteStep('select');
    setSelectedType(null);
  };

  const handleInviteSuccess = async () => {
    setIsNewCompanyDialogOpen(false);
    setInviteStep('select');
    setSelectedType(null);
    
    // Recarregar lista de empresas para mostrar a nova adicionada
    await fetchCompanies();
    
    toast({
      title: "Convite enviado!",
      description: "O link de convite foi gerado com sucesso."
    });
  };

  const handleDialogChange = (open: boolean) => {
    setIsNewCompanyDialogOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setInviteStep('select');
      setSelectedType(null);
    }
  };

  // Handle company actions
  const handleEditCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    toast({
      title: "Editar empresa",
      description: `Abrindo formulário de edição para ${company?.name}`
    });
  };

  const handleDeleteCompanyClick = (id: string) => {
    const company = companies.find(c => c.id === id);
    setCompanyToDelete(company || null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      await deleteCompany(companyToDelete.id);
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleCompanyClick = (id: string) => {
    navigate(`/admin/companies/${id}`);
  };

  const handleAccessAsAdmin = (id: string) => {
    const company = companies.find(c => c.id === id);
    toast({
      title: "Acesso Admin",
      description: `Acessando ${company?.name} como administrador`
    });
  };

  const handleRenewSubscription = (id: string) => {
    const company = companies.find(c => c.id === id);
    toast({
      title: "Renovação de assinatura",
      description: `Processando renovação para ${company?.name}`
    });
  };

  const handleReactivateCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    toast({
      title: "Empresa reativada",
      description: `${company?.name} foi reativada com sucesso`
    });
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'Pago': return 'default';
      case 'Aguardando': return 'secondary';
      case 'Pendente': return 'outline';
      case 'Vencido': return 'destructive';
      default: return 'outline';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Empresas" />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando empresas...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Empresas" />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">Erro ao carregar empresas</p>
                <Button onClick={() => window.location.reload()}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Empresas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Parceiros</h1>
            <p className="text-gray-500">Gerencie os parceiros da plataforma Legacy</p>
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
              <CompanyFilters filters={filters} onFiltersChange={setFilters} />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isNewCompanyDialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Convidar Nova Empresa</DialogTitle>
                    <DialogDescription>
                      {inviteStep === 'select' 
                        ? 'Selecione o tipo de conta para criar um convite.'
                        : 'Preencha os dados e gere o link de convite.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {inviteStep === 'select' && (
                      <InviteTypeSelector onSelect={handleTypeSelect} />
                    )}
                    {inviteStep === 'form' && selectedType && (
                      <InviteForm 
                        type={selectedType}
                        onBack={handleBackToSelect}
                        onSuccess={handleInviteSuccess}
                      />
                    )}
                  </div>
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
                        <TableHead>Tipo</TableHead>
                        {/* <TableHead>Plano</TableHead> */}
                        <TableHead>Email</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies
                        .filter(company => company.status === "active")
                        .map((company) => (
                        <TableRow 
                          key={company.id} 
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => handleCompanyClick(company.id)}
                        >
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <Badge variant={company.type === "cliente" ? "default" : "secondary"}>
                              {company.type === "cliente" ? "Cliente" : "Parceiro"}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <Badge variant={
                              company.plan === "Enterprise" ? "default" : 
                              company.plan === "Professional" ? "secondary" : "outline"
                            }>
                              {company.plan}
                            </Badge>
                          </TableCell> */}
                          <TableCell>{company.contactEmail}</TableCell>
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
                                <DropdownMenuContent align="end" className="bg-popover">
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteCompanyClick(company.id)}
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
                        <TableHead>Tipo</TableHead>
                        {/* <TableHead>Plano</TableHead> */}
                        <TableHead>Email</TableHead>
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
                            <Badge variant={company.type === "cliente" ? "outline" : "secondary"}>
                              {company.type === "cliente" ? "Cliente" : "Parceiro"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{company.plan}</Badge>
                          </TableCell>
                          <TableCell>{company.contactEmail}</TableCell>
                          <TableCell>{new Date(company.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReactivateCompany(company.id)}
                              >
                                Reativar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCompanyClick(company.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
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
                        <TableHead>Tipo</TableHead>
                        {/* <TableHead>Plano</TableHead> */}
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => (
                        <TableRow key={company.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleCompanyClick(company.id)}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <Badge variant={company.type === "cliente" ? "default" : "secondary"}>
                              {company.type === "cliente" ? "Cliente" : "Parceiro"}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <Badge variant={
                              company.plan === "Enterprise" ? "default" : 
                              company.plan === "Professional" ? "secondary" : "outline"
                            }>
                              {company.plan}
                            </Badge>
                          </TableCell> */}
                          <TableCell>{company.contactEmail}</TableCell>
                          <TableCell>
                            <Badge variant={company.status === "active" ? "default" : "destructive"}>
                              {company.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
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
                                onClick={() => handleDeleteCompanyClick(company.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
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

          {/* Dialog de confirmação de exclusão */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o parceiro <strong>"{companyToDelete?.name}"</strong>?
                  <br /><br />
                  Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setCompanyToDelete(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteCompany}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Companies;
