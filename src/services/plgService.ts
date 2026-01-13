/**
 * Serviço PLG (Product-Led Growth)
 * 
 * Integração com Edge Functions do Supabase para:
 * - Rastrear eventos do funil
 * - Obter métricas de conversão
 * - Gerenciar leads
 */

import { supabase } from '@/lib/supabase';

// Tipos
export interface PLGLeadData {
  name: string;
  email: string;
  company: string;
  phone?: string;
}

export interface GovMetrixData {
  score: number;
  stage: string;
  categoryScores: Record<string, number>;
  answers?: Record<string, any>;
}

export interface QuizData {
  faturamento?: string;
  temConselho?: string;
  temSucessao?: string;
  avaliacaoEsg?: string;
  numColaboradores?: string;
  recommendedPlan?: string;
}

export interface TrackEventParams {
  eventType: string;
  leadEmail?: string;
  leadData?: PLGLeadData;
  eventData?: Record<string, any>;
  sessionId?: string;
}

export interface PLGMetrics {
  period: string;
  startDate: string;
  endDate: string;
  summary: {
    totalLeads: number;
    convertedLeads: number;
    overallConversionRate: number;
    avgGovMetrixScore: number | null;
  };
  funnelStages: Array<{
    stage: string;
    count: number;
    avgScore: number | null;
  }>;
  conversionRates: Array<{
    fromStage: string;
    toStage: string;
    rate: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    totalLeads: number;
    iscaStarted: number;
    iscaCompleted: number;
    discoveryCompleted: number;
    checkoutCompleted: number;
    paymentCompleted: number;
    activationCompleted: number;
    avgScore: number | null;
  }>;
  planDistribution: Record<string, number>;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    company: string;
    funnel_stage: string;
    govmetrix_score: number | null;
    recommended_plan: string | null;
    created_at: string;
  }>;
}

// Gerar ID de sessão único
export function generateSessionId(): string {
  const stored = sessionStorage.getItem('plg_session_id');
  if (stored) return stored;
  
  const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('plg_session_id', newId);
  return newId;
}

/**
 * Rastrear evento do funil PLG
 */
export interface TrackEventResult {
  success: boolean;
  eventId?: string;
  leadId?: string;
  leadPath?: 'plg' | 'slg';
  slgPriority?: 'low' | 'normal' | 'high' | 'urgent';
  error?: string;
}

