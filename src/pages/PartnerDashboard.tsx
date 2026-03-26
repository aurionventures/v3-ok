import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Check, Link2 } from 'lucide-react';

// Token mockado para demonstração
const MOCK_AFFILIATE_TOKEN = 'aff_demo_parceiro_legacy_2024';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [affiliateLink, setAffiliateLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Em produção, buscar o token do parceiro logado
    // Por enquanto, usar token mockado
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/plan-discovery?ref=${MOCK_AFFILIATE_TOKEN}`;
    setAffiliateLink(link);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Painel do Parceiro" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Painel do Parceiro</h1>
              <p className="text-gray-600 mt-2">
                Use seu link de afiliado para indicar clientes e ganhar comissões
              </p>
            </div>

            {/* Card do Link de Afiliado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Seu Link de Afiliado
                </CardTitle>
                <CardDescription>
                  Compartilhe este link para receber comissões sobre cada venda gerada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={affiliateLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Como funciona:</strong> Quando alguém clica no seu link e se cadastra na plataforma, 
                    você recebe comissões sobre todas as vendas geradas através desse cadastro.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informações adicionais podem ser adicionadas aqui */}
          </div>
        </main>
      </div>
    </div>
  );
}
