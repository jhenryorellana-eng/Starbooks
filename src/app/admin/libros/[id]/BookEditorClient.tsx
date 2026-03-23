"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookFormClient } from "../BookFormClient";
import { cn } from "@/lib/utils";
import {
  Headphones,
  BookOpen,
  Map,
  Clapperboard,
  Mic,
  Trophy,
  Plus,
  Trash2,
  Save,
  GripVertical,
} from "lucide-react";
import type { Book, Step1AuthorAudio, Step2Summary, Step3MindMap, Step4Chapter, Step5Podcast, Step7Exam, Step7Question } from "@/types";
import { VideoUpload } from "@/components/admin/VideoUpload";

interface Props {
  book: Book;
  authors: { id: string; name: string }[];
  intelligences: { id: string; name: string; emoji: string }[];
  step1: Step1AuthorAudio | null;
  step2: Step2Summary | null;
  step3: Step3MindMap | null;
  chapters: Step4Chapter[];
  step5: Step5Podcast | null;
  exam: Step7Exam | null;
  questions: Step7Question[];
}

type Tab = "info" | "paso1" | "paso2" | "paso3" | "paso4" | "paso5" | "paso7";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "info", label: "Info", icon: BookOpen },
  { id: "paso1", label: "Audio Autor", icon: Headphones },
  { id: "paso2", label: "Resumen", icon: BookOpen },
  { id: "paso3", label: "Mapa", icon: Map },
  { id: "paso4", label: "Capitulos", icon: Clapperboard },
  { id: "paso5", label: "Podcast", icon: Mic },
  { id: "paso7", label: "Examen", icon: Trophy },
];

export function BookEditorClient({
  book,
  authors,
  intelligences,
  step1,
  step2,
  step3,
  chapters,
  step5,
  exam,
  questions,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight">
        {book.title}
      </h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
              activeTab === tab.id
                ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/30"
                : "text-text-muted hover:text-text-secondary hover:bg-white/[0.04]"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "info" && (
        <BookFormClient
          authors={authors}
          intelligences={intelligences}
          initial={{
            id: book.id,
            title: book.title,
            description: book.description ?? "",
            author_id: book.author_id ?? "",
            intelligence_id: book.intelligence_id ?? "",
            total_chapters: book.total_chapters,
            estimated_duration: book.estimated_duration ?? "",
            difficulty: book.difficulty,
            is_published: book.is_published,
            is_featured: book.is_featured,
            cover_url: book.cover_url ?? "",
          }}
        />
      )}

      {activeTab === "paso1" && <Step1Editor bookId={book.id} data={step1} />}
      {activeTab === "paso2" && <Step2Editor bookId={book.id} data={step2} />}
      {activeTab === "paso3" && <Step3Editor bookId={book.id} data={step3} />}
      {activeTab === "paso4" && <Step4Editor bookId={book.id} chapters={chapters} />}
      {activeTab === "paso5" && <Step5Editor bookId={book.id} data={step5} />}
      {activeTab === "paso7" && <Step7Editor bookId={book.id} exam={exam} questions={questions} />}
    </div>
  );
}

const inputClass = "w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50";
const labelClass = "text-xs text-text-muted font-medium";
const sectionClass = "rounded-2xl bg-white/[0.02] border border-border-subtle p-6 space-y-5";

