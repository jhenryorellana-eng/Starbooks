"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Intelligence } from "@/types";
import { slugify } from "@/lib/utils";

export function InteligenciasClient({ intelligences }: { intelligences: Intelligence[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Intelligence | null>(null);
  const [form, setForm] = useState({ name: "", emoji: "", color: "#D4AF37", description: "", sort_order: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function openCreate() {
    setEditing(null);
    setForm({ name: "", emoji: "", color: "#D4AF37", description: "", sort_order: intelligences.length + 1 });
    setShowModal(true);
  }

  function openEdit(intel: Intelligence) {
    setEditing(intel);
    setForm({ name: intel.name, emoji: intel.emoji, color: intel.color, description: intel.description ?? "", sort_order: intel.sort_order });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.emoji.trim()) return;
    setLoading(true);
    const data = { name: form.name, slug: slugify(form.name), emoji: form.emoji, color: form.color, description: form.description || null, sort_order: form.sort_order };
    if (editing) {
      await supabase.from("intelligences").update(data).eq("id", editing.id);
    } else {
      await supabase.from("intelligences").insert(data);
    }
    setShowModal(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta inteligencia?")) return;
    await supabase.from("intelligences").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Inteligencias</h1>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4" />Nueva</Button>
      </div>

      <div className="space-y-3">
        {intelligences.map((intel) => (
          <GlassCard key={intel.id} hover={false} className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${intel.color}20` }}>
              {intel.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{intel.name}</p>
              <p className="text-xs text-text-muted truncate">{intel.description ?? ""}</p>
            </div>
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: intel.color }} />
            <div className="flex gap-2">
              <button onClick={() => openEdit(intel)} className="p-2 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors cursor-pointer"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(intel.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer"><Trash2 className="h-4 w-4" /></button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar inteligencia" : "Nueva inteligencia"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted font-medium">Nombre *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium">Emoji *</label>
              <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted font-medium">Color (hex)</label>
              <div className="flex gap-2 mt-1">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border-0" />
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium">Orden</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium">Descripcion</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50 resize-none" />
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
