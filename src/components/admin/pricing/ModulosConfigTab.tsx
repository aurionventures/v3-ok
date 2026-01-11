import { usePricingConfig, Module } from "@/hooks/usePricingConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Package, Check, Lock } from "lucide-react";

export function ModulosConfigTab() {
  const { modules, updateModule } = usePricingConfig();

  // Agrupar módulos por seção
  const modulesBySection = modules.reduce((acc, mod) => {
    const section = mod.section_label || mod.section;
    if (!acc[section]) acc[section] = [];
    acc[section].push(mod);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-emerald-500"><Check className="h-3 w-3" /></Badge>
          <span>Core (todos os planos)</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary"><Lock className="h-3 w-3" /></Badge>
          <span>Add-on (premium)</span>
        </div>
      </div>

      {Object.entries(modulesBySection).map(([section, sectionModules]) => (
        <Card key={section}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sectionModules.map((mod) => (
              <div key={mod.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{mod.name}</div>
                    <div className="text-xs text-muted-foreground">{mod.path}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={mod.is_core ? "default" : "secondary"} className={mod.is_core ? "bg-emerald-500" : ""}>
                    {mod.is_core ? <><Check className="h-3 w-3 mr-1" /> Core</> : <><Lock className="h-3 w-3 mr-1" /> Add-on</>}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ativo</span>
                    <Switch checked={mod.is_active} onCheckedChange={(checked) => updateModule({ id: mod.id, is_active: checked })} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
