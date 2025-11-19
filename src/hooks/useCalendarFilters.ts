import { useState, useMemo } from 'react';
import { MeetingSchedule } from '@/types/annualSchedule';

interface CalendarFilters {
  organType: string;
  organId: string;
  status: string;
  meetingType: string;
}

export const useCalendarFilters = (meetings: MeetingSchedule[]) => {
  const [filters, setFilters] = useState<CalendarFilters>({
    organType: 'all',
    organId: 'all',
    status: 'all',
    meetingType: 'all',
  });

  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
      // Filtro por tipo de órgão
      if (filters.organType !== 'all' && meeting.organ_type !== filters.organType) {
        return false;
      }
      
      // Filtro por órgão específico
      if (filters.organId !== 'all' && meeting.council_id !== filters.organId) {
        return false;
      }
      
      // Filtro por status
      if (filters.status !== 'all' && meeting.status !== filters.status) {
        return false;
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
