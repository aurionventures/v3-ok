import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GuiaLegacyButtonProps {
  /** When provided, renders as button with onClick instead of Link */
  onClick?: () => void;
  className?: string;
}

const GuiaLegacyButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, GuiaLegacyButtonProps>(
  ({ onClick, className }, ref) => {
    const baseStyles =
      "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-[15px] font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9F6A] focus-visible:ring-offset-2 cursor-pointer border-none";

    const visualStyles =
      "bg-[#BC9F6A] text-[#001226] hover:bg-[#a88f5c] hover:brightness-105 active:brightness-95";

    const content = (
      <>
        <BookOpen className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span>Guia Legacy</span>
      </>
    );

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(baseStyles, visualStyles, className)}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to="/legacy"
        className={cn(baseStyles, visualStyles, className)}
      >
        {content}
      </Link>
    );
  }
);

GuiaLegacyButton.displayName = "GuiaLegacyButton";

export default GuiaLegacyButton;
