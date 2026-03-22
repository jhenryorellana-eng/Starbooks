"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, BookOpen, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface BookRow {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  is_featured: boolean;
  total_chapters: number;
  author: { name: string } | null;
  intelligence: { name: string; emoji: string; color: string } | null;
}

export function LibrosClient({ books }: { books: BookRow[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Libros
        </h1>
        <Link href="/admin/libros/nuevo">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nuevo libro
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <Link key={book.id} href={`/admin/libros/${book.id}`}>
            <GlassCard className="p-4 flex items-center gap-4 cursor-pointer mb-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${book.intelligence?.color ?? "#D4AF37"}15`,
                }}
              >
                <BookOpen className="h-5 w-5" style={{ color: book.intelligence?.color ?? "#D4AF37" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {book.title}
                </p>
                <p className="text-xs text-text-muted">
                  {book.author?.name ?? "Sin autor"} &middot; {book.total_chapters} capitulos
                </p>
              </div>
              {book.intelligence && (
                <Badge color={book.intelligence.color} className="hidden sm:flex">
                  {book.intelligence.emoji} {book.intelligence.name}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                {book.is_published ? (
                  <Eye className="h-4 w-4 text-emerald-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-text-muted" />
                )}
                <Pencil className="h-4 w-4 text-text-muted" />
              </div>
            </GlassCard>
          </Link>
        ))}
        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-text-muted/20 mx-auto mb-3" />
            <p className="text-text-muted">No hay libros creados</p>
          </div>
        )}
      </div>
    </div>
  );
}
