/**
 * Página Master/ADM – gestão completa PLG (Product-Led Growth).
 * Controle de funis, experiências de produto e métricas de adoção.
 */

import { useState } from "react";
import { LayoutDashboard, Users, TrendingUp, Settings, Funnel, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const MasterAdmPlg = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Master / ADM - PLG" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão PLG (Product-Led Growth)</h1>
            <p className="text-gray-500">Configuração de funis, experiências e métricas de adoção</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="funnel">Funil</TabsTrigger>
              <TabsTrigger value="experiences">Experiências</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Usuários ativos (30d)</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">PLG: adoção sem vendas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Conversão trial → pago</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—%</div>
                    <p className="text-xs text-muted-foreground">Meta configurável</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Ativações (aha moment)</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Eventos de ativação</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Health score médio</CardTitle>
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Saúde do uso</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão PLG</CardTitle>
                  <CardDescription>
                    Defina estágios do funil, gatilhos de experiência e métricas de sucesso para produto e crescimento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Esta página concentra a gestão completa do modelo PLG: funis de aquisição e ativação,
                    experiências guiadas (onboarding, feature discovery) e configuração de indicadores de adoção.
                    Conteúdo fictício para estrutura.
                  </p>
                  <Button className="mt-4">Configurar funil</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funnel">
              <Card>
                <CardHeader>
                  <CardTitle>Funil PLG</CardTitle>
                  <CardDescription>Etapas: Visita → Trial → Ativação → Conversão → Expansão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Funnel className="h-5 w-5" />
                    <span>Configuração de estágios e critérios de avanço (fictício).</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experiences">
              <Card>
                <CardHeader>
                  <CardTitle>Experiências de produto</CardTitle>
                  <CardDescription>Onboarding, checklists, tooltips e fluxos guiados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gestão de experiências que levam ao aha moment e à retenção (conteúdo fictício).
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de adoção</CardTitle>
                  <CardDescription>Definição de eventos e metas para PLG</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configuração de eventos de produto e metas de adoção (conteúdo fictício).
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações PLG</CardTitle>
                  <CardDescription>Parâmetros gerais do modelo Product-Led Growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Settings className="h-5 w-5" />
                    <span>Configurações fictícias para gestão Master/ADM PLG.</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MasterAdmPlg;
