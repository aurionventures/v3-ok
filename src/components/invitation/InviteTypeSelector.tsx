import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface InviteTypeSelectorProps {
  onSelect: (type: 'cliente' | 'parceiro') => void;
}

export const InviteTypeSelector = ({ onSelect }: InviteTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selecione o tipo de conta que deseja criar:
      </p>
      
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {/* Temporariamente comentado - opção Cliente
        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect('cliente')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Cliente</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Empresa cliente que utilizará a plataforma
              </p>
            </div>
          </div>
        </Card>
        */}
        
        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect('parceiro')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Parceiro</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Parceiro que gerenciará múltiplos clientes
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
