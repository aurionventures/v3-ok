import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check, Share2, Linkedin, Instagram, Facebook, Download, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados mockados para demonstração
const MOCK_AFFILIATE_TOKEN = 'aff_demo_parceiro_legacy_2024';
const BASE_URL = window.location.origin;
const AFFILIATE_LINK = `${BASE_URL}/plan-discovery?ref=${MOCK_AFFILIATE_TOKEN}`;

// Templates de posts
const POST_TEMPLATES = {
  linkedin: {
    title: "Post LinkedIn",
    content: `Transforme a governança da sua empresa com a Legacy OS

A Legacy OS é a plataforma completa de governança corporativa que oferece:

- Dashboard executivo em tempo real
- Compliance e gestão de riscos
- Maturidade ESG
- Desempenho do conselho
- IA para governança

Ideal para empresas que buscam excelência em governança corporativa.

Saiba mais: ${AFFILIATE_LINK}

#GovernançaCorporativa #LegacyOS #Compliance #ESG #Governance`
  },
  instagram: {
    title: "Storie Instagram",
    content: `Nova oportunidade para sua empresa!

A Legacy OS está transformando a governança corporativa no Brasil.

O que você ganha:
• Compliance automatizado
• Gestão de riscos inteligente
• Maturidade ESG
• IA para governança

Link na bio ou acesse: ${AFFILIATE_LINK}

#LegacyOS #Governança #Compliance #ESG`
  }
};

export default function AffiliateLink() {
  const { user } = useAuth();
  const [affiliateLink, setAffiliateLink] = useState(AFFILIATE_LINK);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Em produção, buscar o link real do banco de dados
    if (user?.email === 'parceiro@legacy.com') {
      setAffiliateLink(AFFILIATE_LINK);
    }
  }, [user]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success('Copiado para a área de transferência!');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Link do Afiliado" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Link do Afiliado</h1>
              <p className="text-gray-600 mt-1">Gerencie e compartilhe seu link de afiliado</p>
            </div>

            {/* Link Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Seu Link de Afiliado
                </CardTitle>
                <CardDescription>
                  Este é o link único que você deve compartilhar para receber comissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={affiliateLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    onClick={() => handleCopy(affiliateLink, 'main')}
                    variant="outline"
                  >
                    {copied === 'main' ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Banners para Download */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Banners para Download
                </CardTitle>
                <CardDescription>
                  Baixe os banners oficiais para usar em suas divulgações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Banner LinkedIn */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        Banner LinkedIn
                      </h3>
                      <Badge variant="outline">LinkedIn</Badge>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Preview do Banner</p>
                        <p className="text-xs text-gray-400 mt-1">1080x1080px</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        // Em produção, fazer download do banner real
                        toast.info('Download do banner será implementado em breve');
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Banner
                    </Button>
                  </div>

                  {/* Banner Instagram */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Instagram className="h-5 w-5 text-pink-600" />
                        Banner Instagram
                      </h3>
                      <Badge variant="outline">Storie</Badge>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Preview do Banner</p>
                        <p className="text-xs text-gray-400 mt-1">1080x1920px</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        // Em produção, fazer download do banner real
                        toast.info('Download do banner será implementado em breve');
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Banner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates de Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Materiais de Divulgação</CardTitle>
                <CardDescription>
                  Use estes templates prontos para compartilhar nas redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="linkedin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                  </TabsList>

                  {/* Template LinkedIn */}
                  <TabsContent value="linkedin" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Linkedin className="h-5 w-5 text-blue-600" />
                          Post LinkedIn
                        </h3>
                        <Badge variant="outline">Banner LinkedIn</Badge>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {POST_TEMPLATES.linkedin.content}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(POST_TEMPLATES.linkedin.content, 'linkedin')}
                          className="flex-1"
                        >
                          {copied === 'linkedin' ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Post
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCopy(affiliateLink, 'linkedin-link')}
                          variant="outline"
                        >
                          {copied === 'linkedin-link' ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Template Instagram */}
                  <TabsContent value="instagram" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Instagram className="h-5 w-5 text-pink-600" />
                          Storie Instagram
                        </h3>
                        <Badge variant="outline">Storie</Badge>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {POST_TEMPLATES.instagram.content}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(POST_TEMPLATES.instagram.content, 'instagram')}
                          className="flex-1"
                        >
                          {copied === 'instagram' ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Post
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCopy(affiliateLink, 'instagram-link')}
                          variant="outline"
                        >
                          {copied === 'instagram-link' ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Dicas de Uso */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas para Melhor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Compartilhe o link em grupos relevantes de LinkedIn e WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Use os templates prontos para manter consistência na comunicação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Personalize os posts com sua experiência e casos de sucesso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Acompanhe o funil de indicações para entender o comportamento dos leads</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
