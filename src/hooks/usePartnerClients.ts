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

      // Buscar clientes criados por este parceiro
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, email, name, role, sector, created_at')
        .eq('role', 'cliente')
        .eq('created_by_partner', partnerId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar clientes:', fetchError);
        throw fetchError;
      }

      // Por enquanto, definir dados de maturidade como padrão
      const clientsWithMaturity: PartnerClient[] = (data || []).map((client) => {
        return {
          ...client,
          maturityScore: 0, // Será implementado quando a tabela maturity_assessments estiver disponível
          lastAssessment: undefined,
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
