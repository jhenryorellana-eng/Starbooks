"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: string;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl bg-bg-card border border-border-subtle overflow-hidden",
        "shadow-[0_2px_4px_rgba(0,0,0,0.4),0_8px_20px_rgba(0,0,0,0.2)]",
        "before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.04)_0%,transparent_50%)]",
        hover &&
          "hover:bg-bg-card-hover hover:border-border-hover hover:shadow-[0_4px_8px_rgba(0,0,0,0.5),0_16px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
      style={
        glow
          ? {
              boxShadow: `0 2px 4px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.2), 0 0 25px ${glow}15, 0 0 50px ${glow}08`,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
