// =====================================================
// HOOKS MOCK - ONBOARDING & KNOWLEDGE BASE
// Versao para demonstracao sem Supabase
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import type {
  CompanyProfile,
  CompanyStrategicContext,
  DocumentLibrary,
  OnboardingProgress,
  GovernanceHistorySeed
} from '@/types/onboarding';
import {
  getMockData,
  MOCK_COMPANY_ID,
  type DemoMode
} from '@/data/mockOnboardingData';

// =====================================================
// STORAGE KEYS
// =====================================================

const STORAGE_KEYS = {
  PROFILE: 'onboarding_profile',
  CONTEXT: 'onboarding_context',
  DOCUMENTS: 'onboarding_documents',
  PROGRESS: 'onboarding_progress',
  HISTORY: 'onboarding_history',
  DEMO_MODE: 'onboarding_demo_mode'
} as const;

// =====================================================
// HELPERS
// =====================================================

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================================================
// HOOK: Demo Mode Control
// =====================================================

export function useDemoMode() {
  const [mode, setModeState] = useState<DemoMode>(() => 
    getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete')
  );

  const setMode = useCallback((newMode: DemoMode) => {
    setModeState(newMode);
    saveToStorage(STORAGE_KEYS.DEMO_MODE, newMode);
    
    // Reset data based on new mode
    const data = getMockData(newMode);
    saveToStorage(STORAGE_KEYS.PROFILE, data.profile);
    saveToStorage(STORAGE_KEYS.CONTEXT, data.context);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, data.documents);
    saveToStorage(STORAGE_KEYS.PROGRESS, data.progress);
    saveToStorage(STORAGE_KEYS.HISTORY, data.history);
    
    // Reload page to apply changes
    window.location.reload();
  }, []);

  const resetDemo = useCallback(() => {
    setMode('complete');
  }, [setMode]);

  return { mode, setMode, resetDemo };
}

// =====================================================
// HOOK: Company Profile
// =====================================================

interface UseCompanyProfileResult {
  profile: CompanyProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<CompanyProfile>) => Promise<void>;
  isSaving: boolean;
}

export function useCompanyProfile(): UseCompanyProfileResult {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      await delay(300); // Simular latencia
      
      try {
        const mode = getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete');
        const defaultData = getMockData(mode);
        const storedProfile = getFromStorage<CompanyProfile | null>(
          STORAGE_KEYS.PROFILE,
          defaultData.profile
        );
        setProfile(storedProfile);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<CompanyProfile>) => {
    setIsSaving(true);
    await delay(500); // Simular latencia de rede
    
    try {
      const updated = {
        ...profile,
        ...data,
        updated_at: new Date().toISOString()
      } as CompanyProfile;
      
      saveToStorage(STORAGE_KEYS.PROFILE, updated);
      setProfile(updated);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, [profile]);

  return { profile, isLoading, error, updateProfile, isSaving };
}

// =====================================================
// HOOK: Strategic Context
// =====================================================

interface UseStrategicContextResult {
  context: CompanyStrategicContext | null;
  isLoading: boolean;
  error: Error | null;
  updateContext: (data: Partial<CompanyStrategicContext>) => Promise<void>;
  isSaving: boolean;
}

export function useStrategicContext(): UseStrategicContextResult {
  const [context, setContext] = useState<CompanyStrategicContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      setIsLoading(true);
      await delay(300);
      
      try {
        const mode = getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete');
        const defaultData = getMockData(mode);
        const storedContext = getFromStorage<CompanyStrategicContext | null>(
          STORAGE_KEYS.CONTEXT,
          defaultData.context
        );
        setContext(storedContext);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContext();
  }, []);

  const updateContext = useCallback(async (data: Partial<CompanyStrategicContext>) => {
    setIsSaving(true);
    await delay(500);
    
    try {
      const updated = {
        ...context,
        ...data,
        updated_at: new Date().toISOString()
      } as CompanyStrategicContext;
      
      saveToStorage(STORAGE_KEYS.CONTEXT, updated);
      setContext(updated);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, [context]);

  return { context, isLoading, error, updateContext, isSaving };
}

// =====================================================
// HOOK: Document Library
// =====================================================

interface UseDocumentLibraryResult {
  documents: DocumentLibrary[];
  isLoading: boolean;
  error: Error | null;
  uploadDocument: (file: File, category: string, metadata?: Partial<DocumentLibrary>) => Promise<DocumentLibrary>;
  deleteDocument: (id: string) => Promise<void>;
  isUploading: boolean;
  getDocumentsByCategory: (category: string) => DocumentLibrary[];
}

export function useDocumentLibrary(): UseDocumentLibraryResult {
  const [documents, setDocuments] = useState<DocumentLibrary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      await delay(300);
      
      try {
        const mode = getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete');
        const defaultData = getMockData(mode);
        const storedDocs = getFromStorage<DocumentLibrary[]>(
          STORAGE_KEYS.DOCUMENTS,
          defaultData.documents
        );
        setDocuments(storedDocs);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  const uploadDocument = useCallback(async (
    file: File,
    category: string,
    metadata?: Partial<DocumentLibrary>
  ): Promise<DocumentLibrary> => {
    setIsUploading(true);
    
    // Simular upload (1-3 segundos)
    await delay(1000 + Math.random() * 2000);
    
    try {
      const newDoc: DocumentLibrary = {
        id: `doc-${Date.now()}`,
        company_id: MOCK_COMPANY_ID,
        title: metadata?.title || file.name,
        category: category as DocumentLibrary['category'],
        file_path: `demo/${category}/${file.name}`,
        file_size: file.size,
        file_type: file.name.split('.').pop() || 'unknown',
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'user-demo',
        processing_status: 'pending',
        relevant_for_agent_a: false,
        relevant_for_agent_b: true,
        relevant_for_agent_c: true,
        relevant_for_agent_d: false,
        is_indexed: false,
        created_at: new Date().toISOString(),
        ...metadata
      };
      
      const updatedDocs = [...documents, newDoc];
      saveToStorage(STORAGE_KEYS.DOCUMENTS, updatedDocs);
      setDocuments(updatedDocs);
      
      // Simular processamento automatico apos upload
      setTimeout(() => processDocument(newDoc.id), 2000);
      
      return newDoc;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsUploading(false);
    }
  }, [documents]);

  const processDocument = useCallback(async (docId: string) => {
    // Simular processamento do documento
    await delay(3000);
    
    const storedDocs = getFromStorage<DocumentLibrary[]>(STORAGE_KEYS.DOCUMENTS, []);
    const updatedDocs = storedDocs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          processing_status: 'completed' as const,
          processed_at: new Date().toISOString(),
          extracted_text: 'Texto extraido automaticamente do documento...',
          entities_detected: { people: [], organizations: [] },
          topics: ['Governanca', 'Estrategia'],
          sentiment_score: 0.1,
          is_indexed: true,
          index_last_updated: new Date().toISOString()
        };
      }
      return doc;
    });
    
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updatedDocs);
    setDocuments(updatedDocs);
    
    // Atualizar progresso
    updateProgressAfterUpload(updatedDocs.length);
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    await delay(300);
    
    try {
      const updatedDocs = documents.filter(doc => doc.id !== id);
      saveToStorage(STORAGE_KEYS.DOCUMENTS, updatedDocs);
      setDocuments(updatedDocs);
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }, [documents]);

  const getDocumentsByCategory = useCallback((category: string) => {
    return documents.filter(doc => doc.category === category);
  }, [documents]);

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
    isUploading,
    getDocumentsByCategory
  };
}

