import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const gradientCardVariants = cva(
  "relative overflow-hidden text-white",
  {
    variants: {
      variant: {
        copilot: "bg-gradient-copilot",
        success: "bg-gradient-success",
        hero: "bg-gradient-hero",
        primary: "bg-primary",
        muted: "bg-muted text-foreground",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "copilot",
      padding: "md",
    },
  }
);

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientCardVariants> {
  asChild?: boolean;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(gradientCardVariants({ variant, padding }), className)}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, gradientCardVariants };
