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

    setThreats(mockThreats);
    setOpportunities(mockOpportunities);
    setAgendaSuggestions(mockAgendaSuggestions);
    setCompetitors(mockCompetitors);
    setSectorTrends(mockSectorTrends);

    setHasAnalyzed(true);
    setIsAnalyzing(false);

    toast({
      title: 'Análise Concluída',
      description: `Identificadas ${mockThreats.length} ameaças, ${mockOpportunities.length} oportunidades e ${mockAgendaSuggestions.length} sugestões de pauta.`,
    });
  }, [toast]);

  const createAgendaFromSuggestion = useCallback(
    async (suggestion: AgendaSuggestion, councilId: string, meetingId?: string) => {
      try {
        let targetMeetingId = meetingId;

        // Se não tiver reunião selecionada, criar uma nova
        if (!targetMeetingId) {
          const newMeeting = await createMeeting({
            title: `Reunião sobre ${suggestion.title}`,
            council_id: councilId,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:00',
            type: 'Extraordinária',
          });

          targetMeetingId = newMeeting.id;
        }

        // Usar o hook useMeetingItems para adicionar a pauta
        const { createItem } = useMeetingItems(targetMeetingId);
        
        const itemData = {
          title: suggestion.title,
          description: suggestion.description,
          type: 'Deliberação' as const,
          key_points: suggestion.discussionPoints,
          presenter: 'Inteligência de Mercado (IA)',
          duration_minutes: 30
        };

        const itemResult = await createItem(itemData);

        if (itemResult.error) {
          throw new Error(itemResult.error);
        }

        toast({
          title: 'Pauta Criada',
          description: 'A pauta foi adicionada à reunião com sucesso.',
        });

        return { success: true, meetingId: targetMeetingId };
      } catch (error: any) {
        toast({
          title: 'Erro ao Criar Pauta',
          description: error.message || 'Ocorreu um erro ao criar a pauta.',
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
    },
    [createMeeting, toast]
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
