import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Clock, Building2, User, Mail, Phone, Handshake } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InputCNPJ, InputPhone } from '@/components/ui/input-masked';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PartnerInvitation {
  id: string;
  invitation_token: string;
  invitation_level: 'afiliado_basico' | 'afiliado_avancado' | 'parceiro';
  status: string;
  expires_at: string;
  email?: string;
  name?: string;
  company_name?: string;
}

export default function PartnerSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<PartnerInvitation | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company_name: '',
    cnpj: '',
    phone: '',
    partner_type: '',
  });

  useEffect(() => {
    if (!token) {
      toast.error('Token de convite não fornecido');
      navigate('/');
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_invitations')
        .select('*')
        .eq('invitation_token', token)
        .single();

      if (error || !data) {
        toast.error('Convite inválido ou não encontrado');
        navigate('/');
        return;
      }

      if (data.status !== 'pending') {
        const statusMessages: Record<string, string> = {
          'used': 'usado',
          'expired': 'expirado',
          'submitted': 'já foi enviado',
          'approved': 'aprovado',
          'rejected': 'rejeitado'
        };
        toast.error(`Este convite já foi ${statusMessages[data.status] || 'processado'}`);
        navigate('/');
        return;
      }

      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      if (now > expiresAt) {
        toast.error('Este convite expirou');
        navigate('/');
        return;
      }

      setInvitation(data);
      setFormData(prev => ({
        ...prev,
        email: data.email || '',
        name: data.name || '',
        company_name: data.company_name || '',
        cnpj: data.cnpj || '',
        phone: data.phone || '',
      }));
    } catch (err) {
      console.error('Erro ao validar convite:', err);
      toast.error('Erro ao validar convite');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-partner-invitation', {
        body: {
          token,
          form_data: formData
        }
      });

      if (error) {
        toast.error(error.message || 'Erro ao enviar cadastro');
        return;
      }

      toast.success('Cadastro enviado com sucesso! Aguardando aprovação do Super ADM.');
      setInvitation({ ...invitation!, status: 'submitted' });
    } catch (err: any) {
      console.error('Erro ao enviar cadastro:', err);
      toast.error(err.message || 'Erro ao enviar cadastro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (!invitation || invitation.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Convite Inválido
            </CardTitle>
            <CardDescription>Este convite não está mais disponível</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      'afiliado_basico': 'Afiliado Básico (Nível 1)',
      'afiliado_avancado': 'Afiliado Avançado (Nível 2)',
      'parceiro': 'Parceiro Estratégico (Nível 3)',
    };
    return levels[level] || level;
  };

  const getLevelDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      'afiliado_basico': 'Você será responsável apenas por indicar clientes através do seu link de afiliado.',
      'afiliado_avancado': 'Você indicará clientes e acompanhará o onboarding básico.',
      'parceiro': 'Você fará a implantação completa e pode indicar clientes através do link de afiliado.',
    };
    return descriptions[level] || '';
  };

  const expiresAt = new Date(invitation.expires_at);
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Cadastro de Parceiro</CardTitle>
              <CardDescription className="mt-2">
                Você foi convidado como <strong className="text-primary">{getLevelLabel(invitation.invitation_level)}</strong>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expira em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-6">
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              {getLevelDescription(invitation.invitation_level)}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={!!invitation.email}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nome da Empresa *
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                required
                placeholder="Nome da sua empresa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">
                  CNPJ {invitation.invitation_level === 'parceiro' && '*'}
                  {invitation.invitation_level !== 'parceiro' && <span className="text-muted-foreground text-xs">(Opcional)</span>}
                </Label>
                <InputCNPJ
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  required={invitation.invitation_level === 'parceiro'}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone *
                </Label>
                <InputPhone
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner_type" className="flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                Tipo de Parceiro *
              </Label>
              <Select
                id="partner_type"
                value={formData.partner_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, partner_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de parceiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenda">Revenda</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="integrador">Integrador</SelectItem>
                  <SelectItem value="afiliado">Afiliado</SelectItem>
                  <SelectItem value="parceiro">Parceiro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Selecione o tipo de atuação do seu negócio
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                Após o envio, seu cadastro será revisado pelo Super ADM. Você receberá um email quando for aprovado e poderá acessar a plataforma.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Enviar Cadastro para Aprovação
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
