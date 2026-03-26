import React, { useState } from "react";
import { Upload, FileAudio, FileText, Play, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MeetingSchedule } from "@/types/annualSchedule";

interface TranscriptionUploaderProps {
  meeting: MeetingSchedule;
  onUpdateMeeting: (updates: Partial<MeetingSchedule>) => void;
}

export function TranscriptionUploader({ 
  meeting, 
  onUpdateMeeting 
}: TranscriptionUploaderProps) {
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const hasRecording = meeting.recording !== undefined;
  const isMeetingRealized = meeting.status === "Realizada" || meeting.status === "ATA Gerada";

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simular upload e processamento
    setTimeout(() => {
      const recording = {
        type: "audio" as const,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };

      onUpdateMeeting({ recording });
      setIsUploading(false);
    }, 2000);
  };

  const handleTranscriptionSave = () => {
    if (!transcriptionText.trim()) return;

    const updatedRecording = {
      ...meeting.recording!,
      transcript: transcriptionText
    };

    onUpdateMeeting({ 
      recording: updatedRecording,
    });
  };

  const handleRemoveRecording = () => {
    onUpdateMeeting({ recording: undefined });
    setTranscriptionText("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5" />
          Gravação e Transcrição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isMeetingRealized && (
          <div className="text-center py-6 text-muted-foreground">
            <FileAudio className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Disponível após a realização da reunião</p>
          </div>
        )}

        {isMeetingRealized && !hasRecording && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-upload">Upload de Gravação</Label>
              <Input
                id="audio-upload"
                type="file"
                accept="audio/*,video/*"
                onChange={handleAudioUpload}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
              <p className="text-xs text-muted-foreground">
                Formatos suportados: MP3, MP4, WAV, M4A (máx. 100MB)
              </p>
            </div>

            {isUploading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Processando gravação...</p>
              </div>
            )}
          </div>
        )}

        {hasRecording && (
          <div className="space-y-4">
            {/* Recording Info */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileAudio className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Gravação da Reunião</p>
                  <p className="text-xs text-muted-foreground">
                    Enviado em {new Date(meeting.recording.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {meeting.recording.type === "audio" ? "Áudio" : "Vídeo"}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRemoveRecording}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Transcription */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcrição da Reunião
                </Label>
                {(meeting.recording as any)?.transcript && (
                  <Badge variant="default" className="text-xs">
                    Transcrição Salva
                  </Badge>
                )}
              </div>

              <Textarea
                value={transcriptionText || (meeting.recording as any)?.transcript || ""}
                onChange={(e) => setTranscriptionText(e.target.value)}
                placeholder="Cole aqui a transcrição da reunião ou digite manualmente..."
                rows={10}
                className="font-mono text-sm"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={handleTranscriptionSave}
                  disabled={!transcriptionText.trim()}
                  size="sm"
                >
                  Salvar Transcrição
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTranscriptionText("")}
                >
                  Limpar
                </Button>
              </div>

              {(meeting.recording as any)?.transcript && (
                <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded-md">
                  ✓ Transcrição salva com sucesso. Esta transcrição será usada para análise automática da pauta.
                </div>
              )}
            </div>

            {/* Processing Status */}
            {transcriptionText && !((meeting.recording as any)?.transcript) && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-3 rounded-md">
                ⚠️ Lembre-se de salvar a transcrição para que ela seja processada pela IA.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}