"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/steps/StepLayout";
import { VideoPlayer } from "@/components/steps/VideoPlayer";
import { AIChatbot } from "@/components/steps/AIChatbot";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { INTELLIGENCES } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Step4Chapter, Book, Author, Intelligence } from "@/types";

interface ChapterViewProps {
  chapter: Step4Chapter;
  book: Book & { author: Author; intelligence: Intelligence };
  bookSlug: string;
  bookTitle: string;
  currentStep: number;
  completedSteps: boolean[];
  isChapterCompleted: boolean;
  prevChapterId: string | null;
  nextChapterId: string | null;
  totalChapters: number;
  completedChapterIds: string[];
  bookId: string;
}

export function ChapterView({
  chapter,
  book,
  bookSlug,
  bookTitle,
  currentStep,
  completedSteps,
  isChapterCompleted,
  prevChapterId,
  nextChapterId,
  totalChapters,
  completedChapterIds,
  bookId,
}: ChapterViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "chat">("video");

  const intel = INTELLIGENCES.find(
    (ig) => ig.slug === chapter.intelligence_type
  );

  async function handleMarkComplete() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const safeCompleted = completedChapterIds ?? [];
      const newCompleted = [...safeCompleted, chapter.id];
      const allDone = newCompleted.length >= totalChapters;

      const { data: existing } = await supabase
        .from("user_book_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .single();

      const updateData = {
        step4_chapters_completed: newCompleted,
        step4_completed: allDone,
        ...(allDone ? { current_step: Math.max(currentStep, 5) } : {}),
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase
          .from("user_book_progress")
          .update(updateData)
          .eq("id", existing.id);
      } else {
      await supabase.from("user_book_progress").insert({
        user_id: user.id,
        book_id: bookId,
        ...updateData,
      });
    }

      router.refresh();
    } catch {
      // Error silencioso — el refresh mostrara el estado real
    } finally {
      setLoading(false);
    }
  }

  return (
    <StepLayout
      bookSlug={bookSlug}
      bookTitle={bookTitle}
      currentStep={currentStep}
      completedSteps={completedSteps}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-accent-primary font-medium uppercase tracking-wider mb-1">
              Capitulo {chapter.chapter_number} de {totalChapters}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {chapter.title}
            </h1>
            {chapter.subtitle && (
              <p className="text-sm text-text-muted mt-1 italic">
                &quot;{chapter.subtitle}&quot;
              </p>
            )}
          </div>
          {intel && <Badge color={intel.color}>{intel.emoji} {intel.name}</Badge>}
        </div>

        {/* Mobile: tabs video/chat */}
        <div className="flex gap-2 lg:hidden">
          <button
            onClick={() => setActiveTab("video")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
              activeTab === "video"
                ? "bg-white/[0.08] text-text-primary border border-white/[0.15]"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Video className="h-4 w-4" />
            Video
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
              activeTab === "chat"
                ? "bg-white/[0.08] text-text-primary border border-white/[0.15]"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            IA Chat
          </button>
        </div>

        {/* Desktop: layout dividido 60/40 | Mobile: tabs */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className={cn(
              "lg:w-[60%]",
              activeTab !== "video" && "hidden lg:block"
            )}
          >
            <VideoPlayer videoUrl={chapter.video_url} title={chapter.title} />
          </div>

          <div
            className={cn(
              "lg:w-[40%]",
              activeTab !== "chat" && "hidden lg:block"
            )}
          >
            <AIChatbot
              chapterTitle={chapter.title}
              bookTitle={book.title}
              aiContext={chapter.ai_context ?? ""}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            {!isChapterCompleted ? (
              <Button onClick={handleMarkComplete} isLoading={loading}>
                <Check className="h-4 w-4" />
                Marcar completado
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-accent-primary text-sm">
                <Check className="h-4 w-4" />
                Capitulo completado
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {prevChapterId && (
              <Link href={`/libro/${bookSlug}/paso-4/${prevChapterId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>
              </Link>
            )}
            {nextChapterId && (
              <Link href={`/libro/${bookSlug}/paso-4/${nextChapterId}`}>
                <Button variant="secondary" size="sm">
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
