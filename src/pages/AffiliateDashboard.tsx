import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { FUNNEL_STAGE_LABELS, PLGMetrics } from '@/services/plgService';

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

// Dados mockados para demonstração
const MOCK_AFFILIATE_TOKEN = 'aff_demo_parceiro_legacy_2024';
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    email: 'cliente1@exemplo.com',
    name: 'João Silva',
    company: 'Empresa ABC Ltda',
    status: 'qualified',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    current_stage: 'qualified'
  },
  {
    id: 'lead-2',
    email: 'cliente2@exemplo.com',
    name: 'Maria Santos',
    company: 'Tech Solutions S.A.',
    status: 'proposal',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    current_stage: 'proposal'
  }
];

const MOCK_COMMISSIONS: Commission[] = [
  {
    id: 'comm-1',
    plan_name: 'Legacy 360',
    plan_value: 1500.00,
    commission_rate: 10,
    commission_amount: 150.00,
    status: 'confirmed',
    sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-2',
    plan_name: 'Legacy 720',
    plan_value: 2500.00,
    commission_rate: 10,
    commission_amount: 250.00,
    status: 'paid',
    sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Dados mockados do funil PLG filtrados por parceiro
const MOCK_PARTNER_FUNNEL_METRICS: Partial<PLGMetrics> = {
  funnelStages: [
    { stage: 'isca_started', count: 12, avgScore: null },
    { stage: 'isca_completed', count: 8, avgScore: 58 },
    { stage: 'discovery_started', count: 6, avgScore: 62 },
    { stage: 'discovery_completed', count: 4, avgScore: 65 },
    { stage: 'checkout_started', count: 3, avgScore: 68 },
    { stage: 'checkout_completed', count: 2, avgScore: 70 },
    { stage: 'payment_started', count: 2, avgScore: 72 },
    { stage: 'payment_completed', count: 2, avgScore: 74 },
    { stage: 'activation_started', count: 2, avgScore: 75 },
    { stage: 'activation_completed', count: 2, avgScore: 76 },
  ],
  conversionRates: [
    { fromStage: 'isca_started', toStage: 'isca_completed', rate: 67 },
    { fromStage: 'isca_completed', toStage: 'discovery_started', rate: 75 },
    { fromStage: 'discovery_started', toStage: 'discovery_completed', rate: 67 },
    { fromStage: 'discovery_completed', toStage: 'checkout_started', rate: 75 },
    { fromStage: 'checkout_started', toStage: 'checkout_completed', rate: 67 },
    { fromStage: 'checkout_completed', toStage: 'payment_started', rate: 100 },
    { fromStage: 'payment_started', toStage: 'payment_completed', rate: 100 },
    { fromStage: 'payment_completed', toStage: 'activation_started', rate: 100 },
    { fromStage: 'activation_started', toStage: 'activation_completed', rate: 100 },
  ],
};

const FUNNEL_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'
];

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user) {
      toast.error('Usuário não autenticado');
      navigate('/login');
      return;
    }
    loadAffiliateData();
  }, [user]);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);

      if (!user) {
        toast.error('Usuário não autenticado');
        navigate('/login');
        return;
      }

      // Verificar se é o parceiro demo (mockUsers)
      const isDemoPartner = user.email === 'parceiro@legacy.com';

      if (isDemoPartner) {
        // Usar dados mockados para demonstração
        const token = MOCK_AFFILIATE_TOKEN;
        setAffiliateToken(token);
        setAffiliateLink(`${window.location.origin}/plan-discovery?ref=${token}`);
        setLeads(MOCK_LEADS);
        setCommissions(MOCK_COMMISSIONS);

        // Calcular estatísticas
        const totalLeads = MOCK_LEADS.length;
        const activeLeads = MOCK_LEADS.filter(l => l.current_stage !== 'lost').length;
        const totalCommissions = MOCK_COMMISSIONS.reduce(
          (sum, c) => sum + Number(c.commission_amount || 0), 
          0
        );
        const pendingCommissions = MOCK_COMMISSIONS
          .filter(c => c.status === 'pending' || c.status === 'confirmed')
          .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
        const paidCommissions = MOCK_COMMISSIONS
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

        setStats({
          totalLeads,
          activeLeads,
          totalCommissions,
          pendingCommissions,
          paidCommissions
        });
      } else {
        // Buscar dados reais do Supabase
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (!supabaseUser) {
          // Se não encontrar no Supabase Auth, tentar usar o user do contexto
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
        } else {
          // Buscar token de afiliado do parceiro
          const { data: partnerSettings } = await supabase
            .from('partner_settings')
            .select('affiliate_token')
            .eq('user_id', supabaseUser.id)
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
            .or(`partner_id.eq.${supabaseUser.id},affiliate_token.eq.${token}`)
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
            .eq('partner_id', supabaseUser.id)
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
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do afiliado:', error);
      toast.error('Erro ao carregar dados do afiliado');
    } finally {
      setLoading(false);
    }
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

            {/* Funil PLG */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Funil de Conversão PLG
                </CardTitle>
                <CardDescription>
                  Acompanhe as etapas e o desempenho dos seus leads através do funil PLG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_PARTNER_FUNNEL_METRICS.funnelStages?.map((stage, index) => {
                    const prevCount = index > 0 
                      ? (MOCK_PARTNER_FUNNEL_METRICS.funnelStages?.[index - 1]?.count || 0) 
                      : stage.count;
                    const conversionRate = prevCount > 0 
                      ? Math.round((stage.count / prevCount) * 100) 
                      : 100;
                    const widthPercent = MOCK_PARTNER_FUNNEL_METRICS.funnelStages?.[0]?.count 
                      ? (stage.count / MOCK_PARTNER_FUNNEL_METRICS.funnelStages[0].count) * 100 
                      : 0;

                    return (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length], 
                                color: FUNNEL_COLORS[index % FUNNEL_COLORS.length] 
                              }}
                            >
                              {index + 1}
                            </Badge>
                            <span className="font-medium">
                              {FUNNEL_STAGE_LABELS[stage.stage] || stage.stage}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">{stage.count} leads</span>
                            {index > 0 && (
                              <Badge 
                                variant={
                                  conversionRate >= 70 ? "default" : 
                                  conversionRate >= 50 ? "secondary" : 
                                  "destructive"
                                }
                              >
                                {conversionRate}% conversão
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            className="h-full rounded-lg transition-all duration-500"
                            style={{ 
                              width: `${widthPercent}%`,
                              backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Análise de Conversão */}
            {MOCK_PARTNER_FUNNEL_METRICS.conversionRates && MOCK_PARTNER_FUNNEL_METRICS.conversionRates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão entre Etapas</CardTitle>
                  <CardDescription>
                    Monitoramento da conversão entre cada etapa do funil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_PARTNER_FUNNEL_METRICS.conversionRates.map((rate, index) => {
                      const dropOff = 100 - rate.rate;
                      const isHighDropOff = dropOff > 30;
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {FUNNEL_STAGE_LABELS[rate.fromStage]} → {FUNNEL_STAGE_LABELS[rate.toStage]}
                              </span>
                              {isHighDropOff && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <Progress value={rate.rate} className="mt-2 h-2" />
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${isHighDropOff ? 'text-amber-500' : 'text-green-600'}`}>
                              {rate.rate}%
                            </p>
                            <p className="text-xs text-gray-500">taxa de conversão</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
