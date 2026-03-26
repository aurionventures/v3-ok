import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  ThumbsUp, 
  MessageSquare, 
  XCircle,
  ArrowRight,
  Shield,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useATAApprovals } from '@/hooks/useATAApprovals';
import { ElectronicSignatureModal } from '@/components/councils/ElectronicSignatureModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ATAApproval = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { getApprovalByToken, getMeetingByToken, updateApproval } = useATAApprovals();
  
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState<any>(null);
  const [approval, setApproval] = useState<any>(null);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionComment, setRevisionComment] = useState('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confidentialityAccepted, setConfidentialityAccepted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      
      // Check if confidentiality was already accepted
      const accepted = localStorage.getItem(`ata_confidentiality_${token}`);
      if (accepted === 'true') {
        setConfidentialityAccepted(true);
      }
      
      const result = await getMeetingByToken(token);
      if (result) {
        setMeeting(result.meeting);
        setApproval(result.approval);
      }
      setLoading(false);
    };
    
    loadData();
  }, [token]);

  const handleAcceptConfidentiality = () => {
    localStorage.setItem(`ata_confidentiality_${token}`, 'true');
    setConfidentialityAccepted(true);
  };

  const handleApprove = async () => {
    if (!approval) return;
    setProcessing(true);
    await updateApproval(approval.id, 'APROVADO');
    setApproval({ ...approval, approval_status: 'APROVADO', approved_at: new Date().toISOString() });
    setProcessing(false);
  };

  const handleRequestRevision = async () => {
    if (!approval || !revisionComment.trim()) return;
    setProcessing(true);
    await updateApproval(approval.id, 'REVISAO_SOLICITADA', revisionComment);
    setApproval({ ...approval, approval_status: 'REVISAO_SOLICITADA', approval_comment: revisionComment });
    setRevisionModalOpen(false);
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!approval) return;
    setProcessing(true);
    await updateApproval(approval.id, 'REJEITADO');
    setApproval({ ...approval, approval_status: 'REJEITADO' });
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!meeting || !approval) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link inválido ou expirado</h2>
            <p className="text-muted-foreground mb-4">
              Este link de aprovação de ATA não é mais válido ou foi utilizado.
            </p>
            <Button onClick={() => navigate('/')}>Voltar ao início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confidentiality modal
  if (!confidentialityAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Termo de Confidencialidade
            </CardTitle>
            <CardDescription>
              Você está prestes a acessar informações confidenciais de governança corporativa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Ao prosseguir, você declara ciência de que:
              </p>
              <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc pl-4">
                <li>As informações contidas são de caráter confidencial</li>
                <li>Não devem ser compartilhadas com terceiros não autorizados</li>
                <li>Seu acesso será registrado para fins de auditoria</li>
                <li>A violação pode resultar em responsabilização legal</li>
              </ul>
            </div>
            <Button className="w-full" onClick={handleAcceptConfidentiality}>
              Aceitar e Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const meetingDate = meeting.date ? format(new Date(meeting.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Aprovação de ATA</h1>
          <p className="text-muted-foreground">
            {approval.participant?.external_name}, você foi solicitado a aprovar esta ATA.
          </p>
        </div>

        {/* Status Banner */}
        {approval.approval_status !== 'PENDENTE' && (
          <Card className={`border-2 ${
            approval.approval_status === 'APROVADO' ? 'border-green-500 bg-green-50' :
            approval.approval_status === 'REJEITADO' ? 'border-red-500 bg-red-50' :
            'border-amber-500 bg-amber-50'
          }`}>
            <CardContent className="py-4 text-center">
              {approval.approval_status === 'APROVADO' && (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">ATA Aprovada</span>
                  {approval.signature_status === 'NAO_ASSINADO' && (
                    <Button 
                      size="sm" 
                      className="ml-4"
                      onClick={() => setSignatureModalOpen(true)}
                    >
                      Assinar Eletronicamente
                    </Button>
                  )}
                  {approval.signature_status === 'ASSINADO' && (
                    <Badge className="ml-2 bg-emerald-600">Assinado</Badge>
                  )}
                </div>
              )}
              {approval.approval_status === 'REJEITADO' && (
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">ATA Rejeitada</span>
                </div>
              )}
              {approval.approval_status === 'REVISAO_SOLICITADA' && (
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Revisão Solicitada</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ATA Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ATA DE REUNIÃO
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 flex-wrap mt-2">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {meetingDate} às {meeting.time}
                </Badge>
                <Badge variant="secondary">{meeting.councils?.name}</Badge>
                <Badge>{meeting.type}</Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meeting Header */}
            <div className="text-center space-y-2 pb-4 border-b">
              <h2 className="text-xl font-bold">{meeting.title}</h2>
              <p className="text-muted-foreground">
                {meeting.councils?.name} - {meeting.modalidade}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Resumo Executivo</h3>
              <p className="text-sm leading-relaxed text-justify">
                {meeting.minutes_summary || 'Resumo não disponível.'}
              </p>
            </div>

            <Separator />

            {/* Full Minutes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Conteúdo Completo</h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                {meeting.minutes_full || 'Conteúdo não disponível.'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {approval.approval_status === 'PENDENTE' && (
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleApprove}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                  Aprovar ATA
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setRevisionModalOpen(true)}
                  disabled={processing}
                >
                  <MessageSquare className="h-4 w-4" />
                  Solicitar Revisão
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="gap-2"
                  onClick={handleReject}
                  disabled={processing}
                >
                  <XCircle className="h-4 w-4" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Este é um documento confidencial de governança corporativa.</p>
          <p>Seu acesso foi registrado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Revision Modal */}
      <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Revisão</DialogTitle>
            <DialogDescription>
              Descreva as correções ou ajustes necessários na ATA.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Descreva os pontos que precisam ser revisados..."
            value={revisionComment}
            onChange={(e) => setRevisionComment(e.target.value)}
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleRequestRevision}
              disabled={!revisionComment.trim() || processing}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      <ElectronicSignatureModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        approvalId={approval.id}
        participantName={approval.participant?.external_name || ''}
        onSuccess={() => {
          setApproval({ ...approval, signature_status: 'ASSINADO', signed_at: new Date().toISOString() });
        }}
      />
    </div>
  );
};

export default ATAApproval;