// ===== PASO 1: AUDIO DEL AUTOR =====
function Step1Editor({ bookId, data }: { bookId: string; data: Step1AuthorAudio | null }) {
  const [form, setForm] = useState({
    title: data?.title ?? "",
    description: data?.description ?? "",
    audio_url: data?.audio_url ?? "",
    duration_seconds: String(data?.duration_seconds ?? ""),
    transcript: data?.transcript ?? "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    const supabase = createClient();
    const payload = { ...form, book_id: bookId, duration_seconds: Number(form.duration_seconds) || null };
    if (data?.id) {
      await supabase.from("step1_author_audio").update(payload).eq("id", data.id);
    } else {
      await supabase.from("step1_author_audio").insert(payload);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className={sectionClass}>
      <h3 className="text-sm font-semibold text-text-primary">Paso 1: Audio del Autor</h3>
      <div><label className={labelClass}>Titulo</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Descripcion</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>URL de audio *</label><input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} placeholder="https://..." className={inputClass} /></div>
        <div><label className={labelClass}>Duracion (segundos)</label><input type="number" value={form.duration_seconds} onChange={(e) => setForm({ ...form, duration_seconds: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Transcripcion</label><textarea value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} rows={4} className={`${inputClass} resize-none`} /></div>
      <Button onClick={save} isLoading={loading}><Save className="h-4 w-4" />Guardar Paso 1</Button>
    </div>
  );
}

// ===== PASO 2: RESUMEN =====
function Step2Editor({ bookId, data }: { bookId: string; data: Step2Summary | null }) {
  const [form, setForm] = useState({
    title: data?.title ?? "",
    audio_url: data?.audio_url ?? "",
    audio_duration_seconds: String(data?.audio_duration_seconds ?? ""),
    content_html: data?.content_html ?? "",
    key_points: (data?.key_points as string[] ?? []).join("\n"),
    reading_time_minutes: String(data?.reading_time_minutes ?? ""),
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    const supabase = createClient();
    const points = form.key_points.split("\n").map((p) => p.trim()).filter(Boolean);
    const payload = {
      book_id: bookId,
      title: form.title,
      audio_url: form.audio_url || null,
      audio_duration_seconds: Number(form.audio_duration_seconds) || null,
      content_html: form.content_html,
      key_points: points.length > 0 ? points : null,
      reading_time_minutes: Number(form.reading_time_minutes) || null,
    };
    if (data?.id) {
      await supabase.from("step2_summary").update(payload).eq("id", data.id);
    } else {
      await supabase.from("step2_summary").insert(payload);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className={sectionClass}>
      <h3 className="text-sm font-semibold text-text-primary">Paso 2: Resumen del Libro (Audio)</h3>
      <div><label className={labelClass}>Titulo</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>URL de audio del resumen *</label><input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} placeholder="https://..." className={inputClass} /></div>
        <div><label className={labelClass}>Duracion del audio (segundos)</label><input type="number" value={form.audio_duration_seconds} onChange={(e) => setForm({ ...form, audio_duration_seconds: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Contenido HTML (complemento escrito)</label><textarea value={form.content_html} onChange={(e) => setForm({ ...form, content_html: e.target.value })} rows={10} className={`${inputClass} resize-none font-mono text-xs`} placeholder="<h2>Titulo</h2><p>Contenido...</p>" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Puntos clave (uno por linea)</label><textarea value={form.key_points} onChange={(e) => setForm({ ...form, key_points: e.target.value })} rows={6} className={`${inputClass} resize-none`} placeholder="Los ricos no trabajan por dinero&#10;Un activo pone dinero en tu bolsillo" /></div>
        <div><label className={labelClass}>Tiempo de lectura (min)</label><input type="number" value={form.reading_time_minutes} onChange={(e) => setForm({ ...form, reading_time_minutes: e.target.value })} className={inputClass} /></div>
      </div>
      <Button onClick={save} isLoading={loading}><Save className="h-4 w-4" />Guardar Paso 2</Button>
    </div>
  );
}

// ===== PASO 3: MAPA CONCEPTUAL (Editor Visual) =====
const NODE_COLORS = [
  { label: "Dorado", value: "#D4AF37" },
  { label: "Violeta", value: "#6C63FF" },
  { label: "Rojo", value: "#FF6B6B" },
  { label: "Verde", value: "#10B981" },
  { label: "Purpura", value: "#A78BFA" },
  { label: "Naranja", value: "#F97316" },
  { label: "Cyan", value: "#06B6D4" },
];

interface EditorNode {
  id: string;
  label: string;
  color: string;
  size: "lg" | "md" | "sm";
  parentId: string | null;
}

function buildEditorNodes(data: Step3MindMap | null): EditorNode[] {
  if (!data?.mindmap_data?.nodes?.length) return [];
  const nodes = data.mindmap_data.nodes;
  const edges = data.mindmap_data.edges;

  return nodes.map((n) => {
    const parentEdge = edges.find((e) => e.to === n.id);
    return {
      id: n.id,
      label: n.label.replace(/\n/g, " "),
      color: n.color ?? "#D4AF37",
      size: n.size ?? "sm",
      parentId: parentEdge?.from ?? null,
    };
  });
}

function editorNodesToMindMapData(nodes: EditorNode[]): { nodes: any[]; edges: any[] } {
  const root = nodes.find((n) => n.size === "lg");
  if (!root) return { nodes: [], edges: [] };

  const level1 = nodes.filter((n) => n.parentId === root.id);
  const total1 = level1.length;
  const CX = 400, CY = 300, R1 = 200;

  const positioned = nodes.map((n) => {
    if (n.size === "lg") return { ...n, x: CX, y: CY };

    if (n.parentId === root.id) {
      const idx = level1.indexOf(n);
      const angle = -Math.PI / 2 + (idx / Math.max(total1, 1)) * Math.PI * 2 + Math.PI / total1;
      return { ...n, x: Math.round(CX + Math.cos(angle) * R1), y: Math.round(CY + Math.sin(angle) * R1) };
    }

    // Sub-nodo: posicionar relativo al padre
    const parent = nodes.find((p) => p.id === n.parentId);
    if (!parent) return { ...n, x: CX, y: CY };
    const parentInLevel1 = level1.indexOf(parent);
    const parentAngle = -Math.PI / 2 + (parentInLevel1 / Math.max(total1, 1)) * Math.PI * 2 + Math.PI / total1;
    const parentX = CX + Math.cos(parentAngle) * R1;
    const parentY = CY + Math.sin(parentAngle) * R1;
    const siblings = nodes.filter((s) => s.parentId === n.parentId);
    const sibIdx = siblings.indexOf(n);
    const spread = Math.PI * 0.6;
    const startAngle = parentAngle - spread / 2;
    const subAngle = startAngle + (sibIdx / Math.max(siblings.length, 1)) * spread + spread / siblings.length / 2;
    return { ...n, x: Math.round(parentX + Math.cos(subAngle) * 120), y: Math.round(parentY + Math.sin(subAngle) * 120) };
  });

  return {
    nodes: positioned.map((n) => ({
      id: n.id,
      label: n.label,
      x: n.x,
      y: n.y,
      color: n.color,
      size: n.size,
    })),
    edges: nodes
      .filter((n) => n.parentId)
      .map((n) => ({ from: n.parentId!, to: n.id })),
  };
}

function Step3Editor({ bookId, data }: { bookId: string; data: Step3MindMap | null }) {
  const [title, setTitle] = useState(data?.title ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [nodes, setNodes] = useState<EditorNode[]>(() => {
    const existing = buildEditorNodes(data);
    if (existing.length > 0) return existing;
    return [{ id: "center", label: "Titulo del libro", color: "#D4AF37", size: "lg" as const, parentId: null }];
  });
  const [loading, setLoading] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const router = useRouter();

  const rootNode = nodes.find((n) => n.size === "lg");

  function addNode(parentId: string, size: "md" | "sm") {
    const newId = `n${Date.now()}`;
    setNodes((prev) => [...prev, { id: newId, label: "Nuevo concepto", color: "#6C63FF", size, parentId }]);
    setEditingNode(newId);
  }

  function updateNode(id: string, field: Partial<EditorNode>) {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, ...field } : n));
  }

  function removeNode(id: string) {
    // Eliminar nodo y todos sus descendientes
    const toRemove = new Set<string>();
    function collectDescendants(nodeId: string) {
      toRemove.add(nodeId);
      nodes.filter((n) => n.parentId === nodeId).forEach((n) => collectDescendants(n.id));
    }
    collectDescendants(id);
    setNodes((prev) => prev.filter((n) => !toRemove.has(n.id)));
    if (editingNode && toRemove.has(editingNode)) setEditingNode(null);
  }

  async function save() {
    setLoading(true);
    const supabase = createClient();
    const mindmapData = editorNodesToMindMapData(nodes);
    const payload = {
      book_id: bookId,
      title,
      description: description || null,
      mindmap_data: mindmapData,
      image_url: null,
    };
    if (data?.id) {
      await supabase.from("step3_mindmap").update(payload).eq("id", data.id);
    } else {
      await supabase.from("step3_mindmap").insert(payload);
    }
    setLoading(false);
    router.refresh();
  }

  const level1Nodes = nodes.filter((n) => n.parentId === rootNode?.id);

  return (
    <div className={sectionClass}>
      <h3 className="text-sm font-semibold text-text-primary">Paso 3: Mapa Conceptual</h3>

      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Titulo</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Descripcion</label><input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} /></div>
      </div>

      {/* Nodo central */}
      {rootNode && (
        <div className="rounded-xl border-2 p-4 space-y-3" style={{ borderColor: `${rootNode.color}40`, background: `${rootNode.color}08` }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: rootNode.color }}>Nodo central</span>
            <div className="flex gap-1">
              {NODE_COLORS.map((c) => (
                <button key={c.value} onClick={() => updateNode(rootNode.id, { color: c.value })} className="h-5 w-5 rounded-full border-2 cursor-pointer" style={{ backgroundColor: c.value, borderColor: rootNode.color === c.value ? "white" : "transparent" }} />
              ))}
            </div>
          </div>
          <input value={rootNode.label} onChange={(e) => updateNode(rootNode.id, { label: e.target.value })} className={inputClass} placeholder="Titulo central del mapa" />
          <Button variant="secondary" size="sm" onClick={() => addNode(rootNode.id, "md")}>
            <Plus className="h-3.5 w-3.5" />Agregar rama principal
          </Button>
        </div>
      )}

      {/* Ramas principales (nivel 1) */}
      {level1Nodes.map((node) => {
        const subNodes = nodes.filter((n) => n.parentId === node.id);
        return (
          <div key={node.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: `${node.color}30`, background: `${node.color}05` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                <input value={node.label} onChange={(e) => updateNode(node.id, { label: e.target.value })} className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div className="flex items-center gap-1">
                {NODE_COLORS.map((c) => (
                  <button key={c.value} onClick={() => updateNode(node.id, { color: c.value })} className="h-4 w-4 rounded-full border cursor-pointer" style={{ backgroundColor: c.value, borderColor: node.color === c.value ? "white" : "transparent" }} />
                ))}
                <button onClick={() => removeNode(node.id)} className="p-1 ml-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-nodos */}
            {subNodes.length > 0 && (
              <div className="pl-5 space-y-2 border-l-2" style={{ borderColor: `${node.color}20` }}>
                {subNodes.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                    <input value={sub.label} onChange={(e) => updateNode(sub.id, { label: e.target.value })} className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-accent-primary/50" />
                    <div className="flex gap-0.5">
                      {NODE_COLORS.slice(0, 4).map((c) => (
                        <button key={c.value} onClick={() => updateNode(sub.id, { color: c.value })} className="h-3 w-3 rounded-full border cursor-pointer" style={{ backgroundColor: c.value, borderColor: sub.color === c.value ? "white" : "transparent" }} />
                      ))}
                    </div>
                    <button onClick={() => removeNode(sub.id)} className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => addNode(node.id, "sm")} className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer flex items-center gap-1 pl-5">
              <Plus className="h-3 w-3" />Agregar sub-concepto
            </button>
          </div>
        );
      })}

      {/* Preview */}
      <div className="rounded-xl border border-border-subtle p-3">
        <p className="text-xs text-text-muted mb-2">Preview ({nodes.length} nodos)</p>
        <div className="flex flex-wrap gap-2">
          {nodes.map((n) => (
            <span key={n.id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${n.color}15`, color: n.color, border: `1px solid ${n.color}30` }}>
              {n.size === "lg" ? "●" : n.size === "md" ? "◉" : "○"} {n.label}
            </span>
          ))}
        </div>
      </div>

      <Button onClick={save} isLoading={loading}><Save className="h-4 w-4" />Guardar Mapa Conceptual</Button>
    </div>
  );
}

// ===== PASO 4: CAPITULOS =====
function Step4Editor({ bookId, chapters: initial }: { bookId: string; chapters: Step4Chapter[] }) {
  const [chapters, setChapters] = useState(initial.map((c) => ({ ...c, _dirty: false })));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function addChapter() {
    setChapters((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        book_id: bookId,
        chapter_number: prev.length + 1,
        title: "",
        subtitle: "",
        video_url: "",
        video_duration_seconds: null,
        intelligence_type: "",
        ai_context: "",
        key_concepts: null,
        sort_order: prev.length + 1,
        _dirty: true,
      } as any,
    ]);
  }

  function updateChapter(index: number, field: string, value: any) {
    setChapters((prev) => prev.map((c, i) => i === index ? { ...c, [field]: value, _dirty: true } : c));
  }

  async function removeChapter(index: number) {
    const ch = chapters[index];
    if (!ch.id.startsWith("new-")) {
      const supabase = createClient();
      await supabase.from("step4_chapters").delete().eq("id", ch.id);
    }
    setChapters((prev) => prev.filter((_, i) => i !== index));
    router.refresh();
  }

  async function saveAll() {
    setLoading(true);
    const supabase = createClient();

    for (const ch of chapters) {
      if (!(ch as any)._dirty) continue;
      const payload = {
        book_id: bookId,
        chapter_number: ch.chapter_number,
        title: ch.title,
        subtitle: ch.subtitle || null,
        video_url: ch.video_url || "https://placeholder-video.com",
        video_duration_seconds: ch.video_duration_seconds,
        intelligence_type: ch.intelligence_type || null,
        ai_context: ch.ai_context || null,
        sort_order: ch.sort_order,
      };

      if (ch.id.startsWith("new-")) {
        await supabase.from("step4_chapters").insert(payload);
      } else {
        await supabase.from("step4_chapters").update(payload).eq("id", ch.id);
      }
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className={sectionClass}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Paso 4: Capitulos ({chapters.length})</h3>
        <Button variant="secondary" size="sm" onClick={addChapter}><Plus className="h-3.5 w-3.5" />Agregar</Button>
      </div>

      <div className="space-y-4">
        {chapters.map((ch, i) => (
          <div key={ch.id} className="rounded-xl bg-white/[0.02] border border-border-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-accent-primary font-bold">Capitulo {i + 1}</span>
              <button onClick={() => removeChapter(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Titulo *</label><input value={ch.title} onChange={(e) => updateChapter(i, "title", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Subtitulo</label><input value={ch.subtitle ?? ""} onChange={(e) => updateChapter(i, "subtitle", e.target.value)} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Video</label><VideoUpload value={ch.video_url} onChange={(url) => updateChapter(i, "video_url", url)} folder={`chapters/${bookId}`} /></div>
              <div><label className={labelClass}>Tipo de inteligencia</label><input value={ch.intelligence_type ?? ""} onChange={(e) => updateChapter(i, "intelligence_type", e.target.value)} placeholder="financiera, mental..." className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Contexto para IA</label><textarea value={ch.ai_context ?? ""} onChange={(e) => updateChapter(i, "ai_context", e.target.value)} rows={3} className={`${inputClass} resize-none text-xs`} placeholder="Describe de que trata este capitulo para que el chatbot pueda responder preguntas..." /></div>
          </div>
        ))}
      </div>

      <Button onClick={saveAll} isLoading={loading}><Save className="h-4 w-4" />Guardar todos los capitulos</Button>
    </div>
  );
}

// ===== PASO 5: PODCAST =====
function Step5Editor({ bookId, data }: { bookId: string; data: Step5Podcast | null }) {
  const [form, setForm] = useState({
    title: data?.title ?? "",
    description: data?.description ?? "",
    video_url: data?.video_url ?? "",
    audio_url: data?.audio_url ?? "",
    duration_seconds: String(data?.duration_seconds ?? ""),
    speakers: data?.speakers ? JSON.stringify(data.speakers, null, 2) : '[{"name":"","role":"","photo":""}]',
  });
  const [jsonError, setJsonError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    const supabase = createClient();
    let speakersJson;
    try { speakersJson = JSON.parse(form.speakers); } catch { setLoading(false); setJsonError("JSON invalido en speakers"); return; }
    const payload = {
      book_id: bookId,
      title: form.title,
      description: form.description || null,
      video_url: form.video_url || null,
      audio_url: form.audio_url || null,
      duration_seconds: Number(form.duration_seconds) || null,
      speakers: speakersJson,
    };
    if (data?.id) {
      await supabase.from("step5_podcast").update(payload).eq("id", data.id);
    } else {
      await supabase.from("step5_podcast").insert(payload);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className={sectionClass}>
      <h3 className="text-sm font-semibold text-text-primary">Paso 5: Podcast / Video de Expertos</h3>
      <div><label className={labelClass}>Titulo</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Descripcion</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Video</label><VideoUpload value={form.video_url} onChange={(url) => setForm({ ...form, video_url: url })} folder={`podcast/${bookId}`} /></div>
        <div><label className={labelClass}>URL de audio (alternativa)</label><input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Duracion (segundos)</label><input type="number" value={form.duration_seconds} onChange={(e) => setForm({ ...form, duration_seconds: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Speakers (JSON)</label><textarea value={form.speakers} onChange={(e) => setForm({ ...form, speakers: e.target.value })} rows={6} className={`${inputClass} resize-none font-mono text-xs`} /></div>
      <Button onClick={save} isLoading={loading}><Save className="h-4 w-4" />Guardar Paso 5</Button>
    </div>
  );
}

// ===== PASO 7: EXAMEN =====
function Step7Editor({ bookId, exam, questions: initial }: { bookId: string; exam: Step7Exam | null; questions: Step7Question[] }) {
  const [examForm, setExamForm] = useState({
    title: exam?.title ?? "Examen Final",
    description: exam?.description ?? "",
    passing_score: String(exam?.passing_score ?? 70),
    time_limit_minutes: String(exam?.time_limit_minutes ?? ""),
  });
  const [questions, setQuestions] = useState(initial.map((q) => ({
    ...q,
    options_text: JSON.stringify(q.options, null, 2),
    _dirty: false,
  })));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        exam_id: exam?.id ?? "",
        question_text: "",
        question_type: "multiple_choice" as const,
        options: [],
        options_text: '[{"id":"a","text":"","is_correct":false},{"id":"b","text":"","is_correct":true},{"id":"c","text":"","is_correct":false},{"id":"d","text":"","is_correct":false}]',
        explanation: "",
        sort_order: prev.length + 1,
        _dirty: true,
      },
    ]);
  }

  function updateQuestion(index: number, field: string, value: any) {
    setQuestions((prev) => prev.map((q, i) => i === index ? { ...q, [field]: value, _dirty: true } : q));
  }

  async function removeQuestion(index: number) {
    const q = questions[index];
    if (!q.id.startsWith("new-") && exam?.id) {
      const supabase = createClient();
      await supabase.from("step7_questions").delete().eq("id", q.id);
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveAll() {
    setLoading(true);
    const supabase = createClient();

    // Guardar/crear examen
    let examId = exam?.id;
    const examPayload = {
      book_id: bookId,
      title: examForm.title,
      description: examForm.description || null,
      passing_score: Number(examForm.passing_score),
      time_limit_minutes: Number(examForm.time_limit_minutes) || null,
      total_questions: questions.length,
    };

    if (examId) {
      await supabase.from("step7_exams").update(examPayload).eq("id", examId);
    } else {
      const { data } = await supabase.from("step7_exams").insert(examPayload).select("id").single();
      examId = data?.id;
    }

    if (!examId) { setLoading(false); return; }

    // Guardar preguntas
    for (const q of questions) {
      if (!q._dirty) continue;
      let options;
      try { options = JSON.parse(q.options_text); } catch { continue; }

      const payload = {
        exam_id: examId,
        question_text: q.question_text,
        question_type: q.question_type,
        options,
        explanation: q.explanation || null,
        sort_order: q.sort_order,
      };

      if (q.id.startsWith("new-")) {
        await supabase.from("step7_questions").insert(payload);
      } else {
        await supabase.from("step7_questions").update(payload).eq("id", q.id);
      }
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className={sectionClass}>
      <h3 className="text-sm font-semibold text-text-primary">Paso 7: Examen + Certificado</h3>

      {/* Config examen */}
      <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-4 space-y-3">
        <p className="text-xs text-accent-primary font-medium">Configuracion del examen</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Titulo</label><input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Puntaje minimo (%)</label><input type="number" value={examForm.passing_score} onChange={(e) => setExamForm({ ...examForm, passing_score: e.target.value })} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Descripcion</label><textarea value={examForm.description} onChange={(e) => setExamForm({ ...examForm, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
      </div>

      {/* Preguntas */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{questions.length} preguntas</p>
        <Button variant="secondary" size="sm" onClick={addQuestion}><Plus className="h-3.5 w-3.5" />Agregar pregunta</Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-xl bg-white/[0.02] border border-border-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-accent-primary font-bold">Pregunta {i + 1}</span>
              <button onClick={() => removeQuestion(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div><label className={labelClass}>Pregunta *</label><textarea value={q.question_text} onChange={(e) => updateQuestion(i, "question_text", e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
            <div><label className={labelClass}>Opciones (JSON)</label><textarea value={q.options_text} onChange={(e) => updateQuestion(i, "options_text", e.target.value)} rows={5} className={`${inputClass} resize-none font-mono text-xs`} /></div>
            <div><label className={labelClass}>Explicacion</label><textarea value={q.explanation ?? ""} onChange={(e) => updateQuestion(i, "explanation", e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
          </div>
        ))}
      </div>

      <Button onClick={saveAll} isLoading={loading}><Save className="h-4 w-4" />Guardar Examen</Button>
    </div>
  );
}
