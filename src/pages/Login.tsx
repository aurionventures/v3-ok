import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield, Briefcase } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { invitationService } from '@/utils/invitationService';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import legacyLogoFull from "@/assets/legacy-logo-full.png";
import LoginCliente from '@/components/auth/LoginCliente';
import LoginParceiro from '@/components/auth/LoginParceiro';
import LoginAdmin from '@/components/auth/LoginAdmin';

export default function Login() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [invitedCompany, setInvitedCompany] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se veio do GenerateCompanyToken com userType e email
    if (location.state?.userType && location.state?.email) {
      setUserType(location.state.userType);
    }
    
    // Verifica se veio do /admin
    if (location.state?.admin) {
      const credentials = getDefaultCredentials('admin');
      setUserType('admin');
      setEmail(credentials.email);
      setPassword(credentials.password);
      
      toast({
        title: "Acesso Administrativo",
        description: "Entre com suas credenciais de administrador",
      });
    }
  }, [location.state, toast]);

  // Check for invitation token
  useEffect(() => {
    const invitationToken = searchParams.get('invitation');
    console.log('🔍 Token encontrado:', invitationToken);
    
    if (invitationToken) {
      const invitation = invitationService.decodeToken(invitationToken);
      console.log('📋 Convite decodificado:', invitation);
      
      if (invitation) {
        const role = invitation.type === 'cliente' ? 'cliente' : 'parceiro';
        console.log('👤 Definindo tipo:', role, 'Email:', invitation.email);
        
        setUserType(role);
        setEmail(invitation.email);
        setInvitedCompany(invitation.companyName);
        setIsSignup(true);
        
        toast({
          title: "Convite detectado!",
          description: `Complete seu cadastro como ${invitation.type}`,
        });
      } else {
        console.error('❌ Convite inválido ou expirado');
        toast({
          title: "Convite inválido",
          description: "O link de convite expirou ou é inválido",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

  const handleLoginSuccess = async () => {
    if (!userType || !email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login({ email, password, role: userType });

      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo ao painel ${getRoleLabel(userType)}`,
        });

        // Redirect based on user role
        switch (userType) {
          case 'admin':
            navigate('/admin');
            break;
          case 'parceiro':
            navigate('/parceiro');
            break;
          case 'cliente':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Email, senha ou tipo de usuário incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCredentials = (role: UserRole): { email: string; password: string } => {
    switch (role) {
      case 'admin':
        return { email: 'admin@gov.com', password: 'admin123' };
      case 'parceiro':
        return { email: 'parceiro@consultor.com', password: 'parceiro123' };
      case 'cliente':
        return { email: 'cliente@empresa.com', password: '123456' };
      default:
        return { email: '', password: '' };
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'parceiro':
        return 'Parceiro';
      case 'cliente':
        return 'Cliente';
      default:
        return '';
    }
  };

  // Renderizar componente específico baseado no tipo de usuário
  if (userType === 'cliente') {
    return <LoginCliente onBack={() => setUserType(null)} />;
  }
  
  if (userType === 'parceiro') {
    return <LoginParceiro onBack={() => setUserType(null)} initialEmail={email} />;
  }
  
  if (userType === 'admin') {
    return <LoginAdmin onBack={() => setUserType(null)} />;
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Left side - Selection */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <img 
                src={legacyLogoFull} 
                alt="Legacy OS - Governança Corporativa" 
                className="h-20 w-auto mx-auto mb-4"
              />
              <p className="text-muted-foreground">Escolha como deseja acessar</p>
            </div>
            
            <div className="grid gap-4">
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => {
                  const credentials = getDefaultCredentials('cliente');
                  setUserType('cliente');
                  setEmail(credentials.email);
                  setPassword(credentials.password);
                }}
              >
                <CardHeader className="text-center">
                  <Building2 className="h-8 w-8 mx-auto text-primary" />
                  <CardTitle>Cliente</CardTitle>
                  <CardDescription>
                    Acesso para empresas e organizações
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => {
                  const credentials = getDefaultCredentials('parceiro');
                  setUserType('parceiro');
                  setEmail(credentials.email);
                  setPassword(credentials.password);
                }}
              >
                <CardHeader className="text-center">
                  <Briefcase className="h-8 w-8 mx-auto text-blue-600" />
                  <CardTitle>Parceiro</CardTitle>
                  <CardDescription>
                    Acesso para parceiros e consultores
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => {
                  const credentials = getDefaultCredentials('admin');
                  setUserType('admin');
                  setEmail(credentials.email);
                  setPassword(credentials.password);
                }}
              >
                <CardHeader className="text-center">
                  <Shield className="h-8 w-8 mx-auto text-green-600" />
                  <CardTitle>Admin Master</CardTitle>
                  <CardDescription>
                    Acesso para administradores da plataforma
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Evolua a governança da sua empresa</h2>
            <p className="text-lg max-w-md text-center mb-8">
              Plataforma completa para organizar, documentar, operacionalizar e evoluir sua governança corporativa.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-1">Estrutura Organizada</h3>
                <p className="text-sm">Conselhos, rituais e documentos em um só lugar</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-1">Sucessão Planejada</h3>
                <p className="text-sm">Prepare sua empresa para as próximas gerações</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-1">Diagnóstico Contínuo</h3>
                <p className="text-sm">Visualize a maturidade da sua governança</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-1">ESG Integrado</h3>
                <p className="text-sm">Sustentabilidade na agenda da governança</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de seleção de tipo de usuário
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src={legacyLogoFull} 
              alt="Legacy OS - Governança Corporativa" 
              className="h-20 w-auto mx-auto mb-4"
            />
            <p className="text-muted-foreground">Escolha como deseja acessar</p>
          </div>
          <div className="grid gap-4">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setUserType('cliente')}
            >
              <CardHeader className="text-center">
                <Building2 className="h-8 w-8 mx-auto text-primary" />
                <CardTitle>Cliente</CardTitle>
                <CardDescription>
                  Acesso para empresas e organizações
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setUserType('parceiro')}
            >
              <CardHeader className="text-center">
                <Briefcase className="h-8 w-8 mx-auto text-blue-600" />
                <CardTitle>Parceiro</CardTitle>
                <CardDescription>
                  Acesso para parceiros e consultores
                </CardDescription>
              </CardHeader>
            </Card>
            
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Evolua a governança da sua empresa</h2>
          <Card>
            <CardHeader className="space-y-1">
              {isSignup && invitedCompany && (
                <div className="mb-4 p-3 bg-primary/10 rounded-md text-center">
                  <p className="text-sm font-medium">Convite para: {invitedCompany}</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete seu cadastro abaixo</p>
                </div>
              )}
              <div className="flex items-center gap-2 justify-center mb-4">
                {(userType as string) === 'admin' && <Shield className="h-6 w-6 text-green-600" />}
                {(userType as string) === 'parceiro' && <Briefcase className="h-6 w-6 text-blue-600" />}
                {(userType as string) === 'cliente' && <Building2 className="h-6 w-6 text-primary" />}
                <CardTitle className="text-2xl">
                  {isSignup ? 'Cadastro' : 'Login'} - {getRoleLabel(userType || 'cliente')}
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                {isSignup 
                  ? `Complete seu cadastro como ${getRoleLabel(userType).toLowerCase()}`
                  : `Entre com suas credenciais de ${getRoleLabel(userType).toLowerCase()}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSignup}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>
              <div className="flex gap-2">
                {!isSignup && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUserType(null);
                      setEmail('');
                      setPassword('');
                    }}
                    className="flex-1"
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                )}
                <Button 
                  onClick={handleLoginSuccess}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading 
                    ? (isSignup ? 'Cadastrando...' : 'Entrando...') 
                    : (isSignup ? 'Cadastrar' : 'Entrar')
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Sistema de Acesso por Roles</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Plataforma completa para organizar, documentar, operacionalizar e evoluir sua governança corporativa.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Estrutura Organizada</h3>
              <p className="text-sm">Conselhos, rituais e documentos em um só lugar</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Sucessão Planejada</h3>
              <p className="text-sm">Prepare sua empresa para as próximas gerações</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Diagnóstico Contínuo</h3>
              <p className="text-sm">Visualize a maturidade da sua governança</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">ESG Integrado</h3>
              <p className="text-sm">Sustentabilidade na agenda da governança</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}