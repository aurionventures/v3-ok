import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ATAApproval, ATAApprovalWithParticipant, ApprovalStatus, ATAStatus } from '@/types/ataApproval';

// Using localStorage for demo until migration is applied
const STORAGE_KEY = 'ata_approvals';
const MEETING_ATA_STATUS_KEY = 'meeting_ata_status';

const getStoredApprovals = (): ATAApprovalWithParticipant[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredApprovals = (approvals: ATAApprovalWithParticipant[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(approvals));
};

const getATAStatusMap = (): Record<string, ATAStatus> => {
  const stored = localStorage.getItem(MEETING_ATA_STATUS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const setATAStatusMap = (statusMap: Record<string, ATAStatus>) => {
  localStorage.setItem(MEETING_ATA_STATUS_KEY, JSON.stringify(statusMap));
};

export const useATAApprovals = (meetingId?: string) => {
  const [approvals, setApprovals] = useState<ATAApprovalWithParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [ataStatus, setAtaStatus] = useState<ATAStatus>(null);
  const { toast } = useToast();

  const fetchApprovals = useCallback(async () => {
    if (!meetingId) return;
    
    setLoading(true);
    const allApprovals = getStoredApprovals();
    const meetingApprovals = allApprovals.filter(a => a.meeting_id === meetingId);
    setApprovals(meetingApprovals);
    
    const statusMap = getATAStatusMap();
    setAtaStatus(statusMap[meetingId] || null);
    
    setLoading(false);
  }, [meetingId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Create approval records for all meeting participants
  const initializeApprovals = async (meetingId: string, participants: Array<{
    id: string;
    external_name: string | null;
    external_email: string | null;
    role: string;
  }>) => {
    try {
      if (!participants || participants.length === 0) {
        toast({
          title: "Sem participantes",
          description: "A reunião não possui participantes cadastrados.",
          variant: "destructive"
        });
        return false;
      }

      const allApprovals = getStoredApprovals();
      
      // Create approval records for each participant
      const newApprovals: ATAApprovalWithParticipant[] = participants.map(p => ({
        id: crypto.randomUUID(),
        meeting_id: meetingId,
        participant_id: p.id,
        approval_status: 'PENDENTE' as ApprovalStatus,
        approval_comment: null,
        approved_at: null,
        signature_status: 'NAO_ASSINADO',
        signature_hash: null,
        signature_ip: null,
        signature_user_agent: null,
        signed_at: null,
        notification_sent_at: new Date().toISOString(),
        magic_link_token: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participant: {
          id: p.id,
          external_name: p.external_name,
          external_email: p.external_email,
          role: p.role,
        }
      }));

      const updatedApprovals = [...allApprovals, ...newApprovals];
      setStoredApprovals(updatedApprovals);
      
      // Update meeting ATA status
      const statusMap = getATAStatusMap();
      statusMap[meetingId] = 'EM_APROVACAO';
      setATAStatusMap(statusMap);

      setApprovals(newApprovals);
      setAtaStatus('EM_APROVACAO');
      
      return true;
    } catch (error) {
      console.error('Error initializing approvals:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a ATA para aprovação.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Send for approval (create records + send notifications)
  const sendForApproval = async (meetingId: string, participants: Array<{
    id: string;
    external_name: string | null;
    external_email: string | null;
    role: string;
  }>) => {
    const success = await initializeApprovals(meetingId, participants);
    if (success) {
      // Store notifications in localStorage for demo
      const storedNotifications = localStorage.getItem('mock_notifications') || '[]';
      const notifications = JSON.parse(storedNotifications);
      
      const newApprovals = getStoredApprovals().filter(a => a.meeting_id === meetingId);
      
      newApprovals.forEach(approval => {
        notifications.push({
          id: crypto.randomUUID(),
          type: 'ATA_APPROVAL_REQUEST',
          title: 'Aprovação de ATA Solicitada',
          message: `Você foi solicitado a aprovar a ATA da reunião.`,
          participantName: approval.participant?.external_name,
          magicLink: `/ata-approval/${approval.magic_link_token}`,
          createdAt: new Date().toISOString(),
        });
      });
      
      localStorage.setItem('mock_notifications', JSON.stringify(notifications));
      
      toast({
        title: "ATA enviada para aprovação",
        description: `${participants.length} membros foram notificados.`,
      });
    }
    return success;
  };

  // Update approval status
  const updateApproval = async (
    approvalId: string, 
    status: ApprovalStatus, 
    comment?: string
  ) => {
    try {
      const allApprovals = getStoredApprovals();
      const index = allApprovals.findIndex(a => a.id === approvalId);
      
      if (index === -1) return false;
      
      allApprovals[index] = {
        ...allApprovals[index],
        approval_status: status,
        approval_comment: comment || null,
        approved_at: status === 'APROVADO' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      setStoredApprovals(allApprovals);
      
      if (meetingId) {
        const meetingApprovals = allApprovals.filter(a => a.meeting_id === meetingId);
        setApprovals(meetingApprovals);
        await checkAllApproved(meetingId);
      }
      
      toast({
        title: status === 'APROVADO' ? "ATA aprovada" : 
               status === 'REJEITADO' ? "ATA rejeitada" : "Revisão solicitada",
        description: status === 'APROVADO' 
          ? "Sua aprovação foi registrada." 
          : "Seu comentário foi enviado ao secretariado.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a aprovação.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if all participants approved
  const checkAllApproved = async (checkMeetingId?: string) => {
    const targetMeetingId = checkMeetingId || meetingId;
    if (!targetMeetingId) return false;
    
    const allApprovals = getStoredApprovals();
    const meetingApprovals = allApprovals.filter(a => a.meeting_id === targetMeetingId);
    
    const allApproved = meetingApprovals.every(a => a.approval_status === 'APROVADO');
    
    if (allApproved && meetingApprovals.length > 0) {
      const statusMap = getATAStatusMap();
      statusMap[targetMeetingId] = 'APROVADO';
      setATAStatusMap(statusMap);
      if (targetMeetingId === meetingId) {
        setAtaStatus('APROVADO');
      }
    }
    
    return allApproved;
  };

  // Sign the ATA
  const signATA = async (approvalId: string) => {
    try {
      const ip = 'DEMO_IP';
      const userAgent = navigator.userAgent;
      const signedAt = new Date().toISOString();
      
      // Generate signature hash
      const hashData = `${approvalId}-${signedAt}-${userAgent}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(hashData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signatureHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const allApprovals = getStoredApprovals();
      const index = allApprovals.findIndex(a => a.id === approvalId);
      
      if (index === -1) return false;
      
      const targetMeetingId = allApprovals[index].meeting_id;
      
      allApprovals[index] = {
        ...allApprovals[index],
        signature_status: 'ASSINADO',
        signature_hash: signatureHash,
        signature_ip: ip,
        signature_user_agent: userAgent,
        signed_at: signedAt,
        updated_at: new Date().toISOString(),
      };
      
      setStoredApprovals(allApprovals);
      
      if (meetingId) {
        const meetingApprovals = allApprovals.filter(a => a.meeting_id === meetingId);
        setApprovals(meetingApprovals);
      }
      
      await checkAllSigned(targetMeetingId);
      
      toast({
        title: "ATA assinada",
        description: "Sua assinatura eletrônica foi registrada com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error signing ATA:', error);
      toast({
        title: "Erro",
        description: "Não foi possível assinar a ATA.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if all participants signed
  const checkAllSigned = async (checkMeetingId?: string) => {
    const targetMeetingId = checkMeetingId || meetingId;
    if (!targetMeetingId) return false;
    
    const allApprovals = getStoredApprovals();
    const meetingApprovals = allApprovals.filter(a => a.meeting_id === targetMeetingId);
    
    const allSigned = meetingApprovals.every(a => a.signature_status === 'ASSINADO');
    
    if (allSigned && meetingApprovals.length > 0) {
      const statusMap = getATAStatusMap();
      statusMap[targetMeetingId] = 'ASSINADO';
      setATAStatusMap(statusMap);
      if (targetMeetingId === meetingId) {
        setAtaStatus('ASSINADO');
      }
    }
    
    return allSigned;
  };

  // Get approval by token (for guest access)
  const getApprovalByToken = async (token: string) => {
    const allApprovals = getStoredApprovals();
    return allApprovals.find(a => a.magic_link_token === token) || null;
  };

  // Get meeting data for a token
  const getMeetingByToken = async (token: string) => {
    const approval = await getApprovalByToken(token);
    if (!approval) return null;

    // Get real meeting data from localStorage
    const stored = localStorage.getItem('annual_council_schedule');
    if (!stored) {
      return { 
        meeting: {
          id: approval.meeting_id,
          title: 'Reunião de Demonstração',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          type: 'Ordinária',
          modalidade: 'Presencial',
          minutes_summary: 'Resumo executivo da reunião.',
          minutes_full: 'Conteúdo completo da ATA.',
          councils: { name: 'Conselho de Administração', organ_type: 'conselho' }
        }, 
        approval 
      };
    }
    
    const schedule = JSON.parse(stored);
    const meeting = schedule.meetings?.find((m: any) => m.id === approval.meeting_id);
    
    if (!meeting) {
      return { 
        meeting: {
          id: approval.meeting_id,
          title: 'Reunião de Demonstração',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          type: 'Ordinária',
          modalidade: 'Presencial',
          minutes_summary: 'Resumo executivo da reunião.',
          minutes_full: 'Conteúdo completo da ATA.',
          councils: { name: 'Conselho de Administração', organ_type: 'conselho' }
        }, 
        approval 
      };
    }
    
    return { 
      meeting: {
        id: meeting.id,
        title: meeting.title || `Reunião ${meeting.council}`,
        date: meeting.date,
        time: meeting.time,
        type: meeting.type,
        modalidade: meeting.modalidade,
        minutes_summary: meeting.ata?.summary || meeting.minutes?.summary || 'Resumo não disponível.',
        minutes_full: meeting.minutes?.full || meeting.ata?.summary || 'Conteúdo completo não disponível.',
        councils: { name: meeting.council, organ_type: meeting.organ_type }
      }, 
      approval 
    };
  };

  // Get pending ATA signatures for secretariat
  const getPendingATASignatures = async () => {
    const allApprovals = getStoredApprovals();
    return allApprovals.filter(a => 
      a.approval_status === 'PENDENTE' || 
      (a.approval_status === 'APROVADO' && a.signature_status === 'NAO_ASSINADO')
    );
  };

  // Calculate progress
  const getApprovalProgress = () => {
    if (approvals.length === 0) return { approved: 0, total: 0, percentage: 0 };
    
    const approved = approvals.filter(a => a.approval_status === 'APROVADO').length;
    return {
      approved,
      total: approvals.length,
      percentage: Math.round((approved / approvals.length) * 100)
    };
  };

  const getSignatureProgress = () => {
    if (approvals.length === 0) return { signed: 0, total: 0, percentage: 0 };
    
    const signed = approvals.filter(a => a.signature_status === 'ASSINADO').length;
    return {
      signed,
      total: approvals.length,
      percentage: Math.round((signed / approvals.length) * 100)
    };
  };

  return {
    approvals,
    loading,
    ataStatus,
    fetchApprovals,
    initializeApprovals,
    sendForApproval,
    updateApproval,
    signATA,
    getApprovalByToken,
    getMeetingByToken,
    getPendingATASignatures,
    getApprovalProgress,
    getSignatureProgress,
    checkAllApproved,
    checkAllSigned,
  };
};
