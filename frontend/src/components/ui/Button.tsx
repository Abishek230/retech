"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cream" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-xl";

    const variantStyles = {
      // Primary Burgundy
      primary:
        "bg-burgundy text-white hover:bg-burgundy-500 focus-visible:ring-burgundy shadow-sm hover:shadow-warm",
      // Secondary Brown
      secondary:
        "bg-brown text-white hover:bg-brown-600 focus-visible:ring-brown shadow-sm",
      // Outline with warm border
      outline:
        "border border-brown-300 bg-transparent text-brown-900 hover:bg-cream-100 hover:border-brown-500 focus-visible:ring-brown",
      // Subtle ghost
      ghost:
        "text-brown-800 hover:bg-cream-200/60 focus-visible:ring-brown-400",
      // Cream pill button
      cream:
        "bg-cream text-brown-900 hover:bg-cream-200 border border-cream-300 focus-visible:ring-brown",
      // Accent green eco button
      accent:
        "bg-accent-green text-white hover:bg-green-700 focus-visible:ring-accent-green shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
