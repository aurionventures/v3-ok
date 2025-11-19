import { useState, useEffect } from "react";
import { AgendaAnual, MeetingSchedule } from "@/types/annualSchedule";

const STORAGE_KEY = "annual_council_schedule";

// Default settings for annual schedule
const defaultSettings = {
  ordinaryMeetingsPerYear: 4,
  defaultDuration: 120, // 2 hours
  reminderDays: 30,
};

// Helper functions for date calculations
const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, nth: number): Date => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = offset + (nth - 1) * 7 + 1;
  return new Date(year, month, day);
};

const getLastWeekdayOfMonth = (year: number, month: number, weekday: number): Date => {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const offset = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - offset);
};

// Generate default annual schedule for 2025
const generateDefaultSchedule = (year: number): AgendaAnual => {
  const meetings: MeetingSchedule[] = [];

  // Generate 12 COUNCIL meetings (2nd Tuesday of each month at 14:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 2, 2); // Tuesday=2, 2nd occurrence
    meetings.push({
      id: `conselho-${month + 1}`,
      council: "Conselho de Administração",
      council_id: "mock-council-admin-001",
      organ_type: "conselho",
      date: date.toISOString().split('T')[0],
      time: "14:00",
      type: "Ordinária",
      status: month < 3 ? "Realizada" : month < 5 ? "Pauta Definida" : "Agendada",
      modalidade: "Presencial",
      location: "Sala Executiva - Matriz",
      agenda: [],
      nextMeetingTopics: [],
      participants: [],
      confirmed_participants: 0,
      notifications_sent: false,
    });
  }

  // Generate 12 COMMITTEE meetings (3rd Thursday of each month at 10:00)
  for (let month = 0; month < 12; month++) {
    const date = getNthWeekdayOfMonth(year, month, 4, 3); // Thursday=4, 3rd occurrence
    meetings.push({
      id: `comite-${month + 1}`,
      council: "Comitê de Auditoria",
      council_id: "mock-committee-audit-004",
      organ_type: "comite",
      date: date.toISOString().split('T')[0],
      time: "10:00",
      type: "Ordinária",
      status: month < 2 ? "ATA Gerada" : month < 4 ? "Realizada" : "Agendada",
      modalidade: "Online",
      location: "Microsoft Teams",
      agenda: [],
      nextMeetingTopics: [],
      participants: [],
      confirmed_participants: 0,
      notifications_sent: false,
    });
  }

  // Generate 12 COMMISSION meetings (last Friday of each month at 15:00)
  for (let month = 0; month < 12; month++) {
    const date = getLastWeekdayOfMonth(year, month, 5); // Friday=5
    meetings.push({
      id: `comissao-${month + 1}`,
      council: "Comissão de Ética",
      council_id: "mock-commission-ethics-007",
      organ_type: "comissao",
      date: date.toISOString().split('T')[0],
      time: "15:00",
      type: month % 3 === 0 ? "Extraordinária" : "Ordinária",
      status: month < 3 ? "Docs Enviados" : "Agendada",
      modalidade: "Híbrida",
      location: "Sala 201 / Zoom",
      agenda: [],
      nextMeetingTopics: [],
      participants: [],
      confirmed_participants: 0,
      notifications_sent: false,
    });
  }

  return {
    year,
    meetings: meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    settings: defaultSettings,
  };
};

