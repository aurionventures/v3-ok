// =====================================================
// PHASE 1: BASIC SETUP
// Coleta de informacoes essenciais da empresa
// =====================================================

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Building2, MapPin, DollarSign, Package, Cpu, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCompanyProfile, useOnboardingProgress } from '@/hooks/useOnboardingMock';
import {
  Phase1FormData,
  SECTORS,
  COMPANY_SIZES_LABELS,
  REVENUE_RANGES_LABELS,
  OWNERSHIP_LABELS,
  ERP_SYSTEMS,
  CRM_SYSTEMS,
  BI_TOOLS,
  CERTIFICATIONS,
  TARGET_MARKETS,
  CompanySize,
  RevenueRange,
  OwnershipStructure
} from '@/types/onboarding';

// Estados brasileiros
const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface Phase1BasicSetupProps {
  onComplete: (data?: Phase1FormData) => void;
  onBack?: () => void;
  initialData?: Partial<Phase1FormData>;
  isSaving?: boolean;
}

const SECTIONS = [
  { id: 'company_info', title: 'Dados da Empresa', icon: Building2 },
  { id: 'sector_industry', title: 'Setor e Industria', icon: Package },
  { id: 'geography', title: 'Localizacao', icon: MapPin },
  { id: 'financial', title: 'Financeiro', icon: DollarSign },
  { id: 'systems', title: 'Sistemas', icon: Cpu }
];

const defaultFormData: Phase1FormData = {
  legalName: '',
  tradeName: '',
  taxId: '',
  foundedDate: '',
  companySize: undefined,
  primarySector: '',
  secondarySectors: [],
  industryVertical: '',
  headquarters: {
    country: 'BR',
    state: '',
    city: ''
  },
  operatingCountries: ['BR'],
  operatingStates: [],
  annualRevenueRange: undefined,
  isPubliclyTraded: false,
  stockTicker: '',
  ownershipStructure: undefined,
  numberOfShareholders: undefined,
  productsServices: [],
  targetMarkets: [],
  erpSystem: '',
  crmSystem: '',
  biTools: [],
  availableData: {
    financial: false,
    operational: false,
    hr: false,
    sales: false,
    compliance: false
  },
  certifications: [],
  regulatoryBodies: [],
  complianceFrameworks: []
};

