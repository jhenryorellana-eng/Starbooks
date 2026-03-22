import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        "bg-bg-card text-text-secondary border border-border-subtle",
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}18`,
              color,
              borderColor: `${color}30`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
