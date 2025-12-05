import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Clock, 
  User, 
  Download,
  Eye,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useATARevisions } from '@/hooks/useATARevisions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ATAVersionHistoryProps {
  meetingId: string;
}

export const ATAVersionHistory: React.FC<ATAVersionHistoryProps> = ({ meetingId }) => {
  const { getVersionsByMeeting } = useATARevisions();
  const [viewContent, setViewContent] = useState<{ version: number; content: string } | null>(null);
  
  const versions = getVersionsByMeeting(meetingId);

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <History className="h-12 w-12 mb-3" />
        <p className="text-lg font-medium">Nenhuma versão registrada</p>
        <p className="text-sm">As versões serão criadas quando sugestões forem aplicadas</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-3 py-2 pr-4">
          {versions.map((version, index) => (
            <Card key={version.id} className={index === 0 ? 'border-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Versão {version.version}</span>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            Atual
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(version.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {version.createdBy}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{version.changesSummary}</p>
                      {version.suggestionsApplied.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {version.suggestionsApplied.length} sugestão(ões) aplicada(s)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewContent({ version: version.version, content: version.content })}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* View Content Modal */}
      <Dialog open={!!viewContent} onOpenChange={() => setViewContent(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Versão {viewContent?.version}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap p-4">
              {viewContent?.content}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
