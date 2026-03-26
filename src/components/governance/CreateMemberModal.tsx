import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MemberFormData, GovernanceMember } from '@/hooks/useGovernanceMembers';

interface CreateMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MemberFormData) => Promise<void>;
  editingMember?: GovernanceMember | null;
  organId?: string;
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingMember,
  organId
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    role: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    email: '',
    phone: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        role: editingMember.role,
        start_date: editingMember.start_date,
        end_date: editingMember.end_date || '',
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        status: editingMember.status as 'active' | 'inactive'
      });
    } else {
      setFormData({
        name: '',
        role: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
  }, [editingMember, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.start_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, cargo e data de início.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      toast({
        title: editingMember ? "Membro atualizado" : "Membro criado",
        description: `${formData.name} foi ${editingMember ? 'atualizado' : 'criado'} com sucesso.`
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível ${editingMember ? 'atualizar' : 'criar'} o membro.`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? 'Editar Membro' : 'Criar Novo Membro'}
          </DialogTitle>
          <DialogDescription>
            {editingMember 
              ? 'Atualize as informações do membro' 
              : 'Preencha os dados do novo membro'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo Principal *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Ex: Conselheiro, Membro, Coordenador"
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : editingMember ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
