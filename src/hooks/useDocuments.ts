import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentsService } from '@/services/documentService';
import { CouncilDocument, DocumentType, DocumentFilters } from '@/types/document';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<CouncilDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentCounts, setDocumentCounts] = useState<Record<DocumentType, number>>({
    council_documents: 0,
    meeting_minutes: 0,
    contracts: 0
  });
  const { user } = useAuth();

  // Buscar documentos da empresa
  const fetchDocuments = useCallback(async (filters?: DocumentFilters) => {
    if (!user?.company) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const docs = await DocumentsService.getCompanyDocuments(user.company, filters);
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos';
      setError(errorMessage);
      console.error('Erro ao buscar documentos:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.company]);

  // Buscar documentos por tipo
  const fetchDocumentsByType = useCallback(async (type: DocumentType) => {
    if (!user?.company) return;

    try {
      setLoading(true);
      setError(null);
      const docs = await DocumentsService.getDocumentsByType(user.company, type);
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos por tipo';
      setError(errorMessage);
      console.error('Erro ao buscar documentos por tipo:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.company]);

  // Buscar documentos de um conselho específico
  const fetchCouncilDocuments = useCallback(async (councilId: string) => {
    if (!user?.company) return;

    try {
      setLoading(true);
      setError(null);
      const docs = await DocumentsService.getCouncilDocuments(councilId, user.company);
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documentos do conselho';
      setError(errorMessage);
      console.error('Erro ao buscar documentos do conselho:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.company]);

  // Buscar contagem de documentos por tipo
  const fetchDocumentCounts = useCallback(async () => {
    if (!user?.company) return;

    try {
      const counts = await DocumentsService.getDocumentCountsByType(user.company);
      setDocumentCounts(counts);
    } catch (err) {
      console.error('Erro ao buscar contagem de documentos:', err);
    }
  }, [user?.company]);

  // Fazer upload de documento
  const uploadDocument = async (uploadData: {
    council_id: string;
    name: string;
    type: DocumentType;
    file: File;
  }) => {
    if (!user?.company || !user?.email) {
      throw new Error('Usuário não autenticado ou sem empresa associada');
    }

    try {
      const document = await DocumentsService.uploadDocument({
        ...uploadData,
        company_id: user.company,
        uploaded_by: user.email
      });
      
      // Atualizar lista de documentos
      setDocuments(prev => [document, ...prev]);
      
      // Atualizar contagem
      setDocumentCounts(prev => ({
        ...prev,
        [uploadData.type]: prev[uploadData.type] + 1
      }));

      return document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload do documento';
      setError(errorMessage);
      throw err;
    }
  };

  // Deletar documento
  const deleteDocument = async (documentId: string) => {
    try {
      await DocumentsService.deleteDocument(documentId);
      
      // Remover da lista local
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      // Atualizar contagem
      const deletedDoc = documents.find(doc => doc.id === documentId);
      if (deletedDoc?.type) {
        setDocumentCounts(prev => ({
          ...prev,
          [deletedDoc.type]: Math.max(0, prev[deletedDoc.type] - 1)
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar documento';
      setError(errorMessage);
      throw err;
    }
  };

  // Buscar documento específico
  const getDocument = async (documentId: string) => {
    try {
      return await DocumentsService.getDocument(documentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar documento';
      setError(errorMessage);
      throw err;
    }
  };

  // Gerar URL de download
  const getDownloadUrl = async (documentId: string) => {
    try {
      return await DocumentsService.getDownloadUrl(documentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar URL de download';
      setError(errorMessage);
      throw err;
    }
  };

  // Atualizar documento
  const updateDocument = async (documentId: string, updates: Partial<CouncilDocument>) => {
    try {
      const updatedDoc = await DocumentsService.updateDocument(documentId, updates);
      
      // Atualizar na lista local
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? updatedDoc : doc)
      );
      
      return updatedDoc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar documento';
      setError(errorMessage);
      throw err;
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Efeito para buscar documentos quando a empresa muda
  useEffect(() => {
    if (user?.company) {
      fetchDocuments();
      fetchDocumentCounts();
    } else {
      setDocuments([]);
      setDocumentCounts({
        council_documents: 0,
        meeting_minutes: 0,
        contracts: 0
      });
      setLoading(false);
    }
  }, [user?.company, fetchDocuments, fetchDocumentCounts]);

  return {
    documents,
    loading,
    error,
    documentCounts,
    fetchDocuments,
    fetchDocumentsByType,
    fetchCouncilDocuments,
    fetchDocumentCounts,
    uploadDocument,
    deleteDocument,
    getDocument,
    getDownloadUrl,
    updateDocument,
    clearError
  };
};
