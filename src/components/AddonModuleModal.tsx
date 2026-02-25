import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, MessageCircle, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ADDON_MODULES, type AddonModuleInfo } from "@/data/addonModulesData";
import { cn } from "@/lib/utils";

export interface AddonModuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nome do módulo (deve existir em ADDON_MODULES). */
  moduleName: string | null;
}

export function AddonModuleModal({
  open,
  onOpenChange,
  moduleName,
}: AddonModuleModalProps) {
  const navigate = useNavigate();
  const module: AddonModuleInfo | undefined =
    moduleName != null ? ADDON_MODULES[moduleName] : undefined;

  const handleVerPlanos = () => {
    onOpenChange(false);
    navigate("/planos");
  };

  const handleFalarConsultor = () => {
    onOpenChange(false);
    navigate("/planos");
  };

  if (!module) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md p-0 gap-0 overflow-hidden",
          "sm:rounded-lg border border-border bg-card text-card-foreground shadow-lg"
        )}
        aria-describedby={undefined}
      >
        <div className="p-6 pb-4 pr-12">
          <div className="flex gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 border border-amber-200"
              aria-hidden
            >
              <Lock className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-semibold leading-tight text-foreground">
                {module.title}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {module.description}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Este módulo permite:
          </p>
          <ul className="space-y-2">
            {module.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
            role="status"
          >
            <Lock className="h-3.5 w-3.5" />
            Módulo Premium
          </span>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 px-6 pb-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleFalarConsultor}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Falar com Consultor
          </Button>
          <Button
            type="button"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleVerPlanos}
          >
            <Settings className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
