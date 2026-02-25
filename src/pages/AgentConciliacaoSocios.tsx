import { useState } from "react";
import { Handshake, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const AgentConciliacaoSocios = () => {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agente de Conciliação de Sócios" />
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Conciliação de Sócios</h1>
            <p className="text-gray-600 mt-1">
              Agente especializado em mediação e conciliação entre sócios: conflitos societários,
              alinhamento de expectativas e apoio a acordos e pactos.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5" />
                  Assistente de Conciliação
                </CardTitle>
                <CardDescription>
                  Descreva o contexto do conflito ou tema que deseja conciliar. O agente pode
                  sugerir frameworks, perguntas de alinhamento e passos para acordos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex.: Conflito entre sócios sobre distribuição de dividendos; necessidade de alinhar expectativas para a próxima assembleia..."
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

export default AgentConciliacaoSocios;
