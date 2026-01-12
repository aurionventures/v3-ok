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
  Receipt,
  Search,
  MoreVertical,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Mail,
  RefreshCw,
  QrCode,
  Copy,
  ExternalLink,
  Send,
  Ban,
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { 
  Invoice, 
  INVOICE_STATUS_LABELS,
  InvoiceStatus,
} from "@/types/billing";
import { invoiceService, paymentService } from "@/services/asaasService";

// Mock de faturas para demonstração
const getMockInvoices = (): Invoice[] => {
  const stored = localStorage.getItem('billing_invoices');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Dados de demonstração
  const mockInvoices: Invoice[] = [
    {
      id: 'inv_1',
      invoice_number: 'NF-2026-0001',
      contract_id: 'cont_1',
      client_id: 'client_1',
      reference_period: '2026-01',
      description: 'Plano Profissional + Add-ons - Janeiro 2026',
      subtotal: 8497,
      discounts: 0,
      taxes: 0,
      total: 8497,
      due_date: '2026-01-10',
      paid_at: '2026-01-08T14:30:00Z',
      payment_method: 'pix',
      status: 'paid',
      asaas_payment_id: 'pay_123',
      reminders_sent: 0,
      created_at: '2026-01-01T10:00:00Z',
      updated_at: '2026-01-08T14:30:00Z',
    },
    {
      id: 'inv_2',
      invoice_number: 'NF-2026-0002',
      contract_id: 'cont_1',
      client_id: 'client_1',
      reference_period: '2026-02',
      description: 'Plano Profissional + Add-ons - Fevereiro 2026',
      subtotal: 8497,
      discounts: 0,
      taxes: 0,
      total: 8497,
      due_date: '2026-02-10',
      status: 'pending',
      asaas_payment_id: 'pay_456',
      boleto_url: 'https://sandbox.asaas.com/b/pdf/12345',
      boleto_barcode: '23793.38128 60000.000003 00000.000405 1 84340000084970',
      pix_qrcode: '00020126580014br.gov.bcb.pix0136abc123',
      pix_qrcode_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      reminders_sent: 0,
      created_at: '2026-02-01T10:00:00Z',
      updated_at: '2026-02-01T10:00:00Z',
    },
    {
      id: 'inv_3',
      invoice_number: 'NF-2026-0003',
      contract_id: 'cont_2',
      client_id: 'client_2',
      reference_period: '2026-01',
      description: 'Setup + Primeira Mensalidade - Plano Business',
      subtotal: 21994,
      discounts: 0,
      taxes: 0,
      total: 21994,
      due_date: '2026-01-20',
      status: 'pending',
      asaas_payment_id: 'pay_789',
      boleto_url: 'https://sandbox.asaas.com/b/pdf/67890',
      reminders_sent: 1,
      last_reminder_at: '2026-01-15T09:00:00Z',
      created_at: '2026-01-10T09:00:00Z',
      updated_at: '2026-01-15T09:00:00Z',
    },
    {
      id: 'inv_4',
      invoice_number: 'NF-2025-0180',
      contract_id: 'cont_3',
      client_id: 'client_3',
      reference_period: '2025-12',
      description: 'Plano Essencial - Dezembro 2025',
      subtotal: 2997,
      discounts: 0,
      taxes: 0,
      total: 2997,
      due_date: '2025-12-10',
      status: 'overdue',
      asaas_payment_id: 'pay_999',
      reminders_sent: 3,
      last_reminder_at: '2025-12-25T09:00:00Z',
      created_at: '2025-12-01T10:00:00Z',
      updated_at: '2025-12-25T09:00:00Z',
    },
  ];
  
  localStorage.setItem('billing_invoices', JSON.stringify(mockInvoices));
  return mockInvoices;
};

