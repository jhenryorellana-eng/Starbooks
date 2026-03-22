import { getBookData } from "@/lib/get-book-data";
import { StepLayout } from "@/components/steps/StepLayout";
import { Step7Client } from "./Step7Client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Paso 7: Examen + Certificado" };
}

export default async function Step7Page({ params }: Props) {
  const { bookSlug } = await params;
  const { supabase, book, user, progress, completedSteps, currentStep } =
    await getBookData(bookSlug);

  const { data: exam } = await supabase
    .from("step7_exams")
    .select("*")
    .eq("book_id", book.id)
    .single();

  let questions = null;
  if (exam) {
    const { data } = await supabase
      .from("step7_questions")
      .select("*")
      .eq("exam_id", exam.id)
      .order("sort_order");
    questions = data;
  }

  // Obtener nombre del perfil
  let userName = "Estudiante";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    if (profile?.full_name) userName = profile.full_name;
  }

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
            Paso 7
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Examen + Certificado
          </h1>
        </div>

        {exam && questions && questions.length > 0 ? (
          <Step7Client
            exam={exam}
            questions={questions}
            bookTitle={book.title}
            bookSlug={book.slug}
            bookId={book.id}
            userName={userName}
            previousScore={progress?.exam_score ?? null}
            attempts={progress?.exam_attempts ?? 0}
            userId={user?.id ?? null}
          />
        ) : (
          <p className="text-text-muted">Examen no disponible.</p>
        )}
      </div>
    </StepLayout>
  );
}
