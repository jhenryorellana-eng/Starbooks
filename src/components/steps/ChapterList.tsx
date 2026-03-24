"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Play, Check, BookOpen } from "lucide-react";
import Link from "next/link";
import { INTELLIGENCES } from "@/lib/constants";
import type { Step4Chapter } from "@/types";

interface ChapterListProps {
  chapters: Step4Chapter[];
  bookSlug: string;
  completedChapterIds: string[];
}

interface ModuleGroup {
  moduleNumber: number;
  moduleTitle: string;
  chapters: Step4Chapter[];
}

function groupByModule(chapters: Step4Chapter[]): ModuleGroup[] {
  const map = new Map<number, ModuleGroup>();

  for (const ch of chapters) {
    const num = ch.module_number ?? 1;
    if (!map.has(num)) {
      map.set(num, {
        moduleNumber: num,
        moduleTitle: ch.module_title || `Modulo ${num}`,
        chapters: [],
      });
    }
    map.get(num)!.chapters.push(ch);
  }

  return Array.from(map.values()).sort(
    (a, b) => a.moduleNumber - b.moduleNumber
  );
}

export function ChapterList({
  chapters,
  bookSlug,
  completedChapterIds,
}: ChapterListProps) {
  const modules = groupByModule(chapters);

  return (
    <div className="space-y-8">
      {modules.map((mod, mi) => {
        const completedInModule = mod.chapters.filter((ch) =>
          completedChapterIds.includes(ch.id)
        ).length;

        return (
          <motion.div
            key={mod.moduleNumber}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.1 }}
          >
            {/* Module Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-accent-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-text-primary">
                  Modulo {mod.moduleNumber}: {mod.moduleTitle}
                </h3>
                <p className="text-[11px] text-text-muted">
                  {completedInModule}/{mod.chapters.length} capitulos completados
                </p>
              </div>
            </div>

            {/* Chapters in module */}
            <div className="space-y-2 pl-2 border-l-2 border-accent-primary/10 ml-4">
              {mod.chapters.map((chapter, i) => {
                const isCompleted = completedChapterIds.includes(chapter.id);
                const intel = INTELLIGENCES.find(
                  (ig) => ig.slug === chapter.intelligence_type
                );

                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mi * 0.1 + i * 0.05 }}
                  >
                    <Link href={`/libro/${bookSlug}/paso-4/${chapter.id}`}>
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer",
                          "bg-white/[0.02] border border-white/[0.06]",
                          "hover:bg-white/[0.05] hover:border-white/[0.12]",
                          isCompleted &&
                            "border-accent-primary/20 bg-accent-primary/[0.03]"
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold",
                            isCompleted
                              ? "bg-accent-primary text-bg-primary"
                              : "bg-white/[0.06] text-text-muted"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            chapter.chapter_number
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-text-primary truncate">
                            {chapter.title}
                          </h4>
                          {chapter.subtitle && (
                            <p className="text-[11px] text-text-muted truncate mt-0.5">
                              {chapter.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {intel && (
                            <Badge color={intel.color} className="hidden sm:flex text-[10px]">
                              {intel.emoji}
                            </Badge>
                          )}
                          <Play className="h-3.5 w-3.5 text-text-muted" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
