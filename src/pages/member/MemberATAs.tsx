import { useState, useEffect } from "react";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, CheckCircle, FileSignature } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { MemberATAViewerModal } from "@/components/member/MemberATAViewerModal";
import { MemberApprovalModal } from "@/components/member/MemberApprovalModal";
import { ElectronicSignatureModal } from "@/components/councils/ElectronicSignatureModal";

interface PendingATA {
  id: string;
  meetingTitle: string;
  council: string;
  date: Date;
  status: string;
  approvedCount: number;
  signedCount: number;
  totalCount: number;
  content?: string;
}

const ATA_CONTENT_CONSELHO = `**ATA DA REUNIÃO ORDINÁRIA DO CONSELHO DE ADMINISTRAÇÃO**

**Data:** ${format(addDays(new Date(), -10), "dd/MM/yyyy")}
**Horário:** 14h00 às 17h30
**Local:** Sala de Reuniões - Sede Administrativa
**Modalidade:** Presencial

---

**1. ABERTURA E VERIFICAÇÃO DE QUÓRUM**

A reunião foi aberta pelo Presidente do Conselho, Sr. João Carlos Silva, às 14h00, verificando-se a presença de 4 (quatro) dos 5 (cinco) conselheiros, configurando quórum necessário para deliberações.

**2. PARTICIPANTES PRESENTES**

- João Carlos Silva - Presidente do Conselho
- Roberto Alves - Conselheiro Independente
- Maria Helena Santos - Conselheira
- Carlos Eduardo Mendes - Conselheiro
- Ausente justificado: Pedro Augusto Lima

**3. ORDEM DO DIA**

3.1. Aprovação da ata da reunião anterior
3.2. Análise do relatório trimestral de resultados
3.3. Discussão sobre plano de expansão para região Sul
3.4. Avaliação de proposta de investimento em tecnologia

**4. DELIBERAÇÕES E DISCUSSÕES**

**4.1. Aprovação da Ata Anterior**
A ata da reunião anterior foi aprovada por unanimidade, sem ressalvas.

**4.2. Relatório Trimestral**
O Diretor Financeiro apresentou os resultados do 3º trimestre, destacando crescimento de 12% na receita líquida e margem EBITDA de 18,5%. O Conselho aprovou o relatório por unanimidade.

**4.3. Plano de Expansão Região Sul**
Após ampla discussão, o Conselho aprovou o investimento de R$ 2.500.000,00 para abertura de 3 novas unidades na região Sul, com prazo de implementação de 18 meses.

**4.4. Investimento em Tecnologia**
O Conselho aprovou a contratação de consultoria especializada para avaliação de sistema ERP integrado, com orçamento preliminar de R$ 500.000,00.

**5. ENCAMINHAMENTOS**

| Ação | Responsável | Prazo |
|------|-------------|-------|
| Elaborar cronograma detalhado de expansão Sul | Diretoria de Operações | 30 dias |
| Iniciar processo de seleção de consultoria ERP | Diretoria de TI | 15 dias |
| Preparar relatório de due diligence das localidades | Diretoria Comercial | 45 dias |

**6. ENCERRAMENTO**

Nada mais havendo a tratar, o Presidente encerrou a reunião às 17h30, da qual eu, secretário, lavrei a presente ata que, após lida e aprovada, será assinada por todos os presentes.

---

**Próxima reunião:** ${format(addDays(new Date(), 20), "dd/MM/yyyy")} às 14h00`;

const ATA_CONTENT_COMITE = `**ATA DA REUNIÃO EXTRAORDINÁRIA DO COMITÊ DE AUDITORIA**

**Data:** ${format(addDays(new Date(), -5), "dd/MM/yyyy")}
**Horário:** 10h00 às 12h30
**Local:** Sala de Videoconferência
**Modalidade:** Híbrida

---

**1. ABERTURA**

A reunião foi aberta pela Coordenadora do Comitê, Sra. Ana Paula Ferreira, às 10h00.

**2. PARTICIPANTES**

- Ana Paula Ferreira - Coordenadora
- Roberto Alves - Membro
- Fernanda Costa - Membro

**3. PAUTA**

3.1. Revisão dos controles internos
3.2. Análise de riscos operacionais
3.3. Parecer sobre demonstrações financeiras

**4. DELIBERAÇÕES**

O Comitê aprovou por unanimidade o parecer favorável às demonstrações financeiras do trimestre.

**5. ENCERRAMENTO**

Reunião encerrada às 12h30.`;

const initialPendingATAs: PendingATA[] = [
  {
    id: 'conselho-1',
    meetingTitle: 'Reunião Ordinária',
    council: 'Conselho de Administração',
    date: addDays(new Date(), -10),
    status: 'AGUARDANDO_APROVACAO',
    approvedCount: 2,
    signedCount: 0,
    totalCount: 4,
    content: ATA_CONTENT_CONSELHO
  },
  {
    id: 'comite-1',
    meetingTitle: 'Reunião Extraordinária',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), -5),
    status: 'AGUARDANDO_ASSINATURA',
    approvedCount: 3,
    signedCount: 1,
    totalCount: 3,
    content: ATA_CONTENT_COMITE
  }
];

