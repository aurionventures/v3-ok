import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

// Dados mockados
const MOCK_COMMISSIONS = [
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

interface Commission {
  id: string;
  plan_name: string;
  plan_value: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  sale_date: string;
}

export default function AffiliateCommissions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0
  });

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      
      // Verificar se é o parceiro demo
      if (user?.email === 'parceiro@legacy.com') {
        setCommissions(MOCK_COMMISSIONS);
        setStats({
          total: MOCK_COMMISSIONS.reduce((sum, c) => sum + Number(c.commission_amount || 0), 0),
          pending: MOCK_COMMISSIONS
            .filter(c => c.status === 'pending' || c.status === 'confirmed')
            .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0),
          paid: MOCK_COMMISSIONS
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
        });
      } else {
        // Buscar dados reais do Supabase
        // Implementar quando necessário
      }
    } catch (error) {
      console.error('Erro ao carregar comissões:', error);
    } finally {
      setLoading(false);
    }
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
          <Header title="Comissões" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
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
        <Header title="Comissões" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comissões</h1>
              <p className="text-gray-600 mt-1">Histórico de comissões geradas pelas suas indicações</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        R$ {stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                        R$ {stats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                        R$ {stats.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Já recebidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Comissões */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Comissões</CardTitle>
                <CardDescription>
                  Detalhes de todas as comissões geradas pelas suas indicações
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
