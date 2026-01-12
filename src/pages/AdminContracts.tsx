import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileSignature,
  Search,
  MoreVertical,
  Eye,
  Download,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Mail,
  RefreshCw,
  Filter,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { 
  Contract, 
  CONTRACT_STATUS_LABELS,
  ContractStatus,
} from "@/types/billing";
import { contractService } from "@/services/asaasService";

// Mock de contratos para demonstração
const getMockContracts = (): Contract[] => {
  const stored = localStorage.getItem('billing_contracts');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Dados de demonstração
  const mockContracts: Contract[] = [
    {
      id: 'cont_1',
      contract_number: 'CONT-2026-0001',
      proposal_id: 'prop_1',
      client_id: 'client_1',
      plan_id: 'profissional',
      plan_name: 'Profissional',
      addons: ['riscos', 'pessoas'],
      monthly_value: 8497,
      annual_value: 101964,
      total_contract_value: 203928,
      setup_fee: 4497,
      start_date: '2026-01-01',
      end_date: '2027-12-31',
      term_months: 24,
      auto_renewal: true,
      renewal_notice_days: 30,
      signature_status: 'countersigned',
      client_signature: {
        signer_name: 'João Silva',
        signer_email: 'joao@empresa.com.br',
        signer_role: 'Diretor de Governança',
        signed_at: '2025-12-20T14:30:00Z',
        signature_ip: '189.123.45.67',
        signature_hash: 'abc123def456',
        signature_method: 'electronic',
      },
      company_signature: {
        signer_name: 'Legacy OS',
        signer_email: 'contratos@legacyos.com.br',
        signer_role: 'Sistema Automático',
        signed_at: '2025-12-20T14:35:00Z',
        signature_ip: '10.0.0.1',
        signature_hash: 'xyz789',
        signature_method: 'digital',
      },
      asaas_subscription_id: 'sub_123',
      asaas_customer_id: 'cus_123',
      contract_pdf_url: '#',
      signed_contract_pdf_url: '#',
      status: 'active',
      created_at: '2025-12-15T10:00:00Z',
      created_by: 'admin',
      updated_at: '2025-12-20T14:35:00Z',
    },
    {
      id: 'cont_2',
      contract_number: 'CONT-2026-0002',
      proposal_id: 'prop_2',
      client_id: 'client_2',
      plan_id: 'business',
      plan_name: 'Business',
      addons: ['riscos', 'esg', 'inteligencia'],
      monthly_value: 15997,
      annual_value: 191964,
      total_contract_value: 575892,
      setup_fee: 5997,
      start_date: '2026-01-15',
      end_date: '2028-01-14',
      term_months: 24,
      auto_renewal: true,
      renewal_notice_days: 30,
      signature_status: 'pending',
      asaas_customer_id: 'cus_456',
      status: 'pending_signature',
      created_at: '2026-01-10T09:00:00Z',
      created_by: 'admin',
      updated_at: '2026-01-10T09:00:00Z',
    },
    {
      id: 'cont_3',
      contract_number: 'CONT-2025-0015',
      proposal_id: 'prop_3',
      client_id: 'client_3',
      plan_id: 'essencial',
      plan_name: 'Essencial',
      addons: [],
      monthly_value: 2997,
      annual_value: 35964,
      total_contract_value: 35964,
      setup_fee: 2997,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      term_months: 12,
      auto_renewal: false,
      renewal_notice_days: 30,
      signature_status: 'countersigned',
      client_signature: {
        signer_name: 'Maria Santos',
        signer_email: 'maria@outraempresa.com.br',
        signer_role: 'CEO',
        signed_at: '2024-12-20T10:00:00Z',
        signature_ip: '200.100.50.25',
        signature_hash: 'def789',
        signature_method: 'electronic',
      },
      company_signature: {
        signer_name: 'Legacy OS',
        signer_email: 'contratos@legacyos.com.br',
        signer_role: 'Sistema Automático',
        signed_at: '2024-12-20T10:05:00Z',
        signature_ip: '10.0.0.1',
        signature_hash: 'ghi012',
        signature_method: 'digital',
      },
      asaas_subscription_id: 'sub_789',
      asaas_customer_id: 'cus_789',
      status: 'expired',
      created_at: '2024-12-15T14:00:00Z',
      created_by: 'admin',
      updated_at: '2025-12-31T23:59:59Z',
    },
  ];
  
  localStorage.setItem('billing_contracts', JSON.stringify(mockContracts));
  return mockContracts;
};

