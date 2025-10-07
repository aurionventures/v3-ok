import { useState, useEffect } from "react";
import { AgendaAnual, MeetingSchedule } from "@/types/annualSchedule";

const STORAGE_KEY = "annual_council_schedule";

// Default settings for annual schedule
const defaultSettings = {
  ordinaryMeetingsPerYear: 4,
  defaultDuration: 120, // 2 hours
  reminderDays: 30,
};

// Generate default annual schedule for 2025
const generateDefaultSchedule = (year: number): AgendaAnual => {
  const meetings: MeetingSchedule[] = [
    {
      id: "1",
      council: "Conselho de Administração",
      date: "2025-03-15",
      time: "14:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Presencial",
      agenda: [],
      nextMeetingTopics: [],
    },
    {
      id: "2",
      council: "Conselho de Administração",
      date: "2025-06-15",
      time: "14:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Presencial",
      agenda: [],
      nextMeetingTopics: [],
    },
    {
      id: "3",
      council: "Conselho de Administração",
      date: "2025-09-15",
      time: "14:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Presencial",
      agenda: [],
      nextMeetingTopics: [],
    },
    {
      id: "4",
      council: "Conselho de Administração",
      date: "2025-12-15",
      time: "14:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Presencial",
      agenda: [],
      nextMeetingTopics: [],
    },
    {
      id: "5",
      council: "Conselho Consultivo",
      date: "2025-04-10",
      time: "10:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Online",
      agenda: [],
      nextMeetingTopics: [],
    },
    {
      id: "6",
      council: "Conselho Consultivo",
      date: "2025-08-10",
      time: "10:00",
      type: "Ordinária",
      status: "Agendada",
      modalidade: "Online",
      agenda: [],
      nextMeetingTopics: [],
    },
  ];

  return {
    year,
    meetings,
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