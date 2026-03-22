import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { AudioPlayer } from "@/components/steps/AudioPlayer";
import { CompleteStepButton } from "@/components/steps/CompleteStepButton";
import { User } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  return { title: `Paso 1: Conoce al Autor` };
}

export default async function Step1Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, completedSteps, currentStep } =
    await getBookData(bookSlug);

  const { data: audioData } = await supabase
    .from("step1_author_audio")
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
            Paso 1
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {audioData?.title ?? `Conoce a ${book.author?.name}`}
          </h1>
          {audioData?.description && (
            <p className="text-text-secondary mt-2">{audioData.description}</p>
          )}
        </div>

        {/* Foto del autor */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-white/[0.03] border border-border-subtle">
            {book.author?.photo_url ? (
              <img
                src={book.author.photo_url}
                alt={book.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-20 w-20 text-white/10" />
              </div>
            )}
          </div>
        </div>

        {/* Audio Player */}
        {audioData && (
          <AudioPlayer
            audioUrl={audioData.audio_url}
            title={`Sobre ${book.author?.name}`}
            durationSeconds={audioData.duration_seconds ?? undefined}
          />
        )}

        {/* Bio del autor */}
        {book.author?.bio && (
          <div className="rounded-2xl bg-white/[0.03] border border-border-subtle p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Sobre el autor
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {book.author.bio}
            </p>
            {book.author.nationality && (
              <p className="text-xs text-text-muted mt-3">
                Nacionalidad: {book.author.nationality}
              </p>
            )}
          </div>
        )}

        <CompleteStepButton
          bookId={book.id}
          bookSlug={book.slug}
          stepNumber={1}
          isCompleted={completedSteps[0]}
        />
      </div>
    </StepLayout>
  );
}
