/**
 * Modal para criação de senha após assinatura de contrato (fluxo PLG)
 * Permite que o cliente crie sua senha e seja logado automaticamente
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, RotateCw } from 'lucide-react';
import { validatePasswordStrength } from '@/data/signupData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreatePasswordModalProps {
  open: boolean;
  email: string;
  name: string;
  companyName: string;
  contractId?: string;
  onSuccess?: () => void;
}

export function CreatePasswordModal({
  open,
  email,
  name,
  companyName,
  contractId,
  onSuccess,
}: CreatePasswordModalProps) {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const passwordValidation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const canCreate = passwordValidation.isValid && passwordsMatch;

  // Gerador de senha forte
  const generateStrongPassword = () => {
    const length = 16;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    
    // Garantir pelo menos um de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Preencher o restante com caracteres aleatórios
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Embaralhar a senha
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(password);
    setConfirmPassword(password);
  };

  const handleCreatePassword = async () => {
    if (!canCreate) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    setIsCreating(true);

    try {
      // Criar usuário no sistema
      let authUserId: string | null = null;
      
      // Primeiro, tentar criar no Supabase Auth
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              company: companyName,
              contract_id: contractId,
              role: 'cliente',
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (authError) {
          // Se o usuário já existe, tentar fazer login
          if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) {
              console.warn('Erro ao fazer login no Supabase:', signInError);
              // Continuar com modo mock
            } else {
              authUserId = signInData.user?.id || null;
            }
          } else {
            console.warn('Erro ao criar usuário no Supabase:', authError);
            // Continuar com modo mock
          }
        } else {
          authUserId = authData.user?.id || null;
        }
      } catch (supabaseError: any) {
        console.warn('Supabase não disponível, usando modo mock:', supabaseError);
      }

      // Criar usuário no mockUsers para login local
      const userId = authUserId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Verificar se usuário já existe no localStorage
      const storedMockUsers = JSON.parse(localStorage.getItem('storedMockUsers') || '[]');
      const existingUser = storedMockUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        // Adicionar novo usuário ao localStorage
        const newUser = {
          id: userId,
          email,
          name,
          password, // Em produção, isso seria hash
          role: 'cliente',
          company: companyName,
        };

        storedMockUsers.push(newUser);
        localStorage.setItem('storedMockUsers', JSON.stringify(storedMockUsers));
      } else {
        // Atualizar senha se usuário já existe
        const userIndex = storedMockUsers.findIndex((u: any) => u.email === email);
        if (userIndex !== -1) {
          storedMockUsers[userIndex].password = password;
          localStorage.setItem('storedMockUsers', JSON.stringify(storedMockUsers));
        }
      }

      // Fazer login automático usando o AuthContext
      const loginSuccess = await login({
        email,
        password,
        role: 'cliente',
      });

      if (loginSuccess) {
        // Marcar que acabou de criar senha (para mostrar tour se necessário)
        localStorage.setItem('just_created_password', 'true');
        localStorage.setItem('from_contract_sign', 'true');
        localStorage.setItem('contract_id', contractId || '');

        toast.success('Senha criada com sucesso! Redirecionando...');

        // Chamar callback se fornecido
        if (onSuccess) {
          onSuccess();
        }

        // Redirecionar para página de boas-vindas após um breve delay
        setTimeout(() => {
          navigate('/welcome');
        }, 1500);
      } else {
        toast.error('Erro ao fazer login. Tente fazer login manualmente.');
      }
    } catch (error) {
      console.error('Erro ao criar senha:', error);
      toast.error('Erro ao criar senha. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg">Criar sua senha de acesso</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Crie uma senha segura para acessar a plataforma Legacy OS
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2.5 py-1">
          {/* Informações do usuário - Compacto */}
          <div className="p-2 bg-muted rounded-md space-y-0.5">
            <p className="text-xs font-medium truncate">{name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{email}</p>
            <p className="text-[10px] text-muted-foreground truncate">{companyName}</p>
          </div>

          {/* Campo de senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                Senha *
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateStrongPassword}
                className="h-6 text-[10px] gap-1 px-2 text-primary hover:text-primary"
              >
                <RotateCw className="h-3 w-3" />
                Gerar
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className={`pr-9 h-9 text-sm ${
                  password && !passwordValidation.isValid
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : password && passwordValidation.isValid
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {password && !passwordValidation.isValid && (
              <div className="space-y-0.5 text-[10px] text-red-500">
                {passwordValidation.errors.slice(0, 2).map((error, index) => (
                  <p key={index} className="flex items-center gap-1">
                    <AlertCircle className="h-2.5 w-2.5" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            {password && passwordValidation.isValid && (
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <CheckCircle className="h-2.5 w-2.5" />
                Senha forte
              </p>
            )}
          </div>

          {/* Campo de confirmação */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              Confirmar Senha *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className={`pr-9 h-9 text-sm ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : confirmPassword && passwordsMatch
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-2.5 w-2.5" />
                As senhas não coincidem
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <CheckCircle className="h-2.5 w-2.5" />
                Senhas coincidem
              </p>
            )}
          </div>

          {/* Requisitos de senha - Compacto */}
          <div className="p-2 bg-muted rounded-md">
            <p className="text-[10px] font-medium mb-1">Requisitos da senha:</p>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              <li>• Mínimo de 8 caracteres</li>
              <li>• Pelo menos uma letra maiúscula</li>
              <li>• Pelo menos uma letra minúscula</li>
              <li>• Pelo menos um número</li>
              <li>• Pelo menos um caractere especial</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleCreatePassword}
            disabled={!canCreate || isCreating}
            className="flex-1"
            size="sm"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                Criando...
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1.5" />
                Criar Senha e Acessar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
