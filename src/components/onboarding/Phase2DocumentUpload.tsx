import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  FileText,
  File,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentLibrary, DocumentCategory } from '@/types/onboarding';
import { DOCUMENT_ZONES } from '@/types/onboarding';

interface Phase2DocumentUploadProps {
  documents: DocumentLibrary[];
  onUpload: (file: File, category: DocumentCategory, title: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  onComplete: () => void;
  onBack?: () => void;
  isUploading?: boolean;
}

export function Phase2DocumentUpload({
  documents,
  onUpload,
  onDelete,
  onComplete,
  onBack,
  isUploading
}: Phase2DocumentUploadProps) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, DocumentLibrary[]>);

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDragOver(category);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent, category: DocumentCategory) => {
      e.preventDefault();
      setDragOver(null);
      setUploadingCategory(category);

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await onUpload(file, category, file.name.replace(/\.[^/.]+$/, ''));
      }

      setUploadingCategory(null);
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setUploadingCategory(category);

      for (const file of files) {
        await onUpload(file, category, file.name.replace(/\.[^/.]+$/, ''));
      }

      setUploadingCategory(null);
      e.target.value = '';
    },
    [onUpload]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Processado
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processando
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Falhou
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType === 'pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-blue-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalDocuments = documents.length;
  const processedDocuments = documents.filter(d => d.processing_status === 'completed').length;
  const progress = totalDocuments > 0 ? (processedDocuments / totalDocuments) * 100 : 0;

  const hasMinimumDocuments = () => {
    const governanceDocs = documentsByCategory['governance']?.length || 0;
    const minutesDocs = documentsByCategory['minutes']?.length || 0;
    return governanceDocs >= 1 || minutesDocs >= 1;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Documentos Enviados</h3>
              <p className="text-sm text-muted-foreground">
                {totalDocuments} documentos | {processedDocuments} processados
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <p className="text-sm text-muted-foreground">Processamento</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Upload Zones */}
      <div className="space-y-4">
        {DOCUMENT_ZONES.map((zone) => {
          const categoryDocs = documentsByCategory[zone.category] || [];
          const isUploading = uploadingCategory === zone.category;
          const isDragOver = dragOver === zone.category;

          return (
            <Card key={zone.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {zone.title}
                      {zone.required && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatorio
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{zone.description}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {categoryDocs.length}{' '}
                    {zone.maxFiles ? `/ ${zone.maxFiles}` : ''} arquivos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  onDragOver={(e) => handleDragOver(e, zone.category)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, zone.category)}
                  className={cn(
                    'relative rounded-lg border-2 border-dashed p-6 text-center transition-all',
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50',
                    isUploading && 'pointer-events-none opacity-50'
                  )}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Enviando...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Arraste arquivos aqui ou{' '}
                        <Label
                          htmlFor={`upload-${zone.category}`}
                          className="cursor-pointer text-primary hover:underline"
                        >
                          clique para selecionar
                        </Label>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, XLSX (max 10MB por arquivo)
                      </p>
                      <Input
                        id={`upload-${zone.category}`}
                        type="file"
                        multiple
                        accept=".pdf,.docx,.xlsx,.doc,.xls"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, zone.category)}
                      />
                    </>
                  )}
                </div>

                {/* Examples */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Exemplos de documentos:
                  </p>
                  <ul className="mt-1 text-xs text-muted-foreground">
                    {zone.examples.slice(0, 3).map((example, i) => (
                      <li key={i}>- {example}</li>
                    ))}
                  </ul>
                </div>

                {/* Uploaded Documents */}
                {categoryDocs.length > 0 && (
                  <div className="space-y-2">
                    {categoryDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.file_type)}
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.file_size)} | {doc.file_type?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.processing_status)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skip Option */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Nao tem documentos agora?</p>
              <p className="text-xs text-muted-foreground">
                Voce pode adicionar documentos depois em Configuracoes
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onComplete}>
              <SkipForward className="mr-2 h-4 w-4" />
              Pular esta etapa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={onComplete} disabled={isUploading}>
          {hasMinimumDocuments() ? (
            <>
              Concluir Fase 2
              <CheckCircle className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Proxima Fase
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

