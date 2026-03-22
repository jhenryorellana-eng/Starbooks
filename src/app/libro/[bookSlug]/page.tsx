import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BookHero } from "@/components/books/BookHero";
import { StepTracker } from "@/components/books/StepTracker";
import { StepsGrid } from "@/components/books/StepsGrid";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("title")
    .eq("slug", bookSlug)
    .single();

  return { title: book?.title ?? "Libro" };
}

export default async function BookOverviewPage({ params }: Props) {
  const { bookSlug } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("*, author:authors(*), intelligence:intelligences(*)")
    .eq("slug", bookSlug)
    .single();

  if (!book) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let progress = null;
  if (user) {
    const { data } = await supabase
      .from("user_book_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", book.id)
      .single();
    progress = data;
  }

  const completedSteps = progress
    ? [
        progress.step1_completed,
        progress.step2_completed,
        progress.step3_completed,
        progress.step4_completed,
        progress.step5_completed,
        progress.step6_completed,
        progress.step7_completed,
      ]
    : Array(7).fill(false);

  const currentStep = progress?.current_step ?? 1;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <BookHero book={book} progress={progress} />

      <StepTracker
        bookSlug={book.slug}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <StepsGrid
        bookSlug={book.slug}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
    </div>
  );
}
