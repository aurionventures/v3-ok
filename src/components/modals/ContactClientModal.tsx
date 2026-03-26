import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;
}

export const ContactClientModal: React.FC<ContactClientModalProps> = ({
  open,
  onOpenChange,
  client
}) => {
  const { toast } = useToast();

  const handleContact = (method: string) => {
    if (!client) return;

    switch (method) {
      case 'email':
        if (client.email) {
          window.open(`mailto:${client.email}?subject=Contato - Governança Corporativa`);
          toast({
            title: 'Email Aberto',
            description: `Cliente de email aberto para ${client.name}`,
          });
        }
        break;
      case 'whatsapp':
        if (client.phone) {
          const phone = client.phone.replace(/\D/g, '');
          const message = encodeURIComponent(`Olá! Entrando em contato sobre os serviços de governança corporativa.`);
          window.open(`https://wa.me/55${phone}?text=${message}`);
          toast({
            title: 'WhatsApp Aberto',
            description: `Mensagem iniciada para ${client.name}`,
          });
        }
        break;
      case 'phone':
        if (client.phone) {
          window.open(`tel:${client.phone}`);
          toast({
            title: 'Ligação Iniciada',
            description: `Ligando para ${client.name}`,
          });
        }
        break;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Contatar {client?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {client?.email && (
            <Button
              variant="outline"
              className="w-full justify-start h-12"
              onClick={() => handleContact('email')}
            >
              <Mail className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Enviar Email</div>
                <div className="text-sm text-muted-foreground">{client.email}</div>
              </div>
            </Button>
          )}

          {client?.phone && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => handleContact('whatsapp')}
              >
                <MessageSquare className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">{client.phone}</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => handleContact('phone')}
              >
                <Phone className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Ligar</div>
                  <div className="text-sm text-muted-foreground">{client.phone}</div>
                </div>
              </Button>
            </>
          )}

          <Button
            variant="default"
            className="w-full justify-start h-12"
            onClick={() => {
              toast({
                title: 'Reunião Agendada',
                description: `Reunião com ${client?.name} será agendada`,
              });
              onOpenChange(false);
            }}
          >
            <Calendar className="mr-3 h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Agendar Reunião</div>
              <div className="text-sm text-primary-foreground/80">Escolher data e horário</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};