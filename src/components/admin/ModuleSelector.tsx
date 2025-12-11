import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SIDEBAR_SECTIONS } from "@/data/sidebarCatalog";
import { isPremiumModule } from "@/utils/moduleMatrix";
import { CheckSquare, XSquare, Sparkles } from "lucide-react";

interface ModuleSelectorProps {
  selectedModules: string[];
  onModulesChange: (modules: string[]) => void;
}

export const ModuleSelector = ({ selectedModules, onModulesChange }: ModuleSelectorProps) => {
  const allModuleKeys = SIDEBAR_SECTIONS.flatMap(section => 
    section.items.map(item => item.key)
  );

  const handleSelectAll = () => {
    onModulesChange(allModuleKeys);
  };

  const handleClearAll = () => {
    onModulesChange([]);
  };

  const handleToggleModule = (moduleKey: string) => {
    if (selectedModules.includes(moduleKey)) {
      onModulesChange(selectedModules.filter(m => m !== moduleKey));
    } else {
      onModulesChange([...selectedModules, moduleKey]);
    }
  };

  const handleToggleSection = (sectionItems: string[], isAllSelected: boolean) => {
    if (isAllSelected) {
      onModulesChange(selectedModules.filter(m => !sectionItems.includes(m)));
    } else {
      const newModules = new Set([...selectedModules, ...sectionItems]);
      onModulesChange(Array.from(newModules));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Módulos Selecionados:</span>
          <Badge variant="secondary">{selectedModules.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            <CheckSquare className="h-4 w-4 mr-1" />
            Todos
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <XSquare className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </div>

      <div className="border rounded-lg max-h-[400px] overflow-y-auto">
        <Accordion type="multiple" className="w-full" defaultValue={SIDEBAR_SECTIONS.map(s => s.key)}>
          {SIDEBAR_SECTIONS.map(section => {
            const sectionModuleKeys = section.items.map(item => item.key);
            const selectedCount = sectionModuleKeys.filter(k => selectedModules.includes(k)).length;
            const isAllSelected = selectedCount === sectionModuleKeys.length;

            return (
              <AccordionItem key={section.key} value={section.key}>
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-2">
                      <section.icon className={`h-4 w-4 ${section.color}`} />
                      <span className="font-medium text-sm">{section.label}</span>
                      {section.premium && (
                        <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <Badge variant={selectedCount > 0 ? "default" : "secondary"} className="text-xs">
                      {selectedCount}/{sectionModuleKeys.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-2">
                    <div 
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer border-b border-dashed mb-2"
                      onClick={() => handleToggleSection(sectionModuleKeys, isAllSelected)}
                    >
                      <Checkbox checked={isAllSelected} />
                      <span className="text-xs text-muted-foreground italic">
                        {isAllSelected ? 'Desmarcar todos' : 'Selecionar todos desta seção'}
                      </span>
                    </div>
                    {section.items.map(item => (
                      <div 
                        key={item.key}
                        className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleToggleModule(item.key)}
                      >
                        <Checkbox checked={selectedModules.includes(item.key)} />
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                        {isPremiumModule(item.key) && (
                          <Sparkles className="h-3 w-3 text-amber-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
