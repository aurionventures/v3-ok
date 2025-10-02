
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Settings, BarChart3, Users, ArrowUpRight, FileText, Download, CreditCard, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import PlatformDocumentation from "@/components/PlatformDocumentation";

// Chart data for token consumption by agent
const tokenUsageData = [
  { name: "Consilium", tokens: 4500 },
  { name: "Succession Mentor", tokens: 3200 },
  { name: "Legacy Curator", tokens: 2800 },
  { name: "ESG Advisor", tokens: 5100 },
  { name: "Risk Sentinel", tokens: 1900 },
];

// Chart data for companies per plan
const companiesPerPlanData = [
  { name: "Enterprise", value: 3, color: "#3b82f6" },
  { name: "Professional", value: 6, color: "#10b981" },
  { name: "Basic", value: 3, color: "#8b5cf6" },
];

// Chart data for monthly revenue
const monthlyRevenueData = [
  { month: "Jan", revenue: 18400 },
  { month: "Feb", revenue: 19200 },
  { month: "Mar", revenue: 20100 },
  { month: "Apr", revenue: 21500 },
  { month: "Mai", revenue: 22800 },
  { month: "Jun", revenue: 24200 },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeCompanies, setActiveCompanies] = useState(12);
  const [totalUsers, setTotalUsers] = useState(48);
  const [monthlyRevenue, setMonthlyRevenue] = useState(22800);
  const [pendingInvoices, setPendingInvoices] = useState(3);
  
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Empresas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeCompanies}</div>
                <div className="text-sm text-green-500 flex items-center mt-1">
                  +2 este mês
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Usuários Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <div className="text-sm text-green-500 flex items-center mt-1">
                  +8 este mês
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Faturamento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ {monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-500 flex items-center mt-1">
                  +12% vs. último mês
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Faturas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingInvoices}</div>
                <div className="text-sm text-amber-500 flex items-center mt-1">
                  Valor: R$ 5.400,00
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Consumo de Tokens por Agente</CardTitle>
                <CardDescription>Uso de tokens por tipo de agente</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tokenUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} tokens`, 'Consumo']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} 
                    />
                    <Bar dataKey="tokens" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresas por Plano</CardTitle>
                <CardDescription>Distribuição de empresas por tipo de plano</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companiesPerPlanData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {companiesPerPlanData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} empresas`, '']}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-4">
                  {companiesPerPlanData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value} empresas</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" onClick={() => navigate("/admin/finances")}>
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Evolução dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
