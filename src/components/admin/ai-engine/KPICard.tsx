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
      "bg-white border-2 shadow-sm hover:shadow-lg transition-all duration-300",
      styles.border,
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-xs font-semibold uppercase tracking-wider", styles.text)}>
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {value}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl shadow-md", styles.iconBg)}>
            <Icon className={cn("h-6 w-6", styles.iconText)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
