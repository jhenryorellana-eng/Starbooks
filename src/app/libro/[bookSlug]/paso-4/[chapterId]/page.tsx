import { createClient } from "@/lib/supabase/server";
import { getBookData } from "@/lib/get-book-data";
import { notFound } from "next/navigation";
import { ChapterView } from "./ChapterView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string; chapterId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const supabase = await createClient();
  const { data: chapter } = await supabase
    .from("step4_chapters")
    .select("title, chapter_number")
    .eq("id", chapterId)
    .single();

  return {
    title: chapter
      ? `Cap. ${chapter.chapter_number}: ${chapter.title}`
      : "Capitulo",
  };
}

export default async function ChapterPage({ params }: Props) {
  const { bookSlug, chapterId } = await params;
  const { supabase, book, completedSteps, currentStep, progress } =
    await getBookData(bookSlug);

  const { data: chapter } = await supabase
    .from("step4_chapters")
    .select("*")
    .eq("id", chapterId)
    .single();

  if (!chapter) notFound();

  const { data: allChapters } = await supabase
    .from("step4_chapters")
    .select("id, chapter_number, title")
    .eq("book_id", book.id)
    .order("sort_order");

  const completedChapterIds: string[] =
    (progress?.step4_chapters_completed as string[]) ?? [];

  const isChapterCompleted = completedChapterIds.includes(chapter.id);

  // Encontrar capitulos prev/next
  const chapterIndex = allChapters?.findIndex((c) => c.id === chapter.id) ?? -1;
  const prevChapter = chapterIndex > 0 ? allChapters![chapterIndex - 1] : null;
  const nextChapter =
    allChapters && chapterIndex < allChapters.length - 1
      ? allChapters[chapterIndex + 1]
      : null;

  return (
    <ChapterView
      chapter={chapter}
      book={book}
      bookSlug={book.slug}
      bookTitle={book.title}
      currentStep={currentStep}
      completedSteps={completedSteps}
      isChapterCompleted={isChapterCompleted}
      prevChapterId={prevChapter?.id ?? null}
      nextChapterId={nextChapter?.id ?? null}
      totalChapters={allChapters?.length ?? 0}
      completedChapterIds={completedChapterIds}
      bookId={book.id}
    />
  );
}
