
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: MetricCardProps) => {
  return (
    <div className={cn("legacy-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-0.5 flex items-baseline">
            <p className="text-xl font-semibold text-primary">{value}</p>
            {trend && (
              <span
                className={cn(
                  "ml-2 text-sm",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
