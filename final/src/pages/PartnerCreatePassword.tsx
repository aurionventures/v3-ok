import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import PartnerOnboardingProgress from '@/components/PartnerOnboardingProgress';

export default function PartnerCreatePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      toast.error('Token não fornecido');
      navigate('/parceiros/cadastro');
      return;
    }

    // Verificar se o contrato foi assinado
    const storedContract = sessionStorage.getItem('partner_contract_signed');
    if (!storedContract) {
      toast.error('Contrato não assinado. Por favor, assine o contrato primeiro.');
      navigate('/parceiros/contrato?token=' + token);
      return;
    }

    // Recuperar dados do cadastro do sessionStorage
    const storedData = sessionStorage.getItem('partner_signup_data');
    if (!storedData) {
      toast.error('Dados do cadastro não encontrados');
      navigate('/parceiros/cadastro?token=' + token);
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setSignupData(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao recuperar dados:', err);
      toast.error('Erro ao recuperar dados do cadastro');
      navigate('/parceiros/cadastro?token=' + token);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setSubmitting(true);

    try {
      // Simular criação de senha de acesso (em produção, isso seria feito via Edge Function)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar senha no sessionStorage
      sessionStorage.setItem('partner_password', password);
      
      toast.success('Senha criada com sucesso! Redirecionando para o painel...');
      
      setTimeout(() => {
        // Salvar indicador de onboarding completo
        sessionStorage.setItem('partner_onboarding_complete', 'true');
        
        // Limpar dados temporários (exceto contrato assinado e senha)
        // sessionStorage.removeItem('partner_signup_data');
        
        // Redirecionar para o painel de parceiro
        // Em produção, faria login automático e redirecionaria para /parceiro
        navigate('/parceiro');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao criar senha:', err);
      toast.error(err.message || 'Erro ao criar senha');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Criar Senha de Acesso
          </CardTitle>
          <CardDescription className="mt-2">
            Crie uma senha segura para acessar sua conta de parceiro
          </CardDescription>
          
          {/* Barra de Progresso */}
          <div className="mt-6">
            <PartnerOnboardingProgress currentStep={3} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {signupData && (
            <Alert className="mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Cadastro: <strong>{signupData.name}</strong> - {signupData.company_name}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use pelo menos 8 caracteres com letras e números
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Digite novamente"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                Após criar a senha, você será redirecionado para o painel de parceiro.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/parceiros/contrato?token=' + token)}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={submitting || !password || !confirmPassword}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Criar Senha
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
