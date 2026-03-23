import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchLeadsDiagnostico } from "@/services/leadsDiagnostico";

const AdminMaster = () => {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads-diagnostico"],
    queryFn: async () => {
      const { data } = await fetchLeadsDiagnostico();
      return data;
    },
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const leadsUltimos7Dias = leads.filter(
    (l) => new Date(l.created_at) >= sevenDaysAgo
  ).length;

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
                <CardTitle className="text-2xl">
                  {isLoading ? "—" : leadsUltimos7Dias}
                </CardTitle>
                <p className="text-xs text-gray-500">Diagnóstico + contato (landing)</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de leads (todos)</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? "—" : leads.length}
                </CardTitle>
                <p className="text-xs text-gray-500">Leads capturados no CRM</p>
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

          {/* CRM – Leads do Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leads do Diagnóstico (CRM)
              </CardTitle>
              <CardDescription>
                Leads do diagnóstico de maturidade e do formulário &quot;Ou entre em contato&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
              ) : leads.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Nenhum lead capturado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Origem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((l) => {
                        const isContato = l.nivel_geral == null && l.overall_score == null;
                        return (
                        <TableRow key={l.id}>
                          <TableCell>
                            <Badge variant={isContato ? "secondary" : "default"}>
                              {isContato ? "Contato" : "Diagnóstico"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{l.nome}</TableCell>
                          <TableCell>
                            <a href={`mailto:${l.email}`} className="text-primary hover:underline flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {l.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            {l.telefone ? (
                              <a href={`tel:${l.telefone}`} className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {l.telefone}
                              </a>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>{l.empresa || "—"}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                l.nivel_geral === "Alto"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : l.nivel_geral === "Médio"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {l.nivel_geral ?? "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>{l.overall_score != null ? l.overall_score.toFixed(1) : "—"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(l.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                        </TableRow>
                      );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMaster;
