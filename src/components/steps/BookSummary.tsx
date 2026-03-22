"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lightbulb } from "lucide-react";

interface BookSummaryProps {
  contentHtml: string;
  keyPoints: string[] | null;
  readingTimeMinutes: number | null;
}

export function BookSummary({
  contentHtml,
  keyPoints,
  readingTimeMinutes,
}: BookSummaryProps) {
  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(contentHtml, { ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "p", "strong", "em", "ul", "ol", "li", "a", "br"], ALLOWED_ATTR: ["href", "target", "rel"] }),
    [contentHtml]
  );

  return (
    <div className="space-y-8">
      {readingTimeMinutes && (
        <p className="text-xs text-text-muted">
          Tiempo de lectura estimado: {readingTimeMinutes} min
        </p>
      )}

      {/* Contenido HTML */}
      <div
        className="prose prose-invert prose-sm max-w-none
          prose-headings:tracking-tight
          prose-headings:text-text-primary
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-text-secondary prose-p:leading-relaxed
          prose-strong:text-accent-primary prose-strong:font-semibold
          prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      {/* Puntos clave */}
      {keyPoints && keyPoints.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary tracking-tight mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent-primary" />
            Puntos clave
          </h3>
          <div className="grid gap-3">
            {keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover={false} className="p-4 flex items-start gap-3">
                  <span className="text-accent-primary font-bold text-sm shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {point}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
