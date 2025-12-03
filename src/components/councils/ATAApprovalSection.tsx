import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileSignature, 
  Send, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  PenTool,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { useATAApprovals } from '@/hooks/useATAApprovals';
import { ATAStatus } from '@/types/ataApproval';
import { useToast } from '@/hooks/use-toast';
import { ElectronicSignatureModal } from './ElectronicSignatureModal';
import { supabase } from '@/integrations/supabase/client';

interface ATAApprovalSectionProps {
  meetingId: string;
  hasATA: boolean;
}

export const ATAApprovalSection = ({ meetingId, hasATA }: ATAApprovalSectionProps) => {
  const { toast } = useToast();
  const {
    approvals,
    loading,
    ataStatus,
    sendForApproval,
    getApprovalProgress,
    getSignatureProgress,
    fetchApprovals,
  } = useATAApprovals(meetingId);

  const [sending, setSending] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Array<{
    id: string;
    external_name: string | null;
    external_email: string | null;
    role: string;
  }>>([]);

  const approvalProgress = getApprovalProgress();
  const signatureProgress = getSignatureProgress();

  // Fetch meeting participants - from localStorage (demo) or Supabase
  useEffect(() => {
    const fetchParticipants = async () => {
      console.log(`🔍 ATAApprovalSection: Fetching participants for meeting ${meetingId}`);
      
      // First try to get from localStorage schedule (demo data)
      const stored = localStorage.getItem('annual_council_schedule');
      if (stored) {
        try {
          const schedule = JSON.parse(stored);
          const meeting = schedule.meetings?.find((m: any) => m.id === meetingId);
          if (meeting?.participants && meeting.participants.length > 0) {
            const formattedParticipants = meeting.participants.map((p: any) => ({
              id: p.id,
              external_name: p.name,
              external_email: p.email,
              role: p.role
            }));
            console.log(`✅ Found ${formattedParticipants.length} participants from localStorage`);
            setParticipants(formattedParticipants);
            return;
          }
        } catch (e) {
          console.log("⚠️ Error parsing localStorage schedule");
        }
      }
      
      // Fallback to Supabase
      const { data } = await supabase
        .from('meeting_participants')
        .select('id, external_name, external_email, role')
        .eq('meeting_id', meetingId);
      
      if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} participants from Supabase`);
        setParticipants(data);
      } else {
        console.log("⚠️ No participants found");
      }
    };
    
    if (meetingId) {
      fetchParticipants();
    }
  }, [meetingId]);

  const handleSendForApproval = async () => {
    if (participants.length === 0) {
      toast({
        title: "Sem participantes",
        description: "Adicione participantes à reunião antes de enviar para aprovação.",
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    await sendForApproval(meetingId, participants);
    setSending(false);
  };

  const copyMagicLink = (token: string, name: string) => {
    const link = `${window.location.origin}/ata-approval/${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: `Link de aprovação para ${name} copiado para a área de transferência.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      case 'REVISAO_SOLICITADA':
        return <Badge className="bg-amber-100 text-amber-800"><AlertCircle className="h-3 w-3 mr-1" />Revisão</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
    }
  };

  const getSignatureBadge = (status: string) => {
    if (status === 'ASSINADO') {
      return <Badge className="bg-emerald-100 text-emerald-800"><PenTool className="h-3 w-3 mr-1" />Assinado</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Aguardando</Badge>;
  };

  const getATAStatusLabel = (status: ATAStatus) => {
    switch (status) {
      case 'EM_APROVACAO':
        return { label: 'Em Aprovação', color: 'bg-blue-100 text-blue-800' };
      case 'APROVADO':
        return { label: 'Aprovado - Aguardando Assinaturas', color: 'bg-amber-100 text-amber-800' };
      case 'ASSINADO':
        return { label: 'Finalizado - Todas Assinaturas Coletadas', color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Aguardando Envio', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (!hasATA) return null;

  const statusInfo = getATAStatusLabel(ataStatus);

  return (
    <>
      <Separator className="my-6" />
      
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-blue-600" />
              Aprovação e Assinatura da ATA
            </span>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* If no approvals exist yet, show send button */}
          {approvals.length === 0 && !ataStatus && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Envie a ATA para os {participants.length} membros aprovarem e assinarem eletronicamente.
              </p>
              <Button 
                onClick={handleSendForApproval} 
                disabled={sending || participants.length === 0}
                className="gap-2"
              >
                {sending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Enviar ATA para Aprovação dos Membros
              </Button>
            </div>
          )}

          {/* Approval progress */}
          {approvals.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Aprovações</span>
                    <span className="text-muted-foreground">
                      {approvalProgress.approved}/{approvalProgress.total}
                    </span>
                  </div>
                  <Progress value={approvalProgress.percentage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Assinaturas</span>
                    <span className="text-muted-foreground">
                      {signatureProgress.signed}/{signatureProgress.total}
                    </span>
                  </div>
                  <Progress value={signatureProgress.percentage} className="h-2 bg-emerald-100 [&>div]:bg-emerald-600" />
                </div>
              </div>

              <Separator />

              {/* Participants list */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Status por Membro</h4>
                <div className="space-y-2">
                  {approvals.map((approval) => (
                    <div 
                      key={approval.id} 
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {approval.participant?.external_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {approval.participant?.external_name || 'Participante'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {approval.participant?.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(approval.approval_status)}
                        {approval.approval_status === 'APROVADO' && getSignatureBadge(approval.signature_status)}
                        {approval.magic_link_token && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyMagicLink(
                              approval.magic_link_token!, 
                              approval.participant?.external_name || 'Participante'
                            )}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revision comments */}
              {approvals.some(a => a.approval_comment) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Comentários de Revisão
                    </h4>
                    {approvals
                      .filter(a => a.approval_comment)
                      .map((approval) => (
                        <div key={approval.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm font-medium">{approval.participant?.external_name}</p>
                          <p className="text-sm text-muted-foreground">{approval.approval_comment}</p>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* Resend button */}
              {ataStatus === 'EM_APROVACAO' && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reenviar Notificações
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedApprovalId && (
        <ElectronicSignatureModal
          isOpen={signatureModalOpen}
          onClose={() => {
            setSignatureModalOpen(false);
            setSelectedApprovalId(null);
          }}
          approvalId={selectedApprovalId}
          participantName={approvals.find(a => a.id === selectedApprovalId)?.participant?.external_name || ''}
        />
      )}
    </>
  );
};
