import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  GOVERNANCE_CATEGORIES,
  RFB_QUALIFICATION_CODES,
  SHAREHOLDING_CLASSES,
  INVESTMENT_TYPES,
  COMMITTEES,
  FAMILY_GENERATIONS,
  MEMBER_STATUS,
  getRequiredFields,
} from "@/data/governanceStandards";
import type { CorporateStructureFormData } from "@/hooks/useCorporateStructure";

interface CorporateStructureFormProps {
  formData: Partial<CorporateStructureFormData>;
  onChange: (data: Partial<CorporateStructureFormData>) => void;
  editingMemberId?: string;
}

export function CorporateStructureForm({ formData, onChange, editingMemberId }: CorporateStructureFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(formData.governance_category || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(formData.governance_subcategory || "");
  const [requiredFields, setRequiredFields] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      const fields = getRequiredFields(selectedCategory);
      setRequiredFields(fields);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("");
    onChange({
      ...formData,
      governance_category: value,
      governance_subcategory: undefined,
      official_qualification_code: undefined,
      specific_role: undefined,
    });
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    const category = GOVERNANCE_CATEGORIES.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories.find(s => s.id === value);
    
    onChange({
      ...formData,
      governance_subcategory: value,
      official_qualification_code: subcategory?.defaultQualificationCode,
    });
  };

  const category = GOVERNANCE_CATEGORIES.find(c => c.id === selectedCategory);
  const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);
  const showShareholdingFields = requiredFields.includes("shareholdingPercentage");
  const showTermFields = requiredFields.includes("termStartDate");
  const showFamilyFields = requiredFields.includes("generation");

  return (
    <div className="space-y-6">
      {/* Personal Data */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">Dados Pessoais</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">CPF/CNPJ</Label>
              <Input
                id="document"
                value={formData.document || ""}
                onChange={(e) => onChange({ ...formData, document: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => onChange({ ...formData, email: e.target.value })}
                placeholder="email@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => onChange({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Classification */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">Classificação de Governança</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="category">
                Categoria de Governança <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {GOVERNANCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {category && (
                <p className="text-xs text-muted-foreground">{category.description}</p>
              )}
            </div>

            {selectedCategory && category && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="subcategory">Subcategoria</Label>
                <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedCategory && (
              <div className="space-y-2">
                <Label htmlFor="qualification">
                  Qualificação Oficial (RFB)
                  {requiredFields.includes("official_qualification_code") && (
                    <span className="text-destructive"> *</span>
                  )}
                </Label>
                <Select
                  value={formData.official_qualification_code || ""}
                  onValueChange={(value) =>
                    onChange({ ...formData, official_qualification_code: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Código RFB" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.allowedQualificationCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code} - {RFB_QUALIFICATION_CODES[code as keyof typeof RFB_QUALIFICATION_CODES]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedSubcategory && subcategory && (
              <div className="space-y-2">
                <Label htmlFor="specificRole">Cargo Específico</Label>
                <Select
                  value={formData.specific_role || ""}
                  onValueChange={(value) => onChange({ ...formData, specific_role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategory.specificRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shareholding Data */}
      {showShareholdingFields && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Dados Societários</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="percentage">
                  Participação (%) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.shareholding_percentage || ""}
                  onChange={(e) =>
                    onChange({ ...formData, shareholding_percentage: parseFloat(e.target.value) })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Classe de Ações/Quotas</Label>
                <Select
                  value={formData.shareholding_class || ""}
                  onValueChange={(value) => onChange({ ...formData, shareholding_class: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHAREHOLDING_CLASSES.map((cls) => (
                      <SelectItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentType">Tipo de Entrada</Label>
                <Select
                  value={formData.investment_type || ""}
                  onValueChange={(value) => onChange({ ...formData, investment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de Entrada no Capital</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.investment_entry_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.investment_entry_date
                        ? format(new Date(formData.investment_entry_date), "PPP", { locale: ptBR })
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.investment_entry_date ? new Date(formData.investment_entry_date) : undefined}
                      onSelect={(date) =>
                        onChange({ ...formData, investment_entry_date: date?.toISOString() })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Term/Mandate Data */}
      {showTermFields && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Mandato</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Data de Início <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.term_start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.term_start_date
                        ? format(new Date(formData.term_start_date), "PPP", { locale: ptBR })
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.term_start_date ? new Date(formData.term_start_date) : undefined}
                      onSelect={(date) =>
                        onChange({ ...formData, term_start_date: date?.toISOString() })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {!formData.term_is_indefinite && (
                <div className="space-y-2">
                  <Label>Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.term_end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.term_end_date
                          ? format(new Date(formData.term_end_date), "PPP", { locale: ptBR })
                          : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.term_end_date ? new Date(formData.term_end_date) : undefined}
                        onSelect={(date) =>
                          onChange({ ...formData, term_end_date: date?.toISOString() })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="indefinite"
                  checked={formData.term_is_indefinite || false}
                  onCheckedChange={(checked) =>
                    onChange({ ...formData, term_is_indefinite: checked as boolean })
                  }
                />
                <Label htmlFor="indefinite" className="cursor-pointer">
                  Mandato por prazo indeterminado
                </Label>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Data */}
      {showFamilyFields && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Estrutura Familiar</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="familyMember"
                  checked={formData.is_family_member || false}
                  onCheckedChange={(checked) =>
                    onChange({ ...formData, is_family_member: checked as boolean })
                  }
                />
                <Label htmlFor="familyMember" className="cursor-pointer">
                  Membro da família empresária
                </Label>
              </div>

              {formData.is_family_member && (
                <div className="space-y-2 col-span-2">
                  <Label>
                    Geração <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.generation || ""}
                    onValueChange={(value) => onChange({ ...formData, generation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a geração" />
                    </SelectTrigger>
                    <SelectContent>
                      {FAMILY_GENERATIONS.map((gen) => (
                        <SelectItem key={gen.value} value={gen.value}>
                          {gen.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">Status</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "Ativo"}
                onValueChange={(value) => onChange({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.status && formData.status !== "Ativo" && (
              <div className="space-y-2">
                <Label htmlFor="statusReason">Motivo</Label>
                <Input
                  id="statusReason"
                  value={formData.status_reason || ""}
                  onChange={(e) => onChange({ ...formData, status_reason: e.target.value })}
                  placeholder="Motivo do status"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
