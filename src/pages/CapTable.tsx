
import { useState } from "react";
import { 
  PieChart, Plus, Filter, Download, Upload, Users, Building, 
  Calendar, TrendingUp, AlertTriangle, FileText, Eye, 
  Edit, Trash2, Search, Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sidebar from "@/components/Sidebar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// Mock data for demonstration
const mockShareholders = [
  {
    id: 1,
    name: "João Silva (Fundador)",
    type: "Pessoa Física",
    percentage: 35.5,
    shares: 355000,
    entryDate: "2020-01-15",
    acquisitionType: "Fundação",
    value: 1420000,
    family: true
  },
  {
    id: 2,
    name: "Maria Silva",
    type: "Pessoa Física", 
    percentage: 20.0,
    shares: 200000,
    entryDate: "2021-06-10",
    acquisitionType: "Herança",
    value: 800000,
    family: true
  },
  {
    id: 3,
    name: "Silva Holdings Ltda",
    type: "Pessoa Jurídica",
    percentage: 25.0,
    shares: 250000,
    entryDate: "2022-03-20",
    acquisitionType: "Reorganização",
    value: 1000000,
    family: true
  },
  {
    id: 4,
    name: "Investidor Anjo XYZ",
    type: "Pessoa Jurídica",
    percentage: 15.0,
    shares: 150000,
    entryDate: "2023-08-15",
    acquisitionType: "Compra",
    value: 750000,
    family: false
  },
  {
    id: 5,
    name: "Pedro Silva (Herdeiro)",
    type: "Pessoa Física",
    percentage: 4.5,
    shares: 45000,
    entryDate: "2024-01-10",
    acquisitionType: "Doação",
    value: 225000,
    family: true
  }
];

const mockCompanies = [
  { id: 1, name: "Silva Indústria S.A.", segment: "Manufatura" },
  { id: 2, name: "Silva Participações Ltda", segment: "Holding" },
  { id: 3, name: "Silva Tech Innovation", segment: "Tecnologia" }
];

const chartColors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const chartData = mockShareholders.map((shareholder, index) => ({
  name: shareholder.name,
  value: shareholder.percentage,
  fill: chartColors[index % chartColors.length]
}));

const evolutionData = [
  { month: "Jan 2023", joao: 40, maria: 25, holding: 20, investidor: 15, pedro: 0 },
  { month: "Jun 2023", joao: 38, maria: 22, holding: 22, investidor: 15, pedro: 3 },
  { month: "Jan 2024", joao: 35.5, maria: 20, holding: 25, investidor: 15, pedro: 4.5 }
];

const CapTable = () => {
  const [selectedCompany, setSelectedCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const filteredShareholders = mockShareholders.filter(shareholder => {
    const matchesSearch = shareholder.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "family" && shareholder.family) ||
                         (filterType === "external" && !shareholder.family) ||
                         (filterType === "pf" && shareholder.type === "Pessoa Física") ||
                         (filterType === "pj" && shareholder.type === "Pessoa Jurídica");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cap Table & Participações</h1>
              <p className="text-gray-600 mt-1">Gestão completa da estrutura societária e participações</p>
            </div>
            
            <div className="flex gap-3">
              <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Simulador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Simulador de Eventos Societários</DialogTitle>
                    <DialogDescription>
                      Simule mudanças no Cap Table e visualize os impactos
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Evento</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o evento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entrada de Sócio</SelectItem>
                            <SelectItem value="exit">Saída de Sócio</SelectItem>
                            <SelectItem value="capital-increase">Aumento Capital</SelectItem>
                            <SelectItem value="donation">Doação/Herança</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Percentual Envolvido (%)</Label>
                        <Input type="number" placeholder="Ex: 10.5" />
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Impacto Simulado:</strong> A entrada de um novo sócio com 10% resultaria na diluição proporcional de todos os sócios atuais.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex gap-2 pt-4">
                      <Button>Executar Simulação</Button>
                      <Button variant="outline">Gerar Relatório PDF</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Sócio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Sócio/Acionista</DialogTitle>
                    <DialogDescription>
                      Adicione um novo participante ao Cap Table
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Nome/Razão Social</Label>
                      <Input placeholder="Nome completo ou razão social" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pf">Pessoa Física</SelectItem>
                            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Percentual (%)</Label>
                        <Input type="number" placeholder="Ex: 15.5" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Data de Entrada</Label>
                        <Input type="date" />
                      </div>
                      
                      <div>
                        <Label>Tipo de Aquisição</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compra">Compra</SelectItem>
                            <SelectItem value="heranca">Herança</SelectItem>
                            <SelectItem value="doacao">Doação</SelectItem>
                            <SelectItem value="fundacao">Fundação</SelectItem>
                            <SelectItem value="reorganizacao">Reorganização</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Valor Aportado (R$)</Label>
                      <Input type="number" placeholder="Ex: 500000" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="family" />
                      <Label htmlFor="family">Membro da família</Label>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => setIsAddDialogOpen(false)}>Adicionar</Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Company Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Empresa Selecionada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name} - {company.segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="table">Tabela Detalhada</TabsTrigger>
              <TabsTrigger value="evolution">Evolução</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição Atual - Cap Table</CardTitle>
                    <CardDescription>Participações por sócio/acionista</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: {
                          label: "Participação %",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Summary Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo Executivo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{mockShareholders.length}</div>
                        <div className="text-sm text-gray-600">Total de Sócios</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {mockShareholders.filter(s => s.family).length}
                        </div>
                        <div className="text-sm text-gray-600">Membros da Família</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Controle Familiar</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="mt-1" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Investidores Externos</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="mt-1" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-lg font-semibold">Valor Total Avaliado</div>
                      <div className="text-2xl font-bold text-legacy-500">R$ 5.000.000</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Table Tab */}
            <TabsContent value="table" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Cap Table Detalhado</CardTitle>
                      <CardDescription>Lista completa de participações societárias</CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="family">Apenas Família</SelectItem>
                        <SelectItem value="external">Apenas Externos</SelectItem>
                        <SelectItem value="pf">Pessoa Física</SelectItem>
                        <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome/Razão Social</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Participação %</TableHead>
                        <TableHead>Quotas/Ações</TableHead>
                        <TableHead>Data Entrada</TableHead>
                        <TableHead>Tipo Aquisição</TableHead>
                        <TableHead>Valor (R$)</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShareholders.map((shareholder) => (
                        <TableRow key={shareholder.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {shareholder.name}
                              {shareholder.family && (
                                <Badge variant="secondary">Família</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{shareholder.type}</TableCell>
                          <TableCell className="font-medium">{shareholder.percentage}%</TableCell>
                          <TableCell>{shareholder.shares.toLocaleString()}</TableCell>
                          <TableCell>{new Date(shareholder.entryDate).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{shareholder.acquisitionType}</Badge>
                          </TableCell>
                          <TableCell>R$ {shareholder.value.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolution Tab */}
            <TabsContent value="evolution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Cap Table</CardTitle>
                  <CardDescription>Histórico de mudanças nas participações ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      joao: { label: "João Silva", color: "#8B5CF6" },
                      maria: { label: "Maria Silva", color: "#06B6D4" },
                      holding: { label: "Silva Holdings", color: "#10B981" },
                      investidor: { label: "Investidor Anjo", color: "#F59E0B" },
                      pedro: { label: "Pedro Silva", color: "#EF4444" }
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="joao" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="maria" stroke="#06B6D4" strokeWidth={2} />
                        <Line type="monotone" dataKey="holding" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="investidor" stroke="#F59E0B" strokeWidth={2} />
                        <Line type="monotone" dataKey="pedro" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos Societários
                  </CardTitle>
                  <CardDescription>Documentos relacionados ao Cap Table e eventos societários</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Contrato Social Atualizado", date: "2024-01-15", type: "Contrato", status: "Ativo" },
                      { name: "Ata Assembleia - Entrada Pedro Silva", date: "2024-01-10", type: "Ata", status: "Aprovado" },
                      { name: "Acordo de Acionistas", date: "2023-08-15", type: "Acordo", status: "Vigente" },
                      { name: "Avaliação da Empresa - 2024", date: "2024-02-01", type: "Avaliação", status: "Atual" }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.type} • {doc.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Alertas e Lembretes
                  </CardTitle>
                  <CardDescription>Eventos importantes e prazos relacionados ao Cap Table</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Assembleia Anual:</strong> Assembleia geral programada para 15/03/2024 para aprovação das demonstrações financeiras.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Direito de Preferência:</strong> Investidor Anjo XYZ pode exercer direito de preferência até 30/06/2024.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Renovação de Acordo:</strong> Acordo de acionistas vence em 15/08/2024 e precisa ser renovado.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CapTable;
