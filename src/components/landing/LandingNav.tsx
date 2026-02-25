import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, Brain, ChevronDown, Shield, ClipboardCheck } from "lucide-react";

interface LandingNavProps {
  activeLink?: "plataforma" | "diferenciais" | "planos" | "modulos";
}

const MODULOS_DIAGNOSTICO_PATH = "/modulos/ai-engine/governanca/diagnostico";
const MODULOS_GOVERNANCA_PATH = "/modulos/governanca";

const LandingNav = ({ activeLink }: LandingNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPlanosPage = location.pathname === "/planos";
  const isPlanosActive = activeLink === "planos" || isPlanosPage;
  const isModulosActive = activeLink === "modulos" || location.pathname.startsWith("/modulos");
  const isGovernancaPage = location.pathname === MODULOS_GOVERNANCA_PATH;

  const navLinks = [
    { href: "/", anchor: "#como-funciona", label: "Plataforma", active: activeLink === "plataforma" },
    { href: "/", anchor: "#diferenciais", label: "Diferenciais", active: activeLink === "diferenciais" },
    { href: "/planos", label: "Planos", active: isPlanosActive, isRoute: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex items-center px-6 py-4">
        <div className="flex-1 flex items-center min-w-0">
          <Link to="/">
            <img
              src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png"
              alt="Legacy OS"
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center shrink-0">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "text-sm transition-colors font-lato",
                    link.active ? "text-white bg-legacy-gold px-3 py-1.5 rounded" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.anchor ? link.href + link.anchor : link.href}
                  className={cn(
                    "text-sm transition-colors font-lato",
                    link.active ? "text-white bg-legacy-gold/20 px-3 py-1.5 rounded" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              )
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 text-sm transition-colors font-lato outline-none",
                  isModulosActive ? "text-legacy-gold" : "text-white/70 hover:text-white"
                )}
              >
                <Bot className="h-4 w-4" />
                Módulos
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-[#0E254E] border-white/10">
                <DropdownMenuItem
                  className="text-legacy-gold focus:bg-white/10 focus:text-legacy-gold cursor-pointer"
                  onSelect={() => navigate(MODULOS_DIAGNOSTICO_PATH)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Engine
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={isGovernancaPage ? "text-legacy-gold focus:bg-white/10 focus:text-legacy-gold cursor-pointer" : "text-white focus:bg-white/10 cursor-pointer"}
                  onSelect={() => navigate(MODULOS_GOVERNANCA_PATH)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Governança
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white focus:bg-white/10 cursor-pointer"
                  onSelect={() => navigate(MODULOS_DIAGNOSTICO_PATH)}
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Diagnóstico
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>
        <div className="flex-1 flex justify-end min-w-0">
          <Button
            className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold text-sm px-5 py-2"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
