import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  QrCode, 
  FileText,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { PLAN_DATA } from '@/utils/planRecommendation';
import { toast } from '@/hooks/use-toast';
import legacyLogo from "@/assets/legacy-logo-new.png";

export default function Payment() {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Card form
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('DEMO LEGACY');

  useEffect(() => {
    const data = localStorage.getItem('checkout_data');
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const plan = checkoutData ? (PLAN_DATA[checkoutData.planId] || PLAN_DATA['media']) : PLAN_DATA['media'];
  const valor = checkoutData?.paymentMethod === 'pix' 
    ? plan.precoMensal * 0.95 
    : plan.precoMensal;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      localStorage.setItem('payment_completed', JSON.stringify({
        ...checkoutData,
        valorFinal: valor,
        pedidoNumero: `LGC-${Date.now().toString().slice(-8)}`,
        dataAprovacao: new Date().toISOString()
      }));
      
      navigate('/payment-confirmed');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copiado!", description: "Código copiado para a área de transferência" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!checkoutData) return null;

  const renderPaymentForm = () => {
    switch (checkoutData.paymentMethod) {
      case 'cartao':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Pagamento com Cartão</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input 
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Validade</Label>
                <Input 
                  id="expiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input 
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="NOME COMO NO CARTÃO"
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-lg text-sm text-muted-foreground">
              <p>Demonstração: Os dados acima são fictícios para simular o fluxo.</p>
            </div>
          </div>
        );

      case 'pix':
        const pixCode = 'pix@legacygovernanca.com.br';
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold">Pagamento via PIX</h3>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
              {/* Simulated QR Code */}
              <div className="w-48 h-48 bg-white border-2 rounded-lg flex items-center justify-center mb-4">
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                Ou copie o código PIX:
              </p>
              
              <div className="flex items-center gap-2 w-full max-w-sm">
                <Input 
                  value={pixCode} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(pixCode)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <p className="font-medium">Valor: R$ {valor.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-green-600">5% de desconto aplicado!</p>
            </div>
          </div>
        );

      case 'boleto':
        const boletoCode = '23793.38128 60000.000003 00000.000401 8 87450000007990';
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold">Boleto Bancário</h3>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Código de Barras:</p>
                <p className="font-mono text-sm break-all mt-2 p-3 bg-background rounded border">
                  {boletoCode}
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(boletoCode)}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copiar Código
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vencimento:</p>
                  <p className="font-medium">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor:</p>
                  <p className="font-medium">R$ {valor.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Baixar Boleto em PDF
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={legacyLogo} alt="Legacy" className="h-8" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Pagamento Seguro</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/checkout')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Finalizar Pagamento</CardTitle>
            <p className="text-center text-muted-foreground">
              {plan.nome} - R$ {valor.toLocaleString('pt-BR')}/mês
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderPaymentForm()}
            
            <Separator />
            
            <Button 
              size="lg" 
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  {checkoutData.paymentMethod === 'cartao' 
                    ? 'Simular Pagamento Aprovado'
                    : checkoutData.paymentMethod === 'pix'
                    ? 'Já Fiz o Pagamento'
                    : 'Já Paguei o Boleto'
                  }
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
