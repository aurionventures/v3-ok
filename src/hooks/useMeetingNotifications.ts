import { MeetingParticipant } from '@/types/annualSchedule';
import { toast } from 'sonner';

export const useMeetingNotifications = () => {
  const sendMeetingInvites = async (
    meetingId: string, 
    meetingTitle: string,
    meetingDate: string,
    meetingTime: string,
    participants: MeetingParticipant[]
  ) => {
    console.log('📧 [DEMO] Enviando convites mockados:', {
      meetingId,
      meetingTitle,
      participants: participants.length
    });
    
    // Simular salvamento no localStorage (modo demo)
    const notifications = participants.map(p => ({
      id: `notif-${Date.now()}-${Math.random()}`,
      user_id: p.user_id || null,
      external_email: p.external_email || null,
      type: 'CONVOCACAO_REUNIAO',
      title: 'Nova Reunião Agendada',
      message: `Você foi convidado para a reunião "${meetingTitle}" em ${meetingDate} às ${meetingTime}.`,
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'ENVIADA',
      channel: 'EMAIL',
      read_at: null,
      context: { 
        meeting_id: meetingId,
        role: p.role,
        guest_token: p.guest_token
      }
    }));
    
    // Salvar no localStorage
    const existing = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    localStorage.setItem('mock_notifications', JSON.stringify([...existing, ...notifications]));
    
    toast.success(`📧 [DEMO] Convites enviados para ${participants.length} participantes`);
    return true;
  };

  const sendMeetingUpdateNotifications = async (
    meetingId: string,
    updatedFields: string[]
  ) => {
    console.log('📧 [DEMO] Notificando sobre alterações:', { meetingId, updatedFields });
    
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'EDICAO_REUNIAO',
      title: 'Reunião Atualizada',
      message: `A reunião foi atualizada. Campos alterados: ${updatedFields.join(', ')}`,
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'ENVIADA',
      channel: 'EMAIL',
      context: { meeting_id: meetingId, changed_fields: updatedFields }
    };
    
    const existing = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    localStorage.setItem('mock_notifications', JSON.stringify([...existing, notification]));
    
    toast.success(`📧 [DEMO] Notificações de atualização enviadas`);
    return true;
  };

  const sendDocumentUploadNotification = async (
    meetingId: string,
    documentName: string,
    uploaderName: string
  ) => {
    console.log('📧 [DEMO] Notificando sobre novo documento:', { documentName, uploaderName });
    
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'UPLOAD_DOCUMENTO',
      title: 'Novo Documento',
      message: `${uploaderName} enviou o documento "${documentName}"`,
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'ENVIADA',
      channel: 'EMAIL',
      context: { meeting_id: meetingId, document_name: documentName }
    };
    
    const existing = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    localStorage.setItem('mock_notifications', JSON.stringify([...existing, notification]));
    
    toast.success(`📧 [DEMO] Participantes notificados sobre novo documento`);
    return true;
  };

  const sendATAGeneratedNotification = async (
    meetingId: string,
    meetingTitle: string
  ) => {
    console.log('📧 [DEMO] Notificando sobre ATA gerada:', { meetingTitle });
    
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'ATA_GERADA',
      title: 'ATA Disponível',
      message: `A ATA da reunião "${meetingTitle}" está disponível para consulta`,
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'ENVIADA',
      channel: 'EMAIL',
      context: { meeting_id: meetingId }
    };
    
    const existing = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    localStorage.setItem('mock_notifications', JSON.stringify([...existing, notification]));
    
    toast.success(`📧 [DEMO] Notificações de ATA enviadas`);
    return true;
  };

  return { 
    sendMeetingInvites, 
    sendMeetingUpdateNotifications,
    sendDocumentUploadNotification,
    sendATAGeneratedNotification
  };
};
