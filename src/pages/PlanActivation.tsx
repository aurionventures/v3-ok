import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, Rocket, Building, Building2, Globe, TrendingUp, 
  Crown, Sparkles, Leaf, MessageCircle, PartyPopper, Lock, Zap
} from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';
import { ModuleKey, COMPANY_SIZE_LABELS, PLAN_LABELS, CompanySize, GovernancePlan } from '@/types/organization';
import { isPremiumModule } from '@/utils/moduleMatrix';
import legacyLogo from "@/assets/legacy-logo-new.png";

const SIZE_ICONS: Record<CompanySize, typeof Rocket> = {
  startup: Rocket,
  small: Building,
  medium: Building2,
  large: Globe,
  listed: TrendingUp,
};

const PLAN_CONFIG: Record<GovernancePlan, { icon: typeof Crown; color: string; bgColor: string }> = {
  core: { icon: Check, color: "text-slate-600", bgColor: "bg-slate-100" },
  governance_plus: { icon: Sparkles, color: "text-blue-600", bgColor: "bg-blue-100" },
  people_esg: { icon: Leaf, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  legacy_360: { icon: Crown, color: "text-amber-600", bgColor: "bg-amber-100" },
};

const ADDON_MODULES = [
  { 
    key: 'esg_maturity' as ModuleKey, 
    name: 'ESG', 
    description: 'Avaliação de maturidade ESG e relatórios de sustentabilidade',
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  { 
    key: 'market_intel' as ModuleKey, 
    name: 'Inteligência de Mercado', 
    description: 'Análise de ameaças, oportunidades e concorrentes do seu setor',
    icon: TrendingUp,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  { 
    key: 'ai_agents' as ModuleKey, 
    name: 'Agentes de IA', 
    description: 'Automação inteligente para processos de governança',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
];

export default function PlanActivation() {
  const navigate = useNavigate();
  const { organization, completeOnboarding, addModule } = useOrganization();
  const { toast } = useToast();
  const [activating, setActivating] = useState(false);

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const SizeIcon = SIZE_ICONS[organization.companySize];
  const planConfig = PLAN_CONFIG[organization.plan];
  const PlanIcon = planConfig.icon;

  // Get all enabled modules grouped by section
  const enabledModules = organization.enabledModules;

  const handleActivate = async () => {
    setActivating(true);
    try {
      completeOnboarding();
      toast({
        title: "Plano ativado com sucesso!",
        description: "Bem-vindo à plataforma Legacy. Vamos começar!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro ao ativar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleContractAddon = (addonName: string) => {
    const phone = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Tenho interesse em contratar o módulo ${addonName} para minha empresa ${organization.name}. Meu plano atual é ${PLAN_LABELS[organization.plan]}.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src={legacyLogo} 
            alt="Legacy" 
            className="h-14 w-auto mx-auto mb-6"
          />
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Bem-vindo à Legacy!</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {organization.name}
          </p>
        </div>

        {/* Plan Info */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`p-3 rounded-full ${planConfig.bgColor}`}>
                <SizeIcon className={`h-6 w-6 ${planConfig.color}`} />
              </div>
              <span className="text-2xl font-bold">{COMPANY_SIZE_LABELS[organization.companySize]}</span>
              <span className="text-muted-foreground">+</span>
              <Badge className={`${planConfig.bgColor} ${planConfig.color} border-0 text-sm px-3 py-1`}>
                <PlanIcon className="h-4 w-4 mr-1" />
                {PLAN_LABELS[organization.plan]}
              </Badge>
            </div>
            <CardDescription className="text-base">
              Seu plano inclui {enabledModules.length} módulos para gestão completa de governança
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Included Modules */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Módulos Incluídos no Seu Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SIDEBAR_SECTIONS.flatMap(section => 
                section.items.filter(item => enabledModules.includes(item.key))
              ).map(item => (
                <div 
                  key={item.key}
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add-ons */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Add-ons Disponíveis
            </CardTitle>
            <CardDescription>
              Expanda as capacidades da sua plataforma com módulos premium
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {ADDON_MODULES.map(addon => {
                const isIncluded = enabledModules.includes(addon.key);
                const AddonIcon = addon.icon;
                
                return (
                  <Card key={addon.key} className={`relative ${isIncluded ? 'border-primary/30 bg-primary/5' : ''}`}>
                    <CardContent className="pt-6">
                      <div className={`p-3 rounded-full ${addon.bgColor} w-fit mb-4`}>
                        <AddonIcon className={`h-6 w-6 ${addon.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{addon.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {addon.description}
                      </p>
                      {isIncluded ? (
                        <Badge className="bg-primary/10 text-primary border-0">
                          <Check className="h-3 w-3 mr-1" />
                          Incluído
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContractAddon(addon.name)}
                          className="w-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contratar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activate Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleActivate}
            disabled={activating}
            className="px-12 py-6 text-lg"
          >
            {activating ? (
              'Ativando...'
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                Ativar Plano e Começar
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Você poderá alterar seu plano a qualquer momento nas configurações
          </p>
        </div>
      </div>
    </div>
  );
}
