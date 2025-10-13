import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Plus, 
  Eye, 
  Edit,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import RiskMatrix from "@/components/RiskMatrix";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { RiskDetailsDialog } from "@/components/risks/RiskDetailsDialog";
import { RiskEditDialog } from "@/components/risks/RiskEditDialog";

// Governance Risk Categories
// Import shared risk data
import { RISK_CATEGORIES, governanceRisks, GovernanceRisk, RiskCategory } from "@/data/riskData";
import { getRiskLevel, getRiskColor } from "@/utils/riskCalculator";

// Mitigation Plans
const mitigationPlans = [
  {
    riskId: 1,
    comments: "",
    aiEnhanced: false,
    actions: [
      { id: 1, description: "Implementar sistema de intelligence competitiva", deadline: "2024-10-31", status: "in_progress", progress: 60 },
      { id: 2, description: "Desenvolver plano de inovação disruptiva", deadline: "2024-12-15", status: "planned", progress: 0 }
    ]
  },
  {
    riskId: 3,
    comments: "",
    aiEnhanced: false,
    actions: [
      { id: 3, description: "Renegociar linhas de crédito", deadline: "2024-09-30", status: "completed", progress: 100 },
      { id: 4, description: "Implementar cash flow forecasting avançado", deadline: "2024-11-15", status: "in_progress", progress: 40 }
    ]
  }
];

// Form Schema
const riskFormSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  impact: z.string().min(1, "Selecione o impacto"),
  probability: z.string().min(1, "Selecione a probabilidade"),
  responsible: z.string().min(2, "Nome do responsável é obrigatório"),
  resolutionTime: z.string().min(1, "Selecione o tempo de resolução"),
  controls: z.string().min(10, "Descreva os controles existentes")
});

// KPIs Data
const kpiData = [
  { name: "Riscos Críticos", value: 2, target: 0, color: "#ef4444" },
  { name: "Riscos Altos", value: 5, target: 3, color: "#f97316" },
  { name: "Riscos Médios", value: 8, target: 10, color: "#eab308" },
  { name: "Riscos Baixos", value: 12, target: 15, color: "#22c55e" }
];

const riskTrend = [
  { month: "Jan", critical: 3, high: 7, medium: 5, low: 8 },
  { month: "Fev", critical: 2, high: 6, medium: 6, low: 10 },
  { month: "Mar", critical: 2, high: 5, medium: 8, low: 12 },
  { month: "Abr", critical: 2, high: 5, medium: 8, low: 12 }
];

