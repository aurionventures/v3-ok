import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Plus, 
  Building2, 
  User, 
  Palette, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  Handshake,
  Percent,
  Globe
} from "lucide-react";

interface Partner {
  id: string;
  companyName: string;
  cnpj: string;
  type: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  whitelabel: {
    primaryColor: string;
    secondaryColor: string;
    customDomain: string;
    commission: number;
  };
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
}

const PARTNER_TYPES = [
  { value: 'revenda', label: 'Revenda' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'integrador', label: 'Integrador' },
  { value: 'afiliado', label: 'Afiliado' }
];

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1',
    companyName: 'Consultoria ABC',
    cnpj: '12.345.678/0001-90',
    type: 'consultoria',
    adminName: 'Carlos Silva',
    adminEmail: 'carlos@consultoriaabc.com',
    adminPhone: '(11) 99999-0001',
    whitelabel: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      customDomain: 'abc.legacy.app',
      commission: 15
    },
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    companyName: 'Revenda XYZ',
    cnpj: '98.765.432/0001-10',
    type: 'revenda',
    adminName: 'Ana Oliveira',
    adminEmail: 'ana@revendaxyz.com',
    adminPhone: '(11) 99999-0002',
    whitelabel: {
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      customDomain: '',
      commission: 20
    },
    status: 'pending',
    createdAt: '2024-02-20'
  }
];

const AdminPartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [partnerForm, setPartnerForm] = useState({
    companyName: '',
    cnpj: '',
    type: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    customDomain: '',
    commission: 15
  });

  const steps = [
    { number: 1, label: "Parceiro + Admin", icon: Building2 },
    { number: 2, label: "Whitelabel", icon: Palette },
    { number: 3, label: "Ativar Parceiro", icon: CheckCircle }
  ];

  const resetForm = () => {
    setPartnerForm({
      companyName: '',
      cnpj: '',
      type: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      customDomain: '',
      commission: 15
    });
    setCurrentStep(1);
  };

  const handleOpenWizard = () => {
    resetForm();
    setWizardOpen(true);
  };

  const handleActivatePartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      companyName: partnerForm.companyName,
      cnpj: partnerForm.cnpj,
      type: partnerForm.type,
      adminName: partnerForm.adminName,
      adminEmail: partnerForm.adminEmail,
      adminPhone: partnerForm.adminPhone,
      whitelabel: {
        primaryColor: partnerForm.primaryColor,
        secondaryColor: partnerForm.secondaryColor,
        customDomain: partnerForm.customDomain,
        commission: partnerForm.commission
      },
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPartners([...partners, newPartner]);
    setWizardOpen(false);
    resetForm();
    toast.success("Parceiro ativado com sucesso! Convite enviado.");
  };

  const getStatusBadge = (status: Partner['status']) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const, className: 'bg-emerald-500' },
      pending: { label: 'Pendente', variant: 'secondary' as const, className: 'bg-amber-500 text-white' },
      suspended: { label: 'Suspenso', variant: 'destructive' as const, className: '' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPartnerTypeLabel = (type: string) => {
    return PARTNER_TYPES.find(t => t.value === type)?.label || type;
  };

  const canAdvance = () => {
    if (currentStep === 1) {
      return partnerForm.companyName && partnerForm.type && partnerForm.adminName && partnerForm.adminEmail;
    }
    if (currentStep === 2) {
      return partnerForm.commission > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Parceiros" />
        <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Handshake className="h-6 w-6 text-primary" />
                  Gestão de Parceiros
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie parceiros de revenda e consultoria
                </p>
              </div>
              <Button onClick={handleOpenWizard} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Parceiro
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Parceiros</p>
                      <p className="text-2xl font-bold">{partners.length}</p>
                    </div>
                    <Handshake className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ativos</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {partners.filter(p => p.status === 'active').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-500/30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {partners.filter(p => p.status === 'pending').length}
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-amber-500/30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Comissão Média</p>
                      <p className="text-2xl font-bold">
                        {partners.length > 0 
                          ? Math.round(partners.reduce((acc, p) => acc + p.whitelabel.commission, 0) / partners.length)
                          : 0}%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Partners Table */}
            <Card>
              <CardHeader>
                <CardTitle>Parceiros Cadastrados</CardTitle>
                <CardDescription>Lista de todos os parceiros da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Administrador</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.companyName}</p>
                            <p className="text-sm text-muted-foreground">{partner.cnpj}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getPartnerTypeLabel(partner.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.adminName}</p>
                            <p className="text-sm text-muted-foreground">{partner.adminEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{partner.whitelabel.commission}%</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(partner.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Editar Whitelabel
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Wizard Dialog */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Novo Parceiro</DialogTitle>
            <DialogDescription>
              Cadastre um novo parceiro em 3 passos simples
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 py-4 border-b">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.number
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Parceiro + Admin */}
          {currentStep === 1 && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Parceiro */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Dados do Parceiro</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      placeholder="Ex: Consultoria ABC"
                      value={partnerForm.companyName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={partnerForm.cnpj}
                      onChange={(e) => setPartnerForm({ ...partnerForm, cnpj: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Parceria *</Label>
                    <Select
                      value={partnerForm.type}
                      onValueChange={(value) => setPartnerForm({ ...partnerForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dados do Administrador */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Administrador do Parceiro</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nome do Responsável *</Label>
                    <Input
                      id="adminName"
                      placeholder="Ex: João Silva"
                      value={partnerForm.adminName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, adminName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="email@parceiro.com"
                      value={partnerForm.adminEmail}
                      onChange={(e) => setPartnerForm({ ...partnerForm, adminEmail: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPhone">Telefone</Label>
                    <Input
                      id="adminPhone"
                      placeholder="(00) 00000-0000"
                      value={partnerForm.adminPhone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, adminPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Whitelabel */}
          {currentStep === 2 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Configuração Whitelabel</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        className="w-14 h-10 p-1 cursor-pointer"
                        value={partnerForm.primaryColor}
                        onChange={(e) => setPartnerForm({ ...partnerForm, primaryColor: e.target.value })}
                      />
                      <Input
                        value={partnerForm.primaryColor}
                        onChange={(e) => setPartnerForm({ ...partnerForm, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        className="w-14 h-10 p-1 cursor-pointer"
                        value={partnerForm.secondaryColor}
                        onChange={(e) => setPartnerForm({ ...partnerForm, secondaryColor: e.target.value })}
                      />
                      <Input
                        value={partnerForm.secondaryColor}
                        onChange={(e) => setPartnerForm({ ...partnerForm, secondaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customDomain" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Domínio Personalizado
                    </Label>
                    <Input
                      id="customDomain"
                      placeholder="parceiro.legacy.app"
                      value={partnerForm.customDomain}
                      onChange={(e) => setPartnerForm({ ...partnerForm, customDomain: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Opcional. Deixe em branco para usar o domínio padrão.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commission" className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Comissão (%) *
                    </Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      value={partnerForm.commission}
                      onChange={(e) => setPartnerForm({ ...partnerForm, commission: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Percentual de comissão sobre vendas do parceiro.</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium mb-3">Preview das Cores</p>
                <div className="flex gap-4">
                  <div 
                    className="w-20 h-20 rounded-lg shadow-sm flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: partnerForm.primaryColor }}
                  >
                    Primária
                  </div>
                  <div 
                    className="w-20 h-20 rounded-lg shadow-sm flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: partnerForm.secondaryColor }}
                  >
                    Secundária
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ativar Parceiro */}
          {currentStep === 3 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold">Resumo e Ativação</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Parceiro */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Dados do Parceiro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Empresa:</span>
                      <span className="font-medium">{partnerForm.companyName}</span>
                    </div>
                    {partnerForm.cnpj && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CNPJ:</span>
                        <span>{partnerForm.cnpj}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="outline">{getPartnerTypeLabel(partnerForm.type)}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Dados do Admin */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Administrador
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{partnerForm.adminName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{partnerForm.adminEmail}</span>
                    </div>
                    {partnerForm.adminPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span>{partnerForm.adminPhone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Whitelabel Config */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Configuração Whitelabel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: partnerForm.primaryColor }}
                      />
                      <span className="text-sm">Cor Primária</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: partnerForm.secondaryColor }}
                      />
                      <span className="text-sm">Cor Secundária</span>
                    </div>
                    {partnerForm.customDomain && (
                      <Badge variant="outline" className="gap-1">
                        <Globe className="h-3 w-3" />
                        {partnerForm.customDomain}
                      </Badge>
                    )}
                    <Badge className="bg-emerald-500 gap-1">
                      <Percent className="h-3 w-3" />
                      {partnerForm.commission}% comissão
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <Send className="h-4 w-4 inline mr-2" />
                  Ao ativar, um convite será enviado para <strong>{partnerForm.adminEmail}</strong> com as instruções de acesso.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between gap-2 pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setWizardOpen(false)}>
                Cancelar
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canAdvance()}
                  className="gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleActivatePartner}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Ativar Parceiro e Enviar Convite
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
