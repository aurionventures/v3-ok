import React, { useState } from "react";
import { Settings as SettingsIcon, Save, Shield, Bell, Users, FileText, Globe } from "lucide-react";
import { UserManagementTab } from "@/components/settings/UserManagementTab";
import { AIParameterizationTab } from "@/components/settings/AIParameterizationTab";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const isOrgAdmin = user?.orgRole === 'org_admin' || !user?.orgRole;
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurações" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
            <p className="text-muted-foreground">Gerencie as configurações da plataforma</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="general">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="atas">
                    <FileText className="h-4 w-4 mr-2" />
                    Parametrização de ATAs
                  </TabsTrigger>
                </TabsList>
                
                {/* ABA GERAL - Consolidada com sub-seções */}
                <TabsContent value="general">
                  <div className="space-y-8">
                    {/* Seção 1: Idioma e Região */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        Idioma e Região
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Idioma</Label>
                          <select 
                            id="language" 
                            className="w-full p-2 border rounded-md bg-background"
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
                            className="w-full p-2 border rounded-md bg-background"
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
                    
                    <Separator />
                    
                    {/* Seção 2: Usuários */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        Usuários
                      </h3>
                      <UserManagementTab />
                    </div>
                    
                    <Separator />
                    
                    {/* Seção 3: Segurança */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        Segurança
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-base font-medium">Alterar Senha</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          </div>
                          <Button variant="outline" size="sm">Alterar Senha</Button>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-base font-medium">Autenticação de Dois Fatores</h4>
                          <div className="flex items-center justify-between max-w-md">
                            <div>
                              <Label>Ativar 2FA</Label>
                              <p className="text-sm text-muted-foreground">
                                Proteja sua conta com autenticação de dois fatores
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                </TabsContent>
                
                {/* ABA NOTIFICAÇÕES */}
                <TabsContent value="notifications">
                  <div className="space-y-6">
                    {/* SEÇÃO 1: Preferências de Notificações */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferências de Notificações</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notificações por Email</Label>
                            <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                          </div>
                          <Switch 
                            checked={notificationsEnabled} 
                            onCheckedChange={setNotificationsEnabled} 
                          />
                        </div>
                        
                        {notificationsEnabled && (
                          <div className="ml-6 space-y-4 border-l-2 pl-4 border-border">
                            <div className="flex items-center justify-between">
                              <Label>Atualizações de Documentos</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Reuniões de Conselho</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Alterações de Estrutura Familiar</Label>
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

                    {/* SEÇÃO 2: Canais de Notificação */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>E-mail</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>WhatsApp</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Notificações no App</Label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    {/* SEÇÃO 3: Tipos de Notificação */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Tipos de Notificação</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label>Lembretes de Reuniões</Label>
                            <p className="text-sm text-muted-foreground">
                              Receber lembretes automáticos antes das reuniões
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label>Pendências Próximas ao Vencimento</Label>
                            <p className="text-sm text-muted-foreground">
                              Receber avisos quando pendências estiverem próximas do prazo
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label>Pendências Atrasadas</Label>
                            <p className="text-sm text-muted-foreground">
                              Receber alertas diários sobre pendências atrasadas
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Preferências de Notificações
                    </Button>
                  </div>
                </TabsContent>
                
                {/* ABA PARAMETRIZAÇÃO DE ATAs */}
                <TabsContent value="atas">
                  <AIParameterizationTab />
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
