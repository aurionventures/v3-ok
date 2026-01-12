import { Instagram, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";

interface SocialIconsProps {
  className?: string;
}

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/legacyos", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/legacy-os", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/legacyos", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/legacyos", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/@legacyos", label: "YouTube" },
];

export function SocialIcons({ className }: SocialIconsProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C0A062]/20 flex items-center justify-center transition-all duration-200 group"
        >
          <social.icon className="h-4 w-4 text-slate-400 group-hover:text-[#C0A062] transition-colors" />
        </a>
      ))}
    </div>
  );
}
