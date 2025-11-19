import React, { useState } from "react";
import { CheckCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MeetingSchedule } from "@/types/annualSchedule";
import MeetingATAViewer from "./MeetingATAViewer";
import { toast } from "sonner";

interface MeetingRealizationCheckerProps {
  meeting: MeetingSchedule;
  onUpdateMeeting: (updates: Partial<MeetingSchedule>) => void;
}

export function MeetingRealizationChecker({ 
  meeting, 
  onUpdateMeeting 
}: MeetingRealizationCheckerProps) {
  const [isRealized, setIsRealized] = useState(meeting.status === "Realizada" || meeting.status === "ATA Gerada");
  const [confirmRealization, setConfirmRealization] = useState(false);
  const [observations, setObservations] = useState("");
  const [showATADialog, setShowATADialog] = useState(false);
  const [isGeneratingATA, setIsGeneratingATA] = useState(false);

  const handleMarkAsRealized = () => {
    if (!confirmRealization) {
      toast.error("Por favor, confirme que a reunião foi realizada");
      return;
    }
    
    onUpdateMeeting({
      status: "Realizada",
    });

    setIsRealized(true);
    toast.success("Reunião marcada como realizada");
  };

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
                  checked={confirmRealization}
                  onCheckedChange={(checked) => setConfirmRealization(checked as boolean)}
                />
                <Label htmlFor="meeting-realized" className="text-sm font-medium">
                  Confirmar que a reunião foi realizada
                </Label>
              </div>

            <Separator />

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations" className="text-sm font-medium">
                Observações sobre a Reunião
              </Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Adicione observações sobre a realização desta reunião..."
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleMarkAsRealized}
              className="w-full"
              disabled={!confirmRealization}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Realização
            </Button>
          </div>
        )}

        {/* Meeting Already Realized */}
        {isRealized && (
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Reunião Realizada</span>
              </div>
            </div>

            {/* ATA Section - Only for Realized Meetings */}
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ata da Reunião
              </Label>
              
              {meeting.ata ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-green-900">ATA Gerada</p>
                      <p className="text-sm text-green-700">
                        Gerada em {new Date(meeting.ata.generatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button onClick={() => setShowATADialog(true)}>
                      Ver ATA
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-3">
                    A ATA ainda não foi gerada. Você pode gerar automaticamente com IA.
                  </p>
                  <Button 
                    onClick={() => setShowATADialog(true)}
                    className="w-full"
                    disabled={isGeneratingATA}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar ATA com IA
                  </Button>
                </div>
              )}
            </div>
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

        {/* ATA Viewer Dialog */}
        {isRealized && (
          <MeetingATAViewer 
            meeting={meeting}
            isOpen={showATADialog}
            onClose={() => setShowATADialog(false)}
            onGenerateATA={async () => {
              setIsGeneratingATA(true);
              try {
                // Simulate ATA generation (demo mode)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const now = new Date().toISOString();
                onUpdateMeeting({
                  status: "ATA Gerada",
                  minutes: {
                    full: "Ata completa da reunião gerada por IA...",
                    summary: "Resumo executivo da reunião...",
                    generatedAt: now,
                  },
                });

                toast.success("ATA gerada com sucesso!");
              } catch (error) {
                toast.error("Erro ao gerar ATA");
              } finally {
                setIsGeneratingATA(false);
              }
            }}
            isGenerating={isGeneratingATA}
          />
        )}
      </CardContent>
    </Card>
  );
}