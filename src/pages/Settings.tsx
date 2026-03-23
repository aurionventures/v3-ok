import React, { useState, useEffect, useMemo } from "react";
import { Settings as SettingsIcon, Save, FileText, Eye, EyeOff, RefreshCw, Loader2, Bell, Sparkles, Cpu } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useCurrentAdminProfile } from "@/hooks/useCurrentAdminProfile";
import { isAdmin, isCompanyAdm } from "@/lib/auth";
import { insertSuperAdmin, insertEmpresaAdm } from "@/services/empresas";
import {
  fetchPromptPautaAta,
  fetchPromptDefaultPautaAta,
  upsertPromptPautaAta,
  upsertPromptDefaultPautaAta,
} from "@/services/promptsConfig";
import { cn } from "@/lib/utils";

const TEMPLATES_ATA = [
  {
    id: "formal",
    name: "Formal",
    description: "Linguagem jurídica e cerimonial, ideal para conselhos de administração",
    icon: FileText,
    tom: "formal",
    pessoa: "terceira",
  },
  {
    id: "executivo",
    name: "Executivo",
    description: "Direto e focado em decisões, ideal para comitês executivos",
    icon: Sparkles,
    tom: "executivo",
    pessoa: "terceira",
  },
  {
    id: "tecnico",
    name: "Técnico",
    description: "Linguagem técnica com bullet points, ideal para comissões",
    icon: Cpu,
    tom: "tecnico",
    pessoa: "terceira",
  },
] as const;

const TOM_OPCOES = [
  { id: "formal", label: "Formal", desc: "Linguagem jurídica e cerimonial" },
  { id: "semi-formal", label: "Semi-formal", desc: "Balanceado entre formalidade e clareza" },
  { id: "executivo", label: "Executivo", desc: "Direto e focado em decisões e ações" },
  { id: "tecnico", label: "Técnico", desc: "Termos técnicos e bullet points" },
] as const;

const PESSOA_OPCOES = [
  { id: "terceira", label: "Terceira pessoa", exemplo: '"O Conselho deliberou..."' },
  { id: "primeira", label: "Primeira pessoa plural", exemplo: '"Deliberamos..."' },
] as const;

function gerarPromptFromConfig(tom: string, pessoa: string): string {
  const tomInstrucoes: Record<string, string> = {
    formal: "Use linguagem jurídica e cerimonial",
    "semi-formal": "Mantenha tom profissional com clareza",
    executivo: "Seja direto e focado em decisões e ações",
    tecnico: "Use termos técnicos e estrutura em bullet points",
  };
  const pessoaInstrucao = pessoa === "terceira"
    ? "Use terceira pessoa do singular"
    : "Use primeira pessoa do plural (nós)";
  return `Você é um secretário executivo experiente em governança corporativa brasileira.

INSTRUÇÕES DE ESTILO:
- ${tomInstrucoes[tom] ?? tomInstrucoes.executivo}
- ${pessoaInstrucao}
- Gere resumos executivos de 200 palavras`;
}

