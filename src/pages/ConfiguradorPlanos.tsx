import { useState } from "react";
import { Building2, FileText, Plus, Pencil, Trash2, Users, Infinity, Puzzle } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PorteEmpresa {
  id: string;
  name: string;
  description: string;
  revenueRange: string;
}

interface PlanoAssinatura {
  id: string;
  name: string;
  description: string;
  empresas: number;
  usuarios: string;
  addons: number;
}

const portesIniciais: PorteEmpresa[] = [
  { id: "1", name: "SMB", description: "Empresas < R$ 50M/ano", revenueRange: "<R$50M - R$50M" },
  { id: "2", name: "SMB+", description: "Empresas em transição", revenueRange: "R$50M - R$100M" },
  { id: "3", name: "Mid-Market", description: "Médias empresas", revenueRange: "R$100M - R$500M" },
  { id: "4", name: "Large", description: "Grandes empresas", revenueRange: "R$500M - R$1B" },
  { id: "5", name: "Enterprise", description: "Corporações", revenueRange: "> R$1B" },
];

const planosIniciais: PlanoAssinatura[] = [
  { id: "1", name: "Essencial", description: "Plano básico", empresas: 1, usuarios: "∞", addons: 0 },
  { id: "2", name: "Profissional", description: "Para crescimento", empresas: 1, usuarios: "∞", addons: 2 },
  { id: "3", name: "Business", description: "Médias empresas", empresas: 1, usuarios: "∞", addons: 3 },
  { id: "4", name: "Enterprise", description: "Solução completa", empresas: 1, usuarios: "∞", addons: 6 },
];

const ConfiguradorPlanos = () => {
  const { toast } = useToast();
  const [portes, setPortes] = useState<PorteEmpresa[]>(portesIniciais);
  const [planos, setPlanos] = useState<PlanoAssinatura[]>(planosIniciais);

  const handleNovoPorte = () => {
    toast({ title: "Novo porte", description: "Funcionalidade em desenvolvimento." });
  };

  const handleEditarPorte = (p: PorteEmpresa) => {
    toast({ title: "Editar porte", description: `Editar: ${p.name}` });
  };

  const handleExcluirPorte = (p: PorteEmpresa) => {
    setPortes((prev) => prev.filter((x) => x.id !== p.id));
    toast({ title: "Porte removido", description: `${p.name} foi removido.` });
  };

  const handleNovoPlano = () => {
    toast({ title: "Novo plano", description: "Funcionalidade em desenvolvimento." });
  };

  const handleEditarPlano = (p: PlanoAssinatura) => {
    toast({ title: "Editar plano", description: `Editar: ${p.name}` });
  };

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
                        <span className="flex items-center gap-1">
                          <Puzzle className="h-4 w-4" />
                          {p.addons} add-ons
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
        </div>
      </div>
    </div>
  );
};

export default ConfiguradorPlanos;
