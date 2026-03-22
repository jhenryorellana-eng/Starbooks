"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Book, Intelligence, Author } from "@/types";

interface BookCardProps {
  book: Book & { author?: Author; intelligence?: Intelligence };
  progress?: number;
  index?: number;
}

export function BookCard({ book, progress, index = 0 }: BookCardProps) {
  const intelColor = book.intelligence?.color ?? "#D4AF37";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/libro/${book.slug}`}>
        <div
          className={cn(
            "group relative rounded-2xl overflow-hidden",
            "bg-bg-card border border-border-subtle",
            "shadow-[0_2px_4px_rgba(0,0,0,0.4),0_8px_20px_rgba(0,0,0,0.2)]",
            "hover:bg-bg-card-hover hover:border-border-hover",
            "hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.5),0_16px_32px_rgba(0,0,0,0.25)]",
            "transition-all duration-300 ease-out",
            "cursor-pointer"
          )}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 8px rgba(0,0,0,0.5), 0 16px 32px rgba(0,0,0,0.25), 0 0 30px ${intelColor}15, 0 0 60px ${intelColor}08`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "";
          }}
        >
          {/* Cover placeholder */}
          <div
            className="aspect-[3/4] w-full relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${intelColor}20, ${intelColor}05)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/10" />
            </div>
            {book.cover_url && (
              <img
                src={book.cover_url}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Badge inteligencia */}
            {book.intelligence && (
              <div className="absolute top-3 left-3">
                <Badge color={intelColor}>
                  {book.intelligence.emoji} {book.intelligence.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-text-primary text-sm leading-tight line-clamp-2 group-hover:text-accent-primary transition-colors">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-xs text-text-muted">{book.author.name}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              {book.estimated_duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {book.estimated_duration}
                </span>
              )}
              {book.total_chapters > 0 && (
                <span>{book.total_chapters} capitulos</span>
              )}
            </div>
            {progress !== undefined && progress > 0 && (
              <ProgressBar value={progress} max={7} color={intelColor} />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
