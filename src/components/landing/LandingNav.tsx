import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingNav = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-8">
          <img
            src="/lovable-uploads/2c829115-41cf-4d67-be3a-ab60b0628e1f.png"
            alt="Legacy OS"
            className="h-7 w-auto brightness-0 invert"
          />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm text-white/70 hover:text-white transition-colors font-lato">
              Plataforma
            </a>
            <a href="#diferenciais" className="text-sm text-white/70 hover:text-white transition-colors font-lato">
              Diferenciais
            </a>
            <a href="#planos" className="text-sm text-white/70 hover:text-white transition-colors font-lato">
              Planos
            </a>
            <a href="#faq" className="text-sm text-white/70 hover:text-white transition-colors font-lato">
              FAQ
            </a>
          </nav>
        </div>
        <Button
          className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold text-sm px-5 py-2"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </header>
  );
};

export default LandingNav;
