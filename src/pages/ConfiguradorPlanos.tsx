import { useState, useEffect } from "react";
import { Building2, FileText, Plus, Pencil, Trash2, Users, Infinity, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getPlanos, setPlanos as savePlanosToStorage, type PlanoAssinatura } from "@/data/planosStorage";

interface PorteEmpresa {
  id: string;
  name: string;
  description: string;
  revenueRange: string;
}

const portesIniciais: PorteEmpresa[] = [
  { id: "1", name: "SMB", description: "Empresas < R$ 50M/ano", revenueRange: "<R$50M - R$50M" },
  { id: "2", name: "SMB+", description: "Empresas em transição", revenueRange: "R$50M - R$100M" },
  { id: "3", name: "Mid-Market", description: "Médias empresas", revenueRange: "R$100M - R$500M" },
  { id: "4", name: "Large", description: "Grandes empresas", revenueRange: "R$500M - R$1B" },
  { id: "5", name: "Enterprise", description: "Corporações", revenueRange: "> R$1B" },
];

const ConfiguradorPlanos = () => {
  const { toast } = useToast();
  const [portes, setPortes] = useState<PorteEmpresa[]>(portesIniciais);
  const [planos, setPlanos] = useState<PlanoAssinatura[]>(() => getPlanos());

  useEffect(() => {
    savePlanosToStorage(planos);
  }, [planos]);

  // Porte dialog
  const [porteDialogOpen, setPorteDialogOpen] = useState(false);
  const [porteEditando, setPorteEditando] = useState<PorteEmpresa | null>(null);
  const [porteForm, setPorteForm] = useState({ name: "", description: "", revenueRange: "" });

  // Plano dialog
  const [planoDialogOpen, setPlanoDialogOpen] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<PlanoAssinatura | null>(null);
  const [planoForm, setPlanoForm] = useState({ name: "", description: "", empresas: "1", usuarios: "∞", valor: "0" });

  const handleNovoPorte = () => {
    setPorteEditando(null);
    setPorteForm({ name: "", description: "", revenueRange: "" });
    setPorteDialogOpen(true);
  };

  const handleEditarPorte = (p: PorteEmpresa) => {
    setPorteEditando(p);
    setPorteForm({
      name: p.name,
      description: p.description,
      revenueRange: p.revenueRange,
    });
    setPorteDialogOpen(true);
  };

  const handleSalvarPorte = () => {
    const name = porteForm.name.trim();
    const description = porteForm.description.trim();
    const revenueRange = porteForm.revenueRange.trim();
    if (!name) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    if (porteEditando) {
      setPortes((prev) =>
        prev.map((x) =>
          x.id === porteEditando.id
            ? { ...x, name, description, revenueRange }
            : x
        )
      );
      toast({ title: "Porte atualizado", description: `${name} foi salvo.` });
    } else {
      const ids = portes.map((x) => parseInt(x.id, 10)).filter((n) => !isNaN(n));
      const id = String(ids.length ? Math.max(...ids) + 1 : 1);
      setPortes((prev) => [...prev, { id, name, description, revenueRange }]);
      toast({ title: "Porte criado", description: `${name} foi adicionado.` });
    }
    setPorteDialogOpen(false);
  };

  const handleExcluirPorte = (p: PorteEmpresa) => {
    setPortes((prev) => prev.filter((x) => x.id !== p.id));
    toast({ title: "Porte removido", description: `${p.name} foi removido.` });
  };

  const handleNovoPlano = () => {
    setPlanoEditando(null);
    setPlanoForm({ name: "", description: "", empresas: "1", usuarios: "∞", valor: "0" });
    setPlanoDialogOpen(true);
  };

  const handleEditarPlano = (p: PlanoAssinatura) => {
    setPlanoEditando(p);
    setPlanoForm({
      name: p.name,
      description: p.description,
      empresas: String(p.empresas),
      usuarios: p.usuarios,
      valor: String(p.valor ?? 0),
    });
    setPlanoDialogOpen(true);
  };

  const handleSalvarPlano = () => {
    const name = planoForm.name.trim();
    const description = planoForm.description.trim();
    const empresas = parseInt(planoForm.empresas, 10) || 1;
    const usuarios = planoForm.usuarios.trim() || "∞";
    const valor = parseInt(planoForm.valor, 10) || 0;
    if (!name) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    if (planoEditando) {
      setPlanos((prev) =>
        prev.map((x) =>
          x.id === planoEditando.id
            ? { ...x, name, description, empresas, usuarios, valor }
            : x
        )
      );
      toast({ title: "Plano atualizado", description: `${name} foi salvo.` });
    } else {
      const ids = planos.map((x) => parseInt(x.id, 10)).filter((n) => !isNaN(n));
      const id = String(ids.length ? Math.max(...ids) + 1 : 1);
      setPlanos((prev) => [...prev, { id, name, description, empresas, usuarios, valor }]);
      toast({ title: "Plano criado", description: `${name} foi adicionado.` });
    }
    setPlanoDialogOpen(false);
  };

  const formatValor = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(v);

  const handleExcluirPlano = (p: PlanoAssinatura) => {
    setPlanos((prev) => prev.filter((x) => x.id !== p.id));
    toast({ title: "Plano removido", description: `${p.name} foi removido.` });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurador de Planos" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configurador de Planos</h1>
            <p className="text-gray-500">Configure portes de empresa e planos de assinatura</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portes de Empresa */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Portes de Empresa
                </CardTitle>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleNovoPorte}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {portes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.revenueRange}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditarPorte(p)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleExcluirPorte(p)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Planos de Assinatura */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Planos de Assinatura
                </CardTitle>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleNovoPlano}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {planos.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {p.empresas} empresas
                        </span>
                        <span className="flex items-center gap-1">
                          <Infinity className="h-4 w-4" />
                          {p.usuarios} usuários
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <DollarSign className="h-4 w-4" />
                          {formatValor(p.valor ?? 0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditarPlano(p)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleExcluirPlano(p)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Dialog Porte */}
          <Dialog open={porteDialogOpen} onOpenChange={setPorteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{porteEditando ? "Editar porte" : "Novo porte"}</DialogTitle>
                <DialogDescription>Configure os dados do porte de empresa.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="porte-name">Nome</Label>
                  <Input
                    id="porte-name"
                    value={porteForm.name}
                    onChange={(e) => setPorteForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: SMB"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="porte-desc">Descrição</Label>
                  <Input
                    id="porte-desc"
                    value={porteForm.description}
                    onChange={(e) => setPorteForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Ex: Empresas < R$ 50M/ano"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="porte-revenue">Faixa de faturamento</Label>
                  <Input
                    id="porte-revenue"
                    value={porteForm.revenueRange}
                    onChange={(e) => setPorteForm((p) => ({ ...p, revenueRange: e.target.value }))}
                    placeholder="Ex: <R$50M - R$50M"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPorteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvarPorte}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Plano */}
          <Dialog open={planoDialogOpen} onOpenChange={setPlanoDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{planoEditando ? "Editar plano" : "Novo plano"}</DialogTitle>
                <DialogDescription>Configure os dados do plano de assinatura.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="plano-name">Nome</Label>
                  <Input
                    id="plano-name"
                    value={planoForm.name}
                    onChange={(e) => setPlanoForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Essencial"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plano-desc">Descrição</Label>
                  <Input
                    id="plano-desc"
                    value={planoForm.description}
                    onChange={(e) => setPlanoForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Ex: Plano básico"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="plano-empresas">Empresas</Label>
                    <Input
                      id="plano-empresas"
                      type="number"
                      min={0}
                      value={planoForm.empresas}
                      onChange={(e) => setPlanoForm((p) => ({ ...p, empresas: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plano-usuarios">Usuários</Label>
                    <Input
                      id="plano-usuarios"
                      value={planoForm.usuarios}
                      onChange={(e) => setPlanoForm((p) => ({ ...p, usuarios: e.target.value }))}
                      placeholder="∞"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plano-valor">Valor (R$)</Label>
                    <Input
                      id="plano-valor"
                      type="number"
                      min={0}
                      value={planoForm.valor}
                      onChange={(e) => setPlanoForm((p) => ({ ...p, valor: e.target.value }))}
                      placeholder="Ex: 3490"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPlanoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvarPlano}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ConfiguradorPlanos;
