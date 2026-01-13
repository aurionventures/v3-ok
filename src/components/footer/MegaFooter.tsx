import { Link } from "react-router-dom";
import { 
  Calculator, 
  CalendarDays, 
  MessageSquare,
  Gem,
  SlidersHorizontal,
  Info,
  Users,
  MapPin,
  FileText
} from "lucide-react";
import { FooterColumn, FooterLinkGroup } from "./FooterColumn";
import { NewsletterForm } from "./NewsletterForm";
import { SocialIcons } from "./SocialIcons";
import legacyLogo from "@/assets/legacy-logo-new.png";

export function MegaFooter() {
  return (
    <footer className="bg-corporate-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* COLUNA 1: Logo + Social + Newsletter */}
          <div className="space-y-6">
            <div>
              <img 
                src={legacyLogo} 
                alt="Legacy OS" 
                className="h-8 w-auto brightness-0 invert"
              />
              <p className="text-sm text-slate-400 mt-2">Governança Corporativa</p>
            </div>

            <SocialIcons />

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Newsletter</h4>
              <p className="text-xs text-slate-400 mb-3">Receba insights sobre governança</p>
              <NewsletterForm />
            </div>

            {/* Endereço */}
            <div className="flex gap-3">
              <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <address className="text-xs text-slate-400 leading-relaxed not-italic">
                <p>Av. Brig. Faria Lima, 1811. ESC 1119</p>
                <p>Jardim Paulistano, São Paulo - SP</p>
                <p>CEP: 01452-001</p>
              </address>
            </div>

          </div>

          {/* COLUNA 2: Comece Agora + Planos + Empresa */}
          <FooterColumn title="Comece Agora">
            <FooterLinkGroup>
              <FooterLinkClickable href="/pricing#calculator" icon={Calculator}>Calcular Meu Preço</FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={CalendarDays}>Agendar Demonstração</FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={MessageSquare}>Falar com Especialista</FooterLinkClickable>
            </FooterLinkGroup>

            <FooterLinkGroup title="Planos">
              <FooterLinkClickable href="/pricing" icon={Gem}>Planos & Preços</FooterLinkClickable>
              <FooterLinkClickable href="/pricing#calculator" icon={SlidersHorizontal}>Calculadora Interativa</FooterLinkClickable>
            </FooterLinkGroup>

            <FooterLinkGroup title="Empresa">
              <FooterLinkClickable href="/sobre" icon={Info}>Sobre Nós</FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={Users}>Contato</FooterLinkClickable>
              <FooterLinkClickable href="/blog" icon={FileText}>Blog</FooterLinkClickable>
            </FooterLinkGroup>
          </FooterColumn>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/20" />

      {/* Bottom Bar - Copyright & Legal */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2025 - 2026 Legacy OS. Todos os direitos reservados.</p>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Links legais">
            <Link to="/politica-privacidade" className="hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <span className="hidden md:inline text-slate-700" aria-hidden="true">|</span>
            <Link to="/termos-uso" className="hover:text-accent transition-colors">
              Termos de Uso
            </Link>
            <span className="hidden md:inline text-slate-700" aria-hidden="true">|</span>
            <Link to="/lgpd" className="hover:text-accent transition-colors">
              LGPD
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para links clicáveis com ícones
interface FooterLinkClickableProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function FooterLinkClickable({ href, icon: Icon, children }: FooterLinkClickableProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-accent transition-all duration-200 hover:pl-1 leading-relaxed"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}

export default MegaFooter;
