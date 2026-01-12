import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Lock,
  // Plataforma
  Calendar,
  FileText,
  ClipboardList,
  BarChart3,
  LayoutDashboard,
  FolderOpen,
  PenTool,
  Files,
  MessageSquare,
  Users,
  UserCheck,
  Award,
  ShieldCheck,
  // Governança
  CheckCircle2,
  Bot,
  StickyNote,
  Medal,
  Shield,
  Link2,
  Plug,
  Building,
  Landmark,
  Heart,
  GraduationCap,
  Cpu,
  ShoppingCart,
  Factory,
  // AI Engine
  Search,
  TrendingUp,
  Target,
  Sparkles,
  Lightbulb,
  Zap,
  FileSearch,
  Bell,
  Brain,
  RefreshCw,
  LineChart,
  AlertTriangle,
  Leaf,
  FolderKanban,
  UserCog,
  Globe,
  Puzzle,
  // Recursos
  BookOpen,
  HelpCircle,
  Library,
  Video,
  Mic,
  Calculator,
  CalendarDays,
  Phone,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import legacyLogo from "@/assets/legacy-logo-new.png";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MegaMenu {
  id: string;
  label: string;
  sections: MenuSection[];
  highlight?: boolean;
}

// Menu data
const MEGA_MENUS: MegaMenu[] = [
  {
    id: "plataforma",
    label: "Plataforma",
    sections: [
      {
        title: "Ciclo de Reuniões",
        items: [
          { label: "Agenda Builder", href: "/plataforma/agenda-builder", icon: Calendar },
          { label: "Pauta Inteligente", href: "/plataforma/pauta-inteligente", icon: FileText },
          { label: "Minutas Automáticas", href: "/plataforma/minutas", icon: ClipboardList },
          { label: "Gestão Decisões", href: "/plataforma/decisoes", icon: CheckCircle2 },
          { label: "Analytics de Reuniões", href: "/plataforma/analytics", icon: BarChart3 },
        ]
      },
      {
        title: "Sistema de Registro",
        items: [
          { label: "Dashboard Executivo", href: "/plataforma/dashboard", icon: LayoutDashboard },
          { label: "Biblioteca Documentos", href: "/plataforma/biblioteca", icon: FolderOpen },
          { label: "Assinaturas Eletrônicas", href: "/plataforma/assinaturas", icon: PenTool },
          { label: "Files & Anexos", href: "/plataforma/files", icon: Files },
          { label: "Mensageiro Seguro", href: "/plataforma/messenger", icon: MessageSquare },
        ]
      },
      {
        title: "Módulos Core",
        items: [
          { label: "Conselhos & Comitês", href: "/plataforma/conselhos", icon: Users },
          { label: "Gestão de Membros", href: "/plataforma/membros", icon: UserCheck },
          { label: "Avaliação Desempenho", href: "/plataforma/avaliacao", icon: Award },
          { label: "Compliance & Auditoria", href: "/plataforma/compliance", icon: ShieldCheck },
        ]
      }
    ]
  },
  {
    id: "governanca",
    label: "Governança",
    sections: [
      {
        title: "Engajamento Conselho",
        items: [
          { label: "Aprovações & Votação", href: "/governanca/aprovacoes", icon: CheckCircle2 },
          { label: "Assistente Inteligente", href: "/governanca/assistente", icon: Bot },
          { label: "Notas & Anotações", href: "/governanca/notas", icon: StickyNote },
        ]
      },
      {
        title: "Segurança & Compliance",
        items: [
          { label: "Certificações (SOC2, ISO)", href: "/seguranca/certificacoes", icon: Medal },
          { label: "Segurança Plataforma", href: "/seguranca/plataforma", icon: Shield },
          { label: "Integrações Enterprise", href: "/seguranca/integracoes", icon: Link2 },
          { label: "API & Webhooks", href: "/api", icon: Plug },
        ]
      },
      {
        title: "Por Indústria",
        items: [
          { label: "Associações & ONGs", href: "/industrias/associacoes", icon: Building },
          { label: "Serviços Financeiros", href: "/industrias/financeiro", icon: Landmark },
          { label: "Governo & Público", href: "/industrias/governo", icon: Landmark },
          { label: "Healthcare & Pharma", href: "/industrias/healthcare", icon: Heart },
          { label: "Educação Superior", href: "/industrias/educacao", icon: GraduationCap },
          { label: "Tecnologia & Startups", href: "/industrias/tech", icon: Cpu },
          { label: "Varejo e Alimentos", href: "/industrias/varejo", icon: ShoppingCart },
          { label: "Indústria de Manufatura", href: "/industrias/manufatura", icon: Factory },
        ]
      }
    ]
  },
  {
    id: "ai-engine",
    label: "AI Engine",
    highlight: true,
    sections: [
      {
        title: "14 Agentes Inteligentes",
        items: [
          { label: "Agentes Especializados", href: "#", icon: Bot },
          { label: "Análise de Documentos", href: "#", icon: FileSearch },
          { label: "Análise de Sentimento", href: "#", icon: Brain },
          { label: "Briefings Personalizados", href: "#", icon: FileText },
          { label: "Busca Inteligente (Semântica)", href: "#", icon: Search },
          { label: "Classificação Automática", href: "#", icon: Target },
          { label: "Extração de Entidades", href: "#", icon: Sparkles },
        ]
      },
      {
        title: "",
        items: [
          { label: "Geração de ATAs", href: "#", icon: FileText },
          { label: "Geração de PDI", href: "#", icon: TrendingUp },
          { label: "Identificação de GAPs", href: "#", icon: AlertTriangle },
          { label: "Insights Preditivos", href: "#", icon: Lightbulb },
          { label: "Inteligência de Mercado", href: "#", icon: LineChart },
          { label: "OCR e Extração de Dados", href: "#", icon: Zap },
          { label: "Sugestões de Pauta", href: "#", icon: RefreshCw },
        ]
      }
    ]
  },
  {
    id: "recursos",
    label: "Recursos",
    sections: [
      {
        title: "Conteúdo",
        items: [
          { label: "Blog Legacy", href: "/blog", icon: BookOpen },
          { label: "Glossário Governança", href: "/glossario", icon: HelpCircle },
          { label: "Base Conhecimento", href: "/base-conhecimento", icon: Library },
          { label: "Webinars & Eventos", href: "/webinars", icon: Mic },
        ]
      },
      {
        title: "Comece Aqui",
        items: [
          { label: "Calcular Meu Preço", href: "/pricing", icon: Calculator },
          { label: "Agendar Demonstração", href: "/demo", icon: CalendarDays },
          { label: "Falar com Especialista", href: "/contato", icon: Phone },
        ]
      }
    ]
  }
];

