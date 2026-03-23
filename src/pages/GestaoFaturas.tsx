import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  FileText,
  Building2,
  MoreVertical,
  Download,
  Send,
  Eye,
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

type StatusFatura = "pago" | "pendente" | "vencido";

interface Fatura {
  id: string;
  ref: string;
  cliente: string;
  cnpj: string | null;
  descricao: string;
  valor: number;
  vencimento: string;
  dataPagamento?: string;
  diasAtraso?: number;
  status: StatusFatura;
}

const GestaoFaturas = () => {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todas" | StatusFatura>("todas");
  const faturasData: Fatura[] = [];

  const faturasFiltradas = useMemo(() => {
    let list = faturasData;
    if (filtroStatus !== "todas") {
      list = list.filter((f) => f.status === filtroStatus);
    }
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.cliente.toLowerCase().includes(q) ||
          f.descricao.toLowerCase().includes(q)
      );
    }
    return list;
  }, [busca, filtroStatus]);

  const totais = useMemo(() => {
    const pagas = faturasData.filter((f) => f.status === "pago");
    const pendentes = faturasData.filter((f) => f.status === "pendente");
    const vencidas = faturasData.filter((f) => f.status === "vencido");
    const recebido = pagas.reduce((s, f) => s + f.valor, 0);
    const aReceber = pendentes.reduce((s, f) => s + f.valor, 0);
    const emAtraso = vencidas.reduce((s, f) => s + f.valor, 0);
    const total = recebido + emAtraso;
    const taxa = total > 0 ? Math.round((recebido / total) * 100) : 0;
    return {
      recebido,
      qtdPagas: pagas.length,
      aReceber,
      qtdPendentes: pendentes.length,
      emAtraso,
      qtdVencidas: vencidas.length,
      taxaRecebimento: taxa,
    };
  }, [faturasData]);

  const tabs = [
    { value: "todas" as const, label: "Todas" },
    { value: "pendente" as const, label: "Pendentes" },
    { value: "vencido" as const, label: "Vencidas" },
    { value: "pago" as const, label: "Pagas" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Faturas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Faturas</h1>
            <p className="text-gray-500">Acompanhe e gerencie as faturas dos clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">Recebido</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totais.recebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totais.qtdPagas} fatura(s) paga(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">A Receber</CardTitle>
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  R$ {totais.aReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totais.qtdPendentes} fatura(s) pendente(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">Em Atraso</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totais.emAtraso.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totais.qtdVencidas} fatura(s) vencida(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Taxa de Recebimento
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-700">{totais.taxaRecebimento}%</p>
                <p className="text-xs text-muted-foreground mt-1">últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex rounded-md border bg-background p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFiltroStatus(tab.value)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded transition-colors",
                    filtroStatus === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>Faturas</CardTitle>
                  <CardDescription>
                    {faturasFiltradas.length} fatura(s) encontrada(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Nenhuma fatura encontrada</p>
                        <p className="text-sm">As faturas dos clientes aparecerão aqui.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    faturasFiltradas.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{f.id}</p>
                          <p className="text-xs text-muted-foreground">Ref: {f.ref}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="font-medium">{f.cliente}</p>
                            {f.cnpj && (
                              <p className="text-xs text-muted-foreground">{f.cnpj}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{f.descricao}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {f.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{f.vencimento}</p>
                          {f.status === "pago" && f.dataPagamento && (
                            <p className="text-xs text-green-600">Pago em {f.dataPagamento}</p>
                          )}
                          {f.status === "vencido" && f.diasAtraso !== undefined && (
                            <p className="text-xs text-red-600">
                              {f.diasAtraso} dia(s) em atraso
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {f.status === "pago" && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Pago
                          </Badge>
                        )}
                        {f.status === "vencido" && (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200 gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Vencido
                          </Badge>
                        )}
                        {f.status === "pendente" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver fatura
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Reenviar por e-mail
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GestaoFaturas;
