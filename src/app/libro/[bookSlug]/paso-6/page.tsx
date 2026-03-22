import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { CommunityFeed } from "@/components/steps/CommunityFeed";
import { CompleteStepButton } from "@/components/steps/CompleteStepButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 6: Comunidad" };
}

export default async function Step6Page({ params }: Props) {
  const { bookSlug } = await params;
  const { book, user, completedSteps, currentStep } =
    await getBookData(bookSlug);

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
            Paso 6
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Comunidad: {book.title}
          </h1>
          <p className="text-text-secondary mt-2">
            Comparte tu opinion y debate con otros estudiantes
          </p>
        </div>

        <CommunityFeed bookId={book.id} userId={user?.id ?? null} />

        <CompleteStepButton
          bookId={book.id}
          bookSlug={book.slug}
          stepNumber={6}
          isCompleted={completedSteps[5]}
        />
      </div>
    </StepLayout>
  );
}
