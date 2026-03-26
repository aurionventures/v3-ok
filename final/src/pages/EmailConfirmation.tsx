import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Star,
  ExternalLink,
  Key,
  User,
  Link as LinkIcon,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { PLAN_DATA } from '@/utils/planRecommendation';
import { toast } from '@/hooks/use-toast';
import legacyLogo from "@/assets/legacy-logo-new.png";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Generate demo credentials
  const credentials = {
    email: quizData?.contatoEmail || 'demo@empresa.com',
    senha: `LGC#Demo${new Date().getFullYear()}`,
    link: `${window.location.origin}/demo-login`
  };

  useEffect(() => {
    const payment = localStorage.getItem('payment_completed');
    const quiz = localStorage.getItem('quiz_result');
    
    if (payment) setPaymentData(JSON.parse(payment));
    if (quiz) setQuizData(JSON.parse(quiz));
    
    // Save credentials for next step
    localStorage.setItem('demo_credentials', JSON.stringify(credentials));
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast({ title: "Copiado!", description: `${field} copiado para a área de transferência` });
    setTimeout(() => setCopied(null), 2000);
  };

  const plan = paymentData ? (PLAN_DATA[paymentData.planId] || PLAN_DATA['media']) : PLAN_DATA['media'];
  const contatoNome = quizData?.contatoNome?.split(' ')[0] || 'Cliente';

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Simulated Email Client Header */}
        <div className="bg-card border rounded-t-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span className="font-medium">Caixa de Entrada</span>
            <Badge variant="secondary" className="ml-auto">1 não lido</Badge>
          </div>
        </div>

        {/* Email Preview */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-0">
            {/* Email Header */}
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <img src={legacyLogo} alt="Legacy" className="h-6 w-6 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">Legacy Governança</span>
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Importante
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    noreply@legacygovernanca.com.br
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Agora
                </div>
              </div>
              <h2 className="font-bold text-lg mt-3">
                Bem-vindo à Legacy! Seus dados de acesso
              </h2>
            </div>

            {/* Email Body */}
            <div className="p-6 space-y-6">
              <div>
                <p className="text-lg">Olá, {contatoNome}!</p>
                <p className="text-muted-foreground mt-2">
                  Parabéns pela contratação do plano <strong>{plan.nome}</strong>!
                </p>
                <p className="text-muted-foreground mt-2">
                  Sua assinatura já está ativa e você já pode acessar a plataforma.
                </p>
              </div>

              {/* Credentials Box */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <p className="font-semibold text-sm">Seus dados de acesso:</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-background rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Link de acesso</p>
                        <p className="font-mono text-sm">app.legacygovernanca.com.br</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(credentials.link, 'Link')}
                    >
                      {copied === 'Link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between bg-background rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">E-mail</p>
                        <p className="font-mono text-sm">{credentials.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(credentials.email, 'E-mail')}
                    >
                      {copied === 'E-mail' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between bg-background rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Senha temporária</p>
                        <p className="font-mono text-sm">{credentials.senha}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(credentials.senha, 'Senha')}
                    >
                      {copied === 'Senha' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Você será solicitado a alterar sua senha no primeiro acesso.
                </p>
              </div>

              <Separator />

              <div className="text-center space-y-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/demo-login')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar Plataforma
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Dúvidas? Fale com nosso suporte: 0800 123 4567
                </p>
              </div>

              <Separator />

              {/* Email Footer */}
              <div className="text-center text-xs text-muted-foreground space-y-2">
                <img src={legacyLogo} alt="Legacy" className="h-6 mx-auto opacity-50" />
                <p>Legacy Governança Corporativa e Patrimonial</p>
                <p>Este é um e-mail automático, não responda.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