export function MegaMenuHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mega-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMobileMenu = (menuId: string) => {
    setExpandedMobileMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 mega-menu-container",
      isScrolled ? "shadow-lg" : ""
    )}>
      {/* Top Bar - Secondary Nav */}
      <div className={cn(
        "bg-[#0A1929] transition-all duration-300",
        isScrolled ? "h-0 overflow-hidden opacity-0" : "h-10 opacity-100"
      )}>
        <div className="container mx-auto px-6 h-full flex items-center justify-end">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/sobre" className="text-[13px] text-slate-400 hover:text-[#C0A062] transition-colors">
              Empresa
            </a>
            <a href="/contato" className="text-[13px] text-slate-400 hover:text-[#C0A062] transition-colors">
              Contato
            </a>
            <a href="/blog" className="text-[13px] text-slate-400 hover:text-[#C0A062] transition-colors">
              Blog
            </a>
          </nav>
        </div>
      </div>

      {/* Main Nav */}
      <div className={cn(
        "bg-[#1A202C] border-b border-slate-700/50 transition-all duration-300",
        isScrolled ? "py-2" : "py-3"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <img 
              src={legacyLogo} 
              alt="Legacy OS" 
              className={cn(
                "w-auto cursor-pointer transition-all duration-300",
                isScrolled ? "h-8" : "h-10"
              )}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-12">
            {MEGA_MENUS.map((menu) => (
              <div 
                key={menu.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(menu.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    "text-slate-300 hover:text-white hover:bg-white/5",
                    activeMenu === menu.id && "bg-white/5 text-white"
                  )}
                >
                  {menu.highlight && <Bot className="h-4 w-4 mr-1 text-[#C0A062]" />}
                  {menu.label}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    activeMenu === menu.id && "rotate-180"
                  )} />
                </button>

                {/* Mega Dropdown - Non-clickable menu items */}
                {activeMenu === menu.id && (
                  <div 
                    className={cn(
                      "absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden",
                      "animate-in fade-in-0 zoom-in-95 duration-200",
                      menu.id === "ai-engine" ? "w-[500px]" : (menu.sections.length > 2 ? "w-[700px]" : "w-[450px]"),
                      menu.highlight && "border-[#C0A062]/30"
                    )}
                  >
                    <div className={cn(
                      "grid gap-6 p-6",
                      menu.id === "ai-engine" ? "grid-cols-2" : (
                        menu.sections.length === 2 ? "grid-cols-2" :
                        menu.sections.length === 3 ? "grid-cols-3" : "grid-cols-3"
                      )
                    )}>
                      {menu.sections.map((section, idx) => (
                        <div key={idx}>
                          {section.title && (
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                              {section.title}
                            </h4>
                          )}
                          <ul className="space-y-1">
                            {section.items.map((item, itemIdx) => {
                              const Icon = item.icon;
                              return (
                                <li key={itemIdx}>
                                  <span
                                    className="flex items-start gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-default"
                                  >
                                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-[#C0A062] mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 group-hover:text-slate-900">
                                      {item.label}
                                    </span>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Planos - Direct Link */}
            <a
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={(e) => { e.preventDefault(); navigate("/pricing"); }}
            >
              Planos
            </a>
          </nav>

          {/* CTA Button - Login Only */}
          <div className="hidden lg:flex items-center">
            <Button 
              size="sm"
              className="bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1929] font-semibold"
              onClick={() => navigate("/login")}
            >
              <Lock className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              size="sm"
              className="bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1929] font-semibold"
              onClick={() => navigate("/pricing")}
            >
              Planos
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-[#0A1929] z-50 lg:hidden overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <img src={legacyLogo} alt="Legacy OS" className="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {MEGA_MENUS.map((menu) => (
                <div key={menu.id}>
                  <button
                    onClick={() => toggleMobileMenu(menu.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors",
                      menu.highlight 
                        ? "text-[#C0A062] hover:bg-[#C0A062]/10" 
                        : "text-white hover:bg-white/5"
                    )}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {menu.highlight && <Bot className="h-4 w-4" />}
                      {menu.label}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      expandedMobileMenus.includes(menu.id) && "rotate-180"
                    )} />
                  </button>

                  {expandedMobileMenus.includes(menu.id) && (
                    <div className="mt-2 ml-4 space-y-4 pb-4 animate-in fade-in-0 duration-200">
                      {menu.sections.map((section, idx) => (
                        <div key={idx}>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            {section.title}
                          </h4>
                          <ul className="space-y-1">
                            {section.items.map((item, itemIdx) => {
                              const Icon = item.icon;
                              return (
                                <li key={itemIdx}>
                                  <a
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={(e) => { 
                                      e.preventDefault(); 
                                      navigate(item.href);
                                      setIsMobileMenuOpen(false);
                                    }}
                                  >
                                    <Icon className="h-4 w-4 text-slate-500" />
                                    {item.label}
                                    {item.badge && (
                                      <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded ml-auto">
                                        {item.badge}
                                      </span>
                                    )}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Direct Link - Planos */}
              <a
                href="/pricing"
                className="block px-3 py-3 text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                onClick={(e) => { e.preventDefault(); navigate("/pricing"); setIsMobileMenuOpen(false); }}
              >
                Planos
              </a>

              {/* Divider */}
              <div className="border-t border-slate-700 my-4" />

              {/* Secondary Links */}
              <a
                href="/sobre"
                className="block px-3 py-2 text-slate-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); navigate("/sobre"); setIsMobileMenuOpen(false); }}
              >
                Empresa
              </a>
              <a
                href="/contato"
                className="block px-3 py-2 text-slate-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); navigate("/contato"); setIsMobileMenuOpen(false); }}
              >
                Contato
              </a>
              <a
                href="/blog"
                className="block px-3 py-2 text-slate-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); navigate("/blog"); setIsMobileMenuOpen(false); }}
              >
                Blog
              </a>
              <a
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); navigate("/login"); setIsMobileMenuOpen(false); }}
              >
                <Lock className="h-4 w-4" />
                Entrar
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

export default MegaMenuHeader;
