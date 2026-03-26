// =====================================================
// PHASE 2: DOCUMENT UPLOAD
// Upload e processamento de documentos historicos
// =====================================================

import { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Upload, FileText, Check, Clock, AlertCircle, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useDocumentLibrary, useOnboardingProgress } from '@/hooks/useOnboardingMock';
import { DOCUMENT_ZONES, DocumentCategory, DocumentLibrary } from '@/types/onboarding';

interface Phase2DocumentUploadProps {
  onComplete: () => void;
  onBack?: () => void;
  documents?: DocumentLibrary[];
  onUpload?: (file: File, category: DocumentCategory, title: string) => Promise<void>;
  onDelete?: (documentId: string) => Promise<void>;
  isUploading?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-amber-600" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'Processado';
    case 'processing':
      return 'Processando...';
    case 'failed':
      return 'Erro';
    default:
      return 'Pendente';
  }
}

export function Phase2DocumentUpload({ onComplete, onBack }: Phase2DocumentUploadProps) {
  const { documents, uploadDocument, deleteDocument, isUploading, getDocumentsByCategory } = useDocumentLibrary();
  const { completePhase } = useOnboardingProgress();
  const { toast } = useToast();
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = useCallback(async (e: React.DragEvent, category: DocumentCategory) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      if (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        await uploadDocument(file, category, { title: file.name });
        toast({
          title: 'Documento enviado',
          description: `${file.name} esta sendo processado.`
        });
      } else {
        toast({
          title: 'Formato nao suportado',
          description: 'Por favor, envie apenas arquivos PDF ou Word.',
          variant: 'destructive'
        });
      }
    }
  }, [uploadDocument, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadDocument(file, category, { title: file.name });
      toast({
        title: 'Documento enviado',
        description: `${file.name} esta sendo processado.`
      });
    }
    
    e.target.value = '';
  };

  const handleComplete = async () => {
    await completePhase(2);
    toast({
      title: 'Fase 2 concluida!',
      description: `${documents.length} documentos carregados.`
    });
    onComplete();
  };

  const processedCount = documents.filter(d => d.processing_status === 'completed').length;
  const pendingCount = documents.filter(d => d.processing_status === 'pending' || d.processing_status === 'processing').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documentos</p>
                <p className="text-3xl font-bold">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processados</p>
                <p className="text-3xl font-bold text-green-600">{processedCount}</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Processamento</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Zones */}
      <div className="grid md:grid-cols-2 gap-6">
        {DOCUMENT_ZONES.map((zone) => {
          const categoryDocs = getDocumentsByCategory(zone.category);
          const isActive = activeZone === zone.category;
          const isDragOver = dragOver === zone.category;

          return (
            <Card
              key={zone.category}
              className={`transition-all ${
                isDragOver ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
              } ${zone.required ? 'border-l-4 border-l-amber-400' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {zone.title}
                    {zone.required && (
                      <Badge variant="outline" className="text-amber-600 border-amber-400">
                        Recomendado
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge variant="secondary">{categoryDocs.length} arquivos</Badge>
                </div>
                <CardDescription className="text-xs">
                  {zone.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                    isDragOver
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(zone.category);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, zone.category)}
                  onClick={() => document.getElementById(`file-${zone.category}`)?.click()}
                >
                  <input
                    id={`file-${zone.category}`}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, zone.category)}
                  />
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-slate-400'}`} />
                  <p className="text-sm font-medium">
                    {isDragOver ? 'Solte os arquivos aqui' : 'Arraste ou clique para enviar'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Word (max. 10MB cada)
                  </p>
                </div>

                {/* Examples */}
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Exemplos:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {zone.examples.slice(0, 3).map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>

                {/* Uploaded Files */}
                {categoryDocs.length > 0 && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setActiveZone(isActive ? null : zone.category)}
                    >
                      Ver arquivos ({categoryDocs.length})
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {isActive && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {categoryDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getStatusIcon(doc.processing_status)}
                              <span className="truncate">{doc.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {doc.file_size ? formatFileSize(doc.file_size) : ''}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => deleteDocument(doc.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All Documents Table */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Todos os Documentos</CardTitle>
            <CardDescription>
              Status de processamento de todos os documentos enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.category} • {doc.file_size ? formatFileSize(doc.file_size) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={doc.processing_status === 'completed' ? 'default' : 'secondary'}
                      className={doc.processing_status === 'completed' ? 'bg-green-600' : ''}
                    >
                      {getStatusIcon(doc.processing_status)}
                      <span className="ml-1">{getStatusLabel(doc.processing_status)}</span>
                    </Badge>
                    {doc.processing_status === 'completed' && doc.topics && (
                      <div className="hidden md:flex gap-1">
                        {doc.topics.slice(0, 2).map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando {pendingCount} documento(s)...
            </span>
          )}
        </div>

        <Button onClick={handleComplete}>
          {documents.length === 0 ? 'Pular esta etapa' : 'Continuar'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default Phase2DocumentUpload;
