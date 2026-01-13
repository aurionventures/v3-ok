import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  Briefcase,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';

import {
  isCorporateEmail,
  validatePasswordStrength,
  createAccount,
} from '@/data/signupData';
import { formatCellphone } from '@/utils/masks';
import { PLANS, revealPricing } from '@/data/pricingData';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dados do plano vindo da calculadora
  const planSlug = searchParams.get('plan') || 'profissional';
  const priceFromCalculator = searchParams.get('price');

  const plan = PLANS.find((p) => p.id === planSlug) || PLANS[1];
  const pricing = revealPricing(planSlug);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validações
  const emailValidation = useMemo(() => {
    if (!formData.email) return { isValid: false, message: '' };
    if (!formData.email.includes('@')) return { isValid: false, message: 'Email inválido' };
    if (!isCorporateEmail(formData.email)) {
      return { isValid: false, message: 'Use um email corporativo (não Gmail, Hotmail, etc)' };
    }
    return { isValid: true, message: '' };
  }, [formData.email]);

  const passwordValidation = useMemo(() => {
    if (!formData.password) return { isValid: false, errors: [] };
    return validatePasswordStrength(formData.password);
  }, [formData.password]);

  const passwordsMatch = formData.password === formData.confirmPassword;

  const canSubmit = useMemo(() => {
    return (
      formData.nomeCompleto.trim().length >= 3 &&
      emailValidation.isValid &&
      passwordValidation.isValid &&
      passwordsMatch &&
      formData.empresa.trim().length >= 2 &&
      acceptedTerms
    );
  }, [formData, emailValidation, passwordValidation, passwordsMatch, acceptedTerms]);

  // Handler de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      setFormData((prev) => ({ ...prev, [name]: formatCellphone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar conta (mock)
      const { user, empresa, plano } = createAccount({
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
        empresa: formData.empresa,
        cargo: formData.cargo,
        planoSlug: planSlug,
        precoAnual: pricing.anual || undefined,
      });

      // Salvar dados para o onboarding
      localStorage.setItem(
        'signup_data',
        JSON.stringify({
          userId: user.id,
          empresaId: empresa.id,
          planoId: plano.id,
          empresaNome: empresa.nome,
          planoSlug: planSlug,
        })
      );

      toast.success('Conta criada com sucesso!');

      // Redirect para onboarding
      setTimeout(() => {
        navigate('/onboarding-wizard?step=1');
      }, 500);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={legacyLogo}
            alt="Legacy"
            className="h-10 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">Crie sua conta</h1>
          <p className="text-muted-foreground">
            Comece seu trial de 30 dias grátis. Sem cartão de crédito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Dados da Conta
                </CardTitle>
                <CardDescription>
                  Preencha seus dados para criar sua conta na Legacy OS.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nomeCompleto"
                        name="nomeCompleto"
                        placeholder="Seu nome completo"
                        value={formData.nomeCompleto}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@empresa.com.br"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${
                          formData.email &&
                          (emailValidation.isValid
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : 'border-red-500 focus-visible:ring-red-500')
                        }`}
                        required
                      />
                      {formData.email && (
                        <div className="absolute right-3 top-3">
                          {emailValidation.isValid ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formData.email && !emailValidation.isValid && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {emailValidation.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefone"
                          name="telefone"
                          placeholder="(11) 99999-9999"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="pl-10"
                          maxLength={15}
                        />
                      </div>
                    </div>

                    {/* Cargo */}
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cargo"
                          name="cargo"
                          placeholder="Ex: CEO, CFO, Diretor..."
                          value={formData.cargo}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Nome da Empresa *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Nome da sua empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Crie uma senha forte"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
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
                    {formData.password && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Mínimo 8 caracteres', '1 maiúscula', '1 número', '1 especial'].map(
                          (req, idx) => {
                            const checks = [
                              formData.password.length >= 8,
                              /[A-Z]/.test(formData.password),
                              /[0-9]/.test(formData.password),
                              /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
                            ];
                            return (
                              <Badge
                                key={req}
                                variant={checks[idx] ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  checks[idx]
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : ''
                                }`}
                              >
                                {checks[idx] && <Check className="h-3 w-3 mr-1" />}
                                {req}
                              </Badge>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${
                          formData.confirmPassword &&
                          (passwordsMatch
                            ? 'border-green-500'
                            : 'border-red-500')
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        As senhas não coincidem
                      </p>
                    )}
                  </div>

                  {/* Termos */}
                  <div className="flex items-start space-x-3 pt-4 border-t">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      Li e aceito os{' '}
                      <a href="#" className="text-primary hover:underline">
                        Termos de Uso
                      </a>{' '}
                      e a{' '}
                      <a href="#" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>{' '}
                      da Legacy OS. Confirmo que os dados fornecidos são verdadeiros.
                    </Label>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Iniciar Trial de 30 Dias Grátis
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Fazer login
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-accent/30 sticky top-4">
              <CardHeader className="bg-accent/5">
                <Badge className="w-fit mb-2 bg-accent text-primary-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  Trial 30 Dias
                </Badge>
                <CardTitle>Plano {plan.nome}</CardTitle>
                <CardDescription>{plan.descricao}</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Preço */}
                {pricing.mensal && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Após o trial:</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{pricing.mensalFormatted}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ou {pricing.anualFormatted}/ano
                    </p>
                    {pricing.economiaFormatted && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                        {pricing.economiaFormatted}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">INCLUSO:</p>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Segurança */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Dados protegidos e criptografados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Shield className="h-4 w-4" />
                    <span>Cancele a qualquer momento</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Alterar plano
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
