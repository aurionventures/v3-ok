import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchPerfilSuperAdminByUserId, fetchPerfilEmpresaAdmByUserId } from "@/services/empresas";

export interface CurrentAdminProfile {
  nome: string;
  email: string;
  role: string;
  /** empresa_id do perfil (apenas para ADM de empresa) */
  empresaId: string | null;
  loading: boolean;
}

/**
 * Retorna o perfil do usuário logado (Super Admin ou ADM de empresa).
 * Usado no Sidebar e em Settings > Perfil.
 */
export function useCurrentAdminProfile(): CurrentAdminProfile {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase?.auth.getSession() ?? { data: { session: null } };
    if (!session?.user?.id) {
      setNome("");
      setEmail("");
      setRole("");
      setEmpresaId(null);
      setLoading(false);
      return;
    }

    const userEmail = session.user.email ?? "";

    if (isAdminRoute) {
      const perfil = await fetchPerfilSuperAdminByUserId(session.user.id);
      setEmpresaId(null);
      if (perfil) {
        setNome(perfil.nome ?? "Super Admin");
        setEmail(perfil.email ?? userEmail);
        setRole(perfil.role ?? "Super Admin");
      } else if (userEmail.toLowerCase() === "admin@legacy.com") {
        setNome("Super Admin");
        setEmail(userEmail);
        setRole("Super Admin");
      } else {
        setNome("Super Admin");
        setEmail(userEmail);
        setRole("Super Admin");
      }
    } else {
      const perfil = await fetchPerfilEmpresaAdmByUserId(session.user.id);
      if (perfil) {
        setNome(perfil.nome ?? "Administrador");
        setEmail(perfil.email ?? userEmail);
        setRole(perfil.role ?? "ADM Empresa");
        setEmpresaId(perfil.empresa_id ?? null);
      } else {
        setNome("Administrador");
        setEmail(userEmail);
        setRole("ADM Empresa");
        setEmpresaId(null);
      }
    }
    setLoading(false);
  }, [isAdminRoute]);

  useEffect(() => {
    load();
  }, [load]);

  return { nome, email, role, empresaId, loading };
}
