/**
 * Página Admin: Gestão de Contratos
 * Lista e gerencia todos os contratos gerados
 */

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Plus, MoreVertical, Send, Download, Eye,
  CheckCircle, Clock, AlertCircle, XCircle, RefreshCw,
  Search, Building2, Pen, Mail, Copy, ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPDF, ContractData } from "@/components/contracts/ContractPDF";

interface Contract {
  id: string;
  contract_number: string;
  client_name: string;
  client_document: string;
  client_email: string;
  signatory_name: string;
  signatory_role: string;
  plan_name: string;
  plan_type: string;
  addons: string[];
  monthly_value: number;
  total_value: number;
  start_date: string;
  end_date: string;
  duration_months: number;
  status: string;
  sent_at: string | null;
  sent_count: number;
  client_signed_at: string | null;
  counter_signed_at: string | null;
  client_signature_token: string | null;
  created_at: string;
}

interface ContractMetrics {
  total: number;
  draft: number;
  pending_signature: number;
  pending_counter_signature: number;
  active: number;
  expired: number;
  cancelled: number;
  active_mrr: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Rascunho", color: "bg-gray-500", icon: <FileText className="h-3 w-3" /> },
  pending_signature: { label: "Aguardando Assinatura", color: "bg-amber-500", icon: <Clock className="h-3 w-3" /> },
  pending_counter_signature: { label: "Aguardando Contra-Assinatura", color: "bg-blue-500", icon: <Pen className="h-3 w-3" /> },
  active: { label: "Ativo", color: "bg-emerald-500", icon: <CheckCircle className="h-3 w-3" /> },
  expired: { label: "Expirado", color: "bg-red-500", icon: <AlertCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelado", color: "bg-gray-400", icon: <XCircle className="h-3 w-3" /> },
  suspended: { label: "Suspenso", color: "bg-orange-500", icon: <AlertCircle className="h-3 w-3" /> },
};

export default function AdminContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [metrics, setMetrics] = useState<ContractMetrics>({
    total: 0, draft: 0, pending_signature: 0, pending_counter_signature: 0,
    active: 0, expired: 0, cancelled: 0, active_mrr: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // Modal de detalhes
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Estado de ações
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      // NOTE: contracts table doesn't exist yet, using mock data
      // When table is created, uncomment the Supabase query below
      /*
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setContracts(data || []);
      calculateMetrics(data || []);
      */
      
      // Use mock data for development
      const mockData = getMockContracts();
      setContracts(mockData);
      calculateMetrics(mockData);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      const mockData = getMockContracts();
      setContracts(mockData);
      calculateMetrics(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (data: Contract[]) => {
    const m: ContractMetrics = {
      total: data.length,
      draft: data.filter(c => c.status === 'draft').length,
      pending_signature: data.filter(c => c.status === 'pending_signature').length,
      pending_counter_signature: data.filter(c => c.status === 'pending_counter_signature').length,
      active: data.filter(c => c.status === 'active').length,
      expired: data.filter(c => c.status === 'expired').length,
      cancelled: data.filter(c => c.status === 'cancelled').length,
      active_mrr: data.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthly_value, 0),
    };
    setMetrics(m);
  };

  const handleSendContract = async (contract: Contract) => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contract-email', {
        body: {
          contract_id: contract.id,
          email_type: 'signature_request',
        },
      });

      if (error) throw error;

