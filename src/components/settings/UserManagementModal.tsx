import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizationUserRole, ORG_ROLE_LABELS, ORG_ROLE_DESCRIPTIONS } from "@/types/organization";
import { mockCouncils } from "@/data/mockCouncilsData";

interface UserManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    email: string;
    name: string;
    orgRole: OrganizationUserRole;
    councilMemberships?: string[];
  } | null;
  onSave: (userData: any) => void;
}

export const UserManagementModal = ({ 
  open, 
  onOpenChange, 
  user, 
  onSave 
}: UserManagementModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgRole, setOrgRole] = useState<OrganizationUserRole>("org_user");
  const [selectedCouncils, setSelectedCouncils] = useState<string[]>([]);
  const [sendInvite, setSendInvite] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setOrgRole(user.orgRole);
      setSelectedCouncils(user.councilMemberships || []);
    } else {
      setName("");
      setEmail("");
      setOrgRole("org_user");
      setSelectedCouncils([]);
      setSendInvite(true);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      orgRole,
      councilMemberships: orgRole === 'org_member' ? selectedCouncils : undefined,
      company_id: 'Empresa Demo'
    });
  };

  const toggleCouncil = (councilId: string) => {
    setSelectedCouncils(prev => 
      prev.includes(councilId)
        ? prev.filter(id => id !== councilId)
        : [...prev, councilId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@empresa.com"
              required
              disabled={!!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Papel na Organização</Label>
            <Select value={orgRole} onValueChange={(v) => setOrgRole(v as OrganizationUserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORG_ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <div>
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {ORG_ROLE_DESCRIPTIONS[orgRole]}
            </p>
          </div>

          {orgRole === 'org_member' && (
            <div className="space-y-2">
              <Label>Órgãos de Governança</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Selecione os órgãos que este membro participa
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {mockCouncils.map((council) => (
                  <div key={council.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={council.id}
                      checked={selectedCouncils.includes(council.id)}
                      onCheckedChange={() => toggleCouncil(council.id)}
                    />
                    <label
                      htmlFor={council.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {council.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendInvite"
                checked={sendInvite}
                onCheckedChange={(checked) => setSendInvite(checked as boolean)}
              />
              <label
                htmlFor="sendInvite"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Enviar convite por e-mail
              </label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
