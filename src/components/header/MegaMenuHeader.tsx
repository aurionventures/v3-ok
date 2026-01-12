import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Lock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import legacyLogo from "@/assets/legacy-logo-new.png";
import { cn } from "@/lib/utils";

// Menu items simplificado - links diretos
const MENU_ITEMS = [
  { id: "plataforma", label: "Plataforma", href: "/plataforma" },
  { id: "governanca", label: "Governança", href: "/governanca" },
  { id: "ai-engine", label: "AI Engine", href: "/ai-engine", highlight: true },
  { id: "planos", label: "Planos", href: "/pricing" },
];

export const MegaMenuHeader = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#0A1628] text-slate-400 text-sm py-2 border-b border-slate-700/50 hidden md:block">
        <div className="container mx-auto px-6 flex justify-end items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link to="/sobre" className="hover:text-[#C0A062] transition-colors">
              Empresa
            </Link>
            <Link to="/contato" className="hover:text-[#C0A062] transition-colors">
              Contato
            </Link>
            <Link to="/blog" className="hover:text-[#C0A062] transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Nav */}
      <div className={cn(
        "bg-[#0A1628] border-b border-slate-700/50 transition-all duration-300",
        isScrolled ? "py-2" : "py-3"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={legacyLogo} 
              alt="Legacy OS" 
              className={cn(
                "w-auto cursor-pointer transition-all duration-300",
                isScrolled ? "h-8" : "h-10"
              )}
            />
          </Link>

          {/* Desktop Navigation - Links diretos sem dropdown */}
          <nav className="hidden lg:flex items-center space-x-2 ml-12">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-lg font-medium rounded-md transition-colors",
                  "text-slate-300 hover:text-white hover:bg-white/5",
                  item.highlight && "text-[#C0A062] hover:text-[#C0A062]"
                )}
              >
                {item.highlight && <Bot className="h-5 w-5" />}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Login Only */}
          <div className="hidden lg:flex items-center">
            <Button 
              size="lg"
              className="bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1628] font-semibold text-lg px-6"
              onClick={() => navigate("/login")}
            >
              <Lock className="h-5 w-5 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              size="sm"
              className="bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1628] font-semibold"
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
          <div className="fixed top-0 right-0 h-full w-80 bg-[#0A1628] z-50 lg:hidden overflow-y-auto animate-in slide-in-from-right duration-300">
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
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg transition-colors",
                    item.highlight 
                      ? "text-[#C0A062] hover:bg-[#C0A062]/10" 
                      : "text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.highlight && <Bot className="h-5 w-5" />}
                  {item.label}
                </Link>
              ))}

              {/* Secondary Links */}
              <div className="pt-4 mt-4 border-t border-slate-700 space-y-2">
                <Link
                  to="/sobre"
                  className="flex items-center px-4 py-2 text-base text-slate-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Empresa
                </Link>
                <Link
                  to="/contato"
                  className="flex items-center px-4 py-2 text-base text-slate-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contato
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center px-4 py-2 text-base text-slate-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>

              {/* Login Button Mobile */}
              <div className="pt-4 mt-4 border-t border-slate-700">
                <Button 
                  className="w-full bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1628] font-semibold"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Login
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
