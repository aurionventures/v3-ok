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
    <footer className="bg-[#0A1929] text-white">
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
              <MapPin className="h-4 w-4 text-[#C0A062] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <p>Av. Brig. Faria Lima, 1811. ESC 1119</p>
                <p>Jardim Paulistano, São Paulo - SP</p>
                <p>CEP: 01452-001</p>
              </div>
            </div>

          </div>

          {/* COLUNA 2: Comece Agora */}
          <FooterColumn title="Comece Agora">
            <FooterLinkGroup>
              <FooterLinkClickable href="/pricing#calculator" icon={Calculator}>Calcular Meu Preço</FooterLinkClickable>
              <FooterLinkClickable href="/demo" icon={CalendarDays}>Agendar Demonstração</FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={MessageSquare}>Falar com Especialista</FooterLinkClickable>
            </FooterLinkGroup>

            <FooterLinkGroup title="Planos">
              <FooterLinkClickable href="/pricing#planos" icon={Gem}>Planos & Preços</FooterLinkClickable>
              <FooterLinkClickable href="/pricing#calculator" icon={SlidersHorizontal}>Calculadora Interativa</FooterLinkClickable>
            </FooterLinkGroup>

            <FooterLinkGroup title="Empresa">
              <FooterLinkClickable href="/sobre" icon={Info}>Sobre Nós</FooterLinkClickable>
              <FooterLinkClickable href="/contato" icon={Users}>Contato</FooterLinkClickable>
            </FooterLinkGroup>
          </FooterColumn>

          {/* COLUNA 3: Plataforma */}
          <FooterColumn title="Plataforma">
            <FooterLinkGroup title="Ciclo de Reuniões">
              <FooterLink href="/plataforma/agenda-builder" indent>├─ Agenda Builder</FooterLink>
              <FooterLink href="/plataforma/pauta-inteligente" indent>├─ Pauta Inteligente</FooterLink>
              <FooterLink href="/plataforma/minutas" indent>├─ Minutas Automáticas</FooterLink>
              <FooterLink href="/plataforma/decisoes" indent>├─ Gestão Decisões</FooterLink>
              <FooterLink href="/plataforma/analytics" indent>└─ Analytics de Reuniões</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Sistema de Registro">
              <FooterLink href="/plataforma/dashboard" indent>├─ Dashboard Executivo</FooterLink>
              <FooterLink href="/plataforma/biblioteca" indent>├─ Biblioteca Documentos</FooterLink>
              <FooterLink href="/plataforma/assinaturas" indent>├─ Assinaturas Eletrônicas</FooterLink>
              <FooterLink href="/plataforma/files" indent>├─ Files & Anexos</FooterLink>
              <FooterLink href="/plataforma/messenger" indent>└─ Mensageiro Seguro</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Módulos Core">
              <FooterLink href="/plataforma/conselhos" indent>├─ Conselhos & Comitês</FooterLink>
              <FooterLink href="/plataforma/membros" indent>├─ Gestão de Membros</FooterLink>
              <FooterLink href="/plataforma/avaliacao" indent>├─ Avaliação Desempenho</FooterLink>
              <FooterLink href="/plataforma/compliance" indent>└─ Compliance & Auditoria</FooterLink>
            </FooterLinkGroup>
          </FooterColumn>

          {/* COLUNA 4: Governança Integrada */}
          <FooterColumn title="Governança Integrada">
            <FooterLinkGroup title="Engajamento Conselho">
              <FooterLink href="/governanca/aprovacoes" indent>├─ Aprovações & Votação</FooterLink>
              <FooterLink href="/governanca/assistente" indent>├─ Assistente Inteligente</FooterLink>
              <FooterLink href="/governanca/notas" indent>└─ Notas & Anotações</FooterLink>
            </FooterLinkGroup>

            <FooterLinkGroup title="Indústrias">
              <FooterLink href="/industrias/associacoes" indent>├─ Associações & ONGs</FooterLink>
              <FooterLink href="/industrias/financeiro" indent>├─ Serviços Financeiros</FooterLink>
              <FooterLink href="/industrias/governo" indent>├─ Governo & Público</FooterLink>
              <FooterLink href="/industrias/healthcare" indent>├─ Healthcare & Pharma</FooterLink>
              <FooterLink href="/industrias/educacao" indent>├─ Educação Superior</FooterLink>
              <FooterLink href="/industrias/tech" indent>├─ Tecnologia & Startups</FooterLink>
              <FooterLink href="/industrias/varejo" indent>├─ Varejo e Alimentos</FooterLink>
              <FooterLink href="/industrias/manufatura" indent>└─ Indústria de Manufatura</FooterLink>
            </FooterLinkGroup>
          </FooterColumn>

          {/* COLUNA 5: AI Engine - 14 Agentes */}
          <FooterColumn title="AI Engine">
            <FooterLinkGroup title="14 Agentes Inteligentes">
              <FooterLinkWithIcon href="/ai-engine/agentes-especializados" icon={Bot}>Agentes Especializados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/analise-documentos" icon={FileSearch}>Análise de Documentos</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/analise-sentimento" icon={Brain}>Análise de Sentimento</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/briefings" icon={FileText}>Briefings Personalizados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/busca-semantica" icon={Search}>Busca Inteligente (Semântica)</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/classificacao" icon={Target}>Classificação Automática</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/extracao-entidades" icon={Sparkles}>Extração de Entidades</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/geracao-atas" icon={MessageSquareText}>Geração de ATAs</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/geracao-pdi" icon={TrendingUp}>Geração de PDI</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/identificacao-gaps" icon={AlertTriangle}>Identificação de GAPs</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/insights-preditivos" icon={Lightbulb}>Insights Preditivos</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/inteligencia-mercado" icon={LineChart}>Inteligência de Mercado</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/ocr-extracao" icon={Zap}>OCR e Extração de Dados</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/ai-engine/sugestoes-pauta" icon={BarChart}>Sugestões de Pauta</FooterLinkWithIcon>
            </FooterLinkGroup>
          </FooterColumn>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700/50" />

      {/* Bottom Bar - Copyright & Legal */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2025 - 2026 Legacy OS. Todos os direitos reservados.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/privacidade" className="hover:text-[#C0A062] transition-colors">
              Política de Privacidade
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="/termos" className="hover:text-[#C0A062] transition-colors">
              Termos de Uso
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="/lgpd" className="hover:text-[#C0A062] transition-colors">
              LGPD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para links com ícones (não clicáveis, apenas visuais)
interface FooterLinkWithIconProps {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function FooterLinkWithIcon({ icon: Icon, children }: FooterLinkWithIconProps) {
  return (
    <span
      className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-[#C0A062] transition-all duration-200 hover:pl-1 leading-relaxed cursor-default"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </span>
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
    <a
      href={href}
      className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-[#C0A062] transition-all duration-200 hover:pl-1 leading-relaxed"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}

export default MegaFooter;
