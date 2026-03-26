/**
 * Hook para rastrear e gerenciar o funil PLG (Product-Led Growth)
 * 
 * Fluxo completo:
 * ISCA (GovMetrix Quiz) → Descoberta (Resultado) → Contratação (Plan Discovery → Checkout → Payment) → Ativação
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  PLG_STORAGE_KEYS, 
  GovMetrixResult, 
  getGovMetrixResult 
} from '@/utils/planRecommendation';
import { trackPLGEvent, generateSessionId } from '@/services/plgService';

// Etapas do funil PLG
export type PLGStage = 
  | 'isca_started'      // Usuário iniciou o quiz ISCA
  | 'isca_completed'    // Usuário completou a ISCA e viu resultado
  | 'discovery_started' // Usuário iniciou o quiz de descoberta de plano
  | 'discovery_completed' // Usuário completou o quiz de descoberta
  | 'checkout_started'  // Usuário iniciou o checkout
  | 'checkout_completed' // Usuário completou o checkout
  | 'payment_started'   // Usuário iniciou o pagamento
  | 'payment_completed' // Pagamento confirmado
  | 'activation_started' // Usuário iniciou a ativação
  | 'activation_completed'; // Plano ativado, onboarding completo

// Evento do funil
export interface PLGFunnelEvent {
  stage: PLGStage;
  timestamp: string;
  data?: Record<string, any>;
}

// Estado completo do funil
export interface PLGFunnelState {
  currentStage: PLGStage | null;
  events: PLGFunnelEvent[];
  govMetrixResult: GovMetrixResult | null;
  quizResult: any | null;
  checkoutData: any | null;
  paymentData: any | null;
  isComplete: boolean;
  // Métricas de tempo
  timeToDiscovery: number | null;  // ms desde ISCA até discovery
  timeToCheckout: number | null;   // ms desde discovery até checkout
  timeToPayment: number | null;    // ms desde checkout até payment
  timeToActivation: number | null; // ms desde payment até activation
  totalJourneyTime: number | null; // tempo total da jornada
}

const PLG_FUNNEL_KEY = 'plg_funnel_state';

// Obter estado do funil do localStorage
function getStoredFunnelState(): Partial<PLGFunnelState> | null {
  try {
    const stored = localStorage.getItem(PLG_FUNNEL_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao recuperar estado do funil PLG:', error);
  }
  return null;
}

// Salvar estado do funil no localStorage
function saveFunnelState(state: PLGFunnelState): void {
  try {
    localStorage.setItem(PLG_FUNNEL_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar estado do funil PLG:', error);
  }
}

// Calcular tempo entre eventos
function calculateTimeDiff(events: PLGFunnelEvent[], fromStage: PLGStage, toStage: PLGStage): number | null {
  const fromEvent = events.find(e => e.stage === fromStage);
  const toEvent = events.find(e => e.stage === toStage);
  
  if (fromEvent && toEvent) {
    return new Date(toEvent.timestamp).getTime() - new Date(fromEvent.timestamp).getTime();
  }
  return null;
}

export function usePLGFunnel() {
  const [state, setState] = useState<PLGFunnelState>(() => {
    const stored = getStoredFunnelState();
    return {
      currentStage: stored?.currentStage || null,
      events: stored?.events || [],
      govMetrixResult: getGovMetrixResult(),
      quizResult: null,
      checkoutData: null,
      paymentData: null,
      isComplete: stored?.isComplete || false,
      timeToDiscovery: stored?.timeToDiscovery || null,
      timeToCheckout: stored?.timeToCheckout || null,
      timeToPayment: stored?.timeToPayment || null,
      timeToActivation: stored?.timeToActivation || null,
      totalJourneyTime: stored?.totalJourneyTime || null,
    };
  });

  // Sincronizar com localStorage ao montar
  useEffect(() => {
    const quizResult = localStorage.getItem(PLG_STORAGE_KEYS.QUIZ_RESULT);
    const checkoutData = localStorage.getItem(PLG_STORAGE_KEYS.CHECKOUT_DATA);
    const paymentData = localStorage.getItem(PLG_STORAGE_KEYS.PAYMENT_COMPLETED);
    
    setState(prev => ({
      ...prev,
      govMetrixResult: getGovMetrixResult(),
      quizResult: quizResult ? JSON.parse(quizResult) : null,
      checkoutData: checkoutData ? JSON.parse(checkoutData) : null,
      paymentData: paymentData ? JSON.parse(paymentData) : null,
    }));
  }, []);

  // Registrar evento no funil (local + Supabase)
  const trackEvent = useCallback(async (stage: PLGStage, data?: Record<string, any>) => {
    // Atualizar estado local
    setState(prev => {
      const newEvent: PLGFunnelEvent = {
        stage,
        timestamp: new Date().toISOString(),
        data,
      };

      const events = [...prev.events, newEvent];
      
      // Calcular métricas de tempo
      const timeToDiscovery = calculateTimeDiff(events, 'isca_completed', 'discovery_started');
      const timeToCheckout = calculateTimeDiff(events, 'discovery_completed', 'checkout_started');
      const timeToPayment = calculateTimeDiff(events, 'checkout_completed', 'payment_completed');
      const timeToActivation = calculateTimeDiff(events, 'payment_completed', 'activation_completed');
      
      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];
      const totalJourneyTime = firstEvent && lastEvent 
        ? new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime()
        : null;

      const newState: PLGFunnelState = {
        ...prev,
        currentStage: stage,
        events,
        isComplete: stage === 'activation_completed',
        timeToDiscovery,
        timeToCheckout,
        timeToPayment,
        timeToActivation,
        totalJourneyTime,
      };

      saveFunnelState(newState);
      return newState;
    });

    // Enviar para Supabase (async, não bloqueia)
    try {
      const govMetrix = getGovMetrixResult();
      await trackPLGEvent({
        eventType: stage,
        leadEmail: govMetrix?.leadData?.email,
        leadData: govMetrix?.leadData ? {
          name: govMetrix.leadData.name,
          email: govMetrix.leadData.email,
          company: govMetrix.leadData.company,
          phone: govMetrix.leadData.whatsapp,
        } : undefined,
        eventData: {
          ...data,
          govmetrix: govMetrix ? {
            score: govMetrix.score,
            stage: govMetrix.stage,
            categoryScores: govMetrix.categoryScores,
          } : undefined,
        },
        sessionId: generateSessionId(),
      });
    } catch (error) {
      // Falha silenciosa - não impede o fluxo do usuário
      console.warn('Erro ao enviar evento PLG para Supabase:', error);
    }
  }, []);

  // Resetar funil
  const resetFunnel = useCallback(() => {
    localStorage.removeItem(PLG_FUNNEL_KEY);
    localStorage.removeItem(PLG_STORAGE_KEYS.GOVMETRIX_RESULT);
    localStorage.removeItem(PLG_STORAGE_KEYS.QUIZ_RESULT);
    localStorage.removeItem(PLG_STORAGE_KEYS.CHECKOUT_DATA);
    localStorage.removeItem(PLG_STORAGE_KEYS.PAYMENT_COMPLETED);
    
    setState({
      currentStage: null,
      events: [],
      govMetrixResult: null,
      quizResult: null,
      checkoutData: null,
      paymentData: null,
      isComplete: false,
      timeToDiscovery: null,
      timeToCheckout: null,
      timeToPayment: null,
      timeToActivation: null,
      totalJourneyTime: null,
    });
  }, []);

  // Obter progresso percentual do funil
  const getProgress = useCallback((): number => {
    const stageOrder: PLGStage[] = [
      'isca_started',
      'isca_completed',
      'discovery_started',
      'discovery_completed',
      'checkout_started',
      'checkout_completed',
      'payment_started',
      'payment_completed',
      'activation_started',
      'activation_completed',
    ];
    
    if (!state.currentStage) return 0;
    
    const currentIndex = stageOrder.indexOf(state.currentStage);
    return Math.round((currentIndex + 1) / stageOrder.length * 100);
  }, [state.currentStage]);

  // Verificar se passou por determinada etapa
  const hasPassedStage = useCallback((stage: PLGStage): boolean => {
    return state.events.some(e => e.stage === stage);
  }, [state.events]);

  // Obter última etapa antes de abandonar
  const getDropOffStage = useCallback((): PLGStage | null => {
    if (state.isComplete) return null;
    return state.currentStage;
  }, [state.isComplete, state.currentStage]);

  // Formatação de tempo
  const formatDuration = useCallback((ms: number | null): string => {
    if (ms === null) return '-';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }, []);

  return {
    // Estado
    state,
    currentStage: state.currentStage,
    events: state.events,
    isComplete: state.isComplete,
    govMetrixResult: state.govMetrixResult,
    quizResult: state.quizResult,
    checkoutData: state.checkoutData,
    paymentData: state.paymentData,
    
    // Ações
    trackEvent,
    resetFunnel,
    
    // Helpers
    getProgress,
    hasPassedStage,
    getDropOffStage,
    formatDuration,
    
    // Métricas de tempo formatadas
    metrics: {
      timeToDiscovery: formatDuration(state.timeToDiscovery),
      timeToCheckout: formatDuration(state.timeToCheckout),
      timeToPayment: formatDuration(state.timeToPayment),
      timeToActivation: formatDuration(state.timeToActivation),
      totalJourneyTime: formatDuration(state.totalJourneyTime),
    },
  };
}

// Hook para rastrear eventos automaticamente baseado na rota
export function usePLGFunnelAutoTrack() {
  const { trackEvent, hasPassedStage } = usePLGFunnel();
  
  const autoTrackByRoute = useCallback((pathname: string) => {
    switch (pathname) {
      case '/plan-discovery':
        if (!hasPassedStage('discovery_started')) {
          trackEvent('discovery_started', { route: pathname });
        }
        break;
      case '/plan-result':
        if (!hasPassedStage('discovery_completed')) {
          trackEvent('discovery_completed', { route: pathname });
        }
        break;
      case '/checkout':
      case '/checkout-legacy':
        if (!hasPassedStage('checkout_started')) {
          trackEvent('checkout_started', { route: pathname });
        }
        break;
      case '/payment':
        if (!hasPassedStage('payment_started')) {
          trackEvent('payment_started', { route: pathname });
        }
        break;
      case '/payment-confirmed':
        if (!hasPassedStage('payment_completed')) {
          trackEvent('payment_completed', { route: pathname });
        }
        break;
      case '/plan-activation':
        if (!hasPassedStage('activation_started')) {
          trackEvent('activation_started', { route: pathname });
        }
        break;
      case '/dashboard':
        if (!hasPassedStage('activation_completed')) {
          trackEvent('activation_completed', { route: pathname });
        }
        break;
    }
  }, [trackEvent, hasPassedStage]);
  
  return { autoTrackByRoute };
}
