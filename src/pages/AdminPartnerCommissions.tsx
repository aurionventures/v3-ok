import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { usePartners, Partner } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  TrendingUp, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Loader2,
  Download
} from "lucide-react";

interface PartnerCommission {
  id: string;
  partner_id: string;
  affiliate_token: string | null;
  lead_id: string | null;
  user_id: string | null;
  org_id: string | null;
  plan_name: string;
  plan_value: number;
  billing_cycle: string;
  billing_term: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  sale_date: string;
  payment_date: string | null;
  commission_paid_date: string | null;
  notes: string | null;
  partner?: Partner;
}

const AdminPartnerCommissions = () => {
  const { partners } = usePartners();
  const [commissions, setCommissions] = useState<PartnerCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCommission, setSelectedCommission] = useState<PartnerCommission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCommissions();
  }, [selectedPartner, statusFilter]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('partner_commissions')
        .select('*')
        .order('sale_date', { ascending: false });

      if (selectedPartner !== 'all') {
        query = query.eq('partner_id', selectedPartner);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      // Se não houver dados no banco, usar dados mockados para demonstração
      let commissionsData = data || [];
      
      if (error || !data || data.length === 0) {
        // Dados mockados de comissões para o parceiro demo
        const mockCommissions: PartnerCommission[] = [
          {
            id: 'comm-1',
            partner_id: 'demo-partner-id-1',
            affiliate_token: 'aff_demo_parceiro_legacy_2024',
            lead_id: null,
            user_id: null,
            org_id: null,
            plan_name: 'Legacy 360',
            plan_value: 1500.00,
            billing_cycle: 'monthly',
            billing_term: 12,
            commission_rate: 10.00,
            commission_amount: 150.00,
            status: 'confirmed',
            sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            commission_paid_date: null,
            notes: 'Comissão de demonstração - Venda Legacy 360',
            partner: partners.find(p => p.email === 'parceiro@legacy.com') || partners[0]
          },
          {
            id: 'comm-2',
            partner_id: 'demo-partner-id-1',
            affiliate_token: 'aff_demo_parceiro_legacy_2024',
            lead_id: null,
            user_id: null,
            org_id: null,
            plan_name: 'Legacy 720',
            plan_value: 2500.00,
            billing_cycle: 'monthly',
            billing_term: 12,
            commission_rate: 10.00,
            commission_amount: 250.00,
            status: 'paid',
            sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            commission_paid_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Comissão de demonstração - Venda Legacy 720 (Já paga)',
            partner: partners.find(p => p.email === 'parceiro@legacy.com') || partners[0]
          }
        ];

        // Filtrar por parceiro e status se necessário
        let filteredCommissions = mockCommissions;
        
        if (selectedPartner !== 'all') {
          filteredCommissions = filteredCommissions.filter(c => c.partner_id === selectedPartner);
        }
        
        if (statusFilter !== 'all') {
          filteredCommissions = filteredCommissions.filter(c => c.status === statusFilter);
        }

        commissionsData = filteredCommissions as any;
      }

      // Enriquecer com dados do parceiro
      const enrichedCommissions = commissionsData.map(commission => {
        // Buscar parceiro por ID primeiro, se não encontrar, buscar por affiliate_token
        let partner = partners.find(p => p.id === commission.partner_id);
        if (!partner && commission.affiliate_token) {
          partner = partners.find(p => p.settings?.affiliate_token === commission.affiliate_token);
        }
        return { ...commission, partner };
      });

      setCommissions(enrichedCommissions as PartnerCommission[]);
    } catch (error: any) {
      console.error('Erro ao buscar comissões:', error);
      
      // Em caso de erro, ainda assim tentar usar dados mockados
      const mockCommissions: PartnerCommission[] = [
        {
          id: 'comm-1',
          partner_id: 'demo-partner-id-1',
          affiliate_token: 'aff_demo_parceiro_legacy_2024',
          lead_id: null,
          user_id: null,
          org_id: null,
          plan_name: 'Legacy 360',
          plan_value: 1500.00,
          billing_cycle: 'monthly',
          billing_term: 12,
          commission_rate: 10.00,
          commission_amount: 150.00,
          status: 'confirmed',
          sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          commission_paid_date: null,
          notes: 'Comissão de demonstração - Venda Legacy 360',
          partner: partners.find(p => p.email === 'parceiro@legacy.com') || partners[0]
        },
        {
          id: 'comm-2',
          partner_id: 'demo-partner-id-1',
          affiliate_token: 'aff_demo_parceiro_legacy_2024',
          lead_id: null,
          user_id: null,
          org_id: null,
          plan_name: 'Legacy 720',
          plan_value: 2500.00,
          billing_cycle: 'monthly',
          billing_term: 12,
          commission_rate: 10.00,
          commission_amount: 250.00,
          status: 'paid',
          sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          commission_paid_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Comissão de demonstração - Venda Legacy 720 (Já paga)',
          partner: partners.find(p => p.email === 'parceiro@legacy.com') || partners[0]
        }
      ];

      let filteredCommissions = mockCommissions;
      if (selectedPartner !== 'all') {
        filteredCommissions = filteredCommissions.filter(c => c.partner_id === selectedPartner);
      }
      if (statusFilter !== 'all') {
        filteredCommissions = filteredCommissions.filter(c => c.status === statusFilter);
      }

      setCommissions(filteredCommissions);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (commissionId: string, newStatus: 'confirmed' | 'paid' | 'cancelled') => {
    try {
      setUpdating(true);
      const updateData: Record<string, any> = { status: newStatus };

      if (newStatus === 'paid') {
        updateData.commission_paid_date = new Date().toISOString();
      }

      if (newStatus === 'confirmed' && !selectedCommission?.payment_date) {
        updateData.payment_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('partner_commissions')
        .update(updateData)
        .eq('id', commissionId);

      if (error) throw error;

      toast.success(`Comissão ${newStatus === 'paid' ? 'marcada como paga' : 'atualizada'}!`);
      setDetailsOpen(false);
      fetchCommissions();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar comissão');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'bg-amber-500/20 text-amber-600 border-amber-500/30' },
      confirmed: { label: 'Confirmada', className: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
      paid: { label: 'Paga', className: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' },
      cancelled: { label: 'Cancelada', className: 'bg-red-500/20 text-red-600 border-red-500/30' }
    };
    const cfg = config[status] || config.pending;
    return <Badge className={cfg.className}>{cfg.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Calcular estatísticas
  const stats = {
    totalCommissions: commissions.length,
    totalPending: commissions.filter(c => c.status === 'pending').length,
    totalConfirmed: commissions.filter(c => c.status === 'confirmed').length,
    totalPaid: commissions.filter(c => c.status === 'paid').length,
    totalCommissionAmount: commissions
      .filter(c => c.status === 'confirmed' || c.status === 'paid')
      .reduce((sum, c) => sum + c.commission_amount, 0),
    totalPaidAmount: commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commission_amount, 0),
    totalRevenue: commissions
      .filter(c => c.status === 'confirmed' || c.status === 'paid')
      .reduce((sum, c) => sum + c.plan_value, 0),
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Comissões de Parceiros" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Comissões</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stats.totalCommissions}</p>
                    )}
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total a Pagar</p>
                    {loading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalCommissionAmount)}</p>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Já Pagas</p>
                    {loading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalPaidAmount)}</p>
                    )}
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Gerada</p>
                    {loading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parceiro</label>
                  <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os parceiros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os parceiros</SelectItem>
                      {partners.map(partner => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.settings?.company_name || partner.company || partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="paid">Paga</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comissões</CardTitle>
              <CardDescription>Lista de todas as comissões registradas</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : commissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma comissão encontrada</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data da Venda</TableHead>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor da Venda</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>{formatDate(commission.sale_date)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {commission.partner?.settings?.company_name || commission.partner?.company || commission.partner?.name || 'N/A'}
                            </p>
                            {commission.partner?.email && (
                              <p className="text-xs text-muted-foreground">
                                {commission.partner.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{commission.plan_name}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(commission.plan_value)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(commission.commission_amount)}</p>
                            <p className="text-xs text-muted-foreground">{commission.commission_rate}%</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(commission.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCommission(commission);
                              setDetailsOpen(true);
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
        </main>
      </div>

      {/* Commission Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Comissão</DialogTitle>
            <DialogDescription>
              Informações completas da comissão e ações disponíveis
            </DialogDescription>
          </DialogHeader>

          {selectedCommission && (
            <div className="space-y-6 py-4">
              {/* Informações do Parceiro */}
              <div className="space-y-2">
                <h3 className="font-semibold">Parceiro</h3>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedCommission.partner?.settings?.company_name || selectedCommission.partner?.company || 'N/A'}
                  </p>
                  {selectedCommission.affiliate_token && (
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      Token: {selectedCommission.affiliate_token}
                    </p>
                  )}
                </div>
              </div>

              {/* Informações da Venda */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Plano</label>
                  <p className="font-medium">{selectedCommission.plan_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Valor da Venda</label>
                  <p className="font-medium">{formatCurrency(selectedCommission.plan_value)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Data da Venda</label>
                  <p>{formatDate(selectedCommission.sale_date)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div>{getStatusBadge(selectedCommission.status)}</div>
                </div>
              </div>

              {/* Informações da Comissão */}
              <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                <h3 className="font-semibold">Comissão</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Taxa</label>
                    <p className="text-lg font-bold">{selectedCommission.commission_rate}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Valor</label>
                    <p className="text-lg font-bold text-primary">{formatCurrency(selectedCommission.commission_amount)}</p>
                  </div>
                </div>
              </div>

              {/* Datas Importantes */}
              {selectedCommission.payment_date && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Data de Confirmação do Pagamento</label>
                  <p>{formatDate(selectedCommission.payment_date)}</p>
                </div>
              )}
              {selectedCommission.commission_paid_date && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Data de Pagamento da Comissão</label>
                  <p>{formatDate(selectedCommission.commission_paid_date)}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {selectedCommission?.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedCommission.id, 'confirmed')}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Confirmar Comissão
                </Button>
              )}
              {selectedCommission?.status === 'confirmed' && (
                <Button
                  onClick={() => handleUpdateStatus(selectedCommission.id, 'paid')}
                  disabled={updating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Marcar como Paga
                </Button>
              )}
              {selectedCommission?.status !== 'cancelled' && (
                <Button
                  variant="destructive"
                  onClick={() => handleUpdateStatus(selectedCommission.id, 'cancelled')}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                  Cancelar Comissão
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartnerCommissions;