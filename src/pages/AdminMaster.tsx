import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

const volumeLeadsPorDia = [
  { date: "18/02", iscaIniciada: 8, iscaCompleta: 6, descoberta: 10, checkout: 4, pagamento: 3, ativacao: 5 },
  { date: "19/02", iscaIniciada: 12, iscaCompleta: 9, descoberta: 14, checkout: 6, pagamento: 5, ativacao: 7 },
  { date: "20/02", iscaIniciada: 10, iscaCompleta: 8, descoberta: 12, checkout: 5, pagamento: 4, ativacao: 6 },
  { date: "21/02", iscaIniciada: 15, iscaCompleta: 12, descoberta: 18, checkout: 8, pagamento: 6, ativacao: 10 },
  { date: "22/02", iscaIniciada: 14, iscaCompleta: 11, descoberta: 16, checkout: 7, pagamento: 6, ativacao: 9 },
  { date: "23/02", iscaIniciada: 9, iscaCompleta: 7, descoberta: 11, checkout: 5, pagamento: 4, ativacao: 6 },
  { date: "24/02", iscaIniciada: 11, iscaCompleta: 8, descoberta: 13, checkout: 6, pagamento: 5, ativacao: 7 },
];

const taxasConversaoEtapa = [
  { etapa: "ISCA → ISCA", valor: 60, fill: "#EAB308" },
  { etapa: "Descoberta → Descoberta", valor: 72, fill: "#22c55e" },
  { etapa: "Checkout → Checkout", valor: 82, fill: "#22c55e" },
  { etapa: "Pagamento → Pagamento", valor: 92, fill: "#22c55e" },
  { etapa: "Ativação → Ativação", valor: 98, fill: "#22c55e" },
];

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
                <CardTitle className="text-2xl">79</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taxa de conversão (lead → ativação)</CardDescription>
                <CardTitle className="text-2xl">14,2%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tempo médio no funil</CardDescription>
                <CardTitle className="text-2xl">2,3 dias</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ativações no período</CardDescription>
                <CardTitle className="text-2xl">50</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Volume de Leads por Dia</CardTitle>
                <CardDescription>Evolução do funil ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={volumeLeadsPorDia}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 80]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0" }}
                      formatter={(value: number) => [value, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="iscaIniciada"
                      stackId="1"
                      name="ISCA Iniciada"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="iscaCompleta"
                      stackId="1"
                      name="ISCA Completa"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="descoberta"
                      stackId="1"
                      name="Descoberta"
                      stroke="#d946ef"
                      fill="#d946ef"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="checkout"
                      stackId="1"
                      name="Checkout"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="pagamento"
                      stackId="1"
                      name="Pagamento"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="ativacao"
                      stackId="1"
                      name="Ativação"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Taxas de Conversão por Etapa</CardTitle>
                <CardDescription>Percentual de leads que avançam entre etapas</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={taxasConversaoEtapa}
                    margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="etapa" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0" }}
                      formatter={(value: number) => [`${value}%`, "Conversão"]}
                    />
                    <Bar dataKey="valor" name="Conversão" radius={[0, 4, 4, 0]}>
                      {taxasConversaoEtapa.map((_, index) => (
                        <Cell key={index} fill={taxasConversaoEtapa[index].fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por etapa (último dia)</CardTitle>
                <CardDescription>Quantidade de leads em cada etapa do funil em 24/02</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { label: "ISCA Iniciada", valor: 11, color: "bg-blue-500" },
                    { label: "ISCA Completa", valor: 8, color: "bg-violet-500" },
                    { label: "Descoberta", valor: 13, color: "bg-fuchsia-500" },
                    { label: "Checkout", valor: 6, color: "bg-red-500" },
                    { label: "Pagamento", valor: 5, color: "bg-orange-500" },
                    { label: "Ativação", valor: 7, color: "bg-green-500" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border p-3 text-center"
                    >
                      <div className={`h-2 rounded-full ${item.color} mb-2 mx-auto max-w-[40px]`} />
                      <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-semibold">{item.valor}</p>
                    </div>
                  ))}
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
