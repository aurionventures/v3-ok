import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Users,
  DollarSign,
  UserMinus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Calendar,
  Globe,
  Handshake,
  Building2,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { calculateCommission, PartnerTier } from "@/config/partnerTiers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activation {
  id: string;
  company: string;
  origin: "landing" | "direct" | "partner";
  plan: string;
  addons: string[];
  status: "trial" | "active" | "pending" | "churned";
  responsible: string | null;
  date: Date;
  mrr: number;
}

const mockActivations: Activation[] = [
  {
    id: "1",
    company: "Tech Solutions Ltda",
    origin: "landing",
    plan: "Professional",
    addons: ["Relatórios Avançados", "API Access"],
    status: "active",
    responsible: null,
    date: new Date("2024-12-18"),
    mrr: 1499,
  },
  {
    id: "2",
    company: "Grupo Industrial ABC",
    origin: "direct",
    plan: "Enterprise",
    addons: ["Multi-Empresa", "Insights IA", "Compliance"],
    status: "active",
    responsible: "Carlos Silva",
    date: new Date("2024-12-15"),
    mrr: 4999,
  },
  {
    id: "3",
    company: "Família Oliveira Holdings",
    origin: "partner",
    plan: "Professional",
    addons: ["Relatórios Avançados"],
    status: "trial",
    responsible: "Parceiro XYZ",
    date: new Date("2024-12-14"),
    mrr: 999,
  },
  {
    id: "4",
    company: "StartupFlow SA",
    origin: "landing",
    plan: "Starter",
    addons: [],
    status: "trial",
    responsible: null,
    date: new Date("2024-12-12"),
    mrr: 299,
  },
  {
    id: "5",
    company: "Construtora Delta",
    origin: "direct",
    plan: "Professional",
    addons: ["API Access"],
    status: "pending",
    responsible: "Ana Costa",
    date: new Date("2024-12-10"),
    mrr: 1299,
  },
  {
    id: "6",
    company: "Agro Partners",
    origin: "partner",
    plan: "Enterprise",
    addons: ["Multi-Empresa", "Compliance"],
    status: "active",
    responsible: "Parceiro ABC",
    date: new Date("2024-12-08"),
    mrr: 3999,
  },
  {
    id: "7",
    company: "Varejo Express",
    origin: "landing",
    plan: "Starter",
    addons: [],
    status: "churned",
    responsible: null,
    date: new Date("2024-11-20"),
    mrr: 0,
  },
];

interface OriginSalesMetrics {
  origin: string;
  totalSales: number;
  totalMRR: number;
  totalCommissions: number;
  averageTicket: number;
  cac: number;
}

