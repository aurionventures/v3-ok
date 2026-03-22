import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  /** Ao preencher, exibe botão "Salvar no histórico" e chama ao clicar (após sucesso, limpa a lista) */
  onUpload?: (files: File[]) => Promise<void>;
  saveButtonLabel?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "Fazer upload de arquivo",
  multiple = false,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png",
  maxSize = 10,
  onUpload,
  saveButtonLabel = "Salvar no histórico",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (!onUpload || files.length === 0) return;
    setIsUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Arquivo muito grande",
        description: `Alguns arquivos excedem o tamanho máximo de ${maxSize}MB`,
        variant: "destructive",
      });
    }

    setFiles(prevFiles => {
      if (multiple) {
        return [...prevFiles, ...validFiles];
      }
      return validFiles;
    });

    toast({
      title: "Arquivo carregado",
      description: `${validFiles.length} arquivo(s) carregado(s) com sucesso`,
    });

    // Reset the input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    
    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Arquivo muito grande",
        description: `Alguns arquivos excedem o tamanho máximo de ${maxSize}MB`,
        variant: "destructive",
      });
    }

    setFiles(prevFiles => {
      if (multiple) {
        return [...prevFiles, ...validFiles];
      }
      return validFiles;
    });

    toast({
      title: "Arquivo carregado",
      description: `${validFiles.length} arquivo(s) carregado(s) com sucesso`,
    });
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
        </p>
        <p className="text-xs text-gray-500">
          {accept.split(",").join(", ")} (Máx. {maxSize}MB)
        </p>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          id="fileUpload"
        />
        <Button
          className="mt-4"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("fileUpload")?.click()}
        >
          {label}
        </Button>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
                    <span className="text-xs uppercase">{file.name.split(".").pop()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
          {onUpload && (
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={isUploading}
            >
              {isUploading ? "Salvando..." : saveButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
