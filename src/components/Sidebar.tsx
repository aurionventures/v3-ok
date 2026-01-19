import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard, 
  Leaf, 
  Settings, 
  Shield, 
  Users, 
  BookOpen, 
  Layers, 
  Building2, 
  Send, 
  TrendingUp,
  Handshake,
  DollarSign,
  Link as LinkIcon,
  Award,
  Target,
  Zap,
  Bot,
  Cpu,
  Gift,
  Lock,
  Calculator,
  FileSignature,
  Receipt,
  ScrollText,
  LogOut,
  Brain,
  PieChart,
  CheckCircle,
  ActivitySquare,
  Briefcase,
  ClipboardList,
  MessageSquare,
  GraduationCap,
  Share2,
  Filter,
  Ticket,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@/assets/legacy-logo-new.png";

// Base sections structure
const BASE_SECTIONS = [
  {
    key: "inicio",
    label: "INÍCIO",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { key: "ai_copilot", label: "Copiloto de IA", path: "/copiloto-governanca", icon: Brain },
    ]
  },
  {
    key: "parametrizacao",
    label: "PARAMETRIZAÇÃO",
    items: [
      { key: "structure", label: "Estrutura Societária", path: "/shareholder-structure", icon: Users },
      { key: "cap_table", label: "Cap Table", path: "/cap-table", icon: PieChart },
      { key: "gov_maturity", label: "Maturidade de Governança", path: "/maturity", icon: CheckCircle },
    ]
  },
  {
    key: "preparacao",
    label: "PREPARAÇÃO",
    items: [
      { key: "checklist", label: "Checklist", path: "/document-checklist", icon: FileText },
      { key: "interviews", label: "Entrevistas", path: "/interviews", icon: ActivitySquare },
      { key: "analysis_actions", label: "Análise e Ações", path: "/initial-report", icon: BarChart3 },
    ]
  },
  {
    key: "estruturacao",
    label: "ESTRUTURAÇÃO",
    items: [
      { key: "gov_config", label: "Config. Governança", path: "/governance-config", icon: Settings },
      { key: "annual_agenda", label: "Agenda Anual", path: "/annual-agenda", icon: Calendar },
      { key: "secretariat", label: "Secretariado", path: "/secretariat", icon: Briefcase },
    ]
  }
];

// Add-ons flat list
const ADDON_ITEMS = [
  { key: "project_submission", label: "Submeter Projetos", path: "/submit-projects", icon: Send },
  { key: "leadership_performance", label: "Desenvolvimento e PDI", path: "/people-management", icon: Users },
  { key: "board_performance", label: "Desempenho do Conselho", path: "/board-performance", icon: Award },
  { key: "risks", label: "Riscos", path: "/governance-risk-management", icon: Shield },
  { key: "esg_maturity", label: "Maturidade ESG", path: "/esg", icon: Leaf },
  { key: "market_intel", label: "Inteligência de Mercado", path: "/market-intelligence", icon: TrendingUp },
  { key: "benchmarking", label: "Benchmarking Global", path: "/benchmarking", icon: Target },
  { key: "ai_agents", label: "Agentes de IA", path: "/ai-agents", icon: Bot },
  { key: "scenario_simulator", label: "Simulador de Cenários", path: "/simulador-cenarios", icon: Calculator },
];

