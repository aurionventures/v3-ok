
import React, { useState } from "react";
import { Shield, AlertCircle, Plus, Search, Save, PanelRight, PieChart, Target, Cog, DollarSign, CheckCircle, Eye, Pencil, Clock } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Eixos da matriz: Impacto (1-5) x Probabilidade (1=Baixa, 2=Média, 3=Alta)
const IMPACTO_LABELS = ["Insignificante", "Menor", "Moderado", "Maior", "Catastrófico"] as const;
const PROBABILIDADE_LABELS = ["Alta", "Média", "Baixa"] as const; // row 0 = Alta, row 1 = Média, row 2 = Baixa

const getMatrixCellLevel = (impact: number, probability: number): "baixo" | "medio" | "alto" | "critico" => {
  const score = impact * probability;
  if (score <= 2) return "baixo";
  if (score <= 6) return "medio";
  if (score <= 9) return "alto";
  return "critico";
};

// Riscos para a matriz (impacto 1-5, probabilidade 1=Baixa 2=Média 3=Alta)
const matrixRisks = [
  { id: "R1", risk: "Mudanças no Ambiente Competitivo", category: "Estratégicos", impact: 4, probability: 2, residual: 8, responsible: "CEO", previsao: "6 meses", status: "Ativo" as const, descricao: "Entrada de novos concorrentes ou mudanças tecnológicas disruptivas" },
  { id: "R2", risk: "Falhas em Sistemas Críticos", category: "Operacionais", impact: 4, probability: 1, residual: 4, responsible: "CTO", previsao: "90 dias", status: "Mitigado" as const, descricao: "Interrupção de sistemas de TI essenciais para operação" },
  { id: "R3", risk: "Risco de Liquidez", category: "Financeiros", impact: 4, probability: 1, residual: 5, responsible: "CFO", previsao: "3 meses", status: "Ativo" as const, descricao: "Dificuldade de honrar obrigações de curto prazo" },
  { id: "R4", risk: "Não conformidade regulatória", category: "Conformidade", impact: 3, probability: 3, residual: 6, responsible: "Compliance", previsao: "12 meses", status: "Em análise" as const, descricao: "Mudanças em normas do setor não acompanhadas" },
  { id: "R5", risk: "Dependência de fornecedor único", category: "Operacionais", impact: 4, probability: 2, residual: 4, responsible: "COO", previsao: "6 meses", status: "Mitigado" as const, descricao: "Concentração de insumos críticos em um único fornecedor" },
  { id: "R6", risk: "Perda de talentos-chave", category: "Estratégicos", impact: 3, probability: 1, residual: 2, responsible: "RH", previsao: "12 meses", status: "Ativo" as const, descricao: "Saída de executivos ou especialistas críticos" },
];

