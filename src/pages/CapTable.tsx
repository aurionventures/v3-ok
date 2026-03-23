import { useState, useMemo } from "react";
import {
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { toast } from "@/hooks/use-toast";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useCapTable } from "@/hooks/useCapTable";
import type { CapTableShareholder } from "@/types/capTable";

const chartColors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];

const INITIAL_FORM = {
  participante: "",
  participacao_pct: "",
  tipo: "Pessoa Física",
  quotas: "",
  data_entrada: "",
  tipo_aquisicao: "Fundação",
  valor: "",
  familia: "true",
};

const CapTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [shareholderToDelete, setShareholderToDelete] = useState<CapTableShareholder | null>(null);

  const { empresas, isLoading: loadingEmpresas, firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { shareholders, isLoading, insertEntry, insertLoading, deleteEntry } =
    useCapTable(empresaId);

  const filteredShareholders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return shareholders.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(term);
      const matchesFilter =
        filterType === "all" ||
        (filterType === "family" && s.family) ||
        (filterType === "external" && !s.family) ||
        (filterType === "pf" && s.type === "Pessoa Física") ||
        (filterType === "pj" && s.type === "Pessoa Jurídica");
      return matchesSearch && matchesFilter;
    });
  }, [shareholders, searchTerm, filterType]);

  const chartData = useMemo(
    () =>
      shareholders.map((s, i) => ({
        name: s.name,
        value: s.percentage,
        fill: chartColors[i % chartColors.length],
      })),
    [shareholders]
  );

  const pctFamilia = useMemo(() => {
    const total = shareholders.reduce((a, s) => a + s.percentage, 0);
    if (total === 0) return 0;
    const familia = shareholders.filter((s) => s.family).reduce((a, s) => a + s.percentage, 0);
    return Math.round((familia / total) * 100);
  }, [shareholders]);

  const pctExterno = 100 - pctFamilia;
  const valorTotal = shareholders.reduce((a, s) => a + s.value, 0);

  const handleFormChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmitAdd = async () => {
    if (!empresaId) {
      toast({
        title: "Empresa não selecionada",
        description: "Selecione uma empresa primeiro.",
        variant: "destructive",
      });
      return;
    }
    if (!form.participante.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome do participante.",
        variant: "destructive",
      });
      return;
    }
    const pct = form.participacao_pct ? parseFloat(form.participacao_pct) : null;
    const { data, error } = await insertEntry({
      empresa_id: empresaId,
      participante: form.participante.trim(),
      participacao_pct: pct,
      tipo: form.tipo || null,
      quotas: form.quotas ? parseInt(form.quotas, 10) : null,
      data_entrada: form.data_entrada || null,
      tipo_aquisicao: form.tipo_aquisicao || null,
      valor: form.valor ? parseFloat(form.valor) : null,
      familia: form.familia === "true",
    });

    if (error) {
      toast({ title: "Erro ao cadastrar", description: error, variant: "destructive" });
      return;
    }
    toast({
      title: "Participante cadastrado",
      description: `${data?.name ?? form.participante} foi adicionado à Cap Table.`,
    });
    setIsAddOpen(false);
    setForm(INITIAL_FORM);
  };

  const handleDeleteClick = (s: CapTableShareholder) => setShareholderToDelete(s);

  const handleDeleteConfirm = async () => {
    if (!shareholderToDelete) return;
    const name = shareholderToDelete.name;
    const { error } = await deleteEntry(shareholderToDelete.id);
    setShareholderToDelete(null);
    if (error) {
      toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Participante removido", description: `${name} foi removido da Cap Table.` });
  };

  const hasEmpresas = empresas.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cap Table & Participações</h1>
              <p className="text-gray-600 mt-1">
                Gestão completa da estrutura societária e participações
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <NotificationBell />
            </div>
          </div>

          {hasEmpresas && (
            <div className="mb-6">
              <Button
                onClick={() => setIsAddOpen(true)}
                disabled={!empresaId || loadingEmpresas}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Participante
              </Button>
            </div>
          )}

          {!hasEmpresas ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Nenhuma empresa cadastrada</p>
                <p className="text-sm mt-1">
                  Cadastre uma empresa na tabela empresas do Supabase para usar a Cap Table.
                </p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Carregando Cap Table...
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="table">Tabela Detalhada</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição Atual - Cap Table</CardTitle>
                      <CardDescription>Participações por sócio/acionista</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <p className="font-medium">Nenhum participante cadastrado</p>
                            <p className="text-sm mt-1">
                              Clique em Cadastrar Participante para adicionar à Cap Table.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <ChartContainer
                          config={{ value: { label: "Participação %" } }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                label={({ name, value }) => `${name}: ${value}%`}
                                labelLine
                              >
                                {chartData.map((entry, i) => (
                                  <Cell key={`cell-${i}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo Executivo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {shareholders.length}
                          </div>
                          <div className="text-sm text-gray-600">Total de Sócios</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {shareholders.filter((s) => s.family).length}
                          </div>
                          <div className="text-sm text-gray-600">Membros da Família</div>
                        </div>
                      </div>

                      {shareholders.length > 0 && (
                        <>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Controle Familiar</span>
                              <span>{pctFamilia}%</span>
                            </div>
                            <Progress value={pctFamilia} className="mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Investidores Externos</span>
                              <span>{pctExterno}%</span>
                            </div>
                            <Progress value={pctExterno} className="mt-1" />
                          </div>
                        </>
                      )}

                      <div className="pt-4 border-t">
                        <div className="text-lg font-semibold">Valor Total Avaliado</div>
                        <div className="text-2xl font-bold text-legacy-500">
                          R$ {valorTotal.toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="table" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Cap Table Detalhado</CardTitle>
                        <CardDescription>Lista completa de participações societárias</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Importar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {shareholders.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p className="font-medium">Nenhum participante na Cap Table</p>
                        <p className="text-sm mt-1">
                          Cadastre o primeiro participante usando o botão acima.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-4 mb-6">
                          <div className="flex-1">
                            <Input
                              placeholder="Buscar por nome..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="max-w-sm"
                            />
                          </div>
                          <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="family">Apenas Família</SelectItem>
                              <SelectItem value="external">Apenas Externos</SelectItem>
                              <SelectItem value="pf">Pessoa Física</SelectItem>
                              <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome/Razão Social</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Participação %</TableHead>
                              <TableHead>Quotas/Ações</TableHead>
                              <TableHead>Data Entrada</TableHead>
                              <TableHead>Tipo Aquisição</TableHead>
                              <TableHead>Valor (R$)</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredShareholders.map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {s.name}
                                    {s.family && <Badge variant="secondary">Família</Badge>}
                                  </div>
                                </TableCell>
                                <TableCell>{s.type}</TableCell>
                                <TableCell className="font-medium">{s.percentage}%</TableCell>
                                <TableCell>{s.shares.toLocaleString()}</TableCell>
                                <TableCell>
                                  {new Date(s.entryDate).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{s.acquisitionType}</Badge>
                                </TableCell>
                                <TableCell>R$ {s.value.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" title="Visualizar">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Editar">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Remover"
                                      onClick={() => handleDeleteClick(s)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Dialog Cadastrar Participante */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Participante</DialogTitle>
            <DialogDescription>
              Adicione um novo participante à Cap Table
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="participante">Nome / Razão Social</Label>
              <Input
                id="participante"
                placeholder="Ex: João Silva (Fundador)"
                value={form.participante}
                onChange={(e) => handleFormChange("participante", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participacao_pct">Participação %</Label>
                <Input
                  id="participacao_pct"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 35.5"
                  value={form.participacao_pct}
                  onChange={(e) => handleFormChange("participacao_pct", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => handleFormChange("tipo", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                    <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quotas">Quotas / Ações</Label>
                <Input
                  id="quotas"
                  type="number"
                  placeholder="Ex: 355000"
                  value={form.quotas}
                  onChange={(e) => handleFormChange("quotas", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  placeholder="Ex: 1420000"
                  value={form.valor}
                  onChange={(e) => handleFormChange("valor", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_entrada">Data Entrada</Label>
                <Input
                  id="data_entrada"
                  type="date"
                  value={form.data_entrada}
                  onChange={(e) => handleFormChange("data_entrada", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_aquisicao">Tipo Aquisição</Label>
                <Select
                  value={form.tipo_aquisicao}
                  onValueChange={(v) => handleFormChange("tipo_aquisicao", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fundação">Fundação</SelectItem>
                    <SelectItem value="Herança">Herança</SelectItem>
                    <SelectItem value="Reorganização">Reorganização</SelectItem>
                    <SelectItem value="Compra">Compra</SelectItem>
                    <SelectItem value="Doação">Doação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familia">Membro da Família</Label>
              <Select value={form.familia} onValueChange={(v) => handleFormChange("familia", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitAdd} disabled={insertLoading}>
              {insertLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Excluir */}
      <AlertDialog
        open={!!shareholderToDelete}
        onOpenChange={(open) => !open && setShareholderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir participante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{shareholderToDelete?.name}</strong> da Cap
              Table?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CapTable;
