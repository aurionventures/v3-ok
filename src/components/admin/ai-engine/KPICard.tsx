import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ColorVariant, getVariantStyles } from './config';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: ColorVariant;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'primary',
  className 
}: KPICardProps) {
  const styles = getVariantStyles(variant);

  return (
    <Card className={cn(
      "bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {value}
            </p>
          </div>
          <div className={cn("p-2.5 rounded-lg", styles.bg)}>
            <Icon className={cn("h-5 w-5", styles.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
