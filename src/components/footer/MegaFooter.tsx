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
  FileText,
  Home,
  Layers,
  Shield,
  Brain,
  Building,
  ShieldCheck
} from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import legacyLogo from "@/assets/legacy-logo-new.png";

export function MegaFooter() {
  return (
    <footer className="bg-corporate-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* COLUNA 1: Logo + Social */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <img 
                src={legacyLogo} 
                alt="Legacy OS" 
                className="h-8 w-auto brightness-0 invert"
              />
              <p className="text-sm text-slate-400 mt-2">Governança Corporativa</p>
            </div>

            <SocialIcons />
          </div>

          {/* COLUNA 2: Comece Agora */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Comece Agora</h3>
            <div className="space-y-2.5">
              <FooterLinkClickable href="/pricing#calculator" icon={Calculator}>
                Calcular Meu Preço
              </FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={CalendarDays}>
                Agendar Demonstração
              </FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={MessageSquare}>
                Falar com Especialista
              </FooterLinkClickable>
            </div>
          </div>

          {/* COLUNA 3: Legacy OS */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Legacy OS</h3>
            <div className="space-y-2.5">
              <FooterLinkClickable href="/" icon={Home}>
                Home
              </FooterLinkClickable>
              <FooterLinkClickable href="/plataforma" icon={Layers}>
                Plataforma
              </FooterLinkClickable>
              <FooterLinkClickable href="/governanca" icon={Shield}>
                Governança
              </FooterLinkClickable>
              <FooterLinkClickable href="/ai-engine" icon={Brain}>
                AI Engine
              </FooterLinkClickable>
            </div>
          </div>

          {/* COLUNA 4: Planos */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Planos</h3>
            <div className="space-y-2.5">
              <FooterLinkClickable href="/pricing" icon={Gem}>
                Planos & Preços
              </FooterLinkClickable>
              <FooterLinkClickable href="/pricing#calculator" icon={SlidersHorizontal}>
                Calculadora Interativa
              </FooterLinkClickable>
            </div>
          </div>

          {/* COLUNA 5: Empresa */}
          <div>
            <h3 className="text-base font-semibold text-white mb-5">Empresa</h3>
            <div className="space-y-2.5">
              <FooterLinkClickable href="/sobre" icon={Info}>
                Sobre Nós
              </FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={Users}>
                Contato
              </FooterLinkClickable>
              <FooterLinkClickable href="/blog" icon={FileText}>
                Blog
              </FooterLinkClickable>
              
              {/* Office - Endereço */}
              <div className="pt-3">
                <div className="flex items-start gap-2">
                  <Building className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-[13px] text-slate-400">Office</span>
                    <address className="text-xs text-slate-500 leading-relaxed not-italic mt-1">
                      <p>Av. Brig. Faria Lima, 1811</p>
                      <p>ESC 1119 - Jardim Paulistano</p>
                      <p>São Paulo - SP, 01452-001</p>
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="text-base font-semibold">Trust</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Links de confiança">
            <Link to="/politica-privacidade" className="text-[13px] text-slate-400 hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <span className="text-slate-700" aria-hidden="true">•</span>
            <Link to="/termos-uso" className="text-[13px] text-slate-400 hover:text-accent transition-colors">
              Termos de Uso
            </Link>
            <span className="text-slate-700" aria-hidden="true">•</span>
            <Link to="/lgpd" className="text-[13px] text-slate-400 hover:text-accent transition-colors">
              LGPD
            </Link>
          </nav>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/20" />

      {/* Bottom Bar - Copyright */}
      <div className="container mx-auto px-6 py-6">
        <p className="text-sm text-slate-500 text-center">
          © 2025 - 2026 Legacy OS. Todos os direitos reservados.
        </p>
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
