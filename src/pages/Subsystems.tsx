
import React, { useState } from "react";
import { Layers, BarChart4, ArrowRight, Info, Save, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Radar } from "recharts";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";

// Sample data for radar chart
const subsystemData = [
  { name: "Indivíduo", score: 4.2, sectorAverage: 3.7, fullMark: 5 },
  { name: "Família", score: 3.8, sectorAverage: 3.5, fullMark: 5 },
  { name: "Negócio", score: 4.5, sectorAverage: 3.9, fullMark: 5 },
  { name: "Ativos", score: 3.6, sectorAverage: 3.4, fullMark: 5 },
  { name: "Sociedade e Ambiente", score: 3.2, sectorAverage: 3.3, fullMark: 5 },
];

// Form schema
const subsystemFormSchema = z.object({
  individuo: z.string().min(1, "Obrigatório"),
  familia: z.string().min(1, "Obrigatório"),
  negocio: z.string().min(1, "Obrigatório"),
  ativos: z.string().min(1, "Obrigatório"),
  sociedadeAmbiente: z.string().min(1, "Obrigatório"),
  integracaoSistemica: z.string().min(1, "Obrigatório"),
  comentarios: z.string().optional(),
});

// Historical assessments data
const historicalAssessments = [
  {
    id: 1,
    date: "Janeiro 2025",
    averageScore: 3.6,
    data: [
      { name: "Indivíduo", score: 3.8, sectorAverage: 3.7, fullMark: 5 },
      { name: "Família", score: 3.2, sectorAverage: 3.5, fullMark: 5 },
      { name: "Negócio", score: 4.0, sectorAverage: 3.9, fullMark: 5 },
      { name: "Ativos", score: 3.5, sectorAverage: 3.4, fullMark: 5 },
      { name: "Sociedade e Ambiente", score: 3.0, sectorAverage: 3.3, fullMark: 5 },
    ]
  },
  {
    id: 2,
    date: "Julho 2024",
    averageScore: 3.3,
    data: [
      { name: "Indivíduo", score: 3.5, sectorAverage: 3.7, fullMark: 5 },
      { name: "Família", score: 3.0, sectorAverage: 3.5, fullMark: 5 },
      { name: "Negócio", score: 3.8, sectorAverage: 3.9, fullMark: 5 },
      { name: "Ativos", score: 3.2, sectorAverage: 3.4, fullMark: 5 },
      { name: "Sociedade e Ambiente", score: 2.8, sectorAverage: 3.3, fullMark: 5 },
    ]
  },
  {
    id: 3,
    date: "Janeiro 2024",
    averageScore: 3.1,
    data: [
      { name: "Indivíduo", score: 3.2, sectorAverage: 3.7, fullMark: 5 },
      { name: "Família", score: 2.8, sectorAverage: 3.5, fullMark: 5 },
      { name: "Negócio", score: 3.5, sectorAverage: 3.9, fullMark: 5 },
      { name: "Ativos", score: 3.0, sectorAverage: 3.4, fullMark: 5 },
      { name: "Sociedade e Ambiente", score: 2.6, sectorAverage: 3.3, fullMark: 5 },
    ]
  },
];

