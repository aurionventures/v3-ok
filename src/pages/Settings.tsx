import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Shield, Bell, Users, FileText, Globe, Calendar, Mail, Smartphone, MessageSquare, ListTodo, Clock, AlertTriangle } from "lucide-react";
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
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const Settings = () => {
  const { user } = useAuth();
  const { preferences, loading, updatePreferences, resetToDefaults } = useNotificationPreferences();
  const isOrgAdmin = user?.orgRole === 'org_admin' || !user?.orgRole;
  
  // Local state for notification preferences
  const [formData, setFormData] = useState({
    // Canais
    email_enabled: true,
    push_enabled: true,
    whatsapp_enabled: false,
    whatsapp_number: "",
    
    // Agenda e Reuniões
    notify_calendar_agenda: true,
    notify_meeting_creation: true,
    notify_pauta_definition: true,
    notify_ata_approval: true,
    notify_ata_signature: true,
    
    // Tarefas
    notify_task_assigned: true,
    notify_task_due_30d: true,
    notify_task_due_15d: true,
    notify_task_due_5d: true,
    notify_task_due_3d: true,
    notify_task_due_1d: true,
    notify_task_overdue_daily: true,
  });

  // Sync with database preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled ?? true,
        push_enabled: preferences.push_enabled ?? true,
        whatsapp_enabled: preferences.whatsapp_enabled ?? false,
        whatsapp_number: preferences.whatsapp_number ?? "",
        notify_calendar_agenda: preferences.notify_calendar_agenda ?? true,
        notify_meeting_creation: preferences.notify_meeting_creation ?? true,
        notify_pauta_definition: preferences.notify_pauta_definition ?? true,
        notify_ata_approval: preferences.notify_ata_approval ?? true,
        notify_ata_signature: preferences.notify_ata_signature ?? true,
        notify_task_assigned: preferences.notify_task_assigned ?? true,
        notify_task_due_30d: preferences.notify_task_due_30d ?? true,
        notify_task_due_15d: preferences.notify_task_due_15d ?? true,
        notify_task_due_5d: preferences.notify_task_due_5d ?? true,
        notify_task_due_3d: preferences.notify_task_due_3d ?? true,
        notify_task_due_1d: preferences.notify_task_due_1d ?? true,
        notify_task_overdue_daily: preferences.notify_task_overdue_daily ?? true,
      });
    }
  }, [preferences]);

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Master toggle for agenda notifications
  const isAgendaEnabled = formData.notify_calendar_agenda;
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    updatePreferences(formData);
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
                
                {/* ABA NOTIFICAÇÕES - Redesenhada */}
                <TabsContent value="notifications">
                  <div className="space-y-8">
                    
                    {/* SEÇÃO 1: Preferências de Notificações - Agenda e Reuniões */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Preferências de Notificações</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Calendário e gestão de reuniões
                      </p>
                      
                      <Card className="border-border/50">
                        <CardContent className="p-4 space-y-4">
                          {/* Master Toggle */}
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <Label className="text-base font-medium">Notificações de Agenda</Label>
                              <p className="text-sm text-muted-foreground">
                                Receber notificações sobre a agenda de governança
                              </p>
                            </div>
                            <Switch 
                              checked={formData.notify_calendar_agenda}
                              onCheckedChange={() => handleToggle('notify_calendar_agenda')}
                            />
                          </div>
                          
                          {/* Sub-toggles */}
                          {isAgendaEnabled && (
                            <div className="ml-4 pl-4 border-l-2 border-primary/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Criação de agendas</Label>
                                <Switch 
                                  checked={formData.notify_calendar_agenda}
                                  onCheckedChange={() => handleToggle('notify_calendar_agenda')}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Criação de reuniões</Label>
                                <Switch 
                                  checked={formData.notify_meeting_creation}
                                  onCheckedChange={() => handleToggle('notify_meeting_creation')}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Definições de pauta</Label>
                                <Switch 
                                  checked={formData.notify_pauta_definition}
                                  onCheckedChange={() => handleToggle('notify_pauta_definition')}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Aprovação de ATAs</Label>
                                <Switch 
                                  checked={formData.notify_ata_approval}
                                  onCheckedChange={() => handleToggle('notify_ata_approval')}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Assinatura de ATAs</Label>
                                <Switch 
                                  checked={formData.notify_ata_signature}
                                  onCheckedChange={() => handleToggle('notify_ata_signature')}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* SEÇÃO 2: Canais de Notificação */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Canais de Notificação</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Escolha como deseja receber suas notificações
                      </p>
                      
                      <Card className="border-border/50">
                        <CardContent className="p-4 space-y-4">
                          {/* E-mail */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-base">E-mail</Label>
                                <p className="text-sm text-muted-foreground">
                                  Notificações enviadas para seu e-mail cadastrado
                                </p>
                              </div>
                            </div>
                            <Switch 
                              checked={formData.email_enabled}
                              onCheckedChange={() => handleToggle('email_enabled')}
                            />
                          </div>
                          
                          <Separator className="my-2" />
                          
                          {/* Push no App */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <Bell className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-base">Push no App</Label>
                                <p className="text-sm text-muted-foreground">
                                  Notificações em tempo real para todos os usuários
                                </p>
                              </div>
                            </div>
                            <Switch 
                              checked={formData.push_enabled}
                              onCheckedChange={() => handleToggle('push_enabled')}
                            />
                          </div>
                          
                          <Separator className="my-2" />
                          
                          {/* WhatsApp */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <Label className="text-base">WhatsApp</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Receba alertas importantes via WhatsApp
                                  </p>
                                </div>
                              </div>
                              <Switch 
                                checked={formData.whatsapp_enabled}
                                onCheckedChange={() => handleToggle('whatsapp_enabled')}
                              />
                            </div>
                            
                            {formData.whatsapp_enabled && (
                              <div className="ml-7 pl-4">
                                <Label htmlFor="whatsapp" className="text-sm text-muted-foreground">
                                  Número do WhatsApp
                                </Label>
                                <Input 
                                  id="whatsapp"
                                  placeholder="+55 (00) 00000-0000"
                                  value={formData.whatsapp_number}
                                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                                  className="mt-1 max-w-xs"
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* SEÇÃO 3: Tipos de Notificação - Tarefas */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Configurações de alertas para tarefas e pendências
                      </p>
                      
                      <Card className="border-border/50">
                        <CardContent className="p-4 space-y-6">
                          {/* Tarefas Atreladas */}
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <Label className="text-base font-medium">Tarefas Atreladas</Label>
                              <p className="text-sm text-muted-foreground">
                                Notificação quando tarefas forem atribuídas a você
                              </p>
                            </div>
                            <Switch 
                              checked={formData.notify_task_assigned}
                              onCheckedChange={() => handleToggle('notify_task_assigned')}
                            />
                          </div>
                          
                          <Separator />
                          
                          {/* Lembretes de Vencimento */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              <Label className="text-base font-medium">Lembretes de Vencimento</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Receba lembretes antes do prazo das tarefas
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <Label className="text-sm">30 dias</Label>
                                <Switch 
                                  checked={formData.notify_task_due_30d}
                                  onCheckedChange={() => handleToggle('notify_task_due_30d')}
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <Label className="text-sm">15 dias</Label>
                                <Switch 
                                  checked={formData.notify_task_due_15d}
                                  onCheckedChange={() => handleToggle('notify_task_due_15d')}
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <Label className="text-sm">5 dias</Label>
                                <Switch 
                                  checked={formData.notify_task_due_5d}
                                  onCheckedChange={() => handleToggle('notify_task_due_5d')}
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <Label className="text-sm">3 dias</Label>
                                <Switch 
                                  checked={formData.notify_task_due_3d}
                                  onCheckedChange={() => handleToggle('notify_task_due_3d')}
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <Label className="text-sm">1 dia</Label>
                                <Switch 
                                  checked={formData.notify_task_due_1d}
                                  onCheckedChange={() => handleToggle('notify_task_due_1d')}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {/* Tarefas Vencidas */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <div>
                                <Label className="text-base font-medium">Tarefas Vencidas</Label>
                                <p className="text-sm text-muted-foreground">
                                  Lembrete diário (1x a cada 24h) até resolução
                                </p>
                              </div>
                            </div>
                            <Switch 
                              checked={formData.notify_task_overdue_daily}
                              onCheckedChange={() => handleToggle('notify_task_overdue_daily')}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveNotifications}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Preferências
                      </Button>
                      <Button variant="outline" onClick={() => resetToDefaults()}>
                        Restaurar Padrões
                      </Button>
                    </div>
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
