import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, MessageCircle, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "@/contexts/OrganizationContext";
import { PLAN_LABELS } from "@/types/organization";
import { MODULE_DESCRIPTIONS } from "@/data/sidebarCatalog";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleKey: string;
  moduleName: string;
}

export function UpgradeModal({ open, onOpenChange, moduleKey, moduleName }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  
  const moduleInfo = MODULE_DESCRIPTIONS[moduleKey] || {
    description: 'Este módulo oferece funcionalidades avançadas para sua governança corporativa.',
    benefits: ['Melhore a gestão da sua empresa', 'Acesse recursos exclusivos', 'Aumente a eficiência operacional']
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
      <DialogContent className="sm:max-w-md">
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
            <ul className="space-y-2">
              {moduleInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <Badge variant="outline" className="mb-4">
              <Lock className="h-3 w-3 mr-1" />
              Módulo Premium
            </Badge>
          </div>
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
