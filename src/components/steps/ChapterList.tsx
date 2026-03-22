"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Play, Check, Clock } from "lucide-react";
import Link from "next/link";
import { INTELLIGENCES } from "@/lib/constants";
import type { Step4Chapter } from "@/types";

interface ChapterListProps {
  chapters: Step4Chapter[];
  bookSlug: string;
  completedChapterIds: string[];
}

export function ChapterList({
  chapters,
  bookSlug,
  completedChapterIds,
}: ChapterListProps) {
  return (
    <div className="space-y-3">
      {chapters.map((chapter, i) => {
        const isCompleted = completedChapterIds.includes(chapter.id);
        const intel = INTELLIGENCES.find(
          (ig) => ig.slug === chapter.intelligence_type
        );

        return (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={`/libro/${bookSlug}/paso-4/${chapter.id}`}>
              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer",
                  "backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]",
                  "hover:bg-white/[0.06] hover:border-white/[0.15]",
                  isCompleted && "border-accent-primary/20 bg-accent-primary/[0.03]"
                )}
              >
                {/* Numero */}
                <div
                  className={cn(
                    "shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold",
                    isCompleted
                      ? "bg-accent-primary text-bg-primary"
                      : "bg-white/[0.06] text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    chapter.chapter_number
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {chapter.title}
                  </h3>
                  {chapter.subtitle && (
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {chapter.subtitle}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="shrink-0 flex items-center gap-2">
                  {intel && (
                    <Badge color={intel.color} className="hidden sm:flex">
                      {intel.emoji}
                    </Badge>
                  )}
                  <Play className="h-4 w-4 text-text-muted" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
