import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Phone, Briefcase, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: any) => void;
}

const sectors = [
  'Tecnologia',
  'Financeiro',
  'Saúde',
  'Educação',
  'Varejo',
  'Indústria',
  'Agronegócio',
  'Energia',
  'Construção',
  'Outros'
];

export const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onOpenChange,
  onClientAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [inviteData, setInviteData] = useState<{
    link: string;
    code: string;
    companyName: string;
    email: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    email: '',
    phone: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'Link de convite copiado para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setShowInviteLink(false);
    setInviteData(null);
    setFormData({ name: '', sector: '', email: '', phone: '' });
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se email já existe no banco antes de criar
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, email, created_by_partner')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows found, que é ok
        console.error('Erro ao verificar usuário:', checkError);
        throw new Error('Erro ao verificar dados. Tente novamente.');
      }

      // Se usuário já existe, verificar se pode ser criado
      if (existingUser) {
        if (existingUser.created_by_partner === user.id) {
          throw new Error('Este email já está cadastrado como seu cliente. Use a opção "Reenviar Convite" se necessário.');
        } else if (existingUser.created_by_partner && existingUser.created_by_partner !== user.id) {
          throw new Error('Este email já está associado a outro parceiro.');
        }
        // Se não tem created_by_partner, pode ser criado (foi criado pelo admin)
      }

      // Chamar Edge Function para criar cliente
      console.log('🔍 Debug - user:', user);
      console.log('🔍 Debug - partnerId:', user.id);
      
      const { data, error } = await supabase.functions.invoke('create-partner-client', {
        method: 'POST',
        body: {
          email: formData.email,
          companyName: formData.name,
          sector: formData.sector,
          phone: formData.phone || null,
          partnerId: user.id
        }
      });

      if (error) {
        console.error('Erro ao criar cliente:', error);
        throw new Error(error.message || 'Erro ao criar cliente');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao criar cliente');
      }

      // Criar objeto cliente para o callback
      const newClient = {
        id: data.client.id,
        name: data.client.name,
        sector: data.client.sector,
        email: data.client.email,
        phone: formData.phone,
        parceiroId: user.id,
        maturityScore: 0, // Novo cliente, sem avaliação ainda
        lastAssessment: null,
        createdAt: new Date(),
        accessCredentials: {
          email: formData.email,
          loginUrl: `${window.location.origin}/login?role=cliente`
        }
      };

      onClientAdded(newClient);
      
      // Mostrar link de convite para copiar
      setInviteData({
        link: data.invitation.link,
        code: data.invitation.code,
        companyName: formData.name,
        email: formData.email
      });
      setShowInviteLink(true);
      
      toast({
        title: 'Cliente Criado com Sucesso!',
        description: `${formData.name} foi adicionado à sua carteira. Convite enviado por email.`,
      });

    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: 'Erro ao Criar Cliente',
        description: error.message || 'Erro interno. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.sector && formData.email;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {showInviteLink ? 'Convite Criado!' : 'Adicionar Nova Empresa'}
          </DialogTitle>
        </DialogHeader>
        
        {showInviteLink && inviteData ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Cliente criado com sucesso!
              </h3>
              <p className="text-sm text-green-700">
                <strong>{inviteData.companyName}</strong> foi adicionado à sua carteira.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Link de Convite:</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={inviteData.link}
                    readOnly
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(inviteData.link)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Código de Acesso:</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={inviteData.code}
                    readOnly
                    className="flex-1 text-center font-mono text-lg font-bold"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(inviteData.code)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
              <strong>Informações:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Email: {inviteData.email}</li>
                <li>• Convite válido por 7 dias</li>
                <li>• Email de convite já foi enviado automaticamente</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => copyToClipboard(inviteData.link)}
                className="flex-1"
              >
                {copied ? 'Copiado!' : 'Copiar Link'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome da empresa"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Setor *</Label>
            <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {sector}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email do Responsável *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@empresa.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (Opcional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex-1"
            >
              {loading ? 'Criando...' : 'Criar Cliente'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
            <strong>Após criar:</strong> As credenciais de acesso serão enviadas automaticamente para o email informado com instruções de primeiro acesso.
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};