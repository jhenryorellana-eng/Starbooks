"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { cn } from "@/lib/utils";
import type { Book, Intelligence, Author } from "@/types";

interface Props {
  books: (Book & { author: Author; intelligence: Intelligence })[];
  intelligences: Intelligence[];
}

export function BibliotecaClient({ books, intelligences }: Props) {
  const [selectedIntel, setSelectedIntel] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = books.filter((book) => {
    const matchesIntel =
      !selectedIntel || book.intelligence?.slug === selectedIntel;
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.name.toLowerCase().includes(search.toLowerCase());
    return matchesIntel && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
          Biblioteca
        </h1>
        <p className="text-text-secondary text-[17px] font-normal mt-3">
          {books.length} {books.length === 1 ? "libro" : "libros"} disponibles
        </p>
      </motion.div>

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar libro o autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Filtros por inteligencia */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        <button
          onClick={() => setSelectedIntel(null)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer",
            !selectedIntel
              ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
              : "bg-white/[0.03] text-text-muted border border-border-subtle hover:border-border-hover hover:text-text-secondary"
          )}
        >
          Todos
        </button>
        {intelligences.map((intel) => (
          <button
            key={intel.slug}
            onClick={() =>
              setSelectedIntel(
                selectedIntel === intel.slug ? null : intel.slug
              )
            }
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer",
              selectedIntel === intel.slug
                ? "border"
                : "bg-white/[0.03] text-text-muted border border-border-subtle hover:border-border-hover hover:text-text-secondary"
            )}
            style={
              selectedIntel === intel.slug
                ? {
                    backgroundColor: `${intel.color}20`,
                    color: intel.color,
                    borderColor: `${intel.color}40`,
                  }
                : undefined
            }
          >
            {intel.emoji} {intel.name}
          </button>
        ))}
      </motion.div>

      {/* Grid de libros */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <BookOpen className="h-16 w-16 text-text-muted/30 mb-4" />
          <p className="text-text-muted text-lg">
            No se encontraron libros
          </p>
          <p className="text-text-muted/60 text-sm mt-1">
            Intenta con otro filtro o busqueda
          </p>
        </motion.div>
      )}
    </div>
  );
}
