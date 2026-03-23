import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Calendar,
  FileText,
  ClipboardList,
  Award,
  Settings,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearUserType } from "@/lib/auth";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";

const MEMBER_MENU = [
  { href: "/member/dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/member/maturidade", name: "Maturidade", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/member/riscos", name: "Riscos", icon: <AlertTriangle className="h-5 w-5" /> },
  { href: "/member/reunioes", name: "Próximas Reuniões", icon: <Calendar className="h-5 w-5" /> },
  { href: "/member/pautas", name: "Pautas Virtuais", icon: <FileText className="h-5 w-5" /> },
  { href: "/member/atas-pendentes", name: "ATAs Pendentes", icon: <FileText className="h-5 w-5" /> },
  { href: "/member/pendencias", name: "Tarefas Pendentes", icon: <ClipboardList className="h-5 w-5" /> },
  { href: "/member/desempenho", name: "Meu Desempenho", icon: <Award className="h-5 w-5" /> },
];

const MemberSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: membro } = useCurrentMembro();

  const nomeMembro = membro?.nome?.trim() || "Membro";
  const iniciaisMembro = nomeMembro
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("") || "M";

  const handleLogout = () => {
    clearUserType();
    toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso" });
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-64 sm:w-64 md:w-72 bg-legacy-500 h-screen border-r border-legacy-600 shrink-0">
      <div className="p-4 border-b border-legacy-600 text-white">
        <Link to="/member/dashboard" className="flex flex-col gap-1 min-w-0">
          <img
            src="/lovable-uploads/nova-logo-branca.png"
            alt="Legacy OS"
            className="h-8 w-auto max-w-[160px] object-contain"
          />
          <span className="text-xs font-medium text-white/90">Portal do Membro</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-3">
        <div className="space-y-1">
          {MEMBER_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-legacy-gold text-legacy-500" : "text-white hover:bg-legacy-600"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-legacy-600 px-3 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-legacy-600 flex items-center justify-center text-white text-sm font-medium">
            {iniciaisMembro}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{nomeMembro}</p>
            <p className="text-xs text-white/80">Membro</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to="/member/settings"
            className="rounded-md p-2 text-white hover:bg-legacy-600 transition-colors"
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md p-2 text-white hover:bg-legacy-600 transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MemberSidebar;
