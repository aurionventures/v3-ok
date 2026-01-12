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
  Users
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

            <div className="space-y-2 text-sm">
              <a 
                href="mailto:contato@governancalegacy.com.br" 
                className="flex items-center gap-2 text-slate-400 hover:text-[#C0A062] transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>contato@governancalegacy.com.br</span>
              </a>
              <a 
                href="tel:+551130404050" 
                className="flex items-center gap-2 text-slate-400 hover:text-[#C0A062] transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+55 11 3040-4050</span>
              </a>
              <a 
                href="https://wa.me/5547991622220" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-[#C0A062] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Empresa */}
            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-xs font-semibold text-[#C0A062] uppercase tracking-wider mb-3">Empresa</h4>
              <div className="space-y-1.5">
                <a href="/sobre" className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-[#C0A062] transition-all duration-200 hover:pl-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>Sobre Nós</span>
                </a>
                <a href="/contato" className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-[#C0A062] transition-all duration-200 hover:pl-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Contato</span>
                </a>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Comece Agora */}
          <FooterColumn title="Comece Agora">
            <FooterLinkGroup>
              <FooterLinkWithIcon href="/pricing" icon={Calculator}>Calcular Meu Preço</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/demo" icon={CalendarDays}>Agendar Demonstração</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/contato" icon={MessageSquare}>Falar com Especialista</FooterLinkWithIcon>
            </FooterLinkGroup>

            <FooterLinkGroup title="Pricing">
              <FooterLinkWithIcon href="/pricing" icon={Gem}>Planos & Preços</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/pricing#calculator" icon={SlidersHorizontal}>Calculadora Interativa</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/pricing/comparacao" icon={BarChart3}>Comparar com OnBoard</FooterLinkWithIcon>
              <FooterLinkWithIcon href="/pricing/promocoes" icon={Gift}>Promoções Ativas</FooterLinkWithIcon>
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
          <FooterColumn title="AI Engine" highlight>
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
          <p>© 2026 Legacy OS. Todos os direitos reservados.</p>
          
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
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="/trust" className="hover:text-[#C0A062] transition-colors">
              Trust Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para links com ícones
interface FooterLinkWithIconProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function FooterLinkWithIcon({ href, icon: Icon, children }: FooterLinkWithIconProps) {
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
