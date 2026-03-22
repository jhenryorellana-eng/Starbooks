import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { MindMap } from "@/components/steps/MindMap";
import { CompleteStepButton } from "@/components/steps/CompleteStepButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 3: Mapa Conceptual" };
}

export default async function Step3Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, completedSteps, currentStep } =
    await getBookData(bookSlug);

  const { data: mindmap } = await supabase
    .from("step3_mindmap")
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
            Paso 3
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {mindmap?.title ?? `Mapa Conceptual: ${book.title}`}
          </h1>
          {mindmap?.description && (
            <p className="text-text-secondary mt-2">{mindmap.description}</p>
          )}
        </div>

        {mindmap && (
          <MindMap
            data={mindmap.mindmap_data}
            imageUrl={mindmap.image_url}
          />
        )}

        <CompleteStepButton
          bookId={book.id}
          bookSlug={book.slug}
          stepNumber={3}
          isCompleted={completedSteps[2]}
        />
      </div>
    </StepLayout>
  );
}
