// ============================================================================
// SERVIÇO DE NOTIFICAÇÕES
// Gerencia notificações in-app e emails para briefings
// ============================================================================

import type { MemberBriefing } from "@/types/copilot";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --------------------------------------------------------------------------
// TIPOS
// --------------------------------------------------------------------------

export interface NotificationPayload {
  memberId: string;
  memberEmail: string;
  memberName: string;
  briefing: MemberBriefing;
  meetingDate: string;
  meetingTitle?: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  type: 'briefing_ready' | 'briefing_reminder' | 'meeting_reminder' | 'agenda_approved';
  title: string;
  message: string;
  link: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
}

export interface BriefingEmailData {
  to: string;
  subject: string;
  memberName: string;
  meetingDate: string;
  meetingTitle: string;
  readingTime: number;
  topicsCount: number;
  criticalTopics: string[];
  ctaLink: string;
}

// --------------------------------------------------------------------------
// ARMAZENAMENTO LOCAL DE NOTIFICAÇÕES (Mock para desenvolvimento)
// --------------------------------------------------------------------------

const NOTIFICATIONS_STORAGE_KEY = 'legacy_notifications';

function getStoredNotifications(): InAppNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: InAppNotification[]): void {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
}

// --------------------------------------------------------------------------
// FUNÇÕES DE NOTIFICAÇÃO IN-APP
// --------------------------------------------------------------------------

export async function createInAppNotification(
  notification: Omit<InAppNotification, 'id' | 'read' | 'createdAt'>
): Promise<InAppNotification> {
  const newNotification: InAppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const notifications = getStoredNotifications();
  notifications.unshift(newNotification);
  saveNotifications(notifications);

  // Dispara evento customizado para atualizar UI em tempo real
  window.dispatchEvent(new CustomEvent('notification:new', { 
    detail: newNotification 
  }));

  return newNotification;
}

export function getNotificationsForUser(userId: string): InAppNotification[] {
  return getStoredNotifications().filter(n => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return getNotificationsForUser(userId).filter(n => !n.read).length;
}

export function markAsRead(notificationId: string): void {
  const notifications = getStoredNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
    window.dispatchEvent(new CustomEvent('notification:read', { 
      detail: { id: notificationId } 
    }));
  }
}

export function markAllAsRead(userId: string): void {
  const notifications = getStoredNotifications();
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  saveNotifications(notifications);
  window.dispatchEvent(new CustomEvent('notification:allRead', { 
    detail: { userId } 
  }));
}

// --------------------------------------------------------------------------
// ENVIO DE NOTIFICAÇÃO DE BRIEFING
// --------------------------------------------------------------------------

export async function sendBriefingNotification(
  payload: NotificationPayload
): Promise<{ inApp: boolean; email: boolean }> {
  const result = { inApp: false, email: false };

  try {
    // 1. Criar notificação In-App
    await createInAppNotification({
      userId: payload.memberId,
      type: 'briefing_ready',
      title: 'Novo Briefing Disponível',
      message: `${payload.memberName}, seu briefing personalizado para a reunião de ${format(
        new Date(payload.meetingDate), 
        "dd 'de' MMMM", 
        { locale: ptBR }
      )} está pronto. ${payload.briefing.content.estimatedReadingTime} min de leitura.`,
      link: '/member-portal?tab=briefing',
      priority: 'high',
    });
    result.inApp = true;

    // 2. Tentar enviar email (via Supabase Edge Function ou EmailJS)
    const emailSent = await sendBriefingEmail({
      to: payload.memberEmail,
      subject: `Briefing Personalizado: Reunião de ${format(
        new Date(payload.meetingDate), 
        "dd/MM/yyyy", 
        { locale: ptBR }
      )}`,
      memberName: payload.memberName,
      meetingDate: payload.meetingDate,
      meetingTitle: payload.meetingTitle || 'Reunião do Conselho',
      readingTime: payload.briefing.content.estimatedReadingTime,
      topicsCount: payload.briefing.content.topicBreakdown.length,
      criticalTopics: payload.briefing.content.topicBreakdown.map(t => t.title),
      ctaLink: `${window.location.origin}/member-portal?tab=briefing`,
    });
    result.email = emailSent;

  } catch (error) {
    console.error('Erro ao enviar notificação de briefing:', error);
  }

  return result;
}

// --------------------------------------------------------------------------
// ENVIO DE EMAIL
// --------------------------------------------------------------------------

async function sendBriefingEmail(data: BriefingEmailData): Promise<boolean> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase não configurado - email não enviado');
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-briefing-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(`Email enviado para ${data.to}`);
      return true;
    } else {
      console.warn('Falha ao enviar email:', await response.text());
      return false;
    }
  } catch (error) {
    console.warn('Email service não disponível:', error);
    return false;
  }
}

// --------------------------------------------------------------------------
// ENVIO EM LOTE PARA MÚLTIPLOS MEMBROS
// --------------------------------------------------------------------------

export interface MemberData {
  id: string;
  email: string;
  name: string;
}

export async function sendBriefingNotifications(
  briefings: MemberBriefing[],
  memberData: Map<string, MemberData>,
  meetingDate: string,
  meetingTitle?: string
): Promise<{ total: number; inAppSuccess: number; emailSuccess: number }> {
  const results = {
    total: briefings.length,
    inAppSuccess: 0,
    emailSuccess: 0,
  };

  for (const briefing of briefings) {
    const member = memberData.get(briefing.memberId);
    
    if (member) {
      const result = await sendBriefingNotification({
        memberId: briefing.memberId,
        memberEmail: member.email,
        memberName: member.name,
        briefing,
        meetingDate,
        meetingTitle,
      });

      if (result.inApp) results.inAppSuccess++;
      if (result.email) results.emailSuccess++;
    }
  }

  return results;
}

// --------------------------------------------------------------------------
// NOTIFICAÇÕES DE LEMBRETE
// --------------------------------------------------------------------------

export async function sendMeetingReminder(
  memberId: string,
  memberName: string,
  meetingDate: string,
  hoursUntil: number
): Promise<void> {
  await createInAppNotification({
    userId: memberId,
    type: 'meeting_reminder',
    title: 'Lembrete de Reunião',
    message: `${memberName}, sua reunião começa em ${hoursUntil} horas. Verifique se concluiu a preparação do briefing.`,
    link: '/member-portal?tab=briefing',
    priority: hoursUntil <= 24 ? 'high' : 'medium',
  });
}

export async function sendBriefingReminder(
  memberId: string,
  memberName: string,
  briefingProgress: number
): Promise<void> {
  if (briefingProgress < 100) {
    await createInAppNotification({
      userId: memberId,
      type: 'briefing_reminder',
      title: 'Complete sua Preparação',
      message: `${memberName}, seu progresso de preparação está em ${briefingProgress}%. Complete a revisão do briefing antes da reunião.`,
      link: '/member-portal?tab=briefing',
      priority: briefingProgress < 50 ? 'high' : 'medium',
    });
  }
}

// --------------------------------------------------------------------------
// HOOK PARA ESCUTAR NOTIFICAÇÕES EM TEMPO REAL
// --------------------------------------------------------------------------

export function useNotificationListener(
  userId: string,
  onNewNotification?: (notification: InAppNotification) => void
): void {
  if (typeof window === 'undefined') return;

  const handleNewNotification = (event: CustomEvent<InAppNotification>) => {
    if (event.detail.userId === userId && onNewNotification) {
      onNewNotification(event.detail);
    }
  };

  window.addEventListener('notification:new', handleNewNotification as EventListener);

  // Cleanup será feito no useEffect do componente que usar isso
}
