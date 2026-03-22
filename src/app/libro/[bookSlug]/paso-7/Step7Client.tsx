"use client";

import { ExamView } from "@/components/steps/ExamView";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Step7Exam, Step7Question } from "@/types";

interface Step7ClientProps {
  exam: Step7Exam;
  questions: Step7Question[];
  bookTitle: string;
  bookSlug: string;
  bookId: string;
  userName: string;
  previousScore: number | null;
  attempts: number;
  userId: string | null;
}

export function Step7Client({
  exam,
  questions,
  bookTitle,
  bookSlug,
  bookId,
  userName,
  previousScore,
  attempts,
  userId,
}: Step7ClientProps) {
  const router = useRouter();

  async function handleComplete(score: number, passed: boolean) {
    if (!userId) {
      router.push("/login");
      return;
    }

    const supabase = createClient();

    const { data: existing } = await supabase
      .from("user_book_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .single();

    const updateData = {
      exam_score: score,
      exam_attempts: attempts + 1,
      step7_completed: passed,
      ...(passed
        ? { completed_at: new Date().toISOString() }
        : {}),
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase
        .from("user_book_progress")
        .update(updateData)
        .eq("id", existing.id);
    } else {
      await supabase.from("user_book_progress").insert({
        user_id: userId,
        book_id: bookId,
        current_step: 7,
        ...updateData,
      });
    }

    // Actualizar books_completed en perfil si aprobo
    if (passed) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("books_completed")
        .eq("id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            books_completed: (profile.books_completed ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
    }

    router.refresh();
  }

  return (
    <ExamView
      exam={exam}
      questions={questions}
      bookTitle={bookTitle}
      bookSlug={bookSlug}
      bookId={bookId}
      userName={userName}
      previousScore={previousScore}
      attempts={attempts}
      onComplete={handleComplete}
    />
  );
}