export function Phase1BasicSetup({ onComplete, onBack }: Phase1BasicSetupProps) {
  const { profile, updateProfile, isSaving, isLoading } = useCompanyProfile();
  const { completePhase } = useOnboardingProgress();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Phase1FormData>(defaultFormData);
  const [productInput, setProductInput] = useState('');

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        legalName: profile.legal_name || '',
        tradeName: profile.trade_name || '',
        taxId: profile.tax_id || '',
        foundedDate: profile.founded_date || '',
        companySize: profile.company_size,
        primarySector: profile.primary_sector || '',
        secondarySectors: profile.secondary_sectors || [],
        industryVertical: profile.industry_vertical || '',
        headquarters: {
          country: profile.headquarters_country || 'BR',
          state: profile.headquarters_state || '',
          city: profile.headquarters_city || ''
        },
        operatingCountries: profile.operating_countries || ['BR'],
        operatingStates: profile.operating_states || [],
        annualRevenueRange: profile.annual_revenue_range,
        isPubliclyTraded: profile.is_publicly_traded || false,
        stockTicker: profile.stock_ticker || '',
        ownershipStructure: profile.ownership_structure,
        numberOfShareholders: profile.number_of_shareholders,
        productsServices: profile.products_services || [],
        targetMarkets: profile.target_markets || [],
        erpSystem: profile.erp_system || '',
        crmSystem: profile.crm_system || '',
        biTools: profile.bi_tools || [],
        availableData: {
          financial: profile.has_financial_data || false,
          operational: profile.has_operational_data || false,
          hr: profile.has_hr_data || false,
          sales: profile.has_sales_data || false,
          compliance: profile.has_compliance_data || false
        },
        certifications: profile.certifications || [],
        regulatoryBodies: profile.regulatory_bodies || [],
        complianceFrameworks: profile.compliance_frameworks || []
      });
    }
  }, [profile]);

  const updateFormData = <K extends keyof Phase1FormData>(field: K, value: Phase1FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Save and complete
      await saveProfile();
      await completePhase(1);
      toast({
        title: 'Fase 1 concluida!',
        description: 'Informacoes basicas salvas com sucesso.'
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const saveProfile = async () => {
    await updateProfile({
      legal_name: formData.legalName,
      trade_name: formData.tradeName,
      tax_id: formData.taxId,
      founded_date: formData.foundedDate,
      company_size: formData.companySize,
      primary_sector: formData.primarySector,
      secondary_sectors: formData.secondarySectors,
      industry_vertical: formData.industryVertical,
      headquarters_country: formData.headquarters.country,
      headquarters_state: formData.headquarters.state,
      headquarters_city: formData.headquarters.city,
      operating_countries: formData.operatingCountries,
      operating_states: formData.operatingStates,
      annual_revenue_range: formData.annualRevenueRange,
      is_publicly_traded: formData.isPubliclyTraded,
      stock_ticker: formData.stockTicker,
      ownership_structure: formData.ownershipStructure,
      number_of_shareholders: formData.numberOfShareholders,
      products_services: formData.productsServices,
      target_markets: formData.targetMarkets,
      erp_system: formData.erpSystem,
      crm_system: formData.crmSystem,
      bi_tools: formData.biTools,
      has_financial_data: formData.availableData.financial,
      has_operational_data: formData.availableData.operational,
      has_hr_data: formData.availableData.hr,
      has_sales_data: formData.availableData.sales,
      has_compliance_data: formData.availableData.compliance,
      certifications: formData.certifications
    });
  };

  const addProduct = () => {
    if (productInput.trim()) {
      updateFormData('productsServices', [
        ...formData.productsServices,
        { name: productInput.trim(), category: 'Geral', description: '' }
      ]);
      setProductInput('');
    }
  };

  const removeProduct = (index: number) => {
    updateFormData(
      'productsServices',
      formData.productsServices.filter((_, i) => i !== index)
    );
  };

  const toggleArrayItem = <K extends keyof Phase1FormData>(
    field: K,
    item: string
  ) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      updateFormData(field, currentArray.filter(i => i !== item) as Phase1FormData[K]);
    } else {
      updateFormData(field, [...currentArray, item] as Phase1FormData[K]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderSection = () => {
    switch (SECTIONS[currentSection].id) {
      case 'company_info':
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Razao Social *</Label>
                <Input
                  id="legalName"
                  placeholder="Nome completo da empresa"
                  value={formData.legalName}
                  onChange={(e) => updateFormData('legalName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeName">Nome Fantasia</Label>
                <Input
                  id="tradeName"
                  placeholder="Nome comercial"
                  value={formData.tradeName}
                  onChange={(e) => updateFormData('tradeName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">CNPJ *</Label>
                <Input
                  id="taxId"
                  placeholder="00.000.000/0001-00"
                  value={formData.taxId}
                  onChange={(e) => updateFormData('taxId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedDate">Data de Fundacao</Label>
                <Input
                  id="foundedDate"
                  type="date"
                  value={formData.foundedDate}
                  onChange={(e) => updateFormData('foundedDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Porte da Empresa *</Label>
              <RadioGroup
                value={formData.companySize}
                onValueChange={(value) => updateFormData('companySize', value as CompanySize)}
                className="grid grid-cols-2 md:grid-cols-5 gap-2"
              >
                {Object.entries(COMPANY_SIZES_LABELS).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`size-${value}`} />
                    <Label htmlFor={`size-${value}`} className="text-sm cursor-pointer">
                      {label.split(' (')[0]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 'sector_industry':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Setor Principal *</Label>
              <Select
                value={formData.primarySector}
                onValueChange={(value) => updateFormData('primarySector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Setores Secundarios</Label>
              <div className="flex flex-wrap gap-2">
                {SECTORS.filter(s => s !== formData.primarySector).map(sector => (
                  <Badge
                    key={sector}
                    variant={formData.secondarySectors?.includes(sector) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('secondarySectors', sector)}
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industryVertical">Vertical de Industria</Label>
              <Input
                id="industryVertical"
                placeholder="Ex: Manufatura de Bens de Consumo"
                value={formData.industryVertical}
                onChange={(e) => updateFormData('industryVertical', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Mercados-Alvo</Label>
              <div className="flex gap-4">
                {TARGET_MARKETS.map(market => (
                  <div key={market} className="flex items-center space-x-2">
                    <Checkbox
                      id={`market-${market}`}
                      checked={formData.targetMarkets.includes(market)}
                      onCheckedChange={() => toggleArrayItem('targetMarkets', market)}
                    />
                    <Label htmlFor={`market-${market}`} className="cursor-pointer">{market}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Produtos/Servicos</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar produto ou servico"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProduct()}
                />
                <Button type="button" onClick={addProduct}>Adicionar</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.productsServices.map((product, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeProduct(index)}>
                    {product.name} &times;
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'geography':
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pais *</Label>
                <Select
                  value={formData.headquarters.country}
                  onValueChange={(value) => updateFormData('headquarters', { ...formData.headquarters, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">Brasil</SelectItem>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select
                  value={formData.headquarters.state}
                  onValueChange={(value) => updateFormData('headquarters', { ...formData.headquarters, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Cidade"
                  value={formData.headquarters.city}
                  onChange={(e) => updateFormData('headquarters', { ...formData.headquarters, city: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estados onde Atua</Label>
              <div className="flex flex-wrap gap-2">
                {BRAZILIAN_STATES.map(state => (
                  <Badge
                    key={state}
                    variant={formData.operatingStates?.includes(state) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('operatingStates', state)}
                  >
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Faixa de Receita Anual *</Label>
              <RadioGroup
                value={formData.annualRevenueRange}
                onValueChange={(value) => updateFormData('annualRevenueRange', value as RevenueRange)}
                className="grid grid-cols-2 gap-2"
              >
                {Object.entries(REVENUE_RANGES_LABELS).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                    <RadioGroupItem value={value} id={`revenue-${value}`} />
                    <Label htmlFor={`revenue-${value}`} className="text-sm cursor-pointer flex-1">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Estrutura de Capital *</Label>
              <RadioGroup
                value={formData.ownershipStructure}
                onValueChange={(value) => updateFormData('ownershipStructure', value as OwnershipStructure)}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {Object.entries(OWNERSHIP_LABELS).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                    <RadioGroupItem value={value} id={`ownership-${value}`} />
                    <Label htmlFor={`ownership-${value}`} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shareholders">Numero de Acionistas</Label>
                <Input
                  id="shareholders"
                  type="number"
                  placeholder="Ex: 12"
                  value={formData.numberOfShareholders || ''}
                  onChange={(e) => updateFormData('numberOfShareholders', parseInt(e.target.value) || undefined)}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="publiclyTraded"
                    checked={formData.isPubliclyTraded}
                    onCheckedChange={(checked) => updateFormData('isPubliclyTraded', checked as boolean)}
                  />
                  <Label htmlFor="publiclyTraded" className="cursor-pointer">Capital Aberto (Listada em Bolsa)</Label>
                </div>
                {formData.isPubliclyTraded && (
                  <Input
                    placeholder="Ticker (ex: PETR4)"
                    value={formData.stockTicker}
                    onChange={(e) => updateFormData('stockTicker', e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 'systems':
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sistema ERP</Label>
                <Select
                  value={formData.erpSystem}
                  onValueChange={(value) => updateFormData('erpSystem', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ERP_SYSTEMS.map(erp => (
                      <SelectItem key={erp} value={erp}>{erp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Sistema CRM</Label>
                <Select
                  value={formData.crmSystem}
                  onValueChange={(value) => updateFormData('crmSystem', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRM_SYSTEMS.map(crm => (
                      <SelectItem key={crm} value={crm}>{crm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ferramentas de BI</Label>
              <div className="flex flex-wrap gap-2">
                {BI_TOOLS.map(tool => (
                  <Badge
                    key={tool}
                    variant={formData.biTools?.includes(tool) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('biTools', tool)}
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dados Disponiveis para Integracao</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { key: 'financial', label: 'Financeiro' },
                  { key: 'operational', label: 'Operacional' },
                  { key: 'hr', label: 'RH' },
                  { key: 'sales', label: 'Vendas' },
                  { key: 'compliance', label: 'Compliance' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`data-${key}`}
                      checked={formData.availableData[key as keyof typeof formData.availableData]}
                      onCheckedChange={(checked) =>
                        updateFormData('availableData', {
                          ...formData.availableData,
                          [key]: checked as boolean
                        })
                      }
                    />
                    <Label htmlFor={`data-${key}`} className="cursor-pointer text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certificacoes</Label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map(cert => (
                  <Badge
                    key={cert}
                    variant={formData.certifications?.includes(cert) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('certifications', cert)}
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentSection + 1) / SECTIONS.length) * 100;
  const SectionIcon = SECTIONS[currentSection].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Secao {currentSection + 1} de {SECTIONS.length}
          </span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex gap-1 mt-2">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  index === currentSection
                    ? 'bg-primary text-primary-foreground'
                    : index < currentSection
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <SectionIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>{SECTIONS[currentSection].title}</CardTitle>
              <CardDescription>
                Preencha as informacoes abaixo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderSection()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentSection === 0 ? 'Voltar' : 'Anterior'}
        </Button>
        
        <Button onClick={handleNext} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : currentSection === SECTIONS.length - 1 ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Concluir Fase 1
            </>
          ) : (
            <>
              Proximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Phase1BasicSetup;
