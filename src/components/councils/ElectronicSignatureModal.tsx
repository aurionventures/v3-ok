import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, Shield, Clock, Hash, Globe, Loader2 } from 'lucide-react';
import { useATAApprovals } from '@/hooks/useATAApprovals';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ElectronicSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalId: string;
  participantName: string;
  onSuccess?: () => void;
}

export const ElectronicSignatureModal = ({
  isOpen,
  onClose,
  approvalId,
  participantName,
  onSuccess
}: ElectronicSignatureModalProps) => {
  const { signATA } = useATAApprovals();
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

  const handleSign = async () => {
    if (!agreed) return;
    
    setSigning(true);
    const success = await signATA(approvalId);
    setSigning(false);
    
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            Assinatura Eletrônica
          </DialogTitle>
          <DialogDescription>
            Confirme sua identidade para assinar eletronicamente a ATA da reunião.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Signer info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {participantName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{participantName}</p>
                  <p className="text-xs text-muted-foreground">Signatário</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Data/Hora: {formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Navegador: {navigator.userAgent.split(' ').slice(-2).join(' ')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>Hash será gerado automaticamente</span>
            </div>
          </div>

          {/* Legal agreement */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="agreement" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <Label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                  Declaro que li integralmente o conteúdo desta ATA e concordo com todas as 
                  informações nela contidas. Estou ciente de que esta assinatura eletrônica 
                  possui validade jurídica conforme a legislação vigente.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Security notice */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-800">
              Sua assinatura será registrada com hash criptográfico SHA-256, 
              garantindo autenticidade e integridade do documento.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={signing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSign} 
            disabled={!agreed || signing}
            className="gap-2"
          >
            {signing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assinando...
              </>
            ) : (
              <>
                <PenTool className="h-4 w-4" />
                Confirmar Assinatura
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
