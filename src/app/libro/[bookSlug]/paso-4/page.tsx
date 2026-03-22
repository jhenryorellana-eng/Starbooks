import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { ChapterList } from "@/components/steps/ChapterList";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 4: Libro Completo" };
}

export default async function Step4Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, completedSteps, currentStep, progress } =
    await getBookData(bookSlug);

  const { data: chapters } = await supabase
    .from("step4_chapters")
    .select("*")
    .eq("book_id", book.id)
    .order("sort_order");

  const completedChapterIds: string[] =
    (progress?.step4_chapters_completed as string[]) ?? [];

  return (
    <StepLayout
      bookSlug={book.slug}
      bookTitle={book.title}
      currentStep={currentStep}
      completedSteps={completedSteps}
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs text-accent-primary font-medium uppercase tracking-wider mb-2">
            Paso 4
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Libro Completo: {book.title}
          </h1>
          <p className="text-text-secondary mt-2">
            {chapters?.length ?? 0} capitulos &middot;{" "}
            {completedChapterIds.length} completados
          </p>
        </div>

        {chapters && (
          <ChapterList
            chapters={chapters}
            bookSlug={book.slug}
            completedChapterIds={completedChapterIds}
          />
        )}
      </div>
    </StepLayout>
  );
}
