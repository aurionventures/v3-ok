import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentType, DOCUMENT_TYPES, getFileTypeIcon } from "@/types/document";
import { FileText, Upload, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrganDocumentsSectionProps {
  organId: string;
  organName: string;
}

export const OrganDocumentsSection = ({ organId, organName }: OrganDocumentsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const { documents, loading, uploadDocument, deleteDocument, getDownloadUrl } = useDocuments();

  const organDocuments = documents.filter(doc => doc.council_id === organId);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!selectedType) {
      toast.error("Selecione o tipo de documento primeiro");
      return;
    }

    const file = files[0];
    const config = DOCUMENT_TYPES[selectedType];

    // Validar formato
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!config.acceptedFormats.includes(fileExt)) {
      toast.error(`Formato não aceito. Use: ${config.acceptedFormats.join(', ')}`);
      return;
    }

    // Validar tamanho
    if (file.size > config.maxSize * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${config.maxSize}MB`);
      return;
    }

    try {
      await uploadDocument({
        council_id: organId,
        name: file.name,
        type: selectedType,
        file: file,
      });
      toast.success("Documento enviado com sucesso!");
      setSelectedType("");
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      toast.error("Erro ao enviar documento");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const url = await getDownloadUrl(docId);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      toast.success("Download iniciado");
    } catch (error) {
      toast.error("Erro ao baixar documento");
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Deseja realmente excluir este documento?")) return;
    
    try {
      await deleteDocument(docId);
      toast.success("Documento excluído");
    } catch (error) {
      toast.error("Erro ao excluir documento");
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Documentos ({organDocuments.length})</span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Gerenciar Documentos - {organName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seletor de Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DocumentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting_minutes">ATA</SelectItem>
                  <SelectItem value="preliminary_docs">Documento Prévio</SelectItem>
                  <SelectItem value="financial_docs">Documentos Financeiros</SelectItem>
                  <SelectItem value="council_documents">Documentos Gerais</SelectItem>
                  <SelectItem value="contracts">Contratos</SelectItem>
                  <SelectItem value="presentations">Apresentações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Área de Upload */}
            {selectedType && (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {DOCUMENT_TYPES[selectedType].acceptedFormats.join(', ')} - Máx. {DOCUMENT_TYPES[selectedType].maxSize}MB
                </p>
                <input
                  type="file"
                  id={`file-upload-${organId}`}
                  className="hidden"
                  accept={DOCUMENT_TYPES[selectedType].acceptedFormats.join(',')}
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Button asChild variant="outline">
                  <label htmlFor={`file-upload-${organId}`} className="cursor-pointer">
                    Selecionar Arquivos
                  </label>
                </Button>
              </div>
            )}

            {/* Lista de Documentos */}
            {organDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Documentos Carregados</h4>
                <div className="space-y-2">
                  {organDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getFileTypeIcon(doc.name)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{DOCUMENT_TYPES[doc.type as DocumentType]?.title || doc.type}</span>
                            {doc.created_at && (
                              <>
                                <span>•</span>
                                <span>{format(new Date(doc.created_at), 'dd/MM/yyyy')}</span>
                              </>
                            )}
                            {doc.file_size && (
                              <>
                                <span>•</span>
                                <span>{doc.file_size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(doc.id, doc.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {organDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum documento carregado ainda
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
