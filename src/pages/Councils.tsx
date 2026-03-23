import React, { useState } from "react";
import { Users, Plus, Building2, Trash2, Loader2, Pencil, Eye, EyeOff, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  DialogTrigger,
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
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useGovernance } from "@/hooks/useGovernance";
import type { OrgaoGovernanca } from "@/types/governance";

const TIPOS_CONSELHO = ["administrativo", "fiscal", "consultivo", "outros"];
const TIPOS_COMITE = ["auditoria", "estrategia", "riscos", "outros"];
const TIPOS_COMISSAO = ["etica", "inovacao", "sustentabilidade", "outros"];
const NIVEIS = ["Estratégico", "Tático", "Operacional"];

function gerarSenhaAleatoria(len = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const Councils = () => {

  const [councilOpen, setCouncilOpen] = useState(false);
  const [councilNome, setCouncilNome] = useState("");
  const [councilTipo, setCouncilTipo] = useState("");
  const [councilDesc, setCouncilDesc] = useState("");
  const [councilQuorum, setCouncilQuorum] = useState(3);
  const [councilNivel, setCouncilNivel] = useState("");

  const [comiteOpen, setComiteOpen] = useState(false);
  const [comiteNome, setComiteNome] = useState("");
  const [comiteTipo, setComiteTipo] = useState("");
  const [comiteDesc, setComiteDesc] = useState("");
  const [comiteQuorum, setComiteQuorum] = useState(3);
  const [comiteNivel, setComiteNivel] = useState("");

  const [comissaoOpen, setComissaoOpen] = useState(false);
  const [comissaoNome, setComissaoNome] = useState("");
  const [comissaoTipo, setComissaoTipo] = useState("");
  const [comissaoDesc, setComissaoDesc] = useState("");
  const [comissaoQuorum, setComissaoQuorum] = useState(3);
  const [comissaoNivel, setComissaoNivel] = useState("");

  const [membroOpen, setMembroOpen] = useState(false);
  const [membroNome, setMembroNome] = useState("");
  const [membroCargo, setMembroCargo] = useState("");
  const [membroEmail, setMembroEmail] = useState("");
  const [membroSenhaProvisoria, setMembroSenhaProvisoria] = useState("");
  const [membroSenhaVisivel, setMembroSenhaVisivel] = useState(false);

  const [editarMembroOpen, setEditarMembroOpen] = useState(false);
  const [editarMembroId, setEditarMembroId] = useState<string | null>(null);
  const [editarMembroNome, setEditarMembroNome] = useState("");
  const [editarMembroCargo, setEditarMembroCargo] = useState("");

  const [alocarOpen, setAlocarOpen] = useState(false);
  const [alocarMembro, setAlocarMembro] = useState<string | null>(null);
  const [alocarTipo, setAlocarTipo] = useState<"conselho" | "comite" | "comissao">("conselho");
  const [alocarOrgaoId, setAlocarOrgaoId] = useState("");
  const [alocarCargo, setAlocarCargo] = useState("");

  const [verMembroOpen, setVerMembroOpen] = useState(false);
  const [verMembro, setVerMembro] = useState<{ id: string; nome: string; email: string | null; user_id: string | null } | null>(null);
  const [verSenhaGerada, setVerSenhaGerada] = useState<string | null>(null);

  const [membroToExcluir, setMembroToExcluir] = useState<{ id: string; nome: string } | null>(null);

  const { empresas, firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const {
    conselhos,
    comites,
    comissoes,
    membros,
    isLoading,
    totalMembrosAlocados,
    insertConselho,
    insertComite,
    insertComissao,
    insertMembro,
    insertMembroComAcesso,
    insertAlocacao,
    updateMembro,
    deleteConselho,
    deleteComite,
    deleteComissao,
    insertConselhoLoading,
    insertComiteLoading,
    insertComissaoLoading,
    insertMembroLoading,
    insertMembroComAcessoLoading,
    insertAlocacaoLoading,
    redefinirSenhaMembro,
    redefinirSenhaMembroLoading,
    excluirMembroDefinitivo,
    excluirMembroDefinitivoLoading,
    updateMembroLoading,
  } = useGovernance(empresaId);

  const handleCriarConselho = async () => {
    if (!councilNome.trim() || !empresaId) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    const { error } = await insertConselho({
      empresa_id: empresaId,
      nome: councilNome.trim(),
      tipo: councilTipo || null,
      descricao: councilDesc || null,
      quorum: councilQuorum,
      nivel: councilNivel || null,
    });
    if (error) {
      toast({ title: "Erro ao criar conselho", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Conselho criado" });
    setCouncilOpen(false);
    setCouncilNome("");
    setCouncilTipo("");
    setCouncilDesc("");
    setCouncilQuorum(3);
    setCouncilNivel("");
  };

  const handleCriarComite = async () => {
    if (!comiteNome.trim() || !empresaId) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    const { error } = await insertComite({
      empresa_id: empresaId,
      nome: comiteNome.trim(),
      tipo: comiteTipo || null,
      descricao: comiteDesc || null,
      quorum: comiteQuorum,
      nivel: comiteNivel || null,
    });
    if (error) {
      toast({ title: "Erro ao criar comitê", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Comitê criado" });
    setComiteOpen(false);
    setComiteNome("");
    setComiteTipo("");
    setComiteDesc("");
    setComiteQuorum(3);
    setComiteNivel("");
  };

  const handleCriarComissao = async () => {
    if (!comissaoNome.trim() || !empresaId) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    const { error } = await insertComissao({
      empresa_id: empresaId,
      nome: comissaoNome.trim(),
      tipo: comissaoTipo || null,
      descricao: comissaoDesc || null,
      quorum: comissaoQuorum,
      nivel: comissaoNivel || null,
    });
    if (error) {
      toast({ title: "Erro ao criar comissão", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Comissão criada" });
    setComissaoOpen(false);
    setComissaoNome("");
    setComissaoTipo("");
    setComissaoDesc("");
    setComissaoQuorum(3);
    setComissaoNivel("");
  };

  const handleCriarMembro = async () => {
    if (!empresaId) {
      toast({
        title: "Nenhuma empresa cadastrada",
        description: "Cadastre uma empresa em Admin > Empresas antes de criar membros.",
        variant: "destructive",
      });
      return;
    }
    if (!membroNome.trim()) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    const email = membroEmail.trim().toLowerCase();
    const senha = membroSenhaProvisoria;
    if (!email) {
      toast({ title: "E-mail é obrigatório para acesso ao portal", variant: "destructive" });
      return;
    }
    if (!senha || senha.length < 6) {
      toast({ title: "A senha provisória deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    const { error } = await insertMembroComAcesso({
      empresa_id: empresaId,
      nome: membroNome.trim(),
      cargo_principal: membroCargo.trim() || null,
      email,
      senha_provisoria: senha,
    });
    if (error) {
      toast({ title: "Erro ao criar membro", description: error, variant: "destructive" });
      return;
    }
    const credenciais = `E-mail: ${email}\nSenha provisória: ${senha}`;
    toast({
      title: "Membro criado com acesso",
      description: `Envie as credenciais ao membro. Ele deve alterar a senha no primeiro acesso.`,
      action: (
        <ToastAction
          altText="Copiar credenciais"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar credenciais
        </ToastAction>
      ),
    });
    setMembroOpen(false);
    setMembroNome("");
    setMembroCargo("");
    setMembroEmail("");
    setMembroSenhaProvisoria("");
    setMembroSenhaVisivel(false);
  };

  const handleAlocar = async () => {
    if (!alocarMembro || !alocarOrgaoId) {
      toast({ title: "Selecione o membro e o órgão", variant: "destructive" });
      return;
    }
    const payload =
      alocarTipo === "conselho"
        ? { membro_id: alocarMembro, conselho_id: alocarOrgaoId }
        : alocarTipo === "comite"
          ? { membro_id: alocarMembro, comite_id: alocarOrgaoId }
          : { membro_id: alocarMembro, comissao_id: alocarOrgaoId };
    const { error } = await insertAlocacao({ ...payload, cargo: alocarCargo.trim() || null });
    if (error) {
      toast({ title: "Erro ao alocar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Membro alocado" });
    setAlocarOpen(false);
    setAlocarMembro(null);
    setAlocarOrgaoId("");
    setAlocarCargo("");
  };

  const openAlocar = (membroId: string) => {
    setAlocarMembro(membroId);
    setAlocarOrgaoId("");
    setAlocarOpen(true);
  };

  const openEditarMembro = (m: { id: string; nome: string; cargoPrincipal: string | null }) => {
    setEditarMembroId(m.id);
    setEditarMembroNome(m.nome);
    setEditarMembroCargo(m.cargoPrincipal ?? "");
    setEditarMembroOpen(true);
  };

  const handleEditarMembro = async () => {
    if (!editarMembroId || !editarMembroNome.trim()) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    const { error } = await updateMembro(editarMembroId, {
      nome: editarMembroNome.trim(),
      cargo_principal: editarMembroCargo.trim() || null,
    });
    if (error) {
      toast({ title: "Erro ao atualizar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Membro atualizado" });
    setEditarMembroOpen(false);
    setEditarMembroId(null);
  };

  const orgaosParaAlocacao =
    alocarTipo === "conselho"
      ? conselhos
      : alocarTipo === "comite"
        ? comites
        : comissoes;

  const hasEmpresas = empresas.length > 0;

  function GovernanceCard({
    item,
    icon,
    onDelete,
    tipoLabel,
  }: {
    item: OrgaoGovernanca;
    icon: React.ReactNode;
    onDelete: () => void;
    tipoLabel: string;
  }) {
    return (
      <Card className="rounded-lg border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {icon}
                <h3 className="font-semibold text-base">{item.nome}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.descricao || "—"}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">
                  Tipo: {item.tipo || "—"}
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">
                  Quórum: {item.quorum}
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">
                  Nível: {item.nivel || "—"}
                </span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Membros: {item.membros}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Conselhos" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Configuração de Governança
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie conselhos, comitês e comissões da sua empresa
                </p>
              </div>

              {!hasEmpresas ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="font-medium">Nenhuma empresa cadastrada</p>
                  <p className="text-sm mt-1">Cadastre uma empresa para configurar a governança.</p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p>Carregando...</p>
                </div>
              ) : (
                <Tabs defaultValue="councils">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                      <TabsTrigger value="councils" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <Building2 className="mr-2 h-4 w-4" /> Conselhos
                      </TabsTrigger>
                      <TabsTrigger value="comites" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <Users className="mr-2 h-4 w-4" /> Comitês
                      </TabsTrigger>
                      <TabsTrigger value="comissoes" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <Users className="mr-2 h-4 w-4" /> Comissões
                      </TabsTrigger>
                      <TabsTrigger value="members" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <Users className="mr-2 h-4 w-4" /> Membros
                      </TabsTrigger>
                    </TabsList>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{totalMembrosAlocados}</strong> membros alocados
                    </div>
                  </div>

                  <TabsContent value="councils">
                    <div className="flex justify-end mb-4">
                      <Dialog open={councilOpen} onOpenChange={setCouncilOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Criar Conselho
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Criar Novo Conselho</DialogTitle>
                            <DialogDescription>Preencha as informações do novo conselho</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="councilName">Nome</Label>
                              <Input id="councilName" value={councilNome} onChange={(e) => setCouncilNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select value={councilTipo} onValueChange={setCouncilTipo}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIPOS_CONSELHO.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="councilDesc">Descrição</Label>
                              <Input id="councilDesc" value={councilDesc} onChange={(e) => setCouncilDesc(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Quórum</Label>
                                <Input type="number" min={1} value={councilQuorum} onChange={(e) => setCouncilQuorum(parseInt(e.target.value) || 3)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Nível</Label>
                                <Select value={councilNivel} onValueChange={setCouncilNivel}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {NIVEIS.map((n) => (
                                      <SelectItem key={n} value={n}>{n}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleCriarConselho} disabled={insertConselhoLoading}>
                              {insertConselhoLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Criar Conselho
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {conselhos.map((item) => (
                        <GovernanceCard
                          key={item.id}
                          item={item}
                          icon={<Building2 className="h-5 w-5" />}
                          tipoLabel="conselho"
                          onDelete={async () => {
                            const { error } = await deleteConselho(item.id);
                            if (error) toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
                            else toast({ title: "Conselho removido" });
                          }}
                        />
                      ))}
                      {conselhos.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Nenhum conselho cadastrado. Clique em Criar Conselho para adicionar.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="comites">
                    <div className="flex justify-end mb-4">
                      <Dialog open={comiteOpen} onOpenChange={setComiteOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Criar Comitê
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Criar Novo Comitê</DialogTitle>
                            <DialogDescription>Preencha as informações do novo comitê</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Nome</Label>
                              <Input value={comiteNome} onChange={(e) => setComiteNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select value={comiteTipo} onValueChange={setComiteTipo}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIPOS_COMITE.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Input value={comiteDesc} onChange={(e) => setComiteDesc(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Quórum</Label>
                                <Input type="number" min={1} value={comiteQuorum} onChange={(e) => setComiteQuorum(parseInt(e.target.value) || 3)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Nível</Label>
                                <Select value={comiteNivel} onValueChange={setComiteNivel}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {NIVEIS.map((n) => (
                                      <SelectItem key={n} value={n}>{n}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleCriarComite} disabled={insertComiteLoading}>
                              {insertComiteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Criar Comitê
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {comites.map((item) => (
                        <GovernanceCard
                          key={item.id}
                          item={item}
                          icon={<Users className="h-5 w-5" />}
                          tipoLabel="comitê"
                          onDelete={async () => {
                            const { error } = await deleteComite(item.id);
                            if (error) toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
                            else toast({ title: "Comitê removido" });
                          }}
                        />
                      ))}
                      {comites.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Nenhum comitê cadastrado. Clique em Criar Comitê para adicionar.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="comissoes">
                    <div className="flex justify-end mb-4">
                      <Dialog open={comissaoOpen} onOpenChange={setComissaoOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Criar Comissão
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Criar Nova Comissão</DialogTitle>
                            <DialogDescription>Preencha as informações da nova comissão</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Nome</Label>
                              <Input value={comissaoNome} onChange={(e) => setComissaoNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select value={comissaoTipo} onValueChange={setComissaoTipo}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIPOS_COMISSAO.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Input value={comissaoDesc} onChange={(e) => setComissaoDesc(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Quórum</Label>
                                <Input type="number" min={1} value={comissaoQuorum} onChange={(e) => setComissaoQuorum(parseInt(e.target.value) || 3)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Nível</Label>
                                <Select value={comissaoNivel} onValueChange={setComissaoNivel}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {NIVEIS.map((n) => (
                                      <SelectItem key={n} value={n}>{n}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleCriarComissao} disabled={insertComissaoLoading}>
                              {insertComissaoLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Criar Comissão
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {comissoes.map((item) => (
                        <GovernanceCard
                          key={item.id}
                          item={item}
                          icon={<Users className="h-5 w-5" />}
                          tipoLabel="comissão"
                          onDelete={async () => {
                            const { error } = await deleteComissao(item.id);
                            if (error) toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
                            else toast({ title: "Comissão removida" });
                          }}
                        />
                      ))}
                      {comissoes.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Nenhuma comissão cadastrada. Clique em Criar Comissão para adicionar.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="members">
                    <div className="flex justify-end mb-4">
                      <Dialog open={membroOpen} onOpenChange={setMembroOpen}>
                        <DialogTrigger asChild>
                          <Button className="shrink-0">
                            <Plus className="mr-2 h-4 w-4" /> Criar Membro
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Adicionar Membro</DialogTitle>
                            <DialogDescription>
                              Preencha as informações e credenciais de acesso. O membro usará o e-mail e a senha provisória para entrar no Portal de Membros.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Nome</Label>
                              <Input value={membroNome} onChange={(e) => setMembroNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Cargo Principal</Label>
                              <Input value={membroCargo} onChange={(e) => setMembroCargo(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>E-mail de acesso</Label>
                              <Input
                                type="email"
                                placeholder="membro@empresa.com"
                                value={membroEmail}
                                onChange={(e) => setMembroEmail(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Senha provisória (mín. 6 caracteres)</Label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Input
                                    type={membroSenhaVisivel ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={membroSenhaProvisoria}
                                    onChange={(e) => setMembroSenhaProvisoria(e.target.value)}
                                    className="pr-20"
                                  />
                                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() => setMembroSenhaProvisoria(gerarSenhaAleatoria())}
                                      className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                      title="Gerar senha"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setMembroSenhaVisivel((v) => !v)}
                                      className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                      title={membroSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                                    >
                                      {membroSenhaVisivel ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                O membro deve alterar a senha no primeiro acesso.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleCriarMembro} disabled={insertMembroComAcessoLoading}>
                              {insertMembroComAcessoLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Adicionar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-lg font-semibold mb-4">{membros.length} Membros • {totalMembrosAlocados} alocados em órgãos</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Cargo Principal</TableHead>
                          <TableHead>Órgãos Alocados</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {membros.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell className="font-medium">{m.nome}</TableCell>
                            <TableCell>{m.cargoPrincipal ?? "—"}</TableCell>
                            <TableCell>
                              {m.orgaosAlocados.length > 0 ? m.orgaosAlocados.join(", ") : "Não alocado"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => { setVerMembro({ id: m.id, nome: m.nome, email: m.email ?? null, user_id: m.user_id ?? null }); setVerSenhaGerada(null); setVerMembroOpen(true); }}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEditarMembro(m)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openAlocar(m.id)}>
                                <Users className="h-4 w-4 mr-1" />
                                Alocar
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive ml-1"
                                aria-label="Excluir"
                                onClick={() => setMembroToExcluir({ id: m.id, nome: m.nome })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {membros.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum membro cadastrado. Crie membros e aloque-os em conselhos, comitês ou comissões.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Dialog Ver Acesso do Membro */}
          <Dialog open={verMembroOpen} onOpenChange={(open) => { setVerMembroOpen(open); if (!open) setVerSenhaGerada(null); }}>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Acesso do membro</DialogTitle>
                <DialogDescription>
                  Credenciais para login no portal
                </DialogDescription>
              </DialogHeader>
              {verMembro && (
                <div className="space-y-4 py-4">
                  <p className="text-sm font-medium text-muted-foreground">{verMembro.nome}</p>
                  {verMembro.email ? (
                    <>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{verMembro.email}</p>
                      </div>
                      {verSenhaGerada ? (
                        <div className="space-y-2">
                          <Label>Nova senha provisória</Label>
                          <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{verSenhaGerada}</p>
                          <p className="text-xs text-amber-600 dark:text-amber-500">Copie e informe ao membro. Esta senha não será exibida novamente.</p>
                        </div>
                      ) : verMembro.user_id ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            A senha provisória original é exibida apenas no momento da criação.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={redefinirSenhaMembroLoading}
                            onClick={async () => {
                              const { data, error } = await redefinirSenhaMembro(verMembro!.user_id!);
                              if (error) {
                                toast({ title: error, variant: "destructive" });
                                return;
                              }
                              if (data?.senha_provisoria) setVerSenhaGerada(data.senha_provisoria);
                            }}
                          >
                            {redefinirSenhaMembroLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Gerar nova senha provisória
                          </Button>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Usuário sem user_id vinculado. Use Editar para corrigir.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem acesso ao portal (nenhum e-mail cadastrado)</p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog Editar Membro */}
          <Dialog open={editarMembroOpen} onOpenChange={setEditarMembroOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Membro</DialogTitle>
                <DialogDescription>
                  Altere as informações do membro
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={editarMembroNome} onChange={(e) => setEditarMembroNome(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo Principal</Label>
                  <Input value={editarMembroCargo} onChange={(e) => setEditarMembroCargo(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditarMembro} disabled={updateMembroLoading}>
                  {updateMembroLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Alocar Membro */}
          <Dialog open={alocarOpen} onOpenChange={setAlocarOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Alocar Membro</DialogTitle>
                <DialogDescription>
                  Selecione o órgão onde o membro será alocado
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Órgão</Label>
                  <Select value={alocarTipo} onValueChange={(v: "conselho" | "comite" | "comissao") => { setAlocarTipo(v); setAlocarOrgaoId(""); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conselho">Conselho</SelectItem>
                      <SelectItem value="comite">Comitê</SelectItem>
                      <SelectItem value="comissao">Comissão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{alocarTipo === "conselho" ? "Conselho" : alocarTipo === "comite" ? "Comitê" : "Comissão"}</Label>
                  <Select value={alocarOrgaoId} onValueChange={setAlocarOrgaoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {orgaosParaAlocacao.map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cargo neste órgão (opcional)</Label>
                  <Input value={alocarCargo} onChange={(e) => setAlocarCargo(e.target.value)} placeholder="Ex: Presidente, Conselheiro" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAlocar} disabled={insertAlocacaoLoading || !alocarOrgaoId}>
                  {insertAlocacaoLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Alocar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* AlertDialog Excluir Membro Definitivo */}
          <AlertDialog open={!!membroToExcluir} onOpenChange={(open) => !open && setMembroToExcluir(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir membro</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir <strong>{membroToExcluir?.nome}</strong> definitivamente? O membro será removido do banco de dados, de todas as alocações e, se tiver acesso ao portal, a conta de login será removida. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={excluirMembroDefinitivoLoading}>Cancelar</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!membroToExcluir) return;
                    const { error } = await excluirMembroDefinitivo(membroToExcluir.id);
                    setMembroToExcluir(null);
                    if (error) toast({ title: "Erro ao excluir", description: error, variant: "destructive" });
                    else toast({ title: "Membro excluído definitivamente" });
                  }}
                  disabled={excluirMembroDefinitivoLoading}
                >
                  {excluirMembroDefinitivoLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {excluirMembroDefinitivoLoading ? "Excluindo..." : "Excluir definitivamente"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Councils;
