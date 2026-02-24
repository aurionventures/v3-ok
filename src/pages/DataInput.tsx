import React, { useState } from "react";
import { FileText, Save, Clock, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Form schemas
const esgFormSchema = z.object({
  emissoesCO2: z.string().min(1, "Obrigatório"),
  consumoAgua: z.string().min(1, "Obrigatório"),
  diversidadeGenero: z.string().min(1, "Obrigatório"),
  projetosSociais: z.string().min(1, "Obrigatório"),
  transparencia: z.string().min(1, "Obrigatório"),
  comentariosESG: z.string().optional(),
});

// Log entry interface
interface LogEntry {
  id: string;
  user: string;
  userInitials: string;
  action: string;
  timestamp: Date;
  details?: string;
}

const DataInput = () => {
  const esgForm = useForm<z.infer<typeof esgFormSchema>>({
    resolver: zodResolver(esgFormSchema),
    defaultValues: {
      emissoesCO2: "",
      consumoAgua: "",
      diversidadeGenero: "",
      projetosSociais: "",
      transparencia: "",
      comentariosESG: "",
    },
  });

  // Sample log data - in a real application, this would be fetched from a database
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([
    {
      id: "1",
      user: "Admin",
      userInitials: "A",
      action: "Avaliação de ESG",
      timestamp: new Date(2024, 4, 15, 14, 30),
      details: "Atualização dos indicadores ambientais e sociais"
    },
    {
      id: "2",
      user: "Maria Silva",
      userInitials: "MS",
      action: "Avaliação de ESG",
      timestamp: new Date(2024, 4, 10, 9, 45),
      details: "Avaliação completa dos critérios ESG"
    },
    {
      id: "3",
      user: "João Costa",
      userInitials: "JC",
      action: "Avaliação de ESG",
      timestamp: new Date(2024, 4, 5, 16, 15),
      details: "Atualização dos dados ambientais"
    }
  ]);

  const addLogEntry = (action: string, details?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      user: "Usuário Admin", // In a real app, get from auth context
      userInitials: "UA",
      action,
      timestamp: new Date(),
      details
    };
    
    setActivityLogs([newLog, ...activityLogs]);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const onESGSubmit = (values: z.infer<typeof esgFormSchema>) => {
    console.log(values);
    addLogEntry("Avaliação de ESG", "Atualização dos indicadores ESG");
    toast({
      title: "Dados de ESG enviados",
      description: "Os indicadores serão atualizados em breve.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Entrada de Dados" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Dados ESG
                </h2>
                <Button onClick={() => window.location.href = '/maturity-quiz'} variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Iniciar Avaliação IBGC
                </Button>
              </div>

                  <Form {...esgForm}>
                    <form onSubmit={esgForm.handleSubmit(onESGSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={esgForm.control}
                          name="emissoesCO2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emissões de CO₂ (toneladas)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Ex: 35" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Insira a quantidade de emissões de CO₂ em toneladas.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={esgForm.control}
                          name="consumoAgua"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consumo de Água (m³)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Ex: 12000" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Insira o consumo de água em metros cúbicos.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={esgForm.control}
                          name="diversidadeGenero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diversidade de Gênero (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Ex: 43" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Insira a porcentagem de diversidade de gênero.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={esgForm.control}
                          name="projetosSociais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Projetos Sociais (quantidade)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Ex: 5" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Insira a quantidade de projetos sociais ativos.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={esgForm.control}
                          name="transparencia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transparência (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Ex: 90" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Insira a porcentagem de transparência.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={esgForm.control}
                        name="comentariosESG"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comentários Adicionais</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Insira comentários adicionais sobre os dados ESG..."
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
                        Salvar Dados ESG
                      </Button>
                    </form>
                  </Form>
            </CardContent>
          </Card>

          {/* Activity Log Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500">
                  Histórico de Atualizações
                </h2>
              </div>
              
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarFallback className="bg-legacy-500 text-white">{log.userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{log.user}</h4>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{log.action}</p>
                      {log.details && <p className="text-sm text-gray-500 mt-1">{log.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataInput;