export async function trackPLGEvent(params: TrackEventParams): Promise<TrackEventResult> {
  try {
    const { data, error } = await supabase.functions.invoke('plg-track-event', {
      body: {
        event_type: params.eventType,
        lead_email: params.leadEmail,
        lead_data: params.leadData,
        event_data: params.eventData,
        session_id: params.sessionId || generateSessionId(),
        page_url: window.location.href,
        page_title: document.title,
      },
    });

    if (error) {
      console.error('Erro ao rastrear evento PLG:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      eventId: data.event_id,
      leadId: data.lead_id,
      leadPath: data.lead_path,
      slgPriority: data.slg_priority
    };
  } catch (error) {
    console.error('Erro ao rastrear evento PLG:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Rastrear conclusão da ISCA (GovMetrix Quiz)
 */
export async function trackISCACompleted(
  leadData: PLGLeadData,
  govMetrixData: GovMetrixData
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  return trackPLGEvent({
    eventType: 'isca_completed',
    leadEmail: leadData.email,
    leadData,
    eventData: {
      govmetrix: govMetrixData,
      source: 'govmetrix_quiz'
    }
  });
}

/**
 * Rastrear conclusão do Quiz de Descoberta
 */
export async function trackDiscoveryCompleted(
  leadEmail: string,
  quizData: QuizData
): Promise<{ success: boolean; error?: string }> {
  return trackPLGEvent({
    eventType: 'discovery_completed',
    leadEmail,
    eventData: { quiz: quizData }
  });
}

/**
 * Rastrear conclusão do Checkout
 */
export async function trackCheckoutCompleted(
  leadEmail: string,
  selectedPlan: string,
  paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
  return trackPLGEvent({
    eventType: 'checkout_completed',
    leadEmail,
    eventData: { selectedPlan, paymentMethod }
  });
}

/**
 * Rastrear pagamento concluído
 */
export async function trackPaymentCompleted(
  leadEmail: string,
  paymentData: { orderId: string; amount: number; method: string }
): Promise<{ success: boolean; error?: string }> {
  return trackPLGEvent({
    eventType: 'payment_completed',
    leadEmail,
    eventData: paymentData
  });
}

/**
 * Rastrear ativação concluída
 */
export async function trackActivationCompleted(
  leadEmail: string,
  userId: string,
  orgId: string
): Promise<{ success: boolean; error?: string }> {
  return trackPLGEvent({
    eventType: 'activation_completed',
    leadEmail,
    eventData: { userId, orgId }
  });
}

/**
 * Obter métricas do funil PLG
 */
export async function getPLGMetrics(period: '24h' | '7d' | '30d' | '90d' = '7d'): Promise<PLGMetrics | null> {
  try {
    const { data, error } = await supabase.functions.invoke('plg-metrics', {
      body: {},
      method: 'GET',
    });

    if (error) {
      console.error('Erro ao obter métricas PLG:', error);
      return null;
    }

    return data as PLGMetrics;
  } catch (error) {
    console.error('Erro ao obter métricas PLG:', error);
    return null;
  }
}

/**
 * Obter métricas mock para desenvolvimento/demo
 */
export function getMockPLGMetrics(): PLGMetrics {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    period: '7d',
    startDate: days[0] + 'T00:00:00.000Z',
    endDate: today.toISOString(),
    summary: {
      totalLeads: 156,
      convertedLeads: 23,
      overallConversionRate: 15,
      avgGovMetrixScore: 58
    },
    funnelStages: [
      { stage: 'isca_started', count: 156, avgScore: null },
      { stage: 'isca_completed', count: 98, avgScore: 58 },
      { stage: 'discovery_started', count: 72, avgScore: 62 },
      { stage: 'discovery_completed', count: 54, avgScore: 65 },
      { stage: 'checkout_started', count: 38, avgScore: 68 },
      { stage: 'checkout_completed', count: 32, avgScore: 70 },
      { stage: 'payment_started', count: 28, avgScore: 72 },
      { stage: 'payment_completed', count: 25, avgScore: 74 },
      { stage: 'activation_started', count: 24, avgScore: 75 },
      { stage: 'activation_completed', count: 23, avgScore: 76 },
    ],
    conversionRates: [
      { fromStage: 'isca_started', toStage: 'isca_completed', rate: 63 },
      { fromStage: 'isca_completed', toStage: 'discovery_started', rate: 73 },
      { fromStage: 'discovery_started', toStage: 'discovery_completed', rate: 75 },
      { fromStage: 'discovery_completed', toStage: 'checkout_started', rate: 70 },
      { fromStage: 'checkout_started', toStage: 'checkout_completed', rate: 84 },
      { fromStage: 'checkout_completed', toStage: 'payment_started', rate: 88 },
      { fromStage: 'payment_started', toStage: 'payment_completed', rate: 89 },
      { fromStage: 'payment_completed', toStage: 'activation_started', rate: 96 },
      { fromStage: 'activation_started', toStage: 'activation_completed', rate: 96 },
    ],
    dailyMetrics: days.map((date, i) => ({
      date,
      totalLeads: 18 + Math.floor(Math.random() * 12),
      iscaStarted: 18 + Math.floor(Math.random() * 12),
      iscaCompleted: 12 + Math.floor(Math.random() * 8),
      discoveryCompleted: 6 + Math.floor(Math.random() * 6),
      checkoutCompleted: 4 + Math.floor(Math.random() * 4),
      paymentCompleted: 3 + Math.floor(Math.random() * 3),
      activationCompleted: 2 + Math.floor(Math.random() * 3),
      avgScore: 55 + Math.floor(Math.random() * 20)
    })),
    planDistribution: {
      startup: 45,
      pequena: 52,
      media: 38,
      grande: 15,
      listada: 6
    },
    recentLeads: [
      { id: '1', name: 'João Silva', email: 'joao@empresa.com', company: 'Tech Solutions', funnel_stage: 'activation_completed', govmetrix_score: 78, recommended_plan: 'media', created_at: new Date().toISOString() },
      { id: '2', name: 'Maria Santos', email: 'maria@corp.com', company: 'Corp Brasil', funnel_stage: 'checkout_started', govmetrix_score: 65, recommended_plan: 'pequena', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', name: 'Pedro Lima', email: 'pedro@ind.com', company: 'Indústria ABC', funnel_stage: 'discovery_completed', govmetrix_score: 82, recommended_plan: 'grande', created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: '4', name: 'Ana Costa', email: 'ana@startup.io', company: 'StartupXYZ', funnel_stage: 'isca_completed', govmetrix_score: 42, recommended_plan: 'startup', created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: '5', name: 'Carlos Mendes', email: 'carlos@holding.com', company: 'Holding Group', funnel_stage: 'payment_completed', govmetrix_score: 91, recommended_plan: 'listada', created_at: new Date(Date.now() - 14400000).toISOString() },
    ]
  };
}

// Labels para estágios do funil
export const FUNNEL_STAGE_LABELS: Record<string, string> = {
  'isca_started': 'ISCA Iniciada',
  'isca_completed': 'ISCA Completa',
  'discovery_started': 'Descoberta Iniciada',
  'discovery_completed': 'Descoberta Completa',
  'checkout_started': 'Checkout Iniciado',
  'checkout_completed': 'Checkout Completo',
  'payment_started': 'Pagamento Iniciado',
  'payment_completed': 'Pagamento Concluído',
  'activation_started': 'Ativação Iniciada',
  'activation_completed': 'Ativação Concluída',
};

// Cores para estágios do funil
export const FUNNEL_STAGE_COLORS: Record<string, string> = {
  'isca_started': '#94a3b8',
  'isca_completed': '#3b82f6',
  'discovery_started': '#6366f1',
  'discovery_completed': '#8b5cf6',
  'checkout_started': '#a855f7',
  'checkout_completed': '#d946ef',
  'payment_started': '#ec4899',
  'payment_completed': '#f43f5e',
  'activation_started': '#f97316',
  'activation_completed': '#22c55e',
};
