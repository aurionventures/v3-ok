import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Users, 
  Building2, 
  TrendingUp, 
  Mail, 
  Phone,
  MoreHorizontal,
  Eye,
  MessageSquare
} from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { ContactClientModal } from '@/components/modals/ContactClientModal';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerClients } from '@/hooks/usePartnerClients';

export const ParceiroClientes = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactModal, setContactModal] = useState<{ open: boolean; client: any }>({
    open: false,
    client: null
  });
  const { toast } = useToast();

  // Buscar clientes do parceiro do banco de dados
  const { clients, loading, addClient } = usePartnerClients(user?.id || '');

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Remover função handleAddClient pois agora usamos addClient do hook

  const handleContactClient = (client: any) => {
    setContactModal({ open: true, client });
  };

  const getMaturityColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMaturityLabel = (score: number) => {
    if (score >= 70) return 'Alto';
    if (score >= 50) return 'Médio';
    return 'Baixo';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h1>
              {clients.length > 0 && clients[0].id.startsWith('mock-') && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                  🎭 Modo Demonstração
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Gerencie sua carteira de clientes e acompanhe o progresso em governança
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">+2 neste mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maturidade Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(clients.reduce((acc, client) => acc + client.maturityScore, 0) / clients.length)}%
              </div>
              <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : clients.length}</div>
              <p className="text-xs text-muted-foreground">100% dos clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Carteira de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Carregando clientes...</div>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
                  </div>
                </div>
              ) : (
                filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{client.name}</h3>
                        <Badge variant="outline">{client.sector}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                      </div>
                    </div>


                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Maturidade</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getMaturityColor(client.maturityScore)}`} />
                        <span className="font-medium">{client.maturityScore}%</span>
                        <Badge variant="secondary" className="text-xs">
                          {getMaturityLabel(client.maturityScore)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: 'Detalhes', description: `Visualizando ${client.name}` })}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleContactClient(client)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contatar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
};