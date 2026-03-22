"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import type { Author } from "@/types";
import { slugify } from "@/lib/utils";

export function AutoresClient({ authors }: { authors: Author[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [form, setForm] = useState({ name: "", bio: "", nationality: "", photo_url: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function openCreate() {
    setEditing(null);
    setForm({ name: "", bio: "", nationality: "", photo_url: "" });
    setShowModal(true);
  }

  function openEdit(author: Author) {
    setEditing(author);
    setForm({
      name: author.name,
      bio: author.bio ?? "",
      nationality: author.nationality ?? "",
      photo_url: author.photo_url ?? "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setLoading(true);

    const data = {
      name: form.name,
      slug: slugify(form.name),
      bio: form.bio || null,
      nationality: form.nationality || null,
      photo_url: form.photo_url || null,
    };

    if (editing) {
      await supabase.from("authors").update(data).eq("id", editing.id);
    } else {
      await supabase.from("authors").insert(data);
    }

    setShowModal(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este autor?")) return;
    await supabase.from("authors").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Autores
        </h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          Nuevo autor
        </Button>
      </div>

      <div className="space-y-3">
        {authors.map((author) => (
          <GlassCard key={author.id} hover={false} className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
              {author.photo_url ? (
                <img src={author.photo_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{author.name}</p>
              <p className="text-xs text-text-muted truncate">{author.nationality ?? "Sin nacionalidad"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(author)} className="p-2 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(author.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        ))}
        {authors.length === 0 && (
          <p className="text-center text-text-muted py-8">No hay autores</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar autor" : "Nuevo autor"}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-text-muted font-medium">Nombre *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium">Nacionalidad</label>
            <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium">URL de foto</label>
            <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium">Biografia</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50 resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={loading}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
