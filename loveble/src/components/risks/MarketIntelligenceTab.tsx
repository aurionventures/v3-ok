import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { ThreatOpportunityMatrix } from './ThreatOpportunityMatrix';
import { InsightCard } from './InsightCard';
import { CreateAgendaFromInsightModal } from './CreateAgendaFromInsightModal';
import { SectorTrendsChart } from './SectorTrendsChart';
import { CompetitorAnalysisCard } from './CompetitorAnalysisCard';
import { Compass, Sparkles, Filter, Calendar, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketThreat, MarketOpportunity, AgendaSuggestion } from '@/types/riskIntelligence';
import { sectorDataMap } from '@/data/marketIntelligenceData';
import { useToast } from '@/hooks/use-toast';

export const MarketIntelligenceTab = () => {
  const { toast } = useToast();
  const {
    companyContext,
    setCompanyContext,
    threats,
    opportunities,
    agendaSuggestions,
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
    resetAnalysis,
  } = useRiskIntelligence();

  const [selectedInsight, setSelectedInsight] = useState<{
    data: MarketThreat | MarketOpportunity | null;
    type: 'threat' | 'opportunity' | null;
  }>({ data: null, type: null });

  const [selectedSuggestion, setSelectedSuggestion] = useState<AgendaSuggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSectorChange = (value: string) => {
    const sectorData = sectorDataMap[value];
    if (sectorData?.defaultContext) {
      setCompanyContext({
        ...companyContext,
        sector: value,
        segment: sectorData.defaultContext.segment || '',
        mainCompetitors: sectorData.defaultContext.mainCompetitors || [],
        strategicKeywords: sectorData.defaultContext.strategicKeywords || [],
      });
      toast({
        title: 'Contexto Atualizado',
        description: `Campos preenchidos com dados do setor "${value}"`,
      });
    } else {
      setCompanyContext({ ...companyContext, sector: value });
    }
    resetAnalysis();
  };

  const handleInsightClick = (insight: MarketThreat | MarketOpportunity, type: 'threat' | 'opportunity') => {
    setSelectedInsight({ data: insight, type });
  };

  const handleCreateAgenda = (insight: MarketThreat | MarketOpportunity, type: 'threat' | 'opportunity') => {
    const relatedSuggestion = agendaSuggestions.find(
      s => s.relatedInsightId === insight.id && s.relatedInsightType === type
    );
    if (relatedSuggestion) {
      setSelectedSuggestion(relatedSuggestion);
      setIsModalOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion: AgendaSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Compass className="h-6 w-6" />
            Inteligência de Mercado
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Análise de ameaças, oportunidades e tendências setoriais com IA
          </p>
        </div>
      </div>

      {/* Contexto da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Contexto Empresarial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Linha 1: Setor + Segmento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Setor/Indústria (IBGE)</Label>
              <Select
                value={companyContext.sector}
                onValueChange={handleSectorChange}
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comércio - Varejo">
                    <div className="flex items-center gap-2">
                      Comércio - Varejo
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Demo</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Comércio - Atacado">Comércio - Atacado</SelectItem>
                  <SelectItem value="Indústria de Transformação">Indústria de Transformação</SelectItem>
                  <SelectItem value="Serviços de Informação e Comunicação">
                    <div className="flex items-center gap-2">
                      Serviços de Informação e Comunicação
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Demo</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Agricultura, Pecuária e Pesca">Agricultura, Pecuária e Pesca</SelectItem>
                  <SelectItem value="Construção Civil">Construção Civil</SelectItem>
                  <SelectItem value="Serviços Financeiros">Serviços Financeiros</SelectItem>
                  <SelectItem value="Saúde e Assistência Social">
                    <div className="flex items-center gap-2">
                      Saúde e Assistência Social
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Demo</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Transporte e Logística">Transporte e Logística</SelectItem>
                  <SelectItem value="Alojamento e Alimentação">
                    <div className="flex items-center gap-2">
                      Alojamento e Alimentação
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Demo</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Energia e Utilities">Energia e Utilities</SelectItem>
                  <SelectItem value="Atividades Imobiliárias">Atividades Imobiliárias</SelectItem>
                </SelectContent>
              </Select>
              {sectorDataMap[companyContext.sector] && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3" />
                  Este setor possui análise completa de demonstração
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment">Segmento Específico</Label>
              <Input
                id="segment"
                value={companyContext.segment}
                onChange={(e) => setCompanyContext({ ...companyContext, segment: e.target.value })}
                placeholder="Ex: Varejo de Moda Feminina"
              />
            </div>
          </div>

          {/* Linha 2: Região + Porte */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Região de Atuação Principal</Label>
              <Select
                value={companyContext.region}
                onValueChange={(value) => setCompanyContext({ ...companyContext, region: value })}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Selecione a região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                  <SelectItem value="Nacional">Nacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">Porte da Empresa</Label>
              <Select
                value={companyContext.companySize}
                onValueChange={(value: 'pequena' | 'media' | 'grande') => 
                  setCompanyContext({ ...companyContext, companySize: value })}
              >
                <SelectTrigger id="companySize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequena">Pequena</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Linha 3: Principais Competidores */}
          <div className="space-y-2">
            <Label>Principais Competidores (até 5)</Label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <Input
                  key={index}
                  value={companyContext.mainCompetitors[index] || ''}
                  onChange={(e) => {
                    const newCompetitors = [...companyContext.mainCompetitors];
                    newCompetitors[index] = e.target.value;
                    setCompanyContext({ ...companyContext, mainCompetitors: newCompetitors.filter(c => c) });
                  }}
                  placeholder={`Competidor ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Linha 4: Palavras-chave Estratégicas */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave Estratégicas</Label>
            <Input
              id="keywords"
              value={companyContext.strategicKeywords.join(', ')}
              onChange={(e) => setCompanyContext({ 
                ...companyContext, 
                strategicKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
              })}
              placeholder="Ex: omnichannel, fast fashion, sustentabilidade, marketplace"
            />
          </div>

          <div className="mt-6">
            <Button
              onClick={analyzeMarket}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {isAnalyzing ? 'Analisando Mercado...' : 'Analisar Mercado com IA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Análise */}
      {hasAnalyzed && (
        <Tabs defaultValue="matrix" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matrix">Matriz</TabsTrigger>
            <TabsTrigger value="insights">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Insights ({threats.length + opportunities.length})
            </TabsTrigger>
            <TabsTrigger value="agenda">
              <Calendar className="h-4 w-4 mr-2" />
              Sugestões ({agendaSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendências
            </TabsTrigger>
          </TabsList>

          {/* Aba: Matriz */}
          <TabsContent value="matrix" className="space-y-4">
            <ThreatOpportunityMatrix
              threats={threats}
              opportunities={opportunities}
              onInsightClick={handleInsightClick}
            />
          </TabsContent>

          {/* Aba: Insights */}
          <TabsContent value="insights" className="space-y-4">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="source-filter">Fonte</Label>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger id="source-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Fontes</SelectItem>
                        <SelectItem value="regulatory">Regulatório</SelectItem>
                        <SelectItem value="competitive">Competitivo</SelectItem>
                        <SelectItem value="technological">Tecnológico</SelectItem>
                        <SelectItem value="economic">Econômico</SelectItem>
                        <SelectItem value="esg">ESG</SelectItem>
                        <SelectItem value="market">Mercado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de Ameaças */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">Ameaças Identificadas</h3>
                <Badge variant="destructive">{threats.length}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {threats.map((threat) => (
                  <InsightCard
                    key={threat.id}
                    insight={threat}
                    type="threat"
                    onCreateAgenda={() => handleCreateAgenda(threat, 'threat')}
                  />
                ))}
              </div>
            </div>

            {/* Cards de Oportunidades */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">Oportunidades Mapeadas</h3>
                <Badge className="bg-green-600">{opportunities.length}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {opportunities.map((opportunity) => (
                  <InsightCard
                    key={opportunity.id}
                    insight={opportunity}
                    type="opportunity"
                    onCreateAgenda={() => handleCreateAgenda(opportunity, 'opportunity')}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Aba: Sugestões de Pauta */}
          <TabsContent value="agenda" className="space-y-4">
            {/* Filtro de Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Filtrar por Prioridade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {agendaSuggestions.map((suggestion) => {
                const priorityColors = {
                  urgent: 'bg-destructive',
                  high: 'bg-orange-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-blue-500',
                };

                return (
                  <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{suggestion.title}</h3>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                          <Badge className={`${priorityColors[suggestion.priority]} text-white`}>
                            {suggestion.priority === 'urgent' ? 'Urgente' :
                             suggestion.priority === 'high' ? 'Alta' :
                             suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{suggestion.organName}</Badge>
                          <Badge variant="outline">
                            {suggestion.relatedInsightType === 'threat' ? 'Ameaça' : 'Oportunidade'}
                          </Badge>
                        </div>

                        <Button
                          onClick={() => handleSuggestionClick(suggestion)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Criar Pauta para Reunião
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Aba: Tendências */}
        <TabsContent value="trends" className="space-y-6">
          <SectorTrendsChart trends={sectorTrends} />
          <CompetitorAnalysisCard competitors={competitors} />
        </TabsContent>
        </Tabs>
      )}

      {/* Modal de Criação de Pauta */}
      {selectedSuggestion && (
        <CreateAgendaFromInsightModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSuggestion(null);
          }}
          suggestion={selectedSuggestion}
          onConfirm={createAgendaFromSuggestion}
        />
      )}
    </div>
  );
};