const GovernanceRiskManagement = () => {
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mitigationComments, setMitigationComments] = useState<{[key: number]: string}>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<GovernanceRisk | null>(null);

  const form = useForm<z.infer<typeof riskFormSchema>>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      impact: "",
      probability: "",
      responsible: "",
      resolutionTime: "",
      controls: ""
    }
  });

  const onSubmit = (values: z.infer<typeof riskFormSchema>) => {
    console.log(values);
    toast.success("Risco cadastrado com sucesso!");
    form.reset();
  };

  const getRiskLevel = (impact: number, probability: number) => {
    const score = impact * probability;
    if (score >= 16) return { level: "Crítico", color: "destructive" };
    if (score >= 12) return { level: "Alto", color: "destructive" };
    if (score >= 6) return { level: "Médio", color: "default" };
    return { level: "Baixo", color: "secondary" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "in_progress": return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "planned": return <Badge className="bg-gray-100 text-gray-800">Planejado</Badge>;
      case "urgent": return <Badge variant="destructive">Urgente</Badge>;
      case "mitigated": return <Badge className="bg-green-100 text-green-800">Mitigado</Badge>;
      default: return <Badge variant="outline">Ativo</Badge>;
    }
  };

  const handleViewRisk = (risk: GovernanceRisk) => {
    setCurrentRisk(risk);
    setDetailsDialogOpen(true);
  };

  const handleEditRisk = (risk: GovernanceRisk) => {
    setCurrentRisk(risk);
    setEditDialogOpen(true);
    setDetailsDialogOpen(false);
  };

  const handleSaveRisk = (data: any) => {
    console.log("Saving risk:", data);
    toast.success("Risco atualizado com sucesso!");
    setEditDialogOpen(false);
    setCurrentRisk(null);
  };

  const handleEnhanceWithAI = async (riskId: number) => {
    setIsEnhancing(true);
    
    try {
      const risk = governanceRisks.find(r => r.id === riskId);
      const plan = mitigationPlans.find(p => p.riskId === riskId);
      const comments = mitigationComments[riskId] || "";
      
      if (!risk) return;

      // Simular chamada para IA (implementar com API real posteriormente)
      const enhancementPrompt = `
        Analise o seguinte risco e plano de mitigação, considerando os comentários adicionais:
        
        Risco: ${risk.title}
        Descrição: ${risk.description}
        Categoria: ${risk.category}
        Impacto: ${risk.impact}/5
        Probabilidade: ${risk.probability}/5
        Controles existentes: ${risk.controls.join(', ')}
        
        Plano atual: ${plan?.actions.map(a => a.description).join('; ') || 'Nenhum plano definido'}
        
        Comentários adicionais: ${comments || 'Nenhum comentário'}
        
        Forneça sugestões detalhadas para enriquecer o plano de mitigação seguindo as melhores práticas de gestão de riscos de governança.
      `;

      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiSuggestions = `Com base na análise do risco "${risk.title}", recomendo as seguintes melhorias ao plano de mitigação:

1. **Monitoramento Contínuo**: Implementar indicadores de early warning específicos para este risco
2. **Diversificação de Controles**: Adicionar controles preventivos e detectivos complementares
3. **Plano de Contingência**: Desenvolver cenários alternativos de resposta
4. **Revisão Periódica**: Estabelecer cronograma de revisão trimestral do plano
5. **Treinamento da Equipe**: Capacitar responsáveis em melhores práticas de mitigação

${comments ? `Considerando seus comentários: "${comments}", sugiro também focar em aspectos específicos mencionados.` : ''}`;

      // Atualizar comentários com sugestões da IA
      setMitigationComments(prev => ({
        ...prev,
        [riskId]: aiSuggestions
      }));
      
      toast.success("Plano enriquecido com sugestões da IA!");
      
    } catch (error) {
      toast.error("Erro ao enriquecer plano com IA");
    } finally {
      setIsEnhancing(false);
    }
  };

  const filteredRisks = governanceRisks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || risk.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Riscos de Governança" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Sistema de Gestão de Riscos de Governança
              </CardTitle>
              <CardDescription>
                Gestão estruturada de riscos baseada nas diretrizes do Instituto Brasileiro de Governança Corporativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="matrix" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
                  <TabsTrigger value="mitigation">Planos de Mitigação</TabsTrigger>
                  <TabsTrigger value="assessment">Nova Avaliação</TabsTrigger>
                  <TabsTrigger value="kpis">KPIs & Análise</TabsTrigger>
                </TabsList>

                <TabsContent value="matrix" className="space-y-6">
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Buscar riscos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {RISK_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Risk Matrix */}
                  <RiskMatrix risks={filteredRisks} />

                  {/* Risk Categories Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {RISK_CATEGORIES.map(category => {
                      const Icon = category.icon;
                      const categoryRisks = governanceRisks.filter(r => r.category === category.id);
                      const criticalCount = categoryRisks.filter(r => getRiskLevel(r.impact, r.probability).level === "Crítico").length;
                      
                      return (
                        <Card key={category.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                                <Icon className="h-5 w-5" style={{ color: category.color }} />
                              </div>
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{categoryRisks.length} riscos</p>
                                {criticalCount > 0 && (
                                  <Badge variant="destructive" className="mt-1">{criticalCount} críticos</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Risks Table */}
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
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRisks.map(risk => {
                        const category = RISK_CATEGORIES.find(c => c.id === risk.category);
                        const riskLevel = getRiskLevel(risk.impact, risk.probability);
                        
                        return (
                          <TableRow key={risk.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{risk.title}</div>
                                <div className="text-sm text-muted-foreground">{risk.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                                {category?.name}
                              </Badge>
                            </TableCell>
                            <TableCell>{risk.impact}</TableCell>
                            <TableCell>{risk.probability}</TableCell>
                            <TableCell>
                              <Badge variant={riskLevel.color as "default" | "destructive" | "outline" | "secondary"}>{riskLevel.level}</Badge>
                            </TableCell>
                            <TableCell>{risk.residualRisk}</TableCell>
                            <TableCell>{risk.responsible}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {risk.estimatedResolution}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(risk.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRisk(risk)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditRisk(risk)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="mitigation" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Selecionar Risco</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {governanceRisks.map(risk => (
                            <Button
                              key={risk.id}
                              variant={selectedRisk === risk.id ? "default" : "outline"}
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedRisk(risk.id)}
                            >
                              <div>
                                <div className="font-medium">{risk.title}</div>
                                <div className="text-sm opacity-70">{risk.responsible}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                      {selectedRisk && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Plano de Mitigação</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {(() => {
                              const risk = governanceRisks.find(r => r.id === selectedRisk);
                              const plan = mitigationPlans.find(p => p.riskId === selectedRisk);
                              
                              return (
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="font-medium mb-2">{risk?.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{risk?.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Controles Existentes</Label>
                                        <div className="space-y-1">
                                          {risk?.controls.map((control, idx) => (
                                            <Badge key={idx} variant="outline">{control}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Responsável</Label>
                                        <p className="font-medium">{risk?.responsible}</p>
                                      </div>
                                    </div>
                                  </div>

                                   {plan && (
                                     <div>
                                       <h4 className="font-medium mb-3">Ações de Mitigação</h4>
                                       <div className="space-y-3">
                                         {plan.actions.map(action => (
                                           <Card key={action.id}>
                                             <CardContent className="p-4">
                                               <div className="flex justify-between items-start mb-2">
                                                 <h5 className="font-medium">{action.description}</h5>
                                                 {getStatusBadge(action.status)}
                                               </div>
                                               <div className="space-y-2">
                                                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                   <span>Prazo: {action.deadline}</span>
                                                   <span>Progresso: {action.progress}%</span>
                                                 </div>
                                                 <Progress value={action.progress} className="h-2" />
                                               </div>
                                             </CardContent>
                                           </Card>
                                         ))}
                                       </div>
                                       
                                       <div className="mt-6 space-y-4">
                                         <div>
                                           <Label htmlFor="mitigation-comments" className="text-sm font-medium">
                                             Comentários e Observações
                                           </Label>
                                           <Textarea
                                             id="mitigation-comments"
                                             placeholder="Adicione comentários, observações ou contexto adicional para enriquecer o plano de mitigação..."
                                             value={mitigationComments[selectedRisk] || ""}
                                             onChange={(e) => setMitigationComments(prev => ({
                                               ...prev,
                                               [selectedRisk]: e.target.value
                                             }))}
                                             rows={4}
                                             className="mt-2"
                                           />
                                         </div>
                                         
                                         <Button
                                           onClick={() => handleEnhanceWithAI(selectedRisk)}
                                           disabled={isEnhancing}
                                           className="w-full"
                                           variant="outline"
                                         >
                                           {isEnhancing ? (
                                             <>
                                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                               Enriquecendo com IA...
                                             </>
                                           ) : (
                                             <>
                                               <TrendingUp className="h-4 w-4 mr-2" />
                                               Enriquecer Plano com IA
                                             </>
                                           )}
                                         </Button>
                                       </div>
                                     </div>
                                   )}
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nova Avaliação de Risco</CardTitle>
                      <CardDescription>
                        Adicione um novo risco seguindo as melhores práticas de governança
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Título do Risco</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Categoria de Risco</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione a categoria" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {RISK_CATEGORIES.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="impact"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Impacto (1-5)</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="probability"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Probabilidade (1-5)</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="responsible"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Responsável</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="resolutionTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Previsão de Resolução</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o prazo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="30 dias">30 dias</SelectItem>
                                      <SelectItem value="60 dias">60 dias</SelectItem>
                                      <SelectItem value="90 dias">90 dias</SelectItem>
                                      <SelectItem value="6 meses">6 meses</SelectItem>
                                      <SelectItem value="1 ano">1 ano</SelectItem>
                                      <SelectItem value="Mais de 1 ano">Mais de 1 ano</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descrição do Risco</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="controls"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Controles Existentes</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Cadastrar Risco
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kpis" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((kpi, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{kpi.name}</p>
                              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                              <p className="text-xs text-muted-foreground">Meta: {kpi.target}</p>
                            </div>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                              <BarChart3 className="h-6 w-6" style={{ color: kpi.color }} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribuição por Categoria</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={RISK_CATEGORIES.map(cat => ({
                                name: cat.name,
                                value: governanceRisks.filter(r => r.category === cat.id).length,
                                fill: cat.color
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {RISK_CATEGORIES.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Evolução dos Riscos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={riskTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} />
                            <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} />
                            <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Details Dialog */}
      <RiskDetailsDialog
        risk={currentRisk}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onEdit={() => currentRisk && handleEditRisk(currentRisk)}
      />

      {/* Risk Edit Dialog */}
      <RiskEditDialog
        risk={currentRisk}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveRisk}
      />
    </div>
  );
};

export default GovernanceRiskManagement;