import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Mail, 
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { PLAN_DATA } from '@/utils/planRecommendation';
import legacyLogo from "@/assets/legacy-logo-new.png";

export default function PaymentConfirmed() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('payment_completed');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      navigate('/checkout');
    }

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!paymentData) return null;

  const plan = PLAN_DATA[paymentData.planId] || PLAN_DATA['media'];
  const quizResult = JSON.parse(localStorage.getItem('quiz_result') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles 
                className="h-4 w-4" 
                style={{ 
                  color: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-pulse">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <PartyPopper className="h-6 w-6 text-yellow-500" />
            <h1 className="text-3xl font-bold text-green-600">Pagamento Aprovado!</h1>
            <PartyPopper className="h-6 w-6 text-yellow-500 transform scale-x-[-1]" />
          </div>
          <p className="text-muted-foreground">
            Parabéns! Sua assinatura está ativa.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <img src={legacyLogo} alt="Legacy" className="h-8 mx-auto mb-4" />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pedido</span>
                <span className="font-mono font-medium">#{paymentData.pedidoNumero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-medium">{plan.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">R$ {paymentData.valorFinal?.toLocaleString('pt-BR')}/mês</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forma de Pagamento</span>
                <span className="font-medium capitalize">{paymentData.paymentMethod}</span>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Enviamos um e-mail para:</p>
                  <p className="text-primary font-medium">{quizResult.contatoEmail || 'demo@empresa.com'}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Com seus dados de acesso à plataforma Legacy Governança
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Button 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/email-confirmation')}
        >
          <Mail className="h-5 w-5 mr-2" />
          Abrir E-mail de Confirmação
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Não recebeu o e-mail? Verifique sua caixa de spam.
        </p>
      </div>
    </div>
  );
}
