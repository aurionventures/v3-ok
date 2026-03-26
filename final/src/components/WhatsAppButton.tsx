import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '47991622220';

interface WhatsAppButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  text?: string;
}

export function WhatsAppButton({ 
  variant = 'outline', 
  size = 'default',
  className = '',
  text = 'Falar com Especialista'
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/55${WHATSAPP_NUMBER}?text=Olá! Gostaria de falar com um especialista sobre os planos da Legacy OS.`;

  // Estilos específicos do WhatsApp (verde #25D366)
  const whatsappStyles = variant === 'outline' 
    ? 'border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 dark:hover:bg-green-950/20' 
    : variant === 'ghost'
    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
    : 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600';

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${whatsappStyles} ${className}`}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className={`h-4 w-4 ${variant === 'outline' || variant === 'ghost' ? 'text-green-600' : ''}`} />
      {text}
    </Button>
  );
}
