import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  ArrowUpRight, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Zap,
  AlertCircle,
  Clock,
  CheckCircle,
  PauseCircle,
  UserMinus,
  Receipt,
  Handshake,
  Brain,
  Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";

// Dados mock para MRR
const mrrData = [
  { month: "Jul", mrr: 45200 },
  { month: "Ago", mrr: 48900 },
  { month: "Set", mrr: 52100 },
  { month: "Out", mrr: 58400 },
  { month: "Nov", mrr: 62800 },
  { month: "Dez", mrr: 68500 },
];

// Distribuição por porte (atualizada)
const companiesBySize = [
  { name: "SMB", value: 3, color: "#3b82f6" },
  { name: "SMB+", value: 4, color: "#10b981" },
  { name: "Mid-Market", value: 5, color: "#f59e0b" },
  { name: "Large", value: 2, color: "#8b5cf6" },
  { name: "Enterprise", value: 1, color: "#ef4444" },
];

// Vendas por origem
const salesByOrigin = [
  { origin: "ISCA", vendas: 8, mrr: 15960 },
  { origin: "Direta", vendas: 5, mrr: 24950 },
  { origin: "Parceiro", vendas: 2, mrr: 9590 },
];

// Comissões devidas
const commissionsData = [
  { month: "Jul", comissao: 2100 },
  { month: "Ago", comissao: 2450 },
  { month: "Set", comissao: 2650 },
  { month: "Out", comissao: 2920 },
  { month: "Nov", comissao: 3140 },
  { month: "Dez", comissao: 3425 },
];

// Uso da IA
const aiUsageData = [
  { service: "Copilot", requests: 1250, growth: 12 },
  { service: "Governança", requests: 890, growth: 8 },
  { service: "ESG", requests: 640, growth: 15 },
  { service: "Sucessão", requests: 420, growth: 5 },
];

// Recebíveis
const receivablesData = [
  { name: "A receber", value: 68500, count: 15, color: "#3b82f6" },
  { name: "Vencido", value: 8990, count: 2, color: "#ef4444" },
  { name: "Pago", value: 59600, count: 13, color: "#10b981" },
];

// Vendas por Origem - preparado para pizza
const salesByOriginPie = [
  { name: "ISCA", value: 8, mrr: 15960, color: "#3b82f6" },
  { name: "Direta", value: 5, mrr: 24950, color: "#10b981" },
  { name: "Parceiro", value: 2, mrr: 9590, color: "#f59e0b" },
];

const Admin = () => {
  const navigate = useNavigate();
  
  // Métricas principais
  const metrics = {
    mrr: 68500,
    mrrGrowth: 9.1,
    activeCompanies: 15,
    newCompaniesThisMonth: 4,
    churnRate: 2.1,
    conversionRate: 3.4,
    avgTicket: 4567,
    totalReceivables: 77490,
    totalCommissions: 3425,
    aiRequests: 3200,
    aiGrowth: 10
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard de Gestão" />
        <div className="flex-1 overflow-y-auto p-4">
          {/* Métricas principais - 6 cards compactos */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <DollarSign className="h-3 w-3" />
                  MRR
                </div>
                <div className="text-lg font-bold">R$ {Math.floor(metrics.mrr/1000)}k</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-2.5 w-2.5" />
                  +{metrics.mrrGrowth}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Building2 className="h-3 w-3" />
                  Empresas Ativas
                </div>
                <div className="text-lg font-bold">{metrics.activeCompanies}</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-2.5 w-2.5" />
                  +{metrics.newCompaniesThisMonth}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Zap className="h-3 w-3" />
                  Conversão
                </div>
                <div className="text-lg font-bold">{metrics.conversionRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Ticket: R$ {Math.floor(metrics.avgTicket/1000)}k
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <UserMinus className="h-3 w-3" />
                  Churn Rate
                </div>
                <div className="text-lg font-bold">{metrics.churnRate}%</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingDown className="h-2.5 w-2.5" />
                  -0.3%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Receipt className="h-3 w-3" />
                  Recebíveis
                </div>
                <div className="text-lg font-bold">R$ {Math.floor(metrics.totalReceivables/1000)}k</div>
                <div className="text-xs text-red-500 mt-1">
                  {receivablesData.find(r => r.name === "Vencido")?.count} vencidos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Handshake className="h-3 w-3" />
                  Comissões
                </div>
                <div className="text-lg font-bold">R$ {Math.floor(metrics.totalCommissions/1000)}k</div>
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                  Este mês
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda linha - Gráficos compactos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Empresas por Porte - Donut */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Empresas por Porte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companiesBySize}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {companiesBySize.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} empresas`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {companiesBySize.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vendas por Origem - Pizza */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Vendas por Origem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByOriginPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {salesByOriginPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${value} vendas - R$ ${props.payload.mrr.toLocaleString('pt-BR')}`,
                          ''
                        ]}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {salesByOriginPie.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value} vendas</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recebíveis - Pizza */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recebíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={receivablesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {receivablesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {receivablesData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">R$ {Math.floor(item.value/1000)}k</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Uso da IA - Mini cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Uso da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiUsageData.map((item) => (
                    <div key={item.service} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.service}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{item.requests}</span>
                        <span className="text-green-500 text-[10px]">+{item.growth}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-border mt-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>Total</span>
                      <span>{metrics.aiRequests}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terceira linha - Gráficos maiores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Evolução do MRR */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Evolução do MRR</CardTitle>
                <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'MRR']}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
                    />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" fill="url(#mrrGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quarta linha - Comissões */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Evolução de Comissões</CardTitle>
                <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={commissionsData}>
                    <defs>
                      <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `R$ ${(v/1000).toFixed(1)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Comissões']}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
                    />
                    <Area type="monotone" dataKey="comissao" stroke="#f59e0b" fill="url(#commGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
