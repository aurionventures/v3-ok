import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Question, CompanyData } from "@/types/maturity";

interface QuestionInputProps {
  question: Question | CompanyData;
  value: string | string[] | number | object | undefined;
  onChange: (value: string | string[] | number | object) => void;
  disabled?: boolean;
  onNext?: () => void;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ 
  question, 
  value, 
  onChange, 
  disabled = false,
  onNext
}) => {
  const handleMultipleChoiceChange = (option: string, checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (checked) {
      const newValue = [...currentValue, option];
      // Se "nenhuma das anteriores" for selecionada, limpar outras opções
      if (option.toLowerCase().includes("nenhuma")) {
        onChange([option]);
      } else {
        // Se outra opção for selecionada, remover "nenhuma das anteriores"
        const filtered = newValue.filter(v => !v.toLowerCase().includes("nenhuma"));
        onChange(filtered);
      }
    } else {
      onChange(currentValue.filter(v => v !== option));
    }
  };

  const handleMatrixChange = (item: string, selectedValue: string) => {
    const currentValue = typeof value === 'object' && !Array.isArray(value) ? value as Record<string, string> : {};
    const newValue = {
      ...currentValue,
      [item]: selectedValue
    };
    onChange(JSON.stringify(newValue)); // Convert to string for consistency
  };

  switch (question.tipo) {
    case "multipla_escolha_unica":
      return (
        <RadioGroup 
          value={typeof value === 'string' ? value : ""} 
          onValueChange={onChange}
          disabled={disabled}
          className="space-y-3"
        >
          {question.opcoes.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label 
                htmlFor={option} 
                className="text-sm leading-relaxed cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "multipla_escolha_multipla":
      const currentMultipleValue = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {question.opcoes.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={currentMultipleValue.includes(option)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceChange(option, checked as boolean)
                  }
                  disabled={disabled}
                />
                <Label 
                  htmlFor={option} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
          {onNext && (
            <div className="flex justify-end">
              <Button onClick={onNext} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );

    case "numerico":
      return (
        <div className="space-y-4">
          <Input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            disabled={disabled}
            placeholder="Digite um número"
            className="max-w-xs"
          />
          {onNext && (
            <div className="flex justify-end">
              <Button onClick={onNext} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );

    case "numerico_multiplo":
      // Para questões como a 7 que pede múltiplos números
      const currentNumericMultiple = typeof value === 'object' && !Array.isArray(value) ? value as { total: number, women: number } : { total: 0, women: 0 };
      
      const handleNumericMultipleChange = (field: 'total' | 'women', newValue: number) => {
        const updatedValue = {
          ...currentNumericMultiple,
          [field]: newValue
        };
        onChange(updatedValue);
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Total de membros efetivos:</Label>
              <Input
                type="number"
                value={currentNumericMultiple.total || ''}
                onChange={(e) => handleNumericMultipleChange('total', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={disabled}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Total de mulheres:</Label>
              <Input
                type="number"
                value={currentNumericMultiple.women || ''}
                onChange={(e) => handleNumericMultipleChange('women', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={disabled}
                className="mt-1"
              />
            </div>
          </div>
          {onNext && (
            <div className="flex justify-end pt-2">
              <Button onClick={onNext} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );

    case "texto":
      return (
        <div className="space-y-4">
          <Textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Digite sua resposta..."
            className="min-h-20"
          />
          {onNext && (
            <div className="flex justify-end">
              <Button onClick={onNext} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );

    case "matriz":
      // Para questão 17 que é uma matriz de frequências
      const matrixOptions = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"];
      let currentMatrixValue: Record<string, string> = {};
      try {
        currentMatrixValue = typeof value === 'string' ? JSON.parse(value) : {};
      } catch {
        currentMatrixValue = {};
      }
      
      return (
        <div className="space-y-4">
          <div className="space-y-4">
            {question.opcoes.map((item) => (
              <div key={item} className="border rounded-lg p-4">
                <Label className="text-sm font-medium mb-3 block">{item}</Label>
                <RadioGroup
                  value={currentMatrixValue[item] || ""}
                  onValueChange={(val) => handleMatrixChange(item, val)}
                  disabled={disabled}
                  className="flex flex-wrap gap-4"
                >
                  {matrixOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${item}-${option}`} />
                      <Label htmlFor={`${item}-${option}`} className="text-xs">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          {onNext && (
            <div className="flex justify-end pt-2">
              <Button onClick={onNext} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-gray-500 italic">
          Tipo de questão não suportado: {(question as any).tipo}
        </div>
      );
  }
};