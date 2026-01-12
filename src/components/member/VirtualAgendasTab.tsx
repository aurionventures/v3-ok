import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Building2,
  Eye,
  MessageSquare,
  Send,
  AlertTriangle,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface VirtualMeeting {
  id: string;
  title: string;
  council: string;
  councilId: string;
  date: string;
  time: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA';
  agenda: AgendaItem[];
  documents: MeetingDocument[];
  ata?: {
    content: string;
    generatedAt: string;
  };
  memberApprovalStatus?: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA';
  memberComment?: string;
  memberApprovedAt?: string;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  presenter: string;
  duration: number;
  type: string;
}

interface MeetingDocument {
  id: string;
  name: string;
  type: string;
  url: string;
}

// Mock data - será substituído por dados reais
const getMockVirtualMeetings = (memberId: string): VirtualMeeting[] => {
  const stored = localStorage.getItem('virtual_meetings_approvals');
  if (stored) {
    const data = JSON.parse(stored);
    return data.filter((m: any) => m.memberId === memberId || !m.memberId);
  }
  
  // Dados mock iniciais
  return [
    {
      id: 'vm-1',
      title: 'Reunião Virtual - Aprovação de Orçamento 2026',
      council: 'Conselho de Administração',
      councilId: 'ca-1',
      date: '2026-01-15',
      time: '14:00',
      status: 'PENDENTE',
      memberApprovalStatus: 'PENDENTE',
      agenda: [
        {
          id: 'ai-1',
          title: 'Aprovação do Orçamento Anual 2026',
          description: 'Análise e deliberação sobre o orçamento proposto para o exercício de 2026',
          presenter: 'Diretor Financeiro',
          duration: 30,
          type: 'Deliberação'
        },
        {
          id: 'ai-2',
          title: 'Projeções de Investimentos',
          description: 'Apresentação das projeções de investimentos para o próximo ano',
          presenter: 'Diretor de Operações',
          duration: 20,
          type: 'Informativo'
        }
      ],
      documents: [
        { id: 'd1', name: 'Orçamento_2026_v3.pdf', type: 'PDF', url: '#' },
        { id: 'd2', name: 'Projecoes_Investimentos.xlsx', type: 'Excel', url: '#' }
      ],
      ata: {
        content: `ATA DA REUNIÃO VIRTUAL DO CONSELHO DE ADMINISTRAÇÃO

Data: 15 de janeiro de 2026
Modalidade: Virtual (Aprovação Assíncrona)
Órgão: Conselho de Administração

ORDEM DO DIA:
1. Aprovação do Orçamento Anual 2026
2. Projeções de Investimentos

DELIBERAÇÕES:
1. Foi apresentado o orçamento anual para 2026, com projeção de receita de R$ 50 milhões e despesas operacionais de R$ 35 milhões.
2. As projeções de investimentos totalizam R$ 5 milhões, focados em tecnologia e expansão de mercado.

Os membros do Conselho deverão manifestar aprovação ou solicitar revisão até 20/01/2026.

Documento gerado automaticamente pelo sistema Legacy OS.`,
        generatedAt: '2026-01-15T10:00:00Z'
      }
    },
    {
      id: 'vm-2',
      title: 'Reunião Virtual - Política de Compliance',
      council: 'Comitê de Auditoria',
      councilId: 'caud-1',
      date: '2026-01-10',
      time: '10:00',
      status: 'APROVADO',
      memberApprovalStatus: 'APROVADO',
      memberComment: 'Aprovado. Excelente trabalho na atualização das políticas.',
      memberApprovedAt: '2026-01-11T14:30:00Z',
      agenda: [
        {
          id: 'ai-3',
          title: 'Atualização da Política de Compliance',
          description: 'Revisão e aprovação das atualizações na política de compliance',
          presenter: 'Compliance Officer',
          duration: 45,
          type: 'Deliberação'
        }
      ],
      documents: [
        { id: 'd3', name: 'Politica_Compliance_v2.pdf', type: 'PDF', url: '#' }
      ],
      ata: {
        content: `ATA DA REUNIÃO VIRTUAL DO COMITÊ DE AUDITORIA

Data: 10 de janeiro de 2026
Modalidade: Virtual (Aprovação Assíncrona)
Órgão: Comitê de Auditoria

ORDEM DO DIA:
1. Atualização da Política de Compliance

DELIBERAÇÕES:
1. A nova política de compliance foi apresentada com atualizações referentes às regulamentações LGPD e CVM.

Status: APROVADO POR TODOS OS MEMBROS

Documento gerado automaticamente pelo sistema Legacy OS.`,
        generatedAt: '2026-01-10T08:00:00Z'
      }
    }
  ];
};

