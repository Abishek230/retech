import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "pristine"
    | "excellent"
    | "good"
    | "burgundy"
    | "brown"
    | "cream"
    | "eco"
    | "outline";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "brown",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    pristine: "bg-emerald-50 text-emerald-800 border-emerald-200",
    excellent: "bg-teal-50 text-teal-800 border-teal-200",
    good: "bg-amber-50 text-amber-800 border-amber-200",
    burgundy: "bg-burgundy-50 text-burgundy border-burgundy-200 font-semibold",
    brown: "bg-brown-50 text-brown-800 border-brown-200",
    cream: "bg-cream text-brown-900 border-cream-300",
    eco: "bg-green-50 text-green-700 border-green-200",
    outline: "bg-transparent text-brown-700 border-brown-300",
  };

  const dotColors = {
    pristine: "bg-emerald-500",
    excellent: "bg-teal-500",
    good: "bg-amber-500",
    burgundy: "bg-burgundy",
    brown: "bg-brown",
    cream: "bg-brown-700",
    eco: "bg-green-500",
    outline: "bg-brown-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
}
