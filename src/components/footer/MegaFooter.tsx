import { Link } from "react-router-dom";
import { 
  Brain,
  Shield,
  ClipboardCheck,
  Home,
  Layers,
  Building,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Linkedin
} from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import legacyLogo from "@/assets/legacy-logo-new.png";

// Links do Menu
const MENU_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Plataforma", href: "/plataforma", icon: Layers },
  { label: "Empresa", href: "/sobre", icon: Building },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Contato", href: "/contato", icon: MessageSquare },
];

// Links dos Módulos
const MODULOS_LINKS = [
  { label: "AI Engine", href: "/ai-engine", icon: Brain },
  { label: "Governança", href: "/governanca", icon: Shield },
  { label: "Diagnóstico", href: "/standalone-quiz", icon: ClipboardCheck },
];

// Links de Políticas
const POLITICAS_LINKS = [
  { label: "Privacidade", href: "/politica-privacidade" },
  { label: "Termos de Uso", href: "/termos-uso" },
  { label: "LGPD", href: "/lgpd" },
];

export function MegaFooter() {
  return (
    <footer className="bg-corporate-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* COLUNA 1: Marca */}
          <div className="space-y-6">
            <div>
              <img 
                src={legacyLogo} 
                alt="Legacy OS" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistema Operacional de Governança Corporativa. Transformando a gestão empresarial com inteligência artificial e boas práticas de governança.
            </p>
            <SocialIcons />
          </div>

          {/* COLUNA 2: Menu */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Menu</h3>
            <nav className="space-y-3" aria-label="Links do menu">
              {MENU_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 hover:pl-1 group"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* COLUNA 3: Módulos + Políticas */}
          <div className="space-y-8">
            {/* Módulos */}
            <div>
              <h3 className="text-base font-semibold text-white mb-5">Módulos</h3>
              <nav className="space-y-3" aria-label="Links dos módulos">
                {MODULOS_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 hover:pl-1 group"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Políticas */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Políticas</h4>
              <nav className="space-y-2" aria-label="Links de políticas">
                {POLITICAS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-[13px] text-slate-500 hover:text-accent transition-all duration-200 hover:pl-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* COLUNA 4: Contato */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Contato</h3>
            <div className="space-y-4">
              {/* Email */}
              <a 
                href="mailto:contato@legacyos.com.br" 
                className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 group"
              >
                <Mail className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                <span>contato@legacyos.com.br</span>
              </a>

              {/* Telefone */}
              <a 
                href="tel:+551140028922" 
                className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 group"
              >
                <Phone className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                <span>+55 (11) 4002-8922</span>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/legacyos" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 group"
              >
                <Linkedin className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>

              {/* Endereço */}
              <div className="pt-3 mt-3 border-t border-border/20">
                <address className="text-xs text-slate-500 leading-relaxed not-italic">
                  <p>Av. Brig. Faria Lima, 1811</p>
                  <p>ESC 1119 - Jardim Paulistano</p>
                  <p>São Paulo - SP, 01452-001</p>
                </address>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Bottom Bar - Copyright */}
      <div className="container mx-auto px-6 py-6">
        <p className="text-sm text-slate-500 text-center">
          © 2025 Legacy OS. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default MegaFooter;
