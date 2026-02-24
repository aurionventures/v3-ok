
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import ActivityList from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Sample data for activities
const allActivities = [
  {
    id: 1,
    type: "meeting" as const,
    title: "Reunião do Conselho Consultivo",
    date: "24 de maio, 2025",
    status: "scheduled" as const,
    description: "Análise de resultados trimestrais e planejamento estratégico"
  },
  {
    id: 2,
    type: "document" as const,
    title: "Atualização do Protocolo Familiar",
    date: "20 de maio, 2025",
    status: "completed" as const,
    description: "Adição de cláusulas sobre política de dividendos"
  },
  {
    id: 3,
    type: "training" as const,
    title: "Workshop de Liderança para Herdeiros",
    date: "15 de maio, 2025",
    status: "completed" as const,
    description: "Formação sobre comunicação e tomada de decisão"
  },
  {
    id: 4,
    type: "document" as const,
    title: "Revisão de Estatuto Social",
    date: "10 de maio, 2025",
    status: "pending" as const,
    description: "Análise jurídica de alterações propostas"
  },
  {
    id: 5,
    type: "meeting" as const,
    title: "Assembleia Familiar Anual",
    date: "5 de maio, 2025",
    status: "completed" as const,
    description: "Prestação de contas e alinhamento de valores"
  },
  {
    id: 6,
    type: "training" as const,
    title: "Curso de Governança Corporativa",
    date: "1 de maio, 2025",
    status: "completed" as const,
    description: "Princípios e melhores práticas de governança"
  },
  {
    id: 7,
    type: "meeting" as const,
    title: "Comitê de Sucessão",
    date: "25 de abril, 2025",
    status: "completed" as const,
    description: "Avaliação de candidatos e cronograma"
  },
  {
    id: 8,
    type: "document" as const,
    title: "Plano de Desenvolvimento de Herdeiros",
    date: "20 de abril, 2025",
    status: "completed" as const,
    description: "Definição de metas e trilhas de formação"
  },
  {
    id: 9,
    type: "training" as const,
    title: "Treinamento ESG para Conselheiros",
    date: "15 de abril, 2025",
    status: "cancelled" as const,
    description: "Estratégias de implementação de práticas sustentáveis"
  },
  {
    id: 10,
    type: "meeting" as const,
    title: "Reunião com Consultoria de Governança",
    date: "10 de abril, 2025",
    status: "completed" as const,
    description: "Diagnóstico inicial e planejamento de melhorias"
  }
];

const ActivitiesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Atividades" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-xl font-semibold text-legacy-500">
              Todas as Atividades
            </h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-legacy-500">
                  Histórico de Atividades
                </h3>
              </div>
              
              <ActivityList 
                activities={allActivities} 
                showViewAll={false} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
