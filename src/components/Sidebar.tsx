import { useEffect, useState, useRef } from "react";
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
  Award,
  Target,
  Bot,
  Gift,
  Lock,
  Calculator,
  FileSignature,
  Receipt,
  LogOut,
  Brain,
  PieChart,
  CheckCircle,
  ActivitySquare,
  Briefcase,
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

// Admin menu items organized by sections
const ADMIN_MENU_SECTIONS = [
  {
    label: "Visão Geral",
    items: [
      { icon: LayoutDashboard, href: "/admin", name: "Dashboard" },
    ]
  },
  {
    label: "Comercial",
    items: [
      { icon: Building2, href: "/admin/empresas", name: "Empresas" },
      { icon: TrendingUp, href: "/admin/vendas", name: "Vendas" },
      { icon: Handshake, href: "/admin/parceiros", name: "Parceiros" },
    ]
  },
  {
    label: "Catálogo",
    items: [
      { icon: FileText, href: "/admin/planos", name: "Planos" },
      { icon: Layers, href: "/admin/addons", name: "Add-ons" },
    ]
  },
  {
    label: "Financeiro",
    items: [
      { icon: FileSignature, href: "/admin/contratos", name: "Contratos" },
      { icon: Receipt, href: "/admin/faturas", name: "Faturas" },
      { icon: DollarSign, href: "/admin/finances", name: "Financeiro" },
    ]
  },
  {
    label: "Tecnologia",
    items: [
      { icon: Bot, href: "/admin/prompts", name: "AI Engine" },
    ]
  },
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
  
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Verificar quais add-ons o cliente tem ativados
  const getEnabledAddons = () => {
    // Para demonstração: todos os add-ons estão desbloqueados
    // Em produção, usar: return ADDON_ITEMS.filter(item => hasAccess(item.key));
    return ADDON_ITEMS;
  };
  
  const enabledAddons = getEnabledAddons();
  
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
  
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setOpen(!open);
  };
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile]);

  const handleLockedClick = (key: string, label: string) => {
    setSelectedAddon({ key, label });
    setUpgradeModalOpen(true);
  };

  // Render admin menu with sections
  const renderAdminMenu = () => (
    <div className="space-y-4">
      {ADMIN_MENU_SECTIONS.map((section, sectionIndex) => (
        <div key={section.label} className="space-y-1">
          {/* Section Label */}
          {open && (
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
                {section.label}
              </span>
              <div className="flex-1 h-px bg-sidebar-border/50" />
            </div>
          )}
          
          {/* Section Items */}
          {section.items.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
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
                <p>Add-ons ({enabledAddons.length} ativos)</p>
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

            {/* Nota: Para ambiente de demonstração, todos os add-ons estão desbloqueados */}
            {/* Em produção, adicionar a seção de "Disponíveis" com cadeado aqui */}
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
        <div className="overflow-y-auto flex-1 py-4 px-2 scrollbar-thin">
          {isAdminRoute ? renderAdminMenu() : renderCompanyMenu()}
        </div>

        {/* Footer - User Profile */}
        <div className="border-t border-sidebar-border p-3">
          {open ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">
                    {isAdminRoute ? 'Admin Master' : 'Cliente'}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
                        onClick={() => navigate(isAdminRoute ? '/admin/settings' : '/settings')}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Configurações</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Logout */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="w-full h-9 bg-[#C0A062] hover:bg-[#B8944D] text-white border-[#C0A062] hover:border-[#B8944D]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
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
                      onClick={logout}
                      className="h-9 w-9 bg-[#C0A062] hover:bg-[#B8944D] text-white"
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
