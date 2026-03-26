import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Scale, Calendar, Users, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAnnualSchedule } from "@/hooks/useAnnualSchedule";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
  timestamp: Date;
}

interface SearchResult {
  type: 'ata' | 'decision' | 'document' | 'meeting';
  title: string;
  content: string;
  date: string;
  organ: string;
  relevance: number;
  metadata: Record<string, any>;
}

export const SecretariatSearchChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! 👋 Sou seu assistente de busca inteligente. Posso ajudá-lo a encontrar ATAs, decisões, documentos e informações sobre reuniões. O que você gostaria de buscar?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { schedule } = useAnnualSchedule();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSearching(true);

    try {
      // Preparar dados de reuniões para enviar à Edge Function
      const meetingsData = schedule?.meetings || [];
      const documentsData: any[] = []; // Documentos podem ser adicionados aqui

      console.log('[SecretariatSearchChat] Enviando busca:', input);
      console.log('[SecretariatSearchChat] Total de reuniões:', meetingsData.length);

      const { data, error } = await supabase.functions.invoke('secretariat-search', {
        body: {
          question: input,
          meetings: meetingsData,
          documents: documentsData
        }
      });

      if (error) {
        console.error('[SecretariatSearchChat] Erro na busca:', error);
        throw error;
      }

      console.log('[SecretariatSearchChat] Resposta recebida:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer || 'Não foi possível gerar uma resposta.',
        results: data.results || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.results && data.results.length > 0) {
        toast({
          title: "Busca concluída",
          description: `Encontrados ${data.totalResults || data.results.length} resultado(s)`,
        });
      }
    } catch (error: any) {
      console.error('[SecretariatSearchChat] Erro na busca:', error);
      toast({
        title: "Erro na Busca",
        description: error.message || "Não foi possível realizar a busca.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua busca. Por favor, tente novamente ou reformule sua pergunta.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'ata': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'decision': return <Scale className="h-4 w-4 text-green-600" />;
      case 'document': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'ata': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'decision': return 'bg-green-100 text-green-700 border-green-300';
      case 'document': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'meeting': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Sugestões rápidas
  const quickSuggestions = [
    "Quais foram as principais decisões do Conselho em fevereiro?",
    "Mostre as ATAs sobre compliance",
    "Buscar documentos de auditoria",
    "Reuniões do Comitê de Auditoria em 2025"
  ];

  return (
    <Card className="h-[700px] flex flex-col shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold">Busca Inteligente</div>
            <div className="text-xs text-gray-600 font-normal">
              Pesquise ATAs, decisões, documentos e reuniões
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <Avatar className="h-8 w-8 border-2 border-blue-200">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col gap-2 max-w-[80%] ${
                  message.type === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Exibir resultados da busca */}
                {message.results && message.results.length > 0 && (
                  <div className="w-full space-y-2 mt-2">
                    <div className="text-xs text-gray-500 font-medium">
                      {message.results.length} resultado(s) encontrado(s)
                    </div>
                    {message.results.map((result, index) => (
                      <Card
                        key={index}
                        className={`border-l-4 hover:shadow-md transition-all cursor-pointer ${
                          result.type === 'ata' ? 'border-l-blue-500' :
                          result.type === 'decision' ? 'border-l-green-500' :
                          result.type === 'document' ? 'border-l-purple-500' :
                          'border-l-orange-500'
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-2">
                            {getResultIcon(result.type)}
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{result.title}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {result.content.substring(0, 150)}
                                {result.content.length > 150 && '...'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${getResultColor(result.type)}`}>
                              {result.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(result.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {result.organ}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(result.relevance * 100)}% relevância
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  {format(message.timestamp, 'HH:mm')}
                </div>
              </div>

              {message.type === 'user' && (
                <Avatar className="h-8 w-8 border-2 border-blue-200">
                  <AvatarFallback className="bg-gray-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isSearching && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 border-2 border-blue-200">
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 rounded-2xl bg-gray-100 rounded-tl-none">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sugestões rápidas (apenas quando não há mensagens do usuário) */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 font-medium">Sugestões:</div>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={() => handleQuickSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      <CardContent className="p-4 border-t bg-white">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta... Ex: 'Quais decisões foram tomadas sobre ESG?'"
            disabled={isSearching}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isSearching}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
