import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BookEditorClient } from "./BookEditorClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("books").select("title").eq("id", id).single();
  return { title: data?.title ?? "Editar libro" };
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase.from("books").select("*").eq("id", id).single();
  if (!book) notFound();

  const [
    { data: authors },
    { data: intelligences },
    { data: step1 },
    { data: step2 },
    { data: step3 },
    { data: chapters },
    { data: step5 },
    { data: exam },
  ] = await Promise.all([
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("intelligences").select("id, name, emoji").order("sort_order"),
    supabase.from("step1_author_audio").select("*").eq("book_id", id).single(),
    supabase.from("step2_summary").select("*").eq("book_id", id).single(),
    supabase.from("step3_mindmap").select("*").eq("book_id", id).single(),
    supabase.from("step4_chapters").select("*").eq("book_id", id).order("sort_order"),
    supabase.from("step5_podcast").select("*").eq("book_id", id).single(),
    supabase.from("step7_exams").select("*").eq("book_id", id).single(),
  ]);

  let questions = null;
  if (exam) {
    const { data } = await supabase.from("step7_questions").select("*").eq("exam_id", exam.id).order("sort_order");
    questions = data;
  }

  return (
    <BookEditorClient
      book={book}
      authors={authors ?? []}
      intelligences={intelligences ?? []}
      step1={step1}
      step2={step2}
      step3={step3}
      chapters={chapters ?? []}
      step5={step5}
      exam={exam}
      questions={questions ?? []}
    />
  );
}
