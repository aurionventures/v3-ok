import { useState } from "react";
import { ClipboardList, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const AgentAnaliseTarefas = () => {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agente de Análise de Tarefas" />
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Análise de Tarefas</h1>
            <p className="text-gray-600 mt-1">
              Agente para análise e priorização de tarefas do secretariado e do conselho:
              encaminhamentos, prazos, responsáveis e sugestões de organização.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Assistente de Análise
                </CardTitle>
                <CardDescription>
                  Cole a lista de tarefas ou encaminhamentos para obter análise de prioridade,
                  dependências e sugestões de sequência ou alertas de prazo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex.: Lista de encaminhamentos da última ata; tarefas pendentes do secretariado..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button disabled={!input.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentAnaliseTarefas;
