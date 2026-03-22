"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  color = "var(--accent-primary)",
  className,
  showLabel = false,
  size = "sm",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs text-text-muted">
          <span>Progreso</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-bg-card overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
