import { supabase } from '@/lib/supabase';
import { CouncilDocument, DocumentType, DocumentUpload, DocumentFilters } from '@/types/document';

// Função utilitária para validação segura de tipos de documento
const validateDocumentType = (type: string | null): DocumentType | null => {
  const validTypes: DocumentType[] = ['council_documents', 'meeting_minutes', 'contracts'];
  return validTypes.includes(type as DocumentType) ? type as DocumentType : null;
};

// Função utilitária para transformar dados do banco em CouncilDocument seguro
const transformToCouncilDocument = (doc: any): CouncilDocument => ({
  ...doc,
  type: validateDocumentType(doc.type)
});

// Serviço para gerenciar documentos do conselho
export class DocumentsService {
  
  /**
   * Busca todos os documentos de uma empresa (mult-tenant)
   */
  static async getCompanyDocuments(companyId: string, filters?: DocumentFilters): Promise<CouncilDocument[]> {
    try {
      let query = supabase
        .from('council_documents')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.council_id) {
        query = query.eq('council_id', filters.council_id);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar documentos:', error);
        throw new Error('Erro ao buscar documentos da empresa');
      }

      if (!data) return [];
      
      // Transformação segura dos dados
      return data.map(transformToCouncilDocument);
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Busca documentos por tipo específico
   */
  static async getDocumentsByType(companyId: string, type: DocumentType): Promise<CouncilDocument[]> {
    try {
      const { data, error } = await supabase
        .from('council_documents')
        .select('*')
        .eq('company_id', companyId)
        .eq('type', type)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar documentos por tipo:', error);
        throw new Error('Erro ao buscar documentos por tipo');
      }

      if (!data) return [];
      
      // Transformação segura dos dados
      return data.map(transformToCouncilDocument);
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Busca documentos de um conselho específico
   */
  static async getCouncilDocuments(councilId: string, companyId: string): Promise<CouncilDocument[]> {
    try {
      const { data, error } = await supabase
        .from('council_documents')
        .select('*')
        .eq('council_id', councilId)
        .eq('company_id', companyId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar documentos do conselho:', error);
        throw new Error('Erro ao buscar documentos do conselho');
      }

      if (!data) return [];
      
      // Transformação segura dos dados
      return data.map(transformToCouncilDocument);
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Faz upload de um documento
   */
  static async uploadDocument(upload: DocumentUpload): Promise<CouncilDocument> {
    try {
      console.log('Upload data:', {
        company_id: upload.company_id,
        council_id: upload.council_id,
        file_name: upload.file.name,
        file_type: upload.file.type,
        file_size: upload.file.size
      });

      // Validações de segurança
      this.validateUpload(upload);

      // Primeiro, faz upload do arquivo para o storage
      const fileUrl = await this.uploadFileToStorage(upload.file, upload.company_id, upload.council_id, upload.type);
      
      // Depois, salva os metadados no banco
      const { data, error } = await supabase
        .from('council_documents')
        .insert({
          council_id: upload.council_id,
          company_id: upload.company_id,
          name: upload.name,
          type: upload.type,
          file_url: fileUrl,
          version: '1.0',
          status: 'active',
          uploaded_by: upload.uploaded_by,
          file_size: upload.file.size.toString(),
          mime_type: upload.file.type
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar documento:', error);
        throw new Error('Erro ao salvar documento no banco de dados');
      }

      if (!data) {
        throw new Error('Documento não foi salvo corretamente no banco de dados');
      }

      // Retorna o documento sem mutar os dados originais
      return data as CouncilDocument;
    } catch (error) {
      console.error('Erro no upload do documento:', error);
      throw error;
    }
  }

  /**
   * Validações de segurança para upload
   */
  private static validateUpload(upload: DocumentUpload): void {
    // Validação de company_id
    if (!upload.company_id || upload.company_id.trim() === '') {
      throw new Error('Company ID é obrigatório');
    }

    // Validação de council_id
    if (!upload.council_id || upload.council_id.trim() === '') {
      throw new Error('Council ID é obrigatório');
    }

    // Validação de nome do arquivo
    if (!upload.name || upload.name.trim() === '') {
      throw new Error('Nome do arquivo é obrigatório');
    }

    // Validação de tipo de arquivo
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedMimeTypes.includes(upload.file.type)) {
      throw new Error(`Tipo de arquivo não permitido: ${upload.file.type}`);
    }

    // Validação de tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (upload.file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
    }

    // Validação de extensão
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + upload.file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Extensão de arquivo não permitida: ${fileExtension}`);
    }
  }

  /**
   * Faz upload do arquivo para o Supabase Storage
   */
  private static async uploadFileToStorage(
    file: File, 
    companyId: string,
    councilId: string, 
    documentType: DocumentType
  ): Promise<string> {
    try {
      // Validação de segurança: verificar se são UUIDs válidos
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      // Para company_id, aceitar tanto UUID quanto string simples (como "testssss")
      if (!companyId || companyId.trim() === '') {
        throw new Error('Company ID é obrigatório');
      }
      
      if (!uuidRegex.test(councilId)) {
        throw new Error('Council ID deve ser um UUID válido');
      }

      // Sanitizar company_id para uso em path (remover caracteres perigosos)
      const sanitizedCompanyId = companyId.replace(/[^a-zA-Z0-9_-]/g, '');
      const sanitizedCouncilId = councilId;

      console.log('IDs sanitizados:', {
        original_company_id: companyId,
        sanitized_company_id: sanitizedCompanyId,
        original_council_id: councilId,
        sanitized_council_id: sanitizedCouncilId
      });

      // Cria um nome único para o arquivo
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentType}_${timestamp}.${fileExtension}`;
      const filePath = `${sanitizedCompanyId}/councils/${sanitizedCouncilId}/documents/${fileName}`;

      console.log('Fazendo upload para:', filePath);

      // Faz upload do arquivo
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload do arquivo:', error);
        console.error('Detalhes do erro:', error);
        throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
      }

      // Retorna a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload para storage:', error);
      throw error;
    }
  }

  /**
   * Atualiza um documento
   */
  static async updateDocument(
    documentId: string, 
    updates: Partial<CouncilDocument>
  ): Promise<CouncilDocument> {
    try {
      const { data, error } = await supabase
        .from('council_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar documento:', error);
        throw new Error('Erro ao atualizar documento');
      }

      if (!data) {
        throw new Error('Documento não encontrado após atualização');
      }

      // Transformação segura dos dados
      return transformToCouncilDocument(data);
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Remove um documento
   */
  static async deleteDocument(documentId: string): Promise<void> {
    try {
      // Primeiro, busca o documento para obter a URL do arquivo
      const { data: document, error: fetchError } = await supabase
        .from('council_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar documento:', fetchError);
        throw new Error('Erro ao buscar documento para exclusão');
      }

      // Remove o arquivo do storage se existir
      if (document?.file_url) {
        try {
          // Extrai o caminho do arquivo da URL
          const url = new URL(document.file_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(-4).join('/'); // Pega os últimos 4 segmentos
          
          await supabase.storage
            .from('documents')
            .remove([filePath]);
        } catch (storageError) {
          console.warn('Erro ao remover arquivo do storage:', storageError);
          // Continua mesmo se não conseguir remover do storage
        }
      }

      // Remove o registro do banco
      const { error } = await supabase
        .from('council_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Erro ao deletar documento:', error);
        throw new Error('Erro ao deletar documento');
      }
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Busca um documento específico
   */
  static async getDocument(documentId: string): Promise<CouncilDocument | null> {
    try {
      const { data, error } = await supabase
        .from('council_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) {
        console.error('Erro ao buscar documento:', error);
        throw new Error('Erro ao buscar documento');
      }

      if (!data) {
        return null;
      }

      // Transformação segura dos dados
      return transformToCouncilDocument(data);
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Gera URL de download para um documento
   */
  static async getDownloadUrl(documentId: string): Promise<string> {
    try {
      const document = await this.getDocument(documentId);
      
      if (!document?.file_url) {
        throw new Error('Documento não encontrado ou sem arquivo');
      }

      // Se for uma URL pública, retorna diretamente
      if (document.file_url.startsWith('http')) {
        return document.file_url;
      }

      // Se for um caminho do storage, gera URL assinada
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_url, 3600); // 1 hora

      if (error) {
        console.error('Erro ao gerar URL de download:', error);
        throw new Error('Erro ao gerar URL de download');
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }

  /**
   * Conta documentos por tipo para uma empresa
   */
  static async getDocumentCountsByType(companyId: string): Promise<Record<DocumentType, number>> {
    try {
      const { data, error } = await supabase
        .from('council_documents')
        .select('type')
        .eq('company_id', companyId)
        .eq('status', 'active');

      if (error) {
        console.error('Erro ao contar documentos:', error);
        throw new Error('Erro ao contar documentos por tipo');
      }

      const counts: Record<DocumentType, number> = {
        council_documents: 0,
        meeting_minutes: 0,
        contracts: 0
      };

      data?.forEach(doc => {
        if (doc.type && doc.type in counts) {
          counts[doc.type as DocumentType]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Erro no serviço de documentos:', error);
      throw error;
    }
  }
}
