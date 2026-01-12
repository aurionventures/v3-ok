import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FooterColumnProps {
  title: string;
  children: ReactNode;
  highlight?: boolean;
  className?: string;
}

export function FooterColumn({ title, children, highlight, className }: FooterColumnProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`footer-column ${className || ""}`}>
      {/* Desktop Title */}
      <h3 
        className={`hidden md:block text-base font-semibold mb-5 ${
          highlight 
            ? "text-amber-500" 
            : "text-white"
        }`}
      >
        {title}
      </h3>

      {/* Mobile Accordion Title */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between py-3 border-b border-slate-700/50"
      >
        <h3 className={`text-base font-semibold ${highlight ? "text-amber-500" : "text-white"}`}>
          {title}
        </h3>
        <ChevronDown 
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Content - Always visible on desktop, toggleable on mobile */}
      <div className={`
        md:block
        ${isOpen ? "block" : "hidden"}
        md:mt-0 mt-3
      `}>
        {children}
      </div>
    </div>
  );
}

interface FooterLinkGroupProps {
  title?: string;
  children: ReactNode;
}

export function FooterLinkGroup({ title, children }: FooterLinkGroupProps) {
  return (
    <div className="mb-5 last:mb-0">
      {title && (
        <h4 className="text-xs font-semibold text-amber-500/90 uppercase tracking-wider mb-3">
          {title}
        </h4>
      )}
      <div className="space-y-1.5">
        {children}
      </div>
    </div>
  );
}

interface FooterLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  indent?: boolean;
}

export function FooterLink({ href, children, external, indent }: FooterLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`
        block text-[13px] text-slate-400 hover:text-amber-500 
        transition-all duration-200 hover:pl-1
        leading-relaxed
        ${indent ? "pl-3" : ""}
      `}
    >
      {children}
    </a>
  );
}
