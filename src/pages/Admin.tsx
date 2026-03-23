import { useNavigate } from "react-router-dom";
import { FileText, Download, CreditCard, UserPlus, BarChart3, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PlatformDocumentation from "@/components/PlatformDocumentation";
import { useEmpresasAll } from "@/hooks/useEmpresas";

const Admin = () => {
  const navigate = useNavigate();
  const { empresas, isLoading } = useEmpresasAll();
  const empresasAtivas = empresas.filter((e) => e.ativo).length;
  
  // Navigation handlers
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Admin Dashboard" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-gray-500">Visão geral da plataforma Legacy</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 mb-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Empresas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{empresasAtivas}</div>
                <div className="text-sm text-gray-500 mt-1">Clientes na plataforma</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Empresas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{empresas.length}</div>
                <div className="text-sm text-gray-500 mt-1">Cadastradas no sistema</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Faturamento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">—</div>
                <div className="text-sm text-gray-500 mt-1">Integração em configuração</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Faturas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">—</div>
                <div className="text-sm text-gray-500 mt-1">Integração em configuração</div>
              </CardContent>
            </Card>
          </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Consumo de Tokens por Agente</CardTitle>
                <CardDescription>Uso de tokens por tipo de agente</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-gray-500">Integração em configuração</p>
                  <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresas</CardTitle>
                <CardDescription>Distribuição na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-3xl font-bold text-legacy-500">{empresas.length}</div>
                  <p className="text-sm text-gray-500 mt-1">empresas cadastradas</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" onClick={() => navigate("/admin/companies")}>
                  Ver Empresas
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Campanhas de Marketing</CardTitle>
                <CardDescription>Status das campanhas ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Integração em configuração</p>
                    <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => handleNavigation("/admin/marketing")}>
                  Gerenciar Campanhas
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas ações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Integração em configuração</p>
                    <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => handleNavigation("/admin/activities")}>
                  Ver Todas as Atividades
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights de IA</CardTitle>
                <CardDescription>Análises e recomendações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Integração em configuração</p>
                    <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo estiver ativo.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => handleNavigation("/admin/insights")}>
                  Ver Todos os Insights
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center w-full" onClick={() => handleNavigation("/admin/finances/invoices")}>
                  <FileText className="h-6 w-6 mb-1" />
                  <span>Emitir Fatura</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center w-full" onClick={() => handleNavigation("/admin/reports")}>
                  <Download className="h-6 w-6 mb-1" />
                  <span>Relatórios</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center w-full" onClick={() => handleNavigation("/admin/finances/payments")}>
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span>Pagamentos</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center w-full" onClick={() => handleNavigation("/admin/companies")}>
                  <UserPlus className="h-6 w-6 mb-1" />
                  <span>Clientes</span>
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4 text-legacy-500">Documentação da Plataforma</h3>
                <PlatformDocumentation />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Receita dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-gray-500">Integração em configuração</p>
                <p className="text-sm text-gray-400 mt-1">Os dados serão exibidos quando o módulo financeiro estiver ativo.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
