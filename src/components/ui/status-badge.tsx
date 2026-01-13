import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, Clock, XCircle } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      status: {
        success: "bg-success-muted text-success",
        warning: "bg-warning-muted text-warning",
        error: "bg-destructive/10 text-destructive",
        info: "bg-info-muted text-info",
        pending: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "md",
    },
  }
);

const statusIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
  pending: Clock,
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

function StatusBadge({
  className,
  status,
  size,
  label,
  showIcon = true,
  icon,
  ...props
}: StatusBadgeProps) {
  const IconComponent = status ? statusIcons[status] : statusIcons.pending;

  return (
    <span
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {showIcon && (icon || <IconComponent className="h-3.5 w-3.5" />)}
      {label}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants };
