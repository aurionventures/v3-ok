import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { ContactClientModal } from '@/components/modals/ContactClientModal';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, TrendingUp, Search, Eye, MessageSquare, Phone, Plus, FileText } from 'lucide-react';
import { usePartnerClients } from '@/hooks/usePartnerClients';

export default function BancaDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactModal, setContactModal] = useState<{ open: boolean; client: any }>({
    open: false,
    client: null
  });
  const { toast } = useToast();

  // Buscar clientes do parceiro do banco de dados
  const { clients, loading, addClient } = usePartnerClients(user?.id || '');

  // Filter clients based on search term
  const parceiroClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMaturityBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Avançado', color: 'text-green-600' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Sólido', color: 'text-blue-600' };
    if (score >= 40) return { variant: 'outline' as const, label: 'Em Desenvolvimento', color: 'text-yellow-600' };
    return { variant: 'destructive' as const, label: 'Inicial', color: 'text-red-600' };
  };

  const averageMaturity = parceiroClients.length > 0 
    ? parceiroClients.reduce((acc, client) => acc + (client.maturityScore || 0), 0) / parceiroClients.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Dashboard do Parceiro</h1>
            {clients.length > 0 && clients[0].id.startsWith('mock-') && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                🎭 Modo Demonstração
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Bem-vindo, <span className="font-semibold">{user?.name}</span>
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : parceiroClients.length}</div>
              <p className="text-xs text-muted-foreground">
                Empresas ativas na carteira
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maturidade Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `${Math.round(averageMaturity)}%`}</div>
              <p className="text-xs text-muted-foreground">
                Índice geral da carteira
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Recentes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : parceiroClients.filter(c => c.lastAssessment && 
                  new Date().getTime() - c.lastAssessment.getTime() < 30 * 24 * 60 * 60 * 1000
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Carteira de Clientes</CardTitle>
                <CardDescription>
                  Gerencie e acompanhe o progresso dos seus clientes
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parceiroClients.map((client) => {
                const maturityBadge = getMaturityBadge(client.maturityScore || 0);
                return (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.sector}</div>
                        {client.lastAssessment && (
                          <div className="text-xs text-muted-foreground">
                            Último assessment: {client.lastAssessment.toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${maturityBadge.color}`}>
                          {client.maturityScore}%
                        </div>
                        <Badge variant={maturityBadge.variant} className="text-xs">
                          {maturityBadge.label}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/parceiro/cliente/${client.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setContactModal({ open: true, client })}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contatar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {parceiroClients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhuma empresa encontrada com esse termo.' : 'Nenhuma empresa na carteira.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nova Empresa
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: 'Relatório', description: 'Gerando relatório consolidado...' })}
              >
                <FileText className="h-4 w-4 mr-2" />
                Relatório Consolidado
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: 'Agenda', description: 'Abrindo calendário de reuniões...' })}
              >
                <Phone className="h-4 w-4 mr-2" />
                Agendar Reuniões
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Insights da Carteira</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Empresas com alta maturidade (≥80%)</span>
                  <span className="font-semibold">
                    {parceiroClients.filter(c => (c.maturityScore || 0) >= 80).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Empresas que precisam de atenção (≤40%)</span>
                  <span className="font-semibold text-red-600">
                    {parceiroClients.filter(c => (c.maturityScore || 0) <= 40).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Setor predominante</span>
                  <span className="font-semibold">
                    {parceiroClients.length > 0 
                      ? parceiroClients.reduce((acc, client) => {
                          acc[client.sector] = (acc[client.sector] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)[
                          Object.keys(parceiroClients.reduce((acc, client) => {
                            acc[client.sector] = (acc[client.sector] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)).reduce((a, b) => 
                            parceiroClients.reduce((acc, client) => {
                              acc[client.sector] = (acc[client.sector] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)[a] > parceiroClients.reduce((acc, client) => {
                              acc[client.sector] = (acc[client.sector] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)[b] ? a : b
                          )
                        ] 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientAdded={addClient}
      />

      <ContactClientModal
        open={contactModal.open}
        onOpenChange={(open) => setContactModal(prev => ({ ...prev, open }))}
        client={contactModal.client}
      />
    </div>
  );
}