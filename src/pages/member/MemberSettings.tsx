import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NotificationBell from "@/components/NotificationBell";
import { useToast } from "@/hooks/use-toast";
import { useMembroPerfil } from "@/hooks/useMembroPerfil";
import { User } from "lucide-react";

const MemberSettings = () => {
  const { toast } = useToast();
  const { perfil, isLoading, update, isUpdating } = useMembroPerfil();
  const [nome, setNome] = useState("");
  const [cargoPrincipal, setCargoPrincipal] = useState("");
  const [formacao, setFormacao] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [certificados, setCertificados] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome ?? "");
      setCargoPrincipal(perfil.cargo_principal ?? "");
      setFormacao(perfil.formacao ?? "");
      setLinkedin(perfil.linkedin ?? "");
      setCertificados(perfil.certificados ?? "");
      setBio(perfil.bio ?? "");
    }
  }, [perfil]);

  const handleSave = async () => {
    if (!nome.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    try {
      await update({
        nome: nome.trim(),
        cargo_principal: cargoPrincipal.trim() || undefined,
        formacao: formacao.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        certificados: certificados.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      toast({ title: "Perfil atualizado com sucesso" });
    } catch (e) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (isLoading && !perfil) {
    return (
      <>
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Configurações e Perfil</h1>
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Configurações e Perfil</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações profissionais. O e-mail é definido pela administração.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={perfil?.email ?? ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Contate o administrador para alterar o e-mail.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo principal</Label>
              <Input
                id="cargo"
                value={cargoPrincipal}
                onChange={(e) => setCargoPrincipal(e.target.value)}
                placeholder="Ex: Conselheiro Independente, Diretor Financeiro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formacao">Formação acadêmica</Label>
              <Input
                id="formacao"
                value={formacao}
                onChange={(e) => setFormacao(e.target.value)}
                placeholder="Ex: MBA em Finanças, Ciências Contábeis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/seu-perfil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificados">Certificados e qualificações</Label>
              <Textarea
                id="certificados"
                value={certificados}
                onChange={(e) => setCertificados(e.target.value)}
                placeholder="Liste certificações, cursos e qualificações (um por linha ou separados por vírgula)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Resumo profissional</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Breve resumo da sua trajetória e experiência"
                rows={4}
              />
            </div>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default MemberSettings;
