import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// Dados mockados
const MOCK_LEADS = [
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

interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
  current_stage: string;
}

export default function AffiliateFunnel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    qualified: 0,
    proposal: 0,
    closed: 0
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      // Verificar se é o parceiro demo
      if (user?.email === 'parceiro@legacy.com') {
        setLeads(MOCK_LEADS);
        setStats({
          total: MOCK_LEADS.length,
          active: MOCK_LEADS.filter(l => l.current_stage !== 'lost').length,
          qualified: MOCK_LEADS.filter(l => l.current_stage === 'qualified').length,
          proposal: MOCK_LEADS.filter(l => l.current_stage === 'proposal').length,
          closed: MOCK_LEADS.filter(l => l.current_stage === 'closed').length
        });
      } else {
        // Buscar dados reais do Supabase
        // Implementar quando necessário
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
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

  const getStageBadge = (stage: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'visitor': 'outline',
      'lead': 'outline',
      'qualified': 'default',
      'proposal': 'default',
      'negotiation': 'default',
      'closed': 'default',
      'lost': 'destructive'
    };
    return <Badge variant={variants[stage] || 'outline'}>{getStageLabel(stage)}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Funil de Indicações" />
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
        <Header title="Funil de Indicações" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funil de Indicações</h1>
              <p className="text-gray-600 mt-1">Acompanhe o progresso dos seus leads através do funil PLG</p>
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
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Indicações Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-green-500" />
                    <p className="text-3xl font-bold">{stats.active}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Qualificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-purple-500" />
                    <p className="text-3xl font-bold">{stats.qualified}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Em Proposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-orange-500" />
                    <p className="text-3xl font-bold">{stats.proposal}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Indicações</CardTitle>
                <CardDescription>
                  Lista completa de todas as suas indicações e seu status atual
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
                            {getStageBadge(lead.current_stage)}
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigate(`/admin/plg-funnel?lead=${lead.id}`);
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
          </div>
        </main>
      </div>
    </div>
  );
}
