import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, X, Minus, Maximize2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchGuides, quickActions, GuideEntry } from '@/data/legacyGuideData';
import { GuideSearchResult } from '@/components/GuideSearchResult';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  guides?: GuideEntry[];
  suggestions?: string[];
}

interface GovernanceAssistantProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const GovernanceAssistant: React.FC<GovernanceAssistantProps> = ({ 
  isOpen: externalOpen, 
  onOpenChange 
}) => {
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isOpen = isControlled ? externalOpen : internalOpen;
  
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const results = searchGuides(query);
      
      let assistantMessage: Message;
      
      if (results.length > 0) {
        const suggestions = results[0].relatedModules.slice(0, 2).map(mod => 
          `Como usar ${mod}?`
        );
        
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: results.length === 1 
            ? 'Encontrei este guia que pode ajudar:'
            : `Encontrei ${results.length} guias relacionados:`,
          guides: results,
          suggestions
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Não encontrei um guia específico para essa busca. Tente palavras-chave como "reunião", "ATA", "dashboard", "maturidade", "ESG" ou "riscos". Ou use as sugestões abaixo:',
          suggestions: ['Como criar uma reunião?', 'Como usar o Dashboard?', 'O que é maturidade de governança?']
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  const handleQuickAction = (query: string) => {
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button - só mostra se não for controlado externamente */}
      {!isControlled && !isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-legacy-500 hover:bg-legacy-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Abrir Guia Legacy"
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Guia Legacy</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 bg-background border border-border rounded-xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-72 h-14' : 'w-96 h-[32rem]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-legacy-500 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="font-semibold">Guia Legacy</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button
                onClick={handleCloseChat}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-3.5rem)]">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {/* Welcome message */}
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className="bg-legacy-500/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-legacy-600 font-medium">
                        <HelpCircle className="h-4 w-4" />
                        <span>Olá! Sou o Guia Legacy.</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Posso ajudar você a navegar pela plataforma e aprender a usar cada funcionalidade. Faça uma pergunta ou escolha uma das opções abaixo:
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Perguntas frequentes
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(action.query)}
                            className="px-3 py-1.5 text-xs bg-muted hover:bg-legacy-500/10 hover:text-legacy-600 rounded-full transition-colors border border-transparent hover:border-legacy-500/20"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      {message.type === 'user' ? (
                        <div className="flex justify-end">
                          <div className="bg-legacy-500 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[85%]">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 rounded-full bg-legacy-500/10">
                              <BookOpen className="h-4 w-4 text-legacy-500" />
                            </div>
                            <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md max-w-[85%]">
                              <p className="text-sm text-foreground">{message.content}</p>
                            </div>
                          </div>

                          {/* Guide Results */}
                          {message.guides?.map((guide) => (
                            <GuideSearchResult 
                              key={guide.id} 
                              guide={guide} 
                              onNavigate={handleCloseChat}
                            />
                          ))}

                          {/* Suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-8">
                              {message.suggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="px-3 py-1.5 text-xs bg-muted hover:bg-legacy-500/10 hover:text-legacy-600 rounded-full transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-legacy-500/10">
                        <BookOpen className="h-4 w-4 text-legacy-500" />
                      </div>
                      <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-legacy-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-legacy-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-legacy-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 text-sm"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="bg-legacy-500 hover:bg-legacy-600"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GovernanceAssistant;
