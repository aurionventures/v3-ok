import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import MemberSidebar from "@/components/MemberSidebar";
import { isMember, setUserType } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { fetchMembroByUserId } from "@/services/governance";

const MemberLayout = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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
      if (membro) {
        setUserType("member");
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
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

  if (!authorized) {
    return <Navigate to="/login" replace />;
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
