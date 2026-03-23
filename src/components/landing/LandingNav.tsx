import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingNavProps {
  activeLink?: "plataforma" | "diferenciais" | "planos" | "faq";
}

const LandingNav = ({ activeLink }: LandingNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPlanosPage = location.pathname === "/planos";
  const isPlanosActive = activeLink === "planos" || isPlanosPage;

  const navLinks = [
    { href: "/", anchor: "#como-funciona", label: "Plataforma", active: activeLink === "plataforma" },
    { href: "/", anchor: "#diferenciais", label: "Diferenciais", active: activeLink === "diferenciais" },
    { href: "/planos", label: "Planos", active: isPlanosActive, isRoute: true },
    { href: isPlanosPage ? "#faq" : "/#faq", label: "FAQ", active: activeLink === "faq", isAnchor: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4 relative">
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/lovable-uploads/nova-logo-branca.png"
              alt="Legacy OS"
              className="h-7 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "text-[1.14rem] transition-colors font-lato",
                    link.active ? "text-white bg-legacy-gold px-3 py-1.5 rounded" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.anchor ? link.href + link.anchor : link.href}
                  className={cn(
                    "text-[1.14rem] transition-colors font-lato",
                    link.active ? "text-white bg-legacy-gold/20 px-3 py-1.5 rounded" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        <div className="flex items-center gap-3">
          <Button
            className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold text-sm px-5 py-2"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
