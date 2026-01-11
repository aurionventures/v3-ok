import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, MessageCircle, Settings, Sparkles, Lightbulb, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "@/contexts/OrganizationContext";
import { PLAN_LABELS } from "@/types/organization";
import { MODULE_DESCRIPTIONS } from "@/data/sidebarCatalog";

interface ModuleInfo {
  description: string;
  benefits: string[];
  pricing?: {
    monthly: number;
    annual: number;
    annualMonthly: number;
    discount: number;
    savingsMonths: number;
  };
  valueProposition?: string;
}

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleKey: string;
  moduleName: string;
}

export function UpgradeModal({ open, onOpenChange, moduleKey, moduleName }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  
  const moduleInfo: ModuleInfo = MODULE_DESCRIPTIONS[moduleKey] || {
    description: 'Este módulo oferece funcionalidades avançadas para sua governança corporativa.',
    benefits: ['Melhore a gestão da sua empresa', 'Acesse recursos exclusivos', 'Aumente a eficiência operacional']
  };

  const hasPricing = !!moduleInfo.pricing;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleContactConsultant = () => {
    const phone = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Tenho interesse no módulo "${moduleName}" para minha empresa. Meu plano atual é ${organization ? PLAN_LABELS[organization.plan] : 'não definido'}. Gostaria de mais informações.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    onOpenChange(false);
  };

  const handleViewPlans = () => {
    onOpenChange(false);
    navigate('/settings?tab=plan');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={hasPricing ? "sm:max-w-lg" : "sm:max-w-md"}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-amber-100">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">{moduleName}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {moduleInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Este módulo permite:</p>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {moduleInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <Badge variant="outline" className="mb-4 bg-amber-50 text-amber-700 border-amber-200">
              <Lock className="h-3 w-3 mr-1" />
              Módulo Premium
            </Badge>
          </div>

          {/* Value Proposition Box */}
          {moduleInfo.valueProposition && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Por que vale a pena:</p>
                    <p className="text-sm text-blue-700">{moduleInfo.valueProposition}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Cards */}
          {hasPricing && moduleInfo.pricing && (
            <div className="grid grid-cols-2 gap-3">
              {/* Monthly Card */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Mensal</p>
                  <p className="text-2xl font-bold">{formatCurrency(moduleInfo.pricing.monthly)}</p>
                  <p className="text-xs text-muted-foreground">/mês</p>
                </CardContent>
              </Card>

              {/* Annual Card */}
              <Card className="border-2 border-primary bg-primary/5 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    Economize {moduleInfo.pricing.savingsMonths} meses
                  </Badge>
                </div>
                <CardContent className="pt-6 pb-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Anual</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(moduleInfo.pricing.annualMonthly)}</p>
                  <p className="text-xs text-muted-foreground">/mês</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(moduleInfo.pricing.annual)} anual
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    ({moduleInfo.pricing.discount}% de desconto)
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleContactConsultant}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Falar com Consultor
          </Button>
          <Button 
            onClick={handleViewPlans}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
