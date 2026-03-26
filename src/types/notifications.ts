export type NotificationType = 
  | 'CONVOCACAO_REUNIAO'
  | 'EDICAO_REUNIAO'
  | 'UPLOAD_DOCUMENTO'
  | 'ATA_GERADA'
  | 'LEMBRETE_30D'
  | 'LEMBRETE_7D'
  | 'LEMBRETE_24H'
  | 'LEMBRETE_12H'
  | 'LEMBRETE_1H'
  | 'MAGIC_LINK_CONVIDADO';

export type NotificationStatus = 'ENVIADA' | 'PENDENTE' | 'ERRO';
export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'IN_APP';

export interface MockNotification {
  id: string;
  user_id: string | null;
  external_email: string | null;
  recipient_name: string;
  type: NotificationType;
  title: string;
  message: string;
  scheduled_at: string;
  sent_at: string | null;
  status: NotificationStatus;
  channel: NotificationChannel;
  read_at: string | null;
  context: {
    meeting_id?: string;
    organ_type?: string;
    organ_name?: string;
    meeting_date?: string;
    document_name?: string;
    guest_token?: string;
    [key: string]: any;
  };
}

export interface NotificationFilters {
  type?: NotificationType | 'ALL';
  status?: NotificationStatus | 'ALL';
  channel?: NotificationChannel | 'ALL';
  dateRange?: {
    start: Date;
    end: Date;
  };
  organType?: 'conselho' | 'comite' | 'comissao' | 'ALL';
  searchTerm?: string;
}

export interface NotificationMetrics {
  total: number;
  sent: number;
  pending: number;
  error: number;
  last24h: number;
  openRate: number;
}
