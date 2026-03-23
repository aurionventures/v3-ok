import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Lock, Loader2 } from "lucide-react";

const MemberAlterarSenha = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        .from("membros_governanca")
        .update({ senha_alterada: true })
        .eq("user_id", user.id);

      if (dbError) {
        console.error("[MemberAlterarSenha] update senha_alterada:", dbError);
        toast({
          title: "Senha alterada",
          description: "Altere a senha novamente se precisar. Redirecionando...",
        });
      } else {
        toast({
          title: "Senha alterada com sucesso",
          description: "Agora você pode acessar o Portal de Membros com sua nova senha.",
        });
      }

      navigate("/member/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
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
              <Label htmlFor="nova-senha">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Definir nova senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberAlterarSenha;
