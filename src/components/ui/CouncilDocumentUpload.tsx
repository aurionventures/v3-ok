import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DocumentType, DocumentTypeConfig, getDocumentTypeConfig } from "@/types/document";
import { DocumentsService } from "@/services/documentService";
import { useAuth } from "@/contexts/AuthContext";

interface CouncilDocumentUploadProps {
  councilId: string;
  documentType: DocumentType;
  onUploadSuccess?: () => void;
  className?: string;
}

const CouncilDocumentUpload: React.FC<CouncilDocumentUploadProps> = ({
  councilId,
  documentType,
  onUploadSuccess,
  className = ""
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const config = getDocumentTypeConfig(documentType);

  const validateFile = (file: File): boolean => {
    // Verifica o tamanho
    if (file.size > config.maxSize * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo ${file.name} excede o tamanho máximo de ${config.maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Verifica a extensão
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!config.acceptedFormats.includes(fileExtension)) {
      toast({
        title: "Formato não suportado",
        description: `O arquivo ${file.name} não está em um formato aceito. Formatos aceitos: ${config.acceptedFormats.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(validateFile);
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);

    if (validFiles.length > 0) {
      toast({
        title: "Arquivo(s) selecionado(s)",
        description: `${validFiles.length} arquivo(s) adicionado(s) com sucesso`,
      });
    }

    // Reset the input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateFile);
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);

    if (validFiles.length > 0) {
      toast({
        title: "Arquivo(s) adicionado(s)",
        description: `${validFiles.length} arquivo(s) adicionado(s) com sucesso`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione pelo menos um arquivo para fazer upload",
        variant: "destructive",
      });
      return;
    }

    if (!user?.company) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não possui empresa associada",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Faz upload de cada arquivo
      for (const file of files) {
        await DocumentsService.uploadDocument({
          council_id: councilId,
          company_id: user.company,
          name: file.name,
          type: documentType,
          file: file,
          uploaded_by: user.email || 'unknown'
        });
      }

      toast({
        title: "Upload realizado com sucesso",
        description: `${files.length} arquivo(s) enviado(s) com sucesso`,
      });

      // Limpa a lista de arquivos
      setFiles([]);
      
      // Chama callback de sucesso
      onUploadSuccess?.();

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload dos arquivos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {config.description}
        </p>
      </div>

      {/* Área de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Clique para fazer upload ou arraste e solte
        </p>
        <p className="text-xs text-gray-500 mb-4">
          {config.acceptedFormats.join(', ')} (Máx. {config.maxSize}MB)
        </p>
        
        <input
          type="file"
          multiple
          accept={config.acceptedFormats.join(',')}
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${documentType}`}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`file-input-${documentType}`)?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar Arquivos
        </Button>
      </div>

      {/* Lista de arquivos selecionados */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Arquivos selecionados ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de upload */}
      {files.length > 0 && (
        <div className="mt-4">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {config.uploadButtonText}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Aviso sobre tipos de arquivo */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Formatos aceitos:</p>
            <p>{config.acceptedFormats.join(', ')}</p>
            <p className="mt-1">Tamanho máximo: {config.maxSize}MB por arquivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilDocumentUpload;
