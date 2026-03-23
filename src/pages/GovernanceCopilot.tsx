import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import GuidedNavigation from "@/components/GuidedNavigation";
import { PautasSugeridasContent } from "@/components/copilot/PautasSugeridasContent";
import { useInsightsEstrategicos } from "@/hooks/useInsightsEstrategicos";
import type { InsightCardItem } from "@/services/insightsEstrategicos";

function InsightCard({ item }: { item: InsightCardItem }) {
  return (
    <Card className="rounded-lg shadow-sm border overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.statusTags.map((tag) => (
            <Badge
              key={tag.label}
              variant="secondary"
              className={`${tag.bgClass} ${tag.textClass} border-0 font-medium`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {item.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-gray-600">{item.description}</p>
        {item.actions.length > 0 && (
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${item.accentColor} mb-2`}>
              Ações recomendadas
            </p>
            <ul className="space-y-1.5">
              {item.actions.map((action) => (
                <li key={action.label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">→</span>
                  {action.href ? (
                    <Link
                      to={action.href}
                      className="hover:underline flex items-center gap-1"
                    >
                      {action.label}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  ) : (
                    <span>{action.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InsightsContent() {
  const { riscos, ameacas, oportunidades, resumo, isLoading, error, hasEmpresa } =
    useInsightsEstrategicos();

  if (!hasEmpresa) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center text-gray-500">
        Selecione uma empresa para visualizar os insights estratégicos.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50/50 p-6 text-red-800">
        <p className="font-medium">Erro ao carregar insights</p>
        <p className="text-sm mt-1">{String(error)}</p>
      </div>
    );
  }

  const vazio = riscos.length === 0 && ameacas.length === 0 && oportunidades.length === 0;
  if (vazio) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center text-gray-500">
        Nenhum insight identificado com os dados atuais. Cadastre riscos, reuniões e atas para
        que a IA possa gerar riscos, ameaças e oportunidades estratégicas.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {resumo && (
        <Card className="border-0 shadow-sm bg-violet-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700">{resumo}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" aria-hidden />
            <h2 className="font-semibold text-gray-900">Riscos Estratégicos</h2>
            <span className="text-gray-500 text-sm">{riscos.length}</span>
          </div>
          <div className="space-y-4">
            {riscos.map((item) => (
              <InsightCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />
            <h2 className="font-semibold text-gray-900">Ameaças Operacionais</h2>
            <span className="text-gray-500 text-sm">{ameacas.length}</span>
          </div>
          <div className="space-y-4">
            {ameacas.map((item) => (
              <InsightCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-500" aria-hidden />
            <h2 className="font-semibold text-gray-900">Oportunidades Estratégicas</h2>
            <span className="text-gray-500 text-sm">{oportunidades.length}</span>
          </div>
          <div className="space-y-4">
            {oportunidades.map((item) => (
              <InsightCard key={item.id} item={item} />
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
