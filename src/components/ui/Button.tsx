"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-primary to-[#00B4D8] text-white font-semibold hover:brightness-110 shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_12px_rgba(124,92,252,0.25)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.4),0_8px_20px_rgba(124,92,252,0.3)]",
  secondary:
    "bg-bg-card text-text-primary border border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:bg-bg-card-hover hover:border-border-hover hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-bg-card",
  outline:
    "border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary shadow-[0_0_12px_rgba(124,92,252,0.1)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-[10px]",
  md: "px-6 py-3 text-sm rounded-[10px]",
  lg: "px-8 py-4 text-base rounded-[10px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
