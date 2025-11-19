import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Eye, CheckCircle2, Clock, Mail, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface ConvocationSystemProps {
  meetingId?: string;
  onClose?: () => void;
}

export const ConvocationSystem = ({ meetingId, onClose }: ConvocationSystemProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("formal");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Mock data - substituir por dados reais
  const meeting = {
    id: "1",
    title: "Reunião do Conselho de Administração",
    date: new Date(2025, 0, 25, 14, 0),
    location: "Sala de Reuniões - 3º Andar",
    organ: "Conselho de Administração",
  };

  const participants = [
    { id: "1", name: "João Silva", email: "joao@empresa.com", role: "Presidente", status: "pending" },
    { id: "2", name: "Maria Santos", email: "maria@empresa.com", role: "Vice-Presidente", status: "pending" },
    { id: "3", name: "Pedro Costa", email: "pedro@empresa.com", role: "Conselheiro", status: "confirmed" },
    { id: "4", name: "Ana Lima", email: "ana@empresa.com", role: "Conselheira", status: "pending" },
  ];

  const templates = [
    {
      id: "formal",
      name: "Convocação Formal",
      subject: "Convocação - {meeting_title}",
      body: `Prezado(a) {participant_name},

Por meio desta, convocamos V.Sa. para a {meeting_title}, que se realizará no dia {meeting_date}, às {meeting_time}, no seguinte local: {meeting_location}.

Segue em anexo a pauta da reunião e os materiais de apoio para análise prévia.

Solicitamos a confirmação de presença através do link abaixo.

Atenciosamente,
Secretaria de Governança`
    },
    {
      id: "informal",
      name: "Convocação Informal",
      subject: "{meeting_title} - {meeting_date}",
      body: `Olá {participant_name},

Esta é uma convocação para a {meeting_title} que acontecerá em {meeting_date}, às {meeting_time}.

Local: {meeting_location}

Por favor, confirme sua presença e revise os materiais em anexo.

Abraços,
Equipe de Governança`
    },
    {
      id: "reminder",
      name: "Lembrete",
      subject: "Lembrete: {meeting_title} - {meeting_date}",
      body: `Olá {participant_name},

Este é um lembrete sobre a {meeting_title} que acontecerá em breve.

Data: {meeting_date}
Hora: {meeting_time}
Local: {meeting_location}

Não se esqueça de revisar os materiais previamente.`
    },
  ];

  const handleSendConvocations = () => {
    if (selectedParticipants.length === 0) {
      toast.error("Selecione pelo menos um participante");
      return;
    }

    toast.success(`Convocações enviadas para ${selectedParticipants.length} participante(s)`);
    onClose?.();
  };

  const toggleParticipant = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const selectAllParticipants = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map(p => p.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "declined":
        return <Badge variant="destructive">Recusado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Meeting Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações da Reunião
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Título</p>
              <p className="font-medium">{meeting.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Órgão</p>
              <p className="font-medium">{meeting.organ}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data e Hora</p>
              <p className="font-medium">
                {format(meeting.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">{meeting.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">
            <Mail className="h-4 w-4 mr-2" />
            Compor
          </TabsTrigger>
          <TabsTrigger value="participants">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Participantes
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Eye className="h-4 w-4 mr-2" />
            Acompanhamento
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Convocação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div className="grid gap-2">
                <Label>Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <div>
                  <p className="text-sm font-medium">Assunto:</p>
                  <p className="text-sm text-muted-foreground">
                    {templates.find(t => t.id === selectedTemplate)?.subject}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mensagem:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {templates.find(t => t.id === selectedTemplate)?.body}
                  </p>
                </div>
              </div>

              {/* Custom Message */}
              <div className="grid gap-2">
                <Label>Mensagem Adicional (Opcional)</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Adicione informações extras aqui..."
                  rows={4}
                />
              </div>

              {/* Attachments */}
              <div className="grid gap-2">
                <Label>Anexos</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="attach-agenda" defaultChecked />
                    <Label htmlFor="attach-agenda" className="cursor-pointer">
                      Pauta da Reunião
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="attach-materials" defaultChecked />
                    <Label htmlFor="attach-materials" className="cursor-pointer">
                      Materiais de Apoio
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="attach-link" defaultChecked />
                    <Label htmlFor="attach-link" className="cursor-pointer">
                      Link de Confirmação de Presença
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Selecionar Participantes</CardTitle>
                <Button variant="outline" size="sm" onClick={selectAllParticipants}>
                  {selectedParticipants.length === participants.length ? "Desmarcar Todos" : "Selecionar Todos"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map(participant => (
                  <div 
                    key={participant.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleParticipant(participant.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedParticipants.includes(participant.id)}
                        onCheckedChange={() => toggleParticipant(participant.id)}
                      />
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.email} • {participant.role}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(participant.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Status das Convocações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map(participant => (
                  <div key={participant.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                      {getStatusBadge(participant.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Enviado: 18/01/2025
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Visualizado: 18/01/2025
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {participant.status === "confirmed" ? "Confirmado: 18/01/2025" : "Pendente"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSendConvocations}>
          <Send className="h-4 w-4 mr-2" />
          Enviar Convocações ({selectedParticipants.length})
        </Button>
      </div>
    </div>
  );
};