      toast.success("Contrato enviado com sucesso!");
      await fetchContracts();
    } catch (error) {
      console.error("Error sending contract:", error);
      toast.error("Erro ao enviar contrato");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReminder = async (contract: Contract) => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contract-email', {
        body: {
          contract_id: contract.id,
          email_type: 'reminder',
        },
      });

      if (error) throw error;

      toast.success("Lembrete enviado!");
      await fetchContracts();
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Erro ao enviar lembrete");
    } finally {
      setIsSending(false);
    }
  };

  const handleCounterSign = async (contract: Contract) => {
    try {
      // NOTE: contracts table doesn't exist yet, updating locally
      setContracts(prev => prev.map(c => 
        c.id === contract.id 
          ? { ...c, status: 'active', counter_signed_at: new Date().toISOString() }
          : c
      ));
      calculateMetrics(contracts.map(c => 
        c.id === contract.id 
          ? { ...c, status: 'active', counter_signed_at: new Date().toISOString() }
          : c
      ));

      toast.success("Contrato ativado com sucesso!");

      // Enviar cópia do contrato
      await supabase.functions.invoke('send-contract-email', {
        body: {
          contract_id: contract.id,
          email_type: 'contract_copy',
        },
      });

      await fetchContracts();
    } catch (error) {
      console.error("Error counter-signing:", error);
      toast.error("Erro ao contra-assinar contrato");
    }
  };

  const copySignatureLink = (contract: Contract) => {
    if (contract.client_signature_token) {
      const url = `${window.location.origin}/contract/sign/${contract.client_signature_token}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  const getPDFData = (contract: Contract): ContractData => ({
    contractNumber: contract.contract_number,
    status: contract.status as any,
    clientName: contract.client_name,
    clientDocument: contract.client_document,
    clientEmail: contract.client_email,
    signatoryName: contract.signatory_name,
    signatoryRole: contract.signatory_role,
    planName: contract.plan_name,
    planType: contract.plan_type,
    addons: contract.addons || [],
    monthlyValue: contract.monthly_value,
    totalValue: contract.total_value,
    startDate: contract.start_date,
    endDate: contract.end_date,
    durationMonths: contract.duration_months,
    clientSignedAt: contract.client_signed_at || undefined,
    counterSignedAt: contract.counter_signed_at || undefined,
    generatedAt: contract.created_at,
  });

  // Filtrar contratos
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesTab = activeTab === 'all' || contract.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Contratos" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Contratos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie todos os contratos da plataforma
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchContracts} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button onClick={() => window.location.href = '/admin/contract-templates'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Contrato
                </Button>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{metrics.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-500">{metrics.draft}</p>
                  <p className="text-xs text-muted-foreground">Rascunhos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-500">{metrics.pending_signature}</p>
                  <p className="text-xs text-muted-foreground">Aguardando</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-500">{metrics.pending_counter_signature}</p>
                  <p className="text-xs text-muted-foreground">Contra-Assinar</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-500">{metrics.active}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">{metrics.expired}</p>
                  <p className="text-xs text-muted-foreground">Expirados</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    R$ {metrics.active_mrr.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">MRR Ativo</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e Busca */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por empresa, número ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="pending_signature">Aguardando Assinatura</SelectItem>
                      <SelectItem value="pending_counter_signature">Contra-Assinatura</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Contratos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lista de Contratos</CardTitle>
                <CardDescription>
                  {filteredContracts.length} contratos encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vigência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : filteredContracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum contrato encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContracts.map((contract) => {
                        const statusConfig = STATUS_CONFIG[contract.status] || STATUS_CONFIG.draft;
                        const daysToExpiry = differenceInDays(new Date(contract.end_date), new Date());
                        
                        return (
                          <TableRow key={contract.id}>
                            <TableCell>
                              <div>
                                <p className="font-mono font-medium">{contract.contract_number}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{contract.client_name}</p>
                                  <p className="text-xs text-muted-foreground">{contract.client_document}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{contract.plan_name}</Badge>
                              {contract.addons?.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  +{contract.addons.length} add-on(s)
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">
                                R$ {contract.monthly_value.toLocaleString('pt-BR')}/mês
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Total: R$ {contract.total_value.toLocaleString('pt-BR')}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{contract.duration_months} meses</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(contract.start_date), "dd/MM/yy")} - {format(new Date(contract.end_date), "dd/MM/yy")}
                              </p>
                              {contract.status === 'active' && daysToExpiry < 30 && daysToExpiry > 0 && (
                                <Badge variant="outline" className="mt-1 text-amber-500 border-amber-500">
                                  {daysToExpiry}d para expirar
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusConfig.color}>
                                {statusConfig.icon}
                                <span className="ml-1">{statusConfig.label}</span>
                              </Badge>
                              {contract.sent_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Enviado {contract.sent_count}x
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => { setSelectedContract(contract); setShowDetailsModal(true); }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  
                                  {contract.status === 'draft' && (
                                    <DropdownMenuItem onClick={() => handleSendContract(contract)} disabled={isSending}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Enviar para Assinatura
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {contract.status === 'pending_signature' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleSendReminder(contract)} disabled={isSending}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Enviar Lembrete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => copySignatureLink(contract)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copiar Link de Assinatura
                                      </DropdownMenuItem>
                                      {contract.client_signature_token && (
                                        <DropdownMenuItem onClick={() => window.open(`/contract/sign/${contract.client_signature_token}`, '_blank')}>
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          Abrir Link de Assinatura
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}
                                  
                                  {contract.status === 'pending_counter_signature' && (
                                    <DropdownMenuItem onClick={() => handleCounterSign(contract)}>
                                      <Pen className="h-4 w-4 mr-2" />
                                      Contra-Assinar e Ativar
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <PDFDownloadLink
                                    document={<ContractPDF data={getPDFData(contract)} />}
                                    fileName={`${contract.contract_number}.pdf`}
                                  >
                                    {({ loading }) => (
                                      <DropdownMenuItem disabled={loading}>
                                        <Download className="h-4 w-4 mr-2" />
                                        {loading ? "Gerando..." : "Baixar PDF"}
                                      </DropdownMenuItem>
                                    )}
                                  </PDFDownloadLink>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contrato {selectedContract.contract_number}
                </DialogTitle>
                <DialogDescription>
                  Detalhes completos do contrato
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={STATUS_CONFIG[selectedContract.status]?.color || 'bg-gray-500'}>
                    {STATUS_CONFIG[selectedContract.status]?.label || selectedContract.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedContract.client_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.client_document}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signatário</p>
                    <p className="font-medium">{selectedContract.signatory_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.signatory_role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Plano</p>
                    <p className="font-medium">{selectedContract.plan_name}</p>
                    {selectedContract.addons?.length > 0 && (
                      <p className="text-sm text-muted-foreground">Add-ons: {selectedContract.addons.join(', ')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="font-medium">R$ {selectedContract.monthly_value.toLocaleString('pt-BR')}/mês</p>
                    <p className="text-sm text-muted-foreground">Total: R$ {selectedContract.total_value.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Início</p>
                    <p className="font-medium">{format(new Date(selectedContract.start_date), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Término</p>
                    <p className="font-medium">{format(new Date(selectedContract.end_date), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prazo</p>
                    <p className="font-medium">{selectedContract.duration_months} meses</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Assinaturas</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {selectedContract.client_signed_at ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm">{selectedContract.signatory_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedContract.client_signed_at 
                            ? format(new Date(selectedContract.client_signed_at), "dd/MM/yyyy HH:mm")
                            : 'Pendente'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedContract.counter_signed_at ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm">Legacy OS</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedContract.counter_signed_at 
                            ? format(new Date(selectedContract.counter_signed_at), "dd/MM/yyyy HH:mm")
                            : 'Pendente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Fechar
                </Button>
                <PDFDownloadLink
                  document={<ContractPDF data={getPDFData(selectedContract)} />}
                  fileName={`${selectedContract.contract_number}.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading}>
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? "Gerando..." : "Baixar Contrato"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock data
function getMockContracts(): Contract[] {
  return [
    {
      id: '1',
      contract_number: 'CONT-2026-0001',
      client_name: 'Empresa ABC Ltda',
      client_document: '12.345.678/0001-90',
      client_email: 'contato@empresaabc.com.br',
      signatory_name: 'João Silva',
      signatory_role: 'Diretor de Governança',
      plan_name: 'Profissional',
      plan_type: 'governance_plus',
      addons: ['riscos', 'pessoas'],
      monthly_value: 8497,
      total_value: 203928,
      start_date: '2025-12-31',
      end_date: '2027-12-30',
      duration_months: 24,
      status: 'active',
      sent_at: '2025-12-15T10:00:00Z',
      sent_count: 1,
      client_signed_at: '2025-12-20T11:30:00Z',
      counter_signed_at: '2025-12-20T11:35:00Z',
      client_signature_token: null,
      created_at: '2025-12-10T08:00:00Z',
    },
    {
      id: '2',
      contract_number: 'CONT-2026-0002',
      client_name: 'Tech Solutions XYZ S.A.',
      client_document: '98.765.432/0001-10',
      client_email: 'legal@techxyz.com.br',
      signatory_name: 'Maria Santos',
      signatory_role: 'CEO',
      plan_name: 'Business',
      plan_type: 'legacy_360',
      addons: ['esg', 'inteligencia', 'cap_table'],
      monthly_value: 15997,
      total_value: 383928,
      start_date: '2026-01-14',
      end_date: '2028-01-13',
      duration_months: 24,
      status: 'pending_signature',
      sent_at: '2026-01-10T14:00:00Z',
      sent_count: 2,
      client_signed_at: null,
      counter_signed_at: null,
      client_signature_token: 'abc123def456',
      created_at: '2026-01-05T09:00:00Z',
    },
    {
      id: '3',
      contract_number: 'CONT-2026-0003',
      client_name: 'Indústria Nacional ME',
      client_document: '55.555.555/0001-55',
      client_email: 'diretoria@industria.com.br',
      signatory_name: 'Pedro Oliveira',
      signatory_role: 'Sócio-Administrador',
      plan_name: 'Essencial',
      plan_type: 'core',
      addons: [],
      monthly_value: 3997,
      total_value: 47964,
      start_date: '2026-02-01',
      end_date: '2027-01-31',
      duration_months: 12,
      status: 'pending_counter_signature',
      sent_at: '2026-01-08T16:00:00Z',
      sent_count: 1,
      client_signed_at: '2026-01-12T09:45:00Z',
      counter_signed_at: null,
      client_signature_token: 'xyz789',
      created_at: '2026-01-08T15:00:00Z',
    },
    {
      id: '4',
      contract_number: 'CONT-2026-0004',
      client_name: 'Governança Corporativa Ltda',
      client_document: '11.222.333/0001-44',
      client_email: 'admin@govcorp.com.br',
      signatory_name: 'Carlos Oliveira',
      signatory_role: 'Diretor Financeiro',
      plan_name: 'Enterprise',
      plan_type: 'enterprise',
      addons: ['esg', 'inteligencia', 'desempenho'],
      monthly_value: 14997,
      total_value: 359928,
      start_date: '2026-01-20',
      end_date: '2029-01-19',
      duration_months: 36,
      status: 'draft',
      sent_at: null,
      sent_count: 0,
      client_signed_at: null,
      counter_signed_at: null,
      client_signature_token: null,
      created_at: '2026-01-15T10:30:00Z',
    },
    {
      id: '5',
      contract_number: 'CONT-2025-0045',
      client_name: 'Consultoria Estratégica Ltda',
      client_document: '33.444.555/0001-22',
      client_email: 'contato@consultoria.com.br',
      signatory_name: 'Roberto Mendes',
      signatory_role: 'Sócio-Diretor',
      plan_name: 'Profissional',
      plan_type: 'governance_plus',
      addons: ['riscos'],
      monthly_value: 4796,
      total_value: 57552,
      start_date: '2025-06-15',
      end_date: '2026-06-14',
      duration_months: 12,
      status: 'expired',
      sent_at: '2025-06-10T11:00:00Z',
      sent_count: 1,
      client_signed_at: '2025-06-12T14:20:00Z',
      counter_signed_at: '2025-06-12T14:25:00Z',
      client_signature_token: null,
      created_at: '2025-06-05T09:00:00Z',
    },
    {
      id: '6',
      contract_number: 'CONT-2025-0038',
      client_name: 'Gestão Avançada S.A.',
      client_document: '77.888.999/0001-33',
      client_email: 'admin@gestao.com.br',
      signatory_name: 'Fernanda Costa',
      signatory_role: 'CFO',
      plan_name: 'Business',
      plan_type: 'legacy_360',
      addons: ['esg', 'inteligencia'],
      monthly_value: 8997,
      total_value: 215928,
      start_date: '2025-09-10',
      end_date: '2027-09-09',
      duration_months: 24,
      status: 'cancelled',
      sent_at: '2025-09-05T10:00:00Z',
      sent_count: 1,
      client_signed_at: '2025-09-08T15:30:00Z',
      counter_signed_at: null,
      client_signature_token: null,
      created_at: '2025-09-01T08:00:00Z',
    },
    {
      id: '7',
      contract_number: 'CONT-2026-0005',
      client_name: 'Inovação Digital S.A.',
      client_document: '55.666.777/0001-88',
      client_email: 'financeiro@inovacao.com.br',
      signatory_name: 'Ana Paula',
      signatory_role: 'Diretora Executiva',
      plan_name: 'Enterprise',
      plan_type: 'enterprise',
      addons: ['esg', 'inteligencia', 'desempenho', 'cap_table'],
      monthly_value: 14997,
      total_value: 359928,
      start_date: '2026-02-15',
      end_date: '2029-02-14',
      duration_months: 36,
      status: 'active',
      sent_at: '2026-01-20T09:00:00Z',
      sent_count: 1,
      client_signed_at: '2026-01-25T11:00:00Z',
      counter_signed_at: '2026-01-25T11:05:00Z',
      client_signature_token: null,
      created_at: '2026-01-18T14:00:00Z',
    },
    {
      id: '8',
      contract_number: 'CONT-2026-0006',
      client_name: 'Família Empresarial Ltda',
      client_document: '22.333.444/0001-55',
      client_email: 'governanca@familia.com.br',
      signatory_name: 'José da Silva',
      signatory_role: 'Presidente',
      plan_name: 'Profissional',
      plan_type: 'governance_plus',
      addons: ['pessoas', 'riscos'],
      monthly_value: 4796,
      total_value: 115104,
      start_date: '2026-03-01',
      end_date: '2028-02-29',
      duration_months: 24,
      status: 'pending_signature',
      sent_at: '2026-01-22T16:00:00Z',
      sent_count: 1,
      client_signed_at: null,
      counter_signed_at: null,
      client_signature_token: 'token123456',
      created_at: '2026-01-20T10:00:00Z',
    },
  ];
}
