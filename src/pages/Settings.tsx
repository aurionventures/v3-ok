import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, UserCog, Shield, Bell, ActivitySquare, FileText } from "lucide-react";
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
import { useEmpresas } from "@/hooks/useEmpresas";
import { fetchPromptPautaAta, upsertPromptPautaAta, PROMPT_PADRAO } from "@/services/promptsConfig";

const Settings = () => {
  const { firstEmpresaId } = useEmpresas();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promptPautaAta, setPromptPautaAta] = useState(PROMPT_PADRAO);
  const [promptPautaAtaLoading, setPromptPautaAtaLoading] = useState(false);
  const [promptPautaAtaSaving, setPromptPautaAtaSaving] = useState(false);

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
                  <TabsTrigger value="security">
                    <Shield className="h-4 w-4 mr-2" />
                    Segurança
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
                      <h3 className="text-lg font-medium mb-4">Preferências do Sistema</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Tema Escuro</Label>
                            <p className="text-sm text-gray-500">Ativar o tema escuro para a interface</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Modo de Alto Contraste</Label>
                            <p className="text-sm text-gray-500">Melhorar a legibilidade com alto contraste</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Animações</Label>
                            <p className="text-sm text-gray-500">Ativar animações na interface</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
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
                  </div>
                </TabsContent>
                
                <TabsContent value="security">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">Segurança da Conta</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button className="mt-2">Alterar Senha</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">Autenticação de Dois Fatores</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Ativar 2FA</Label>
                          <p className="text-sm text-gray-500">
                            Proteja sua conta com autenticação de dois fatores
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
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
