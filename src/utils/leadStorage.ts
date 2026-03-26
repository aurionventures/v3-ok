import { MaturityResult } from '@/types/maturity';

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  revenue: string;
  size: string;
  timestamp: Date;
  maturityResult?: MaturityResult;
  companyData?: Record<string, any>;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

// Simular armazenamento de leads
export const saveLeadData = (leadData: Omit<LeadData, 'id' | 'timestamp' | 'status'>): LeadData => {
  const lead: LeadData = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...leadData,
    timestamp: new Date(),
    status: 'new'
  };

  // Salvar no localStorage para simular backend
  const existingLeads = getStoredLeads();
  const updatedLeads = [lead, ...existingLeads.slice(0, 99)]; // Manter só os últimos 100
  localStorage.setItem('diagnostic_leads', JSON.stringify(updatedLeads));

  return lead;
};

export const getStoredLeads = (): LeadData[] => {
  try {
    const stored = localStorage.getItem('diagnostic_leads');
    if (!stored) {
      // Inicializar com dados mockados
      initializeMockLeads();
      return getStoredLeads();
    }
    return JSON.parse(stored).map((lead: any) => ({
      ...lead,
      timestamp: new Date(lead.timestamp)
    }));
  } catch (error) {
    console.error('Erro ao recuperar leads:', error);
    return [];
  }
};

export const updateLeadStatus = (leadId: string, status: LeadData['status']): void => {
  const leads = getStoredLeads();
  const updatedLeads = leads.map(lead => 
    lead.id === leadId ? { ...lead, status } : lead
  );
  localStorage.setItem('diagnostic_leads', JSON.stringify(updatedLeads));
};

// Simular envio de email
export const sendDiagnosticEmail = async (
  leadData: LeadData, 
  maturityResult: MaturityResult
): Promise<boolean> => {
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Log do email que seria enviado (para desenvolvimento)
  console.log('📧 EMAIL ENVIADO (SIMULADO):', {
    to: leadData.email,
    subject: `${leadData.name}, seu diagnóstico de maturidade em governança está pronto!`,
    content: {
      greeting: `Olá ${leadData.name},`,
      score: `Sua empresa ${leadData.company} obteve ${(maturityResult.pontuacao_total * 100).toFixed(1)}% de maturidade em governança.`,
      stage: `Nível atual: ${maturityResult.estagio}`,
      nextSteps: 'Nossa equipe entrará em contato para apresentar como podemos ajudar a elevar ainda mais sua governança.',
      contact: 'WhatsApp: (11) 94978-3636 | Email: contato@legacygovernance.com.br'
    }
  });

  // Simular sucesso (95% das vezes)
  return Math.random() > 0.05;
};

// Dados mockados para desenvolvimento
const initializeMockLeads = (): void => {
  const mockLeads: LeadData[] = [
    {
      id: 'lead_mock_1',
      name: 'João Silva',
      email: 'joao.silva@empresafamiliar.com.br',
      phone: '(11) 99999-1234',
      company: 'Grupo Silva Holdings',
      sector: 'industria',
      revenue: '4-8mi-300mi',
      size: 'grande',
      timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
      status: 'new',
      maturityResult: {
        pontuacao_total: 0.65,
        estagio: 'Sólido',
        pontuacao_dimensoes: {
          'Sócios': 0.7,
          'Conselho': 0.6,
          'Diretoria': 0.65,
          'Órgãos de fiscalização e controle': 0.5,
          'Conduta e conflitos de interesses': 0.8
        },
        pontuacao_indicadores: {},
        pontuacao_empresas_controle_concentrado: { percentual: 0.72 }
      }
    },
    {
      id: 'lead_mock_2',
      name: 'Maria Fernandes',
      email: 'maria@fernandes-advogados.com.br',
      phone: '(11) 98888-5678',
      company: 'Fernandes & Associados',
      sector: 'financeiro',
      revenue: '360k-4-8mi',
      size: 'media',
      timestamp: new Date(Date.now() - 172800000), // 2 dias atrás
      status: 'contacted',
      maturityResult: {
        pontuacao_total: 0.45,
        estagio: 'Básico',
        pontuacao_dimensoes: {
          'Sócios': 0.5,
          'Conselho': 0.4,
          'Diretoria': 0.45,
          'Órgãos de fiscalização e controle': 0.3,
          'Conduta e conflitos de interesses': 0.6
        },
        pontuacao_indicadores: {},
        pontuacao_empresas_controle_concentrado: { percentual: 0.48 }
      }
    },
    {
      id: 'lead_mock_3',
      name: 'Carlos Oliveira',
      email: 'carlos@grupoliveira.com.br',
      phone: '(11) 97777-9012',
      company: 'Grupo Oliveira',
      sector: 'agronegocio',
      revenue: 'acima-300mi',
      size: 'grande',
      timestamp: new Date(Date.now() - 259200000), // 3 dias atrás
      status: 'qualified'
    }
  ];

  localStorage.setItem('diagnostic_leads', JSON.stringify(mockLeads));
};

// Estatísticas para dashboard admin
export interface LeadStats {
  total: number;
  newLeads: number;
  contacted: number;
  qualified: number;
  converted: number;
  conversionRate: number;
  averageMaturityScore: number;
}

export const getLeadStats = (): LeadStats => {
  const leads = getStoredLeads();
  
  const stats = leads.reduce((acc, lead) => {
    acc.total++;
    acc[lead.status]++;
    if (lead.maturityResult) {
      acc.maturityScores.push(lead.maturityResult.pontuacao_total);
    }
    return acc;
  }, {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    maturityScores: [] as number[]
  });

  const conversionRate = stats.total > 0 ? (stats.converted / stats.total) * 100 : 0;
  const averageMaturityScore = stats.maturityScores.length > 0 
    ? stats.maturityScores.reduce((sum, score) => sum + score, 0) / stats.maturityScores.length
    : 0;

  return {
    total: stats.total,
    newLeads: stats.new,
    contacted: stats.contacted,
    qualified: stats.qualified,
    converted: stats.converted,
    conversionRate,
    averageMaturityScore: averageMaturityScore * 100
  };
};