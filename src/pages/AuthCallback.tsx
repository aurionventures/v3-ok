import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchConvidadoByUserId } from "@/services/agenda";
import { fetchMembroByUserId } from "@/services/governance";
import { logAccess } from "@/services/accessLogs";
import { Loader2 } from "lucide-react";

/**
 * Página de callback para magic link e OAuth.
 * Recebe o redirect do Supabase Auth. Tokens podem vir em hash (#access_token=...) ou query (?access_token=...).
 * Estabelece a sessão e redireciona:
 * Convidados -> /convidado | Membros -> /member/dashboard | Outros -> /login
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "redirecting" | "error">("processing");
  const ranRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (ranRef.current) return;
      ranRef.current = true;

      if (!supabase) {
        setStatus("error");
        navigate("/login", { replace: true });
        return;
      }

      // Tokens podem vir no hash (#...) ou na query string (?...)
      const hashParams = window.location.hash?.substring(1) || "";
      const queryParams = window.location.search?.substring(1) || "";
      const params = new URLSearchParams(hashParams || queryParams);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (accessToken && refreshToken) {
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
        // Limpa hash/query da URL
        window.history.replaceState(null, "", window.location.pathname);
      }

      setStatus("redirecting");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/login", { replace: true });
        return;
      }

      // Convidado tem prioridade – usuário externo com acesso temporário à página de documentos
      const { data: convidado } = await fetchConvidadoByUserId(session.user.id);
      if (convidado) {
        logAccess({
          user_id: session.user.id,
          email: session.user.email ?? convidado.email ?? undefined,
          tipo: "convidado",
        });
        navigate("/convidado", { replace: true });
        return;
      }

      const membro = await fetchMembroByUserId(session.user.id);
      if (membro) {
        logAccess({
          user_id: session.user.id,
          email: session.user.email ?? membro.email ?? undefined,
          tipo: "membro",
          empresa_id: membro.empresa_id ?? undefined,
        });
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