// Admin menu items organized by sections (PLG/Hyper-automation structure)
const ADMIN_MENU_SECTIONS = [
  {
    label: "Visão Geral",
    items: [
      { icon: LayoutDashboard, href: "/admin", name: "Dashboard" },
    ]
  },
  {
    label: "Aquisição PLG",
    items: [
      { icon: Target, href: "/admin/plg-funnel", name: "Funil PLG" },
      { icon: TrendingUp, href: "/admin/vendas", name: "Vendas" },
    ]
  },
  {
    label: "Parceiros & Afiliados",
    items: [
      { icon: Handshake, href: "/admin/parceiros", name: "Cadastro de Parceiros" },
      { icon: DollarSign, href: "/admin/parceiros/comissoes", name: "Comissões de Parceiros" },
      { icon: Settings, href: "/admin/tier-config", name: "Configuração de Tiers" },
      { icon: Ticket, href: "/admin/discount-coupons", name: "Cupons de Desconto" },
      { icon: Share2, href: "/admin/parceiros/conteudo", name: "Gestão de Conteúdo" },
    ]
  },
  {
    label: "Contratos",
    items: [
      { icon: ClipboardList, href: "/admin/contract-management", name: "Gestão de Contratos" },
      // Esta página possui abas: "Contratos de Clientes" e "Contratos de Parceiros"
    ]
  },
  {
    label: "Financeiro",
    items: [
      { icon: Receipt, href: "/admin/faturas", name: "Gestão de Faturas" },
      { icon: DollarSign, href: "/admin/finances", name: "Finanças" },
    ]
  },
  {
    label: "Planos",
    items: [
      { icon: FileText, href: "/admin/planos", name: "Configurador de Planos" },
    ]
  },
  {
    label: "Tecnologia",
    items: [
      { icon: Cpu, href: "/admin/llm-management", name: "Gestao de LLMs" },
      { icon: Bot, href: "/admin/prompts", name: "AI Engine" },
    ]
  },
];

