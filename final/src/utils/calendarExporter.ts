import { MeetingSchedule } from '@/types/annualSchedule';
import { format } from 'date-fns';

export const downloadICS = (meetings: any[], year: number) => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Secretariado de Governança//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Calendário de Reuniões ${year}`,
    'X-WR-TIMEZONE:America/Sao_Paulo',
  ];

  meetings.forEach((meeting, index) => {
    const startDate = new Date(`${meeting.date}T${meeting.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatICalDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss");
    };

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:meeting-${index}-${Date.now()}@governance`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:${meeting.type} - ${meeting.council}`,
      `DESCRIPTION:Reunião ${meeting.type} do ${meeting.council}`,
      `LOCATION:${meeting.location || meeting.modalidade}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `calendario_reunioes_${year}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToICalendar = (meetings: MeetingSchedule[], organName: string) => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Secretariado de Governança//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${organName} - Calendário de Reuniões`,
    'X-WR-TIMEZONE:America/Sao_Paulo',
  ];

  meetings.forEach(meeting => {
    const startDate = new Date(`${meeting.date}T${meeting.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 horas depois
    
    const formatICalDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss");
    };

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${meeting.id}@governance-system`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:${meeting.type} - ${meeting.council}`,
      `DESCRIPTION:Reunião ${meeting.type} do ${meeting.council}`,
      `LOCATION:${meeting.location || meeting.modalidade}`,
      `STATUS:${meeting.status === 'Realizada' ? 'CONFIRMED' : 'TENTATIVE'}`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${organName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (meetings: MeetingSchedule[], organName: string, year: number) => {
  // Para implementação futura com @react-pdf/renderer
  console.log('Exportando para PDF:', { meetings, organName, year });
  // Por enquanto, vamos criar um preview simples
  alert('Funcionalidade de exportação PDF em desenvolvimento');
};
