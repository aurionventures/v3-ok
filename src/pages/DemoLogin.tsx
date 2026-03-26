import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  LogIn, 
  Lightbulb,
  Loader2
} from 'lucide-react';
import { useAuth, AuthUser } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import legacyLogo from "@/assets/legacy-logo-new.png";

export default function DemoLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', senha: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load credentials from email step
    const savedCredentials = localStorage.getItem('demo_credentials');
    if (savedCredentials) {
      const parsed = JSON.parse(savedCredentials);
      setCredentials({
        email: parsed.email,
        senha: parsed.senha
      });
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get quiz data for user info
    const quizData = JSON.parse(localStorage.getItem('quiz_result') || '{}');
    const paymentData = JSON.parse(localStorage.getItem('payment_completed') || '{}');

    // Create auth user
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: quizData.contatoNome || 'Usuário Demo',
      role: 'cliente',
      orgRole: 'org_admin',
      company: quizData.empresaNome || 'Empresa Demo',
      organization: {
        id: 'org-demo',
        name: quizData.empresaNome || 'Empresa Demo',
        companySize: 'medium',
        plan: 'legacy_360',
        enabledModules: [],
        onboardingCompleted: false
      }
    };

    // Save to localStorage
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('onboarding_completed', 'false');
    
    // Update context
    setUser(authUser);

    toast({
      title: "Login realizado!",
      description: `Bem-vindo, ${authUser.name}!`
    });

    navigate('/initial-setup');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src={legacyLogo} 
              alt="Legacy" 
              className="h-12 w-auto mx-auto mb-2"
            />
            <p className="text-muted-foreground mt-2">Governança Corporativa e Patrimonial</p>
          </div>
          
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
              <CardDescription>
                Entre com as credenciais enviadas por e-mail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={credentials.senha}
                  onChange={(e) => setCredentials({ ...credentials, senha: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Lembrar de mim
                </Label>
              </div>

              {/* Hint */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  As credenciais já estão preenchidas do e-mail anterior. 
                  Clique em "Entrar" para continuar.
                </p>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading || !credentials.email || !credentials.senha}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Info */}
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Primeiro Acesso</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Prepare-se para transformar a governança da sua empresa com a plataforma Legacy.
          </p>
          <div className="space-y-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium">Configure sua empresa</p>
                  <p className="text-sm opacity-80">Logo, nome fantasia e setor</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium">Convide colaboradores</p>
                  <p className="text-sm opacity-80">Adicione sua equipe</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium">Ative seu plano</p>
                  <p className="text-sm opacity-80">E comece a governar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
