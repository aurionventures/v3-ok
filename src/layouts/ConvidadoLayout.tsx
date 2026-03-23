import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchConvidadoByUserId } from "@/services/agenda";

/**
 * Layout para convidados de reunião (acesso via magic link).
 * Verifica se o usuário autenticado é um convidado ativo.
 */
const ConvidadoLayout = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!supabase) {
        setAuthorized(false);
        setChecking(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      const { data: convidado } = await fetchConvidadoByUserId(session.user.id);
      setAuthorized(!!convidado);
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace state={{ memberLoginError: "Acesso não autorizado. Use o link enviado por e-mail." }} />;
  }

  return <Outlet />;
};

export default ConvidadoLayout;
