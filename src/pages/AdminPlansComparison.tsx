import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, Sparkles, FileText, Download, Package } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CompanySize, COMPANY_SIZE_LABELS } from "@/types/organization";
import { 
  BASE_MODULES, 
  ADDON_MODULES, 
  isModuleIncludedInSize,
  PLAN_PRICES,
  ADDON_PRICES,
  FULL_PACKAGE
} from "@/utils/moduleMatrix";
import { SIDEBAR_SECTIONS } from "@/data/sidebarCatalog";
import { PlanProposalPDF } from "@/components/admin/PlanProposalPDF";
import { PlansComparisonPDF } from "@/components/admin/PlansComparisonPDF";
import { toast } from "sonner";

const SIZE_ORDER: CompanySize[] = ['startup', 'small', 'medium', 'large', 'listed'];

const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

const AdminPlansComparison = () => {
  const [companyName, setCompanyName] = useState('');
  const [selectedSize, setSelectedSize] = useState<CompanySize>('medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isFullPackage, setIsFullPackage] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Coleta todos os módulos de todas as seções
  const allModules = SIDEBAR_SECTIONS.flatMap(section => 
    section.items.map(item => ({
      ...item,
      section: section.label,
      sectionColor: section.color
    }))
  );

  // Verifica se o módulo é add-on
  const isAddon = (moduleKey: string) => 
    ADDON_MODULES.some(addon => addon.key === moduleKey);

  // Calcula o total
  const calculateTotal = () => {
    if (isFullPackage) {
      return PLAN_PRICES[selectedSize] + FULL_PACKAGE.discountedPrice;
    }
    let total = PLAN_PRICES[selectedSize];
    if (selectedAddons.includes('esg_maturity')) total += ADDON_PRICES.esg;
    if (selectedAddons.includes('market_intel')) total += ADDON_PRICES.market_intel;
    return total;
  };

  // Toggle add-on
  const toggleAddon = (addon: string) => {
    if (isFullPackage) return;
    setSelectedAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  // Toggle full package
  const toggleFullPackage = () => {
    setIsFullPackage(!isFullPackage);
    if (!isFullPackage) {
      setSelectedAddons(['esg_maturity', 'market_intel']);
    }
  };

  // Gerar PDF de proposta
  const handleGenerateProposalPDF = async () => {
    if (!companyName.trim()) {
      toast.error('Por favor, informe o nome da empresa');
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      const blob = await pdf(
        <PlanProposalPDF
          companyName={companyName}
          selectedSize={selectedSize}
          selectedAddons={selectedAddons}
          isFullPackage={isFullPackage}
          planPrice={PLAN_PRICES[selectedSize]}
          addonPrices={ADDON_PRICES}
          fullPackagePrice={{ original: FULL_PACKAGE.originalPrice, discounted: FULL_PACKAGE.discountedPrice }}
        />
      ).toBlob();
      
      const fileName = `Proposta_Legacy_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      saveAs(blob, fileName);
      toast.success('Proposta gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Gerar PDF comparativo
  const handleGenerateComparisonPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const blob = await pdf(<PlansComparisonPDF />).toBlob();
      const fileName = `Comparativo_Planos_Legacy_${new Date().toISOString().split('T')[0]}.pdf`;
      saveAs(blob, fileName);
      toast.success('Comparativo gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Conta módulos incluídos
  const getIncludedModulesCount = () => {
    let count = BASE_MODULES[selectedSize].length;
    if (selectedAddons.includes('esg_maturity') || isFullPackage) count += 1;
    if (selectedAddons.includes('market_intel') || isFullPackage) count += 2;
    return count;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Comparativo de Planos" />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cabeçalho e botões */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Matriz de Planos Legacy</h1>
              <p className="text-muted-foreground">
                Visualização completa dos módulos e preços por porte de empresa
              </p>
            </div>
            <Button 
              onClick={handleGenerateComparisonPDF}
              disabled={isGeneratingPDF}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Comparativo PDF
            </Button>
          </div>

          {/* Configurador de Proposta */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Configurador de Proposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna de configuração */}
                <div className="space-y-6">
                  {/* Nome da empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Digite o nome da empresa"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  {/* Seleção de porte */}
                  <div className="space-y-3">
                    <Label>Porte da Empresa</Label>
                    <RadioGroup
                      value={selectedSize}
                      onValueChange={(value) => setSelectedSize(value as CompanySize)}
                      className="space-y-2"
                    >
                      {SIZE_ORDER.map(size => (
                        <div 
                          key={size}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedSize === size 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-muted-foreground/50'
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={size} id={size} />
                            <div>
                              <Label htmlFor={size} className="cursor-pointer font-medium">
                                {COMPANY_SIZE_LABELS[size]}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {BASE_MODULES[size].length} módulos incluídos
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="font-mono">
                            {size === 'listed' ? 'A partir de ' : ''}{formatCurrency(PLAN_PRICES[size])}/mês
                          </Badge>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-3">
                    <Label>Add-ons</Label>
                    <div className="space-y-2">
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          selectedAddons.includes('esg_maturity') || isFullPackage
                            ? 'border-emerald-500 bg-emerald-500/5' 
                            : 'border-border'
                        } ${isFullPackage ? 'opacity-75' : 'cursor-pointer'}`}
                        onClick={() => toggleAddon('esg_maturity')}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedAddons.includes('esg_maturity') || isFullPackage}
                            disabled={isFullPackage}
                          />
                          <div>
                            <span className="font-medium">Maturidade ESG</span>
                            <p className="text-xs text-muted-foreground">Avaliação e indicadores ESG</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-emerald-600">
                          +{formatCurrency(ADDON_PRICES.esg)}/mês
                        </Badge>
                      </div>

                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          selectedAddons.includes('market_intel') || isFullPackage
                            ? 'border-cyan-500 bg-cyan-500/5' 
                            : 'border-border'
                        } ${isFullPackage ? 'opacity-75' : 'cursor-pointer'}`}
                        onClick={() => toggleAddon('market_intel')}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedAddons.includes('market_intel') || isFullPackage}
                            disabled={isFullPackage}
                          />
                          <div>
                            <span className="font-medium">Inteligência de Mercado</span>
                            <p className="text-xs text-muted-foreground">Análise competitiva + Benchmarking</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-cyan-600">
                          +{formatCurrency(ADDON_PRICES.market_intel)}/mês
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Pacote Full */}
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isFullPackage 
                        ? 'border-primary bg-primary/5' 
                        : 'border-dashed border-muted-foreground/30 hover:border-primary/50'
                    }`}
                    onClick={toggleFullPackage}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isFullPackage} />
                        <div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <span className="font-bold">Pacote Full</span>
                            <Badge className="bg-green-500 text-white text-[10px]">ECONOMIA</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Todos os add-ons com desconto especial
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(FULL_PACKAGE.originalPrice)}
                        </p>
                        <Badge variant="default" className="font-mono">
                          +{formatCurrency(FULL_PACKAGE.discountedPrice)}/mês
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna de resumo */}
                <div className="space-y-4">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Resumo da Proposta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Empresa */}
                      <div>
                        <p className="text-sm text-muted-foreground">Empresa</p>
                        <p className="font-medium">{companyName || '(Não informado)'}</p>
                      </div>

                      {/* Plano */}
                      <div>
                        <p className="text-sm text-muted-foreground">Plano Base</p>
                        <p className="font-medium">{COMPANY_SIZE_LABELS[selectedSize]}</p>
                      </div>

                      {/* Detalhamento */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Plano {COMPANY_SIZE_LABELS[selectedSize]}</span>
                          <span>{formatCurrency(PLAN_PRICES[selectedSize])}</span>
                        </div>
                        
                        {!isFullPackage && selectedAddons.includes('esg_maturity') && (
                          <div className="flex justify-between text-sm text-emerald-600">
                            <span>+ Add-on ESG</span>
                            <span>{formatCurrency(ADDON_PRICES.esg)}</span>
                          </div>
                        )}
                        
                        {!isFullPackage && selectedAddons.includes('market_intel') && (
                          <div className="flex justify-between text-sm text-cyan-600">
                            <span>+ Add-on Intel. Mercado</span>
                            <span>{formatCurrency(ADDON_PRICES.market_intel)}</span>
                          </div>
                        )}
                        
                        {isFullPackage && (
                          <div className="flex justify-between text-sm text-primary">
                            <span>+ Pacote Full</span>
                            <span>{formatCurrency(FULL_PACKAGE.discountedPrice)}</span>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total Mensal</span>
                          <span className="font-bold text-2xl text-primary">
                            {formatCurrency(calculateTotal())}
                          </span>
                        </div>
                      </div>

                      {/* Módulos */}
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Módulos incluídos: <Badge variant="secondary">{getIncludedModulesCount()}</Badge>
                        </p>
                        <div className="max-h-[200px] overflow-y-auto space-y-1">
                          {SIDEBAR_SECTIONS.map(section => {
                            const includedItems = section.items.filter(item => 
                              BASE_MODULES[selectedSize].includes(item.key) ||
                              ((selectedAddons.includes('esg_maturity') || isFullPackage) && item.key === 'esg_maturity') ||
                              ((selectedAddons.includes('market_intel') || isFullPackage) && (item.key === 'market_intel' || item.key === 'benchmarking'))
                            );
                            
                            if (includedItems.length === 0) return null;
                            
                            return (
                              <div key={section.key} className="text-xs">
                                <span className={`font-medium ${section.color}`}>{section.label}:</span>
                                <span className="text-muted-foreground ml-1">
                                  {includedItems.map(i => i.label).join(', ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Botão de gerar PDF */}
                      <Button 
                        className="w-full mt-4" 
                        size="lg"
                        onClick={handleGenerateProposalPDF}
                        disabled={isGeneratingPDF}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar PDF da Proposta
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legenda */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm">Incluído no plano</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Não incluído</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Add-on
              </Badge>
              <span className="text-sm">Módulo contratável separadamente</span>
            </div>
          </div>

          {/* Tabela de Comparação */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px] font-bold">Módulo</TableHead>
                      {SIZE_ORDER.map(size => (
                        <TableHead key={size} className="text-center font-bold min-w-[120px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>{COMPANY_SIZE_LABELS[size]}</span>
                            <Badge variant="secondary" className="text-[10px] font-mono">
                              {formatCurrency(PLAN_PRICES[size])}
                            </Badge>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center font-bold min-w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Add-on ESG</span>
                          <Badge variant="outline" className="text-[10px] font-mono text-emerald-600">
                            {formatCurrency(ADDON_PRICES.esg)}
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-bold min-w-[120px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Add-on Intel.</span>
                          <Badge variant="outline" className="text-[10px] font-mono text-cyan-600">
                            {formatCurrency(ADDON_PRICES.market_intel)}
                          </Badge>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SIDEBAR_SECTIONS.map((section) => (
                      <>
                        {/* Linha de cabeçalho da seção */}
                        <TableRow 
                          key={`section-${section.key}`} 
                          className="bg-muted/30 hover:bg-muted/30"
                        >
                          <TableCell 
                            colSpan={SIZE_ORDER.length + 3}
                            className="font-bold"
                          >
                            <div className="flex items-center gap-2">
                              <section.icon className={`h-4 w-4 ${section.color}`} />
                              <span>{section.label}</span>
                              {section.premium && (
                                <Badge variant="outline" className="text-[10px]">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Linhas de módulos */}
                        {section.items.map(item => (
                          <TableRow key={item.key}>
                            <TableCell className="pl-8">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{item.label}</span>
                                {isAddon(item.key) && (
                                  <Badge variant="outline" className="text-[10px] h-5">
                                    Add-on
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            {/* Colunas de cada porte */}
                            {SIZE_ORDER.map(size => {
                              const included = isModuleIncludedInSize(item.key, size);
                              return (
                                <TableCell key={size} className="text-center">
                                  {included ? (
                                    <div className="flex justify-center">
                                      <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                        <Check className="h-4 w-4 text-green-500" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center">
                                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                                        <X className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              );
                            })}
                            
                            {/* Coluna Add-on ESG */}
                            <TableCell className="text-center">
                              {item.key === 'esg_maturity' ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                    <Check className="h-4 w-4 text-green-500" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            
                            {/* Coluna Add-on Intel. Mercado */}
                            <TableCell className="text-center">
                              {(item.key === 'market_intel' || item.key === 'benchmarking') ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
                                    <Check className="h-4 w-4 text-green-500" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                    
                    {/* Linha de totais */}
                    <TableRow className="bg-primary/5 font-bold">
                      <TableCell>Total de Módulos</TableCell>
                      {SIZE_ORDER.map(size => (
                        <TableCell key={size} className="text-center">
                          <Badge variant="default">{BASE_MODULES[size].length}</Badge>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <Badge variant="outline">1</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">2</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Card do Pacote Full */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      Pacote Full
                      <Badge className="bg-green-500 text-white">ECONOMIA DE R$ 3.000</Badge>
                    </h3>
                    <p className="text-muted-foreground">
                      Maturidade ESG + Inteligência de Mercado + Benchmarking Global
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">
                    {formatCurrency(FULL_PACKAGE.originalPrice)}/mês
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(FULL_PACKAGE.discountedPrice)}/mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPlansComparison;