function gerarSenhaAleatoria(len = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const Settings = () => {
  const { firstEmpresaId } = useEmpresas();
  const { nome: profileNome, email: profileEmail, role: profileRole, empresaId: profileEmpresaId } = useCurrentAdminProfile();
  /** Para ADM Cliente: usa empresa_id do perfil (autoritativo); fallback para firstEmpresaId */
  const clientEmpresaId = profileEmpresaId ?? firstEmpresaId;

  const [activeTab, setActiveTab] = useState("general");
  const [ataSubTab, setAtaSubTab] = useState<"simplificado" | "editor">("simplificado");
  const [tomVoz, setTomVoz] = useState<string>("executivo");
  const [pessoaVerbal, setPessoaVerbal] = useState<string>("terceira");
  const [promptEditor, setPromptEditor] = useState("");
  const [ataConfigLoading, setAtaConfigLoading] = useState(false);
  const [ataConfigSaving, setAtaConfigSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ nome: "", email: "", role: "", department: "" });

  useEffect(() => {
    setProfileForm((p) => ({
      ...p,
      nome: profileNome,
      email: profileEmail,
      role: profileRole,
    }));
  }, [profileNome, profileEmail, profileRole]);

  const previewPrompt = useMemo(
    () => gerarPromptFromConfig(tomVoz, pessoaVerbal),
    [tomVoz, pessoaVerbal]
  );

  const isSuperAdm = isAdmin();
  const isClientAdm = isCompanyAdm();

  useEffect(() => {
    if (activeTab !== "ata") return;
    setAtaConfigLoading(true);
    if (isSuperAdm) {
      fetchPromptDefaultPautaAta().then(({ prompt }) => {
        setAtaConfigLoading(false);
        setPromptEditor(prompt);
      });
    } else if (isClientAdm && clientEmpresaId) {
      fetchPromptPautaAta(clientEmpresaId).then(({ prompt }) => {
        setAtaConfigLoading(false);
        setPromptEditor(prompt);
      });
    } else {
      setAtaConfigLoading(false);
    }
  }, [activeTab, clientEmpresaId, isSuperAdm, isClientAdm]);

  const handleTemplateSelect = (t: (typeof TEMPLATES_ATA)[number]) => {
    setTomVoz(t.tom);
    setPessoaVerbal(t.pessoa);
  };

  const handleSaveAtaConfig = async () => {
    const promptToSave = ataSubTab === "simplificado" ? previewPrompt : promptEditor;
    if (isSuperAdm) {
      setAtaConfigSaving(true);
      const { error } = await upsertPromptDefaultPautaAta(promptToSave);
      setAtaConfigSaving(false);
      if (error) {
        toast({ title: "Erro ao salvar prompt padrão", description: error, variant: "destructive" });
        return;
      }
      toast({
        title: "Prompt padrão salvo",
        description: "O prompt de Geração de Pauta será usado como padrão para todos os clientes.",
      });
      return;
    }
    if (!clientEmpresaId) {
      toast({ title: "Empresa não disponível", variant: "destructive" });
      return;
    }
    setAtaConfigSaving(true);
    const { error } = await upsertPromptPautaAta(clientEmpresaId, promptToSave);
    setAtaConfigSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar configuração", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Configuração salva", description: "Seu prompt de Geração de Pauta foi atualizado." });
  };

  const [superAdminNome, setSuperAdminNome] = useState("");
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [superAdminSenha, setSuperAdminSenha] = useState("");
  const [superAdminSenhaVisivel, setSuperAdminSenhaVisivel] = useState(false);
  const [superAdminLoading, setSuperAdminLoading] = useState(false);

  const [empresaAdmNome, setEmpresaAdmNome] = useState("");
  const [empresaAdmEmail, setEmpresaAdmEmail] = useState("");
  const [empresaAdmSenha, setEmpresaAdmSenha] = useState("");
  const [empresaAdmSenhaVisivel, setEmpresaAdmSenhaVisivel] = useState(false);
  const [empresaAdmLoading, setEmpresaAdmLoading] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleCriarSuperAdmin = async () => {
    const nome = superAdminNome.trim();
    const email = superAdminEmail.trim().toLowerCase();
    const senha = superAdminSenha;
    if (!nome) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    if (!email) {
      toast({ title: "E-mail é obrigatório", variant: "destructive" });
      return;
    }
    if (!senha || senha.length < 6) {
      toast({ title: "A senha provisória deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    setSuperAdminLoading(true);
    const { data, error } = await insertSuperAdmin({ nome, email, senha_provisoria: senha });
    setSuperAdminLoading(false);
    if (error) {
      toast({ title: "Erro ao criar Super Admin", description: error, variant: "destructive" });
      return;
    }
    const credenciais = `E-mail: ${email}\nSenha provisória: ${senha}`;
    toast({
      title: "Super Admin criado",
      description: "Envie as credenciais ao novo administrador. Ele deve alterar a senha no primeiro acesso.",
      action: (
        <ToastAction
          altText="Copiar credenciais"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar credenciais
        </ToastAction>
      ),
    });
    setSuperAdminNome("");
    setSuperAdminEmail("");
    setSuperAdminSenha("");
    setSuperAdminSenhaVisivel(false);
  };

  const handleCriarEmpresaAdm = async () => {
    const nome = empresaAdmNome.trim();
    const email = empresaAdmEmail.trim().toLowerCase();
    const senha = empresaAdmSenha;
    if (!clientEmpresaId) {
      toast({ title: "Empresa não disponível", variant: "destructive" });
      return;
    }
    if (!nome) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    if (!email) {
      toast({ title: "E-mail é obrigatório", variant: "destructive" });
      return;
    }
    if (!senha || senha.length < 6) {
      toast({ title: "A senha provisória deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    setEmpresaAdmLoading(true);
    const { data, error } = await insertEmpresaAdm({
      empresa_id: clientEmpresaId,
      nome,
      email,
      senha_provisoria: senha,
    });
    setEmpresaAdmLoading(false);
    if (error) {
      toast({ title: "Erro ao criar ADM", description: error, variant: "destructive" });
      return;
    }
    const credenciais = `E-mail: ${data?.email ?? email}\nSenha provisória: ${senha}`;
    toast({
      title: "ADM criado",
      description: "Envie as credenciais ao novo administrador. Ele deve alterar a senha no primeiro acesso.",
      action: (
        <ToastAction
          altText="Copiar credenciais"
          onClick={() => navigator.clipboard?.writeText(credenciais)}
        >
          Copiar credenciais
        </ToastAction>
      ),
    });
    setEmpresaAdmNome("");
    setEmpresaAdmEmail("");
    setEmpresaAdmSenha("");
    setEmpresaAdmSenhaVisivel(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurações" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Configurações do Sistema
                </h2>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-muted">
                  <TabsTrigger value="general" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="ata" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Parametrização de ATAs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Idioma e Região</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Idioma</Label>
                          <select 
                            id="language" 
                            className="w-full p-2 border rounded-md"
                            defaultValue="pt-BR"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Fuso Horário</Label>
                          <select 
                            id="timezone" 
                            className="w-full p-2 border rounded-md"
                            defaultValue="America/Sao_Paulo"
                          >
                            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-4)</option>
                            <option value="Europe/London">London (GMT+1)</option>
                            <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Perfil</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full-name">Nome Completo</Label>
                          <Input
                            id="full-name"
                            placeholder="Seu nome completo"
                            value={profileForm.nome}
                            onChange={(e) => setProfileForm((p) => ({ ...p, nome: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Função</Label>
                          <Input
                            id="role"
                            placeholder="Ex: Administrador"
                            value={profileForm.role}
                            onChange={(e) => setProfileForm((p) => ({ ...p, role: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Departamento</Label>
                          <Input
                            id="department"
                            placeholder="Ex: Diretoria"
                            value={profileForm.department}
                            onChange={(e) => setProfileForm((p) => ({ ...p, department: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    {isAdmin() && (
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Criar novo Super Admin</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cadastre um novo Super Admin com nome, e-mail e senha provisória. Envie as credenciais ao novo administrador. No primeiro acesso, ele deverá alterar a senha.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="super-admin-nome">Nome</Label>
                            <Input
                              id="super-admin-nome"
                              placeholder="Nome completo"
                              value={superAdminNome}
                              onChange={(e) => setSuperAdminNome(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="super-admin-email">E-mail</Label>
                            <Input
                              id="super-admin-email"
                              type="email"
                              placeholder="admin@exemplo.com"
                              value={superAdminEmail}
                              onChange={(e) => setSuperAdminEmail(e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="super-admin-senha">Senha provisória (mín. 6 caracteres)</Label>
                            <div className="relative">
                              <Input
                                id="super-admin-senha"
                                type={superAdminSenhaVisivel ? "text" : "password"}
                                placeholder="••••••••"
                                value={superAdminSenha}
                                onChange={(e) => setSuperAdminSenha(e.target.value)}
                                className="pr-20"
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => setSuperAdminSenha(gerarSenhaAleatoria())}
                                  className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                  title="Gerar senha"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSuperAdminSenhaVisivel((v) => !v)}
                                  className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                  title={superAdminSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                                >
                                  {superAdminSenhaVisivel ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="mt-4"
                          onClick={handleCriarSuperAdmin}
                          disabled={superAdminLoading}
                        >
                          {superAdminLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Criar Super Admin
                        </Button>
                      </div>
                    )}

                    {isCompanyAdm() && clientEmpresaId && (
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Cadastrar novo ADM do cliente</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cadastre um novo administrador para a mesma empresa com nome, e-mail e senha provisória. Envie as credenciais ao novo ADM. No primeiro acesso, ele deverá alterar a senha.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="empresa-adm-nome">Nome</Label>
                            <Input
                              id="empresa-adm-nome"
                              placeholder="Nome completo"
                              value={empresaAdmNome}
                              onChange={(e) => setEmpresaAdmNome(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="empresa-adm-email">E-mail</Label>
                            <Input
                              id="empresa-adm-email"
                              type="email"
                              placeholder="adm@empresa.com"
                              value={empresaAdmEmail}
                              onChange={(e) => setEmpresaAdmEmail(e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="empresa-adm-senha">Senha provisória (mín. 6 caracteres)</Label>
                            <div className="relative">
                              <Input
                                id="empresa-adm-senha"
                                type={empresaAdmSenhaVisivel ? "text" : "password"}
                                placeholder="••••••••"
                                value={empresaAdmSenha}
                                onChange={(e) => setEmpresaAdmSenha(e.target.value)}
                                className="pr-20"
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => setEmpresaAdmSenha(gerarSenhaAleatoria())}
                                  className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                  title="Gerar senha"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEmpresaAdmSenhaVisivel((v) => !v)}
                                  className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                                  title={empresaAdmSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                                >
                                  {empresaAdmSenhaVisivel ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="mt-4"
                          onClick={handleCriarEmpresaAdm}
                          disabled={empresaAdmLoading}
                        >
                          {empresaAdmLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Cadastrar ADM
                        </Button>
                      </div>
                    )}

                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Notificações</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure como você deseja receber avisos e atualizações da plataforma.
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-card p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">E-mail</p>
                          <p className="text-sm text-muted-foreground">Receber notificações por e-mail</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">ATAs e aprovações</p>
                          <p className="text-sm text-muted-foreground">Alertas quando houver ATAs pendentes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reuniões</p>
                          <p className="text-sm text-muted-foreground">Lembrete de reuniões agendadas</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Preferências
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="ata">
                  <div className="space-y-6">
                    <Tabs value={ataSubTab} onValueChange={(v) => setAtaSubTab(v as "simplificado" | "editor")}>
                      <TabsList className="mb-6 bg-muted">
                        <TabsTrigger value="simplificado" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                          Modo Simplificado
                        </TabsTrigger>
                        <TabsTrigger value="editor" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                          Editor de Prompt
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="simplificado" className="mt-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-semibold mb-1">Templates Pre-definidos</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Selecione um template como ponto de partida ou personalize manualmente abaixo.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {TEMPLATES_ATA.map((t) => {
                                const Icon = t.icon;
                                const isSelected = tomVoz === t.tom && pessoaVerbal === t.pessoa;
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => handleTemplateSelect(t)}
                                    className={cn(
                                      "rounded-lg border-2 p-4 text-left transition-colors",
                                      isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 bg-card hover:border-primary/50 hover:bg-muted/30"
                                    )}
                                  >
                                    <Icon className="h-8 w-8 mb-2 text-muted-foreground" />
                                    <p className="font-medium">{t.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-medium mb-1">Tom de Voz</h4>
                                <p className="text-sm text-muted-foreground mb-3">Define o estilo de linguagem da ATA.</p>
                                <RadioGroup value={tomVoz} onValueChange={setTomVoz} className="space-y-3">
                                  {TOM_OPCOES.map((o) => (
                                    <div key={o.id} className="flex items-start gap-3">
                                      <RadioGroupItem value={o.id} id={`tom-${o.id}`} />
                                      <label htmlFor={`tom-${o.id}`} className="cursor-pointer flex-1">
                                        <span className="font-medium block">{o.label}</span>
                                        <span className="text-xs text-muted-foreground">{o.desc}</span>
                                      </label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Pessoa Verbal</h4>
                                <p className="text-sm text-muted-foreground mb-3">Como a ATA deve se referir ao órgão.</p>
                                <RadioGroup value={pessoaVerbal} onValueChange={setPessoaVerbal} className="space-y-3">
                                  {PESSOA_OPCOES.map((o) => (
                                    <div key={o.id} className="flex items-start gap-3">
                                      <RadioGroupItem value={o.id} id={`pessoa-${o.id}`} />
                                      <label htmlFor={`pessoa-${o.id}`} className="cursor-pointer flex-1">
                                        <span className="font-medium block">{o.label}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{o.exemplo}</span>
                                      </label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-1">Preview do Prompt</h4>
                              <p className="text-sm text-muted-foreground mb-3">Visualize como as instruções serão enviadas para a IA.</p>
                              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 min-h-[200px]">
                                <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">{previewPrompt}</pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="editor" className="mt-0">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">Editor de Prompt</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {isSuperAdm
                                ? "Defina o prompt padrão de Geração de Pauta. Este será o padrão para todos os clientes que não personalizarem."
                                : "Personalize o prompt de Geração de Pauta da sua empresa. Por padrão, é usado o prompt definido pelo Super ADM."}
                            </p>
                            <textarea
                              value={promptEditor}
                              onChange={(e) => setPromptEditor(e.target.value)}
                              className="w-full min-h-[300px] p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm font-mono resize-y"
                              placeholder={
                                isSuperAdm
                                  ? "Digite o prompt padrão de Geração de Pauta..."
                                  : "Digite ou cole o prompt (ou edite o padrão do Super ADM)..."
                              }
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <Button
                      onClick={handleSaveAtaConfig}
                      disabled={ataConfigSaving || (!isSuperAdm && !clientEmpresaId)}
                    >
                      {ataConfigSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isSuperAdm ? "Salvar Prompt Padrão" : "Salvar Configuração de ATA"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
