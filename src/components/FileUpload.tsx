import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onFileUpload?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "Fazer upload de arquivo",
  multiple = false,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png",
  maxSize = 10,
  onFileUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    
    if (validFiles.length < selectedFiles.length) {
      toast.error(`Alguns arquivos excedem o tamanho máximo de ${maxSize}MB`);
    }

    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);
      onFileUpload?.(validFiles);
      toast.success(`${validFiles.length} arquivo(s) carregado(s) com sucesso`);
    }

    // Reset input value
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    
    if (validFiles.length < droppedFiles.length) {
      toast.error(`Alguns arquivos excedem o tamanho máximo de ${maxSize}MB`);
    }

    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);
      onFileUpload?.(validFiles);
      toast.success(`${validFiles.length} arquivo(s) carregado(s) com sucesso`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full" data-tour="checklist-upload">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Arraste e solte seus arquivos aqui ou
          </p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              {label}
              <input
                type="file"
                className="hidden"
                multiple={multiple}
                accept={accept}
                onChange={handleFileChange}
              />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground">
            Tamanho máximo: {maxSize}MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => removeFile(index)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;