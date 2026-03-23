/**
 * Gestão de Contratos – contratos de clientes, contratos de parceiros e minutas.
 */

import { useState, useMemo } from "react";
import {
  FileText,
  FilePlus,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Plus,
  Search,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getContractMetrics, type Contract, type ContractStatus } from "@/data/contractsData";
import { toast } from "@/hooks/use-toast";

const STATUS_CARDS: { key: keyof ReturnType<typeof getContractMetrics>; label: string; icon: React.ElementType; color: string }[] = [
  { key: "total", label: "Total", icon: FileText, color: "text-gray-700" },
  { key: "rascunhos", label: "Rascunhos", icon: FilePlus, color: "text-gray-600" },
  { key: "aguardando", label: "Aguardando", icon: Clock, color: "text-red-600" },
  { key: "ativos", label: "Ativos", icon: CheckCircle, color: "text-green-600" },
  { key: "expirados", label: "Expirados", icon: XCircle, color: "text-red-600" },
  { key: "cancelados", label: "Cancelados", icon: Ban, color: "text-gray-500" },
];

function statusBadgeClass(status: ContractStatus): string {
  switch (status) {
    case "Ativo":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Aguardando Assinatura":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "Aguardando Contra-assinatura":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Rascunho":
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    case "Expirado":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Cancelado":
      return "bg-gray-100 text-gray-500 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
}

function ContractsTable({
  contracts,
  onViewDetails,
}: {
  contracts: Contract[];
  onViewDetails: (c: Contract) => void;
}) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-gray-50/50">
        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium text-gray-700">Nenhum contrato cadastrado</p>
        <p className="text-sm text-gray-500 mt-1">
          Os contratos serão exibidos quando o módulo estiver integrado.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nº Contrato</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.number}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{c.clientName}</div>
                <div className="text-sm text-muted-foreground">{c.clientEmail}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className={statusBadgeClass(c.status)}>
                  {c.status}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {c.type}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => onViewDetails(c)}>
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function AdminContracts() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [contracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const metrics = getContractMetrics(contracts);

  const handleNovoContrato = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A integração de contratos será disponibilizada em breve.",
      variant: "default",
    });
  };

  const filteredContracts = useMemo(() => {
    let list = contracts;
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.number.toLowerCase().includes(q) ||
          c.clientName.toLowerCase().includes(q) ||
          c.clientEmail.toLowerCase().includes(q) ||
          (c.clientCnpj && c.clientCnpj.includes(q))
      );
    }
    return list;
  }, [contracts, statusFilter, search]);

  const displayMetric = (key: (typeof STATUS_CARDS)[number]["key"]) => metrics[key];

  const handleViewDetails = (_c: Contract) => {
    // TODO: navegar para detalhe ou abrir modal
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Contratos" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Contratos</h1>
            <p className="text-gray-500">Gerencie contratos de clientes, parceiros e minutas</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="border-b border-gray-200 bg-transparent p-0 gap-4">
              <TabsTrigger
                value="clientes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-legacy-500 data-[state=active]:shadow-none"
              >
                Contratos de Clientes
              </TabsTrigger>
              <TabsTrigger
                value="parceiros"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-legacy-500 data-[state=active]:shadow-none"
              >
                Contratos de Parceiros
              </TabsTrigger>
              <TabsTrigger
                value="minutas"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-legacy-500 data-[state=active]:shadow-none"
              >
                Minutas de Contratos
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {STATUS_CARDS.map(({ key, label, icon: Icon, color }) => (
                <Card key={key}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {label}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${color}`}>{displayMetric(key)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <TabsContent value="clientes" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, cliente, email ou CNPJ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Aguardando Assinatura">Aguardando Assinatura</SelectItem>
                    <SelectItem value="Aguardando Contra-assinatura">Aguardando Contra-assinatura</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Expirado">Expirado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
                    <CardDescription>
                      Gerencie contratos, envie para assinatura e dispare emails de senha
                    </CardDescription>
                  </div>
                  <Button
                    className="gap-2 bg-legacy-500 hover:bg-legacy-600 text-white"
                    onClick={handleNovoContrato}
                  >
                    <Plus className="h-4 w-4" />
                    Novo Contrato
                  </Button>
                </CardHeader>
                <CardContent>
                  <ContractsTable contracts={filteredContracts} onViewDetails={handleViewDetails} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parceiros" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contratos de Parceiros</CardTitle>
                  <CardDescription>Contratos vinculados a parceiros e afiliados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nenhum contrato de parceiro no momento.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="minutas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Minutas de Contratos</CardTitle>
                  <CardDescription>Rascunhos e modelos de contrato</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma minuta cadastrada.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
