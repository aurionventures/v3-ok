import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  MarketThreat, 
  MarketOpportunity, 
  AgendaSuggestion, 
  CompetitorInsight, 
  SectorTrend,
  CompanyContext 
} from '@/types/riskIntelligence';
import { 
  mockThreats, 
  mockOpportunities, 
  mockAgendaSuggestions, 
  mockCompetitors, 
  mockSectorTrends 
} from '@/data/marketIntelligenceData';
import { useMeetings } from './useMeetings';
import { useMeetingItems } from './useMeetingItems';

export const useRiskIntelligence = () => {
  const { toast } = useToast();
  const { createMeeting } = useMeetings();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const [companyContext, setCompanyContext] = useState<CompanyContext>({
    sector: 'Comércio - Varejo',
    segment: 'Varejo de Moda Feminina',
    region: 'Sudeste',
    mainCompetitors: ['Renner', 'C&A', 'Riachuelo', 'Zara', 'Shein'],
    companySize: 'media',
    focusAreas: ['Moda Feminina', 'E-commerce', 'Fast Fashion', 'Sustentabilidade'],
    strategicKeywords: ['omnichannel', 'fast fashion', 'sustentabilidade', 'marketplace', 'social commerce']
  });

  const [threats, setThreats] = useState<MarketThreat[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [agendaSuggestions, setAgendaSuggestions] = useState<AgendaSuggestion[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorInsight[]>([]);
  const [sectorTrends, setSectorTrends] = useState<SectorTrend[]>([]);

  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const analyzeMarket = useCallback(async () => {
    setIsAnalyzing(true);

    // Simula processamento de IA com delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Importar sectorDataMap dinamicamente
    const { sectorDataMap } = await import('@/data/marketIntelligenceData');
    
    // Obter dados do setor selecionado (fallback para Varejo se não encontrar)
    const sectorData = sectorDataMap[companyContext.sector] || sectorDataMap['Comércio - Varejo'];

    setThreats(sectorData.threats);
    setOpportunities(sectorData.opportunities);
    setAgendaSuggestions(sectorData.agendaSuggestions);
    setCompetitors(sectorData.competitors);
    setSectorTrends(sectorData.sectorTrends);

    setHasAnalyzed(true);
    setIsAnalyzing(false);

    toast({
      title: 'Análise Concluída',
      description: `Análise do setor ${companyContext.sector} concluída. Identificadas ${sectorData.threats.length} ameaças, ${sectorData.opportunities.length} oportunidades e ${sectorData.agendaSuggestions.length} sugestões de pauta.`,
    });
  }, [companyContext.sector, toast]);

  const createAgendaFromSuggestion = useCallback(
    async (suggestion: AgendaSuggestion, councilId: string, meetingId?: string) => {
      try {
        // Para demonstração: simular criação de reunião
        // Em produção real, usaria createMeeting do hook useMeetings
        
        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar data da reunião (7 dias a partir de hoje)
        const meetingDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const formattedDate = meetingDate.toLocaleDateString('pt-BR');
        
        // Mapear tipo de órgão para nome
        const organTypeMap = {
          'conselho': 'Conselho de Administração',
          'comite': 'Comitê Estratégico',
          'comissao': 'Comissão de Ética'
        };
        const organName = organTypeMap[suggestion.suggestedOrgan] || 'Órgão de Governança';

        toast({
          title: 'Reunião Criada com Sucesso!',
          description: `A pauta "${suggestion.title}" foi adicionada à reunião do ${organName} agendada para ${formattedDate} às 14:00. Acesse o Calendário de Reuniões para visualizar.`,
        });

        return { success: true, meetingId: `mock-meeting-${Date.now()}` };
      } catch (error: any) {
        toast({
          title: 'Erro ao Criar Pauta',
          description: error.message || 'Ocorreu um erro ao criar a pauta.',
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
    },
    [toast]
  );

  const filteredThreats = selectedSource === 'all' 
    ? threats 
    : threats.filter(t => t.source === selectedSource);

  const filteredOpportunities = selectedSource === 'all'
    ? opportunities
    : opportunities.filter(o => o.source === selectedSource);

  const filteredAgendaSuggestions = selectedPriority === 'all'
    ? agendaSuggestions
    : agendaSuggestions.filter(a => a.priority === selectedPriority);

  return {
    companyContext,
    setCompanyContext,
    threats: filteredThreats,
    opportunities: filteredOpportunities,
    agendaSuggestions: filteredAgendaSuggestions,
    competitors,
    sectorTrends,
    isAnalyzing,
    hasAnalyzed,
    analyzeMarket,
    createAgendaFromSuggestion,
    selectedSource,
    setSelectedSource,
    selectedPriority,
    setSelectedPriority,
  };
};
