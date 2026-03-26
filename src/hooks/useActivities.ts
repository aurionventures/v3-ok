import { useState } from "react";

// Log entry interface
interface LogEntry {
  id: string;
  user: string;
  userInitials: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export const useActivities = () => {
  // Sample log data for Governance maturity assessments
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([
    {
      id: "1",
      user: "Admin",
      userInitials: "A",
      action: "Avaliação de Maturidade de Governança",
      timestamp: new Date(2024, 4, 15, 14, 30),
      details: "Avaliação completa da maturidade em governança corporativa"
    },
    {
      id: "2",
      user: "Maria Silva",
      userInitials: "MS",
      action: "Quiz de Governança Completado",
      timestamp: new Date(2024, 4, 10, 9, 45),
      details: "Finalizada avaliação de maturidade de governança com score 85%"
    },
    {
      id: "3",
      user: "João Costa",
      userInitials: "JC",
      action: "Revisão de Maturidade",
      timestamp: new Date(2024, 4, 5, 16, 15),
      details: "Revisão dos critérios de governança corporativa"
    },
    {
      id: "4",
      user: "Sistema",
      userInitials: "S",
      action: "Backup de Dados Realizado",
      timestamp: new Date(2024, 4, 14, 2, 0),
      details: "Backup automático dos dados de governança realizado com sucesso"
    },
    {
      id: "5",
      user: "Ana Santos",
      userInitials: "AS",
      action: "Documento ESG Atualizado",
      timestamp: new Date(2024, 4, 12, 11, 20),
      details: "Atualização dos indicadores ESG do trimestre"
    }
  ]);

  const addLogEntry = (action: string, details?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      user: "Usuário Admin",
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

  return {
    activityLogs,
    addLogEntry,
    formatDate
  };
};