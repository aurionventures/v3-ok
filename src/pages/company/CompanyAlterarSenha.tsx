import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Lock, Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const CompanyAlterarSenha = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [novaSenhaVisivel, setNovaSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  const gerarSenha = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 12; i++) s += chars[Math.floor(Math.random() * chars.length)];
    setNovaSenha(s);
    setConfirmarSenha(s);
    setNovaSenhaVisivel(true);
    setConfirmarSenhaVisivel(true);
    toast({ title: "Senha gerada", description: "Copie e guarde em local seguro." });
  };

  useEffect(() => {
    const check = async () => {
      if (!supabase) {
        setChecking(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/login", { replace: true, state: { userType: "company" } });
        return;
      }
      setChecking(false);
    };
    check();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast({
        title: "Senhas não conferem",
        description: "Digite a mesma senha nos dois campos.",
        variant: "destructive",
      });
      return;
    }

    if (!supabase) {
      toast({ title: "Erro", description: "Supabase não configurado.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user }, error: updateError } = await supabase.auth.updateUser({ password: novaSenha });

      if (updateError) {
        toast({
          title: "Erro ao alterar senha",
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      if (!user?.id) {
        toast({ title: "Erro", description: "Sessão inválida.", variant: "destructive" });
        return;
      }

      const { error: dbError } = await supabase
        .from("perfis")
        .update({ senha_alterada: true })
        .eq("user_id", user.id);

      if (dbError) {
        console.error("[CompanyAlterarSenha] update senha_alterada:", dbError);
        toast({
          title: "Senha alterada",
          description: "Altere a senha novamente se precisar. Redirecionando...",
        });
      } else {
        toast({
          title: "Senha alterada com sucesso",
          description: "Agora você pode acessar o dashboard da empresa com sua nova senha.",
        });
      }

      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Alterar senha" />
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle>Alterar senha de acesso</CardTitle>
          </div>
          <CardDescription>
            Esta é sua primeira vez acessando. Por segurança, defina uma nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nova-senha">Nova senha</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={gerarSenha}
                >
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Gerar senha
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="nova-senha"
                  type={novaSenhaVisivel ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setNovaSenhaVisivel((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={novaSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                >
                  {novaSenhaVisivel ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirmar-senha"
                  type={confirmarSenhaVisivel ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setConfirmarSenhaVisivel((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={confirmarSenhaVisivel ? "Ocultar senha" : "Exibir senha"}
                >
                  {confirmarSenhaVisivel ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Definir nova senha
            </Button>
          </form>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyAlterarSenha;
