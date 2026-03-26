
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import GovernanceAssistant from "./GovernanceAssistant";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const [showGuide, setShowGuide] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isPartnerRoute = location.pathname.startsWith("/afiliado");
  const isPartner = user?.role === 'parceiro';

  // Função para testar o Tour Guiado (apenas em desenvolvimento)
  const handleTestTour = () => {
    // Limpar flags do tour
    localStorage.removeItem('guided_tour_completed');
    localStorage.removeItem('guided_tour_completed_at');
    localStorage.removeItem('guided_tour_skipped');
    localStorage.removeItem('guided_tour_skipped_at');
    localStorage.removeItem('just_created_password');
    
    // Forçar mostrar o tour
    window.location.href = '/dashboard?testTour=true';
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Botão Guia Legacy */}
          <Button 
            onClick={() => setShowGuide(true)}
            className="bg-legacy-500 hover:bg-legacy-600 text-white rounded-full px-4 py-2"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Guia Legacy
          </Button>

          {/* Botão de teste do Tour (apenas em desenvolvimento e não para parceiros) */}
          {process.env.NODE_ENV === 'development' && !isPartner && !isPartnerRoute && (
            <Button 
              onClick={handleTestTour}
              variant="outline"
              size="sm"
              className="rounded-full px-4 py-2"
              title="Testar Tour Guiado de Onboarding"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Testar Tour
            </Button>
          )}

          <NotificationBell />
        </div>
      </header>

      {/* Governance Assistant controlado pelo Header */}
      <GovernanceAssistant 
        isOpen={showGuide} 
        onOpenChange={setShowGuide} 
      />
    </>
  );
};

export default Header;
