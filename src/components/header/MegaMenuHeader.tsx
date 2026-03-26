import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, Lock, Bot, Home, ChevronDown, Brain, Shield, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import legacyLogo from "@/assets/legacy-logo-new.png";
import { cn } from "@/lib/utils";

// Menu items principais
const MENU_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "plataforma", label: "Plataforma", href: "/plataforma" },
  { id: "planos", label: "Planos", href: "/pricing" },
];

// Dropdown de Módulos
const MODULOS_ITEMS = [
  { id: "ai-engine", label: "AI Engine", href: "/ai-engine", icon: Brain },
  { id: "governanca", label: "Governança", href: "/governanca", icon: Shield },
  { id: "diagnostico", label: "Diagnóstico", href: "/standalone-quiz", icon: ClipboardCheck },
];

const SECONDARY_LINKS = [
  { id: "sobre", label: "Empresa", href: "/sobre" },
  { id: "contato", label: "Contato", href: "/contato" },
  { id: "blog", label: "Blog", href: "/blog" },
];

export const MegaMenuHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModulosOpen, setIsModulosOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isModulosActive = () => {
    return MODULOS_ITEMS.some(item => isActiveRoute(item.href));
  };

  // Detectar se está na página /pricing para usar fundo sólido (igual /plataforma)
  const isPricingPage = location.pathname === '/pricing' || location.pathname.startsWith('/pricing');
  const headerBgClass = isPricingPage 
    ? "bg-corporate-dark" // Fundo sólido para /pricing (igual /plataforma)
    : (isScrolled ? "bg-corporate-dark/95" : "bg-corporate-dark/80"); // Fundo com opacidade para outras páginas

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className={cn(
        "text-slate-400 text-sm py-2 border-b border-border/20 hidden md:block transition-all duration-300",
        headerBgClass,
        !isPricingPage && "backdrop-blur-xl" // Apenas blur se não for /pricing
      )}>
        <div className="container mx-auto px-6 flex justify-end items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {SECONDARY_LINKS.map((link) => (
              <Link 
                key={link.id}
                to={link.href} 
                className={cn(
                  "hover:text-accent transition-all duration-200 legacy-glow-gold-hover",
                  isActiveRoute(link.href) && "text-accent legacy-glow-gold"
                )}
                aria-current={isActiveRoute(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Nav */}
      <div className={cn(
        "border-b border-border/20 transition-all duration-300 relative",
        headerBgClass,
        !isPricingPage && "backdrop-blur-xl", // Apenas blur se não for /pricing
        isScrolled ? "py-2" : "py-3"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Legacy OS - Ir para página inicial">
            <img 
              src={legacyLogo} 
              alt="Legacy OS" 
              className={cn(
                "w-auto cursor-pointer transition-all duration-300",
                isScrolled ? "h-8" : "h-10"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-12" aria-label="Navegação principal">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-lg font-medium rounded-md transition-all duration-200",
                  "text-white hover:text-accent hover:bg-white/5",
                  isActiveRoute(item.href) && "text-accent bg-accent/10 drop-shadow-[0_0_8px_rgba(201,168,108,0.5)]"
                )}
                aria-current={isActiveRoute(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown Módulos */}
            <DropdownMenu>
              <DropdownMenuTrigger 
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 text-lg font-medium rounded-md transition-all duration-200 outline-none",
                  "text-white hover:text-accent hover:bg-white/5",
                  isModulosActive() && "text-accent bg-accent/10 drop-shadow-[0_0_8px_rgba(201,168,108,0.5)]"
                )}
              >
                <Bot className="h-5 w-5" aria-hidden="true" />
                Módulos
                <ChevronDown className="h-4 w-4 ml-0.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-corporate-dark/95 backdrop-blur-xl border-accent/20 min-w-[200px]"
                sideOffset={8}
              >
                {MODULOS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={item.id} 
                      asChild
                      className="focus:bg-accent/10 focus:text-accent cursor-pointer"
                    >
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-white hover:text-accent transition-all duration-200",
                          isActiveRoute(item.href) && "text-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Button - Login Only */}
          <div className="hidden lg:flex items-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-6 transition-all duration-200 hover:shadow-[0_0_20px_rgba(201,168,108,0.3)]"
              onClick={() => navigate("/login")}
            >
              <Lock className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Login</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              size="sm"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold"
              onClick={() => navigate("/pricing")}
            >
              Planos
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <div 
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 bg-corporate-dark/95 backdrop-blur-xl z-50 lg:hidden overflow-y-auto animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="p-4 border-b border-border/20 flex items-center justify-between">
              <img src={legacyLogo} alt="Legacy OS" className="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2" aria-label="Menu mobile">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200",
                    "text-white hover:text-accent hover:bg-white/5",
                    isActiveRoute(item.href) && "text-accent bg-accent/10"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActiveRoute(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}

              {/* Módulos Accordion */}
              <Collapsible open={isModulosOpen} onOpenChange={setIsModulosOpen}>
                <CollapsibleTrigger 
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200",
                    "text-white hover:text-accent hover:bg-white/5",
                    isModulosActive() && "text-accent bg-accent/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                    Módulos
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isModulosOpen && "rotate-180"
                  )} aria-hidden="true" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                  {MODULOS_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-base rounded-lg transition-all duration-200",
                          "text-slate-300 hover:text-accent hover:bg-white/5",
                          isActiveRoute(item.href) && "text-accent bg-accent/10"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActiveRoute(item.href) ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>

              {/* Secondary Links */}
              <div className="pt-4 mt-4 border-t border-border/20 space-y-2">
                {SECONDARY_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-base text-slate-400 hover:text-white transition-colors",
                      isActiveRoute(link.href) && "text-accent"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActiveRoute(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Login Button Mobile */}
              <div className="pt-4 mt-4 border-t border-border/20">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Login</span>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default MegaMenuHeader;