export const VirtualAgendasTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [virtualMeetings, setVirtualMeetings] = useState<VirtualMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<VirtualMeeting | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [approvalAction, setApprovalAction] = useState<'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA'>('APROVADO');
  const [activeTab, setActiveTab] = useState("pendentes");

  useEffect(() => {
    // Carregar reuniões virtuais
    const meetings = getMockVirtualMeetings(user?.id || 'member-1');
    setVirtualMeetings(meetings);
  }, [user]);

  const pendingMeetings = virtualMeetings.filter(m => m.memberApprovalStatus === 'PENDENTE');
  const approvedMeetings = virtualMeetings.filter(m => m.memberApprovalStatus === 'APROVADO');
  const otherMeetings = virtualMeetings.filter(m => 
    m.memberApprovalStatus === 'REJEITADO' || m.memberApprovalStatus === 'REVISAO_SOLICITADA'
  );

  const handleViewDetails = (meeting: VirtualMeeting) => {
    setSelectedMeeting(meeting);
    setIsDetailModalOpen(true);
  };

  const handleOpenApproval = (meeting: VirtualMeeting) => {
    setSelectedMeeting(meeting);
    setApprovalComment("");
    setApprovalAction('APROVADO');
    setIsApprovalModalOpen(true);
  };

  const handleSubmitApproval = () => {
    if (!selectedMeeting) return;

    const updatedMeetings = virtualMeetings.map(m => {
      if (m.id === selectedMeeting.id) {
        return {
          ...m,
          memberApprovalStatus: approvalAction,
          memberComment: approvalComment,
          memberApprovedAt: new Date().toISOString()
        };
      }
      return m;
    });

    setVirtualMeetings(updatedMeetings);
    
    // Salvar no localStorage
    localStorage.setItem('virtual_meetings_approvals', JSON.stringify(updatedMeetings));

    const actionText = approvalAction === 'APROVADO' ? 'aprovada' : 
                       approvalAction === 'REJEITADO' ? 'rejeitada' : 
                       'devolvida para revisão';

    toast({
      title: "Pauta Processada",
      description: `A pauta foi ${actionText} com sucesso.`,
    });

    setIsApprovalModalOpen(false);
    setSelectedMeeting(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge className="bg-red-100 text-red-700 gap-1"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
      case 'REVISAO_SOLICITADA':
        return <Badge className="bg-amber-100 text-amber-700 gap-1"><AlertTriangle className="h-3 w-3" /> Revisão Solicitada</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 gap-1"><Clock className="h-3 w-3" /> Aguardando Aprovação</Badge>;
    }
  };

  const MeetingCard = ({ meeting }: { meeting: VirtualMeeting }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">{meeting.title}</h4>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                <span>{meeting.council}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(meeting.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {meeting.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>{meeting.agenda.length} itens na pauta</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(meeting.memberApprovalStatus || 'PENDENTE')}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(meeting)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver Detalhes
              </Button>
              
              {meeting.memberApprovalStatus === 'PENDENTE' && (
                <Button 
                  size="sm"
                  onClick={() => handleOpenApproval(meeting)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Aprovar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {meeting.memberApprovedAt && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            Processado em: {format(new Date(meeting.memberApprovedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            {meeting.memberComment && (
              <p className="mt-1 italic">"{meeting.memberComment}"</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pautas Virtuais</h3>
          <p className="text-sm text-muted-foreground">
            Aprove ou solicite revisão de pautas e ATAs de reuniões virtuais
          </p>
        </div>
        
        {pendingMeetings.length > 0 && (
          <Badge variant="destructive" className="text-sm">
            {pendingMeetings.length} pendente{pendingMeetings.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendentes" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes
            {pendingMeetings.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingMeetings.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="aprovadas" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Aprovadas
          </TabsTrigger>
          <TabsTrigger value="outras" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Outras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-4">
          {pendingMeetings.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h4 className="font-semibold mb-2">Tudo em dia!</h4>
              <p className="text-muted-foreground text-sm">
                Você não possui pautas virtuais pendentes de aprovação.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="aprovadas" className="mt-4">
          {approvedMeetings.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">
                Nenhuma pauta aprovada ainda.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {approvedMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outras" className="mt-4">
          {otherMeetings.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">
                Nenhuma pauta rejeitada ou em revisão.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {otherMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              {selectedMeeting && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedMeeting.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {selectedMeeting.council}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedMeeting && (
            <Tabs defaultValue="pauta" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pauta">Pauta</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="ata">ATA</TabsTrigger>
              </TabsList>

              <TabsContent value="pauta" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {selectedMeeting.agenda.map((item, index) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="text-muted-foreground">
                                  Apresentador: <strong>{item.presenter}</strong>
                                </span>
                                <Badge variant="outline" className="text-xs">{item.type}</Badge>
                                <span className="text-muted-foreground">{item.duration} min</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="documentos" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {selectedMeeting.documents.map(doc => (
                      <Card key={doc.id} className="cursor-pointer hover:bg-accent/50">
                        <CardContent className="p-3 flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Visualizar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ata" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  {selectedMeeting.ata ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-sans">
                        {selectedMeeting.ata.content}
                      </pre>
                      <p className="text-xs text-muted-foreground mt-2">
                        Gerada em: {format(new Date(selectedMeeting.ata.generatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">ATA ainda não gerada.</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Fechar
            </Button>
            {selectedMeeting?.memberApprovalStatus === 'PENDENTE' && (
              <Button onClick={() => {
                setIsDetailModalOpen(false);
                handleOpenApproval(selectedMeeting);
              }}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aprovar Pauta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Aprovação */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aprovar Pauta Virtual</DialogTitle>
            <DialogDescription>
              {selectedMeeting?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sua Decisão</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={approvalAction === 'APROVADO' ? 'default' : 'outline'}
                  onClick={() => setApprovalAction('APROVADO')}
                  className="flex-col h-auto py-3"
                >
                  <CheckCircle2 className="h-5 w-5 mb-1 text-green-500" />
                  <span className="text-xs">Aprovar</span>
                </Button>
                <Button
                  variant={approvalAction === 'REVISAO_SOLICITADA' ? 'default' : 'outline'}
                  onClick={() => setApprovalAction('REVISAO_SOLICITADA')}
                  className="flex-col h-auto py-3"
                >
                  <AlertTriangle className="h-5 w-5 mb-1 text-amber-500" />
                  <span className="text-xs">Revisão</span>
                </Button>
                <Button
                  variant={approvalAction === 'REJEITADO' ? 'default' : 'outline'}
                  onClick={() => setApprovalAction('REJEITADO')}
                  className="flex-col h-auto py-3"
                >
                  <XCircle className="h-5 w-5 mb-1 text-red-500" />
                  <span className="text-xs">Rejeitar</span>
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentário {approvalAction !== 'APROVADO' && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                placeholder={
                  approvalAction === 'APROVADO' 
                    ? "Comentário opcional..." 
                    : "Descreva o motivo..."
                }
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
              />
            </div>

            {approvalAction !== 'APROVADO' && !approvalComment && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Comentário obrigatório para revisão ou rejeição
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitApproval}
              disabled={approvalAction !== 'APROVADO' && !approvalComment}
            >
              <Send className="h-4 w-4 mr-2" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VirtualAgendasTab;
