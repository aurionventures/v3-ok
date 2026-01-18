import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, AlertCircle, FileSignature, Building2, User, Mail, Phone } from 'lucide-react';
import PartnerOnboardingProgress from '@/components/PartnerOnboardingProgress';

export default function PartnerContractSign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Token não fornecido');
      navigate('/parceiros/cadastro');
      return;
    }

    // Recuperar dados do cadastro
    const storedSignup = sessionStorage.getItem('partner_signup_data');

    if (!storedSignup) {
      toast.error('Dados do cadastro não encontrados. Por favor, refaça o cadastro.');
      navigate('/parceiros/cadastro?token=' + token);
      return;
    }

    try {
      const signup = JSON.parse(storedSignup);
      setSignupData(signup);

      // Mock do contrato com mais termos para permitir scroll
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
          'O parceiro receberá comissões conforme o Tier selecionado no momento do convite',
          'A comissão será calculada sobre vendas originadas através do link de afiliado único gerado para o parceiro',
          'O pagamento será realizado mensalmente após a confirmação da venda e o período de garantia',
          'O parceiro deve manter os dados cadastrais atualizados na plataforma',
          'Este contrato tem validade de 12 meses, renovável automaticamente mediante aceitação',
          'O parceiro se compromete a seguir todas as diretrizes de marketing e comunicação da marca',
          'Qualquer alteração nos termos será comunicada com 30 dias de antecedência',
          'O parceiro não pode vender ou transferir sua conta de afiliado sem autorização',
          'A plataforma se reserva o direito de suspender ou cancelar contas que violem os termos',
          'Disputas serão resolvidas através de arbitragem conforme a legislação brasileira',
          'O parceiro é responsável por manter a confidencialidade de suas credenciais de acesso',
          'Relatórios de comissões estarão disponíveis mensalmente na plataforma',
          'O parceiro concorda em receber comunicações relacionadas ao programa de afiliados',
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
    if (!termsAccepted) {
      toast.error('Você deve aceitar os termos e condições para continuar');
      return;
    }

    setSigning(true);

    try {
      // Simular assinatura do contrato
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar dados de contrato assinado
      const signedContract = {
        ...contractData,
        signed_at: new Date().toISOString(),
        status: 'signed',
        terms_accepted: true,
      };

      sessionStorage.setItem('partner_contract_signed', JSON.stringify(signedContract));
      
      toast.success('Contrato assinado com sucesso! Redirecionando para criação de senha...');
      
      setTimeout(() => {
        navigate('/parceiros/criar-senha?token=' + token);
      }, 1500);
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
      <Card className="w-full max-w-4xl shadow-lg max-h-[90vh] flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileSignature className="h-6 w-6" />
            Contrato de Parceiro
          </CardTitle>
          <CardDescription className="mt-2">
            Número: <strong>{contractData.contract_number}</strong>
          </CardDescription>
          
          {/* Barra de Progresso */}
          <div className="mt-6">
            <PartnerOnboardingProgress currentStep={2} />
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto">
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

          {/* Termos do contrato - Scrollável */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 text-lg">Termos e Condições</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                {contractData.terms.map((term: string, index: number) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-primary font-semibold mt-0.5">{index + 1}.</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{term}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkbox de aceite dos termos */}
          <div className="border-t pt-4 pb-2 flex-shrink-0">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-1"
              />
              <Label
                htmlFor="accept-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Eu li, compreendi e aceito todos os termos e condições acima descritos
              </Label>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-200 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>Importante:</strong> Este contrato tem validade de 12 meses a partir da data de assinatura.
            </AlertDescription>
          </Alert>
        </CardContent>

        {/* Footer fixo com botões */}
        <div className="border-t p-6 flex gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/parceiros/cadastro?token=' + token)}
          >
            Voltar
          </Button>
          <Button
            onClick={handleSignContract}
            className="flex-1"
            disabled={signing || !termsAccepted}
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
      </Card>
    </div>
  );
}
