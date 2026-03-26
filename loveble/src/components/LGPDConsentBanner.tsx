import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CONSENT_KEY = "lgpd_consent_accepted";

export function LGPDConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem(CONSENT_KEY);
    if (!hasAccepted) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1A202C] border border-slate-700 rounded-lg shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-slate-300 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{" "}
              <a 
                href="/privacidade" 
                className="text-[#C0A062] hover:underline"
              >
                Política de Privacidade
              </a>{" "}
              e{" "}
              <a 
                href="/lgpd" 
                className="text-[#C0A062] hover:underline"
              >
                LGPD
              </a>.
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                className="bg-[#C0A062] hover:bg-[#A8893F] text-[#0A1929] font-medium text-xs px-4"
                onClick={handleAccept}
              >
                Aceitar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white text-xs"
                onClick={handleClose}
              >
                Fechar
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
