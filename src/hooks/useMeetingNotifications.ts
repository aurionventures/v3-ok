import { supabase } from '@/integrations/supabase/client';
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
    try {
      const notifications = participants.map(p => ({
        user_id: p.user_id || null,
        external_email: p.external_email || null,
        type: 'CONVOCACAO_REUNIAO',
        title: 'Nova Reunião Agendada',
        message: `Você foi convidado para a reunião "${meetingTitle}" em ${meetingDate} às ${meetingTime}.`,
        scheduled_at: new Date().toISOString(),
        channel: 'EMAIL',
        context: { 
          meeting_id: meetingId,
          role: p.role,
          can_upload: p.can_upload,
          can_view_materials: p.can_view_materials,
          can_comment: p.can_comment,
          guest_token: p.guest_token
        }
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Erro ao criar notificações:', error);
        throw error;
      }

      toast.success(`Convites enviados para ${participants.length} participantes`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      toast.error('Erro ao enviar convites');
      return false;
    }
  };

  return { sendMeetingInvites };
};
