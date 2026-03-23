import { MessageCircle } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useGuiaLegacy } from "@/contexts/GuiaLegacyContext";

interface GuiaLegacyButtonProps {
  /** When provided, uses this onClick; otherwise opens guide chat via context */
  onClick?: () => void;
  className?: string;
}

const GuiaLegacyButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, GuiaLegacyButtonProps>(
  ({ onClick, className }, ref) => {
    const guiaLegacy = useGuiaLegacy();
    const handleClick = onClick ?? guiaLegacy?.openGuidedNav;

    const baseStyles =
      "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-[15px] font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9F6A] focus-visible:ring-offset-2 cursor-pointer border-none";

    const visualStyles =
      "bg-[#BC9F6A] text-[#001226] hover:bg-[#a88f5c] hover:brightness-105 active:brightness-95";

    const content = (
      <>
        <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span>Guia Legacy</span>
      </>
    );

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={handleClick}
        className={cn(baseStyles, visualStyles, className)}
        title="Abrir guia da plataforma"
      >
        {content}
      </button>
    );
  }
);

GuiaLegacyButton.displayName = "GuiaLegacyButton";

export default GuiaLegacyButton;
