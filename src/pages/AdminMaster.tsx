import { BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminMaster = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Funil de vendas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão de Funil de vendas</h1>
            <p className="text-gray-500">Funil de leads e conversão da plataforma</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de leads (7 dias)</CardDescription>
                <CardTitle className="text-2xl">—</CardTitle>
                <p className="text-xs text-gray-500">Integração em configuração</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taxa de conversão (lead → ativação)</CardDescription>
                <CardTitle className="text-2xl">—</CardTitle>
                <p className="text-xs text-gray-500">Integração em configuração</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tempo médio no funil</CardDescription>
                <CardTitle className="text-2xl">—</CardTitle>
                <p className="text-xs text-gray-500">Integração em configuração</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ativações no período</CardDescription>
                <CardTitle className="text-2xl">—</CardTitle>
                <p className="text-xs text-gray-500">Integração em configuração</p>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Volume de Leads por Dia</CardTitle>
                <CardDescription>Evolução do funil ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-gray-500">Integração em configuração</p>
                  <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Taxas de Conversão por Etapa</CardTitle>
                <CardDescription>Percentual de leads que avançam entre etapas</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-gray-500">Integração em configuração</p>
                  <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por etapa</CardTitle>
                <CardDescription>Quantidade de leads em cada etapa do funil</CardDescription>
              </CardHeader>
              <CardContent className="h-32 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Integração em configuração</p>
                  <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaster;
