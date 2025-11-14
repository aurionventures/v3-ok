import { useState, useMemo } from "react";
import { useCapTable } from "@/hooks/useCapTable";
import { useAuth } from "@/contexts/AuthContext";
import { getQualificationName } from "@/data/governanceStandards";
import { JuntaComercialExport } from "@/components/JuntaComercialExport";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Download, Users, Building, TrendingUp, AlertTriangle, Eye, Edit, Search, Calculator, FileText, Filter } from "lucide-react";

const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const CapTable = () => {
  const { user } = useAuth();
  const companyId = user?.company || "";
  const companyName = user?.name || "Empresa";
  const { shareholders, isLoading, metrics } = useCapTable(companyId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterQualification, setFilterQualification] = useState("all");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [newInvestorName, setNewInvestorName] = useState("");
  const [newInvestorPercentage, setNewInvestorPercentage] = useState("");

  const filteredShareholders = useMemo(() => {
    return shareholders.filter(shareholder => {
      const matchesSearch = shareholder.name.toLowerCase().includes(searchTerm.toLowerCase()) || shareholder.document?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTypeFilter = filterType === "all" || (filterType === "family" && shareholder.is_family_member) || (filterType === "external" && !shareholder.is_family_member) || (filterType === "pf" && shareholder.document && shareholder.document.replace(/\D/g, '').length === 11) || (filterType === "pj" && shareholder.document && shareholder.document.replace(/\D/g, '').length === 14);
      const matchesQualification = filterQualification === "all" || shareholder.official_qualification_code === filterQualification;
      return matchesSearch && matchesTypeFilter && matchesQualification;
    });
  }, [shareholders, searchTerm, filterType, filterQualification]);

  const chartData = useMemo(() => {
    if (!filteredShareholders.length) return [];
    return filteredShareholders.map((s, index) => ({ name: s.name, value: s.shareholding_percentage || 0, fill: chartColors[index % chartColors.length] }));
  }, [filteredShareholders]);

  const simulatedData = useMemo(() => {
    if (!newInvestorPercentage || !shareholders.length) return [];
    const newPercentage = parseFloat(newInvestorPercentage);
    if (isNaN(newPercentage) || newPercentage <= 0 || newPercentage >= 100) return [];
    const dilutionFactor = (100 - newPercentage) / 100;
    return shareholders.map(s => ({ name: s.name, current: s.shareholding_percentage || 0, afterDilution: (s.shareholding_percentage || 0) * dilutionFactor, change: (s.shareholding_percentage || 0) * (dilutionFactor - 1) }));
  }, [shareholders, newInvestorPercentage]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Cap Table</h1>
                <p className="text-muted-foreground">Estrutura de capital e participações societárias</p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList><TabsTrigger value="overview">Visão Geral</TabsTrigger><TabsTrigger value="table">Tabela Detalhada</TabsTrigger></TabsList>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Distribuição de Capital</CardTitle><CardDescription>Participação percentual de cada sócio</CardDescription></CardHeader>
                    <CardContent>{isLoading ? <div className="h-[300px] flex items-center justify-center text-muted-foreground">Carregando dados...</div> : chartData.length === 0 ? <div className="h-[300px] flex items-center justify-center text-muted-foreground">Nenhum sócio cadastrado</div> : <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(1)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Pie><Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} /><Legend /></PieChart></ResponsiveContainer>}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Métricas do Cap Table</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg"><div className="text-3xl font-bold text-primary">{metrics.totalShareholders}</div><div className="text-sm text-muted-foreground">Total de Sócios</div></div>
                        <div className="text-center p-4 bg-secondary/10 rounded-lg"><div className="text-3xl font-bold text-secondary-foreground">{shareholders.filter(s => s.is_family_member).length}</div><div className="text-sm text-muted-foreground">Controle Familiar</div></div>
                      </div>
                      <div><div className="flex justify-between text-sm mb-2"><span className="font-medium">Participação Familiar</span><span className="font-bold text-primary">{metrics.familyControl.toFixed(2)}%</span></div><Progress value={metrics.familyControl} className="h-3" /></div>
                      <div><div className="flex justify-between text-sm mb-2"><span className="font-medium">Investidores Externos</span><span className="font-bold text-orange-600">{metrics.externalInvestors.toFixed(2)}%</span></div><Progress value={metrics.externalInvestors} className="h-3" /></div>
                      {shareholders.length > 0 && <><Separator /><div className="border-t pt-4"><div className="text-sm font-medium mb-3">Distribuição por Qualificação RFB</div>{Object.entries(shareholders.reduce((acc, s) => { const code = s.official_qualification_code || "Não definido"; acc[code] = (acc[code] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([code, count]) => <div key={code} className="flex justify-between items-center py-2 text-sm"><span className="text-muted-foreground">{code !== "Não definido" ? `${code} - ${getQualificationName(code)}` : code}</span><Badge variant="outline">{count}</Badge></div>)}</div></>}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="table" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Sócios e Acionistas</CardTitle><CardDescription>Listagem completa com dados cadastrais e participação</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nome ou documento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div></div>
                      <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Tipos</SelectItem><SelectItem value="family">Família</SelectItem><SelectItem value="external">Externos</SelectItem><SelectItem value="pf">Pessoa Física</SelectItem><SelectItem value="pj">Pessoa Jurídica</SelectItem></SelectContent></Select>
                      <Select value={filterQualification} onValueChange={setFilterQualification}><SelectTrigger className="w-[220px]"><Building className="h-4 w-4 mr-2" /><SelectValue placeholder="Qualificação" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as Qualificações</SelectItem><SelectItem value="22">22 - Sócio</SelectItem><SelectItem value="23">23 - Sócio Capitalista</SelectItem><SelectItem value="49">49 - Sócio-Administrador</SelectItem><SelectItem value="52">52 - Sócio com Capital</SelectItem><SelectItem value="54">54 - Fundador</SelectItem></SelectContent></Select>
                    </div>
                    <div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Nome/Razão Social</TableHead><TableHead>Documento</TableHead><TableHead>Qualificação RFB</TableHead><TableHead>Tipo Entrada</TableHead><TableHead className="text-right">Participação %</TableHead><TableHead>Classe</TableHead><TableHead>Data Entrada</TableHead><TableHead>Geração</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader><TableBody>{isLoading ? <TableRow><TableCell colSpan={9} className="text-center py-8">Carregando Cap Table...</TableCell></TableRow> : filteredShareholders.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">{shareholders.length === 0 ? "Nenhum sócio cadastrado. Adicione membros na aba 'Estrutura Societária'" : "Nenhum sócio encontrado com os filtros aplicados"}</TableCell></TableRow> : filteredShareholders.map((s) => <TableRow key={s.id}><TableCell><div className="flex items-center gap-2"><div><div className="font-medium">{s.name}</div>{s.specific_role && <div className="text-xs text-muted-foreground">{s.specific_role}</div>}</div>{s.is_family_member && <Badge variant="secondary">Família</Badge>}</div></TableCell><TableCell><code className="text-xs bg-muted px-2 py-1 rounded">{s.document || "—"}</code></TableCell><TableCell>{s.official_qualification_code ? <div><Badge variant="outline" className="font-mono">{s.official_qualification_code}</Badge><div className="text-xs text-muted-foreground mt-1">{getQualificationName(s.official_qualification_code)}</div></div> : <Badge variant="destructive">Não definido</Badge>}</TableCell><TableCell><Badge variant="outline">{s.investment_type || "Não informado"}</Badge></TableCell><TableCell className="text-right"><div className="font-bold text-lg">{s.shareholding_percentage?.toFixed(2) || "0.00"}%</div></TableCell><TableCell>{s.shareholding_class || "—"}</TableCell><TableCell>{s.investment_entry_date ? new Date(s.investment_entry_date).toLocaleDateString('pt-BR') : "—"}</TableCell><TableCell>{s.generation ? <Badge variant="secondary">{s.generation}</Badge> : "—"}</TableCell><TableCell className="text-right"><div className="flex gap-1 justify-end"><Button variant="ghost" size="sm" title="Ver detalhes"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="sm" title="Editar"><Edit className="h-4 w-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <JuntaComercialExport isOpen={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)} shareholders={shareholders} companyName={companyName} />
      <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}><DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Simulador de Diluição</DialogTitle><DialogDescription>Simule a entrada de novos investidores e veja o impacto na participação atual</DialogDescription></DialogHeader><div className="space-y-6 py-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Nome do Novo Investidor</Label><Input placeholder="Ex: Fundo XYZ" value={newInvestorName} onChange={(e) => setNewInvestorName(e.target.value)} /></div><div className="space-y-2"><Label>Participação Desejada (%)</Label><Input type="number" placeholder="Ex: 20" min="0" max="100" step="0.01" value={newInvestorPercentage} onChange={(e) => setNewInvestorPercentage(e.target.value)} /></div></div>{simulatedData.length > 0 && <div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Sócio</TableHead><TableHead className="text-right">Atual (%)</TableHead><TableHead className="text-right">Após Diluição (%)</TableHead><TableHead className="text-right">Variação</TableHead></TableRow></TableHeader><TableBody>{simulatedData.map((item) => <TableRow key={item.name}><TableCell className="font-medium">{item.name}</TableCell><TableCell className="text-right">{item.current.toFixed(2)}%</TableCell><TableCell className="text-right font-bold">{item.afterDilution.toFixed(2)}%</TableCell><TableCell className="text-right"><span className="text-red-600">{item.change.toFixed(2)}%</span></TableCell></TableRow>)}{newInvestorName && <TableRow className="bg-muted/50"><TableCell className="font-bold">{newInvestorName}</TableCell><TableCell className="text-right">—</TableCell><TableCell className="text-right font-bold text-green-600">{parseFloat(newInvestorPercentage).toFixed(2)}%</TableCell><TableCell className="text-right"><Badge variant="default">Novo</Badge></TableCell></TableRow>}</TableBody></Table></div>}{simulatedData.length === 0 && newInvestorPercentage && <Alert><AlertDescription>Informe um percentual válido entre 0 e 100 para simular a diluição</AlertDescription></Alert>}<Alert><FileText className="h-4 w-4" /><AlertDescription className="text-xs"><strong>Nota:</strong> Esta é apenas uma simulação. Para aplicar as mudanças no Cap Table, adicione o novo sócio pela aba "Estrutura Societária" com a categoria "Acionistas/Sócios".</AlertDescription></Alert></div></DialogContent></Dialog>
    </div>
  );
};

export default CapTable;
