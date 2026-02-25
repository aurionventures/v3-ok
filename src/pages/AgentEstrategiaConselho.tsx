import { useState } from "react";
import { Target, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const AgentEstrategiaConselho = () => {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agente de Estratégia de Conselho" />
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Estratégia de Conselho</h1>
            <p className="text-gray-600 mt-1">
              Agente focado em planejamento e execução estratégica do conselho: priorização de
              temas, alinhamento com diretrizes e acompanhamento de metas e indicadores.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Assistente de Estratégia
                </CardTitle>
                <CardDescription>
                  Informe o contexto (objetivos do conselho, ciclo atual, temas em pauta) para
                  receber sugestões de priorização, métricas e próximos passos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex.: Objetivos do conselho para o ano; temas que precisam de decisão no próximo trimestre..."
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

export default AgentEstrategiaConselho;
