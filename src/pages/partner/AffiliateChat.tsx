import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Headphones, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

// Mensagens mockadas
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Olá! Como posso ajudá-lo hoje?',
    sender: 'support',
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  }
];

export default function AffiliateChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    // Simular resposta do suporte
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Nossa equipe de suporte entrará em contato em breve.',
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportMessage]);
      setLoading(false);
      toast.success('Mensagem enviada com sucesso!');
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Central de Mensageria" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header do Chat */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-legacy-500" />
                Central de Mensageria Legacy OS
              </h1>
              <p className="text-gray-600 mt-1">
                Portal de mensageria para comunicação com o Customer Success (CS) da Legacy OS
              </p>
            </div>

            {/* Área de Mensagens */}
            <Card className="flex-1 flex flex-col mb-4">
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-legacy-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.sender === 'support' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Headphones className="h-4 w-4" />
                          <span className="text-xs font-semibold">Customer Success - Legacy OS</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        <span className="text-sm text-gray-500">Enviando mensagem...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>

            {/* Input de Mensagem */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !inputMessage.trim()}
                    className="bg-legacy-500 hover:bg-legacy-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Nossa equipe de Customer Success responde em até 24 horas úteis
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
