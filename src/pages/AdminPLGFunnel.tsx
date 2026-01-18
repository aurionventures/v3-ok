/**
 * Dashboard Admin: Funil PLG (Product-Led Growth)
 * 
 * Visualização de métricas do funil de conversão:
 * ISCA → Descoberta → Contratação → Ativação
 */

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { usePartners } from '@/hooks/usePartners';
import { calculateCommission, PartnerTier } from '@/config/partnerTiers';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Target, 
  ArrowRight, RefreshCw, Download, Filter, Clock,
  Zap, CheckCircle, XCircle, AlertTriangle, Handshake,
  DollarSign, Globe, Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell
} from 'recharts';
import { 
  getMockPLGMetrics, 
  PLGMetrics, 
  FUNNEL_STAGE_LABELS, 
  FUNNEL_STAGE_COLORS 
} from '@/services/plgService';

// Cores do funil
const FUNNEL_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'
];

type OriginType = 'all' | 'ISCA' | 'DIRECT' | 'AFFILIATE';

interface OriginMetrics {
  origin: OriginType;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalMRR: number;
  totalCommissions: number;
  cac: number;
}

export default function AdminPLGFunnel() {
  const { partners } = usePartners();
  const [metrics, setMetrics] = useState<PLGMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [filterOrigin, setFilterOrigin] = useState<OriginType>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [originMetrics, setOriginMetrics] = useState<OriginMetrics[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
    loadContracts();
  }, [period, selectedPartner, filterOrigin]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Buscar leads com filtros de parceiro e origem
      let leadsQuery = supabase
        .from('plg_leads')
        .select('*');
      
      // Filtro por parceiro
      if (selectedPartner !== 'all') {
        const partner = partners.find(p => p.id === selectedPartner);
        if (partner) {
          const partnerId = partner.id;
          const affiliateToken = partner.settings?.affiliate_token;
          
          if (partnerId && affiliateToken) {
            leadsQuery = leadsQuery.or(
              `partner_id.eq.${partnerId},affiliate_token.eq.${affiliateToken}`
            );
          } else if (partnerId) {
            leadsQuery = leadsQuery.eq('partner_id', partnerId);
          } else if (affiliateToken) {
            leadsQuery = leadsQuery.eq('affiliate_token', affiliateToken);
          }
        }
      }
      
      // Filtro por origem
      if (filterOrigin !== 'all') {
        leadsQuery = leadsQuery.eq('origin', filterOrigin);
      }
      
      const { data: leads, error } = await leadsQuery;
      
      if (error) {
        console.error('Erro ao buscar leads:', error);
        // Fallback para mock
        setMetrics(getMockPLGMetrics());
        setLoading(false);
        return;
      }
      
      // Se houver leads, calcular métricas reais
      if (leads && leads.length > 0) {
        const filteredMetrics = calculateMetricsFromLeads(leads);
        setMetrics(filteredMetrics);
      } else {
        // Se não houver leads, usar mock
        setMetrics(getMockPLGMetrics());
      }
    } catch (error) {
      console.error('Erro ao carregar métricas PLG:', error);
      // Fallback para mock data
      setMetrics(getMockPLGMetrics());
    } finally {
      setLoading(false);
    }
  };

  // Carregar contratos para cálculo de comissões e MRR
  const loadContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, partner:partner_id(id, settings), partner_commissions(*)')
        .eq('status', 'active');
      
      if (error) {
        console.error('Erro ao buscar contratos:', error);
        setContracts([]);
        return;
      }
      
      setContracts(data || []);
      await calculateOriginMetrics(data || []);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      setContracts([]);
    }
  };

  // Calcular métricas por origem
  const calculateOriginMetrics = async (contractsData: any[]) => {
    try {
      // Buscar todos os leads para calcular por origem
      const { data: allLeads } = await supabase
        .from('plg_leads')
        .select('*');
      
      const leads = allLeads || [];
      
      // Agrupar por origem
      const origins: OriginType[] = ['ISCA', 'DIRECT', 'AFFILIATE'];
      const metricsByOrigin: OriginMetrics[] = [];
      
      for (const origin of origins) {
        const originLeads = leads.filter(l => l.origin === origin);
        const convertedLeads = originLeads.filter(l => 
          l.funnel_stage === 'activation_completed' || l.current_stage === 'closed'
        );
        
        // Buscar contratos desta origem
        const originContracts = contractsData.filter(c => {
          if (origin === 'AFFILIATE') {
            return c.partner_id || c.affiliate_token;
          } else if (origin === 'ISCA') {
            return c.origin === 'PLG' && !c.partner_id;
          } else {
            return c.origin === 'SLG' || (!c.partner_id && !c.affiliate_token);
          }
        });
        
        // Calcular MRR total
        const totalMRR = originContracts.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
        
        // Calcular comissões devidas (apenas para AFFILIATE)
        let totalCommissions = 0;
        if (origin === 'AFFILIATE') {
          for (const contract of originContracts) {
            if (contract.partner_id && contract.partner) {
              const partner = contract.partner;
              const tier = partner.settings?.partner_tier || 'tier_3_simple';
              // Vendas via afiliado são sempre 'originated' (geradas pelo parceiro)
              const saleOrigin = 'originated';
              const planValue = (contract.monthly_value || 0) * 12; // Assumindo anual
              
              const commission = calculateCommission(
                tier as PartnerTier,
                saleOrigin as 'originated' | 'received',
                planValue,
                0, // setupValue
                12 // billingTerm
              );
              
              totalCommissions += commission.totalCommission;
            }
          }
        }
        
        // Calcular CAC (assumindo investimento em marketing por origem)
        // CAC = Investimento em Marketing / Número de Clientes Convertidos
        const marketingSpend: Record<OriginType, number> = {
          'all': 0,
          'ISCA': 5000, // Investimento em quiz/marketing
          'DIRECT': 3000, // Investimento em vendas diretas
          'AFFILIATE': 0 // Sem investimento direto (comissão já contabilizada)
        };
        
        const cac = convertedLeads.length > 0 
          ? marketingSpend[origin] / convertedLeads.length 
          : 0;
        
        metricsByOrigin.push({
          origin,
          totalLeads: originLeads.length,
          convertedLeads: convertedLeads.length,
          conversionRate: originLeads.length > 0 
            ? (convertedLeads.length / originLeads.length) * 100 
            : 0,
          totalMRR,
          totalCommissions,
          cac
        });
      }
      
      setOriginMetrics(metricsByOrigin);
    } catch (error) {
      console.error('Erro ao calcular métricas por origem:', error);
    }
  };

  // Função auxiliar para calcular métricas a partir dos leads
  const calculateMetricsFromLeads = (leads: any[]): PLGMetrics => {
    // Contar leads por estágio
    const stageCounts: Record<string, number> = {
      'isca_started': 0,
      'isca_completed': 0,
      'discovery_completed': 0,
      'checkout_completed': 0,
      'payment_completed': 0,
      'activation_completed': 0,
    };

    leads.forEach(lead => {
      if (lead.funnel_stage) {
        const stage = lead.funnel_stage.toLowerCase();
        if (stage.includes('isca') && stage.includes('start')) stageCounts.isca_started++;
        if (stage.includes('isca') && stage.includes('complete')) stageCounts.isca_completed++;
        if (stage.includes('discovery')) stageCounts.discovery_completed++;
        if (stage.includes('checkout')) stageCounts.checkout_completed++;
        if (stage.includes('payment')) stageCounts.payment_completed++;
        if (stage.includes('activation')) stageCounts.activation_completed++;
      }
      
      // Também verificar current_stage
      if (lead.current_stage) {
        const currentStage = lead.current_stage.toLowerCase();
        if (currentStage === 'visitor' || currentStage === 'lead') stageCounts.isca_started++;
        if (currentStage === 'qualified') stageCounts.isca_completed++;
        if (currentStage === 'proposal') stageCounts.discovery_completed++;
        if (currentStage === 'negotiation') stageCounts.checkout_completed++;
        if (currentStage === 'closed') stageCounts.payment_completed++;
      }
    });

    // Retornar estrutura de métricas
    return {
      summary: {
        totalLeads: leads.length,
        convertedLeads: stageCounts.activation_completed,
        conversionRate: leads.length > 0 ? (stageCounts.activation_completed / leads.length) * 100 : 0,
        mrr: 0, // Calcular se houver dados de contratos
      },
      funnelStages: [
        { stage: 'isca_started', count: stageCounts.isca_started },
        { stage: 'isca_completed', count: stageCounts.isca_completed },
        { stage: 'discovery_completed', count: stageCounts.discovery_completed },
        { stage: 'checkout_completed', count: stageCounts.checkout_completed },
        { stage: 'payment_completed', count: stageCounts.payment_completed },
        { stage: 'activation_completed', count: stageCounts.activation_completed },
      ],
      conversionRates: [
        { fromStage: 'isca_started', toStage: 'isca_completed', rate: stageCounts.isca_started > 0 ? (stageCounts.isca_completed / stageCounts.isca_started) * 100 : 0 },
        { fromStage: 'isca_completed', toStage: 'discovery_completed', rate: stageCounts.isca_completed > 0 ? (stageCounts.discovery_completed / stageCounts.isca_completed) * 100 : 0 },
        { fromStage: 'discovery_completed', toStage: 'checkout_completed', rate: stageCounts.discovery_completed > 0 ? (stageCounts.checkout_completed / stageCounts.discovery_completed) * 100 : 0 },
        { fromStage: 'checkout_completed', toStage: 'payment_completed', rate: stageCounts.checkout_completed > 0 ? (stageCounts.payment_completed / stageCounts.checkout_completed) * 100 : 0 },
        { fromStage: 'payment_completed', toStage: 'activation_completed', rate: stageCounts.payment_completed > 0 ? (stageCounts.activation_completed / stageCounts.payment_completed) * 100 : 0 },
      ],
      dailyMetrics: [], // Implementar se necessário
      planDistribution: {}, // Implementar se necessário
    };
  };

  if (loading || !metrics) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard de Funil PLG" />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Preparar dados do funil para o gráfico
  const funnelData = metrics.funnelStages.map((stage, index) => ({
    name: FUNNEL_STAGE_LABELS[stage.stage] || stage.stage,
    value: stage.count,
    fill: FUNNEL_COLORS[index % FUNNEL_COLORS.length]
  }));

  // Preparar dados de conversão
  const conversionData = metrics.conversionRates.map(rate => ({
    name: `${FUNNEL_STAGE_LABELS[rate.fromStage]?.split(' ')[0] || rate.fromStage} → ${FUNNEL_STAGE_LABELS[rate.toStage]?.split(' ')[0] || rate.toStage}`,
    rate: rate.rate
  }));

  // Preparar dados diários para gráfico de área
  const dailyData = metrics.dailyMetrics.map(day => ({
    date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    'ISCA Iniciada': day.iscaStarted,
    'ISCA Completa': day.iscaCompleted,
    'Descoberta': day.discoveryCompleted,
    'Checkout': day.checkoutCompleted,
    'Pagamento': day.paymentCompleted,
    'Ativação': day.activationCompleted,
  }));

  // Preparar dados de distribuição de planos
  const planData = Object.entries(metrics.planDistribution).map(([plan, count]) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: count
  }));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard de Funil PLG" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Leads</p>
                    <p className="text-3xl font-bold">{metrics.summary.totalLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+12%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads Convertidos</p>
                    <p className="text-3xl font-bold">{metrics.summary.convertedLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+8%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                    <p className="text-3xl font-bold">{metrics.summary.overallConversionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">+2.3%</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Score Médio ISCA</p>
                    <p className="text-3xl font-bold">{metrics.summary.avgGovMetrixScore || '-'}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500">-3</span>
                  <span className="text-muted-foreground ml-1">vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas por Origem */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={filterTier} onValueChange={setFilterTier}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo (Tier)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tiers</SelectItem>
                    <SelectItem value="tier_1_commercial">Tier 1 - Comercial</SelectItem>
                    <SelectItem value="tier_2_qualified">Tier 2 - Qualificado</SelectItem>
                    <SelectItem value="tier_3_simple">Tier 3 - Simples</SelectItem>
                    <SelectItem value="tier_4_premium">Tier 4 - Premium</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterOrigin} onValueChange={(v) => setFilterOrigin(v as OriginType)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Origens</SelectItem>
                    <SelectItem value="ISCA">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        ISCA (Quiz)
                      </div>
                    </SelectItem>
                    <SelectItem value="DIRECT">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Venda Direta
                      </div>
                    </SelectItem>
                    <SelectItem value="AFFILIATE">
                      <div className="flex items-center gap-2">
                        <Handshake className="h-4 w-4" />
                        Parceiro/Afiliado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todos os parceiros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Todos os parceiros
                      </div>
                    </SelectItem>
                    {partners.map(partner => (
                      <SelectItem key={partner.id} value={partner.id}>
                        <div className="flex items-center gap-2">
                          <Handshake className="h-4 w-4" />
                          {partner.settings?.company_name || partner.company || partner.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Últimas 24h</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={loadMetrics}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {originMetrics.map((metric) => {
                  const originLabels: Record<OriginType, { label: string; icon: any; color: string }> = {
                    'all': { label: 'Todas', icon: Users, color: 'bg-gray-500' },
                    'ISCA': { label: 'ISCA (Quiz)', icon: Zap, color: 'bg-blue-500' },
                    'DIRECT': { label: 'Venda Direta', icon: Building2, color: 'bg-purple-500' },
                    'AFFILIATE': { label: 'Parceiro/Afiliado', icon: Handshake, color: 'bg-amber-500' }
                  };
                  
                  const config = originLabels[metric.origin];
                  const Icon = config.icon;
                  
                  return (
                    <Card key={metric.origin} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-base">{config.label}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Leads</p>
                            <p className="font-bold text-lg">{metric.totalLeads}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Convertidos</p>
                            <p className="font-bold text-lg text-emerald-600">{metric.convertedLeads}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Conversão</p>
                            <p className="font-bold text-lg">{metric.conversionRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">MRR</p>
                            <p className="font-bold text-lg text-primary">
                              R$ {metric.totalMRR.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Comissões Devidas</p>
                            <p className="font-bold text-lg text-amber-600">
                              R$ {metric.totalCommissions.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">CAC</p>
                            <p className="font-bold text-lg text-blue-600">
                              R$ {metric.cac.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tabs de conteúdo */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="funnel">Funil Detalhado</TabsTrigger>
              <TabsTrigger value="leads">Leads Recentes</TabsTrigger>
              <TabsTrigger value="plans">Distribuição de Planos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Gráfico de área - Volume por dia */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume de Leads por Dia</CardTitle>
                  <CardDescription>Evolução do funil ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="ISCA Iniciada" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="ISCA Completa" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Descoberta" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Checkout" stackId="1" stroke="#d946ef" fill="#d946ef" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Pagamento" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Ativação" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de barras - Taxas de conversão */}
              <Card>
                <CardHeader>
                  <CardTitle>Taxas de Conversão por Etapa</CardTitle>
                  <CardDescription>Percentual de leads que avançam entre etapas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={conversionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="rate" fill="#8b5cf6">
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rate >= 70 ? '#22c55e' : entry.rate >= 50 ? '#eab308' : '#f43f5e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-6">
              {/* Funil visual */}
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Conversão PLG</CardTitle>
                  <CardDescription>ISCA → Descoberta → Contratação → Ativação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.funnelStages.map((stage, index) => {
                      const prevCount = index > 0 ? metrics.funnelStages[index - 1].count : stage.count;
                      const conversionRate = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : 100;
                      const widthPercent = metrics.funnelStages[0].count > 0 
                        ? (stage.count / metrics.funnelStages[0].count) * 100 
                        : 0;

                      return (
                        <div key={stage.stage} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: FUNNEL_COLORS[index], color: FUNNEL_COLORS[index] }}
                              >
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{FUNNEL_STAGE_LABELS[stage.stage]}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold">{stage.count} leads</span>
                              {index > 0 && (
                                <Badge variant={conversionRate >= 70 ? "default" : conversionRate >= 50 ? "secondary" : "destructive"}>
                                  {conversionRate}% conversão
                                </Badge>
                              )}
                              {stage.avgScore && (
                                <span className="text-muted-foreground text-xs">
                                  Score médio: {stage.avgScore}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-8 bg-muted rounded-lg overflow-hidden">
                            <div 
                              className="h-full rounded-lg transition-all duration-500"
                              style={{ 
                                width: `${widthPercent}%`,
                                backgroundColor: FUNNEL_COLORS[index]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Drop-off Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Abandono</CardTitle>
                  <CardDescription>Onde os leads estão abandonando o funil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.conversionRates.map((rate, index) => {
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
                            <Progress value={dropOff} className="mt-2 h-2" />
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${isHighDropOff ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {dropOff.toFixed(0)}%
                            </p>
                            <p className="text-xs text-muted-foreground">abandonam</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              {/* Leads recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Leads Recentes</CardTitle>
                  <CardDescription>Últimos leads que entraram no funil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentLeads.map((lead) => {
                      const stageIndex = metrics.funnelStages.findIndex(s => s.stage === lead.funnel_stage);
                      const isConverted = lead.funnel_stage === 'activation_completed';
                      
                      return (
                        <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.company}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {lead.govmetrix_score && (
                              <div className="text-center">
                                <p className="text-sm font-medium">{lead.govmetrix_score}</p>
                                <p className="text-xs text-muted-foreground">Score</p>
                              </div>
                            )}
                            
                            <Badge 
                              variant={isConverted ? "default" : "outline"}
                              style={{ 
                                borderColor: FUNNEL_COLORS[stageIndex],
                                color: isConverted ? undefined : FUNNEL_COLORS[stageIndex],
                                backgroundColor: isConverted ? '#22c55e' : undefined
                              }}
                            >
                              {FUNNEL_STAGE_LABELS[lead.funnel_stage]}
                            </Badge>
                            
                            <div className="text-right text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(lead.created_at).toLocaleString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              {/* Distribuição de planos */}
              <Card>
                <CardHeader>
                  <CardTitle>Planos Recomendados</CardTitle>
                  <CardDescription>Distribuição de planos recomendados pelo quiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={planData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6">
                          {planData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cards por plano */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {planData.map((plan, index) => (
                  <Card key={plan.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{plan.name}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }}
                        />
                      </div>
                      <p className="text-2xl font-bold">{plan.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {((plan.value / metrics.summary.totalLeads) * 100).toFixed(1)}% do total
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
