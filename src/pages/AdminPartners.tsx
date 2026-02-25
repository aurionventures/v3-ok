/**
 * Gestão de Parceiros – lista de parceiros, métricas e aba de convites.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  CheckCircle,
  Building2,
  Percent,
  Gift,
  FileText,
  Plus,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MOCK_PARTNERS, getPartnersMetrics, type Partner, type PartnerType } from "@/data/partnersData";

const METRIC_CARDS = [
  { key: "total", label: "Total de Parceiros", icon: Handshake, color: "text-gray-600" },
  { key: "ativos", label: "Ativos", icon: CheckCircle, color: "text-green-600" },
  { key: "pendentes", label: "Pendentes", icon: Building2, color: "text-orange-500" },
  { key: "comissaoMedia", label: "Comissão Média", icon: Percent, color: "text-gray-600" },
  { key: "convitesPendentes", label: "Convites Pendentes", icon: Gift, color: "text-blue-500" },
  { key: "contratosPendentes", label: "Contratos Pendentes", icon: FileText, color: "text-violet-500" },
] as const;

export default function AdminPartners() {
  const navigate = useNavigate();
  const [partners] = useState<Partner[]>(MOCK_PARTNERS);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const metrics = getPartnersMetrics(partners);

  const filteredPartners =
    typeFilter === "all"
      ? partners
      : partners.filter((p) => p.type === typeFilter);

  const displayValue = (key: (typeof METRIC_CARDS)[number]["key"]) => {
    switch (key) {
      case "total":
        return metrics.total;
      case "ativos":
        return metrics.ativos;
      case "pendentes":
        return metrics.pendentes;
      case "comissaoMedia":
        return metrics.comissaoMedia;
      case "convitesPendentes":
        return metrics.convitesPendentes;
      case "contratosPendentes":
        return metrics.contratosPendentes;
      default:
        return "—";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Gestão de Parceiros"
          rightExtra={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate("/admin/partners/tiers")}
              >
                Configuração de Tiers
              </Button>
              <Button
                className="gap-2 bg-legacy-500 hover:bg-legacy-600 text-white"
                onClick={() => {}}
              >
                <Plus className="h-4 w-4" />
                Novo Parceiro
              </Button>
            </div>
          }
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Parceiros</h1>
            <p className="text-gray-500">Gerencie parceiros, convites e comissões</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {METRIC_CARDS.map(({ key, label, icon: Icon, color }) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayValue(key)}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="parceiros" className="space-y-4">
            <TabsList className="border-b border-gray-200 bg-transparent p-0 gap-4">
              <TabsTrigger
                value="parceiros"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-legacy-500 data-[state=active]:shadow-none"
              >
                Parceiros
              </TabsTrigger>
              <TabsTrigger
                value="convites"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-legacy-500 data-[state=active]:shadow-none"
              >
                Convites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parceiros" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Parceiros Cadastrados</CardTitle>
                    <CardDescription>Lista de todos os parceiros da plataforma</CardDescription>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todos os Tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      {(["Afiliado", "Consultoria", "Revenda", "Integrador", "Parceiro"] as PartnerType[]).map(
                        (t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[70px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPartners.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{p.companyName}</div>
                              <div className="text-sm text-muted-foreground">{p.document}</div>
                            </div>
                          </TableCell>
                          <TableCell>{p.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant={p.status === "Ativo" ? "default" : "secondary"}
                              className={
                                p.status === "Ativo"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              }
                            >
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Alterar status</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="convites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Convites pendentes</CardTitle>
                  <CardDescription>Convites enviados aguardando aceite</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nenhum convite pendente no momento.
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
