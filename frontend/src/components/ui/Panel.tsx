import React from "react";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  // We can use standard clsx to merge class names here since tailwind-merge isn't installed.
  return clsx(inputs);
}

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "intel" | "geo" | "critical";
  accentTop?: "none" | "intel" | "geo" | "critical";
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "default", accentTop = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "sn-panel flex flex-col",
          variant === "intel" && "sn-panel-intel",
          variant === "geo" && "sn-panel-geo",
          variant === "critical" && "sn-panel-critical",
          accentTop === "intel" && "sn-accent-top",
          accentTop === "geo" && "sn-accent-top-geo",
          accentTop === "critical" && "sn-accent-top-crit",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = "Panel";
