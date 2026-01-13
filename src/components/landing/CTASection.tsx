import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: { 
    label: string; 
    href: string;
    icon?: React.ReactNode;
  };
  secondaryCTA?: { 
    label: string; 
    href: string;
    icon?: React.ReactNode;
  };
  variant?: 'dark' | 'light';
  className?: string;
}

export function CTASection({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  variant = 'dark',
  className,
}: CTASectionProps) {
  return (
    <section className={cn(
      "py-20",
      variant === 'dark' && "bg-gradient-hero",
      variant === 'light' && "bg-primary text-white",
      className
    )}>
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-heading">
            {title}
          </h2>
          <p className="text-xl text-white/70 mb-8">
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-accent text-primary hover:bg-accent/90 font-semibold"
              asChild
            >
              <Link to={primaryCTA.href}>
                {primaryCTA.icon}
                {primaryCTA.label}
              </Link>
            </Button>
            {secondaryCTA && (
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                asChild
              >
                <Link to={secondaryCTA.href}>
                  {secondaryCTA.icon}
                  {secondaryCTA.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
