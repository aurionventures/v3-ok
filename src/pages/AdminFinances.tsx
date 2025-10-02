
import { useState } from "react";
import { DollarSign, FileText, Download, CreditCard, Users, BarChart3, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

const pricingPlans = [
  {
    name: "Basic",
    priceMonthly: 399,
    priceAnnual: 4308,  // 10% discount
    description: "Para pequenas empresas familiares iniciando sua jornada de governança.",
    features: [
      "Até 5 usuários",
      "Acesso a 3 Agentes de IA",
      "Armazenamento básico para documentos",
      "Suporte por e-mail"
    ],
    companies: [
      { name: "Família Oliveira", status: "Ativo", nextBilling: "10/06/2025", value: 399 },
      { name: "AGV Participações", status: "Ativo", nextBilling: "22/06/2025", value: 399 },
      { name: "Silva & Filhos", status: "Pendente", nextBilling: "05/06/2025", value: 399 }
    ]
  },
  {
    name: "Professional",
    priceMonthly: 999,
    priceAnnual: 10789, // 10% discount
    description: "Para empresas familiares em crescimento com necessidades avançadas de governança.",
    features: [
      "Até 15 usuários",
      "Acesso a todos os Agentes de IA",
      "Armazenamento ampliado para documentos",
      "Suporte por telefone e e-mail",
      "Relatórios avançados"
    ],
    companies: [
      { name: "Grupo Xavier", status: "Ativo", nextBilling: "15/06/2025", value: 999 },
      { name: "Holding Familiar Martins", status: "Ativo", nextBilling: "28/06/2025", value: 999 },
      { name: "Costa Empreendimentos", status: "Ativo", nextBilling: "03/07/2025", value: 999 },
      { name: "JLF Participações", status: "Ativo", nextBilling: "12/06/2025", value: 999 },
      { name: "Hotel Santo Antônio", status: "Ativo", nextBilling: "18/06/2025", value: 999 },
      { name: "Imobiliária Alves", status: "Ativo", nextBilling: "22/06/2025", value: 999 }
    ]
  },
  {
    name: "Enterprise",
    priceMonthly: 2499,
    priceAnnual: 26989, // 10% discount
    description: "Solução completa para empresas familiares complexas com múltiplas gerações.",
    features: [
      "Usuários ilimitados",
      "Acesso a todos os Agentes de IA com recursos personalizados",
      "Armazenamento ilimitado",
      "Suporte 24/7 com gerente de conta dedicado",
      "Consultoria de governança incluída",
      "API e integrações personalizadas"
    ],
    companies: [
      { name: "Grupo Insper", status: "Ativo", nextBilling: "14/06/2025", value: 2499 },
      { name: "Família Almeida Investimentos", status: "Ativo", nextBilling: "19/06/2025", value: 2499 },
      { name: "Grupo Empresarial Lima", status: "Pendente", nextBilling: "07/06/2025", value: 2499 }
    ]
  },
];

const invoices = [
  { id: "INV-001", company: "Grupo Insper", date: "02/05/2025", amount: 2499, status: "Pago" },
  { id: "INV-002", company: "Família Almeida Investimentos", date: "19/05/2025", amount: 2499, status: "Pago" },
  { id: "INV-003", company: "Grupo Xavier", date: "15/05/2025", amount: 999, status: "Pago" },
  { id: "INV-004", company: "Holding Familiar Martins", date: "28/05/2025", amount: 999, status: "Pago" },
  { id: "INV-005", company: "Costa Empreendimentos", date: "03/06/2025", amount: 999, status: "Aguardando" },
  { id: "INV-006", company: "Família Oliveira", date: "10/05/2025", amount: 399, status: "Pago" },
  { id: "INV-007", company: "AGV Participações", date: "22/05/2025", amount: 399, status: "Pago" },
  { id: "INV-008", company: "Silva & Filhos", date: "05/06/2025", amount: 399, status: "Pendente" },
  { id: "INV-009", company: "Grupo Empresarial Lima", date: "07/06/2025", amount: 2499, status: "Pendente" },
  { id: "INV-010", company: "JLF Participações", date: "12/05/2025", amount: 999, status: "Pago" }
];

const AdminFinances = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const totalMonthlyRevenue = pricingPlans.reduce((total, plan) => 
    total + plan.companies.reduce((planTotal, company) => planTotal + company.value, 0)
  , 0);
  
  const handleCreateInvoice = () => {
    toast({
      title: "Fatura criada",
      description: "A fatura foi criada com sucesso e enviada ao cliente.",
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="overview" className="space-y-6">
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
                      <Button className="w-full mt-4" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Todas as Faturas
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
                      <Button className="w-full mt-4" variant="outline">
                        Ações de Retenção
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </TabsContent>

            {/* Planos */}
            <TabsContent value="plans" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {pricingPlans.map((plan, idx) => (
                  <Card key={idx} className="overflow-hidden border-t-4" style={{borderTopColor: idx === 0 ? "#8b5cf6" : idx === 1 ? "#10b981" : "#3b82f6"}}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-3">
                        <div className="text-3xl font-bold">R$ {plan.priceMonthly}</div>
                        <div className="text-sm text-gray-500">por mês</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-green-50 p-1 text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Clientes neste plano ({plan.companies.length})</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {plan.companies.map((company, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                              <div>
                                <div className="font-medium">{company.name}</div>
                                <div className="text-xs text-gray-500">Próximo: {company.nextBilling}</div>
                              </div>
                              <Badge variant={company.status === "Ativo" ? "outline" : "secondary"}>
                                {company.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Cliente
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Opções de Pagamento</CardTitle>
                  <CardDescription>Descontos para contratos de longo prazo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">12 Meses</CardTitle>
                        <CardDescription>Pagamento anual</CardDescription>
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">10% desconto</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Economia significativa com compromisso anual</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Escolher plano</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border-2 border-green-500">
                      <CardHeader>
                        <div className="absolute right-4 top-4">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-800 hover:bg-green-100">
                            Mais Popular
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">24 Meses</CardTitle>
                        <CardDescription>Pagamento bianual</CardDescription>
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">15% desconto</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Melhor equilíbrio entre economia e flexibilidade</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Escolher plano</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">36 Meses</CardTitle>
                        <CardDescription>Pagamento trianual</CardDescription>
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">20% desconto</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Máxima economia para compromisso de longo prazo</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Escolher plano</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Faturas */}
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Faturas</CardTitle>
                      <CardDescription>Gerencie as faturas dos clientes</CardDescription>
                    </div>
                    <Button onClick={handleCreateInvoice}>
                      <FileText className="h-4 w-4 mr-2" /> Nova Fatura
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left font-medium">Fatura</th>
                            <th className="py-3 px-4 text-left font-medium">Empresa</th>
                            <th className="py-3 px-4 text-left font-medium">Data</th>
                            <th className="py-3 px-4 text-left font-medium">Valor</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-right font-medium">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-3 px-4">{invoice.id}</td>
                              <td className="py-3 px-4">{invoice.company}</td>
                              <td className="py-3 px-4">{invoice.date}</td>
                              <td className="py-3 px-4">R$ {invoice.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">
                                <Badge variant={
                                  invoice.status === "Pago" ? "outline" : 
                                  invoice.status === "Aguardando" ? "secondary" : "destructive"
                                }>
                                  {invoice.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default AdminFinances;
