import { Link } from "react-router-dom";
import { FileText, Download, CreditCard, Users, BarChart3, Building2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { useEmpresasAll } from "@/hooks/useEmpresas";

const AdminFinances = () => {
  const { empresas, isLoading } = useEmpresasAll();

  const empresasAtivas = empresas.filter((e) => e.ativo);
  const empresasInativas = empresas.filter((e) => !e.ativo);

  const handleCreateInvoice = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A integração de faturas será disponibilizada em breve.",
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Finanças" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestão Financeira</h1>
            <p className="text-gray-500">Gerencie assinaturas, faturas e relatórios financeiros</p>
          </div>

          <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Empresas Ativas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{empresasAtivas.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Clientes na plataforma</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Empresas Inativas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{empresasInativas.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Assinaturas suspensas</div>
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
                        <CardTitle className="text-sm font-medium text-gray-500">Faturamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">—</div>
                        <div className="text-sm text-gray-500 mt-1">Integração em configuração</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Empresas</CardTitle>
                        <CardDescription>Lista de empresas cadastradas na plataforma</CardDescription>
                      </CardHeader>
                      <CardContent className="min-h-48">
                        {empresas.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Building2 className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-gray-500">Nenhuma empresa cadastrada</p>
                            <Button asChild variant="outline" className="mt-3">
                              <Link to="/admin/companies">Cadastrar empresas</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {empresas.map((e) => (
                              <div
                                key={e.id}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                              >
                                <span className="font-medium">{e.nome}</span>
                                <span className={`text-xs ${e.ativo ? "text-green-600" : "text-gray-500"}`}>
                                  {e.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Métricas Financeiras</CardTitle>
                        <CardDescription>Receita e faturas</CardDescription>
                      </CardHeader>
                      <CardContent className="h-48 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Integração financeira em configuração</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Os dados de faturas e receita serão exibidos quando o módulo estiver ativo.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="flex-row items-center justify-between">
                      <div>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>Acesso rápido às funcionalidades</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto flex flex-col items-center justify-center p-4"
                          onClick={handleCreateInvoice}
                        >
                          <FileText className="h-8 w-8 mb-2" />
                          <span>Emitir Fatura</span>
                        </Button>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4" disabled>
                          <Download className="h-8 w-8 mb-2" />
                          <span>Relatórios</span>
                        </Button>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4" disabled>
                          <CreditCard className="h-8 w-8 mb-2" />
                          <span>Pagamentos</span>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                          <Link to="/admin/companies">
                            <Users className="h-8 w-8 mb-2" />
                            <span>Empresas</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinances;