export const useAnnualSchedule = () => {
  const [schedule, setSchedule] = useState<AgendaAnual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    console.log("🔄 Loading annual schedule...");
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("📁 Stored data:", stored ? "Found" : "Not found");
      
      if (stored) {
        const parsedSchedule = JSON.parse(stored);
        console.log("✅ Loaded schedule:", parsedSchedule);
        setSchedule(parsedSchedule);
      } else {
        // Create default schedule for current year
        const currentYear = 2025; // Fixed for the implementation
        const defaultSchedule = generateDefaultSchedule(currentYear);
        console.log("🆕 Created default schedule:", defaultSchedule);
        setSchedule(defaultSchedule);
        saveSchedule(defaultSchedule);
      }
    } catch (error) {
      console.error("❌ Error loading annual schedule:", error);
      // Fallback to default schedule
      const defaultSchedule = generateDefaultSchedule(2025);
      console.log("🔄 Fallback to default schedule:", defaultSchedule);
      setSchedule(defaultSchedule);
    } finally {
      setLoading(false);
      console.log("✅ Annual schedule loading completed");
    }
  };

  const saveSchedule = (newSchedule: AgendaAnual) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
      setSchedule(newSchedule);
    } catch (error) {
      console.error("Error saving annual schedule:", error);
    }
  };

  const updateMeeting = (meetingId: string, updates: Partial<MeetingSchedule>) => {
    if (!schedule) return;

    const updatedMeetings = schedule.meetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, ...updates } : meeting
    );

    const updatedSchedule = {
      ...schedule,
      meetings: updatedMeetings,
    };

    saveSchedule(updatedSchedule);
  };

  const addMeeting = (meeting: Omit<MeetingSchedule, 'id'>) => {
    if (!schedule) return;

    const newMeeting: MeetingSchedule = {
      ...meeting,
      id: Date.now().toString(),
    };

    const updatedSchedule = {
      ...schedule,
      meetings: [...schedule.meetings, newMeeting],
    };

    saveSchedule(updatedSchedule);
  };

  const deleteMeeting = (meetingId: string) => {
    if (!schedule) return;

    const updatedMeetings = schedule.meetings.filter(meeting => meeting.id !== meetingId);
    const updatedSchedule = {
      ...schedule,
      meetings: updatedMeetings,
    };

    saveSchedule(updatedSchedule);
  };

  const getNextMeeting = () => {
    if (!schedule) return null;

    const now = new Date();
    const upcomingMeetings = schedule.meetings
      .filter(meeting => new Date(meeting.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;
  };

  const getMeetingsByStatus = (status: MeetingSchedule['status']) => {
    if (!schedule) return [];
    return schedule.meetings.filter(meeting => meeting.status === status);
  };

  const getAgendaProgress = () => {
    if (!schedule) return { defined: 0, total: 0, percentage: 0 };

    const total = schedule.meetings.length;
    const defined = schedule.meetings.filter(meeting => 
      meeting.status !== "Agendada" || (meeting.agenda && meeting.agenda.length > 0)
    ).length;

    return {
      defined,
      total,
      percentage: total > 0 ? Math.round((defined / total) * 100) : 0,
    };
  };

  const getATAProgress = () => {
    if (!schedule) return { generated: 0, total: 0, percentage: 0 };

    const total = schedule.meetings.filter(meeting => meeting.status === "Realizada" || meeting.status === "ATA Gerada").length;
    const generated = schedule.meetings.filter(meeting => meeting.status === "ATA Gerada").length;

    return {
      generated,
      total,
      percentage: total > 0 ? Math.round((generated / total) * 100) : 0,
    };
  };

  const getPendingTasks = () => {
    if (!schedule) return [];

    const allTasks = schedule.meetings.flatMap(meeting => meeting.tasks || []);
    return allTasks.filter(task => task.status !== "Concluída");
  };

  const addMultipleMeetings = (meetings: Omit<MeetingSchedule, 'id' | 'status' | 'agenda' | 'nextMeetingTopics'>[]) => {
    if (!schedule) return;
    
    const newMeetings: MeetingSchedule[] = meetings.map((meeting, index) => ({
      id: `${Date.now()}-${index}`,
      ...meeting,
      status: "Agendada",
      agenda: [],
      nextMeetingTopics: []
    }));
    
    const updatedSchedule = {
      ...schedule,
      meetings: [...schedule.meetings, ...newMeetings].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    };
    
    saveSchedule(updatedSchedule);
  };

  return {
    schedule,
    loading,
    updateMeeting,
    addMeeting,
    addMultipleMeetings,
    deleteMeeting,
    getNextMeeting,
    getMeetingsByStatus,
    getAgendaProgress,
    getATAProgress,
    getPendingTasks,
    saveSchedule,
  };
};