/**
 * Dashboard de Gestão de Indicadores.
 * Vendas, contratos, faturas, configurador de planos, gestão de agentes e gestão de prompts.
 */

import { useState } from "react";
import {
  BarChart3,
  FileText,
  Receipt,
  Package,
  Bot,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const DashboardGestaoIndicadores = () => {
  const [activeTab, setActiveTab] = useState("vendas");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard Gestão de Indicadores" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Indicadores</h1>
            <p className="text-gray-500">
              Vendas, contratos, faturas, planos, agentes e prompts
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="contratos">Contratos</TabsTrigger>
              <TabsTrigger value="faturas">Faturas</TabsTrigger>
              <TabsTrigger value="planos">Planos</TabsTrigger>
              <TabsTrigger value="agentes">Agentes</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Receita (mês)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Indicador de venda</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Novos negócios</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Fictício</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Ticket médio</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Fictício</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de vendas</CardTitle>
                  <CardDescription>Métricas e lista de oportunidades (conteúdo fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Painel de vendas: pipeline, conversões e indicadores por período. Sem integração real.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contratos" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Contratos ativos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Gestão de contratos (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de contratos</CardTitle>
                  <CardDescription>Listagem, vigência, renovação e anexos (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    CRUD de contratos por cliente/empresa, plano e vigência. Conteúdo placeholder.
                  </p>
                  <Button className="mt-4">Novo contrato</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faturas" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Faturas em aberto</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Gestão de faturas (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de faturas</CardTitle>
                  <CardDescription>Emissão, vencimento, pagamento e inadimplência (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Listagem de faturas por contrato, status e período. Conteúdo placeholder.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planos" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Planos disponíveis</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Configurador de planos (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Configurador de planos</CardTitle>
                  <CardDescription>Nome, preço, features e limites por plano (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Definição de planos (Basic, Professional, Enterprise), preços e módulos incluídos.
                  </p>
                  <Button className="mt-4">Editar planos</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agentes" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Agentes ativos</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Gestão de agentes (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de agentes</CardTitle>
                  <CardDescription>Ativar/desativar, parâmetros e uso por agente (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lista de agentes (ATA, diagnóstico, insights, PDI, pautas, briefing, etc.) com configuração
                    e métricas de uso. Sem conexão com backend.
                  </p>
                  <Button className="mt-4">Configurar agentes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Prompts cadastrados</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Gestão de prompts (fictício)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de prompts</CardTitle>
                  <CardDescription>Edição dos prompts por agente (fictício)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Os prompts estão centralizados em <code className="text-xs">src/prompts-agentes/prompts.ts</code>.
                    Esta aba pode futuramente permitir edição via UI e versionamento.
                  </p>
                  <Button className="mt-4">Ver prompts</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestaoIndicadores;
