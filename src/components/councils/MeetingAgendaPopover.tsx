import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Users, FileText, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { MeetingSchedule, AgendaItem } from "@/types/annualSchedule";

interface MeetingAgendaPopoverProps {
  meeting: MeetingSchedule;
  onUpdate: (meetingId: string, updates: Partial<MeetingSchedule>) => void;
  onOpenFullDetails?: () => void;
  children: React.ReactNode;
}

export function MeetingAgendaPopover({ 
  meeting, 
  onUpdate, 
  onOpenFullDetails,
  children 
}: MeetingAgendaPopoverProps) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(meeting.time || "14:00");
  const [attendees, setAttendees] = useState(meeting.attendees?.join("\n") || "");
  const [mainTopics, setMainTopics] = useState("");
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(meeting.agenda || []);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDuration, setNewItemDuration] = useState("30");
  const [newItemPresenter, setNewItemPresenter] = useState("");

  const meetingDate = new Date(meeting.date);
  const daysUntilMeeting = differenceInDays(meetingDate, new Date());
  const canEdit = daysUntilMeeting >= 15;
  const isDeadlineNear = daysUntilMeeting >= 3 && daysUntilMeeting < 15;

  useEffect(() => {
    if (meeting.agenda) {
      setAgendaItems(meeting.agenda);
    }
  }, [meeting.agenda]);

  const totalDuration = agendaItems.reduce((sum, item) => sum + item.duration, 0);
  const isLongMeeting = totalDuration > 180; // 3 horas

  const handleAddAgendaItem = () => {
    if (!newItemTitle.trim() || !newItemPresenter.trim()) {
      toast.error("Preencha título e apresentador do item");
      return;
    }

    const newItem: AgendaItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      description: "",
      presenter: newItemPresenter,
      duration: parseInt(newItemDuration) || 30,
      order: agendaItems.length + 1,
      type: "Deliberação",
      keyPoints: [],
      detailedScript: "",
      expectedOutcome: ""
    };

    setAgendaItems([...agendaItems, newItem]);
    setNewItemTitle("");
    setNewItemPresenter("");
    setNewItemDuration("30");
    toast.success("Item adicionado à pauta");
  };

  const handleRemoveItem = (itemId: string) => {
    setAgendaItems(agendaItems.filter(item => item.id !== itemId));
  };

  const handleSubmit = () => {
    if (agendaItems.length === 0) {
      toast.error("Adicione pelo menos um item à pauta");
      return;
    }

    const updates: Partial<MeetingSchedule> = {
      time,
      attendees: attendees.split("\n").filter(a => a.trim()),
      agenda: agendaItems,
      status: "Pauta Definida"
    };

    onUpdate(meeting.id, updates);
    toast.success("Pauta definida com sucesso! Time será notificado.");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto pointer-events-auto" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{meeting.council}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(meetingDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <Badge variant={meeting.type === "Ordinária" ? "default" : "secondary"}>
                {meeting.type}
              </Badge>
            </div>

            {/* Status da Pauta */}
            {canEdit ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{daysUntilMeeting} dias restantes</strong> para definir a pauta
                </AlertDescription>
              </Alert>
            ) : isDeadlineNear ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Prazo próximo!</strong> Faltam apenas {daysUntilMeeting} dias
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Prazo de 15 dias expirado. Visualização apenas.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Informações Básicas */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!canEdit}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Modalidade</Label>
                <Input
                  value={meeting.modalidade || "Presencial"}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div>
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participantes Esperados
            </Label>
            <Textarea
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="Digite um participante por linha"
              disabled={!canEdit}
              rows={3}
              className="mt-1"
            />
          </div>

          <Separator />

          {/* Pauta da Reunião */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pauta da Reunião
              </Label>
              {totalDuration > 0 && (
                <Badge variant={isLongMeeting ? "destructive" : "secondary"}>
                  Duração total: {Math.floor(totalDuration / 60)}h{totalDuration % 60}min
                </Badge>
              )}
            </div>

            {isLongMeeting && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Reunião muito longa! Considere reduzir a duração ou dividir em múltiplas reuniões.
                </AlertDescription>
              </Alert>
            )}

            {/* Lista de Itens da Pauta */}
            <div className="space-y-2">
              {agendaItems.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">
                        {index + 1}. {item.title}
                      </p>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-6 px-2"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>👤 {item.presenter}</span>
                      <span>⏱️ {item.duration} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Novo Item */}
            {canEdit && (
              <div className="space-y-2 p-3 border border-dashed rounded-lg">
                <Label className="text-xs">Adicionar Item à Pauta</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Título do item"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Apresentador"
                      value={newItemPresenter}
                      onChange={(e) => setNewItemPresenter(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Duração (min)"
                      value={newItemDuration}
                      onChange={(e) => setNewItemDuration(e.target.value)}
                      min="5"
                      step="5"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAgendaItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (onOpenFullDetails) {
                  onOpenFullDetails();
                  setOpen(false);
                }
              }}
            >
              Ver Detalhes Completos
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              {canEdit && (
                <Button onClick={handleSubmit}>
                  Submeter Pauta para Time
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
