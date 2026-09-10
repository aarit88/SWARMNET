import React from "react";
import { cn } from "./Panel";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "warning" | "success" | "intel" | "geo" | "neural" | "neutral";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("sn-badge", `sn-badge-${variant}`, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
