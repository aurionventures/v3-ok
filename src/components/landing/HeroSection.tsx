import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  primaryCTA?: { 
    label: string; 
    href: string; 
    icon?: React.ReactNode;
    onClick?: () => void;
  };
  secondaryCTA?: { 
    label: string; 
    href: string;
    icon?: React.ReactNode;
  };
  stats?: Array<{ value: string; label: string }>;
  badge?: { icon?: React.ReactNode; text: string };
  className?: string;
}

export function HeroSection({
  title,
  titleHighlight,
  subtitle,
  primaryCTA,
  secondaryCTA,
  stats,
  badge,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn(
      "relative overflow-hidden bg-gradient-hero pt-32 pb-20",
      className
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto text-center text-white">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full mb-6">
              {badge.icon}
              <span className="text-accent font-medium">{badge.text}</span>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight font-heading">
            {title}
            {titleHighlight && (
              <>
                <br />
                <span className="text-accent">{titleHighlight}</span>
              </>
            )}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl lg:text-2xl mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto">
            {subtitle}
          </p>
          
          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {primaryCTA && (
                primaryCTA.onClick ? (
                  <Button 
                    size="lg" 
                    className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl font-semibold"
                    onClick={primaryCTA.onClick}
                  >
                    {primaryCTA.icon}
                    {primaryCTA.label}
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl font-semibold"
                    asChild
                  >
                    <Link to={primaryCTA.href}>
                      {primaryCTA.icon}
                      {primaryCTA.label}
                    </Link>
                  </Button>
                )
              )}
              {secondaryCTA && (
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-accent text-accent hover:bg-accent/10 text-lg px-8 py-6 h-auto rounded-xl font-semibold"
                  asChild
                >
                  <Link to={secondaryCTA.href}>
                    {secondaryCTA.icon}
                    {secondaryCTA.label}
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
