import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useGuiaLegacy } from "@/contexts/GuiaLegacyContext";
import { cn } from "@/lib/utils";

const LegacyGuideFloatingButton = () => {
  const { pathname } = useLocation();
  const guiaLegacy = useGuiaLegacy();
  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname.startsWith("/auth") || pathname === "/";

  if (isAdmin || isAuthPage || !guiaLegacy) return null;

  return (
    <button
      type="button"
      onClick={guiaLegacy.openGuidedNav}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
        "bg-[#BC9F6A] text-[#001226] font-semibold text-sm",
        "hover:bg-[#a88f5c] hover:brightness-105 active:brightness-95",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9F6A] focus-visible:ring-offset-2"
      )}
      title="Abrir guia da plataforma"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2} />
      <span>Guia</span>
    </button>
  );
};

export default LegacyGuideFloatingButton;
