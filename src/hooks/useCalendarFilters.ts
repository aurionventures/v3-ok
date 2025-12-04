import { useState, useMemo } from 'react';
import { MeetingSchedule } from '@/types/annualSchedule';

interface CalendarFilters {
  organType: string;
  organId: string;
  status: string;
  meetingType: string;
}

// Helper to get ATA status from localStorage
const getATAStatusMap = (): Record<string, string> => {
  const stored = localStorage.getItem('meeting_ata_status');
  return stored ? JSON.parse(stored) : {};
};

export const useCalendarFilters = (meetings: MeetingSchedule[], initialStatus: string = 'all') => {
  const [filters, setFilters] = useState<CalendarFilters>({
    organType: 'all',
    organId: 'all',
    status: initialStatus,
    meetingType: 'all',
  });

  const filteredMeetings = useMemo(() => {
    const ataStatusMap = getATAStatusMap();
    
    return meetings.filter(meeting => {
      // Filtro por tipo de órgão
      if (filters.organType !== 'all' && meeting.organ_type !== filters.organType) {
        return false;
      }
      
      // Filtro por órgão específico
      if (filters.organId !== 'all' && meeting.council_id !== filters.organId) {
        return false;
      }
      
      // Filtro por status - incluindo filtros de aprovação de ATA
      if (filters.status !== 'all') {
        const meetingAtaStatus = ataStatusMap[meeting.id];
        
        if (filters.status === 'Aguardando Aprovação') {
          return meetingAtaStatus === 'EM_APROVACAO';
        }
        if (filters.status === 'Aguardando Assinatura') {
          return meetingAtaStatus === 'APROVADO';
        }
        if (filters.status === 'ATA Finalizada') {
          return meetingAtaStatus === 'ASSINADO';
        }
        
        // Filtro de status normal
        if (meeting.status !== filters.status) {
          return false;
        }
      }
      
      // Filtro por tipo de reunião
      if (filters.meetingType !== 'all' && meeting.type !== filters.meetingType) {
        return false;
      }
      
      return true;
    });
  }, [meetings, filters]);

  return { filters, setFilters, filteredMeetings };
};
