import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { AudioPlayer } from "@/components/steps/AudioPlayer";
import { BookSummary } from "@/components/steps/BookSummary";
import { CompleteStepButton } from "@/components/steps/CompleteStepButton";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 2: Resumen del Libro" };
}

export default async function Step2Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, completedSteps, currentStep } =
    await getBookData(bookSlug);

  const { data: summary } = await supabase
    .from("step2_summary")
    .select("*")
    .eq("book_id", book.id)
    .single();

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
            Paso 2
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {summary?.title ?? `Resumen: ${book.title}`}
          </h1>
          <p className="text-text-secondary mt-2">
            Escucha el resumen completo del libro
          </p>
        </div>

        {/* Portada del libro como visual */}
        <div className="flex justify-center">
          <div
            className="w-40 h-52 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border border-border-subtle shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${book.intelligence?.color ?? "#D4AF37"}30, ${book.intelligence?.color ?? "#D4AF37"}10)`,
            }}
          >
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white/10" />
              </div>
            )}
          </div>
        </div>

        {/* Audio Player principal */}
        {summary?.audio_url && (
          <AudioPlayer
            audioUrl={summary.audio_url}
            title={`Resumen de ${book.title}`}
            durationSeconds={summary.audio_duration_seconds ?? undefined}
          />
        )}

        {/* Contenido escrito como complemento */}
        {summary && (
          <BookSummary
            contentHtml={summary.content_html}
            keyPoints={summary.key_points}
            readingTimeMinutes={summary.reading_time_minutes}
          />
        )}

        <CompleteStepButton
          bookId={book.id}
          bookSlug={book.slug}
          stepNumber={2}
          isCompleted={completedSteps[1]}
        />
      </div>
    </StepLayout>
  );
}
