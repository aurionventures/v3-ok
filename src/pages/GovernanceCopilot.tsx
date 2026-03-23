import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import GuidedNavigation from "@/components/GuidedNavigation";
import { PautasSugeridasContent } from "@/components/copilot/PautasSugeridasContent";
import { InsightCard } from "@/components/copilot/InsightCard";
import { useInsightsEstrategicos } from "@/hooks/useInsightsEstrategicos";

function InsightsContent() {
  const { riscos, ameacas, oportunidades, isLoading, isFetched, error, hasEmpresa, refetch } =
    useInsightsEstrategicos();

  if (!hasEmpresa) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center text-gray-500">
        Selecione uma empresa para visualizar os insights estratégicos.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50/50 p-6 text-red-800">
        <p className="font-medium">Erro ao carregar insights</p>
        <p className="text-sm mt-1">{String(error)}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  const vazio = riscos.length === 0 && ameacas.length === 0 && oportunidades.length === 0;
  if (vazio) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center">
        <p className="text-gray-500 mb-4">
          Clique em Gerar Insights para que a IA analise os dados da empresa e identifique 2 riscos, 2 ameaças e 2 oportunidades estratégicas. Os insights serão salvos e só atualizados ao clicar em &quot;Gerar nova insight&quot;.
        </p>
        <Button
          onClick={() => refetch()}
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Gerando..." : "Gerar Insights"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="border-violet-200 text-violet-700 hover:bg-violet-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Gerar nova insight
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-red-50">
            <Shield className="h-5 w-5 text-red-500 shrink-0" aria-hidden />
            <h2 className="font-semibold text-gray-900">Riscos Estratégicos</h2>
            <span className="text-gray-500 text-sm ml-auto">{Math.min(riscos.length, 2)}</span>
          </div>
          <div className="space-y-4">
            {riscos.slice(0, 2).map((item) => (
              <InsightCard key={item.id} item={item} borderColor="red" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" aria-hidden />
            <h2 className="font-semibold text-gray-900">Ameaças Operacionais</h2>
            <span className="text-gray-500 text-sm ml-auto">{Math.min(ameacas.length, 2)}</span>
          </div>
          <div className="space-y-4">
            {ameacas.slice(0, 2).map((item) => (
              <InsightCard key={item.id} item={item} borderColor="amber" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-green-50">
            <Lightbulb className="h-5 w-5 text-green-500 shrink-0" aria-hidden />
            <h2 className="font-semibold text-gray-900">Oportunidades Estratégicas</h2>
            <span className="text-gray-500 text-sm ml-auto">{Math.min(oportunidades.length, 2)}</span>
          </div>
          <div className="space-y-4">
            {oportunidades.slice(0, 2).map((item) => (
              <InsightCard key={item.id} item={item} borderColor="green" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const GovernanceCopilot = () => {
  const [showGuidedNav, setShowGuidedNav] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Copiloto de Governança
              </h1>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="h-9 bg-transparent p-0 gap-0 border-b-0 rounded-none">
                  <TabsTrigger
                    value="insights"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-1 mr-6 text-gray-600 data-[state=active]:text-gray-900"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Insights
                  </TabsTrigger>
                  <TabsTrigger
                    value="agendas"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-0 pb-1 text-gray-600 data-[state=active]:text-gray-900"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Pautas Sugeridas
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <GuiaLegacyButton onClick={() => setShowGuidedNav(true)} />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {activeTab === "insights" && <InsightsContent />}
          {activeTab === "agendas" && <PautasSugeridasContent />}
        </main>
      </div>

      <GuidedNavigation
        isOpen={showGuidedNav}
        onClose={() => setShowGuidedNav(false)}
      />
    </div>
  );
};

export default GovernanceCopilot;
