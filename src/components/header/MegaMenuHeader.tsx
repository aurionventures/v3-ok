import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, Lock, Bot, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import legacyLogo from "@/assets/legacy-logo-new.png";
import { cn } from "@/lib/utils";

// Menu items with Home
const MENU_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "plataforma", label: "Plataforma", href: "/plataforma" },
  { id: "governanca", label: "Governança", href: "/governanca" },
  { id: "ai-engine", label: "AI Engine", href: "/ai-engine", highlight: true },
  { id: "planos", label: "Planos", href: "/pricing" },
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-corporate-dark text-slate-400 text-sm py-2 border-b border-border/20 hidden md:block">
        <div className="container mx-auto px-6 flex justify-end items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {SECONDARY_LINKS.map((link) => (
              <Link 
                key={link.id}
                to={link.href} 
                className={cn(
                  "hover:text-accent transition-colors",
                  isActiveRoute(link.href) && "text-accent"
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
        "bg-corporate-dark border-b border-border/20 transition-all duration-300",
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
          <nav className="hidden lg:flex items-center space-x-2 ml-12" aria-label="Navegação principal">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-lg font-medium rounded-md transition-colors",
                  "text-slate-300 hover:text-white hover:bg-white/5",
                  item.highlight && "text-accent hover:text-accent",
                  isActiveRoute(item.href) && !item.highlight && "text-white bg-white/10",
                  isActiveRoute(item.href) && item.highlight && "text-accent bg-accent/10"
                )}
                aria-current={isActiveRoute(item.href) ? "page" : undefined}
              >
                {item.highlight && <Bot className="h-5 w-5" aria-hidden="true" />}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Login Only */}
          <div className="hidden lg:flex items-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-6"
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
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <div 
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 bg-corporate-dark z-50 lg:hidden overflow-y-auto animate-in slide-in-from-right duration-300"
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
                    "flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg transition-colors",
                    item.highlight 
                      ? "text-accent hover:bg-accent/10" 
                      : "text-white hover:bg-white/5",
                    isActiveRoute(item.href) && !item.highlight && "bg-white/10",
                    isActiveRoute(item.href) && item.highlight && "bg-accent/10"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActiveRoute(item.href) ? "page" : undefined}
                >
                  {item.highlight && <Bot className="h-5 w-5" aria-hidden="true" />}
                  {item.label}
                </Link>
              ))}

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
