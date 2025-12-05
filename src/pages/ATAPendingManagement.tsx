import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileSignature, PenTool, CheckCircle2, XCircle, Clock, AlertCircle, 
  Mail, Building2, CalendarDays, Users, Copy, ArrowLeft, Send, Eye, Edit,
  MessageSquareText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ATAAdminActionsModal from "@/components/councils/ATAAdminActionsModal";
import { ATARevisionDashboard } from "@/components/councils/ATARevisionDashboard";
import { useATARevisions } from "@/hooks/useATARevisions";

export interface ATAWithApprovals {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  organName: string;
  organType: string;
  ataStatus: string;
  ataContent?: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    approvalStatus: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA';
    signatureStatus: 'NAO_ASSINADO' | 'ASSINADO';
    magicLinkToken: string;
  }>;
}

const ATAPendingManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialTab = searchParams.get("tab") === "signatures" ? "signatures" : "approvals";
  
  const [atasWithApprovals, setAtasWithApprovals] = useState<ATAWithApprovals[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedATA, setSelectedATA] = useState<ATAWithApprovals | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<'view' | 'edit'>('view');
  
  // Revision Dashboard state
  const [revisionDashboardOpen, setRevisionDashboardOpen] = useState(false);
  const [revisionATA, setRevisionATA] = useState<ATAWithApprovals | null>(null);

  const { getRevisionStats, getPendingRevisions } = useATARevisions();

  const handleViewATA = (ata: ATAWithApprovals) => {
    setSelectedATA(ata);
    setModalActionType('view');
    setModalOpen(true);
  };

  const handleEditATA = (ata: ATAWithApprovals) => {
    setSelectedATA(ata);
    setModalActionType('edit');
    setModalOpen(true);
  };

  const handleOpenRevisions = (ata: ATAWithApprovals) => {
    setRevisionATA(ata);
    setRevisionDashboardOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedATA(null);
  };

  const handleActionComplete = () => {
    loadATAData();
  };

  const handleATAUpdated = (newContent: string) => {
    // Update the ATA content after applying revisions
    loadATAData();
  };

  useEffect(() => {
    loadATAData();
  }, []);

  const loadATAData = () => {
    setLoading(true);
    
    // Get all ATA approvals from localStorage
    const storedApprovals = localStorage.getItem('ata_approvals');
    const approvals = storedApprovals ? JSON.parse(storedApprovals) : [];
    
    // Get meeting schedule for meeting details
    const storedSchedule = localStorage.getItem('annual_council_schedule');
    const schedule = storedSchedule ? JSON.parse(storedSchedule) : { meetings: [] };
    
    // Get ATA status map
    const storedStatusMap = localStorage.getItem('meeting_ata_status');
    const statusMap = storedStatusMap ? JSON.parse(storedStatusMap) : {};
    
    // Group approvals by meeting
    const meetingMap = new Map<string, ATAWithApprovals>();
    
    approvals.forEach((approval: any) => {
      const meetingId = approval.meeting_id;
      
      if (!meetingMap.has(meetingId)) {
        // Find meeting details
        const meeting = schedule.meetings?.find((m: any) => m.id === meetingId);
        
        meetingMap.set(meetingId, {
          meetingId,
          meetingTitle: meeting?.title || `Reunião ${meetingId}`,
          meetingDate: meeting?.date || new Date().toISOString().split('T')[0],
          organName: meeting?.council || 'Órgão não identificado',
          organType: meeting?.organ_type || 'conselho',
          ataStatus: statusMap[meetingId] || 'PENDENTE_APROVACAO',
          ataContent: meeting?.minutes_full || 'Conteúdo da ATA em processamento...',
          participants: []
        });
      }
      
      const ataData = meetingMap.get(meetingId)!;
      ataData.participants.push({
        id: approval.participant_id,
        name: approval.participant?.external_name || 'Participante',
        email: approval.participant?.external_email || '',
        role: approval.participant?.role || 'Membro',
        approvalStatus: approval.approval_status,
        signatureStatus: approval.signature_status,
        magicLinkToken: approval.magic_link_token
      });
    });
    
    setAtasWithApprovals(Array.from(meetingMap.values()));
    setLoading(false);
  };

  const copyMagicLink = (token: string, participantName: string) => {
    const link = `${window.location.origin}/ata-approval/${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: `Link de aprovação de ${participantName} copiado para a área de transferência.`,
    });
  };

  const sendReminder = (ata: ATAWithApprovals, type: 'approval' | 'signature') => {
    const pending = type === 'approval' 
      ? ata.participants.filter(p => p.approvalStatus === 'PENDENTE')
      : ata.participants.filter(p => p.signatureStatus === 'NAO_ASSINADO' && p.approvalStatus === 'APROVADO');
    
    toast({
      title: "Lembretes enviados",
      description: `${pending.length} lembrete(s) enviado(s) para os participantes pendentes.`,
    });
  };

  const getOrganIcon = (type: string) => {
    switch (type) {
      case 'conselho': return <Building2 className="h-4 w-4" />;
      case 'comite': return <Users className="h-4 w-4" />;
      case 'comissao': return <Users className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge className="bg-red-100 text-red-700 gap-1"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
      case 'REVISAO_SOLICITADA':
        return <Badge className="bg-amber-100 text-amber-700 gap-1"><AlertCircle className="h-3 w-3" /> Revisão</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
    }
  };

  const getSignatureStatusBadge = (status: string) => {
    if (status === 'ASSINADO') {
      return <Badge className="bg-green-100 text-green-700 gap-1"><PenTool className="h-3 w-3" /> Assinado</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
  };

  // Filter ATAs based on tab
  const pendingApprovalATAs = atasWithApprovals.filter(ata => 
    ata.ataStatus === 'EM_APROVACAO' && 
    ata.participants.some(p => p.approvalStatus === 'PENDENTE')
  );

  const pendingSignatureATAs = atasWithApprovals.filter(ata => 
    (ata.ataStatus === 'APROVADO' || ata.participants.every(p => p.approvalStatus === 'APROVADO')) &&
    ata.participants.some(p => p.signatureStatus === 'NAO_ASSINADO')
  );

  const renderATACard = (ata: ATAWithApprovals, type: 'approval' | 'signature') => {
    const pendingCount = type === 'approval'
      ? ata.participants.filter(p => p.approvalStatus === 'PENDENTE').length
      : ata.participants.filter(p => p.signatureStatus === 'NAO_ASSINADO').length;
    const totalCount = ata.participants.length;
    const completedCount = totalCount - pendingCount;

    // Get revision stats for this ATA
    const revisionStats = getRevisionStats(ata.meetingId);
    const hasRevisions = revisionStats.pending > 0;
    const hasRequestedRevisions = ata.participants.some(p => p.approvalStatus === 'REVISAO_SOLICITADA');

    return (
      <Card key={ata.meetingId} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {getOrganIcon(ata.organType)}
                {ata.meetingTitle}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {format(new Date(ata.meetingDate), "dd/MM/yyyy", { locale: ptBR })}
                </span>
                <span>{ata.organName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Revision indicator */}
              {(hasRevisions || hasRequestedRevisions) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={() => handleOpenRevisions(ata)}
                >
                  <MessageSquareText className="h-3.5 w-3.5" />
                  {revisionStats.pending > 0 ? `${revisionStats.pending} Revisões` : 'Ver Revisões'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-8"
                onClick={() => handleViewATA(ata)}
              >
                <Eye className="h-3.5 w-3.5" />
                Visualizar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-8"
                onClick={() => handleEditATA(ata)}
              >
                <Edit className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Badge variant="outline" className={type === 'approval' ? 'border-amber-300 text-amber-700' : 'border-blue-300 text-blue-700'}>
                {completedCount}/{totalCount} {type === 'approval' ? 'aprovados' : 'assinados'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Participantes:</h4>
            <div className="space-y-2">
              {ata.participants.map((participant) => {
                const isPending = type === 'approval' 
                  ? participant.approvalStatus === 'PENDENTE'
                  : participant.signatureStatus === 'NAO_ASSINADO';
                const isRevision = participant.approvalStatus === 'REVISAO_SOLICITADA';
                
                return (
                  <div 
                    key={participant.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isRevision ? 'bg-amber-50/50 border-amber-300' :
                      isPending ? 'bg-amber-50/50 border-amber-200' : 'bg-green-50/50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isRevision ? 'bg-amber-500' :
                        isPending ? 'bg-gray-400' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.email} - {participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {type === 'approval' 
                        ? getApprovalStatusBadge(participant.approvalStatus)
                        : getSignatureStatusBadge(participant.signatureStatus)
                      }
                      {isPending && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyMagicLink(participant.magicLinkToken, participant.name)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {pendingCount > 0 && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => sendReminder(ata, type)}
              >
                <Send className="h-4 w-4" />
                Enviar Lembrete ({pendingCount})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de ATAs" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate('/secretariat')}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Painel
            </Button>

            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="approvals" className="gap-2">
                  <FileSignature className="h-4 w-4" />
                  Pendentes de Aprovação
                  {pendingApprovalATAs.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{pendingApprovalATAs.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="signatures" className="gap-2">
                  <PenTool className="h-4 w-4" />
                  Pendentes de Assinatura
                  {pendingSignatureATAs.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{pendingSignatureATAs.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approvals" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : pendingApprovalATAs.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold">Nenhuma ATA pendente de aprovação</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Todas as ATAs foram aprovadas pelos participantes.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    {pendingApprovalATAs.map(ata => renderATACard(ata, 'approval'))}
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="signatures" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : pendingSignatureATAs.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold">Nenhuma ATA pendente de assinatura</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Todas as ATAs aprovadas já foram assinadas.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    {pendingSignatureATAs.map(ata => renderATACard(ata, 'signature'))}
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Admin Actions Modal */}
      <ATAAdminActionsModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        ata={selectedATA}
        actionType={modalActionType}
        onActionComplete={handleActionComplete}
      />

      {/* Revision Dashboard */}
      {revisionATA && (
        <ATARevisionDashboard
          open={revisionDashboardOpen}
          onClose={() => {
            setRevisionDashboardOpen(false);
            setRevisionATA(null);
          }}
          meetingId={revisionATA.meetingId}
          meetingTitle={revisionATA.meetingTitle}
          ataContent={revisionATA.ataContent || ''}
          adminName="Administrador"
          onATAUpdated={handleATAUpdated}
        />
      )}
    </div>
  );
};

export default ATAPendingManagement;
