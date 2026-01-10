import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  getMockOnboardingData,
  MOCK_COMPANY_PROFILE,
  MOCK_STRATEGIC_CONTEXT,
  MOCK_DOCUMENTS,
  MOCK_ONBOARDING_PROGRESS,
  MOCK_PHASE1_FORM_DATA,
  MOCK_PHASE3_FORM_DATA
} from '@/data/mockOnboardingData';
import type {
  CompanyProfile,
  CompanyStrategicContext,
  DocumentLibrary,
  OnboardingProgress,
  Phase1FormData,
  Phase3FormData,
  DocumentCategory,
  NextStep
} from '@/types/onboarding';

// =====================================================
// HOOK: useMockCompanyProfile
// Gerencia o perfil da empresa com dados mock
// =====================================================

export function useMockCompanyProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<CompanyProfile>(MOCK_COMPANY_PROFILE);
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = useCallback(async (formData: Partial<Phase1FormData>) => {
    setIsSaving(true);
    
    // Simula delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Atualiza o profile mock com os novos dados
    setProfile(prev => ({
      ...prev,
      legal_name: formData.legalName || prev.legal_name,
      trade_name: formData.tradeName || prev.trade_name,
      tax_id: formData.taxId || prev.tax_id,
      company_size: formData.companySize || prev.company_size,
      primary_sector: formData.primarySector || prev.primary_sector,
      updated_at: new Date().toISOString()
    }));

    toast({
      title: 'Perfil salvo',
      description: 'As informações da empresa foram salvas com sucesso.'
    });

    setIsSaving(false);
    return profile;
  }, [profile, toast]);

  return {
    profile,
    isLoading: false,
    error: null,
    refetch: () => {},
    saveProfile,
    isSaving,
    initialFormData: MOCK_PHASE1_FORM_DATA
  };
}

// =====================================================
// HOOK: useMockStrategicContext
// Gerencia o contexto estratégico com dados mock
// =====================================================

export function useMockStrategicContext() {
  const { toast } = useToast();
  const [context, setContext] = useState<CompanyStrategicContext>(MOCK_STRATEGIC_CONTEXT);
  const [isSaving, setIsSaving] = useState(false);

  const saveContext = useCallback(async (formData: Partial<Phase3FormData>) => {
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setContext(prev => ({
      ...prev,
      mission: formData.mission || prev.mission,
      vision: formData.vision || prev.vision,
      values: formData.values || prev.values,
      strategic_objectives: formData.strategicObjectives || prev.strategic_objectives,
      known_risks: formData.knownRisks || prev.known_risks,
      updated_at: new Date().toISOString()
    }));

    toast({
      title: 'Contexto salvo',
      description: 'O contexto estratégico foi salvo com sucesso.'
    });

    setIsSaving(false);
    return context;
  }, [context, toast]);

  return {
    context,
    isLoading: false,
    error: null,
    refetch: () => {},
    saveContext,
    isSaving,
    initialFormData: MOCK_PHASE3_FORM_DATA
  };
}

// =====================================================
// HOOK: useMockDocumentLibrary
// Gerencia upload e listagem de documentos mock
// =====================================================

export function useMockDocumentLibrary() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentLibrary[]>(MOCK_DOCUMENTS);
  const [isUploading, setIsUploading] = useState(false);

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, DocumentLibrary[]>);

  const uploadDocument = useCallback(async ({
    file,
    category,
    title
  }: {
    file: File;
    category: DocumentCategory;
    title: string;
  }) => {
    setIsUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDoc: DocumentLibrary = {
      id: `doc-${Date.now()}`,
      company_id: 'demo-company-001',
      title,
      category,
      file_path: `demo-company-001/${category}/${file.name}`,
      file_size: file.size,
      file_type: file.name.split('.').pop() || 'pdf',
      document_date: new Date().toISOString().split('T')[0],
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'user-001',
      processing_status: 'pending',
      relevant_for_agent_a: false,
      relevant_for_agent_b: true,
      relevant_for_agent_c: false,
      relevant_for_agent_d: false,
      is_indexed: false,
      created_at: new Date().toISOString()
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Simula processamento após 3 segundos
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, processing_status: 'completed' as const, processed_at: new Date().toISOString() }
            : doc
        )
      );
    }, 3000);

    toast({
      title: 'Documento enviado',
      description: 'O documento foi enviado e está sendo processado.'
    });

    setIsUploading(false);
    return newDoc;
  }, [toast]);

  const deleteDocument = useCallback(async (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    toast({
      title: 'Documento removido',
      description: 'O documento foi removido com sucesso.'
    });
  }, [toast]);

  return {
    documents,
    documentsByCategory,
    isLoading: false,
    error: null,
    refetch: () => {},
    uploadDocument,
    isUploading,
    deleteDocument,
    isDeleting: false
  };
}

