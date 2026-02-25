import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import GuidedNavigation from "@/components/GuidedNavigation";
import { PautasSugeridasContent } from "@/components/copilot/PautasSugeridasContent";

type CardItem = {
  id: string;
  title: string;
  description: string;
  statusTags: { label: string; variant: "critical" | "high" | "warning" | "strategic" | "regulatory" | "operational" | "time"; bgClass: string; textClass: string }[];
  actions: { label: string; href?: string }[];
  accentColor: string;
};

const strategicRisksCards: CardItem[] = [
  {
    id: "1",
    title: "Vulnerabilidade na Sucessão Executiva",
    description:
      "Concentração de conhecimento crítico em poucos profissionais chave sem plano de backup estruturado",
    statusTags: [
      { label: "Crítico", variant: "critical", bgClass: "bg-red-600", textClass: "text-white" },
    ],
    actions: [
      { label: "Revisar plano de sucessão", href: "/succession" },
      { label: "Mapear candidatos internos" },
    ],
    accentColor: "text-red-600",
  },
  {
    id: "2",
    title: "Concentração de Decisões Estratégicas",
    description:
      "Dependência excessiva de poucos tomadores de decisão para assuntos críticos da governança",
    statusTags: [
      { label: "Alto", variant: "high", bgClass: "bg-orange-500", textClass: "text-white" },
    ],
    actions: [
      { label: "Descentralizar decisões" },
      { label: "Criar comitês delegados" },
    ],
    accentColor: "text-red-600",
  },
];

const operationalThreatsCards: CardItem[] = [
  {
    id: "3",
    title: "Pressão Regulatória ESG",
    description:
      "Novas exigências de compliance ambiental entrando em vigor no próximo trimestre",
    statusTags: [
      { label: "30 dias", variant: "time", bgClass: "bg-orange-500", textClass: "text-white" },
      { label: "Regulatório", variant: "regulatory", bgClass: "bg-white border border-orange-500", textClass: "text-orange-600" },
    ],
    actions: [
      { label: "Atualizar políticas ESG", href: "/esg" },
      { label: "Treinar equipe de compliance", href: "/esg" },
    ],
    accentColor: "text-orange-600",
  },
  {
    id: "4",
    title: "Pendências Acumuladas",
    description:
      "Backlog crescente de tarefas críticas impactando prazos de governança",
    statusTags: [
      { label: "Imediato", variant: "critical", bgClass: "bg-red-600", textClass: "text-white" },
      { label: "Operacional", variant: "operational", bgClass: "bg-white border border-orange-500", textClass: "text-orange-600" },
    ],
    actions: [
      { label: "Priorizar pendências críticas", href: "/activities" },
      { label: "Delegar tarefas pendentes", href: "/activities" },
    ],
    accentColor: "text-orange-600",
  },
];

const strategicOpportunitiesCards: CardItem[] = [
  {
    id: "5",
    title: "Fortalecimento da Cultura de Compliance",
    description:
      "Momento oportuno para consolidar práticas de governança e fortalecer a cultura organizacional",
    statusTags: [
      { label: "Estratégica", variant: "strategic", bgClass: "bg-green-600", textClass: "text-white" },
    ],
    actions: [
      { label: "Implementar programa de compliance", href: "/councils" },
      { label: "Medir resultados trimestrais" },
    ],
    accentColor: "text-green-600",
  },
  {
    id: "6",
    title: "Certificação B Corp",
    description:
      "Diferencial competitivo no mercado e alinhamento com valores ESG da organização",
    statusTags: [
      { label: "Estratégica", variant: "strategic", bgClass: "bg-green-600", textClass: "text-white" },
    ],
    actions: [
      { label: "Avaliar requisitos da certificação" },
      { label: "Iniciar processo de certificação" },
    ],
    accentColor: "text-green-600",
  },
];

function InsightCard({ item }: { item: CardItem }) {
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
      </CardContent>
    </Card>
  );
}

function InsightsContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" aria-hidden />
          <h2 className="font-semibold text-gray-900">Riscos Estratégicos</h2>
          <span className="text-gray-500 text-sm">{strategicRisksCards.length}</span>
        </div>
        <div className="space-y-4">
          {strategicRisksCards.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />
          <h2 className="font-semibold text-gray-900">Ameaças Operacionais</h2>
          <span className="text-gray-500 text-sm">{operationalThreatsCards.length}</span>
        </div>
        <div className="space-y-4">
          {operationalThreatsCards.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-500" aria-hidden />
          <h2 className="font-semibold text-gray-900">Oportunidades Estratégicas</h2>
          <span className="text-gray-500 text-sm">{strategicOpportunitiesCards.length}</span>
        </div>
        <div className="space-y-4">
          {strategicOpportunitiesCards.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuidedNav(true)}
                className="border-gray-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Guia Legacy
              </Button>
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
