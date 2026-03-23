import { useState } from "react";
import {
  Building2,
  Search,
  PlusCircle,
  Filter,
  Download,
  Pencil,
  Loader2,
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
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEmpresasAll } from "@/hooks/useEmpresas";
import {
  insertEmpresa,
  insertEmpresaAdm,
  updateEmpresa,
  fetchEmpresaDetalhes,
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
  });

  const [editCompany, setEditCompany] = useState<Empresa | null>(null);
  const [editDetalhes, setEditDetalhes] = useState<EmpresaDetalhes | null>(null);
  const [editDetalhesLoading, setEditDetalhesLoading] = useState(false);
  const [editForm, setEditForm] = useState({ nome: "", razao_social: "", cnpj: "", ativo: true });
  const [isEditLoading, setIsEditLoading] = useState(false);

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
      toast({
        title: "Empresa criada, mas erro no ADM",
        description: errAdm,
        variant: "destructive",
      });
      setNewCompany({ nome: "", razao_social: "", cnpj: "", adm_email: "", adm_senha_provisoria: "" });
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
          altText="Copiar credenciais"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar credenciais
        </ToastAction>
      ),
    });

    setNewCompany({ nome: "", razao_social: "", cnpj: "", adm_email: "", adm_senha_provisoria: "" });
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
    setEditDetalhesLoading(true);
    const { data, error } = await fetchEmpresaDetalhes(empresa.id);
    setEditDetalhesLoading(false);
    if (error) {
      toast({ title: "Erro ao carregar detalhes", description: error, variant: "destructive" });
      setEditDetalhes({ empresa, adm: null });
    } else {
      setEditDetalhes(data ?? { empresa, adm: null });
    }
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
                  <div className="grid gap-4 py-4">
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
                          <Input
                            id="adm_senha"
                            type="password"
                            value={newCompany.adm_senha_provisoria}
                            onChange={(e) =>
                              setNewCompany((p) => ({ ...p, adm_senha_provisoria: e.target.value }))
                            }
                            className="col-span-3"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground col-span-4">
                          No primeiro acesso, o ADM deverá alterar a senha.
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
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editCompany} onOpenChange={() => { setEditCompany(null); setEditDetalhes(null); }}>
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
                  {editDetalhes?.adm && (
                    <div className="border-t pt-4 mt-2 space-y-3">
                      <p className="text-sm font-semibold text-muted-foreground">ADM da empresa</p>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Nome</Label>
                        <div className="col-span-3 text-sm py-2">{editDetalhes.adm.nome ?? "—"}</div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">E-mail</Label>
                        <div className="col-span-3 text-sm py-2">{editDetalhes.adm.email ?? "—"}</div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Senha alterada</Label>
                        <div className="col-span-3 text-sm py-2">
                          {editDetalhes.adm.senha_alterada ? "Sim" : "Não (primeiro acesso pendente)"}
                        </div>
                      </div>
                    </div>
                  )}
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
