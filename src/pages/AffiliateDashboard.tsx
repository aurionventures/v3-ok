import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  Users,
  DollarSign,
  Link as LinkIcon,
  Copy,
  Check,
  Eye,
  ArrowRight,
  Calendar,
  Target
} from 'lucide-react';

interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
  current_stage: string;
}

interface Commission {
  id: string;
  plan_name: string;
  plan_value: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  sale_date: string;
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [affiliateToken, setAffiliateToken] = useState<string | null>(null);
  const [affiliateLink, setAffiliateLink] = useState<string>('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);

      // Buscar dados do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        navigate('/login');
        return;
      }

      // Buscar token de afiliado do parceiro
      const { data: partnerSettings } = await supabase
        .from('partner_settings')
        .select('affiliate_token')
        .eq('user_id', user.id)
        .single();

      if (!partnerSettings?.affiliate_token) {
        toast.error('Token de afiliado não encontrado. Entre em contato com o suporte.');
        return;
      }

      const token = partnerSettings.affiliate_token;
      setAffiliateToken(token);
      setAffiliateLink(`${window.location.origin}/plan-discovery?ref=${token}`);

      // Buscar leads atribuídos a este parceiro
      const { data: leadsData } = await supabase
        .from('plg_leads')
        .select('*')
        .or(`partner_id.eq.${user.id},affiliate_token.eq.${token}`)
        .order('created_at', { ascending: false });

      if (leadsData) {
        setLeads(leadsData as Lead[]);
        
        // Calcular estatísticas de leads
        const totalLeads = leadsData.length;
        const activeLeads = leadsData.filter(l => 
          l.current_stage && l.current_stage !== 'lost'
        ).length;

        setStats(prev => ({
          ...prev,
          totalLeads,
          activeLeads
        }));
      }

      // Buscar comissões do parceiro
      const { data: commissionsData } = await supabase
        .from('partner_commissions')
        .select('*')
        .eq('partner_id', user.id)
        .order('sale_date', { ascending: false });

      if (commissionsData) {
        const commissionsList = commissionsData as Commission[];
        setCommissions(commissionsList);

        // Calcular estatísticas de comissões
        const totalCommissions = commissionsList.reduce(
          (sum, c) => sum + Number(c.commission_amount || 0), 
          0
        );
        const pendingCommissions = commissionsList
          .filter(c => c.status === 'pending' || c.status === 'confirmed')
          .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
        const paidCommissions = commissionsList
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

        setStats(prev => ({
          ...prev,
          totalCommissions,
          pendingCommissions,
          paidCommissions
        }));
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do afiliado:', error);
      toast.error('Erro ao carregar dados do afiliado');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!affiliateLink) return;
    
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const getStageLabel = (stage: string | null) => {
    const stages: Record<string, string> = {
      'visitor': 'Visitante',
      'lead': 'Lead',
      'qualified': 'Qualificado',
      'proposal': 'Proposta',
      'negotiation': 'Negociação',
      'closed': 'Fechado',
      'lost': 'Perdido'
    };
    return stages[stage || 'visitor'] || 'Visitante';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'pending': { label: 'Pendente', variant: 'outline' },
      'confirmed': { label: 'Confirmada', variant: 'default' },
      'paid': { label: 'Paga', variant: 'default' },
      'cancelled': { label: 'Cancelada', variant: 'destructive' }
    };
    const config = variants[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-96" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel de Afiliado</h1>
              <p className="text-gray-600 mt-1">Acompanhe o desempenho das suas indicações</p>
            </div>

            {/* Link de Afiliado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Seu Link de Afiliado
                </CardTitle>
                <CardDescription>
                  Compartilhe este link para receber comissões pelas vendas indicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={affiliateLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Indicações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-3xl font-bold">{stats.totalLeads}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.activeLeads} ativas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Comissões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-3xl font-bold">
                        R$ {stats.totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Total gerado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Comissões Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-3xl font-bold">
                        R$ {stats.pendingCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Comissões Pagas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-3xl font-bold">
                        R$ {stats.paidCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Já recebidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Funil de Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Funil de Indicações</CardTitle>
                <CardDescription>
                  Acompanhe o progresso dos seus leads através do funil PLG
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma indicação ainda</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Compartilhe seu link de afiliado para começar a receber indicações
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Etapa</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">
                            {lead.name || 'Não informado'}
                          </TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.company || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getStageLabel(lead.current_stage)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Navegar para detalhes do lead
                                navigate(`/admin/funil-plg?lead=${lead.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Comissões */}
            <Card>
              <CardHeader>
                <CardTitle>Comissões</CardTitle>
                <CardDescription>
                  Histórico de comissões geradas pelas suas indicações
                </CardDescription>
              </CardHeader>
              <CardContent>
                {commissions.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma comissão ainda</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Suas comissões aparecerão aqui quando suas indicações fecharem vendas
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor da Venda</TableHead>
                        <TableHead>Taxa</TableHead>
                        <TableHead>Comissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell className="font-medium">
                            {commission.plan_name}
                          </TableCell>
                          <TableCell>
                            R$ {Number(commission.plan_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{commission.commission_rate}%</TableCell>
                          <TableCell className="font-semibold">
                            R$ {Number(commission.commission_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{getStatusBadge(commission.status)}</TableCell>
                          <TableCell>
                            {new Date(commission.sale_date).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
