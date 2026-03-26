import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGovernanceOrgans, OrganType } from '@/hooks/useGovernanceOrgans';
import { Building2, Users, UserCog } from 'lucide-react';

interface OrganSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  organType?: OrganType;
  placeholder?: string;
  showTypeLabels?: boolean;
}

export const OrganSelector = ({ 
  value, 
  onValueChange, 
  organType,
  placeholder = "Selecione um órgão",
  showTypeLabels = true
}: OrganSelectorProps) => {
  const { organs: conselhos } = useGovernanceOrgans('conselho');
  const { organs: comites } = useGovernanceOrgans('comite');
  const { organs: comissoes } = useGovernanceOrgans('comissao');

  // Se um tipo específico foi solicitado, mostrar apenas esse tipo
  if (organType) {
    const organs = organType === 'conselho' ? conselhos : organType === 'comite' ? comites : comissoes;
    
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {organs.map((organ) => (
            <SelectItem key={organ.id} value={organ.id}>
              {organ.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Mostrar todos os tipos organizados em grupos
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {conselhos.length > 0 && (
          <SelectGroup>
            {showTypeLabels && (
              <SelectLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Conselhos
              </SelectLabel>
            )}
            {conselhos.map((conselho) => (
              <SelectItem key={conselho.id} value={conselho.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  {conselho.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {comites.length > 0 && (
          <SelectGroup>
            {showTypeLabels && (
              <SelectLabel className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Comitês
              </SelectLabel>
            )}
            {comites.map((comite) => (
              <SelectItem key={comite.id} value={comite.id}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  {comite.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {comissoes.length > 0 && (
          <SelectGroup>
            {showTypeLabels && (
              <SelectLabel className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-amber-500" />
                Comissões
              </SelectLabel>
            )}
            {comissoes.map((comissao) => (
              <SelectItem key={comissao.id} value={comissao.id}>
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-amber-500" />
                  {comissao.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {conselhos.length === 0 && comites.length === 0 && comissoes.length === 0 && (
          <SelectItem value="none" disabled>
            Nenhum órgão cadastrado
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
