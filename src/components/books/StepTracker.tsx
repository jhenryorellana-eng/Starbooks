"use client";

import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import type { StepStatus } from "@/types";

interface StepTrackerProps {
  bookSlug: string;
  currentStep: number;
  completedSteps: boolean[];
  vertical?: boolean;
}

export function StepTracker({
  bookSlug,
  currentStep,
  completedSteps,
  vertical = false,
}: StepTrackerProps) {
  function getStatus(stepNum: number): StepStatus {
    if (completedSteps[stepNum - 1]) return "completed";
    if (stepNum === currentStep) return "current";
    if (stepNum <= currentStep) return "current";
    return "locked";
  }

  if (vertical) {
    return (
      <nav className="space-y-1">
        {STEPS.map((step) => {
          const status = getStatus(step.number);
          return (
            <Link
              key={step.number}
              href={
                status !== "locked"
                  ? `/libro/${bookSlug}/paso-${step.number}`
                  : "#"
              }
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                status === "completed" &&
                  "text-accent-primary/80 hover:bg-white/[0.04]",
                status === "current" &&
                  "text-text-primary bg-white/[0.06] border border-border-subtle",
                status === "locked" &&
                  "text-text-muted/40 cursor-not-allowed opacity-50"
              )}
              onClick={(e) => status === "locked" && e.preventDefault()}
            >
              <StepIcon number={step.number} status={status} />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-xs">{step.shortTitle}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <div className="flex items-center gap-1.5 w-max px-1 py-2">
        {STEPS.map((step, i) => {
          const status = getStatus(step.number);
          return (
            <div key={step.number} className="flex items-center gap-2">
              <Link
                href={
                  status !== "locked"
                    ? `/libro/${bookSlug}/paso-${step.number}`
                    : "#"
                }
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                  status === "completed" &&
                    "text-accent-primary bg-accent-primary/10 border border-accent-primary/20",
                  status === "current" &&
                    "text-text-primary bg-white/[0.08] border border-white/[0.15]",
                  status === "locked" &&
                    "text-text-muted/40 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed"
                )}
                onClick={(e) => status === "locked" && e.preventDefault()}
              >
                <StepIcon number={step.number} status={status} small />
                <span className="hidden sm:inline">{step.shortTitle}</span>
              </Link>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-4 h-px",
                    status === "completed" ? "bg-accent-primary/30" : "bg-white/[0.08]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIcon({
  number,
  status,
  small = false,
}: {
  number: number;
  status: StepStatus;
  small?: boolean;
}) {
  const size = small ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-xs";

  if (status === "completed") {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={cn(
          size,
          "rounded-full bg-accent-primary flex items-center justify-center"
        )}
      >
        <Check className={small ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={3} color="var(--bg-primary)" />
      </motion.div>
    );
  }

  if (status === "current") {
    return (
      <div
        className={cn(
          size,
          "rounded-full border-2 border-text-primary flex items-center justify-center font-bold"
        )}
      >
        {number}
      </div>
    );
  }

  return (
    <div
      className={cn(
        size,
        "rounded-full border border-white/[0.15] flex items-center justify-center text-text-muted/40"
      )}
    >
      {number}
    </div>
  );
}
