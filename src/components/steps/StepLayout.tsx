"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { StepTracker } from "@/components/books/StepTracker";

interface StepLayoutProps {
  bookSlug: string;
  bookTitle: string;
  currentStep: number;
  completedSteps: boolean[];
  children: React.ReactNode;
}

export function StepLayout({
  bookSlug,
  bookTitle,
  currentStep,
  completedSteps,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        bookSlug={bookSlug}
        bookTitle={bookTitle}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
      <div className="flex-1 min-w-0 pt-20 pb-24 md:pb-12">
        {/* StepTracker horizontal solo en mobile/tablet */}
        <div className="lg:hidden px-4 mb-4 overflow-hidden">
          <StepTracker
            bookSlug={bookSlug}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
