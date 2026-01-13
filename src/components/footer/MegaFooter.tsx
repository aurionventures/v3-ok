import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Calculator, 
  CalendarDays, 
  MessageSquare,
  Gem,
  SlidersHorizontal,
  BarChart3,
  Gift,
  Bot,
  Brain,
  FileSearch,
  Target,
  Sparkles,
  TrendingUp,
  BarChart,
  Search,
  MessageSquareText,
  Lightbulb,
  AlertTriangle,
  FileText,
  Zap,
  LineChart,
  Info,
  Users,
  MapPin
} from "lucide-react";
import { FooterColumn, FooterLinkGroup, FooterLink } from "./FooterColumn";
import { NewsletterForm } from "./NewsletterForm";
import { SocialIcons } from "./SocialIcons";
import legacyLogo from "@/assets/legacy-logo-new.png";

export function MegaFooter() {
  return (
    <footer className="bg-corporate-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* COLUNA 1: Logo + Social + Newsletter */}
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

          {/* COLUNA 2: Comece Agora */}
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

          {/* COLUNA 3: Plataforma */}
          <FooterColumn title="Plataforma">
            <FooterLinkGroup title="Ciclo de Reuniões">
              <FooterLink href="/plataforma" indent>├─ Agenda Builder</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Pauta Inteligente</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Minutas Automáticas</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Gestão Decisões</FooterLink>
              <FooterLink href="/plataforma" indent>└─ Analytics de Reuniões</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Sistema de Registro">
              <FooterLink href="/plataforma" indent>├─ Dashboard Executivo</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Biblioteca Documentos</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Assinaturas Eletrônicas</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Files & Anexos</FooterLink>
              <FooterLink href="/plataforma" indent>└─ Mensageiro Seguro</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Módulos Core">
              <FooterLink href="/plataforma" indent>├─ Conselhos & Comitês</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Gestão de Membros</FooterLink>
              <FooterLink href="/plataforma" indent>├─ Avaliação Desempenho</FooterLink>
              <FooterLink href="/plataforma" indent>└─ Compliance & Auditoria</FooterLink>
            </FooterLinkGroup>
          </FooterColumn>

          {/* COLUNA 4: Governança Integrada */}
          <FooterColumn title="Governança Integrada">
            <FooterLinkGroup title="Engajamento Conselho">
              <FooterLink href="/governanca" indent>├─ Aprovações & Votação</FooterLink>
              <FooterLink href="/governanca" indent>├─ Assistente Inteligente</FooterLink>
              <FooterLink href="/governanca" indent>└─ Notas & Anotações</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Indústrias">
              <FooterLink href="/governanca" indent>├─ Associações & ONGs</FooterLink>
              <FooterLink href="/governanca" indent>├─ Serviços Financeiros</FooterLink>
              <FooterLink href="/governanca" indent>├─ Governo & Público</FooterLink>
              <FooterLink href="/governanca" indent>├─ Healthcare & Pharma</FooterLink>
              <FooterLink href="/governanca" indent>├─ Educação Superior</FooterLink>
              <FooterLink href="/governanca" indent>├─ Tecnologia & Startups</FooterLink>
              <FooterLink href="/governanca" indent>├─ Varejo e Alimentos</FooterLink>
              <FooterLink href="/governanca" indent>└─ Indústria de Manufatura</FooterLink>
            </FooterLinkGroup>
          </FooterColumn>

          {/* COLUNA 5: AI Engine - 14 Agentes */}
          <FooterColumn title="AI Engine">
            <FooterLinkGroup title="14 Agentes Inteligentes">
              <FooterLinkWithIcon href="/ai-engine" icon={Bot}>Agentes Especializados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={FileSearch}>Análise de Documentos</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Brain}>Análise de Sentimento</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={FileText}>Briefings Personalizados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Search}>Busca Inteligente (Semântica)</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Target}>Classificação Automática</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Sparkles}>Extração de Entidades</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={MessageSquareText}>Geração de ATAs</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={TrendingUp}>Geração de PDI</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={AlertTriangle}>Identificação de GAPs</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Lightbulb}>Insights Preditivos</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={LineChart}>Inteligência de Mercado</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={Zap}>OCR e Extração de Dados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine" icon={BarChart}>Sugestões de Pauta</FooterLinkWithIcon>
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

// Componente auxiliar para links com ícones clicáveis
interface FooterLinkWithIconProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function FooterLinkWithIcon({ href, icon: Icon, children }: FooterLinkWithIconProps) {
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