// Categorias para os cards (nome, quantidade, ícone, cor)
const categorySummary = [
  { name: "Estratégicos", count: 2, icon: Target, color: "text-red-600", bg: "bg-red-100" },
  { name: "Operacionais", count: 2, icon: Cog, color: "text-orange-600", bg: "bg-orange-100" },
  { name: "Financeiros", count: 1, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100" },
  { name: "Conformidade", count: 1, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
];

// Sample risks data (legado para outras abas)
const systemicRisks = [
  { id: 1, category: "Poder", risk: "Concentração excessiva de poder no fundador", impact: 4, probability: 3, responsible: "Carlos Silva", hasAction: true },
  { id: 2, category: "Cultura", risk: "Perda de valores essenciais na transição de gerações", impact: 5, probability: 4, responsible: "Ana Silva", hasAction: true },
  { id: 3, category: "Pessoas", risk: "Falta de preparo dos sucessores", impact: 5, probability: 3, responsible: "Carlos Silva", hasAction: true },
  { id: 4, category: "Sociedade", risk: "Mudanças regulatórias significativas no setor", impact: 4, probability: 2, responsible: "Pedro Silva", hasAction: false },
  { id: 5, category: "Tecnologia", risk: "Disrupção tecnológica no modelo de negócio", impact: 5, probability: 3, responsible: "Lucas Silva", hasAction: true },
];

// Sample risk mitigation actions
const mitigationActions = [
  {
    id: 1,
    riskId: 1,
    action: "Implementar modelo de governança com poderes equilibrados",
    deadline: "30/09/2025",
    status: "Em andamento",
    progress: 60,
  },
  {
    id: 2,
    riskId: 2,
    action: "Desenvolver programa de transmissão de valores e cultura",
    deadline: "15/08/2025",
    status: "Em andamento",
    progress: 40,
  },
  {
    id: 3,
    riskId: 3,
    action: "Criar plano de desenvolvimento individualizado para sucessores",
    deadline: "01/12/2025",
    status: "Não iniciada",
    progress: 0,
  },
  {
    id: 4,
    riskId: 5,
    action: "Análise de tendências tecnológicas e plano de adaptação",
    deadline: "30/06/2025",
    status: "Em andamento",
    progress: 25,
  },
];

// Categories data for chart
const riskCategories = [
  { category: "Poder", count: 3, criticalCount: 1 },
  { category: "Cultura", count: 4, criticalCount: 2 },
  { category: "Pessoas", count: 5, criticalCount: 2 },
  { category: "Sociedade", count: 2, criticalCount: 0 },
  { category: "Tecnologia", count: 3, criticalCount: 1 },
];

// Risk assessment schema
const riskFormSchema = z.object({
  category: z.string().min(1, "Obrigatório"),
  risk: z.string().min(1, "Obrigatório").max(100, "Máximo 100 caracteres"),
  impact: z.string().min(1, "Obrigatório"),
  probability: z.string().min(1, "Obrigatório"),
  responsible: z.string().min(1, "Obrigatório"),
  description: z.string().optional(),
  mitigationAction: z.string().optional(),
});

// Probabilidade no eixo Y: índice 0 = Alta (3), 1 = Média (2), 2 = Baixa (1)
const probIndexToValue = (rowIndex: number) => (rowIndex === 0 ? 3 : rowIndex === 1 ? 2 : 1);
const impactIndexToValue = (colIndex: number) => colIndex + 1;

const SystemicRisksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);

  // Agrupar riscos por célula (row = probIndex 0=Alta, 1=Média, 2=Baixa; col = impactIndex 0..4)
  const risksByCell = React.useMemo(() => {
    const map: Record<string, typeof matrixRisks[0][]> = {};
    matrixRisks.forEach((r) => {
      const rowIndex = r.probability === 3 ? 0 : r.probability === 2 ? 1 : 2;
      const colIndex = r.impact - 1;
      const key = `${rowIndex}-${colIndex}`;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, []);

  const filteredMatrixRisks = matrixRisks.filter((r) => {
    const matchSearch = !searchTerm || r.risk.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const form = useForm<z.infer<typeof riskFormSchema>>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      category: "",
      risk: "",
      impact: "",
      probability: "",
      responsible: "",
      description: "",
      mitigationAction: "",
    },
  });

  const filteredRisks = systemicRisks.filter(
    (risk) =>
      risk.risk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRisk = (riskId: number) => {
    setSelectedRisk(riskId);
  };

  const handleAddRisk = () => {
    toast({
      title: "Risco adicionado",
      description: "O novo risco sistêmico foi adicionado com sucesso.",
    });
  };

  const onSubmit = (values: z.infer<typeof riskFormSchema>) => {
    console.log(values);
    toast({
      title: "Risco adicionado",
      description: "O novo risco sistêmico foi adicionado com sucesso.",
    });
  };

  const getRiskLevel = (impact: number, probability: number) => {
    const level = impact * probability;
    if (level >= 16) return { color: "bg-red-500", text: "Crítico" };
    if (level >= 9) return { color: "bg-orange-500", text: "Alto" };
    if (level >= 4) return { color: "bg-yellow-500", text: "Médio" };
    return { color: "bg-green-500", text: "Baixo" };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Riscos de Governança" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Riscos Sistêmicos e Monitoramento
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="matrix">
                <TabsList className="mb-4">
                  <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
                  <TabsTrigger value="mitigation">Planos de Mitigação</TabsTrigger>
                  <TabsTrigger value="assessment">Nova Avaliação</TabsTrigger>
                  <TabsTrigger value="analytics">KPIs & Análise</TabsTrigger>
                </TabsList>

                <TabsContent value="matrix" className="space-y-6">
                  {/* Filtros */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar riscos..."
                        className="pl-8 rounded-md border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[220px] rounded-md border">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categorySummary.map((c) => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Risco
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Risco Sistêmico</DialogTitle>
                          <DialogDescription>Cadastre um novo risco para monitoramento</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="riskCategory" className="text-right">Categoria</label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categorySummary.map((c) => (
                                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="riskName" className="text-right">Risco</label>
                            <Input id="riskName" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="riskImpact" className="text-right">Impacto (1-5)</label>
                            <Input id="riskImpact" type="number" min="1" max="5" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="riskProbability" className="text-right">Probabilidade (1-5)</label>
                            <Input id="riskProbability" type="number" min="1" max="5" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="riskResponsible" className="text-right">Responsável</label>
                            <Input id="riskResponsible" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddRisk}>Adicionar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Matriz Impacto x Probabilidade */}
                  <div>
                    <h3 className="text-center text-lg font-semibold text-gray-900 mb-4">
                      Matriz de Riscos - Impacto x Probabilidade
                    </h3>
                    <div className="w-full overflow-x-auto">
                      <div className="w-full min-w-0">
                        <div className="grid grid-cols-6 gap-px bg-border rounded-lg overflow-hidden border border-border w-full">
                          <div className="col-span-1 min-w-0" />
                          {IMPACTO_LABELS.map((label) => (
                            <div key={label} className="p-2 bg-muted/50 text-center text-xs font-medium text-muted-foreground min-w-0">
                              {label}
                            </div>
                          ))}
                          {[0, 1, 2].map((rowIndex) => {
                            const probValue = probIndexToValue(rowIndex);
                            return (
                              <React.Fragment key={rowIndex}>
                                <div className="p-2 bg-muted/50 flex items-center justify-center text-xs font-medium text-muted-foreground border-r border-border min-w-0">
                                  {PROBABILIDADE_LABELS[rowIndex]}
                                </div>
                                {[0, 1, 2, 3, 4].map((colIndex) => {
                                  const impactValue = impactIndexToValue(colIndex);
                                  const level = getMatrixCellLevel(impactValue, probValue);
                                  const cellRisks = risksByCell[`${rowIndex}-${colIndex}`] || [];
                                  const levelClasses = {
                                    baixo: "bg-emerald-100 border-emerald-200",
                                    medio: "bg-amber-100 border-amber-200",
                                    alto: "bg-red-100 border-red-200",
                                    critico: "bg-red-200 border-red-300",
                                  };
                                  return (
                                    <div
                                      key={`${rowIndex}-${colIndex}`}
                                      className={`min-h-[100px] p-3 border ${levelClasses[level]} flex flex-wrap items-center justify-center gap-1.5 min-w-0`}
                                    >
                                      {cellRisks.filter((r) => filteredMatrixRisks.some((f) => f.id === r.id)).map((r) => (
                                        <span
                                          key={r.id}
                                          className="inline-flex items-center justify-center rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm border border-gray-200"
                                        >
                                          {r.id}
                                        </span>
                                      ))}
                                    </div>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-emerald-500" /> Baixo
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-amber-500" /> Médio
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-red-500" /> Alto
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-red-700" /> Crítico
                      </span>
                    </div>
                  </div>

                  {/* Cards por categoria */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categorySummary.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.name}
                          className="rounded-lg border bg-card p-4 shadow-sm flex items-center gap-3"
                        >
                          <div className={`rounded-lg p-2 ${cat.bg}`}>
                            <Icon className={`h-5 w-5 ${cat.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cat.name}</p>
                            <p className="text-sm text-muted-foreground">{cat.count} risco{cat.count !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tabela de riscos */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Risco</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Impacto</TableHead>
                          <TableHead>Probabilidade</TableHead>
                          <TableHead>Nível</TableHead>
                          <TableHead>Risco Residual</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Previsão</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMatrixRisks.map((r) => {
                          const level = getMatrixCellLevel(r.impact, r.probability);
                          const levelBadge = {
                            baixo: "bg-emerald-100 text-emerald-800",
                            medio: "bg-blue-100 text-blue-800",
                            alto: "bg-red-100 text-red-800",
                            critico: "bg-red-200 text-red-900",
                          };
                          const statusBadge = {
                            Ativo: "bg-blue-100 text-blue-800",
                            Mitigado: "bg-green-100 text-green-800",
                            "Em análise": "bg-amber-100 text-amber-800",
                          };
                          const categoryBadge = {
                            Estratégicos: "bg-red-100 text-red-800",
                            Operacionais: "bg-orange-100 text-orange-800",
                            Financeiros: "bg-amber-100 text-amber-800",
                            Conformidade: "bg-green-100 text-green-800",
                          };
                          return (
                            <TableRow key={r.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-gray-900">{r.risk}</p>
                                  <p className="text-xs text-muted-foreground">{r.descricao}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadge[r.category as keyof typeof categoryBadge] || "bg-gray-100 text-gray-800"}`}>
                                  {r.category}
                                </span>
                              </TableCell>
                              <TableCell>{r.impact}</TableCell>
                              <TableCell>{r.probability}</TableCell>
                              <TableCell>
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${levelBadge[level]}`}>
                                  {level === "baixo" ? "Baixo" : level === "medio" ? "Médio" : level === "alto" ? "Alto" : "Crítico"}
                                </span>
                              </TableCell>
                              <TableCell>{r.residual}</TableCell>
                              <TableCell>{r.responsible}</TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1 text-sm">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  {r.previsao}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[r.status] || "bg-gray-100 text-gray-800"}`}>
                                  {r.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="mitigation">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white p-5 rounded-lg border h-fit">
                      <h3 className="text-lg font-medium mb-4">Riscos Sistêmicos</h3>
                      <div className="space-y-3">
                        {systemicRisks.map((risk) => {
                          const riskLevel = getRiskLevel(risk.impact, risk.probability);
                          return (
                            <div 
                              key={risk.id}
                              className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedRisk === risk.id ? 'bg-gray-50 border-legacy-500' : ''}`}
                              onClick={() => handleViewRisk(risk.id)}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{risk.category}</h4>
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full ${riskLevel.color} mr-1`}></div>
                                  <span className="text-xs">{riskLevel.text}</span>
                                </div>
                              </div>
                              <p className="text-sm mt-1 line-clamp-2">{risk.risk}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-white p-5 rounded-lg border">
                      {selectedRisk ? (
                        <>
                          {(() => {
                            const risk = systemicRisks.find(r => r.id === selectedRisk);
                            const actions = mitigationActions.filter(a => a.riskId === selectedRisk);
                            if (!risk) return <p>Risco não encontrado</p>;

                            const riskLevel = getRiskLevel(risk.impact, risk.probability);
                            
                            return (
                              <>
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="bg-gray-200 px-2 py-0.5 rounded text-sm font-medium">
                                        {risk.category}
                                      </span>
                                      <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${riskLevel.color} mr-1`}></div>
                                        <span className="text-xs font-medium">{riskLevel.text}</span>
                                      </div>
                                    </div>
                                    <h3 className="text-lg font-medium">{risk.risk}</h3>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Responsável:</p>
                                    <p className="font-medium">{risk.responsible}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="border rounded p-3">
                                    <p className="text-sm text-gray-500">Impacto</p>
                                    <p className="text-xl font-medium">{risk.impact}/5</p>
                                  </div>
                                  <div className="border rounded p-3">
                                    <p className="text-sm text-gray-500">Probabilidade</p>
                                    <p className="text-xl font-medium">{risk.probability}/5</p>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <h4 className="text-medium font-medium mb-2">Planos de Mitigação</h4>
                                  {actions.length > 0 ? (
                                    <div className="space-y-4">
                                      {actions.map(action => (
                                        <div key={action.id} className="border rounded p-4">
                                          <div className="flex justify-between items-center mb-2">
                                            <h5 className="font-medium">{action.action}</h5>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                              action.status === "Concluída"
                                                ? "bg-green-100 text-green-800"
                                                : action.status === "Em andamento"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                              {action.status}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <p className="text-sm text-gray-500">Prazo:</p>
                                            <p className="text-sm">{action.deadline}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                              <span>Progresso:</span>
                                              <span>{action.progress}%</span>
                                            </div>
                                            <Progress value={action.progress} className="h-2" />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="border border-dashed rounded p-5 text-center">
                                      <p className="text-gray-500 mb-2">Nenhum plano de mitigação cadastrado</p>
                                      <Button size="sm">
                                        <Plus className="h-4 w-4 mr-1" /> Adicionar Plano
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end">
                                  <Button variant="outline" size="sm" className="mr-2">
                                    <PanelRight className="h-4 w-4 mr-1" /> Histórico
                                  </Button>
                                  <Button size="sm">
                                    <Plus className="h-4 w-4 mr-1" /> Nova Ação
                                  </Button>
                                </div>
                              </>
                            );
                          })()}
                        </>
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                          <AlertCircle className="h-10 w-10 mb-2" />
                          <p>Selecione um risco para ver detalhes e planos de mitigação</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assessment">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria de Risco</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="poder">Poder</SelectItem>
                                  <SelectItem value="cultura">Cultura</SelectItem>
                                  <SelectItem value="pessoas">Pessoas</SelectItem>
                                  <SelectItem value="sociedade">Sociedade</SelectItem>
                                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Selecione a categoria sistêmica deste risco.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="risk"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição do Risco</FormLabel>
                              <FormControl>
                                <Input placeholder="Descreva o risco identificado" {...field} />
                              </FormControl>
                              <FormDescription>
                                Descreva de forma clara e concisa o risco identificado.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="impact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Impacto</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o impacto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Muito Baixo</SelectItem>
                                  <SelectItem value="2">2 - Baixo</SelectItem>
                                  <SelectItem value="3">3 - Médio</SelectItem>
                                  <SelectItem value="4">4 - Alto</SelectItem>
                                  <SelectItem value="5">5 - Muito Alto</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie o impacto potencial deste risco.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="probability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Probabilidade</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a probabilidade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Muito Baixa</SelectItem>
                                  <SelectItem value="2">2 - Baixa</SelectItem>
                                  <SelectItem value="3">3 - Média</SelectItem>
                                  <SelectItem value="4">4 - Alta</SelectItem>
                                  <SelectItem value="5">5 - Muito Alta</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie a probabilidade de ocorrência deste risco.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="responsible"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Responsável pelo Monitoramento</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do responsável" {...field} />
                              </FormControl>
                              <FormDescription>
                                Indique o responsável pelo monitoramento deste risco.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detalhamento do Risco</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detalhe o contexto e possíveis consequências"
                                  {...field}
                                  className="h-20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="mitigationAction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plano de Mitigação Inicial (Opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva ações iniciais para mitigação deste risco..."
                                {...field}
                                className="h-32"
                              />
                            </FormControl>
                            <FormDescription>
                              Se já houver ações de mitigação planejadas, detalhe-as aqui.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit" className="w-full md:w-auto">
                          <Save className="h-4 w-4 mr-2" />
                          Registrar Risco Sistêmico
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Distribuição por Categoria</h3>
                      <div className="space-y-4">
                        {riskCategories.map((category) => (
                          <div key={category.category}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{category.category}</span>
                              <span>{category.count} riscos ({category.criticalCount} críticos)</span>
                            </div>
                            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-legacy-500 rounded-full relative"
                                style={{ width: `${(category.count / 5) * 100}%` }}
                              >
                                <div 
                                  className="absolute top-0 left-0 h-full bg-red-500 rounded-l-full"
                                  style={{ width: `${(category.criticalCount / category.count) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Sumário de Riscos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">Total de Riscos</p>
                          <p className="text-3xl font-bold text-legacy-500">17</p>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">Riscos Críticos</p>
                          <p className="text-3xl font-bold text-red-500">6</p>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">Planos de Mitigação</p>
                          <p className="text-3xl font-bold text-blue-500">12</p>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">Sem Mitigação</p>
                          <p className="text-3xl font-bold text-yellow-500">5</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Matriz de Risco</h3>
                      <div className="relative h-64 border p-2">
                        {/* Labels */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90">
                          <span className="text-sm font-medium">Impacto</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-[-100%]">
                          <span className="text-sm font-medium">Probabilidade</span>
                        </div>
                        
                        {/* Quadrants */}
                        <div className="grid grid-cols-5 grid-rows-5 h-full w-full">
                          {/* Row 5 (top) */}
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-orange-100"></div>
                          <div className="border bg-red-100"></div>
                          <div className="border bg-red-100"></div>
                          
                          {/* Row 4 */}
                          <div className="border bg-green-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-orange-100"></div>
                          <div className="border bg-red-100"></div>
                          
                          {/* Row 3 */}
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-orange-100"></div>
                          
                          {/* Row 2 */}
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-yellow-100"></div>
                          <div className="border bg-yellow-100"></div>
                          
                          {/* Row 1 (bottom) */}
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-green-100"></div>
                          <div className="border bg-yellow-100"></div>
                        </div>
                        
                        {/* Sample risk plots */}
                        <div className="absolute w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold" style={{ top: '15%', right: '15%' }}>2</div>
                        <div className="absolute w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold" style={{ top: '20%', right: '40%' }}>3</div>
                        <div className="absolute w-5 h-5 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold" style={{ top: '40%', right: '30%' }}>5</div>
                        <div className="absolute w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold" style={{ top: '70%', right: '60%' }}>7</div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Baixo</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Médio</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span>Alto</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Crítico</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Tendências de Risco</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Riscos Totais</span>
                          </div>
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500" style={{ width: "60%" }}></div>
                            <div className="h-full bg-green-500" style={{ width: "20%" }}></div>
                            <div className="h-full bg-red-500" style={{ width: "20%" }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>0</span>
                            <span>6 meses atrás</span>
                            <span>Atual</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Mitigação</span>
                          </div>
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: "40%" }}></div>
                            <div className="h-full bg-blue-500" style={{ width: "30%" }}></div>
                            <div className="h-full bg-gray-300" style={{ width: "30%" }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Concluído</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>Em andamento</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                              <span>Não iniciado</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-6">
                        <PieChart className="h-4 w-4 mr-2" />
                        Gerar Relatório Completo
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemicRisksPage;