// Mock de clientes
const MOCK_CLIENTS: Record<string, { name: string; cnpj: string }> = {
  'client_1': { name: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90' },
  'client_2': { name: 'Grupo XYZ S.A.', cnpj: '98.765.432/0001-10' },
  'client_3': { name: 'Indústria QWE Ltda', cnpj: '11.222.333/0001-44' },
};

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const data = getMockInvoices();
    // Atualizar status de faturas vencidas
    const today = new Date();
    const updated = data.map(inv => {
      if (inv.status === 'pending' && isPast(new Date(inv.due_date))) {
        return { ...inv, status: 'overdue' as InvoiceStatus };
      }
      return inv;
    });
    setInvoices(updated);
    localStorage.setItem('billing_invoices', JSON.stringify(updated));
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const config: Record<InvoiceStatus, { color: string; icon: React.ComponentType<any> }> = {
      pending: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", icon: Clock },
      paid: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: CheckCircle2 },
      overdue: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: AlertTriangle },
      cancelled: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300", icon: XCircle },
      refunded: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300", icon: RefreshCw },
    };
    
    const { color, icon: Icon } = config[status];
    
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {INVOICE_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      MOCK_CLIENTS[invoice.client_id]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleShowPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleSendReminder = async (invoice: Invoice) => {
    // Simular envio de lembrete
    const updated = invoices.map(inv => 
      inv.id === invoice.id 
        ? { 
            ...inv, 
            reminders_sent: inv.reminders_sent + 1,
            last_reminder_at: new Date().toISOString(),
          }
        : inv
    );
    setInvoices(updated);
    localStorage.setItem('billing_invoices', JSON.stringify(updated));
    toast.success(`Lembrete enviado para ${MOCK_CLIENTS[invoice.client_id]?.name}`);
  };

  const handleSimulatePayment = async (invoice: Invoice) => {
    // Simular pagamento
    const updated = invoices.map(inv => 
      inv.id === invoice.id 
        ? { 
            ...inv, 
            status: 'paid' as InvoiceStatus,
            paid_at: new Date().toISOString(),
            payment_method: 'pix',
          }
        : inv
    );
    setInvoices(updated);
    localStorage.setItem('billing_invoices', JSON.stringify(updated));
    toast.success('Pagamento registrado (simulado)');
    setIsPaymentModalOpen(false);
  };

  const handleCancelInvoice = async (invoice: Invoice) => {
    const updated = invoices.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'cancelled' as InvoiceStatus }
        : inv
    );
    setInvoices(updated);
    localStorage.setItem('billing_invoices', JSON.stringify(updated));
    toast.success('Fatura cancelada');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  // Métricas
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  
  const totalReceived = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Faturas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Recebido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalReceived)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paidInvoices.length} fatura(s) paga(s)
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    A Receber
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    {formatCurrency(totalPending)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingInvoices.length} fatura(s) pendente(s)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Em Atraso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(totalOverdue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overdueInvoices.length} fatura(s) vencida(s)
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Taxa de Recebimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {invoices.length > 0 
                      ? Math.round((paidInvoices.length / invoices.length) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    últimos 30 dias
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
                      placeholder="Buscar por número, cliente ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                    <TabsList>
                      <TabsTrigger value="all">Todas</TabsTrigger>
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="overdue">Vencidas</TabsTrigger>
                      <TabsTrigger value="paid">Pagas</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Faturas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Faturas
                </CardTitle>
                <CardDescription>
                  {filteredInvoices.length} fatura(s) encontrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => {
                      const client = MOCK_CLIENTS[invoice.client_id];
                      const daysOverdue = invoice.status === 'overdue' 
                        ? differenceInDays(new Date(), new Date(invoice.due_date))
                        : 0;
                      
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.invoice_number}</p>
                              <p className="text-xs text-muted-foreground">
                                Ref: {invoice.reference_period}
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
                            <p className="text-sm max-w-[200px] truncate">{invoice.description}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">
                                {format(new Date(invoice.due_date), "dd/MM/yyyy")}
                              </p>
                              {invoice.status === 'overdue' && (
                                <p className="text-xs text-red-600">
                                  {daysOverdue} dia(s) em atraso
                                </p>
                              )}
                              {invoice.status === 'paid' && invoice.paid_at && (
                                <p className="text-xs text-green-600">
                                  Pago em {format(new Date(invoice.paid_at), "dd/MM/yyyy")}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleShowPayment(invoice)}>
                                      <QrCode className="h-4 w-4 mr-2" />
                                      Ver Pagamento
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendReminder(invoice)}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Enviar Lembrete
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {invoice.status === 'paid' && (
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar NF-e
                                  </DropdownMenuItem>
                                )}
                                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelInvoice(invoice)}
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Cancelar Fatura
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {selectedInvoice?.invoice_number}
            </DialogTitle>
            <DialogDescription>
              Detalhes da fatura
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="text-xl font-bold">{formatCurrency(selectedInvoice.total)}</p>
                </div>
              </div>
              
              {/* Cliente */}
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{MOCK_CLIENTS[selectedInvoice.client_id]?.name}</p>
                <p className="text-sm text-muted-foreground">{MOCK_CLIENTS[selectedInvoice.client_id]?.cnpj}</p>
              </div>
              
              {/* Detalhes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Referência</p>
                  <p className="font-medium">{selectedInvoice.reference_period}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Vencimento</p>
                  <p className="font-medium">
                    {format(new Date(selectedInvoice.due_date), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
              
              {/* Descrição */}
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium">{selectedInvoice.description}</p>
              </div>
              
              {/* Valores */}
              <div className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.discounts > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descontos</span>
                    <span>-{formatCurrency(selectedInvoice.discounts)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>
              
              {/* Pagamento */}
              {selectedInvoice.status === 'paid' && selectedInvoice.paid_at && (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">
                      Pago em {format(new Date(selectedInvoice.paid_at), "dd/MM/yyyy 'às' HH:mm")}
                    </span>
                  </div>
                  {selectedInvoice.payment_method && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Via {selectedInvoice.payment_method.toUpperCase()}
                    </p>
                  )}
                </div>
              )}
              
              {/* Lembretes */}
              {selectedInvoice.reminders_sent > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedInvoice.reminders_sent} lembrete(s) enviado(s)
                  {selectedInvoice.last_reminder_at && (
                    <span> - Último em {format(new Date(selectedInvoice.last_reminder_at), "dd/MM/yyyy")}</span>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Dados de Pagamento
            </DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoice_number} - {formatCurrency(selectedInvoice?.total || 0)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <Tabs defaultValue="pix" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pix">PIX</TabsTrigger>
                <TabsTrigger value="boleto">Boleto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pix" className="space-y-4">
                {selectedInvoice.pix_qrcode_image ? (
                  <>
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <img 
                        src={selectedInvoice.pix_qrcode_image} 
                        alt="QR Code PIX"
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PIX Copia e Cola</label>
                      <div className="flex gap-2">
                        <Input 
                          value={selectedInvoice.pix_qrcode || ''} 
                          readOnly 
                          className="text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(selectedInvoice.pix_qrcode || '')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    QR Code PIX não disponível para esta fatura
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="boleto" className="space-y-4">
                {selectedInvoice.boleto_url ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Linha Digitável</label>
                      <div className="flex gap-2">
                        <Input 
                          value={selectedInvoice.boleto_barcode || ''} 
                          readOnly 
                          className="text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(selectedInvoice.boleto_barcode || '')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => window.open(selectedInvoice.boleto_url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Boleto PDF
                    </Button>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Boleto não disponível para esta fatura
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Fechar
            </Button>
            {selectedInvoice && selectedInvoice.status !== 'paid' && (
              <Button onClick={() => handleSimulatePayment(selectedInvoice)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Simular Pagamento
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvoices;
