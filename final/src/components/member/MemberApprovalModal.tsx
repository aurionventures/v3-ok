import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Edit, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { MemberRevisionModal } from "./MemberRevisionModal";

interface MemberApprovalModalProps {
  open: boolean;
  onClose: () => void;
  ata: {
    id: string;
    title: string;
    council: string;
    date: string;
    content?: string;
    approvedCount: number;
    totalMembers: number;
  } | null;
  participantId?: string;
  participantName?: string;
  participantEmail?: string;
  onApprovalComplete: (ataId: string, action: "approve" | "revision" | "reject") => void;
}

export function MemberApprovalModal({ 
  open, 
  onClose, 
  ata, 
  participantId = 'demo-participant',
  participantName = 'Membro',
  participantEmail = 'membro@empresa.com',
  onApprovalComplete 
}: MemberApprovalModalProps) {
  const [action, setAction] = useState<"approve" | "revision" | "reject">("approve");
  const [hasRead, setHasRead] = useState(false);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!hasRead) {
      toast.error("Você precisa confirmar que leu a ATA integralmente");
      return;
    }
    
    // If revision, open the revision modal
    if (action === "revision") {
      setRevisionModalOpen(true);
      return;
    }
    
    if (action === "reject" && !comments.trim()) {
      toast.error("Informe o motivo da rejeição");
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (ata) {
      onApprovalComplete(ata.id, action);
    }

    const messages = {
      approve: "ATA aprovada com sucesso",
      revision: "Solicitação de revisão enviada",
      reject: "ATA rejeitada. Os demais membros serão notificados."
    };
    
    toast.success(messages[action]);
    setSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAction("approve");
    setHasRead(false);
    setComments("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRevisionComplete = () => {
    // After revision suggestions are submitted, mark as revision requested
    if (ata) {
      onApprovalComplete(ata.id, "revision");
    }
    toast.success("Sugestões de revisão enviadas com sucesso");
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Aprovação de ATA
            </DialogTitle>
          </DialogHeader>

          {ata && (
            <div className="space-y-5">
              {/* ATA Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold">{ata.title}</h3>
                <p className="text-sm text-muted-foreground">{ata.council} • {ata.date}</p>
                <div className="mt-2">
                  <Badge variant="outline">
                    {ata.approvedCount}/{ata.totalMembers} aprovações
                  </Badge>
                </div>
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50 border-amber-200">
                <Checkbox 
                  id="hasRead" 
                  checked={hasRead} 
                  onCheckedChange={(checked) => setHasRead(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="hasRead" className="font-medium cursor-pointer">
                    Confirmo que li integralmente a ATA
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Ao confirmar, você atesta que revisou todo o conteúdo da ATA.
                  </p>
                </div>
              </div>

              {/* Action selection */}
              <div className="space-y-3">
                <Label className="font-medium">Sua decisão</Label>
                <RadioGroup value={action} onValueChange={(v) => setAction(v as typeof action)}>
                  <div className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${action === "approve" ? "border-green-500 bg-green-50" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Aprovar</p>
                        <p className="text-xs text-muted-foreground">Concordo com o conteúdo da ATA</p>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${action === "revision" ? "border-amber-500 bg-amber-50" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem value="revision" id="revision" />
                    <Label htmlFor="revision" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Edit className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium">Solicitar Revisão</p>
                        <p className="text-xs text-muted-foreground">Sugerir alterações específicas na ATA</p>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${action === "reject" ? "border-red-500 bg-red-50" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="flex items-center gap-2 cursor-pointer flex-1">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Rejeitar</p>
                        <p className="text-xs text-muted-foreground">A ATA não reflete as deliberações</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Comments - only for reject */}
              {action === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="comments">
                    Motivo da Rejeição <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Informe o motivo da rejeição..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Info for revision */}
              {action === "revision" && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <Edit className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-amber-700">
                    Ao clicar em "Enviar Solicitação", você poderá adicionar sugestões de alteração específicas por seção da ATA.
                  </p>
                </div>
              )}

              {/* Warning for rejection */}
              {action === "reject" && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-red-700">
                    A rejeição da ATA suspenderá o processo de aprovação e notificará todos os membros e o secretário.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !hasRead}
              className={
                action === "approve" ? "bg-green-600 hover:bg-green-700" :
                action === "revision" ? "bg-amber-600 hover:bg-amber-700" :
                "bg-red-600 hover:bg-red-700"
              }
            >
              {submitting ? "Enviando..." : 
                action === "approve" ? "Confirmar Aprovação" :
                action === "revision" ? "Enviar Solicitação" :
                "Confirmar Rejeição"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revision Modal */}
      {ata && (
        <MemberRevisionModal
          open={revisionModalOpen}
          onClose={() => setRevisionModalOpen(false)}
          meetingId={ata.id}
          meetingTitle={ata.title}
          ataContent={ata.content || 'Conteúdo da ATA não disponível para visualização.'}
          participantId={participantId}
          participantName={participantName}
          participantEmail={participantEmail}
          onSubmitComplete={handleRevisionComplete}
        />
      )}
    </>
  );
}
