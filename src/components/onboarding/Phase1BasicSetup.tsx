import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  MapPin,
  Briefcase,
  Database,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Phase1FormData,
  ProductService,
  CompanySize,
  RevenueRange,
  OwnershipStructure
} from '@/types/onboarding';
import {
  SECTORS,
  COMPANY_SIZES_LABELS,
  REVENUE_RANGES_LABELS,
  OWNERSHIP_LABELS,
  TARGET_MARKETS,
  ERP_SYSTEMS,
  CRM_SYSTEMS,
  BI_TOOLS,
  CERTIFICATIONS,
  REGULATORY_BODIES,
  COMPLIANCE_FRAMEWORKS
} from '@/types/onboarding';

interface Phase1BasicSetupProps {
  initialData?: Partial<Phase1FormData>;
  onComplete: (data: Phase1FormData) => void;
  onBack?: () => void;
  isSaving?: boolean;
}

const SECTIONS = [
  { id: 'company_info', title: 'Dados da Empresa', icon: Building2 },
  { id: 'sector_industry', title: 'Setor e Industria', icon: Briefcase },
  { id: 'geography', title: 'Geografia', icon: MapPin },
  { id: 'financial_structure', title: 'Financeiro', icon: Coins },
  { id: 'products_services', title: 'Produtos e Servicos', icon: Briefcase },
  { id: 'systems_data', title: 'Sistemas e Dados', icon: Database },
  { id: 'compliance', title: 'Compliance', icon: Shield }
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function Phase1BasicSetup({
  initialData,
  onComplete,
  onBack,
  isSaving
}: Phase1BasicSetupProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Phase1FormData>({
    legalName: initialData?.legalName || '',
    tradeName: initialData?.tradeName || '',
    taxId: initialData?.taxId || '',
    foundedDate: initialData?.foundedDate || '',
    companySize: initialData?.companySize,
    primarySector: initialData?.primarySector || '',
    secondarySectors: initialData?.secondarySectors || [],
    industryVertical: initialData?.industryVertical || '',
    headquarters: initialData?.headquarters || {
      country: 'BR',
      state: '',
      city: ''
    },
    operatingCountries: initialData?.operatingCountries || ['BR'],
    operatingStates: initialData?.operatingStates || [],
    annualRevenueRange: initialData?.annualRevenueRange,
    isPubliclyTraded: initialData?.isPubliclyTraded || false,
    stockTicker: initialData?.stockTicker || '',
    ownershipStructure: initialData?.ownershipStructure,
    numberOfShareholders: initialData?.numberOfShareholders || 0,
    productsServices: initialData?.productsServices || [],
    targetMarkets: initialData?.targetMarkets || [],
    erpSystem: initialData?.erpSystem || '',
    crmSystem: initialData?.crmSystem || '',
    biTools: initialData?.biTools || [],
    availableData: initialData?.availableData || {
      financial: false,
      operational: false,
      hr: false,
      sales: false,
      compliance: false
    },
    certifications: initialData?.certifications || [],
    regulatoryBodies: initialData?.regulatoryBodies || [],
    complianceFrameworks: initialData?.complianceFrameworks || []
  });

  const [newProduct, setNewProduct] = useState<ProductService>({
    name: '',
    category: '',
    description: ''
  });

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const updateFormData = (key: keyof Phase1FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.category) {
      updateFormData('productsServices', [...formData.productsServices, newProduct]);
      setNewProduct({ name: '', category: '', description: '' });
    }
  };

  const removeProduct = (index: number) => {
    updateFormData(
      'productsServices',
      formData.productsServices.filter((_, i) => i !== index)
    );
  };

  const toggleArrayItem = (
    key: 'secondarySectors' | 'targetMarkets' | 'biTools' | 'certifications' | 'regulatoryBodies' | 'complianceFrameworks' | 'operatingStates',
    value: string
  ) => {
    const current = formData[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFormData(key, updated);
  };

  const renderSection = () => {
    const sectionId = SECTIONS[currentSection].id;

    switch (sectionId) {
      case 'company_info':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="legalName">Razao Social *</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => updateFormData('legalName', e.target.value)}
                  placeholder="Empresa Ltda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeName">Nome Fantasia</Label>
                <Input
                  id="tradeName"
                  value={formData.tradeName}
                  onChange={(e) => updateFormData('tradeName', e.target.value)}
                  placeholder="Nome comercial"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxId">CNPJ *</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => updateFormData('taxId', e.target.value)}
                  placeholder="00.000.000/0001-00"
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
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {(Object.entries(COMPANY_SIZES_LABELS) as [CompanySize, string][]).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => updateFormData('companySize', value)}
                    className={cn(
                      'cursor-pointer rounded-lg border-2 p-3 transition-all',
                      formData.companySize === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {formData.companySize === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sector_industry':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Setor Principal *</Label>
              <Select
                value={formData.primarySector}
                onValueChange={(value) => updateFormData('primarySector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor principal" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Setores Secundarios</Label>
              <div className="flex flex-wrap gap-2">
                {SECTORS.filter(s => s !== formData.primarySector).map((sector) => (
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
                value={formData.industryVertical}
                onChange={(e) => updateFormData('industryVertical', e.target.value)}
                placeholder="Ex: SaaS, E-commerce, Fintech"
              />
            </div>
          </div>
        );

      case 'geography':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Sede</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm text-muted-foreground">Pais</Label>
                  <Select
                    value={formData.headquarters.country}
                    onValueChange={(value) =>
                      updateFormData('headquarters', { ...formData.headquarters, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BR">Brasil</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="PT">Portugal</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm text-muted-foreground">Estado</Label>
                  <Select
                    value={formData.headquarters.state}
                    onValueChange={(value) =>
                      updateFormData('headquarters', { ...formData.headquarters, state: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm text-muted-foreground">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.headquarters.city}
                    onChange={(e) =>
                      updateFormData('headquarters', { ...formData.headquarters, city: e.target.value })
                    }
                    placeholder="Cidade"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estados de Operacao</Label>
              <div className="flex flex-wrap gap-2">
                {BRAZILIAN_STATES.map((state) => (
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

      case 'financial_structure':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Faixa de Receita Anual</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {(Object.entries(REVENUE_RANGES_LABELS) as [RevenueRange, string][]).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => updateFormData('annualRevenueRange', value)}
                    className={cn(
                      'cursor-pointer rounded-lg border-2 p-3 transition-all',
                      formData.annualRevenueRange === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {formData.annualRevenueRange === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estrutura de Propriedade</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {(Object.entries(OWNERSHIP_LABELS) as [OwnershipStructure, string][]).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => updateFormData('ownershipStructure', value)}
                    className={cn(
                      'cursor-pointer rounded-lg border-2 p-3 transition-all',
                      formData.ownershipStructure === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {formData.ownershipStructure === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="publiclyTraded"
                checked={formData.isPubliclyTraded}
                onCheckedChange={(checked) =>
                  updateFormData('isPubliclyTraded', checked)
                }
              />
              <Label htmlFor="publiclyTraded">Empresa de Capital Aberto</Label>
            </div>

            {formData.isPubliclyTraded && (
              <div className="space-y-2">
                <Label htmlFor="stockTicker">Ticker</Label>
                <Input
                  id="stockTicker"
                  value={formData.stockTicker}
                  onChange={(e) => updateFormData('stockTicker', e.target.value)}
                  placeholder="Ex: PETR4"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="shareholders">Numero de Socios/Acionistas</Label>
              <Input
                id="shareholders"
                type="number"
                value={formData.numberOfShareholders || ''}
                onChange={(e) =>
                  updateFormData('numberOfShareholders', parseInt(e.target.value) || 0)
                }
                placeholder="Quantidade"
              />
            </div>
          </div>
        );

      case 'products_services':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Produtos e Servicos</Label>
              
              {formData.productsServices.length > 0 && (
                <div className="space-y-2">
                  {formData.productsServices.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Card>
                <CardContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nome</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="Nome do produto/servico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Categoria</Label>
                      <Input
                        id="productCategory"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        placeholder="Categoria"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={addProduct}
                    disabled={!newProduct.name || !newProduct.category}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Mercados Alvo</Label>
              <div className="flex flex-wrap gap-2">
                {TARGET_MARKETS.map((market) => (
                  <Badge
                    key={market}
                    variant={formData.targetMarkets.includes(market) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('targetMarkets', market)}
                  >
                    {market}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'systems_data':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
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
                    {ERP_SYSTEMS.map((erp) => (
                      <SelectItem key={erp} value={erp}>
                        {erp}
                      </SelectItem>
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
                    {CRM_SYSTEMS.map((crm) => (
                      <SelectItem key={crm} value={crm}>
                        {crm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ferramentas de BI</Label>
              <div className="flex flex-wrap gap-2">
                {BI_TOOLS.map((tool) => (
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
              <Label>Dados Disponiveis</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { key: 'financial', label: 'Dados Financeiros' },
                  { key: 'operational', label: 'Dados Operacionais' },
                  { key: 'hr', label: 'Dados de RH' },
                  { key: 'sales', label: 'Dados de Vendas' },
                  { key: 'compliance', label: 'Dados de Compliance' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.availableData[key as keyof typeof formData.availableData]}
                      onCheckedChange={(checked) =>
                        updateFormData('availableData', {
                          ...formData.availableData,
                          [key]: checked
                        })
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Certificacoes</Label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((cert) => (
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

            <div className="space-y-2">
              <Label>Orgaos Reguladores</Label>
              <div className="flex flex-wrap gap-2">
                {REGULATORY_BODIES.map((body) => (
                  <Badge
                    key={body}
                    variant={formData.regulatoryBodies?.includes(body) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('regulatoryBodies', body)}
                  >
                    {body}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Frameworks de Compliance</Label>
              <div className="flex flex-wrap gap-2">
                {COMPLIANCE_FRAMEWORKS.map((framework) => (
                  <Badge
                    key={framework}
                    variant={formData.complianceFrameworks?.includes(framework) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('complianceFrameworks', framework)}
                  >
                    {framework}
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

  const CurrentIcon = SECTIONS[currentSection].icon;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Secao {currentSection + 1} de {SECTIONS.length}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {SECTIONS.map((section, index) => (
          <Button
            key={section.id}
            variant={index === currentSection ? 'default' : 'ghost'}
            size="sm"
            className="shrink-0"
            onClick={() => setCurrentSection(index)}
          >
            <section.icon className="mr-2 h-4 w-4" />
            {section.title}
          </Button>
        ))}
      </div>

      {/* Section Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CurrentIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{SECTIONS[currentSection].title}</CardTitle>
              <CardDescription>
                Preencha as informacoes desta secao
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderSection()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentSection === 0 ? 'Voltar' : 'Anterior'}
        </Button>
        <Button onClick={handleNext} disabled={isSaving}>
          {currentSection === SECTIONS.length - 1 ? (
            <>
              {isSaving ? 'Salvando...' : 'Concluir Fase 1'}
              <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Proximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

