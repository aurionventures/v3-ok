import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export interface CompanyFiltersState {
  type: 'all' | 'cliente' | 'parceiro';
  plans: string[];
  paymentStatus: string[];
}

interface CompanyFiltersProps {
  filters: CompanyFiltersState;
  onFiltersChange: (filters: CompanyFiltersState) => void;
}

export const CompanyFilters = ({ filters, onFiltersChange }: CompanyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const plans = ['Basic', 'Professional', 'Enterprise'];
  const paymentStatuses = ['Pago', 'Aguardando', 'Pendente', 'Vencido'];

  const handleTypeChange = (type: 'all' | 'cliente' | 'parceiro') => {
    onFiltersChange({ ...filters, type });
  };

  const handlePlanToggle = (plan: string) => {
    const newPlans = filters.plans.includes(plan)
      ? filters.plans.filter(p => p !== plan)
      : [...filters.plans, plan];
    onFiltersChange({ ...filters, plans: newPlans });
  };

  const handlePaymentStatusToggle = (status: string) => {
    const newStatuses = filters.paymentStatus.includes(status)
      ? filters.paymentStatus.filter(s => s !== status)
      : [...filters.paymentStatus, status];
    onFiltersChange({ ...filters, paymentStatus: newStatuses });
  };

  const clearFilters = () => {
    onFiltersChange({ type: 'all', plans: [], paymentStatus: [] });
  };

  const activeFiltersCount = 
    (filters.type !== 'all' ? 1 : 0) +
    filters.plans.length +
    filters.paymentStatus.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-popover z-50" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-1"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label className="mb-2 block">Tipo de Conta</Label>
              <RadioGroup value={filters.type} onValueChange={handleTypeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="type-all" />
                  <Label htmlFor="type-all" className="font-normal cursor-pointer">Todas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cliente" id="type-cliente" />
                  <Label htmlFor="type-cliente" className="font-normal cursor-pointer">Clientes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parceiro" id="type-parceiro" />
                  <Label htmlFor="type-parceiro" className="font-normal cursor-pointer">Parceiros</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block">Planos</Label>
              <div className="space-y-2">
                {plans.map(plan => (
                  <div key={plan} className="flex items-center space-x-2">
                    <Checkbox
                      id={`plan-${plan}`}
                      checked={filters.plans.includes(plan)}
                      onCheckedChange={() => handlePlanToggle(plan)}
                    />
                    <Label htmlFor={`plan-${plan}`} className="font-normal cursor-pointer">
                      {plan}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Status de Pagamento</Label>
              <div className="space-y-2">
                {paymentStatuses.map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.paymentStatus.includes(status)}
                      onCheckedChange={() => handlePaymentStatusToggle(status)}
                    />
                    <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
