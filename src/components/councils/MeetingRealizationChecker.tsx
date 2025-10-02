import React, { useState } from "react";
import { CheckCircle, Clock, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MeetingSchedule } from "@/types/annualSchedule";

interface MeetingRealizationCheckerProps {
  meeting: MeetingSchedule;
  onUpdateMeeting: (updates: Partial<MeetingSchedule>) => void;
}

export function MeetingRealizationChecker({ 
  meeting, 
  onUpdateMeeting 
}: MeetingRealizationCheckerProps) {
  const [isRealized, setIsRealized] = useState(meeting.status === "Realizada" || meeting.status === "ATA Gerada");
  const [presentAttendees, setPresentAttendees] = useState(meeting.attendees || []);
  const [observations, setObservations] = useState("");

  const handleMarkAsRealized = () => {
    const now = new Date().toISOString();
    
    onUpdateMeeting({
      status: "Realizada",
      attendees: presentAttendees
    });

    setIsRealized(true);
  };

  const handleAttendeeToggle = (attendee: string, isPresent: boolean) => {
    if (isPresent) {
      setPresentAttendees(prev => [...prev.filter(a => a !== attendee), attendee]);
    } else {
      setPresentAttendees(prev => prev.filter(a => a !== attendee));
    }
  };

  // Lista exemplo de participantes (pode vir de props ou estado global)
  const allPossibleAttendees = [
    "João Silva - Presidente",
    "Maria Santos - Vice-Presidente", 
    "Carlos Oliveira - Diretor Financeiro",
    "Ana Costa - Diretora Operacional",
    "Roberto Lima - Conselheiro Independente",
    "Fernanda Souza - Conselheira Externa"
  ];

  const isPastMeeting = new Date(meeting.date) < new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${isRealized ? 'text-green-500' : 'text-muted-foreground'}`} />
          Realização da Reunião
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meeting Status */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Status da Reunião</p>
              <p className="text-sm text-muted-foreground">
                {new Date(meeting.date).toLocaleDateString('pt-BR')} às {meeting.time}
              </p>
            </div>
          </div>
          <Badge variant={isRealized ? "default" : "secondary"}>
            {isRealized ? "Realizada" : "Agendada"}
          </Badge>
        </div>

        {/* Realization Check */}
        {!isRealized && isPastMeeting && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="meeting-realized"
                checked={false}
                onCheckedChange={() => {}}
              />
              <Label htmlFor="meeting-realized" className="text-sm font-medium">
                Confirmar que a reunião foi realizada
              </Label>
            </div>

            {/* Attendees Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes Presentes
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {allPossibleAttendees.map(attendee => (
                  <div key={attendee} className="flex items-center space-x-2">
                    <Checkbox
                      id={`attendee-${attendee}`}
                      checked={presentAttendees.includes(attendee)}
                      onCheckedChange={(checked) => 
                        handleAttendeeToggle(attendee, checked as boolean)
                      }
                    />
                    <Label htmlFor={`attendee-${attendee}`} className="text-sm">
                      {attendee}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações sobre a Reunião (Opcional)
              </Label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observações gerais sobre como foi a reunião, pontos importantes, etc."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleMarkAsRealized}
              disabled={presentAttendees.length === 0}
              className="w-full"
            >
              Confirmar Realização da Reunião
            </Button>
          </div>
        )}

        {/* Meeting Already Realized */}
        {isRealized && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Reunião confirmada como realizada</span>
            </div>

            <Separator />

            {/* Present Attendees */}
            {presentAttendees.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participantes Presentes ({presentAttendees.length})
                </Label>
                <div className="grid grid-cols-1 gap-1">
                  {presentAttendees.map(attendee => (
                    <div key={attendee} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {attendee}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observations */}
            {observations && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </Label>
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {observations}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Future Meeting */}
        {!isPastMeeting && (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Esta reunião ainda não aconteceu</p>
            <p className="text-xs">A confirmação de realização ficará disponível após a data agendada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}