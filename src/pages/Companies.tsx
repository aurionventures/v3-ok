import { useState } from "react";
import {
  Building2,
  Search,
  PlusCircle,
  Filter,
  Download,
  Pencil,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPlanos } from "@/data/planosStorage";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEmpresasAll } from "@/hooks/useEmpresas";
import {
  insertEmpresa,
  insertEmpresaAdm,
  updateEmpresa,
  deleteEmpresa,
  fetchEmpresaDetalhes,
  redefinirSenhaEmpresaAdm,
  type Empresa,
  type EmpresaDetalhes,
} from "@/services/empresas";
import { useQueryClient } from "@tanstack/react-query";
import { EMPRESAS_QUERY_KEY, EMPRESAS_ALL_QUERY_KEY } from "@/hooks/useEmpresas";

const Companies = () => {
  const queryClient = useQueryClient();
  const { empresas, isLoading, refetch } = useEmpresasAll();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [newCompany, setNewCompany] = useState({
    nome: "",
    razao_social: "",
    cnpj: "",
    adm_email: "",
    adm_senha_provisoria: "",
    plano_id: "",
  });

  const [editCompany, setEditCompany] = useState<Empresa | null>(null);
  const [editDetalhes, setEditDetalhes] = useState<EmpresaDetalhes | null>(null);
  const [editDetalhesLoading, setEditDetalhesLoading] = useState(false);
  const [editForm, setEditForm] = useState({ nome: "", razao_social: "", cnpj: "", ativo: true });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [admSenhaVisivel, setAdmSenhaVisivel] = useState(false);
  const [admSenhaProvisoria, setAdmSenhaProvisoria] = useState<string | null>(null);
  const [isRedefinirSenhaLoading, setIsRedefinirSenhaLoading] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);
  const [excluirConfirmacao, setExcluirConfirmacao] = useState("");
  const [isExcluirLoading, setIsExcluirLoading] = useState(false);
  const [novaEmpresaSenhaVisivel, setNovaEmpresaSenhaVisivel] = useState(false);

  const filteredCompanies = empresas.filter(
    (empresa) =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.razao_social ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.cnpj ?? "").includes(searchTerm)
  );

  const invalidateEmpresas = () => {
    void queryClient.invalidateQueries({ queryKey: EMPRESAS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: EMPRESAS_ALL_QUERY_KEY });
    void refetch();
  };

  const handleCreateCompany = async () => {
    const nome = newCompany.nome.trim();
    const admEmail = newCompany.adm_email.trim().toLowerCase();
    const admSenha = newCompany.adm_senha_provisoria;

    if (!nome) {
      toast({
        title: "Campos obrigatórios",
        description: "O nome da empresa é obrigatório",
        variant: "destructive",
      });
      return;
    }
    if (!admEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "O e-mail do ADM da empresa é obrigatório",
        variant: "destructive",
      });
      return;
    }
    if (!admSenha || admSenha.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha provisória deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsCreateLoading(true);
    const { data: empresaData, error: errEmpresa } = await insertEmpresa({
      nome,
      razao_social: newCompany.razao_social.trim() || null,
      cnpj: newCompany.cnpj.trim() || null,
    });

    if (errEmpresa || !empresaData) {
      setIsCreateLoading(false);
      toast({
        title: "Erro ao criar empresa",
        description: errEmpresa ?? "Erro desconhecido",
        variant: "destructive",
      });
      return;
    }

    const { error: errAdm } = await insertEmpresaAdm({
      empresa_id: empresaData.id,
      email: admEmail,
      senha_provisoria: admSenha,
      nome: `Administrador ${nome}`,
    });
    setIsCreateLoading(false);

    if (errAdm) {
      setNewCompany({ nome: "", razao_social: "", cnpj: "", adm_email: "", adm_senha_provisoria: "", plano_id: "" });
      setNovaEmpresaSenhaVisivel(false);
      setIsNewCompanyDialogOpen(false);
      invalidateEmpresas();
      return;
    }

    const credenciais = `E-mail: ${admEmail}\nSenha provisória: ${admSenha}`;
    toast({
      title: "Empresa criada",
      description: `${empresaData.nome} foi adicionada. O ADM deve alterar a senha no primeiro acesso.`,
      action: (
        <ToastAction
          altText="Copiar dados de acesso"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar dados de acesso
        </ToastAction>
      ),
    });

    setNewCompany({ nome: "", razao_social: "", cnpj: "", adm_email: "", adm_senha_provisoria: "", plano_id: "" });
    setNovaEmpresaSenhaVisivel(false);
    setIsNewCompanyDialogOpen(false);
    invalidateEmpresas();
  };

  const handleOpenEdit = async (empresa: Empresa) => {
    setEditCompany(empresa);
    setEditForm({
      nome: empresa.nome,
      razao_social: empresa.razao_social ?? "",
      cnpj: empresa.cnpj ?? "",
      ativo: empresa.ativo,
    });
    setEditDetalhes(null);
    setAdmSenhaProvisoria(null);
    setAdmSenhaVisivel(false);
    setEditDetalhesLoading(true);
    const { data, error } = await fetchEmpresaDetalhes(empresa.id);
    setEditDetalhesLoading(false);
    if (error) {
      setEditDetalhes({ empresa, adm: null });
      toast({
        title: "ADM não carregado",
        description: "Você pode editar a empresa. Faça login como admin@legacy.com para ver os dados do ADM.",
        variant: "destructive",
      });
    } else {
      setEditDetalhes(data ?? { empresa, adm: null });
    }
  };

  const handleRedefinirSenhaAdm = async () => {
    const adm = editDetalhes?.adm;
    if (!adm?.user_id) return;
    setIsRedefinirSenhaLoading(true);
    const { data, error } = await redefinirSenhaEmpresaAdm(adm.user_id);
    setIsRedefinirSenhaLoading(false);
    if (error) {
      toast({ title: "Erro ao redefinir senha", description: error, variant: "destructive" });
      return;
    }
    const senha = data?.senha_provisoria ?? "";
    setAdmSenhaProvisoria(senha);
    setAdmSenhaVisivel(true);
    const credenciais = `E-mail: ${adm.email}\nSenha provisória: ${senha}`;
    toast({
      title: "Nova senha provisória gerada",
      description: "O ADM deve alterar a senha no próximo acesso.",
      action: (
        <ToastAction
          altText="Copiar credenciais"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar credenciais
        </ToastAction>
      ),
    });
  };

  const handleSaveEdit = async () => {
    if (!editCompany) return;

    const nome = editForm.nome.trim();
    if (!nome) {
      toast({
        title: "Nome obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsEditLoading(true);
    const { error } = await updateEmpresa(editCompany.id, {
      nome,
      razao_social: editForm.razao_social.trim() || null,
      cnpj: editForm.cnpj.trim() || null,
      ativo: editForm.ativo,
    });
    setIsEditLoading(false);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Empresa atualizada" });
    setEditCompany(null);
    invalidateEmpresas();
  };

  const handleOpenExcluir = (empresa: Empresa) => {
    setEmpresaToDelete(empresa);
    setExcluirConfirmacao("");
  };

  const handleConfirmarExcluir = async () => {
    if (!empresaToDelete) return;
    if (excluirConfirmacao.trim().toLowerCase() !== empresaToDelete.nome.toLowerCase()) {
      toast({
        title: "Confirmação incorreta",
        description: `Digite o nome da empresa "${empresaToDelete.nome}" para confirmar a exclusão.`,
        variant: "destructive",
      });
      return;
    }
    setIsExcluirLoading(true);
    const { error } = await deleteEmpresa(empresaToDelete.id);
    setIsExcluirLoading(false);
    if (error) {
      toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Empresa excluída", description: `${empresaToDelete.nome} foi removida.` });
    setEmpresaToDelete(null);
    setExcluirConfirmacao("");
    invalidateEmpresas();
  };

  const handleToggleAtivo = async (empresa: Empresa) => {
    const { error } = await updateEmpresa(empresa.id, { ativo: !empresa.ativo });
    if (error) {
      toast({
        title: "Erro ao alterar status",
        description: error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: empresa.ativo ? "Empresa desativada" : "Empresa reativada",
    });
    invalidateEmpresas();
  };

  const ativas = filteredCompanies.filter((e) => e.ativo);
  const inativas = filteredCompanies.filter((e) => !e.ativo);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Empresas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Empresas</h1>
            <p className="text-gray-500">Gerencie as empresas da plataforma Legacy OS</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" disabled>
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isNewCompanyDialogOpen} onOpenChange={setIsNewCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                    <DialogDescription>
                      Preencha os dados da nova empresa. O ADM da empresa poderá criar membros e configurar a governança.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nome" className="text-right">
                            Nome*
                          </Label>
                          <Input
                            id="nome"
                            value={newCompany.nome}
                            onChange={(e) =>
                              setNewCompany((p) => ({ ...p, nome: e.target.value }))
                            }
                            className="col-span-3"
                            placeholder="Ex: Empresa Demo"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="razao_social" className="text-right">
                            Razão Social
                          </Label>
                          <Input
                            id="razao_social"
                            value={newCompany.razao_social}
                            onChange={(e) =>
                              setNewCompany((p) => ({ ...p, razao_social: e.target.value }))
                            }
                            className="col-span-3"
                            placeholder="Opcional"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cnpj" className="text-right">
                            CNPJ
                          </Label>
                          <Input
                            id="cnpj"
                            value={newCompany.cnpj}
                            onChange={(e) =>
                              setNewCompany((p) => ({ ...p, cnpj: e.target.value }))
                            }
                            className="col-span-3"
                            placeholder="00.000.000/0001-00"
                          />
                        </div>
                        <div className="border-t pt-4 mt-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Credenciais do ADM da empresa (acesso ao dashboard)
                          </p>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="adm_email" className="text-right">
                                E-mail do ADM*
                              </Label>
                              <Input
                                id="adm_email"
                                type="email"
                                value={newCompany.adm_email}
                                onChange={(e) =>
                                  setNewCompany((p) => ({ ...p, adm_email: e.target.value }))
                                }
                                className="col-span-3"
                                placeholder="adm@empresa.com"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="adm_senha" className="text-right">
                                Senha provisória*
                              </Label>
                              <div className="col-span-3 relative">
                                <Input
                                  id="adm_senha"
                                  type={novaEmpresaSenhaVisivel ? "text" : "password"}
                                  value={newCompany.adm_senha_provisoria}
                                  onChange={(e) =>
                                    setNewCompany((p) => ({ ...p, adm_senha_provisoria: e.target.value }))
                                  }
                                  className="pr-10"
                                  placeholder="Mínimo 6 caracteres"
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setNovaEmpresaSenhaVisivel((v) => !v)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  title={novaEmpresaSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                                >
                                  {novaEmpresaSenhaVisivel ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground col-span-4">
                              No primeiro acesso, o ADM deverá alterar a senha.
                            </p>
                          </div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Plano de assinatura
                          </p>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plano" className="text-right">
                              Plano
                            </Label>
                            <div className="col-span-3">
                              <Select
                                value={newCompany.plano_id || undefined}
                                onValueChange={(v) => setNewCompany((p) => ({ ...p, plano_id: v }))}
                              >
                                <SelectTrigger id="plano">
                                  <SelectValue placeholder="Selecione um plano" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getPlanos().map((plano) => (
                                    <SelectItem key={plano.id} value={plano.id}>
                                      {plano.name} — {plano.description} —{" "}
                                      {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 0,
                                      }).format(plano.valor ?? 0)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Os planos são configurados em Configurador de Planos.
                          </p>
                        </div>
                      </div>
                    </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleCreateCompany}
                      disabled={isCreateLoading}
                    >
                      {isCreateLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Adicionar Empresa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : empresas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="font-medium">Nenhuma empresa cadastrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie a primeira empresa para que o ADM possa cadastrar membros.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsNewCompanyDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">
                  Empresas Ativas ({ativas.length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inativas ({inativas.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todas ({filteredCompanies.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Razão Social</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ativas.map((empresa) => (
                          <TableRow key={empresa.id}>
                            <TableCell className="font-medium">
                              {empresa.nome}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.razao_social ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.cnpj ?? "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEdit(empresa)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleAtivo(empresa)}
                                >
                                  Desativar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleOpenExcluir(empresa)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Razão Social</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inativas.map((empresa) => (
                          <TableRow key={empresa.id}>
                            <TableCell className="font-medium">
                              {empresa.nome}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.razao_social ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.cnpj ?? "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEdit(empresa)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleAtivo(empresa)}
                                >
                                  Reativar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleOpenExcluir(empresa)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Razão Social</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompanies.map((empresa) => (
                          <TableRow key={empresa.id}>
                            <TableCell className="font-medium">
                              {empresa.nome}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.razao_social ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {empresa.cnpj ?? "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  empresa.ativo ? "default" : "destructive"
                                }
                              >
                                {empresa.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEdit(empresa)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleAtivo(empresa)}
                                >
                                  {empresa.ativo ? "Desativar" : "Reativar"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleOpenExcluir(empresa)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* AlertDialog Excluir Empresa */}
            <AlertDialog
              open={!!empresaToDelete}
              onOpenChange={(open) => {
                if (!open) {
                  setEmpresaToDelete(null);
                  setExcluirConfirmacao("");
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A empresa <strong>{empresaToDelete?.nome}</strong> e dados
                    relacionados serão removidos permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="excluir-confirm" className="text-sm font-medium">
                    Digite o nome da empresa para confirmar:
                  </Label>
                  <Input
                    id="excluir-confirm"
                    value={excluirConfirmacao}
                    onChange={(e) => setExcluirConfirmacao(e.target.value)}
                    placeholder={empresaToDelete?.nome}
                    className="mt-2"
                    autoComplete="off"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    disabled={
                      isExcluirLoading ||
                      excluirConfirmacao.trim().toLowerCase() !== (empresaToDelete?.nome ?? "").toLowerCase()
                    }
                    onClick={handleConfirmarExcluir}
                  >
                    {isExcluirLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Excluir
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editCompany}
        onOpenChange={(open) => {
          if (!open) {
            setEditCompany(null);
            setEditDetalhes(null);
            setAdmSenhaProvisoria(null);
            setAdmSenhaVisivel(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dados da Empresa</DialogTitle>
            <DialogDescription>
              Dados completos da empresa e do ADM.
            </DialogDescription>
          </DialogHeader>
          {editCompany && (
            <div className="grid gap-4 py-4">
              {editDetalhesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Empresa</p>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-nome" className="text-right">
                        Nome*
                      </Label>
                      <Input
                        id="edit-nome"
                        value={editForm.nome}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, nome: e.target.value }))
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-razao" className="text-right">
                        Razão Social
                      </Label>
                      <Input
                        id="edit-razao"
                        value={editForm.razao_social}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, razao_social: e.target.value }))
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-cnpj" className="text-right">
                        CNPJ
                      </Label>
                      <Input
                        id="edit-cnpj"
                        value={editForm.cnpj}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, cnpj: e.target.value }))
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Status</Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-ativo"
                          checked={editForm.ativo}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, ativo: e.target.checked }))
                          }
                          className="rounded"
                        />
                        <Label htmlFor="edit-ativo">Ativo</Label>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-2 space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">
                      ADM da empresa
                    </p>
                    {editDetalhes?.adm ? (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Nome</Label>
                          <div className="col-span-3 text-sm py-2">
                            {editDetalhes.adm.nome ?? "—"}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">E-mail</Label>
                          <div className="col-span-3 text-sm py-2">
                            {editDetalhes.adm.email ?? "—"}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Senha</Label>
                          <div className="col-span-3 flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type={admSenhaVisivel ? "text" : "password"}
                                readOnly
                                value={admSenhaProvisoria ?? "••••••••"}
                                className="pr-10 bg-muted font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setAdmSenhaVisivel((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                title={admSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                              >
                                {admSenhaVisivel ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRedefinirSenhaAdm}
                              disabled={isRedefinirSenhaLoading}
                            >
                              {isRedefinirSenhaLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              <span className="ml-1.5 hidden sm:inline">
                                Redefinir senha
                              </span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground col-span-4">
                          {admSenhaProvisoria
                            ? "Use o botão para copiar as credenciais e enviar ao ADM."
                            : "A senha não é exibida por segurança. Use \"Redefinir senha\" para gerar uma nova."}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum ADM vinculado a esta empresa. Crie a empresa novamente com credenciais ADM ou vincule um ADM manualmente.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditCompany(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isEditLoading}
            >
              {isEditLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
