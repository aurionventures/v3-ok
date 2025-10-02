import { useState, useEffect } from 'react';

export interface IntervieweeStatus {
  id: string;
  name: string;
  role: string;
  priority: 'high' | 'medium' | 'low';
  status: 'interviewed' | 'scheduled' | 'pending';
  lastInterviewDate?: Date;
  scheduledDate?: Date;
  notes?: string;
}

const initialInterviewees: IntervieweeStatus[] = [
  { id: '1', name: 'Fundador/CEO', role: 'Liderança Executiva', priority: 'high', status: 'pending' },
  { id: '2', name: 'Membro da Família', role: 'Família Empresária', priority: 'high', status: 'pending' },
  { id: '3', name: 'Conselheiro', role: 'Conselho de Administração', priority: 'high', status: 'pending' },
  { id: '4', name: 'Diretor Financeiro', role: 'Alta Gestão', priority: 'medium', status: 'pending' },
  { id: '5', name: 'Sócio/Acionista', role: 'Sociedade', priority: 'medium', status: 'pending' },
  { id: '6', name: 'Herdeiro', role: 'Sucessão', priority: 'high', status: 'pending' },
  { id: '7', name: 'Diretor de RH', role: 'Gestão', priority: 'medium', status: 'pending' },
  { id: '8', name: 'Conselheiro Familiar', role: 'Família Empresária', priority: 'medium', status: 'pending' }
];

export const useIntervieweeStatus = () => {
  const [interviewees, setInterviewees] = useState<IntervieweeStatus[]>(initialInterviewees);

  useEffect(() => {
    const saved = localStorage.getItem('interviewee_status');
    if (saved) {
      // Validação segura dos dados do localStorage
      const rawData = JSON.parse(saved);
      if (!Array.isArray(rawData)) {
        console.warn('Invalid data format in localStorage');
        return;
      }
      
      const parsedData = rawData.map((item) => {
        // Validação de estrutura básica
        if (!item || typeof item !== 'object') {
          console.warn('Invalid item structure:', item);
          return null;
        }
        
        return {
          ...item,
          lastInterviewDate: item.lastInterviewDate ? new Date(item.lastInterviewDate) : undefined,
          scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : undefined
        };
      }).filter(Boolean); // Remove itens inválidos
      setInterviewees(parsedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviewee_status', JSON.stringify(interviewees));
  }, [interviewees]);

  const updateIntervieweeStatus = (id: string, updates: Partial<IntervieweeStatus>) => {
    setInterviewees(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const markAsInterviewed = (id: string) => {
    updateIntervieweeStatus(id, { 
      status: 'interviewed', 
      lastInterviewDate: new Date() 
    });
  };

  const scheduleInterview = (id: string, date: Date) => {
    updateIntervieweeStatus(id, { 
      status: 'scheduled', 
      scheduledDate: date 
    });
  };

  const getStatusCounts = () => {
    return {
      interviewed: interviewees.filter(i => i.status === 'interviewed').length,
      scheduled: interviewees.filter(i => i.status === 'scheduled').length,
      pending: interviewees.filter(i => i.status === 'pending').length,
      total: interviewees.length
    };
  };

  const getPriorityInterviewees = () => {
    return interviewees
      .filter(i => i.status === 'pending' && i.priority === 'high')
      .slice(0, 3);
  };

  const getProgressPercentage = () => {
    const interviewed = interviewees.filter(i => i.status === 'interviewed').length;
    return Math.round((interviewed / interviewees.length) * 100);
  };

  return {
    interviewees,
    updateIntervieweeStatus,
    markAsInterviewed,
    scheduleInterview,
    getStatusCounts,
    getPriorityInterviewees,
    getProgressPercentage
  };
};