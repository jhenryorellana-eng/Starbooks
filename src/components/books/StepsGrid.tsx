"use client";

import { STEPS } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Lock } from "lucide-react";
import Link from "next/link";

interface StepsGridProps {
  bookSlug: string;
  currentStep: number;
  completedSteps: boolean[];
}

export function StepsGrid({ bookSlug, currentStep, completedSteps }: StepsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {STEPS.map((step) => {
        const isCompleted = completedSteps[step.number - 1];
        const isCurrent = step.number === currentStep;
        const isLocked = step.number > currentStep && !isCompleted;

        return (
          <Link
            key={step.number}
            href={
              isLocked ? "#" : `/libro/${bookSlug}/paso-${step.number}`
            }
            onClick={(e) => isLocked && e.preventDefault()}
          >
            <GlassCard
              hover={!isLocked}
              className={`p-5 h-full ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${isCurrent ? "border-white/[0.15] bg-white/[0.06]" : ""}`}
              whileHover={isLocked ? {} : { scale: 1.02 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{step.emoji}</span>
                {isCompleted && (
                  <div className="h-6 w-6 rounded-full bg-accent-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} color="var(--bg-primary)" />
                  </div>
                )}
                {isLocked && <Lock className="h-4 w-4 text-text-muted/40" />}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                Paso {step.number}: {step.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {step.description}
              </p>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}
