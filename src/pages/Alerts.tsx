
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample data for alerts
const allAlerts = [
  {
    id: 1,
    message: "Reunião do Conselho de Administração em 5 dias",
    priority: "high",
    date: "20 de maio, 2025"
  },
  {
    id: 2,
    message: "3 documentos pendentes de aprovação",
    priority: "medium",
    date: "19 de maio, 2025"
  },
  {
    id: 3,
    message: "Planejamento de sucessão precisa ser atualizado",
    priority: "medium",
    date: "18 de maio, 2025"
  },
  {
    id: 4,
    message: "Assembleia de acionistas agendada para 15 de junho",
    priority: "low",
    date: "17 de maio, 2025"
  },
  {
    id: 5,
    message: "Avaliação de maturidade trimestral pendente",
    priority: "high",
    date: "16 de maio, 2025"
  },
  {
    id: 6,
    message: "Novo conselheiro aguardando confirmação de mandato",
    priority: "medium",
    date: "15 de maio, 2025"
  },
  {
    id: 7,
    message: "Relatório ESG precisa ser finalizado até 30/05",
    priority: "high",
    date: "14 de maio, 2025"
  },
  {
    id: 8,
    message: "Workshop de cultura organizacional em 10 dias",
    priority: "low",
    date: "13 de maio, 2025"
  }
];

const AlertsPage = () => {
  const navigate = useNavigate();

  const handleAlertClick = (alert: any) => {
    toast({
      title: "Alerta",
      description: alert.message,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Alertas" />
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
              Todos os Alertas
            </h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-legacy-500">
                  Alertas e Notificações
                </h3>
              </div>
              
              <div className="space-y-4">
                {allAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === "high"
                        ? "border-red-500 bg-red-50"
                        : alert.priority === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                    } cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span className={`h-2 w-2 rounded-full ${
                        alert.priority === "high" 
                          ? "bg-red-500" 
                          : alert.priority === "medium" 
                          ? "bg-yellow-500" 
                          : "bg-blue-500"
                      }`}></span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{alert.date}</span>
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

export default AlertsPage;
