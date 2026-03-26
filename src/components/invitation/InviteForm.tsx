import React, { useState } from 'react';
import { Mail, Building2, Copy, Check, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { invitationService } from '@/utils/invitationService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface InviteFormProps {
  type: 'cliente' | 'parceiro';
  onBack: () => void;
  onSuccess: () => void;
}

export const InviteForm = ({ type, onBack, onSuccess }: InviteFormProps) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    if (!email || !companyName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e nome da empresa",
        variant: "destructive"
      });
      return;
    }

    setSending(true);

    try {
      if (type === 'parceiro') {
        // Usar a nova Edge Function para parceiros
        const { error } = await supabase.functions.invoke('request-partner-access', {
          method: 'POST',
          body: { email, partnerName: companyName },
        });

        if (error) {
          const errorMessage = error.message || "Falha ao gerar token de parceiro.";
          toast({
            title: "Erro",
            description: errorMessage,
            variant: "destructive"
          });
          return;
        }

        setEmailSent(true);
        toast({
          title: "Convite enviado com sucesso!",
          description: `Token de parceiro enviado para ${email}`
        });
      } else {
        // Usar a Edge Function existente para clientes
        const { error } = await supabase.functions.invoke('request-access', {
          method: 'POST',
          body: { email, companyName },
        });

        if (error) {
          const errorMessage = error.message || "Falha ao gerar token de cliente.";
          toast({
            title: "Erro",
            description: errorMessage,
            variant: "destructive"
          });
          return;
        }

        setEmailSent(true);
        toast({
          title: "Convite enviado com sucesso!",
          description: `Token de cliente enviado para ${email}`
        });
      }

      // Gerar URL de convite para exibição (opcional)
      const { url } = invitationService.generateToken({
        type,
        email,
        companyName,
        invitedBy: 'admin'
      });
      setInvitationUrl(url);

    } catch (error) {
      console.error('Erro ao gerar convite:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar convite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado!",
      description: "Link de convite copiado para a área de transferência"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={type === 'cliente' ? 'default' : 'secondary'}>
          {type === 'cliente' ? 'Cliente' : 'Parceiro'}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onBack}>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyName"
              placeholder="Nome da empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {!invitationUrl ? (
          <Button onClick={handleGenerateLink} className="w-full" disabled={sending}>
            {sending ? (
              <>
                <Send className="h-4 w-4 mr-2 animate-pulse" />
                Enviando convite...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gerar e Enviar Convite
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {emailSent && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ✓ Email enviado com sucesso para {email}
                </p>
              </div>
            )}
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground mb-2">Link de Convite:</p>
              <p className="text-sm break-all font-mono">{invitationUrl}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCopyLink} 
                className="flex-1"
                variant={copied ? "outline" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link
                  </>
                )}
              </Button>
              <Button onClick={onSuccess} variant="outline">
                Concluir
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
