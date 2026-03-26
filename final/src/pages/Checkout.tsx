import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Building2, 
  QrCode, 
  FileText,
  Check,
  ShoppingCart,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { getRecommendedPlan, PLAN_DATA } from '@/utils/planRecommendation';
import legacyLogo from "@/assets/legacy-logo-new.png";
import { InputCNPJ, InputCEP, type CompanyData, type AddressData } from '@/components/ui/input-masked';
import { toast } from 'sonner';

type PaymentMethod = 'cartao' | 'pix' | 'boleto';

export default function Checkout() {
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string>('media');
  const [quizData, setQuizData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cartao');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Form fields
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  useEffect(() => {
    const quizResult = localStorage.getItem('quiz_result');
    if (quizResult) {
      const data = JSON.parse(quizResult);
      setQuizData(data);
      setNomeFantasia(data.empresaNome || '');
      
      const recommended = getRecommendedPlan({
        faturamentoFaixa: data.faturamentoFaixa,
        temConselho: data.temConselho,
        temSucessao: data.temSucessao,
        avaliacaoRiscosEsg: data.avaliacaoRiscosEsg,
        numeroColaboradores: 'ate_20'
      });
      setPlanId(recommended);
    }
  }, []);

  const plan = PLAN_DATA[planId] || PLAN_DATA['media'];

  const handleFinalizarCompra = () => {
    // Save checkout data
    localStorage.setItem('checkout_data', JSON.stringify({
      planId,
      paymentMethod,
      cnpj,
      razaoSocial,
      nomeFantasia,
      endereco: `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro} - ${endereco.cidade}/${endereco.uf}`,
      cep,
      valor: plan.precoMensal,
      timestamp: new Date().toISOString()
    }));
    
    navigate('/payment');
  };

  // Handler para quando o CNPJ é carregado
  const handleCompanyLoaded = (company: CompanyData) => {
    setRazaoSocial(company.razaoSocial);
    setNomeFantasia(company.nomeFantasia || company.razaoSocial);
    setCep(company.endereco.cep);
    setEndereco({
      logradouro: company.endereco.logradouro,
      numero: company.endereco.numero,
      complemento: company.endereco.complemento,
      bairro: company.endereco.bairro,
      cidade: company.endereco.cidade,
      uf: company.endereco.uf,
    });
    toast.success('Dados da empresa carregados automaticamente!');
  };

  // Handler para quando o CEP é carregado
  const handleAddressLoaded = (address: AddressData) => {
    setEndereco({
      logradouro: address.street,
      numero: '',
      complemento: address.complement,
      bairro: address.neighborhood,
      cidade: address.city,
      uf: address.state,
    });
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
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-semibold">Checkout</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/plan-result')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dados de Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputCNPJ
                    id="cnpj"
                    label="CNPJ"
                    value={cnpj}
                    onChange={(value) => setCnpj(value)}
                    onCompanyLoaded={handleCompanyLoaded}
                    autoFetch={true}
                    showSearchButton={true}
                    showCompanyPreview={false}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="razao">Razão Social</Label>
                    <Input 
                      id="razao" 
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      className={razaoSocial ? 'bg-muted/50' : ''}
                      placeholder="Preenchido automaticamente via CNPJ"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <InputCEP
                    id="cep"
                    label="CEP"
                    value={cep}
                    onChange={(value) => setCep(value)}
                    onAddressLoaded={handleAddressLoaded}
                    autoFetch={true}
                    showSearchButton={true}
                  />
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input 
                      id="logradouro" 
                      value={endereco.logradouro}
                      onChange={(e) => setEndereco(prev => ({ ...prev, logradouro: e.target.value }))}
                      placeholder="Rua, Av., etc."
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Numero</Label>
                    <Input 
                      id="numero" 
                      value={endereco.numero}
                      onChange={(e) => setEndereco(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input 
                      id="complemento" 
                      value={endereco.complemento}
                      onChange={(e) => setEndereco(prev => ({ ...prev, complemento: e.target.value }))}
                      placeholder="Sala 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input 
                      id="bairro" 
                      value={endereco.bairro}
                      onChange={(e) => setEndereco(prev => ({ ...prev, bairro: e.target.value }))}
                      className={endereco.bairro ? 'bg-muted/30' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade/UF</Label>
                    <Input 
                      id="cidade" 
                      value={endereco.cidade ? `${endereco.cidade}/${endereco.uf}` : ''}
                      readOnly
                      className="bg-muted/30"
                      placeholder="Via CEP"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Até 12x sem juros</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                      <QrCode className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                      </div>
                    </Label>
                    <Badge variant="secondary" className="text-green-600">5% OFF</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex items-center gap-3 cursor-pointer flex-1">
                      <FileText className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Boleto Bancário</p>
                        <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                Li e aceito os <a href="#" className="text-primary underline">Termos de Uso</a> e a{' '}
                <a href="#" className="text-primary underline">Política de Privacidade</a> da Legacy Governança.
              </Label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{plan.nome}</span>
                    <Badge>Mensal</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{plan.descricao}</p>
                  <Separator className="my-3" />
                  <div className="space-y-1 text-sm">
                    {plan.bullets.slice(0, 4).map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </div>
                    ))}
                    {plan.bullets.length > 4 && (
                      <p className="text-muted-foreground pl-6">
                        +{plan.bullets.length - 4} módulos inclusos
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {plan.precoMensal.toLocaleString('pt-BR')}</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>-R$ {(plan.precoMensal * 0.05).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {(paymentMethod === 'pix' 
                        ? plan.precoMensal * 0.95 
                        : plan.precoMensal
                      ).toLocaleString('pt-BR')}/mês
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  disabled={!acceptTerms}
                  onClick={handleFinalizarCompra}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Finalizar Compra
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ambiente seguro com criptografia SSL
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