const AdminSales = () => {
  const [activations] = useState<Activation[]>(mockActivations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrigin, setFilterOrigin] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedActivation, setSelectedActivation] = useState<Activation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [originMetrics, setOriginMetrics] = useState<OriginSalesMetrics[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  
  useEffect(() => {
    loadContractsAndMetrics();
  }, []);
  
  const loadContractsAndMetrics = async () => {
    try {
      // Buscar contratos ativos
      const { data: contractsData, error } = await supabase
        .from('contracts')
        .select('*, partner:partner_id(id, settings)')
        .in('status', ['active', 'trial']);
      
      if (error) {
        console.error('Erro ao buscar contratos:', error);
        setContracts([]);
        return;
      }
      
      setContracts(contractsData || []);
      calculateOriginSalesMetrics(contractsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };
  
  const calculateOriginSalesMetrics = (contractsData: any[]) => {
    const origins = ['landing', 'direct', 'partner'];
    const metrics: OriginSalesMetrics[] = [];
    
    for (const origin of origins) {
      const originContracts = contractsData.filter(c => {
        if (origin === 'partner') {
          return c.partner_id || c.affiliate_token;
        } else if (origin === 'direct') {
          return c.origin === 'SLG' || (!c.partner_id && !c.affiliate_token);
        } else {
          return c.origin === 'PLG' && !c.partner_id;
        }
      });
      
      const totalMRR = originContracts.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
      const averageTicket = originContracts.length > 0 ? totalMRR / originContracts.length : 0;
      
      // Calcular comissões devidas (apenas para partner)
      let totalCommissions = 0;
      if (origin === 'partner') {
        for (const contract of originContracts) {
          if (contract.partner_id && contract.partner) {
            const partner = contract.partner;
            const tier = partner.settings?.partner_tier || 'tier_3_simple';
            // Vendas via parceiro são 'originated' (geradas pelo parceiro via link de afiliado)
            const saleOrigin = 'originated';
            const planValue = (contract.monthly_value || 0) * 12;
            
            const commission = calculateCommission(
              tier as PartnerTier,
              saleOrigin as 'originated' | 'received',
              planValue,
              0,
              12
            );
            
            totalCommissions += commission.totalCommission;
          }
        }
      }
      
      // Calcular CAC
      const marketingSpend: Record<string, number> = {
        'landing': 5000,
        'direct': 3000,
        'partner': 0
      };
      
      const cac = originContracts.length > 0 
        ? marketingSpend[origin] / originContracts.length 
        : 0;
      
      metrics.push({
        origin,
        totalSales: originContracts.length,
        totalMRR,
        totalCommissions,
        averageTicket,
        cac
      });
    }
    
    setOriginMetrics(metrics);
  };

  const getOriginBadge = (origin: string) => {
    const config = {
      landing: { label: "Landing", icon: Globe, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      direct: { label: "Venda Direta", icon: Building2, className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
      partner: { label: "Parceiro", icon: Handshake, className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
    };
    const { label, icon: Icon, className } = config[origin as keyof typeof config] || config.landing;
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      trial: { label: "Trial", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      active: { label: "Ativo", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      pending: { label: "Pendente", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
      churned: { label: "Churn", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    };
    const { label, className } = config[status as keyof typeof config] || config.pending;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // Filter activations
  const filteredActivations = activations.filter((a) => {
    const matchesSearch = a.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigin = filterOrigin === "all" || a.origin === filterOrigin;
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesOrigin && matchesStatus;
  });

  // Calculate metrics
  const thisMonthActivations = activations.filter(
    (a) => a.date.getMonth() === new Date().getMonth() && a.status !== "churned"
  ).length;

  const conversionRate = Math.round(
    (activations.filter((a) => a.status === "active").length /
      activations.filter((a) => a.origin === "landing").length) *
      100
  );

  const averageTicket = Math.round(
    activations.filter((a) => a.status === "active").reduce((sum, a) => sum + a.mrr, 0) /
      activations.filter((a) => a.status === "active").length
  );

  const churnRate = Math.round(
    (activations.filter((a) => a.status === "churned").length / activations.length) * 100
  );

  const totalMRR = activations
    .filter((a) => a.status === "active" || a.status === "trial")
    .reduce((sum, a) => sum + a.mrr, 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Vendas & Ativações" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ativações (Mês)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{thisMonthActivations}</div>
                <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Landing → Pago</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  R$ {averageTicket.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">MRR por cliente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserMinus className="h-4 w-4" />
                  Churn Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{churnRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Taxa de cancelamento</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  MRR Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  R$ {totalMRR.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Receita recorrente</p>
              </CardContent>
            </Card>
          </div>

          {/* Métricas por Origem */}
          {originMetrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas por Origem de Venda</CardTitle>
                <CardDescription>
                  Acompanhe vendas, MRR, comissões devidas e CAC por tipo de origem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {originMetrics.map((metric) => {
                    const originConfig: Record<string, { label: string; icon: any; color: string }> = {
                      'landing': { label: 'Landing (ISCA)', icon: Globe, color: 'bg-blue-500' },
                      'direct': { label: 'Venda Direta', icon: Building2, color: 'bg-purple-500' },
                      'partner': { label: 'Parceiro/Afiliado', icon: Handshake, color: 'bg-amber-500' }
                    };
                    
                    const config = originConfig[metric.origin] || originConfig['landing'];
                    const Icon = config.icon;
                    
                    return (
                      <Card key={metric.origin} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <CardTitle className="text-base">{config.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Vendas</p>
                              <p className="font-bold text-lg">{metric.totalSales}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">MRR Total</p>
                              <p className="font-bold text-lg text-primary">
                                R$ {metric.totalMRR.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Ticket Médio</p>
                              <p className="font-bold text-lg">
                                R$ {metric.averageTicket.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Comissões Devidas</p>
                              <p className="font-bold text-lg text-amber-600">
                                R$ {metric.totalCommissions.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground text-xs">CAC (Custo de Aquisição)</p>
                              <p className="font-bold text-lg text-blue-600">
                                R$ {metric.cac.toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <CardTitle>Ativações Recentes</CardTitle>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Origens</SelectItem>
                      <SelectItem value="landing">Landing</SelectItem>
                      <SelectItem value="direct">Venda Direta</SelectItem>
                      <SelectItem value="partner">Parceiro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Status</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="churned">Churn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">MRR</TableHead>
                    <TableHead className="text-right w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivations.map((activation) => (
                    <TableRow key={activation.id}>
                      <TableCell className="font-medium">{activation.company}</TableCell>
                      <TableCell>{getStatusBadge(activation.status)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {activation.mrr > 0 ? (
                          `R$ ${activation.mrr.toLocaleString("pt-BR")}`
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedActivation(activation);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ativação</DialogTitle>
            <DialogDescription>
              Informações completas sobre a ativação
            </DialogDescription>
          </DialogHeader>
          {selectedActivation && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="text-base font-semibold">{selectedActivation.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedActivation.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Origem</label>
                  <div className="mt-1">{getOriginBadge(selectedActivation.origin)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plano</label>
                  <div className="mt-1">
                    <Badge variant="secondary">{selectedActivation.plan}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                  <p className="text-base">
                    {selectedActivation.responsible || (
                      <span className="text-muted-foreground">Automático</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Ativação</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">
                      {format(selectedActivation.date, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">MRR</label>
                  <p className="text-base font-semibold">
                    {selectedActivation.mrr > 0 ? (
                      `R$ ${selectedActivation.mrr.toLocaleString("pt-BR")}`
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </p>
                </div>
              </div>
              
              {selectedActivation.addons.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Add-ons</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedActivation.addons.map((addon, idx) => (
                      <Badge key={idx} variant="outline">
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSales;
