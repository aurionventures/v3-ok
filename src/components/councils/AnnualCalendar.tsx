import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MeetingSchedule } from "@/types/annualSchedule";
import { MeetingAgendaPopover } from "./MeetingAgendaPopover";
import { differenceInDays } from "date-fns";

interface AnnualCalendarProps {
  meetings: MeetingSchedule[];
  onMeetingClick: (meeting: MeetingSchedule) => void;
  onUpdateMeeting: (meetingId: string, updates: Partial<MeetingSchedule>) => void;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const getStatusColor = (status: MeetingSchedule['status']) => {
  switch (status) {
    case "Agendada":
      return "bg-blue-100 text-blue-800";
    case "Pauta Definida":
      return "bg-yellow-100 text-yellow-800";
    case "Docs Enviados":
      return "bg-orange-100 text-orange-800";
    case "Realizada":
      return "bg-purple-100 text-purple-800";
    case "ATA Gerada":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const AnnualCalendar: React.FC<AnnualCalendarProps> = ({ meetings, onMeetingClick, onUpdateMeeting }) => {
  console.log("📅 AnnualCalendar rendered with meetings:", meetings?.length || 0);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingSchedule | null>(null);

  // Safety check for meetings prop
  const safeMeetings = meetings || [];
  console.log("📋 Safe meetings count:", safeMeetings.length);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return safeMeetings.filter(meeting => meeting.date === dateStr);
  };

  const getMeetingsForMonth = (month: number, year: number) => {
    return safeMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.getMonth() === month && meetingDate.getFullYear() === year;
    });
  };

  const getDaysUntilMeeting = (meeting: MeetingSchedule) => {
    const meetingDate = new Date(meeting.date);
    return differenceInDays(meetingDate, new Date());
  };

  const needsAgenda = (meeting: MeetingSchedule) => {
    return meeting.status === "Agendada" && (!meeting.agenda || meeting.agenda.length === 0);
  };

  const isDeadlineNear = (meeting: MeetingSchedule) => {
    const days = getDaysUntilMeeting(meeting);
    return days >= 3 && days < 15 && needsAgenda(meeting);
  };

  const renderCalendarMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const meetingsForDay = getMeetingsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} className={`p-2 min-h-[100px] border border-gray-100 ${isToday ? 'bg-blue-50' : ''}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {meetingsForDay.map(meeting => (
              <MeetingAgendaPopover
                key={meeting.id}
                meeting={meeting}
                onUpdate={onUpdateMeeting}
                onOpenFullDetails={() => onMeetingClick(meeting)}
              >
                <div
                  className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity relative"
                  style={{ backgroundColor: getStatusColor(meeting.status).includes('blue') ? '#dbeafe' : 
                           getStatusColor(meeting.status).includes('yellow') ? '#fef3c7' :
                           getStatusColor(meeting.status).includes('orange') ? '#fed7aa' :
                           getStatusColor(meeting.status).includes('purple') ? '#e9d5ff' :
                           getStatusColor(meeting.status).includes('green') ? '#dcfce7' : '#f3f4f6' }}
                >
                  <div className="font-medium truncate">{meeting.council}</div>
                  <div className="text-gray-600">{meeting.time}</div>
                  {needsAgenda(meeting) && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                        {isDeadlineNear(meeting) ? "⚠️" : "📋"}
                      </Badge>
                    </div>
                  )}
                </div>
              </MeetingAgendaPopover>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200">
        {/* Day headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 bg-gray-50 text-center font-medium text-sm border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monthNames.map((monthName, monthIndex) => {
          const monthMeetings = getMeetingsForMonth(monthIndex, year);
          
          return (
            <Card key={monthIndex} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setCurrentDate(new Date(year, monthIndex, 1));
                    setViewMode('month');
                  }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{monthName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthMeetings.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma reunião agendada</p>
                  ) : (
                    monthMeetings.map(meeting => (
                      <div key={meeting.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{meeting.council}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(meeting.date).getDate()}/{monthIndex + 1} - {meeting.time}
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(meeting.status)}>
                          {meeting.type}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {viewMode === 'month' 
              ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Agenda ${currentDate.getFullYear()}`
            }
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
            >
              {viewMode === 'month' ? 'Visão Anual' : 'Visão Mensal'}
            </Button>
          </div>
        </div>
        
        {viewMode === 'month' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' ? renderCalendarMonth() : renderYearView()}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>Agendada</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span>Pauta Definida</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-orange-100 rounded"></div>
          <span>Docs Enviados</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-purple-100 rounded"></div>
          <span>Realizada</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>ATA Gerada</span>
        </div>
      </div>
    </div>
  );
};