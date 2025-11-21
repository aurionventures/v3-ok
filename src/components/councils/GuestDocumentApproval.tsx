import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, FileText, User, Calendar, Clock, Check, X, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAnnualSchedule } from "@/hooks/useAnnualSchedule";

interface PendingDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedByEmail: string;
  uploadedAt: string;
  meetingId: string;
  meetingTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  guestToken: string;
}

export const GuestDocumentApproval = () => {
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const { toast } = useToast();
  const { schedule, updateMeeting } = useAnnualSchedule();

  useEffect(() => {
    loadPendingGuestDocuments();
  }, []);

  const loadPendingGuestDocuments = () => {
    // Initialize mock data if not exists
    const stored = localStorage.getItem('guest_pending_documents');
    if (!stored) {
      const mockDocuments: PendingDocument[] = [
        {
          id: 'guest-doc-1',
          name: 'Análise de Mercado Q1 2025.pdf',
          type: 'application/pdf',
          size: 2547821,
          uploadedBy: 'João Silva',
          uploadedByEmail: 'joao.silva@external.com',
          uploadedAt: new Date(2025, 0, 18, 10, 30).toISOString(),
          meetingId: 'conselho-2',
          meetingTitle: 'Conselho de Administração - Fevereiro/2025',
          status: 'pending',
          url: 'data:application/pdf;base64,mock-data',
          guestToken: 'demo-guest-token-123'
        },
        {
          id: 'guest-doc-2',
          name: 'Proposta de Investimento ESG.pptx',
          type: 'application/vnd.ms-powerpoint',
          size: 5242880,
          uploadedBy: 'Maria Santos',
          uploadedByEmail: 'maria.santos@external.com',
          uploadedAt: new Date(2025, 0, 19, 14, 15).toISOString(),
          meetingId: 'comite-2',
          meetingTitle: 'Comitê de Auditoria - Fevereiro/2025',
          status: 'pending',
          url: 'data:application/vnd.ms-powerpoint;base64,mock-data',
          guestToken: 'demo-guest-token-456'
        },
        {
          id: 'guest-doc-3',
          name: 'Relatório de Compliance 2024.xlsx',
          type: 'application/vnd.ms-excel',
          size: 1845760,
          uploadedBy: 'Carlos Mendes',
          uploadedByEmail: 'carlos.mendes@external.com',
          uploadedAt: new Date(2025, 0, 20, 9, 0).toISOString(),
          meetingId: 'comissao-2',
          meetingTitle: 'Comissão de Ética - Fevereiro/2025',
          status: 'pending',
          url: 'data:application/vnd.ms-excel;base64,mock-data',
          guestToken: 'demo-guest-token-789'
        }
      ];
      localStorage.setItem('guest_pending_documents', JSON.stringify(mockDocuments));
      setPendingDocuments(mockDocuments);
    } else {
      const docs = JSON.parse(stored);
      setPendingDocuments(docs.filter((d: PendingDocument) => d.status === 'pending'));
    }
  };

  const handleApprove = (documentId: string) => {
    const allDocs = JSON.parse(localStorage.getItem('guest_pending_documents') || '[]');
    const docIndex = allDocs.findIndex((d: PendingDocument) => d.id === documentId);
    
    if (docIndex === -1) return;

    const doc = allDocs[docIndex];
    
    // Update document status
    allDocs[docIndex].status = 'approved';
    localStorage.setItem('guest_pending_documents', JSON.stringify(allDocs));

    // Add to meeting documents
    const meeting = schedule?.meetings.find(m => m.id === doc.meetingId);
    if (meeting) {
      const newDocument = {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        uploadDate: doc.uploadedAt,
        url: doc.url,
        uploadedBy: doc.uploadedBy,
        approved: true,
        approvedBy: 'Secretário',
        approvedAt: new Date().toISOString()
      };
      
      const updatedMeeting = {
        ...meeting,
        meeting_documents: [
          ...(meeting.meeting_documents || []),
          newDocument
        ]
      };
      
      updateMeeting(meeting.id, updatedMeeting);
    }

    // Send mock notification to participants
    const mockNotifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    meeting?.participants?.forEach(participant => {
      mockNotifications.push({
        id: crypto.randomUUID(),
        type: 'document_approved',
        recipient: participant.email,
        recipient_name: participant.name,
        title: 'Novo Documento Disponível',
        message: `O documento "${doc.name}" foi aprovado e está disponível nos materiais da reunião "${doc.meetingTitle}".`,
        scheduled_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        status: 'ENVIADO',
        channel: 'EMAIL',
        context: {
          meetingId: doc.meetingId,
          documentId: doc.id,
          documentName: doc.name
        }
      });
    });
    localStorage.setItem('mock_notifications', JSON.stringify(mockNotifications));

    // Update local state
    setPendingDocuments(prev => prev.filter(d => d.id !== documentId));

    toast({
      title: "Documento Aprovado",
      description: `"${doc.name}" foi adicionado aos materiais da reunião.`,
    });
  };

  const handleReject = (documentId: string) => {
    const allDocs = JSON.parse(localStorage.getItem('guest_pending_documents') || '[]');
    const docIndex = allDocs.findIndex((d: PendingDocument) => d.id === documentId);
    
    if (docIndex === -1) return;

    const doc = allDocs[docIndex];
    
    // Update document status
    allDocs[docIndex].status = 'rejected';
    localStorage.setItem('guest_pending_documents', JSON.stringify(allDocs));

    // Send mock notification to guest
    const mockNotifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    mockNotifications.push({
      id: crypto.randomUUID(),
      type: 'document_rejected',
      recipient: doc.uploadedByEmail,
      recipient_name: doc.uploadedBy,
      title: 'Documento Rejeitado',
      message: `Seu documento "${doc.name}" para a reunião "${doc.meetingTitle}" não foi aprovado. Entre em contato com o secretariado para mais informações.`,
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: 'ENVIADO',
      channel: 'EMAIL',
      context: {
        meetingId: doc.meetingId,
        documentId: doc.id,
        documentName: doc.name
      }
    });
    localStorage.setItem('mock_notifications', JSON.stringify(mockNotifications));

    // Update local state
    setPendingDocuments(prev => prev.filter(d => d.id !== documentId));

    toast({
      title: "Documento Rejeitado",
      description: `"${doc.name}" foi rejeitado. O convidado foi notificado.`,
      variant: "destructive"
    });
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getFileTypeLabel = (type: string): string => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('word') || type.includes('document')) return 'Word';
    return 'Documento';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-purple-600" />
          Aprovação de Documentos de Convidados
          <Badge variant="secondary">{pendingDocuments.length}</Badge>
        </CardTitle>
        <CardDescription>
          Revise e aprove materiais enviados por convidados para as reuniões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Nenhum documento aguardando aprovação</p>
              <p className="text-sm mt-1">
                Documentos enviados por convidados aparecerão aqui
              </p>
            </div>
          ) : (
            pendingDocuments.map((doc) => (
              <Card key={doc.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-base">{doc.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>Enviado por: <span className="font-medium text-foreground">{doc.uploadedBy}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Reunião: <span className="font-medium text-foreground">{doc.meetingTitle}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(doc.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span>{doc.uploadedByEmail}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeLabel(doc.type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(doc.size)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Aguardando aprovação
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(doc.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(doc.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
