import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Library, List, Grid, Search, FileText, Calendar, Building2, Download, Eye, Building, BarChart3, Scale, ClipboardList, Bot, User, Send, Loader2 } from "lucide-react";
import { useAnnualSchedule } from "@/hooks/useAnnualSchedule";
import { MeetingSchedule } from "@/types/annualSchedule";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MeetingATAViewer from './MeetingATAViewer';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ATAPDFDocument } from './ATAPDFDocument';

type ViewMode = 'list' | 'mosaic';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  results?: any[];
}

export const ATALibrary = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    organType: 'all',
    period: 'all',
    status: 'all'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isChatMode, setIsChatMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou seu assistente de busca em ATAs. Pergunte sobre qualquer tema, decisão ou pauta discutida nas reuniões.\n\nDica: Clique nos cards de ATA para visualizar o documento completo na Biblioteca.',
      timestamp: new Date(),
      results: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedATA, setSelectedATA] = useState<MeetingSchedule | null>(null);
  const [isATAViewerOpen, setIsATAViewerOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const { toast } = useToast();
  const { schedule } = useAnnualSchedule();

  // Mock responses for testing conversational search with ATA themes
  const mockResponses: Record<string, { content: string; results: any[] }> = {
    "Quais decisões foram tomadas sobre expansão internacional?": {
      content: "Com base nas ATAs consultadas, identifiquei as seguintes decisões sobre expansão internacional:\n\n" +
               "Na reunião do Conselho de Administração de 14/janeiro/2025, foram aprovadas as seguintes deliberações:\n\n" +
               "1. Investimento de R$ 8 milhões para expansão na América Latina\n" +
               "2. Criação do Comitê Especial Internacional\n" +
               "3. Aprovação do plano de entrada no mercado chileno\n\n" +
               "Próximos passos definidos: aprovação do budget de expansão, nomeação de diretor LATAM e estrutura societária da subsidiária.",
      results: [
        {
          type: 'ata',
          title: 'ATA Conselho de Administração - Janeiro/2025',
          content: 'Decisões sobre expansão internacional aprovadas',
          date: '2025-01-14',
          organ: 'Conselho de Administração',
          metadata: { meetingId: 'conselho-1', organ: 'Conselho de Administração' }
        }
      ]
    },
    "Mostre as políticas de governança aprovadas": {
      content: "Com base nas ATAs consultadas, identifiquei as seguintes políticas de governança aprovadas:\n\n" +
               "No Conselho de Administração (janeiro e fevereiro/2025):\n\n" +
               "1. Código de Ética e Conduta - aprovado em janeiro/2025\n" +
               "2. Política de Compliance e Anticorrupção - aprovada em fevereiro/2025\n" +
               "3. Programa de treinamento obrigatório para colaboradores (início: março/2025)\n" +
               "4. Criação do Comitê de Ética e Conduta\n\n" +
               "Todas as políticas foram aprovadas por unanimidade e entram em vigor imediatamente.",
      results: [
        {
          type: 'ata',
          title: 'ATA Conselho de Administração - Janeiro/2025',
          content: 'Código de Ética e Conduta aprovado',
          date: '2025-01-14',
          organ: 'Conselho de Administração',
          metadata: { meetingId: 'conselho-1', organ: 'Conselho de Administração' }
        },
        {
          type: 'ata',
          title: 'ATA Conselho de Administração - Fevereiro/2025',
          content: 'Política de Compliance aprovada',
          date: '2025-02-11',
          organ: 'Conselho de Administração',
          metadata: { meetingId: 'conselho-2', organ: 'Conselho de Administração' }
        }
      ]
    },
    "Como está o planejamento de sucessão executiva?": {
      content: "Com base nas ATAs consultadas, aqui está o status do planejamento de sucessão executiva:\n\n" +
               "Conselho de Administração - Março/2025:\n\n" +
               "1. Identificados 12 potenciais sucessores para posições-chave\n" +
               "2. Programa de desenvolvimento de líderes aprovado (duração: 18 meses)\n" +
               "3. Mentoria por conselheiros e executivos seniores\n" +
               "4. Avaliações trimestrais de progresso\n" +
               "5. Budget aprovado: R$ 2,5 milhões\n\n" +
               "Próxima revisão agendada para junho/2025.",
      results: [
        {
          type: 'ata',
          title: 'ATA Conselho de Administração - Março/2025',
          content: 'Planejamento de sucessão executiva aprovado',
          date: '2025-03-11',
          organ: 'Conselho de Administração',
          metadata: { meetingId: 'conselho-3', organ: 'Conselho de Administração' }
        }
      ]
    },
    "Quais riscos operacionais foram identificados?": {
      content: "Com base nas ATAs do Comitê de Auditoria, aqui está o resumo dos riscos operacionais identificados:\n\n" +
               "Janeiro e Fevereiro/2025:\n\n" +
               "1. Matriz de riscos atualizada com 45 riscos mapeados\n" +
               "2. 8-10 riscos classificados como alta criticidade\n" +
               "3. Principais áreas de preocupação: TI, conformidade regulatória, cadeia de suprimentos\n" +
               "4. Plano de ação aprovado com investimento de R$ 5 milhões em controles internos\n" +
               "5. Auditoria externa programada para abril/2025\n\n" +
               "Status: 85% dos controles implementados conforme cronograma.",
      results: [
        {
          type: 'ata',
          title: 'ATA Comitê de Auditoria - Janeiro/2025',
          content: 'Matriz de riscos operacionais apresentada',
          date: '2025-01-16',
          organ: 'Comitê de Auditoria',
          metadata: { meetingId: 'comite-1', organ: 'Comitê de Auditoria' }
        },
        {
          type: 'ata',
          title: 'ATA Comitê de Auditoria - Fevereiro/2025',
          content: 'Plano de ação para riscos aprovado',
          date: '2025-02-20',
          organ: 'Comitê de Auditoria',
          metadata: { meetingId: 'comite-2', organ: 'Comitê de Auditoria' }
        }
      ]
    },
    "Qual o status de conformidade com LGPD e SOX?": {
      content: "Com base nas ATAs do Comitê de Auditoria, aqui está o status de conformidade:\n\n" +
               "Janeiro/2025:\n\n" +
               "LGPD:\n" +
               "- 92% de aderência aos requisitos\n" +
               "- 3 não conformidades identificadas (todas de baixo risco)\n" +
               "- Plano de adequação em andamento\n" +
               "- Conclusão prevista: abril/2025\n\n" +
               "SOX (Sarbanes-Oxley):\n" +
               "- 88% dos controles implementados\n" +
               "- 12 controles em fase de testes\n" +
               "- Auditoria externa programada para maio/2025\n" +
               "- Certificação esperada: junho/2025\n\n" +
               "Próxima revisão: março/2025.",
      results: [
        {
          type: 'ata',
          title: 'ATA Comitê de Auditoria - Janeiro/2025',
          content: 'Status de conformidade LGPD e SOX',
          date: '2025-01-16',
          organ: 'Comitê de Auditoria',
          metadata: { meetingId: 'comite-1', organ: 'Comitê de Auditoria' }
        }
      ]
    },
    "Quantos casos de ética foram analisados?": {
      content: "Com base nas ATAs da Comissão de Ética, aqui está o resumo dos casos analisados:\n\n" +
               "Janeiro e Fevereiro/2025:\n\n" +
               "Janeiro:\n" +
               "- 4 casos recebidos e analisados\n" +
               "- 2 casos arquivados (sem evidências)\n" +
               "- 1 caso resolvido com advertência\n" +
               "- 1 caso em investigação\n\n" +
               "Fevereiro:\n" +
               "- 6 casos recebidos e analisados\n" +
               "- 3 casos arquivados\n" +
               "- 2 casos resolvidos com advertência\n" +
               "- 1 caso encaminhado para medidas disciplinares\n\n" +
               "Total no período: 10 casos\n" +
               "Taxa de resolução: 90%\n" +
               "Tempo médio de análise: 12 dias",
      results: [
        {
          type: 'ata',
          title: 'ATA Comissão de Ética - Janeiro/2025',
          content: 'Análise de casos de ética',
          date: '2025-01-31',
          organ: 'Comissão de Ética',
          metadata: { meetingId: 'comissao-1', organ: 'Comissão de Ética' }
        },
        {
          type: 'ata',
          title: 'ATA Comissão de Ética - Fevereiro/2025',
          content: 'Análise de casos de ética',
          date: '2025-02-28',
          organ: 'Comissão de Ética',
          metadata: { meetingId: 'comissao-2', organ: 'Comissão de Ética' }
        }
      ]
    }
  };

  // Filter only meetings with generated ATAs
  const atasAvailable = schedule?.meetings.filter(m => 
    m.status === 'ATA Gerada' && m.minutes
  ) || [];

  // Apply filters
  const filteredATAs = atasAvailable.filter(ata => {
    if (filters.organType !== 'all') {
      if (filters.organType === 'conselho' && !ata.council.includes('Conselho')) return false;
      if (filters.organType === 'comite' && !ata.council.includes('Comitê')) return false;
      if (filters.organType === 'comissao' && !ata.council.includes('Comissão')) return false;
    }
    
    if (filters.period !== 'all') {
      const ataDate = new Date(ata.date);
      const currentDate = new Date();
      const monthDiff = (currentDate.getFullYear() - ataDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - ataDate.getMonth());
      
      if (filters.period === 'last-month' && monthDiff !== 1) return false;
      if (filters.period === 'last-3-months' && monthDiff > 3) return false;
      if (filters.period === 'last-6-months' && monthDiff > 6) return false;
    }
    
    return true;
  });

  const handleIntelligentSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite algo para buscar",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('secretariat-search', {
        body: { 
          question: searchTerm,
          meetings: atasAvailable,
          documents: [],
          searchScope: 'atas_only'
        }
      });

      if (error) throw error;

      setSearchResults(data.results || []);
      
      toast({
        title: "Busca concluída",
        description: `Encontrados ${data.results?.length || 0} resultados`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleConversationalSearch = async (customQuestion?: string) => {
    const questionToSearch = customQuestion || inputMessage;
    if (!questionToSearch.trim() || isSearching) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: questionToSearch,
      timestamp: new Date(),
      results: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSearching(true);

    try {
      // Try calling edge function first
      const { data, error } = await supabase.functions.invoke('secretariat-search', {
        body: { 
          question: userMessage.content,
          meetings: atasAvailable,
          documents: [],
          searchScope: 'atas_only'
        }
      });

      // Check if we should use mock response (no results or error)
      const shouldUseMock = error || !data?.results?.length;
      const mockData = mockResponses[questionToSearch];

      if (shouldUseMock && mockData) {
        // Use mock response as fallback
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: mockData.content,
          timestamp: new Date(),
          results: mockData.results
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "Busca concluída (modo simulação)",
          description: `Encontradas ${mockData.results.length} ATA(s)`,
        });
      } else if (!error && data?.results?.length) {
        // Use real results from edge function
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.answer || 'Encontrei alguns resultados relevantes:',
          timestamp: new Date(),
          results: data.results || []
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // No mock and no real results
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Não encontrei resultados para sua pergunta. Tente reformular ou usar uma das sugestões acima.',
          timestamp: new Date(),
          results: []
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }

    } catch (error) {
      console.error('Search error:', error);
      
      // Try mock response on catch as well
      const mockData = mockResponses[questionToSearch];
      if (mockData) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: mockData.content,
          timestamp: new Date(),
          results: mockData.results
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "Busca concluída (modo simulação)",
          description: `Encontradas ${mockData.results.length} ATA(s)`,
        });
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua busca. Por favor, tente novamente.',
          timestamp: new Date(),
          results: []
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca",
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewATA = (ata: MeetingSchedule) => {
    setSelectedATA(ata);
    setIsATAViewerOpen(true);
  };

  const handleNavigateToATA = (result: any) => {
    const ataId = result.metadata?.meetingId || result.id;
    
    const foundATA = atasAvailable.find(ata => {
      // 1. Tentar match por ID direto
      if (ata.id === ataId) return true;
      
      // 2. Tentar match por órgão e data
      const organMatch = ata.council === result.metadata?.organ || 
                         ata.council === result.organ;
      
      // 3. Comparação de datas (normalizar formatos)
      const ataDate = ata.date; // formato: 'yyyy-MM-dd'
      const resultDate = result.date; // formato: 'yyyy-MM-dd'
      const dateMatch = ataDate === resultDate;
      
      return organMatch && dateMatch;
    });

    if (foundATA) {
      setIsChatMode(false);
      setTimeout(() => {
        handleViewATA(foundATA);
        toast({
          title: "ATA Localizada",
          description: `${foundATA.council} - ${format(new Date(foundATA.date), 'dd/MM/yyyy')}`
        });
      }, 100);
    } else {
      toast({
        title: "ATA não encontrada",
        description: "Não foi possível localizar esta ATA na biblioteca",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async (ata: MeetingSchedule) => {
    setIsGeneratingPDF(true);
    try {
      const blob = await pdf(<ATAPDFDocument meeting={ata} />).toBlob();
      saveAs(blob, `ATA_${ata.council.replace(/\s+/g, '_')}_${format(new Date(ata.date), 'dd-MM-yyyy')}.pdf`);
      
      toast({
        title: "PDF Gerado",
        description: "O download começou automaticamente",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getOrganColor = (council: string) => {
    if (council.includes('Conselho')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (council.includes('Comitê')) return 'bg-green-100 text-green-700 border-green-300';
    if (council.includes('Comissão')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getOrganIcon = (council: string) => {
    if (council.includes('Conselho')) return <Building className="h-5 w-5 text-blue-600" />;
    if (council.includes('Comitê')) return <BarChart3 className="h-5 w-5 text-green-600" />;
    if (council.includes('Comissão')) return <Scale className="h-5 w-5 text-yellow-600" />;
    return <ClipboardList className="h-5 w-5 text-muted-foreground" />;
  };

  const displayedATAs = searchResults.length > 0 
    ? searchResults.filter(r => r.type === 'ata').map(r => {
        return atasAvailable.find(ata => 
          ata.council === r.organ && ata.date === r.date
        );
      }).filter(Boolean)
    : filteredATAs;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Bibliotecas de ATAs
            </CardTitle>
            <CardDescription className="mt-1">
              Pesquise e visualize todas as Atas de Reunião geradas
            </CardDescription>
          </div>
          {!isChatMode && (
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'mosaic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mosaic')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
          {/* Toggle de Modo */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={isChatMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsChatMode(true)}
            >
              <Bot className="h-4 w-4 mr-1" />
              Busca Conversacional
            </Button>
            <Button
              variant={!isChatMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsChatMode(false)}
            >
              <Library className="h-4 w-4 mr-1" />
              Biblioteca
            </Button>
          </div>

        {isChatMode ? (
          // MODO CONVERSACIONAL (RAG)
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-4">
              <ScrollArea className="h-[400px] mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'assistant' && (
                        <Avatar className="h-8 w-8 border-2 border-primary/30">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`flex flex-col gap-2 max-w-[75%] ${
                        message.type === 'user' ? 'items-end' : 'items-start'
                      }`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card border text-card-foreground rounded-tl-none shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {/* Exibir cards de ATAs encontradas */}
                        {message.results && message.results.length > 0 && (
                          <div className="w-full space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              {message.results.length} ATA(s) encontrada(s):
                            </div>
                            {message.results.slice(0, 3).map((result, idx) => (
                              <Card 
                                key={idx} 
                                className="border-l-4 border-l-primary hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => handleNavigateToATA(result)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                        {result.title}
                                      </div>
                                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                        {result.content}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {result.metadata?.organ || 'N/A'}
                                        </Badge>
                                        {result.date && (
                                          <span className="text-xs text-muted-foreground">
                                            {format(new Date(result.date), 'dd/MM/yyyy')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        <span className="text-xs text-muted-foreground">
                          {format(message.timestamp, 'HH:mm')}
                        </span>
                      </div>

                      {message.type === 'user' && (
                        <Avatar className="h-8 w-8 border-2 border-primary/30">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isSearching && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-3 rounded-2xl bg-card border rounded-tl-none">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input de mensagem */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSearching && handleConversationalSearch()}
                  placeholder="Pergunte sobre qualquer tema nas ATAs... Ex: 'Quais decisões foram tomadas sobre ESG?'"
                  disabled={isSearching}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleConversationalSearch()}
                  disabled={!inputMessage.trim() || isSearching}
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Sugestões rápidas */}
              {messages.length === 1 && (
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-2">Sugestões:</div>
                <div className="flex flex-wrap gap-2">
              {[
                "Quais decisões foram tomadas sobre expansão internacional?",
                "Mostre as políticas de governança aprovadas",
                "Como está o planejamento de sucessão executiva?",
                "Quais riscos operacionais foram identificados?",
                "Qual o status de conformidade com LGPD e SOX?",
                "Quantos casos de ética foram analisados?"
              ].map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3"
                  onClick={() => {
                    setInputMessage(suggestion);
                    handleConversationalSearch(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
                </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* MODO BUSCA RÁPIDA */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Busque por tema, assunto, pauta, decisão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleIntelligentSearch()}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleIntelligentSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={filters.organType} onValueChange={(value) => setFilters({...filters, organType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Órgão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Órgãos</SelectItem>
                  <SelectItem value="conselho">Conselhos</SelectItem>
                  <SelectItem value="comite">Comitês</SelectItem>
                  <SelectItem value="comissao">Comissões</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.period} onValueChange={(value) => setFilters({...filters, period: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="last-month">Último Mês</SelectItem>
                  <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({ organType: 'all', period: 'all', status: 'all' });
                  setSearchTerm('');
                  setSearchResults([]);
                }}
              >
                Limpar Filtros
              </Button>
            </div>

            {/* Results */}
            {displayedATAs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Nenhuma ATA encontrada</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Tente outros termos de busca' : 'ATAs aparecerão aqui quando reuniões forem finalizadas'}
                </p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-3">
                {displayedATAs.map((ata) => (
                  <Card key={ata.id} className="border-l-4 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">{getOrganIcon(ata.council)}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{`Reunião ${ata.type}`}</h4>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span>{ata.council}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(ata.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ata.minutes?.summary || 'Resumo não disponível'}
                          </p>
                          <div className="flex gap-2">
                            <Badge className={getOrganColor(ata.council)}>
                              {ata.organ_type === 'conselho' ? 'Conselho' : ata.organ_type === 'comite' ? 'Comitê' : 'Comissão'}
                            </Badge>
                            <Badge variant="outline">{ata.type}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleViewATA(ata)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver ATA
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPDF(ata)}
                            disabled={isGeneratingPDF}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {isGeneratingPDF ? 'Gerando...' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedATAs.map((ata) => (
                  <Card key={ata.id} className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-shrink-0">{getOrganIcon(ata.council)}</div>
                          <Badge className={getOrganColor(ata.council)} variant="outline">
                            {ata.organ_type === 'conselho' ? 'Conselho' : ata.organ_type === 'comite' ? 'Comitê' : 'Comissão'}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {`Reunião ${ata.type}`}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{ata.council}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(ata.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                          {ata.minutes?.summary || 'Resumo não disponível'}
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1" 
                            variant="default"
                            onClick={() => handleViewATA(ata)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Abrir
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPDF(ata)}
                            disabled={isGeneratingPDF}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Modal de Visualização de ATA */}
      {selectedATA && (
        <MeetingATAViewer 
          meeting={selectedATA}
          isOpen={isATAViewerOpen}
          onClose={() => {
            setIsATAViewerOpen(false);
            setSelectedATA(null);
          }}
          onGenerateATA={async () => {
            toast({
              title: "Funcionalidade em Demo",
              description: "Em modo real, isso regeneraria a ATA",
            });
          }}
          isGenerating={false}
        />
      )}
    </Card>
  );
};