const SubsystemsPage = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(subsystemData);
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState("Atual");

  const form = useForm<z.infer<typeof subsystemFormSchema>>({
    resolver: zodResolver(subsystemFormSchema),
    defaultValues: {
      individuo: "",
      familia: "",
      negocio: "",
      ativos: "",
      sociedadeAmbiente: "",
      integracaoSistemica: "",
      comentarios: "",
    },
  });

  const onSubmit = (values: z.infer<typeof subsystemFormSchema>) => {
    console.log(values);
    toast({
      title: "Avaliação enviada",
      description: "O diagnóstico de subsistemas foi salvo com sucesso.",
    });
  };

  const handleAssessmentChange = (id: number) => {
    if (id === 0) {
      setSelectedAssessment(subsystemData);
      setSelectedAssessmentDate("Atual");
    } else {
      const assessment = historicalAssessments.find(a => a.id === id);
      if (assessment) {
        setSelectedAssessment(assessment.data);
        setSelectedAssessmentDate(assessment.date);
      }
    }
  };

  const getMeaningfulColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getMeaningfulRating = (score: number) => {
    if (score >= 4.5) return "Excelente";
    if (score >= 3.5) return "Bom";
    if (score >= 2.5) return "Regular";
    if (score >= 1.5) return "Insuficiente";
    return "Crítico";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Diagnóstico de Subsistemas" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Diagnóstico de Subsistemas: Modelo BFB
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Avaliação:</span>
                  <Select 
                    defaultValue="0" 
                    onValueChange={(value) => handleAssessmentChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecionar avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Atual (Maio 2025)</SelectItem>
                      {historicalAssessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={assessment.id.toString()}>
                          {assessment.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="visualization">
                <TabsList className="mb-4">
                  <TabsTrigger value="visualization">Visualização</TabsTrigger>
                  <TabsTrigger value="input">Nova Avaliação</TabsTrigger>
                  <TabsTrigger value="historical">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="visualization">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Avaliação Sistêmica de {selectedAssessmentDate}</h3>
                        <div className="flex justify-center">
                          <MaturityRadarChart data={selectedAssessment} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="bg-white p-6 rounded-lg border h-full">
                        <h3 className="text-lg font-medium mb-4">Análise dos Subsistemas</h3>
                        <div className="space-y-4">
                          {selectedAssessment.map((item) => (
                            <div key={item.name} className="border-b pb-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{item.name}</span>
                                <span className={`font-bold ${getMeaningfulColor(item.score)}`}>
                                  {item.score}/5.0
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-500">Status:</span>
                                <span className={getMeaningfulColor(item.score)}>
                                  {getMeaningfulRating(item.score)}
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-6 pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Equilíbrio Sistêmico</span>
                              <span className="font-bold text-legacy-500">
                                {(selectedAssessment.reduce((acc, item) => acc + item.score, 0) / selectedAssessment.length).toFixed(1)}/5.0
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Desequilíbrios Identificados</h3>
                      <ul className="space-y-2 text-sm">
                        {selectedAssessment.some(item => item.score < 3.5) ? (
                          selectedAssessment
                            .filter(item => item.score < 3.5)
                            .map(item => (
                               <li key={item.name} className="flex items-start">
                                 <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                                 <span><strong>{item.name}:</strong> Necessita atenção para equilibrar o sistema.</span>
                               </li>
                            ))
                        ) : (
                           <li className="flex items-start">
                             <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                             <span>Todos os subsistemas estão em equilíbrio adequado.</span>
                           </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Sugestões Estratégicas</h3>
                      <ul className="space-y-2 text-sm">
                        {selectedAssessment.some(item => item.score < 3.5) ? (
                          selectedAssessment
                            .filter(item => item.score < 3.5)
                            .map(item => (
                              <li key={`suggestion-${item.name}`} className="flex items-start">
                                <ArrowRight className="h-4 w-4 text-legacy-500 mr-2 mt-0.5" />
                                <span>
                                  {item.name === "Indivíduo" && "Investir em programas de desenvolvimento pessoal e alinhamento de propósito para os membros-chave."}
                                  {item.name === "Família" && "Fortalecer os vínculos e a comunicação familiar através de rituais e encontros estruturados."}
                                  {item.name === "Negócio" && "Revisar a estratégia e modelos de governança do negócio para garantir sustentabilidade."}
                                  {item.name === "Ativos" && "Implementar estratégias de gestão patrimonial mais estruturadas e transparentes."}
                                  {item.name === "Sociedade e Ambiente" && "Desenvolver iniciativas de impacto positivo e estratégias ESG mais robustas."}
                                </span>
                              </li>
                            ))
                        ) : (
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-legacy-500 mr-2 mt-0.5" />
                            <span>Manter os processos atuais e monitorar continuamente o equilíbrio entre os subsistemas.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="input">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="individuo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subsistema: Indivíduo</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie o desenvolvimento, propósito e saúde integral dos indivíduos-chave.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="familia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subsistema: Família</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie a coesão, comunicação e alinhamento de valores familiares.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="negocio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subsistema: Negócio</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie a saúde financeira, estratégica e operacional dos negócios.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ativos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subsistema: Ativos</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie a gestão patrimonial e financeira dos ativos familiares.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sociedadeAmbiente"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subsistema: Sociedade e Ambiente</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie o impacto social e ambiental e as práticas ESG.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="integracaoSistemica"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Integração Sistêmica</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma nota de 1 a 5" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Crítico</SelectItem>
                                  <SelectItem value="2">2 - Insuficiente</SelectItem>
                                  <SelectItem value="3">3 - Regular</SelectItem>
                                  <SelectItem value="4">4 - Bom</SelectItem>
                                  <SelectItem value="5">5 - Excelente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Avalie o grau de integração entre todos os subsistemas.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="comentarios"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações Adicionais</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Insira comentários adicionais sobre o diagnóstico sistêmico..."
                                {...field}
                                className="h-32"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full md:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Diagnóstico Sistêmico
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="historical">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Evolução Sistêmica ao Longo do Tempo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {historicalAssessments.map((assessment) => (
                        <div 
                          key={assessment.id}
                          className="bg-white p-5 rounded-lg border hover:shadow-md cursor-pointer transition-shadow"
                          onClick={() => handleAssessmentChange(assessment.id)}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">{assessment.date}</h4>
                            <span className={`font-bold px-2 py-1 rounded-full text-sm ${getMeaningfulColor(assessment.averageScore)} bg-opacity-10`}>
                              {assessment.averageScore.toFixed(1)}/5.0
                            </span>
                          </div>
                          <div className="h-40">
                            <MaturityRadarChart data={assessment.data} />
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                              e.stopPropagation();
                              handleAssessmentChange(assessment.id);
                            }}>
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="bg-gray-50 p-5 rounded-lg border-dashed border-2 border-gray-300 flex flex-col items-center justify-center">
                        <p className="text-center text-gray-500 mb-4">Próxima avaliação programada:</p>
                        <p className="text-center text-xl font-medium mb-2">Julho 2025</p>
                        <p className="text-center text-sm text-gray-500 mb-4">
                          Avaliação semestral para monitoramento contínuo
                        </p>
                        <Button variant="outline" size="sm">Agendar Lembretes</Button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border mt-6">
                      <h3 className="text-lg font-medium mb-4">Análise de Evolução</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Equilíbrio Geral:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-green-600">+16%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Indivíduo:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-blue-600">+22%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Família:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "76%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-blue-600">+18%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Negócio:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-blue-600">+12%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Ativos:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "72%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-blue-600">+14%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm font-medium">Soc. e Ambiente:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "64%" }}></div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right text-blue-600">+20%</div>
                        </div>
                      </div>
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

export default SubsystemsPage;
