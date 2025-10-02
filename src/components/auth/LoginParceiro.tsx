import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Lightbulb, BarChart3, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import legacyLogo from "@/assets/legacy-logo-new.png";

interface LoginParceiroProps {
  onBack?: () => void;
  initialEmail?: string;
}

export default function LoginParceiro({ onBack, initialEmail = '' }: LoginParceiroProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Atualizar email quando initialEmail mudar
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Tentando login com:', { email, role: 'parceiro' });
      
      // Chamar Edge Function para validar código e fazer login
      const { data, error } = await supabase.functions.invoke('validate-code', {
        body: {
          email: email,
          code: password
        }
      });

      if (error) {
        console.error('Erro na validação:', error);
        toast({
          title: "Erro no login",
          description: "Erro ao validar credenciais",
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.user) {
        console.error('Credenciais inválidas');
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas ou código expirado",
          variant: "destructive",
        });
        return;
      }

      // Criar AuthUser com dados retornados
      const authUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        company: data.user.company || data.user.name,
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
      };

      // Fazer login usando o contexto
      setUser(authUser);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel do Parceiro",
      });
      navigate('/parceiro');
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

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src={legacyLogo} 
              alt="Legacy" 
              className="h-12 w-auto mx-auto mb-2"
            />
            <p className="text-gray-600 mt-2">Governança Corporativa e Patrimonial</p>
          </div>
          
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Parceiro</CardTitle>
              </div>
              <CardDescription className="text-center">
                Entre com suas credenciais de parceiro
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Token de acesso</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite o código de acesso recebido por email"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onBack || (() => window.history.back())}
                  className="flex-1"
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleLogin}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Info */}
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Acesso Parceiro</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Gerencie sua carteira de clientes e acompanhe o progresso de cada empresa.
          </p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Gestão de Clientes
              </h3>
              <p className="text-sm">Acompanhe e gerencie sua carteira de clientes</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios Consolidados
              </h3>
              <p className="text-sm">Visualize relatórios de todos os seus clientes</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Performance
              </h3>
              <p className="text-sm">Acompanhe métricas de performance e resultados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
