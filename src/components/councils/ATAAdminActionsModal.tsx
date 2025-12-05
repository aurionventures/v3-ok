import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, Edit, CheckCircle2, XCircle, Clock, AlertTriangle, 
  PenTool, FileText, CalendarDays, Building2, ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateAuditLog } from "@/hooks/useAuditLogs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA';
  signatureStatus: 'NAO_ASSINADO' | 'ASSINADO';
  magicLinkToken: string;
}

interface ATAWithApprovals {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  organName: string;
  organType: string;
  ataStatus: string;
  participants: Participant[];
}

interface ATAAdminActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ata: ATAWithApprovals | null;
  actionType: 'view' | 'edit';
  onActionComplete: () => void;
}

const ATAAdminActionsModal = ({ 
  isOpen, 
  onClose, 
  ata, 
  actionType,
  onActionComplete 
}: ATAAdminActionsModalProps) => {
  const { toast } = useToast();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [adminComment, setAdminComment] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(actionType === 'view' ? 'view' : 'actions');

  if (!ata) return null;

  // Get pending participants based on current status
  const pendingApprovalParticipants = ata.participants.filter(p => p.approvalStatus === 'PENDENTE');
  const pendingSignatureParticipants = ata.participants.filter(
    p => p.approvalStatus === 'APROVADO' && p.signatureStatus === 'NAO_ASSINADO'
  );

  const isApprovalPhase = ata.ataStatus === 'EM_APROVACAO' || pendingApprovalParticipants.length > 0;
  const pendingParticipants = isApprovalPhase ? pendingApprovalParticipants : pendingSignatureParticipants;

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedParticipants(pendingParticipants.map(p => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const getAdminName = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.name || parsed.email || 'Administrador';
    }
    return 'Administrador';
  };

  const performAdminAction = async (action: 'approve' | 'sign', participantIds: string[]) => {
    setProcessing(true);
    const adminName = getAdminName();
    const timestamp = new Date().toISOString();

    try {
      // Get current approvals from localStorage
      const storedApprovals = localStorage.getItem('ata_approvals');
      const approvals = storedApprovals ? JSON.parse(storedApprovals) : [];

      for (const participantId of participantIds) {
        const participant = ata.participants.find(p => p.id === participantId);
        if (!participant) continue;

        // Find and update the approval record
        const approvalIndex = approvals.findIndex(
          (a: any) => a.meeting_id === ata.meetingId && a.participant_id === participantId
        );

        if (approvalIndex !== -1) {
          if (action === 'approve') {
            approvals[approvalIndex].approval_status = 'APROVADO';
            approvals[approvalIndex].approval_comment = `Aprovado como ADM por ${adminName}: ${adminComment || 'Sem comentário'}`;
            approvals[approvalIndex].approved_at = timestamp;
            approvals[approvalIndex].updated_at = timestamp;
          } else {
            // Generate signature hash
            const hashData = `${participantId}-${timestamp}-ADM-${adminName}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(hashData);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signatureHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            approvals[approvalIndex].signature_status = 'ASSINADO';
            approvals[approvalIndex].signature_hash = signatureHash;
            approvals[approvalIndex].signature_ip = 'ADM_ACTION';
            approvals[approvalIndex].signature_user_agent = `ADM: ${adminName} - ${navigator.userAgent}`;
            approvals[approvalIndex].signed_at = timestamp;
            approvals[approvalIndex].updated_at = timestamp;
          }
        }

        // Create audit log
        await createAuditLog({
          action: action === 'approve' ? 'APROVACAO_ATA_ADMIN' : 'ASSINATURA_ATA_ADMIN',
          entity_type: action === 'approve' ? 'ata_approval' : 'ata_signature',
          entity_id: participantId,
          metadata: {
            meeting_id: ata.meetingId,
            meeting_title: ata.meetingTitle,
            participant_id: participantId,
            participant_name: participant.name,
            participant_email: participant.email,
            admin_action: true,
            admin_name: adminName,
            admin_comment: adminComment,
            ip_address: 'ADM_ACTION',
            user_agent: navigator.userAgent,
            timestamp: timestamp
          }
        });
      }

      // Save updated approvals
      localStorage.setItem('ata_approvals', JSON.stringify(approvals));

      // Check if all are now approved/signed and update status
      const meetingApprovals = approvals.filter((a: any) => a.meeting_id === ata.meetingId);
      const allApproved = meetingApprovals.every((a: any) => a.approval_status === 'APROVADO');
      const allSigned = meetingApprovals.every((a: any) => a.signature_status === 'ASSINADO');

      const statusMap = JSON.parse(localStorage.getItem('meeting_ata_status') || '{}');
      if (allSigned) {
        statusMap[ata.meetingId] = 'ASSINADO';
      } else if (allApproved) {
        statusMap[ata.meetingId] = 'APROVADO';
      }
      localStorage.setItem('meeting_ata_status', JSON.stringify(statusMap));

      toast({
        title: action === 'approve' ? "Aprovação realizada" : "Assinatura realizada",
        description: `${participantIds.length} participante(s) ${action === 'approve' ? 'aprovado(s)' : 'assinado(s)'} como ADM. Ação registrada no log de auditoria.`,
      });

      setSelectedParticipants([]);
      setAdminComment("");
      setSelectAll(false);
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error performing admin action:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a ação administrativa.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (participant: Participant) => {
    if (isApprovalPhase) {
      switch (participant.approvalStatus) {
        case 'APROVADO':
          return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovado</Badge>;
        case 'REJEITADO':
          return <Badge className="bg-red-100 text-red-700 gap-1"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
        case 'REVISAO_SOLICITADA':
          return <Badge className="bg-amber-100 text-amber-700 gap-1"><AlertTriangle className="h-3 w-3" /> Revisão</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-700 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      }
    } else {
      return participant.signatureStatus === 'ASSINADO'
        ? <Badge className="bg-green-100 text-green-700 gap-1"><PenTool className="h-3 w-3" /> Assinado</Badge>
        : <Badge className="bg-gray-100 text-gray-700 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Ações Administrativas - ATA
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(ata.meetingDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {ata.organName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="gap-2">
              <Eye className="h-4 w-4" />
              Visualizar ATA
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2">
              <Edit className="h-4 w-4" />
              Ações de ADM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    {ata.meetingTitle}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Reunião realizada em {format(new Date(ata.meetingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">Participantes e Status:</h4>
                  <div className="space-y-2">
                    {ata.participants.map(participant => (
                      <div 
                        key={participant.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-muted-foreground">{participant.email} - {participant.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(participant)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Ações administrativas serão registradas no log de auditoria com seu nome e timestamp.
                  </p>
                </div>

                {pendingParticipants.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isApprovalPhase 
                        ? "Todos os participantes já aprovaram a ATA." 
                        : "Todos os participantes já assinaram a ATA."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-sm mb-3">
                        Participantes Pendentes de {isApprovalPhase ? 'Aprovação' : 'Assinatura'}:
                      </h4>
                      
                      <div className="flex items-center space-x-2 mb-3 p-2 bg-muted/30 rounded">
                        <Checkbox 
                          id="selectAll"
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="selectAll" className="text-sm font-medium">
                          Selecionar todos ({pendingParticipants.length})
                        </label>
                      </div>

                      <div className="space-y-2">
                        {pendingParticipants.map(participant => (
                          <div 
                            key={participant.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              selectedParticipants.includes(participant.id) 
                                ? 'bg-primary/5 border-primary/30' 
                                : 'bg-muted/30 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                checked={selectedParticipants.includes(participant.id)}
                                onCheckedChange={() => handleParticipantToggle(participant.id)}
                              />
                              <div>
                                <p className="text-sm font-medium">{participant.name}</p>
                                <p className="text-xs text-muted-foreground">{participant.email}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {participant.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Observação do ADM (opcional):
                      </label>
                      <Textarea
                        placeholder="Adicione uma observação para o registro de auditoria..."
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {activeTab === 'actions' && pendingParticipants.length > 0 && (
            <Button
              onClick={() => performAdminAction(isApprovalPhase ? 'approve' : 'sign', selectedParticipants)}
              disabled={selectedParticipants.length === 0 || processing}
              className="gap-2"
            >
              {processing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isApprovalPhase ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <PenTool className="h-4 w-4" />
              )}
              {isApprovalPhase ? 'Aprovar como ADM' : 'Assinar como ADM'} ({selectedParticipants.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ATAAdminActionsModal;
