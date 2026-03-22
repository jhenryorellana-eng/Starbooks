import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { PodcastPlayer } from "@/components/steps/PodcastPlayer";
import { CompleteStepButton } from "@/components/steps/CompleteStepButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 5: Podcast de Expertos" };
}

export default async function Step5Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, completedSteps, currentStep } =
    await getBookData(bookSlug);

  const { data: podcast } = await supabase
    .from("step5_podcast")
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
            Paso 5
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {podcast?.title ?? `Expertos hablan sobre ${book.title}`}
          </h1>
        </div>

        {podcast && (
          <PodcastPlayer
            title={podcast.title}
            description={podcast.description}
            videoUrl={podcast.video_url}
            audioUrl={podcast.audio_url}
            durationSeconds={podcast.duration_seconds}
            speakers={podcast.speakers}
          />
        )}

        <CompleteStepButton
          bookId={book.id}
          bookSlug={book.slug}
          stepNumber={5}
          isCompleted={completedSteps[4]}
        />
      </div>
    </StepLayout>
  );
}