const MemberATAs = () => {
  const [atas, setAtas] = useState(initialPendingATAs);
  const [ataViewerOpen, setAtaViewerOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedATA, setSelectedATA] = useState<PendingATA | null>(null);

  // Initialize demo approval records for Roberto Alves
  useEffect(() => {
    const STORAGE_KEY = 'ata_approvals';
    const stored = localStorage.getItem(STORAGE_KEY);
    const allApprovals = stored ? JSON.parse(stored) : [];
    
    let hasNewApprovals = false;
    
    initialPendingATAs.forEach(ata => {
      const approvalId = `approval-${ata.id}-member-roberto`;
      const existing = allApprovals.find((a: any) => a.id === approvalId);
      
      if (!existing) {
        const newApproval = {
          id: approvalId,
          meeting_id: ata.id,
          participant_id: 'member-roberto',
          approval_status: ata.status === 'AGUARDANDO_ASSINATURA' ? 'APROVADO' : 'PENDENTE',
          approval_comment: null,
          approved_at: ata.status === 'AGUARDANDO_ASSINATURA' ? new Date().toISOString() : null,
          signature_status: 'NAO_ASSINADO',
          signature_hash: null,
          signature_ip: null,
          signature_user_agent: null,
          signed_at: null,
          notification_sent_at: new Date().toISOString(),
          magic_link_token: `demo-token-${ata.id}-roberto`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          participant: {
            id: 'member-roberto',
            external_name: 'Roberto Alves',
            external_email: 'roberto.alves@empresa.com',
            role: 'Conselheiro'
          }
        };
        allApprovals.push(newApproval);
        hasNewApprovals = true;
        console.log(`✅ Created approval record: ${approvalId}`);
      }
    });
    
    if (hasNewApprovals) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allApprovals));
      console.log(`📋 Updated localStorage with ${allApprovals.length} approvals`);
    }
  }, []);

  const handleViewATA = (ata: PendingATA) => {
    setSelectedATA(ata);
    setAtaViewerOpen(true);
  };

  const handleApproveATA = (ata: PendingATA) => {
    setSelectedATA(ata);
    setApprovalModalOpen(true);
  };

  const handleSignATA = (ata: PendingATA) => {
    setSelectedATA(ata);
    setSignatureModalOpen(true);
  };

  const handleApprovalComplete = (ataId: string, action: "approve" | "revision" | "reject") => {
    if (action === "approve") {
      setAtas(prev => prev.map(a => 
        a.id === ataId 
          ? { ...a, approvedCount: (a.approvedCount || 0) + 1 }
          : a
      ));
    }
  };

  const handleSignatureSuccess = () => {
    if (selectedATA) {
      setAtas(prev => prev.map(a => 
        a.id === selectedATA.id 
          ? { ...a, signedCount: (a.signedCount || 0) + 1 }
          : a
      ));
    }
    setSignatureModalOpen(false);
    toast({
      title: "ATA Assinada",
      description: "Sua assinatura eletrônica foi registrada com sucesso"
    });
  };

  return (
    <MemberLayout 
      title="ATAs Pendentes"
      subtitle="ATAs aguardando sua ação"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <FileText className="h-7 w-7 text-orange-500" />
            ATAs Pendentes de Ação
            <Badge variant="destructive" className="ml-2 text-base px-3 py-1">{atas.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {atas.map((ata) => (
            <div 
              key={ata.id} 
              className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-xl border-2 bg-card gap-5"
            >
              <div className="flex items-center gap-5">
                <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                  ata.status === 'AGUARDANDO_APROVACAO' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  {ata.status === 'AGUARDANDO_APROVACAO' ? (
                    <CheckCircle className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <FileSignature className="h-8 w-8 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold">ATA - {ata.council}</p>
                  <p className="text-lg text-foreground/80">{ata.meetingTitle} • {format(ata.date, "dd/MM/yyyy")}</p>
                  <Badge 
                    variant={ata.status === 'AGUARDANDO_APROVACAO' ? 'secondary' : 'outline'}
                    className="mt-3 text-sm px-4 py-1.5"
                  >
                    {ata.status === 'AGUARDANDO_APROVACAO' 
                      ? `Aguardando sua aprovação (${ata.approvedCount}/${ata.totalCount} aprovaram)`
                      : `Aguardando sua assinatura (${ata.signedCount}/${ata.totalCount} assinaram)`
                    }
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <Button variant="outline" size="lg" onClick={() => handleViewATA(ata)} className="text-base h-12 px-6">
                  <Eye className="h-5 w-5 mr-2" />
                  Ver ATA
                </Button>
                {ata.status === 'AGUARDANDO_APROVACAO' ? (
                  <Button size="lg" onClick={() => handleApproveATA(ata)} className="text-base h-12 px-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Aprovar
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => handleSignATA(ata)} className="text-base h-12 px-6">
                    <FileSignature className="h-5 w-5 mr-2" />
                    Assinar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <MemberATAViewerModal
        open={ataViewerOpen}
        onClose={() => setAtaViewerOpen(false)}
        ata={selectedATA ? {
          id: selectedATA.id,
          title: selectedATA.meetingTitle,
          council: selectedATA.council,
          date: format(selectedATA.date, "dd/MM/yyyy")
        } : null}
      />
      <MemberApprovalModal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        ata={selectedATA ? {
          id: selectedATA.id,
          title: selectedATA.meetingTitle,
          council: selectedATA.council,
          date: format(selectedATA.date, "dd/MM/yyyy"),
          content: selectedATA.content,
          approvedCount: selectedATA.approvedCount,
          totalMembers: selectedATA.totalCount
        } : null}
        participantId="member-roberto"
        participantName="Roberto Alves"
        participantEmail="roberto.alves@empresa.com"
        onApprovalComplete={handleApprovalComplete}
      />
      {selectedATA && (
        <ElectronicSignatureModal
          isOpen={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          approvalId={`approval-${selectedATA.id}-member-roberto`}
          participantName="Roberto Alves"
          onSuccess={handleSignatureSuccess}
        />
      )}
    </MemberLayout>
  );
};

export default MemberATAs;
