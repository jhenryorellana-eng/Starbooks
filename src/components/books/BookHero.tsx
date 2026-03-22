"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Clock, BookOpen, Play, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { Book, Author, Intelligence, UserBookProgress } from "@/types";
import { DIFFICULTY_LABELS } from "@/lib/constants";

interface BookHeroProps {
  book: Book & { author?: Author; intelligence?: Intelligence };
  progress?: UserBookProgress | null;
}

export function BookHero({ book, progress }: BookHeroProps) {
  const intelColor = book.intelligence?.color ?? "#D4AF37";
  const currentStep = progress?.current_step ?? 1;
  const completedSteps = progress
    ? [
        progress.step1_completed,
        progress.step2_completed,
        progress.step3_completed,
        progress.step4_completed,
        progress.step5_completed,
        progress.step6_completed,
        progress.step7_completed,
      ].filter(Boolean).length
    : 0;
  const progressPercent = Math.round((completedSteps / 7) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-2xl mb-8"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${intelColor}15, transparent 60%), linear-gradient(to bottom, transparent 40%, var(--bg-primary))`,
        }}
      />
      <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm" />

      <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        {/* Portada placeholder */}
        <div
          className="shrink-0 w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${intelColor}30, ${intelColor}10)`,
          }}
        >
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {book.intelligence && (
            <Badge color={intelColor}>
              {book.intelligence.emoji} {book.intelligence.name}
            </Badge>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            {book.title}
          </h1>

          {book.author && (
            <p className="text-text-secondary text-[17px] font-normal">por {book.author.name}</p>
          )}

          <p className="text-[15px] text-text-muted font-normal leading-relaxed line-clamp-3">
            {book.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            {book.estimated_duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {book.estimated_duration}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {book.total_chapters} capitulos
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              {DIFFICULTY_LABELS[book.difficulty] ?? book.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href={`/libro/${book.slug}/paso-${currentStep}`}>
              <Button size="lg">
                <Play className="h-4 w-4" />
                {progress ? `Continuar Paso ${currentStep}` : "Comenzar Paso 1"}
              </Button>
            </Link>
            {progress && (
              <div className="text-sm text-text-muted">
                <span className="text-accent-primary font-semibold">{progressPercent}%</span> completado
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
