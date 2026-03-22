"use client";

import { StepTracker } from "@/components/books/StepTracker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  bookSlug: string;
  bookTitle: string;
  currentStep: number;
  completedSteps: boolean[];
}

export function Sidebar({ bookSlug, bookTitle, currentStep, completedSteps }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle bg-bg-secondary/50 p-4 pt-20 h-screen sticky top-0 overflow-y-auto">
      <Link
        href={`/libro/${bookSlug}`}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-4 px-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="truncate">{bookTitle}</span>
      </Link>

      <div className="border-b border-border-subtle mb-4" />

      <StepTracker
        bookSlug={bookSlug}
        currentStep={currentStep}
        completedSteps={completedSteps}
        vertical
      />
    </aside>
  );
}
