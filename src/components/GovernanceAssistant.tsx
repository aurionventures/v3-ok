
import React, { useState } from "react";
import { MessageSquareText, X, Minimize2, Maximize2, Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// Define the message type
type MessageType = "assistant" | "user";

// Define the conversation message interface
interface ConversationMessage {
  type: MessageType;
  text: string;
}

// List of available AI assistants
const availableAssistants = [
  {
    id: "governance",
    name: "Assistente Legacy",
    initials: "AL",
    bgColor: "bg-legacy-500",
    textColor: "text-legacy-500",
  },
  {
    id: "succession",
    name: "Especialista em Sucessão",
    initials: "ES",
    bgColor: "bg-blue-600",
    textColor: "text-blue-600",
  },
  {
    id: "esg",
    name: "Consultor de ESG",
    initials: "ESG",
    bgColor: "bg-green-600",
    textColor: "text-green-600",
  },
];

const responses = {
  governance: [
    "Posso ajudar com questões sobre estruturação do conselho de administração.",
    "Para melhorar a governança familiar, considere implementar um protocolo familiar.",
    "A sucessão deve ser planejada com antecedência. Posso ajudar a definir critérios.",
    "É importante separar as questões familiares das empresariais nas reuniões.",
    "A diversidade no conselho traz perspectivas valiosas para a tomada de decisão."
  ],
  succession: [
    "O processo de sucessão deve começar com o mapeamento de competências necessárias.",
    "Recomendo criar um comitê de sucessão independente para conduzir o processo.",
    "É importante diferenciar a sucessão na gestão da sucessão na propriedade.",
    "Desenvolva um cronograma detalhado para a transição de liderança.",
    "O sucessor deve ser preparado nos aspectos técnicos, comportamentais e contextuais."
  ],
  esg: [
    "Recomendo começar por uma avaliação de materialidade dos temas ESG para sua empresa.",
    "Implemente métricas claras de desempenho ambiental e social.",
    "É fundamental alinhar as práticas ESG à estratégia central do negócio.",
    "Considere obter certificações reconhecidas como B Corp ou ISO 14001.",
    "Transparência na comunicação dos resultados ESG é essencial para credibilidade."
  ]
};

const GovernanceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAssistant, setCurrentAssistant] = useState(availableAssistants[0]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    { 
      type: "assistant", 
      text: `Olá! Sou o ${availableAssistants[0].name}. Como posso ajudá-lo hoje?` 
    }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    const updatedConversation = [
      ...conversation, 
      { type: "user" as MessageType, text: message }
    ];
    setConversation(updatedConversation);
    
    // Show thinking indicator
    setIsThinking(true);
    setMessage("");
    
    // Simulate AI response with a delay
    setTimeout(() => {
      const responseArray = responses[currentAssistant.id as keyof typeof responses];
      const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
      
      setConversation([
        ...updatedConversation,
        { type: "assistant" as MessageType, text: randomResponse }
      ]);
      setIsThinking(false);
    }, 1500);
  };

  const changeAssistant = (assistant: typeof availableAssistants[0]) => {
    setCurrentAssistant(assistant);
    setConversation([
      { type: "assistant", text: `Olá! Agora você está conversando com o ${assistant.name}. Como posso ajudá-lo?` }
    ]);
    
    toast({
      title: "Assistente alterado",
      description: `Agora você está conversando com o ${assistant.name}`,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && !isMinimized && (
        <Card className="w-80 shadow-lg mb-2 border-legacy-500 animate-fade-in">
          <CardHeader className={`px-4 py-2 border-b ${currentAssistant.bgColor} text-white flex justify-between items-center`}>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`bg-white ${currentAssistant.textColor} font-bold flex items-center justify-center h-full rounded-full`}>
                  {currentAssistant.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{currentAssistant.name}</span>
            </div>
            <div className="flex space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-opacity-20 hover:bg-white">
                    <Bot className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Escolha um assistente</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableAssistants.map((assistant) => (
                    <DropdownMenuItem 
                      key={assistant.id}
                      onClick={() => changeAssistant(assistant)}
                      className="flex items-center"
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className={`${assistant.bgColor} text-white font-bold flex items-center justify-center h-full rounded-full text-xs`}>
                          {assistant.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{assistant.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-6 w-6 text-white hover:bg-opacity-20 hover:bg-white">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-6 w-6 text-white hover:bg-opacity-20 hover:bg-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 h-80 overflow-y-auto bg-gray-50">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.type === "assistant" ? "flex" : "flex justify-end"}`}
              >
                <div 
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.type === "assistant" 
                      ? "bg-white border border-gray-200" 
                      : `${currentAssistant.bgColor} text-white`
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex mb-3">
                <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Pensando...</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                disabled={isThinking}
              />
              <Button 
                type="submit" 
                size="sm" 
                className={`${currentAssistant.bgColor} hover:opacity-90`}
                disabled={isThinking}
              >
                Enviar
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {isOpen && isMinimized && (
        <Button 
          onClick={toggleMinimize}
          className={`mb-2 ${currentAssistant.bgColor} hover:opacity-90 text-white flex items-center gap-2 shadow-lg`}
        >
          <Maximize2 className="h-4 w-4" />
          <span>{currentAssistant.name}</span>
        </Button>
      )}

      <Button
        onClick={toggleChat}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center ${
          isOpen ? "bg-gray-500 hover:bg-gray-600" : "bg-legacy-500 hover:bg-legacy-600"
        }`}
      >
        <MessageSquareText className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default GovernanceAssistant;
