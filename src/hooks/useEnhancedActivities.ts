import { useState, useMemo } from 'react';
import { useAuditLogs } from './useAuditLogs';

export type ActivityType = 
  | 'meeting'
  | 'document'
  | 'task'
  | 'task_completed'
  | 'email_sent'
  | 'whatsapp_sent'
  | 'ata_generated'
  | 'login'
  | 'logout'
  | 'config'
  | 'approval'
  | 'signature';

export type ActivityStatus = 'completed' | 'pending' | 'scheduled' | 'cancelled' | 'error';

export interface EnhancedActivity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  status: ActivityStatus;
  user?: string;
  metadata?: Record<string, any>;
}

export interface ActivityFilters {
  search: string;
  type: ActivityType | 'all';
  status: ActivityStatus | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const demoActivities: EnhancedActivity[] = [
  {
    id: '1',
    type: 'meeting',
    title: 'Reunião do Conselho de Administração',
    description: 'Análise de resultados Q4 e planejamento 2025',
    timestamp: new Date(2025, 11, 4, 14, 30),
    status: 'scheduled',
    user: 'Sistema'
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Tarefa "Enviar relatório financeiro" concluída',
    description: 'Responsável: Roberto Santos',
    timestamp: new Date(2025, 11, 4, 11, 15),
    status: 'completed',
    user: 'Roberto Santos'
  },
  {
    id: '3',
    type: 'email_sent',
    title: 'Alerta enviado para João Silva',
    description: 'Tarefa pendente: Revisão de contrato',
    timestamp: new Date(2025, 11, 4, 10, 45),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '4',
    type: 'ata_generated',
    title: 'ATA da reunião de novembro gerada',
    description: 'Comitê de Auditoria - 28/11/2025',
    timestamp: new Date(2025, 11, 3, 16, 20),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '5',
    type: 'document',
    title: 'Relatório ESG Q3 atualizado',
    description: 'Upload de nova versão do documento',
    timestamp: new Date(2025, 11, 3, 14, 0),
    status: 'completed',
    user: 'Maria Oliveira'
  },
  {
    id: '6',
    type: 'whatsapp_sent',
    title: 'Lembrete enviado via WhatsApp',
    description: 'Reunião do Comitê de Riscos amanhã às 10h',
    timestamp: new Date(2025, 11, 3, 9, 30),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '7',
    type: 'approval',
    title: 'ATA aprovada por Carlos Mendes',
    description: 'Conselho de Administração - Outubro 2025',
    timestamp: new Date(2025, 11, 2, 17, 45),
    status: 'completed',
    user: 'Carlos Mendes'
  },
  {
    id: '8',
    type: 'signature',
    title: 'Assinatura eletrônica registrada',
    description: 'Ana Silva assinou a ATA do Conselho',
    timestamp: new Date(2025, 11, 2, 16, 30),
    status: 'completed',
    user: 'Ana Silva'
  },
  {
    id: '9',
    type: 'task',
    title: 'Nova tarefa atribuída',
    description: 'Preparar apresentação para assembleia - Pedro Lima',
    timestamp: new Date(2025, 11, 2, 11, 0),
    status: 'pending',
    user: 'Sistema'
  },
  {
    id: '10',
    type: 'login',
    title: 'Login realizado',
    description: 'Acesso via navegador Chrome',
    timestamp: new Date(2025, 11, 2, 8, 45),
    status: 'completed',
    user: 'Admin'
  },
  {
    id: '11',
    type: 'config',
    title: 'Configuração de órgão alterada',
    description: 'Quórum do Comitê de Auditoria atualizado para 4',
    timestamp: new Date(2025, 11, 1, 15, 20),
    status: 'completed',
    user: 'Admin'
  },
  {
    id: '12',
    type: 'meeting',
    title: 'Reunião do Comitê de Riscos agendada',
    description: 'Data: 10/12/2025 às 14h',
    timestamp: new Date(2025, 11, 1, 10, 0),
    status: 'scheduled',
    user: 'Sistema'
  },
  {
    id: '13',
    type: 'email_sent',
    title: 'Convocação enviada para 5 participantes',
    description: 'Reunião extraordinária do Conselho',
    timestamp: new Date(2025, 10, 30, 14, 30),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '14',
    type: 'task_completed',
    title: 'Tarefa "Análise de compliance" concluída',
    description: 'Responsável: Fernanda Costa',
    timestamp: new Date(2025, 10, 29, 17, 0),
    status: 'completed',
    user: 'Fernanda Costa'
  },
  {
    id: '15',
    type: 'document',
    title: 'Política de Governança v2.0 publicada',
    description: 'Documento aprovado pelo Conselho',
    timestamp: new Date(2025, 10, 28, 11, 30),
    status: 'completed',
    user: 'Admin'
  },
  {
    id: '16',
    type: 'ata_generated',
    title: 'ATA da Comissão de Ética gerada',
    description: 'Reunião de análise de denúncias',
    timestamp: new Date(2025, 10, 27, 16, 45),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '17',
    type: 'whatsapp_sent',
    title: 'Alerta de tarefa atrasada enviado',
    description: 'Destinatário: Ricardo Almeida',
    timestamp: new Date(2025, 10, 26, 9, 15),
    status: 'completed',
    user: 'Sistema'
  },
  {
    id: '18',
    type: 'approval',
    title: 'Documento rejeitado',
    description: 'Contrato de parceria requer revisão - Motivo: cláusulas inconsistentes',
    timestamp: new Date(2025, 10, 25, 14, 20),
    status: 'error',
    user: 'Carlos Mendes'
  },
  {
    id: '19',
    type: 'meeting',
    title: 'Reunião cancelada',
    description: 'Comitê de Pessoas - Reagendamento necessário',
    timestamp: new Date(2025, 10, 24, 10, 0),
    status: 'cancelled',
    user: 'Admin'
  },
  {
    id: '20',
    type: 'logout',
    title: 'Sessão encerrada',
    description: 'Logout manual do usuário',
    timestamp: new Date(2025, 10, 24, 18, 30),
    status: 'completed',
    user: 'Admin'
  }
];

export const useEnhancedActivities = () => {
  const { logs } = useAuditLogs({ limit: 50 });
  const [filters, setFilters] = useState<ActivityFilters>({
    search: '',
    type: 'all',
    status: 'all'
  });

  const mapAuditLogToActivity = (log: any): EnhancedActivity => {
    const actionTypeMap: Record<string, ActivityType> = {
      'INSERT': 'document',
      'UPDATE': 'config',
      'DELETE': 'config',
      'ENVIO_EMAIL_ALERTA': 'email_sent',
      'ENVIO_WHATSAPP_ALERTA': 'whatsapp_sent',
      'CONCLUSAO_TAREFA': 'task_completed',
      'GERACAO_LINK_ACESSO': 'config',
      'LOGIN': 'login',
      'LOGOUT': 'logout'
    };

    return {
      id: log.id,
      type: actionTypeMap[log.action] || 'config',
      title: `${log.action} em ${log.entity_type}`,
      description: log.entity_id ? `ID: ${log.entity_id}` : undefined,
      timestamp: new Date(log.created_at),
      status: log.success ? 'completed' : 'error',
      user: 'Sistema',
      metadata: log.metadata
    };
  };

  const allActivities = useMemo(() => {
    const auditActivities = logs.map(mapAuditLogToActivity);
    const combined = [...auditActivities, ...demoActivities];
    return combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs]);

  const filteredActivities = useMemo(() => {
    return allActivities.filter(activity => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          activity.title.toLowerCase().includes(searchLower) ||
          activity.description?.toLowerCase().includes(searchLower) ||
          activity.user?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.type !== 'all' && activity.type !== filters.type) {
        return false;
      }

      if (filters.status !== 'all' && activity.status !== filters.status) {
        return false;
      }

      if (filters.dateRange) {
        const activityDate = activity.timestamp;
        if (activityDate < filters.dateRange.start || activityDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [allActivities, filters]);

  return {
    activities: filteredActivities,
    totalCount: allActivities.length,
    filters,
    setFilters,
    updateFilter: <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
};
