// Tipos de documentos do conselho
export type DocumentType = 
  | 'council_documents'    // Documentos dos Conselhos
  | 'meeting_minutes'      // Atas de Reuniões  
  | 'contracts';           // Contratos de Conselheiros

// Interface para documento do conselho
export interface CouncilDocument {
  id: string;
  council_id: string | null;
  company_id: string | null;
  name: string;
  type: DocumentType | null;
  file_url: string | null;
  version: string | null;
  status: string | null;
  uploaded_by: string | null;
  file_size: string | null;
  mime_type: string | null;
  created_at: string | null;
}

// Interface para upload de documento
export interface DocumentUpload {
  council_id: string;
  company_id: string;
  name: string;
  type: DocumentType;
  file: File;
  uploaded_by: string;
}

// Interface para filtros de documentos
export interface DocumentFilters {
  council_id?: string;
  type?: DocumentType;
  status?: string;
  search?: string;
}

// Configurações para cada tipo de documento
export interface DocumentTypeConfig {
  type: DocumentType;
  title: string;
  description: string;
  acceptedFormats: string[];
  maxSize: number; // em MB
  uploadButtonText: string;
  icon: string;
}

// Configurações dos tipos de documentos
export const DOCUMENT_TYPES: Record<DocumentType, DocumentTypeConfig> = {
  council_documents: {
    type: 'council_documents',
    title: 'Documentos dos Conselhos',
    description: 'Documentos oficiais e regulamentares dos conselhos',
    acceptedFormats: ['.pdf', '.doc', '.docx', '.ppt', '.pptx'],
    maxSize: 10,
    uploadButtonText: 'Fazer upload de documentos de conselhos',
    icon: '📄'
  },
  meeting_minutes: {
    type: 'meeting_minutes',
    title: 'Atas de Reuniões',
    description: 'Atas e registros de reuniões dos conselhos',
    acceptedFormats: ['.pdf', '.doc', '.docx'],
    maxSize: 10,
    uploadButtonText: 'Fazer upload de atas',
    icon: '📋'
  },
  contracts: {
    type: 'contracts',
    title: 'Contratos de Conselheiros',
    description: 'Contratos e acordos dos membros do conselho',
    acceptedFormats: ['.pdf', '.doc', '.docx'],
    maxSize: 10,
    uploadButtonText: 'Fazer upload de contratos',
    icon: '📝'
  }
};

// Função para obter configuração do tipo de documento
export const getDocumentTypeConfig = (type: DocumentType): DocumentTypeConfig => {
  return DOCUMENT_TYPES[type];
};

// Função para obter todos os tipos de documentos
export const getAllDocumentTypes = (): DocumentTypeConfig[] => {
  return Object.values(DOCUMENT_TYPES);
};

// Função para formatar tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Função para obter ícone do tipo de arquivo
export const getFileTypeIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'ppt':
    case 'pptx':
      return '📊';
    case 'xls':
    case 'xlsx':
      return '📈';
    default:
      return '📁';
  }
};

// Função para obter cor do tipo de arquivo
export const getFileTypeColor = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'text-red-500';
    case 'doc':
    case 'docx':
      return 'text-blue-500';
    case 'ppt':
    case 'pptx':
      return 'text-orange-500';
    case 'xls':
    case 'xlsx':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};
