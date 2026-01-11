import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Building2,
  Users,
  Sparkles,
  AlertCircle,
  Loader2,
  PartyPopper,
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';

import {
  getInviteByToken,
  acceptInvite,
  validatePasswordStrength,
  getUserByEmail,
  Invite,
} from '@/data/signupData';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Carregar convite
  useEffect(() => {
    if (!token) {
      setError('Token de convite não encontrado');
      setLoading(false);
      return;
    }

    const foundInvite = getInviteByToken(token);

    if (!foundInvite) {
      setError('Convite não encontrado ou inválido');
      setLoading(false);
      return;
    }

    if (foundInvite.status !== 'pending') {
      setError(
        foundInvite.status === 'accepted'
          ? 'Este convite já foi aceito'
          : foundInvite.status === 'expired'
          ? 'Este convite expirou'
          : 'Este convite não está mais disponível'
      );
      setLoading(false);
      return;
    }

    if (new Date(foundInvite.expiresAt) < new Date()) {
      setError('Este convite expirou');
      setLoading(false);
      return;
    }

    // Verificar se usuário já existe
    const existingUser = getUserByEmail(foundInvite.email);
    setIsExistingUser(!!existingUser);

    setInvite(foundInvite);
    setLoading(false);
  }, [token]);

  // Validação de senha
  const passwordValidation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  const canSubmit = isExistingUser || (passwordValidation.isValid && passwordsMatch);

  // Aceitar convite
  const handleAccept = async () => {
    if (!token || !invite) return;

    setIsSubmitting(true);

    try {
      const result = acceptInvite(token, isExistingUser ? undefined : password);

      if (!result.success) {
        toast.error(result.error || 'Erro ao aceitar convite');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      toast.success('Convite aceito com sucesso!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      toast.error('Erro ao aceitar convite');
      setIsSubmitting(false);
    }
  };

  // Renderizar estado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Verificando convite...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Convite Inválido</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/login')}>Ir para Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Bem-vindo à Legacy OS!</h2>
            <p className="text-muted-foreground mb-6">
              Sua conta foi configurada. Redirecionando para o dashboard...
            </p>
            <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={legacyLogo}
            alt="Legacy"
            className="h-10 mx-auto mb-6 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <Badge className="mb-4 bg-accent text-primary-foreground">
            <UserPlus className="h-3 w-3 mr-1" />
            Convite Recebido
          </Badge>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Você foi convidado para a Legacy OS
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{invite?.nomeCompleto}</p>
                <p className="text-sm text-muted-foreground">{invite?.email}</p>
              </div>
            </div>

            {invite?.mensagemPersonalizada && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm italic">"{invite.mensagemPersonalizada}"</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cargo</p>
                <p className="font-medium">{invite?.cargo || 'Membro'}</p>
              </div>
            </div>

            {isExistingUser ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">Conta existente</p>
                </div>
                <p className="text-sm text-green-700">
                  Você já tem uma conta com este email. Clique em "Aceitar Convite" para ser
                  adicionado ao conselho.
                </p>
              </div>
            ) : (
              <>
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Crie sua senha</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Crie uma senha forte"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {password && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['8+ chars', 'Maiúscula', 'Número', 'Especial'].map((req, idx) => {
                            const checks = [
                              password.length >= 8,
                              /[A-Z]/.test(password),
                              /[0-9]/.test(password),
                              /[!@#$%^&*(),.?":{}|<>]/.test(password),
                            ];
                            return (
                              <Badge
                                key={req}
                                variant={checks[idx] ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  checks[idx] ? 'bg-green-100 text-green-700' : ''
                                }`}
                              >
                                {checks[idx] && <Check className="h-3 w-3 mr-1" />}
                                {req}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirme sua senha"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`pl-10 ${
                            confirmPassword && (passwordsMatch ? 'border-green-500' : 'border-red-500')
                          }`}
                        />
                      </div>
                      {confirmPassword && !passwordsMatch && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          As senhas não coincidem
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <Button
              onClick={handleAccept}
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Aceitar Convite
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Ao aceitar, você concorda com os{' '}
              <a href="#" className="text-primary hover:underline">
                Termos de Uso
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
