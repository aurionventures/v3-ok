import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "legacy_lgpd_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const close = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl rounded-xl bg-[#0B1628] border border-white/10 shadow-xl text-white p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <button
        type="button"
        onClick={close}
        className="absolute right-3 top-3 p-1 text-white/60 hover:text-white transition-colors rounded"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="text-center pr-8">
        <p className="font-lato text-sm text-white/90 mb-4">
          Utilizamos cookies para melhorar sua experiência.
        </p>
        <p className="font-lato text-sm text-white/80">
          Ao continuar navegando, você concorda com nossa{" "}
          <Link
            to="/politica-privacidade"
            className="text-legacy-gold hover:underline font-medium"
          >
            Política de Privacidade e LGPD
          </Link>
          .
        </p>
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <Button
          type="button"
          variant="ghost"
          className="font-lato text-white hover:bg-white/10 hover:text-white"
          onClick={close}
        >
          Fechar
        </Button>
        <Button
          type="button"
          className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold"
          onClick={accept}
        >
          Aceitar
        </Button>
      </div>
    </div>
  );
}