// =====================================================
// HOOK: Onboarding Progress
// =====================================================

interface UseOnboardingProgressResult {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  error: Error | null;
  updateProgress: (data: Partial<OnboardingProgress>) => Promise<void>;
  completePhase: (phase: 1 | 2 | 3) => Promise<void>;
  calculateScore: () => number;
  isSaving: boolean;
}

export function useOnboardingProgress(): UseOnboardingProgressResult {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      await delay(300);
      
      try {
        const mode = getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete');
        const defaultData = getMockData(mode);
        const storedProgress = getFromStorage<OnboardingProgress | null>(
          STORAGE_KEYS.PROGRESS,
          defaultData.progress
        );
        setProgress(storedProgress);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  const updateProgress = useCallback(async (data: Partial<OnboardingProgress>) => {
    setIsSaving(true);
    await delay(300);
    
    try {
      const updated = {
        ...progress,
        ...data,
        updated_at: new Date().toISOString()
      } as OnboardingProgress;
      
      saveToStorage(STORAGE_KEYS.PROGRESS, updated);
      setProgress(updated);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, [progress]);

  const completePhase = useCallback(async (phase: 1 | 2 | 3) => {
    const now = new Date().toISOString();
    
    const updates: Partial<OnboardingProgress> = {};
    
    if (phase === 1) {
      updates.phase_1_basic_setup = true;
      updates.phase_1_completed_at = now;
      updates.basic_setup_score = 85;
    } else if (phase === 2) {
      updates.phase_2_document_upload = true;
      updates.phase_2_completed_at = now;
      updates.document_upload_score = 75;
    } else if (phase === 3) {
      updates.phase_3_strategic_context = true;
      updates.phase_3_completed_at = now;
      updates.strategic_context_score = 70;
      updates.status = 'completed';
    }
    
    // Recalcular score geral
    const profile = getFromStorage<CompanyProfile | null>(STORAGE_KEYS.PROFILE, null);
    const context = getFromStorage<CompanyStrategicContext | null>(STORAGE_KEYS.CONTEXT, null);
    const docs = getFromStorage<DocumentLibrary[]>(STORAGE_KEYS.DOCUMENTS, []);
    
    updates.overall_score = calculateKnowledgeBaseScore(profile, context, docs);
    
    await updateProgress(updates);
  }, [updateProgress]);

  const calculateScore = useCallback(() => {
    if (!progress) return 0;
    return progress.overall_score;
  }, [progress]);

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    completePhase,
    calculateScore,
    isSaving
  };
}

// =====================================================
// HOOK: Governance History
// =====================================================

interface UseGovernanceHistoryResult {
  history: GovernanceHistorySeed[];
  isLoading: boolean;
  error: Error | null;
  addRecord: (record: Omit<GovernanceHistorySeed, 'id' | 'created_at'>) => Promise<void>;
}

export function useGovernanceHistory(): UseGovernanceHistoryResult {
  const [history, setHistory] = useState<GovernanceHistorySeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      await delay(300);
      
      try {
        const mode = getFromStorage<DemoMode>(STORAGE_KEYS.DEMO_MODE, 'complete');
        const defaultData = getMockData(mode);
        const storedHistory = getFromStorage<GovernanceHistorySeed[]>(
          STORAGE_KEYS.HISTORY,
          defaultData.history
        );
        setHistory(storedHistory);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  const addRecord = useCallback(async (record: Omit<GovernanceHistorySeed, 'id' | 'created_at'>) => {
    await delay(300);
    
    try {
      const newRecord: GovernanceHistorySeed = {
        ...record,
        id: `history-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      const updatedHistory = [...history, newRecord];
      saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);
      setHistory(updatedHistory);
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }, [history]);

  return { history, isLoading, error, addRecord };
}

// =====================================================
// HELPER: Calculate Knowledge Base Score
// =====================================================

function calculateKnowledgeBaseScore(
  profile: CompanyProfile | null,
  context: CompanyStrategicContext | null,
  documents: DocumentLibrary[]
): number {
  let score = 0;
  
  // Fase 1: Perfil Basico (40 pontos max)
  if (profile) {
    // Campos criticos (20 pontos)
    if (profile.legal_name) score += 4;
    if (profile.tax_id) score += 4;
    if (profile.primary_sector) score += 4;
    if (profile.company_size) score += 4;
    if (profile.headquarters_state) score += 4;
    
    // Campos importantes (12 pontos)
    if (profile.annual_revenue_range) score += 3;
    if (profile.ownership_structure) score += 3;
    if (profile.number_of_shareholders) score += 3;
    if (profile.founded_date) score += 3;
    
    // Campos complementares (8 pontos)
    if (profile.products_services && Array.isArray(profile.products_services) && profile.products_services.length > 0) score += 2;
    if (profile.target_markets && profile.target_markets.length > 0) score += 2;
    if (profile.erp_system) score += 2;
    if (profile.certifications && profile.certifications.length > 0) score += 2;
  }
  
  // Fase 2: Documentos (30 pontos max)
  const processedDocs = documents.filter(d => d.processing_status === 'completed');
  const docScore = Math.min(30, processedDocs.length * 5);
  score += docScore;
  
  // Bonus por categorias
  const categories = new Set(processedDocs.map(d => d.category));
  if (categories.has('governance')) score += 2;
  if (categories.has('minutes')) score += 2;
  if (categories.has('financial')) score += 2;
  if (categories.has('strategic')) score += 2;
  
  // Fase 3: Contexto Estrategico (30 pontos max)
  if (context) {
    // Visao e missao (10 pontos)
    if (context.mission) score += 5;
    if (context.vision) score += 5;
    
    // Objetivos e stakeholders (12 pontos)
    if (context.strategic_objectives && context.strategic_objectives.length > 0) {
      score += Math.min(6, context.strategic_objectives.length * 2);
    }
    if (context.key_stakeholders && context.key_stakeholders.length > 0) {
      score += Math.min(6, context.key_stakeholders.length);
    }
    
    // Riscos e competidores (8 pontos)
    if (context.known_risks && context.known_risks.length > 0) {
      score += Math.min(4, context.known_risks.length);
    }
    if (context.main_competitors && context.main_competitors.length > 0) {
      score += Math.min(4, context.main_competitors.length);
    }
  }
  
  return Math.min(100, score);
}

// Helper para atualizar progresso apos upload
function updateProgressAfterUpload(totalDocs: number) {
  const storedProgress = getFromStorage<OnboardingProgress | null>(STORAGE_KEYS.PROGRESS, null);
  if (!storedProgress) return;
  
  const updated = {
    ...storedProgress,
    documents_uploaded: totalDocs,
    documents_processed: totalDocs,
    updated_at: new Date().toISOString()
  };
  
  saveToStorage(STORAGE_KEYS.PROGRESS, updated);
}

// =====================================================
// EXPORTS
// =====================================================

export {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  calculateKnowledgeBaseScore
};

