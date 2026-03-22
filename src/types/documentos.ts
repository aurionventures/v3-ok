export interface DocumentoRow {
  id: string;
  empresa_id: string | null;
  titulo: string;
  tipo: string | null;
  arquivo_url: string | null;
  tamanho: number | null;
  categoria: string | null;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

export interface Documento {
  id: string;
  name: string;
  category: string | null;
  uploadDate: string;
  size: string;
  type: string;
  description: string | null;
  arquivoUrl: string | null;
}

export interface DocumentoInsert {
  empresa_id: string;
  titulo: string;
  tipo?: string | null;
  arquivo_url: string;
  tamanho?: number | null;
  categoria?: string | null;
  descricao?: string | null;
}
