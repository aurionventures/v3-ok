import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, FileSignature, Clock, Building2, User, Mail, Phone } from 'lucide-react';

export default function PartnerContractSign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      toast.error('Token não fornecido');
      navigate('/parceiros/cadastro');
      return;
    }

    // Recuperar dados do cadastro e senha
    const storedSignup = sessionStorage.getItem('partner_signup_data');
    const storedPassword = sessionStorage.getItem('partner_password');

    if (!storedSignup || !storedPassword) {
      toast.error('Dados incompletos. Por favor, refaça o cadastro.');
      navigate('/parceiros/cadastro?token=' + token);
      return;
    }

    try {
      const signup = JSON.parse(storedSignup);
      setSignupData(signup);

      // Mock do contrato
      const contract = {
        id: `CONTRACT-${Date.now()}`,
        contract_number: `CTR-PART-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        partner_name: signup.name,
        company_name: signup.company_name,
        cnpj: signup.cnpj || 'Não informado',
        email: signup.email,
        phone: signup.phone,
        tier: signup.invitation_level || 'tier_3_simple',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        terms: [
          'O parceiro receberá comissões conforme o Tier selecionado',
          'A comissão será calculada sobre vendas originadas através do link de afiliado',
          'O pagamento será realizado mensalmente após a confirmação da venda',
          'O parceiro deve manter os dados atualizados na plataforma',
          'Este contrato tem validade de 12 meses, renovável automaticamente',
        ],
      };

      setContractData(contract);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar dados do contrato');
      navigate('/parceiros/cadastro?token=' + token);
    }
  }, [token]);

  const handleSignContract = async () => {
    setSigning(true);

    try {
      // Simular assinatura do contrato
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Salvar dados de contrato assinado
      const signedContract = {
        ...contractData,
        signed_at: new Date().toISOString(),
        status: 'signed',
      };

      sessionStorage.setItem('partner_contract_signed', JSON.stringify(signedContract));
      
      toast.success('✅ Contrato assinado com sucesso! Redirecionando para o painel...');
      
      setTimeout(() => {
        // Salvar indicador de contrato assinado para exibição no painel
        sessionStorage.setItem('partner_onboarding_complete', 'true');
        
        // Limpar dados temporários (exceto contrato assinado)
        sessionStorage.removeItem('partner_signup_data');
        sessionStorage.removeItem('partner_password');
        
        // Redirecionar para o painel de parceiro
        // Em produção, faria login automático e redirecionaria para /afiliado
        toast.info('🎉 Parabéns! Fluxo de cadastro completo. Em produção, você faria login automático.');
        navigate('/afiliado');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao assinar contrato:', err);
      toast.error(err.message || 'Erro ao assinar contrato');
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando contrato...</p>
        </div>
      </div>
    );
  }

  if (!contractData || !signupData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Dados não encontrados
            </CardTitle>
            <CardDescription>Por favor, refaça o cadastro</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/parceiros/cadastro?token=' + token)} className="w-full">
              Voltar ao Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 py-12">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileSignature className="h-6 w-6" />
            Contrato de Parceiro
          </CardTitle>
          <CardDescription className="mt-2">
            Número: <strong>{contractData.contract_number}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Dados do parceiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Nome
              </div>
              <p className="font-medium">{contractData.partner_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium">{contractData.email}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Empresa
              </div>
              <p className="font-medium">{contractData.company_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                Telefone
              </div>
              <p className="font-medium">{contractData.phone}</p>
            </div>
          </div>

          {/* Termos do contrato */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Termos e Condições</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              <ol className="space-y-3 list-decimal list-inside">
                {contractData.terms.map((term: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700">
                    {term}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>Importante:</strong> Ao assinar este contrato, você concorda com todos os termos e condições acima.
              Este contrato tem validade de 12 meses a partir da data de assinatura.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/parceiros/criar-senha?token=' + token)}
            >
              Voltar
            </Button>
            <Button
              onClick={handleSignContract}
              className="flex-1"
              disabled={signing}
            >
              {signing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assinando...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Assinar Contrato
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
