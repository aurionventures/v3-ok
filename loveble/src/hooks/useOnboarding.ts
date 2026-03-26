import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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

// NOTA: As tabelas company_profile, company_strategic_context, document_library,
// governance_history_seed e onboarding_progress sao criadas pela migration
// 20260110_knowledge_base_onboarding.sql. Apos aplicar a migration e regenerar
// os tipos do Supabase, os type assertions abaixo podem ser removidos.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// =====================================================
// HOOK: useCompanyProfile
// Gerencia o perfil da empresa (Fase 1)
// =====================================================

export function useCompanyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = user?.company || '';

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['company-profile', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data, error } = await db
        .from('company_profile')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (error) throw error;
      return data as CompanyProfile | null;
    },
    enabled: !!companyId
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (formData: Partial<Phase1FormData>) => {
      const profileData = mapPhase1FormToProfile(formData, companyId);
      
      const { data: existing } = await db
        .from('company_profile')
        .select('id')
        .eq('company_id', companyId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await db
          .from('company_profile')
          .update(profileData)
          .eq('company_id', companyId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await db
          .from('company_profile')
          .insert(profileData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile', companyId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
      toast({
        title: 'Perfil salvo',
        description: 'As informacoes da empresa foram salvas com sucesso.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar',
        description: 'Nao foi possivel salvar o perfil da empresa.',
        variant: 'destructive'
      });
      console.error('Error saving profile:', error);
    }
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    saveProfile: saveProfileMutation.mutateAsync,
    isSaving: saveProfileMutation.isPending
  };
}

// =====================================================
// HOOK: useStrategicContext
// Gerencia o contexto estrategico (Fase 3)
// =====================================================

export function useStrategicContext() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = user?.company || '';

  const {
    data: context,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['strategic-context', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data, error } = await db
        .from('company_strategic_context')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (error) throw error;
      return data as CompanyStrategicContext | null;
    },
    enabled: !!companyId
  });

  const saveContextMutation = useMutation({
    mutationFn: async (formData: Partial<Phase3FormData>) => {
      const contextData = mapPhase3FormToContext(formData, companyId);
      
      const { data: existing } = await db
        .from('company_strategic_context')
        .select('id')
        .eq('company_id', companyId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await db
          .from('company_strategic_context')
          .update(contextData)
          .eq('company_id', companyId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await db
          .from('company_strategic_context')
          .insert(contextData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-context', companyId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
      toast({
        title: 'Contexto salvo',
        description: 'O contexto estrategico foi salvo com sucesso.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar',
        description: 'Nao foi possivel salvar o contexto estrategico.',
        variant: 'destructive'
      });
      console.error('Error saving strategic context:', error);
    }
  });

  return {
    context,
    isLoading,
    error,
    refetch,
    saveContext: saveContextMutation.mutateAsync,
    isSaving: saveContextMutation.isPending
  };
}

// =====================================================
// HOOK: useDocumentLibrary
// Gerencia upload e listagem de documentos (Fase 2)
// =====================================================

export function useDocumentLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = user?.company || '';

  const {
    data: documents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['document-library', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await db
        .from('document_library')
        .select('*')
        .eq('company_id', companyId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as DocumentLibrary[];
    },
    enabled: !!companyId
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({
      file,
      category,
      title,
      documentDate
    }: {
      file: File;
      category: DocumentCategory;
      title: string;
      documentDate?: string;
    }) => {
      // 1. Upload para Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}/${category}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      // 2. Criar registro no banco
      const { data, error } = await db
        .from('document_library')
        .insert({
          company_id: companyId,
          title,
          category,
          file_path: fileName,
          file_size: file.size,
          file_type: fileExt,
          document_date: documentDate,
          uploaded_by: user?.id,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      // 3. Trigger processamento (Edge Function)
      await triggerDocumentProcessing(data.id);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-library', companyId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
      toast({
        title: 'Documento enviado',
        description: 'O documento foi enviado e esta sendo processado.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro no upload',
        description: 'Nao foi possivel enviar o documento.',
        variant: 'destructive'
      });
      console.error('Error uploading document:', error);
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const doc = documents?.find(d => d.id === documentId);
      
      if (doc?.file_path) {
        await supabase.storage
          .from('documents')
          .remove([doc.file_path]);
      }

      const { error } = await db
        .from('document_library')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-library', companyId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
      toast({
        title: 'Documento removido',
        description: 'O documento foi removido com sucesso.'
      });
    }
  });

  const documentsByCategory = documents?.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, DocumentLibrary[]>) || {};

  return {
    documents,
    documentsByCategory,
    isLoading,
    error,
    refetch,
    uploadDocument: uploadDocumentMutation.mutateAsync,
    isUploading: uploadDocumentMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    isDeleting: deleteDocumentMutation.isPending
  };
}

// =====================================================
// HOOK: useOnboardingProgress
// Gerencia o progresso geral do onboarding
// =====================================================

export function useOnboardingProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = user?.company || '';

  const {
    data: progress,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['onboarding-progress', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data, error } = await db
        .from('onboarding_progress')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (error) throw error;
      return data as OnboardingProgress | null;
    },
    enabled: !!companyId
  });

  const initProgressMutation = useMutation({
    mutationFn: async () => {
      const { data: existing } = await db
        .from('onboarding_progress')
        .select('id')
        .eq('company_id', companyId)
        .maybeSingle();

      if (existing) return existing;

      const { data, error } = await db
        .from('onboarding_progress')
        .insert({
          company_id: companyId,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
    }
  });

  const updatePhaseMutation = useMutation({
    mutationFn: async ({
      phase,
      completed
    }: {
      phase: 1 | 2 | 3;
      completed: boolean;
    }) => {
      const updateData: Partial<OnboardingProgress> = {};
      
      if (phase === 1) {
        updateData.phase_1_basic_setup = completed;
        if (completed) updateData.phase_1_completed_at = new Date().toISOString();
      } else if (phase === 2) {
        updateData.phase_2_document_upload = completed;
        if (completed) updateData.phase_2_completed_at = new Date().toISOString();
      } else if (phase === 3) {
        updateData.phase_3_strategic_context = completed;
        if (completed) updateData.phase_3_completed_at = new Date().toISOString();
      }

      const { data, error } = await db
        .from('onboarding_progress')
        .update(updateData)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;

      // Recalcular score
      await recalculateScore(companyId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await db
        .from('onboarding_progress')
        .update({
          status: 'completed'
        })
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;

      // Atualizar company_profile
      await db
        .from('company_profile')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('company_id', companyId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-profile', companyId] });
      toast({
        title: 'Onboarding completo!',
        description: 'Sua base de conhecimento esta pronta para uso.'
      });
    }
  });

  // Calcular proximo passo
  const getNextSteps = useCallback((): NextStep[] => {
    if (!progress) return [];
    
    const steps: NextStep[] = [];

    if (!progress.phase_1_basic_setup) {
      steps.push({
        title: 'Completar Setup Basico',
        description: 'Preencha as informacoes essenciais da empresa',
        href: '/knowledge-base/setup',
        priority: 1
      });
    }

    if (!progress.phase_2_document_upload && progress.phase_1_basic_setup) {
      steps.push({
        title: 'Fazer Upload de Documentos',
        description: 'Envie documentos de governanca e historico',
        href: '/knowledge-base/documents',
        priority: 2
      });
    }

    if (!progress.phase_3_strategic_context && progress.phase_1_basic_setup) {
      steps.push({
        title: 'Definir Contexto Estrategico',
        description: 'Adicione missao, visao e objetivos',
        href: '/knowledge-base/strategic',
        priority: 3
      });
    }

    return steps;
  }, [progress]);

  // Verificar se esta pronto para uso
  const isReadyForUse = (progress?.overall_score || 0) >= 50;
  const isExcellent = (progress?.overall_score || 0) >= 90;

  return {
    progress,
    isLoading,
    error,
    refetch,
    initProgress: initProgressMutation.mutateAsync,
    updatePhase: updatePhaseMutation.mutateAsync,
    completeOnboarding: completeOnboardingMutation.mutateAsync,
    getNextSteps,
    isReadyForUse,
    isExcellent,
    score: progress?.overall_score || 0
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function mapPhase1FormToProfile(
  formData: Partial<Phase1FormData>,
  companyId: string
): Partial<CompanyProfile> {
  return {
    company_id: companyId,
    legal_name: formData.legalName || '',
    trade_name: formData.tradeName,
    tax_id: formData.taxId || '',
    founded_date: formData.foundedDate,
    company_size: formData.companySize,
    primary_sector: formData.primarySector || '',
    secondary_sectors: formData.secondarySectors,
    industry_vertical: formData.industryVertical,
    headquarters_country: formData.headquarters?.country || 'BR',
    headquarters_state: formData.headquarters?.state,
    headquarters_city: formData.headquarters?.city,
    operating_countries: formData.operatingCountries,
    operating_states: formData.operatingStates,
    annual_revenue_range: formData.annualRevenueRange,
    is_publicly_traded: formData.isPubliclyTraded || false,
    stock_ticker: formData.stockTicker,
    ownership_structure: formData.ownershipStructure,
    number_of_shareholders: formData.numberOfShareholders,
    products_services: formData.productsServices,
    target_markets: formData.targetMarkets,
    erp_system: formData.erpSystem,
    crm_system: formData.crmSystem,
    bi_tools: formData.biTools,
    has_financial_data: formData.availableData?.financial || false,
    has_operational_data: formData.availableData?.operational || false,
    has_hr_data: formData.availableData?.hr || false,
    has_sales_data: formData.availableData?.sales || false,
    has_compliance_data: formData.availableData?.compliance || false,
    certifications: formData.certifications,
    regulatory_bodies: formData.regulatoryBodies,
    compliance_frameworks: formData.complianceFrameworks
  };
}

function mapPhase3FormToContext(
  formData: Partial<Phase3FormData>,
  companyId: string
): Partial<CompanyStrategicContext> {
  return {
    company_id: companyId,
    mission: formData.mission,
    vision: formData.vision,
    values: formData.values,
    business_model: formData.businessModel,
    competitive_advantages: formData.competitiveAdvantages,
    key_success_factors: formData.keySuccessFactors,
    strategic_objectives: formData.strategicObjectives,
    okrs: formData.okrs,
    key_stakeholders: formData.keyStakeholders,
    market_position: formData.marketPosition,
    main_competitors: formData.mainCompetitors,
    competitive_intensity: formData.competitiveIntensity,
    known_risks: formData.knownRisks,
    risk_appetite: formData.riskAppetite,
    expansion_plans: formData.expansionPlans,
    investment_priorities: formData.investmentPriorities,
    esg_commitments: formData.esgCommitments,
    sustainability_goals: formData.sustainabilityGoals
  };
}

async function triggerDocumentProcessing(documentId: string): Promise<void> {
  try {
    await supabase.functions.invoke('process-uploaded-document', {
      body: { documentId }
    });
  } catch (error) {
    console.error('Error triggering document processing:', error);
  }
}

async function recalculateScore(companyId: string): Promise<number> {
  try {
    const { data, error } = await db
      .rpc('calculate_knowledge_base_score', { p_company_id: companyId });
    
    if (error) throw error;
    return data as number;
  } catch (error) {
    console.error('Error recalculating score:', error);
    return 0;
  }
}