// Parceiro menu items
const PARTNER_MENU_ITEMS = [
  { icon: LayoutDashboard, href: "/afiliado", name: "Dashboard" },
  { icon: Share2, href: "/afiliado/link", name: "Link do Afiliado" },
  { icon: Filter, href: "/afiliado/funil", name: "Funil de Indicações" },
  { icon: DollarSign, href: "/afiliado/comissoes", name: "Comissões" },
  { icon: GraduationCap, href: "/afiliado/academy", name: "Academy" },
  { icon: MessageSquare, href: "/afiliado/chat", name: "Chat" },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState({ key: "", label: "" });
  const { hasAccess } = useModuleAccess();
  const { user, logout } = useAuth();
  
  // Ref para o container de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  
  const isAdminRoute = pathname.startsWith("/admin");
  const isPartnerRoute = pathname.startsWith("/afiliado") || pathname.startsWith("/banca");
  const isPartner = user?.role === 'parceiro';
  
  // Verificar quais add-ons o cliente tem ativados (memoizado)
  const enabledAddons = useMemo(() => {
    // Verificar se é um novo usuário (primeiro acesso)
    const justCreatedPassword = localStorage.getItem('just_created_password');
    const fromContractSign = localStorage.getItem('from_contract_sign');
    
    // Se for novo usuário, não mostrar add-ons (todos bloqueados)
    if (justCreatedPassword || fromContractSign) {
      return [];
    }
    
    // Para usuários existentes, usar hasAccess para verificar
    return ADDON_ITEMS.filter(item => hasAccess(item.key));
  }, [hasAccess]);
  
  // Verificar se a rota atual é um Add-on
  const isAddonRoute = ADDON_ITEMS.some(item => pathname === item.path);
  
  // Estado da seção de Add-ons - começa expandido se estiver em uma rota de Add-on
  const [addonsExpanded, setAddonsExpanded] = useState(isAddonRoute);
  
  // Manter a seção expandida quando navegar para um Add-on
  useEffect(() => {
    if (isAddonRoute) {
      setAddonsExpanded(true);
    }
  }, [pathname, isAddonRoute]);
  
  // Salvar posição do scroll antes de navegar
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Restaurar posição do scroll após navegação
      container.scrollTop = scrollPositionRef.current;
    }
  }, [pathname]);
  
  // Handler para salvar posição do scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  };
  
  // Gerenciar estado inicial do sidebar baseado em mobile/desktop
  // IMPORTANTE: Não fechar o sidebar em desktop ao mudar isMobile
  // Apenas inicializar o estado no primeiro render
  useEffect(() => {
    // Apenas ajustar o estado inicial uma vez no mount
    // Em desktop, manter o sidebar aberto por padrão
    // Não re-executar quando isMobile mudar para evitar fechar em desktop
    if (typeof window !== 'undefined') {
      const isMobileCheck = window.innerWidth < 768;
      if (isMobileCheck) {
        // Em mobile, começar com sidebar fechado
        setOpen(false);
      }
      // Em desktop, manter o estado atual (não forçar)
    }
  }, []); // Array vazio = executa apenas no mount
  
  // Fechar sidebar apenas em mobile quando navegar
  // IMPORTANTE: Não fechar em desktop ao navegar - deixar o usuário controlar
  useEffect(() => {
    if (isMobile && pathname) {
      // Apenas fechar em mobile quando navegar
      setOpen(false);
    }
    // Em desktop, não fazer nada - manter o estado atual (aberto/fechado)
  }, [pathname, isMobile]);
  
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLockedClick = (key: string, label: string) => {
    setSelectedAddon({ key, label });
    setUpgradeModalOpen(true);
  };

  // Render partner menu
  const renderPartnerMenu = () => (
    <div className="space-y-4">
      <div className="space-y-1">
        {PARTNER_MENU_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={item.href} 
                    className={cn(
                      "flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors", 
                      isActive
                        ? "bg-[#C0A062] text-white" 
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {open && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );

  // Render admin menu with sections
  const renderAdminMenu = () => (
    <div className="space-y-4">
      {ADMIN_MENU_SECTIONS.map((section, sectionIndex) => (
        <div key={section.label} className="space-y-1">
          {/* Section Label */}
          {open && (
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {section.label}
              </span>
              <div className="flex-1 h-px bg-sidebar-border/50" />
            </div>
          )}
          
          {/* Section Items */}
          {section.items.map(item => {
            const Icon = item.icon;
            // Verificar se é exatamente igual (prioridade máxima)
            let isActive = pathname === item.href;
            
            // Se não for exatamente igual, verificar se há match exato em outros itens da mesma seção
            if (!isActive && item.href !== "/admin") {
              // Verificar se existe outro item com match exato na mesma seção
              const hasExactMatch = section.items.some(otherItem => 
                otherItem.href !== item.href && 
                pathname === otherItem.href
              );
              
              // Se há match exato em outro item, não marcar este como ativo
              if (!hasExactMatch) {
                const isSubPath = pathname.startsWith(item.href + "/");
                
                if (isSubPath) {
                  // Verificar se existe outro item com href mais longo que também faz match exato
                  const hasLongerExactMatch = section.items.some(otherItem => 
                    otherItem.href !== item.href && 
                    otherItem.href.length > item.href.length &&
                    pathname === otherItem.href
                  );
                  
                  // Verificar se existe outro item com href mais longo que faz match como subcaminho
                  const hasLongerSubPathMatch = section.items.some(otherItem => 
                    otherItem.href !== item.href && 
                    otherItem.href.length > item.href.length &&
                    pathname.startsWith(otherItem.href)
                  );
                  
                  // Só marcar como ativo se não houver match exato ou subcaminho mais específico
                  isActive = !hasLongerExactMatch && !hasLongerSubPathMatch;
                }
              }
            }
            
            return (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to={item.href} 
                      className={cn(
                        "flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors", 
                        isActive
                          ? "bg-[#C0A062] text-white" 
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {open && <span>{item.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!open && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      ))}
    </div>
  );

  // Render company menu with Base + Add-ons structure
  const renderCompanyMenu = () => (
    <div className="space-y-2">
      {/* ===== SISTEMA BASE ===== */}
      <div className="space-y-2">
        {BASE_SECTIONS.map(section => (
          <div key={section.key}>
            {open && (
              <div className="flex items-center gap-2 px-3 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {section.label}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            <div className="space-y-0">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <TooltipProvider key={item.path} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 py-1.5 px-3 rounded-lg text-sm font-medium transition-all",
                            isActive
                              ? "bg-[#C0A062] text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {open && <span>{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ===== SEPARADOR ===== */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center px-3">
          <div className="w-full border-t-2 border-[#C0A062]/40" />
        </div>
      </div>

      {/* ===== ADD-ONS (Colapsável) ===== */}
      <div>
        {/* Header clicável para expandir/colapsar */}
        {open ? (
          <button
            onClick={() => setAddonsExpanded(!addonsExpanded)}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors"
          >
            <Gift className="h-3.5 w-3.5 text-[#C0A062]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C0A062] flex-1 text-left">
              Add-ons
            </span>
            {enabledAddons.length > 0 && (
              <span className="text-[9px] bg-[#C0A062]/20 text-[#C0A062] px-1.5 py-0.5 rounded-full font-medium">
                {enabledAddons.length}
              </span>
            )}
            {addonsExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-[#C0A062]/70" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-[#C0A062]/70" />
            )}
          </button>
        ) : (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setAddonsExpanded(!addonsExpanded)}
                  className="flex items-center justify-center py-2 px-3 w-full hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Gift className="h-4 w-4 text-[#C0A062]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Add-ons ({enabledAddons.length} {enabledAddons.length === 1 ? 'ativo' : 'ativos'})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Lista de Add-ons - Mostrar apenas quando expandido */}
        {addonsExpanded && (
          <div className="space-y-0 mt-1">
            {/* Mostrar add-ons ativados primeiro */}
            {enabledAddons.length > 0 && (
              <>
                {enabledAddons.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <TooltipProvider key={item.path} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center gap-3 py-1.5 px-3 rounded-lg text-sm font-medium transition-all",
                              isActive
                                ? "bg-[#C0A062] text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {open && <span className="flex-1 text-left">{item.label}</span>}
                          </Link>
                        </TooltipTrigger>
                        {!open && (
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </>
            )}

            {/* Mostrar add-ons bloqueados (sem acesso) */}
            {(() => {
              const lockedAddons = ADDON_ITEMS.filter(item => !hasAccess(item.key));
              const justCreatedPassword = localStorage.getItem('just_created_password');
              const fromContractSign = localStorage.getItem('from_contract_sign');
              
              // Se for novo usuário, mostrar todos os add-ons como bloqueados
              const addonsToShow = (justCreatedPassword || fromContractSign) ? ADDON_ITEMS : lockedAddons;
              
              return addonsToShow.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  {addonsToShow.map(item => {
                    const Icon = item.icon;
                    
                    return (
                      <TooltipProvider key={item.path} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setSelectedAddon({ key: item.key, label: item.label });
                                setUpgradeModalOpen(true);
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 py-1.5 px-3 rounded-lg text-sm font-medium transition-all opacity-50 hover:opacity-70 cursor-pointer",
                                "text-white/60 hover:text-white/80 hover:bg-white/5"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {open && (
                                <>
                                  <span className="flex-1 text-left">{item.label}</span>
                                  <Lock className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                                </>
                              )}
                            </button>
                          </TooltipTrigger>
                          {!open && (
                            <TooltipContent side="right">
                              <p>{item.label} (Bloqueado)</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn(
        "bg-sidebar h-screen border-r border-sidebar-border transition-all duration-300 ease-in-out z-10 sticky top-0 flex flex-col", 
        open ? "w-64 sm:w-64 md:w-72 max-w-full" : "w-16"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center">
              {open ? (
                <img 
                  src={logoImage} 
                  alt="Legacy" 
                  className="h-10 w-auto"
                />
              ) : (
                <img 
                  src={logoImage} 
                  alt="Legacy" 
                  className="h-8 w-8 object-contain"
                />
              )}
            </Link>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{open ? "Recolher menu" : "Expandir menu"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 py-4 px-2 scrollbar-thin"
        >
          {isAdminRoute ? renderAdminMenu() : (isPartner && isPartnerRoute ? renderPartnerMenu() : renderCompanyMenu())}
        </div>

        {/* Footer - User Profile */}
        <div className="border-t border-sidebar-border p-3">
          {open ? (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-sidebar-foreground/70">
                  {isAdminRoute ? 'Admin Master' : (isPartner ? 'Parceiro' : 'Cliente')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
                        onClick={() => navigate(
                          isAdminRoute ? '/admin/settings' : 
                          isPartner ? '/afiliado/configuracoes' : 
                          '/settings'
                        )}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Configurações</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
                        onClick={async () => {
                          await logout();
                          navigate('/login');
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Sair</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      onClick={() => navigate(isAdminRoute ? '/admin/settings' : '/settings')}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Configurações</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={async () => {
                        await logout();
                        navigate('/login');
                      }}
                      className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sair</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </aside>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        moduleKey={selectedAddon.key}
        moduleName={selectedAddon.label}
      />
    </>
  );
};

export default Sidebar;
