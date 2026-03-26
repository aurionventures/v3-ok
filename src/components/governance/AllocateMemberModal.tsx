import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AllocationData, GovernanceMember } from '@/hooks/useGovernanceMembers';
import { useGovernanceOrgans } from '@/hooks/useGovernanceOrgans';
import { Badge } from '@/components/ui/badge';

interface AllocateMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAllocate: (data: AllocationData) => Promise<void>;
  member: GovernanceMember | null;
}

export const AllocateMemberModal: React.FC<AllocateMemberModalProps> = ({
  open,
  onOpenChange,
  onAllocate,
  member
}) => {
  const { toast } = useToast();
  const { organs: allOrgans } = useGovernanceOrgans();
  const [formData, setFormData] = useState({
    organ_id: '',
    role: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && !member) {
      setFormData({
        organ_id: '',
        role: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      });
    }
  }, [open, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member || !formData.organ_id || !formData.role || !formData.start_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um órgão, cargo e data de início.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já está alocado neste órgão
    const alreadyAllocated = member.allocations?.some(
      alloc => alloc.council_id === formData.organ_id
    );

    if (alreadyAllocated) {
      toast({
        title: "Membro já alocado",
        description: "Este membro já está alocado neste órgão.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await onAllocate({
        member_id: member.id,
        organ_id: formData.organ_id,
        role: formData.role,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined
      });

      toast({
        title: "Membro alocado",
        description: `${member.name} foi alocado com sucesso.`
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alocar o membro.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) return null;

  const getOrganTypeBadge = (type: string) => {
    const colors = {
      conselho: 'bg-blue-100 text-blue-800',
      comite: 'bg-green-100 text-green-800',
      comissao: 'bg-amber-100 text-amber-800'
    };
    const labels = {
      conselho: 'Conselho',
      comite: 'Comitê',
      comissao: 'Comissão'
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alocar Membro em Órgão</DialogTitle>
          <DialogDescription>
            Selecione o órgão e o cargo para {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do membro */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div>
              <span className="text-sm font-medium">Membro:</span>
              <p className="text-base">{member.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Cargo atual:</span>
              <p className="text-base">{member.role}</p>
            </div>
            {member.allocations && member.allocations.length > 0 && (
              <div>
                <span className="text-sm font-medium">Já alocado em:</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {member.allocations.map((alloc, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {getOrganTypeBadge(alloc.organ_type)}
                      <span className="text-xs">{alloc.council_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organ">Órgão *</Label>
              <Select 
                value={formData.organ_id}
                onValueChange={(value) => setFormData({ ...formData, organ_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um órgão" />
                </SelectTrigger>
                <SelectContent>
                  {allOrgans.map((organ) => (
                    <SelectItem key={organ.id} value={organ.id}>
                      {getOrganTypeBadge(organ.organ_type || 'conselho')} {organ.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Cargo no Órgão *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Presidente, Membro, Coordenador"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Data de Início *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Data de Término</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Alocando...' : 'Alocar Membro'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
