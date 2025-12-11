import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import legacyLogo from "@/assets/legacy-logo-new.png";

interface LoginAdminProps {
  onBack?: () => void;
}

export default function LoginAdmin({ onBack }: LoginAdminProps) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        toast({ title: "Erro de Login", description: "Por favor, preencha todos os campos.", variant: "destructive" });
        return;
      }

      const success = await login({ email, password, role: 'admin' });

      if (success) {
        toast({ title: "Login bem-sucedido", description: "Bem-vindo ao painel administrativo" });
        navigate('/admin');
      } else {
        toast({ title: "Erro de Login", description: "Email ou senha incorretos.", variant: "destructive" });
      }
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
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Admin Master</CardTitle>
              </div>
              <CardDescription className="text-center">
                Entre com suas credenciais administrativas
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
          <h2 className="text-3xl font-bold mb-6">Acesso Administrativo</h2>
          <p className="text-lg max-w-md text-center mb-8">
            Controle total da plataforma, usuários e configurações do sistema.
          </p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Gestão de Usuários
              </h3>
              <p className="text-sm">Gerencie usuários, permissões e acessos</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </h3>
              <p className="text-sm">Configure parâmetros e funcionalidades da plataforma</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </h3>
              <p className="text-sm">Acompanhe métricas globais e performance da plataforma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}