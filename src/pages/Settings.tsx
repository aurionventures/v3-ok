
import React, { useState } from "react";
import { Settings as SettingsIcon, Save, UserCog, Bot, Shield, Bell, Cpu, ActivitySquare } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import ActivityList from "@/components/ActivityList";
import { allActivities } from "@/pages/Activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [assistantModel, setAssistantModel] = useState("balanced");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [creativeLevel, setCreativeLevel] = useState([50]);
  
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
                  <TabsTrigger value="ai">
                    <Cpu className="h-4 w-4 mr-2" />
                    Configuração de IA
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
                
                <TabsContent value="ai">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Configuração do Assistente de IA</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Ativar Assistente de IA</Label>
                            <p className="text-sm text-gray-500">Habilitar o assistente de IA para governança</p>
                          </div>
                          <Switch 
                            checked={aiEnabled} 
                            onCheckedChange={setAiEnabled} 
                          />
                        </div>
                        
                        {aiEnabled && (
                          <>
                            <div className="space-y-2">
                              <Label>Modelo de IA</Label>
                              <RadioGroup 
                                value={assistantModel}
                                onValueChange={setAssistantModel}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="balanced" id="balanced" />
                                  <Label htmlFor="balanced" className="cursor-pointer">Balanceado</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="creative" id="creative" />
                                  <Label htmlFor="creative" className="cursor-pointer">Criativo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="precise" id="precise" />
                                  <Label htmlFor="precise" className="cursor-pointer">Preciso</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Nível de Criatividade</Label>
                                <span className="text-sm font-medium">{creativeLevel[0]}%</span>
                              </div>
                              <Slider
                                value={creativeLevel}
                                onValueChange={setCreativeLevel}
                                max={100}
                                step={1}
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Mais preciso</span>
                                <span>Mais criativo</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="system-prompt">Prompt do Sistema</Label>
                              <textarea 
                                id="system-prompt" 
                                className="w-full p-2 border rounded-md min-h-[100px]"
                                defaultValue="Você é um assistente especializado em governança corporativa para empresas familiares. Ajude com questões sobre estruturação de conselhos, sucessão, acordos de acionistas e melhores práticas de governança."
                              ></textarea>
                              <p className="text-sm text-gray-500">
                                Personalize as instruções básicas do assistente de IA.
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="api-key">Chave de API</Label>
                              <Input 
                                id="api-key" 
                                type="password" 
                                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              />
                              <p className="text-sm text-gray-500">
                                Opcional: Insira sua própria chave de API para o modelo de IA.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Configurações Avançadas</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="max-tokens">Limite de Tokens</Label>
                          <Input 
                            id="max-tokens" 
                            type="number" 
                            defaultValue={2048} 
                            min={1} 
                            max={4096}
                          />
                          <p className="text-sm text-gray-500">
                            Limite máximo de tokens para respostas da IA.
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Armazenar Histórico de Conversas</Label>
                            <p className="text-sm text-gray-500">
                              Armazenar conversas para melhorar as respostas futuras
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações da IA
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
