import { useState } from "react";
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
}

const initialPendingATAs: PendingATA[] = [
  {
    id: 'ata-1',
    meetingTitle: 'Reunião Ordinária',
    council: 'Conselho de Administração',
    date: addDays(new Date(), -10),
    status: 'AGUARDANDO_APROVACAO',
    approvedCount: 2,
    signedCount: 0,
    totalCount: 4
  },
  {
    id: 'ata-2',
    meetingTitle: 'Reunião Extraordinária',
    council: 'Comitê de Auditoria',
    date: addDays(new Date(), -5),
    status: 'AGUARDANDO_ASSINATURA',
    approvedCount: 3,
    signedCount: 1,
    totalCount: 3
  }
];

const MemberATAs = () => {
  const [atas, setAtas] = useState(initialPendingATAs);
  const [ataViewerOpen, setAtaViewerOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedATA, setSelectedATA] = useState<PendingATA | null>(null);

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
          approvedCount: selectedATA.approvedCount,
          totalMembers: selectedATA.totalCount
        } : null}
        onApprovalComplete={handleApprovalComplete}
      />
      {selectedATA && (
        <ElectronicSignatureModal
          isOpen={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          approvalId={selectedATA.id}
          participantName="Roberto Alves"
          onSuccess={handleSignatureSuccess}
        />
      )}
    </MemberLayout>
  );
};

export default MemberATAs;
