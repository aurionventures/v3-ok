import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features?: string[];
  variant?: 'default' | 'highlight' | 'accent';
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  variant = 'default',
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn(
      "border hover:shadow-lg transition-all",
      variant === 'default' && "border-border bg-card hover:border-accent/30",
      variant === 'highlight' && "border-2 border-accent bg-accent/5",
      variant === 'accent' && "border-border bg-card hover:border-accent/30",
      className
    )}>
      <CardContent className="p-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          variant === 'accent' ? "bg-accent/10" : "bg-primary/5"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'accent' ? "text-accent" : "text-primary"
          )} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {features && features.length > 0 && (
          <ul className="space-y-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-3 w-3 text-accent" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
