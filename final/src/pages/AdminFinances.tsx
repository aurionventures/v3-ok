import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, FileSignature, DollarSign, CreditCard, QrCode, Receipt, 
  Settings, Activity, CheckCircle2, Clock, XCircle, AlertCircle,
  TrendingUp, Calendar, Filter, Eye, Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos
interface Contract {
  id: string;
  client_name: string;
  end_date: string;
  monthly_value: number;
  status: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: 'boleto' | 'pix' | 'credit_card';
  payment_date?: string;
}

interface Transaction {
  id: string;
  transaction_id: string;
  invoice_id: string;
  client_name: string;
  amount: number;
  payment_method: 'boleto' | 'pix' | 'credit_card';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  processed_at?: string;
  asaas_customer_id?: string;
  asaas_payment_id?: string;
}

interface PaymentConfig {
  api_key: string;
  environment: 'sandbox' | 'production';
  webhook_secret: string;
  enabled: boolean;
  boleto_enabled: boolean;
  pix_enabled: boolean;
  credit_card_enabled: boolean;
}

const AdminFinances = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'config'>('dashboard');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [config, setConfig] = useState<PaymentConfig>({
    api_key: '',
    environment: 'sandbox',
    webhook_secret: '',
    enabled: false,
    boleto_enabled: true,
    pix_enabled: true,
    credit_card_enabled: true,
  });

  // Dados mockados - Em produção, buscar do Supabase/AssaS
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      client_name: 'Grupo Insper',
      end_date: '2025-06-14',
      monthly_value: 2499,
      status: 'active',
    },
    {
      id: '2',
      client_name: 'Grupo Xavier',
      end_date: '2025-06-15',
      monthly_value: 999,
      status: 'active',
    },
    {
      id: '3',
      client_name: 'Família Almeida',
      end_date: '2025-06-19',
      monthly_value: 2499,
      status: 'active',
    },
    {
      id: '4',
      client_name: 'Tech Solutions',
      end_date: '2025-07-20',
      monthly_value: 8997,
      status: 'active',
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoice_number: 'FAT-2026-001',
      client_name: 'Empresa ABC',
      amount: 999,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      payment_method: 'boleto',
    },
    {
      id: '2',
      invoice_number: 'FAT-2026-002',
      client_name: 'Tech XYZ',
      amount: 2499,
      due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'overdue',
      payment_method: 'credit_card',
    },
    {
      id: '3',
      invoice_number: 'FAT-2026-003',
      client_name: 'Governança Corp',
      amount: 399,
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'overdue',
      payment_method: 'pix',
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      transaction_id: 'pay_abc123',
      invoice_id: '1',
      client_name: 'Empresa ABC',
      amount: 999,
      payment_method: 'boleto',
      status: 'pending',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      asaas_customer_id: 'cus_123',
      asaas_payment_id: 'pay_abc123',
    },
    {
      id: '2',
      transaction_id: 'pay_xyz789',
      invoice_id: '2',
      client_name: 'Tech XYZ',
      amount: 2499,
      payment_method: 'pix',
      status: 'completed',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      asaas_customer_id: 'cus_456',
      asaas_payment_id: 'pay_xyz789',
    },
    {
      id: '3',
      transaction_id: 'pay_def456',
      invoice_id: '3',
      client_name: 'Governança Corp',
      amount: 8997,
      payment_method: 'credit_card',
      status: 'completed',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      asaas_customer_id: 'cus_789',
      asaas_payment_id: 'pay_def456',
    },
    {
      id: '4',
      transaction_id: 'pay_ghi789',
      invoice_id: '4',
      client_name: 'Inovação Digital',
      amount: 14997,
      payment_method: 'pix',
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      asaas_customer_id: 'cus_012',
      asaas_payment_id: 'pay_ghi789',
    },
    {
      id: '5',
      transaction_id: 'pay_jkl012',
      invoice_id: '5',
      client_name: 'Consultoria Estratégica',
      amount: 4796,
      payment_method: 'boleto',
      status: 'failed',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      asaas_customer_id: 'cus_345',
      asaas_payment_id: 'pay_jkl012',
    },
  ]);

  // Algoritmo para calcular renovações próximas (próximos 30 dias)
  const upcomingRenewals = contracts.filter(contract => {
    const endDate = new Date(contract.end_date);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return contract.status === 'active' && 
           endDate >= today && 
           endDate <= thirtyDaysFromNow;
  }).sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());

  // Algoritmo para calcular faturas pendentes e vencidas
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.due_date);
    const today = new Date();
    return inv.status === 'pending' && dueDate < today;
  });

  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Cálculo de MRR
  const clientsByPlan = {
    basic: { count: 3, value: 399 },
    professional: { count: 6, value: 999 },
    enterprise: { count: 3, value: 2499 }
  };

  const totalMonthlyRevenue = 
    (clientsByPlan.basic.count * clientsByPlan.basic.value) +
    (clientsByPlan.professional.count * clientsByPlan.professional.value) +
    (clientsByPlan.enterprise.count * clientsByPlan.enterprise.value);

  // Estatísticas de pagamentos por método
  const paymentStats = {
    boleto: {
      total: transactions.filter(t => t.payment_method === 'boleto').length,
      amount: transactions.filter(t => t.payment_method === 'boleto' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      pending: transactions.filter(t => t.payment_method === 'boleto' && t.status === 'pending').length,
    },
    pix: {
      total: transactions.filter(t => t.payment_method === 'pix').length,
      amount: transactions.filter(t => t.payment_method === 'pix' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      pending: transactions.filter(t => t.payment_method === 'pix' && t.status === 'pending').length,
    },
    credit_card: {
      total: transactions.filter(t => t.payment_method === 'credit_card').length,
      amount: transactions.filter(t => t.payment_method === 'credit_card' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      pending: transactions.filter(t => t.payment_method === 'credit_card' && t.status === 'pending').length,
    },
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'boleto':
        return <Receipt className="h-4 w-4" />;
      case 'pix':
        return <QrCode className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'boleto':
        return 'Boleto';
      case 'pix':
        return 'PIX';
      case 'credit_card':
        return 'Cartão';
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      completed: { label: 'Concluído', variant: 'default' },
      pending: { label: 'Pendente', variant: 'secondary' },
      failed: { label: 'Falhou', variant: 'destructive' },
      refunded: { label: 'Reembolsado', variant: 'outline' },
    };
    const config = configs[status] || configs.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSaveConfig = () => {
    // Em produção, salvar no Supabase
    toast.success('Configuração da API AssaS salva com sucesso!');
    setConfigDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Finanças" />
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="transactions">Logs de Transações</TabsTrigger>
                <TabsTrigger value="config">Configuração AssaS</TabsTrigger>
              </TabsList>
              {activeTab === 'config' && (
                <Button onClick={() => setConfigDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Configuração
                </Button>
              )}
            </div>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">MRR (Receita Recorrente)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {totalMonthlyRevenue.toLocaleString()}</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% vs. último mês
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">ARR (Receita Anual)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {(totalMonthlyRevenue * 12).toLocaleString()}</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      Projeção anual
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8%</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      -2% vs. último mês
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">LTV Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ 45.2k</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      Lifetime Value
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Indicadores de Pagamentos por Método */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Pagamentos por Boleto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {paymentStats.boleto.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {paymentStats.boleto.total} transações
                    </div>
                    {paymentStats.boleto.pending > 0 && (
                      <div className="text-sm text-amber-600 mt-1">
                        {paymentStats.boleto.pending} pendente(s)
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Pagamentos por PIX
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {paymentStats.pix.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {paymentStats.pix.total} transações
                    </div>
                    {paymentStats.pix.pending > 0 && (
                      <div className="text-sm text-amber-600 mt-1">
                        {paymentStats.pix.pending} pendente(s)
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pagamentos por Cartão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {paymentStats.credit_card.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {paymentStats.credit_card.total} transações
                    </div>
                    {paymentStats.credit_card.pending > 0 && (
                      <div className="text-sm text-amber-600 mt-1">
                        {paymentStats.credit_card.pending} pendente(s)
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Faturas e Renovações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Faturas Pendentes e Vencidas</CardTitle>
                    <CardDescription>Gestão de inadimplência</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-medium">Aguardando Pagamento</p>
                          <p className="text-sm text-muted-foreground">{pendingInvoices.length} fatura(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {pendingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">Vencidas</p>
                          <p className="text-sm text-muted-foreground">{overdueInvoices.length} fatura(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">R$ {overdueAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline" asChild>
                        <Link to="/admin/faturas">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Todas as Faturas
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Renovações Próximas</CardTitle>
                    <CardDescription>Próximos 30 dias (calculado automaticamente)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingRenewals.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                          <p>Nenhuma renovação nos próximos 30 dias</p>
                        </div>
                      ) : (
                        upcomingRenewals.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{item.client_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(item.end_date), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">R$ {item.monthly_value.toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <Button className="w-full mt-4" variant="outline" asChild>
                        <Link to="/admin/contratos">
                          <FileSignature className="h-4 w-4 mr-2" />
                          Ver Contratos
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Logs de Transações */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logs de Transações AssaS</CardTitle>
                  <CardDescription>
                    Histórico completo de transações de pagamento (Boleto, PIX, Cartão)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Métodos</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="credit_card">Cartão</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="refunded">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Transação</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>AssaS ID</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">
                            {transaction.transaction_id}
                          </TableCell>
                          <TableCell>{transaction.client_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(transaction.payment_method)}
                              <span>{getPaymentMethodLabel(transaction.payment_method)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(new Date(transaction.created_at), "dd/MM/yyyy", { locale: ptBR })}</div>
                              <div className="text-muted-foreground text-xs">
                                {format(new Date(transaction.created_at), "HH:mm", { locale: ptBR })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {transaction.asaas_payment_id || '-'}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuração AssaS */}
            <TabsContent value="config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuração da API AssaS
                  </CardTitle>
                  <CardDescription>
                    Configure a integração com a API AssaS para processar pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Integração AssaS</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {config.enabled ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                    <Switch 
                      checked={config.enabled}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <Input
                        id="api_key"
                        type="password"
                        value={config.api_key}
                        onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
                        placeholder="sk_..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Chave de API do AssaS (sandbox ou produção)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="environment">Ambiente</Label>
                      <Select
                        value={config.environment}
                        onValueChange={(value: 'sandbox' | 'production') => 
                          setConfig(prev => ({ ...prev, environment: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                          <SelectItem value="production">Produção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhook_secret">Webhook Secret</Label>
                      <Input
                        id="webhook_secret"
                        type="password"
                        value={config.webhook_secret}
                        onChange={(e) => setConfig(prev => ({ ...prev, webhook_secret: e.target.value }))}
                        placeholder="whsec_..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Secret para validar webhooks do AssaS
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <Label>Métodos de Pagamento Habilitados</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            <span>Boleto Bancário</span>
                          </div>
                          <Switch 
                            checked={config.boleto_enabled}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({ ...prev, boleto_enabled: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4" />
                            <span>PIX</span>
                          </div>
                          <Switch 
                            checked={config.pix_enabled}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({ ...prev, pix_enabled: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Cartão de Crédito</span>
                          </div>
                          <Switch 
                            checked={config.credit_card_enabled}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({ ...prev, credit_card_enabled: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button onClick={handleSaveConfig} className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Salvar Configuração
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentação AssaS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Para obter sua API Key, acesse o painel do AssaS</p>
                    <p>• Configure o webhook URL: <code className="bg-muted px-1 rounded">https://seu-dominio.com/api/webhooks/asaas</code></p>
                    <p>• Em ambiente sandbox, use a API Key de testes</p>
                    <p>• O webhook secret garante a segurança das notificações</p>
                  </div>
                  <Button variant="outline" className="mt-4" asChild>
                    <a href="https://docs.asaas.com" target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Documentação Oficial
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminFinances;
