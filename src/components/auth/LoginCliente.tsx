import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import legacyLogo from "@/assets/legacy-logo-new.png";

interface LoginClienteProps {
  onBack?: () => void;
}

export default function LoginCliente({ onBack }: LoginClienteProps) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();


  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        toast({ title: "Erro de Login", description: "Por favor, preencha todos os campos.", variant: "destructive" });
        return;
      }
      // Chama Edge Function validate-code
      const { data, error } = await supabase.functions.invoke('validate-code', {
        method: 'POST',
        body: { email, code: password },
      });
      if (error) {
        toast({ title: "Erro de Login", description: error.message || "Email ou token inválidos.", variant: "destructive" });
        return;
      }
     
      
      // Verificar se o usuário tem a estrutura correta
      if (!data.user || !data.user.role) {
        console.error('Usuário ou role não encontrado');
        toast({ title: "Erro", description: "Dados do usuário inválidos", variant: "destructive" });
        return;
      }
      
      // Corrigir o role para 'cliente' se for 'user'
      const correctedUser = {
        ...data.user,
        role: data.user.role === 'user' ? 'cliente' : data.user.role
      };
      
      console.log('Usuário corrigido:', correctedUser);
      
      // Persiste usuário no contexto
      setUser(correctedUser);
      toast({ title: "Login bem-sucedido", description: `Bem-vindo, ${data.user.email}` });
      
      // Pequeno delay para garantir que o contexto seja atualizado
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Falha no login.", variant: "destructive" });
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
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Cliente</CardTitle>
              </div>
              <CardDescription className="text-center">
                Entre com suas credenciais de cliente
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
                <Label htmlFor="password">Token de Acesso</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite seu token de acesso enviado por email"
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
              <div className="text-center text-sm text-gray-600 mt-4">
                Não tem um token de acesso?{" "}
                <Link to="/generate-company-token" className="text-legacy-500 hover:underline">
                  Solicite um token de acesso
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Info */}
      <div className="hidden lg:block lg:w-1/2 relative legacy-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Acesso Cliente</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Gerencie sua empresa e acompanhe o progresso da governança corporativa.
          </p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Dashboard Empresarial
              </h3>
              <p className="text-sm">Acompanhe métricas e indicadores da sua empresa</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios ESG
              </h3>
              <p className="text-sm">Visualize relatórios de sustentabilidade e governança</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Maturidade
              </h3>
              <p className="text-sm">Acompanhe a evolução da maturidade organizacional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