// =====================================================
// HOOK: useMockOnboardingProgress
// Gerencia o progresso geral do onboarding mock
// =====================================================

export function useMockOnboardingProgress() {
  const { toast } = useToast();
  const [progress, setProgress] = useState<OnboardingProgress>(MOCK_ONBOARDING_PROGRESS);

  const getNextSteps = useCallback((): NextStep[] => {
    return progress.next_steps || [];
  }, [progress]);

  const updatePhase = useCallback(async ({
    phase,
    completed
  }: {
    phase: 1 | 2 | 3;
    completed: boolean;
  }) => {
    setProgress(prev => {
      const updates: Partial<OnboardingProgress> = {};
      
      if (phase === 1) {
        updates.phase_1_basic_setup = completed;
        if (completed) {
          updates.phase_1_completed_at = new Date().toISOString();
          updates.basic_setup_score = 100;
        }
      } else if (phase === 2) {
        updates.phase_2_document_upload = completed;
        if (completed) {
          updates.phase_2_completed_at = new Date().toISOString();
          updates.document_upload_score = 100;
        }
      } else if (phase === 3) {
        updates.phase_3_strategic_context = completed;
        if (completed) {
          updates.phase_3_completed_at = new Date().toISOString();
          updates.strategic_context_score = 100;
        }
      }

      // Recalcula score geral
      const newBasic = updates.basic_setup_score ?? prev.basic_setup_score;
      const newDoc = updates.document_upload_score ?? prev.document_upload_score;
      const newStrategic = updates.strategic_context_score ?? prev.strategic_context_score;
      updates.overall_score = Math.round(newBasic * 0.3 + newDoc * 0.4 + newStrategic * 0.3);

      return { ...prev, ...updates };
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    setProgress(prev => ({
      ...prev,
      status: 'completed',
      overall_score: 100,
      phase_1_basic_setup: true,
      phase_2_document_upload: true,
      phase_3_strategic_context: true
    }));

    toast({
      title: 'Onboarding completo!',
      description: 'Sua base de conhecimento está pronta para uso.'
    });
  }, [toast]);

  const initProgress = useCallback(async () => {
    // Já inicializado com mock
    return progress;
  }, [progress]);

  return {
    progress,
    isLoading: false,
    error: null,
    refetch: () => {},
    getNextSteps,
    updatePhase,
    completeOnboarding,
    initProgress,
    score: progress.overall_score,
    isReadyForUse: progress.overall_score >= 50
  };
}

// =====================================================
// COMBINED HOOK: useMockOnboarding
// Hook principal que combina todos os hooks mock
// =====================================================

export function useMockOnboarding() {
  const companyProfile = useMockCompanyProfile();
  const strategicContext = useMockStrategicContext();
  const documentLibrary = useMockDocumentLibrary();
  const onboardingProgress = useMockOnboardingProgress();

  return {
    // Company Profile
    profile: companyProfile.profile,
    saveProfile: companyProfile.saveProfile,
    isSavingProfile: companyProfile.isSaving,
    phase1FormData: companyProfile.initialFormData,

    // Strategic Context
    context: strategicContext.context,
    saveContext: strategicContext.saveContext,
    isSavingContext: strategicContext.isSaving,
    phase3FormData: strategicContext.initialFormData,

    // Documents
    documents: documentLibrary.documents,
    documentsByCategory: documentLibrary.documentsByCategory,
    uploadDocument: documentLibrary.uploadDocument,
    deleteDocument: documentLibrary.deleteDocument,
    isUploading: documentLibrary.isUploading,

    // Progress
    progress: onboardingProgress.progress,
    score: onboardingProgress.score,
    isReadyForUse: onboardingProgress.isReadyForUse,
    nextSteps: onboardingProgress.getNextSteps(),
    updatePhase: onboardingProgress.updatePhase,
    completeOnboarding: onboardingProgress.completeOnboarding,

    // Loading states
    isLoading: false
  };
}
