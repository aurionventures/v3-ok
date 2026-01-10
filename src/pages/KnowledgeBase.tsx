import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  FileText,
  Target,
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react';
import {
  Phase1BasicSetup,
  Phase2DocumentUpload,
  Phase3StrategicContext,
  OnboardingDashboard
} from '@/components/onboarding';
import {
  useCompanyProfile,
  useStrategicContext,
  useDocumentLibrary,
  useOnboardingProgress
} from '@/hooks/useOnboarding';
import type { Phase1FormData, Phase3FormData, DocumentCategory } from '@/types/onboarding';
import legacyLogo from '@/assets/legacy-logo-new.png';

type TabValue = 'dashboard' | 'phase-1' | 'phase-2' | 'phase-3';

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabValue | null;
  const [activeTab, setActiveTab] = useState<TabValue>(tabParam || 'dashboard');

  // Hooks
  const { profile, saveProfile, isSaving: isSavingProfile } = useCompanyProfile();
  const { context, saveContext, isSaving: isSavingContext } = useStrategicContext();
  const {
    documents,
    uploadDocument,
    deleteDocument,
    isUploading
  } = useDocumentLibrary();
  const {
    progress,
    score,
    getNextSteps,
    initProgress,
    updatePhase,
    completeOnboarding,
    isReadyForUse
  } = useOnboardingProgress();

  // Initialize progress on mount
  useEffect(() => {
    initProgress();
  }, [initProgress]);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    setSearchParams({ tab: value });
  };

  const navigateToPhase = (phase: 1 | 2 | 3) => {
    const tabValue = `phase-${phase}` as TabValue;
    setActiveTab(tabValue);
    setSearchParams({ tab: tabValue });
  };

  // Phase 1 handlers
  const handlePhase1Complete = async (data: Phase1FormData) => {
    await saveProfile(data);
    await updatePhase({ phase: 1, completed: true });
    navigateToPhase(2);
  };

  // Phase 2 handlers
  const handleDocumentUpload = async (
    file: File,
    category: DocumentCategory,
    title: string
  ) => {
    await uploadDocument({ file, category, title });
  };

  const handlePhase2Complete = async () => {
    await updatePhase({ phase: 2, completed: true });
    navigateToPhase(3);
  };

  // Phase 3 handlers
  const handlePhase3Complete = async (data: Phase3FormData) => {
    await saveContext(data);
    await updatePhase({ phase: 3, completed: true });
    setActiveTab('dashboard');
    setSearchParams({ tab: 'dashboard' });
  };

  // Launch MOAT
  const handleLaunchMOAT = async () => {
    await completeOnboarding();
    navigate('/copiloto-governanca');
  };

  // Map profile to form data
  const getPhase1InitialData = (): Partial<Phase1FormData> | undefined => {
    if (!profile) return undefined;
    return {
      legalName: profile.legal_name,
      tradeName: profile.trade_name || '',
      taxId: profile.tax_id,
      foundedDate: profile.founded_date || '',
      companySize: profile.company_size,
      primarySector: profile.primary_sector,
      secondarySectors: profile.secondary_sectors || [],
      industryVertical: profile.industry_vertical || '',
      headquarters: {
        country: profile.headquarters_country || 'BR',
        state: profile.headquarters_state || '',
        city: profile.headquarters_city || ''
      },
      operatingStates: profile.operating_states || [],
      annualRevenueRange: profile.annual_revenue_range,
      isPubliclyTraded: profile.is_publicly_traded,
      stockTicker: profile.stock_ticker || '',
      ownershipStructure: profile.ownership_structure,
      numberOfShareholders: profile.number_of_shareholders || 0,
      productsServices: profile.products_services || [],
      targetMarkets: profile.target_markets || [],
      erpSystem: profile.erp_system || '',
      crmSystem: profile.crm_system || '',
      biTools: profile.bi_tools || [],
      availableData: {
        financial: profile.has_financial_data,
        operational: profile.has_operational_data,
        hr: profile.has_hr_data,
        sales: profile.has_sales_data,
        compliance: profile.has_compliance_data
      },
      certifications: profile.certifications || [],
      regulatoryBodies: profile.regulatory_bodies || [],
      complianceFrameworks: profile.compliance_frameworks || []
    };
  };

  // Map context to form data
  const getPhase3InitialData = (): Partial<Phase3FormData> | undefined => {
    if (!context) return undefined;
    return {
      mission: context.mission || '',
      vision: context.vision || '',
      values: context.values || [],
      businessModel: context.business_model || '',
      competitiveAdvantages: context.competitive_advantages || [],
      keySuccessFactors: context.key_success_factors || [],
      strategicObjectives: context.strategic_objectives || [],
      okrs: context.okrs || [],
      keyStakeholders: context.key_stakeholders || [],
      marketPosition: context.market_position,
      mainCompetitors: context.main_competitors || [],
      competitiveIntensity: context.competitive_intensity,
      knownRisks: context.known_risks || [],
      riskAppetite: context.risk_appetite,
      esgCommitments: context.esg_commitments || [],
      sustainabilityGoals: context.sustainability_goals || []
    };
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Base de Conhecimento</h1>
                  <p className="text-muted-foreground">
                    Configure o contexto da sua empresa para o AI Engine ter máxima efetividade
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="phase-1" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Fase 1
                </TabsTrigger>
                <TabsTrigger value="phase-2" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Fase 2
                </TabsTrigger>
                <TabsTrigger value="phase-3" className="gap-2">
                  <Target className="h-4 w-4" />
                  Fase 3
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <OnboardingDashboard
                  progress={progress}
                  score={score}
                  nextSteps={getNextSteps()}
                  onNavigateToPhase={navigateToPhase}
                  onLaunchMOAT={handleLaunchMOAT}
                  isReadyForUse={isReadyForUse}
                />
              </TabsContent>

              <TabsContent value="phase-1">
                <Phase1BasicSetup
                  initialData={getPhase1InitialData()}
                  onComplete={handlePhase1Complete}
                  onBack={() => handleTabChange('dashboard')}
                  isSaving={isSavingProfile}
                />
              </TabsContent>

              <TabsContent value="phase-2">
                <Phase2DocumentUpload
                  documents={documents || []}
                  onUpload={handleDocumentUpload}
                  onDelete={deleteDocument}
                  onComplete={handlePhase2Complete}
                  onBack={() => navigateToPhase(1)}
                  isUploading={isUploading}
                />
              </TabsContent>

              <TabsContent value="phase-3">
                <Phase3StrategicContext
                  initialData={getPhase3InitialData()}
                  onComplete={handlePhase3Complete}
                  onBack={() => navigateToPhase(2)}
                  isSaving={isSavingContext}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

