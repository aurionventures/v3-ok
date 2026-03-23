import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import MemberSidebar from "@/components/MemberSidebar";
import { isMember, setUserType } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { fetchMembroByUserId } from "@/services/governance";
import { fetchEmpresaById } from "@/services/empresas";
import { fetchConvidadoByUserId } from "@/services/agenda";

const MemberLayout = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [redirectState, setRedirectState] = useState<{ error: string } | null>(null);
  const [isConvidado, setIsConvidado] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!supabase) {
        setAuthorized(isMember());
        setChecking(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setAuthorized(false);
        setChecking(false);
        return;
      }
      const membro = await fetchMembroByUserId(session.user.id);
      if (!membro) {
        const { data: convidado } = await fetchConvidadoByUserId(session.user.id);
        if (convidado) {
          setIsConvidado(true);
          setAuthorized(false);
          setChecking(false);
          return;
        }
        setAuthorized(false);
        setChecking(false);
        return;
      }
      if (!membro.empresa_id) {
        await supabase.auth.signOut();
        setRedirectState({ error: "Membro sem empresa vinculada. Contacte o administrador." });
        setAuthorized(false);
        setChecking(false);
        return;
      }
      const empresa = await fetchEmpresaById(membro.empresa_id);
      if (!empresa || !empresa.ativo) {
        await supabase.auth.signOut();
        setRedirectState({ error: "Empresa inativa ou inexistente. Contacte o administrador." });
        setAuthorized(false);
        setChecking(false);
        return;
      }
      setUserType("member");
      setAuthorized(true);
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (isConvidado) {
    return <Navigate to="/convidado" replace />;
  }

  if (!authorized) {
    return (
      <Navigate
        to="/login"
        replace
        state={redirectState ? { memberLoginError: redirectState.error } : undefined}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberLayout;
