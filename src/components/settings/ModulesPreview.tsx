import { Check, X, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleKey } from "@/types/organization";
import { SIDEBAR_SECTIONS } from "@/data/sidebarCatalog";
import { isPremiumModule } from "@/utils/moduleMatrix";
import { Badge } from "@/components/ui/badge";

interface ModulesPreviewProps {
  enabledModules: ModuleKey[];
}

export function ModulesPreview({ enabledModules }: ModulesPreviewProps) {
  const totalModules = SIDEBAR_SECTIONS.reduce((acc, section) => acc + section.items.length, 0);
  const enabledCount = enabledModules.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Módulos Habilitados</h3>
          <p className="text-sm text-muted-foreground">
            Visualize quais módulos estão disponíveis no seu plano
          </p>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          {enabledCount} de {totalModules}
        </Badge>
      </div>
      
      <div className="border rounded-lg divide-y">
        {SIDEBAR_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          const sectionEnabledCount = section.items.filter(
            item => enabledModules.includes(item.key)
          ).length;
          
          return (
            <div key={section.key} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SectionIcon className={cn("h-4 w-4", section.color)} />
                <span className="font-medium text-sm">{section.label}</span>
                {section.premium && (
                  <Badge variant="secondary" className="text-xs">
                    <Gem className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {sectionEnabledCount}/{section.items.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {section.items.map((item) => {
                  const isEnabled = enabledModules.includes(item.key);
                  const isPremium = isPremiumModule(item.key);
                  const ItemIcon = item.icon;
                  
                  return (
                    <div
                      key={item.key}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md text-sm",
                        isEnabled 
                          ? "bg-emerald-500/10 text-foreground" 
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {isEnabled ? (
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <ItemIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isPremium && (
                        <Gem className="h-3 w-3 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
