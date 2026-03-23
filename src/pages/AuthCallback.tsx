import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchConvidadoByUserId } from "@/services/agenda";
import { fetchMembroByUserId } from "@/services/governance";
import { Loader2 } from "lucide-react";

/**
 * Página de callback para magic link e OAuth.
 * Recebe o redirect do Supabase Auth, processa o hash (#access_token, etc.),
 * estabelece a sessão e redireciona para a página correta.
 * Convidados -> /convidado | Membros -> /member/dashboard | Outros -> /login
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "redirecting" | "error">("processing");

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setStatus("error");
        navigate("/login", { replace: true });
        return;
      }

      const hash = window.location.hash?.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (type === "magiclink" && accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error("[AuthCallback] setSession:", error);
            setStatus("error");
            navigate("/login", { replace: true, state: { memberLoginError: error.message } });
            return;
          }
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      setStatus("redirecting");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/login", { replace: true });
        return;
      }

      const { data: convidado } = await fetchConvidadoByUserId(session.user.id);
      if (convidado) {
        navigate("/convidado", { replace: true });
        return;
      }

      const membro = await fetchMembroByUserId(session.user.id);
      if (membro) {
        navigate("/member/dashboard", { replace: true });
        return;
      }

      navigate("/login", { replace: true, state: { memberLoginError: "Nenhum perfil encontrado para esta conta." } });
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">
        {status === "processing" && "Processando autenticação..."}
        {status === "redirecting" && "Redirecionando..."}
        {status === "error" && "Redirecionando para login..."}
      </p>
    </div>
  );
};

export default AuthCallback;
