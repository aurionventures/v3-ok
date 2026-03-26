import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  titleHighlight,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-12",
      centered && "text-center",
      className
    )}>
      <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground font-heading">
        {title}
        {titleHighlight && (
          <span className="text-accent"> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
