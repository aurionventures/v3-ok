import { Link } from "react-router-dom";
import { FileText, FileSignature } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// Dados simplificados para cálculo do MRR
const clientsByPlan = {
  basic: { count: 3, value: 399 },
  professional: { count: 6, value: 999 },
  enterprise: { count: 3, value: 2499 }
};

const AdminFinances = () => {
  const totalMonthlyRevenue = 
    (clientsByPlan.basic.count * clientsByPlan.basic.value) +
    (clientsByPlan.professional.count * clientsByPlan.professional.value) +
    (clientsByPlan.enterprise.count * clientsByPlan.enterprise.value);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">MRR (Receita Recorrente)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {totalMonthlyRevenue.toLocaleString()}</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      +12% vs. último mês
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">ARR (Receita Anual)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ {(totalMonthlyRevenue * 12).toLocaleString()}</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      Projeção anual
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8%</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      -2% vs. último mês
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">LTV Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R$ 45.2k</div>
                    <div className="text-sm text-green-500 flex items-center mt-1">
                      Lifetime Value
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Faturas Pendentes e Vencidas</CardTitle>
                    <CardDescription>Gestão de inadimplência</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-medium">Aguardando Pagamento</p>
                          <p className="text-sm text-muted-foreground">1 fatura</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ 999</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">Vencidas</p>
                          <p className="text-sm text-muted-foreground">2 faturas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">R$ 2.898</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline" asChild>
                        <Link to="/admin/faturas">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Todas as Faturas
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Renovações Próximas</CardTitle>
                    <CardDescription>Próximos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Grupo Insper", date: "14/06", value: 2499 },
                        { name: "Grupo Xavier", date: "15/06", value: 999 },
                        { name: "Família Almeida", date: "19/06", value: 2499 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.date}/2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">R$ {item.value}</p>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4" variant="outline" asChild>
                        <Link to="/admin/contratos">
                          <FileSignature className="h-4 w-4 mr-2" />
                          Ver Contratos
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinances;
