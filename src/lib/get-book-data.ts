import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Book, Author, Intelligence, UserBookProgress } from "@/types";

export async function getBookData(bookSlug: string) {
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

  let progress: UserBookProgress | null = null;
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
    : Array(7).fill(false) as boolean[];

  const currentStep = progress?.current_step ?? 1;

  return {
    supabase,
    book: book as Book & { author: Author; intelligence: Intelligence },
    user,
    progress,
    completedSteps,
    currentStep,
  };
}