// Mock de clientes
const MOCK_CLIENTS: Record<string, { name: string; cnpj: string }> = {
  'client_1': { name: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90' },
  'client_2': { name: 'Grupo XYZ S.A.', cnpj: '98.765.432/0001-10' },
  'client_3': { name: 'Indústria QWE Ltda', cnpj: '11.222.333/0001-44' },
};

const AdminContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = () => {
    const data = getMockContracts();
    setContracts(data);
  };

  const getStatusBadge = (status: ContractStatus) => {
    const config: Record<ContractStatus, { color: string; icon: React.ComponentType<any> }> = {
      pending_signature: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", icon: Clock },
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: CheckCircle2 },
      suspended: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: AlertTriangle },
      cancelled: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300", icon: XCircle },
      expired: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300", icon: Calendar },
    };
    
    const { color, icon: Icon } = config[status];
    
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {CONTRACT_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      MOCK_CLIENTS[contract.client_id]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  const handleCancelContract = async () => {
    if (!selectedContract || !cancelReason) {
      toast.error("Informe o motivo do cancelamento");
      return;
    }
    
    await contractService.cancel(selectedContract.id, cancelReason);
    loadContracts();
    setIsCancelModalOpen(false);
    setCancelReason("");
    toast.success("Contrato cancelado");
  };

  const handleResendContract = (contract: Contract) => {
    toast.success(`Email reenviado para o cliente do contrato ${contract.contract_number}`);
  };

  // Métricas
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingContracts = contracts.filter(c => c.status === 'pending_signature').length;
  const totalMRR = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.monthly_value, 0);
  const totalContractValue = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.total_contract_value, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Contratos" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Contratos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{activeContracts}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    de {contracts.length} total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Aguardando Assinatura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{pendingContracts}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    contratos pendentes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    MRR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(totalMRR)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    receita recorrente mensal
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor Contratado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totalContractValue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    total em contratos ativos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número, cliente ou plano..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="active">Ativos</TabsTrigger>
                      <TabsTrigger value="pending_signature">Pendentes</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Contratos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  Contratos
                </CardTitle>
                <CardDescription>
                  {filteredContracts.length} contrato(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor Mensal</TableHead>
                      <TableHead>Vigência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => {
                      const client = MOCK_CLIENTS[contract.client_id];
                      const daysToExpire = differenceInDays(new Date(contract.end_date), new Date());
                      
                      return (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{contract.contract_number}</p>
                              <p className="text-xs text-muted-foreground">
                                Criado em {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{client?.name || 'Cliente'}</p>
                                <p className="text-xs text-muted-foreground">{client?.cnpj}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{contract.plan_name}</p>
                              {contract.addons.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  +{contract.addons.length} add-on(s)
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold">{formatCurrency(contract.monthly_value)}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">
                                {format(new Date(contract.start_date), "dd/MM/yyyy")} - {format(new Date(contract.end_date), "dd/MM/yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {contract.term_months} meses
                                {contract.status === 'active' && daysToExpire <= 60 && daysToExpire > 0 && (
                                  <span className="text-amber-600 ml-1">
                                    ({daysToExpire} dias restantes)
                                  </span>
                                )}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(contract.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(contract)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar PDF
                                </DropdownMenuItem>
                                {contract.status === 'pending_signature' && (
                                  <DropdownMenuItem onClick={() => handleResendContract(contract)}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Reenviar Email
                                  </DropdownMenuItem>
                                )}
                                {contract.status === 'active' && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedContract(contract);
                                      setIsCancelModalOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancelar Contrato
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Contrato {selectedContract?.contract_number}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos do contrato
            </DialogDescription>
          </DialogHeader>
          
          {selectedContract && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedContract.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Assinatura</p>
                  <Badge variant="outline">
                    {selectedContract.signature_status === 'countersigned' ? 'Assinado' :
                     selectedContract.signature_status === 'signed' ? 'Aguardando Contra-assinatura' :
                     'Pendente'}
                  </Badge>
                </div>
              </div>
              
              {/* Cliente */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Cliente
                </h4>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">{MOCK_CLIENTS[selectedContract.client_id]?.name}</p>
                  <p className="text-sm text-muted-foreground">{MOCK_CLIENTS[selectedContract.client_id]?.cnpj}</p>
                </div>
              </div>
              
              {/* Plano */}
              <div>
                <h4 className="font-medium mb-2">Plano Contratado</h4>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedContract.plan_name}</p>
                      {selectedContract.addons.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Add-ons: {selectedContract.addons.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(selectedContract.monthly_value)}/mês</p>
                      <p className="text-sm text-muted-foreground">
                        Total: {formatCurrency(selectedContract.total_contract_value)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vigência */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Vigência
                </h4>
                <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Início</p>
                    <p className="font-medium">
                      {format(new Date(selectedContract.start_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Término</p>
                    <p className="font-medium">
                      {format(new Date(selectedContract.end_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo</p>
                    <p className="font-medium">{selectedContract.term_months} meses</p>
                  </div>
                </div>
              </div>
              
              {/* Assinaturas */}
              {selectedContract.client_signature && (
                <div>
                  <h4 className="font-medium mb-2">Assinaturas</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedContract.client_signature.signer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedContract.client_signature.signer_role} - Cliente
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {format(new Date(selectedContract.client_signature.signed_at), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                    {selectedContract.company_signature && (
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedContract.company_signature.signer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedContract.company_signature.signer_role} - Legacy OS
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {format(new Date(selectedContract.company_signature.signed_at), "dd/MM/yyyy HH:mm")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Fechar
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Baixar Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Cancelamento */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Cancelar Contrato
            </DialogTitle>
            <DialogDescription>
              Esta ação cancelará o contrato {selectedContract?.contract_number} e 
              interromperá as cobranças recorrentes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                Atenção: O cancelamento é irreversível. O cliente perderá acesso 
                à plataforma ao final do período já pago.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo do Cancelamento *</label>
              <Input
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Voltar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelContract}
              disabled={!cancelReason}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContracts;
