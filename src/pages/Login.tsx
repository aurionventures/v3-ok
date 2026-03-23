import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Users2, FileText, Calendar, BarChart3, Leaf, Eye, EyeOff, Shield } from "lucide-react";
import { setUserType } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { fetchMembroByUserId } from "@/services/governance";
import {
  fetchEmpresaById,
  fetchPerfilEmpresaAdmByUserId,
} from "@/services/empresas";

type LoginView = "select" | "company" | "member" | "admin";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAdminLogin = searchParams.get("type") === "admin" || location.state?.userType === "admin";
  const [loginView, setLoginView] = useState<LoginView>(isAdminLogin ? "admin" : "select");

  useEffect(() => {
    const error = (location.state as { memberLoginError?: string })?.memberLoginError;
    if (error) {
      toast({ title: "Acesso negado", description: error, variant: "destructive" });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate, toast]);

  const handleLogin = async (userType: string) => {
    if (!email || !password) {
      toast({ title: "Erro de Login", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    if (userType === "member") {
      if (!supabase) {
        toast({ title: "Erro", description: "Supabase não configurado.", variant: "destructive" });
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) {
          toast({ title: "Erro de Login", description: error.message ?? "E-mail ou senha inválidos.", variant: "destructive" });
          return;
        }
        const userId = data?.user?.id;
        if (!userId) {
          toast({ title: "Erro de Login", description: "Credenciais inválidas.", variant: "destructive" });
          return;
        }
        const membro = await fetchMembroByUserId(userId);
        if (!membro) {
          await supabase.auth.signOut();
          toast({ title: "Erro de Login", description: "Nenhum membro vinculado a esta conta.", variant: "destructive" });
          return;
        }
        if (!membro.empresa_id) {
          await supabase.auth.signOut();
          toast({ title: "Erro de Login", description: "Membro sem empresa vinculada. Contacte o administrador.", variant: "destructive" });
          return;
        }
        const empresa = await fetchEmpresaById(membro.empresa_id);
        if (!empresa || !empresa.ativo) {
          await supabase.auth.signOut();
          toast({ title: "Erro de Login", description: "Empresa inativa ou inexistente. Contacte o administrador.", variant: "destructive" });
          return;
        }
        setUserType("member");
        toast({ title: "Login bem-sucedido", description: `Bem-vindo, ${membro.nome}.` });
        if (membro.senha_alterada) {
          navigate("/member/dashboard");
        } else {
          navigate("/member/alterar-senha");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (userType === "company") {
      if (!supabase) {
        toast({ title: "Erro", description: "Supabase não configurado.", variant: "destructive" });
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) {
          toast({ title: "Erro de Login", description: error.message ?? "E-mail ou senha inválidos.", variant: "destructive" });
          return;
        }
        const userId = data?.user?.id;
        if (!userId) {
          toast({ title: "Erro de Login", description: "Credenciais inválidas.", variant: "destructive" });
          return;
        }
        const perfil = await fetchPerfilEmpresaAdmByUserId(userId);
        if (!perfil) {
          await supabase.auth.signOut();
          toast({ title: "Erro de Login", description: "Nenhum perfil ADM de empresa vinculado a esta conta.", variant: "destructive" });
          return;
        }
        const empresa = await fetchEmpresaById(perfil.empresa_id);
        if (!empresa || !empresa.ativo) {
          await supabase.auth.signOut();
          toast({ title: "Erro de Login", description: "Empresa inativa ou inexistente. Contacte o administrador.", variant: "destructive" });
          return;
        }
        setUserType("company");
        toast({ title: "Login bem-sucedido", description: `Bem-vindo, ${perfil.nome ?? empresa.nome}.` });
        if (perfil.senha_alterada) {
          navigate("/dashboard");
        } else {
          navigate("/company/alterar-senha");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (userType === "admin") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const valid = email === "admin@legacy.com" && password === "123";
        if (!valid) {
          toast({ title: "Erro de Login", description: "Email ou senha inválidos.", variant: "destructive" });
          return;
        }
        setUserType("admin");
        toast({ title: "Login bem-sucedido", description: `Bem-vindo ao Legacy OS.` });
        navigate("/admin");
      }, 1000);
      return;
    }
  };

  // Right panel content based on view
  const rightPanelContent: Record<LoginView, { title: string; subtitle: string; cards: { icon: React.ReactNode; title: string; desc: string }[] }> = {
    select: {
      title: "Evolua a governança da sua empresa",
      subtitle: "Plataforma completa para organizar, documentar, operacionalizar e evoluir sua governança corporativa.",
      cards: [
        { icon: <Building2 className="h-5 w-5" />, title: "Estrutura Organizada", desc: "Conselhos, rituais e documentos em um só lugar" },
        { icon: <BarChart3 className="h-5 w-5" />, title: "Sucessão Planejada", desc: "Prepare sua empresa para as próximas gerações" },
        { icon: <Leaf className="h-5 w-5" />, title: "Diagnóstico Contínuo", desc: "Visualize a maturidade da sua governança" },
        { icon: <Calendar className="h-5 w-5" />, title: "ESG Integrado", desc: "Sustentabilidade na agenda da governança" },
      ],
    },
    company: {
      title: "Acesso Empresa",
      subtitle: "Gerencie a governança corporativa da sua organização com ferramentas inteligentes.",
      cards: [
        { icon: <Building2 className="h-5 w-5" />, title: "Dashboard Executivo", desc: "Métricas e indicadores de governança" },
        { icon: <FileText className="h-5 w-5" />, title: "Documentação Completa", desc: "Todos os documentos organizados" },
        { icon: <BarChart3 className="h-5 w-5" />, title: "Avaliação de Maturidade", desc: "Monitore a evolução da governança" },
        { icon: <Users2 className="h-5 w-5" />, title: "Gestão de Conselhos", desc: "Organize conselhos e comitês" },
      ],
    },
    member: {
      title: "Acesso Membro",
      subtitle: "Acesse o Portal de Membros e participe dos conselhos e órgãos de governança.",
      cards: [
        { icon: <Users2 className="h-5 w-5" />, title: "Portal de Membros", desc: "Acesse informações dos conselhos e órgãos" },
        { icon: <FileText className="h-5 w-5" />, title: "Documentos e Atas", desc: "Visualize documentos e atas das reuniões" },
        { icon: <Calendar className="h-5 w-5" />, title: "Agenda de Reuniões", desc: "Acompanhe a agenda e participe das reuniões" },
      ],
    },
    admin: {
      title: "Administrador Master",
      subtitle: "Acesso exclusivo para administradores da plataforma Legacy OS.",
      cards: [
        { icon: <Building2 className="h-5 w-5" />, title: "Gestão de Clientes", desc: "Gerencie todas as organizações" },
        { icon: <BarChart3 className="h-5 w-5" />, title: "Relatórios Globais", desc: "Visão geral da plataforma" },
      ],
    },
  };

  const panel = rightPanelContent[loginView];

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[hsl(210,33%,98%)]">
        <div className="w-full max-w-md">
          {/* Back link */}
          <button
            onClick={() => (loginView === "select" ? navigate("/") : setLoginView("select"))}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-lato"
          >
            <ArrowLeft className="h-4 w-4" />
            {loginView === "select" ? "Voltar à Home" : "Voltar"}
          </button>

          {loginView === "select" ? (
            /* Role Selection */
            <div>
              <p className="font-lato text-center text-muted-foreground mb-8">
                Escolha como deseja acessar
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setLoginView("company")}
                  className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-secondary/30 transition-all text-center group"
                >
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-primary group-hover:text-secondary transition-colors" />
                  <h3 className="font-montserrat text-lg font-bold text-foreground mb-1">Cliente</h3>
                  <p className="font-lato text-sm text-muted-foreground">Acesso para empresas e organizações</p>
                </button>

                <button
                  onClick={() => setLoginView("member")}
                  className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-secondary/30 transition-all text-center group"
                >
                  <Users2 className="h-10 w-10 mx-auto mb-3 text-green-600 group-hover:text-secondary transition-colors" />
                  <h3 className="font-montserrat text-lg font-bold text-foreground mb-1">Membro</h3>
                  <p className="font-lato text-sm text-muted-foreground">Acesso para membros de conselhos e órgãos</p>
                </button>

                <button
                  onClick={() => setLoginView("admin")}
                  className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-secondary/30 transition-all text-center group"
                >
                  <Shield className="h-10 w-10 mx-auto mb-3 text-green-600 group-hover:text-secondary transition-colors" />
                  <h3 className="font-montserrat text-lg font-bold text-foreground mb-1">Admin Master</h3>
                  <p className="font-lato text-sm text-muted-foreground">Acesso para administradores da plataforma</p>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                {loginView === "company" && <Building2 className="h-6 w-6 text-primary" />}
                {loginView === "member" && <Users2 className="h-6 w-6 text-green-600" />}
                {loginView === "admin" && <Shield className="h-6 w-6 text-green-600" />}
                <h2 className="font-montserrat text-xl font-bold text-foreground">
                  {loginView === "company" ? "Cliente" : loginView === "member" ? "Membro" : "Admin Master"}
                </h2>
              </div>
              <p className="font-lato text-sm text-muted-foreground mb-6">
                {loginView === "company"
                  ? "Entre com suas credenciais de empresa"
                  : loginView === "member"
                  ? "Entre com suas credenciais de membro"
                  : "Entre com suas credenciais de administrador"}
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="font-lato text-sm font-medium text-foreground">Email</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-lato text-sm font-medium text-foreground">Senha</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 font-montserrat"
                    onClick={() => setLoginView("select")}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-montserrat"
                    disabled={isLoading}
                    onClick={() => handleLogin(loginView)}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <a href="#" className="font-lato text-sm text-muted-foreground hover:text-secondary transition-colors">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:flex lg:w-1/2 relative legacy-gradient items-center justify-center p-12">
        {/* Purple gradient overlay for member view */}
        {loginView === "member" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B263B] to-[#553C9A]/60" />
        )}
        <div className="relative z-10 max-w-lg w-full text-white">
          <h2 className="font-montserrat text-3xl font-bold mb-4">{panel.title}</h2>
          <p className="font-lato text-lg text-white/80 mb-10">{panel.subtitle}</p>

          <div className={`grid gap-4 ${panel.cards.length === 4 ? "grid-cols-2" : "grid-cols-1"}`}>
            {panel.cards.map((card, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/80">{card.icon}</span>
                  <h3 className="font-montserrat font-semibold text-sm">{card.title}</h3>
                </div>
                <p className="font-lato text-sm text-white/60">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
