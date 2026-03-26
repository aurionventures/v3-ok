import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type EventType = 
  | 'login'
  | 'logout'
  | 'page_view'
  | 'document_read'
  | 'document_download'
  | 'checklist_toggle'
  | 'copilot_interaction'
  | 'briefing_read'
  | 'ata_approval'
  | 'task_completion'
  | 'session_duration';

interface TrackingEvent {
  event_type: EventType;
  event_data?: Record<string, unknown>;
  page_path?: string;
  session_id?: string;
  session_start?: string;
  duration_seconds?: number;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function useMemberTracking() {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(generateSessionId());
  const sessionStartRef = useRef<Date>(new Date());
  const lastPageRef = useRef<string>('');

  const trackEvent = useCallback(async (
    eventType: EventType,
    eventData: Record<string, unknown> = {}
  ) => {
    if (!user?.id) return;

    const trackingData: TrackingEvent = {
      event_type: eventType,
      event_data: {
        ...eventData,
        device_type: getDeviceType(),
        user_agent: navigator.userAgent,
        screen_size: `${window.screen.width}x${window.screen.height}`,
      },
      page_path: window.location.pathname,
      session_id: sessionIdRef.current,
      session_start: sessionStartRef.current.toISOString(),
      duration_seconds: Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000),
    };

    // Store locally for now (can be synced to server later)
    const existingLogs = JSON.parse(localStorage.getItem('member_activity_logs') || '[]');
    existingLogs.push({
      ...trackingData,
      member_id: user.id,
      company_id: user.company || 'demo-company',
      created_at: new Date().toISOString(),
    });
    
    // Keep only last 1000 events locally
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    localStorage.setItem('member_activity_logs', JSON.stringify(existingLogs));

    // Also try to sync to server (silently fail if table doesn't exist)
    try {
      await supabase.from('member_activity_logs' as any).insert({
        member_id: user.id,
        company_id: user.company || 'demo-company',
        event_type: eventType,
        event_data: trackingData.event_data,
        page_path: trackingData.page_path,
        session_id: trackingData.session_id,
        session_start: trackingData.session_start,
        duration_seconds: trackingData.duration_seconds,
      });
    } catch (error) {
      // Silently fail - tracking is non-critical
      console.debug('Tracking sync skipped:', error);
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPageRef.current && currentPath.startsWith('/member-portal')) {
      trackEvent('page_view', { from_page: lastPageRef.current });
      lastPageRef.current = currentPath;
    }
  }, [trackEvent]);

  // Track session start
  useEffect(() => {
    if (user?.id) {
      trackEvent('login');
      
      // Track session duration periodically
      const intervalId = setInterval(() => {
        trackEvent('session_duration');
      }, 5 * 60 * 1000); // Every 5 minutes

      // Track logout on unmount
      return () => {
        clearInterval(intervalId);
        trackEvent('logout');
      };
    }
  }, [user?.id, trackEvent]);

  // Get analytics summary
  const getAnalyticsSummary = useCallback(() => {
    const logs = JSON.parse(localStorage.getItem('member_activity_logs') || '[]');
    const userLogs = logs.filter((log: any) => log.member_id === user?.id);

    const summary = {
      totalPageViews: userLogs.filter((l: any) => l.event_type === 'page_view').length,
      documentsRead: userLogs.filter((l: any) => l.event_type === 'document_read').length,
      documentsDownloaded: userLogs.filter((l: any) => l.event_type === 'document_download').length,
      copilotInteractions: userLogs.filter((l: any) => l.event_type === 'copilot_interaction').length,
      checklistActions: userLogs.filter((l: any) => l.event_type === 'checklist_toggle').length,
      tasksCompleted: userLogs.filter((l: any) => l.event_type === 'task_completion').length,
      totalSessionTime: userLogs.reduce((acc: number, l: any) => acc + (l.duration_seconds || 0), 0),
      lastActivity: userLogs.length > 0 ? userLogs[userLogs.length - 1].created_at : null,
      mostVisitedPages: getMostVisitedPages(userLogs),
      activityByDay: getActivityByDay(userLogs),
    };

    return summary;
  }, [user?.id]);

  return { trackEvent, getAnalyticsSummary };
}

function getMostVisitedPages(logs: any[]): Record<string, number> {
  const pageViews = logs.filter((l: any) => l.event_type === 'page_view');
  const pageCounts: Record<string, number> = {};
  
  pageViews.forEach((log: any) => {
    const path = log.page_path || '/member-portal';
    pageCounts[path] = (pageCounts[path] || 0) + 1;
  });
  
  return pageCounts;
}

function getActivityByDay(logs: any[]): Record<string, number> {
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dayCounts: Record<string, number> = {};
  
  logs.forEach((log: any) => {
    const date = new Date(log.created_at);
    const dayName = dayNames[date.getDay()];
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });
  
  return dayCounts;
}

export default useMemberTracking;
