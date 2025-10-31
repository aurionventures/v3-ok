
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
import Header from "@/components/Header";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts";

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Cap Table & Participações" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-muted-foreground">Gestão completa da estrutura societária e participações</p>
              </div>
            
          </div>


          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="table">Tabela Detalhada</TabsTrigger>
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
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                          />
                          <RechartsPieChart data={chartData}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </RechartsPieChart>
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



          </Tabs>
        </div>
        </main>
      </div>
    </div>
  );
};

export default CapTable;
