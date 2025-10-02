import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface PartnerClient {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  sector: string | null;
  created_at: string | null;
  maturityScore?: number;
  lastAssessment?: Date;
}

export function usePartnerClients(partnerId: string) {
  const [clients, setClients] = useState<PartnerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!partnerId) {
        setClients([]);
        return;
      }

      // Buscar clientes criados por este parceiro usando JOIN com user_roles
      const { data, error: fetchError } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          name, 
          sector, 
          created_at,
          user_roles!inner(role)
        `)
        .eq('user_roles.role', 'cliente')
        .eq('created_by_partner', partnerId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar clientes:', fetchError);
        throw fetchError;
      }

      // Adicionar dados de maturidade fictícios realistas
      const maturityScores = [75, 62, 48, 85, 55, 71, 58, 82, 44, 67, 79, 53];
      const clientsWithMaturity: PartnerClient[] = (data || []).map((client, index) => {
        const daysAgo = Math.floor(Math.random() * 90); // 0-90 dias atrás
        const lastAssessment = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        return {
          id: client.id,
          email: client.email,
          name: client.name,
          role: 'cliente',
          sector: client.sector,
          created_at: client.created_at,
          maturityScore: maturityScores[index % maturityScores.length],
          lastAssessment: lastAssessment,
        };
      });

      setClients(clientsWithMaturity);
    } catch (err: any) {
      console.error('Erro ao buscar clientes do parceiro:', err);
      setError(err.message || 'Erro ao carregar clientes');
      toast({
        title: 'Erro',
        description: 'Falha ao carregar clientes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [partnerId]);

  const addClient = (newClient: PartnerClient) => {
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (clientId: string, updates: Partial<PartnerClient>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, ...updates } : client
      )
    );
  };

  const removeClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    removeClient,
  };
}
