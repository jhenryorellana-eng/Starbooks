"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";

interface Props {
  authors: { id: string; name: string }[];
  intelligences: { id: string; name: string; emoji: string }[];
  initial?: {
    id: string;
    title: string;
    description: string;
    author_id: string;
    intelligence_id: string;
    total_chapters: number;
    estimated_duration: string;
    difficulty: string;
    is_published: boolean;
    is_featured: boolean;
    cover_url: string;
  };
}

export function BookFormClient({ authors, intelligences, initial }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    author_id: initial?.author_id ?? "",
    intelligence_id: initial?.intelligence_id ?? "",
    total_chapters: initial?.total_chapters ?? 0,
    estimated_duration: initial?.estimated_duration ?? "",
    difficulty: initial?.difficulty ?? "intermedio",
    is_published: initial?.is_published ?? false,
    is_featured: initial?.is_featured ?? false,
    cover_url: initial?.cover_url ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSave() {
    if (!form.title.trim()) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const data = {
        title: form.title,
        slug: slugify(form.title),
        description: form.description || null,
        author_id: form.author_id || null,
        intelligence_id: form.intelligence_id || null,
        total_chapters: form.total_chapters,
        estimated_duration: form.estimated_duration || null,
        difficulty: form.difficulty,
        is_published: form.is_published,
        is_featured: form.is_featured,
        cover_url: form.cover_url || null,
        updated_at: new Date().toISOString(),
      };

      if (initial) {
        const { error: updateError } = await supabase.from("books").update(data).eq("id", initial.id);
        if (updateError) throw updateError;
        router.refresh();
      } else {
        const { data: newBook, error: insertError } = await supabase.from("books").insert(data).select("id").single();
        if (insertError) throw insertError;
        if (newBook) router.push(`/admin/libros/${newBook.id}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50";
  const labelClass = "text-xs text-text-muted font-medium";

  return (
    <div className="space-y-5 rounded-2xl bg-white/[0.02] border border-border-subtle p-6">
      <div>
        <label className={labelClass}>Titulo *</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Autor</label>
          <select value={form.author_id} onChange={(e) => setForm({ ...form, author_id: e.target.value })} className={inputClass}>
            <option value="">Seleccionar...</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Inteligencia</label>
          <select value={form.intelligence_id} onChange={(e) => setForm({ ...form, intelligence_id: e.target.value })} className={inputClass}>
            <option value="">Seleccionar...</option>
            {intelligences.map((i) => <option key={i.id} value={i.id}>{i.emoji} {i.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Capitulos</label>
          <input type="number" value={form.total_chapters} onChange={(e) => setForm({ ...form, total_chapters: Number(e.target.value) })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Duracion estimada</label>
          <input value={form.estimated_duration} onChange={(e) => setForm({ ...form, estimated_duration: e.target.value })} placeholder="4h 30min" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dificultad</label>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputClass}>
            <option value="basico">Basico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>URL de portada</label>
        <input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." className={inputClass} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-border-subtle" />
          <span className="text-sm text-text-secondary">Publicado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-border-subtle" />
          <span className="text-sm text-text-secondary">Destacado</span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} isLoading={loading}>
          {initial ? "Guardar cambios" : "Crear libro"}
        </Button>
        <Button variant="ghost" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </div>
  );
}
