import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, User, Calendar, X, Check, FileSpreadsheet, Presentation, FileType } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedByEmail: string;
    uploadedAt: string;
    meetingTitle: string;
    url: string;
  } | null;
  onApprove: (documentId: string) => void;
  onReject: (documentId: string) => void;
}

export const DocumentPreviewModal = ({
  open,
  onOpenChange,
  document,
  onApprove,
  onReject
}: DocumentPreviewModalProps) => {
  if (!document) return null;

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getFileTypeLabel = (type: string): string => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('word') || type.includes('document')) return 'Word';
    return 'Documento';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-12 w-12 text-red-500" />;
    if (type.includes('powerpoint') || type.includes('presentation')) return <Presentation className="h-12 w-12 text-orange-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
    if (type.includes('word') || type.includes('document')) return <FileType className="h-12 w-12 text-blue-500" />;
    return <FileText className="h-12 w-12 text-gray-500" />;
  };

  const isPDF = document.type.includes('pdf');

  const handleApprove = () => {
    onApprove(document.id);
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(document.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pré-visualização do Documento
          </DialogTitle>
          <DialogDescription>
            Revise o documento antes de aprovar ou rejeitar
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Document Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{document.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{getFileTypeLabel(document.type)}</Badge>
                  <Badge variant="outline">{formatFileSize(document.size)}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <div>
                  <span className="font-medium text-foreground">{document.uploadedBy}</span>
                  <div className="text-xs">{document.uploadedByEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <div>
                  <span className="font-medium text-foreground">{document.meetingTitle}</span>
                  <div className="text-xs">
                    {format(new Date(document.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="border rounded-lg overflow-hidden bg-muted/10">
            {isPDF ? (
              <div className="w-full" style={{ height: '500px' }}>
                <iframe
                  src={document.url}
                  className="w-full h-full"
                  title={document.name}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                {getFileIcon(document.type)}
                <div className="text-center space-y-2">
                  <p className="font-medium text-lg">
                    Visualização não disponível para {getFileTypeLabel(document.type)}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Este tipo de arquivo não pode ser visualizado diretamente no navegador.
                    Faça o download para abrir no aplicativo apropriado.
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Documento
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Fechar
          </Button>
          <Button 
            variant="outline"
            onClick={handleReject}
            className="flex-1 sm:flex-initial border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          <Button 
            onClick={handleApprove}
            className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
