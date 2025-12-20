import { useState } from "react";
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
} from "lucide-react";
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

const AdminSales = () => {
  const [activations] = useState<Activation[]>(mockActivations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrigin, setFilterOrigin] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
                    <TableHead>Origem</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Add-ons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">MRR</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivations.map((activation) => (
                    <TableRow key={activation.id}>
                      <TableCell className="font-medium">{activation.company}</TableCell>
                      <TableCell>{getOriginBadge(activation.origin)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{activation.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {activation.addons.length > 0 ? (
                            activation.addons.slice(0, 2).map((addon, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {addon}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                          {activation.addons.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{activation.addons.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(activation.status)}</TableCell>
                      <TableCell>
                        {activation.responsible || (
                          <span className="text-muted-foreground">Automático</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(activation.date, "dd/MM/yy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {activation.mrr > 0 ? (
                          `R$ ${activation.mrr.toLocaleString("pt-BR")}`
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar Email
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
