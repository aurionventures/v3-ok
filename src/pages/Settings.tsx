import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, UserCog, Bell, ActivitySquare, FileText, Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import ActivityList from "@/components/ActivityList";
import { allActivities } from "@/data/activitiesData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEmpresas } from "@/hooks/useEmpresas";
import { isAdmin, isCompanyAdm } from "@/lib/auth";
import { insertSuperAdmin, insertEmpresaAdm } from "@/services/empresas";
import { fetchPromptPautaAta, upsertPromptPautaAta, PROMPT_PADRAO } from "@/services/promptsConfig";

function gerarSenhaAleatoria(len = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const Settings = () => {
  const { firstEmpresaId } = useEmpresas();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promptPautaAta, setPromptPautaAta] = useState(PROMPT_PADRAO);
  const [promptPautaAtaLoading, setPromptPautaAtaLoading] = useState(false);
  const [promptPautaAtaSaving, setPromptPautaAtaSaving] = useState(false);

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

  useEffect(() => {
    if (!firstEmpresaId) return;
    setPromptPautaAtaLoading(true);
    fetchPromptPautaAta(firstEmpresaId).then(({ prompt }) => {
      setPromptPautaAta(prompt);
      setPromptPautaAtaLoading(false);
    });
  }, [firstEmpresaId]);

  const handleSavePromptPautaAta = async () => {
    if (!firstEmpresaId) {
      toast({ title: "Selecione uma empresa", variant: "destructive" });
      return;
    }
    setPromptPautaAtaSaving(true);
    const { error } = await upsertPromptPautaAta(firstEmpresaId, promptPautaAta);
    setPromptPautaAtaSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar prompt", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Prompt salvo", description: "O prompt de geração de Pauta/ATA foi atualizado." });
  };
  
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
    if (!firstEmpresaId) {
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
      empresa_id: firstEmpresaId,
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
              
              <Tabs defaultValue="general">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="profile">
                    <UserCog className="h-4 w-4 mr-2" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="activities">
                    <ActivitySquare className="h-4 w-4 mr-2" />
                    Atividades
                  </TabsTrigger>
                  <TabsTrigger value="prompts">
                    <FileText className="h-4 w-4 mr-2" />
                    Prompts IA
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
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Nome Completo</Label>
                        <Input id="full-name" defaultValue="Usuário Demonstração" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="demo@legacy.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Função</Label>
                        <Input id="role" defaultValue="Administrador" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input id="department" defaultValue="Diretoria" />
                      </div>
                    </div>
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Perfil
                    </Button>

                    {isAdmin() && (
                      <div className="mt-8 pt-8 border-t">
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

                    {isCompanyAdm() && firstEmpresaId && (
                      <div className="mt-8 pt-8 border-t">
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
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferências de Notificações</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notificações por Email</Label>
                            <p className="text-sm text-gray-500">Receber notificações por email</p>
                          </div>
                          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                        </div>
                        
                        {notificationsEnabled && (
                          <div className="ml-6 space-y-4 border-l-2 pl-4 border-gray-200">
                            <div className="flex items-center justify-between">
                              <Label>Atualizações de Documentos</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Reuniões de Conselho</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Alterações de Estrutura Societária</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Relatórios de Maturidade</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notificações no Sistema</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Notificações no Navegador</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Sons de Notificação</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Preferências de Notificações
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activities">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Histórico de Atividades</h3>
                    <ActivityList activities={allActivities} showViewAll={false} />
                  </div>
                </TabsContent>

                <TabsContent value="prompts">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Geração de Pauta/ATA com IA</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Edite o prompt usado pelo assistente para gerar a pauta e a ATA das reuniões. O texto será enviado como instrução de estilo para o modelo de IA.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-pauta-ata">Prompt do sistema</Label>
                      <Textarea
                        id="prompt-pauta-ata"
                        value={promptPautaAta}
                        onChange={(e) => setPromptPautaAta(e.target.value)}
                        placeholder={PROMPT_PADRAO}
                        rows={12}
                        className="font-mono text-sm"
                        disabled={promptPautaAtaLoading}
                      />
                    </div>
                    <Button onClick={handleSavePromptPautaAta} disabled={promptPautaAtaSaving || promptPautaAtaLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {promptPautaAtaSaving ? "Salvando..." : "Salvar Prompt"}
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
